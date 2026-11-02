import { ImmersiveAgentApp } from "@/agent-ui/immersive/agent-app";
import { appConfig } from "@/components/agent-layout/app-config";
import { createDraftScene } from "@/components/agent-layout/conversation-data";
import { scenes } from "@/components/agent-layout/scenes";
import { HRProvider } from "@/features/hr/store";
const pinned = [{ id: "policy", title: "年假政策与可用余额" }];
const recent = [
  { id: "income", title: "9 月工资变化分析" },
  { id: "team", title: "产品与体验组出勤分析" },
];
export default function App() {
  return (
    <HRProvider>
      <ImmersiveAgentApp
        config={appConfig}
        scenes={scenes}
        initialPinnedConversations={pinned}
        initialConversations={recent}
        createDraftScene={(content, expert, attachments) => ({
          id: `draft-${Date.now()}`,
          ...createDraftScene(content, expert, attachments),
        })}
      />
    </HRProvider>
  );
}
