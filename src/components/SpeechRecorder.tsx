import React, { useState, useRef, useEffect } from 'react';
import { Mic2, Square, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface SpeechRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing?: boolean;
  maxDuration?: number;
}

export function SpeechRecorder({ onRecordingComplete, isProcessing, maxDuration = 60 }: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-xl",
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary hover:bg-blue-600",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          whileTap={{ scale: 0.95 }}
        >
          {isProcessing ? (
            <Loader2 size={48} className="text-white animate-spin" />
          ) : isRecording ? (
            <Square size={48} className="text-white" fill="white" />
          ) : (
            <Mic2 size={48} className="text-white" />
          )}
        </motion.button>

        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="absolute w-32 h-32 border-4 border-red-500 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        {isRecording ? (
          <>
            <div className="text-3xl font-bold text-red-500">
              {formatTime(recordingTime)}
            </div>
            <p className="text-sm text-slate-500">
              Recording... Tap to stop
            </p>
          </>
        ) : isProcessing ? (
          <p className="text-sm text-slate-500">
            Analyzing your speech...
          </p>
        ) : (
          <>
            <p className="text-lg font-bold">Ready to speak</p>
            <p className="text-sm text-slate-500">
              Tap the microphone to start
            </p>
          </>
        )}
      </div>

      {maxDuration && !isRecording && !isProcessing && (
        <p className="text-xs text-slate-400">
          Maximum duration: {maxDuration} seconds
        </p>
      )}
    </div>
  );
}
