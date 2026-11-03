import CompensationApp from "@/features/compensation/compensation-app";
import { EmployeeSurface, EmployeeHighlight } from "./employee-visual";
import { useState, type ReactNode } from "react";
import { HeaderControls } from "./header-controls";
import { PanoramaPageView } from "./panorama";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Eye,
  EyeOff,
  FileText,
  Info,
  LockKeyhole,
  Search,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { Tabs as ShadcnTabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { HeaderTarget, useHR } from "./context";
import type { Leave } from "./store";
import {
  development,
  employeeTabs,
  hallRoles,
  hallCategories,
  onboarding,
  person,
  services,
  teamMembers,
} from "./data";
import { hrIcons, serviceIconColors } from "./icons";
export function PageTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
function Tabs({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return <ShadcnTabs value={value} onValueChange={v => onChange(String(v))} className="mb-6 overflow-x-auto"><TabsList>{items.map(item => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList></ShadcnTabs>;
}
function DetailsButton({ label }: { label: string }) {
  return <Button variant="ghost" size="xs" className="shrink-0 font-normal text-muted-foreground hover:text-foreground" aria-label={`查看${label}详情`}>查看详情</Button>;
}
export function Section({
  title,
  subtitle,
  children,
  action,
  showDetails = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  showDetails?: boolean;
}) {
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div className="min-w-0"><CardTitle>{title}</CardTitle>{subtitle && <CardDescription className="mt-1">{subtitle}</CardDescription>}</div>{showDetails ? <DetailsButton label={title} /> : action}</div></CardHeader><CardContent>{children}</CardContent></Card>;
}
function Metric({
  label,
  value,
  unit,
  detail,
  showDetails = false,
}: {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  showDetails?: boolean;
}) {
  return (
    <div data-slot="employee-metric" className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm text-muted-foreground">{label}</p>
        {showDetails && <DetailsButton label={label} />}
      </div>
      <p className="mt-3 text-2xl font-medium tabular-nums tracking-tight">
        {value}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {unit}
        </span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
export function AskButton({
  prompt,
  label = "AI 咨询",
  className,
  variant = "outline",
}: {
  prompt: string;
  label?: string;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const { ask, route, composeEmployee } = useHR();
  const isEmployee = route === "employee";
  return (
    <Button variant={variant === "primary" ? "default" : "outline"} className={cn(variant === "primary" && "bg-foreground text-background hover:bg-foreground/85 dark:bg-background-desktop dark:text-foreground dark:hover:bg-background-desktop/85", className)} onClick={() => isEmployee ? composeEmployee(prompt, label) : ask(prompt)}>
      <Sparkles className={cn("size-4", !isEmployee && "text-primary")} />
      {label}
    </Button>
  );
}
export function Tasks({
  all = false,
  onlyId,
}: {
  all?: boolean;
  onlyId?: string;
}) {
  const { tasks, completeTask } = useHR();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("待处理");
  const [attachment, setAttachment] = useState("");
  const [decision, setDecision] = useState(false);
  const pending = tasks.filter((t) => !t.done && (!onlyId || t.id === onlyId));
  const rows = all
    ? filter === "已完成"
      ? tasks.filter((t) => t.done && (!onlyId || t.id === onlyId))
      : pending
    : pending.slice(0, 5);
  const current = tasks.find((t) => t.id === selected);
  return (
    <>
      <div className="w-full">
        {all && (
          <HeaderControls>
            <Tabs items={["待处理", "已完成"]} value={filter} onChange={setFilter} />
          </HeaderControls>
        )}
        <div data-slot="task-list" className="space-y-1">
          {rows.map((t) => (
            <button
              key={t.id}
              data-slot="task-row"
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
                  t.priority && "bg-muted text-foreground",
                )}
              >
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium group-hover:text-foreground">
                  {t.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.type} <span className="mx-1.5">·</span>
                  {t.done ? "已完成" : t.due}
                </p>
              </div>
              {t.priority && !t.done && (
                <span className="text-xs text-warning-foreground">待处理</span>
              )}
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </button>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="py-9 text-center text-sm text-muted-foreground">
            {filter === "已完成"
              ? "暂无已完成事项"
              : "暂时没有待办，安心专注当下。"}
          </p>
        )}
      </div>
      <Dialog
        open={!!current}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
            <DialogDescription>任务编号 {current?.id}</DialogDescription>
          </DialogHeader>
          {current && (
            <div className="space-y-5">
              <div className="rounded-lg bg-muted p-4 text-sm leading-7">
                {current.id === "T01"
                  ? "本季度绩效结果：A。目标完成情况与主管评语已更新，请核对后确认收到反馈。"
                  : current.id === "T02"
                    ? "陈思申请 2026-10-30 年假 1 天，事由：个人事务；当前可用余额 5 天，交接人李明。审批通过后将更新申请状态。"
                    : "住房借款申请 HR-HL-003 待补充收入证明。请添加文件后提交材料。"}
              </div>
              {current.id === "T03" && (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-5 text-sm">
                  <Upload className="size-5 text-primary" />
                  {attachment || "选择收入证明文件"}
                  <input
                    className="sr-only"
                    type="file"
                    accept=".pdf,.png,.jpg,.docx"
                    onChange={(e) =>
                      setAttachment(e.target.files?.[0]?.name || "")
                    }
                  />
                </label>
              )}
              {current.done ? (
                <p className="flex items-center gap-2 text-sm text-success-foreground">
                  <CircleCheck className="size-4" />
                  已完成处理
                </p>
              ) : (
                <>
                  {decision && (
                    <p className="rounded-lg bg-muted p-3 text-sm">
                      确认
                      {current.id === "T02"
                        ? "批准陈思的 1 天年假申请"
                        : current.id === "T03"
                          ? "提交这份材料"
                          : "已收到并核对绩效反馈"}
                      ？确认后将更新任务状态。
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelected(null)}>
                      返回
                    </Button>
                    <Button
                      disabled={current.id === "T03" && !attachment}
                      onClick={() => {
                        if (!decision) {
                          setDecision(true);
                          return;
                        }
                        completeTask(current.id);
                        setSelected(null);
                      }}
                    >
                      {decision
                        ? "确认处理"
                        : current.id === "T02"
                          ? "同意申请"
                          : current.id === "T03"
                            ? "提交材料"
                            : "确认收到"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function EmployeePage() {
  const {
    employeeTab,
    setEmployeeTab,
    onboardingDone,
    setOnboardingDone,
    tasks,
  } = useHR();
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState("2026 年 9 月");
  const [edit, setEdit] = useState(false);
  const [phone, setPhone] = useState("138 0000 8629");
  const [phoneDraft, setPhoneDraft] = useState(phone);
  const [year, setYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(10);
  const [day, setDay] = useState<number | null>(null);
  const shiftMonth = (delta: number) => {
    const d = new Date(year, calMonth - 1 + delta, 1);
    setYear(d.getFullYear());
    setCalMonth(d.getMonth() + 1);
    setDay(null);
  };
  return (
    <>
      <HeaderControls>
      <Tabs
        items={employeeTabs}
        value={employeeTab}
        onChange={setEmployeeTab}
      />
      </HeaderControls>
      {employeeTab === "个人信息" && (
        <div className="grid gap-6">
          <EmployeeSurface tone="profile" className="p-7"><div className="flex flex-wrap items-center gap-5">
            <Avatar className="size-18"><AvatarFallback className="text-2xl">乐</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{person.name}</h2>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                  在职
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {person.title} · {person.level}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {person.department} / {person.team}
              </p>
            </div>
            <AskButton
              prompt="帮我梳理个人档案里的岗位和发展信息"
              label="档案咨询"
              variant="primary"
            />
          </div></EmployeeSurface>
          <div className="grid grid-cols-2 gap-6 max-[1000px]:grid-cols-1">
            <Section
              title="基础信息"
              subtitle="你的任职与联系信息"
              action={
                <Button
                  variant="ghost"
                  size="xs"
                  className="shrink-0 font-normal text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setPhoneDraft(phone);
                    setEdit(true);
                  }}
                >
                  修改信息
                </Button>
              }
            >
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                {[
                  ["员工编号", person.number],
                  ["工作城市", person.city],
                  ["入职日期", person.date],
                  ["联系电话", phone],
                  ["直属上级", "李伟"],
                  ["HRBP", "孙梦琪"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-2 text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </Section>
            <Section showDetails title="职业旅程" subtitle="记录每一次积累与成长">
              <div className="space-y-6">
                {[
                  ["2025.07", "晋升高级产品经理", "产品与体验组 · P6"],
                  ["2023.09", "加入数字化转型办公室", "负责内部产品体验"],
                  ["2022.06", "入职海信", "职业旅程，从这里开始"],
                ].map(([date, title, detail]) => (
                  <div key={date} className="flex gap-4">
                    <div className="pt-1.5">
                      <span className="block size-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{date}</p>
                      <p className="mt-1 text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}
      {employeeTab === "新员工专区" && (
        <>
          <EmployeeHighlight type="welcome" />
          <Section
            title="融入计划"
            subtitle="回顾入职阶段的重要任务与融入进度。"
            action={
              <span className="text-sm text-primary">
                {onboardingDone.length} / {onboarding.length} 项完成
              </span>
            }
          >
            <div className="mb-6 h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(onboardingDone.length / onboarding.length) * 100}%`,
                }}
              />
            </div>
            {onboarding.map((item, i) => (
              <div key={item} className="flex items-center gap-4 border-t py-4">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full bg-muted text-sm",
                    onboardingDone.includes(i) && "bg-muted text-foreground",
                  )}
                >
                  {onboardingDone.includes(i) ? (
                    <Check className="size-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="flex-1 text-sm">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={onboardingDone.includes(i)}
                  onClick={() => setOnboardingDone((items) => [...items, i])}
                >
                  {onboardingDone.includes(i) ? "已完成" : "完成任务"}
                </Button>
              </div>
            ))}
          </Section>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              ["我的导师", "周毅航", "岗位与日常协作"],
              ["直属上级", "李伟", "目标与转正沟通"],
              ["HRBP", "孙梦琪", "政策与入职支持"],
            ].map(([r, n, d]) => (
              <Section key={r} title={r} subtitle={d}>
                <p className="text-xl font-medium">{n}</p>
                <AskButton label="咨询职责" variant="outline" className="mt-4" prompt={`我想了解${r}${n}在新员工融入中的支持职责`} />
              </Section>
            ))}
          </div>
        </>
      )}
      {employeeTab === "我的假勤" && (
        <>
          <EmployeeHighlight type="leave" action={<AskButton label="我要请假" variant="primary" prompt="我想申请休假，请帮我准备请假申请。我的可用年假为 7.5 天（年度 12 天，已使用 4.5 天）。请先确认假期类型、起止日期、请假事由和工作交接人，核对休假政策与预计时长，再由我确认是否提交。" />} />
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Metric
              showDetails
              label="可用年假"
              value="7.5"
              unit="天"
              detail="年度 12 天 · 已使用 4.5 天"
            />
            <Metric
              showDetails
              label="本月出勤率"
              value="97.2"
              unit="%"
              detail="统计至 2026 年 10 月 24 日"
            />
            <Metric
              showDetails
              label="待处理异常"
              value="1"
              unit="项"
              detail="一条缺卡记录待确认"
            />
          </div>
          <div className="grid gap-6">
            <Section
              title="考勤日历"
              subtitle="点击日期查看详情"
              action={
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="上个月"
                    onClick={() => shiftMonth(-1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-sm">
                    {year} 年 {calMonth} 月
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="下个月"
                    onClick={() => shiftMonth(1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              }
            >
              <div className="grid grid-cols-7 gap-2 text-center">
                {["一", "二", "三", "四", "五", "六", "日"].map((t) => (
                  <span key={t} className="py-2 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
                {Array.from(
                  {
                    length: (new Date(year, calMonth - 1, 1).getDay() + 6) % 7,
                  },
                  (_, i) => (
                    <span key={`blank-${i}`} />
                  ),
                )}
                {Array.from(
                  { length: new Date(year, calMonth, 0).getDate() },
                  (_, i) => i + 1,
                ).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    className={cn(
                      "relative h-12 rounded-lg text-sm hover:bg-muted",
                      d === day
                        ? "bg-muted text-foreground"
                        : d === 24 && "bg-muted font-medium",
                    )}
                  >
                    <span>{d}</span>
                    {d === 20 && (
                      <span className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-warning" />
                    )}
                  </button>
                ))}
              </div>
              {day && (
                <p className="mt-4 rounded-lg bg-muted p-3 text-sm">
                  {calMonth} 月 {day} 日 ·{" "}
                  {day === 20 ? "缺少下班打卡记录" : "出勤记录正常"}
                </p>
              )}
            </Section>
          </div>
        </>
      )}
      {employeeTab === "我的收入" && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {["2026 年 9 月", "2026 年 8 月"].map((m) => (
                <Button
                  key={m}
                  variant={month === m ? "secondary" : "ghost"}
                  onClick={() => setMonth(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setVisible((v) => !v)}>
              {visible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              {visible ? "隐藏金额" : "查看金额"}
            </Button>
          </div>
          <EmployeeSurface tone="income" className="mb-6 p-7">
            <p className="text-sm text-primary">{month} · 实发收入</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
              <p className="text-[42px] font-semibold tracking-tight text-foreground tabular-nums">
                {visible
                  ? month.includes("9 月")
                    ? "¥ 18,380.00"
                    : "¥ 18,700.00"
                  : "¥ ••••••"}
              </p>
              <AskButton prompt="分析一下我的工资变化" label="收入分析" variant="primary" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <LockKeyhole className="size-3" />
              薪酬信息仅本人可见，请妥善保管。
            </p>
          </EmployeeSurface>
          <Section showDetails title="收入明细" subtitle="按月查看各项收入、扣款与实发金额">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-b text-left text-xs text-muted-foreground">
                  <TableHead className="pb-3 font-normal">收入与扣款项目</TableHead>
                  <TableHead className="pb-3 text-right font-normal">金额（元）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["基本工资", "18,000.00"],
                  [
                    "绩效工资",
                    month.includes("9 月") ? "3,600.00" : "4,000.00",
                  ],
                  ["津补贴", "800.00"],
                  ["社保公积金", "-2,860.00"],
                  [
                    "个人所得税",
                    month.includes("9 月") ? "-1,160.00" : "-1,240.00",
                  ],
                ].map(([k, v]) => (
                  <TableRow key={k} className="border-b last:border-0">
                    <TableCell className="py-4">{k}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {visible ? v : "••••••"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        </>
      )}
      {employeeTab === "我的绩效" && (
        <>
          <EmployeeHighlight type="performance" />
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Metric showDetails label="2026 年第三季度" value="A" detail="绩效结果已发布" />
            <Metric
              showDetails
              label="目标完成率"
              value="108"
              unit="%"
              detail="3 项目标已完成"
            />
            <Metric
              showDetails
              label="待确认反馈"
              value={tasks.find((t) => t.id === "T01")?.done ? "0" : "1"}
              unit="项"
              detail="核对主管评语并确认收到"
            />
          </div>
          <Section
            title="季度目标"
            subtitle="目标、进展与评价放在一起"
            action={<AskButton label="绩效总结" prompt="帮我整理本季度绩效总结" />}
          >
            {[
              ["统一业务入口体验升级", 100],
              ["关键流程完成率提升", 100],
              ["AI 产品能力建设", 85],
            ].map(([n, v]) => (
              <div className="border-t py-5 first:border-0" key={n}>
                <div className="flex justify-between text-sm">
                  <span>{n}</span>
                  <span className="text-primary">{v}%</span>
                </div>
                <Progress value={Number(v)} className="mt-3" />
              </div>
            ))}
          </Section>
          <div className="mt-6">
            <Section title="主管反馈" subtitle="李伟 · 2026-10-20">
              <p className="text-sm leading-7">
                能够从真实业务问题出发推进产品落地，跨团队协作主动。下一阶段建议进一步提升数据验证与规模化推广能力。
              </p>
              <div className="mt-4">
                <Tasks onlyId="T01" />
              </div>
            </Section>
          </div>
        </>
      )}
      {employeeTab === "我的发展" && (
        <>
          <EmployeeSurface tone="growth" className="mb-6 p-6"><div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">
                让每一次学习，连接下一步成长
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                技能画像、学习计划与任职资格
              </p>
            </div>
            <AskButton label="学习规划" variant="primary" prompt="根据我的岗位推荐下一阶段学习计划" />
          </div></EmployeeSurface>
          <div className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-1">
            {development.map((d) => (
              <Section key={d.name} title={d.name} subtitle={d.category}>
                <p className="text-sm text-muted-foreground">{d.detail}</p>
                <Progress value={d.progress} className="my-5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>完成进度</span>
                  <span>{d.progress}%</span>
                </div>
                <AskButton label="学习建议" className="mt-6 w-full" prompt={`帮我安排学习：${d.name}`} />
              </Section>
            ))}
          </div>
          <div className="mt-6">
            <Section title="个人发展计划 · IDP" subtitle="2026 年下半年">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    从产品设计到 AI 产品规划
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    实践任务 2 / 3 · 下次辅导 11 月 6 日
                  </p>
                </div>
                <AskButton
                  prompt="帮我回顾个人发展计划并给出下一步行动"
                  label="发展回顾"
                />
              </div>
            </Section>
          </div>
        </>
      )}
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改个人信息</DialogTitle>
            <DialogDescription>
              保存后更新联系电话。任职信息变更请发起相应申请。
            </DialogDescription>
          </DialogHeader>
          <label className="space-y-2 text-sm">
            联系电话
            <Input
              value={phoneDraft}
              onChange={(e) => setPhoneDraft(e.target.value)}
            />
          </label>
          <Button
            disabled={!/^1\d{10}$/.test(phoneDraft.replace(/\s/g, ""))}
            onClick={() => {
              setPhone(phoneDraft);
              setEdit(false);
            }}
          >
            确认保存
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function LeaveForm({ compact = false }: { compact?: boolean }) {
  const { leave, setLeave } = useHR();
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const days =
    Math.round(
      (new Date(leave.end).getTime() - new Date(leave.start).getTime()) /
        86400000,
    ) + 1;
  function validate() {
    if (!leave.start || !leave.end || days < 1) {
      setError("请选择有效起止日期");
      return;
    }
    if (days > 7.5) {
      setError("申请时长超过可用年假 7.5 天");
      return;
    }
    if (!leave.reason.trim() || !leave.handover.trim()) {
      setError("请补充事由与工作交接人");
      return;
    }
    setError("");
    setConfirm(true);
  }
  const field = (key: keyof Leave, value: string) =>
    setLeave((l) => ({ ...l, [key]: value }));
  if (leave.status !== "草稿")
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl bg-muted p-5 text-primary">
          <CircleCheck className="size-6" />
          <div>
            <p className="font-medium">
              {leave.status === "审批中" ? "申请已提交" : "申请已撤回"}
            </p>
            <p className="mt-1 text-xs">{leave.id}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-5 text-sm">
          {[
            ["假期类型", leave.type],
            ["起止日期", `${leave.start} 至 ${leave.end}`],
            ["审批状态", leave.status],
            [
              "当前节点",
              leave.status === "审批中" ? "直属上级 · 李伟" : "已撤回",
            ],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-2">{v}</dd>
            </div>
          ))}
        </dl>
        {leave.status === "审批中" ? (
          <Button variant="outline" onClick={() => setConfirm(true)}>
            撤回申请
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() =>
              setLeave((l) => ({
                ...l,
                status: "草稿",
                id: `HR-LV-${Date.now().toString().slice(-6)}`,
              }))
            }
          >
            新建申请
          </Button>
        )}
        <Dialog open={confirm} onOpenChange={setConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>撤回这笔申请？</DialogTitle>
              <DialogDescription>
                对象：{leave.id}。撤回后将结束当前审批。
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="destructive"
              onClick={() => {
                setLeave((l) => ({ ...l, status: "已撤回" }));
                setConfirm(false);
              }}
            >
              确认撤回
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-muted px-2 py-1 text-xs text-primary">
          草稿 · 年假
        </span>
        <span className="text-xs text-muted-foreground">可用 7.5 天</span>
      </div>
      <div className={cn("grid gap-4", !compact && "grid-cols-2")}>
        <label className="grid gap-2 text-xs text-muted-foreground">
          开始日期
          <Input
            type="date"
            value={leave.start}
            onChange={(e) => field("start", e.target.value)}
          />
        </label>
        <label className="grid gap-2 text-xs text-muted-foreground">
          结束日期
          <Input
            type="date"
            value={leave.end}
            onChange={(e) => field("end", e.target.value)}
          />
        </label>
      </div>
      <label className="grid gap-2 text-xs text-muted-foreground">
        请假事由
        <Textarea
          value={leave.reason}
          onChange={(e) => field("reason", e.target.value)}
          placeholder="填写请假事由"
        />
      </label>
      <label className="grid gap-2 text-xs text-muted-foreground">
        工作交接人
        <Input
          value={leave.handover}
          onChange={(e) => field("handover", e.target.value)}
        />
      </label>
      <p className="text-xs leading-5 text-muted-foreground">
        预计时长按所选日期计算，审批时以排班与休假制度核定。审批人：李伟。
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button onClick={validate} className="w-full">
        检查并提交
        <ArrowRight className="size-4" />
      </Button>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认提交休假申请</DialogTitle>
            <DialogDescription>
              操作人：王乐山 · 提交后进入审批流程
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-2 gap-5 text-sm">
            {[
              ["对象", "本人年假申请"],
              ["动作", "提交并发起审批"],
              ["时间", `${leave.start} 至 ${leave.end}`],
              ["时长", `${days} 天`],
              ["影响范围", "本人假勤记录"],
              ["后果", "等待直属上级审批"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-2">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              返回修改
            </Button>
            <Button
              onClick={() => {
                setLeave((l) => ({ ...l, status: "审批中" }));
                setConfirm(false);
              }}
            >
              确认提交
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function HallPage() {
  const { role, setRole, favorites, setFavorites, setHomeExpert, setHomeAgentCategory, setHomeDraft, setHomeContext } = useHR();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [onlyFavorite, setOnlyFavorite] = useState(false);
  const list = services.filter(
    (s) =>
      s.role === role &&
      (category === "全部" || s.category === category) &&
      (!onlyFavorite || favorites.includes(s.id)) &&
      `${s.name}${s.description}`.includes(query),
  );
  const categories = [...new Set(list.map((s) => s.category))];
  return (
    <>
      <HeaderControls>
      <Tabs
        items={hallRoles}
        value={hallRoles[role]}
        onChange={(v) => {
          setRole(hallRoles.indexOf(v as (typeof hallRoles)[number]));
          setQuery("");
          setCategory("全部");
        }}
      />
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <Popover><PopoverTrigger render={<Button variant={query ? "secondary" : "ghost"} size="icon-sm" aria-label="搜索服务" title="搜索服务" />}><Search className="size-4" /></PopoverTrigger><PopoverContent align="end"><Input aria-label="搜索服务名称或办理事项" placeholder="搜索服务名称或办理事项" value={query} onChange={e=>setQuery(e.target.value)} /><Button variant="ghost" size="sm" disabled={!query} onClick={()=>setQuery("")}>清除搜索</Button></PopoverContent></Popover>
        <Button size="sm" variant={onlyFavorite ? "secondary" : "outline"} aria-label="常用服务" aria-pressed={onlyFavorite} title="常用服务" onClick={() => setOnlyFavorite(v=>!v)}><Star className={cn("size-3.5", onlyFavorite && "fill-current text-primary")} /><span className="max-[1000px]:hidden">常用服务</span></Button>
      </div>
      </HeaderControls>
      {hallCategories[role].length > 1 && <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="服务分类">
        {hallCategories[role].map(item => <Button key={item} size="sm" variant={category === item ? "secondary" : "ghost"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}
      </div>}
      {categories.map((cat) => (
        <section key={cat} className="mb-5">
          <h2 className="mb-2 text-sm font-medium">{cat}</h2>
          <div className="grid grid-cols-4 gap-3 max-[1100px]:grid-cols-3 max-[900px]:grid-cols-2">
            {list
              .filter((s) => s.category === cat)
              .map((s) => {
                const Icon = hrIcons[s.kind];
                return (
                  <div
                    key={s.id}
                    data-slot="service-card"
                    className="group relative rounded-xl border bg-card transition-colors hover:bg-accent"
                  >
                    <button
                      className="w-full min-w-0 px-3 py-2.5 text-left"
                      onClick={s.id === "compensation" ? () => window.open(`${window.location.pathname}#/compensation${window.location.search}`, "_blank", "noopener,noreferrer") : undefined}
                    >
                      <div className={cn("mb-1.5 flex size-7 items-center justify-center rounded-lg", serviceIconColors[cat] ?? "bg-primary/10 text-primary")}>
                        <Icon className="size-4" />
                      </div>
                      <h3 className="truncate text-sm font-medium group-hover:text-foreground" title={s.name}>
                        {s.name}
                      </h3>
                      <p className="mt-0.5 truncate pr-7 text-xs leading-5 text-muted-foreground" title={s.description}>
                        {s.description}
                      </p>
                    </button>
                    {s.agent && <div className="absolute right-2 top-2 flex h-7 min-w-14 items-center justify-end">
                      <Badge className="service-agent-badge h-4.5 px-1.5 text-[10px] group-hover:hidden group-focus-within:hidden">Agent</Badge>
                      <Button
                      size="sm" variant="default"
                      aria-label={`召唤${s.agent.expert}`}
                      className="pointer-events-none absolute right-0 h-7 min-w-14 bg-foreground px-2 text-xs text-background opacity-0 hover:bg-foreground/90 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                      onClick={() => {
                        setHomeExpert(s.agent!.expert);
                        setHomeAgentCategory(s.agent!.category);
                        setHomeDraft("");
                        setHomeContext([]);
                        window.dispatchEvent(new CustomEvent("hihr:compose"));
                      }}
                    >召唤</Button></div>}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={
                        favorites.includes(s.id)
                          ? `取消常用${s.name}`
                          : `添加常用${s.name}`
                      }
                      onClick={() =>
                        setFavorites((a) =>
                          a.includes(s.id)
                            ? a.filter((x) => x !== s.id)
                            : [...a, s.id],
                        )
                      }
                      className="absolute bottom-1.5 right-1.5 size-7"
                    >
                      <Star
                        className={cn(
                          "size-3.5 text-muted-foreground",
                          favorites.includes(s.id) &&
                            "fill-primary text-primary",
                        )}
                      />
                    </Button>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
      {!list.length && (
        <p className="py-20 text-center text-sm text-muted-foreground">
          没有找到服务，试试其他关键词或取消常用筛选。
        </p>
      )}
    </>
  );
}
export function TeamPage() {
  const { ask } = useHR();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("全部");
  const [detail, setDetail] = useState<string | null>(null);
  const list = teamMembers.filter(
    (m) => m.name.includes(q) && (status === "全部" || m.status === status),
  );
  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Metric label="团队人数" value="24" unit="人" detail="产品与体验组" />
        <Metric
          label="平均出勤率"
          value="97.2"
          unit="%"
          detail="2026 年 10 月"
        />
        <Metric
          label="待处理异常"
          value="2"
          unit="项"
          detail="1 项缺卡 · 1 项工时关注"
        />
      </div>
      <Section
        title="成员出勤"
        subtitle="点击成员查看出勤记录"
        action={
          <AskButton prompt="分析团队出勤并生成关注事项" label="AI 分析" />
        }
      >
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="搜索成员"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {["全部", "在岗", "请假", "缺卡"].map((s) => (
            <Button
              key={s}
              variant={status === s ? "secondary" : "ghost"}
              onClick={() => setStatus(s)}
            >
              {s}
            </Button>
          ))}
        </div>
        <Table className="w-full text-left text-sm">
          <TableHeader className="border-b text-xs text-muted-foreground">
            <TableRow>
              {["成员", "岗位", "状态", "出勤率", "加班"].map((h) => (
                <TableHead key={h} className="pb-3 font-normal">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((m) => (
              <TableRow
                key={m.name}
                className="cursor-pointer border-b last:border-0 hover:bg-muted"
                onClick={() => setDetail(m.name)}
              >
                <TableCell className="py-5 font-medium">{m.name}</TableCell>
                <TableCell className="text-muted-foreground">{m.job}</TableCell>
                <TableCell
                  className={
                    m.status === "缺卡"
                      ? "text-warning-foreground"
                      : "text-primary"
                  }
                >
                  {m.status}
                </TableCell>
                <TableCell>{m.rate}</TableCell>
                <TableCell>{m.hours}h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!list.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            没有匹配的成员。
          </p>
        )}
      </Section>
      <Dialog
        open={!!detail}
        onOpenChange={(v) => {
          if (!v) setDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail} · 出勤详情</DialogTitle>
            <DialogDescription>2026 年 10 月记录</DialogDescription>
          </DialogHeader>
          <p className="rounded-lg bg-muted p-4 text-sm leading-7">
            {detail === "周悦"
              ? "10 月 20 日缺少下班打卡，建议核对后提醒成员提交补卡。"
              : "当前期间出勤记录已汇总，可联系成员核对具体安排。"}
          </p>
          <Button
            onClick={() => {
              ask(`帮我分析${detail}的出勤记录，给出需要核对的事项`);
              setDetail(null);
            }}
          >
            <Sparkles className="size-4" />向 AI 查询这条记录
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ServicePage() {
  const { service, setRoute, ask, leave, tasks } = useHR();
  const [proofType, setProofType] = useState("在职证明");
  const [purpose, setPurpose] = useState("");
  const [proofDone, setProofDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  if (!service) return null;
  return (
    <>
      <Button
        variant="ghost"
        className="mb-6 -ml-3 text-muted-foreground"
        onClick={() => setRoute("hall")}
      >
        <ArrowLeft className="size-4" />
        服务大厅
      </Button>
      <PageTitle
        eyebrow={hallRoles[service.role]}
        title={service.name}
        description={service.description}
      ></PageTitle>
      {service.kind === "leave" ? (
        <div className="max-w-xl">
          <Section title="休假申请" subtitle="核对信息，确认后提交。">
            <LeaveForm />
          </Section>
        </div>
      ) : service.kind === "team" ? (
        <TeamPage />
      ) : service.kind === "proof" ? (
        <div className="max-w-xl">
          <Section
            title="申请证明"
            subtitle="选择证明类型并填写用途，提交后可跟进办理进度。"
          >
            {proofDone ? (
              <div className="space-y-5">
                <p className="flex items-center gap-2 text-primary">
                  <CheckCheck className="size-5" />
                  申请已受理
                </p>
                <p className="text-sm">
                  HR-CERT-001 · {proofType} · {purpose}
                </p>
                <p className="text-sm text-muted-foreground">
                  当前节点：共享服务中心审核
                </p>
                <Button
                  variant="outline"
                  onClick={() => ask("查询我的证明办理进度")}
                >
                  向 AI 查询进度
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex gap-2">
                  {["在职证明", "收入证明"].map((t) => (
                    <Button
                      key={t}
                      variant={t === proofType ? "secondary" : "outline"}
                      onClick={() => setProofType(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
                <label className="grid gap-2 text-sm">
                  证明用途
                  <Input
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="例如：贷款、签证、子女入学"
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  申请人：王乐山 · 领取方式：电子证明
                </p>
                {confirm && (
                  <p className="rounded-lg bg-muted p-4 text-sm">
                    确认以「{purpose}」为用途，提交本人{proofType}申请？
                  </p>
                )}
                <Button
                  disabled={!purpose.trim()}
                  onClick={() =>
                    confirm ? setProofDone(true) : setConfirm(true)
                  }
                >
                  {confirm ? "确认提交" : "检查申请"}
                </Button>
              </div>
            )}
          </Section>
        </div>
      ) : service.id === "approval" ? (
        <Section title="审批待办">
          <Tasks all />
        </Section>
      ) : service.id === "applications" ? (
        <Section title="我的申请" subtitle="查看申请状态与办理进度">
          <div className="flex justify-between border-b py-4 text-sm">
            <span>{leave.id} · 年假申请</span>
            <span className="text-primary">{leave.status}</span>
          </div>
          <div className="flex justify-between py-4 text-sm">
            <span>HR-HL-003 · 住房借款</span>
            <span className="text-warning-foreground">
              {tasks.find((t) => t.id === "T03")?.done
                ? "材料已补齐"
                : "待补材料"}
            </span>
          </div>
        </Section>
      ) : service.kind === "report" ? (
        <Section
          title="分析工作区"
          subtitle="选定范围后，由 AI 生成可核对的分析产物。"
        >
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm">
              组织范围
              <Input defaultValue="数字化转型办公室" />
            </label>
            <label className="grid gap-2 text-sm">
              统计期间
              <Input defaultValue="2026 年 10 月" />
            </label>
          </div>
          <Button
            className="mt-6"
            onClick={() =>
              ask(
                `生成${service.name}报告，范围：数字化转型办公室，期间：2026年10月`,
              )
            }
          >
            <Sparkles className="size-4" />
            生成分析报告
          </Button>
        </Section>
      ) : (
        <Section
          title={`${service.name}办理指引`}
          subtitle="查看办理指引与所需材料。"
        >
          <div className="mb-6 flex gap-3 rounded-lg bg-muted p-4 text-sm leading-7">
            <Info className="mt-1 size-4 shrink-0 text-muted-foreground" />
            <p>
              你可以先向 AskHR
              咨询办理条件、所需材料和流程。提单、核算与审批请按业务指引办理。
            </p>
          </div>
          <AskButton
            prompt={`我想办理${service.name}，请说明需要准备什么以及下一步流程`}
            label="咨询办理条件"
          />
        </Section>
      )}
    </>
  );
}
export function HRWorkspace({headerTarget}: {headerTarget: HTMLElement | null}) {
  const { route } = useHR();
  if (route === "compensation") return <CompensationApp />;
  return (
    <HeaderTarget.Provider value={headerTarget}><div className="mx-auto w-full max-w-[1240px] px-10 py-4 max-[1000px]:px-6">
      {route === "employee" ? (
        <EmployeePage />

      ) : route === "team" || route === "organization" ? (
        <PanoramaPageView key={route} kind={route} />
      ) : route === "hall" ? (
        <HallPage />
      ) : route === "tasks" ? (
        <>
          <Section title="任务列表">
            <Tasks all />
          </Section>
        </>
      ) : (
        <ServicePage />
      )}
    </div></HeaderTarget.Provider>
  );
}
