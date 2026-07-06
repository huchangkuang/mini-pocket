## Context

mini-pocket 为 Taro 3.6 微信小程序，个人中心（`pages/mine`）已有 MD3 design tokens（`tokens.scss`）、`MineMenuList` 与真实微信登录（`useAuth`）。菜单中 feedback/about 仍走占位 toast；系统设置尚未实现。

mini-pocket-back 为 NestJS + Prisma + MySQL 后端，已有 JWT 鉴权、`POST /storage/upload` 图片上传，尚无 feedback 模块。

用户已确认：
- 未登录点击反馈须先登录
- 反馈页使用原生导航栏
- 关于工坊建空壳页（用户下一步自行补 UI）
- 系统设置从菜单隐藏

## Goals / Non-Goals

**Goals:**

- 实现与设计稿对齐的意见反馈页（类型 pills、200 字内容、最多 3 张截图、选填联系方式、底部提交）
- 未登录用户从 mine 菜单进入反馈时引导登录
- 提交时：本地选图 → `uploadTempFile` → `POST /feedback` 持久化
- 关于工坊空壳页 + mine 菜单真实跳转
- 后端新增 Feedback 表与创建接口

**Non-Goals:**

- 关于工坊完整内容（版本历史、协议链接等）——仅空壳
- 系统设置页面
- 反馈管理后台 / 状态流转 UI
- 匿名反馈（须登录）
- 使用历史菜单项恢复

## Decisions

### D1: 反馈页导航 — 原生 navigationBar

**选择**: `navigationBarTitleText: "意见反馈"`，背景 `#f7f9fc`，不使用 custom NavBar。

**备选**: Custom 顶栏 — 更贴 mock，但增加胶囊适配代码；用户已选原生。

### D2: 登录门禁 — mine 菜单层拦截

**选择**: 在 `pages/mine/index.tsx` 的 `onItemClick` 中，当 `id === 'feedback' && !isLoggedIn` 时 `Taro.showModal` 引导登录，确认后 `login()`，成功再 `navigateTo`。

**备选**: 反馈页内检测 — 用户可能看到空白或闪屏；在入口拦截体验更好。

**参考**: 收藏页 guest 空状态 + login CTA 模式，但反馈采用 modal 更轻（菜单单行点击）。

### D3: 图片上传 — 提交时批量上传

**选择**: `chooseImage` 后仅存本地 `tempFilePaths` 预览；点击提交时依次 `uploadTempFile`，收集 `url` 数组传给 feedback API。

**备选**: 选图即上传 — 用户可能删图产生 OSS 垃圾。

**约束**: `storage/upload` 需 JWT，与「须登录」一致。

### D4: 反馈类型枚举

```typescript
type FeedbackType = 'feature' | 'performance' | 'style' | 'other';
// UI: 功能建议 | 性能问题 | 样式建议 | 其他
```

默认选中 `feature`。

### D5: 后端 — JWT 必填，单 POST 创建

**选择**: `POST /api/feedback`，`@UseGuards(JwtAuthGuard)`，body 含 type、content、contact?、imageUrls?（string[]，≤3）。

**Prisma**:

```prisma
enum FeedbackType { feature performance style other }
enum FeedbackStatus { pending processing resolved closed }

model Feedback {
  id        Int            @id @default(autoincrement())
  userId    Int            @map("user_id")
  user      User           @relation(...)
  type      FeedbackType
  content   String         @db.VarChar(200)
  contact   String?        @db.VarChar(100)
  imageUrls Json           @default("[]") @map("image_urls")
  status    FeedbackStatus @default(pending)
  createdAt DateTime       @default(now()) @map("created_at")
}
```

**备选**: OptionalJwt — 用户要求未登录须先登录，不需要匿名。

### D6: 关于页 — 最小空壳

**选择**: 原生导航栏「关于工坊」，展示 App 名「百宝口袋工坊」、占位文案「更多内容即将上线」，无业务逻辑。

**理由**: 用户下一步自行实现完整 UI；空壳保证路由与菜单可用。

### D7: 菜单 — 隐藏 settings

**选择**: 从 `mineMenuItems` 注释/移除 `settings` 项，保留 feedback + about。

### D8: 页面路径

```
pages/feedback/index   — 意见反馈
pages/about/index      — 关于工坊
```

注册于 `app.config.ts` 主包 pages 数组（非 subPackage）。

## Risks / Trade-offs

- [提交时多图上传慢] → 提交按钮 loading + 禁用重复点击；单张失败 toast 并中止
- [200 字与后端不一致] → 前后端均校验 maxlength/VarChar(200)
- [OSS 临时文件] → 沿用现有 storage 策略，feedback 存 url 非 temp path
- [about 空壳体验单薄] → 用户已知并计划下一步补全

## Migration Plan

1. 后端：Prisma migrate → 部署 API
2. 前端：注册页面 → mine 路由 → feedback UI → 联调
3. 回滚：移除 app.config 页面注册 + revert mine 菜单 handler；后端表可保留

## Open Questions

- 无（用户已确认登录策略、导航栏、about 空壳、settings 隐藏）
