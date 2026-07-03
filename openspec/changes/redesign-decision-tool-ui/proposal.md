## Why

「做个决定吧」工具页（`pages/doDescription`）仍沿用旧版绿色渐变视觉，与已落地的「百宝口袋工坊」MD3 设计体系（`tokens.scss`、工作坊首页）严重脱节，影响品牌一致性与使用体验。Stitch 已输出主页、编辑转盘、添加常用三页完整设计稿，需一次性对齐实现。

## What Changes

- 重构「做个决定吧」主页：当前问题卡片、MD3 配色转盘、GO 中心按钮、底部「开始抽取」CTA、最近常用列表（含空态）
- 重构编辑页（`edit?type=edit`）：Hero 区、问题卡片、选项列表、智能生成 banner（占位）、sticky 保存栏
- 重构添加常用页（`edit?type=add`）：决策主题输入、选项列表、装饰插图区、sticky 保存栏
- 删除交互从长按改为顶栏 `⋯` ActionSheet（选中常用项时可删除）
- 更新默认决策选项为：火锅、披萨、寿司、烤肉、面条、沙拉
- 旋转结束后展示结果：**暂不实现**，代码留 TODO
- 二级页**不显示**底部 Tab 导航

## Capabilities

### New Capabilities

- `decision-tool-ui`: 「做个决定吧」三页 UI 与交互——转盘主页、编辑转盘、添加常用，含 MD3 视觉、常用项管理入口、顶栏菜单删除

### Modified Capabilities

（无——本变更为工具子页 UI 改造，不修改 app-shell 或 product-prd 规范）

## Impact

- **页面**：`src/pages/doDescription/index.tsx`、`index.scss`、`index.config.ts`；`src/pages/doDescription/edit/index.tsx`、`index.scss`、`index.config.ts`
- **数据**：`src/pages/doDescription/store.ts`（默认 title/list 更新；存储结构不变）
- **组件**：可能新增 `OptionRow` 等同目录内联组件；复用 `AtIcon`、现有 SVG、`tokens.scss`
- **移除行为**：主页常用项长按删除；选中态 ✓ 标记改为 border 高亮
- **依赖**：无新 npm 依赖
- **平台约束**：不使用 Tailwind / Material Symbols；二级页无 BottomNav
