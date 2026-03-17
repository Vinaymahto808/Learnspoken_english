import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Flame, BookOpen, Mic2, MessageSquare, ChevronRight, Star,
  CheckCircle2, Play, Volume2, X, Users, TrendingUp, Target, Award,
  Home, Calendar, BarChart3, LogOut, Loader2, AlertCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';
import { LESSONS_DATA } from './data/lessons';
import { transcribeAudio, analyzeSpeech, getChatResponse, type SpeechAnalysis } from './services/openaiService';
import { SpeechRecorder } from './components/SpeechRecorder';
import { ScoreDisplay } from './components/ScoreDisplay';
import { Dashboard, LessonsView, PracticeView, ChallengeView, LeaderboardView, TutorView, AnalyticsView } from './components/Views';
import type { Database } from './lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type UserLessonProgress = Database['public']['Tables']['user_lesson_progress']['Row'];

interface DailyChallenge {
  id: string;
  prompt: string;
  difficulty: string;
  category: string;
  max_duration: number;
  xp_reward: number;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string;
  xp: number;
  rank: number;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'lessons' | 'practice' | 'challenge' | 'leaderboard' | 'tutor' | 'analytics'>('dashboard');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<Map<string, UserLessonProgress>>(new Map());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SpeechAnalysis | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (profile) {
      loadLessons();
      loadDailyChallenge();
      loadLeaderboard();
    }
  }, [profile]);

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadOrCreateProfile(session.user);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadOrCreateProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
  };

  const loadOrCreateProfile = async (authUser: any) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingProfile) {
        setProfile(existingProfile);
        await supabase
          .from('profiles')
          .update({ last_active: new Date().toISOString() })
          .eq('id', authUser.id);
      } else {
        const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
          id: authUser.id,
          email: authUser.email!,
          display_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          avatar_url: authUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${authUser.email?.split('@')[0]}&background=3b82f6&color=fff`
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      }
    } catch (error: any) {
      console.error('Profile error:', error);
      setError(error.message);
    }
  };

  const loadLessons = async () => {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      if (!lessonsData || lessonsData.length === 0) {
        await seedLessons();
        return;
      }

      setLessons(lessonsData);

      if (profile) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', profile.id);

        if (progressError) throw progressError;

        const progressMap = new Map(progressData?.map(p => [p.lesson_id, p]) || []);
        setUserProgress(progressMap);
      }
    } catch (error: any) {
      console.error('Load lessons error:', error);
      setError(error.message);
    }
  };

  const seedLessons = async () => {
    try {
      const lessonsToInsert = LESSONS_DATA.map((lesson, index) => ({
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        difficulty: lesson.difficulty,
        xp_reward: lesson.xp_reward,
        transcript: lesson.transcript,
        order_index: index,
        is_active: true
      }));

      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonsToInsert)
        .select();

      if (error) throw error;
      setLessons(data || []);
    } catch (error: any) {
      console.error('Seed lessons error:', error);
      setError(error.message);
    }
  };

  const loadDailyChallenge = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('active_date', today)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        await createDailyChallenge();
      } else {
        setDailyChallenge(data);
      }
    } catch (error: any) {
      console.error('Load challenge error:', error);
    }
  };

  const createDailyChallenge = async () => {
    const challenges = [
      { prompt: 'Describe your morning routine in detail', category: 'Daily Life', difficulty: 'Beginner' as const },
      { prompt: 'Explain why learning English is important for your career', category: 'Career', difficulty: 'Intermediate' as const },
      { prompt: 'Discuss the impact of technology on modern communication', category: 'Technology', difficulty: 'Advanced' as const },
      { prompt: 'Tell a story about a memorable trip you took', category: 'Travel', difficulty: 'Intermediate' as const },
      { prompt: 'Describe your dream job and why it appeals to you', category: 'Career', difficulty: 'Intermediate' as const },
      { prompt: 'Explain a traditional festival celebrated in your region', category: 'Culture', difficulty: 'Intermediate' as const },
      { prompt: 'Talk about a book or movie that influenced you', category: 'Entertainment', difficulty: 'Intermediate' as const },
      { prompt: 'Describe how you handle stress and pressure', category: 'Personal Development', difficulty: 'Advanced' as const }
    ];

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('daily_challenges')
        .insert({
          ...randomChallenge,
          active_date: today,
          max_duration: 90,
          xp_reward: 50
        })
        .select()
        .single();

      if (error) throw error;
      setDailyChallenge(data);
    } catch (error: any) {
      console.error('Create challenge error:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, xp')
        .order('xp', { ascending: false })
        .limit(20);

      if (error) throw error;

      const leaderboardData = data?.map((entry, index) => ({
        user_id: entry.id,
        display_name: entry.display_name || 'User',
        avatar_url: entry.avatar_url || '',
        xp: entry.xp,
        rank: index + 1
      })) || [];

      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('Load leaderboard error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('dashboard');
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!profile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const transcription = await transcribeAudio(audioBlob);
      const expectedText = selectedLesson?.transcript || dailyChallenge?.prompt || '';
      const analysis = await analyzeSpeech(transcription, expectedText, selectedLesson ? 'lesson' : 'challenge');

      setAnalysisResult(analysis);

      const { error: submissionError } = await supabase
        .from('speech_submissions')
        .insert({
          user_id: profile.id,
          lesson_id: selectedLesson?.id,
          transcription: analysis.transcription,
          score: analysis.overallScore,
          pronunciation_score: analysis.pronunciationScore,
          grammar_score: analysis.grammarScore,
          fluency_score: analysis.fluencyScore,
          vocabulary_score: analysis.vocabularyScore,
          feedback: analysis.feedback,
          analysis: analysis.detailedFeedback as any
        });

      if (submissionError) throw submissionError;

      const xpGained = selectedLesson?.xp_reward || dailyChallenge?.xp_reward || 0;
      await updateXP(xpGained);

      if (selectedLesson && analysis.overallScore >= 70) {
        await markLessonComplete(selectedLesson.id, analysis.overallScore);
      }

      if (dailyChallenge && view === 'challenge') {
        await supabase
          .from('user_challenges')
          .insert({
            user_id: profile.id,
            challenge_id: dailyChallenge.id,
            score: analysis.overallScore,
            transcription: analysis.transcription,
            feedback: analysis.feedback
          });
      }

    } catch (error: any) {
      console.error('Processing error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateXP = async (amount: number) => {
    if (!profile) return;

    const newXP = profile.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;

    const { error } = await supabase
      .from('profiles')
      .update({ xp: newXP, level: newLevel })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, xp: newXP, level: newLevel });
    }
  };

  const markLessonComplete = async (lessonId: string, score: number) => {
    if (!profile) return;

    const existingProgress = userProgress.get(lessonId);

    if (existingProgress) {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .update({
          status: 'completed',
          score: Math.max(score, existingProgress.score),
          attempts: existingProgress.attempts + 1,
          completed_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (!error && data) {
        userProgress.set(lessonId, data);
        setUserProgress(new Map(userProgress));
      }
    } else {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: profile.id,
          lesson_id: lessonId,
          status: 'completed',
          score,
          attempts: 1,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!error && data) {
        userProgress.set(lessonId, data);
        setUserProgress(new Map(userProgress));
      }
    }

    await supabase
      .from('profiles')
      .update({ total_lessons_completed: profile.total_lessons_completed + 1 })
      .eq('id', profile.id);
  };

  const startChatSession = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: profile.id })
      .select()
      .single();

    if (!error && data) {
      setCurrentSessionId(data.id);
      setChatMessages([{
        role: 'assistant',
        content: 'Hello! I\'m Alex, your English tutor. What would you like to practice today?'
      }]);
    }
  };

  const sendChatMessage = async (userMessage: string) => {
    if (!currentSessionId || !profile) return;

    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
    setChatMessages(newMessages);

    await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        role: 'user',
        content: userMessage
      });

    try {
      const response = await getChatResponse(newMessages);
      const updatedMessages = [...newMessages, { role: 'assistant' as const, content: response }];
      setChatMessages(updatedMessages);

      await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          role: 'assistant',
          content: response
        });

      await supabase
        .from('chat_sessions')
        .update({ message_count: updatedMessages.length })
        .eq('id', currentSessionId);

    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl mx-auto">
            <Mic2 size={48} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight mb-4">SpeakEase</h1>
            <p className="text-xl text-slate-600 max-w-md">Master Spoken English with AI-Powered Practice</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full max-w-sm py-4 px-8 bg-white border-2 border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-lg"
            >
              <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
              Continue with Google
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-xl pt-8">
            <div className="text-center">
              <div className="text-3xl font-black text-primary">50+</div>
              <div className="text-sm text-slate-500">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary">AI</div>
              <div className="text-sm text-slate-500">Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary">24/7</div>
              <div className="text-sm text-slate-500">Practice</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Continue in next part...
  return <MainApp
    profile={profile}
    view={view}
    setView={setView}
    lessons={lessons}
    userProgress={userProgress}
    selectedLesson={selectedLesson}
    setSelectedLesson={setSelectedLesson}
    dailyChallenge={dailyChallenge}
    isProcessing={isProcessing}
    analysisResult={analysisResult}
    setAnalysisResult={setAnalysisResult}
    leaderboard={leaderboard}
    chatMessages={chatMessages}
    currentSessionId={currentSessionId}
    handleRecordingComplete={handleRecordingComplete}
    startChatSession={startChatSession}
    sendChatMessage={sendChatMessage}
    handleLogout={handleLogout}
    error={error}
    setError={setError}
  />;
}

// Split into separate component for better organization
function MainApp({ profile, view, setView, lessons, userProgress, selectedLesson, setSelectedLesson, dailyChallenge, isProcessing, analysisResult, setAnalysisResult, leaderboard, chatMessages, currentSessionId, handleRecordingComplete, startChatSession, sendChatMessage, handleLogout, error, setError }: any) {
  const [chatInput, setChatInput] = useState('');

  const completedLessons = Array.from(userProgress.values()).filter(p => p.status === 'completed').length;
  const totalLessons = lessons.length;
  const averageScore = Array.from(userProgress.values()).reduce((acc, p) => acc + p.score, 0) / (completedLessons || 1);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-50 glass px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Mic2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">SpeakEase</h1>
              <p className="text-xs text-slate-500">Level {profile?.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm">
              <Flame size={18} fill="currentColor" />
              {profile?.streak || 0}
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold text-sm">
              <Trophy size={18} />
              {profile?.xp || 0} XP
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <Dashboard
              profile={profile}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
              averageScore={averageScore}
              dailyChallenge={dailyChallenge}
              lessons={lessons.slice(0, 5)}
              setView={setView}
              setSelectedLesson={setSelectedLesson}
            />
          )}

          {view === 'lessons' && (
            <LessonsView
              lessons={lessons}
              userProgress={userProgress}
              setSelectedLesson={setSelectedLesson}
              setView={setView}
            />
          )}

          {view === 'practice' && selectedLesson && (
            <PracticeView
              lesson={selectedLesson}
              isProcessing={isProcessing}
              analysisResult={analysisResult}
              handleRecordingComplete={handleRecordingComplete}
              setView={setView}
              setAnalysisResult={setAnalysisResult}
            />
          )}

          {view === 'challenge' && dailyChallenge && (
            <ChallengeView
              challenge={dailyChallenge}
              isProcessing={isProcessing}
              analysisResult={analysisResult}
              handleRecordingComplete={handleRecordingComplete}
              setView={setView}
              setAnalysisResult={setAnalysisResult}
            />
          )}

          {view === 'leaderboard' && (
            <LeaderboardView
              leaderboard={leaderboard}
              currentUserId={profile?.id}
              setView={setView}
            />
          )}

          {view === 'tutor' && (
            <TutorView
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              sendChatMessage={sendChatMessage}
              currentSessionId={currentSessionId}
              startChatSession={startChatSession}
              setView={setView}
            />
          )}

          {view === 'analytics' && (
            <AnalyticsView
              profile={profile}
              userProgress={userProgress}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
              averageScore={averageScore}
              setView={setView}
            />
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-around items-center">
          <NavButton icon={Home} label="Home" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={BookOpen} label="Lessons" active={view === 'lessons'} onClick={() => setView('lessons')} />
          <NavButton icon={Calendar} label="Challenge" active={view === 'challenge'} onClick={() => setView('challenge')} />
          <NavButton icon={Users} label="Leaderboard" active={view === 'leaderboard'} onClick={() => setView('leaderboard')} />
          <NavButton icon={MessageSquare} label="AI Tutor" active={view === 'tutor'} onClick={() => setView('tutor')} />
          <NavButton icon={BarChart3} label="Analytics" active={view === 'analytics'} onClick={() => setView('analytics')} />
        </div>
      </nav>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-6 right-6 bg-red-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-50"
        >
          <AlertCircle size={20} />
          <p className="text-sm font-medium flex-1">{error}</p>
          <button onClick={() => setError(null)}>
            <X size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Navigation Button Component
function NavButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
        active ? "text-primary bg-blue-50" : "text-slate-400 hover:text-slate-600"
      )}
    >
      <Icon size={20} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

// View Components will be in the next file
export default App;
