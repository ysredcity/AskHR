import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PanoramaPanel, TalentMember } from "./panorama-data";

export function TalentNineGrid({ panel, onMemberAsk }: { panel: PanoramaPanel; onMemberAsk?: (member: TalentMember) => void }) {
  const [selectedMember, setSelectedMember] = useState<TalentMember | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const aggregate = panel.kind === "g9";
  const cells = aggregate ? panel.rows.flatMap((row, ri) => [...row].reverse().map((value, ci) => ({ title: `${panel.yLabels?.[ri] ?? ''} · ${[...(panel.xLabels ?? [])].reverse()[ci] ?? ''}`, count: Number(value), index: ri * 3 + (2-ci) }))) : panel.rows.map((row, i) => ({ title: row[0], count: Number(row[1]), index: i }));
  const total = cells.reduce((sum, cell) => sum + cell.count, 0);
  const ranks = [4,7,9,2,5,8,1,3,6];
  const tones = ["blue","cyan","green","amber","blue","cyan","red","amber","blue"];
  const members = panel.members ?? [];
  const currentCell = cells.find(cell => cell.index === selectedCell);
  const memberChip = (member: TalentMember) => <button key={member.id} aria-label={`查看${member.name}人才档案`} onClick={() => { setSelectedCell(null); setSelectedMember(member); }} className="flex min-w-0 items-center gap-1 rounded-full bg-card/90 px-1.5 py-0.5 text-left text-xs outline-none transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring">
    <Avatar aria-hidden="true" className="size-5 shrink-0"><AvatarImage src={member.avatar} alt="" className="object-cover" /><AvatarFallback className="bg-primary/10 text-[9px] text-primary">{member.name.slice(-1)}</AvatarFallback></Avatar><span className="truncate">{member.name}</span>
  </button>;
  return <div className="@container">
    <div className="overflow-x-auto pb-1">
      <div className="min-w-[640px]">
        <div className="mb-2 pl-8 text-xs text-muted-foreground">{aggregate ? '绩效' : '潜力'} ↑</div>
        <div className="flex gap-2">
          <div aria-hidden="true" className="grid w-6 shrink-0 grid-rows-3 items-center text-center text-xs text-muted-foreground"><span>高</span><span>中</span><span>低</span></div>
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-2">
            {cells.map((cell, position) => {
              const people = members.filter(member => member.cell === cell.index);
              return <section key={cell.index} className={cn("talent-nine-cell flex min-h-24 min-w-0 flex-col rounded-lg p-2.5", `talent-nine-cell--${tones[position]}`)} aria-label={`${cell.title}，${cell.count}人`}>
                <button disabled={!people.length} onClick={() => setSelectedCell(cell.index)} className="mb-2 flex w-full min-w-0 items-start gap-1.5 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default" aria-label={`查看${cell.title}成员`}>
                  <span className="talent-nine-number mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-medium">{ranks[position]}</span>
                  <span className="min-w-0 flex-1 text-xs font-medium leading-5">{cell.title}</span>
                  <span className="shrink-0 whitespace-nowrap text-xs leading-5 tabular-nums">{cell.count}人<span className="ml-1 text-muted-foreground">({total ? (cell.count/total*100).toFixed(1) : '0.0'}%)</span></span>
                  {people.length > 0 && <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
                </button>
                {people.length ? <div className="grid grid-cols-2 gap-1 @min-[850px]:grid-cols-3">{people.map(memberChip)}</div> : <p className="flex flex-1 items-center justify-center text-xs text-muted-foreground">{cell.count ? '当前展示汇总人数' : '暂无成员'}</p>}
              </section>;
            })}
          </div>
        </div>
        <div className="ml-8 mt-3 border-t pt-2"><div aria-hidden="true" className="grid grid-cols-3 text-center text-xs text-muted-foreground"><span>低</span><span>中</span><span>高</span></div><p className="mt-1 text-right text-xs text-muted-foreground">{aggregate ? '潜力' : '业绩'} →</p></div>
      </div>
    </div>
    <p className="mt-3 text-xs leading-5 text-muted-foreground">{panel.caption ?? `共 ${total} 人 · 业绩与潜力综合评估`}{members.length > 0 && <span> · 点击姓名查看人才档案</span>}</p>
    <p className="mt-1 hidden text-xs text-muted-foreground @max-[640px]:block">可左右滚动查看完整九宫格</p>
    <Dialog open={selectedCell !== null || selectedMember !== null} onOpenChange={open => { if (!open) { setSelectedCell(null); setSelectedMember(null); } }}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{selectedMember ? selectedMember.name : currentCell?.title}</DialogTitle><DialogDescription>{selectedMember ? `${selectedMember.job} · ${selectedMember.level} · ${selectedMember.id}` : `${currentCell?.count ?? 0} 人 · 人才盘点成员`}</DialogDescription></DialogHeader>
        {selectedMember ? <>
          <dl className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 text-sm"><div><dt className="text-xs text-muted-foreground">业绩评分</dt><dd className="mt-1 font-medium">{selectedMember.performance}</dd></div><div><dt className="text-xs text-muted-foreground">潜力评分</dt><dd className="mt-1 font-medium">{selectedMember.potential}</dd></div><div className="col-span-2"><dt className="text-xs text-muted-foreground">近三期考评</dt><dd className="mt-1">{selectedMember.evaluations}</dd></div></dl>
          <div><h4 className="text-sm font-medium">盘点记录</h4><p className="mt-2 text-sm leading-7 text-muted-foreground">{selectedMember.note}</p></div>
          {onMemberAsk && <DialogFooter><Button variant="outline" onClick={() => { onMemberAsk(selectedMember); setSelectedMember(null); }}><Sparkles />成长建议</Button></DialogFooter>}
        </> : <div className="grid grid-cols-2 gap-2">{members.filter(member => member.cell === selectedCell).map(memberChip)}</div>}
      </DialogContent>
    </Dialog>
  </div>;
}
