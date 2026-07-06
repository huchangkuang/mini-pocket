## MODIFIED Requirements

### Requirement: Demo 用户数据对齐设计稿
系统 SHALL 在已登录态使用 `GET /api/auth/me` 返回的用户资料：nickname、avatarUrl、joinDate；收藏数使用 `stats.favoriteCount`。等级进度、活跃天数、已用工具数 MAY 保留 demo 占位直至后端扩展。

#### Scenario: 已登录资料展示
- **WHEN** 用户已登录且 API 返回用户资料
- **THEN** Profile Header MUST 显示 API 返回的 nickname、joinDate；avatarUrl 有值时 MUST 展示头像

#### Scenario: 已登录统计数值
- **WHEN** 用户已登录且 API 返回 stats
- **THEN** StatsGrid 收藏项 MUST 展示 `stats.favoriteCount`；已用工具与活跃天数 MAY 保留占位

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

## ADDED Requirements

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
