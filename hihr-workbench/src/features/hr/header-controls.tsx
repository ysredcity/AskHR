import { useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { HeaderTarget } from './context';
import { createPortal } from 'react-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function HeaderControls({ children }: { children: ReactNode }) {
  const target = useContext(HeaderTarget);
  return target ? createPortal(<div className="flex min-w-0 items-center justify-between gap-2 [&>div]:mb-0 [&>div:first-child]:min-w-0">{children}</div>, target) : null;
}

/** 页面顶部右侧的行动按钮组；Glass 主题下由样式包成全圆角玻璃胶囊。 */
export function HeaderActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div data-slot="header-actions" className={cn('ml-auto flex shrink-0 items-center gap-1.5', className)}>{children}</div>;
}

type TabItem = { value: string; label: string };
const LIST_PADDING = 6;

/**
 * 页面顶部的 Tabs：宽度不足时把放不下的项折叠进「…」菜单，「…」按钮位于 TabsList 内部。
 * 当前选中项始终保持可见；宽度用隐藏的测量列表实测，不按字数估算。
 */
export function HeaderTabs({ items, value, onChange }: { items: readonly TabItem[]; value: string; onChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const activeIndex = Math.max(0, items.findIndex(item => item.value === value));

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;
    const update = () => {
      const widths = [...measure.querySelectorAll<HTMLElement>('[data-measure="tab"]')].map(node => node.offsetWidth);
      const moreWidth = measure.querySelector<HTMLElement>('[data-measure="more"]')?.offsetWidth ?? 32;
      const available = container.clientWidth - LIST_PADDING;
      const total = widths.reduce((sum, width) => sum + width, 0);
      if (total <= available) { setVisibleCount(widths.length); return; }
      let used = moreWidth;
      let count = 0;
      while (count < widths.length && used + widths[count] <= available) used += widths[count++];
      setVisibleCount(Math.max(1, count));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [items]);

  let visible = items.slice(0, visibleCount);
  if (visibleCount < items.length && activeIndex >= visibleCount) visible = [...visible.slice(0, -1), items[activeIndex]];
  const rest = items.filter(item => !visible.includes(item));

  return <div ref={containerRef} className="relative min-w-0 flex-1">
    <Tabs value={value} onValueChange={v => onChange(String(v))} className="min-w-0">
      <TabsList className="max-w-full">
        {visible.map(item => <TabsTrigger key={item.value} value={item.value} className="shrink-0">{item.label}</TabsTrigger>)}
        {rest.length > 0 && <DropdownMenu>
          <DropdownMenuTrigger
            data-slot="tabs-more"
            aria-label={`更多标签（${rest.length}）`}
            title="更多"
            className="inline-flex h-[calc(100%-1px)] shrink-0 items-center justify-center rounded-md px-2 text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-popup-open:text-foreground"
          ><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
          <DropdownMenuContent align="start">{rest.map(item => <DropdownMenuItem key={item.value} onClick={() => onChange(item.value)}>{item.label}</DropdownMenuItem>)}</DropdownMenuContent>
        </DropdownMenu>}
      </TabsList>
    </Tabs>
    {/* 隐藏的测量列表：与实际 Tabs 同样式，只用于取每项宽度 */}
    <div ref={measureRef} aria-hidden="true" inert className="pointer-events-none invisible absolute left-0 top-0 flex w-max">
      <Tabs value={value} className="w-max"><TabsList>
        {items.map(item => <TabsTrigger key={item.value} value={item.value} data-measure="tab" className="shrink-0 flex-none">{item.label}</TabsTrigger>)}
        <span data-measure="more" className="inline-flex shrink-0 px-2"><MoreHorizontal className="size-4" /></span>
      </TabsList></Tabs>
    </div>
  </div>;
}
