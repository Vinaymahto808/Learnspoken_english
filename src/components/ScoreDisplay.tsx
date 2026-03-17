import React from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, MessageSquare, BookOpen, Mic } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScoreDisplayProps {
  overallScore: number;
  pronunciationScore: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  feedback: string;
  detailedFeedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
}

export function ScoreDisplay({
  overallScore,
  pronunciationScore,
  grammarScore,
  fluencyScore,
  vocabularyScore,
  feedback,
  detailedFeedback
}: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Practice';
  };

  const scores = [
    { label: 'Pronunciation', value: pronunciationScore, icon: Mic, color: 'primary' },
    { label: 'Grammar', value: grammarScore, icon: BookOpen, color: 'green' },
    { label: 'Fluency', value: fluencyScore, icon: MessageSquare, color: 'blue' },
    { label: 'Vocabulary', value: vocabularyScore, icon: TrendingUp, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-center p-8 bg-white rounded-3xl shadow-lg"
      >
        <div className={cn("w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4", getScoreColor(overallScore))}>
          <div className="text-center">
            <div className="text-4xl font-black">{overallScore}</div>
            <div className="text-xs font-bold uppercase tracking-wider">Score</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">{getScoreLabel(overallScore)}</h3>
        <p className="text-slate-600 leading-relaxed">{feedback}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {scores.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-2xl border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon size={18} className={`text-${item.color}-600`} />
              <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
            </div>
            <div className="text-2xl font-black">{item.value}</div>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className={`h-full bg-${item.color}-500`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {detailedFeedback.strengths.length > 0 && (
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
            <Trophy size={18} />
            Strengths
          </h4>
          <ul className="space-y-2">
            {detailedFeedback.strengths.map((strength, idx) => (
              <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {detailedFeedback.improvements.length > 0 && (
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <h4 className="font-bold text-amber-900 mb-3">Areas to Improve</h4>
          <ul className="space-y-2">
            {detailedFeedback.improvements.map((improvement, idx) => (
              <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {detailedFeedback.suggestions.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-3">Suggestions</h4>
          <ul className="space-y-2">
            {detailedFeedback.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
