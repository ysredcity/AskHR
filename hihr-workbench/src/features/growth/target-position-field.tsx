import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { defaultTarget, targetPaths, targetPositions, type Conditions, type TargetDirection } from "./data";

type TargetPath = "primary" | TargetDirection;

export function TargetPositionField({ conditions, onChange }: { conditions: Conditions; onChange: (conditions: Conditions) => void }) {
  const [path, setPath] = useState<TargetPath>(conditions.targetRole === defaultTarget.name ? "primary" : conditions.direction);
  return <fieldset className="space-y-4">
    <legend className="mb-3 w-full text-sm font-medium"><span className="flex items-baseline justify-between gap-3"><span className="shrink-0">目标岗位</span><span className="text-right font-normal text-muted-foreground" aria-live="polite" data-slot="selected-target">已选：{conditions.targetRole}</span></span></legend>
    <Tabs data-horizontal="" value={path} onValueChange={value => setPath(value as TargetPath)} className="min-w-0 gap-4">
      <TabsList aria-label="发展方向" className="max-w-full">
        {targetPaths.map(option => <TabsTrigger key={option.value} value={option.value}>{option.label}</TabsTrigger>)}
      </TabsList>
      {targetPaths.map(option => {
        const positions = option.value === "primary" ? [defaultTarget] : targetPositions.filter(position => position.direction === option.value && position.name !== defaultTarget.name);
        return <TabsContent key={option.value} value={option.value}>
    <RadioGroup value={conditions.targetRole} onValueChange={value => {
      const position = positions.find(item => item.name === value);
      if (position) onChange({ ...conditions, targetRole: position.name, direction: position.direction });
    }} aria-label="选择目标岗位">
      {positions.map(position => {
        const selected = position.name === conditions.targetRole;
        return <label key={position.name} data-slot="target-position-option" data-selected={selected} className={cn("flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 transition-colors", selected ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50")}>
          <RadioGroupItem className="mt-1 shrink-0" value={position.name} />
          <span className="block min-w-0 flex-1 space-y-1"><span className="flex flex-wrap items-center gap-2"><span className={cn("text-sm", selected ? "font-semibold" : "font-medium")}>{position.name}</span>{(path === "primary" || position.recommended) && <Badge variant="secondary">{path === "primary" ? "首要推荐" : "推荐"}</Badge>}</span><span className="block text-sm leading-5 text-muted-foreground">{position.reason}</span></span>
        </label>;
      })}
    </RadioGroup>
        </TabsContent>;
      })}
    </Tabs>
  </fieldset>;
}
