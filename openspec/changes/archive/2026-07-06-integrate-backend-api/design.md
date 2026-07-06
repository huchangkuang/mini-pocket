## Context

mini-pocket 是 Taro 3.6 微信小程序，当前数据全部本地化：`classify/constants.ts` 硬编码工具列表，`favoritesStore.ts` 用 `Taro.setStorageSync` 存收藏，`mine/index.tsx` 用 `useState` 模拟登录。

mini-pocket-back 提供 NestJS REST API（全局前缀 `/api`，端口 3035），统一响应 `{ code: 0, message, data }`。Seed 数据与前端 `classifyList` 字段对齐，但命名不同（`name/routePath/iconKey/heatScore` vs `text/path/icon/heatRank`）。

## Goals / Non-Goals

**Goals:**

- 建立可复用的 API 客户端层，供工坊、收藏、个人中心共用
- 工坊页工具列表与分类从后端动态加载，支持分类筛选与关键词搜索
- 已登录用户收藏与后端同步；未登录点击收藏引导登录
- 个人中心接入微信登录，展示后端返回的用户资料与收藏数
- API 失败时有合理降级与错误提示

**Non-Goals:**

- 不引入 axios 等额外 HTTP 库（使用 Taro 内置 `Taro.request`）
- 不实现登录后本地收藏合并上传（未登录收藏不做持久化）
- 不改造各工具子页面（弹幕、节拍器等）的业务逻辑
- 不共享 monorepo 类型包（手动维护 `src/types/api.ts`）
- 等级进度、活跃天数、已用工具数仍用 demo/占位（后端暂未提供）

## Decisions

### 1. HTTP 层：`Taro.request` 封装

**选择**: 在 `src/utils/request.ts` 封装 GET/POST/DELETE，自动拼接 `API_BASE_URL`、注入 `Authorization: Bearer <token>`、解包 `ApiResponse<T>`。

**备选**: 引入 axios — 增加包体积，Taro 环境适配成本更高，否决。

### 2. 环境配置：`defineConstants`

**选择**: 在 `config/dev.js` 设置 `API_BASE_URL: '"http://localhost:3035/api"'`，`config/prod.js` 留占位待部署域名填入。

**备选**: `.env` 文件 — Taro 项目惯例用 defineConstants，与现有 config 结构一致。

### 3. 字段映射：`iconKey` → 本地 SVG

**选择**: 新建 `src/utils/iconMap.ts`，维护 `Record<string, string>` 映射（与 seed 中 iconKey 一致：barrage、qrcode 等）。API 返回的 Tool 通过 mapper 转为页面使用的 `ToolItem` 形状。

**备选**: 后端返回 icon URL — 需 CDN 与额外存储，当前 seed 设计为 key，保持前端映射。

### 4. 工具列表：服务端筛选

**选择**: 分类切换、搜索输入时调用 `GET /api/tools?category=&keyword=&sort=heat`。后端已过滤 `enabled=false` 工具，前端可移除 `excludeClassifyList` 逻辑。

**备选**: 一次拉全量本地 filter — 工具数量少时可行，但后端已支持且分类筛选 spec 需变更，选服务端。

### 5. 收藏：登录门禁

**选择**: 未登录用户点击收藏 → `Taro.showModal` 提示登录，确认后跳转 mine 页或触发登录。已登录用户调用 `POST /api/favorites/toggle { routePath }`。收藏页仅已登录展示列表，未登录展示空状态 + 登录 CTA。

**备选**: 未登录继续本地 Storage — 与后端 JWT 模型冲突，登录后需合并逻辑，复杂度高，否决。

### 6. 认证：`Taro.login` + JWT 本地存储

**选择**: Token 存 `mini_pocket_auth_token`；`app.ts` 启动时若有 token 则 `GET /api/auth/me` 校验；401 清 token。登录流程：`Taro.login()` → `code` → `POST /api/auth/wechat/login`。

**备选**: 每次请求静默 re-login — 频繁调用微信接口，体验差。

### 7. 降级策略

**选择**: 工坊页 `GET /api/tools` 失败时 fallback 到本地 `classifyList` 并 toast 提示；收藏/登录接口失败仅 toast，不 fallback demo 数据。

## Risks / Trade-offs

- [微信合法域名] 真机/正式版需 HTTPS 域名 → 开发期开发者工具勾选「不校验合法域名」；上线前在微信公众平台配置
- [localhost 真机不可达] 本地调试需内网穿透或局域网 IP → dev 配置文档说明，tasks 含验证步骤
- [iconKey 遗漏] 后端新增工具但前端未加映射 → mapper 对未知 key 使用默认占位图标
- [快速连点收藏] 重复 toggle 请求 → toggle 时加 loading/disabled 防抖
- [JWT 过期] 用户无感知 → 401 统一清 token 并 toast「登录已失效」

## Migration Plan

1. 合并 API 客户端与类型定义（无用户可见变化）
2. 工坊页切 API（用户可见：列表来自服务端，分类筛选生效）
3. 登录与个人中心（用户可见：真实登录）
4. 收藏同步（用户可见：需登录才能收藏，数据云端保存）
5. 生产部署：填入 prod `API_BASE_URL`、配置微信 request 合法域名、确保后端 WECHAT_APP_ID 与小程序 appid 一致

回滚：保留 `classifyList` 常量不删除，request 层可通过 feature flag 或 revert 页面改动快速回退本地数据。

## Open Questions

- 生产环境 API 域名是否已确定？（tasks 中 prod 配置留占位）
- 等级进度、活跃天数等 stats 是否后续由后端扩展？（当前 mine 页保留 demo 占位）
