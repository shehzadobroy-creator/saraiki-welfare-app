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
  CreditCard,
  Gift,
  Lock,
  UserPlus,
  LogIn,
  LogOut
} from 'lucide-react';

// --- MOCK DATA: PHYSICAL PRIZES (INAMAT) ---

const TIERS = [
  { id: 'tier10', name: 'Daily Relief', amount: 10, reward: 'Mobile Recharge / Grocery Coupon', rewardVal: 1000, cycle: 'Daily', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'tier50', name: 'Weekly Support', amount: 50, reward: 'Pedestal Fan / Kitchen Appliance', rewardVal: 5000, cycle: '5 Days', color: 'bg-emerald-200 text-emerald-900' },
  { id: 'tier100', name: 'Fortnightly Aid', amount: 100, reward: 'Smart Tablet / Mobile Phone', rewardVal: 10000, cycle: '10 Days', color: 'bg-emerald-300 text-emerald-900' },
  { id: 'tier500', name: 'Monthly Security', amount: 500, reward: 'Solar Inverter / 32" LED TV', rewardVal: 50000, cycle: 'Monthly', color: 'bg-amber-100 text-amber-800' },
  { id: 'tier5000', name: 'Grand Relief', amount: 5000, reward: '125cc Motorbike / Solar System Setup', rewardVal: 500000, cycle: 'Bi-Monthly', color: 'bg-amber-200 text-amber-900' },
];

const INITIAL_BENEFICIARIES = [
  { id: 1, name: 'Ahmed Khan', city: 'Multan', tier: 'Rs. 100', prize: 'Smart Tablet', date: '27 Jul 2026', status: 'Delivered' },
  { id: 2, name: 'Sara Ali', city: 'Bahawalpur', tier: 'Rs. 50', prize: 'Pedestal Fan', date: '26 Jul 2026', status: 'Delivered' },
  { id: 3, name: 'Faisal Mehmood', city: 'Rahim Yar Khan', tier: 'Rs. 10', prize: 'Rs. 1000 Mobile Card', date: '26 Jul 2026', status: 'Delivered' },
  { id: 4, name: 'Zainab Bibi', city: 'Dera Ghazi Khan', tier: 'Rs. 500', prize: '32" LED TV', date: '25 Jul 2026', status: 'Delivered' },
  { id: 5, name: 'Hassan Raza', city: 'Layyah', tier: 'Rs. 100', prize: 'Smart Phone', date: '24 Jul 2026', status: 'Delivered' },
];

