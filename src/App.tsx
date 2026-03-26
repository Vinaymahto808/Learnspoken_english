import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Mic2, 
  Settings, 
  ChevronRight, 
  Star,
  CheckCircle2,
  Play,
  Volume2,
  RotateCcw,
  X,
  Layout,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import { LESSONS, VOCABULARY, ROLE_PLAYS, type Lesson, type UserProgress, type Level, type RolePlay } from './types';
import { GeminiLiveService } from './services/geminiLiveService';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, doc, getDoc, setDoc, updateDoc, onSnapshot } from './firebase';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = process.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY) 
  : null;

// --- Components ---

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-slate-500 mb-6 max-w-xs">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProgressBar = ({ value, max }: { value: number; max: number }) => (
  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${(value / max) * 100}%` }}
      className="h-full bg-primary"
    />
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", className)}>
    {children}
  </span>
);

// --- Standalone Auth Page (opened in new tab for iframe-safe login) ---

export function StandaloneAuthPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async () => {
    setStatus('loading');
    try {
      await signInWithPopup(auth, googleProvider);
      setStatus('done');
      setTimeout(() => window.close(), 1500);
    } catch (error: any) {
      console.error('Auth error', error);
      setErrorMsg(error?.message || 'Sign-in failed.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8">
        <Layout size={40} />
      </div>
      <h1 className="text-3xl font-black tracking-tight mb-2">SpeakEase</h1>
      <p className="text-slate-500 mb-10">Sign in to continue</p>

      {status === 'done' ? (
        <div className="text-secondary font-bold text-lg flex items-center gap-2">
          <CheckCircle2 size={24} /> Signed in! Closing tab…
        </div>
      ) : (
        <>
          <button
            onClick={handleSignIn}
            disabled={status === 'loading'}
            className="w-full max-w-xs py-4 bg-white border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all shadow-sm disabled:opacity-60"
          >
            {status === 'loading' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
              />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            )}
            {status === 'loading' ? 'Signing in…' : 'Continue with Google'}
          </button>
          {status === 'error' && (
            <p className="mt-4 text-sm text-red-500 max-w-xs">{errorMsg}</p>
          )}
        </>
      )}
    </div>
  );
}

// --- Main App ---

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [view, setView] = useState<'dashboard' | 'lesson' | 'tutor' | 'flashcards' | 'roleplay' | 'subscription'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedRolePlay, setSelectedRolePlay] = useState<RolePlay | null>(null);
  const [isTutorActive, setIsTutorActive] = useState(false);
  const [tutorTranscript, setTutorTranscript] = useState("");
  const [tutorService] = useState(() => new GeminiLiveService());
  
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect sign-in error", error);
    });

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!userDoc.exists()) {
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            xp: 0,
            streak: 0,
            lastActive: new Date().toISOString(),
            completedLessons: [],
            isPro: false
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        } else {
          setUser(userDoc.data());
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setLoginError(null);
    setLoginLoading(true);
    const authUrl = `${window.location.origin}/?auth=1`;
    const popup = window.open(authUrl, 'speakease-auth', 'width=480,height=640,left=200,top=100');
    if (!popup) {
      setLoginError('Pop-up was blocked. Please allow pop-ups for this site and try again.');
      setLoginLoading(false);
      return;
    }
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setLoginLoading(false);
      }
    }, 500);
  };

  const handleLogout = () => signOut(auth);

  const handleFirestoreError = (error: any, operation: string, path: string) => {
    const errInfo = {
      error: error.message,
      operationType: operation,
      path,
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      }
    };
    console.error('Firestore Error:', JSON.stringify(errInfo));
    setGlobalError(error.message);
    setTimeout(() => setGlobalError(null), 5000);
  };

  const handleUpgrade = async () => {
    if (!user) return handleLogin();
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_H5ggY9q12345', // Placeholder
          userId: user.uid,
          email: user.email
        })
      });
      const session = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        await (stripe as any).redirectToCheckout({ sessionId: session.id });
      }
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8">
          <Layout size={40} />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">SpeakEase</h1>
        <p className="text-slate-500 max-w-xs mb-12">Master spoken English with your personal AI tutor. Sign in to track your progress.</p>
        <button 
          onClick={handleLogin}
          disabled={loginLoading}
          className="w-full max-w-xs py-4 bg-white border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loginLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
            />
          ) : (
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          )}
          {loginLoading ? 'Waiting for sign-in…' : 'Continue with Google'}
        </button>
        {loginLoading && (
          <p className="mt-3 text-xs text-slate-400">A sign-in window has opened. Complete sign-in there to continue.</p>
        )}
        {loginError && (
          <div className="mt-4 max-w-xs p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-left">
            <strong>Sign-in error:</strong> {loginError}
          </div>
        )}
      </div>
    );
  }

  const addXP = async (amount: number) => {
    if (!user) return;
    try {
      const newXP = (user.xp || 0) + amount;
      await updateDoc(doc(db, 'users', user.uid), { xp: newXP });
      setUser((prev: any) => ({ ...prev, xp: newXP }));
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${user.uid}`);
    }
  };

  const completeLesson = async (id: string, xp: number) => {
    if (!user) return;
    try {
      const completedLessons = user.completedLessons || [];
      if (!completedLessons.includes(id)) {
        const newXP = (user.xp || 0) + xp;
        const newCompleted = [...completedLessons, id];
        await updateDoc(doc(db, 'users', user.uid), { 
          xp: newXP,
          completedLessons: newCompleted
        });
        setUser((prev: any) => ({ 
          ...prev, 
          xp: newXP,
          completedLessons: newCompleted
        }));
      }
      setView('dashboard');
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${user.uid}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Layout size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SpeakEase</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('subscription')}
            className={cn(
              "px-3 py-1.5 rounded-full font-bold text-xs",
              user.isPro ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
            )}
          >
            {user.isPro ? "PRO" : "FREE"}
          </button>
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm">
            <Flame size={18} fill="currentColor" />
            {user.streak}
          </div>
          <button onClick={handleLogout} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Daily Goal */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Daily Goal</h2>
                    <p className="text-sm text-slate-500">Keep your streak alive!</p>
                  </div>
                  <span className="text-2xl font-black text-primary">{(user.xp || 0) % 50}/50 <span className="text-sm font-medium text-slate-400">XP</span></span>
                </div>
                <ProgressBar value={(user.xp || 0) % 50} max={50} />
              </section>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setView('tutor')}
                  className="flex flex-col items-center gap-2 p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mic2 size={20} />
                  </div>
                  <span className="font-bold text-xs">AI Tutor</span>
                </button>
                <button 
                  onClick={() => setView('roleplay')}
                  className="flex flex-col items-center gap-2 p-4 bg-accent text-white rounded-2xl shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <RotateCcw size={20} />
                  </div>
                  <span className="font-bold text-xs">Role Play</span>
                </button>
                <button 
                  onClick={() => setView('flashcards')}
                  className="flex flex-col items-center gap-2 p-4 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/20 hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-bold text-xs">Vocab</span>
                </button>
              </div>

              {/* Interview Prep Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-bold">Interview Prep</h2>
                  <Badge className="bg-amber-100 text-amber-600">NEW</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {ROLE_PLAYS.filter(rp => rp.title.toLowerCase().includes('interview') || rp.title.toLowerCase().includes('negotiation') || rp.title.toLowerCase().includes('presentation')).map((rp) => (
                    <button
                      key={rp.id}
                      onClick={() => {
                        setSelectedRolePlay(rp);
                        setView('roleplay');
                      }}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors text-left group"
                    >
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <UserCheck size={24} />
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

              {/* Lessons List */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold px-1">Active Lessons</h2>
                <div className="space-y-3">
                  {LESSONS.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setView('lesson');
                      }}
                      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors text-left group"
                    >
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Play size={24} fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{lesson.title}</h3>
                          {user.completedLessons?.includes(lesson.id) && (
                            <CheckCircle2 size={16} className="text-secondary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            lesson.level === 'Beginner' ? 'bg-green-100 text-green-600' :
                            lesson.level === 'Intermediate' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          )}>
                            {lesson.level}
                          </Badge>
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

          {view === 'lesson' && selectedLesson && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-500 font-medium"
              >
                <X size={20} /> Back to Dashboard
              </button>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                  <p className="text-slate-500 leading-relaxed">{selectedLesson.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Topic</span>
                    <span className="font-bold">{selectedLesson.topic}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Level</span>
                    <span className="font-bold">{selectedLesson.level}</span>
                  </div>
                </div>

                <button 
                  onClick={() => completeLesson(selectedLesson.id, selectedLesson.xp)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Start Lesson
                </button>
              </div>
            </motion.div>
          )}

          {view === 'subscription' && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
                  <Star size={40} fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black">LingoFlow Pro</h2>
                <p className="text-slate-500">Unlock unlimited AI tutor sessions and advanced role-play scenarios.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-primary shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-2xl text-xs font-bold">BEST VALUE</div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold">Monthly Plan</h3>
                    <p className="text-slate-400 text-sm">Billed monthly</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black">$9.99</span>
                    <span className="text-slate-400 text-sm">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {['Unlimited AI Conversations', 'Advanced Business Lessons', 'Priority Support', 'Ad-free Experience'].map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 size={18} className="text-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleUpgrade}
                  disabled={user.isPro}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {user.isPro ? "Already Pro" : "Upgrade Now"}
                </button>
              </div>
            </motion.div>
          )}
          {view === 'roleplay' && (
            <motion.div
              key="roleplay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setView('dashboard')}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-xl font-bold">Role Play Scenarios</h2>
                <div className="w-10" />
              </div>

              <div className="grid gap-4">
                {ROLE_PLAYS.map((rp) => (
                  <button
                    key={rp.id}
                    onClick={() => {
                      setSelectedRolePlay(rp);
                      setView('tutor');
                    }}
                    className="w-full p-6 bg-white rounded-3xl border border-slate-100 text-left hover:border-primary/30 transition-all group"
                  >
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{rp.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{rp.scenario}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-slate-100 text-slate-600">Tutor: {rp.tutorRole}</Badge>
                      <Badge className="bg-primary/10 text-primary">You: {rp.userRole}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'tutor' && (
            <motion.div
              key="tutor"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 text-center"
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => {
                    tutorService.disconnect();
                    setIsTutorActive(false);
                    setView('dashboard');
                  }}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-xl font-bold">AI Tutor Session</h2>
                <div className="w-10" />
              </div>

              <div className="relative py-12">
                <div className={cn(
                  "w-48 h-48 rounded-full bg-primary/10 mx-auto flex items-center justify-center transition-all duration-500",
                  isTutorActive && "scale-110 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                )}>
                  <div className={cn(
                    "w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white shadow-xl",
                    isTutorActive && "animate-pulse"
                  )}>
                    <Mic2 size={48} />
                  </div>
                </div>
                
                {isTutorActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                        className="absolute w-48 h-48 border-2 border-primary rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {isTutorActive && tutorTranscript && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xs mx-auto"
                >
                  <p className="text-sm text-slate-600 italic">"{tutorTranscript}"</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">
                  {isTutorActive ? "Listening..." : "Ready to practice?"}
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {isTutorActive 
                    ? "Speak naturally. Alex is listening and will respond in real-time." 
                    : "Tap the button below to start a voice conversation with Alex."}
                </p>
              </div>

              {!isTutorActive ? (
                <button 
                  onClick={async () => {
                    setIsTutorActive(true);
                    setTutorTranscript("");
                    await tutorService.connect({
                      onAudioData: () => {},
                      onTextData: (text) => setTutorTranscript(text),
                      onError: (err) => {
                        console.error(err);
                        setIsTutorActive(false);
                      },
                      onClose: () => setIsTutorActive(false),
                      rolePlay: selectedRolePlay || undefined
                    });
                  }}
                  className="px-12 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Start Conversation
                </button>
              ) : (
                <button 
                  onClick={() => {
                    tutorService.disconnect();
                    setIsTutorActive(false);
                  }}
                  className="px-12 py-4 bg-red-500 text-white rounded-full font-bold shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  End Session
                </button>
              )}
            </motion.div>
          )}

          {view === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setView('dashboard')}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-xl font-bold">Vocabulary Builder</h2>
                <div className="w-10" />
              </div>

              <div className="space-y-6">
                {VOCABULARY.map((card, idx) => (
                  <motion.div
                    key={card.word}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{card.word}</h3>
                        <p className="text-slate-400 font-mono text-sm">{card.phonetic}</p>
                      </div>
                      <button 
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(card.word);
                          utterance.lang = 'en-US';
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Definition:</span> {card.definition}
                    </p>
                    <div className="p-4 bg-slate-50 rounded-2xl italic text-slate-500 text-sm">
                      "{card.example}"
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => {
                  addXP(20);
                  setView('dashboard');
                }}
                className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/30"
              >
                Mark as Mastered (+20 XP)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-8 py-4 flex justify-around items-center">
        {/* ... */}
      </nav>

      {/* Global Error Toast */}
      <AnimatePresence>
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 right-6 bg-red-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-50"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-medium flex-1">{globalError}</p>
            <button onClick={() => setGlobalError(null)}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
