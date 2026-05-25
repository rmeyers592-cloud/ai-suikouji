import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CardDetailSheet } from '../components/CardDetailSheet';
import { EmptyState } from '../components/EmptyState';
import { CATEGORY_CONFIG, type CardCategory, type ActionCard } from '../types';
import { Search, FileSearch, Sparkles, ChevronRight, Clock } from 'lucide-react';

interface RecordsPageProps {
  onNavigate: (page: string, recordId?: string) => void;
}

const ALL_CATEGORIES: (CardCategory | 'all')[] = ['all', 'todo', 'reminder', 'shopping', 'schedule', 'draft', 'idea', 'note'];
const CATEGORY_LABELS: Record<string, string> = {
  all: '全部',
  ...Object.fromEntries(Object.entries(CATEGORY_CONFIG).map(([k, v]) => [k, v.label])),
};

export function RecordsPage({ onNavigate }: RecordsPageProps) {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CardCategory | 'all'>('all');
  const [selectedCard, setSelectedCard] = useState<ActionCard | null>(null);

  const filteredRecords = useMemo(() => {
    return state.records.filter((record) => {
      const matchesSearch =
        !search ||
        record.rawText.toLowerCase().includes(search.toLowerCase()) ||
        record.cards.some((c) => c.title.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter =
        filter === 'all' || record.cards.some((c) => c.category === filter);
      return matchesSearch && matchesFilter;
    });
  }, [state.records, search, filter]);

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="px-6 pt-6 pb-1">
        <h1 className="text-[28px] font-extrabold text-text tracking-tight">全部记录</h1>
        <p className="text-[15px] text-text-secondary mt-0.5">共 {state.records.length} 条语音记录</p>
      </div>

      {/* Search */}
      <div className="px-6 pt-3 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索语音、事项、人物..."
            className="w-full text-[14px] pl-11 pr-4 py-3.5 rounded-[16px] bg-white border border-white/60
              placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 text-[12px] font-semibold px-3.5 py-2 rounded-full transition-all
                ${filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary'
                }`}
              style={filter !== cat ? { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' } : undefined}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Records list */}
      <div className="px-6 pb-8">
        {filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((record, index) => {
              const cardCategories = [...new Set(record.cards.map((c) => c.category))];

              return (
                <button
                  key={record.id}
                  onClick={() => onNavigate('detail', record.id)}
                  className="w-full text-left bg-white rounded-[18px] p-4 transition-all
                    active:scale-[0.99]"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}
                >
                  <div className="flex items-start gap-3">
                    {/* AI icon */}
                    <div className="w-10 h-10 rounded-[12px] bg-primary/[0.08] flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[15px] font-bold text-text">
                          AI 整理了 {record.cards.length} 张卡片
                        </h3>
                        <ChevronRight size={16} className="text-text-muted shrink-0" />
                      </div>

                      {/* Summary */}
                      <p className="text-[13px] text-text-secondary line-clamp-1 mb-2">{record.rawText}</p>

                      {/* Tags + time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {cardCategories.slice(0, 3).map((cat) => (
                            <span
                              key={cat}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ color: CATEGORY_CONFIG[cat].colorVar, background: CATEGORY_CONFIG[cat].bgVar }}
                            >
                              {CATEGORY_CONFIG[cat].label}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(record.createdAt).toLocaleString('zh-CN', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                          <span>{record.cards.length} 张</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FileSearch}
            title="没有找到记录"
            description={search ? '试试换个关键词搜索' : '在首页录一段语音开始记录吧'}
          />
        )}
      </div>

      {/* Detail Sheet */}
      {selectedCard && (
        <CardDetailSheet
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onConfirm={() => {
            dispatch({ type: 'UPDATE_CARD_STATUS', payload: { recordId: state.records[0]?.id ?? '', cardId: selectedCard.id, status: 'confirmed' } });
            setSelectedCard(null);
          }}
          onMarkDone={() => {
            dispatch({ type: 'UPDATE_CARD_STATUS', payload: { recordId: state.records[0]?.id ?? '', cardId: selectedCard.id, status: 'done' } });
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
