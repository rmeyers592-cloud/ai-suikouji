import type { ActionCard, MiMoItem, MiMoResponse } from '../types';

// ============================================================
// AI Service — MiMo API 接入层
//
// 开发阶段使用 VITE_AI_MODE=mock，上线时改为 api 并配置
// VITE_LLM_API_URL / VITE_LLM_API_KEY / VITE_LLM_MODEL
// ============================================================

const AI_MODE = import.meta.env.VITE_AI_MODE || 'mock';
const STT_API_URL = import.meta.env.VITE_STT_API_URL;
const STT_API_KEY = import.meta.env.VITE_STT_API_KEY;
const LLM_API_URL = import.meta.env.VITE_LLM_API_URL;
const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;
const LLM_MODEL = import.meta.env.VITE_LLM_MODEL;

// ============================================================
// MiMo System Prompt
// ============================================================

const SYSTEM_PROMPT = `你是"AI 随口记"的语音内容分析引擎。用户提供一段口语化的中文语音转写文本，你需要精准地：

## 核心规则
1. **一句话 = 多个事项时，必须拆分为多个 items**，不要合并。
2. **不要把所有内容混成一条笔记**，每个独立事项单独一条。
3. **明显缺失关键信息的事项**，在 missing_fields 中列出缺失字段，并在 follow_up_question 中生成一个自然的追问。但不要过度追问。
4. **灵感类 (idea)** 不要追问，直接归档，status 设为 "archived"。
5. **消息草稿 (message_draft)** 必须生成一段可直接复制发送的自然中文，放在 content 中。语气礼貌得体。
6. **购物类 (shopping)** 如果没有明确时间，time 可为空。

## 可用 type 值
todo, reminder, shopping, schedule, message_draft, idea, note

## 可用 priority 值
low, medium, high

## 输出格式
严格输出以下 JSON，不要输出任何其他文字：

{
  "original_text": "用户原始输入原文",
  "summary": "一句话概括用户说了什么",
  "items": [
    {
      "type": "类型",
      "title": "简洁标题（不超过15字）",
      "content": "整理后的完整内容",
      "time": "时间（ISO 8601 或自然语言如"明天上午""下周三"，没有则不填）",
      "person": "相关人物（没有则不填）",
      "priority": "high / medium / low",
      "missing_fields": [],
      "follow_up_question": "追问问题（仅在 missing_fields 非空时填写）",
      "status": "pending"
    }
  ],
  "daily_review_suggestion": "给用户的一句今日整理建议"
}`;

// ============================================================
// 接口 1：语音转文字
// ============================================================

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (AI_MODE === 'api' && STT_API_URL && STT_API_KEY) {
    return transcribeViaAPI(audioBlob);
  }
  return transcribeMock();
}

