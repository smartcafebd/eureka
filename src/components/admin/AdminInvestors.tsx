import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Investor } from '../../types';
import {
  Users,
  DollarSign,
  Plus,
  ArrowUpRight,
  TrendingUp,
  PieChart,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const AdminInvestors: React.FC = () => {
  const { investors, addInvestor, recordInvestorWithdrawal, metrics, currentAdmin } = useStore();

  // Modal State for New Investor
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [invName, setInvName] = useState('');
  const [invPhone, setInvPhone] = useState('01711-000000');
  const [invAmount, setInvAmount] = useState(500000);
  const [invShare, setInvShare] = useState(20);
  const [invNotes, setInvNotes] = useState('Working capital for shoe production and seasonal leather inventory');

  // Modal State for Dividend Withdrawal
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedInvestorId, setSelectedInvestorId] = useState(investors[0]?.id || '');
  const [withAmount, setWithAmount] = useState(50000);
  const [withMethod, setWithMethod] = useState<'Bank' | 'Cash' | 'bKash'>('Bank');
  const [withNotes, setWithNotes] = useState('Quarterly profit dividend payout');

  // Total Equity & Capital
  const totalInvestmentCapital = investors.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalWithdrawn = investors.reduce((sum, inv) => sum + (inv.totalProfitPaid ?? inv.totalWithdrawn ?? 0), 0);
  const totalEquityDistributed = investors.reduce((sum, inv) => sum + inv.sharePercentage, 0);

  const handleAddInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim()) return;

    addInvestor(
      {
        name: invName,
        phone: invPhone,
        investmentAmount: invAmount,
        investmentDate: new Date().toISOString().split('T')[0],
        sharePercentage: invShare,
        totalProfitPaid: 0,
        notes: invNotes,
        status: 'active',
      },
      currentAdmin.name
    );
    setIsInvestorModalOpen(false);
  };

  const handleRecordWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestorId) return;

    recordInvestorWithdrawal(selectedInvestorId, withAmount, withMethod, withNotes, currentAdmin.name);
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" /> Investor & Equity Partner Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Equity tracking, automated net profit share apportionment, and dividend disbursement logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-1 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition"
          >
            <ArrowUpRight className="w-4 h-4 text-rose-600" /> Record Dividend Payout
          </button>
          <button
            onClick={() => setIsInvestorModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" /> Add New Partner
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-stone-900 text-white rounded-xl p-4 shadow-sm">
          <div className="text-stone-400 text-xs font-semibold mb-1">Total Investor Capital</div>
          <div className="text-2xl font-bold">৳{totalInvestmentCapital.toLocaleString()}</div>
          <span className="text-[10px] text-stone-400">{investors.length} active funding partners</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-amber-800 text-xs font-semibold mb-1">Total Equity Allocated</div>
          <div className="text-2xl font-bold text-amber-900">{totalEquityDistributed}%</div>
          <span className="text-[10px] text-amber-700">Founder retains {100 - totalEquityDistributed}%</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="text-emerald-800 text-xs font-semibold mb-1">Net Business Profit (Pool)</div>
          <div className="text-2xl font-bold text-emerald-900">৳{metrics.netProfit.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-700">Basis for dividend allocation</span>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <div className="text-rose-800 text-xs font-semibold mb-1">Total Dividends Disbursed</div>
          <div className="text-2xl font-bold text-rose-900">৳{totalWithdrawn.toLocaleString()}</div>
          <span className="text-[10px] text-rose-700">Cumulative historical withdrawals</span>
        </div>
      </div>

      {/* Investor Cards / Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-stone-50 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Partner Ledger & Real-Time Profit Allocation</h4>
            <p className="text-[11px] text-gray-500">
              Theoretical profit entitlement calculated in real time: [Net Business Profit] × [Share %].
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Partner Name & Contact</th>
                <th className="py-3 px-4">Invested Capital</th>
                <th className="py-3 px-4">Equity Share</th>
                <th className="py-3 px-4">Net Profit Share Entitlement</th>
                <th className="py-3 px-4">Total Paid / Withdrawn</th>
                <th className="py-3 px-4">Net Remaining Balance</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {investors.map((inv) => {
                const entitledProfit = Math.round((metrics.netProfit * inv.sharePercentage) / 100);
                const paidProfit = inv.totalProfitPaid ?? inv.totalWithdrawn ?? 0;
                const netBalance = inv.investmentAmount + entitledProfit - paidProfit;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900 block text-sm">{inv.name}</span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {inv.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">৳{inv.investmentAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs">
                        {inv.sharePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700 block">৳{entitledProfit.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-500">Based on ৳{metrics.netProfit.toLocaleString()} net profit</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-rose-700">৳{paidProfit.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">৳{netBalance.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-500">{inv.investmentDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedInvestorId(inv.id);
                          setIsWithdrawModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-semibold"
                      >
                        Payout &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD INVESTOR MODAL */}
      {isInvestorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Add Investment Partner
              </h3>
              <button onClick={() => setIsInvestorModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInvestor} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Partner Full Name *</label>
                <input
                  type="text"
                  required
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  placeholder="e.g. Mahfuzul Alam"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={invPhone}
                  onChange={(e) => setInvPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Capital Invested (৳)</label>
                  <input
                    type="number"
                    required
                    value={invAmount}
                    onChange={(e) => setInvAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Equity Share (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={invShare}
                    onChange={(e) => setInvShare(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Agreement / Partnership Notes</label>
                <textarea
                  rows={3}
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvestorModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                >
                  Record Capital Injection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAWAL / DIVIDEND MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" /> Disburse Dividend / Capital Return
              </h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordWithdrawal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Select Partner</label>
                <select
                  value={selectedInvestorId}
                  onChange={(e) => setSelectedInvestorId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-semibold"
                >
                  {investors.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} (Share: {inv.sharePercentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Payout Amount (৳)</label>
                  <input
                    type="number"
                    required
                    value={withAmount}
                    onChange={(e) => setWithAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Disbursement Method</label>
                  <select
                    value={withMethod}
                    onChange={(e) => setWithMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Bank">Bank Transfer</option>
                    <option value="Cash">Cash Check</option>
                    <option value="bKash">bKash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Voucher Description / Note</label>
                <input
                  type="text"
                  required
                  value={withNotes}
                  onChange={(e) => setWithNotes(e.target.value)}
                  placeholder="e.g. Q3 Profit dividend via Prime Bank"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                >
                  Confirm Payout & Record in Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
