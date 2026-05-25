import { useApp } from '../context/AppContext';
import { CATEGORY_CONFIG, type CardCategory } from '../types';
import {
  Brain, Clock, ChevronRight, Tag, Info, Mic, HardDrive, Sparkles,
} from 'lucide-react';

const ALL_CATEGORIES: CardCategory[] = ['todo', 'reminder', 'shopping', 'schedule', 'draft', 'idea', 'note'];
const TIME_OPTIONS = ['07:00', '08:00', '09:00', '10:00'];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[44px] h-[26px] rounded-full transition-all duration-200 shrink-0
        ${enabled ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <div
        className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white transition-all duration-200
          ${enabled ? 'left-[21px]' : 'left-[3px]'}`}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
      />
    </button>
  );
}

export function SettingsPage() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  const toggleCategory = (cat: CardCategory) => {
    const current = settings.categoryPreferences;
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    dispatch({ type: 'UPDATE_SETTINGS', payload: { categoryPreferences: next } });
  };

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="px-6 pt-6 pb-1">
        <h1 className="text-[28px] font-extrabold text-text tracking-tight">设置</h1>
        <p className="text-[15px] text-text-secondary mt-0.5">自定义你的 AI 随口记</p>
      </div>

      <div className="px-6 py-4 space-y-4">

        {/* AI 整理偏好 */}
        <div className="bg-white rounded-[18px] p-4"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}>
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-primary/[0.08] flex items-center justify-center">
                <Brain size={14} className="text-primary" />
              </div>
              <h3 className="text-[14px] font-bold text-text">AI 整理偏好</h3>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </div>

          {/* Default reminder time */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} className="text-text-secondary" />
              <span className="text-[13px] font-medium text-text-secondary">默认提醒时间</span>
            </div>
            <div className="flex gap-2">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { defaultReminderTime: time } })}
                  className={`text-[13px] font-semibold px-4 py-2 rounded-full transition-all
                    ${settings.defaultReminderTime === time
                      ? 'bg-primary text-white'
                      : 'bg-white text-text-secondary'
                    }`}
                  style={settings.defaultReminderTime !== time
                    ? { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }
                    : undefined}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Daily digest */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-[13px] font-semibold text-text">每日整理</p>
              <p className="text-[12px] text-text-muted mt-0.5">每天生成一份汇总报告</p>
            </div>
            <Toggle
              enabled={settings.dailyDigestEnabled}
              onToggle={() =>
                dispatch({ type: 'UPDATE_SETTINGS', payload: { dailyDigestEnabled: !settings.dailyDigestEnabled } })
              }
            />
          </div>

          {/* Auto follow-up */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-[13px] font-semibold text-text">追问确认</p>
              <p className="text-[12px] text-text-muted mt-0.5">AI 主动追问不完整的信息</p>
            </div>
            <Toggle
              enabled={settings.autoFollowUpEnabled}
              onToggle={() =>
                dispatch({ type: 'UPDATE_SETTINGS', payload: { autoFollowUpEnabled: !settings.autoFollowUpEnabled } })
              }
            />
          </div>
        </div>

        {/* 分类偏好 */}
        <div className="bg-white rounded-[18px] p-4"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-primary/[0.08] flex items-center justify-center">
                <Tag size={14} className="text-primary" />
              </div>
              <h3 className="text-[14px] font-bold text-text">分类偏好</h3>
            </div>
            <span className="text-[12px] text-text-muted">
              {settings.categoryPreferences.length}/{ALL_CATEGORIES.length} 项
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const enabled = settings.categoryPreferences.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between p-3 rounded-[12px] transition-all
                    ${enabled ? 'bg-gray-50' : 'bg-white'}`}
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.02)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: enabled ? config.bgVar : 'transparent' }}>
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: enabled ? config.colorVar : '#D1D5DB' }} />
                    </div>
                    <span className={`text-[13px] font-semibold ${enabled ? 'text-text' : 'text-text-muted'}`}>
                      {config.label}
                    </span>
                  </div>
                  <Toggle enabled={enabled} onToggle={() => toggleCategory(cat)} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 模型与数据 */}
        <div className="bg-white rounded-[18px] p-4"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-primary/[0.08] flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              <h3 className="text-[14px] font-bold text-text">模型与数据</h3>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </div>

          <div className="space-y-0">
            {[
              { icon: Brain, label: 'AI 引擎', value: 'MiMo API 待接入' },
              { icon: Mic, label: '语音识别', value: '待接入' },
              { icon: HardDrive, label: '数据存储', value: '本地 Demo' },
            ].map(({ icon: Icon, label, value }, index, arr) => (
              <div key={label} className={`flex items-center justify-between py-3
                ${index < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <Icon size={14} className="text-text-secondary" />
                  <span className="text-[13px] font-semibold text-text">{label}</span>
                </div>
                <span className="text-[12px] font-medium text-text-muted">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-[18px] p-4"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-primary/[0.08] flex items-center justify-center">
                <Info size={14} className="text-primary" />
              </div>
              <h3 className="text-[14px] font-bold text-text">关于</h3>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </div>

          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[13px] font-medium text-text-secondary">版本</span>
              <span className="text-[12px] font-semibold text-text-muted">MVP v0.1</span>
            </div>
            <div className="py-3">
              <p className="text-[13px] font-medium text-text-secondary mb-1">产品简介</p>
              <p className="text-[13px] text-text leading-relaxed">语音转行动，开口即整理</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-2">
        <p className="text-center text-[11px] text-text-muted">AI 随口记 · 语音转行动，开口即整理</p>
      </div>
    </div>
  );
}
