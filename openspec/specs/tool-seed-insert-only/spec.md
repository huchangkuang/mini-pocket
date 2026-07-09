## ADDED Requirements

### Requirement: 工具 seed 仅插入不存在记录

`mini-pocket-back` 的 `prisma/seed.ts` 在处理 `tools[]` 时，SHALL 按 `routePath` 查询是否已存在记录。若已存在，MUST 跳过该条（不执行 update）。若不存在，MUST 执行 `create` 插入完整种子数据。

#### Scenario: 新工具首次 seed
- **WHEN** seed 执行且某 `routePath` 在数据库中不存在
- **THEN** 系统 MUST 插入该工具记录，包含 seed 中定义的 name、description、iconKey、accent、heatScore、enabled、sortOrder

#### Scenario: 已有工具重复 seed
- **WHEN** seed 执行且某 `routePath` 在数据库中已存在
- **THEN** 系统 MUST NOT 修改该记录的任何字段（含 heatScore、enabled、sortOrder、name 等）

#### Scenario: 热度累积不被重置
- **WHEN** 某工具在运行期间 heatScore 已通过 stats 接口递增，随后再次执行 seed
- **THEN** 该工具的 heatScore MUST 保持递增后的值不变
