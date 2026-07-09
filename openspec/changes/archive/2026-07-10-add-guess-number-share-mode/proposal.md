## Why

当前猜数字游戏是单机模式——出题和猜测在同一设备上完成，这限制了它的使用场景。聚会场景下，真正有趣的是"我出一个数字，把题目分享给你，你来猜"。将猜数字升级为分享对战模式，让用户在微信聊天中直接完成出题→分享→猜题闭环，提升工具的社交属性和使用频率。

## What Changes

- 猜数字页面拆分为**出题者模式**和**猜题者模式**，根据 URL 是否携带 `gameId` 参数判断
- 出题者锁定目标数字后，调用后端 API 创建游戏会话，随后通过微信分享卡片携带 `gameId` 发给好友
- 猜题者通过分享进入后，从后端获取游戏信息（不含目标数字），提交猜测由服务端计算 A/B 结果
- 猜题者猜测历史由后端独立存储，不同猜题者互不影响
- 猜对（4A0B）后游戏结束，该猜题者再次进入展示胜利状态
- **BREAKING**: 单机双人轮流模式移除——锁定目标后不再展示本地猜测区，改为分享入口
- 新增 `src/services/gamesApi.ts`——游戏会话 API 封装
- 新增后端 API：`POST /api/games`、`GET /api/games/:gameId`、`POST /api/games/:gameId/guess`

## Capabilities

### New Capabilities

- `guess-number-game-sessions`: 猜数字游戏会话管理——创建游戏、获取游戏信息、提交猜测、多人独立猜测历史。涵盖后端 API 契约、前端 API 封装、游戏会话生命周期。

### Modified Capabilities

- `guess-number-ui`: UI 需求变更——新增出题者/猜题者双模式、分享入口按钮、猜题者胜利状态回显、出题人自猜拦截、多人独立猜测。

## Impact

- **前端**: `src/pages/guessNumber/index.tsx`（重大重构）、`src/pages/guessNumber/index.scss`（新增 UI）、新增 `src/services/gamesApi.ts`
- **后端**: 新增 3 个 API 端点（`/api/games` CRUD），涉及 games 表/集合的新增
- **类型**: `src/types/api.ts` 新增 `ApiGameInfo`、`ApiGameGuessResult` 等类型
- **无依赖变更**: 不影响现有其他工具页、不影响静默登录流程
