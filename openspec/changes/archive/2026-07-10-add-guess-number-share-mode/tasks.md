## 1. 类型定义与 API 封装

- [x] 1.1 在 `src/types/api.ts` 新增游戏相关类型（`ApiGameInfo`、`ApiGuessRecord`、`ApiGameGuessResult`、`ApiCreateGameResult`）
- [x] 1.2 新建 `src/services/gamesApi.ts`，封装 `createGame`、`getGameInfo`、`submitGuess` 三个 API 方法

## 2. 猜数字页面重构

- [x] 2.1 页面增加 `gameId` 路由参数读取，根据是否存在 `gameId` 分支为出题者模式/猜题者模式
- [x] 2.2 猜题者模式：进入后等待 `isSessionReady`，然后调用 `GET /api/games/:gameId` 加载游戏信息，处理 loading / 超时 / 错误状态
- [x] 2.3 猜题者模式：展示出题人信息（昵称+"邀请你猜一个四位数"），若 `isCreator: true` 则 toast 提示并切换出题者视角
- [x] 2.4 出题者模式：锁定目标后调用 `POST /api/games` 创建游戏会话，获取 `gameId`
- [x] 2.5 出题者模式：锁定并创建游戏成功后，展示分享引导卡片（"分享给好友，让TA来猜！"）
- [x] 2.6 猜题者模式：提交猜测改为调用 `POST /api/games/:gameId/guess`，展示服务端返回的 A/B 结果
- [x] 2.7 猜题者模式：`won: true` 时弹出胜利 Modal，确认后保持胜利状态（隐藏猜测输入区，展示已完成标识）
- [x] 2.8 猜题者模式：再次进入已猜对的游戏（历史含 4A0B），直接展示胜利状态，不展示猜测输入区
- [x] 2.9 猜题者模式：处理 API 403（自猜拦截），toast "不能猜自己出的题"，保留猜测输入
- [x] 2.10 更新 `useShareAppMessage`：出题者锁定后动态携带 `gameId` 和邀请标题；猜题者转发携带 `gameId`

## 3. UI 样式

- [x] 3.1 出题者分享引导卡片样式（MD3 surface-container，含图标和文案）
- [x] 3.2 猜题者模式出题人信息区域样式
- [x] 3.3 猜题者 loading / 超时 / 错误状态样式
- [x] 3.4 猜题者胜利状态回显样式（含完成标识，替代猜测输入区）

## 4. 边界情况与集成测试

- [x] 4.1 出题者模式：创建游戏失败时的错误处理与重试
- [x] 4.2 猜题者模式：游戏不存在（404）时的提示
- [x] 4.3 猜题者模式：游戏已猜对后再提交猜测（400）的处理
- [x] 4.4 猜题者模式：网络异常时猜测提交失败，保留输入不清空
- [x] 4.5 出题者在锁定前触发分享的兜底逻辑
