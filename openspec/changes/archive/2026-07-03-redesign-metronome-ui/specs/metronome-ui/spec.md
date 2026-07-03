## ADDED Requirements

### Requirement: 节拍器页展示 MD3 完整结构

系统 SHALL 在 `pages/metronome/index` 渲染以下区块：4 节拍胶囊指示器、中央 BPM Dial（含 TEMPO/BPM 标签、± 按钮、进度弧）、常用节拍预设区、「查看全部」入口、自定义频率卡片、声音/震动开关卡片、底部 FAB 播放按钮；页面背景色 MUST 为 surface（#f7f9fc）。页面 MUST NOT 渲染 BottomNav。

#### Scenario: 页面加载完整结构
- **WHEN** 用户从工作坊进入节拍器
- **THEN** 页面 MUST 显示节拍指示器、BPM Dial、常用节拍区、自定义输入、反馈开关与 FAB，背景为 #f7f9fc

#### Scenario: 二级页无 Tab 栏
- **WHEN** 用户位于节拍器页
- **THEN** 页面 MUST NOT 显示底部 Tab 导航

### Requirement: 原生导航栏浅色样式

系统 SHALL 将节拍器页原生导航栏背景设为 #f7f9fc，标题文字为黑色，标题文案为「节拍器」。

#### Scenario: 导航栏配色
- **WHEN** 用户打开节拍器页
- **THEN** 原生导航栏 MUST 使用浅色背景与黑色标题

### Requirement: 中央 BPM Dial 展示与调节

系统 SHALL 在页面中央展示当前 BPM 大数字（默认 72）、TEMPO/BPM 标签、圆形进度弧（映射 BPM 与最大值 208 的比例），以及 ± 按钮（每次 ±1，范围 1–208）。

#### Scenario: 显示当前 BPM
- **WHEN** 页面加载且未修改过 BPM
- **THEN** Dial 中央 MUST 显示 72，进度弧 MUST 反映 72/208 比例

#### Scenario: 增加 BPM
- **WHEN** 用户点击 + 按钮且当前 BPM 小于 208
- **THEN** BPM MUST 加 1 并更新 Dial 数字与进度弧

#### Scenario: 减少 BPM
- **WHEN** 用户点击 - 按钮且当前 BPM 大于 1
- **THEN** BPM MUST 减 1 并更新 Dial 数字与进度弧

#### Scenario: BPM 边界
- **WHEN** 用户点击 + 且 BPM 已为 208（或点击 - 且 BPM 已为 1）
- **THEN** BPM MUST NOT 超出 1–208 范围

### Requirement: 节拍胶囊可视化

系统 SHALL 展示 4 个圆角竖条指示 4/4 节拍；播放时当前拍 MUST 高亮（scaleY 放大、primary-container 色、发光阴影），首拍默认更高。

#### Scenario: 播放时高亮当前拍
- **WHEN** 用户启动播放
- **THEN** 指示器 MUST 按 BPM 间隔依次高亮第 1–4 拍并循环

#### Scenario: 停止后清除高亮
- **WHEN** 用户停止播放
- **THEN** 所有指示器 MUST 恢复非 active 样式

### Requirement: 常用节拍预设卡片

系统 SHALL 展示 4 张预设卡片（60 Slow、72 Std、84 Mod、120 Fast）；点击 MUST 将 BPM 设为对应值；当前 BPM 匹配预设时 MUST 以 primary-container 高亮该卡片。

#### Scenario: 选择预设
- **WHEN** 用户点击 84 Mod 卡片
- **THEN** BPM MUST 变为 84，Dial 与进度弧 MUST 同步更新，84 卡片 MUST 高亮

#### Scenario: 默认选中 72
- **WHEN** 用户首次进入且 BPM 为 72
- **THEN** 72 Std 卡片 MUST 处于选中高亮态

### Requirement: 查看全部 BPM 列表面板

