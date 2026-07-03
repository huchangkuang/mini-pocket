## 1. 通用工具编辑组件

- [x] 1.1 新建 `src/components/toolEdit/toolFormCard/`（icon + title + children，tokens 样式）
- [x] 1.2 新建 `src/components/toolEdit/segmentedControl/`（N 段切换，选中/未选中态）
- [x] 1.3 新建 `src/components/toolEdit/colorSwatchGroup/`（label + 圆点色板 + 选中边框）
- [x] 1.4 新建 `src/components/toolEdit/toolSliderRow/`（label + 值 + Slider + disabled）
- [x] 1.5 新建 `src/components/toolEdit/toolTipCard/`（info 图标 + 提示文案）
- [x] 1.6 新建 `src/components/toolEdit/toolBottomBar/`（fixed 底栏 + pill 主按钮）

## 2. 弹幕预览组件

- [x] 2.1 新建 `src/components/barragePreview/`（21:9 预览区 + LIVE PREVIEW badge）
- [x] 2.2 实现三种预览动画：scroll / bounce / static，联动 scrollTime
- [x] 2.3 实现预览字号缩放系数（PREVIEW_SCALE），避免小窗溢出

## 3. 常量与数据

- [x] 3.1 更新 `src/pages/handsBarrage/constants.ts`：FONT_COLORS、BG_COLORS 7 色常量
- [x] 3.2 更新 barrageTypeMap：static 文案改为「静止弹幕」

## 4. 编辑页重构

- [x] 4.1 重写 `src/pages/handsBarrage/edit/index.tsx`：组装 Preview + ToolFormCard + Segmented + 色板 + 滑块 + Tip + BottomBar
- [x] 4.2 保留现有 state 结构与 confirm 校验/跳转逻辑，按钮改为「开始展示」
- [x] 4.3 实现 Segmented 三模式联动：非 scroll 时禁用滚动时间 Slider
- [x] 4.4 移除 AtModal 颜色选择器、折叠「自定义」区块、旧 Picker 形式选择
- [x] 4.5 重写 `src/pages/handsBarrage/edit/index.scss`：Bento 双列布局、ScrollView 底栏留白、tokens 对齐

## 5. 验证

- [x] 5.1 运行 `npm run build:weapp` 编译通过
- [x] 5.2 确认 Live Preview 随输入/颜色/字号/形式实时更新
- [x] 5.3 确认三种弹幕形式切换与滚动时间禁用联动正确
- [x] 5.4 确认「开始展示」校验与 JSON 跳转展示页正常
- [x] 5.5 确认展示页（index）未被修改
