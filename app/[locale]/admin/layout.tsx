'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: `/${locale}/admin/dashboard`, icon: LayoutDashboard },
    { name: 'Leads', href: `/${locale}/admin/leads`, icon: Users },
    { name: 'Inventory', href: `/${locale}/admin/inventory`, icon: Package },
    { name: 'Settings', href: `/${locale}/admin/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-surface border-r border-gold/10 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gold/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
                <span className="text-lg font-heading text-gold">EA</span>
              </div>
              <div>
                <div className="font-heading text-white">EliteAccess</div>
                <div className="text-xs text-gold/70">Concierge Admin</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/30'
                      : 'text-white/60 hover:bg-surface-light hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gold/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-semibold text-sm">DU</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">Dubai Admin</div>
                <div className="text-white/40 text-xs">admin@eliteaccess.ae</div>
              </div>
            </div>
            <button className="flex items-center gap-2 text-white/60 hover:text-race-red transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-gold/10">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white p-2 hover:text-gold transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60">
                Dubai, UAE • {new Date().toLocaleDateString('en-GB', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
