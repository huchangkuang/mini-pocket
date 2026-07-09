## MODIFIED Requirements

### Requirement: 猜数字页展示 MD3 完整结构

系统 SHALL 在 `pages/guessNumber/index` 根据 URL query 参数 `gameId` 是否存在渲染不同模式：
- **无 `gameId`（出题者模式）**：游戏规则卡片、目标数字区（未锁定/已锁定两态）、分享引导卡片（锁定后）
- **有 `gameId`（猜题者模式）**：游戏规则卡片、出题人信息区、猜测数字卡片、历史猜测列表

页面 MUST NOT 在同一模式下同时展示出题区和猜题区。页面背景色 MUST 为 surface（#f7f9fc）。页面 MUST NOT 渲染 BottomNav 或自定义 TopBar 设置入口。

#### Scenario: 无 gameId 展示出题者模式
- **WHEN** 用户从工作坊进入猜数字游戏（无 `gameId` 参数）
- **THEN** 页面 MUST 展示目标数字设置区和游戏规则卡片，MUST NOT 展示猜测区（锁定前）或分享引导区（锁定前）

#### Scenario: 有 gameId 展示猜题者模式
- **WHEN** 用户通过分享卡片进入（URL 含 `gameId` 参数）
- **THEN** 页面 MUST 展示出题人信息和猜测数字卡片，MUST NOT 展示目标数字设置区

#### Scenario: 二级页无 Tab 栏
- **WHEN** 用户位于猜数字游戏页
- **THEN** 页面 MUST NOT 显示底部 Tab 导航

#### Scenario: 无设置入口
- **WHEN** 用户位于猜数字游戏页
- **THEN** 页面 MUST NOT 显示设置齿轮或等效设置入口

### Requirement: 目标数字设置与锁定

系统 SHALL 提供目标数字区（仅出题者模式）：未锁定时展示 4 格数字输入与「锁定目标」按钮；用户输入完整四位数字并点击「锁定目标」后 MUST 锁定目标、隐藏锁定按钮、显示「已锁定」徽章，并将 4 格改为虚线边框 `*` 掩码展示。锁定后系统 MUST 调用 `POST /api/games` 创建游戏会话并获取 `gameId`。系统 MUST 允许四位数字重复（如 `1122`），不对唯一性做校验。

#### Scenario: 输入并锁定目标
- **WHEN** 用户输入完整四位目标数字并点击「锁定目标」
- **THEN** 目标 MUST 被锁定，显示「已锁定」徽章与 `*` 掩码，系统 MUST 调用 API 创建游戏会话，分享引导区 MUST 出现

#### Scenario: 创建游戏失败
- **WHEN** 锁定目标后 API 调用失败（网络错误或服务端错误）
- **THEN** 系统 MUST Toast 提示「创建游戏失败，请重试」，目标 MUST 保持锁定状态，用户 MUST 可重新触发创建

#### Scenario: 未完整输入时锁定
- **WHEN** 用户点击「锁定目标」但目标数字不足四位
- **THEN** 系统 MUST Toast 提示「请输入完整的四位数」且 MUST NOT 锁定

#### Scenario: 允许重复数字
- **WHEN** 用户输入目标数字 `1122` 并锁定
- **THEN** 系统 MUST 成功锁定，MUST NOT 因重复数字拒绝

### Requirement: 猜测数字输入与验证

系统 SHALL 在猜题者模式下展示猜测数字卡片：4 格数字输入（当前输入位 primary 描边高亮）、全宽胶囊「验证」按钮（含 check 图标）。用户点击验证时 MUST 校验四位完整，MUST 调用 `POST /api/games/:gameId/guess` 提交猜测，MUST 在收到响应后追加至本地历史并清空猜测输入。服务端返回的 A/B 结果 MUST 直接用于展示，前端不再本地计算。

#### Scenario: 验证猜测
- **WHEN** 用户输入完整四位猜测并点击「验证」
- **THEN** 系统 MUST 调用 API 提交猜测、追加历史记录、清空猜测输入

#### Scenario: 未完整猜测
- **WHEN** 用户点击「验证」但猜测不足四位
- **THEN** 系统 MUST Toast 提示「请输入完整的四位数」

#### Scenario: API 调用失败
- **WHEN** 提交猜测时 API 返回错误（如网络异常）
- **THEN** 系统 MUST Toast 提示错误信息，MUST NOT 追加历史记录，猜测输入 MUST 保留

### Requirement: 胜利 Modal 与重新开始

系统 SHALL 在猜题者模式的猜测响应中 `won: true` 时弹出 Modal，标题祝贺、内容展示使用次数，确认按钮文案为「知道了」；用户确认后 MUST 关闭 Modal，页面保持胜利状态（不展示猜测输入区，展示已完成标识）。出题者模式 MUST NOT 展示胜利 Modal（出题者不猜题）。系统 MUST NOT 以页内 gameOver 区块作为主要胜利反馈。

