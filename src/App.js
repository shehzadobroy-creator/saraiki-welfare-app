import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CheckCircle2, Clock, AlertCircle, Briefcase, MessageSquareWarning, Shield, User, Phone, Mail,
  Stamp, Plus, X, LogOut, CalendarDays, MapPin, Siren, Globe, Megaphone, PlayCircle, ExternalLink,
  Eye, ArrowLeft, HeartHandshake, Landmark,
} from 'lucide-react';

// =========================================================================
// STORAGE HELPERS
// =========================================================================
const KEY_MEMBERS = 'sh:members';
const KEY_COMPLAINTS = 'sh:complaints';
const KEY_JOBS = 'sh:jobs';
const KEY_EVENTS = 'sh:events';
const KEY_ANNOUNCEMENTS = 'sh:announcements';
const KEY_DONATIONS = 'sh:donations';
const KEY_DONATION_ACCOUNTS = 'sh:donation_accounts';
const KEY_SESSION = 'sh:session';
const KEY_LANG = 'sh:lang';

async function loadShared(key, fallback) {
  try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : fallback; }
  catch (e) { return fallback; }
}
async function saveShared(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), true); } catch (e) {}
}
async function loadPersonal(key, fallback) {
  try { const r = await window.storage.get(key, false); return r ? JSON.parse(r.value) : fallback; }
  catch (e) { return fallback; }
}
async function savePersonal(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), false); } catch (e) {}
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function currentMonthKey() { const n = new Date(); return `${n.getFullYear()}-${n.getMonth()}`; }

// =========================================================================
// ORG INFO
// =========================================================================
const ORG = {
  nameUrdu: 'سرائیکی ہیلپ لائن',
  city: 'Karachi, Pakistan',
  phone: '923155441165', // WhatsApp/SOS number, international format no +
  phoneDisplay: '0315-544 1165',
  monthlyFee: 600,
  regWindow: '12–19 July 2026',
  bankAccountTitle: 'Saraiki Helpline Welfare Account', // TODO: replace with real account title
  bankAccountNumber: '0000-0000000-00',                  // TODO: replace with real account number
  bankName: 'Bank name here',                            // TODO: replace with real bank / JazzCash / Easypaisa
};

// =========================================================================
// TRANSLATIONS (best-effort — Saraiki strings should be reviewed by a
// native speaker before real-world use)
// =========================================================================
const TR = {
  en: {
    appName: 'Saraiki Helpline', tagline: 'Unity, Service & Brotherhood',
    guestBrowsing: 'Browsing as guest', register: 'Register', login: 'Log in', adminSignin: 'Admin sign-in',
    home: 'Home', benefits: 'Benefits', announcements: 'Announcements', jobs: 'Jobs', events: 'Events',
    complaints: 'Complaints', admin: 'Admin', logout: 'Log out', back: 'Back',
    membershipBenefits: 'Membership Benefits', regAnnouncement: 'New membership announcement',
    regWindowLabel: 'Registration window', membershipFee: 'Membership fee', helplineContact: 'Helpline contact',
    newMember: 'New Member — Register', alreadyMember: "I'm already a member",
    sosButton: 'SOS', sosConfirm: 'Send my live location to the helpline on WhatsApp?', sosSend: 'Send SOS',
    sosFetching: 'Fetching your location…', sosFailed: "Couldn't get your location — opening WhatsApp anyway, please describe your location.",
    guestNote: 'Register to file complaints and track your membership status.',
    fileComplaint: 'File a complaint', postJob: 'Post a job', postEvent: 'Post an event', postAnnouncement: 'Post announcement',
    pending: 'Pending', inProgress: 'In Progress', resolved: 'Resolved', active: 'Active', deactivated: 'Deactivated',
    upcoming: 'Upcoming', past: 'Past events', noJobs: 'No jobs posted yet.', noEvents: 'No events yet.',
    noAnnouncements: 'No announcements yet.', noComplaints: 'No complaints yet.',
    donation: 'Donation', donateNow: 'Donate', accountTitle: 'Account title', accountNumber: 'Account number',
    bankName: 'Bank / method', uploadScreenshot: 'Upload payment screenshot (optional)', yourName: 'Your name',
    donationAmount: 'Amount (Rs.)', submitDonation: 'Submit donation record', recentDonations: 'Recent donations',
    noDonations: 'No donations yet.', pendingDonations: 'Pending confirmation', confirmDonation: 'Confirm',
    donationSubmittedNote: 'Once confirmed by admin, this will be shown in the public donations feed.',
    donationThanks: 'Thank you! Your donation has been recorded and is awaiting admin confirmation.',
  },
  ur: {
    appName: 'سرائیکی ہیلپ لائن', tagline: 'اتحاد، خدمت اور بھائی چارہ',
    guestBrowsing: 'مہمان کے طور پر دیکھ رہے ہیں', register: 'رجسٹریشن', login: 'لاگ ان', adminSignin: 'ایڈمن سائن اِن',
    home: 'ہوم', benefits: 'فوائد', announcements: 'اعلانات', jobs: 'ملازمتیں', events: 'تقریبات',
    complaints: 'شکایات', admin: 'ایڈمن', logout: 'لاگ آؤٹ', back: 'واپس',
    membershipBenefits: 'ممبرشپ کے فوائد', regAnnouncement: 'نئی ممبرشپ کا اعلان',
    regWindowLabel: 'رجسٹریشن کی مدت', membershipFee: 'ممبرشپ فیس', helplineContact: 'ہیلپ لائن رابطہ',
    newMember: 'نیا ممبر — رجسٹر کریں', alreadyMember: 'میں پہلے سے ممبر ہوں',
    sosButton: 'ایس او ایس', sosConfirm: 'اپنی لائیو لوکیشن ہیلپ لائن کو واٹس ایپ پر بھیجیں؟', sosSend: 'ایس او ایس بھیجیں',
    sosFetching: 'آپ کی لوکیشن حاصل کی جا رہی ہے…', sosFailed: 'لوکیشن حاصل نہیں ہو سکی — واٹس ایپ کھولا جا رہا ہے، براہ کرم اپنی جگہ خود بتائیں۔',
    guestNote: 'شکایت درج کرنے اور ممبرشپ کی صورتحال دیکھنے کے لیے رجسٹر کریں۔',
    fileComplaint: 'شکایت درج کریں', postJob: 'جاب پوسٹ کریں', postEvent: 'ایونٹ پوسٹ کریں', postAnnouncement: 'اعلان پوسٹ کریں',
    pending: 'زیرِ التوا', inProgress: 'جاری ہے', resolved: 'حل شدہ', active: 'فعال', deactivated: 'غیر فعال',
    upcoming: 'آنے والے', past: 'گزشتہ تقریبات', noJobs: 'ابھی کوئی جاب پوسٹ نہیں ہوئی۔', noEvents: 'ابھی کوئی ایونٹ نہیں۔',
    noAnnouncements: 'ابھی کوئی اعلان نہیں۔', noComplaints: 'ابھی کوئی شکایت نہیں۔',
    donation: 'عطیہ', donateNow: 'عطیہ کریں', accountTitle: 'اکاؤنٹ ٹائٹل', accountNumber: 'اکاؤنٹ نمبر',
    bankName: 'بینک / طریقہ', uploadScreenshot: 'ادائیگی کا اسکرین شاٹ اپلوڈ کریں (اختیاری)', yourName: 'آپ کا نام',
    donationAmount: 'رقم (روپے)', submitDonation: 'عطیہ ریکارڈ جمع کریں', recentDonations: 'حالیہ عطیات',
    noDonations: 'ابھی کوئی عطیہ نہیں۔', pendingDonations: 'تصدیق کا انتظار', confirmDonation: 'تصدیق کریں',
    donationSubmittedNote: 'ایڈمن کی تصدیق کے بعد یہ عوامی فہرست میں دکھایا جائے گا۔',
    donationThanks: 'شکریہ! آپ کا عطیہ درج کر لیا گیا ہے، ایڈمن کی تصدیق کا انتظار ہے۔',
  },
  sr: {
    appName: 'سرائیکی ہیلپ لائن', tagline: 'اتحاد، خدمت تے ڈھاورا',
    guestBrowsing: 'مہمان بن کے ڈٹھوں پئے', register: 'رجسٹریشن', login: 'لاگ ان', adminSignin: 'ایڈمن سائن ان',
    home: 'گھر', benefits: 'فائدے', announcements: 'اعلان', jobs: 'نوکریاں', events: 'پروگرام',
    complaints: 'شکایتاں', admin: 'ایڈمن', logout: 'لاگ آؤٹ', back: 'پچھے',
    membershipBenefits: 'ممبرشپ دے فائدے', regAnnouncement: 'نویں ممبرشپ دا اعلان',
    regWindowLabel: 'رجسٹریشن دا ٹائم', membershipFee: 'ممبرشپ فیس', helplineContact: 'ہیلپ لائن رابطہ',
    newMember: 'نواں ممبر — رجسٹر تھیوو', alreadyMember: 'میں پہلوں ای ممبر ہاں',
    sosButton: 'ایس او ایس', sosConfirm: 'آپݨی لائیو لوکیشن ہیلپ لائن کوں واٹس ایپ تے گھلوں؟', sosSend: 'ایس او ایس گھلوں',
    sosFetching: 'آپݨی لوکیشن لبھی پئی ہے…', sosFailed: 'لوکیشن نہ لبھی — واٹس ایپ کھلدا پئے، مہربانی کریندے آپݨی جگہ آپ لکھو۔',
    guestNote: 'شکایت درج کرݨ تے ممبرشپ ولیکھݨ کیتے رجسٹر تھیوو۔',
    fileComplaint: 'شکایت درج کرو', postJob: 'نوکری پوسٹ کرو', postEvent: 'پروگرام پوسٹ کرو', postAnnouncement: 'اعلان پوسٹ کرو',
    pending: 'رُکیا ہویا', inProgress: 'ٻلدا پئے', resolved: 'حل تھی ڳئے', active: 'چالو', deactivated: 'بند',
    upcoming: 'ایندڑے', past: 'گزریا ہویا', noJobs: 'ہاڑ کوئی نوکری کائنی۔', noEvents: 'ہاڑ کوئی پروگرام کائنی۔',
    noAnnouncements: 'ہاڑ کوئی اعلان کائنی۔', noComplaints: 'ہاڑ کوئی شکایت کائنی۔',
    donation: 'عطیہ', donateNow: 'عطیہ کرو', accountTitle: 'اکاؤنٹ ٹائٹل', accountNumber: 'اکاؤنٹ نمبر',
    bankName: 'بینک / طریقہ', uploadScreenshot: 'ادائیگی دا اسکرین شاٹ لاؤ (اختیاری)', yourName: 'آپݨا ناں',
    donationAmount: 'رقم (روپے)', submitDonation: 'عطیہ درج کرو', recentDonations: 'ہاڑولے عطیات',
    noDonations: 'ہاڑ کوئی عطیہ کائنی۔', pendingDonations: 'تصدیق دا انتظار', confirmDonation: 'تصدیق کرو',
    donationSubmittedNote: 'ایڈمن دی تصدیق دے بعد ایہ سبھناں کوں نظر ایسی۔',
    donationThanks: 'شکریہ! آپݨا عطیہ درج تھی ڳئے، ایڈمن دی تصدیق دا انتظار ہے۔',
  },
};

