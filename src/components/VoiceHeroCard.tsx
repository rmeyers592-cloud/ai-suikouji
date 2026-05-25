import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceHeroCardProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function VoiceHeroCard({ onRecordingComplete, disabled = false }: VoiceHeroCardProps) {
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
  const circumference = 2 * Math.PI * 64;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: '28px',
        background: 'linear-gradient(180deg, rgba(237,237,255,0.6) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.98) 100%)',
        border: '1px solid rgba(120,130,180,0.12)',
        boxShadow: '0 20px 60px rgba(36, 45, 100, 0.1), 0 4px 16px rgba(91, 95, 239, 0.06)',
        minHeight: '250px',
      }}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(91, 95, 239, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Sound wave decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.22 }}>
        <svg width="340" height="140" viewBox="0 0 340 140" fill="none">
          <path
            d="M0 70 Q40 30, 80 70 T160 70 T240 70 T320 70 T340 70"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M0 70 Q40 50, 80 70 T160 70 T240 70 T320 70 T340 70"
            stroke="var(--color-primary-light)"
            strokeWidth="1"
            opacity="0.25"
            fill="none"
            transform="translate(0, -15)"
          />
          <path
            d="M0 70 Q40 90, 80 70 T160 70 T240 70 T320 70 T340 70"
            stroke="var(--color-primary-light)"
            strokeWidth="1"
            opacity="0.25"
            fill="none"
            transform="translate(0, 15)"
          />
          <path
            d="M0 70 Q40 45, 80 70 T160 70 T240 70 T320 70 T340 70"
            stroke="var(--color-primary)"
            strokeWidth="0.8"
            opacity="0.15"
            fill="none"
            transform="translate(0, -30)"
          />
          <path
            d="M0 70 Q40 95, 80 70 T160 70 T240 70 T320 70 T340 70"
            stroke="var(--color-primary)"
            strokeWidth="0.8"
            opacity="0.15"
            fill="none"
            transform="translate(0, 30)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center pt-10 pb-8 px-8">
        {/* Mic button area */}
        <div className="relative mb-6">
          {/* Outer glow rings (always visible, stronger) */}
          <div
            className="absolute rounded-full animate-glow-breathe"
            style={{
              inset: '-28px',
              background: 'radial-gradient(circle, rgba(91, 95, 239, 0.18) 0%, rgba(91, 95, 239, 0.06) 40%, transparent 70%)',
            }}
          />
          {/* Thin decorative ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: '-14px',
              border: '1.5px solid rgba(91, 95, 239, 0.12)',
            }}
          />

          {/* Recording pulse rings */}
          {isRecording && (
            <>
              <div
                className="absolute rounded-full border-2 border-primary/25 animate-pulse-ring"
                style={{ inset: '-16px' }}
              />
              <div
                className="absolute rounded-full border border-primary/15 animate-pulse-ring-slow"
                style={{ inset: '-32px' }}
              />
            </>
          )}

          {/* Progress ring */}
          <svg
            className="absolute -rotate-90"
            style={{
              inset: '-10px',
              width: 'calc(100% + 20px)',
              height: 'calc(100% + 20px)',
            }}
          >
            <circle
              cx="50%" cy="50%" r="64"
              fill="none"
              stroke="rgba(91,95,239,0.08)"
              strokeWidth="3"
            />
            <circle
              cx="50%" cy="50%" r="64"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3.5"
              strokeDasharray={`${progress * circumference} ${circumference}`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>

          {/* Main mic button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={() => isRecording && stopRecording()}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={disabled}
            className={`relative rounded-full flex items-center justify-center transition-all duration-300 select-none
              ${isRecording
                ? 'bg-primary text-white scale-110 animate-recording-glow'
                : disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-primary active:scale-95'
              }`}
            style={{
              width: '132px',
              height: '132px',
              ...(!isRecording && !disabled ? {
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid rgba(91, 95, 239, 0.15)',
                boxShadow: '0 12px 40px rgba(91, 95, 239, 0.18), 0 4px 12px rgba(91, 95, 239, 0.08), inset 0 1px 2px rgba(255,255,255,0.8)',
              } : isRecording ? {
                boxShadow: '0 0 0 0 rgba(91, 95, 239, 0.3), 0 0 60px rgba(91, 95, 239, 0.2)',
              } : undefined),
            }}
          >
            {disabled ? (
              <MicOff size={40} className="animate-pulse" />
            ) : (
              <Mic size={42} strokeWidth={isRecording ? 2.5 : 1.8} />
            )}
          </button>
        </div>

        {/* Text */}
        <h2
          className={`mb-2 ${isRecording ? 'text-primary' : ''}`}
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: isRecording ? undefined : 'var(--color-primary)',
            letterSpacing: '-0.3px',
          }}
        >
          {isRecording ? '正在录音...' : '按住说话'}
        </h2>
        <p
          className="mb-6"
          style={{
            fontSize: '15px',
            color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
          }}
        >
          {disabled ? '正在处理中...' : '说得乱也没关系，我会帮你整理'}
        </p>

        {/* Capability tags */}
        {!isRecording && !disabled && (
          <div className="flex items-center justify-center" style={{ gap: '10px' }}>
            {[
              { label: '待办', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: '☐' },
              { label: '提醒', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: '🔔' },
              { label: '灵感', color: '#EC4899', bg: 'rgba(236,72,153,0.08)', icon: '💡' },
            ].map(({ label, color, bg, icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5"
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color,
                  background: bg,
                  border: `1px solid ${color}15`,
                }}
              >
                <span style={{ fontSize: '12px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Recording progress */}
        {isRecording && (
          <div className="flex items-center gap-2 mt-2 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
              {Math.floor(holdProgress * 0.06)}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
