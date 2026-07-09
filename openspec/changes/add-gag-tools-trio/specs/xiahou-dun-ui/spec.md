## ADDED Requirements

### Requirement: 夏侯惇模拟器页面结构

系统 SHALL 在 `pages/xiahouDun/index` 提供单页工具：说明文案、确认按钮。页面 MUST NOT 渲染 BottomNav。页面 MUST 配置 `useShareAppMessage` 分享，title 为「夏侯惇模拟器」。

#### Scenario: 页面初始无蒙层
- **WHEN** 用户从工坊进入「夏侯惇模拟器」
- **THEN** 屏幕 MUST 无黑色蒙层，确认按钮 MUST 可见可点击

#### Scenario: 分享配置
- **WHEN** 用户在夏侯惇模拟器页触发分享
- **THEN** 分享 title MUST 为「夏侯惇模拟器」，path MUST 指向 `/pages/xiahouDun/index`

### Requirement: 左半屏黑色蒙层一次性生效

用户点击确认后，系统 SHALL 在屏幕左半（宽 50vw、高 100vh）覆盖不透明黑色蒙层（`background: #000`，opacity 1）。蒙层 MUST 使用 fixed 定位且 `pointer-events: none`。生效后 MUST NOT 提供撤销或恢复按钮。

#### Scenario: 确认后蒙层出现
- **WHEN** 用户点击确认
- **THEN** 屏幕左半 MUST 被不透明黑色蒙层覆盖

#### Scenario: 蒙层不可撤销
- **WHEN** 蒙层已生效
- **THEN** 页面 MUST NOT 提供移除蒙层的交互；用户仅可通过返回离开页面

#### Scenario: 右半屏可见
- **WHEN** 蒙层已生效
- **THEN** 屏幕右半 MUST 保持原页面内容可见
