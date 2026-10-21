import React from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, ShieldCheck, Sparkles, Star, Users, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveCustomerTab, setShowBookingModal, setShowWorkflowModal } = useApp();

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_event_setup.jpg"
          alt="Dekorasi Tenda dan Acara Mewah SewaPro"
          className="w-full h-full object-cover object-center opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Informasi Sewa Tenda, Plafon & Sound Terpadu</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6" style={{ textWrap: 'balance' }}>
            Wujudkan Acara Istimewa dengan Tenda Elegan, Dekorasi Plafon & Tata Suara Sempurna
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            Layanan sewa profesional untuk pernikahan, hajatan adat, konser akustik, dan gala dinner perusahaan. Dilengkapi sistem reservasi anti-bentrok jadwal, verifikasi DP instan, dan jaminan teknisi standby.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setActiveCustomerTab('catalog');
                const catalogElem = document.getElementById('catalog-section');
                if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <span>Pilih Layanan & Cek Jadwal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowWorkflowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all whitespace-nowrap shrink-0"
            >
              <span>Lihat Alur & Peta Modul</span>
            </button>
          </div>

        </div>

        {/* 4-Item Proof Metrics Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              500+
            </div>
            <div className="text-xs text-slate-400 mt-1">Acara Sukses Terlaksana</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums flex items-center gap-1.5">
              <span>4.9</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Kepuasan Pelanggan Nyata</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-400 mt-1">Jaminan Anti Jadwal Bentrok</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              3-in-1
            </div>
            <div className="text-xs text-slate-400 mt-1">Tenda · Plafon · Sound System</div>
          </div>
        </div>

      </div>
    </div>
  );
};
