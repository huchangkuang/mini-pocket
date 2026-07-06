## 1. 路由与菜单入口（mini-pocket）

- [x] 1.1 在 `app.config.ts` 注册 `pages/feedback/index` 与 `pages/about/index`
- [x] 1.2 从 `mineMenuItems` 注释/移除 `settings` 项，保留 feedback 与 about
- [x] 1.3 改造 `pages/mine/index.tsx`：`onItemClick` 分发 feedback（未登录 modal 引导 login → navigateTo）、about（直接 navigateTo）

## 2. 关于工坊空壳页（mini-pocket）

- [x] 2.1 创建 `pages/about/index.tsx`、`index.scss`、`index.config.ts`（原生导航栏「关于工坊」）
- [x] 2.2 实现占位 UI：App 名称、简短说明文案，使用 `tokens.scss`

## 3. 后端 Feedback 模块（mini-pocket-back）

- [x] 3.1 在 `schema.prisma` 新增 `FeedbackType`、`FeedbackStatus` enum 与 `Feedback` model，User 增加关联
- [x] 3.2 运行 `db:migrate` 或 `db:push` 生成数据库表
- [x] 3.3 创建 `modules/feedback/`：dto、service、controller、`POST /feedback`（JwtAuthGuard）
- [x] 3.4 在 `app.module.ts` 注册 FeedbackModule
- [x] 3.5 校验：content 1–200 字、imageUrls ≤3、type 枚举合法

## 4. 前端 API 层（mini-pocket）

- [x] 4.1 在 `src/types/api.ts` 新增 `FeedbackType`、`ApiSubmitFeedbackResult` 等类型
- [x] 4.2 创建 `src/services/feedbackApi.ts`：`submitFeedback({ type, content, contact?, imageUrls? })`

## 5. 意见反馈页 UI（mini-pocket）

- [x] 5.1 创建 `pages/feedback/index.config.ts`（原生导航栏「意见反馈」，背景 #f7f9fc）
- [x] 5.2 创建 `pages/feedback/index.tsx` + `index.scss`：类型 pills、Textarea 200 字计数、联系方式 Input、info 提示框
- [x] 5.3 实现图片网格：`chooseImage` 选图、预览、删除、最多 3 张
- [x] 5.4 使用 `BomFixed` 固定底部提交按钮（send 图标 +「提交」）
- [x] 5.5 实现提交逻辑：校验 → 批量 `uploadTempFile` → `submitFeedback` → 成功 toast + navigateBack
- [x] 5.6 提交中 loading/disabled，失败 errorToast

## 6. 联调与验证

- [x] 6.1 未登录点击「问题反馈」→ modal → 登录 → 进入反馈页
- [x] 6.2 已登录直接进反馈页，提交纯文字反馈成功
- [x] 6.3 提交带 1–3 张图片的反馈，数据库记录 imageUrls 正确
- [x] 6.4 点击「关于工坊」进入空壳页，无 BottomNav
- [x] 6.5 菜单不显示「系统设置」
