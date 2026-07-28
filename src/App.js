import React, { useState } from 'react';
import { 
  Wallet, 
  Users, 
  History, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Menu, 
  X, 
  Upload, 
  Search,
  ShieldCheck,
  Home,
  Copy,
  CreditCard
} from 'lucide-react';

// --- MOCK DATA & UTILS ---

const TIERS = [
  { id: 'tier10', name: 'Daily Relief', amount: 10, reward: 1000, cycle: 'Daily', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'tier50', name: 'Weekly Support', amount: 50, reward: 5000, cycle: '5 Days', color: 'bg-emerald-200 text-emerald-900' },
  { id: 'tier100', name: 'Fortnightly Aid', amount: 100, reward: 10000, cycle: '10 Days', color: 'bg-emerald-300 text-emerald-900' },
  { id: 'tier500', name: 'Monthly Security', amount: 500, reward: 50000, cycle: 'Monthly', color: 'bg-amber-100 text-amber-800' },
  { id: 'tier5000', name: 'Grand Relief', amount: 5000, reward: 500000, cycle: 'Bi-Monthly', color: 'bg-amber-200 text-amber-900' },
];

const INITIAL_BENEFICIARIES = [
  { id: 1, name: 'Ahmed Khan', city: 'Multan', tier: 'Rs. 100', amount: 'Rs. 10,000', date: '27 Jul 2026', status: 'Verified' },
  { id: 2, name: 'Sara Ali', city: 'Bahawalpur', tier: 'Rs. 50', amount: 'Rs. 5,000', date: '26 Jul 2026', status: 'Verified' },
  { id: 3, name: 'Faisal Mehmood', city: 'Rahim Yar Khan', tier: 'Rs. 10', amount: 'Rs. 1,000', date: '26 Jul 2026', status: 'Verified' },
  { id: 4, name: 'Zainab Bibi', city: 'Dera Ghazi Khan', tier: 'Rs. 500', amount: 'Rs. 50,000', date: '25 Jul 2026', status: 'Verified' },
  { id: 5, name: 'Hassan Raza', city: 'Layyah', tier: 'Rs. 100', amount: 'Rs. 10,000', date: '24 Jul 2026', status: 'Verified' },
];

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, type = "button" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-100",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    ghost: "text-slate-600 hover:bg-slate-50",
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    Verified: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Active: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
};

// --- MAIN APPLICATION ---

