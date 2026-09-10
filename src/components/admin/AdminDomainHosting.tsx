import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DomainEntity, DnsRecord } from '../../types';
import {
  Globe,
  Server,
  ShieldCheck,
  ShieldAlert,
  HardDrive,
  Cpu,
  Zap,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Lock as LockIcon,
  MailCheck,
  Sparkles,
  ArrowUpRight,
  Info,
  Radio,
  Sliders,
  Database,
  Layers,
  X
} from 'lucide-react';

export const AdminDomainHosting: React.FC = () => {
  const {
    domains,
    dnsRecords,
    serverMetrics,
    addDomain,
    verifyDomainDns,
    setPrimaryDomain,
    deleteDomain,
    purgeCache,
    updateServerMetrics,
    currentAdmin
  } = useStore();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newDomainType, setNewDomainType] = useState<'custom' | 'subdomain'>('custom');
  const [deleteTarget, setDeleteTarget] = useState<DomainEntity | null>(null);
  const [showDnsGuide, setShowDnsGuide] = useState(false);
  const [filterDns, setFilterDns] = useState<'all' | 'propagated' | 'pending'>('all');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = async (id: string) => {
    setIsVerifying(id);
    await verifyDomainDns(id, currentAdmin.name);
    setIsVerifying(null);
  };

  const handlePurge = async (type: 'all' | 'pages' | 'assets') => {
    setIsPurging(true);
    setPurgeSuccess(null);
    const result = await purgeCache(type, currentAdmin.name);
    setIsPurging(false);
    setPurgeSuccess(`Purged ${type.toUpperCase()} cache (${result.clearedMb} MB released from CDN edge)`);
    setTimeout(() => setPurgeSuccess(null), 4000);
  };

  const handleAddDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    addDomain(newDomainInput.trim(), newDomainType, currentAdmin.name);
    setNewDomainInput('');
    setShowAddModal(false);
  };

  const primaryDomain = domains.find(d => d.isPrimary) || domains[0];
  const storagePercentage = Math.round((serverMetrics.storageUsedGb / serverMetrics.storageTotalGb) * 100);
  const bandwidthPercentage = Math.round((serverMetrics.bandwidthUsedGb / serverMetrics.bandwidthTotalGb) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Globe className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Domain & Hosting Command Center
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm">
                Manage live domain routing, SSL/TLS certificates, DNS records, uptime monitoring, and CDN caching.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handlePurge('all')}
            disabled={isPurging}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPurging ? 'animate-spin text-amber-400' : ''}`} />
            {isPurging ? 'Purging CDN...' : 'Purge All Caches'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Connect Custom Domain
          </button>
        </div>
      </div>

      {purgeSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{purgeSuccess}</span>
          </div>
          <button onClick={() => setPurgeSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Status At A Glance Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Domain Status */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Primary Domain</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="mt-2">
            <p className="font-mono text-sm font-bold text-stone-900 truncate">{primaryDomain?.domain}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          </div>
        </div>

        {/* SSL Status */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>SSL / TLS 1.3</span>
            <LockIcon className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold text-stone-900">Active & Enforced</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" /> {primaryDomain?.sslExpiryDays} days left
            </span>
          </div>
        </div>

        {/* DNS Status */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>DNS Resolution</span>
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold text-stone-900">100% Propagated</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Cloudflare Anycast
            </span>
          </div>
        </div>

        {/* Server Status */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Server Uptime</span>
            <Server className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold text-stone-900">{serverMetrics.uptimePercentage}%</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3" /> {serverMetrics.avgResponseTimeMs}ms Latency
            </span>
          </div>
        </div>

        {/* Website Status */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Storefront Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold text-emerald-800">Online & Serving</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              Cache Hit: {serverMetrics.cacheHitRatio}%
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: DOMAIN MANAGEMENT TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-600" /> Connected Web Domains
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage custom domains and subdomains configured to route to your EUREKA store.
            </p>
          </div>
          <button
            onClick={() => setShowDnsGuide(!showDnsGuide)}
            className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-4"
          >
            <Info className="w-3.5 h-3.5" />
            {showDnsGuide ? 'Hide DNS Setup Guide' : 'View DNS Setup Instructions'}
          </button>
        </div>

        {/* DNS Setup Guide Card */}
        {showDnsGuide && (
          <div className="p-5 bg-amber-50/50 border-b border-amber-100 space-y-4">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">How to point your domain to EUREKA:</h3>
                <p className="text-xs text-amber-900 mt-0.5">
                  Sign in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains, Cloudflare) and add these 2 DNS records:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900">Step 1: Apex / Root Domain (A Record)</span>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-mono text-[10px]">Type: A</span>
                </div>
                <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg border border-stone-200 font-mono text-xs">
                  <span>Host: <strong>@</strong> &nbsp;|&nbsp; Value: <strong>199.36.158.100</strong></span>
                  <button
                    onClick={() => copyToClipboard('199.36.158.100', 'a-rec')}
                    className="text-stone-500 hover:text-stone-900"
                    title="Copy IP"
                  >
                    {copiedKey === 'a-rec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900">Step 2: WWW Subdomain (CNAME)</span>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-mono text-[10px]">Type: CNAME</span>
                </div>
                <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg border border-stone-200 font-mono text-xs">
                  <span>Host: <strong>www</strong> &nbsp;|&nbsp; Value: <strong>domains.eurekabd.com</strong></span>
                  <button
                    onClick={() => copyToClipboard('domains.eurekabd.com', 'cname-rec')}
                    className="text-stone-500 hover:text-stone-900"
                    title="Copy Target"
                  >
                    {copiedKey === 'cname-rec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Domains List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 text-stone-600 text-xs uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Domain Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Routing Status</th>
                <th className="py-3 px-4">SSL / Security</th>
                <th className="py-3 px-4">Nameservers</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800 font-normal">
              {(domains || []).map(dom => (
                <tr key={dom.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    <div className="flex items-center gap-2">
                      <span>{dom.domain}</span>
                      <a
                        href={`https://${dom.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-400 hover:text-stone-700"
                        title="Open in new tab"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {dom.isPrimary ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" /> Primary Target
                      </span>
                    ) : (
                      <span className="text-xs text-stone-500 font-medium capitalize">
                        {dom.type}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {dom.status === 'Connected' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        <Clock className="w-3.5 h-3.5" /> Verifying DNS
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    {dom.sslStatus === 'Active' ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>TLS 1.3 ({dom.sslExpiryDays}d valid)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Provisioning Cert</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-stone-600">
                    {dom.nameservers.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {dom.status !== 'Connected' && (
                      <button
                        onClick={() => handleVerify(dom.id)}
                        disabled={isVerifying === dom.id}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition"
                      >
                        {isVerifying === dom.id ? 'Checking...' : 'Verify DNS'}
                      </button>
                    )}
                    {!dom.isPrimary && dom.status === 'Connected' && (
                      <button
                        onClick={() => setPrimaryDomain(dom.id, currentAdmin.name)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
                      >
                        Make Primary
                      </button>
                    )}
                    {!dom.isPrimary && (
                      <button
                        onClick={() => setDeleteTarget(dom)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete Domain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: SERVER & HOSTING HEALTH DIAGNOSTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hardware & Runtime Specifications */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-600" /> Runtime & Infrastructure Engine
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-stone-500">Operating Environment</span>
              <span className="font-semibold text-stone-900">Cloud Run Containers (Linux x86_64)</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-stone-500">Node.js Engine</span>
              <span className="font-semibold font-mono text-stone-900">{serverMetrics.nodeVersion}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-stone-500">PHP FastCGI Engine</span>
              <span className="font-semibold font-mono text-stone-900">{serverMetrics.phpVersion}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-stone-500">Database Connection Pool</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> {serverMetrics.databaseStatus} ({serverMetrics.databaseLatencyMs}ms)
              </span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-stone-500">Global Anycast CDN</span>
              <span className="font-semibold text-stone-900">{serverMetrics.cdnProvider}</span>
            </div>
          </div>
        </div>

        {/* Storage Usage Visual Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-600" /> Storage Capacity
            </h2>
            <span className="text-xs font-semibold text-stone-600">
              {serverMetrics.storageUsedGb} GB of {serverMetrics.storageTotalGb} GB
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden flex">
              <div className="bg-amber-600 h-full" style={{ width: '22%' }} title="Images: 11.2 GB"></div>
              <div className="bg-amber-400 h-full" style={{ width: '3%' }} title="Database: 1.4 GB"></div>
              <div className="bg-stone-400 h-full" style={{ width: '1.5%' }} title="Logs: 0.6 GB"></div>
              <div className="bg-emerald-500 h-full" style={{ width: '3.2%' }} title="Backups: 1.6 GB"></div>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>{storagePercentage}% Capacity Utilized</span>
              <span>{(serverMetrics.storageTotalGb - serverMetrics.storageUsedGb).toFixed(1)} GB Available</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span>
              <div>
                <p className="text-[11px] text-stone-500">Footwear Media</p>
                <p className="font-bold text-stone-900">11.2 GB</p>
              </div>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
              <div>
                <p className="text-[11px] text-stone-500">Database JSON</p>
                <p className="font-bold text-stone-900">1.4 GB</p>
              </div>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-stone-400"></span>
              <div>
                <p className="text-[11px] text-stone-500">Access Logs</p>
                <p className="font-bold text-stone-900">0.6 GB</p>
              </div>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <div>
                <p className="text-[11px] text-stone-500">Safe Backups</p>
                <p className="font-bold text-stone-900">1.6 GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bandwidth & Cache Performance */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" /> Bandwidth & Edge Cache
            </h2>
            <span className="text-xs font-semibold text-stone-600">
              {serverMetrics.bandwidthUsedGb} GB / {serverMetrics.bandwidthTotalGb} GB
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${bandwidthPercentage}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>{bandwidthPercentage}% Monthly Bandwidth Used</span>
              <span>Resets in 24 days</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Cache Hit Ratio</span>
              <span className="font-bold text-emerald-700">{serverMetrics.cacheHitRatio}% (Excellent)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Edge Compression</span>
              <span className="font-semibold text-stone-900">Brotli + Gzip Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">TLS Handshake</span>
              <span className="font-semibold text-stone-900">0-RTT Resumption</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePurge('pages')}
              disabled={isPurging}
              className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition"
            >
              Purge HTML Only
            </button>
            <button
              onClick={() => handlePurge('assets')}
              disabled={isPurging}
              className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition"
            >
              Purge Images Only
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: DNS RECORDS INSPECTOR & EMAIL AUTHENTICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DNS Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-600" /> Live DNS Record Registry
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Authoritative DNS records configured for this application.</p>
            </div>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterDns('all')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  filterDns === 'all' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-600'
                }`}
              >
                All ({dnsRecords.length})
              </button>
              <button
                onClick={() => setFilterDns('propagated')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  filterDns === 'propagated' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-600'
                }`}
              >
                Propagated
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Name / Host</th>
                  <th className="py-2.5 px-4">Target Value</th>
                  <th className="py-2.5 px-4">TTL</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {(dnsRecords || []).map((r, i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-4 font-bold text-amber-700">{r.type}</td>
                    <td className="py-2.5 px-4 font-semibold text-stone-900">{r.name}</td>
                    <td className="py-2.5 px-4 text-stone-600 max-w-xs truncate">{r.value}</td>
                    <td className="py-2.5 px-4 text-stone-500">{r.ttl}</td>
                    <td className="py-2.5 px-4 text-right font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Authentication Security Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <MailCheck className="w-4 h-4 text-amber-600" /> Domain Email Security (Deliverability)
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Essential protocols ensuring transactional order receipts and customer emails never land in spam folders.
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SPF (Sender Policy Framework)
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">v=spf1 include:_spf.google.com ~all</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">PASS</span>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> DKIM (2048-Bit Cryptographic Key)
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5">RSA signature valid for outgoing mail</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">PASS</span>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> DMARC Enforcement Policy
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">p=reject (Full anti-spoofing)</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">STRICT</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONNECT DOMAIN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">Connect Custom Domain</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDomainSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Domain Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-mono">https://</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shop.leathercraft.com or mybrand.com"
                    value={newDomainInput}
                    onChange={e => setNewDomainInput(e.target.value)}
                    className="w-full pl-20 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Do not include trailing slashes or subpaths.</p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Domain Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center text-center transition ${
                    newDomainType === 'custom' ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-bold' : 'border-stone-200 text-stone-600'
                  }`}>
                    <input
                      type="radio"
                      name="domainType"
                      checked={newDomainType === 'custom'}
                      onChange={() => setNewDomainType('custom')}
                      className="sr-only"
                    />
                    <span>Custom Root Domain</span>
                    <span className="text-[10px] text-stone-500 font-normal mt-0.5">e.g. yourbrand.com</span>
                  </label>

                  <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center text-center transition ${
                    newDomainType === 'subdomain' ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-bold' : 'border-stone-200 text-stone-600'
                  }`}>
                    <input
                      type="radio"
                      name="domainType"
                      checked={newDomainType === 'subdomain'}
                      onChange={() => setNewDomainType('subdomain')}
                      className="sr-only"
                    />
                    <span>Store Subdomain</span>
                    <span className="text-[10px] text-stone-500 font-normal mt-0.5">e.g. shop.yourbrand.com</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 space-y-1">
                <p className="font-bold text-stone-800">Automatic SSL Provisioning:</p>
                <p className="text-[11px] leading-relaxed">
                  After connecting, an automated Let's Encrypt TLS 1.3 certificate will be generated as soon as your DNS records propagate.
                </p>
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
                  Register Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAFETY CONFIRMATION MODAL FOR DESTRUCTIVE ACTION (Strict Safety Rule) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Disconnect Domain?</h3>
                <p className="text-xs text-stone-500">Confirm domain deletion</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to disconnect <strong className="font-mono text-stone-900">{deleteTarget.domain}</strong>?
              Visitors navigating to this address will no longer reach your storefront.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <strong>Safety Guard:</strong> This action removes the routing alias but does not touch your store catalog or products.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteDomain(deleteTarget.id, currentAdmin.name);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
              >
                Yes, Disconnect Domain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
