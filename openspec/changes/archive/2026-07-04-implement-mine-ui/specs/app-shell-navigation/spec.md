## MODIFIED Requirements

### Requirement: 收藏与我的为占位页
系统 SHALL 在 `pages/mine/index` 提供 Stitch 对齐的个人中心 UI 壳层（未登录/已登录双态）；`pages/favorites/index` MUST 提供 Stitch 对齐的收藏 UI 壳层（demo 列表或空状态），BottomNav 在两页均可见。

#### Scenario: 收藏页 UI 壳层
- **WHEN** 用户进入收藏 Tab
- **THEN** 页面 MUST 展示收藏页完整 UI（顶栏、搜索、Chips、列表或空状态），MUST NOT 仅显示「收藏功能开发中」纯文案占位

#### Scenario: 我的页 UI 壳层
- **WHEN** 用户进入我的 Tab
- **THEN** 页面 MUST 展示个人中心完整 UI（顶栏、Profile、统计、菜单、认证操作、等级进度），MUST NOT 仅显示「个人中心开发中」纯文案占位

#### Scenario: 我的页默认未登录
- **WHEN** 用户首次进入我的 Tab
- **THEN** 页面 MUST 默认展示未登录态 UI，BottomNav 可见且「我的」Tab 为选中态
