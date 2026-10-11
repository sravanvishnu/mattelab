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
  Sparkles
} from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
              Admin & Organizer Suite
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 font-heading">
            Makerspace Resources & Equipment
          </h2>
          <p className="text-sm text-slate-400">
            Register hardware machinery, 3D printers, workstations, and collaborative spaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Refresh resource list"
            className={loading ? 'animate-spin' : ''}
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          {isAdmin && (
            <Button
              variant="accent"
              onClick={handleOpenCreate}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-800/80 bg-slate-900/60">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Resources</p>
              <h4 className="text-2xl font-bold text-slate-100">{stats.total}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/60">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Machines</p>
              <h4 className="text-2xl font-bold text-slate-100">{stats.activeMachines}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/60">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Spaces</p>
              <h4 className="text-2xl font-bold text-slate-100">{stats.activeSpaces}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/60">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Maintenance / Inactive</p>
              <h4 className="text-2xl font-bold text-slate-100">{stats.inactive}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search machines, spaces, rooms..."
            className="pl-9 bg-slate-900/80 border-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Table */}
      {filteredResources.length === 0 ? (
        <Card className="border-dashed border-slate-800 bg-slate-900/40 py-12 text-center">
          <CardContent className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-slate-800/60 text-slate-500 mb-3">
              <Wrench className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-slate-200">No resources found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? `No matching items for "${searchQuery}". Try clearing search keywords.`
                : 'No machines or makerspace stations have been added in this category yet.'}
            </p>
            {isAdmin && !searchQuery && (
              <Button
                variant="accent"
                size="sm"
                className="mt-4"
                onClick={handleOpenCreate}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="w-[30%]">Resource & Specs</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((res) => {
                const isActive = res.status === 'active';
                const isMachine = res.type === 'machine';

                return (
                  <TableRow key={res.id} className="border-slate-800/80 hover:bg-slate-800/40">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                          {res.name}
                        </span>
                        {res.description && (
                          <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {res.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          isMachine
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }
                      >
                        {isMachine ? (
                          <span className="flex items-center gap-1">
                            <Wrench className="w-3 h-3" /> Machine
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> Space
                          </span>
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {res.location || 'Makerspace Lab'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <button
                        type="button"
                        onClick={() => isAdmin && handleToggleStatus(res)}
                        disabled={!isAdmin}
                        title={isAdmin ? 'Click to toggle status' : undefined}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          isActive
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                        } ${!isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        <span>{isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Active/Inactive */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(res)}
                            title={isActive ? 'Deactivate resource' : 'Activate resource'}
                            className="h-8 w-8 text-slate-400 hover:text-amber-400"
                          >
                            <Power className="w-4 h-4" />
                          </Button>

                          {/* Edit */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(res)}
                            title="Edit resource"
                            className="h-8 w-8 text-slate-400 hover:text-emerald-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(res)}
                            disabled={deletingId === res.id}
                            title="Delete resource"
                            className="h-8 w-8 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
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
