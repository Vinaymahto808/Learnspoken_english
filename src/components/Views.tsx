import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Target, Trophy, TrendingUp, ChevronRight, CheckCircle2, Play,
  X, Send, Sparkles, Award, Medal, Clock, BarChart3, Calendar,
  BookOpen, Zap, Star, Volume2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SpeechRecorder } from './SpeechRecorder';
import { ScoreDisplay } from './ScoreDisplay';

export function Dashboard({ profile, completedLessons, totalLessons, averageScore, dailyChallenge, lessons, setView, setSelectedLesson }: any) {
  const progressPercent = (completedLessons / totalLessons) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black">Welcome back, {profile?.display_name}!</h2>
        <p className="text-slate-500">Ready to improve your English today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">{completedLessons}/{totalLessons}</div>
              <div className="text-xs text-slate-500 font-medium">Lessons Completed</div>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <Trophy size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">{Math.round(averageScore)}</div>
              <div className="text-xs text-slate-500 font-medium">Average Score</div>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(averageScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">Level {profile?.level}</div>
              <div className="text-xs text-slate-500 font-medium">{profile?.xp} XP</div>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            {500 - (profile?.xp % 500)} XP to next level
          </div>
        </div>
      </div>

      {dailyChallenge && (
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-3xl text-white shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <span className="font-bold">Daily Challenge</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
              +{dailyChallenge.xp_reward} XP
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">{dailyChallenge.prompt}</h3>
          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {dailyChallenge.max_duration}s
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
              {dailyChallenge.difficulty}
            </span>
          </div>
          <button
            onClick={() => setView('challenge')}
            className="w-full py-3 bg-white text-orange-600 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Start Challenge
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Continue Learning</h3>
          <button
            onClick={() => setView('lessons')}
            className="text-primary font-bold text-sm flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid gap-3">
          {lessons.map((lesson: any) => (
            <button
              key={lesson.id}
              onClick={() => {
                setSelectedLesson(lesson);
                setView('practice');
              }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{lesson.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-bold",
                    lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                    lesson.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  )}>
                    {lesson.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">+{lesson.xp_reward} XP</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setView('lessons')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all text-left group"
        >
          <BookOpen size={32} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold mb-1">Browse Lessons</h4>
          <p className="text-sm text-slate-500">50+ interactive modules</p>
        </button>

        <button
          onClick={() => setView('tutor')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all text-left group"
        >
          <Sparkles size={32} className="text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold mb-1">AI Tutor Chat</h4>
          <p className="text-sm text-slate-500">Practice conversations</p>
        </button>

        <button
          onClick={() => setView('leaderboard')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all text-left group"
        >
          <Trophy size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold mb-1">Leaderboard</h4>
          <p className="text-sm text-slate-500">See global rankings</p>
        </button>
      </div>
    </motion.div>
  );
}

export function LessonsView({ lessons, userProgress, setSelectedLesson, setView }: any) {
  const categories = Array.from(new Set(lessons.map((l: any) => l.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">All Lessons</h2>
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full">
          <X size={24} />
        </button>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-bold text-slate-700">{category}</h3>
          <div className="grid gap-3">
            {lessons
              .filter((l: any) => l.category === category)
              .map((lesson: any) => {
                const progress = userProgress.get(lesson.id);
                const isCompleted = progress?.status === 'completed';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setView('practice');
                    }}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all text-left group"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
                      isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                    )}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Play size={24} fill="currentColor" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{lesson.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{lesson.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-bold",
                          lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                          lesson.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        )}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-xs text-slate-400">+{lesson.xp_reward} XP</span>
                        {isCompleted && progress?.score && (
                          <span className="text-xs text-green-600 font-bold">Score: {progress.score}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function PracticeView({ lesson, isProcessing, analysisResult, handleRecordingComplete, setView, setAnalysisResult }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <button onClick={() => {
          setView('lessons');
          setAnalysisResult(null);
        }} className="p-2 hover:bg-slate-200 rounded-full">
          <X size={24} />
        </button>
        <div className="text-sm text-slate-500">Practice Session</div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
        <div className={cn(
          "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4",
          lesson.difficulty === 'Beginner' ? 'bg-green-50 text-green-600' :
          lesson.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-600' :
          'bg-purple-50 text-purple-600'
        )}>
          <BookOpen size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-slate-600 mb-4">{lesson.description}</p>
        <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
          {lesson.category}
        </div>
      </div>

      {lesson.transcript && (
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={18} className="text-blue-600" />
            <h4 className="font-bold text-blue-900">Reference Text</h4>
          </div>
          <p className="text-blue-800 leading-relaxed">{lesson.transcript}</p>
        </div>
      )}

      {!analysisResult ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-center">Your Turn to Speak</h3>
          <SpeechRecorder
            onRecordingComplete={handleRecordingComplete}
            isProcessing={isProcessing}
            maxDuration={90}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ScoreDisplay {...analysisResult} />
          <div className="flex gap-3">
            <button
              onClick={() => setAnalysisResult(null)}
              className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg"
            >
              Practice Again
            </button>
            <button
              onClick={() => {
                setView('lessons');
                setAnalysisResult(null);
              }}
              className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function ChallengeView({ challenge, isProcessing, analysisResult, handleRecordingComplete, setView, setAnalysisResult }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <button onClick={() => {
          setView('dashboard');
          setAnalysisResult(null);
        }} className="p-2 hover:bg-slate-200 rounded-full">
          <X size={24} />
        </button>
        <div className="text-sm text-slate-500">Daily Challenge</div>
      </div>

      <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Target size={32} />
          <h2 className="text-2xl font-bold">Today's Challenge</h2>
        </div>
        <p className="text-xl mb-4">{challenge.prompt}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <Clock size={16} />
            {challenge.max_duration}s max
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
            {challenge.difficulty}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
            +{challenge.xp_reward} XP
          </span>
        </div>
      </div>

      {!analysisResult ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-center">Record Your Response</h3>
          <SpeechRecorder
            onRecordingComplete={handleRecordingComplete}
            isProcessing={isProcessing}
            maxDuration={challenge.max_duration}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ScoreDisplay {...analysisResult} />
          <div className="flex gap-3">
            <button
              onClick={() => setAnalysisResult(null)}
              className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setView('dashboard');
                setAnalysisResult(null);
              }}
              className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function LeaderboardView({ leaderboard, currentUserId, setView }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Leaderboard</h2>
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((entry: any, index: number) => (
          <div
            key={entry.user_id}
            className={cn(
              "p-6 rounded-3xl text-center",
              index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' :
              index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
              'bg-gradient-to-br from-orange-400 to-amber-600 text-white'
            )}
          >
            <div className="text-4xl mb-2">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </div>
            <img
              src={entry.avatar_url || 'https://via.placeholder.com/48'}
              alt={entry.display_name}
              className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white"
            />
            <div className="font-bold mb-1 truncate">{entry.display_name}</div>
            <div className="text-sm opacity-90">{entry.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {leaderboard.map((entry: any) => (
            <div
              key={entry.user_id}
              className={cn(
                "flex items-center gap-4 p-4",
                entry.user_id === currentUserId ? 'bg-blue-50' : 'hover:bg-slate-50'
              )}
            >
              <div className={cn(
                "w-8 text-center font-black",
                entry.rank <= 3 ? 'text-amber-600' : 'text-slate-400'
              )}>
                #{entry.rank}
              </div>
              <img
                src={entry.avatar_url || 'https://via.placeholder.com/40'}
                alt={entry.display_name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-bold">
                  {entry.display_name}
                  {entry.user_id === currentUserId && (
                    <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-primary">{entry.xp.toLocaleString()}</div>
                <div className="text-xs text-slate-400">XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TutorView({ chatMessages, chatInput, setChatInput, sendChatMessage, currentSessionId, startChatSession, setView }: any) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">AI Tutor Chat</h2>
            <p className="text-sm text-slate-500">Practice conversations with Alex</p>
          </div>
        </div>
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full">
          <X size={24} />
        </button>
      </div>

      {!currentSessionId ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center space-y-6">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={40} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Start a Conversation</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Practice your English with Alex, your AI tutor. Have natural conversations and get instant feedback.
            </p>
          </div>
          <button
            onClick={startChatSession}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Begin Chat Session
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col" style={{ height: '600px' }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Sparkles size={16} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-md p-4 rounded-2xl",
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSend}
                disabled={!chatInput.trim()}
                className="px-6 py-3 bg-primary text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function AnalyticsView({ profile, userProgress, completedLessons, totalLessons, averageScore, setView }: any) {
  const progressArray = Array.from(userProgress.values());
  const recentSubmissions = progressArray.slice(-7);

  const weakAreas = ['Pronunciation', 'Grammar', 'Fluency', 'Vocabulary'];
  const categoryProgress = [
    { name: 'Greetings', completed: 5, total: 8 },
    { name: 'Work & Business', completed: 3, total: 12 },
    { name: 'Shopping', completed: 4, total: 6 },
    { name: 'Travel', completed: 2, total: 10 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Your Progress</h2>
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <Trophy className="text-amber-600 mb-3" size={32} />
          <div className="text-3xl font-black">{completedLessons}</div>
          <div className="text-sm text-slate-500">Lessons Completed</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <TrendingUp className="text-green-600 mb-3" size={32} />
          <div className="text-3xl font-black">{Math.round(averageScore)}</div>
          <div className="text-sm text-slate-500">Avg Score</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <Award className="text-blue-600 mb-3" size={32} />
          <div className="text-3xl font-black">{profile?.level}</div>
          <div className="text-sm text-slate-500">Current Level</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <Flame className="text-orange-600 mb-3" size={32} />
          <div className="text-3xl font-black">{profile?.streak}</div>
          <div className="text-sm text-slate-500">Day Streak</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6">Progress by Category</h3>
        <div className="space-y-4">
          {categoryProgress.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-sm">{cat.name}</span>
                <span className="text-sm text-slate-500">{cat.completed}/{cat.total}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(cat.completed / cat.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6">Recent Performance</h3>
        <div className="grid grid-cols-7 gap-2">
          {recentSubmissions.map((submission, idx) => (
            <div key={idx} className="text-center">
              <div
                className={cn(
                  "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold mb-1",
                  submission.score >= 80 ? 'bg-green-100 text-green-700' :
                  submission.score >= 60 ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                )}
              >
                {submission.score}
              </div>
              <div className="text-xs text-slate-400">Day {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
