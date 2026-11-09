import { createContext, useContext } from "react"

/**
 * 独立面板内的浮层挂载点。面板内容里的对话框传入 `container={usePanelPortal()}`，
 * 遮罩与对话框只覆盖面板区域，不盖住整个应用。面板外使用时为 null。
 */
export const PanelPortalContext = createContext<HTMLElement | null>(null)
export const usePanelPortal = () => useContext(PanelPortalContext)