export default function SaraikiWelfareApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // State Management
  const [user, setUser] = useState({
    name: "Shahzad",
    city: "Karachi",
    balance: 250,
    id: "SWP-8842",
    tier: null,
    contributions: []
  });

  const [contributions, setContributions] = useState([
    { id: 101, tier: 'tier100', amount: 100, date: '27 Jul 2026', status: 'Verified', txId: 'JC882910' }
  ]);

  const [beneficiaries] = useState(INITIAL_BENEFICIARIES);
  const [adminContributions, setAdminContributions] = useState([
    { id: 201, user: "Ahmed Khan", tier: 'tier50', amount: 50, status: 'Pending', proof: 'screenshot.png', txId: 'EP99182' },
    { id: 202, user: "Fatima Noor", tier: 'tier10', amount: 10, status: 'Pending', proof: 'jazzcash.jpg', txId: 'JC112233' },
  ]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('03092365857');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- VIEWS ---

  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Current Support Balance</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">Rs. {user.balance}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-full">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Support Cycle</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{user.tier ? user.tier.name : 'Not Joined'}</h3>
              <p className="text-xs text-amber-600 mt-1">
                {user.tier ? `Potential Assistance: Rs. ${user.tier.reward.toLocaleString()}` : 'Select a tier to begin'}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Community ID</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{user.id}</h3>
              <p className="text-xs text-blue-600 mt-1">Verified Member</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Select Support Tier</h3>
          <div className="space-y-3">
            {TIERS.map((tier) => (
              <div key={tier.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${tier.color}`}>
                    Rs. {tier.amount}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{tier.name}</h4>
                    <p className="text-xs text-slate-500">Cycle: {tier.cycle} | Assistance: Rs. {tier.reward.toLocaleString()}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="text-sm py-1 px-3"
                  onClick={() => {
                    setUser({...user, tier});
                    setCurrentView('contribute');
                  }}
                >
                  Join Cycle
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Community Beneficiaries</h3>
          <div className="space-y-4">
            {beneficiaries.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{b.name}</p>
                    <p className="text-xs text-slate-500">{b.city} • {b.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">{b.amount}</p>
                  <Badge status={b.status} />
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-emerald-600"
              onClick={() => setCurrentView('ledger')}
            >
              View Full Ledger &rarr;
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const ContributionView = () => {
    const [selectedTier, setSelectedTier] = useState(user.tier || null);
    const [txId, setTxId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!selectedTier) return;
      
      setIsSubmitting(true);
      setTimeout(() => {
        const newContribution = {
          id: Date.now(),
          tier: selectedTier.id,
          amount: selectedTier.amount,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'Pending',
          txId: txId
        };
        
        setContributions([newContribution, ...contributions]);
        setSelectedTier(null);
        setTxId('');
        setIsSubmitting(false);
        alert("Contribution submitted! Admin will verify your Transaction ID.");
      }, 1200);
    };

    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Make a Contribution</h2>
        <p className="text-slate-500 mb-6">Send payment via EasyPaisa and enter Transaction ID below.</p>
        
        {/* EasyPaisa Payment Box */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-5 rounded-2xl mb-6 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">Official EasyPaisa Account</span>
            <CreditCard className="w-6 h-6 opacity-80" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-emerald-100">Account Title</p>
            <h4 className="text-2xl font-extrabold tracking-wide">Shahzad</h4>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/50 flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-100">EasyPaisa Number</p>
              <p className="text-xl font-mono font-bold">03092365857</p>
            </div>
            <button 
              onClick={handleCopyNumber}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Tier</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIERS.map(tier => (
                <div 
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${selectedTier?.id === tier.id ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-emerald-300'}`}
                >
                  <p className="font-bold text-slate-800">Rs. {tier.amount}</p>
                  <p className="text-xs text-slate-500">{tier.name}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedTier && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction ID (EasyPaisa / JazzCash)</label>
                <input 
                  type="text" 
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder="e.g., 3892019284"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Screenshot (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Tap to attach screenshot proof</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Selected Tier: <strong>{selectedTier.name} (Rs. {selectedTier.amount})</strong></span>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-base"
                disabled={!txId || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
              </Button>
            </div>
          )}
        </form>
      </Card>
    );
  };

  const LedgerView = () => (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Public Beneficiary Ledger</h2>
          <p className="text-slate-500">Transparent record of all community support distributions.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Name or City" 
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Recipient</th>
              <th className="p-4 text-sm font-semibold text-slate-600">City</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Support Tier</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Amount Received</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{b.name}</td>
                <td className="p-4 text-slate-600">{b.city}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                    {b.tier}
                  </span>
                </td>
                <td className="p-4 font-bold text-emerald-600">{b.amount}</td>
                <td className="p-4 text-slate-600">{b.date}</td>
                <td className="p-4"><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Admin Control Panel</h2>
        <Badge status="Active" />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Contributions for Verification</h3>
        {adminContributions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
            <p>All contributions have been verified!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {adminContributions.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    {item.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.user}</p>
                    <p className="text-xs text-slate-500">
                      Tier: {TIERS.find(t => t.id === item.tier)?.name} | 
                      TxID: {item.txId}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="text-xs py-1 px-3 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setAdminContributions(adminContributions.filter(i => i.id !== item.id))}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="primary" 
                    className="text-xs py-1 px-3"
                    onClick={() => setAdminContributions(adminContributions.filter(i => i.id !== item.id))}
                  >
                    Verify & Credit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  // --- LAYOUT ---

  const NavItem = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">Saraiki Welfare</h1>
                <p className="text-xs text-emerald-600 font-medium">Reward & Support Program</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-emerald-600 font-bold">Rs. {user.balance} Balance</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                {user.name.charAt(0)}
              </div>
            </div>

            <button 
              className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar / Mobile Navigation */}
          <aside className={`md:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <nav className="space-y-2 bg-white md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-slate-200 shadow-sm md:shadow-none">
              <NavItem view="dashboard" icon={Home} label="Dashboard" />
              <NavItem view="contribute" icon={Wallet} label="Contribute" />
              <NavItem view="ledger" icon={FileText} label="Public Ledger" />
              <NavItem view="history" icon={History} label="My History" />
              <NavItem view="admin" icon={Users} label="Admin Panel" />
            </nav>

            <div className="mt-6 p-4 bg-emerald-900 rounded-xl text-white shadow-md">
              <h4 className="font-bold text-emerald-200 mb-2">Community Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Total Members</span>
                  <span className="font-bold">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Distributed</span>
                  <span className="font-bold">Rs. 4.5M</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'contribute' && <ContributionView />}
            {currentView === 'ledger' && <LedgerView />}
            {currentView === 'history' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">My Contribution History</h2>
                <div className="space-y-4">
                  {contributions.map(c => (
                    <div key={c.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <p className="font-bold text-slate-800">Rs. {c.amount} - {TIERS.find(t => t.id === c.tier)?.name}</p>
                        <p className="text-xs text-slate-500">TxID: {c.txId} | {c.date}</p>
                      </div>
                      <Badge status={c.status} />
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {currentView === 'admin' && <AdminView />}
          </main>
        </div>
      </div>
    </div>
  );
}
