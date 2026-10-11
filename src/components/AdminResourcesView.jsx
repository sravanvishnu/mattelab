import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Building2,
  Plus,
  Search,
  RotateCw,
  Power,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Cpu,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';
import ResourceCalendarView from './ResourceCalendarView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import ResourceModal from './ResourceModal';
import {
  addResource,
  updateResource,
  toggleResourceStatus,
  deleteResource
} from '@/services/resources';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminResourcesView({
  resources = [],
  loading = false,
  onRefresh
}) {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'machine' | 'space' | 'active' | 'inactive'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // View Mode: 'inventory' | 'calendar'
  const [viewMode, setViewMode] = useState('inventory');
  const [calendarTargetResourceId, setCalendarTargetResourceId] = useState(null);

  // Compute live statistics
  const stats = useMemo(() => {
    const total = resources.length;
    const machines = resources.filter(r => r.type === 'machine');
    const spaces = resources.filter(r => r.type === 'space');
    const active = resources.filter(r => r.status === 'active').length;
    const inactive = resources.filter(r => r.status === 'inactive').length;

    return {
      total,
      activeMachines: machines.filter(m => m.status === 'active').length,
      activeSpaces: spaces.filter(s => s.status === 'active').length,
      inactive
    };
  }, [resources]);

  // Filtered resources list
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch =
        res.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === 'machine') return res.type === 'machine';
      if (filterType === 'space') return res.type === 'space';
      if (filterType === 'active') return res.status === 'active';
      if (filterType === 'inactive') return res.status === 'inactive';
      return true;
    });
  }, [resources, searchQuery, filterType]);

  const handleOpenCreate = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditingResource(res);
    setIsModalOpen(true);
  };

  const handleSaveResource = async (formData) => {
    if (!currentUser) return;
    setIsSubmitting(true);

    try {
      if (editingResource) {
        await updateResource(editingResource.id, formData);
        showToast(`Resource "${formData.name}" updated successfully!`, 'success');
      } else {
        await addResource(formData, currentUser.uid);
        showToast(`Resource "${formData.name}" created successfully!`, 'success');
      }
      setIsModalOpen(false);
      onRefresh?.();
    } catch (err) {
      console.error('Failed to save resource:', err);
      showToast(err.message || 'Error saving resource. Check permissions.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (res) => {
    try {
      const nextStatus = await toggleResourceStatus(res.id, res.status);
      showToast(
        `"${res.name}" is now ${nextStatus === 'active' ? 'Active' : 'Inactive'}.`,
        nextStatus === 'active' ? 'success' : 'info'
      );
      onRefresh?.();
    } catch (err) {
      console.error('Toggle failed:', err);
      showToast('Failed to update status. Check permissions.', 'error');
    }
  };

  const handleDelete = async (res) => {
    const confirmed = window.confirm(`Permanently delete resource "${res.name}"?`);
    if (!confirmed) return;

    setDeletingId(res.id);
    try {
      await deleteResource(res.id);
      showToast(`Resource "${res.name}" deleted.`, 'info');
      onRefresh?.();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete resource.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (viewMode === 'calendar') {
    return (
      <ResourceCalendarView
        resources={resources}
        initialResourceId={calendarTargetResourceId}
        onBackToResources={() => setViewMode('inventory')}
      />
    );
  }

  return (
    <div className="tab-pane-fade space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#4C4541]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 text-[#4C4541] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <span>[ 04 / HARDWARE ] · MAKERSPACE FACILITIES</span>
          </div>
          <h2 className="font-condensed text-3xl sm:text-5xl font-bold tracking-tight text-[#4C4541] uppercase">
            Makerspace Resources & Equipment
          </h2>
          <p className="font-editorial italic text-sm sm:text-base text-[#4C4541]/80 mt-1 max-w-2xl font-normal">
            Hardware machinery, 3D printers, electronics workbenches, and project incubation spaces at CET.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-white p-1 rounded-full border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541]">
            <button
              type="button"
              onClick={() => setViewMode('inventory')}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono uppercase transition-all cursor-pointer ${
                viewMode === 'inventory'
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'text-[#4C4541] hover:bg-[#F2C46A]/20'
              }`}
            >
              Equipment List
            </button>
            <button
              type="button"
              onClick={() => {
                setCalendarTargetResourceId(resources[0]?.id || null);
                setViewMode('calendar');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'text-[#4C4541] hover:bg-[#F2C46A]/20'
              }`}
            >
              <Calendar size={13} />
              <span>Week Calendar</span>
            </button>
          </div>

          <button
            type="button"
            className={`p-2.5 rounded-full border-2 border-[#4C4541] bg-white text-[#4C4541] hover:bg-[#F2C46A]/30 shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer ${
              loading ? 'animate-spin' : ''
            }`}
            onClick={onRefresh}
            title="Refresh resource list"
            aria-label="Refresh resource list"
          >
            <RotateCw size={15} />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] transition-all active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border-2 border-[#4C4541] bg-white p-4 sm:p-5 shadow-[3px_3px_0_#4C4541]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">TOTAL</span>
            <div className="w-8 h-8 rounded-lg bg-[#FCF0DA] text-[#4C4541] border border-[#4C4541] flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <div className="font-condensed text-4xl sm:text-5xl font-bold text-[#4C4541] leading-none">
            {stats.total}
          </div>
          <p className="mt-1 text-xs text-[#4C4541]/70 font-medium">Lab inventory</p>
        </div>

        <div className="rounded-2xl border-2 border-[#4C4541] bg-white p-4 sm:p-5 shadow-[3px_3px_0_#4C4541]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">MACHINES</span>
            <div className="w-8 h-8 rounded-lg bg-[#AEAC78] text-[#4C4541] border border-[#4C4541] flex items-center justify-center">
              <Cpu size={16} />
            </div>
          </div>
          <div className="font-condensed text-4xl sm:text-5xl font-bold text-[#4C4541] leading-none">
            {stats.activeMachines}
          </div>
          <p className="mt-1 text-xs text-[#4C4541]/70 font-medium">Ready for booking</p>
        </div>

        <div className="rounded-2xl border-2 border-[#4C4541] bg-white p-4 sm:p-5 shadow-[3px_3px_0_#4C4541]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">SPACES</span>
            <div className="w-8 h-8 rounded-lg bg-[#F2C46A] text-[#4C4541] border border-[#4C4541] flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="font-condensed text-4xl sm:text-5xl font-bold text-[#4C4541] leading-none">
            {stats.activeSpaces}
          </div>
          <p className="mt-1 text-xs text-[#4C4541]/70 font-medium">Available stations</p>
        </div>

        <div className="rounded-2xl border-2 border-[#4C4541] bg-white p-4 sm:p-5 shadow-[3px_3px_0_#4C4541]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4C4541]/70">OFFLINE</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 border border-[#4C4541] flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="font-condensed text-4xl sm:text-5xl font-bold text-[#4C4541] leading-none">
            {stats.inactive}
          </div>
          <p className="mt-1 text-xs text-[#4C4541]/70 font-medium">In maintenance</p>
        </div>
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4C4541]/60 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search machines, spaces, rooms..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border-2 border-[#4C4541] text-xs sm:text-sm text-[#4C4541] placeholder-[#4C4541]/50 font-medium shadow-[2px_2px_0_#4C4541] focus:outline-none focus:bg-[#FCF0DA] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: `All (${resources.length})` },
            { id: 'machine', label: 'Machines' },
            { id: 'space', label: 'Spaces' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-mono uppercase border-2 border-[#4C4541] transition-all cursor-pointer shadow-[1.5px_1.5px_0_#4C4541] ${
                filterType === tab.id
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'bg-white text-[#4C4541] hover:bg-[#F2C46A]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Table */}
      {filteredResources.length === 0 ? (
        <div className="rounded-[24px] border-2 border-[#4C4541] bg-white p-12 text-center shadow-[4px_4px_0_#4C4541]">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FCF0DA] border-2 border-[#4C4541] flex items-center justify-center text-[#4C4541] mb-4 shadow-[2px_2px_0_#4C4541]">
            <Wrench size={28} />
          </div>
          <h4 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#4C4541]">No resources found</h4>
          <p className="text-xs sm:text-sm text-[#4C4541]/80 mt-2 max-w-sm mx-auto font-sans leading-relaxed">
            {searchQuery
              ? `No matching items for "${searchQuery}". Try clearing search keywords.`
              : 'No machines or makerspace stations have been added in this category yet.'}
          </p>
          {isAdmin && !searchQuery && (
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] text-xs font-bold uppercase tracking-wider border-2 border-[#4C4541] shadow-[2px_2px_0_#4C4541] cursor-pointer"
              onClick={handleOpenCreate}
            >
              <Plus size={15} />
              <span>Add First Resource</span>
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-[24px] border-2 border-[#4C4541] bg-white overflow-x-auto shadow-[4px_4px_0_#4C4541]">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#FCF0DA] border-b-2 border-[#4C4541] font-mono text-xs font-bold uppercase text-[#4C4541]">
                <th className="py-3.5 px-5">Resource & Specs</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res) => {
                const isActive = res.status === 'active';
                const isMachine = res.type === 'machine';

                return (
                  <tr key={res.id} className="border-b border-[#4C4541]/15 hover:bg-[#FCF0DA]/25 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#4C4541] text-sm">
                          {res.name}
                        </span>
                        {res.description && (
                          <span className="text-xs text-[#4C4541]/70 mt-0.5 line-clamp-1 font-sans">
                            {res.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border border-[#4C4541] bg-[#FCF0DA] text-[#4C4541]">
                        {isMachine ? <Wrench size={11} /> : <Building2 size={11} />}
                        <span>{isMachine ? 'Machine' : 'Space'}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-[#4C4541] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#4C4541]/60" />
                        <span>{res.location || 'Makerspace Lab'}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => isAdmin && handleToggleStatus(res)}
                        disabled={!isAdmin}
                        title={isAdmin ? 'Click to toggle status' : undefined}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border border-[#4C4541] transition-all ${
                          isActive
                            ? 'bg-[#AEAC78] text-[#4C4541]'
                            : 'bg-[#F2C46A] text-[#4C4541]'
                        } ${!isAdmin ? 'cursor-default' : 'cursor-pointer hover:opacity-85'}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-[#4C4541]' : 'bg-[#4C4541]'
                          }`}
                        />
                        <span>{isActive ? 'Active' : 'Maintenance'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Book / View Schedule */}
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarTargetResourceId(res.id);
                            setViewMode('calendar');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4C4541] hover:bg-[#F2C46A] text-[#FCF0DA] hover:text-[#4C4541] border border-[#4C4541] text-xs font-bold font-mono uppercase shadow-[1.5px_1.5px_0_#4C4541] transition-all cursor-pointer"
                          title="View live schedule & book time slot"
                        >
                          <Calendar size={13} />
                          <span>Schedule</span>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(res)}
                              title={isActive ? 'Deactivate resource' : 'Activate resource'}
                              className="w-7 h-7 rounded-full border border-[#4C4541] bg-white flex items-center justify-center text-[#4C4541] hover:bg-[#F2C46A] transition-all cursor-pointer"
                            >
                              <Power size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(res)}
                              title="Edit resource"
                              className="w-7 h-7 rounded-full border border-[#4C4541] bg-white flex items-center justify-center text-[#4C4541] hover:bg-[#F2C46A] transition-all cursor-pointer"
                            >
                              <Pencil size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(res)}
                              disabled={deletingId === res.id}
                              title="Delete resource"
                              className="w-7 h-7 rounded-full border border-[#4C4541] bg-white flex items-center justify-center text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveResource}
        initialData={editingResource}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
