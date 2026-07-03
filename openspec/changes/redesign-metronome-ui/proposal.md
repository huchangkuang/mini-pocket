## Why

节拍器工具页（`pages/metronome`）仍沿用旧版 `#333` 深色表单布局，与已落地的「百宝口袋工坊」MD3 设计体系（`tokens.scss`、工作坊首页及已 redesign 的工具页）严重脱节。Stitch 已输出完整二级页设计稿（中央 BPM Dial、预设卡片、反馈开关、FAB 播放），需对齐实现以统一品牌体验并提升节拍调节的可视化与易用性。

## What Changes

- 重构节拍器单页 UI：浅色 MD3 背景、圆角节拍胶囊指示器、中央 BPM 大数字 Dial（含 SVG 进度弧与 ± 微调按钮）
- 常用节拍从 Picker 改为 4 张预设卡片（60/72/84/120）+「查看全部」半屏列表面板（展示完整 `CommonBeatList`，因微信 ActionSheet 最多 6 项）
- 自定义频率改为 MD3 卡片式输入（保留 1–208 校验）
- 新增声音提示与震动反馈开关（默认声音开、震动关；状态持久化至 localStorage）
- 播放控制从小图标改为底部悬浮 FAB（播放/暂停切换）
- 播放中允许调整 BPM（变更后自动重启节拍计时）
- 更新原生导航栏为浅色（`#f7f9fc`）
- 二级页**不显示**底部 Tab 导航
- 顶栏 `⋯`/`⚙` **首版不实现**（保留现有 `useShareAppMessage` 分享能力）

## Capabilities

### New Capabilities

- `metronome-ui`: 节拍器二级页 MD3 UI 与交互——节拍可视化、BPM Dial、预设与自定义频率、声音/震动开关、FAB 播放

### Modified Capabilities

（无——本变更为工具子页 UI 改造，不修改 app-shell 或 product-prd 规范）

## Impact

- **页面**：`src/pages/metronome/index.tsx`、`index.scss`、`index.config.ts`
- **常量**：`src/pages/metronome/constant.ts`（新增 4 预设常量；保留 `CommonBeatList` 供 ActionSheet）
- **存储**：新增 localStorage key 持久化声音/震动开关（无 schema 破坏性变更）
- **移除行为**：Picker 选择常用频率；播放时锁定输入的 disabled 逻辑
- **依赖**：无新 npm 依赖；使用 `Taro.vibrateShort` 实现震动
- **平台约束**：不使用 Tailwind / Material Symbols / Google Fonts；二级页无 BottomNav；尺寸使用 rpx + `tokens.scss`
