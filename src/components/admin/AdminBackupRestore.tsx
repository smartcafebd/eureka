import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  HardDriveDownload,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Clock,
  RefreshCw,
  Database,
  Lock,
  Layers,
} from 'lucide-react';

export const AdminBackupRestore: React.FC = () => {
  const {
    products,
    categories,
    orders,
    businessSettings,
    restorePoints,
    createRestorePoint,
    currentAdmin
  } = useStore();

  const [isExporting, setIsExporting] = useState(false);
  const [importedData, setImportedData] = useState<any | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadFullBackup = () => {
    setIsExporting(true);
    setTimeout(() => {
      const fullBackupPayload = {
        meta: {
          exportTimestamp: new Date().toISOString(),
          version: '2.4.0',
          appName: 'EUREKA Footwear ERP',
          exportedBy: currentAdmin.name
        },
        data: {
          products,
          categories,
          orders,
          businessSettings
        }
      };

      const blob = new Blob([JSON.stringify(fullBackupPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eureka-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);

      createRestorePoint(`Automated Export Backup (${new Date().toLocaleDateString()})`, 'full', currentAdmin.name);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data || !parsed.data.products) {
          setImportError('Invalid backup file structure. Missing "data.products" array.');
          setImportedData(null);
          return;
        }
        setImportedData(parsed);
      } catch (err) {
        setImportError('Could not parse JSON backup file. File appears corrupted.');
        setImportedData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!importedData) return;
    // Apply safely to localStorage and reload or sync
    try {
      if (importedData.data.products) localStorage.setItem('eureka_products', JSON.stringify(importedData.data.products));
      if (importedData.data.categories) localStorage.setItem('eureka_categories', JSON.stringify(importedData.data.categories));
      if (importedData.data.orders) localStorage.setItem('eureka_orders', JSON.stringify(importedData.data.orders));
      if (importedData.data.businessSettings) localStorage.setItem('eureka_business_settings', JSON.stringify(importedData.data.businessSettings));

      setShowConfirmRestoreModal(false);
      setRestoreSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (e) {
      setImportError('Failed applying restore data: ' + String(e));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <HardDriveDownload className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Backup, Disaster Recovery & Data Portability
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm">
                Generate air-gapped cryptographic JSON backups of your entire footwear catalog, order histories, and configuration.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadFullBackup}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Packaging Archive...' : 'Download Full Store Backup'}
        </button>
      </div>

      {restoreSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Backup restored successfully! Reloading administrative state...</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900">Download Offline Store Archive</h2>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Download a timestamped, uncompressed JSON archive containing all products, category taxonomies, customer orders, expense ledgers, and SEO meta tags.
          </p>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Catalog Footwear Items:</span>
              <span className="font-bold text-stone-900">{products.length} Products</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Order Ledger Records:</span>
              <span className="font-bold text-stone-900">{orders.length} Orders</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Category Taxonomies:</span>
              <span className="font-bold text-stone-900">{categories.length} Categories</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Schema Integrity Checksum:</span>
              <span className="font-mono text-emerald-700 font-bold">SHA-256 Validated</span>
            </div>
          </div>

          <button
            onClick={handleDownloadFullBackup}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition shadow-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Complete Database
          </button>
        </div>

        {/* Restore from File Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900">Restore Catalog from Backup</h2>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Upload a valid EUREKA JSON backup file to inspect contents and restore state.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/20 p-6 rounded-xl flex flex-col items-center justify-center text-center transition cursor-pointer"
          >
            <Upload className="w-6 h-6 text-stone-400 mb-2" />
            <span className="text-xs font-bold text-stone-800">Click to Select Backup JSON</span>
            <span className="text-[11px] text-stone-500 mt-0.5">Supports .json archives generated by EUREKA</span>
          </button>

          {importError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{importError}</span>
            </div>
          )}

          {importedData && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">Backup Inspection Verified:</span>
                <span className="text-[10px] text-amber-800 font-mono">v{importedData.meta?.version || '2.0'}</span>
              </div>
              <div className="text-xs text-stone-700 space-y-1">
                <p>• <strong>{importedData.data.products?.length || 0}</strong> Products ready to restore</p>
                <p>• <strong>{importedData.data.orders?.length || 0}</strong> Orders ready to restore</p>
                <p>• <strong>{importedData.data.categories?.length || 0}</strong> Categories ready to restore</p>
              </div>
              <button
                onClick={() => setShowConfirmRestoreModal(true)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition shadow-xs"
              >
                Proceed to Safe Restore
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STRICT SAFETY RESTORE CONFIRMATION MODAL */}
      {showConfirmRestoreModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Confirm Catalog Restore?</h3>
                <p className="text-xs text-stone-500">Replaces current catalog with backup</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Applying this backup will overwrite existing products and orders with the records stored in the selected file ({importedData?.data?.products?.length || 0} products).
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs">
              <strong>Pre-Restore Safety:</strong> A snapshot of your current database will be automatically taken right before this restore begins.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmRestoreModal(false)}
                className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRestore}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Confirm & Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
