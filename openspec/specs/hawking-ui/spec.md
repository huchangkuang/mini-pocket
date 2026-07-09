## ADDED Requirements

### Requirement: 霍金模拟器页面结构与自定义导航

系统 SHALL 在 `pages/hawking/index` 使用 `navigationStyle: 'custom'`，提供自定义返回按钮与标题，说明文案、确认按钮。page 背景 MUST 为 `#000`。页面 MUST NOT 渲染 BottomNav。页面 MUST 配置 `useShareAppMessage` 分享，title 为「霍金模拟器」。

#### Scenario: 初始未旋转
- **WHEN** 用户从工坊进入「霍金模拟器」
- **THEN** page 背景 MUST 为黑色，白色内容区 MUST 未旋转（0deg），确认按钮 MUST 可点击

#### Scenario: 分享配置
- **WHEN** 用户在霍金模拟器页触发分享
- **THEN** 分享 title MUST 为「霍金模拟器」，path MUST 指向 `/pages/hawking/index`

### Requirement: 白色内容区 30 度旋转一次性生效

用户点击确认后，系统 SHALL 将白色内容区（含自定义导航栏）整体旋转 30deg（`transform: rotate(30deg)`），旋转后 MUST NOT 提供撤销或恢复按钮。外层黑色 page 背景 MUST 可见，以形成「选中/倾斜」视觉对比。

#### Scenario: 确认后旋转
- **WHEN** 用户点击确认
- **THEN** 白色内容区 MUST 旋转 30deg，自定义导航栏 MUST 随内容区一起旋转

#### Scenario: 旋转不可撤销
- **WHEN** 旋转已生效
- **THEN** 页面 MUST NOT 提供恢复 0deg 的交互；用户仅可通过返回离开页面

#### Scenario: 黑底可见
- **WHEN** 旋转已生效
- **THEN** 旋转后露出的区域 MUST 显示黑色 page 背景
