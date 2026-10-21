import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCategoryLabel } from '../../utils/formatters';
import { ServiceCategory } from '../../types';
import { Plus, Trash2, Image, MapPin, Calendar, X } from 'lucide-react';

export const GalleryManagerView: React.FC = () => {
  const { gallery, addGalleryItem, deleteGalleryItem } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('tenda');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Oktober 2026');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_event_setup_1792526782776.jpg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addGalleryItem({
      title,
      category,
      imageUrl: imageUrl || '/src/assets/images/service_tenda_acara_1792526784809.jpg',
      location: location || 'Jakarta',
      eventDate: date,
      description: desc || 'Dokumentasi instalasi acara SewaPro.',
    });

    setShowAddModal(false);
    setTitle('');
    setLocation('');
    setDesc('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Kelola Galeri & Dokumentasi Acara
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah dan publikasikan foto portofolio pemasangan tenda, plafon VIP, dan sound system untuk dilihat pelanggan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Dokumentasi Baru</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  {getCategoryLabel(item.category)}
                </div>
                <button
                  onClick={() => deleteGalleryItem(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Hapus dari Galeri"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{item.location}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    <span>{item.eventDate}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <span className="text-[10px] text-emerald-700 font-semibold">
                ✓ Tayang di Web Pelanggan
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Tambah Foto Dokumentasi</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Acara / Portofolio</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Resepsi Pernikahan Kebayoran Baru"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="tenda">Tenda</option>
                    <option value="plafon">Dekorasi Plafon</option>
                    <option value="sound">Sound System</option>
                    <option value="paket">Paket All-in</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bulan & Tahun</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kota / Lokasi Venue</label>
                <input
                  type="text"
                  placeholder="Contoh: Menteng, Jakarta Pusat"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan detail kain, ukuran tenda, atau kapasitas sound..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-amber-500 hover:bg-amber-600 font-bold rounded-xl"
                >
                  Publikasikan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
