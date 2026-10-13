import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="max-w-md w-full rounded-[24px] border-2 border-[#4C4541] bg-[#FCF0DA] p-6 sm:p-8 shadow-[6px_6px_0_#4C4541] text-[#4C4541]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#4C4541]/20">
          <div className="w-10 h-10 rounded-xl bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] flex items-center justify-center shadow-[1.5px_1.5px_0_#4C4541]">
            <AlertTriangle size={20} />
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#4C4541] bg-white flex items-center justify-center text-sm font-bold hover:bg-[#F2C46A] transition-colors cursor-pointer"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="py-4">
          <h3 className="font-condensed text-xl sm:text-2xl font-bold uppercase text-[#4C4541] leading-none">{title}</h3>
          <p className="text-xs sm:text-sm text-[#4C4541]/85 font-sans mt-2.5 leading-relaxed">{message}</p>
        </div>
        <div className="pt-4 border-t-2 border-[#4C4541]/20 flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-full border-2 border-[#4C4541] bg-white text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541] cursor-pointer"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer ${isDanger
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541]'
              }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
