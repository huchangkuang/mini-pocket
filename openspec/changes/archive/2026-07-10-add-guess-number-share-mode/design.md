## Context

猜数字当前是纯前端单机游戏（`src/pages/guessNumber/index.tsx`），所有状态用 `useState` 管理，出题和猜题在同一设备轮流完成。小程序已有全局静默登录（`app.ts` → `restoreSession()`），所有 API 请求通过 `src/utils/request.ts` 统一注入 Bearer token。

本次改造将游戏拆分为**出题者**（创建游戏会话 → 分享）和**猜题者**（通过分享进入 → 提交猜测）两个角色，游戏状态从本地迁移到后端。项目首次引入"通过分享携带业务参数"的模式。

## Goals / Non-Goals

**Goals:**
- 出题者锁定目标 → 可本地单机猜题（保留原有玩法），点击「分享给好友」按钮才创建游戏会话 → 通过微信分享发送 gameId 给好友
- 猜题者从分享进入 → 从后端获取游戏信息 → 提交猜测 → 展示 A/B 结果
- 猜对（4A0B）后游戏结束，该猜题者再次打开展示胜利状态
- 多人可各自独立猜同一个 gameId，猜测历史互不影响
- 出题者不能猜自己的题（服务端 403 拦截）
- 猜题者进入时等待静默登录完成再调用 API

**Non-Goals:**
- 不出"我的游戏列表"页
- 不做实时进度同步（出题者看不到猜题者的猜测过程）
- 不做 WebSocket / 长轮询
- 不设游戏过期时间（除非后续运营需要）
- 不改变数字重复规则（仍允许 `1122`）

## Decisions

### D1: 模式判断——URL query param `gameId`

通过 Taro 路由参数 `gameId` 判断当前页面模式：

- **无 `gameId`** → 出题者模式（锁定后可本地猜题 + 分享按钮）
- **有 `gameId`** → 猜题者模式（从 API 加载游戏）

`useShareAppMessage` 中动态拼接 `path: /pages/guessNumber/index?gameId=<gameId>`。

**Alternatives considered**:
- 两个独立页面 → 维护成本高，出题/猜题共享大量 UI 组件
- path 使用子路径 → Taro 路由配置复杂，不如 query param 简洁

### D0: 游戏会话创建时机——分享按钮点击时

锁定目标数字后**不立即**创建游戏会话。出题者锁定后仍可本地单机猜题（保留原有玩法）。页面展示「分享给好友」按钮，点击时调用 `POST /api/games` 创建游戏会话。创建成功后展示分享引导卡片，`useShareAppMessage` 动态携带 `gameId`。

**Rationale**: 
- 保留单机猜题场景——锁定目标后不分享也能玩
- 减少不必要 API 调用——用户可能只是自己玩
- 分享=显式意图，此时创建游戏最合适

**Alternatives considered**:
- 锁定即创建 → 浪费 API 资源，破坏了原有的单机体验

### D2: 猜题者等待静默登录——使用 `isSessionReady`

猜题者进入时（`onLoad` 或首次渲染）拿到 `gameId` 后不立即调 API，先检查 `useAuth().isReady`。App 级 `restoreSession()` 和页面渲染是并行的，存在 token 尚未就绪的窗口。

- 页面渲染后等待 `isReady === true`，然后调用 `GET /api/games/:gameId`
- 等待期间展示 loading 态（骨架或空白，不展示错误）
- 若 `isReady` 已是 true（热启动场景），直接调用 API

**Alternatives considered**:
- 在页面层再调一次 `restoreSession()` → 重复调用，浪费请求
- 不做等待，依赖 request 的 401 重试 → 用户体验差

### D3: A/B 计算在服务端

猜题者提交猜测后，**由服务端计算 A/B 结果**。目标数字存储在服务端，不对猜题者暴露。

```
POST /api/games/:gameId/guess { guess: "1234" }
→ 服务端: calculateA_B(targetNumber, guess)
→ 返回: { result: "2A1B", won: false, history: [...] }
```

猜题者**永远无法从前端 API 响应中获取目标数字**。

**Alternatives considered**:
- 目标数字加密后返回前端，前端计算 → 有逆向风险，且逻辑冗余
- WebSocket 实时计算 → 非 MVP 范围

### D4: 多人猜测独立存储

同一个 `gameId`，不同用户（基于 token/openid 区分）各自维护独立猜测历史：

```
game_sessions 表:
  gameId (PK)  |  creatorId  |  targetNumber (hashed)  |  createdAt

game_guesses 表:
  guessId (PK)  |  gameId (FK)  |  userId  |  guess  |  result  |  createdAt
```

每个用户的猜测次数、历史由 `WHERE gameId = ? AND userId = ?` 隔离。

### D5: 出题人自猜拦截

服务端在 `POST /api/games/:gameId/guess` 中检查 `req.user.id === game.creatorId`，若相等返回 HTTP 403 `{ code: 403001, message: "不能猜自己出的题" }`。前端对 403 做 toast 提示。

### D6: 前端状态管理

出题者模式仍使用 `useState`（目标数字、锁定状态、gameId、分享状态），不引入状态管理库。

猜题者模式新增 state：
- `gameInfo: ApiGameInfo | null`（游戏元信息，含出题人昵称）
- `gameState: "loading" | "waiting_session" | "ready" | "won" | "error"`
- `guessHistory: ApiGuessRecord[]`（猜测历史，从 API 返回）
- `currentGuess: string[]`（当前输入，复用现有 guessNumber state）

### D7: 分享交互

- 出题者锁定目标 + 创建游戏成功后，在目标数字区下方展示分享引导卡片：「分享给好友，让TA来猜！」
- 卡片包含操作提示：点击右上角 `···` 或原生分享按钮
- `useShareAppMessage` 在锁定成功后动态更新 path：

```tsx
useShareAppMessage(() => {
  if (!gameId) return { title: "猜数字游戏", path: "/pages/guessNumber/index" };
  return {
    title: "来猜我出的数字吧！",
    path: `/pages/guessNumber/index?gameId=${gameId}`,
  };
});
```

### D8: 猜对后再进入

猜题者猜对后再次打开同一个分享卡片：
- `GET /api/games/:gameId` 返回该用户的猜测历史，包含最后一条 `result: "4A0B"`
- 前端检测到该用户已猜对 → 展示胜利状态页（不展示猜测输入区）→ 显示"你已经猜对了！用了 N 次"
- 用户仍然可以点击分享把游戏转发给其他人

## Risks / Trade-offs

- **[风险] 猜题者进入时 token 未就绪** → 用 `isSessionReady` 等待（D2），超时 5s 后展示"登录中，请稍后重试"
- **[风险] 目标数字服务端明文存储** → 建议哈希存储（bcrypt/scrypt），A/B 计算时逐位比对而非解密。注意：目标只有 4 位数字（最多 10000 种组合），哈希容易彩虹表攻击 → 可接受，因为游戏性质非安全敏感，且服务端可加 rate limiting
- **[风险] 多人同时猜无竞争** → 各猜各的，无状态冲突，天然无竞争条件
- **[权衡] 单文件 vs 拆分组件** → 保持 D1 决策（单文件内聚），出题者和猜题者逻辑通过条件分支而非独立组件处理。代码量预估从 ~300 行增长到 ~500 行，仍在可维护范围内。若未来更复杂再拆分
