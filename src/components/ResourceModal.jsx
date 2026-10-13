import React, { useState, useEffect } from 'react';
import { X, Wrench, Building2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ResourceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('machine'); // 'machine' | 'space'
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('active'); // 'active' | 'inactive'
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setType(initialData.type || 'machine');
      setLocation(initialData.location || '');
      setStatus(initialData.status || 'active');
    } else {
      setName('');
      setDescription('');
      setType('machine');
      setLocation('');
      setStatus('active');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Resource name is required.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      type,
      location: location.trim() || 'Makerspace Lab',
      status
    });
  };

  const isEditing = Boolean(initialData?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[28px] border-2 border-[#4C4541] bg-[#FCF0DA] p-6 sm:p-8 shadow-[8px_8px_0_#4C4541] text-[#4C4541] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#4C4541]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] border-2 border-[#4C4541] text-[#4C4541] flex items-center justify-center shadow-[1.5px_1.5px_0_#4C4541]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-condensed text-xl sm:text-2xl font-bold uppercase text-[#4C4541] leading-none">
                {isEditing ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <p className="font-mono text-xs text-[#4C4541]/70 mt-0.5">
                {isEditing
                  ? 'Update resource specifications and operational status'
                  : 'Register a machine, equipment, or space for the makerspace'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#4C4541] bg-white flex items-center justify-center text-sm font-bold hover:bg-[#F2C46A] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
              Resource Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bambu Lab X1-Carbon 3D Printer"
              maxLength={100}
              className="w-full rounded-2xl bg-white border-2 border-[#4C4541] px-3.5 py-2.5 text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA]"
              required
            />
          </div>

          {/* Type Selector (Machine vs Space) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
              Resource Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('machine')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 border-[#4C4541] text-xs font-bold font-mono uppercase transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${type === 'machine'
                    ? 'bg-[#4C4541] text-[#FCF0DA]'
                    : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
                  }`}
              >
                <Wrench size={15} />
                <span>Machine</span>
              </button>

              <button
                type="button"
                onClick={() => setType('space')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 border-[#4C4541] text-xs font-bold font-mono uppercase transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${type === 'space'
                    ? 'bg-[#4C4541] text-[#FCF0DA]'
                    : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
                  }`}
              >
                <Building2 size={15} />
                <span>Lab Space</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
              Location / Room
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Makerspace Bay 2 / Electronics Lab"
              maxLength={120}
              className="w-full rounded-2xl bg-white border-2 border-[#4C4541] px-3.5 py-2.5 text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA]"
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
              Operational Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-2xl border-2 border-[#4C4541] text-xs font-bold font-mono uppercase transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${status === 'active'
                    ? 'bg-[#AEAC78] text-[#4C4541]'
                    : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
                  }`}
              >
                <CheckCircle2 size={15} />
                <span>Active (Available)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-2xl border-2 border-[#4C4541] text-xs font-bold font-mono uppercase transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${status === 'inactive'
                    ? 'bg-[#F2C46A] text-[#4C4541]'
                    : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
                  }`}
              >
                <AlertCircle size={15} />
                <span>Maintenance</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#4C4541] mb-1">
              Description & Specifications
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical specs, materials supported, usage prerequisites..."
              rows={3}
              maxLength={1000}
              className="w-full rounded-2xl bg-white border-2 border-[#4C4541] p-3 text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/40 focus:outline-none focus:bg-[#FCF0DA]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#4C4541]/20">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border-2 border-[#4C4541] bg-white text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541] cursor-pointer"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
