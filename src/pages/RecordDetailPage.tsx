import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActionCardComponent } from '../components/ActionCard';
import { FollowUpQuestion } from '../components/FollowUpQuestion';
import { ArrowLeft, FileText, ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface RecordDetailPageProps {
  recordId: string;
  onBack: () => void;
}

export function RecordDetailPage({ recordId, onBack }: RecordDetailPageProps) {
  const { state, dispatch } = useApp();
  const record = state.records.find((r) => r.id === recordId);
  const [rawExpanded, setRawExpanded] = useState(false);

  if (!record) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-muted">记录不存在</p>
      </div>
    );
  }

  const isLongRaw = record.rawText.length > 60;
  const displayRaw = rawExpanded || !isLongRaw ? record.rawText : record.rawText.slice(0, 60) + '…';

  const breakdown = (() => {
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = { todo: '待办', reminder: '提醒', shopping: '购物', schedule: '日程', draft: '草稿', idea: '灵感', note: '笔记' };
    record.cards.forEach((c) => {
      const l = labels[c.category] || c.category;
      counts[l] = (counts[l] || 0) + 1;
    });
    return Object.entries(counts);
  })();

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/90 glass-effect border-b border-[#E5E7EB]">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-[12px] flex items-center justify-center bg-white border border-[#E5E7EB]
              active:scale-95 transition-all"
          >
            <ArrowLeft size={18} className="text-text" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-text">AI 整理详情</h1>
            <p className="text-[11px] text-text-muted">
              {new Date(record.createdAt).toLocaleString('zh-CN', {
                month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="px-4 pt-4 pb-1">
        <div className="bg-primary/[0.04] rounded-[16px] border border-primary/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-[8px] bg-primary/10 flex items-center justify-center">
              <Bot size={14} className="text-primary" />
            </div>
            <span className="text-[14px] font-bold text-text">
              AI 已拆解 {record.cards.length} 个事项
            </span>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {breakdown.map(([label, count]) => (
              <span key={label} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/[0.06] text-primary">
                {count} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Raw text - collapsible */}
      <div className="px-4 py-3">
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={13} className="text-text-muted" />
            <span className="text-[12px] font-semibold text-text-muted">原始语音</span>
          </div>
          <p className="text-[13px] text-text leading-relaxed">{displayRaw}</p>
          {isLongRaw && (
            <button
              onClick={() => setRawExpanded(!rawExpanded)}
              className="flex items-center gap-1 text-[12px] font-medium text-primary mt-2"
            >
              {rawExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {rawExpanded ? '收起' : '展开'}
            </button>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-4 pb-8">
        <h3 className="text-[13px] font-bold text-text mb-3">行动卡片</h3>
        <div className="space-y-3">
          {record.cards.map((card, index) => (
            <div key={card.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.06}s` }}>
              <ActionCardComponent
                card={card}
                showActions
                onConfirm={() =>
                  dispatch({ type: 'UPDATE_CARD_STATUS', payload: { recordId: record.id, cardId: card.id, status: 'confirmed' } })
                }
                onMarkDone={() =>
                  dispatch({ type: 'UPDATE_CARD_STATUS', payload: { recordId: record.id, cardId: card.id, status: 'done' } })
                }
                onDismiss={() =>
                  dispatch({ type: 'DISMISS_CARD', payload: { recordId: record.id, cardId: card.id } })
                }
              />
              {card.needsFollowUp && card.followUpQuestion && card.status !== 'confirmed' && (
                <div className="mt-2">
                  <FollowUpQuestion
                    question={card.followUpQuestion}
                    onAnswer={() =>
                      dispatch({ type: 'ANSWER_FOLLOWUP', payload: { recordId: record.id, cardId: card.id, answer: '' } })
                    }
                    onDismiss={() =>
                      dispatch({ type: 'DISMISS_CARD', payload: { recordId: record.id, cardId: card.id } })
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
