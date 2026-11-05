import { TalentNineGrid } from "./talent-nine-grid";
import { useEffect, useRef, useState } from 'react';
import { Building2, CalendarDays, Info, Sparkles, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useHR } from './context';
import { HeaderControls, HeaderTabs } from './header-controls';
import { panoramaPages, panoramaSnapshot, type PanoramaKind, type PanoramaMetric, type PanoramaPage, type PanoramaPanel, type TalentMember } from './panorama-data';

export function PanoramaPageView({ kind }: { kind: PanoramaKind }) {
  const hr = useHR();
  const pages = panoramaPages[kind];
  const selected = kind === 'team' ? hr.teamTab : hr.organizationTab;
  const setSelected = kind === 'team' ? hr.setTeamTab : hr.setOrganizationTab;
  const page = pages.find(p => p.id === selected) ?? pages[0];
  const [details, setDetails] = useState<PanoramaMetric | 'definitions' | null>(null);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const ask = (metric?: PanoramaMetric) => {
    hr.composeBusiness({
      prompt: metric ? `请分析${page.scope}在${page.period}的“${metric.label}”（${metric.value}${metric.unit ?? ''}），解释需要关注的原因并给出下一步建议。` : page.prompt,
      expert: page.expert, skill: metric ? '指标分析' : page.action,
      source: `${page.scope} · ${page.label} · ${page.period}`,
      snapshot: panoramaSnapshot(page, metric),
    });
  };
  return <div className="panorama-workspace @container">
    <HeaderControls><PanoramaTabs pages={pages} value={page.id} onChange={value => { setSelected(value); setDetails(null); }} /></HeaderControls>
    <h1 className="sr-only">{kind === 'team' ? '团队洞察' : 'HR数据运营'} · {page.label}</h1>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">{kind === 'team' ? <UsersRound className="size-3.5" /> : <Building2 className="size-3.5" />}{page.scope}<span className="text-muted-foreground/60">· 授权范围</span></span>
        <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{page.period}</span>
      </div>
      <div className="flex items-center gap-2">{page.ledger && <Button size="sm" variant="outline" onClick={() => setLedgerOpen(true)}>{page.ledger.title}</Button>}<Button size="xs" variant="ghost" className="font-normal text-muted-foreground" onClick={() => setDetails('definitions')}><Info className="size-3.5" />指标口径</Button></div>
    </div>
    <section aria-label={`${page.label}关注事项`} className="panorama-insight mb-5 rounded-xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 basis-72"><p className="mb-2 flex items-center gap-1.5 text-sm font-medium"><Sparkles className="panorama-insight-icon size-4" />值得关注</p><ul className="space-y-1.5 text-sm leading-6 text-muted-foreground">{page.summary.map(text => <li key={text} className="flex gap-2"><span className="panorama-insight-dot mt-2.5 size-1 shrink-0 rounded-full" /><span>{text}</span></li>)}</ul></div>
        <Button className="shrink-0 bg-foreground text-background hover:bg-foreground/85" onClick={() => ask()}><Sparkles className="size-4" />{page.action}</Button>
      </div>
    </section>
    <div className="panorama-metrics mb-5" data-count={page.metrics.length} aria-label="核心指标">{page.metrics.map(metric => <Card key={metric.label} size="sm" className="min-w-0"><CardContent><div className="flex items-start justify-between gap-2"><p className="text-xs text-muted-foreground">{metric.label}</p><Button variant="ghost" size="xs" className="-mr-1 -mt-1 shrink-0 text-xs font-normal text-muted-foreground" onClick={() => setDetails(metric)}>查看详情</Button></div><p className={cn('mt-3 text-2xl font-medium tracking-tight tabular-nums', metric.attention && 'text-warning-foreground')}>{metric.value}<span className="ml-1 text-xs font-normal text-muted-foreground">{metric.unit}</span></p><p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.detail}</p></CardContent></Card>)}</div>
    <div className="panorama-panels">{page.panels.map(panel => <DashboardPanel key={`${page.id}-${panel.title}`} panel={panel} onMemberAsk={member => hr.composeBusiness({ expert: page.expert, skill: "人才发展建议", source: `${page.scope} · 人才盘点 · ${member.name}`, prompt: `请结合${member.name}的岗位、盘点记录与近三期考评，整理沟通要点和下一阶段的成长建议。`, snapshot: panoramaSnapshot({ ...page, panels: [{ ...panel, members: [member] }] }) })} onAsk={panel.prompt ? () => hr.composeBusiness({ prompt: panel.prompt!, expert: page.expert, skill: "分析建议", source: `${page.scope} · ${page.label} · ${panel.title}`, snapshot: panoramaSnapshot({ ...page, panels: [panel] }) }) : undefined} />)}</div>
    {page.ledger && <LedgerDialog key={page.id} ledger={page.ledger} open={ledgerOpen} onOpenChange={setLedgerOpen} />}
    <Dialog open={details !== null} onOpenChange={open => { if (!open) setDetails(null); }}><DialogContent className="max-h-[80dvh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>{details === 'definitions' ? `${page.label} · 指标口径` : details?.label}</DialogTitle><DialogDescription>{page.scope} · {page.period}</DialogDescription></DialogHeader>{details === 'definitions' ? <><dl className="divide-y">{page.definitions.map(([name, formula]) => <div key={name} className="py-3"><dt className="text-sm font-medium">{name}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{formula}</dd></div>)}</dl><ul className="space-y-2 rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">{page.limits.map(limit => <li key={limit}>{limit}</li>)}</ul></> : details ? <><p className="text-3xl font-medium tabular-nums">{details.value}<span className="ml-1 text-sm text-muted-foreground">{details.unit}</span></p><p className="text-sm text-muted-foreground">{details.detail}</p><p className="text-xs leading-5 text-muted-foreground">{page.limits[0]}</p>{details.rows && <PanelTable rows={details.rows} columns={details.columns} />}<Button className="bg-foreground text-background hover:bg-foreground/85" onClick={() => { ask(details); setDetails(null); }}><Sparkles className="size-4" />分析指标</Button></> : null}</DialogContent></Dialog>
  </div>;
}

