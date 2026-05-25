import type { VoiceRecord } from '../types';

const now = new Date();
const today = now.toISOString();

export const MOCK_RECORDS: VoiceRecord[] = [
  {
    id: 'rec-1',
    rawText: '明天上午提醒我问姐姐医保材料有没有交，周末买点洗衣液，另外小米 Token 项目我觉得语音碎片这个方向可以继续做。',
    createdAt: today,
    cards: [
      {
        id: 'card-1-1',
        category: 'todo',
        title: '询问姐姐医保材料提交情况',
        summary: '明天上午主动联系姐姐，确认医保材料是否已经提交。',
        time: '明天上午',
        person: '姐姐',
        priority: 'high',
        status: 'pending',
        needsFollowUp: true,
        followUpQuestion: '姐姐的联系方式是微信还是电话？',
      },
      {
        id: 'card-1-2',
        category: 'shopping',
        title: '购买洗衣液',
        summary: '周末安排购买洗衣液，注意查看是否有促销活动。',
        time: '周末',
        priority: 'medium',
        status: 'pending',
        needsFollowUp: false,
      },
      {
        id: 'card-1-3',
        category: 'idea',
        title: 'AI 语音碎片整理助手方向',
        summary: '小米 Token 项目中，语音碎片整理是一个值得继续探索的方向，可以将口语转化为结构化行动。',
        priority: 'medium',
        status: 'pending',
        needsFollowUp: false,
      },
    ],
  },
  {
    id: 'rec-2',
    rawText: '帮我给张经理发个消息，就说我看了上季度的报告，数据还不错，但运营那边需要再优化一下获客渠道，下周二开会再详细讨论。',
    createdAt: new Date(now.getTime() - 3600000 * 3).toISOString(),
    cards: [
      {
        id: 'card-2-1',
        category: 'draft',
        title: '给张经理的工作反馈消息',
        summary: '对上季度报告的反馈：数据表现良好，运营获客渠道需优化。',
        person: '张经理',
        priority: 'high',
        status: 'pending',
        needsFollowUp: false,
        draftContent:
          '张经理您好，我刚看了上季度的报告，整体数据表现不错。不过我觉得运营那边的获客渠道还有优化空间，建议下周二开会的时候我们可以详细讨论一下这块。您看方便吗？',
      },
      {
        id: 'card-2-2',
        category: 'schedule',
        title: '下周二开会讨论运营优化',
        summary: '与张经理就上季度数据和运营获客渠道优化进行深入讨论。',
        time: '下周二',
        person: '张经理',
        priority: 'high',
        status: 'pending',
        needsFollowUp: true,
        followUpQuestion: '请问具体几点开会？在哪个会议室？',
      },
    ],
  },
  {
    id: 'rec-3',
    rawText: '嗯…今天开会说的那个用户增长方案，我觉得可以从社区运营切入，先做私域，再做裂变。还有就是竞品分析报告下周三之前要交。',
    createdAt: new Date(now.getTime() - 3600000 * 8).toISOString(),
    cards: [
      {
        id: 'card-3-1',
        category: 'idea',
        title: '用户增长方案：社区运营切入',
        summary: '通过社区运营做私域积累，再推动裂变增长。',
        priority: 'medium',
        status: 'confirmed',
        needsFollowUp: false,
      },
      {
        id: 'card-3-2',
        category: 'todo',
        title: '完成竞品分析报告',
        summary: '竞品分析报告截止日期：下周三之前。',
        time: '下周三',
        priority: 'high',
        status: 'pending',
        needsFollowUp: false,
      },
    ],
  },
  {
    id: 'rec-4',
    rawText: '对了，周六下午三点在万达广场有个亲子活动，带小宝去。另外路上买两箱牛奶。',
    createdAt: new Date(now.getTime() - 3600000 * 24).toISOString(),
    cards: [
      {
        id: 'card-4-1',
        category: 'schedule',
        title: '周六亲子活动',
        summary: '周六下午三点，万达广场亲子活动，带小宝参加。',
        time: '周六下午 3:00',
        person: '小宝',
        priority: 'high',
        status: 'confirmed',
        needsFollowUp: false,
      },
      {
        id: 'card-4-2',
        category: 'shopping',
        title: '购买牛奶',
        summary: '路上购买两箱牛奶。',
        priority: 'medium',
        status: 'done',
        needsFollowUp: false,
      },
    ],
  },
];