系统 SHALL 提供「查看全部」入口，打开可滚动面板展示 `CommonBeatList` 全部 BPM 值供选择；选中后 MUST 关闭面板并更新 BPM。

#### Scenario: 打开全量列表
- **WHEN** 用户点击「查看全部」
- **THEN** 系统 MUST 展示包含 CommonBeatList 所有值的 selectable 列表面板

#### Scenario: 从全量列表选择
- **WHEN** 用户在面板中选择 100
- **THEN** BPM MUST 变为 100，面板 MUST 关闭，预设卡片高亮 MUST 与 100 是否匹配预设一致

### Requirement: 自定义频率输入

系统 SHALL 提供 MD3 卡片式数字输入，标签「自定义频率」，placeholder「1-208 内整数」；输入有效整数（1–208）时 MUST 同步 BPM；提供清除按钮清空输入。无效值 MUST 阻止启动并 toast 提示（保留现有校验文案）。

#### Scenario: 有效自定义输入
- **WHEN** 用户输入 96
- **THEN** BPM MUST 变为 96，Dial MUST 同步

#### Scenario: 清除自定义输入
- **WHEN** 用户点击清除按钮
- **THEN** 输入框 MUST 清空

#### Scenario: 无效值阻止播放
- **WHEN** 用户输入非整数或超出 1–208 并点击播放
- **THEN** 系统 MUST NOT 开始播放并 MUST 显示错误 toast

### Requirement: 声音与震动反馈开关

系统 SHALL 提供「声音提示」与「震动反馈」两个开关，默认分别为开启与关闭；状态 MUST 持久化至 localStorage，下次进入 MUST 恢复。

#### Scenario: 关闭声音
- **WHEN** 用户关闭声音提示并播放
- **THEN** 节拍循环 MUST 继续但 MUST NOT 播放 beat_cut.mp3

#### Scenario: 开启震动
- **WHEN** 用户开启震动反馈并播放
- **THEN** 每拍 MUST 触发短震动（平台 API 允许时）

#### Scenario: 设置持久化
- **WHEN** 用户修改开关后离开并再次进入节拍器
- **THEN** 开关状态 MUST 与上次一致

### Requirement: FAB 播放控制

系统 SHALL 提供底部悬浮 FAB 切换播放/暂停；播放中 FAB MUST 显示暂停态，停止后 MUST 显示播放态。FAB MUST 使用 primary-container 配色与 shadow-fab 阴影。

#### Scenario: 开始播放
- **WHEN** 用户点击 FAB 且 BPM 有效
- **THEN** 系统 MUST 开始节拍循环并切换 FAB 为暂停图标

#### Scenario: 停止播放
- **WHEN** 用户播放中再次点击 FAB
- **THEN** 系统 MUST 停止节拍循环并切换 FAB 为播放图标

### Requirement: 播放中 BPM 变更自动重启

系统 SHALL 在播放过程中允许通过 ±、预设、全量列表或自定义输入变更 BPM；变更后 MUST 以新 BPM 自动重启节拍循环。

#### Scenario: 播放中调整 BPM
- **WHEN** 用户正在播放并将 BPM 从 72 改为 84
- **THEN** 系统 MUST 立即以 84 BPM 重启节拍，不 require 先手动停止

### Requirement: 卡片按压反馈

系统 SHALL 为可点击卡片、± 按钮与 FAB 提供 `:active` 缩放反馈，不使用 hover 交互。

#### Scenario: FAB 按压反馈
- **WHEN** 用户按住 FAB
- **THEN** FAB MUST 有 scale 或 opacity 视觉反馈

### Requirement: 分享能力保留

系统 SHALL 保留 `useShareAppMessage`，分享标题为「节拍器」，路径为 `/pages/metronome/index`。

#### Scenario: 分享节拍器
- **WHEN** 用户触发小程序分享
- **THEN** 分享卡片 MUST 包含标题「节拍器」与正确页面路径
