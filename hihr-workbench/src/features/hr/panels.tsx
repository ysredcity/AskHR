import { GrowthPlanPanel } from "@/features/growth/plan-panel";
import {SalaryHtmlBody} from "@/features/compensation/html-artifact";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreviewBody } from "@/components/agent-layout/panel-containers";
import type { PanelView } from "@/components/agent-layout/panel-types";
import { LeaveForm } from "./views";
export function HRFileBody({
  view,
}: {
  view: Extract<PanelView, { type: "file-preview" }>;
}) {
  if (view.fileType === "成长计划" || view.fileName.endsWith(".growth.html")) return <GrowthPlanPanel key={view.fileName} id={view.content} final={view.fileName.endsWith(".final.growth.html")} />;
  if (view.fileName.endsWith(".html")) return <SalaryHtmlBody key={view.fileName} view={view} />;
  return view.fileName === "休假申请单.hr" ? (
    <div className="min-h-0 flex-1 overflow-y-auto p-7">
      <h2 className="mb-2 text-lg font-medium">休假申请单</h2>
      <p className="mb-6 text-xs text-muted-foreground">
        修改与办理进度同步到对话和我的假勤
      </p>
      <LeaveForm />
    </div>
  ) : (
    <FilePreviewBody view={view} />
  );
}
export function HRFileToolbar({
  view,
}: {
  view: Extract<PanelView, { type: "file-preview" }>;
}) {
  if (view.fileType === "成长计划" || view.fileName.endsWith(".html")) return null;
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <FileText className="size-4 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate text-xs">
        {view.fileType || "文档"}
      </span>
      <Button variant="ghost" size="sm">
        <Download className="size-3.5" />
        下载
      </Button>
    </div>
  );
}
