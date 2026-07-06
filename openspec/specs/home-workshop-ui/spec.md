## ADDED Requirements

### Requirement: 工作坊首页展示完整 UI 结构
系统 SHALL 在 `pages/classify/index` 渲染以下区块：HomeTopAppBar、今日推荐 Banner、全部工具 Bento 网格、分类 Chips 横向条、FAB 浮动按钮。

#### Scenario: 页面加载完整结构
- **WHEN** 用户打开工作坊 Tab（classify 页）
- **THEN** 页面 MUST 显示顶栏、Banner、工具网格、分类 Chips 与 FAB，背景色为 surface（#f7f9fc）

#### Scenario: 顶栏品牌展示
- **WHEN** 用户查看 HomeTopAppBar
- **THEN** 顶栏 MUST 显示产品名称「百宝口袋工坊」及 Logo 占位图

### Requirement: 工具卡片展示标题与副标题
系统 SHALL 从 `GET /api/tools` 获取工具列表，经 `iconKey` 映射为本地 SVG 后渲染 ToolCard。后端 `enabled=false` 的工具 MUST NOT 出现在列表中。

#### Scenario: 卡片信息完整
- **WHEN** 用户查看任意工具卡片
- **THEN** 卡片 MUST 显示 API 返回的 name、description 及对应 accent 底色图标区

#### Scenario: 点击卡片跳转工具
- **WHEN** 用户点击有效工具卡片
- **THEN** 系统 MUST 通过 `Taro.navigateTo` 跳转到该工具 `routePath`

#### Scenario: 隐藏工具不展示
- **WHEN** 后端工具 `enabled=false`（如随机数）
- **THEN** 该工具 MUST NOT 出现在网格中

### Requirement: 今日推荐 Banner 可交互
系统 SHALL 展示蓝色 primary-container 背景的推荐 Banner，含「今日推荐」标签、标题、描述及 CTA 按钮。

#### Scenario: Banner CTA 跳转
- **WHEN** 用户点击 Banner 上「立即查看」按钮
- **THEN** 系统 MUST 跳转到指尖轮盘页 `/pages/fingerUp/index`

### Requirement: 分类 Chips 为纯 UI 状态
系统 SHALL 从 `GET /api/categories` 加载分类列表，并在前端 prepend「全部」Chip；默认选中「全部」。用户切换 Chip 时 MUST 按 `category.code` 重新请求 `GET /api/tools` 筛选工具列表。

#### Scenario: 默认选中全部
- **WHEN** 用户首次进入工作坊页
- **THEN** 「全部」Chip MUST 以 primary 实心样式显示为选中态，工具列表 MUST 请求不带 category 参数

#### Scenario: 切换 Chip 筛选列表
- **WHEN** 用户点击「生活」或其他非全部 Chip
- **THEN** 该 Chip MUST 变为选中样式，工具网格 MUST 仅展示该分类下的 enabled 工具

### Requirement: 搜索框服务端过滤
系统 SHALL 提供搜索输入框，用户输入关键词后 MUST 以 `keyword` 参数请求 `GET /api/tools` 过滤结果。

#### Scenario: 搜索匹配标题
- **WHEN** 用户输入与某工具名称匹配的关键词
- **THEN** 列表 MUST 仅展示 API 返回的匹配工具

#### Scenario: 搜索无结果
- **WHEN** 用户输入无匹配结果的关键词
- **THEN** 工具网格 MUST 为空，MUST NOT 跳转

### Requirement: 工具列表按热度排序
系统 SHALL 默认以 `sort=heat` 请求工具列表，按 heatScore 降序展示。

#### Scenario: 默认热度排序
- **WHEN** 用户进入工作坊页且无自定义排序
- **THEN** 工具 MUST 按 heatScore 从高到低排列

### Requirement: 收藏状态来自 API
系统 SHALL 在已登录时从 `GET /api/tools` 响应的 `isFavorite` 字段驱动 ToolCard 收藏图标状态；toggle 时调用收藏 API（见 favorites-ui spec）。

#### Scenario: 已登录展示收藏态
- **WHEN** 用户已登录且某工具 `isFavorite=true`
- **THEN** ToolCard MUST 显示已收藏状态

### Requirement: API 失败降级
系统 SHALL 在 `GET /api/tools` 失败时 fallback 到本地 `classifyList` 并 toast 提示网络异常。

#### Scenario: 网络失败降级
- **WHEN** 工具列表 API 请求失败
- **THEN** 页面 MUST 展示本地 classifyList 数据并提示用户

### Requirement: 占位控件提供开发中反馈
系统 SHALL 对尚未实现的功能入口提供统一占位反馈。

#### Scenario: 搜索按钮占位
- **WHEN** 用户点击顶栏搜索图标
- **THEN** 系统 MUST 显示「更多功能正在开发中...」或等效 toast

#### Scenario: 终端按钮占位
- **WHEN** 用户点击顶栏终端图标
- **THEN** 系统 MUST 显示开发中 toast

#### Scenario: 管理链接占位
- **WHEN** 用户点击「管理」文字
- **THEN** 系统 MUST 显示开发中 toast

#### Scenario: FAB 占位
- **WHEN** 用户点击右下角 FAB「+」按钮
- **THEN** 系统 MUST 显示开发中 toast

### Requirement: 卡片按压反馈
系统 SHALL 为 ToolCard 提供 `:active` 缩放反馈（scale 0.96），不使用 hover 交互。

#### Scenario: 按压视觉反馈
- **WHEN** 用户按住工具卡片
- **THEN** 卡片 MUST 视觉上缩小至约 96% 尺度
