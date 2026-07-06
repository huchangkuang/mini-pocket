## ADDED Requirements

### Requirement: 底部 Tab 导航三入口
系统 SHALL 提供自定义 BottomNav 组件，包含三个 Tab：工作坊、收藏、我的，当前 Tab MUST 以 primary 色高亮并带浅底圆角选中态。

#### Scenario: 工作坊 Tab 默认激活
- **WHEN** 用户位于 classify 页
- **THEN** BottomNav 中「工作坊」MUST 显示为选中态

#### Scenario: 切换到收藏 Tab
- **WHEN** 用户点击「收藏」Tab
- **THEN** 系统 MUST 导航至收藏页并高亮「收藏」Tab

#### Scenario: 切换到我的 Tab
- **WHEN** 用户点击「我的」Tab
- **THEN** 系统 MUST 导航至我的页并高亮「我的」Tab

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

### Requirement: BottomNav 仅在 Tab 页显示
系统 SHALL 仅在三个 Tab 页（classify、favorites、mine）渲染 BottomNav，工具子页面 MUST NOT 显示 BottomNav。

#### Scenario: 进入工具子页
- **WHEN** 用户从工作坊点击某工具进入子页面
- **THEN** 子页面 MUST NOT 显示 BottomNav，并使用现有返回导航

#### Scenario: 从子页返回
- **WHEN** 用户从工具子页返回
- **THEN** 系统 MUST 回到工作坊 Tab 页并恢复 BottomNav 显示

### Requirement: 安全区域适配
系统 SHALL 为 BottomNav 与 FAB 预留底部 safe-area 间距，避免与系统手势条重叠。

#### Scenario: iPhone 底部安全区
- **WHEN** 设备存在 home indicator 安全区
- **THEN** BottomNav MUST 通过 `env(safe-area-inset-bottom)` 或等效方案增加底部内边距

### Requirement: 反馈与关于二级页注册
系统 SHALL 在 `app.config.ts` 的 pages 数组中注册 `pages/feedback/index` 与 `pages/about/index`。

#### Scenario: 导航至反馈页
- **WHEN** 应用已编译且用户触发反馈页路由
- **THEN** Taro MUST 能成功加载 `pages/feedback/index`，MUST NOT 报 page not found

#### Scenario: 导航至关于页
- **WHEN** 应用已编译且用户触发关于页路由
- **THEN** Taro MUST 能成功加载 `pages/about/index`，MUST NOT 报 page not found

#### Scenario: 二级页无 BottomNav
- **WHEN** 用户位于反馈页或关于页
- **THEN** 页面 MUST NOT 显示 BottomNav，MUST 使用原生返回或 navigateBack
