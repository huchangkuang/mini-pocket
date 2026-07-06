## ADDED Requirements

### Requirement: 关于工坊空壳页
系统 SHALL 在 `pages/about/index` 提供关于工坊二级页，使用原生导航栏标题「关于工坊」，展示 App 名称「百宝口袋工坊」及占位说明文案（如「更多内容即将上线」）。页面 MUST NOT 包含复杂业务逻辑。

#### Scenario: 进入关于页
- **WHEN** 用户从个人中心点击「关于工坊」
- **THEN** 系统 MUST 通过 `Taro.navigateTo` 进入关于页并显示上述占位内容

#### Scenario: 原生导航栏
- **WHEN** 用户查看关于页
- **THEN** 页面 MUST 使用微信原生 navigationBar，背景色与项目 surface 一致（#f7f9fc）

#### Scenario: 无 BottomNav
- **WHEN** 用户位于关于页
- **THEN** 页面 MUST NOT 显示 BottomNav
