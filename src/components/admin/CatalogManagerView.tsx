import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, getCategoryLabel } from '../../utils/formatters';
import { ServiceItem, ServiceCategory } from '../../types';
import { Plus, Edit2, Check, X, Layers, Image as ImageIcon } from 'lucide-react';

export const CatalogManagerView: React.FC = () => {
  const { services, updateService, addService } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // New Service Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('tenda');
  const [newPrice, setNewPrice] = useState(2000000);
  const [newStock, setNewStock] = useState(5);
  const [newDesc, setNewDesc] = useState('');

  const handleStartEdit = (srv: ServiceItem) => {
    setEditingId(srv.id);
    setEditPrice(srv.pricePerDay);
    setEditStock(srv.totalStock);
  };

  const handleSaveEdit = (srvId: string) => {
    updateService(srvId, {
      pricePerDay: editPrice,
      totalStock: editStock,
      availableStock: editStock,
    });
    setEditingId(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addService({
      name: newName,
      category: newCategory,
      shortDescription: newDesc || 'Layanan perlengkapan pesta berkualitas tinggi.',
      fullDescription: newDesc,
      pricePerDay: newPrice,
      unitLabel: 'Unit / Hari',
      totalStock: newStock,
      availableStock: newStock,
      features: ['Pemasangan oleh kru profesional', 'Bahan terawat dan bersih', 'Garansi unit siap pakai'],
      imageUrl: '/images/service_tenda_acara.jpg',
    });

    setShowAddModal(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Daftar Katalog Unit & Tarif Sewa
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola harga sewa harian, jumlah armada unit yang siap disewakan, dan deskripsi paket.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Layanan Baru</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(srv => {
          const isEditing = editingId === srv.id;
          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-slate-100">
                  <img
                    src={srv.imageUrl}
                    alt={srv.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {getCategoryLabel(srv.category)}
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {srv.shortDescription}
                  </p>

                  {/* Price & Stock Edit */}
                  {isEditing ? (
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3 mb-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Tarif Sewa (Rp / hari):
                        </label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Total Armada Unit:
                        </label>
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-md"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveEdit(srv.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-amber-600 rounded-md"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tarif Sewa Harian:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {formatRupiah(srv.pricePerDay)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Unit Armada:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {srv.totalStock} Unit
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Features tag */}
                  <div className="space-y-1 text-[11px] text-slate-600">
                    {srv.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {srv.availableStock} unit sedang ready
                </span>
                {!isEditing && (
                  <button
                    onClick={() => handleStartEdit(srv)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-amber-600 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ubah Tarif & Stok</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Tambah Layanan Baru</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Layanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paket Panggung Rigging & Lighting VIP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="tenda">Tenda Acara</option>
                    <option value="plafon">Dekorasi Plafon</option>
                    <option value="sound">Sound System</option>
                    <option value="paket">Paket Komplit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Unit</label>
                  <input
                    type="number"
                    min="1"
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tarif Sewa (Rp / hari)</label>
                <input
                  type="number"
                  step="50000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Rincian kelengkapan dan ukuran..."
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
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
