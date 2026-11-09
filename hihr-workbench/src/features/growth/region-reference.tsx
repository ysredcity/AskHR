import { useContext } from "react";
import { GrowthReadOnlyContext } from "./read-only-context";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHR } from "@/features/hr/context";

export function RegionReference({ region, title }: { region: string; title: string }) {
  const { setSessionContexts } = useHR();
  const readOnly = useContext(GrowthReadOnlyContext);
  if (readOnly) return null;
  return <Button variant="secondary" size="sm" className="opacity-0 transition-opacity group-hover/region:opacity-100 group-focus-within/region:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100" aria-label={`引用${title}`} title={`引用${title}`} onClick={event => {
    const root = event.currentTarget.closest<HTMLElement>("[data-growth-session]");
    const session = root?.dataset.growthSession;
    const element = document.getElementById(region);
    if (!session || !element) return;
    const copy = element.cloneNode(true) as HTMLElement;
    copy.querySelectorAll("button, [role=dialog]").forEach(node => node.remove());
    copy.querySelectorAll("p, h3, h4, dt, dd, li").forEach(node => node.append("\n"));
    const values = [...element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")].map(input => input.value);
    const content = `${copy.textContent?.trim()}\n${values.join("\n")}`;
    const item = { id: `${session}:quote:${region}`, type: "文件库" as const, label: `${title} · 成长计划`, target: { type: "file-preview" as const, title: `引用：${title}`, fileName: `${title}-引用.md`, fileType: "Markdown", content: `来源：成长计划 · ${title}\n\n${content}` } };
    setSessionContexts(all => ({ ...all, [session]: [...(all[session] ?? []).filter(x => x.id !== item.id), item] }));
  }}><Quote className="size-3.5" />引用</Button>;
}
