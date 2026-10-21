import React from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  ShoppingBag,
  Calendar,
  CreditCard,
  Image,
  Star,
  BarChart3,
  Globe,
  PlusCircle
} from 'lucide-react';

interface SidebarItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const AdminSidebar: React.FC<{ onNewOrderClick: () => void }> = ({ onNewOrderClick }) => {
  const { activeAdminTab, setActiveAdminTab, setUserRole, orders } = useApp();

  const pendingOrdersCount = orders.filter(o => o.status === 'Menunggu').length;
  const pendingPaymentsCount = orders.filter(o => o.paymentStatus === 'Menunggu Verifikasi DP').length;

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Data Pelanggan', icon: Users },
    { id: 'catalog', label: 'Katalog Layanan', icon: Layers },
    { id: 'orders', label: 'Pemesanan', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'schedule', label: 'Jadwal & Ketersediaan', icon: Calendar },
    { id: 'payments', label: 'Pembayaran', icon: CreditCard, badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined },
    { id: 'gallery', label: 'Galeri', icon: Image },
    { id: 'reviews', label: 'Evaluasi Pelanggan', icon: Star },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
            SP
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              SewaPro Admin
            </h1>
            <span className="text-[10px] text-amber-400 font-medium block">
              Sistem Manajemen Terpadu
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 py-3">
        <button
          onClick={onNewOrderClick}
          className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ Pesanan Baru</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveAdminTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Switch back to Customer Web */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setUserRole('customer')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>Ke Website Pelanggan</span>
        </button>
      </div>

    </aside>
  );
};