// --- HELPER COMPONENTS ---

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
    Delivered: "bg-emerald-100 text-emerald-700",
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // Null means logged out
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Form Inputs for Auth
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCity, setAuthCity] = useState('');

  // Admin Login Dialog State
  const [adminPassInput, setAdminPassInput] = useState('');

  // App Data State
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

  // User Auth Handlers
  const handleRegister = (e) => {
    e.preventDefault();
    if (!authName || !authPhone || !authPassword || !authCity) {
      alert("Tammam fields fill karein.");
      return;
    }
    const newUser = {
      name: authName,
      phone: authPhone,
      city: authCity,
      balance: 0,
      id: `SWP-${Math.floor(1000 + Math.random() * 9000)}`,
      tier: null
    };
    setCurrentUser(newUser);
    alert(`Mubarak ho! Aapka account ban gaya hai. Aapki Community ID hai: ${newUser.id}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authPhone || !authPassword) {
      alert("Phone number aur Password darj karein.");
      return;
    }
    // Demo login setup
    setCurrentUser({
      name: authPhone === "03092365857" ? "Shahzad" : "Registered User",
      phone: authPhone,
      city: "Karachi",
      balance: 250,
      id: "SWP-8842",
      tier: null
    });
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPassInput === "admin123") {
      setIsAdminLoggedIn(true);
      setAdminPassInput('');
    } else {
      alert("Ghalat Admin Password! Dobara koshish karein.");
    }
  };

  // --- VIEWS ---

  const AuthView = () => (
    <Card className="p-6 max-w-md mx-auto my-10 border-t-4 border-t-emerald-600">
      <div className="text-center mb-6">
        <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Saraiki Welfare Program</h2>
        <p className="text-xs text-slate-500 mt-1">Aapke Support se Community ki Welfare</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setAuthMode('login')} 
          className={`flex-1 py-2 font-semibold text-sm transition-all ${authMode === 'login' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400'}`}
        >
          Login
        </button>
        <button 
          onClick={() => setAuthMode('register')} 
          className={`flex-1 py-2 font-semibold text-sm transition-all ${authMode === 'register' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400'}`}
        >
          New Register
        </button>
      </div>

      {authMode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
            <input 
              type="text" 
              placeholder="03001234567" 
              value={authPhone}
              onChange={(e) => setAuthPhone(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required 
            />
          </div>
          <Button type="submit" className="w-full py-3">
            <LogIn className="w-4 h-4" /> Login Karein
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Mian Muhammad" 
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
            <input 
              type="text" 
              placeholder="03001234567" 
              value={authPhone}
              onChange={(e) => setAuthPhone(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City / Shehar</label>
            <input 
              type="text" 
              placeholder="Multan / Karachi" 
              value={authCity}
              onChange={(e) => setAuthCity(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required 
            />
          </div>
          <Button type="submit" className="w-full py-3">
            <UserPlus className="w-4 h-4" /> Account Banayein
          </Button>
        </form>
      )}
    </Card>
  );

  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Current Support Balance</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">Rs. {currentUser.balance}</h3>
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
              <h3 className="text-xl font-bold text-slate-800 mt-1">{currentUser.tier ? currentUser.tier.name : 'Not Joined'}</h3>
              <p className="text-xs text-amber-600 mt-1">
                {currentUser.tier ? `Prize Target: ${currentUser.tier.reward}` : 'Select a tier to begin'}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Community ID</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{currentUser.id}</h3>
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
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-800">Support Tiers & Qemeti Inamat</h3>
          </div>
          <div className="space-y-3">
            {TIERS.map((tier) => (
              <div key={tier.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${tier.color}`}>
                    Rs. {tier.amount}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{tier.name}</h4>
                    <p className="text-xs font-semibold text-emerald-700">Inam: {tier.reward}</p>
                    <p className="text-[11px] text-slate-400">Cycle: {tier.cycle} | Worth: Rs. {tier.rewardVal.toLocaleString()}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="text-xs py-1 px-3"
                  onClick={() => {
                    setCurrentUser({...currentUser, tier});
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
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Inam Winners</h3>
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
                  <p className="font-bold text-emerald-600">{b.prize}</p>
                  <Badge status={b.status} />
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-emerald-600"
              onClick={() => setCurrentView('ledger')}
            >
              View Full Public Ledger &rarr;
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const ContributionView = () => {
    const [selectedTier, setSelectedTier] = useState(currentUser?.tier || null);
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
        alert("Shukriya! Aapki contribution jama ho gayi hai. Admin verify karke support cycle mein shamil karega.");
      }, 1200);
    };

    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Make a Support Contribution</h2>
        <p className="text-slate-500 mb-6">EasyPaisa par raqam bhej kar Transaction ID neeche darj karein.</p>
        
        {/* EasyPaisa Box */}
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
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Screenshot (Proof)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Tap to attach screenshot</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Selected Target Inam: <strong>{selectedTier.reward}</strong> (Rs. {selectedTier.amount})</span>
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
          <h2 className="text-2xl font-bold text-slate-800">Public Inamat Ledger</h2>
          <p className="text-slate-500 text-xs">Transparent record of all community prize distributions.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Name or City" 
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs">
              <th className="p-3 font-semibold text-slate-600">Winner</th>
              <th className="p-3 font-semibold text-slate-600">City</th>
              <th className="p-3 font-semibold text-slate-600">Support Tier</th>
              <th className="p-3 font-semibold text-slate-600">Prize Awarded</th>
              <th className="p-3 font-semibold text-slate-600">Date</th>
              <th className="p-3 font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {beneficiaries.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium text-slate-800">{b.name}</td>
                <td className="p-3 text-slate-600">{b.city}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                    {b.tier}
                  </span>
                </td>
                <td className="p-3 font-bold text-emerald-700">{b.prize}</td>
                <td className="p-3 text-slate-600">{b.date}</td>
                <td className="p-3"><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const AdminView = () => {
    if (!isAdminLoggedIn) {
      return (
        <Card className="p-6 max-w-md mx-auto my-10 border-t-4 border-t-amber-500">
          <div className="text-center mb-6">
            <Lock className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-slate-800">Admin Panel Protection</h2>
            <p className="text-xs text-slate-500">Sirf Authorized Admin login kar sakte hain.</p>
          </div>
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Password</label>
              <input 
                type="password" 
                placeholder="Enter Admin Password" 
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full py-3">
              Unlock Admin Panel
            </Button>
          </form>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Admin Control Panel</h2>
          <button 
            onClick={() => setIsAdminLoggedIn(false)}
            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg font-semibold hover:bg-red-200"
          >
            Lock Admin
          </button>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Contributions for Verification</h3>
          {adminContributions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
              <p>Tamam contributions verify ho chuki hain!</p>
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
  };

  // If user is not logged in, show Auth View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans p-4">
        <AuthView />
      </div>
    );
  }

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
                <p className="text-sm font-medium text-slate-800">{currentUser.name}</p>
                <p className="text-xs text-emerald-600 font-bold">{currentUser.city} • ID: {currentUser.id}</p>
              </div>
              <button 
                onClick={() => setCurrentUser(null)} 
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
          {/* Sidebar */}
          <aside className={`md:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <nav className="space-y-2 bg-white md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-slate-200 shadow-sm md:shadow-none">
              <NavItem view="dashboard" icon={Home} label="Dashboard" />
              <NavItem view="contribute" icon={Wallet} label="Contribute" />
              <NavItem view="ledger" icon={FileText} label="Public Ledger" />
              <NavItem view="history" icon={History} label="My History" />
              <NavItem view="admin" icon={Lock} label="Admin Panel" />
            </nav>

            <div className="mt-6 p-4 bg-emerald-900 rounded-xl text-white shadow-md">
              <h4 className="font-bold text-emerald-200 mb-2">Program Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Total Members</span>
                  <span className="font-bold">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Prizes Distributed</span>
                  <span className="font-bold">450+ Items</span>
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
