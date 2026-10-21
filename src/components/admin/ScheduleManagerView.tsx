import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndonesianDate, getCategoryLabel } from '../../utils/formatters';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ShieldCheck, AlertTriangle, Clock, MapPin, User } from 'lucide-react';
import { ServiceCategory } from '../../types';

export const ScheduleManagerView: React.FC = () => {
  const { orders, unitAvailability } = useApp();
  const [filterCategory, setFilterCategory] = useState<'all' | ServiceCategory>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');

  // Days of month generator for October 2026
  const year = 2026;
  const month = 9; // October (0-indexed)
  const daysInMonth = 31;
  const startDayOfWeek = 4; // Thursday Oct 1 2026

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get orders on a given day
  const getOrdersOnDay = (day: number) => {
    const dayStr = `2026-10-${String(day).padStart(2, '0')}`;
    return orders.filter(o => {
      if (o.status === 'Dibatalkan') return false;
      const matchesDate = o.eventDate <= dayStr && o.endDate >= dayStr;
      if (filterCategory === 'all') return matchesDate;
      return matchesDate && o.items.some(i => i.category === filterCategory || i.category === 'paket');
    });
  };

  const selectedDayOrders = orders.filter(o => {
    if (o.status === 'Dibatalkan') return false;
    return o.eventDate <= selectedDate && o.endDate >= selectedDate;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner: Anti-Conflict System Status */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistem Pencegahan Jadwal Bentrok (Conflict Prevention) Aktif</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Kalender Acara & Ketersediaan Unit Harian
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Algoritma otomatis memblokir pemesanan berlebih jika kuota unit tenda, plafon, atau sound system melebihi kapasitas operasional.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
          {(['all', 'tenda', 'plafon', 'sound'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Semua Unit' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Calendar Grid on Left, Day Schedule on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Month Calendar (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
              <h4 className="text-base font-bold text-slate-900">
                Oktober 2026
              </h4>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1"></span>
              <span>Ada Acara Terjadwal</span>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start padding */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-xl bg-slate-50/50" />
            ))}

            {daysArray.map(day => {
              const dayStr = `2026-10-${String(day).padStart(2, '0')}`;
              const dayOrders = getOrdersOnDay(day);
              const isSelected = selectedDate === dayStr;
              const hasEvents = dayOrders.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`aspect-square p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/30'
                      : hasEvents
                      ? 'border-slate-200 bg-white hover:border-amber-300'
                      : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-800' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>

                  {hasEvents && (
                    <div className="text-[10px] font-semibold text-slate-600 truncate bg-slate-100/90 px-1 rounded">
                      {dayOrders.length} acara
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Schedule & Conflicts for Selected Date */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wide">
              Detail Agenda Tanggal
            </span>
            <h4 className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {formatIndonesianDate(selectedDate)}
            </h4>
          </div>

          {/* Unit capacity on this date */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Kapasitas Hari Ini:</span>
            <div className="flex justify-between text-slate-600">
              <span>Tenda Acara:</span>
              <span className="font-mono font-bold text-slate-900">
                {unitAvailability.tenda.available} Unit Ready
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Dekorasi Plafon:</span>
              <span className="font-mono font-bold text-slate-900">
                {unitAvailability.plafon.available} Set Ready
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sound System:</span>
              <span className="font-mono font-bold text-slate-900">
                {unitAvailability.sound.available} Paket Ready
              </span>
            </div>
          </div>

          {/* Events List */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Daftar Pesanan ({selectedDayOrders.length}):
            </span>

            {selectedDayOrders.length > 0 ? (
              <div className="space-y-3">
                {selectedDayOrders.map(ord => (
                  <div key={ord.id} className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-600">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {ord.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ord.customerName}</span>
                    </div>

                    <div className="text-slate-500 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{ord.eventLocation}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 font-medium">
                      Item: {ord.items.map(i => i.serviceName).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Tidak ada acara terjadwal pada tanggal ini. Unit bebas disewa!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