#### Scenario: 猜对弹出 Modal
- **WHEN** 猜题者验证猜测且 API 返回 `won: true`
- **THEN** 系统 MUST 弹出 Modal 显示祝贺与次数，MUST NOT 仅依赖 Toast

#### Scenario: 确认后保持胜利状态
- **WHEN** 用户在胜利 Modal 点击「知道了」
- **THEN** 系统 MUST 关闭 Modal，猜测输入区 MUST 消失，展示「你已经猜对了！用了 N 次」状态

#### Scenario: 猜题者再次进入已猜对的游戏
- **WHEN** 猜题者通过分享卡片再次进入已猜对的游戏（历史记录含 4A0B）
- **THEN** 页面 MUST 直接展示胜利状态，MUST NOT 展示猜测输入区，MUST NOT 弹出 Modal

### Requirement: 分享能力保留

系统 SHALL 保留猜数字页的 `useShareAppMessage` 分享能力。出题者模式下，分享 path MUST 携带当前游戏的 `gameId`（格式：`/pages/guessNumber/index?gameId=<gameId>`），分享标题 MUST 为「来猜我出的数字吧！」。猜题者模式下，分享 MUST 仍可用，path 携带当前 `gameId`（允许多人继续转发）。系统 MUST 在 `gameId` 尚未创建时（锁定前/创建失败）使用兜底分享内容。

#### Scenario: 出题者分享携带 gameId
- **WHEN** 出题者锁定目标并成功创建游戏后触发分享
- **THEN** 分享 MUST 携带 `gameId` 参数和邀请标题

#### Scenario: 猜题者转发分享
- **WHEN** 猜题者触发分享
- **THEN** 分享 MUST 携带当前 `gameId`，允许转发给更多人

#### Scenario: 创建游戏前分享兜底
- **WHEN** 用户在锁定目标前或游戏创建失败时触发分享
- **THEN** 分享 MUST 使用标题「猜数字游戏」和路径 `/pages/guessNumber/index`（无 gameId）

## ADDED Requirements

### Requirement: 猜题者等待登录完成

系统 SHALL 在猜题者模式下，进入页面后先检查 `isSessionReady` 状态，等待静默登录完成后再调用 `GET /api/games/:gameId`。等待期间 MUST 展示 loading 状态（骨架屏或加载指示器），MUST NOT 展示错误信息。若超过 5 秒仍 `isReady !== true`，MUST 展示「登录中，请稍后重试」提示。

#### Scenario: 正常等待登录
- **WHEN** 猜题者通过分享进入且 `isSessionReady` 短时间内变为 true
- **THEN** 页面 MUST 在登录完成后自动调用 API 加载游戏信息，MUST 不展示错误提示

#### Scenario: 登录超时
- **WHEN** 猜题者进入后 5 秒内 `isSessionReady` 仍未变为 true
- **THEN** 页面 MUST 展示「登录中，请稍后重试」提示

#### Scenario: 热启动直接可用
- **WHEN** 猜题者通过分享进入且 `isSessionReady` 已为 true（热启动）
- **THEN** 页面 MUST 直接调用 API 加载游戏信息，MUST NOT 展示 loading

### Requirement: 出题者分享引导

系统 SHALL 在出题者锁定目标并成功创建游戏会话后，在目标数字区下方展示分享引导卡片。卡片 MUST 包含邀请文案和操作提示。系统 MUST 在游戏创建失败或尚未创建时 MUST NOT 展示此引导卡片。

#### Scenario: 锁定后展示分享引导
- **WHEN** 出题者锁定目标并成功创建游戏
- **THEN** 目标数字区下方 MUST 展示分享引导卡片

#### Scenario: 未锁定不展示
- **WHEN** 出题者尚未锁定目标
- **THEN** 页面 MUST NOT 展示分享引导卡片

### Requirement: 猜题者出题人信息展示

系统 SHALL 在猜题者模式加载游戏信息成功后，在页面顶部展示出题人信息（昵称、头像），格式为「{昵称} 邀请你猜一个四位数」。若 `GET /api/games/:gameId` 返回 `isCreator: true`，MUST Toast 提示「这是你出的题！」并切换到出题者模式视角。

#### Scenario: 展示出题人信息
- **WHEN** 猜题者成功加载游戏信息
- **THEN** 页面 MUST 展示出题人昵称和邀请文案

#### Scenario: 出题人打开自己的分享
- **WHEN** 出题人通过自己的分享卡片进入，API 返回 `isCreator: true`
- **THEN** 系统 MUST Toast 提示「这是你出的题！」，页面 MUST 切换为出题者视角（展示目标掩码和分享引导，不展示猜测区）

### Requirement: 出题人自猜拦截

系统 SHALL 在猜题者提交猜测时，若 API 返回 HTTP 403（出题人不能猜自己的题），前端 MUST Toast 提示「不能猜自己出的题」，猜测输入 MUST 保留，MUST NOT 追加历史记录。

#### Scenario: 自猜被拦截
- **WHEN** 出题人以某种方式进入猜题画面并提交猜测
- **THEN** 系统 MUST Toast 提示「不能猜自己出的题」，猜测输入保留
