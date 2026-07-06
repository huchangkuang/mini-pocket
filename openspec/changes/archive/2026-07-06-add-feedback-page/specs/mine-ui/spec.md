## MODIFIED Requirements

### Requirement: 菜单列表两项可跳转
系统 SHALL 展示菜单：问题反馈（未登录）或意见反馈（已登录）、关于工坊，每项带图标与 chevron。系统设置 MUST NOT 出现在菜单中。

#### Scenario: 菜单项展示
- **WHEN** 用户查看个人中心菜单
- **THEN** 页面 MUST 展示上述两项菜单行，MUST NOT 展示系统设置

#### Scenario: 未登录点击反馈
- **WHEN** 未登录用户点击「问题反馈」
- **THEN** 系统 MUST 弹出登录引导（showModal 或等效），用户确认后 MUST 触发登录流程；登录成功后 MUST 导航至意见反馈页

#### Scenario: 已登录点击反馈
- **WHEN** 已登录用户点击「意见反馈」
- **THEN** 系统 MUST 直接 `navigateTo` 意见反馈页

#### Scenario: 点击关于工坊
- **WHEN** 用户点击「关于工坊」
- **THEN** 系统 MUST `navigateTo` 关于工坊页，MUST NOT 显示占位 toast

## REMOVED Requirements

### Requirement: 菜单列表四项占位
**Reason**: 使用历史已移除；系统设置隐藏；反馈与关于改为真实页面跳转
**Migration**: 由「菜单列表两项可跳转」替代；反馈/关于行为见 feedback-ui 与 about-workshop-ui spec

#### Scenario: 菜单点击占位
- **WHEN** 用户点击反馈或关于菜单项
- **THEN** （已移除）原占位 toast 行为不再适用
