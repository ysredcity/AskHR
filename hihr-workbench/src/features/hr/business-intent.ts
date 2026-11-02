import type { ContextItem } from '@/components/agent-layout/composer';
import type { ConversationScene, MessageAttachment } from '@/agent-ui/immersive/contracts';

export type BusinessIntent = {
  prompt: string;
  skill: string;
  expert: string | null;
  source: string;
  snapshot: string;
};

export function businessContexts(intent: BusinessIntent): ContextItem[] {
  return [
    { id: 'business-skill', type: '技能', label: intent.skill },
    { id: 'business-source', type: '文件库', label: intent.source, target: {
      type: 'file-preview', title: intent.source, fileName: `${intent.source}.md`, fileType: 'Markdown', content: intent.snapshot,
    } },
  ];
}

export function createPanoramaScene(message: string, context: ContextItem[], expert: string | undefined, attachments: MessageAttachment[]): ConversationScene | null {
  const source = context.find(item => item.id === 'business-source');
  if (!source || source.target?.type !== 'file-preview') return null;
  const snapshot = source.target.content;
  const section = (heading: string) => snapshot.split(`## ${heading}\n\n`)[1]?.split('\n\n## ')[0]?.trim() ?? '';
  const findings = section('关注事项');
  const actions = section('建议行动');
  const id = `panorama-${crypto.randomUUID()}`;
  const title = `${source.label} · 分析建议`;
  const report = `# ${title}\n\n本次问题：${message.replace(/\[\[[^\]]+\]\]/g, "").trim()}\n\n${snapshot}\n\n## 后续处理\n\n上述内容基于本次引用的页面快照，尚未执行提醒、提交或人员调整。你可以进一步指定需要复核的对象和行动。`;
  const target = { type: 'file-preview' as const, title, fileName: `${title}.md`, fileType: 'Markdown', content: report };
  return { id, title, turns: [{
    id: `${id}-turn`, expert, user: { content: message, attachments },
    execution: { status: 'completed', duration: '1.2 秒', summary: '已整理当前范围内的指标与行动建议', steps: [
      { id: `${id}-scope`, title: '核对页面数据与统计口径', detail: `读取“${source.label}”的触发时快照，确认对象、周期与授权范围。`, status: 'completed' },
      { id: `${id}-analysis`, title: '整理关注事项与下一步行动', detail: '结合页面指标和已记录的业务提示，整理需复核的事项与建议；不执行写入或发送。', status: 'completed', actions: [{ type: 'file', label: title, target }] },
    ] },
    assistant: { timestamp: '刚刚', content: `根据你带入的 **${source.label}**，当前需要关注：\n\n${findings}\n\n建议下一步：\n\n${actions}\n\n已整理为分析建议，你可以继续指定关注的指标或人员。当前仅完成分析，尚未执行任何业务操作。`, attachments: [{ id: `${id}-report`, name: `${title}.md`, size: new TextEncoder().encode(report).length, target }] },
  }] };
}
