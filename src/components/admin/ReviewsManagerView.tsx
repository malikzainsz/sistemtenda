import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, CheckCircle, EyeOff, Eye, MessageSquare, ThumbsUp } from 'lucide-react';

export const ReviewsManagerView: React.FC = () => {
  const { reviews, toggleReviewApproval, averageRating } = useApp();
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const filteredReviews = ratingFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === ratingFilter);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Moderasi Evaluasi & Ulasan Pelanggan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tinjau umpan balik pelanggan mengenai sewa tenda, dekorasi plafon, dan sound system untuk transparansi publik.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {averageRating}
          </div>
          <div>
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rata-rata {reviews.length} ulasan
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setRatingFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            ratingFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua ({reviews.length})
        </button>
        {[5, 4, 3, 2, 1].map(r => (
          <button
            key={r}
            onClick={() => setRatingFilter(r)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              ratingFilter === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{r} Bintang</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Pelanggan</th>
                <th className="py-3 px-4 font-semibold">Layanan</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Komentar / Ulasan</th>
                <th className="py-3 px-4 font-semibold">Tanggal</th>
                <th className="py-3 px-4 font-semibold">Status Tayang</th>
                <th className="py-3 px-4 font-semibold text-right">Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map(rev => (
                <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {rev.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {rev.serviceCategory}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs text-slate-700 italic">
                    "{rev.comment}"
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {rev.createdAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      rev.isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {rev.isApproved ? 'Dipublikasikan' : 'Disembunyikan'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleReviewApproval(rev.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                        rev.isApproved
                          ? 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {rev.isApproved ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Publikasikan</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
