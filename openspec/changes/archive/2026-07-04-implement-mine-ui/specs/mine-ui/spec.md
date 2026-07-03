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
系统 SHALL 在已登录态使用设计稿 demo 数据：昵称「口袋达人」、加入日期「2023年10月12日」、徽章「高级工匠」、统计 42/156/28、等级进度 850/1000 XP。

#### Scenario: 已登录资料展示
- **WHEN** 用户处于已登录 demo 状态
- **THEN** Profile Header MUST 显示上述昵称、加入日期与徽章文案

#### Scenario: 已登录统计数值
- **WHEN** 用户处于已登录 demo 状态
- **THEN** StatsGrid MUST 分别展示 42（已用工具）、156（活跃天数）、28（收藏），且数值颜色分别为 primary、secondary、tertiary

### Requirement: 未登录态统计与文案
系统 SHALL 在未登录态展示统计占位：--（已用工具）、0（活跃天数）、--（收藏工具），以及「点击登录/注册」与同步配置描述文案。

#### Scenario: 未登录统计占位
- **WHEN** 用户处于未登录状态
- **THEN** StatsGrid MUST 展示 --、0、--  respectively

#### Scenario: 未登录 CTA 文案
- **WHEN** 用户处于未登录状态
- **THEN** Profile Header MUST 显示「点击登录/注册」及「登录百宝口袋工坊，同步您的工具配置与收藏」描述

### Requirement: 本地登录态切换
系统 SHALL 使用本地 `isLoggedIn` state 驱动未登录/已登录 UI 切换，默认值为 false（未登录）。

#### Scenario: 立即登录切换
- **WHEN** 用户点击「立即登录」或「点击登录/注册」
- **THEN** 页面 MUST 切换为已登录 demo UI

#### Scenario: 退出登录切换
- **WHEN** 用户点击「退出登录」
- **THEN** 页面 MUST 切换回未登录 UI

#### Scenario: Profile Header toggle
- **WHEN** 用户点击 Profile Header 区域
- **THEN** 系统 MUST 在已登录与未登录 UI 之间 toggle 切换

### Requirement: 菜单列表四项占位
系统 SHALL 展示菜单：使用历史、问题反馈（未登录）或意见反馈（已登录）、系统设置、关于工坊，每项带图标与 chevron。

#### Scenario: 菜单项展示
- **WHEN** 用户查看个人中心菜单
- **THEN** 页面 MUST 展示上述四项菜单行

#### Scenario: 菜单点击占位
- **WHEN** 用户点击任一菜单项
- **THEN** 系统 MUST 显示「更多功能正在开发中...」或等效 toast，MUST NOT 跳转

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
