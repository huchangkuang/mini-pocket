## ADDED Requirements

### Requirement: 反方向的钟页面展示 MD3 完整结构

系统 SHALL 在 `pages/returnClock/index` 渲染以下区块：点阵背景、逆时针模拟钟、数字时间（HH:MM:SS）、状态指示行、三列模式控制按钮；页面背景色 MUST 为 surface（#f7f9fc）。页面 MUST NOT 渲染 BottomNav。

#### Scenario: 页面加载完整结构
- **WHEN** 用户从工作坊进入「反方向的钟」
- **THEN** 页面 MUST 显示模拟钟、数字时间、状态行与三个控制按钮，背景为 #f7f9fc

#### Scenario: 二级页无 Tab 栏
- **WHEN** 用户位于反方向的钟页面
- **THEN** 页面 MUST NOT 显示底部 Tab 导航

### Requirement: 逆时针模拟钟表盘

系统 SHALL 在钟面上以逆时针方向排列数字 1-12；时针、分针、秒针 MUST 使用负角度旋转以匹配逆时针表盘；秒针颜色 MUST 为 secondary（#b7131a），中心点为 primary 蓝。

#### Scenario: 数字逆时针排列
- **WHEN** 用户查看模拟钟表盘
- **THEN** 数字 12 MUST 位于顶部，数字 1-11 MUST 沿逆时针方向依次排列

#### Scenario: 指针逆时针旋转
- **WHEN** 时钟处于逆流或加速逆流模式且时间推进
- **THEN** 指针 MUST 沿逆时针方向转动

### Requirement: 数字时间与状态指示

系统 SHALL 在模拟钟下方展示大号数字时间（HH:MM:SS，tabular-nums）及状态行（圆点 + 文案）。reverse 与 accelerate 模式下状态行 MUST 有呼吸动画。

#### Scenario: 数字时间实时更新
- **WHEN** 时钟运行中（非 pause 模式）
- **THEN** 数字时间 MUST 与 fakeTime 同步更新

#### Scenario: 状态文案随模式变化
- **WHEN** 模式为 reverse
- **THEN** 状态行 MUST 显示「时光逆流中...」且圆点为 primary 色

#### Scenario: 加速状态文案
- **WHEN** 模式为 accelerate
- **THEN** 状态行 MUST 显示「时光快速逆流中...」且圆点为 primary 色

#### Scenario: 暂停状态文案
- **WHEN** 模式为 pause
- **THEN** 状态行 MUST 显示「时空已静止」且圆点为 outline 色，无呼吸动画

#### Scenario: 正常流动状态文案
- **WHEN** 模式为 normal
- **THEN** 状态行 MUST 显示「遵循自然秩序中」且圆点为 secondary 色，无呼吸动画

### Requirement: 默认 1x 逆流模式

系统 SHALL 在用户进入页面时以 reverse 模式（1x 逆流）启动；「加速逆流」按钮 MUST 处于激活态；fakeTime MUST 从当前系统时间初始化。

#### Scenario: 进入页面默认逆流
- **WHEN** 用户首次进入反方向的钟页面
- **THEN** 时钟 MUST 以 1x 速度逆流运行，状态为「时光逆流中...」，「加速逆流」按钮为激活态

### Requirement: 三模式控制与加速两档

系统 SHALL 提供三个控制按钮：「加速逆流」「时空暂停」「正常流动」。点击 MUST 切换对应模式；同一时刻 MUST 仅一个按钮处于激活态。

「加速逆流」按钮 MUST 支持两档：默认 1x（reverse），在已激活时再点 MUST 切换至 10x（accelerate）；再点 MUST 回到 1x。从 pause 或 normal 点回「加速逆流」MUST 重置为 reverse 1x。

#### Scenario: 切换到暂停
- **WHEN** 用户点击「时空暂停」
- **THEN** 时钟 MUST 停止更新 fakeTime，「时空暂停」按钮 MUST 为激活态

#### Scenario: 切换到正常流动
- **WHEN** 用户点击「正常流动」
- **THEN** fakeTime MUST 以 1x 速度正向递增，「正常流动」按钮 MUST 为激活态

#### Scenario: 加速两档切换
- **WHEN** 用户已在 reverse 模式且「加速逆流」已激活，再次点击「加速逆流」
- **THEN** 模式 MUST 切换为 accelerate（10x 逆流），状态 MUST 变为「时光快速逆流中...」

#### Scenario: 从暂停回到逆流
- **WHEN** 用户在 pause 模式点击「加速逆流」
- **THEN** 模式 MUST 重置为 reverse 1x

### Requirement: rAF 时钟驱动与生命周期

系统 SHALL 使用 requestAnimationFrame 按 delta 时间更新 fakeTime；页面 hide 或 unmount 时 MUST 取消动画帧循环；页面 show 时 MUST 恢复循环。

#### Scenario: 页面隐藏停止循环
- **WHEN** 用户离开反方向的钟页面（onHide）
- **THEN** 系统 MUST 停止 requestAnimationFrame 循环

#### Scenario: 页面显示恢复循环
- **WHEN** 用户返回反方向的钟页面（onShow）
- **THEN** 系统 MUST 恢复 requestAnimationFrame 循环

### Requirement: 控制按钮视觉与按压反馈

激活态按钮 MUST 为 primary 蓝底白字且无图标；未激活态 MUST 为浅色底、边框、图标在上文字在下。所有按钮 MUST 提供 `:active` 缩放反馈，不使用 hover。

#### Scenario: 激活按钮样式
- **WHEN** 某控制按钮对应当前模式
- **THEN** 该按钮 MUST 显示 primary 蓝底白字，不显示图标

#### Scenario: 按钮按压反馈
- **WHEN** 用户按住任一控制按钮
- **THEN** 按钮 MUST 有视觉缩放反馈

### Requirement: 导航栏 MD3 样式

系统 SHALL 将 `index.config.ts` 导航栏背景设为 #f7f9fc，标题为「反方向的钟」，文字样式与 MD3 浅色主题一致。页面 MUST NOT 提供设置按钮。

#### Scenario: 导航栏浅色主题
- **WHEN** 用户查看反方向的钟页面顶栏
- **THEN** 导航栏背景 MUST 为 #f7f9fc

### Requirement: 分享能力保留

系统 SHALL 保留 `useShareAppMessage`，分享标题为「反方向的钟」，path 为 `/pages/returnClock/index`。

#### Scenario: 分享配置不变
- **WHEN** 用户触发小程序分享
- **THEN** 分享 MUST 包含标题「反方向的钟」及正确 path
