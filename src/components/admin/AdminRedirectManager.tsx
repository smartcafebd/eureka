import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { RedirectRule, RedirectStatusCode } from '../../types';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  ArrowRight,
  ExternalLink,
  Info,
  Clock,
  Check,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminRedirectManager: React.FC = () => {
  const {
    redirects,
    addRedirect,
    updateRedirect,
    deleteRedirect,
    currentAdmin
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCode, setFilterCode] = useState<'all' | RedirectStatusCode>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<RedirectRule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RedirectRule | null>(null);

  // Form State
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [statusCode, setStatusCode] = useState<RedirectStatusCode>('301');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setSourceUrl('');
    setTargetUrl('');
    setStatusCode('301');
    setNotes('');
    setFormError(null);
    setEditingRedirect(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (rule: RedirectRule) => {
    setEditingRedirect(rule);
    setSourceUrl(rule.sourceUrl);
    setTargetUrl(rule.targetUrl);
    setStatusCode(rule.statusCode);
    setNotes(rule.notes || '');
    setFormError(null);
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanSource = sourceUrl.trim();
    const cleanTarget = targetUrl.trim();

    if (!cleanSource || !cleanTarget) {
      setFormError('Source URL and Target URL are required.');
      return;
    }

    // Loop detection: Source and Target cannot be identical
    if (cleanSource === cleanTarget) {
      setFormError('Infinite redirect loop detected: Source and Target URL cannot be identical.');
      return;
    }

    // Check circular redirect
    const circular = redirects.find(r => r.sourceUrl === cleanTarget && r.targetUrl === cleanSource && r.id !== editingRedirect?.id);
    if (circular) {
      setFormError(`Circular redirect collision with rule ${circular.sourceUrl} -> ${circular.targetUrl}.`);
      return;
    }

    if (editingRedirect) {
      updateRedirect(editingRedirect.id, {
        sourceUrl: cleanSource,
        targetUrl: cleanTarget,
        statusCode,
        notes
      }, currentAdmin.name);
    } else {
      addRedirect({
        sourceUrl: cleanSource,
        targetUrl: cleanTarget,
        statusCode,
        status: 'active',
        notes
      }, currentAdmin.name);
    }

    setShowAddModal(false);
    resetForm();
  };

  const toggleStatus = (rule: RedirectRule) => {
    updateRedirect(rule.id, {
      status: rule.status === 'active' ? 'disabled' : 'active'
    }, currentAdmin.name);
  };

  const exportRedirectsJson = () => {
    const blob = new Blob([JSON.stringify(redirects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eureka-redirects-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const redirectList = Array.isArray(redirects) ? redirects : [];

  const filteredRedirects = redirectList.filter(r => {
    if (filterCode !== 'all' && r.statusCode !== filterCode) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return r.sourceUrl.toLowerCase().includes(q) || r.targetUrl.toLowerCase().includes(q) || (r.notes && r.notes.toLowerCase().includes(q));
    }
    return true;
  });

  const totalHits = redirectList.reduce((acc, r) => acc + (r.hits || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ArrowRightLeft className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                301/302 Redirect Manager & Link Juice Preserver
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm">
                Prevent 404 dead-ends, preserve historical Google PageRank, and seamlessly route renamed products and campaigns.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportRedirectsJson}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Rules
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Redirect Rule
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Active Rules</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{redirects.length}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Zero loop conflicts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Redirect Traffic Preserved</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{totalHits.toLocaleString()} Hits</p>
          <span className="text-[11px] text-stone-500">Since last cache flush</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">301 Permanent Moves</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            {redirects.filter(r => r.statusCode === '301').length}
          </p>
          <span className="text-[11px] text-stone-500">SEO Link Juice Transferred</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">302 Temporary Rules</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            {redirects.filter(r => r.statusCode === '302').length}
          </p>
          <span className="text-[11px] text-stone-500">Active promo reroutes</span>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search source URL or destination..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filterCode}
              onChange={e => setFilterCode(e.target.value as any)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl bg-white text-stone-700 font-medium focus:outline-hidden"
            >
              <option value="all">All HTTP Codes</option>
              <option value="301">301 Moved Permanently</option>
              <option value="302">302 Found (Temporary)</option>
              <option value="307">307 Temporary Redirect</option>
              <option value="308">308 Permanent Redirect</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Source Route (From)</th>
                <th className="py-3 px-4">Destination Target (To)</th>
                <th className="py-3 px-4">Traffic Hits</th>
                <th className="py-3 px-4">Rule Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredRedirects.map(rule => (
                <tr key={rule.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      rule.statusCode === '301'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {rule.statusCode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900 max-w-xs truncate">
                    {rule.sourceUrl}
                  </td>
                  <td className="py-3 px-4 text-emerald-800 font-semibold max-w-xs truncate">
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{rule.targetUrl}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-bold">{rule.hits || 0}</td>
                  <td className="py-3 px-4 font-sans text-stone-500 max-w-xs truncate">
                    {rule.notes || '—'}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <button
                      onClick={() => toggleStatus(rule)}
                      className={`px-2 py-0.5 rounded font-semibold text-[10px] transition ${
                        rule.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {rule.status === 'active' ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right font-sans space-x-1">
                    <button
                      onClick={() => handleOpenEdit(rule)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition"
                      title="Edit rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(rule)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  {editingRedirect ? 'Edit Redirect Rule' : 'New HTTP Redirect Rule'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Source Path (Old URL)</label>
                <input
                  type="text"
                  required
                  placeholder="/product/old-name or /vintage-sale"
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Destination Target (New URL)</label>
                <input
                  type="text"
                  required
                  placeholder="/product/new-handcrafted-shoe or /category/shoes"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">HTTP Redirect Status Code</label>
                <select
                  value={statusCode}
                  onChange={e => setStatusCode(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                >
                  <option value="301">301 – Permanent Redirect (Passes 99% SEO Link Juice)</option>
                  <option value="302">302 – Found / Temporary Redirect (Does not pass SEO)</option>
                  <option value="307">307 – Temporary Redirect (Strict HTTP Method)</option>
                  <option value="308">308 – Permanent Redirect (Strict HTTP Method)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Notes / Reason (Internal)</label>
                <input
                  type="text"
                  placeholder="e.g. Discontinued product redirected to modern successor"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  {editingRedirect ? 'Save Changes' : 'Create Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Delete Redirect Rule?</h3>
                <p className="text-xs text-stone-500">Remove traffic routing rule</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete the redirect from <strong className="font-mono text-stone-900">{deleteTarget.sourceUrl}</strong> to <strong className="font-mono text-stone-900">{deleteTarget.targetUrl}</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRedirect(deleteTarget.id, currentAdmin.name);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Delete Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
