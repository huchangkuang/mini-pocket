## ADDED Requirements

### Requirement: 弹幕编辑页展示 Stitch 对齐的完整 UI 结构
系统 SHALL 在 `pages/handsBarrage/edit` 渲染：Live Preview 预览区、弹幕内容卡片、弹幕形式 SegmentedControl、颜色与滑块 Bento 双列、提示卡、固定底栏「开始展示」按钮；背景色 MUST 为 surface（#f7f9fc）。

#### Scenario: 页面整体结构
- **WHEN** 用户进入手持弹幕编辑页
- **THEN** 页面 MUST 按顺序展示预览区、表单卡片组与底栏 CTA，MUST NOT 展示旧版折叠「自定义」区块

#### Scenario: 保留系统导航栏
- **WHEN** 用户查看页面顶部
- **THEN** 系统 MUST 使用微信原生导航栏显示「弹幕编辑」标题，MUST NOT 渲染自定义 TopBar

### Requirement: Live Preview 实时联动配置
系统 SHALL 在页面顶部提供 21:9 比例的 Live Preview 预览区，左上角显示「LIVE PREVIEW」badge，预览内容 MUST 随弹幕文字、字号、字色、背景色、弹幕形式、滚动时间实时更新。

#### Scenario: 输入文字同步预览
- **WHEN** 用户在弹幕内容输入框输入文字
- **THEN** 预览区 MUST 显示相同文字；空内容时 MUST 显示占位「输入弹幕内容...」

#### Scenario: 滚动模式预览动画
- **WHEN** 弹幕形式为滚动弹幕
- **THEN** 预览文字 MUST 播放横向滚动 CSS 动画，动画时长 MUST 等于滚动时间配置

#### Scenario: 抖动模式预览动画
- **WHEN** 弹幕形式为抖动文字
- **THEN** 预览文字 MUST 播放抖动效果动画，MUST NOT 滚动

#### Scenario: 静止模式预览
- **WHEN** 弹幕形式为静止弹幕
- **THEN** 预览文字 MUST 居中静止显示，MUST NOT 播放滚动或抖动动画

### Requirement: 弹幕内容输入与字数限制
系统 SHALL 提供弹幕内容输入框，placeholder 为「输入弹幕内容（限20字）」，maxlength 20，右下角显示「当前字数/20」计数。

#### Scenario: 字数计数
- **WHEN** 用户输入 5 个字符
- **THEN** 计数 MUST 显示「5/20」

#### Scenario: 超出字数限制
- **WHEN** 用户尝试输入超过 20 字
- **THEN** 输入框 MUST NOT 接受更多字符

### Requirement: 三种弹幕形式 Segmented 选择
系统 SHALL 提供 3 段 SegmentedControl：滚动弹幕、抖动文字、静止弹幕，映射现有 `BarrageType` enum（scroll / bounce / static），默认选中滚动弹幕。

#### Scenario: 三种形式均可选择
- **WHEN** 用户依次点击三个 segment
- **THEN** 每种形式 MUST 可切换为选中态并更新 barrageType state

#### Scenario: 静止弹幕文案
- **WHEN** 用户查看静止选项
- **THEN** 文案 MUST 显示「静止弹幕」（非旧版「打字版」）

### Requirement: 滚动时间 Slider 模式联动
系统 SHALL 提供滚动时间 Slider（1–10 秒）；仅滚动弹幕模式下 MUST 启用，抖动与静止模式下 MUST 禁用并降低 opacity。

#### Scenario: 滚动模式启用
- **WHEN** 弹幕形式为滚动弹幕
- **THEN** 滚动时间 Slider MUST 可交互，opacity 为 1

#### Scenario: 非滚动模式禁用
- **WHEN** 弹幕形式为抖动文字或静止弹幕
- **THEN** 滚动时间 Slider MUST 禁用，opacity MUST 约 0.4

### Requirement: 设计稿 7 色内联色板
系统 SHALL 提供内联色板选择，不使用 Modal；字体颜色 4 色（#ffffff、#fdd835、#ff5252、#40c4ff），背景颜色 3 色（#000000、#0060a8、#b7131a）；默认字色白、背景黑。

#### Scenario: 字体颜色选择
- **WHEN** 用户点击某字体色板
- **THEN** 预览文字颜色 MUST 立即更新，选中圆点 MUST 显示 primary 边框

#### Scenario: 背景颜色选择
- **WHEN** 用户点击某背景色板
- **THEN** 预览区背景色 MUST 立即更新

#### Scenario: 无 Modal 选色
- **WHEN** 用户操作颜色
- **THEN** 系统 MUST NOT 弹出 AtModal 颜色选择器

### Requirement: 字号 Slider 配置
系统 SHALL 提供字号 Slider，范围 20–100，默认 64，单位 px；变更 MUST 同步到 Live Preview（经缩放系数）。

#### Scenario: 字号默认值
- **WHEN** 用户首次进入编辑页
- **THEN** 字号 MUST 默认为 64px

#### Scenario: 字号变更同步预览
- **WHEN** 用户调整字号 Slider
- **THEN** 预览区字号 MUST 相应变化

### Requirement: 开始展示跳转与校验
系统 SHALL 提供底栏「开始展示」按钮；点击时 MUST 校验弹幕非空且不超过 20 字，通过后 MUST 以现有 JSON 格式 navigateTo 展示页。

#### Scenario: 空内容校验
- **WHEN** 用户点击「开始展示」且弹幕内容为空
- **THEN** 系统 MUST 显示「请输入弹幕内容」toast，MUST NOT 跳转

#### Scenario: 成功跳转
- **WHEN** 用户点击「开始展示」且内容有效
- **THEN** 系统 MUST navigateTo `/pages/handsBarrage/index` 并携带 encodeURIComponent(JSON) 参数，参数 MUST 包含 fontSize、fontColor、time、barrage、bgColor、barrageType

### Requirement: 小贴士提示卡
系统 SHALL 在表单底部展示提示卡，文案为「小贴士：双击展示页面可以快速返回编辑界面。建议在暗光环境下调高字体亮度以获得最佳展示效果。」

#### Scenario: 提示卡展示
- **WHEN** 用户浏览编辑页
- **THEN** 页面 MUST 显示上述小贴士文案与 info 图标

### Requirement: 展示页不受影响
系统 SHALL NOT 修改 `pages/handsBarrage/index` 展示页的任何代码或行为。

#### Scenario: 展示页零改动
- **WHEN** 本变更实施完成
- **THEN** `pages/handsBarrage/index.tsx` 与 `index.scss` MUST 保持变更前逻辑与样式
