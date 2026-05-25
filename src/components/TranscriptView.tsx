import { useState } from 'react';
import { Loader2, ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface TranscriptViewProps {
  text: string;
  isAnalyzing: boolean;
  summary?: string;
  itemCount?: number;
  categoryBreakdown?: string;
}

export function TranscriptView({ text, isAnalyzing, summary, itemCount, categoryBreakdown }: TranscriptViewProps) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split(/[，。！？]/).filter(Boolean);
  const isLong = lines.length > 3;
  const displayText = expanded || !isLong ? text : lines.slice(0, 3).join('，') + '…';

  return (
    <div className="animate-slide-up space-y-3">
      {/* 我听到你说 */}
      <div className="bg-surface rounded-[18px] border border-border p-4"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot size={13} className="text-primary" />
          </div>
          <span className="text-[12px] font-semibold text-text-secondary">我听到你说</span>
        </div>
        <p className="text-[14px] text-text leading-relaxed">{displayText}</p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[12px] font-medium text-primary mt-2 hover:text-primary-dark transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? '收起' : '展开全部'}
          </button>
        )}
      </div>

      {/* AI 分析中 */}
      {isAnalyzing && (
        <div className="flex items-center justify-center gap-2.5 py-5 animate-fade-in">
          <Loader2 size={18} className="text-primary animate-spin" />
          <span className="text-[13px] text-primary font-medium">AI 正在分析内容...</span>
        </div>
      )}

      {/* AI 已拆分 */}
      {!isAnalyzing && summary && itemCount !== undefined && (
        <div className="bg-primary/[0.04] rounded-[18px] border border-primary/10 p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[15px]">✨</span>
            <span className="text-[14px] font-semibold text-text">
              AI 已帮你拆成 {itemCount} 个事项
            </span>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">{categoryBreakdown || summary}</p>
        </div>
      )}
    </div>
  );
}
