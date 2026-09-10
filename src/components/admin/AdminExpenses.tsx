import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MarketingPlatform,
  TransportExpenseType,
  EmployeeExpenseType,
  GeneralExpenseCategory,
} from '../../types';
import {
  DollarSign,
  Megaphone,
  Truck,
  Users,
  Building,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Search,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminExpenses: React.FC = () => {
  const {
    marketingExpenses,
    addMarketingExpense,
    deleteMarketingExpense,
    transportExpenses,
    addTransportExpense,
    deleteTransportExpense,
    employees,
    addEmployee,
    deleteEmployee,
    employeeExpenses,
    addEmployeeExpense,
    deleteEmployeeExpense,
    generalExpenses,
    addGeneralExpense,
    deleteGeneralExpense,
    products,
    metrics,
    currentAdmin,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'marketing' | 'transport' | 'staff' | 'general'>('marketing');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Marketing Form
  const [mktDate, setMktDate] = useState(new Date().toISOString().split('T')[0]);
  const [mktPlatform, setMktPlatform] = useState<MarketingPlatform>('Facebook Ads');
  const [mktCampaign, setMktCampaign] = useState('');
  const [mktAmount, setMktAmount] = useState(5000);
  const [mktDesc, setMktDesc] = useState('');
  const [mktProduct, setMktProduct] = useState(products[0]?.id || '');
  const [mktImpressions, setMktImpressions] = useState(25000);
  const [mktClicks, setMktClicks] = useState(1200);
  const [mktConversions, setMktConversions] = useState(18);

  // Transport Form
  const [trpDate, setTrpDate] = useState(new Date().toISOString().split('T')[0]);
  const [trpType, setTrpType] = useState<TransportExpenseType>('Courier Bills');
  const [trpAmount, setTrpAmount] = useState(2500);
  const [trpDesc, setTrpDesc] = useState('');
  const [trpVehicle, setTrpVehicle] = useState('Delivery Van');
  const [trpPerson, setTrpPerson] = useState('Staff Rider');

  // Staff Expense Form
  const [empDate, setEmpDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [empExpenseType, setEmpExpenseType] = useState<EmployeeExpenseType>('Salary');
  const [empAmount, setEmpAmount] = useState(30000);
  const [empDesc, setEmpDesc] = useState('');

  // Add Employee Form
  const [isNewEmpModalOpen, setIsNewEmpModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<'Master Craftsman' | 'Officer' | 'Manager' | 'Delivery Staff' | 'Sales Staff' | 'Warehouse Assistant'>('Officer');
  const [newEmpPhone, setNewEmpPhone] = useState('01811-000000');
  const [newEmpSalary, setNewEmpSalary] = useState(25000);

  // General Expense Form
  const [genDate, setGenDate] = useState(new Date().toISOString().split('T')[0]);
  const [genCategory, setGenCategory] = useState<GeneralExpenseCategory>('Office Rent');
  const [genAmount, setGenAmount] = useState(10000);
  const [genDesc, setGenDesc] = useState('');
  const [genPaymentMethod, setGenPaymentMethod] = useState('Bank');

  // Handlers
  const handleAddMarketing = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketingExpense(
      {
        date: mktDate,
        platform: mktPlatform,
        campaignName: mktCampaign || `${mktPlatform} Campaign`,
        amount: mktAmount,
        description: mktDesc,
        relatedProductId: mktProduct,
        impressions: mktImpressions,
        clicks: mktClicks,
        conversions: mktConversions,
        createdBy: currentAdmin.name,
      },
      currentAdmin.name
    );
    setIsModalOpen(false);
  };

  const handleAddTransport = (e: React.FormEvent) => {
    e.preventDefault();
    addTransportExpense(
      {
        date: trpDate,
        expenseType: trpType,
        amount: trpAmount,
        description: trpDesc,
        vehicle: trpVehicle,
        driverOrPerson: trpPerson,
        createdBy: currentAdmin.name,
      },
      currentAdmin.name
    );
    setIsModalOpen(false);
  };

  const handleAddStaffExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === selectedEmpId);
    if (!emp) return;

    addEmployeeExpense(
      {
        date: empDate,
        employeeId: emp.id,
        employeeName: emp.name,
        expenseType: empExpenseType,
        amount: empAmount,
        description: empDesc || `${empExpenseType} disbursement`,
        paymentMethod: 'Bank',
        createdBy: currentAdmin.name,
      },
      currentAdmin.name
    );
    setIsModalOpen(false);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name: newEmpName,
      role: newEmpRole,
      phone: newEmpPhone,
      joiningDate: new Date().toISOString().split('T')[0],
      salary: newEmpSalary,
      status: 'active',
    });
    setIsNewEmpModalOpen(false);
  };

  const handleAddGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    addGeneralExpense(
      {
        date: genDate,
        category: genCategory,
        amount: genAmount,
        description: genDesc,
        paymentMethod: genPaymentMethod,
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
            <DollarSign className="w-5 h-5 text-amber-600" /> Operational Expense Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Pipe-to-pipe operational expenses automatically synchronized with the General Accounting Ledger.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" /> Add New Expense
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <span className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
            <Megaphone className="w-3.5 h-3.5" /> Marketing & Ads
          </span>
          <div className="text-2xl font-bold text-amber-900 mt-1">৳{metrics.totalMarketingCost.toLocaleString()}</div>
          <span className="text-[10px] text-amber-700">{marketingExpenses.length} campaigns recorded</span>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <span className="text-[11px] font-bold text-blue-800 uppercase flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Transport & Freight
          </span>
          <div className="text-2xl font-bold text-blue-900 mt-1">৳{metrics.totalTransportCost.toLocaleString()}</div>
          <span className="text-[10px] text-blue-700">{transportExpenses.length} transport logs</span>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
          <span className="text-[11px] font-bold text-indigo-800 uppercase flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Staff & Payroll
          </span>
          <div className="text-2xl font-bold text-indigo-900 mt-1">৳{metrics.totalStaffCost.toLocaleString()}</div>
          <span className="text-[10px] text-indigo-700">{employees.length} active employees</span>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
            <Building className="w-3.5 h-3.5" /> General & Utilities
          </span>
          <div className="text-2xl font-bold text-emerald-900 mt-1">৳{metrics.totalOtherCost.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-700">{generalExpenses.length} office & utility expenses</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('marketing')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'marketing'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Marketing & Ads ({marketingExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'transport'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Truck className="w-4 h-4" /> Transport & Logistics ({transportExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'staff'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" /> Staff, Payroll & Advances ({employeeExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4" /> General Business & Utilities ({generalExpenses.length})
        </button>
      </div>

      {/* TAB 1: MARKETING EXPENSES */}
      {activeTab === 'marketing' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Platform & Channel</th>
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Spend (৳)</th>
                  <th className="py-3 px-4">Impressions / Clicks</th>
                  <th className="py-3 px-4">Conversions</th>
                  <th className="py-3 px-4">Cost / Conversion</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {marketingExpenses.map((m) => {
                  const cpa = m.conversions && m.conversions > 0 ? Math.round(m.amount / m.conversions) : null;
                  return (
                    <tr key={m.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-500">{m.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded font-semibold text-[11px]">
                          {m.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">{m.campaignName}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-xs block">{m.description}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">৳{m.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {m.impressions?.toLocaleString() || 0} imp / {m.clicks?.toLocaleString() || 0} clicks
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{m.conversions || 0} orders</td>
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {cpa ? `৳${cpa.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteMarketingExpense(m.id)}
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
      )}

      {/* TAB 2: TRANSPORT & LOGISTICS */}
      {activeTab === 'transport' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expense Type</th>
                  <th className="py-3 px-4">Amount (৳)</th>
                  <th className="py-3 px-4">Vehicle / Driver</th>
                  <th className="py-3 px-4">Description / Consignment</th>
                  <th className="py-3 px-4">Authorized Admin</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transportExpenses.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-500">{t.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded font-semibold text-[11px]">
                        {t.expenseType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">৳{t.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <div>{t.vehicle || 'N/A'}</div>
                      <span className="text-[10px] text-gray-500">{t.driverOrPerson}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-sm">{t.description}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{t.createdBy}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteTransportExpense(t.id)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF & PAYROLL */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Staff Directory Header */}
          <div className="flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Personnel & Craft Master Directory</h3>
              <p className="text-xs text-gray-500">Master shoemakers, store managers, and delivery staff.</p>
            </div>
            <button
              onClick={() => setIsNewEmpModalOpen(true)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
            >
              + Add New Staff Member
            </button>
          </div>

          {/* Employees List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {employees.map((emp) => (
              <div key={emp.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm">{emp.name}</h4>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-semibold">
                      {emp.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{emp.phone}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Monthly Base:</span>
                    <span className="font-bold text-gray-900">৳{emp.salary.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEmpId(emp.id);
                      setEmpAmount(emp.salary);
                      setEmpExpenseType('Salary');
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[10px] font-semibold"
                  >
                    Disburse &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Employee Expenses History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 font-bold text-gray-900 text-xs">
              Payroll & Staff Disbursements History
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Staff Name</th>
                    <th className="py-3 px-4">Disbursement Type</th>
                    <th className="py-3 px-4">Amount (৳)</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Disbursed By</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employeeExpenses.map((ee) => (
                    <tr key={ee.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-500">{ee.date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{ee.employeeName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded font-semibold text-[11px]">
                          {ee.expenseType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">৳{ee.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700">{ee.description}</td>
                      <td className="py-3 px-4 text-gray-900">{ee.createdBy}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteEmployeeExpense(ee.id)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GENERAL & OTHER EXPENSES */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount (৳)</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Description / Voucher</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {generalExpenses.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-500">{g.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold text-[11px]">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">৳{g.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">{g.paymentMethod}</td>
                    <td className="py-3 px-4 text-gray-700 max-w-sm">{g.description}</td>
                    <td className="py-3 px-4 text-gray-900">{g.createdBy}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteGeneralExpense(g.id)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" /> Record {activeTab.toUpperCase()} Expense
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* MARKETING EXPENSE FORM */}
            {activeTab === 'marketing' && (
              <form onSubmit={handleAddMarketing} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Expense Date</label>
                    <input
                      type="date"
                      required
                      value={mktDate}
                      onChange={(e) => setMktDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Marketing Platform</label>
                    <select
                      value={mktPlatform}
                      onChange={(e) => setMktPlatform(e.target.value as MarketingPlatform)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="TikTok Ads">TikTok Ads</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Influencer Cost">Influencer Cost</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="Photography">Photography</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Boosting">Boosting</option>
                      <option value="Other Marketing">Other Marketing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Campaign Name / Objective</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clark Cycle Shoes Conversion Boost"
                    value={mktCampaign}
                    onChange={(e) => setMktCampaign(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Amount Spent (৳)</label>
                    <input
                      type="number"
                      required
                      value={mktAmount}
                      onChange={(e) => setMktAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Associated Shoe Model</label>
                    <select
                      value={mktProduct}
                      onChange={(e) => setMktProduct(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">General Brand Campaign</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Impressions</label>
                    <input
                      type="number"
                      value={mktImpressions}
                      onChange={(e) => setMktImpressions(Number(e.target.value))}
                      className="w-full p-1.5 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Clicks</label>
                    <input
                      type="number"
                      value={mktClicks}
                      onChange={(e) => setMktClicks(Number(e.target.value))}
                      className="w-full p-1.5 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Orders (Conversions)</label>
                    <input
                      type="number"
                      value={mktConversions}
                      onChange={(e) => setMktConversions(Number(e.target.value))}
                      className="w-full p-1.5 border rounded font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Description / Targeting Notes</label>
                  <input
                    type="text"
                    value={mktDesc}
                    onChange={(e) => setMktDesc(e.target.value)}
                    placeholder="e.g. Males 22-45 in Dhaka, Chittagong"
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
                    Record & Sync Ledger
                  </button>
                </div>
              </form>
            )}

            {/* TRANSPORT EXPENSE FORM */}
            {activeTab === 'transport' && (
              <form onSubmit={handleAddTransport} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={trpDate}
                      onChange={(e) => setTrpDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Expense Type</label>
                    <select
                      value={trpType}
                      onChange={(e) => setTrpType(e.target.value as TransportExpenseType)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Courier Bills">Courier Bills (Steadfast / Pathao)</option>
                      <option value="Delivery Transport">Delivery Transport</option>
                      <option value="Product Collection">Product Collection</option>
                      <option value="Supplier Transport">Supplier Transport (Leather Freight)</option>
                      <option value="Fuel">Fuel (Bike / Van)</option>
                      <option value="CNG">CNG</option>
                      <option value="Truck">Truck</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Motorcycle">Motorcycle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Amount (৳)</label>
                    <input
                      type="number"
                      required
                      value={trpAmount}
                      onChange={(e) => setTrpAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Vehicle / Courier</label>
                    <input
                      type="text"
                      value={trpVehicle}
                      onChange={(e) => setTrpVehicle(e.target.value)}
                      placeholder="e.g. Steadfast Courier / Van"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Driver / Representative</label>
                  <input
                    type="text"
                    value={trpPerson}
                    onChange={(e) => setTrpPerson(e.target.value)}
                    placeholder="e.g. Rakibul Hasan (Delivery Staff)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trip / Freight Description</label>
                  <input
                    type="text"
                    required
                    value={trpDesc}
                    onChange={(e) => setTrpDesc(e.target.value)}
                    placeholder="e.g. 50 orders dispatched via Steadfast"
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
                    Record & Sync Ledger
                  </button>
                </div>
              </form>
            )}

            {/* STAFF EXPENSE FORM */}
            {activeTab === 'staff' && (
              <form onSubmit={handleAddStaffExpense} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={empDate}
                      onChange={(e) => setEmpDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Staff Member</label>
                    <select
                      value={selectedEmpId}
                      onChange={(e) => setSelectedEmpId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Disbursement Type</label>
                    <select
                      value={empExpenseType}
                      onChange={(e) => setEmpExpenseType(e.target.value as EmployeeExpenseType)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Salary">Monthly Salary</option>
                      <option value="Advance">Advance Payout</option>
                      <option value="Bonus">Festival / Performance Bonus</option>
                      <option value="Commission">Sales Commission</option>
                      <option value="Food">Food / Tiffin Allowance</option>
                      <option value="Transport">Transport Fare</option>
                      <option value="Mobile Bill">Mobile & Internet Bill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Amount (৳)</label>
                    <input
                      type="number"
                      required
                      value={empAmount}
                      onChange={(e) => setEmpAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Voucher / Payment Description</label>
                  <input
                    type="text"
                    required
                    value={empDesc}
                    onChange={(e) => setEmpDesc(e.target.value)}
                    placeholder="e.g. September Salary disbursed via Bank"
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
                    Record & Sync Ledger
                  </button>
                </div>
              </form>
            )}

            {/* GENERAL EXPENSE FORM */}
            {activeTab === 'general' && (
              <form onSubmit={handleAddGeneral} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={genDate}
                      onChange={(e) => setGenDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Category</label>
                    <select
                      value={genCategory}
                      onChange={(e) => setGenCategory(e.target.value as GeneralExpenseCategory)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Office Rent">Office & Factory Rent</option>
                      <option value="Electricity">Electricity Bill (DESCO/DPDC)</option>
                      <option value="Internet">Internet Connection</option>
                      <option value="Phone">Phone & Hotline Bill</option>
                      <option value="Packaging">Packaging Boxes & Dust Bags</option>
                      <option value="Printing">Printing & Marketing Collateral</option>
                      <option value="Software">Software & Cloud Services</option>
                      <option value="Hosting">Hosting / Server VPS</option>
                      <option value="Domain">Domain Name Registration</option>
                      <option value="Maintenance">Shoemaking Machinery Maintenance</option>
                      <option value="Bank Charges">Bank & Gateway Transaction Fees</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Amount (৳)</label>
                    <input
                      type="number"
                      required
                      value={genAmount}
                      onChange={(e) => setGenAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Payment Method</label>
                    <select
                      value={genPaymentMethod}
                      onChange={(e) => setGenPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Bank">Bank Account</option>
                      <option value="Cash">Petty Cash</option>
                      <option value="bKash">bKash Merchant</option>
                      <option value="Nagad">Nagad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Bill / Invoice Description</label>
                  <input
                    type="text"
                    required
                    value={genDesc}
                    onChange={(e) => setGenDesc(e.target.value)}
                    placeholder="e.g. DESCO Workshop meter billing voucher #8921"
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
                    Record & Sync Ledger
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NEW EMPLOYEE MODAL */}
      {isNewEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Add Team Member / Craftsman
              </h3>
              <button onClick={() => setIsNewEmpModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="e.g. Master Shoemaker Harun"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Designation / Role</label>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Master Craftsman">Master Craftsman</option>
                    <option value="Manager">Manager</option>
                    <option value="Officer">Officer</option>
                    <option value="Delivery Staff">Delivery Staff</option>
                    <option value="Sales Staff">Sales Staff</option>
                    <option value="Warehouse Assistant">Warehouse Assistant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Monthly Salary (৳)</label>
                  <input
                    type="number"
                    required
                    value={newEmpSalary}
                    onChange={(e) => setNewEmpSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewEmpModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white font-semibold rounded-xl"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
