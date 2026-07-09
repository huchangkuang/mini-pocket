## Why

百宝口袋工坊需要扩充「娱乐梗工具」品类，提供轻交互、强视觉的趣味体验。三个新工具（时间穿越、夏侯惇模拟器、霍金模拟器）与现有「反方向的钟」形成时光/视觉主题互补，丰富工坊内容并提升分享传播潜力。

## What Changes

- 新增工具页 `pages/timeTravel/index`：用户选择 5–15 秒穿越时长，确认后假时钟快进动画，结束后弹窗「你已经穿越至 xs 后」
- 新增工具页 `pages/xiahouDun/index`：确认后在屏幕左半覆盖不透明黑色蒙层（一次性，不可撤销）
- 新增工具页 `pages/hawking/index`：确认后 page 黑底、白色内容区旋转 30°，自定义导航栏随内容一起旋转（一次性）
- 三个工具均配置 `useShareAppMessage` 分享
- 前端注册：`app.config.ts`、`classify/constants.ts`、`iconMap.ts` + 对应 SVG 图标
- 后端 `mini-pocket-back` 的 `prisma/seed.ts` 新增三条 Tool 记录（category: fun）
- **改造 seed 逻辑**：已存在的工具（按 `routePath` 匹配）跳过，仅插入新工具；**不覆盖**已有记录的 `heatScore` 及其他运行时字段

## Capabilities

### New Capabilities

- `time-travel-ui`: 「时间穿越」单页——时长滑块、假时钟穿越动画、完成弹窗
- `xiahou-dun-ui`: 「夏侯惇模拟器」单页——确认后左半屏黑色蒙层（一次性）
- `hawking-ui`: 「霍金模拟器」单页——黑底白屏 30° 旋转 + 自定义导航栏（一次性）
- `tool-seed-insert-only`: 后端 seed 策略——已有工具 skip，仅 insert 新工具，保护 heatScore

### Modified Capabilities

（无——不修改 app-shell 或现有工具规范）

## Impact

- **前端页面**：`src/pages/timeTravel/`、`src/pages/xiahouDun/`、`src/pages/hawking/`（各含 index.tsx、index.scss、index.config.ts）
- **前端注册**：`src/app.config.ts`、`src/pages/classify/constants.ts`、`src/utils/iconMap.ts`、`src/images/classify/*.svg`
- **后端**：`mini-pocket-back/apps/api/prisma/seed.ts`（新增 3 条 tool seed）
- **依赖**：复用现有 `toolEdit` 组件（ToolSliderRow、ToolBottomBar 等）与 `returnClock` 时钟逻辑；霍金页参考 `fingerUp`/`handsBarrage` 自定义导航与旋转模式
- **数据**：无新 API；收藏/统计/XP 通过现有 `openToolPage` + `routePath` 自动关联