const BENEFITS = [
  { title: 'Lazmi Tadfeen Muawanat', titleUrdu: 'لازمی تدفین معاونت', desc: 'Registered member ke gharele zaruri kaifiyat mein wafaat ki soorat mein Rs. 50,000 foori maali muawanat.' },
  { title: 'Qanooni Muawanat', titleUrdu: 'قانونی معاونت', desc: 'Zaroorat mand members ko kachehri ke muamlaat mein behtareen qanooni mashwara aur muawanat faraham ki jaayegi.' },
  { title: 'Blood Donation Service', titleUrdu: 'بلڈ ڈونیشن سروس', desc: 'Emergency mein khoon ke ihtiyaj ka intezam aur rozmarra ki rehnumai ki jaayegi.' },
  { title: 'Tibbi Muawanat', titleUrdu: 'طبی معاونت', desc: 'Sarkari hospitalon mein ilaj, rehnumai aur zaroori tibbi sahulaat ke husool mein taawun.' },
  { title: 'Job Bank', titleUrdu: 'جاب بینک', desc: 'Members aur unke bachon ke liye rozgar aur education se mutaliq mukhtalif masail ke hal, rehnumai aur muawanat.' },
  { title: 'Samaji Falahi Sargarmiyan', titleUrdu: 'سماجی فلاحی سرگرمیاں', desc: 'Saraiki community ki falah-o-behbood ke liye mukhtalif samaji sargarmiyon ka inteqad.' },
];

// =========================================================================
// SEED DATA
// =========================================================================
function seedJobs() {
  const now = Date.now();
  return [
    { id: uid(), title: 'Customer Support Officer — Karachi (Saddar)', desc: 'Saraiki/Urdu bolne wala customer support officer chahiye. Timing 10am-6pm, salary Rs. 35,000-40,000.', date: now - 3600e3 * 6 },
    { id: uid(), title: 'Driver Required — Rahim Yar Khan', desc: 'Experienced driver chahiye, valid license zaroori. Rehaishi sahulat available.', date: now - 3600e3 * 30 },
    { id: uid(), title: 'Data Entry Assistant (Remote)', desc: 'Basic Excel ki maloomat rakhne wale ke liye part-time remote kaam.', date: now - 3600e3 * 72 },
  ];
}
function seedEvents() {
  const now = Date.now();
  return [{
    id: uid(), title: 'Saraiki Waseb Milap — Karachi Gathering', location: 'Saraiki Cultural Hall, Nazimabad, Karachi',
    date: now + 3600e3 * 24 * 12,
    desc: 'Karachi mein rehne wale Saraiki community members ke liye milap event — waseb ki thaqafat aur networking session.',
    postedDate: now - 3600e3 * 20, videoUrl: '',
  }];
}
function seedAnnouncements() {
  const now = Date.now();
  return [{
    id: uid(), title: 'Naya membership registration window khul gaya hai',
    body: 'Registration window 12–19 July 2026 tak khula hai. Naye members ko cards bhi diye jayenge. Zyada maloomat ke liye Benefits section dekhein.',
    date: now - 3600e3 * 10, videoUrl: '',
  }];
}
function seedDonations() {
  const now = Date.now();
  return [{ id: uid(), name: 'Anonymous Member', amount: 2000, status: 'confirmed', hasScreenshot: true, date: now - 3600e3 * 40 }];
}
function seedDonationAccounts() {
  return [{ id: uid(), method: 'Bank Transfer', title: ORG.bankAccountTitle, number: ORG.bankAccountNumber }];
}
async function ensureSeeded(jobs, events, complaints, announcements, donations, donationAccounts) {
  const newJobs = jobs.length === 0 ? seedJobs() : jobs;
  const newEvents = events.length === 0 ? seedEvents() : events;
  const newAnnouncements = announcements.length === 0 ? seedAnnouncements() : announcements;
  const newDonations = donations.length === 0 ? seedDonations() : donations;
  const newDonationAccounts = donationAccounts.length === 0 ? seedDonationAccounts() : donationAccounts;
  if (jobs.length === 0) await saveShared(KEY_JOBS, newJobs);
  if (events.length === 0) await saveShared(KEY_EVENTS, newEvents);
  if (announcements.length === 0) await saveShared(KEY_ANNOUNCEMENTS, newAnnouncements);
  if (donations.length === 0) await saveShared(KEY_DONATIONS, newDonations);
  if (donationAccounts.length === 0) await saveShared(KEY_DONATION_ACCOUNTS, newDonationAccounts);
  return { jobs: newJobs, events: newEvents, complaints, announcements: newAnnouncements, donations: newDonations, donationAccounts: newDonationAccounts };
}