async function transcribeViaAPI(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const res = await fetch(STT_API_URL!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${STT_API_KEY}` },
    body: formData,
  });

  if (!res.ok) throw new Error(`STT 请求失败: ${res.status}`);
  const data = await res.json();
  return data.text ?? data.result ?? '';
}

async function transcribeMock(): Promise<string> {
  await delay(1500);

  const samples = [
    '明天上午提醒我问姐姐医保材料有没有交，周末买点洗衣液，另外小米 Token 项目我觉得语音碎片这个方向可以继续做。',
    '帮我给张经理发个消息，就说我看了上季度的报告，数据还不错，但运营那边需要再优化一下获客渠道，下周二开会再详细讨论。',
    '嗯…今天开会说的那个用户增长方案，我觉得可以从社区运营切入，先做私域，再做裂变。还有就是竞品分析报告下周三之前要交。',
    '对了，周六下午三点在万达广场有个亲子活动，带小宝去。另外路上买两箱牛奶。',
    '提醒我明天下午两点跟客户打电话，报价单发之前再检查一遍数字，然后记得给妈转这个月的生活费。',
  ];

  return samples[Math.floor(Math.random() * samples.length)];
}

// ============================================================
// 接口 2：文本分析（MiMo 核心入口）
// ============================================================

/**
 * 将语音转写文本发送给 MiMo，返回严格 JSON。
 * 前端通过 mapMiMoToCards() 将结果转为 ActionCard[] 渲染。
 */
export async function analyzeVoiceText(text: string): Promise<MiMoResponse> {
  if (AI_MODE === 'api' && LLM_API_URL && LLM_API_KEY) {
    return analyzeViaMiMoAPI(text);
  }
  return analyzeMock(text);
}

async function analyzeViaMiMoAPI(text: string): Promise<MiMoResponse> {
  const res = await fetch(LLM_API_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LLM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`MiMo 请求失败: ${res.status}`);

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? '{}';

  try {
    const parsed = JSON.parse(content) as MiMoResponse;
    // 防御性校验
    if (!Array.isArray(parsed.items)) {
      throw new Error('MiMo 响应缺少 items 数组');
    }
    return parsed;
  } catch {
    throw new Error('MiMo 返回的 JSON 解析失败，请重试');
  }
}

// ============================================================
// Mock 实现（开发/演示用，模拟 MiMo 返回格式）
// ============================================================

async function analyzeMock(text: string): Promise<MiMoResponse> {
  await delay(1500);

  if (text.includes('张经理') || text.includes('报告')) {
    return {
      original_text: text,
      summary: '向张经理反馈上季度报告情况，并预约下周二开会讨论运营优化。',
      items: [
        {
          type: 'message_draft',
          title: '给张经理的工作反馈',
          content:
            '张经理您好，我刚看了上季度的报告，整体数据表现不错。不过我觉得运营那边的获客渠道还有优化空间，建议下周二开会的时候我们可以详细讨论一下这块。您看方便吗？',
          person: '张经理',
          priority: 'high',
          missing_fields: [],
          status: 'pending',
        },
        {
          type: 'schedule',
          title: '下周二开会',
          content: '与张经理就上季度数据和运营获客渠道优化进行深入讨论。',
          time: '下周二',
          person: '张经理',
          priority: 'high',
          missing_fields: ['具体时间', '会议室'],
          follow_up_question: '请问具体几点开会？在哪个会议室？',
          status: 'pending',
        },
      ],
      daily_review_suggestion: '你有一条消息待发送，一条日程待确认时间。建议先处理消息草稿。',
    };
  }

  if (text.includes('增长') || text.includes('竞品')) {
    return {
      original_text: text,
      summary: '记录了用户增长的社区运营思路，以及竞品分析报告的截止日期。',
      items: [
        {
          type: 'idea',
          title: '社区运营驱动增长',
          content: '从社区运营切入，先做私域积累，再推动裂变增长。',
          priority: 'medium',
          missing_fields: [],
          status: 'archived',
        },
        {
          type: 'todo',
          title: '完成竞品分析报告',
          content: '竞品分析报告截止日期：下周三之前。',
          time: '下周三',
          priority: 'high',
          missing_fields: [],
          status: 'pending',
        },
      ],
      daily_review_suggestion: '竞品分析报告下周三到期，建议今天开始整理材料。',
    };
  }

  if (text.includes('亲子') || text.includes('万达')) {
    return {
      original_text: text,
      summary: '周六下午有亲子活动需带小宝参加，路上记得买牛奶。',
      items: [
        {
          type: 'schedule',
          title: '周六亲子活动',
          content: '周六下午三点，万达广场亲子活动，带小宝参加。',
          time: '周六下午 3:00',
          person: '小宝',
          priority: 'high',
          missing_fields: [],
          status: 'confirmed',
        },
        {
          type: 'shopping',
          title: '购买牛奶',
          content: '路上购买两箱牛奶。',
          priority: 'medium',
          missing_fields: [],
          status: 'pending',
        },
      ],
      daily_review_suggestion: '周末安排已记录，日程和购物各一项。记得提前出发。',
    };
  }

  if (text.includes('客户') || text.includes('报价')) {
    return {
      original_text: text,
      summary: '明天下午需联系客户，发送报价前核对数字，还要给妈妈转生活费。',
      items: [
        {
          type: 'reminder',
          title: '给客户打电话',
          content: '明天下午两点联系客户，确认报价单内容。',
          time: '明天下午 2:00',
          person: '客户',
          priority: 'high',
          missing_fields: ['客户姓名', '联系方式'],
          follow_up_question: '客户的姓名和联系方式是什么？',
          status: 'pending',
        },
        {
          type: 'todo',
          title: '核对报价单数字',
          content: '发送报价单前，再次核对所有数字是否正确。',
          priority: 'high',
          missing_fields: [],
          status: 'pending',
        },
        {
          type: 'todo',
          title: '给妈妈转生活费',
          content: '给妈妈转账本月生活费。',
          person: '妈妈',
          priority: 'medium',
          missing_fields: [],
          status: 'pending',
        },
      ],
      daily_review_suggestion: '你有 3 项待办，其中给客户打电话和核对报价单有先后关系，建议先核对再联系。',
    };
  }

  // 默认 mock
  return {
    original_text: text,
    summary: '记录了问姐姐医保材料、购买洗衣液，以及关于语音碎片项目的灵感。',
    items: [
      {
        type: 'todo',
        title: '确认医保材料进度',
        content: '明天上午主动联系姐姐，确认医保材料是否已经提交。',
        time: '明天上午',
        person: '姐姐',
        priority: 'high',
        missing_fields: ['联系方式'],
        follow_up_question: '姐姐的联系方式是微信还是电话？',
        status: 'pending',
      },
      {
        type: 'shopping',
        title: '购买洗衣液',
        content: '周末安排购买洗衣液，注意查看是否有促销活动。',
        time: '周末',
        priority: 'medium',
        missing_fields: [],
        status: 'pending',
      },
      {
        type: 'idea',
        title: '语音碎片整理方向',
        content: '小米 Token 项目中，语音碎片整理是一个值得继续探索的方向，可以将口语转化为结构化行动。',
        priority: 'medium',
        missing_fields: [],
        status: 'archived',
      },
    ],
    daily_review_suggestion: '你有一条待办和一条购物任务，还有一个不错的灵感。建议先把医保材料的事处理好。',
  };
}

// ============================================================
// 辅助函数：MiMoItem → ActionCard 映射
// ============================================================

// MiMo type → 前端 CardCategory 映射
const TYPE_MAP: Record<string, ActionCard['category']> = {
  todo: 'todo',
  reminder: 'reminder',
  shopping: 'shopping',
  schedule: 'schedule',
  message_draft: 'draft',    // MiMo 用 message_draft，前端展示为 draft
  idea: 'idea',
  note: 'note',
};

/** 将 MiMo 单个 item 转为前端 ActionCard */
export function mapMiMoItemToCard(item: MiMoItem, index: number): ActionCard {
  const statusMap: Record<string, ActionCard['status']> = {
    pending: 'pending',
    confirmed: 'confirmed',
    archived: 'done',
  };

  return {
    id: `card-${Date.now()}-${index}`,
    category: TYPE_MAP[item.type] ?? 'note',
    title: item.title,
    summary: item.content,
    time: item.time || undefined,
    person: item.person || undefined,
    priority: item.priority,
    status: statusMap[item.status] ?? 'pending',
    needsFollowUp: Boolean(item.follow_up_question),
    followUpQuestion: item.follow_up_question || undefined,
    draftContent: item.type === 'message_draft' ? item.content : undefined,
  };
}

/** 将完整 MiMoResponse 映射为 ActionCard[] */
export function mapMiMoToCards(response: MiMoResponse): ActionCard[] {
  return response.items.map((item, index) => mapMiMoItemToCard(item, index));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
