import { ArrowRight, CalendarDays, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHR } from "./context";
import { services, type Route } from "./data";
import { hrLeave } from "@/components/agent-layout/panel-data";
import type { ArtifactTarget } from "@/components/agent-layout/panel-types";
export function LeaveDraftCard({
  open,
}: {
  open: (target: ArtifactTarget) => void;
}) {
  const { leave } = useHR();
  return (
    <div className="max-w-[600px] rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
          {leave.status === "草稿" ? (
            <CalendarDays className="size-5" />
          ) : (
            <CheckCircle2 className="size-5" />
          )}
        </span>
        <div>
          <p className="text-sm font-medium">年假申请 · {leave.status}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {leave.start} 至 {leave.end}
          </p>
        </div>
      </div>
      <div className="my-4 border-t pt-4 text-sm">
        <p>事由：{leave.reason || "待补充"}</p>
        <p className="mt-2">交接人：{leave.handover || "待补充"}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {leave.status === "草稿" ? "尚未提交" : `${leave.id}`}
        </span>
        <Button variant="outline" size="sm" onClick={() => open(hrLeave)}>
          {leave.status === "草稿" ? "核对并办理" : "查看申请"}
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
      {leave.status === "审批中" && (
        <p role="status" className="mt-4 text-xs text-primary">
          已提交，当前节点：李伟审批。
        </p>
      )}
    </div>
  );
}
export function NavigationBlock({ data }: { data: unknown }) {
  const { setRoute, openService } = useHR();
  if (!data || typeof data !== "object") return null;
  const d = data as { route?: Route; service?: string; label?: string };
  return (
    <Button
      variant="outline"
      onClick={() => {
        const s = services.find((s) => s.id === d.service);
        if (s) openService(s);
        else if (d.route) setRoute(d.route);
      }}
    >
      <FileText className="size-4" />
      {d.label || "查看业务"}
      <ArrowRight className="size-4" />
    </Button>
  );
}
