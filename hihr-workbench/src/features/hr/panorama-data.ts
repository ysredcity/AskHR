import source from './panorama-data.json';

export type PanoramaMetric = { label: string; value: string; unit?: string; detail: string; attention?: boolean; columns?: string[]; rows?: string[][] };
export type TalentMember = { id: string; name: string; avatar?: string; job: string; level: string; performance: number; potential: number; evaluations: string; note: string; cell: number };
export type PanoramaPanel = {
  title: string;
  kind: string;
  note?: string;
  dimensions?: string[];
  rows: string[][];
  values?: number[];
  labels?: string[];
  unit?: string;
  min?: number;
  max?: number;
  xLabels?: string[];
  yLabels?: string[];
  caption?: string;
  columns?: string[];
  prompt?: string;
  wide?: boolean;
  parts?: PanoramaPanel[];
  members?: TalentMember[];
};
export type PanoramaPage = {
  id: string; label: string; scope: string; period: string; expert: string; action: string; prompt: string;
  summary: string[]; suggestions: string[]; metrics: PanoramaMetric[]; panels: PanoramaPanel[];
  definitions: string[][]; limits: string[];
  ledger?: { title: string; columns: string[]; rows: string[][]; searchKeys?: string[] };
};
export type PanoramaKind = 'team' | 'organization';
export const panoramaPages: Record<PanoramaKind, PanoramaPage[]> = source;

export function panoramaSnapshot(page: PanoramaPage, metric?: PanoramaMetric) {
  const content = [
    `# ${page.scope} · ${page.label}`, `统计周期：${page.period}`, `数据范围：${page.scope}（当前授权范围）`,
    '## 指标', ...(metric ? [metric] : page.metrics).map(m => `- ${m.label}：${m.value}${m.unit ?? ''}；${m.detail}`),
    '## 关注事项', ...page.summary.map(s => `- ${s}`), '## 建议行动', ...page.suggestions.map(s => `- ${s}`),
  ];
  if (!metric) for (const panel of page.panels) {
    content.push(`## ${panel.title}`, panel.note ?? '');
    if (panel.values?.length) content.push(...panel.values.map((v, i) => `- ${panel.labels?.[i] ?? i + 1}：${v}${panel.unit ?? ''}`));
    else content.push(...panel.rows.map(row => `- ${row.join(' · ')}`));
    if (panel.members) content.push("### 盘点成员", ...panel.members.map(member => `- ${member.name} · ${member.job} · ${member.level} · 业绩 ${member.performance} · 潜力 ${member.potential} · 近三期 ${member.evaluations} · ${member.note}`));
    for (const part of panel.parts ?? []) content.push(`### ${part.title}`, ...part.rows.map(row => `- ${row.join(' · ')}`));
  }
  if (metric?.rows) content.push('## 指标明细', ...(metric.rows.map(row => `- ${row.join(' · ')}`)));
  if (!metric && page.ledger) content.push(`## ${page.ledger.title}`, ...page.ledger.rows.map(row => `- ${row.join(' · ')}`));
  content.push('## 统计口径', ...page.limits.map(s => `- ${s}`));
  return content.join('\n\n');
}
