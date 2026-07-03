## MODIFIED Requirements

### Requirement: 收藏与我的为占位页
系统 SHALL 在 `pages/mine/index` 提供占位页展示空状态文案；`pages/favorites/index` MUST 提供 Stitch 对齐的收藏 UI 壳层（demo 列表或空状态），BottomNav 在两页均可见。

#### Scenario: 收藏页 UI 壳层
- **WHEN** 用户进入收藏 Tab
- **THEN** 页面 MUST 展示收藏页完整 UI（顶栏、搜索、Chips、列表或空状态），MUST NOT 仅显示「收藏功能开发中」纯文案占位

#### Scenario: 我的页空状态
- **WHEN** 用户进入我的 Tab
- **THEN** 页面 MUST 显示空状态提示（如「个人中心开发中」），BottomNav 可见
