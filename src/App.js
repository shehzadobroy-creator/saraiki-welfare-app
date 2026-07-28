import React, { useState } from 'react';
import { 
  Wallet, 
  History, 
  FileText, 
  CheckCircle, 
  Menu, 
  X, 
  Upload, 
  Search,
  ShieldCheck,
  Home,
  Copy,
  CreditCard,
  Gift,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';

// --- TIERS WITH DIRECT IMAGE LINKS ---
const TIERS = [
  { 
    id: 'tier10', 
    name: 'Daily Relief', 
    amount: 10, 
    reward: 'Mobile Recharge Coupon', 
    rewardVal: 1000, 
    cycle: 'Daily', 
    color: 'bg-emerald-100 text-emerald-800',
    // Mobile Scratch Card / Recharge Image
    image: 'https://images.unsplash.com/photo-1556742049-0a670fc8077a?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'tier50', 
    name: 'Weekly Support', 
    amount: 50, 
    reward: 'Pedestal Fan / Kitchen Appliance', 
    rewardVal: 5000, 
    cycle: '5 Days', 
    color: 'bg-emerald-200 text-emerald-900',
    // Home Appliance / Electric Fan Image
    image: 'https://images.unsplash.com/photo-1618953798485-a63525acee41?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'tier100', 
    name: 'Fortnightly Aid', 
    amount: 100, 
    reward: 'Smart Tablet / Mobile Phone', 
    rewardVal: 10000, 
    cycle: '10 Days', 
    color: 'bg-emerald-300 text-emerald-900',
    // Smartphone / Tablet Image
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'tier500', 
    name: 'Monthly Security', 
    amount: 500, 
    reward: '32" Smart LED TV', 
    rewardVal: 50000, 
    cycle: 'Monthly', 
    color: 'bg-amber-100 text-amber-800',
    // LED TV Image
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 'tier5000', 
    name: 'Grand Relief', 
    amount: 5000, 
    reward: '125cc Motorbike / Solar Setup', 
    rewardVal: 500000, 
    cycle: 'Bi-Monthly', 
    color: 'bg-amber-200 text-amber-900',
    // Motorbike Image
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80' 
  },
];

const INITIAL_BENEFICIARIES = [
  { id: 1, name: 'Ahmed Khan', city: 'Multan', tier: 'Rs. 100', prize: 'Smart Tablet', date: '27 Jul 2026', status: 'Delivered' },
  { id: 2, name: 'Sara Ali', city: 'Bahawalpur', tier: 'Rs. 50', prize: 'Pedestal Fan', date: '26 Jul 2026', status: 'Delivered' },
  { id: 3, name: 'Faisal Mehmood', city: 'Rahim Yar Khan', tier: 'Rs. 10', prize: 'Rs. 1000 Mobile Card', date: '26 Jul 2026', status: 'Delivered' },
  { id: 4, name: 'Zainab Bibi', city: 'Dera Ghazi Khan', tier: 'Rs. 500', prize: '32" LED TV', date: '25 Jul 2026', status: 'Delivered' },
];

// --- HELPER COMPONENTS ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, type = "button" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm";
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
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
};

