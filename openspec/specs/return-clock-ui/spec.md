# return-clock-ui Specification

## Purpose

「反方向的钟」工具页（`pages/returnClock/index`）的 MD3 UI 与三模式时钟交互规范。

## Requirements

### Requirement: 反方向的钟页面展示 MD3 完整结构

系统 SHALL 在 `pages/returnClock/index` 渲染以下区块：点阵背景、逆时针数字模拟钟、数字时间（HH:MM:SS）、状态指示行、三列控制按钮；页面背景色 MUST 为 surface（#f7f9fc）。页面 MUST NOT 渲染 BottomNav。

#### Scenario: 页面加载完整结构
- **WHEN** 用户从工作坊进入「反方向的钟」
- **THEN** 页面 MUST 显示模拟钟、数字时间、状态行与三个控制按钮，背景为 #f7f9fc

#### Scenario: 二级页无 Tab 栏
- **WHEN** 用户位于反方向的钟页面
- **THEN** 页面 MUST NOT 显示底部 Tab 导航

### Requirement: 逆时针数字表盘与指针方向

系统 SHALL 在钟面上以逆时针方向排列数字 1-12；秒针颜色 MUST 为 secondary（#b7131a），中心点为 primary 蓝。正常流动时指针 MUST 顺时针转动；逆流或加速逆流时指针 MUST 逆时针转动。

#### Scenario: 数字逆时针排列
- **WHEN** 用户查看模拟钟表盘
- **THEN** 数字 12 MUST 位于顶部，数字 1-11 MUST 沿逆时针方向依次排列

#### Scenario: 逆流指针逆时针
- **WHEN** 时钟处于 reverse 或 accelerate 模式且未暂停
- **THEN** 指针 MUST 沿逆时针方向转动

#### Scenario: 正常流动指针顺时针
- **WHEN** 时钟处于 normal 模式且未暂停
- **THEN** 指针 MUST 沿顺时针方向转动

### Requirement: 数字时间与状态指示

系统 SHALL 在模拟钟下方展示大号数字时间（HH:MM:SS，tabular-nums）及状态行（圆点 + 文案）。reverse 与 accelerate 模式下状态行 MUST 有呼吸动画；暂停时 MUST 显示「时空已静止」且无呼吸动画。

#### Scenario: 数字时间实时更新
- **WHEN** 时钟未暂停
- **THEN** 数字时间 MUST 与 fakeTime 同步更新

#### Scenario: 暂停状态文案
- **WHEN** 用户暂停时钟
- **THEN** 状态行 MUST 显示「时空已静止」且圆点为 outline 色

### Requirement: 默认 1x 逆流且无按钮高亮

系统 SHALL 在用户进入页面时以 reverse 模式（1x 逆流）启动；fakeTime MUST 从当前系统时间初始化；三个控制按钮 MUST 均不高亮。

#### Scenario: 进入页面默认逆流
- **WHEN** 用户首次进入反方向的钟页面
- **THEN** 时钟 MUST 以 1x 速度逆流运行，状态为「时光逆流中...」，且无任何控制按钮处于高亮态

### Requirement: 加速逆流开关

「加速逆流」按钮 MUST 为开关式：首次点击 MUST 切换至 accelerate（10x 逆流）并高亮；再次点击 MUST 恢复 reverse（1x 逆流）并取消高亮。点击时 MUST 取消暂停。

#### Scenario: 首次点击加速
- **WHEN** 用户点击「加速逆流」且该按钮未高亮
- **THEN** 时钟 MUST 以 10x 速度逆流，按钮 MUST 高亮，状态 MUST 为「时光快速逆流中...」

#### Scenario: 再次点击取消加速
- **WHEN** 用户再次点击已高亮的「加速逆流」
- **THEN** 时钟 MUST 恢复 1x 逆流，按钮 MUST 取消高亮

### Requirement: 正常流动开关

「正常流动」按钮 MUST 为开关式：首次点击 MUST 切换至 normal（1x 正向）并高亮；再次点击 MUST 恢复 reverse（1x 逆流）并取消高亮。点击时 MUST 取消暂停，且 MUST 取消「加速逆流」高亮。

#### Scenario: 首次点击正常流动
- **WHEN** 用户点击「正常流动」且该按钮未高亮
- **THEN** fakeTime MUST 以 1x 速度正向递增，按钮 MUST 高亮，状态 MUST 为「遵循自然秩序中」

#### Scenario: 再次点击取消正常流动
- **WHEN** 用户再次点击已高亮的「正常流动」
- **THEN** 时钟 MUST 恢复 1x 逆流，按钮 MUST 取消高亮

### Requirement: 时空暂停仅切换 icon

「时空暂停」按钮 MUST NOT 高亮。点击 MUST 切换暂停/继续，且 icon MUST 在 pause 与 play 间切换；暂停 MUST NOT 改变当前 flowMode 或左右按钮高亮态。

#### Scenario: 点击暂停
- **WHEN** 用户点击「时空暂停」且时钟正在运行
- **THEN** fakeTime MUST 停止变化，icon MUST 变为 play，按钮 MUST NOT 高亮

#### Scenario: 点击继续
- **WHEN** 用户再次点击「时空暂停」且时钟已暂停
- **THEN** fakeTime MUST 按当前 flowMode 继续变化，icon MUST 变为 pause

### Requirement: rAF 时钟驱动与生命周期

系统 SHALL 使用 requestAnimationFrame 按 delta 时间更新 fakeTime；页面 hide 或 unmount 时 MUST 取消动画帧循环；页面 show 时 MUST 恢复循环。

#### Scenario: 页面隐藏停止循环
- **WHEN** 用户离开反方向的钟页面（onHide）
- **THEN** 系统 MUST 停止 requestAnimationFrame 循环

#### Scenario: 页面显示恢复循环
- **WHEN** 用户返回反方向的钟页面（onShow）
- **THEN** 系统 MUST 恢复 requestAnimationFrame 循环

### Requirement: 控制按钮视觉与按压反馈

「加速逆流」与「正常流动」高亮时 MUST 为 primary 蓝底白字且无图标；未高亮时 MUST 为浅色底、边框、图标在上文字在下。「时空暂停」 MUST 始终显示图标且不高亮。所有按钮 MUST 提供 `:active` 缩放反馈。

#### Scenario: 高亮按钮样式
- **WHEN** 「加速逆流」或「正常流动」处于高亮态
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
