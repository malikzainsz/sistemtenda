import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatIndonesianDate } from '../../utils/formatters';
import { Order, PaymentStatus } from '../../types';
import { CheckCircle, Clock, AlertCircle, Eye, X, Check, DollarSign } from 'lucide-react';

export const PaymentsManagerView: React.FC = () => {
  const { orders, updatePaymentStatus } = useApp();
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);

  const pendingVerification = orders.filter(o => o.paymentStatus === 'Menunggu Verifikasi DP');
  const allPaidOrders = orders.filter(o => o.paymentStatus !== 'Belum Bayar');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner: Verification Alert */}
      {pendingVerification.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Ada {pendingVerification.length} Bukti Transfer Menunggu Verifikasi
              </h4>
              <p className="text-xs text-slate-600">
                Pelanggan telah mengunggah bukti pembayaran DP. Harap periksa mutasi rekening dan setujui untuk mengunci unit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Buku Kas & Verifikasi Pembayaran
            </h3>
            <span className="text-xs text-slate-500">
              Pantau status DP, sisa pelunasan, dan arsip bukti mutasi bank
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rekening Tujuan:</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
              BCA 884-019-2819
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Kode Pesanan</th>
                <th className="py-3 px-4 font-semibold">Pelanggan</th>
                <th className="py-3 px-4 font-semibold">Total Tagihan</th>
                <th className="py-3 px-4 font-semibold">DP Wajib (50%)</th>
                <th className="py-3 px-4 font-semibold">Sisa Pelunasan</th>
                <th className="py-3 px-4 font-semibold">Status Bayar</th>
                <th className="py-3 px-4 font-semibold">Bukti Struk</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {ord.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{ord.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                    {formatRupiah(ord.totalPrice)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-600 tabular-nums">
                    {formatRupiah(ord.dpAmount)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                    {formatRupiah(ord.remainingAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      ord.paymentStatus === 'Lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.paymentStatus === 'DP Terverifikasi'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.paymentStatus === 'Menunggu Verifikasi DP'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {ord.paymentProofUrl ? (
                      <button
                        onClick={() => setSelectedProofOrder(ord)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded-md"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat Struk</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Belum diunggah</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ord.paymentStatus === 'Menunggu Verifikasi DP' && (
                        <button
                          onClick={() => updatePaymentStatus(ord.id, 'DP Terverifikasi')}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Setujui DP</span>
                        </button>
                      )}

                      {ord.paymentStatus === 'DP Terverifikasi' && (
                        <button
                          onClick={() => updatePaymentStatus(ord.id, 'Lunas')}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Tandai Lunas</span>
                        </button>
                      )}

                      {ord.paymentStatus === 'Lunas' && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Lunas Penuh</span>
                        </span>
                      )}

                      {ord.paymentStatus === 'Belum Bayar' && (
                        <button
                          onClick={() => updatePaymentStatus(ord.id, 'DP Terverifikasi')}
                          className="px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded"
                        >
                          Set DP Manual
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Viewer Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-mono">Verifikasi Bukti Transfer</span>
                <h4 className="text-sm font-bold text-white">{selectedProofOrder.id} - {selectedProofOrder.customerName}</h4>
              </div>
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedProofOrder.paymentProofUrl}
                  alt="Bukti Transfer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs space-y-1 p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah DP Wajib:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatRupiah(selectedProofOrder.dpAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Pesanan:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatRupiah(selectedProofOrder.totalPrice)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    updatePaymentStatus(selectedProofOrder.id, 'DP Terverifikasi');
                    setSelectedProofOrder(null);
                  }}
                  className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  ✓ Setujui DP
                </button>
                <button
                  onClick={() => {
                    updatePaymentStatus(selectedProofOrder.id, 'Belum Bayar');
                    setSelectedProofOrder(null);
                  }}
                  className="py-2 px-3 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl"
                >
                  Minta Unggah Ulang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
