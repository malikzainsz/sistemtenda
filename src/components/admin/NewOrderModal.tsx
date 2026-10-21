import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { X, User, Phone, MapPin, Calendar, Check, ArrowRight } from 'lucide-react';

export const NewOrderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { services, addOrder, checkAvailability, showToast } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(1);
  const [eventLocation, setEventLocation] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([services[0]?.id || '']);
  const [notes, setNotes] = useState('');
  const [isDirectPaid, setIsDirectPaid] = useState(false);

  if (!isOpen) return null;

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length === 1) return;
      setSelectedServiceIds(prev => prev.filter(sId => sId !== id));
    } else {
      setSelectedServiceIds(prev => [...prev, id]);
    }
  };

  const subtotal = selectedServiceIds.reduce((sum, sId) => {
    const srv = services.find(s => s.id === sId);
    return sum + (srv ? srv.pricePerDay * durationDays : 0);
  }, 0);

  const discount = selectedServiceIds.length >= 2 ? Math.round(subtotal * 0.1) : 0;
  const totalPrice = subtotal - discount;
  const dpAmount = Math.round(totalPrice * 0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventLocation) {
      showToast('Harap lengkapi nama, nomor telepon, dan lokasi acara!');
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

    const newId = addOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      eventDate,
      endDate: endDateStr,
      durationDays,
      eventLocation,
      notes: notes || 'Pesanan diinput manual oleh Admin',
      items: orderItems,
      totalPrice,
      dpAmount,
      remainingAmount: isDirectPaid ? 0 : totalPrice - dpAmount,
      status: 'Dikonfirmasi',
      paymentStatus: isDirectPaid ? 'Lunas' : 'DP Terverifikasi',
    });

    showToast(`Pesanan manual ${newId} berhasil ditambahkan dan langsung dikonfirmasi!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 font-mono">Input Manual (Admin)</span>
            <h3 className="text-lg font-bold text-white">+ Pesanan Baru (Walk-in / WhatsApp)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pelanggan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rahmat Hidayat"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 0812XXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Acara / Lokasi Venue</label>
            <input
              type="text"
              required
              placeholder="Contoh: Rumah / Gedung Serbaguna, Jakarta Timur"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Dates & duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai Acara</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Durasi Sewa (Hari)</label>
              <input
                type="number"
                min="1"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Service items selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Pilih Layanan / Peralatan:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map(srv => {
                const isSelected = selectedServiceIds.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                      isSelected ? 'border-amber-500 bg-amber-50/60 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span>{srv.name}</span>
                    <span className="font-mono text-slate-500">{formatRupiah(srv.pricePerDay)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Contoh: Klien minta pasang pagi, pembayaran tunai di kantor"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Payment Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Status Pembayaran Langsung</span>
              <span className="text-[10px] text-slate-500">Centang jika klien sudah melunasi tunai saat booking</span>
            </div>
            <input
              type="checkbox"
              checked={isDirectPaid}
              onChange={(e) => setIsDirectPaid(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
            />
          </div>

          {/* Total & Action */}
          <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Kontrak:</span>
              <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Simpan Pesanan
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
