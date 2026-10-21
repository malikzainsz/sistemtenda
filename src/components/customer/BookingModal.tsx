import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, ServiceCategory } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { X, Calendar, MapPin, User, Phone, Mail, Check, ShieldCheck, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    showBookingModal,
    setShowBookingModal,
    selectedServiceForBooking,
    services,
    addOrder,
    checkAvailability,
    setActiveCustomerTab,
    setActiveTrackingOrderId,
    showToast
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(1);
  const [eventLocation, setEventLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Selected services list (can add multiple)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [dpPercentage, setDpPercentage] = useState<number>(50);

  // Initialize selected service
  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedServiceIds([selectedServiceForBooking.id]);
    } else if (services.length > 0 && selectedServiceIds.length === 0) {
      setSelectedServiceIds([services[0].id]);
    }
  }, [selectedServiceForBooking, services]);

  if (!showBookingModal) return null;

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length === 1) return;
      setSelectedServiceIds(prev => prev.filter(sId => sId !== id));
    } else {
      setSelectedServiceIds(prev => [...prev, id]);
    }
  };

  // Calculate pricing
  const subtotal = selectedServiceIds.reduce((sum, sId) => {
    const srv = services.find(s => s.id === sId);
    return sum + (srv ? srv.pricePerDay * durationDays : 0);
  }, 0);

  const discount = selectedServiceIds.length >= 2 ? Math.round(subtotal * 0.1) : 0;
  const totalPrice = subtotal - discount;
  const dpAmount = Math.round(totalPrice * (dpPercentage / 100));
  const remainingAmount = totalPrice - dpAmount;

  // Check date conflict for selected services
  const availabilityChecks = selectedServiceIds.map(sId => {
    const srv = services.find(s => s.id === sId);
    if (!srv) return { srvName: '', available: true, remaining: 10 };
    const check = checkAvailability(srv.category, eventDate);
    return {
      srvName: srv.name,
      available: check.available,
      remaining: check.remaining,
    };
  });

  const hasConflict = availabilityChecks.some(c => !c.available);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventLocation) {
      showToast('Harap lengkapi semua data wajib!');
      return;
    }

    if (hasConflict) {
      showToast('Salah satu unit yang dipilih sudah penuh pada tanggal tersebut!');
      return;
    }

    const endDateObj = new Date(eventDate);
    endDateObj.setDate(endDateObj.getDate() + (durationDays - 1));
    const endDateStr = endDateObj.toISOString().split('T')[0];

    const orderItems = selectedServiceIds.map(sId => {
      const srv = services.find(s => s.id === sId)!;
      return {
        serviceId: srv.id,
        serviceName: srv.name,
        category: srv.category,
        quantity: 1,
        price: srv.pricePerDay * durationDays,
      };
    });

    const newOrderId = addOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      eventDate,
      endDate: endDateStr,
      durationDays,
      eventLocation,
      notes,
      items: orderItems,
      totalPrice,
      dpAmount,
      remainingAmount,
      status: 'Menunggu',
      paymentStatus: 'Belum Bayar',
    });

    setShowBookingModal(false);
    setActiveCustomerTab('track');
    setActiveTrackingOrderId(newOrderId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              SP
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Formulir Pemesanan & Kalkulator Sewa
              </h3>
              <p className="text-xs text-slate-400">
                Pilih layanan, cek ketersediaan otomatis, dan dapatkan estimasi rincian biaya.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBookingModal(false)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Step 1: Pilih Layanan (Multi-select) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              1. Pilih Layanan / Paket Sewa
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map(service => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center text-white text-xs ${
                      isSelected ? 'bg-amber-500' : 'border border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {service.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        {formatRupiah(service.pricePerDay)} / hari
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Tanggal & Lokasi (With Anti-Bentrok Check) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Mulai Acara
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durasi Sewa (Hari)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-center"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">Hari</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Ketersediaan
              </label>
              <div className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                hasConflict
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {hasConflict ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Unit Penuh di Tanggal Ini</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unit Siap (Bebas Bentrok)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Informasi Kontak & Venue */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pemesan / Penanggung Jawab
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hendra Wijaya"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP Aktif
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap Lokasi Acara (Venue)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Nama gedung, jalan, nomor rumah, RT/RW, kelurahan & kota"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Khusus (Warna Tema, Jadwal Pasang, dll)
              </label>
              <input
                type="text"
                placeholder="Contoh: Tema kain putih emas, mohon pasang H-1 jam 10 pagi"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Step 4: Rincian Biaya & Pilihan DP */}
          <div className="p-4 rounded-xl bg-slate-900 text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Subtotal Sewa ({durationDays} hari):</span>
              <span className="font-mono tabular-nums text-slate-200">{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
                <span>Diskon Paket Bundling (10%):</span>
                <span className="font-mono tabular-nums">- {formatRupiah(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-base font-bold text-amber-400 pt-2 border-t border-slate-800 mb-3">
              <span>Total Biaya Sewa:</span>
              <span className="font-mono tabular-nums text-xl">{formatRupiah(totalPrice)}</span>
            </div>

            {/* DP Selector */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Skema Pembayaran:</span>
                <button
                  type="button"
                  onClick={() => setDpPercentage(50)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    dpPercentage === 50 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  DP 50%
                </button>
                <button
                  type="button"
                  onClick={() => setDpPercentage(30)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    dpPercentage === 30 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  DP 30%
                </button>
              </div>

              <div className="text-right">
                <span className="text-slate-400 mr-2">Wajib DP Sekarang:</span>
                <span className="font-mono font-bold text-white text-sm tabular-nums">
                  {formatRupiah(dpAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={hasConflict}
              className="px-6 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Ajukan Pesanan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
