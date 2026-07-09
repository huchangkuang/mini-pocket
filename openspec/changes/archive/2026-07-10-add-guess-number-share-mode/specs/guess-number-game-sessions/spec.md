## ADDED Requirements

### Requirement: 创建游戏会话

系统 SHALL 提供 `POST /api/games` 端点，出题者锁定目标数字后调用，创建新的游戏会话。请求 MUST 携带 Bearer token，body 包含 `targetNumber`（四位数字字符串，允许重复数字）。

#### Scenario: 成功创建游戏
- **WHEN** 已登录用户提交 `{ targetNumber: "1234" }` 到 `POST /api/games`
- **THEN** 系统 MUST 哈希存储目标数字，返回 `201` 及 `{ gameId: string, createdAt: ISO8601, status: "waiting" }`

#### Scenario: 未登录用户创建游戏
- **WHEN** 未登录用户（无 token）请求 `POST /api/games`
- **THEN** 系统 MUST 返回 `401`

#### Scenario: 目标数字不合法
- **WHEN** 用户提交非四位数字字符串（如 `"12"`, `"abc"`, `"12345"`）
- **THEN** 系统 MUST 返回 `400` 及错误信息

### Requirement: 获取游戏信息

系统 SHALL 提供 `GET /api/games/:gameId` 端点，猜题者进入后获取游戏元信息。响应 MUST NOT 包含目标数字。响应 MUST 包含当前用户的猜测历史（若有）。

#### Scenario: 猜题者获取游戏信息
- **WHEN** 已登录用户请求 `GET /api/games/:gameId`
- **THEN** 系统 MUST 返回 `{ gameId, creator: { nickname, avatarUrl }, status, guessCount, createdAt }` 及当前用户的猜测历史 `myHistory: Array<{ guess, result, attemptNumber }>`

#### Scenario: 出题人获取自己创建的游戏
- **WHEN** 出题人请求自己创建的游戏 `GET /api/games/:gameId`
- **THEN** 系统 MUST 返回游戏信息，且 `isCreator: true`

#### Scenario: 游戏不存在
- **WHEN** 用户请求不存在的 `gameId`
- **THEN** 系统 MUST 返回 `404`

### Requirement: 提交猜测

系统 SHALL 提供 `POST /api/games/:gameId/guess` 端点，猜题者提交四位数字猜测。服务端 MUST 计算 A/B 结果并与目标数字比对。系统 MUST 持久化每次猜测记录。

#### Scenario: 正确猜测（4A0B）
- **WHEN** 猜题者提交 `{ guess: "1234" }` 且 guess 与目标数字完全相同
- **THEN** 系统 MUST 返回 `{ result: "4A0B", attemptNumber: N, won: true, history: [...] }`

#### Scenario: 部分正确猜测
- **WHEN** 猜题者提交 `{ guess: "1243" }` 且目标数字为 `1234`
- **THEN** 系统 MUST 返回 `{ result: "2A2B", attemptNumber: N, won: false, history: [...] }`

#### Scenario: 全部不匹配
- **WHEN** 猜题者提交 `{ guess: "5678" }` 且目标数字为 `1234`
- **THEN** 系统 MUST 返回 `{ result: "0A0B", attemptNumber: N, won: false, history: [...] }`

#### Scenario: 猜题者已猜对后再次提交
- **WHEN** 猜题者已经在该游戏会话中猜对（4A0B），再次提交猜测
- **THEN** 系统 MUST 返回 `400` 及 `{ message: "你已经猜对了！" }`

#### Scenario: 出题人尝试猜自己的题
- **WHEN** 出题人请求 `POST /api/games/:gameId/guess` 尝试猜自己创建的题目
- **THEN** 系统 MUST 返回 `403` 及 `{ message: "不能猜自己出的题" }`

#### Scenario: 猜测数字不合法
- **WHEN** 用户提交非四位数字字符串
- **THEN** 系统 MUST 返回 `400`

### Requirement: 多人独立猜测

系统 SHALL 允许多个不同用户针对同一个 `gameId` 各自独立猜测，互不影响。每个用户的猜测次数和结果 MUST 独立存储和返回。

#### Scenario: 多人各自猜同一题
- **WHEN** 用户 A 和用户 B 分别对同一 `gameId` 提交猜测
- **THEN** 用户 A 的猜测次数和历史 MUST 独立于用户 B，互不可见

#### Scenario: 一人猜对不影响其他人
- **WHEN** 用户 A 猜对（4A0B）后，用户 B 继续对同一 `gameId` 提交猜测
- **THEN** 系统 MUST 允许用户 B 继续猜测，用户 B 的 `won` 字段仅基于自己的猜测记录

### Requirement: A/B 计算逻辑

系统 SHALL 使用 Bulls and Cows 算法计算猜测结果：第一遍计数位置和数字均匹配（A），第二遍计数数字匹配但位置不匹配（B）。计算时 MUST 对已匹配位置进行标记以避免重复计数。系统 MUST 允许目标数字含重复数字（如 `1122`）。

#### Scenario: 目标含重复数字
- **WHEN** 目标数字为 `1122`，猜测为 `1212`
- **THEN** 结果 MUST 为 `2A2B`（位置1和4精确匹配=2A，位置2的数字2和位置3的数字1各错位=2B）

#### Scenario: 不含重复数字
- **WHEN** 目标数字为 `1234`，猜测为 `5678`
- **THEN** 结果 MUST 为 `0A0B`
