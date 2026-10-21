import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatIndonesianDate, getCategoryLabel } from '../../utils/formatters';
import { Search, Filter, Printer, Eye, CheckCircle, Clock, XCircle, FileText, X } from 'lucide-react';

export const OrdersManagerView: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari kode pesanan, nama pelanggan, atau nomor WA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl">
          {(['all', 'Menunggu', 'Dikonfirmasi', 'Berlangsung', 'Selesai', 'Dibatalkan'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Kode</th>
                <th className="py-3 px-4 font-semibold">Pelanggan</th>
                <th className="py-3 px-4 font-semibold">Layanan & Durasi</th>
                <th className="py-3 px-4 font-semibold">Tgl Acara</th>
                <th className="py-3 px-4 font-semibold">Total Biaya</th>
                <th className="py-3 px-4 font-semibold">Status Sewa</th>
                <th className="py-3 px-4 font-semibold">Status Bayar</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {ord.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{ord.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{ord.items.map(i => i.serviceName.replace('Sewa ', '')).join(', ')}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ord.durationDays} hari sewa</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {formatIndonesianDate(ord.eventDate)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                    {formatRupiah(ord.totalPrice)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                      ord.status === 'Dikonfirmasi'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : ord.status === 'Menunggu'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : ord.status === 'Selesai'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      ord.paymentStatus === 'Lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.paymentStatus === 'DP Terverifikasi'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Lihat Detail & Nota"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {ord.status === 'Menunggu' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Dikonfirmasi')}
                          className="px-2 py-1 text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-md shadow-sm transition-colors"
                        >
                          Konfirmasi
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada pesanan yang sesuai dengan filter atau kata kunci.
          </div>
        )}
      </div>

      {/* Detail / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-mono">Invoice Rincian Sewa</span>
                <h3 className="text-lg font-bold text-white">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block">Nama Pemesan:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</span>
                  <div className="text-slate-500 font-mono mt-0.5">{selectedOrder.customerPhone}</div>
                  <div className="text-slate-500">{selectedOrder.customerEmail}</div>
                </div>
                <div>
                  <span className="text-slate-400 block">Tanggal Acara:</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">
                    {formatIndonesianDate(selectedOrder.eventDate)} ({selectedOrder.durationDays} hari)
                  </span>
                  <span className="text-slate-400 block mt-2">Lokasi / Venue:</span>
                  <span className="text-slate-700">{selectedOrder.eventLocation}</span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="font-bold text-slate-900 block mb-2">Item Layanan yang Disewa:</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="p-2.5">Layanan</th>
                        <th className="p-2.5">Kategori</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-semibold text-slate-800">{it.serviceName}</td>
                          <td className="p-2.5 text-slate-500">{getCategoryLabel(it.category)}</td>
                          <td className="p-2.5 text-right font-mono font-bold">{formatRupiah(it.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Controls */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ubah Status Pemesanan:
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newSt = e.target.value as OrderStatus;
                      updateOrderStatus(selectedOrder.id, newSt);
                      setSelectedOrder({ ...selectedOrder, status: newSt });
                    }}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ubah Status Pembayaran:
                  </label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => {
                      const newSt = e.target.value as any;
                      updatePaymentStatus(selectedOrder.id, newSt);
                      setSelectedOrder({ ...selectedOrder, paymentStatus: newSt });
                    }}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Belum Bayar">Belum Bayar</option>
                    <option value="Menunggu Verifikasi DP">Menunggu Verifikasi DP</option>
                    <option value="DP Terverifikasi">DP Terverifikasi</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Tagihan:</span>
                  <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                    {formatRupiah(selectedOrder.totalPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Invoice</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
