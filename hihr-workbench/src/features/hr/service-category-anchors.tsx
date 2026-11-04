import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

export function ServiceCategoryAnchors({ categories, contentRef }: { categories: string[]; contentRef: RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState(categories[0]);
  const categoryKey = categories.join("|");
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    let parent = content.parentElement;
    while (parent && !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) parent = parent.parentElement;
    const scrollRoot = parent;
    const sections = Array.from(content.querySelectorAll<HTMLElement>("[data-service-category]"));
    const update = () => {
      const top = (scrollRoot?.getBoundingClientRect().top ?? 0) + 32;
      let current = sections[0];
      for (const section of sections) if (section.getBoundingClientRect().top <= top) current = section;
      if (scrollRoot && scrollRoot.scrollTop > 0 && scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 2) current = sections.at(-1) ?? current;
      if (current) setActive(current.dataset.serviceCategory!);
    };
    update();
    const target = scrollRoot ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { target.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [contentRef, categoryKey]);
  return <nav aria-label="薪酬分类定位" className="sticky top-4 self-start border-l pl-2">
    <p className="mb-2 pl-2 text-xs text-muted-foreground">薪酬分类</p>
    <ul className="space-y-1">{categories.map((category, i) => <li key={category}>
      <a href={`#salary-service-${i}`} aria-current={active === category ? "location" : undefined} className={cn("block rounded-md px-2 py-2 text-xs leading-4 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", active === category && "bg-accent font-medium text-foreground")} onClick={event => {
        event.preventDefault();
        const section = Array.from(contentRef.current?.querySelectorAll<HTMLElement>("[data-service-category]") ?? []).find(item => item.dataset.serviceCategory === category);
        section?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        setActive(category);
      }}>{category}</a>
    </li>)}</ul>
  </nav>;
}
