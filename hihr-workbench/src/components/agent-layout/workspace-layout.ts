export const SIDEBAR_WIDTH = 240;
export const DRAWER_WIDTH = 320;
export const CHAT_MIN_WIDTH = 420;
export const PANEL_MIN_WIDTH = 320;
export const COPILOT_SIDEBAR_BREAKPOINT = 1280;

export function clampPanelWidth(requested: number, shellWidth: number, sidebarDocked: boolean) {
  const maximum = Math.max(PANEL_MIN_WIDTH, shellWidth - (sidebarDocked ? SIDEBAR_WIDTH : 0) - CHAT_MIN_WIDTH);
  return Math.min(maximum, Math.max(PANEL_MIN_WIDTH, requested));
}

export function getWorkspaceLayout(width: number, panelOpen: boolean, sidebarWantedOpen: boolean, fullscreenWanted: boolean, copilotSidebarOpen = false) {
  const sidebarCanDock = width >= (copilotSidebarOpen ? COPILOT_SIDEBAR_BREAKPOINT : panelOpen ? 980 : 660);
  const sidebarDocked = sidebarWantedOpen && sidebarCanDock;
  const panelFullscreen = panelOpen && (width < 740 || fullscreenWanted);
  const workspaceWidth = width - (sidebarDocked ? SIDEBAR_WIDTH : 0);
  const chatWidth = panelOpen && !panelFullscreen ? Math.min(800, Math.max(CHAT_MIN_WIDTH, workspaceWidth / 2)) : workspaceWidth;
  return { sidebarCanDock, sidebarDocked, panelFullscreen, chatWidth, panelWidth: panelOpen && !panelFullscreen ? workspaceWidth - chatWidth : panelOpen ? width : 0 };
}
