import { hrExperts } from "@/features/hr/data";
import type { AppConfig } from "@/agent-ui/immersive/contracts";
import { renderProductBlock } from "./product-block-renderer";
export const appConfig = {
  identity: { name: "AskHR", avatar: "bot" },
  navigation: [
    { id: "new-conversation", label: "新对话 · 首页", visualKey: "newConversation" },
  ],
  experts: hrExperts,
  composerExpertOptions: hrExperts.map(expert => expert.label),
  composerExpertVisualKeys: Object.fromEntries(hrExperts.map(expert => [expert.label, expert.visualKey])),
  showConnectorSelect: false,
  renderProductBlock,
  welcome: {
    greeting: "把人资事务，交给 AskHR",
    expertIds: [],
    recommendations: [],
    expertRecommendations: {},
  },
} satisfies AppConfig;
