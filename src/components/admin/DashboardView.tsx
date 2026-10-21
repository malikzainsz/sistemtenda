import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatIndonesianDate, getCategoryLabel } from '../../utils/formatters';
import { ShoppingBag, DollarSign, Calendar, Star, ArrowUpRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../../types';

export const DashboardView: React.FC<{ onNewOrderClick: () => void }> = ({ onNewOrderClick }) => {
  const {
    orders,
    monthlyOrderCount,
    monthlyRevenue,
    weeklyEventsCount,
    averageRating,
    unitAvailability,
    reviews,
    updateOrderStatus,
    setActiveAdminTab
  } = useApp();

  const recentOrders = orders.slice(0, 5);
  const recentReviews = reviews.slice(0, 3);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Dikonfirmasi':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Menunggu':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Berlangsung':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Selesai':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Dibatalkan':
        return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 4 KPI Stat Cards (Matching Panel 1 of Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Pesanan Bulan Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pesanan Bulan Ini</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {String(monthlyOrderCount).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {orders.filter(o => o.status === 'Menunggu').length} perlu konfirmasi
            </div>
          </div>
        </div>

        {/* Card 2: Pendapatan Bulan Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pendapatan Bulan Ini</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums truncate">
              {formatRupiah(monthlyRevenue)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Termasuk DP & Pelunasan
            </div>
          </div>
        </div>

        {/* Card 3: Acara Minggu Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Acara Minggu Ini</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {String(weeklyEventsCount).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Jadwal instalasi kru aktif
            </div>
          </div>
        </div>

        {/* Card 4: Rating Rata-rata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Rating Rata-rata</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums flex items-baseline gap-1">
              <span>{averageRating}</span>
              <span className="text-sm font-normal text-slate-400">/ 5</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Dari ulasan pelanggan nyata
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Pesanan Terbaru (Left) & Ketersediaan + Evaluasi (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pesanan Terbaru Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pesanan Terbaru
                </h3>
                <span className="text-xs text-slate-500">
                  Daftar reservasi sewa tenda, plafon & sound system terkini
                </span>
              </div>
              <button
                onClick={() => setActiveAdminTab('orders')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Kode</th>
                    <th className="py-2.5 px-3 font-semibold">Pelanggan</th>
                    <th className="py-2.5 px-3 font-semibold">Layanan</th>
                    <th className="py-2.5 px-3 font-semibold">Tgl Acara</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {ord.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {ord.items.map(i => i.serviceName.replace('Sewa ', '')).join(' + ')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {formatIndonesianDate(ord.eventDate)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {ord.status === 'Menunggu' ? (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Dikonfirmasi')}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Konfirmasi
                          </button>
                        ) : ord.status === 'Dikonfirmasi' ? (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Selesai')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Selesai
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Rampung</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan {recentOrders.length} dari {orders.length} total pesanan</span>
            <button
              onClick={onNewOrderClick}
              className="text-amber-600 font-semibold hover:underline"
            >
              + Tambah Pesanan Manual
            </button>
          </div>
        </div>

        {/* Right Column: Ketersediaan Unit + Evaluasi Terbaru */}
        <div className="space-y-6">
          
          {/* Widget 1: Ketersediaan Unit (Matching Mockup) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Ketersediaan Unit
              </h3>
              <button
                onClick={() => setActiveAdminTab('schedule')}
                className="text-[11px] font-semibold text-amber-600 hover:underline"
              >
                Cek Kalender
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Tenda */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-800">Tenda Acara</span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {unitAvailability.tenda.available} / {unitAvailability.tenda.total} Unit Tersedia
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${unitAvailability.tenda.percentage}%` }}
                  />
                </div>
              </div>

              {/* Dekorasi Plafon */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-800">Dekorasi Plafon</span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {unitAvailability.plafon.available} / {unitAvailability.plafon.total} Set Tersedia
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${unitAvailability.plafon.percentage}%` }}
                  />
                </div>
              </div>

              {/* Sound System */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-800">Sound System</span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {unitAvailability.sound.available} / {unitAvailability.sound.total} Paket Tersedia
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${unitAvailability.sound.percentage}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Widget 2: Evaluasi Terbaru (Matching Mockup) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Evaluasi Terbaru
              </h3>
              <button
                onClick={() => setActiveAdminTab('reviews')}
                className="text-[11px] font-semibold text-amber-600 hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {recentReviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 line-clamp-2 italic">
                    "{rev.comment}"
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {rev.createdAt} · {rev.serviceCategory}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
