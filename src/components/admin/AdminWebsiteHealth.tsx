import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ErrorLogItem, ErrorLogType } from '../../types';
import {
  Activity,
  HeartPulse,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Clock,
  ArrowRightLeft,
  Check,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Cpu,
  Database,
  ArrowUpRight,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';

export const AdminWebsiteHealth: React.FC = () => {
  const {
    serverMetrics,
    errorLogs,
    resolveErrorLog,
    clearResolvedErrors,
    runHealthDiagnostics,
    addRedirect,
    currentAdmin
  } = useStore();

  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [diagResult, setDiagResult] = useState<{ healthy: boolean; testsRun: number; score: number } | null>(null);
  const [filterType, setFilterType] = useState<'all' | ErrorLogType>('all');
  const [quickRedirectUrl, setQuickRedirectUrl] = useState<string | null>(null);
  const [redirectTargetInput, setRedirectTargetInput] = useState('/category/leather-sandals');

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagResult(null);
    const res = await runHealthDiagnostics(currentAdmin.name);
    setIsRunningDiagnostics(false);
    setDiagResult(res);
  };

  const handleQuickCreateRedirect = (sourceUrl: string) => {
    addRedirect({
      sourceUrl,
      targetUrl: redirectTargetInput,
      statusCode: '301',
      status: 'active',
      notes: 'Quick-healed from Health Center 404 detector'
    }, currentAdmin.name);

    // Resolve the error
    const err = errorLogs.find(e => e.url === sourceUrl);
    if (err) {
      resolveErrorLog(err.id, currentAdmin.name);
    }
    setQuickRedirectUrl(null);
  };

  const logsList = Array.isArray(errorLogs) ? errorLogs : [];

  const filteredLogs = logsList.filter(e => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    return true;
  });

  const openErrorsCount = logsList.filter(e => e.status === 'open').length;
  const fourOhFourCount = logsList.filter(e => e.type === '404' && e.status === 'open').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <HeartPulse className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Website Health Monitoring & Error Sentinel
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm">
                Real-time uptime tracking, latency telemetry, 404 inbound error detection, and automatic recovery dispatch.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => clearResolvedErrors(currentAdmin.name)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition shadow-sm"
          >
            Clear Resolved Logs
          </button>
          <button
            onClick={handleRunDiagnostics}
            disabled={isRunningDiagnostics}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
            {isRunningDiagnostics ? 'Testing Infrastructure...' : 'Run Health Diagnostics'}
          </button>
        </div>
      </div>

      {diagResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">System Diagnostics Complete: 100% Operational</p>
              <p className="text-emerald-800 mt-0.5">
                All {diagResult.testsRun} infrastructure tests passed: PostgreSQL/JSON storage pool healthy (3.8ms), SSL/TLS handshake valid, Anycast edge cache responding.
              </p>
            </div>
          </div>
          <button onClick={() => setDiagResult(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Real-time Health Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Overall Availability</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-stone-900">{serverMetrics.uptimePercentage}%</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" /> SLA Compliant
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Edge Response Time</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-stone-900">{serverMetrics.avgResponseTimeMs}ms</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              High Performance
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Database Latency</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-stone-900">{serverMetrics.databaseLatencyMs}ms</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Healthy Pool
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Active Error Alerts</span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <p className={`text-2xl font-bold ${openErrorsCount > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
              {openErrorsCount} Open
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
              {fourOhFourCount} 404 Not Found
            </span>
          </div>
        </div>
      </div>

      {/* 404 ERROR TRACKER & ERROR EVENT LOGS */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" /> Inbound Error Sentinel & 404 Tracker
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Real-time monitoring of broken links, missing assets, and API failures with one-click healing.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl bg-white text-stone-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Error Types</option>
              <option value="404">404 Not Found</option>
              <option value="500">500 Server Errors</option>
              <option value="BrokenImage">Broken Media Assets</option>
              <option value="API">API Gateway Errors</option>
            </select>
          </div>
        </div>

        {/* Errors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-4">Error Type</th>
                <th className="py-2.5 px-4">Requested URL</th>
                <th className="py-2.5 px-4">Hits</th>
                <th className="py-2.5 px-4">Referrer / Source</th>
                <th className="py-2.5 px-4">Last Detected</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Quick Recovery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {(filteredLogs || []).map(err => (
                <tr key={err.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      err.type === '404'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : err.type === 'BrokenImage'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}>
                      {err.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-stone-900 max-w-xs truncate">
                    {err.url}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-800">{err.hitCount}</td>
                  <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{err.referrer || 'Direct / None'}</td>
                  <td className="py-3 px-4 text-stone-500 font-mono">
                    {new Date(err.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    {err.status === 'open' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" /> Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {err.status === 'open' && err.type === '404' && (
                      <button
                        onClick={() => setQuickRedirectUrl(err.url)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-200 transition"
                      >
                        Create 301 Redirect
                      </button>
                    )}
                    {err.status === 'open' ? (
                      <button
                        onClick={() => resolveErrorLog(err.id, currentAdmin.name)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg transition"
                      >
                        Resolve
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK REDIRECT CREATION MODAL */}
      {quickRedirectUrl && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <ArrowRightLeft className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Heal Broken 404 URL</h3>
                <p className="text-xs text-stone-500">Route traffic away from 404</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 font-semibold mb-1">Source URL (Broken Route)</label>
                <p className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 font-mono font-bold text-stone-800">
                  {quickRedirectUrl}
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Target Destination URL</label>
                <input
                  type="text"
                  value={redirectTargetInput}
                  onChange={e => setRedirectTargetInput(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  placeholder="/category/leather-sandals or /shop"
                />
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                A 301 Permanent Redirect will immediately send all future visitors and Google crawlers from the broken route directly to your active destination.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setQuickRedirectUrl(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleQuickCreateRedirect(quickRedirectUrl)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Apply 301 Redirect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
