## Why

mini-pocket-back 后端 API（工具列表、分类、微信登录、收藏）已就绪，但小程序前端仍使用硬编码 `classifyList` 与本地 Storage 管理收藏/登录态，数据无法跨设备同步，也无法由后端统一管控工具上下架。现在需要将前端接入后端，使工坊、收藏、个人中心具备真实数据能力。

## What Changes

- 新增 HTTP 请求层（基于 `Taro.request`），统一解包 `{ code, data, message }` 响应格式，支持 JWT Bearer 注入
- 新增环境配置：`API_BASE_URL` 通过 `defineConstants` 区分 dev/prod
- 工坊页（classify）从 `GET /api/tools`、`GET /api/categories` 拉取工具与分类，分类 Chips 与搜索改为服务端筛选
- 收藏功能：已登录用户调用 `GET/POST /api/favorites/*` 同步云端；未登录用户点击收藏时提示登录
- 个人中心：使用 `Taro.login` + `POST /api/auth/wechat/login` 实现真实微信登录，`GET /api/auth/me` 展示用户资料与收藏统计
- 保留 `iconKey → 本地 SVG` 映射层，图标仍在前端 bundle 内
- 请求失败时降级：工具列表可 fallback 到本地 `classifyList`（离线/开发容错）

## Capabilities

### New Capabilities

- `api-client`: HTTP 基础设施——请求封装、JWT 存储、错误处理、API 类型定义

### Modified Capabilities

- `home-workshop-ui`: 工具列表与分类改从后端获取；分类 Chips 启用真实筛选；收藏状态来自 API
- `favorites-ui`: 已登录时从后端加载/操作收藏；未登录展示空状态或引导登录
- `mine-ui`: 替换 demo 登录切换为真实微信登录与用户资料展示

## Impact

- **新增代码**: `src/utils/request.ts`、`src/services/*`、`src/hooks/useAuth.ts`、`src/utils/iconMap.ts`、`src/types/api.ts`
- **修改页面**: `pages/classify/index.tsx`、`pages/favorites/index.tsx`、`pages/mine/index.tsx`
- **修改 hooks/store**: `useFavorites.ts`、`favoritesStore.ts`（降级为未登录提示或移除 demo 逻辑）
- **配置**: `config/dev.js`、`config/prod.js` 注入 `API_BASE_URL`
- **外部依赖**: mini-pocket-back 服务（默认 `http://localhost:3035/api`），微信小程序需配置 request 合法域名
- **参考项目**: `/Users/qiexuxing/Project/mini-pocket-back`
