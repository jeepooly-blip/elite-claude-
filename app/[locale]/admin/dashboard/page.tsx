'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  ArrowUpRight,
  Clock,
  MapPin
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

type Lead = {
  id: string;
  full_name: string;
  email: string;
  budget_range: string | null;
  status: string;
  created_at: string;
  event: {
    circuit_name: string;
    country: string;
  } | null;
};

type Stats = {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  converted: number;
};

export default function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch leads stats
        const { data: allLeads } = await supabase.from('leads').select('status');
        
        if (allLeads) {
          const newStats = {
            totalLeads: allLeads.length,
            newLeads: allLeads.filter(l => l.status === 'new').length,
            contacted: allLeads.filter(l => l.status === 'contacted').length,
            converted: allLeads.filter(l => l.status === 'converted').length,
          };
          setStats(newStats);
        }

        // Fetch recent leads
        const { data: recent } = await supabase
          .from('leads')
          .select(`
            id,
            full_name,
            email,
            budget_range,
            status,
            created_at,
            event:events(circuit_name, country)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (recent) {
          setRecentLeads(recent as any);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      change: '+12% from last month',
      color: 'text-gold',
    },
    {
      title: 'New Requests',
      value: stats.newLeads,
      icon: Clock,
      change: 'Awaiting response',
      color: 'text-race-red',
    },
    {
      title: 'In Progress',
      value: stats.contacted,
      icon: TrendingUp,
      change: 'Being handled',
      color: 'text-blue-400',
    },
    {
      title: 'Converted',
      value: stats.converted,
      icon: DollarSign,
      change: '+8% conversion rate',
      color: 'text-green-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading text-white mb-2">Concierge Dashboard</h1>
        <p className="text-white/60">Manage racing hospitality leads and inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card-luxury">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm">{stat.title}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-heading text-white mb-2">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href={`/${locale}/admin/leads?status=new`} className="card-luxury hover:border-gold/40 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading text-white">New Leads</h3>
            <ArrowUpRight className="w-5 h-5 text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <p className="text-white/60 text-sm">Review {stats.newLeads} new concierge requests</p>
        </Link>

        <Link href={`/${locale}/admin/inventory`} className="card-luxury hover:border-gold/40 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading text-white">Update Inventory</h3>
            <ArrowUpRight className="w-5 h-5 text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <p className="text-white/60 text-sm">Manage package availability</p>
        </Link>

        <Link href={`/${locale}/races`} className="card-luxury hover:border-gold/40 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading text-white">View Public Site</h3>
            <ArrowUpRight className="w-5 h-5 text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <p className="text-white/60 text-sm">See customer experience</p>
        </Link>
      </div>

      {/* Recent Leads */}
      <div className="card-luxury">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading text-white">Recent Leads</h2>
          <Link 
            href={`/${locale}/admin/leads`}
            className="text-gold hover:text-gold-light text-sm font-semibold flex items-center gap-2"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">Event</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">Budget</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="border-b border-gold/5 hover:bg-surface-light transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/${locale}/admin/leads/${lead.id}`}
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-white font-medium">{lead.full_name}</div>
                      <div className="text-white/40 text-xs">{lead.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {lead.event ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold" />
                        <div>
                          <div className="text-white text-sm">{lead.event.circuit_name}</div>
                          <div className="text-white/40 text-xs">{lead.event.country}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/40 text-sm">No event selected</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gold text-sm font-semibold">
                      {lead.budget_range || 'Not specified'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/60 text-sm">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentLeads.length === 0 && (
            <div className="text-center py-12 text-white/40">
              No leads yet. They'll appear here as customers submit requests.
            </div>
          )}
        </div>
      </div>
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
