'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  Search, 
  Mail, 
  Phone, 
  MessageSquare,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

type Lead = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  group_size: number | null;
  budget_range: string | null;
  preferred_team: string | null;
  needs_hotel: boolean;
  needs_flights: boolean;
  corporate_gift: boolean;
  message: string | null;
  status: string;
  created_at: string;
  event: {
    id: string;
    circuit_name: string;
    country: string;
    series: string;
  } | null;
};

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const statuses = ['all', 'new', 'contacted', 'converted', 'lost'];

  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select(`
            *,
            event:events(id, circuit_name, country, series)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLeads(data as any || []);
        setFilteredLeads(data as any || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((lead) => lead.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.event?.circuit_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLeads(filtered);
  }, [selectedStatus, searchQuery, leads]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      // Update local state
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading text-white mb-2">Leads Management</h1>
        <p className="text-white/60">Manage concierge requests from customers</p>
      </div>

      {/* Filters */}
      <div className="card-luxury">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, email, or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury w-full pl-12"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-white/60">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-semibold">Filter by Status:</span>
            </div>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  selectedStatus === status
                    ? 'bg-gold text-background'
                    : 'bg-surface-light border border-gold/20 text-white hover:border-gold/40'
                }`}
              >
                {status === 'all' ? 'All Leads' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-white/60 text-sm">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>

      {/* Leads Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => setSelectedLead(lead)}
            className="card-luxury cursor-pointer hover:border-gold/40 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-heading text-white mb-1">{lead.full_name}</h3>
                <p className="text-white/40 text-sm">{lead.email}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            {lead.event && (
              <div className="flex items-center gap-2 mb-3 text-sm">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-white">{lead.event.circuit_name}</span>
                <span className="text-white/40">• {lead.event.country}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              {lead.budget_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gold" />
                  <span className="text-white/80">{lead.budget_range}</span>
                </div>
              )}
              {lead.group_size && (
                <div className="flex items-center gap-2">
                  <span className="text-white/80">{lead.group_size} guests</span>
                </div>
              )}
              {lead.whatsapp && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold" />
                  <span className="text-white/80 text-xs">{lead.whatsapp}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="text-white/60 text-xs">{formatDate(lead.created_at)}</span>
              </div>
            </div>

            {(lead.needs_hotel || lead.needs_flights || lead.corporate_gift) && (
              <div className="mt-3 pt-3 border-t border-gold/10 flex flex-wrap gap-2">
                {lead.needs_hotel && (
                  <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold">Hotel</span>
                )}
                {lead.needs_flights && (
                  <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold">Flights</span>
                )}
                {lead.corporate_gift && (
                  <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold">Corporate</span>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="col-span-2 card-luxury text-center py-12">
            <p className="text-white/60">No leads match your filters</p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={updateLeadStatus}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-race-red/10 text-race-red border-race-red/30',
    contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    converted: 'bg-green-500/10 text-green-400 border-green-500/30',
    lost: 'bg-white/10 text-white/40 border-white/20',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors.new}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function LeadDetailModal({
  lead,
  onClose,
  onUpdateStatus,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="card-luxury max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-heading text-white mb-2">{lead.full_name}</h2>
            <p className="text-white/60">{lead.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold" />
              <div>
                <div className="text-white/40 text-xs">Email</div>
                <div className="text-white">{lead.email}</div>
              </div>
            </div>
            {lead.whatsapp && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <div>
                  <div className="text-white/40 text-xs">WhatsApp</div>
                  <div className="text-white">{lead.whatsapp}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        {lead.event && (
          <div className="mb-6 p-4 bg-surface-light rounded-lg">
            <h3 className="text-gold font-semibold mb-2">Event Details</h3>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4" />
              <span>{lead.event.circuit_name}, {lead.event.country}</span>
            </div>
            <div className="text-white/60 text-sm mt-1">{lead.event.series}</div>
          </div>
        )}

        {/* Request Details */}
        <div className="space-y-3 mb-6">
          <h3 className="text-gold font-semibold">Request Details</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {lead.group_size && (
              <div>
                <span className="text-white/40">Group Size:</span>
                <span className="text-white ml-2">{lead.group_size} guests</span>
              </div>
            )}
            {lead.budget_range && (
              <div>
                <span className="text-white/40">Budget:</span>
                <span className="text-white ml-2">{lead.budget_range}</span>
              </div>
            )}
            {lead.preferred_team && (
              <div>
                <span className="text-white/40">Preferred Team:</span>
                <span className="text-white ml-2">{lead.preferred_team}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Services */}
        {(lead.needs_hotel || lead.needs_flights || lead.corporate_gift) && (
          <div className="mb-6">
            <h3 className="text-gold font-semibold mb-3">Additional Services</h3>
            <div className="flex flex-wrap gap-2">
              {lead.needs_hotel && (
                <span className="px-3 py-1 rounded bg-gold/10 text-gold text-sm">Hotel Required</span>
              )}
              {lead.needs_flights && (
                <span className="px-3 py-1 rounded bg-gold/10 text-gold text-sm">Flights Required</span>
              )}
              {lead.corporate_gift && (
                <span className="px-3 py-1 rounded bg-gold/10 text-gold text-sm">Corporate Gift</span>
              )}
            </div>
          </div>
        )}

        {/* Message */}
        {lead.message && (
          <div className="mb-6">
            <h3 className="text-gold font-semibold mb-2">Message</h3>
            <p className="text-white/80 text-sm bg-surface-light p-4 rounded-lg">{lead.message}</p>
          </div>
        )}

        {/* Status Update */}
        <div className="mb-6">
          <h3 className="text-gold font-semibold mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {['new', 'contacted', 'converted', 'lost'].map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(lead.id, status)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  lead.status === status
                    ? 'bg-gold text-background'
                    : 'bg-surface-light border border-gold/20 text-white hover:border-gold/40'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={`mailto:${lead.email}`}
            className="btn-secondary flex-1 text-center"
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Send Email
          </a>
          {lead.whatsapp && (
            <a
              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-center"
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
