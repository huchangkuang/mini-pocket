# decision-tool-ui Specification

## Purpose
TBD - created by archiving change redesign-decision-tool-ui. Update Purpose after archive.
## Requirements
### Requirement: 做个决定吧主页展示 MD3 完整结构

系统 SHALL 在 `pages/doDescription/index` 渲染以下区块：当前问题卡片、转盘（含顶部指针与中心 GO 按钮）、提示文案、最近常用列表（含空态）、底部「开始抽取」主按钮；页面背景色 MUST 为 surface（#f7f9fc）。页面 MUST NOT 渲染 BottomNav。

#### Scenario: 页面加载完整结构
- **WHEN** 用户从工作坊进入「做个决定吧」
- **THEN** 页面 MUST 显示当前问题卡片、转盘、提示文案、最近常用区块与「开始抽取」按钮，背景为 #f7f9fc

#### Scenario: 二级页无 Tab 栏
- **WHEN** 用户位于做个决定吧主页
- **THEN** 页面 MUST NOT 显示底部 Tab 导航

### Requirement: 当前问题卡片可编辑

系统 SHALL 在主页顶部展示「当前问题」标签、当前决策标题及编辑按钮；点击编辑 MUST 跳转至 `pages/doDescription/edit/index?type=edit`（若已选中常用项则携带 id）。

#### Scenario: 点击编辑跳转
- **WHEN** 用户点击当前问题卡片上的编辑按钮
- **THEN** 系统 MUST navigateTo 编辑转盘页，并保留当前 title/list 编辑上下文

### Requirement: 转盘支持双入口旋转

系统 SHALL 提供 MD3 灰白交替扇区的转盘，顶部固定指针，中心 GO 按钮与底部「开始抽取」按钮均可触发旋转；旋转动画 MUST 约 4 秒，旋转中 MUST 禁止重复触发。

#### Scenario: 中心 GO 触发旋转
- **WHEN** 用户点击转盘中心 GO 按钮且当前未在旋转
- **THEN** 转盘 MUST 开始旋转动画

#### Scenario: 底部 CTA 触发旋转
- **WHEN** 用户点击「开始抽取」按钮且当前未在旋转
- **THEN** 转盘 MUST 开始旋转动画

#### Scenario: 旋转中防抖
- **WHEN** 转盘正在旋转
- **THEN** 再次点击 GO 或「开始抽取」MUST NOT 触发新的旋转

### Requirement: 旋转结果展示为后续迭代

系统 SHALL NOT 在旋转结束后展示选中结果（本版本）；实现代码 MUST 保留 TODO 标记以便后续添加结果 Modal 或 Toast。

#### Scenario: 旋转结束无结果弹窗
- **WHEN** 转盘旋转动画结束
- **THEN** 系统 MUST NOT 弹出结果展示 UI

### Requirement: 最近常用列表始终展示

系统 SHALL 始终展示「最近常用」区块，含「+ 新建」入口；当 localStorage 无数据时 MUST 展示空态引导文案。

#### Scenario: 有空态引导
- **WHEN** 用户尚未保存任何常用决策且 USE_LIST 为空
- **THEN** 页面 MUST 仍显示「最近常用」标题与「+ 新建」，并展示空态说明

#### Scenario: 新建跳转
- **WHEN** 用户点击「+ 新建」
- **THEN** 系统 MUST navigateTo `pages/doDescription/edit/index?type=add`

#### Scenario: 选中常用项加载转盘
- **WHEN** 用户点击某条常用项
- **THEN** 系统 MUST 将该条 title/list 加载至当前转盘，并以 border 高亮标记选中态

### Requirement: 常用项列表内删除

系统 SHALL 在每条「最近常用」列表项右侧展示删除图标；点击删除 MUST 弹出二次确认 Modal，确认后从 USE_LIST 移除该项。系统 MUST NOT 使用长按删除。

#### Scenario: 点击删除图标
- **WHEN** 用户点击某条常用项右侧删除图标并确认
- **THEN** 系统 MUST 调用 deleteLocalItem 移除该项并刷新列表

#### Scenario: 删除当前选中项
- **WHEN** 用户删除的常用项为当前选中项（selectId）
- **THEN** 系统 MUST 清除选中态

#### Scenario: 无长按删除
- **WHEN** 用户长按常用列表项
- **THEN** 系统 MUST NOT 弹出删除确认框

### Requirement: 默认决策数据

系统 SHALL 将 decisionConfig 默认 title 设为「今晚吃什么？」，默认 list 设为「火锅、披萨、寿司、烤肉、面条、沙拉」六个选项（仅影响无持久化覆盖时的初始值）。

#### Scenario: 首次进入默认选项
- **WHEN** 新用户首次打开做个决定吧且未修改过配置
- **THEN** 转盘 MUST 展示六个默认美食选项

### Requirement: 编辑转盘页 MD3 布局

系统 SHALL 在 `pages/doDescription/edit/index?type=edit` 展示：Hero 区（Decision Tool 标签、「去决定！！！」标题、副标题）、「你的问题」卡片输入、选项列表（含已添加计数）、虚线「添加选项」按钮、智能生成 banner、「保存」sticky 底栏及同步提示文案。

#### Scenario: 编辑页保存
- **WHEN** 用户在编辑转盘页修改 title/list 并点击保存且至少两个非空选项
- **THEN** 系统 MUST 更新 decisionConfig 并 navigateBack；若携带 id 则 MUST 调用 updateLocalItem

#### Scenario: 智能生成占位
- **WHEN** 用户点击「智能生成?」banner
- **THEN** 系统 MUST 显示开发中 toast

#### Scenario: 选项最少两个
- **WHEN** 用户尝试保存且有效选项少于两个
- **THEN** 系统 MUST 阻止保存并提示至少填写两个选项

### Requirement: 添加常用页 MD3 布局

系统 SHALL 在 `pages/doDescription/edit/index?type=add` 展示：「决策主题」Hero、「去决定！！！」标题、标题输入框、选择选项列表、虚线「添加选项」按钮、装饰插图区与说明文案、带 save 图标的「保存」sticky 底栏；导航栏标题 MUST 为「添加常用」。

#### Scenario: 添加常用保存
- **WHEN** 用户在添加常用页填写 title/list 并点击保存且至少两个非空选项
- **THEN** 系统 MUST 调用 addLocalItem 写入 USE_LIST 并 navigateBack

#### Scenario: 添加页导航标题
- **WHEN** 用户进入 type=add 编辑页
- **THEN** 导航栏标题 MUST 显示「添加常用」

### Requirement: 选项行 accent 轮换与删除

编辑页与添加页的每个选项行 SHALL 展示 accent 轮换的图标底、文本输入与删除按钮；删除时若剩余选项少于两个 MUST 阻止并提示。

#### Scenario: 删除选项下限
- **WHEN** 用户点击删除且当前仅有两个选项
- **THEN** 系统 MUST 提示至少保留两个选项且不删除

#### Scenario: 添加新选项
- **WHEN** 用户点击「添加选项」
- **THEN** 系统 MUST 在列表末尾追加一行空选项输入

### Requirement: 卡片按压反馈

系统 SHALL 为可点击卡片与主按钮提供 `:active` 缩放反馈，不使用 hover 交互。

#### Scenario: 按钮按压反馈
- **WHEN** 用户按住「开始抽取」或「保存」按钮
- **THEN** 按钮 MUST 有视觉缩放或 opacity 反馈

