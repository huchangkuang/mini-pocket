## MODIFIED Requirements

### Requirement: PRD 基线文档覆盖核心产品信息
系统 MUST 提供一份项目级 PRD 基线文档，完整描述产品目标、用户场景、功能地图、优先级与非功能要求，用于后续需求迭代前的统一对齐。产品正式名称为「百宝口袋工坊」（原「简易口袋」），首页入口为「工作坊」Tab 壳层。

#### Scenario: 生成 PRD 基线初版
- **WHEN** 团队发起「为现有 Taro 小程序建立产品基线文档」的变更
- **THEN** 文档 SHALL 包含产品定位、目标用户、典型使用场景、页面能力清单与业务边界

#### Scenario: PRD 包含迭代评估所需信息
- **WHEN** 团队评估新增功能需求
- **THEN** 文档 MUST 能支撑范围评估、优先级判断和回归影响识别

## ADDED Requirements

### Requirement: 应用全局品牌名称一致
系统 SHALL 在所有用户可见入口使用统一产品名称「百宝口袋工坊」。

#### Scenario: 小程序窗口标题
- **WHEN** 用户查看小程序全局配置
- **THEN** `app.config.ts` 中 `navigationBarTitleText` 或等效配置 MUST 为「百宝口袋工坊」

#### Scenario: 工作坊顶栏标题
- **WHEN** 用户打开工作坊页
- **THEN** HomeTopAppBar MUST 显示「百宝口袋工坊」
