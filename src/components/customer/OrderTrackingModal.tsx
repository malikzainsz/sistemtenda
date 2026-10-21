import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatIndonesianDate, getCategoryLabel } from '../../utils/formatters';
import { Search, CheckCircle, Clock, Upload, Printer, FileText, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    uploadPaymentProof,
    setActiveCustomerTab,
    showToast
  } = useApp();

  const [searchCode, setSearchCode] = useState(activeTrackingOrderId || 'ORD-001');
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [selectedFileSim, setSelectedFileSim] = useState<string | null>(null);

  const currentOrder = orders.find(o => o.id.toLowerCase() === (activeTrackingOrderId || searchCode).trim().toLowerCase()) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toLowerCase() === searchCode.trim().toLowerCase());
    if (found) {
      setActiveTrackingOrderId(found.id);
    } else {
      showToast(`Pesanan dengan kode "${searchCode}" tidak ditemukan`);
    }
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;
    const url = proofUrlInput || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80';
    uploadPaymentProof(currentOrder.id, url);
    setProofUrlInput('');
    setSelectedFileSim(null);
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Bar with Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => setActiveCustomerTab('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Lacak Pesanan & Pembayaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau status verifikasi DP, jadwal kru pemasangan, dan unduh nota invoice.
          </p>
        </div>

        {/* Search Order Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari Kode e.g. ORD-001"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            Lacak
          </button>
        </form>
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Card: Order Details & Status (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Status Progress Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Nomor Reservasi</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono">
                    {currentOrder.id}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                    currentOrder.status === 'Dikonfirmasi'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : currentOrder.status === 'Menunggu'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : currentOrder.status === 'Selesai'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    Status: {currentOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative flex items-center justify-between mb-2">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                
                {['Menunggu', 'Dikonfirmasi', 'Berlangsung', 'Selesai'].map((step, idx) => {
                  const stepIndex = ['Menunggu', 'Dikonfirmasi', 'Berlangsung', 'Selesai'].indexOf(currentOrder.status);
                  const isDone = idx <= stepIndex;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[11px] mt-2 font-medium whitespace-nowrap ${
                        isDone ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rincian Sewa & Lokasi */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Rincian Sewa & Tempat Acara</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
                <div>
                  <span className="text-slate-500 block">Nama Pemesan:</span>
                  <span className="font-semibold text-slate-900 text-sm">{currentOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Kontak WhatsApp:</span>
                  <span className="font-semibold text-slate-900 text-sm font-mono">{currentOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tanggal Acara:</span>
                  <span className="font-semibold text-slate-900 text-sm font-mono">
                    {formatIndonesianDate(currentOrder.eventDate)} ({currentOrder.durationDays} hari)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Alamat / Venue:</span>
                  <span className="font-semibold text-slate-900 text-sm">{currentOrder.eventLocation}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden mb-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Layanan / Item</th>
                      <th className="py-2.5 px-4 font-semibold">Kategori</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentOrder.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {it.serviceName}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {getCategoryLabel(it.category)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatRupiah(it.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action: Print Invoice */}
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors no-print"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Nota Pesanan</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Payment & Upload Bukti Transfer */}
          <div className="space-y-6">
            
            {/* Financial Summary */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  Status Pembayaran
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold ${
                  currentOrder.paymentStatus === 'Lunas'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : currentOrder.paymentStatus === 'DP Terverifikasi'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {currentOrder.paymentStatus}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Biaya Sewa:</span>
                  <span className="font-mono tabular-nums font-bold text-white">
                    {formatRupiah(currentOrder.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Down Payment (DP 50%):</span>
                  <span className="font-mono tabular-nums font-bold text-amber-300">
                    {formatRupiah(currentOrder.dpAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
                  <span>Sisa Pelunasan:</span>
                  <span className="font-mono tabular-nums font-bold text-slate-200">
                    {formatRupiah(currentOrder.remainingAmount)}
                  </span>
                </div>
              </div>

              {/* Rekening Tujuan Transfer */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <div className="text-[11px] text-slate-400 mb-1">Transfer Bank Rekening Resmi:</div>
                <div className="font-bold text-amber-300 font-mono text-sm">BCA: 884-019-2819</div>
                <div className="text-slate-300 text-[11px]">a.n. PT SewaPro Event Mandiri</div>
              </div>
            </div>

            {/* Upload Bukti Transfer */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Unggah Bukti Transfer</span>
              </h4>

              {currentOrder.paymentProofUrl ? (
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={currentOrder.paymentProofUrl}
                      alt="Bukti Transfer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Bukti transfer telah dikirim</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSimulateUpload} className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unggah foto struk transfer ATM, mobile banking, atau QRIS untuk verifikasi DP otomatis oleh tim admin.
                  </p>
                  
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-slate-700 block">
                      Klik untuk simulasi unggah foto struk
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      JPG, PNG, atau screenshot m-Banking
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 text-center"
                  >
                    Kirim Bukti Pembayaran
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
