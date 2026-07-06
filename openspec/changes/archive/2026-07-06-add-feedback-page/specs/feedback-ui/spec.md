## ADDED Requirements

### Requirement: 意见反馈页结构与视觉
系统 SHALL 在 `pages/feedback/index` 渲染与设计稿对齐的表单：反馈类型（4 个 pill 单选）、反馈内容（Textarea，最多 200 字，实时字数）、上传图片（可选，最多 3 张）、联系方式（选填 Input）、底部 info 提示框、固定底部提交按钮。页面 MUST 使用 MD3 design tokens（`tokens.scss`）。

#### Scenario: 页面默认态
- **WHEN** 已登录用户进入意见反馈页
- **THEN** 页面 MUST 显示原生导航栏标题「意见反馈」、默认选中「功能建议」类型、内容字数为 0/200、图片区显示添加入口

#### Scenario: 反馈类型切换
- **WHEN** 用户点击某一反馈类型 pill
- **THEN** 该 pill MUST 以 primary 实心样式显示为选中态，其他 pill MUST 恢复未选中样式

#### Scenario: 字数统计
- **WHEN** 用户在反馈内容 Textarea 输入文字
- **THEN** 字数计数 MUST 实时更新为 `{n}/200`

### Requirement: 图片选择与预览
系统 SHALL 允许用户通过 `Taro.chooseImage` 从相册或相机选择 JPG/PNG 图片，最多 3 张；已选图片 MUST 在网格中预览，每张 MUST 提供删除操作。

#### Scenario: 添加截图
- **WHEN** 用户点击「添加截图」且当前图片数小于 3
- **THEN** 系统 MUST 调起选图，成功后 MUST 在网格中显示缩略图

#### Scenario: 已达上限
- **WHEN** 用户已上传 3 张图片
- **THEN** 添加入口 MUST 隐藏或不可点击

#### Scenario: 删除已选图片
- **WHEN** 用户点击某张预览图的删除按钮
- **THEN** 该图片 MUST 从待提交列表移除

### Requirement: 表单校验与提交
系统 SHALL 在提交时校验：反馈内容 trim 后非空且不超过 200 字；图片不超过 3 张。提交过程中 MUST 显示 loading 并禁用重复提交。

#### Scenario: 内容为空
- **WHEN** 用户点击提交且反馈内容为空
- **THEN** 系统 MUST toast 提示填写反馈内容，MUST NOT 发起 API 请求

#### Scenario: 提交成功
- **WHEN** 用户填写有效内容并提交成功
- **THEN** 系统 MUST toast「感谢您的反馈」并 `navigateBack` 返回上一页

#### Scenario: 提交失败
- **WHEN** 上传或 `POST /api/feedback` 失败
- **THEN** 系统 MUST toast 展示错误信息，MUST 允许用户重试

### Requirement: 反馈 API 客户端
系统 SHALL 在 `src/services/feedbackApi.ts` 提供 `submitFeedback(data)`，调用 `POST /api/feedback`，请求 MUST 携带 JWT。Payload MUST 包含 `type`、`content`、可选 `contact`、可选 `imageUrls`（string 数组，最多 3 个 URL）。

#### Scenario: 已登录提交
- **WHEN** 用户提交反馈且 token 有效
- **THEN** 客户端 MUST 先上传本地图片获取 URL，再 POST feedback 并解包 `{ code: 0, data }` 响应

#### Scenario: 401 处理
- **WHEN** 提交或上传返回 401
- **THEN** 系统 MUST 按现有 request 层逻辑清除 token 并提示重新登录

### Requirement: 后端创建反馈接口
mini-pocket-back SHALL 提供 `POST /api/feedback`，使用 `JwtAuthGuard`，接受 body：`type`（feature|performance|style|other）、`content`（1–200 字符）、可选 `contact`（≤100 字符）、可选 `imageUrls`（string 数组，≤3）。成功时 MUST 返回 `{ id, createdAt }` 并持久化至 `feedbacks` 表，关联当前 userId。

#### Scenario: 有效请求
- **WHEN** 已认证用户提交合法 feedback body
- **THEN** 服务 MUST 创建记录，status 为 pending，并返回 id 与 createdAt

#### Scenario: 内容过长
- **WHEN** content 超过 200 字符
- **THEN** 服务 MUST 返回 400 及错误信息

#### Scenario: 图片过多
- **WHEN** imageUrls 数组长度大于 3
- **THEN** 服务 MUST 返回 400 及错误信息

#### Scenario: 未认证
- **WHEN** 请求无有效 JWT
- **THEN** 服务 MUST 返回 401
