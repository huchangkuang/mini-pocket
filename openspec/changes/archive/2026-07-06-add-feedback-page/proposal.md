## Why

个人中心「意见反馈」与「关于工坊」菜单项目前仅展示占位 toast，用户无法提交问题或查看工坊信息。产品需要提供与设计稿对齐的意见反馈二级页，并将反馈数据持久化到后端；同时放开关于工坊入口（空壳页），便于后续迭代完整内容。

## What Changes

- 新增 `pages/feedback/index` 意见反馈页：反馈类型、内容（200 字）、可选图片（最多 3 张）、联系方式、提交按钮，对齐 Stitch/HTML 设计稿
- 新增 `pages/about/index` 关于工坊空壳页：原生导航栏 + 占位内容，供后续替换
- 个人中心菜单：保留「问题反馈/意见反馈」与「关于工坊」两项；**隐藏**「系统设置」（注释移除）
- 未登录用户点击「问题反馈/意见反馈」时 MUST 先引导登录，登录成功后进入反馈页
- 新增前端 `feedbackApi` 与 `POST /api/feedback` 后端接口（JWT 必填）；图片复用现有 `POST /api/storage/upload`
- 在 `app.config.ts` 注册上述两个新页面

## Capabilities

### New Capabilities

- `feedback-ui`: 意见反馈二级页 UI、表单校验、图片选择与提交流程、feedbackApi 客户端
- `about-workshop-ui`: 关于工坊空壳二级页 UI 与路由

### Modified Capabilities

- `mine-ui`: 菜单项缩减为两项；反馈入口登录门禁；反馈/关于跳转替代占位 toast
- `app-shell-navigation`: 注册 feedback、about 二级页；二级页不显示 BottomNav

## Impact

- **新增代码（mini-pocket）**: `src/pages/feedback/*`、`src/pages/about/*`、`src/services/feedbackApi.ts`、类型扩展于 `src/types/api.ts`
- **修改代码（mini-pocket）**: `src/pages/mine/index.tsx`、`src/pages/mine/constants.ts`、`src/app.config.ts`
- **新增代码（mini-pocket-back）**: `Feedback` Prisma model、`modules/feedback/*`、`POST /api/feedback`
- **复用**: `storageApi.uploadTempFile`、`useAuth`、`tokens.scss`、`BomFixed`
- **外部依赖**: mini-pocket-back 需 migration + 部署；微信开发者工具需后端可访问
