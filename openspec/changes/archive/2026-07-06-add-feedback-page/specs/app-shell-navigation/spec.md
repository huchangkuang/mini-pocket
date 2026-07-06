## ADDED Requirements

### Requirement: 反馈与关于二级页注册
系统 SHALL 在 `app.config.ts` 的 pages 数组中注册 `pages/feedback/index` 与 `pages/about/index`。

#### Scenario: 导航至反馈页
- **WHEN** 应用已编译且用户触发反馈页路由
- **THEN** Taro MUST 能成功加载 `pages/feedback/index`，MUST NOT 报 page not found

#### Scenario: 导航至关于页
- **WHEN** 应用已编译且用户触发关于页路由
- **THEN** Taro MUST 能成功加载 `pages/about/index`，MUST NOT 报 page not found

#### Scenario: 二级页无 BottomNav
- **WHEN** 用户位于反馈页或关于页
- **THEN** 页面 MUST NOT 显示 BottomNav，MUST 使用原生返回或 navigateBack
