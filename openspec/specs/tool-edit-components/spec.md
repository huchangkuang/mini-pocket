# tool-edit-components Specification

## Purpose
TBD - created by archiving change redesign-barrage-edit-ui. Update Purpose after archive.
## Requirements
### Requirement: ToolFormCard 提供工具编辑表单卡片容器
系统 SHALL 提供 `ToolFormCard` 组件，渲染白色圆角卡片容器，包含可选 AtIcon、标题文本与 children 内容区，样式 MUST 使用 design tokens（surface-container-lowest 背景、shadow-card、radius-xl）。

#### Scenario: 渲染带图标与标题的卡片
- **WHEN** 传入 icon 与 title props
- **THEN** 卡片 MUST 在顶部显示 primary 色图标与 bold 标题，下方渲染 children

#### Scenario: 卡片视觉样式
- **WHEN** ToolFormCard 渲染
- **THEN** 卡片 MUST 具有圆角、阴影与 tokens 定义的内边距

### Requirement: SegmentedControl 提供多段选项切换
系统 SHALL 提供 `SegmentedControl` 组件，接收 options 数组（label + value）、当前 value 与 onChange 回调，渲染等宽分段控件。

#### Scenario: 选中态样式
- **WHEN** 某 segment 为当前选中值
- **THEN** 该 segment MUST 显示白底、primary 色文字与 shadow-sm 选中态

#### Scenario: 未选中态样式
- **WHEN** 某 segment 非当前选中值
- **THEN** 该 segment MUST 显示 on-surface-variant 文字，无白底阴影

#### Scenario: 点击切换
- **WHEN** 用户点击未选中的 segment
- **THEN** 系统 MUST 调用 onChange 并传入对应 value

### Requirement: ColorSwatchGroup 提供内联色板选择
系统 SHALL 提供 `ColorSwatchGroup` 组件，接收 label、colors 数组、当前 value 与 onChange，渲染圆形色板按钮组。

#### Scenario: 选中色板边框
- **WHEN** 某色板值为当前选中值
- **THEN** 该圆点 MUST 显示 2px primary 色边框

#### Scenario: 点击切换颜色
- **WHEN** 用户点击某色板圆点
- **THEN** 系统 MUST 调用 onChange 并传入对应颜色值

#### Scenario: 浅色圆点可见性
- **WHEN** 色板包含浅色（如 #ffffff）
- **THEN** 该圆点 MUST 具有 outline-variant 细边框以保证在白底上可见

### Requirement: ToolSliderRow 提供标签与滑块行
系统 SHALL 提供 `ToolSliderRow` 组件，接收 label、value、min、max、unit、onChange 与可选 disabled，渲染标签、当前值（primary bold）与 Slider。

#### Scenario: 显示当前值
- **WHEN** value 为 64、unit 为 "px"
- **THEN** 行内 MUST 显示 "64px" 格式的当前值

#### Scenario: 滑块变更
- **WHEN** 用户拖动 Slider
- **THEN** 系统 MUST 调用 onChange 并传入新数值

#### Scenario: 禁用态
- **WHEN** disabled 为 true
- **THEN** Slider MUST 不可交互，整行 opacity MUST 降至约 0.4

### Requirement: ToolTipCard 提供提示信息卡片
系统 SHALL 提供 `ToolTipCard` 组件，接收 children 提示文案，渲染 primary/5 背景、primary/10 边框、info 图标与文案。

#### Scenario: 提示卡渲染
- **WHEN** 传入提示文案
- **THEN** 卡片 MUST 显示左侧 primary 色 info 图标与 on-surface-variant 文案

### Requirement: ToolBottomBar 提供固定底栏主操作
系统 SHALL 提供 `ToolBottomBar` 组件，接收 label、icon（可选）与 onClick，渲染 fixed 底栏与全宽 pill 形 primary 按钮。

#### Scenario: 底栏固定定位
- **WHEN** ToolBottomBar 渲染
- **THEN** 底栏 MUST fixed 于页面底部，具有 backdrop-blur 或半透明背景与顶部边框

#### Scenario: 主按钮点击
- **WHEN** 用户点击主按钮
- **THEN** 系统 MUST 调用 onClick 回调

#### Scenario: 按钮文案与图标
- **WHEN** 传入 label「开始展示」与 play 图标
- **THEN** 按钮 MUST 显示图标 + 文案，白字 primary 底、rounded-full

