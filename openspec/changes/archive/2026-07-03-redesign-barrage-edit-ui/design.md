## Context

Taro 3.6 + React + SCSS 小程序。手持弹幕编辑页当前结构：

```
[系统导航栏] 弹幕编辑
  白卡片: 内容 Input + 形式 Picker
  [确认] 按钮
  ▼ 自定义（折叠）
    颜色 Modal(9色) + 字号/时间 Slider
```

业务逻辑已完整：state → JSON → `navigateTo` 展示页。展示页支持三种动画（scroll / bounce / static）及横屏旋转。

Stitch 设计稿提供 Bento 卡片布局 + Live Preview + 内联色板 + 固定底栏。用户决策：

- 三种弹幕形式 **全部保留**（滚动 / 抖动 / 静止）
- 颜色先按设计稿 7 色
- **保留系统导航栏**，不用自定义 TopBar
- **只改编辑页**，展示页不动
- **能抽通用组件就抽**

## Goals / Non-Goals

**Goals:**

- 完整还原 Stitch 弹幕编辑页 UI 结构与视觉层次
- Live Preview 实时联动所有配置项
- 沉淀 `toolEdit` 通用组件，API 简洁可复用
- 复用现有 design tokens（`tokens.scss`）
- 保持现有 JSON 传参格式与 `BarrageType` enum，展示页零改动

**Non-Goals:**

- 展示页 UI / 退出交互改造
- 自定义 TopBar 或 TabBar
- 扩展色板（9 色 Modal 或自定义取色）
- 分享、历史记录等 more 菜单功能
- 引入 Tailwind / Material Symbols

## Decisions

### D1: 保留系统导航栏

**选择**：继续使用 `index.config.ts` 的 `navigationBarTitleText: "弹幕编辑"`，不设置 `navigationStyle: custom`。

**理由**：用户明确不用自定义 TopBar；减少胶囊区适配工作量；内容区已足够承载 Stitch 设计主体。

### D2: 通用组件放在 `src/components/toolEdit/`

**选择**：6 个通用组件各独立目录，样式引用 `tokens.scss`：

| 组件 | 职责 |
|------|------|
| `ToolFormCard` | 白卡片容器：icon + 标题 + children |
| `SegmentedControl` | N 段切换，选中白底 primary 字 + shadow |
| `ColorSwatchGroup` | 标签 + 圆形色板 + primary 选中边框 |
| `ToolSliderRow` | 标签 + 当前值 + Slider，支持 disabled |
| `ToolTipCard` | primary/5 背景 + info 图标 + 提示文案 |
| `ToolBottomBar` | fixed 底栏 + 全宽 pill 主按钮 |

**理由**：后续「做决定」「节拍器」等工具编辑页可复用；与 Tab 页组件（`homeTopBar` 等）职责分离。

### D3: BarragePreview 独立组件

**选择**：`src/components/barragePreview/`，接收 preview props：

```typescript
type BarragePreviewProps = {
  text: string;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  barrageType: BarrageType;
  scrollTime: number;
};
```

**预览字号缩放**：预览区为 21:9 小窗，渲染时使用 `fontSize * PREVIEW_SCALE`（建议 0.4–0.5），避免文字溢出；展示页仍用真实 fontSize。

**动画**：
- scroll：`translateX` 循环动画，duration = scrollTime
- bounce：复用展示页 `aniShake` keyframes 简化版
- static：居中无动画

**LIVE PREVIEW badge**：左上角半透明 primary 标签。

### D4: 三模式 SegmentedControl

**选择**：3 段等宽 Segmented，映射现有 `BarrageType` enum：

| enum | 文案（更新） |
|------|-------------|
| `scroll` | 滚动弹幕 |
| `bounce` | 抖动文字 |
| `static` | 静止弹幕（原「打字版」） |

**联动**：
- 仅 `scroll` 模式启用滚动时间 Slider
- `bounce` / `static` 模式下 Slider disabled + opacity 0.4

### D5: 设计稿 7 色内联色板

```typescript
export const FONT_COLORS = ["#ffffff", "#fdd835", "#ff5252", "#40c4ff"];
export const BG_COLORS = ["#000000", "#0060a8", "#b7131a"];
```

**默认值**：字色 `#ffffff`、背景 `#000000`、字号 64、时间 5s。

移除 `AtModal` 颜色选择器；白色字色圆点加 outline 边框以保证可见性。

### D6: 布局结构

```
ScrollView (padding-bottom 留底栏空间)
├── BarragePreview
├── ToolFormCard: 弹幕内容 (Input + 0/20)
├── ToolFormCard: 弹幕形式 (SegmentedControl × 3)
├── grid 2列
│   ├── ToolFormCard: 颜色 (ColorSwatchGroup × 2)
│   └── ToolFormCard: 滑块 (ToolSliderRow × 2)
├── ToolTipCard
ToolBottomBar (fixed): 开始展示
```

2 列 grid 用 flex + `width: calc(50% - gap/2)`；极端窄屏可后续单列 fallback。

### D7: Slider 组件

**选择**：优先使用 `AtSlider` + SCSS 覆盖 track/thumb 样式对齐 Stitch；若样式受限再换原生 `Slider`。

### D8: 传参与跳转逻辑不变

```typescript
const data = { fontSize, fontColor, time, barrage, bgColor, barrageType };
Taro.navigateTo({
  url: `/pages/handsBarrage/index?data=${encodeURIComponent(JSON.stringify(data))}`,
});
```

按钮文案从「确认」改为「开始展示」，校验逻辑（空内容 / 超 20 字）保持不变。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 预览区 CSS 动画在小程序表现不一致 | 使用与展示页相同 keyframes；真机验证三种模式 |
| 预览字号与展示页观感差异 | PREVIEW_SCALE 系数；预览仅示意，展示页用真实值 |
| 2 列 Bento 在窄屏过挤 | rpx 间距 + 必要时单列 fallback |
| AtSlider 样式定制受限 | 备选原生 Slider + 外层样式 |
| 白色字色圆点在白底不可见 | 色板圆点统一加 `$color-outline-variant` 细边框 |

## Migration Plan

1. 新建 `toolEdit` + `barragePreview` 组件
2. 重写 edit 页面组装，保留 state 与 confirm 逻辑
3. 删除旧 SCSS（Modal、折叠自定义）
4. 更新 constants 色板与文案
5. `npm run build:weapp` 编译 + 真机预览三种模式

无数据迁移；无 API 变更；展示页无需同步发布。

## Open Questions

（无——探索阶段用户已确认全部决策）
