## ADDED Requirements

### Requirement: 个人中心展示 Stitch 对齐的完整 UI 结构
系统 SHALL 在 `pages/mine/index` 渲染：MineTopBar、Profile Header（未登录或已登录）、StatsGrid、MineMenuList、MineAuthActions、LevelProgress、BottomNav。

#### Scenario: 默认未登录态结构
- **WHEN** 用户首次进入我的 Tab
- **THEN** 页面 MUST 显示未登录 Profile Header、guest 统计、菜单、立即登录按钮与 guest 等级进度卡，背景色为 surface（#f7f9fc）

#### Scenario: 已登录态结构
- **WHEN** 用户处于已登录 demo 状态
- **THEN** 页面 MUST 显示已登录 Profile Header、loggedIn 统计、菜单、切换账号与退出登录按钮、loggedIn 等级进度卡

#### Scenario: 顶栏标题与操作区
- **WHEN** 用户查看个人中心顶栏
- **THEN** 顶栏 MUST 显示左侧终端占位图标、标题「个人中心」、右侧通知占位按钮（未登录与已登录一致）

### Requirement: Demo 用户数据对齐设计稿
系统 SHALL 在已登录态使用 `GET /api/auth/me` 返回的用户资料：nickname、avatarUrl、joinDate；收藏数使用 `stats.favoriteCount`。等级进度、活跃天数、已用工具数从 API 返回的 stats 与 level 展示。

#### Scenario: 已登录资料展示
- **WHEN** 用户已登录且 API 返回用户资料
- **THEN** Profile Header MUST 显示 API 返回的 nickname、joinDate；avatarUrl 有值时 MUST 展示头像

#### Scenario: 已登录统计数值
- **WHEN** 用户已登录且 API 返回 stats
- **THEN** StatsGrid MUST 展示 API 返回的已用工具、活跃天数与收藏数

### Requirement: 未登录态统计与文案
系统 SHALL 在未登录态展示统计占位：--（已用工具）、0（活跃天数）、--（收藏工具），以及「点击登录/注册」与同步配置描述文案。

#### Scenario: 未登录统计占位
- **WHEN** 用户处于未登录状态
- **THEN** StatsGrid MUST 展示 --、0、--  respectively

#### Scenario: 未登录 CTA 文案
- **WHEN** 用户处于未登录状态
- **THEN** Profile Header MUST 显示「点击登录/注册」及「登录百宝口袋工坊，同步您的工具配置与收藏」描述

### Requirement: 本地登录态切换
系统 SHALL 使用真实微信登录替代 demo `isLoggedIn` toggle。登录：`Taro.login()` 获取 code → `POST /api/auth/wechat/login` → 存储 token 与用户信息。退出：清除 token 与本地用户态。

#### Scenario: 立即登录
- **WHEN** 用户点击「立即登录」或「点击登录/注册」
- **THEN** 系统 MUST 调用微信 login 与后端 auth API，成功后切换为已登录 UI

#### Scenario: 退出登录
- **WHEN** 用户点击「退出登录」
- **THEN** 系统 MUST 清除 token 与用户信息，切换回未登录 UI

#### Scenario: Profile Header toggle
- **WHEN** 用户点击 Profile Header 区域（若仍保留 debug toggle）
- **THEN** 该行为 MAY 移除或仅用于开发调试，生产 MUST NOT 无登录切换 demo 态

### Requirement: 应用启动恢复登录态
系统 SHALL 在 `app.ts` 启动时若本地存在 token，调用 `GET /api/auth/me` 校验；成功则恢复已登录态，401 则清除 token。

#### Scenario: 有效 token 恢复
- **WHEN** 应用启动且本地 token 有效
- **THEN** 全局 auth 状态 MUST 为已登录，各页可读取用户信息

#### Scenario: 无效 token 清除
- **WHEN** 应用启动且 token 校验返回 401
- **THEN** 系统 MUST 清除 token 并保持未登录态

### Requirement: 登录失败用户反馈
系统 SHALL 在微信 login 或后端 auth 失败时 toast 提示，MUST NOT 切换为已登录 UI。

#### Scenario: 微信 login 失败
- **WHEN** `Taro.login` 失败
- **THEN** 系统 MUST toast 提示登录失败

#### Scenario: 后端 auth 失败
- **WHEN** `POST /api/auth/wechat/login` 返回错误
- **THEN** 系统 MUST toast 展示错误信息并保持未登录态

### Requirement: 菜单列表两项可跳转
系统 SHALL 展示菜单：问题反馈（未登录）或意见反馈（已登录）、关于工坊，每项带图标与 chevron。系统设置 MUST NOT 出现在菜单中。

#### Scenario: 菜单项展示
- **WHEN** 用户查看个人中心菜单
- **THEN** 页面 MUST 展示上述两项菜单行，MUST NOT 展示系统设置

#### Scenario: 未登录点击反馈
- **WHEN** 未登录用户点击「问题反馈」
- **THEN** 系统 MUST 弹出登录引导（showModal 或等效），用户确认后 MUST 触发登录流程；登录成功后 MUST 导航至意见反馈页

#### Scenario: 已登录点击反馈
- **WHEN** 已登录用户点击「意见反馈」
- **THEN** 系统 MUST 直接 `navigateTo` 意见反馈页

#### Scenario: 点击关于工坊
- **WHEN** 用户点击「关于工坊」
- **THEN** 系统 MUST `navigateTo` 关于工坊页，MUST NOT 显示占位 toast

### Requirement: 等级进度卡双态
系统 SHALL 在未登录态展示 WORKSHOP LEVEL 进度卡（0/1000 XP，约 2% 进度，提示「登录后开启工坊大师之路」）；在已登录态展示「当前等级进度」（850/1000 XP，约 85% 进度，晋升提示文案）。

#### Scenario: 未登录等级卡
- **WHEN** 用户处于未登录状态
- **THEN** LevelProgress MUST 显示 0/1000 XP 与登录后开启提示

#### Scenario: 已登录等级卡
- **WHEN** 用户处于已登录 demo 状态
- **THEN** LevelProgress MUST 显示 850/1000 XP 与晋升「工坊大师」提示

### Requirement: 占位控件提供开发中反馈
系统 SHALL 对尚未实现的功能入口提供 toast 占位反馈。

#### Scenario: 终端按钮占位
- **WHEN** 用户点击顶栏终端图标
- **THEN** 系统 MUST 显示开发中 toast

#### Scenario: 通知按钮占位
- **WHEN** 用户点击顶栏通知图标
- **THEN** 系统 MUST 显示开发中 toast

#### Scenario: 编辑与切换账号占位
- **WHEN** 用户点击编辑资料或切换账号
- **THEN** 系统 MUST 显示开发中 toast

### Requirement: 交互按压反馈
系统 SHALL 为可点击卡片、菜单行与按钮提供 `:active` 缩放反馈（scale 约 0.98）。

#### Scenario: 菜单行按压反馈
- **WHEN** 用户按住菜单行
- **THEN** 该行 MUST 视觉上缩小或呈现按压态
