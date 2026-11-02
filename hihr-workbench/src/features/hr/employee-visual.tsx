import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { employeeHighlights } from "./data";

export function EmployeeSurface({tone, children, className}: {tone: "profile" | "welcome" | "leave" | "income" | "performance" | "growth"; children: ReactNode; className?: string}) {
  return <section className={cn("employee-surface", `employee-surface--${tone}`, className)}>
    <div aria-hidden="true" className="employee-art"><span /><span /><span /><i /></div>
    <div className="relative z-10">{children}</div>
  </section>;
}
export function EmployeeHighlight({type, action}: {type: "welcome" | "leave" | "performance"; action?: ReactNode}) {
  const item = employeeHighlights[type];
  return <EmployeeSurface tone={type} className="mb-6 p-6 md:p-7"><div className="flex items-center justify-between gap-6">
    <div className="min-w-0 max-w-[75%] flex-1">
    <p className="mb-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground">{item.eyebrow}</p>
    <h2 className="text-xl font-medium tracking-tight">{item.title}</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div></EmployeeSurface>;
}
