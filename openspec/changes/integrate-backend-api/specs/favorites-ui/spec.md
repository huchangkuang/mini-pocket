## MODIFIED Requirements

### Requirement: Demo 收藏数据使用现有工具
系统 SHALL 在已登录态从 `GET /api/favorites` 加载收藏列表，字段经 mapper 转为 FavoriteItem（含 icon、text、desc、path、accent、tag、favoriteCategory）。MUST NOT 再使用 demo 硬编码收藏作为已登录数据源。

#### Scenario: 已登录列表展示 API 数据
- **WHEN** 用户已登录且进入收藏 Tab
- **THEN** 列表 MUST 展示 `/api/favorites` 返回的工具，MUST NOT 使用 demoFavorites

#### Scenario: 点击卡片跳转工具
- **WHEN** 用户点击有效 FavoriteCard
- **THEN** 系统 MUST 通过 `Taro.navigateTo` 跳转到该工具对应 routePath

### Requirement: 搜索框本地过滤收藏列表
系统 SHALL 在已登录态以 `keyword` 参数请求 `GET /api/favorites` 或在客户端对 API 返回列表过滤（与后端 QueryFavoritesDto 对齐）。未登录态搜索框 MAY 隐藏或禁用。

#### Scenario: 搜索匹配标题
- **WHEN** 已登录用户输入与某收藏工具标题匹配的关键词
- **THEN** 列表 MUST 仅展示匹配的 FavoriteCard

#### Scenario: 搜索无结果
- **WHEN** 已登录用户输入不存在于收藏列表的关键词
- **THEN** 列表区域 MUST 为空或展示无匹配提示

### Requirement: 收藏筛选 Chips 本地过滤
系统 SHALL 在已登录态支持按 favoriteCategory 筛选；筛选 MAY 通过 `GET /api/favorites?category=` 或客户端过滤实现。

#### Scenario: 默认选中全部
- **WHEN** 已登录用户首次进入收藏页
- **THEN** 「全部」Chip MUST 为 primary 选中态，列表展示全部收藏

#### Scenario: 切换效率办公筛选
- **WHEN** 已登录用户点击「效率办公」Chip
- **THEN** 列表 MUST 仅展示 favoriteCategory 为 efficiency 的收藏项

### Requirement: 取消收藏与空状态切换
系统 SHALL 在已登录态通过 `DELETE /api/favorites/:toolId` 或 `POST /api/favorites/toggle` 取消收藏；成功后从列表移除。列表为空时展示空状态。

#### Scenario: 取消单项收藏
- **WHEN** 已登录用户点击某 FavoriteCard 的爱心图标
- **THEN** 系统 MUST 调用收藏 API 取消收藏，成功后该项 MUST 从列表移除

#### Scenario: 全部取消后展示空状态
- **WHEN** 已登录用户移除最后一项收藏
- **THEN** 页面 MUST 切换为空状态视图

## ADDED Requirements

### Requirement: 未登录收藏页引导登录
系统 SHALL 在未登录态展示空状态，CTA 引导用户前往登录（跳转 mine 页或触发登录流程）。

#### Scenario: 未登录空状态
- **WHEN** 用户未登录且进入收藏 Tab
- **THEN** 页面 MUST 展示空状态或登录引导，MUST NOT 展示 demo 收藏列表

### Requirement: 工坊页收藏需登录
系统 SHALL 在未登录用户于工坊页点击收藏时弹出登录确认，确认后引导至登录流程；MUST NOT 写入本地 Storage 收藏。

#### Scenario: 未登录点击收藏
- **WHEN** 未登录用户点击 ToolCard 收藏按钮
- **THEN** 系统 MUST 提示需登录，MUST NOT 静默本地收藏

#### Scenario: 已登录 toggle 收藏
- **WHEN** 已登录用户点击 ToolCard 收藏按钮
- **THEN** 系统 MUST 调用 `POST /api/favorites/toggle` 并更新 UI 状态
