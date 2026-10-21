import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, getCategoryLabel } from '../../utils/formatters';
import { Check, Calendar, MapPin, User, Calculator, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { ServiceItem } from '../../types';

export const CatalogSection: React.FC = () => {
  const {
    services,
    setSelectedServiceForBooking,
    setShowBookingModal,
    addOrder,
    checkAvailability,
    showToast
  } = useApp();

  // Quick order form state as shown directly in Panel 2 of user image
  const [quickName, setQuickName] = useState('');
  const [quickDate, setQuickDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [quickDuration, setQuickDuration] = useState(1);
  const [quickLocation, setQuickLocation] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([services[0]?.id || 'srv-tenda-01']);

  const toggleSelectService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Calculate quick estimated total
  const estimatedTotal = selectedServices.reduce((sum, sId) => {
    const srv = services.find(s => s.id === sId);
    return sum + (srv ? srv.pricePerDay * quickDuration : 0);
  }, 0);

  // Apply bundle discount if more than 1 service selected
  const discount = selectedServices.length >= 2 ? estimatedTotal * 0.1 : 0;
  const finalTotal = estimatedTotal - discount;

  // Handle Quick Order submission
  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) {
      showToast('Silakan isi Nama Lengkap Anda');
      return;
    }
    if (!quickDate) {
      showToast('Silakan pilih Tanggal Acara');
      return;
    }
    if (!quickLocation.trim()) {
      showToast('Silakan isi Lokasi / Alamat Acara');
      return;
    }

    // Check availability
    for (const sId of selectedServices) {
      const srv = services.find(s => s.id === sId);
      if (srv) {
        const check = checkAvailability(srv.category, quickDate);
        if (!check.available) {
          showToast(`Maaf, unit untuk ${srv.name} sudah penuh pada tanggal tersebut!`);
          return;
        }
      }
    }

    // Build items
    const items = selectedServices.map(sId => {
      const srv = services.find(s => s.id === sId)!;
      return {
        serviceId: srv.id,
        serviceName: srv.name,
        category: srv.category,
        quantity: 1,
        price: srv.pricePerDay * quickDuration,
      };
    });

    const dp = Math.round(finalTotal * 0.5);

    const orderId = addOrder({
      customerName: quickName,
      customerPhone: quickPhone || '0812XXXXXXXX',
      customerEmail: `${quickName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      eventDate: quickDate,
      endDate: quickDate,
      durationDays: quickDuration,
      eventLocation: quickLocation,
      notes: 'Pesanan diajukan melalui formulir cepat katalog',
      items,
      totalPrice: finalTotal,
      dpAmount: dp,
      remainingAmount: finalTotal - dp,
      status: 'Menunggu',
      paymentStatus: 'Belum Bayar',
    });

    // Reset or show modal
    showToast(`Pesanan ${orderId} berhasil diajukan! Mengalihkan ke pembayaran...`);
    setQuickName('');
    setQuickLocation('');
  };

  return (
    <section id="catalog-section" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
            Pilihan Paket & Unit
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Katalog Layanan & Pemesanan
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Pilih kebutuhan acara Anda, kombinasikan untuk mendapatkan potongan harga spesial, dan pesan secara instan.
          </p>
        </div>

        {/* 3 Main Service Cards Grid (Matching Section 2 of Mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {services.slice(0, 3).map((service) => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <div
                key={service.id}
                className={`flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? 'border-amber-500 shadow-md ring-2 ring-amber-400/20'
                    : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 text-white backdrop-blur-sm">
                      {service.availableStock} Unit Siap
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Dipilih</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                    {getCategoryLabel(service.category)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {service.name}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                    {service.shortDescription}
                  </p>

                  {/* Feature bullet list */}
                  <div className="space-y-1.5 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {service.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-3 border-t border-slate-100 mb-4">
                    <div className="text-xs text-slate-500">Mulai dari</div>
                    <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {formatRupiah(service.pricePerDay)}
                      <span className="text-xs font-normal text-slate-500 font-sans ml-1">/ hari</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSelectService(service.id)}
                      className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 text-center ${
                        isSelected
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ Terpilih' : '+ Pilih Layanan'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedServiceForBooking(service);
                        setShowBookingModal(true);
                      }}
                      className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all whitespace-nowrap shrink-0 text-center"
                    >
                      Detail & Sewa
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* 4th Card: Featured Bundling Offer */}
        {services[3] && (
          <div className="mb-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-md mb-2">
                Paket Komplit Hemat
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {services[3].name}
              </h3>
              <p className="text-amber-100 text-sm mt-2 leading-relaxed">
                {services[3].shortDescription} Hemat hingga jutaan rupiah dengan garansi teknisi, operator sound, dan dekorasi panggung serasi!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-right sm:text-left">
                <span className="text-xs text-amber-200 block">Harga Spesial All-in</span>
                <span className="text-2xl font-black font-mono tabular-nums text-white">
                  {formatRupiah(services[3].pricePerDay)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedServiceForBooking(services[3]);
                  setShowBookingModal(true);
                }}
                className="px-6 py-3 bg-white text-slate-900 font-bold text-sm rounded-xl hover:bg-amber-50 shadow-md transition-all whitespace-nowrap shrink-0"
              >
                Pesan Paket Komplit
              </button>
            </div>
          </div>
        )}

        {/* Quick Booking Strip as shown in Panel 2 of user mockup */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-amber-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Formulir Cepat Sewa & Kalkulator Estimasi
            </h3>
            {discount > 0 && (
              <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Diskon Bundling 10% Aktif
              </span>
            )}
          </div>

          <form onSubmit={handleQuickOrderSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              
              {/* Nama */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Tanggal Acara */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tanggal Acara
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Lokasi Acara */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lokasi Acara (Venue / Alamat)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gedung / Rumah di Jakarta"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Estimasi Total & Submit */}
              <div className="flex flex-col justify-end">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Estimasi Total Biaya
                </label>
                <div className="px-3.5 py-2.5 bg-slate-900 text-amber-400 font-mono font-bold text-sm sm:text-base rounded-xl tabular-nums border border-slate-800 flex items-center justify-between">
                  <span>{formatRupiah(finalTotal)}</span>
                  <span className="text-[11px] text-slate-400 font-sans font-normal">
                    ({selectedServices.length} layanan)
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Row Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tanpa biaya tersembunyi · Minimal DP 50% setelah konfirmasi ketersediaan</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all whitespace-nowrap shrink-0"
                >
                  Kalkulator Detail & Add-on
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Ajukan Pesanan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};
