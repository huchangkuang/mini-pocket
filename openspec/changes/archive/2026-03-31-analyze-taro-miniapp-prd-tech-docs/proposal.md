## Why

当前项目已经包含多个 Taro 小程序工具页（手持弹幕、做决定、二维码、节拍器、拼豆图等），但缺少统一的产品与技术基线文档，导致后续需求迭代在范围定义、优先级评估、改造影响分析上成本较高。现在补齐 PRD 与技术文档，可以将“现状能力 + 演进边界 + 实施约束”沉淀为可复用资产，降低新增需求的不确定性。

## What Changes

- 基于现有代码结构和已上线能力，新增一份项目级 PRD 基线文档，覆盖目标用户、核心场景、功能地图、非功能要求与迭代建议。
- 新增一份项目级技术文档，覆盖架构分层、页面/组件/工具模块关系、关键技术选型、平台能力依赖、构建与发布流程、风险与治理建议。
- 将“文档如何持续维护”纳入需求，明确新增页面、关键逻辑变化和依赖调整时的文档更新触发机制。
- 将文档标准化为后续需求评审输入，作为新功能立项、技术方案评审和回归验证的前置依据。

## Capabilities

### New Capabilities
- `product-prd-baseline`: 定义并维护当前小程序产品能力基线（目标、场景、功能、约束、迭代方向）的规范化文档能力。
- `technical-doc-baseline`: 定义并维护当前小程序技术实现基线（架构、模块、依赖、构建、质量与风险）的规范化文档能力。

### Modified Capabilities
- None.

## Impact

- Affected code: `src/app.ts`, `src/app.config.ts`, `src/pages/**`, `src/components/**`, `src/utils/**`, `config/**`（用于文档分析输入，不涉及运行时代码改动）。
- Affected systems: OpenSpec 变更目录将新增 proposal/design/specs/tasks 文档，作为后续 `/opsx:apply` 的执行依据。
- APIs/dependencies: 不新增运行时依赖；仅梳理现有 Taro、taro-ui、exceljs、dayjs 等依赖在功能中的使用边界。
- Process impact: 后续新增需求需要先对齐该 PRD/技术基线，再进入实现阶段，减少需求-实现偏差。
