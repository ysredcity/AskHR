import { useEffect, useRef } from "react";

type FigureHandle = { destroy: () => void };
declare global {
  interface Window {
    HiHRBriefing?: { mount: (stage: HTMLElement, read: HTMLElement) => FigureHandle };
  }
}
let runtime: Promise<void> | undefined;
function loadRuntime() {
  return runtime ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/hairline/briefing-runtime.js";
    script.onload = () => resolve();
    script.onerror = () => { runtime = undefined; script.remove(); reject(new Error("Hairline illustration failed to load")); };
    document.head.append(script);
  });
}

export function HairlineBriefing() {
  const stage = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLOutputElement>(null);
  useEffect(() => {
    let cancelled = false;
    let figure: FigureHandle | undefined;
    loadRuntime().then(() => {
      if (!cancelled && stage.current && read.current) figure = window.HiHRBriefing?.mount(stage.current, read.current);
    }).catch(error => console.error(error));
    return () => { cancelled = true; figure?.destroy(); };
  }, []);
  return <div className="briefing-illustration hairline-briefing absolute right-8 top-0 h-28 w-36" aria-label="悬停翻阅简报卡片">
    <div ref={stage} className="h-full w-full" />
    <output ref={read} className="sr-only" />
  </div>;
}
