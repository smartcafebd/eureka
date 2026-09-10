import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { TransactionType, PaymentMethodName } from '../../types';
import {
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  Plus,
  Trash2,
  Calendar,
  Wallet,
  Building2,
  Smartphone,
  Layers,
} from 'lucide-react';

export const AdminAccounting: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, currentAdmin } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | PaymentMethodName>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txType, setTxType] = useState<TransactionType>('Income');
  const [txCategory, setTxCategory] = useState('Product Sales');
  const [txAmount, setTxAmount] = useState(2500);
  const [txMethod, setTxMethod] = useState<PaymentMethodName>('Bank');
  const [txNotes, setTxNotes] = useState('');

  // Calculate Account Balances
  const totalIncome = transactions.filter((t) => t.type === 'Income' || t.type === 'Investment').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'Expense' || t.type === 'Withdrawal').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const cashBalance = transactions
    .filter((t) => t.paymentMethod === 'Cash')
    .reduce((s, t) => (t.type === 'Income' || t.type === 'Investment' ? s + t.amount : s - t.amount), 0);

  const bankBalance = transactions
    .filter((t) => t.paymentMethod === 'Bank')
    .reduce((s, t) => (t.type === 'Income' || t.type === 'Investment' ? s + t.amount : s - t.amount), 0);

  const mobileBalance = transactions
    .filter((t) => t.paymentMethod === 'bKash' || t.paymentMethod === 'Nagad' || t.paymentMethod === 'Rocket')
    .reduce((s, t) => (t.type === 'Income' || t.type === 'Investment' ? s + t.amount : s - t.amount), 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesMethod = filterMethod === 'all' || t.paymentMethod === filterMethod;
    const matchesSearch =
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.relatedOrderId && t.relatedOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesMethod && matchesSearch;
  });

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(
      {
        date: txDate,
        type: txType,
        category: txCategory,
        amount: txAmount,
        paymentMethod: txMethod,
        notes: txNotes,
        createdBy: currentAdmin.name,
      },
      currentAdmin.name
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" /> Pipe-to-Pipe Accounting Ledger
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Single transparent financial ledger linking sales, expenses, disbursements, and investor capital.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" /> Record Ledger Transaction
        </button>
      </div>

      {/* Account Balances Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-stone-900 text-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
            <span>Net Liquid Balance</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">৳{netBalance.toLocaleString()}</div>
          <span className="text-[10px] text-stone-400">Total in-hand across all payment channels</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex justify-between items-center text-emerald-800 text-xs mb-1">
            <span>Bank Account</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900">৳{bankBalance.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-700">Prime Bank & City Bank current accounts</span>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
          <div className="flex justify-between items-center text-pink-800 text-xs mb-1">
            <span>bKash & Nagad (MFS)</span>
            <Smartphone className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-bold text-pink-900">৳{mobileBalance.toLocaleString()}</div>
          <span className="text-[10px] text-pink-700">Merchant gateway and agent wallets</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex justify-between items-center text-amber-800 text-xs mb-1">
            <span>Petty Cash</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900">৳{cashBalance.toLocaleString()}</div>
          <span className="text-[10px] text-amber-700">Workshop and showroom cash registers</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category, description, order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="py-2 px-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="all">All Transaction Types</option>
          <option value="Income">Income (Revenue / Sales)</option>
          <option value="Expense">Expense (Operating & Product)</option>
          <option value="Investment">Investment (Capital Injection)</option>
          <option value="Withdrawal">Withdrawal (Investor Dividend)</option>
        </select>

        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value as any)}
          className="py-2 px-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="all">All Payment Channels</option>
          <option value="Bank">Bank Account</option>
          <option value="bKash">bKash</option>
          <option value="Nagad">Nagad</option>
          <option value="Cash">Cash (COD / Petty Cash)</option>
          <option value="Card">Card / Payment Gateway</option>
        </select>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-stone-50">
          <div>
            <h4 className="font-bold text-gray-900 text-xs">General Financial Ledger ({filteredTransactions.length} entries)</h4>
            <p className="text-[11px] text-gray-500">Every single inflow and outflow logged with date and payment channel.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4">Accounting Category</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Notes & Voucher</th>
                <th className="py-3 px-4 text-right">Inflow (+) / Outflow (-)</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((t) => {
                const isPositive = t.type === 'Income' || t.type === 'Investment';
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{t.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.type === 'Income'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.type === 'Investment'
                            ? 'bg-purple-100 text-purple-800'
                            : t.type === 'Withdrawal'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-rose-600" />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{t.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-medium text-[11px]">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs">{t.notes}</td>
                    <td className="py-3 px-4 text-right font-bold text-sm">
                      <span className={isPositive ? 'text-emerald-700' : 'text-rose-700'}>
                        {isPositive ? '+' : '-'}৳{t.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{t.createdBy}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD TRANSACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" /> Record Accounting Transaction
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTx} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Transaction Date</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Flow Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 border rounded-lg font-semibold"
                  >
                    <option value="Income">Income (Money In)</option>
                    <option value="Expense">Expense (Money Out)</option>
                    <option value="Investment">Investment (Capital In)</option>
                    <option value="Withdrawal">Withdrawal (Dividend Out)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  placeholder="e.g. Bulk Shoe Sales / Courier Bill"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Amount (৳)</label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Payment Method</label>
                  <select
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value as PaymentMethodName)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Bank">Bank Account</option>
                    <option value="Cash">Cash (COD / Hand)</option>
                    <option value="bKash">bKash Merchant</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Notes / Voucher Reference</label>
                <input
                  type="text"
                  required
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder="e.g. Bank deposit slip #98124"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                >
                  Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
