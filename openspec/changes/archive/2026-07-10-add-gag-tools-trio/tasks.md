## 1. 后端 seed 改造与新工具注册

- [x] 1.1 修改 `mini-pocket-back/apps/api/prisma/seed.ts`：工具循环改为 `findUnique` → 存在则 skip，不存在则 `create`
- [x] 1.2 在 `tools[]` 追加三条新记录：timeTravel、xiahouDun、hawking（category: fun，sortOrder 9–11）
- [x] 1.3 本地执行 `pnpm db:seed` 验证：已有工具 heatScore 不变，新工具成功插入

## 2. 时间穿越工具页

- [x] 2.1 创建 `src/pages/timeTravel/index.tsx`、`index.scss`、`index.config.ts`
- [x] 2.2 实现 ToolSliderRow（5–15s）+ ToolBottomBar 确认 + 假时钟（复用 returnClock RAF 模式，正向加速）
- [x] 2.3 实现 traveling 状态：禁用控件、无倒计时文案、完成后 showModal「你已经穿越至 {n}s 后」并重置
- [x] 2.4 添加 `useShareAppMessage` 与 `useDidHide`/`useDidShow` 生命周期

## 3. 夏侯惇模拟器工具页

- [x] 3.1 创建 `src/pages/xiahouDun/index.tsx`、`index.scss`、`index.config.ts`
- [x] 3.2 实现确认按钮 + 左半屏 fixed 黑色蒙层（50vw，一次性，无撤销）
- [x] 3.3 添加 `useShareAppMessage`

## 4. 霍金模拟器工具页

- [x] 4.1 创建 `src/pages/hawking/index.tsx`、`index.scss`、`index.config.ts`（`navigationStyle: 'custom'`）
- [x] 4.2 实现黑底 page + 白色内容区，确认后整体 rotate(30deg)，自定义导航栏在旋转层内
- [x] 4.3 添加 `useShareAppMessage` 与返回按钮（参考 fingerUp）

## 5. 前端注册与图标

- [x] 5.1 在 `src/app.config.ts` 注册三个新页面路由
- [x] 5.2 在 `src/pages/classify/constants.ts` 的 `classifyList` 添加三条 fallback
- [x] 5.3 新增 SVG 图标并更新 `src/utils/iconMap.ts`（timeTravel、xiahouDun、hawking）

## 6. 验证

- [x] 6.1 三个工具可从工坊列表进入并正常交互
- [x] 6.2 再次执行 seed 确认已有工具热度未被重置
- [x] 6.3 分享、收藏、使用统计链路正常（openToolPage + routePath）
