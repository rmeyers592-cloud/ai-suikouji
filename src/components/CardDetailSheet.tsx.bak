import { useEffect, useRef, useState } from 'react';
import type { ActionCard } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { CATEGORY_CONFIG } from '../types';
import {
  CheckSquare, Bell, ShoppingCart, Calendar, FileText, Lightbulb, StickyNote,
  Clock, User, X, Copy, Check, ChevronDown, ChevronUp, MessageCircle,
} from 'lucide-react';

interface CardDetailSheetProps {
  card: ActionCard;
  onClose: () => void;
  onConfirm?: () => void;
  onMarkDone?: () => void;
  onDismiss?: () => void;
}

const ICON_MAP = { CheckSquare, Bell, ShoppingCart, Calendar, FileText, Lightbulb, StickyNote } as const;

export function CardDetailSheet({ card, onClose, onConfirm, onMarkDone, onDismiss }: CardDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const config = CATEGORY_CONFIG[card.category];
  const IconComponent = ICON_MAP[config.icon as keyof typeof ICON_MAP] || FileText;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCopy = () => {
    const text = card.draftContent || card.summary;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLongSummary = card.summary.length > 60;
  const displaySummary = showFullSummary || !isLongSummary ? card.summary : card.summary.slice(0, 60) + '…';

  const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    pending: { label: '待处理', cls: 'bg-amber-50 text-amber-600' },
    confirmed: { label: '已确认', cls: 'bg-blue-50 text-blue-600' },
    done: { label: '已完成', cls: 'bg-emerald-50 text-emerald-600' },
    dismissed: { label: '已忽略', cls: 'bg-gray-50 text-gray-500' },
  };
  const statusInfo = STATUS_MAP[card.status] || STATUS_MAP.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-[430px] bg-white rounded-t-[24px] shadow-2xl
          animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ background: config.bgVar }}
            >
              <IconComponent size={20} style={{ color: config.colorVar }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CategoryBadge category={card.category} />
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.cls}`}>
                  {statusInfo.label}
                </span>
              </div>
              <h2 className="text-[17px] font-bold text-text mt-1.5">{card.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 space-y-4">
          {/* Summary */}
          <div>
            <p className="text-[14px] text-text leading-relaxed">{displaySummary}</p>
            {isLongSummary && (
              <button
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="flex items-center gap-1 text-[12px] font-medium text-primary mt-1"
              >
                {showFullSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showFullSummary ? '收起' : '展开全文'}
              </button>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-2">
            {card.time && (
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-[12px] text-text-secondary">
                <Clock size={12} />
                {card.time}
              </div>
            )}
            {card.person && (
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-[12px] text-text-secondary">
                <User size={12} />
                {card.person}
              </div>
            )}
            {card.priority === 'high' && (
              <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full text-[12px] text-red-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                重要
              </div>
            )}
          </div>

          {/* Follow-up question */}
          {card.needsFollowUp && card.followUpQuestion && card.status !== 'confirmed' && (
            <div className="bg-amber-50/80 border border-amber-100 rounded-[14px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={14} className="text-amber-600" />
                <span className="text-[12px] font-semibold text-amber-700">需要补充信息</span>
              </div>
              <p className="text-[13px] text-amber-800 leading-relaxed">{card.followUpQuestion}</p>
            </div>
          )}

          {/* Draft preview */}
          {card.category === 'draft' && card.draftContent && (
            <div className="bg-gray-50 rounded-[14px] p-4 border border-gray-100">
              <p className="text-[12px] font-medium text-text-secondary mb-2">消息草稿</p>
              <p className="text-[13px] text-text leading-relaxed">{card.draftContent}</p>
            </div>
          )}

          {/* Action buttons */}
          {card.status !== 'done' && (
            <div className="flex gap-2 pt-2">
              {card.status === 'pending' && onConfirm && (
                <button
                  onClick={onConfirm}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[14px] bg-primary text-white
                    font-semibold text-[13px] active:scale-[0.97] transition-all shadow-sm shadow-primary/20"
                >
                  <Check size={15} />
                  确认
                </button>
              )}
              {(card.category === 'draft' || card.draftContent) && (
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[14px] bg-gray-100 text-text
                    font-semibold text-[13px] active:scale-[0.97] transition-all"
                >
                  <Copy size={14} />
                  {copied ? '已复制' : '复制'}
                </button>
              )}
              {onMarkDone && (
                <button
                  onClick={onMarkDone}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-[14px] bg-emerald-50 text-emerald-600
                    font-semibold text-[13px] active:scale-[0.97] transition-all"
                >
                  完成
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex items-center justify-center py-3 px-3 rounded-[14px] text-text-muted
                    font-medium text-[13px] active:scale-[0.97] transition-all"
                >
                  忽略
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
