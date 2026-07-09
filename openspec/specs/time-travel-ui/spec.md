## ADDED Requirements

### Requirement: 时间穿越页面配置与结构

系统 SHALL 在 `pages/timeTravel/index` 提供单页工具：ToolSliderRow 选择穿越时长（5–15 秒，整数）、ToolBottomBar 确认按钮、假时钟展示区。页面 MUST NOT 渲染 BottomNav。页面 MUST 配置 `useShareAppMessage` 分享，title 为「时间穿越」。

#### Scenario: 页面初始状态
- **WHEN** 用户从工坊进入「时间穿越」
- **THEN** 滑块默认值 MUST 在 5–15 范围内，假时钟显示当前系统时间，确认按钮可点击

#### Scenario: 分享配置
- **WHEN** 用户在时间穿越页触发分享
- **THEN** 分享 title MUST 为「时间穿越」，path MUST 指向 `/pages/timeTravel/index`

### Requirement: 假时钟穿越动画

用户点击确认后，系统 SHALL 进入 traveling 状态：禁用滑块与确认按钮，假时钟 MUST 通过 RAF 驱动指针快进（fakeTime 正向加速），MUST NOT 显示「还剩 Xs」等倒计时文案。

#### Scenario: 开始穿越
- **WHEN** 用户点击确认且当前为 idle 状态
- **THEN** 页面 MUST 进入 traveling 状态，假时钟指针 MUST 开始快进动画

#### Scenario: 穿越中不可重复触发
- **WHEN** 页面处于 traveling 状态
- **THEN** 滑块与确认按钮 MUST 禁用

### Requirement: 穿越完成弹窗

穿越时长（用户所选秒数）结束后，系统 SHALL 调用 `Taro.showModal` 提示「你已经穿越至 {n}s 后」（n 为用户所选秒数），随后 MUST 重置为 idle 状态，可再次穿越。

#### Scenario: 穿越完成
- **WHEN** 假时钟动画运行满用户所选秒数
- **THEN** 系统 MUST 弹出 modal，文案为「你已经穿越至 {n}s 后」

#### Scenario: 关闭弹窗后重置
- **WHEN** 用户关闭完成弹窗
- **THEN** 页面 MUST 回到 idle，滑块与确认按钮 MUST 恢复可用

### Requirement: 页面隐藏时暂停动画

系统 SHALL 在 `useDidHide` 暂停 RAF 计时，在 `useDidShow` 恢复，避免切后台导致穿越进度跳变。

#### Scenario: 切后台暂停
- **WHEN** 用户在 traveling 状态将小程序切至后台
- **THEN** RAF 循环 MUST 暂停

#### Scenario: 回前台恢复
- **WHEN** 用户从后台回到时间穿越页且仍在 traveling 状态
- **THEN** RAF 循环 MUST 恢复