// =========================================================================
// VIDEO EMBED — YouTube plays inline; everything else is a preview card
// (Facebook does not allow arbitrary third-party embedding without their
// SDK + app review, so we can't provide a true inline FB player here)
// =========================================================================
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function VideoEmbed({ url }) {
  if (!url) return null;
  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 mt-2" style={{ aspectRatio: '16/9' }}>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}`}
          title="video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      className="mt-2 flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-slate-100 transition"
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <PlayCircle size={20} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-slate-700">External video link</div>
        <div className="text-[11px] text-slate-400 truncate">{url}</div>
      </div>
      <ExternalLink size={15} className="text-slate-400 shrink-0" />
    </a>
  );
}

// =========================================================================
// SOS BUTTON
// =========================================================================
function SosButton({ t }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | fetching | error

  const sendSos = () => {
    setStatus('fetching');
    if (!navigator.geolocation) {
      openWhatsapp(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => openWhatsapp(pos.coords),
      () => openWhatsapp(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const openWhatsapp = (coords) => {
    let text;
    if (coords) {
      const mapsLink = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
      text = `EMERGENCY — I need help. My live location: ${mapsLink}`;
    } else {
      setStatus('error');
      text = `EMERGENCY — I need help. (Could not fetch GPS location — please describe your location here.)`;
    }
    const url = `https://wa.me/${ORG.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setTimeout(() => { setOpen(false); setStatus('idle'); }, 1200);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 w-16 h-16 rounded-full bg-rose-600 text-white flex flex-col items-center justify-center shadow-lg animate-pulse active:scale-95 transition"
        style={{ boxShadow: '0 0 0 6px rgba(225,29,72,0.18), 0 6px 18px rgba(225,29,72,0.45)' }}
      >
        <Siren size={22} />
        <span className="text-[9px] font-bold mt-0.5">{t('sosButton')}</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 px-6" onClick={() => status !== 'fetching' && setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <Siren size={26} className="text-rose-600" />
            </div>
            {status === 'idle' && (
              <>
                <p className="text-sm text-slate-700 mb-4">{t('sosConfirm')}</p>
                <button onClick={sendSos} className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl mb-2">{t('sosSend')}</button>
                <button onClick={() => setOpen(false)} className="w-full text-slate-400 text-xs py-1">{t('back')}</button>
              </>
            )}
            {status === 'fetching' && <p className="text-sm text-slate-500">{t('sosFetching')}</p>}
            {status === 'error' && <p className="text-sm text-rose-600">{t('sosFailed')}</p>}
          </div>
        </div>
      )}
    </>
  );
}

// =========================================================================
// SHARED UI BITS
// =========================================================================
function Seal({ label, tone = 'blue' }) {
  const tones = { blue: 'border-blue-600 text-blue-600', green: 'border-emerald-600 text-emerald-700', red: 'border-rose-600 text-rose-700', slate: 'border-slate-400 text-slate-500' };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tones[tone]} rotate-[-3deg] font-mono`}>
      <Stamp size={11} strokeWidth={2.5} />{label}
    </span>
  );
}
function StatusBadge({ status, t }) {
  const map = {
    pending: { tone: 'slate', label: t('pending'), icon: Clock },
    active: { tone: 'green', label: t('active'), icon: CheckCircle2 },
    deactivated: { tone: 'red', label: t('deactivated'), icon: AlertCircle },
    'in-progress': { tone: 'blue', label: t('inProgress'), icon: Clock },
    resolved: { tone: 'green', label: t('resolved'), icon: CheckCircle2 },
  };
  const m = map[status] || map.pending;
  const Icon = m.icon;
  const colors = { slate: 'bg-slate-100 text-slate-600', green: 'bg-emerald-50 text-emerald-700', red: 'bg-rose-50 text-rose-700', blue: 'bg-blue-50 text-blue-700' };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${colors[m.tone]}`}><Icon size={13} />{m.label}</span>;
}
function EmptyState({ text }) {
  return <div className="text-center py-8 text-slate-400 text-sm bg-white/60 rounded-xl border border-dashed border-slate-300">{text}</div>;
}
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-40" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-md rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3"><span className="font-bold text-sm">{title}</span><button onClick={onClose}><X size={18} className="text-slate-400" /></button></div>
        {children}
      </div>
    </div>
  );
}
function LangSwitch({ lang, setLang }) {
  const langs = [{ id: 'en', label: 'EN' }, { id: 'ur', label: 'اردو' }, { id: 'sr', label: 'سرائیکی' }];
  return (
    <div className="flex gap-1 bg-white/10 rounded-lg p-0.5">
      {langs.map((l) => (
        <button key={l.id} onClick={() => setLang(l.id)}
          className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${lang === l.id ? 'bg-white text-blue-900' : 'text-blue-100'}`}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

// =========================================================================
// MAIN APP
// =========================================================================
export default function App() {
  const [ready, setReady] = useState(false);
  const [members, setMembers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationAccounts, setDonationAccounts] = useState([]);
  const [session, setSession] = useState(null); // {memberId} | {admin:true} | null (guest)
  const [screen, setScreen] = useState('guest'); // guest | register | login | admin-login | app
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [toast, setToast] = useState(null);

  const t = useCallback((key) => (TR[lang] && TR[lang][key]) || TR.en[key] || key, [lang]);

  useEffect(() => {
    (async () => {
      const [m, c, jRaw, eRaw, aRaw, dRaw, daRaw, s, l] = await Promise.all([
        loadShared(KEY_MEMBERS, []), loadShared(KEY_COMPLAINTS, []), loadShared(KEY_JOBS, []),
        loadShared(KEY_EVENTS, []), loadShared(KEY_ANNOUNCEMENTS, []), loadShared(KEY_DONATIONS, []),
        loadShared(KEY_DONATION_ACCOUNTS, []),
        loadPersonal(KEY_SESSION, null), loadPersonal(KEY_LANG, 'en'),
      ]);
      const seeded = await ensureSeeded(jRaw, eRaw, c, aRaw, dRaw, daRaw);
      setMembers(m); setComplaints(seeded.complaints); setJobs(seeded.jobs);
      setEvents(seeded.events); setAnnouncements(seeded.announcements); setDonations(seeded.donations);
      setDonationAccounts(seeded.donationAccounts);
      setSession(s); setLang(l);
      setScreen(s ? 'app' : 'guest');
      setReady(true);
    })();
  }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const changeLang = (l) => { setLang(l); savePersonal(KEY_LANG, l); };

  const persistMembers = useCallback(async (next) => { setMembers(next); await saveShared(KEY_MEMBERS, next); }, []);
  const persistComplaints = useCallback(async (next) => { setComplaints(next); await saveShared(KEY_COMPLAINTS, next); }, []);
  const persistJobs = useCallback(async (next) => { setJobs(next); await saveShared(KEY_JOBS, next); }, []);
  const persistEvents = useCallback(async (next) => { setEvents(next); await saveShared(KEY_EVENTS, next); }, []);
  const persistAnnouncements = useCallback(async (next) => { setAnnouncements(next); await saveShared(KEY_ANNOUNCEMENTS, next); }, []);
  const persistDonations = useCallback(async (next) => { setDonations(next); await saveShared(KEY_DONATIONS, next); }, []);
  const persistDonationAccounts = useCallback(async (next) => { setDonationAccounts(next); await saveShared(KEY_DONATION_ACCOUNTS, next); }, []);
  const persistSession = useCallback(async (next) => { setSession(next); await savePersonal(KEY_SESSION, next); }, []);

  const logout = async () => { await persistSession(null); setScreen('guest'); setTab('home'); };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <div className="text-amber-300 font-mono text-sm tracking-widest animate-pulse">LOADING…</div>
      </div>
    );
  }

  const me = session?.memberId ? members.find((m) => m.id === session.memberId) : null;
  const isAdmin = !!session?.admin;
  const isGuest = !me && !isAdmin;

  const sharedData = { jobs, events, announcements, complaints, members, donations, donationAccounts };
  const sharedActions = { persistJobs, persistEvents, persistAnnouncements, persistComplaints, persistMembers, persistDonations, persistDonationAccounts, flash };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-[90%] text-center">
          {toast}
        </div>
      )}

      {screen === 'guest' && (
        <GuestShell
          t={t} lang={lang} setLang={changeLang}
          data={sharedData} actions={sharedActions}
          onRegister={() => setScreen('register')}
          onLogin={() => setScreen('login')}
          onAdmin={() => setScreen('admin-login')}
        />
      )}

      {screen === 'register' && (
        <Register t={t} members={members}
          onDone={async (nm) => { await persistMembers([...members, nm]); await persistSession({ memberId: nm.id }); flash('Registration submitted.'); setScreen('app'); setTab('home'); }}
          onBack={() => setScreen('guest')}
        />
      )}
      {screen === 'login' && (
        <Login t={t} members={members}
          onDone={(m) => { persistSession({ memberId: m.id }); setScreen('app'); setTab('home'); }}
          onBack={() => setScreen('guest')}
        />
      )}
      {screen === 'admin-login' && (
        <AdminLogin t={t}
          onDone={() => { persistSession({ admin: true }); setScreen('app'); setTab('admin'); }}
          onBack={() => setScreen('guest')}
        />
      )}

      {screen === 'app' && (
        <MemberShell
          t={t} lang={lang} setLang={changeLang}
          isAdmin={isAdmin} me={me} tab={tab} setTab={setTab}
          data={sharedData} actions={sharedActions} logout={logout}
        />
      )}

      <SosButton t={t} />
    </div>
  );
}

