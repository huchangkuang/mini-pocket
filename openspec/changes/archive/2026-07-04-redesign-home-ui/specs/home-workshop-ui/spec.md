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

系统 SHALL 在 Bento 网格每个 ToolCard 中显示工具名称、副标题描述、accent 色图标底及现有 SVG 图标。

#### Scenario: 卡片信息完整
- **WHEN** 用户查看任意工具卡片
- **THEN** 卡片 MUST 显示标题（如「手持弹幕」）、副标题（如「应援与表达神器」）及对应 accent 底色图标区

#### Scenario: 点击卡片跳转工具
- **WHEN** 用户点击有效工具卡片
- **THEN** 系统 MUST 通过 `Taro.navigateTo` 跳转到该工具对应路径，行为与改造前一致

#### Scenario: 隐藏工具不展示
- **WHEN** 工具路径在 `excludeClassifyList` 中
- **THEN** 该工具 MUST NOT 出现在网格中

### Requirement: 今日推荐 Banner 可交互

系统 SHALL 展示蓝色 primary-container 背景的推荐 Banner，含「今日推荐」标签、标题、描述及 CTA 按钮。

#### Scenario: Banner CTA 跳转
- **WHEN** 用户点击 Banner 上「立即查看」按钮
- **THEN** 系统 MUST 跳转到指尖轮盘页 `/pages/fingerUp/index`

### Requirement: 分类 Chips 为纯 UI 状态

系统 SHALL 展示横向可滚动的分类 Chips（全部、生活、娱乐、效率、开发），默认选中「全部」，点击切换选中样式但不过滤工具列表。

#### Scenario: 默认选中全部
- **WHEN** 用户首次进入工作坊页
- **THEN** 「全部」Chip MUST 以 primary 实心样式显示为选中态

#### Scenario: 切换 Chip 不过滤
- **WHEN** 用户点击「生活」或其他非全部 Chip
- **THEN** 该 Chip MUST 变为选中样式，但工具网格 MUST 仍展示全部可见工具（不过滤）

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
