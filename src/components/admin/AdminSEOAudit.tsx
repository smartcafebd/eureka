import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SeoAuditIssue, SeoIssueSeverity, SeoIssueCategory } from '../../types';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  RefreshCw,
  Wand2,
  ExternalLink,
  Filter,
  Check,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

export const AdminSEOAudit: React.FC = () => {
  const {
    seoIssues,
    runSeoAudit,
    resolveSeoIssue,
    autoFixSeoIssue,
    currentAdmin
  } = useStore();

  const [isAuditing, setIsAuditing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | SeoIssueSeverity>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | SeoIssueCategory>('all');
  const [fixingId, setFixingId] = useState<string | null>(null);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    await runSeoAudit(currentAdmin.name);
    setIsAuditing(false);
  };

  const handleAutoFix = async (issueId: string) => {
    setFixingId(issueId);
    setTimeout(() => {
      autoFixSeoIssue(issueId, currentAdmin.name);
      setFixingId(null);
    }, 600);
  };

  // Counts
  const issuesList = Array.isArray(seoIssues) ? seoIssues : [];
  const criticalCount = issuesList.filter(i => i.severity === 'critical' && i.status === 'open').length;
  const warningCount = issuesList.filter(i => i.severity === 'warning' && i.status === 'open').length;
  const noticeCount = issuesList.filter(i => i.severity === 'notice' && i.status === 'open').length;
  const passedCount = issuesList.filter(i => i.severity === 'passed' || i.status === 'fixed').length;
  const overallScore = Math.max(70, 100 - criticalCount * 8 - warningCount * 4 - noticeCount * 2);

  const filteredIssues = issuesList.filter(issue => {
    if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && issue.category !== filterCategory) return false;
    return true;
  });

  const exportAuditReport = () => {
    const reportData = {
      auditTimestamp: new Date().toISOString(),
      overallScore,
      summary: { criticalCount, warningCount, noticeCount, passedCount },
      issues: seoIssues
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eureka-seo-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FileSearch className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Automatic SEO Audit & Issue Detector
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm">
                Continuous crawler analysis detecting broken URLs, missing meta tags, schema validation errors, and ranking hazards.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportAuditReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Audit JSON
          </button>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Crawling All Pages...' : 'Run Deep SEO Audit'}
          </button>
        </div>
      </div>

      {/* Overall Score & Severity Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Main Audit Score Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs text-stone-500 font-semibold">SEO Health Score</p>
            <p className={`text-3xl font-black mt-1 ${
              overallScore >= 85 ? 'text-emerald-700' : overallScore >= 70 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {overallScore}
              <span className="text-xs text-stone-400 font-medium">/100</span>
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> High Authority
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-amber-500 flex items-center justify-center font-bold text-sm text-stone-800">
            {overallScore}%
          </div>
        </div>

        {/* Critical Errors */}
        <button
          onClick={() => setFilterSeverity(filterSeverity === 'critical' ? 'all' : 'critical')}
          className={`bg-white p-4 rounded-xl border transition text-left shadow-xs ${
            filterSeverity === 'critical' ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/20' : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Critical Errors</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{criticalCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">Immediate ranking penalties</p>
        </button>

        {/* Warnings */}
        <button
          onClick={() => setFilterSeverity(filterSeverity === 'warning' ? 'all' : 'warning')}
          className={`bg-white p-4 rounded-xl border transition text-left shadow-xs ${
            filterSeverity === 'warning' ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50/20' : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{warningCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">Recommended optimizations</p>
        </button>

        {/* Notices */}
        <button
          onClick={() => setFilterSeverity(filterSeverity === 'notice' ? 'all' : 'notice')}
          className={`bg-white p-4 rounded-xl border transition text-left shadow-xs ${
            filterSeverity === 'notice' ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/20' : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Notices</span>
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">{noticeCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">Minor crawl enhancements</p>
        </button>

        {/* Passed Checks */}
        <button
          onClick={() => setFilterSeverity(filterSeverity === 'passed' ? 'all' : 'passed')}
          className={`bg-white p-4 rounded-xl border transition text-left shadow-xs ${
            filterSeverity === 'passed' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/20' : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Passed Checks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{passedCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">Compliant standard tests</p>
        </button>
      </div>

      {/* Filter and Issue Listing */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-bold text-stone-700">Filter Findings:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value as any)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl bg-white text-stone-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="Meta Tags">Meta Tags</option>
              <option value="Links & URLs">Links & URLs (404s)</option>
              <option value="Images & Alt">Images & Alt Attributes</option>
              <option value="Schema & Structured">Schema & Structured Data</option>
              <option value="Performance & Indexing">Performance & Indexing</option>
            </select>

            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value as any)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl bg-white text-stone-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warnings Only</option>
              <option value="notice">Notices Only</option>
              <option value="passed">Passed Checks</option>
            </select>

            {(filterSeverity !== 'all' || filterCategory !== 'all') && (
              <button
                onClick={() => {
                  setFilterSeverity('all');
                  setFilterCategory('all');
                }}
                className="text-amber-700 hover:text-amber-800 font-bold ml-2 underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Audit Issues List */}
        <div className="divide-y divide-stone-100">
          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600" />
              <p className="text-sm font-bold text-stone-800">No issues found matching the selected filters.</p>
              <p className="text-xs text-stone-500">Your footwear catalog passes all active audit rules in this view.</p>
            </div>
          ) : (
            filteredIssues.map(issue => (
              <div key={issue.id} className="p-5 hover:bg-stone-50/40 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {issue.severity === 'critical' ? (
                      <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg shrink-0">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                    ) : issue.severity === 'warning' ? (
                      <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    ) : issue.severity === 'notice' ? (
                      <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                        <Info className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{issue.issue}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                        <span className="font-mono text-stone-700 font-medium">{issue.affectedUrl}</span>
                        <span>•</span>
                        <span className="font-semibold text-stone-600">{issue.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {issue.status === 'open' && issue.autoFixable && (
                      <button
                        onClick={() => handleAutoFix(issue.id)}
                        disabled={fixingId === issue.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 transition shadow-2xs"
                      >
                        <Wand2 className={`w-3.5 h-3.5 ${fixingId === issue.id ? 'animate-spin' : ''}`} />
                        {fixingId === issue.id ? 'Auto-Repairing...' : 'Auto-Fix Now'}
                      </button>
                    )}

                    {issue.status === 'open' ? (
                      <button
                        onClick={() => resolveSeoIssue(issue.id, currentAdmin.name)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
                      >
                        Mark Fixed
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <p className="font-bold text-stone-800 mb-0.5">Why this matters:</p>
                    <p className="text-stone-600 leading-relaxed">{issue.explanation}</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <p className="font-bold text-stone-800 mb-0.5">Recommended solution:</p>
                    <p className="text-stone-600 leading-relaxed">{issue.recommendedFix}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
