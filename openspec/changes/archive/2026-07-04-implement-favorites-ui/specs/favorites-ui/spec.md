## ADDED Requirements

### Requirement: 收藏页展示 Stitch 对齐的完整 UI 结构
系统 SHALL 在 `pages/favorites/index` 渲染：FavoritesTopBar、搜索框、收藏筛选 Chips、收藏卡片列表或空状态、BottomNav。

#### Scenario: 有收藏时展示列表结构
- **WHEN** 用户进入收藏 Tab 且 demo 收藏列表非空
- **THEN** 页面 MUST 显示顶栏、搜索框、筛选 Chips 与横向 FavoriteCard 列表，背景色为 surface（#f7f9fc）

#### Scenario: 顶栏标题与操作区
- **WHEN** 用户查看收藏页顶栏
- **THEN** 顶栏 MUST 显示左侧终端占位图标、居中标题「收藏」、右侧筛选占位按钮

### Requirement: Demo 收藏数据使用现有工具
系统 SHALL 使用来自 `classifyList` 的现有工具作为首版 demo 收藏数据源，字段包含 icon、text、desc、path、accent，并扩展 favoriteCategory 与 tag。

#### Scenario: Demo 列表展示真实工具
- **WHEN** 收藏页加载 demo 数据
- **THEN** 列表 MUST 展示现有工具（如二维码生成、指尖轮盘、做个决定吧），MUST NOT 使用项目中不存在的虚构工具名

#### Scenario: 点击卡片跳转工具
- **WHEN** 用户点击有效 FavoriteCard
- **THEN** 系统 MUST 通过 `Taro.navigateTo` 跳转到该工具对应 path

### Requirement: 搜索框本地过滤收藏列表
系统 SHALL 提供搜索输入框，placeholder 为「搜索我的收藏工具...」，对当前收藏列表按标题与描述做本地过滤。

#### Scenario: 搜索匹配标题
- **WHEN** 用户输入与某收藏工具标题匹配的关键词
- **THEN** 列表 MUST 仅展示匹配的 FavoriteCard

#### Scenario: 搜索无结果
- **WHEN** 用户输入不存在于当前列表的关键词
- **THEN** 列表区域 MUST 为空或展示无匹配提示，MUST NOT 跳转

### Requirement: 收藏筛选 Chips 本地过滤
系统 SHALL 展示横向 Chips：全部、开发工具、效率办公、趣味生成，点击切换选中态并按 favoriteCategory 过滤 demo 列表。

#### Scenario: 默认选中全部
- **WHEN** 用户首次进入收藏页
- **THEN** 「全部」Chip MUST 为 primary 选中态，列表展示全部 demo 收藏

#### Scenario: 切换效率办公筛选
- **WHEN** 用户点击「效率办公」Chip
- **THEN** 列表 MUST 仅展示 favoriteCategory 为 efficiency 的收藏项

### Requirement: 取消收藏与空状态切换
系统 SHALL 支持点击 FavoriteCard 右上角爱心从列表移除该项；当列表为空时展示 Stitch 空状态。

#### Scenario: 取消单项收藏
- **WHEN** 用户点击某 FavoriteCard 的爱心图标
- **THEN** 该项 MUST 从当前列表移除

#### Scenario: 全部取消后展示空状态
- **WHEN** 用户移除最后一项收藏
- **THEN** 页面 MUST 切换为空状态视图，MUST NOT 继续展示列表容器

### Requirement: 空状态内容与去发现 CTA
系统 SHALL 在收藏列表为空时展示 Stitch 空状态：心形放大镜插图、标题「还没有收藏的工具」、描述「去工作坊逛逛，发现让你心动的百宝工具吧！」、CTA 按钮「去发现」。

#### Scenario: 空状态文案
- **WHEN** 收藏列表为空
- **THEN** 页面 MUST 显示上述标题与描述文案

#### Scenario: 去发现跳转工作坊
- **WHEN** 用户点击「去发现」按钮
- **THEN** 系统 MUST 导航至工作坊页 `/pages/classify/index`

### Requirement: 占位控件提供开发中反馈
系统 SHALL 对尚未实现的功能入口提供 toast 占位反馈。

#### Scenario: 终端按钮占位
- **WHEN** 用户点击顶栏终端图标
- **THEN** 系统 MUST 显示「更多功能正在开发中...」或等效 toast

#### Scenario: 筛选按钮占位
- **WHEN** 用户点击顶栏筛选 tune 图标
- **THEN** 系统 MUST 显示开发中 toast

### Requirement: FavoriteCard 按压反馈
系统 SHALL 为 FavoriteCard 提供 `:active` 缩放反馈（scale 0.96）。

#### Scenario: 按压视觉反馈
- **WHEN** 用户按住 FavoriteCard
- **THEN** 卡片 MUST 视觉上缩小至约 96% 尺度