// --- MAIN APPLICATION ---
export default function UserApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCity, setAuthCity] = useState('');

  const [contributions, setContributions] = useState([
    { id: 101, tier: 'tier100', amount: 100, date: '27 Jul 2026', status: 'Verified', txId: 'JC882910' }
  ]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('03092365857');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!authName || !authPhone || !authPassword || !authCity) return;
    const newUser = {
      name: authName,
      phone: authPhone,
      city: authCity,
      balance: 0,
      id: `SWP-${Math.floor(1000 + Math.random() * 9000)}`,
      tier: null
    };
    setCurrentUser(newUser);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authPhone || !authPassword) return;
    setCurrentUser({
      name: "Shahzad Member",
      phone: authPhone,
      city: "Karachi",
      balance: 100,
      id: "SWP-8842",
      tier: null
    });
  };

  // --- VIEWS ---

  const AuthView = () => (
    <Card className="p-6 max-w-md mx-auto my-10 border-t-4 border-t-emerald-600">
      <div className="text-center mb-6">
        <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Saraiki Welfare Program</h2>
        <p className="text-xs text-slate-500 mt-1">Apna Account Login Ya Register Karein</p>
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
              className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-medium">Support Balance</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">Rs. {currentUser.balance}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-full">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-medium">Target Inam</p>
              <h3 className="text-lg font-bold text-slate-800 mt-1">
                {currentUser.tier ? currentUser.tier.reward : 'Koi Tier Select Nahi'}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-medium">Community ID</p>
              <h3 className="text-lg font-bold text-slate-800 mt-1">{currentUser.id}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Inamat Showcase Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Support Tiers & Qemeti Inamat</h3>
          <span className="text-xs text-slate-500">Select any tier to join</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <Card key={tier.id} className="group hover:shadow-lg transition-all duration-300">
              {/* Prize Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={tier.image} 
                  alt={tier.reward} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-slate-800 shadow-sm">
                  Valued ~ Rs. {tier.rewardVal.toLocaleString()}
                </div>
                <div className={`absolute bottom-3 left-3 ${tier.color} px-3 py-1 rounded-lg text-xs font-bold`}>
                  Tier: Rs. {tier.amount} ({tier.cycle})
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3">
                <h4 className="font-bold text-slate-800 text-lg leading-snug">{tier.reward}</h4>
                <p className="text-xs text-slate-500">{tier.name} Cycle - Shamil hone ke liye sirf Rs. {tier.amount} ki contribution karein.</p>
                
                <Button 
                  variant="primary" 
                  className="w-full mt-2"
                  onClick={() => {
                    setCurrentUser({...currentUser, tier});
                    setCurrentView('contribute');
                  }}
                >
                  Join Cycle (Rs. {tier.amount})
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Winners */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Aakhri Inam Jeetnay Wale Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_BENEFICIARIES.map((b) => (
            <div key={b.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">{b.name}</span>
                <Badge status={b.status} />
              </div>
              <p className="text-xs text-slate-500">{b.city} • {b.date}</p>
              <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
                <span className="text-xs text-slate-400">{b.tier}</span>
                <span className="text-xs font-bold text-emerald-700">{b.prize}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
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
        alert("Shukriya! Aapki contribution submit ho gayi hai. Verification ke baad cycle active ho jaye gi.");
      }, 1000);
    };

    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Contribution Karein</h2>
        <p className="text-slate-500 text-xs mb-6">EasyPaisa par raqam bhej kar Transaction ID neeche darj karein.</p>
        
        {/* EasyPaisa Box */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-5 rounded-2xl mb-6 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">EasyPaisa Payment Account</span>
            <CreditCard className="w-5 h-5 opacity-80" />
          </div>
          <div>
            <p className="text-xs text-emerald-100">Account Title</p>
            <h4 className="text-2xl font-extrabold tracking-wide">Shahzad</h4>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/50 flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-100">Number</p>
              <p className="text-xl font-mono font-bold">03092365857</p>
            </div>
            <button 
              onClick={handleCopyNumber}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1. Select Tier</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIERS.map(tier => (
                <div 
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${selectedTier?.id === tier.id ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-emerald-300'}`}
                >
                  <p className="font-bold text-slate-800">Rs. {tier.amount}</p>
                  <p className="text-[11px] text-slate-500 truncate">{tier.reward}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedTier && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">2. Transaction ID (EasyPaisa)</label>
                <input 
                  type="text" 
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder="e.g., 3892019284"
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">3. Payment Screenshot (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Attach Screenshot</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 p-3 rounded-lg text-xs font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
          <p className="text-slate-500 text-xs">Tamam inamat ki tafseelat transparent record ke sath.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Name or City" 
            className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-300 rounded-lg outline-none text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="p-3 font-semibold">Winner Name</th>
              <th className="p-3 font-semibold">City</th>
              <th className="p-3 font-semibold">Tier</th>
              <th className="p-3 font-semibold">Inam (Prize)</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {INITIAL_BENEFICIARIES.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-800">{b.name}</td>
                <td className="p-3 text-slate-600">{b.city}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
                <p className="text-xs text-emerald-600 font-medium">Inamat & Support Program</p>
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
          {/* Sidebar Navigation */}
          <aside className={`md:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <nav className="space-y-2 bg-white md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-slate-200 shadow-sm md:shadow-none">
              <NavItem view="dashboard" icon={Home} label="Dashboard" />
              <NavItem view="contribute" icon={Wallet} label="Contribute" />
              <NavItem view="ledger" icon={FileText} label="Public Ledger" />
              <NavItem view="history" icon={History} label="My History" />
            </nav>
          </aside>

          {/* Main View Area */}
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
          </main>
        </div>
      </div>
    </div>
  );
}
