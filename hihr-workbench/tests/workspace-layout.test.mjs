import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorkspaceLayout, clampPanelWidth } from '../src/components/agent-layout/workspace-layout.ts';

test('方案中的默认三栏宽度分配', () => {
  for (const [width, chat, panel] of [[2560,800,1520],[1920,800,880],[1440,600,600],[1280,520,520],[1100,430,430],[980,420,320]]) {
    const layout = getWorkspaceLayout(width, true, true, false);
    assert.equal(layout.sidebarDocked, true);
    assert.equal(layout.chatWidth, chat);
    assert.equal(layout.panelWidth, panel);
  }
});

test('产物开关决定 980/660 两个导航断点', () => {
  for (const width of [660,739,740,979]) {
    assert.equal(getWorkspaceLayout(width, false, true, false).sidebarDocked, true);
    assert.equal(getWorkspaceLayout(width, true, true, false).sidebarDocked, false);
  }
  assert.equal(getWorkspaceLayout(659, false, true, false).sidebarDocked, false);
  assert.equal(getWorkspaceLayout(980, true, true, false).sidebarDocked, true);
});

test('740 分栏边界、窄屏全屏及无产物状态', () => {
  const edge = getWorkspaceLayout(740, true, true, false);
  assert.equal(edge.panelFullscreen, false);
  assert.equal(edge.chatWidth,420);
  assert.equal(edge.panelWidth,320);
  for (const width of [375,659,660,739]) {
    const layout = getWorkspaceLayout(width, true, true, false);
    assert.equal(layout.panelFullscreen,true);
    assert.equal(layout.chatWidth,width);
    assert.equal(layout.panelWidth,width);
  }
  assert.equal(getWorkspaceLayout(375,false,true,true).panelFullscreen,false);
});

test('缩小后放大不改变用户关闭导航或主动全屏的意图', () => {
  for (const width of [1280,700,375,1280]) {
    assert.equal(getWorkspaceLayout(width,true,false,true).sidebarDocked,false);
    assert.equal(getWorkspaceLayout(width,true,false,true).panelFullscreen,true);
  }
  assert.equal(getWorkspaceLayout(1280,true,true,false).sidebarDocked,true);
  assert.equal(getWorkspaceLayout(375,false,false,false).chatWidth,375);
});

test('拖拽限制保证对话 420 与产物 320 的下限', () => {
  assert.equal(clampPanelWidth(100,1280,true),320);
  assert.equal(clampPanelWidth(900,1280,true),620);
  assert.equal(clampPanelWidth(900,980,true),320);
  assert.equal(clampPanelWidth(900,740,false),320);
  assert.equal(clampPanelWidth(500,1280,true),500);
});


test('Copilot 侧边栏在 1280px 以下先收导航', () => {
  for (const width of [960, 1100, 1279]) {
    assert.equal(getWorkspaceLayout(width, false, true, false, true).sidebarDocked, false);
  }
  assert.equal(getWorkspaceLayout(1280, false, true, false, true).sidebarDocked, true);
  assert.equal(getWorkspaceLayout(1280, false, false, false, true).sidebarDocked, false);
  // 收起 Copilot 或切为浮动后，恢复原本的导航展开意图。
  assert.equal(getWorkspaceLayout(1024, false, true, false, false).sidebarDocked, true);
});
