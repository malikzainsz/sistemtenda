import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, GalleryPhoto } from '../../types';
import { getCategoryLabel } from '../../utils/formatters';
import { MapPin, Calendar, X, Eye } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery } = useApp();
  const [filter, setFilter] = useState<'all' | ServiceCategory>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const filteredGallery = filter === 'all'
    ? gallery
    : gallery.filter(item => item.category === filter);

  return (
    <section id="gallery-section" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Dokumentasi Nyata
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri Acara
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Lihat portfolio pemasangan tenda, kemewahan kain plafon VIP, dan panggung tata suara yang telah kami kerjakan.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto self-start md:self-auto shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('tenda')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filter === 'tenda'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tenda
            </button>
            <button
              onClick={() => setFilter('plafon')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filter === 'plafon'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dekorasi Plafon
            </button>
            <button
              onClick={() => setFilter('sound')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filter === 'sound'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sound System
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative bg-slate-100 rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Gradient Scrim & Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  {getCategoryLabel(item.category)}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{item.location}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{item.eventDate}</span>
                  </span>
                </div>
              </div>

              {/* Quick eye icon on hover */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Belum ada dokumentasi untuk kategori ini.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">
                {getCategoryLabel(selectedPhoto.category)}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedPhoto.title}
              </h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {selectedPhoto.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedPhoto.location}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedPhoto.eventDate}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
