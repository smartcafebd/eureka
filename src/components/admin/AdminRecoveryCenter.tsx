import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { RecoveryJob, RestorePoint } from '../../types';
import {
  LifeBuoy,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  History as HistoryIcon,
  ShieldCheck,
  Zap,
  HardDrive,
  Database,
  Plus,
  Play,
  FileCheck,
  Layers,
  Sparkles,
  Info,
  Clock,
  X
} from 'lucide-react';

export const AdminRecoveryCenter: React.FC = () => {
  const {
    recoveryJobs,
    restorePoints,
    applyRecoveryJob,
    createRestorePoint,
    restoreFromSnapshot,
    deleteRestorePoint,
    currentAdmin
  } = useStore();

  const [activeTab, setActiveTab] = useState<'jobs' | 'snapshots'>('jobs');
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [showCreateSnapshotModal, setShowCreateSnapshotModal] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [snapshotType, setSnapshotType] = useState<'full' | 'database' | 'media'>('full');
  const [restoreTarget, setRestoreTarget] = useState<RestorePoint | null>(null);
  const [deleteSnapshotTarget, setDeleteSnapshotTarget] = useState<RestorePoint | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleRunJob = async (id: string, name: string) => {
    setRunningJobId(id);
    await applyRecoveryJob(id, currentAdmin.name);
    setRunningJobId(null);
    setActionSuccess(`Recovery job "${name}" executed successfully! System state synchronized.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCreateSnapshotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotLabel.trim()) return;
    createRestorePoint(snapshotLabel.trim(), snapshotType, currentAdmin.name);
    setSnapshotLabel('');
    setShowCreateSnapshotModal(false);
    setActionSuccess('New System Restore Point captured and verified.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleConfirmRestore = async () => {
    if (!restoreTarget) return;
    await restoreFromSnapshot(restoreTarget.id, currentAdmin.name);
    const label = restoreTarget.label;
    setRestoreTarget(null);
    setActionSuccess(`Successfully rolled back system to snapshot "${label}".`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <LifeBuoy className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Website Recovery Center & System Healing
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm">
                One-click automated repair workflows, slug sanitization, broken routing healing, and snapshot rollback.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCreateSnapshotModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Restore Point
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-sm">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Zap className="w-4 h-4" />
          Automated Healing Tasks ({recoveryJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('snapshots')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'snapshots'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <HistoryIcon className="w-4 h-4" />
          System Restore Points ({(restorePoints || []).length})
        </button>
      </div>

      {/* TAB 1: HEALING JOBS */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" /> Self-Healing Maintenance Procedures
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Execute low-level system integrity scripts safely without downtime or catalog loss.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {(recoveryJobs || []).map(job => (
              <div key={job.id} className="p-5 hover:bg-stone-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{job.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      Target: {job.target}
                    </span>
                    {job.status === 'completed' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready / Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">{job.description}</p>
                  <p className="text-[11px] text-stone-400">
                    Last triggered: {new Date(job.lastRun).toLocaleString()} by {job.triggeredBy}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleRunJob(job.id, job.name)}
                    disabled={runningJobId === job.id}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${runningJobId === job.id ? 'animate-spin' : ''}`} />
                    {runningJobId === job.id ? 'Executing Script...' : 'Run Healing Task'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM SNAPSHOTS & RESTORE POINTS */}
      {activeTab === 'snapshots' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-amber-600" /> Verified System Snapshots
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Full-state backups allowing instant disaster rollback to an exact historical state.
              </p>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Automated retention: 30 days
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4">Snapshot Label</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">File Size</th>
                  <th className="py-2.5 px-4">Catalog Scope</th>
                  <th className="py-2.5 px-4">Created Timestamp</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-normal">
                {(restorePoints || []).map(point => (
                  <tr key={point.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-amber-600" />
                        <span>{point.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-stone-600 font-medium">{point.type}</td>
                    <td className="py-3 px-4 font-mono text-stone-700">{point.sizeMb} MB</td>
                    <td className="py-3 px-4 text-stone-600">
                      {typeof point.itemCount === 'object' && point.itemCount
                        ? `${point.itemCount.products ?? 0} Products, ${point.itemCount.orders ?? 0} Orders`
                        : `${point.itemCount ?? 0} Items`}
                    </td>
                    <td className="py-3 px-4 text-stone-500 font-mono">
                      {new Date(point.timestamp || point.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setRestoreTarget(point)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-200 transition text-xs"
                      >
                        Restore Snapshot
                      </button>
                      <button
                        onClick={() => setDeleteSnapshotTarget(point)}
                        className="px-2.5 py-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition text-xs"
                        title="Delete snapshot"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE SNAPSHOT MODAL */}
      {showCreateSnapshotModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">Capture Restore Point</h3>
              </div>
              <button onClick={() => setShowCreateSnapshotModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSnapshotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Restore Point Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pre-Sale Catalog Backup or Version 2.4 Stable"
                  value={snapshotLabel}
                  onChange={e => setSnapshotLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Backup Scope</label>
                <select
                  value={snapshotType}
                  onChange={e => setSnapshotType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="full">Full Snapshot (Catalog, Orders, Customers & Settings)</option>
                  <option value="database">Database State Only (Fast)</option>
                  <option value="media">Media & Banners Assets Only</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px] leading-relaxed">
                Snapshots are stored in isolated encrypted storage with automated checksum verification.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateSnapshotModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Create Restore Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STRICT SAFETY RESTORE CONFIRMATION MODAL */}
      {restoreTarget && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Restore System State?</h3>
                <p className="text-xs text-stone-500">Rollback to historical snapshot</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to restore the system state from <strong className="text-stone-900 font-bold">"{restoreTarget.label}"</strong> recorded on {new Date(restoreTarget.timestamp).toLocaleDateString()}?
            </p>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Safe Rollback Guard
              </p>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                An automatic backup of the current state will be taken immediately before rollback starts to prevent any accidental data loss.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRestoreTarget(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Confirm System Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRICT SAFETY DELETE SNAPSHOT CONFIRMATION */}
      {deleteSnapshotTarget && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Delete Restore Snapshot?</h3>
                <p className="text-xs text-stone-500">Irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete snapshot <strong className="text-stone-900 font-bold">"{deleteSnapshotTarget.label}"</strong> ({deleteSnapshotTarget.sizeMb} MB)?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteSnapshotTarget(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRestorePoint(deleteSnapshotTarget.id, currentAdmin.name);
                  setDeleteSnapshotTarget(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Delete Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
