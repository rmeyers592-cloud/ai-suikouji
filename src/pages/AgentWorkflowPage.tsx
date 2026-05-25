import { ChevronLeft, Mic, FileText, Brain, Tags, Split, MessageCircle, CreditCard, CalendarDays, Layers } from 'lucide-react';

interface AgentWorkflowPageProps {
  onNavigate: (page: string) => void;
}

const WORKFLOW_NODES = [
  { icon: Mic, label: '语音输入', sub: '用户按住说话', color: '#5B5FEF', bg: 'rgba(91,95,239,0.08)' },
  { icon: FileText, label: '语音转文字', sub: 'Whisper ASR', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  { icon: Brain, label: 'MiMo API 理解内容', sub: '语义分析', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  { icon: Tags, label: '意图分类', sub: '待办 / 提醒 / 购物 / 灵感', color: '#06B6D4', bg: 'rgba(6,182,212,0.08)' },
  { icon: Split, label: '多事项拆分', sub: '一句话拆成多个行动', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
  { icon: MessageCircle, label: '缺失信息追问', sub: '补全模糊信息', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  { icon: CreditCard, label: '行动卡片生成', sub: '结构化展示', color: '#EC4899', bg: 'rgba(236,72,153,0.08)' },
  { icon: Layers, label: '今日整理 / 历史归档', sub: '自动归类', color: '#5B5FEF', bg: 'rgba(91,95,239,0.08)' },
];

export function AgentWorkflowPage({ onNavigate }: AgentWorkflowPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <div style={{ padding: '0 24px', paddingTop: '20px', paddingBottom: '24px' }}>
        {/* Header */}
        <div className="flex items-center gap-2.5" style={{ marginBottom: '4px' }}>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(91, 95, 239, 0.08)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={16} className="text-primary" />
          </button>
          <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px', color: 'var(--color-text)' }}>Agent 工作流</h1>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginLeft: '36px', marginBottom: '16px' }}>
          从语音输入到行动卡片生成
        </p>

        {/* Workflow nodes */}
        <div>
          {WORKFLOW_NODES.map((node, index) => {
            const Icon = node.icon;
            const isLast = index === WORKFLOW_NODES.length - 1;
            return (
              <div key={node.label}>
                {/* Node card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '60px',
                    padding: '0 14px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.92)',
                    border: '1px solid rgba(120,130,180,0.12)',
                    boxShadow: '0 6px 20px rgba(36, 45, 100, 0.05)',
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: node.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: node.color,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: node.bg,
                    }}
                  >
                    <Icon size={16} style={{ color: node.color }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
                      {node.label}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                      {node.sub}
                    </p>
                  </div>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <div style={{ display: 'flex', justifyContent: 'center', height: '12px' }}>
                    <svg width="2" height="12" viewBox="0 0 2 12" fill="none">
                      <line x1="1" y1="0" x2="1" y2="9" stroke="rgba(91,95,239,0.2)" strokeWidth="1.5" strokeDasharray="2 2" />
                      <polygon points="1,9 1,12 3,9" fill="rgba(91,95,239,0.25)" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