function PanoramaTabs({ pages, value, onChange }: { pages: PanoramaPage[]; value: string; onChange: (id: string) => void }) {
  return <HeaderTabs items={pages.map(page => ({ value: page.id, label: page.label }))} value={value} onChange={onChange} />;
}

function DashboardPanel({ panel, onAsk, onMemberAsk }: { panel: PanoramaPanel; onAsk?: () => void; onMemberAsk?: (member: TalentMember) => void }) {
  const [showData, setShowData] = useState(false);
  const chart = !['rows', 'table', 'timeline', 'actions', 'wave'].includes(panel.kind);
  return <Card className={cn("h-full min-w-0", (panel.wide || panel.kind === 'split') && "col-span-full")}><CardHeader><div className="flex items-start justify-between gap-3"><div className="min-w-0"><CardTitle>{panel.title}</CardTitle>{panel.note && <CardDescription className="mt-1 text-xs">{panel.note}</CardDescription>}</div>{chart && <Button size="xs" variant="ghost" className="shrink-0 font-normal text-muted-foreground" onClick={() => setShowData(!showData)}>{showData ? '收起数据' : '数据表'}</Button>}</div></CardHeader><CardContent>
    {showData ? <PanelTable columns={panel.columns} rows={panel.values?.length ? panel.values.map((value, i) => [panel.labels?.[i] ?? String(i + 1), `${value}${panel.unit ?? ''}`]) : panel.parts?.length ? panel.parts.flatMap(part => part.rows.map(row => [part.title, ...row])) : panel.rows} /> : panel.kind === 'split' ? <div className="grid grid-cols-1 gap-6 @min-[760px]:grid-cols-3">{panel.parts?.map(part => <section key={part.title} className="min-w-0"><h4 className="mb-4 text-sm font-medium">{part.title}</h4><BarChart panel={part} /></section>)}</div> : panel.kind === 'wave' ? <div className="grid grid-cols-1 gap-6 @min-[760px]:grid-cols-[1fr_1.5fr]">{panel.parts?.map(part => <section key={part.title} className="min-w-0"><h4 className="mb-4 text-sm font-medium">{part.title}</h4><BarChart panel={part} /></section>)}<div className="min-w-0"><h4 className="mb-4 text-sm font-medium">波动原因与复核进展</h4><PanelTable rows={panel.rows} columns={panel.columns} /></div></div> : panel.kind === 'pipeline' ? <ol className="divide-y">{panel.rows.map((row, i) => <li key={row[0]} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{i+1}</span><div className="min-w-0 flex-1"><p className="text-sm">{row[0]}</p><p className="mt-1 text-xs text-muted-foreground">{row.length === 3 ? row[2] : row[3]}</p></div><span className="text-lg font-medium tabular-nums">{Number(row[1]).toLocaleString()}</span></li>)}</ol> : panel.kind === 'timeline' ? <ol className="space-y-0">{panel.rows.map((row, i) => <li key={i} className="relative ml-1 border-l pb-5 pl-5 last:pb-0"><span className="absolute -left-1 top-1 size-2 rounded-full bg-primary ring-4 ring-card" /><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>{row[0]}</span><Badge variant="secondary" className="font-normal">{row[2]}</Badge><span className="ml-auto">{row[4]}</span></div><p className="mt-1 text-sm font-medium">{row[1]}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{row[3]}</p></li>)}</ol> : panel.kind === 'actions' ? <ol className="space-y-5">{panel.rows.map((row, i) => <li key={i} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">{i + 1}</span><div><p className="text-sm font-medium">{row[0]}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{row[1]}</p></div></li>)}</ol> : panel.kind === 'paired-bars' ? <PairedBars panel={panel} /> : panel.kind === 'line' ? <TrendChart panel={panel} /> : ['g9', 'grid9'].includes(panel.kind) ? <TalentNineGrid panel={panel} onMemberAsk={onMemberAsk} /> : panel.kind === 'donut' ? <CompositionChart panel={panel} /> : chart ? <BarChart panel={panel} /> : <PanelTable rows={panel.rows} columns={panel.columns} />}
    {panel.caption && <p className="mt-4 text-xs leading-6 text-muted-foreground">{panel.caption}</p>}
    {panel.dimensions && panel.dimensions.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground"><span className="mr-1">分析维度</span>{panel.dimensions.map(dimension => <Badge variant="secondary" key={dimension} className="font-normal">{dimension}</Badge>)}</div>}
    {onAsk && <div className="mt-4 border-t pt-3"><Button size="sm" variant="outline" onClick={onAsk}><Sparkles className="size-3.5" />分析建议</Button></div>}
  </CardContent></Card>;
}
function PairedBars({ panel }: { panel: PanoramaPanel }) {
  const max = Math.max(1, ...panel.rows.flatMap(row => [numeric(row[1]), numeric(row[2])]));
  return <div className="space-y-4"><div className="flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><i className="size-2 rounded-sm bg-primary" />入职</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-sm bg-info" />离职</span></div>{panel.rows.map(row => <div key={row[0]} className="flex items-center gap-3"><span className="w-8 shrink-0 text-xs text-muted-foreground">{row[0]}</span><div className="flex-1 space-y-1.5">{[1,2].map(i => <div key={i} className="flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", i === 1 ? "bg-primary" : "bg-info")} style={{ width: `${numeric(row[i]) / max * 100}%` }} /></div><span className="w-7 text-right text-xs tabular-nums" aria-label={`${i === 1 ? '入职' : '离职'} ${row[i]} 人`}>{row[i]} 人</span></div>)}</div></div>)}</div>;
}
function LedgerDialog({ ledger, open, onOpenChange }: { ledger: NonNullable<PanoramaPage['ledger']>; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = ledger.rows.filter((row, i) => `${row.join(' ')} ${ledger.searchKeys?.[i] ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const current = Math.min(page, pages);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-5xl"><DialogHeader><DialogTitle>{ledger.title}</DialogTitle><DialogDescription>当前授权团队 · 2026 年 10 月 29 日业务快照</DialogDescription></DialogHeader><Input aria-label="查询明细" placeholder="输入姓名、拼音、工号或事项查询" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />{filtered.length ? <PanelTable rows={filtered.slice((current-1)*10,current*10)} columns={ledger.columns} /> : <p className="py-8 text-center text-sm text-muted-foreground">未找到匹配记录</p>}<div className="flex items-center justify-between text-xs text-muted-foreground"><span>共 {filtered.length} 条 · 10 条 / 页</span><div className="flex items-center gap-3"><Button size="sm" variant="outline" disabled={current === 1} onClick={() => setPage(current-1)}>上一页</Button><span>{current} / {pages}</span><Button size="sm" variant="outline" disabled={current === pages} onClick={() => setPage(current+1)}>下一页</Button></div></div></DialogContent></Dialog>;
}

const chartColors = ['var(--primary)', 'var(--info)', 'var(--success)', 'var(--warning)', 'var(--muted-foreground)'];
function numeric(value: string | undefined) { return Number(String(value ?? '0').replace(/[^\d.-]/g, '')) || 0; }
function BarChart({ panel }: { panel: PanoramaPanel }) {
  const rows = panel.rows;
  const detailed = panel.kind === 'bars';
  const max = Math.max(...rows.map(row => Math.abs(numeric(detailed ? row[3] : row[1]))), 1);
  return <div className="space-y-4" role="img" aria-label={`${panel.title}：${rows.map(row => `${row[0]} ${detailed ? row[2] : row[1]}`).join('；')}`}>{rows.map((row, index) => {
    const value = numeric(detailed ? row[3] : row[1]);
    return <div key={`${row[0]}-${index}`}><div className="mb-1.5 flex items-start justify-between gap-3 text-xs"><span className="min-w-0">{row[0]}{detailed && <span className="mt-0.5 block text-muted-foreground">{row[1]}</span>}</span><span className="shrink-0 tabular-nums">{detailed ? row[2] : row[1]}{!detailed && panel.unit}{detailed && row[5] && <span className="ml-2 text-muted-foreground">{row[5]}</span>}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${Math.max(1, Math.abs(value) / max * 100)}%`, background: row[4] === 'bad' ? 'var(--destructive)' : row[4] === 'warn' ? 'var(--warning)' : chartColors[index % chartColors.length] }} /></div></div>;
  })}</div>;
}
function TrendChart({ panel }: { panel: PanoramaPanel }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const values = panel.values ?? [];
  const min = panel.min ?? Math.min(...values) * 0.9;
  const max = panel.max ?? Math.max(...values) * 1.05;
  const range = max - min || 1;
  const points = values.map((value, index) => ({ x: 4 + index / Math.max(1, values.length - 1) * 92, y: 12 + (value - min) / range * 76 }));
  const tickEvery = Math.max(1, Math.ceil((values.length - 1) / 4));
  return <div><div ref={ref} className="panorama-trend" role="img" aria-label={`${panel.title}：${values.map((v, i) => `${panel.labels?.[i]} ${v}${panel.unit ?? ''}`).join('；')}`}>
    {[25, 50, 75].map(top => <div key={top} className="absolute inset-x-0 border-t border-dashed" style={{ top: `${top}%` }} />)}
    {points.map((point, index) => {
      const next = points[index + 1];
      const dx = next ? (next.x - point.x) / 100 * width : 0;
      const dy = next ? (next.y - point.y) / 100 * 172 : 0;
      return <div key={index}>
        {next && width > 0 && <span className="absolute h-0.5 origin-left bg-primary" style={{ left: `${point.x}%`, bottom: `${point.y}%`, width: Math.hypot(dx, dy), transform: `rotate(${-Math.atan2(dy, dx)}rad)` }} />}
        <span title={`${panel.labels?.[index]}：${values[index]}${panel.unit ?? ''}`} className="absolute size-2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-card bg-primary ring-1 ring-primary" style={{ left: `${point.x}%`, bottom: `${point.y}%` }} />
        {(index % tickEvery === 0 || index === values.length - 1) && <span className="absolute -bottom-6 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground" style={{ left: `${point.x}%` }}>{panel.labels?.[index]}</span>}
      </div>;
    })}
  </div><div className="mt-10 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>当前 <strong className="font-medium text-foreground">{values.at(-1)}{panel.unit}</strong></span><span>最高 {Math.max(...values)}{panel.unit}</span><span>最低 {Math.min(...values)}{panel.unit}</span></div></div>;
}
function CompositionChart({ panel }: { panel: PanoramaPanel }) {
  const total = panel.rows.reduce((sum, row) => sum + numeric(row[1]), 0);
  const gradient = panel.rows.map((row, index) => {
    const start = panel.rows.slice(0, index).reduce((sum, item) => sum + numeric(item[1]), 0) / (total || 1) * 100;
    return `${chartColors[index % chartColors.length]} ${start}% ${start + numeric(row[1]) / (total || 1) * 100}%`;
  }).join(',');
  const percent = Math.abs(total - 100) < 0.3;
  return <div className="flex flex-wrap items-center justify-center gap-6"><div role="img" aria-label={panel.title} className="relative flex size-32 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradient})` }}><div className="flex size-24 flex-col items-center justify-center rounded-full bg-card"><span className="text-2xl font-medium tabular-nums">{percent ? '100%' : total.toLocaleString()}</span><span className="mt-1 text-xs text-muted-foreground">{percent ? '结构占比' : panel.unit ?? '合计'}</span></div></div><ul className="min-w-36 flex-1 space-y-3">{panel.rows.map((row, index) => <li key={row[0]} className="flex items-center gap-2 text-xs"><span className="size-2 shrink-0 rounded-sm" style={{ background: chartColors[index % chartColors.length] }} /><span className="flex-1">{row[0]}</span><span className="tabular-nums">{row[1]}{percent ? '%' : ''}</span>{!percent && <span className="w-12 text-right tabular-nums text-muted-foreground">{(numeric(row[1]) / (total || 1) * 100).toFixed(1)}%</span>}</li>)}</ul></div>;
}
function PanelTable({ rows, columns }: { rows: string[][]; columns?: string[] }) {
  const displayedRows = rows.map(row => ["bad", "warn", "run", "ok"].includes(row.at(-1) ?? "") ? row.slice(0, -1) : row);
  return <Table className="text-xs"><TableHeader><TableRow>{columns ? columns.map(column => <TableHead key={column} className="whitespace-nowrap">{column}</TableHead>) : <><TableHead>对象 / 项目</TableHead><TableHead colSpan={Math.max(1, Math.max(...displayedRows.map(row => row.length)) - 1)}>数据与状态</TableHead></>}</TableRow></TableHeader><TableBody>{displayedRows.map((row, index) => <TableRow key={index}>{row.map((value, column) => <TableCell key={column} className={cn('whitespace-normal py-3 leading-5', column === 0 ? 'min-w-24 font-medium' : 'min-w-16 text-muted-foreground')}>{value}</TableCell>)}</TableRow>)}</TableBody></Table>;
}
