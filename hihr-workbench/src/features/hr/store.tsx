import { businessContexts, type BusinessIntent } from "./business-intent";
import {initialProjects, type Project} from "@/features/compensation/data";
import { useState, type ReactNode } from "react";
import { Context } from "./context";
import { initialTasks, person, employeeExperts, type Route, type Service } from "./data";
export type Leave = {
  type: string;
  start: string;
  end: string;
  reason: string;
  handover: string;
  status: "草稿" | "审批中" | "已撤回";
  id: string;
};
const initialLeave: Leave = {
  type: "年假",
  start: "2026-10-30",
  end: "2026-10-30",
  reason: "个人事务",
  handover: "李明",
  status: "草稿",
  id: "HR-LV-001",
};
// 静态托管没有 SPA fallback，除根目录外没有真实文件路径，
// 因此视图直达统一走 hash（/#/compensation），同时兼容 pathname 与 ?page= 形式。
const DEEP_LINK_SEGMENT = "compensation";
function readInitialRoute(): Route {
  if (typeof window === "undefined") return "home";
  const { pathname, hash, search } = window.location;
  const firstSegment = (raw: string) =>
    raw.replace(/^#/, "").replace(/^\/+/, "").split(/[/?#]/)[0];
  if (firstSegment(pathname) === DEEP_LINK_SEGMENT || firstSegment(hash) === DEEP_LINK_SEGMENT) {
    return DEEP_LINK_SEGMENT;
  }
  return new URLSearchParams(search).get("page") === DEEP_LINK_SEGMENT ? DEEP_LINK_SEGMENT : "home";
}
function syncRouteToUrl(next: Route) {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  const target = next === DEEP_LINK_SEGMENT ? `#/${DEEP_LINK_SEGMENT}` : "";
  window.history.replaceState(null, "", `${pathname}${search}${target}`);
}
function useStore() {
  const [salaryProjects, setSalaryProjects] = useState<Project[]>(initialProjects);
  const [salaryLaunch, setSalaryLaunch] = useState<string | null>(null);
  const [salaryActive, setSalaryActive] = useState<string | null>(null);
  const [route, setRouteState] = useState<Route>(readInitialRoute);
  const setRoute = (next: Route) => {
    setRouteState(next);
    syncRouteToUrl(next);
  };
  const [employeeTab, setEmployeeTab] = useState("个人信息");
  const [teamTab, setTeamTab] = useState("recruit");
  const [organizationTab, setOrganizationTab] = useState("recruit");
  const [role, setRole] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [homeDraft, setHomeDraft] = useState("");
  const [homeAgentCategory, setHomeAgentCategory] = useState<string | null>(null);
  const [homeExpert, setHomeExpert] = useState<string | null>(null);
  const [homeContext, setHomeContext] = useState<import("@/components/agent-layout/composer").ContextItem[]>([]);
  const [copilotDraft, setCopilotDraft] = useState("");
  const [copilotExpert, setCopilotExpert] = useState<string | null>(null);
  const [copilotContext, setCopilotContext] = useState<import("@/components/agent-layout/composer").ContextItem[]>([]);
  const [sessionContexts, setSessionContexts] = useState<Record<string, import("@/components/agent-layout/composer").ContextItem[]>>({});
  const [sessionDrafts, setSessionDrafts] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState(initialTasks);
  const [leave, setLeave] = useState<Leave>(initialLeave);
  const [favorites, setFavorites] = useState(["leave", "proof", "team"]);
  const [onboardingDone, setOnboardingDone] = useState([0, 1]);
  const [archived, setArchived] = useState<string[]>([]);
  const [sessions, setSessions] = useState<
    Record<string, import("@/agent-ui/immersive/contracts").ConversationScene[]>
  >({});
  return {
    salaryProjects, setSalaryProjects, salaryActive, setSalaryActive, salaryLaunch, setSalaryLaunch,
    route,
    setRoute,
    employeeTab,
    setEmployeeTab,
    teamTab, setTeamTab, organizationTab, setOrganizationTab,
    role,
    setRole,
    service,
    setService,
    homeAgentCategory, setHomeAgentCategory,
    homeExpert,
    setHomeExpert,
    homeContext,
    setHomeContext,
    copilotDraft, setCopilotDraft, copilotExpert, setCopilotExpert,
    copilotContext, setCopilotContext, sessionDrafts, setSessionDrafts, sessionContexts, setSessionContexts,
    composeBusiness: (intent: BusinessIntent) => {
      setCopilotDraft(intent.prompt);
      setCopilotExpert(intent.expert);
      setCopilotContext(businessContexts(intent));
      window.dispatchEvent(new CustomEvent("hihr:employee-compose"));
    },
    composeEmployee: (prompt: string, skill: string) => {
      setCopilotDraft(prompt);
      setCopilotExpert(employeeExperts[employeeTab] ?? null);
      setCopilotContext([
        {id: "employee-skill", type: "技能", label: skill},
        {id: "employee-source", type: "文件库", label: `${person.name} · ${employeeTab}`},
      ]);
      window.dispatchEvent(new CustomEvent("hihr:employee-compose"));
    },
    homeDraft,
    setHomeDraft,
    tasks,
    setTasks,
    leave,
    setLeave,
    favorites,
    setFavorites,
    onboardingDone,
    setOnboardingDone,
    sessions,
    setSessions,
    archived,
    setArchived,
    ask: (text: string) => {
      setRoute("home");
      window.dispatchEvent(new CustomEvent("hihr:ask", { detail: text }));
    },
    openService: (value: Service) => {
      setService(value);
      setRoute("service");
    },
    completeTask: (id: string) =>
      setTasks((items) =>
        items.map((t) => (t.id === id ? { ...t, done: true } : t)),
      ),
    submitLeave: () =>
      setLeave((l) => (l.status === "草稿" ? { ...l, status: "审批中" } : l)),
  };
}
export type Store = ReturnType<typeof useStore>;
export function HRProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
