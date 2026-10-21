import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatIndonesianDate, getCategoryLabel } from '../../utils/formatters';
import { BarChart3, Printer, Download, TrendingUp, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, monthlyRevenue, monthlyOrderCount, averageRating } = useApp();

  const totalCompleted = orders.filter(o => o.status === 'Selesai').length;
  const totalActive = orders.filter(o => o.status === 'Dikonfirmasi' || o.status === 'Berlangsung').length;
  const totalReceivables = orders.reduce((sum, o) => {
    if (o.status !== 'Dibatalkan' && o.paymentStatus !== 'Lunas') {
      return sum + o.remainingAmount;
    }
    return sum;
  }, 0);

  // Revenue by Category
  const categoryRevenue = {
    tenda: 0,
    plafon: 0,
    sound: 0,
    paket: 0
  };

  orders.forEach(o => {
    if (o.status !== 'Dibatalkan') {
      o.items.forEach(i => {
        if (categoryRevenue[i.category] !== undefined) {
          categoryRevenue[i.category] += i.price;
        }
      });
    }
  });

  const grandTotalBooking = orders.reduce((sum, o) => o.status !== 'Dibatalkan' ? sum + o.totalPrice : sum, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Laporan Rekapitulasi Bisnis & Keuangan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Periode: Oktober 2026 · Rekap transaksi sewa tenda, dekorasi plafon & sound system
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Nilai Transaksi
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatRupiah(grandTotalBooking)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Dari {orders.length} total kontrak sewa
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Kas Masuk (DP & Lunas)
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {formatRupiah(monthlyRevenue)}
          </div>
          <span className="text-[10px] text-emerald-700 mt-1 block font-medium">
            Telah terverifikasi di rekening
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Piutang Pelunasan
          </span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {formatRupiah(totalReceivables)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Jatuh tempo saat H-1 pasang tenda
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Tingkat Kepuasan Klien
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {averageRating} / 5.0
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {totalCompleted} acara terselesaikan dengan sukses
          </span>
        </div>

      </div>

      {/* Revenue by Category Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Kontribusi Pendapatan per Kategori Layanan
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Tenda Acara</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formatRupiah(categoryRevenue.tenda)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Dekorasi Plafon</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formatRupiah(categoryRevenue.plafon)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '48%' }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Sound System</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formatRupiah(categoryRevenue.sound)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: '52%' }} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Paket Komplit All-in</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formatRupiah(categoryRevenue.paket)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Transaction Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900">
            Daftar Rekap Transaksi Acara
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Kode</th>
                <th className="py-2.5 px-4 font-semibold">Pelanggan</th>
                <th className="py-2.5 px-4 font-semibold">Tgl Acara</th>
                <th className="py-2.5 px-4 font-semibold">Layanan</th>
                <th className="py-2.5 px-4 font-semibold text-right">Total Kontrak</th>
                <th className="py-2.5 px-4 font-semibold text-right">DP Masuk</th>
                <th className="py-2.5 px-4 font-semibold text-right">Sisa Tagihan</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {orders.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{ord.id}</td>
                  <td className="py-2.5 px-4 font-sans font-semibold text-slate-800">{ord.customerName}</td>
                  <td className="py-2.5 px-4 text-slate-600">{formatIndonesianDate(ord.eventDate)}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-600">
                    {ord.items.map(i => i.serviceName.replace('Sewa ', '')).join(', ')}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatRupiah(ord.totalPrice)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold tabular-nums">
                    {ord.paymentStatus !== 'Belum Bayar' ? formatRupiah(ord.dpAmount) : 'Rp 0'}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500 tabular-nums">
                    {ord.paymentStatus === 'Lunas' ? 'Rp 0' : formatRupiah(ord.remainingAmount)}
                  </td>
                  <td className="py-2.5 px-4 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
