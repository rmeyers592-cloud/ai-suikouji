// ============================================================
// 前端展示类型
// ============================================================

export type CardCategory = 'todo' | 'reminder' | 'shopping' | 'schedule' | 'draft' | 'idea' | 'note';

export type Priority = 'high' | 'medium' | 'low';

export type CardStatus = 'pending' | 'confirmed' | 'done' | 'dismissed';

export interface ActionCard {
  id: string;
  category: CardCategory;
  title: string;
  summary: string;
  time?: string;
  person?: string;
  priority: Priority;
  status: CardStatus;
  needsFollowUp: boolean;
  followUpQuestion?: string;
  draftContent?: string;
}

// ============================================================
// MiMo API 响应类型
// ============================================================

/** MiMo 返回的单个行动项 */
export type MiMoItemType = 'todo' | 'reminder' | 'shopping' | 'schedule' | 'message_draft' | 'idea' | 'note';

export interface MiMoItem {
  type: MiMoItemType;
  title: string;
  content: string;
  time?: string;
  person?: string;
  priority: Priority;
  missing_fields: string[];
  follow_up_question?: string;
  status: 'pending' | 'confirmed' | 'archived';
}

/** MiMo 完整响应 */
export interface MiMoResponse {
  original_text: string;
  summary: string;
  items: MiMoItem[];
  daily_review_suggestion: string;
}

// ============================================================
// 通用类型
// ============================================================

export interface VoiceRecord {
  id: string;
  rawText: string;
  createdAt: string;
  cards: ActionCard[];
}

export interface AppSettings {
  defaultReminderTime: string;
  dailyDigestEnabled: boolean;
  autoFollowUpEnabled: boolean;
  categoryPreferences: CardCategory[];
}

export const CATEGORY_CONFIG: Record<CardCategory, { label: string; icon: string; colorVar: string; bgVar: string }> = {
  todo: { label: '待办', icon: 'CheckSquare', colorVar: 'var(--color-cat-todo)', bgVar: 'var(--color-cat-todo-bg)' },
  reminder: { label: '提醒', icon: 'Bell', colorVar: 'var(--color-cat-reminder)', bgVar: 'var(--color-cat-reminder-bg)' },
  shopping: { label: '购物', icon: 'ShoppingCart', colorVar: 'var(--color-cat-shopping)', bgVar: 'var(--color-cat-shopping-bg)' },
  schedule: { label: '日程', icon: 'Calendar', colorVar: 'var(--color-cat-schedule)', bgVar: 'var(--color-cat-schedule-bg)' },
  draft: { label: '草稿', icon: 'FileText', colorVar: 'var(--color-cat-draft)', bgVar: 'var(--color-cat-draft-bg)' },
  idea: { label: '灵感', icon: 'Lightbulb', colorVar: 'var(--color-cat-idea)', bgVar: 'var(--color-cat-idea-bg)' },
  note: { label: '笔记', icon: 'StickyNote', colorVar: 'var(--color-cat-note)', bgVar: 'var(--color-cat-note-bg)' },
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultReminderTime: '09:00',
  dailyDigestEnabled: true,
  autoFollowUpEnabled: true,
  categoryPreferences: ['todo', 'reminder', 'shopping', 'schedule', 'draft', 'idea', 'note'],
};
