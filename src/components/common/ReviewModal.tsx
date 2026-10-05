import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StarRating } from './StarRating';
import { X, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  revieweeId: string;
  revieweeName: string;
  revieweeType: 'individual' | 'agency';
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  revieweeId,
  revieweeName,
  revieweeType
}) => {
  const { addReview, hospitals } = useData();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser ? currentUser.fullName : '');
  const [hospitalId, setHospitalId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.userType !== 'family' || !title || !comment || !reviewerName) return;

    const hospitalObj = hospitals.find(h => h.id === hospitalId);

    addReview({
      reviewerId: currentUser ? currentUser.id : `user-${Date.now()}`,
      reviewerName,
      revieweeId,
      revieweeType,
      rating,
      title,
      comment,
      hospitalName: hospitalObj ? hospitalObj.name : 'Hospital Care Sri Lanka',
      isVerified: true
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#b1f2ff] shadow-2xl p-6 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-cyan-100 text-[#3dcfff] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#172B25]">{t('reviewSubmittedSuccess')}</h3>
            <p className="text-sm text-[#64746D] mt-2">
              Thank you for helping other Sri Lankan families find trustworthy care.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#172B25]">
                {t('rateYourCaregiver')}: {revieweeName}
              </h3>
              <p className="text-xs text-[#64746D] mt-1">
                Share your experience assisting a patient at hospital or home.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1.5">
                  {t('ratingLabel')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 bg-[#d8f9ff] p-3 rounded-xl border border-[#b1f2ff]">
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onRatingChange={setRating}
                  />
                  <span className="text-sm font-bold text-[#172B25] tabular-nums">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  {t('fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dilshan Mendis"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  {t('selectHospitalOrDistrict')}
                </label>
                <select
                  value={hospitalId}
                  onChange={e => setHospitalId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                >
                  <option value="">Select hospital (optional)</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  Review Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional care during mother's recovery"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  {t('reviewCommentLabel')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={t('reviewPlaceholder')}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {(!currentUser || currentUser.userType !== 'family' || !currentUser.isVerified) && (
                  <p className="mr-auto text-xs text-[#64746D]">
                    {!currentUser ? 'Sign in with a family account to submit a review.' :
                      currentUser.userType !== 'family' ? 'Reviews are available to family accounts.' :
                        'Your family account must be verified before reviewing.'}
                  </p>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#64746D] hover:text-[#172B25] transition-colors cursor-pointer"
                >
                  {t('closeBtn')}
                </button>
                <button
                  type="submit"
                  disabled={!currentUser || currentUser.userType !== 'family' || !currentUser.isVerified}
                  className="px-5 py-2.5 bg-[#3dcfff] hover:bg-[#1eb5df] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {t('submitReviewBtn')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
