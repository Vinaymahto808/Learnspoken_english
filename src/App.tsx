import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, BookOpen, Mic2, ChevronRight, CheckCircle2, Play,
  Volume2, RotateCcw, X, Mic, MessageSquare, Target, Clock,
  Gamepad2, DollarSign, Shield, Users, Briefcase, HeartPulse,
  ShoppingBag, Award, Star, Download, ArrowRight, Moon,
  UserCheck, AlertCircle, ChevronLeft
} from 'lucide-react';
import { cn } from './lib/utils';
import { LESSONS, VOCABULARY, ROLE_PLAYS, type Lesson, type RolePlay } from './types';
import { GeminiLiveService } from './services/geminiLiveService';

// ─── Reusable ────────────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold">Reload</button>
      </div>
    );
    return this.props.children;
  }
}

const ProgressBar = ({ value, max }: { value: number; max: number }) => (
  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
    <motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} className="h-full bg-primary" />
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", className)}>{children}</span>
);

const StarRating = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
    ))}
  </div>
);

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({ onStart }: { onStart: () => void }) {
  const [testimonialIdx, setTestimonialIdx] = useState(1);
  const [whoIdx, setWhoIdx] = useState(0);

  const features = [
    { icon: <Mic size={22} />, title: 'AI English Coach', desc: 'Practice English daily and get instant feedback on pronunciation and fluency.' },
    { icon: <Shield size={22} />, title: 'Learn Without Fear', desc: 'Speak freely and improve with private corrections from AI.', highlight: true },
    { icon: <Target size={22} />, title: 'Structured Learning Path', desc: 'Follow a clear path with level milestones to track your progress.' },
    { icon: <Clock size={22} />, title: 'Short Daily Lessons', desc: 'Just 15 minutes a day to build real English speaking confidence.' },
    { icon: <Gamepad2 size={22} />, title: 'Gamified Learning', desc: 'Earn XP, maintain streaks and stay motivated every day.' },
    { icon: <DollarSign size={22} />, title: 'Affordable Plans', desc: 'World-class English coaching at a price everyone can afford.' },
  ];

  const whoCards = [
    { icon: <Users size={28} />, title: 'Students & Job Seekers', desc: 'Prepare for exams, placements, interviews, and higher studies.', bg: 'from-violet-500 to-purple-600' },
    { icon: <Briefcase size={28} />, title: 'Working Professionals', desc: 'Improve English for meetings, presentations, and client calls.', bg: 'from-blue-500 to-blue-600' },
    { icon: <ShoppingBag size={28} />, title: 'Customer-Facing Roles', desc: 'For customer service, retail, sales, hospitality, tourism staff.', bg: 'from-orange-400 to-red-500' },
    { icon: <HeartPulse size={28} />, title: 'Healthcare Providers', desc: 'Nurses, doctors, receptionists, delivery and logistics teams.', bg: 'from-teal-400 to-emerald-500' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Software Engineer', text: 'The daily practice sessions have boosted my confidence tremendously. I can now speak fluently in client calls without hesitation.' },
    { name: 'Rajesh Kumar', role: 'Job Seeker', text: 'The AI speech feedback helped me improve my pronunciation before interviews. I landed my dream job thanks to SpeakEase!' },
    { name: 'Anita Patel', role: 'Customer Service Rep', text: 'The gamified learning keeps me motivated. I complete my daily challenges and my English keeps getting better every day.' },
  ];

  const awards = [
    { icon: <Award size={28} className="text-yellow-500" />, title: 'Elets World Education Summit', desc: 'Best EdTech Provider 2023' },
    { icon: <Award size={28} className="text-red-500" />, title: 'Forbes India DGEMS', desc: 'Best Company (Select 200)' },
    { icon: <Award size={28} className="text-blue-500" />, title: 'Google Startups Accelerator', desc: 'Selected Startup 2024' },
    { icon: <Award size={28} className="text-green-500" />, title: 'Mint Tech4Good Awards', desc: 'Best Use of AI for Education' },
    { icon: <Award size={28} className="text-purple-500" />, title: 'Entrepreneur Award', desc: 'Best EdTech Startup 2025' },
    { icon: <Award size={28} className="text-orange-500" />, title: 'India Elite Education Awards', desc: 'Most Futuristic AI Startup' },
    { icon: <Award size={28} className="text-primary" />, title: 'ET Education Excellence', desc: 'Best Emerging EdTech Startup', highlight: true },
    { icon: <Award size={28} className="text-pink-500" />, title: 'Minsky Awards', desc: 'Fastest-Growing AI Startup' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
            <Mic size={20} />
          </div>
          <span className="text-xl font-black tracking-tight">SpeakEase</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 border-2 border-primary text-primary rounded-full text-sm font-bold hover:bg-red-50 transition-colors">
            For Business
          </button>
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:bg-red-600 transition-colors"
          >
            <Download size={16} /> Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black text-primary leading-tight max-w-2xl mx-auto mb-6"
        >
          AI English Speaking App for Confidence and Fluency
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600 max-w-xl mx-auto text-lg mb-10 leading-relaxed"
        >
          Learn spoken English with AI-powered lessons. Practice daily with 15-minute lessons, get instant speech feedback, and speak English confidently for work, interviews, and everyday life.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onStart}
          className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-full text-lg font-bold shadow-xl shadow-primary/30 hover:bg-red-600 active:scale-95 transition-all"
        >
          Start Speaking Now <ArrowRight size={20} />
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-10 mt-14 flex-wrap"
        >
          {[
            { icon: <Users size={20} className="text-primary" />, value: '1Cr+', label: 'Learners' },
            { icon: <Download size={20} className="text-primary" />, value: '10M+', label: 'Downloads' },
            { icon: <Star size={20} className="text-primary fill-primary" />, value: '4.6+', label: 'Rating' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              {s.icon}
              <div className="text-left">
                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Why Choose ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Why Choose <span className="text-primary">SpeakEase</span></h2>
          <p className="text-slate-500">Discover the features that make SpeakEase the perfect English learning companion</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className={cn(
              "p-6 rounded-2xl border transition-all hover:shadow-md",
              f.highlight ? "bg-red-50 border-red-100" : "bg-white border-slate-100"
            )}>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who Can Use ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Who Can Use <span className="text-primary">SpeakEase</span></h2>
            <p className="text-slate-500">Perfect for learners from all walks of life</p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whoCards.map((c, i) => (
                <div key={c.title} className={cn("bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all", whoIdx === i && "ring-2 ring-primary/30")}>
                  <div className={cn("h-28 bg-gradient-to-br flex items-center justify-center text-white", c.bg)}>
                    {c.icon}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1 text-sm">{c.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Our <span className="text-primary">Awards & Recognition</span></h2>
          <p className="text-slate-500">Recognised globally for excellence in AI-powered education</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {awards.map(a => (
            <div key={a.title} className={cn(
              "p-4 rounded-2xl border flex flex-col gap-2 hover:shadow-md transition-all",
              a.highlight ? "bg-red-50 border-red-100" : "bg-white border-slate-100"
            )}>
              {a.icon}
              <h4 className="font-bold text-sm leading-tight">{a.title}</h4>
              <p className="text-xs text-slate-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Our <span className="text-primary">Success Stories</span></h2>
            <p className="text-slate-500">Real results from real learners</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} className={cn(
                "p-6 rounded-2xl border transition-all",
                i === testimonialIdx ? "bg-red-50 border-red-100 scale-[1.02] shadow-md" : "bg-white border-slate-100"
              )}>
                <StarRating />
                <p className="text-slate-600 text-sm italic my-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-primary font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setTestimonialIdx(p => Math.max(0, p - 1))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setTestimonialIdx(p => Math.min(testimonials.length - 1, p + 1))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-primary px-6 py-20 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Speak English with Confidence?</h2>
        <p className="text-red-100 max-w-md mx-auto mb-10 text-lg">Join thousands of learners who have transformed their English speaking skills with SpeakEase</p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary rounded-full text-lg font-bold shadow-xl hover:bg-red-50 active:scale-95 transition-all"
        >
          <Download size={20} /> Start Learning Now
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-10">
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic size={16} />
              </div>
              <span className="text-lg font-black">SpeakEase</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">AI-powered English learning platform for confident communication.</p>
          </div>
          {[
            { heading: 'Company', links: ['About', 'Contact Us', 'Blog', 'SpeakEase for Business'] },
            { heading: 'Legal', links: ['Terms & Conditions', 'Privacy Policy', 'Refund Policy'] },
            { heading: 'Policies', links: ['Equal Rights Policy', 'Diversity & Inclusion', 'Data Deletion Policy'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="font-bold mb-4 text-white">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── App (Features) ───────────────────────────────────────────────────────────

function AppFeatures({ onBack }: { onBack: () => void }) {
  const [xp, setXp] = useState(0);
  const [streak] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [view, setView] = useState<'dashboard' | 'lesson' | 'tutor' | 'flashcards' | 'roleplay'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedRolePlay, setSelectedRolePlay] = useState<RolePlay | null>(null);
  const [isTutorActive, setIsTutorActive] = useState(false);
  const [tutorTranscript, setTutorTranscript] = useState('');
  const [tutorService] = useState(() => new GeminiLiveService());

  const addXP = (amount: number) => setXp(prev => prev + amount);

  const completeLesson = (id: string, lessonXp: number) => {
    if (!completedLessons.includes(id)) {
      setXp(prev => prev + lessonXp);
      setCompletedLessons(prev => [...prev, id]);
    }
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
          <ChevronLeft size={20} />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white">
              <Mic size={14} />
            </div>
            <span className="font-black text-slate-900">SpeakEase</span>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold text-sm">
            {xp} XP
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-500 px-3 py-1.5 rounded-full font-bold text-sm">
            <Flame size={16} fill="currentColor" /> {streak}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">

          {/* ── Dashboard ── */}
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Daily Goal</h2>
                    <p className="text-sm text-slate-500">Keep your streak alive!</p>
                  </div>
                  <span className="text-2xl font-black text-primary">{xp % 50}/50 <span className="text-sm font-medium text-slate-400">XP</span></span>
                </div>
                <ProgressBar value={xp % 50} max={50} />
              </section>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'AI Tutor', icon: <Mic2 size={20} />, view: 'tutor' as const, color: 'bg-primary' },
                  { label: 'Role Play', icon: <RotateCcw size={20} />, view: 'roleplay' as const, color: 'bg-amber-500' },
                  { label: 'Vocab', icon: <BookOpen size={20} />, view: 'flashcards' as const, color: 'bg-emerald-500' },
                ].map(btn => (
                  <button key={btn.label} onClick={() => setView(btn.view)}
                    className={cn("flex flex-col items-center gap-2 p-4 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform", btn.color)}>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">{btn.icon}</div>
                    <span className="font-bold text-xs">{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* Interview Prep */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-bold">Interview Prep</h2>
                  <Badge className="bg-amber-100 text-amber-600">NEW</Badge>
                </div>
                <div className="grid gap-3">
                  {ROLE_PLAYS.filter(rp =>
                    rp.title.toLowerCase().includes('interview') ||
                    rp.title.toLowerCase().includes('negotiation') ||
                    rp.title.toLowerCase().includes('presentation')
                  ).map(rp => (
                    <button key={rp.id} onClick={() => { setSelectedRolePlay(rp); setView('roleplay'); }}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors text-left group">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <UserCheck size={22} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{rp.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{rp.scenario}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Lessons */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold px-1">Active Lessons</h2>
                <div className="space-y-3">
                  {LESSONS.map(lesson => (
                    <button key={lesson.id} onClick={() => { setSelectedLesson(lesson); setView('lesson'); }}
                      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors text-left group">
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Play size={24} fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{lesson.title}</h3>
                          {completedLessons.includes(lesson.id) && <CheckCircle2 size={16} className="text-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            lesson.level === 'Beginner' ? 'bg-green-100 text-green-600' :
                            lesson.level === 'Intermediate' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          )}>{lesson.level}</Badge>
                          <span className="text-xs text-slate-400 font-medium">• {lesson.xp} XP</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ── Lesson Detail ── */}
          {view === 'lesson' && selectedLesson && (
            <motion.div key="lesson" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 font-medium hover:text-primary transition-colors">
                <X size={20} /> Back
              </button>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 text-primary rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                  <p className="text-slate-500 leading-relaxed">{selectedLesson.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Topic</span>
                    <span className="font-bold">{selectedLesson.topic}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Level</span>
                    <span className="font-bold">{selectedLesson.level}</span>
                  </div>
                </div>
                <button onClick={() => completeLesson(selectedLesson.id, selectedLesson.xp)}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-red-600 active:scale-95 transition-all">
                  Complete Lesson (+{selectedLesson.xp} XP)
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Role Play ── */}
          {view === 'roleplay' && (
            <motion.div key="roleplay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={22} /></button>
                <h2 className="text-xl font-bold">Role Play Scenarios</h2>
              </div>
              <div className="grid gap-4">
                {ROLE_PLAYS.map(rp => (
                  <button key={rp.id} onClick={() => { setSelectedRolePlay(rp); setView('tutor'); }}
                    className="w-full p-6 bg-white rounded-2xl border border-slate-100 text-left hover:border-primary/30 transition-all group">
                    <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors">{rp.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{rp.scenario}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-slate-100 text-slate-600">Tutor: {rp.tutorRole}</Badge>
                      <Badge className="bg-red-50 text-primary">You: {rp.userRole}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── AI Tutor ── */}
          {view === 'tutor' && (
            <motion.div key="tutor" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8 text-center">
              <div className="flex items-center gap-3">
                <button onClick={() => { tutorService.disconnect(); setIsTutorActive(false); setSelectedRolePlay(null); setView('dashboard'); }}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={22} /></button>
                <h2 className="text-xl font-bold">AI Tutor Session</h2>
              </div>

              <div className="relative py-12">
                <div className={cn("w-48 h-48 rounded-full bg-red-50 mx-auto flex items-center justify-center transition-all duration-500", isTutorActive && "scale-110 shadow-[0_0_60px_rgba(232,64,24,0.25)]")}>
                  <div className={cn("w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white shadow-xl", isTutorActive && "animate-pulse")}>
                    <Mic2 size={48} />
                  </div>
                </div>
                {isTutorActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[1, 2, 3].map(i => (
                      <motion.div key={i} initial={{ scale: 1, opacity: 0.4 }} animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                        className="absolute w-48 h-48 border-2 border-primary rounded-full" />
                    ))}
                  </div>
                )}
              </div>

              {isTutorActive && tutorTranscript && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xs mx-auto">
                  <p className="text-sm text-slate-600 italic">"{tutorTranscript}"</p>
                </motion.div>
              )}

              <div className="space-y-3">
                <h3 className="text-2xl font-bold">{isTutorActive ? 'Listening...' : 'Ready to practice?'}</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">
                  {isTutorActive ? 'Speak naturally. Alex is listening and will respond in real-time.' : 'Tap below to start a voice conversation with Alex.'}
                </p>
              </div>

              {!isTutorActive ? (
                <button onClick={async () => {
                  setIsTutorActive(true); setTutorTranscript('');
                  await tutorService.connect({
                    onAudioData: () => {},
                    onTextData: t => setTutorTranscript(t),
                    onError: err => { console.error(err); setIsTutorActive(false); },
                    onClose: () => setIsTutorActive(false),
                    rolePlay: selectedRolePlay || undefined
                  });
                }} className="px-12 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/30 hover:bg-red-600 active:scale-95 transition-all">
                  Start Conversation
                </button>
              ) : (
                <button onClick={() => { tutorService.disconnect(); setIsTutorActive(false); }}
                  className="px-12 py-4 bg-red-500 text-white rounded-full font-bold shadow-xl shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all">
                  End Session
                </button>
              )}
            </motion.div>
          )}

          {/* ── Flashcards ── */}
          {view === 'flashcards' && (
            <motion.div key="flashcards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="flex items-center gap-3">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={22} /></button>
                <h2 className="text-xl font-bold">Vocabulary Builder</h2>
              </div>
              <div className="space-y-5">
                {VOCABULARY.map((card, idx) => (
                  <motion.div key={card.word} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{card.word}</h3>
                        <p className="text-slate-400 font-mono text-sm">{card.phonetic}</p>
                      </div>
                      <button onClick={() => { const u = new SpeechSynthesisUtterance(card.word); u.lang = 'en-US'; window.speechSynthesis.speak(u); }}
                        className="p-3 bg-red-50 text-primary rounded-xl hover:bg-red-100 transition-colors">
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed"><span className="font-bold text-slate-900">Definition:</span> {card.definition}</p>
                    <div className="p-3 bg-slate-50 rounded-xl italic text-slate-500 text-sm">"{card.example}"</div>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => { addXP(20); setView('dashboard'); }}
                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95 transition-all">
                Mark as Mastered (+20 XP)
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root() {
  const [started, setStarted] = useState(false);
  return started
    ? <AppFeatures onBack={() => setStarted(false)} />
    : <LandingPage onStart={() => setStarted(true)} />;
}

export default function AppWithErrorBoundary() {
  return <ErrorBoundary><Root /></ErrorBoundary>;
}