// =========================================================================
// GUEST SHELL — default entry point, no login required
// =========================================================================
function GuestShell({ t, lang, setLang, data, actions, onRegister, onLogin, onAdmin }) {
  const [tab, setTab] = useState('home');
  const tabs = [
    { id: 'home', label: t('home'), icon: User },
    { id: 'jobs', label: t('jobs'), icon: Briefcase },
    { id: 'events', label: t('events'), icon: CalendarDays },
    { id: 'donation', label: t('donation'), icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div
        className="px-5 pt-8 pb-8 text-center relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at top, #24417a 0%, #10203f 55%, #050b18 100%)', boxShadow: 'inset 0 -30px 40px -20px rgba(251,191,36,0.18)' }}
      >
        <div className="absolute inset-0 opacity-90" style={{
          backgroundImage: 'radial-gradient(1px 1px at 15px 25px, white, transparent), radial-gradient(1px 1px at 60px 70px, white, transparent), radial-gradient(1.5px 1.5px at 100px 15px, white, transparent), radial-gradient(1px 1px at 140px 55px, white, transparent), radial-gradient(1px 1px at 180px 90px, white, transparent), radial-gradient(1.5px 1.5px at 220px 30px, white, transparent), radial-gradient(1px 1px at 260px 65px, white, transparent)',
          backgroundSize: '280px 110px', backgroundRepeat: 'repeat',
        }} />
        <div className="relative flex justify-between items-start mb-4">
          <span className="text-[10px] font-semibold text-blue-200 bg-white/10 rounded-full px-2.5 py-1 flex items-center gap-1"><Eye size={11} />{t('guestBrowsing')}</span>
          <LangSwitch lang={lang} setLang={setLang} />
        </div>
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-amber-400 flex flex-col items-center justify-center mb-3 mx-auto shadow-lg px-2" style={{ boxShadow: '0 0 32px rgba(251,191,36,0.4)' }}>
            <span className="text-blue-700 font-black text-sm leading-tight text-center" style={{ fontFamily: 'Georgia, serif' }}>Saraiki<br />Helpline</span>
          </div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>{t('appName')}</h1>
          <p className="text-blue-200 text-xs mt-1">{t('tagline')}</p>
        </div>
        <div className="relative flex gap-2 mt-5">
          <button onClick={onRegister} className="flex-1 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl active:scale-[0.98] transition">{t('newMember')}</button>
          <button onClick={onLogin} className="flex-1 border-2 border-white/40 text-white text-sm font-semibold py-2.5 rounded-xl active:scale-[0.98] transition">{t('login')}</button>
        </div>
        <button onClick={onAdmin} className="relative text-blue-200 text-[11px] pt-3 underline underline-offset-2">{t('adminSignin')}</button>
      </div>

      <div className="max-w-md mx-auto">
        {tab === 'home' && <GuestHome t={t} data={data} />}
        {tab === 'jobs' && <JobsView isAdmin={false} t={t} jobs={data.jobs} />}
        {tab === 'events' && <EventsView isAdmin={false} t={t} events={data.events} />}
        {tab === 'donation' && <DonationView t={t} isAdmin={false} me={null} donations={data.donations} persistDonations={actions.persistDonations} accounts={data.donationAccounts} persistAccounts={actions.persistDonationAccounts} flash={actions.flash} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex max-w-md mx-auto">
        {tabs.map((tb) => {
          const Icon = tb.icon; const active = tab === tb.id;
          return (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition ${active ? 'text-blue-900' : 'text-slate-400'}`}>
              <Icon size={19} strokeWidth={active ? 2.5 : 2} />{tb.label}
              {active && <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GuestHome({ t, data }) {
  const upcomingEvents = [...data.events].filter(e => e.date >= Date.now()).sort((a, b) => a.date - b.date).slice(0, 1);
  const recentAnnouncements = [...data.announcements].sort((a, b) => b.date - a.date).slice(0, 3);
  return (
    <div className="px-4 py-5 space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center">
        <p className="text-xs text-blue-600 font-semibold">{t('regAnnouncement')}</p>
        <p className="text-sm font-bold mt-0.5 text-slate-900">{t('regWindowLabel')}: {ORG.regWindow}</p>
      </div>

      <div>
        <SectionTitle icon={Megaphone} title={t('announcements')} />
        <div className="space-y-2.5">
          {recentAnnouncements.length === 0 && <EmptyState text={t('noAnnouncements')} />}
          {recentAnnouncements.map((a) => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-3.5">
              <div className="font-semibold text-sm text-slate-900">{a.title}</div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.body}</p>
              <VideoEmbed url={a.videoUrl} />
              <div className="text-[10px] text-slate-400 mt-2">{new Date(a.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      {upcomingEvents.length > 0 && (
        <div>
          <SectionTitle icon={CalendarDays} title={t('upcoming')} />
          <EventCard e={upcomingEvents[0]} isAdmin={false} upcoming t={t} />
        </div>
      )}

      <DonationFeed t={t} donations={data.donations} />

      <div>
        <SectionTitle icon={Shield} title={t('membershipBenefits')} />
        <div className="space-y-2.5">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">{b.title}</span>
                <span className="text-xs text-blue-600" dir="rtl">{b.titleUrdu}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5">
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('membershipFee')}</div>
          <div className="text-xl font-bold mt-1 text-slate-900">Rs. {ORG.monthlyFee}<span className="text-xs font-normal text-slate-500">/mo</span></div>
        </div>
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('helplineContact')}</div>
          <div className="text-base font-bold mt-1.5 text-slate-900">{ORG.phoneDisplay}</div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pt-1">{t('guestNote')}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      <Icon size={14} className="text-blue-600" />
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</span>
    </div>
  );
}

// =========================================================================
// REGISTER / LOGIN / ADMIN LOGIN
// =========================================================================
function TopBar({ title, onBack }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-blue-900 text-white sticky top-0 z-10">
      <button onClick={onBack} className="text-sm text-amber-300 font-semibold flex items-center gap-1"><ArrowLeft size={15} /> Back</button>
      <span className="font-semibold text-sm">{title}</span>
      <div className="w-12" />
    </div>
  );
}
function Field({ label, icon: Icon, children }) {
  return (
    <div className="border border-slate-300 rounded-xl px-3.5 focus-within:border-blue-900 transition bg-white">
      <div className="flex items-center gap-2 pt-2.5"><Icon size={14} className="text-slate-400" /><span className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{label}</span></div>
      {children}
    </div>
  );
}
function StepDots({ step, total }) {
  return <div className="flex items-center gap-2">{Array.from({ length: total }).map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i < step ? 'bg-blue-600 w-8' : 'bg-slate-200 w-4'}`} />)}</div>;
}

function Register({ t, members, onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(''); const [gmail, setGmail] = useState(''); const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(''); const [sentCode, setSentCode] = useState(''); const [feeProof, setFeeProof] = useState(false);
  const [err, setErr] = useState('');

  const sendOtp = () => {
    setErr('');
    if (!name.trim() || !gmail.includes('@') || mobile.replace(/\D/g, '').length < 10) { setErr('Naam, valid Gmail, aur 10+ digit mobile number required hai.'); return; }
    if (members.some((m) => m.mobile === mobile)) { setErr('Ye mobile number pehle se registered hai. Login use karein.'); return; }
    setSentCode(String(Math.floor(1000 + Math.random() * 9000))); setStep(2);
  };
  const verifyOtp = () => { setErr(''); if (otp !== sentCode) { setErr('Code galat hai.'); return; } setStep(3); };
  const submit = () => {
    if (!feeProof) { setErr('Fee proof upload karna zaroori hai.'); return; }
    onDone({ id: uid(), name: name.trim(), gmail: gmail.trim(), mobile, status: 'pending', feeProof: true, joinDate: Date.now(), lastPaidMonth: currentMonthKey() });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title={t('register')} onBack={onBack} />
      <div className="px-5 py-6 max-w-md mx-auto">
        <StepDots step={step} total={3} />
        {step === 1 && (
          <div className="space-y-4 mt-6">
            <Field label="Full name" icon={User}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Apna poora naam likhein" className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
            <Field label="Gmail address" icon={Mail}><input value={gmail} onChange={(e) => setGmail(e.target.value)} placeholder="you@gmail.com" type="email" className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
            <Field label="Mobile number" icon={Phone}><input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="03XX-XXXXXXX" className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
            {err && <p className="text-rose-600 text-xs">{err}</p>}
            <button onClick={sendOtp} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl mt-2">Send verification code</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">Demo mode</p>
              <p className="text-blue-900">Real SMS gateway abhi connect nahi hai — code neeche dikha diya gaya hai.</p>
              <p className="mt-2 font-mono text-lg tracking-widest text-slate-900">{sentCode}</p>
            </div>
            <Field label="Enter 4-digit code" icon={Shield}><input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} placeholder="0000" className="w-full bg-transparent outline-none text-sm py-2.5 tracking-widest" /></Field>
            {err && <p className="text-rose-600 text-xs">{err}</p>}
            <button onClick={verifyOtp} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl mt-2">Verify</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4 mt-6">
            <p className="text-sm text-slate-500">Monthly fee payment ka screenshot upload karein.</p>
            <button onClick={() => setFeeProof(true)} className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 transition ${feeProof ? 'border-emerald-500 bg-emerald-50' : 'border-blue-300'}`}>
              {feeProof ? (<><CheckCircle2 className="text-emerald-600" size={28} /><span className="text-emerald-700 text-sm font-semibold">Screenshot attached (demo)</span></>)
                : (<><Plus className="text-blue-700" size={28} /><span className="text-blue-700 text-sm font-semibold">Tap to upload screenshot</span></>)}
            </button>
            {err && <p className="text-rose-600 text-xs">{err}</p>}
            <button onClick={submit} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl mt-2">Submit for approval</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Login({ t, members, onDone, onBack }) {
  const [mobile, setMobile] = useState(''); const [err, setErr] = useState('');
  const submit = () => { const m = members.find((x) => x.mobile === mobile.trim()); if (!m) { setErr('Ye number registered nahi hai.'); return; } onDone(m); };
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title={t('login')} onBack={onBack} />
      <div className="px-5 py-6 max-w-md mx-auto space-y-4">
        <Field label="Registered mobile number" icon={Phone}><input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="03XX-XXXXXXX" className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
        {err && <p className="text-rose-600 text-xs">{err}</p>}
        <button onClick={submit} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl">Continue</button>
      </div>
    </div>
  );
}

function AdminLogin({ t, onDone, onBack }) {
  const [pass, setPass] = useState(''); const [err, setErr] = useState('');
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title={t('adminSignin')} onBack={onBack} />
      <div className="px-5 py-6 max-w-md mx-auto space-y-4">
        <p className="text-xs text-slate-500">Demo mode — passcode "1234". Live version needs real admin auth.</p>
        <Field label="Passcode" icon={Shield}><input value={pass} onChange={(e) => setPass(e.target.value)} type="password" className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
        {err && <p className="text-rose-600 text-xs">{err}</p>}
        <button onClick={() => (pass === '1234' ? onDone() : setErr('Galat passcode.'))} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl">Enter admin panel</button>
      </div>
    </div>
  );
}

// =========================================================================
// MEMBER / ADMIN SHELL (post-login)
// =========================================================================
function MemberShell({ t, lang, setLang, isAdmin, me, tab, setTab, data, actions, logout }) {
  const tabs = isAdmin
    ? [{ id: 'admin', label: t('admin'), icon: Shield }, { id: 'complaints', label: t('complaints'), icon: MessageSquareWarning }, { id: 'jobs', label: t('jobs'), icon: Briefcase }, { id: 'events', label: t('events'), icon: CalendarDays }, { id: 'donation', label: t('donation'), icon: HeartHandshake }, { id: 'announcements', label: t('announcements'), icon: Megaphone }]
    : [{ id: 'home', label: t('home'), icon: User }, { id: 'complaints', label: t('complaints'), icon: MessageSquareWarning }, { id: 'jobs', label: t('jobs'), icon: Briefcase }, { id: 'events', label: t('events'), icon: CalendarDays }, { id: 'donation', label: t('donation'), icon: HeartHandshake }, { id: 'announcements', label: t('announcements'), icon: Megaphone }];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="flex items-center justify-between px-4 py-4 bg-blue-900 text-white sticky top-0 z-10">
        <div>
          <div className="font-mono text-[9px] tracking-[0.2em] text-blue-200">{t('appName').toUpperCase()}</div>
          <div className="font-semibold text-sm mt-0.5">{isAdmin ? t('admin') : me?.name || 'Member'}</div>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} setLang={setLang} />
          <button onClick={logout} className="text-blue-200"><LogOut size={18} /></button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {tab === 'home' && me && <MemberHome t={t} me={me} donations={data.donations} />}
        {tab === 'complaints' && <ComplaintsView t={t} isAdmin={isAdmin} me={me} complaints={data.complaints} persistComplaints={actions.persistComplaints} flash={actions.flash} />}
        {tab === 'jobs' && <JobsView t={t} isAdmin={isAdmin} jobs={data.jobs} persistJobs={actions.persistJobs} flash={actions.flash} />}
        {tab === 'events' && <EventsView t={t} isAdmin={isAdmin} events={data.events} persistEvents={actions.persistEvents} flash={actions.flash} />}
        {tab === 'donation' && <DonationView t={t} isAdmin={isAdmin} me={me} donations={data.donations} persistDonations={actions.persistDonations} accounts={data.donationAccounts} persistAccounts={actions.persistDonationAccounts} flash={actions.flash} />}
        {tab === 'announcements' && <AnnouncementsView t={t} isAdmin={isAdmin} announcements={data.announcements} persistAnnouncements={actions.persistAnnouncements} flash={actions.flash} />}
        {tab === 'admin' && isAdmin && <AdminApprovals t={t} members={data.members} persistMembers={actions.persistMembers} flash={actions.flash} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex max-w-md mx-auto">
        {tabs.map((tb) => {
          const Icon = tb.icon; const active = tab === tb.id;
          return (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition ${active ? 'text-blue-900' : 'text-slate-400'}`}>
              <Icon size={19} strokeWidth={active ? 2.5 : 2} />{tb.label}
              {active && <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MemberHome({ t, me, donations }) {
  const paidThisMonth = me.lastPaidMonth === currentMonthKey();
  return (
    <div className="px-4 py-5 space-y-4">
      <div className="bg-blue-900 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="font-mono text-[9px] tracking-[0.2em] text-blue-200 mb-1">MEMBERSHIP STATUS</div>
        <div className="text-xl font-bold mb-3">{me.name}</div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={me.status} t={t} />
          {me.status === 'active' && <Seal label={paidThisMonth ? 'Paid this month' : 'Renewal Due'} tone={paidThisMonth ? 'green' : 'red'} />}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200"><div className="text-[10px] text-slate-400 uppercase font-semibold">Joined</div><div className="text-sm font-bold mt-1">{new Date(me.joinDate).toLocaleDateString()}</div></div>
        <div className="bg-white rounded-xl p-3.5 border border-slate-200"><div className="text-[10px] text-slate-400 uppercase font-semibold">Mobile</div><div className="text-sm font-bold mt-1">{me.mobile}</div></div>
      </div>
      <DonationFeed t={t} donations={donations} />
      <div>
        <SectionTitle icon={Shield} title={t('membershipBenefits')} />
        <div className="space-y-2.5">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold text-slate-900">{b.title}</span><span className="text-xs text-blue-600" dir="rtl">{b.titleUrdu}</span></div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// COMPLAINTS
// =========================================================================
function ComplaintsView({ t, isAdmin, me, complaints, persistComplaints, flash }) {
  const [open, setOpen] = useState(false); const [text, setText] = useState('');
  const mine = isAdmin ? complaints : complaints.filter((c) => c.memberId === me?.id);
  const sorted = [...mine].sort((a, b) => b.date - a.date);

  const submit = async () => {
    if (!text.trim()) return;
    const c = { id: uid(), memberId: me.id, memberName: me.name, text: text.trim(), status: 'pending', date: Date.now() };
    await persistComplaints([c, ...complaints]); setText(''); setOpen(false); flash('Complaint darj ho gayi.');
  };
  const setStatus = async (id, status) => await persistComplaints(complaints.map((c) => (c.id === id ? { ...c, status } : c)));

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex gap-2">
        {['pending', 'in-progress', 'resolved'].map((s) => (
          <div key={s} className="flex-1 bg-white rounded-xl border border-slate-200 p-3 text-center">
            <div className="text-xl font-bold">{mine.filter((c) => c.status === s).length}</div>
            <div className="text-[10px] text-slate-400 uppercase">{t(s === 'in-progress' ? 'inProgress' : s)}</div>
          </div>
        ))}
      </div>
      {!isAdmin && me && <button onClick={() => setOpen(true)} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> {t('fileComplaint')}</button>}
      <div className="space-y-3">
        {sorted.length === 0 && <EmptyState text={t('noComplaints')} />}
        {sorted.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>{isAdmin && <div className="text-xs font-bold text-blue-700 mb-0.5">{c.memberName}</div>}<p className="text-sm">{c.text}</p></div>
              <StatusBadge status={c.status} t={t} />
            </div>
            <div className="text-[10px] text-slate-400 mt-2">{new Date(c.date).toLocaleString()}</div>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                {['pending', 'in-progress', 'resolved'].map((s) => (
                  <button key={s} onClick={() => setStatus(c.id, s)} className={`text-[11px] px-2.5 py-1 rounded-md font-semibold border ${c.status === s ? 'bg-blue-900 text-white border-blue-900' : 'border-slate-300 text-slate-500'}`}>{t(s === 'in-progress' ? 'inProgress' : s)}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)} title={t('fileComplaint')}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Apna masla likhein…" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-900" />
          <button onClick={submit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-3">Submit</button>
        </Modal>
      )}
    </div>
  );
}

// =========================================================================
// JOBS
// =========================================================================
function JobsView({ t, isAdmin, jobs, persistJobs, flash }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [desc, setDesc] = useState('');
  const sorted = [...jobs].sort((a, b) => b.date - a.date);
  const submit = async () => { if (!title.trim() || !desc.trim()) return; await persistJobs([{ id: uid(), title: title.trim(), desc: desc.trim(), date: Date.now() }, ...jobs]); setTitle(''); setDesc(''); setOpen(false); flash?.('Job posted.'); };
  const remove = async (id) => await persistJobs(jobs.filter((j) => j.id !== id));
  return (
    <div className="px-4 py-5 space-y-4">
      {isAdmin && <button onClick={() => setOpen(true)} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> {t('postJob')}</button>}
      <div className="space-y-3">
        {sorted.length === 0 && <EmptyState text={t('noJobs')} />}
        {sorted.map((j) => (
          <div key={j.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1"><div className="font-bold text-sm">{j.title}</div><p className="text-sm text-slate-600 mt-1">{j.desc}</p><div className="text-[10px] text-slate-400 mt-2">{new Date(j.date).toLocaleDateString()}</div></div>
              {isAdmin && <button onClick={() => remove(j.id)} className="text-slate-300 hover:text-rose-500"><X size={16} /></button>}
            </div>
          </div>
        ))}
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)} title={t('postJob')}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-900 mb-3" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Tafseel…" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-900" />
          <button onClick={submit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-3">Post</button>
        </Modal>
      )}
    </div>
  );
}

// =========================================================================
// EVENTS
// =========================================================================
function EventCard({ e, isAdmin, onRemove, upcoming, t }) {
  const d = new Date(e.date);
  return (
    <div className={`bg-white rounded-xl border p-4 ${upcoming ? 'border-blue-300' : 'border-slate-200 opacity-70'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {upcoming && <Seal label={t ? t('upcoming') : 'Upcoming'} tone="blue" />}
          <div className="font-bold text-sm mt-1">{e.title}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5"><CalendarDays size={12} /> {d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin size={12} /> {e.location}</div>
          {e.desc && <p className="text-sm text-slate-600 mt-2">{e.desc}</p>}
          <VideoEmbed url={e.videoUrl} />
        </div>
        {isAdmin && <button onClick={onRemove} className="text-slate-300 hover:text-rose-500"><X size={16} /></button>}
      </div>
    </div>
  );
}
function EventsView({ t, isAdmin, events, persistEvents, flash }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [location, setLocation] = useState(''); const [date, setDate] = useState(''); const [desc, setDesc] = useState(''); const [videoUrl, setVideoUrl] = useState('');
  const now = Date.now();
  const sorted = [...events].sort((a, b) => a.date - b.date);
  const upcoming = sorted.filter((e) => e.date >= now);
  const past = sorted.filter((e) => e.date < now).reverse();
  const submit = async () => {
    if (!title.trim() || !location.trim() || !date) return;
    await persistEvents([...events, { id: uid(), title: title.trim(), location: location.trim(), date: new Date(date).getTime(), desc: desc.trim(), videoUrl: videoUrl.trim(), postedDate: Date.now() }]);
    setTitle(''); setLocation(''); setDate(''); setDesc(''); setVideoUrl(''); setOpen(false); flash?.('Event posted.');
  };
  const remove = async (id) => await persistEvents(events.filter((e) => e.id !== id));
  return (
    <div className="px-4 py-5 space-y-5">
      {isAdmin && <button onClick={() => setOpen(true)} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> {t('postEvent')}</button>}
      <div>
        <SectionTitle icon={CalendarDays} title={`${t('upcoming')} (${upcoming.length})`} />
        {upcoming.length === 0 && <EmptyState text={t('noEvents')} />}
        <div className="space-y-3">{upcoming.map((e) => <EventCard key={e.id} e={e} isAdmin={isAdmin} onRemove={() => remove(e.id)} upcoming t={t} />)}</div>
      </div>
      {past.length > 0 && (
        <div>
          <SectionTitle icon={CalendarDays} title={t('past')} />
          <div className="space-y-3">{past.map((e) => <EventCard key={e.id} e={e} isAdmin={isAdmin} onRemove={() => remove(e.id)} t={t} />)}</div>
        </div>
      )}
      {open && (
        <Modal onClose={() => setOpen(false)} title={t('postEvent')}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none mb-3" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none mb-3" />
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none mb-3" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Tafseel…" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none mb-3" />
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video link (optional, YouTube plays inline)" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none" />
          <button onClick={submit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-3">Post event</button>
        </Modal>
      )}
    </div>
  );
}

// =========================================================================
// DONATIONS
// =========================================================================
function DonationFeed({ t, donations }) {
  const confirmed = [...(donations || [])].filter((d) => d.status === 'confirmed').sort((a, b) => b.date - a.date).slice(0, 5);
  if (confirmed.length === 0) return null;
  return (
    <div>
      <SectionTitle icon={HeartHandshake} title={t('recentDonations')} />
      <div className="space-y-2">
        {confirmed.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center"><HeartHandshake size={14} className="text-rose-500" /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{d.name}</div>
                <div className="text-[10px] text-slate-400">{new Date(d.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="text-sm font-bold text-emerald-700">Rs. {Number(d.amount).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonationView({ t, isAdmin, me, donations, persistDonations, accounts, persistAccounts, flash }) {
  const [name, setName] = useState(me?.name || '');
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // new-account form (admin only)
  const [newMethod, setNewMethod] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const submit = async () => {
    if (!name.trim() || !amount || Number(amount) <= 0) return;
    const d = { id: uid(), name: name.trim(), amount: Number(amount), status: 'pending', hasScreenshot: screenshot, date: Date.now() };
    await persistDonations([d, ...donations]);
    setSubmitted(true); setAmount(''); setScreenshot(false);
  };

  const confirm = async (id) => {
    await persistDonations(donations.map((d) => (d.id === id ? { ...d, status: 'confirmed' } : d)));
    flash?.('Donation confirmed — now visible to all users.');
  };
  const reject = async (id) => await persistDonations(donations.filter((d) => d.id !== id));

  const addAccount = async () => {
    if (!newMethod.trim() || !newTitle.trim() || !newNumber.trim()) return;
    await persistAccounts([...accounts, { id: uid(), method: newMethod.trim(), title: newTitle.trim(), number: newNumber.trim() }]);
    setNewMethod(''); setNewTitle(''); setNewNumber('');
    flash?.('Donation account added.');
  };
  const removeAccount = async (id) => await persistAccounts(accounts.filter((a) => a.id !== id));

  if (isAdmin) {
    const pending = donations.filter((d) => d.status === 'pending');
    const confirmed = [...donations.filter((d) => d.status === 'confirmed')].sort((a, b) => b.date - a.date);
    return (
      <div className="px-4 py-5 space-y-6">
        <div>
          <SectionTitle icon={Clock} title={`${t('pendingDonations')} (${pending.length})`} />
          {pending.length === 0 && <EmptyState text={t('noDonations')} />}
          <div className="space-y-3">
            {pending.map((d) => (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div><div className="font-bold text-sm">{d.name}</div><div className="text-xs text-slate-500 mt-0.5">Rs. {Number(d.amount).toLocaleString()}</div></div>
                  {d.hasScreenshot && <Seal label="Screenshot attached" tone="green" />}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => confirm(d.id)} className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg">{t('confirmDonation')}</button>
                  <button onClick={() => reject(d.id)} className="flex-1 bg-rose-50 text-rose-600 text-xs font-bold py-2 rounded-lg border border-rose-200">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle icon={Landmark} title="Donation accounts" />
          <div className="space-y-2.5 mb-3">
            {accounts.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-blue-600">{a.method}</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">{a.title}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">{a.number}</div>
                </div>
                <button onClick={() => removeAccount(a.id)} className="text-slate-300 hover:text-rose-500"><X size={16} /></button>
              </div>
            ))}
            {accounts.length === 0 && <EmptyState text="No donation accounts added yet." />}
          </div>
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Add another account</div>
            <input value={newMethod} onChange={(e) => setNewMethod(e.target.value)} placeholder="Method (e.g. JazzCash, Easypaisa, Bank Transfer)" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-900" />
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Account title" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-900" />
            <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="Account / mobile number" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-900" />
            <button onClick={addAccount} className="w-full bg-blue-900 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5"><Plus size={15} /> Add account</button>
          </div>
        </div>

        <div>
          <SectionTitle icon={HeartHandshake} title={`${t('recentDonations')} (${confirmed.length})`} />
          {confirmed.length === 0 && <EmptyState text={t('noDonations')} />}
          <div className="space-y-2">
            {confirmed.map((d) => (
              <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div className="text-sm font-semibold">{d.name}</div>
                <div className="text-sm font-bold text-emerald-700">Rs. {Number(d.amount).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="bg-blue-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3"><Landmark size={18} className="text-amber-300" /><span className="font-mono text-[9px] tracking-[0.2em] text-blue-200">DONATE TO SARAIKI HELPLINE</span></div>
        {accounts.length === 0 && <p className="text-sm text-blue-200">No donation accounts have been added yet.</p>}
        <div className="space-y-3">
          {accounts.map((a, i) => (
            <div key={a.id} className={i > 0 ? 'pt-3 border-t border-white/15' : ''}>
              <div className="text-[10px] font-bold uppercase tracking-wide text-amber-300 mb-1">{a.method}</div>
              <div className="flex justify-between text-sm"><span className="text-blue-200">{t('accountTitle')}</span><span className="font-semibold text-right">{a.title}</span></div>
              <div className="flex justify-between text-sm mt-1"><span className="text-blue-200">{t('accountNumber')}</span><span className="font-mono font-semibold">{a.number}</span></div>
            </div>
          ))}
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="text-emerald-600 mx-auto mb-2" size={26} />
          <p className="text-sm text-emerald-800">{t('donationThanks')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label={t('yourName')} icon={User}><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
          <Field label={t('donationAmount')} icon={HeartHandshake}><input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="1000" className="w-full bg-transparent outline-none text-sm py-2.5" /></Field>
          <button
            onClick={() => setScreenshot((s) => !s)}
            className={`w-full border-2 border-dashed rounded-xl py-6 flex flex-col items-center gap-1.5 transition ${screenshot ? 'border-emerald-500 bg-emerald-50' : 'border-blue-300'}`}
          >
            {screenshot
              ? <><CheckCircle2 className="text-emerald-600" size={22} /><span className="text-emerald-700 text-xs font-semibold">Screenshot attached (demo)</span></>
              : <><Plus className="text-blue-700" size={22} /><span className="text-blue-700 text-xs font-semibold">{t('uploadScreenshot')}</span></>}
          </button>
          <p className="text-[11px] text-slate-400">{t('donationSubmittedNote')}</p>
          <button onClick={submit} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl">{t('submitDonation')}</button>
        </div>
      )}

      <DonationFeed t={t} donations={donations} />
    </div>
  );
}

// =========================================================================
// ANNOUNCEMENTS (admin-only composer; visible to guests + members on Home)
// =========================================================================
function AnnouncementsView({ t, isAdmin, announcements, persistAnnouncements, flash }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [body, setBody] = useState(''); const [videoUrl, setVideoUrl] = useState('');
  const sorted = [...announcements].sort((a, b) => b.date - a.date);
  const submit = async () => {
    if (!title.trim() || !body.trim()) return;
    await persistAnnouncements([{ id: uid(), title: title.trim(), body: body.trim(), videoUrl: videoUrl.trim(), date: Date.now() }, ...announcements]);
    setTitle(''); setBody(''); setVideoUrl(''); setOpen(false); flash?.('Announcement posted.');
  };
  const remove = async (id) => await persistAnnouncements(announcements.filter((a) => a.id !== id));
  return (
    <div className="px-4 py-5 space-y-4">
      {isAdmin && <button onClick={() => setOpen(true)} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> {t('postAnnouncement')}</button>}
      <div className="space-y-3">
        {sorted.length === 0 && <EmptyState text={t('noAnnouncements')} />}
        {sorted.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1"><div className="font-bold text-sm">{a.title}</div><p className="text-sm text-slate-600 mt-1">{a.body}</p><VideoEmbed url={a.videoUrl} /><div className="text-[10px] text-slate-400 mt-2">{new Date(a.date).toLocaleDateString()}</div></div>
              {isAdmin && <button onClick={() => remove(a.id)} className="text-slate-300 hover:text-rose-500"><X size={16} /></button>}
            </div>
          </div>
        ))}
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)} title={t('postAnnouncement')}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none mb-3" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Announcement text…" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none mb-3" />
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video link (optional, YouTube plays inline)" className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none" />
          <button onClick={submit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-3">Post</button>
        </Modal>
      )}
    </div>
  );
}

// =========================================================================
// ADMIN APPROVALS
// =========================================================================
function MemberCard({ m, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between">
        <div><div className="font-bold text-sm">{m.name}</div><div className="text-xs text-slate-500 mt-0.5">{m.mobile} · {m.gmail}</div></div>
        <StatusBadge status={m.status} t={(k) => k} />
      </div>
      <div className="flex items-center gap-1.5 mt-2"><Seal label={m.feeProof ? 'Fee proof attached' : 'No proof'} tone={m.feeProof ? 'green' : 'red'} /></div>
      {children}
    </div>
  );
}
function AdminApprovals({ t, members, persistMembers, flash }) {
  const pending = members.filter((m) => m.status === 'pending');
  const active = members.filter((m) => m.status === 'active');
  const deactivated = members.filter((m) => m.status === 'deactivated');
  const setStatus = async (id, status) => {
    await persistMembers(members.map((m) => (m.id === id ? { ...m, status, lastPaidMonth: status === 'active' ? currentMonthKey() : m.lastPaidMonth } : m)));
    flash(status === 'active' ? 'Member approved.' : 'Member updated.');
  };
  return (
    <div className="px-4 py-5 space-y-6">
      <div>
        <SectionTitle icon={Shield} title={`Pending (${pending.length})`} />
        {pending.length === 0 && <EmptyState text="No pending registrations." />}
        <div className="space-y-3">{pending.map((m) => (
          <MemberCard key={m.id} m={m}>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setStatus(m.id, 'active')} className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg">Approve</button>
              <button onClick={() => setStatus(m.id, 'deactivated')} className="flex-1 bg-rose-50 text-rose-600 text-xs font-bold py-2 rounded-lg border border-rose-200">Reject</button>
            </div>
          </MemberCard>
        ))}</div>
      </div>
      <div>
        <SectionTitle icon={CheckCircle2} title={`Active (${active.length})`} />
        {active.length === 0 && <EmptyState text="No active members." />}
        <div className="space-y-3">{active.map((m) => (
          <MemberCard key={m.id} m={m}><button onClick={() => setStatus(m.id, 'deactivated')} className="w-full mt-3 text-xs font-bold py-2 rounded-lg border border-slate-300 text-slate-500">Deactivate</button></MemberCard>
        ))}</div>
      </div>
      {deactivated.length > 0 && (
        <div>
          <SectionTitle icon={AlertCircle} title={`Deactivated (${deactivated.length})`} />
          <div className="space-y-3">{deactivated.map((m) => (
            <MemberCard key={m.id} m={m}><button onClick={() => setStatus(m.id, 'active')} className="w-full mt-3 text-xs font-bold py-2 rounded-lg bg-blue-900 text-white">Reactivate</button></MemberCard>
          ))}</div>
        </div>
      )}
    </div>
  );
}
