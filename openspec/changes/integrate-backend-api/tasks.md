## 1. API 基础设施

- [x] 1.1 在 `config/dev.js` 与 `config/prod.js` 的 `defineConstants` 中添加 `API_BASE_URL`
- [x] 1.2 创建 `src/types/api.ts`，定义 `ApiResponse`、`ApiTool`、`ApiCategory`、`ApiUser`、`ApiFavorite` 等类型
- [x] 1.3 创建 `src/utils/request.ts`：封装 GET/POST/PATCH/DELETE、JWT 注入、响应解包、401 清 token
- [x] 1.4 创建 `src/utils/authStore.ts`：token 与 user profile 的读写
- [x] 1.5 创建 `src/utils/iconMap.ts`：iconKey 到本地 SVG import 的映射

## 2. API Service 层

- [x] 2.1 创建 `src/services/toolsApi.ts`：`listTools(query)`、`getTool(id)`
- [x] 2.2 创建 `src/services/categoriesApi.ts`：`listCategories()`
- [x] 2.3 创建 `src/services/authApi.ts`：`wechatLogin(code)`、`getMe()`、`updateProfile()`
- [x] 2.4 创建 `src/services/favoritesApi.ts`：`listFavorites(query)`、`toggleFavorite(routePath)`、`removeFavorite(toolId)`
- [x] 2.5 创建 `src/utils/toolMapper.ts`：ApiTool → ToolItem 转换（含 icon 映射）

## 3. 认证 Hook

- [x] 3.1 创建 `src/hooks/useAuth.ts`：登录态、user、login、logout、refreshProfile
- [x] 3.2 在 `src/app.ts` 启动时调用 token 校验恢复登录态

## 4. 工坊页接入

- [x] 4.1 创建 `src/hooks/useTools.ts`：加载工具列表、分类筛选、搜索、loading/error 状态
- [x] 4.2 改造 `pages/classify/index.tsx`：从 API 加载工具与分类，启用分类 Chips 筛选
- [x] 4.3 搜索框 debounce 后带 `keyword` 请求 API
- [x] 4.4 API 失败时 fallback 到 `classifyList` 并 toast
- [x] 4.5 改造 `useFavorites.ts`：已登录调 API toggle，未登录弹登录引导

## 5. 收藏页接入

- [x] 5.1 改造 `pages/favorites/index.tsx`：已登录从 API 加载收藏，未登录展示空状态 + 登录引导
- [x] 5.2 取消收藏调用 API 并刷新列表
- [x] 5.3 移除或降级 `favoritesStore.ts` demo 逻辑（保留类型与 mapper 若需）

## 6. 个人中心接入

- [x] 6.1 改造 `pages/mine/index.tsx`：接入 `useAuth`，替换 demo toggle
- [x] 6.2 登录按钮触发 `Taro.login` + `authApi.wechatLogin`
- [x] 6.3 已登录展示 API 用户资料与 `stats.favoriteCount`
- [x] 6.4 退出登录清除 token 与用户态

## 7. 验证与文档

- [x] 7.1 本地启动 mini-pocket-back（`pnpm dev`）并 seed 数据库
- [x] 7.2 微信开发者工具验证：工具列表、分类筛选、搜索、登录、收藏 toggle
- [x] 7.3 确认 dev 环境「不校验合法域名」下 localhost 请求正常
