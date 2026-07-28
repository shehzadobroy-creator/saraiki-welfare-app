import React, { useState, useEffect } from 'react';
import { 
  Wallet, Users, History, FileText, CheckCircle, TrendingUp, Menu, X, Upload, Search, ShieldCheck, Home 
} from 'lucide-react';
import { supabase } from './supabaseClient';

const TIERS = [
  { id: 'tier10', name: 'Daily Relief', amount: 10, reward: 1000, cycle: 'Daily', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'tier50', name: 'Weekly Support', amount: 50, reward: 5000, cycle: '5 Days', color: 'bg-emerald-200 text-emerald-900' },
  { id: 'tier100', name: 'Fortnightly Aid', amount: 100, reward: 10000, cycle: '10 Days', color: 'bg-emerald-300 text-emerald-900' },
  { id: 'tier500', name: 'Monthly Security', amount: 500, reward: 50000, cycle: 'Monthly', color: 'bg-amber-100 text-amber-800' },
  { id: 'tier5000', name: 'Grand Relief', amount: 5000, reward: 500000, cycle: 'Bi-Monthly', color: 'bg-amber-200 text-amber-900' },
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
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
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

export default function SaraikiWelfareApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({ name: "Mian Muhammad", city: "Multan", balance: 250, id: "SWP-8842", tier: null });

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: bData } = await supabase.from('beneficiaries').select('*');
      if (bData) setBeneficiaries(bData);

      const { data: cData } = await supabase.from('contributions').select('*').order('created_at', { ascending: false });
      if (cData) setContributions(cData);

      setLoading(false);
    }
    fetchData();
  }, []);

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <p className="text-slate-500 text-sm font-medium">Current Support Balance</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">Rs. {user.balance}</h3>
        </Card>
        <Card className="p-6 border-l-4 border-l-amber-500">
          <p className="text-slate-500 text-sm font-medium">Active Support Cycle</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{user.tier ? user.tier.name : 'Not Joined'}</h3>
        </Card>
        <Card className="p-6 border-l-4 border-l-blue-500">
          <p className="text-slate-500 text-sm font-medium">Community ID</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">{user.id}</h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Select Support Tier</h3>
          <div className="space-y-3">
            {TIERS.map((tier) => (
              <div key={tier.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">{tier.name}</h4>
                  <p className="text-xs text-slate-500">Cycle: {tier.cycle} | Assistance: Rs. {tier.reward.toLocaleString()}</p>
                </div>
                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => setUser({ ...user, tier })}>
                  Join Cycle
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Beneficiaries</h3>
          {loading ? <p>Loading data...</p> : (
            <div className="space-y-4">
              {beneficiaries.slice(0, 4).map((b) => (
                <div key={b.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <p className="font-medium text-slate-800">{b.name}</p>
                    <p className="text-xs text-slate-500">{b.city} • {b.date}</p>
                  </div>
                  <p className="font-bold text-emerald-600">{b.amount}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  const ContributionView = () => {
    const [selectedTier, setSelectedTier] = useState(null);
    const [txId, setTxId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedTier || !txId) return;

      setIsSubmitting(true);
      const { data, error } = await supabase.from('contributions').insert([
        {
          user_name: user.name,
          tier: selectedTier.name,
          amount: selectedTier.amount,
          tx_id: txId,
          status: 'Pending'
        }
      ]).select();

      setIsSubmitting(false);

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Contribution successfully submitted!");
        if (data) setContributions([data[0], ...contributions]);
        setTxId('');
        setSelectedTier(null);
      }
    };

    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Make a Contribution</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIERS.map(tier => (
              <div 
                key={tier.id} 
                onClick={() => setSelectedTier(tier)}
                className={`cursor-pointer border-2 rounded-xl p-4 ${selectedTier?.id === tier.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
              >
                <p className="font-bold text-slate-800">Rs. {tier.amount}</p>
                <p className="text-sm text-slate-500">{tier.name}</p>
              </div>
            ))}
          </div>

          {selectedTier && (
            <div className="space-y-4">
              <input 
                type="text" 
                value={txId} 
                onChange={(e) => setTxId(e.target.value)} 
                placeholder="Transaction ID (JazzCash/EasyPaisa)" 
                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" 
                required 
              />
              <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
              </Button>
            </div>
          )}
        </form>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-lg font-bold text-slate-800">Saraiki Welfare Program</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-emerald-600">Rs. {user.balance}</span>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full text-left p-3 rounded-lg font-medium ${currentView === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>Dashboard</button>
          <button onClick={() => setCurrentView('contribute')} className={`w-full text-left p-3 rounded-lg font-medium ${currentView === 'contribute' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>Contribute</button>
        </aside>

        <main className="flex-1">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'contribute' && <ContributionView />}
        </main>
      </div>
    </div>
  );
        }
