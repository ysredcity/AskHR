import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useHR } from "@/features/hr/context";
import type { PanelView } from "@/components/agent-layout/panel-types";
import { bindReportNotes, serializeReport } from "./report-notes";
import { bindReportFilters } from "./report-filters";

export function SalaryHtmlBody({ view }: { view: Extract<PanelView, { type: "file-preview" }> }) {
  const { salaryProjects, setSalaryProjects, salaryActive, setSessionContexts } = useHR();
  const frame = useRef<HTMLIFrameElement>(null);
  const releaseNotes = useRef<(() => void) | null>(null);
  useEffect(() => () => releaseNotes.current?.(), []);
  const draft = useRef(salaryProjects.find(project => project.id === salaryActive)?.edits?.[view.fileName] ?? view.content);
  const [revision, setRevision] = useState(0);
  const [preview, setPreview] = useState({ address: "", html: "" });
  const { address } = preview;
  const isFinalReport = ["COE工作底稿.html", "COE一页摘要.html"].includes(view.fileName);

  useEffect(() => {
    const url = URL.createObjectURL(new Blob([draft.current], { type: "text/html;charset=utf-8" }));
    // Synchronize the managed browser resource with the iframe and address bar.
    // oxlint-disable-next-line react/set-state-in-effect
    setPreview({ address: url, html: draft.current });
    return () => URL.revokeObjectURL(url);
  }, [revision]);

  const save = () => {
    const document = frame.current?.contentDocument;
    if (!document) return;
    const content = serializeReport(document);
    draft.current = content;
    setSalaryProjects(items => items.map(project => project.id === salaryActive
      ? { ...project, edits: { ...project.edits, [view.fileName]: content } }
      : project));
  };

  return <div className="flex min-h-0 min-w-0 flex-1 flex-col">
    <div role="toolbar" aria-label="HTML 页面浏览工具" className="flex h-12 shrink-0 items-center gap-1.5 border-b px-3">
      <Button variant="ghost" size="icon-sm" aria-label="刷新页面" title="刷新页面" disabled={!address}
        onClick={() => setRevision(value => value + 1)}><RefreshCw className="size-3.5" /></Button>
      <Input aria-label="页面地址" title={`${view.fileName}\n${address}`} value={address} readOnly
        placeholder="正在加载页面…" className="h-7 min-w-0 flex-1 bg-muted/50 font-mono text-xs md:text-xs" onFocus={event => event.currentTarget.select()} />
      <Button variant="ghost" size="icon-sm" aria-label="在新窗口打开页面" title="在新窗口打开" disabled={!address}
        onClick={() => window.open(address, "_blank", "noopener,noreferrer")}><ExternalLink className="size-3.5" /></Button>
      {isFinalReport ? <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" />}>
          <Download className="size-3.5" />
          导出<ChevronDown className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuItem className="flex-col items-start gap-1 py-3">
            <span>PDF文件（推荐）</span><span className="text-xs font-normal text-muted-foreground">适合正式汇报、发送和归档</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-1 py-3">
            <span>Word文件（可编辑）</span><span className="text-xs font-normal text-muted-foreground">适合修改内容和二次加工</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> : null}
    </div>
    {address && <iframe key={revision} ref={frame} title={view.title} sandbox="allow-same-origin" srcDoc={preview.html}
      className="min-h-0 w-full flex-1 border-0 bg-card" onLoad={() => {
        const document = frame.current?.contentDocument;
        if (document) {
          document.addEventListener("input", event => {
            if (!(event.target as Element)?.closest(".report-note-editor")) save();
          });
          bindReportFilters(document);
          releaseNotes.current?.();
          releaseNotes.current = bindReportNotes(document, {
            onSave: save,
            onQuote: quote => {
              if (!salaryActive) return;
              const item = {
                id: `${view.fileName}:${quote.id}`,
                type: "文件库" as const,
                label: `${quote.title} · 分析结论`,
                target: { type: "file-preview" as const, title: `引用：${quote.title}`, fileName: `${quote.title}-引用.md`, fileType: "Markdown", content: `来源：${view.fileName}\n\n## ${quote.title}\n\n${quote.content}` },
              };
              setSessionContexts(all => ({ ...all, [salaryActive]: [...(all[salaryActive]??[]).filter(context => context.id !== item.id), item] }));
            },
          });
        }
      }} />}
  </div>;
}
