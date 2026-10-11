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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c26e47]/15 text-[#e28743] border border-[#c26e47]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update resource specifications and operational status'
                  : 'Register a machine, equipment, or space for the makerspace'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resource Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bambu Lab X1-Carbon 3D Printer"
              maxLength={100}
              required
            />
          </div>

          {/* Type Selector (Machine vs Space) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resource Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('machine')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                  type === 'machine'
                    ? 'bg-[#c26e47]/15 border-[#c26e47]/50 text-[#f3a86c] shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Machine / Hardware</span>
              </button>

              <button
                type="button"
                onClick={() => setType('space')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                  type === 'space'
                    ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Lab Space / Station</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Location / Room
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Makerspace Bay 2 / Electronics Lab"
              maxLength={120}
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Operational Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  status === 'active'
                    ? 'bg-[#c26e47]/15 border-[#c26e47] text-[#e28743]'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Active (Available)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  status === 'inactive'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Inactive (Maintenance)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Specifications
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical specs, materials supported, usage prerequisites..."
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Create Resource'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
