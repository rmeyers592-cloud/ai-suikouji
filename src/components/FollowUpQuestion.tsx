import { AlertCircle, X, Send } from 'lucide-react';
import { useState } from 'react';

interface FollowUpQuestionProps {
  question: string;
  onAnswer: (answer: string) => void;
  onDismiss: () => void;
}

export function FollowUpQuestion({ question, onAnswer, onDismiss }: FollowUpQuestionProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <div className="bg-amber-50/70 border border-amber-100 rounded-[14px] p-4 animate-slide-up">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertCircle size={13} className="text-amber-600" />
          </div>
          <span className="text-[12px] font-semibold text-amber-700">需要补充信息</span>
        </div>
        <button onClick={onDismiss} className="text-amber-400 hover:text-amber-500 transition-colors p-0.5">
          <X size={14} />
        </button>
      </div>

      <p className="text-[13px] text-amber-800 leading-relaxed mb-3">{question}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="输入回答..."
          className="flex-1 text-[13px] px-3 py-2.5 rounded-[10px] border border-amber-200 bg-white text-text
            placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-amber-500 text-white
            hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
