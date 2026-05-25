import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecordingComplete, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];

      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
      setHoldProgress(0);

      holdTimer.current = setInterval(() => {
        setHoldProgress((p) => Math.min(p + 1, 100));
      }, 60);
    } catch {
      setIsRecording(true);
      setHoldProgress(0);
      holdTimer.current = setInterval(() => {
        setHoldProgress((p) => Math.min(p + 1, 100));
      }, 60);
    }
  }, [disabled, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    setIsRecording(false);
    setHoldProgress(0);

    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    } else {
      const blob = new Blob([], { type: 'audio/webm' });
      onRecordingComplete(blob);
    }
  }, [onRecordingComplete]);

  const progress = holdProgress / 100;
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="relative flex flex-col items-center">
      {/* Recording status indicator */}
      {isRecording && (
        <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] font-medium text-primary">
            录音中 · {Math.floor(holdProgress * 0.06)}s
          </span>
        </div>
      )}

      {/* Button container */}
      <div className="relative">
        {/* Pulse rings */}
        {isRecording && (
          <>
            <div className="absolute inset-[-8px] rounded-full bg-primary/10 animate-pulse-ring" />
            <div className="absolute inset-[-16px] rounded-full bg-primary/5 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        {/* Progress ring */}
        <svg className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90">
          <circle cx="50%" cy="50%" r="52" fill="none" stroke="var(--color-border-light)" strokeWidth="3" />
          <circle
            cx="50%" cy="50%" r="52" fill="none" stroke="var(--color-primary)" strokeWidth="3"
            strokeDasharray={`${progress * circumference} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>

        {/* Main button */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={() => isRecording && stopRecording()}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={disabled}
          className={`relative w-[104px] h-[104px] rounded-full flex items-center justify-center transition-all select-none
            ${isRecording
              ? 'bg-primary text-white scale-105 animate-recording-glow'
              : disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-primary border-2 border-primary/20 hover:border-primary/40 active:scale-95 shadow-lg shadow-primary/10'
            }`}
        >
          {disabled ? (
            <MicOff size={32} className="animate-pulse" />
          ) : (
            <Mic size={32} strokeWidth={isRecording ? 2.5 : 2} />
          )}
        </button>
      </div>

      {/* Hint text */}
      <p className="mt-4 text-[13px] text-text-secondary text-center">
        {isRecording ? (
          <span className="font-semibold text-primary">松开结束录音</span>
        ) : disabled ? (
          <span className="text-text-muted">正在处理中...</span>
        ) : (
          '按住说话'
        )}
      </p>
    </div>
  );
}
