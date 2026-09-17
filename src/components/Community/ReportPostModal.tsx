"use client";

import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CommunityPost, AlumniProfile } from '@/types';
import { reportCommunityPost } from '@/lib/store';

interface ReportPostModalProps {
  isOpen: boolean;
  post: CommunityPost | null;
  currentUser: AlumniProfile | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const REPORT_REASONS = [
  { value: 'Inappropriate content', label: 'Inappropriate content / अनुचित सामग्री' },
  { value: 'Copyright concern', label: 'Copyright violation / कॉपीराइट उल्लंघन' },
  { value: 'Privacy concern', label: 'Privacy concern / गोपनीयता संबंधी चिंता' },
  { value: 'Spam', label: 'Spam or Misleading / स्पैम या भ्रामक' },
  { value: 'Incorrect information', label: 'Incorrect information / गलत जानकारी' },
  { value: 'Other', label: 'Other issue / अन्य समस्या' },
] as const;

export default function ReportPostModal({
  isOpen,
  post,
  currentUser,
  onClose,
  onSuccess,
}: ReportPostModalProps) {
  const [reason, setReason] = useState<typeof REPORT_REASONS[number]['value']>('Inappropriate content');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please log in to report a post / पोस्ट रिपोर्ट करने के लिए कृपया लॉगिन करें');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await reportCommunityPost({
        postId: post.id,
        postTitle: post.title,
        reporterId: currentUser.id,
        reporterName: currentUser.fullName,
        reason: reason as any,
        details: details.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || 'Failed to submit report. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-red-50/50 dark:bg-red-950/20">
          <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">Report Post / रिपोर्ट करें</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 animate-bounce" />
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Report Submitted</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Thank you for keeping the Rishikul community safe. Admins will review this post.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Reporting post:</span>{' '}
              <span className="italic truncate block">"{post.title}"</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Reason / कारण चुनें <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      reason === r.value
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 font-medium shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="mt-0.5 text-red-600 focus:ring-red-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Additional Details (Optional) / अतिरिक्त विवरण
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this post should be reviewed by admins..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel / रद्द करें
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
