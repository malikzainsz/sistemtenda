import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Send, User, MessageSquare, CheckCircle, ThumbsUp } from 'lucide-react';

export const ReviewSection: React.FC = () => {
  const { reviews, addReview, averageRating, showToast } = useApp();

  const [reviewerName, setReviewerName] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [categoryChoice, setCategoryChoice] = useState('Tenda & Plafon');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      showToast('Silakan masukkan nama Anda');
      return;
    }
    if (!commentText.trim()) {
      showToast('Silakan tulis ulasan atau pengalaman Anda');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addReview({
        customerName: reviewerName,
        rating: selectedRating,
        comment: commentText,
        serviceCategory: categoryChoice,
      });

      setReviewerName('');
      setCommentText('');
      setSelectedRating(5);
      setIsSubmitting(false);
    }, 400);
  };

  const approvedReviews = reviews.filter(r => r.isApproved);

  return (
    <section id="reviews-section" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Transparansi & Kepuasan
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Evaluasi Pelanggan
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Ulasan jujur dari keluarga dan perusahaan yang telah mempercayakan acara istimewa mereka kepada SewaPro.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Berdasarkan {approvedReviews.length} ulasan terverifikasi
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Review Cards Grid on Left, "Beri Penilaian" Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Review Cards Grid (2 cols on desktop) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                        {rev.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {rev.customerName}
                        </h4>
                        <span className="text-[11px] text-slate-500 block">
                          {rev.serviceCategory || 'Layanan Sewa'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Terverifikasi</span>
                  </span>
                  <span>{rev.createdAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: "Beri Penilaian" Form as shown in user mockup */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Beri Penilaian
                </h3>
              </div>

              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Pernah menggunakan jasa SewaPro? Bagikan pengalaman Anda untuk membantu calon pelanggan lain.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {/* Nama */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rina Melati"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Kategori Layanan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Layanan yang Disewa
                  </label>
                  <select
                    value={categoryChoice}
                    onChange={(e) => setCategoryChoice(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  >
                    <option value="Sewa Tenda">Sewa Tenda Acara</option>
                    <option value="Dekorasi Plafon">Dekorasi Plafon Pelaminan</option>
                    <option value="Sound System">Sound System & Operator</option>
                    <option value="Paket Komplit">Paket Komplit (All-in)</option>
                  </select>
                </div>

                {/* Rating 1-5 Star Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pilih Rating (1-5 Bintang)
                  </label>
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || selectedRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-auto text-xs font-bold text-slate-700 font-mono pr-1">
                      {selectedRating} / 5
                    </span>
                  </div>
                </div>

                {/* Textarea Ulasan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tulis Ulasan Anda
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan kepuasan Anda mengenai kualitas tenda, dekorasi plafon, atau kejernihan sound system..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                  />
                </div>

                {/* Submit Button (Amber color as in mockup) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-md transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Evaluasi'}</span>
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
