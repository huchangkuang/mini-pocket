## ADDED Requirements

### Requirement: 统一 HTTP 请求封装
系统 SHALL 在 `src/utils/request.ts` 基于 `Taro.request` 提供 GET、POST、PATCH、DELETE 方法，自动拼接 `API_BASE_URL` 与路径。

#### Scenario: 成功响应解包
- **WHEN** 后端返回 `{ code: 0, message: "ok", data: T }`
- **THEN** 请求方法 MUST resolve 为 `data` 字段值

#### Scenario: 业务错误抛出
- **WHEN** 后端返回 `code !== 0`
- **THEN** 请求方法 MUST reject 并携带 `message` 供上层展示 toast

### Requirement: JWT 自动注入
系统 SHALL 从本地 Storage 读取 token（key: `mini_pocket_auth_token`），在请求头附加 `Authorization: Bearer <token>`（当 token 存在时）。

#### Scenario: 已登录请求带 token
- **WHEN** 本地存在有效 token 且发起 API 请求
- **THEN** 请求 MUST 包含 Authorization Bearer 头

#### Scenario: 未登录请求不带 token
- **WHEN** 本地无 token
- **THEN** 请求 MUST NOT 包含 Authorization 头

### Requirement: 401 统一处理
系统 SHALL 在收到 HTTP 401 或业务码表示未授权时清除本地 token，并 reject 供上层引导重新登录。

#### Scenario: Token 失效
- **WHEN** API 返回 401
- **THEN** 系统 MUST 清除 `mini_pocket_auth_token` 并 reject

### Requirement: API 基础 URL 环境配置
系统 SHALL 通过 Taro `defineConstants` 注入 `API_BASE_URL`，dev 指向本地后端，prod 指向生产域名占位。

#### Scenario: 开发环境地址
- **WHEN** 以 development 模式构建
- **THEN** `API_BASE_URL` MUST 默认为 `http://localhost:3035/api`

### Requirement: API 类型定义
系统 SHALL 在 `src/types/api.ts` 定义与 mini-pocket-back 对齐的响应类型：`ApiResponse<T>`、`ApiTool`、`ApiCategory`、`ApiUser`、`ApiFavorite` 等。

#### Scenario: 工具类型字段
- **WHEN** 解析 `GET /api/tools` 响应
- **THEN** 类型 MUST 包含 `id`、`routePath`、`name`、`description`、`iconKey`、`accent`、`category`、`heat`、`heatScore`、`isFavorite`
