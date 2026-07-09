## Context

百宝口袋采用「独立 Taro 页面 + 后端 Tool 表 seed」模式扩展工具。现有 `seed.ts` 对工具使用 `upsert` 且 `update` 块会写回 `heatScore`，导致重复执行 seed 会把用户使用后累积的热度重置为种子值。本次新增三个梗工具，需同时修正 seed 策略。

已有可参考实现：
- 假时钟 / RAF：`returnClock`
- 滑块 + 底部确认：`handsBarrage/edit`（ToolSliderRow、ToolBottomBar）
- 半屏 fixed 遮罩：`fingerUp`、`metronome`
- 整页旋转 + 黑底 + 自定义导航：`handsBarrage`、`fingerUp`

## Goals / Non-Goals

**Goals:**

- 实现三个一次性体验的梗工具页面及前后端注册
- seed 仅 **insert-if-not-exists**（按 `routePath`），保护已有工具的运行时数据
- 时间穿越：5–15s 滑块 + 假时钟快进 + 完成弹窗（无额外倒计时文案）
- 夏侯惇：确认后左半屏 `#000` 不透明蒙层，不可撤销
- 霍金：黑底 page + 白色内容区 `rotate(30deg)`，自定义导航栏随旋转层一起歪
- 三个工具均支持 `useShareAppMessage`

**Non-Goals:**

- 不改造已有工具的业务逻辑
- 不做夏侯惇/霍金的「恢复」按钮
- 不通过 seed 更新已有工具的名称、描述等元数据（如需更新走 migration 或手动 SQL）
- categories / levels 的 upsert 行为保持不变（与工具 seed 策略无关）

## Decisions

### 1. seed.ts：insert-only for tools

**选择**：工具循环改为「查存在 → 不存在则 create → 存在则 skip」。

```typescript
const existing = await prisma.tool.findUnique({ where: { routePath: tool.routePath } });
if (existing) continue;
await prisma.tool.create({ ... });
```

**理由**：用户明确要求不重置热度；`upsert` + 空 `update: {}` 虽 technically 不写 heat，但语义不清晰，且未来有人加 update 字段易踩坑。显式 skip 最安全。

**替代方案（未采用）**：
- `upsert` + `update` 排除 `heatScore` — 仍会覆盖 name/description/enabled 等
- 分离 `seed-tools.ts` 只跑新工具 — 过度工程

### 2. 时间穿越：假时钟快进，无倒计时文案

**选择**：复用 `returnClock` 的 RAF + 指针旋转，穿越期间 `fakeTime` 以加速倍率正向递增（视觉上秒针狂转），不显示「还剩 Xs」文字。

**状态机**：`idle → traveling → done（showModal）→ idle（关弹窗后重置）`

**生命周期**：`useDidHide` 暂停 RAF，`useDidShow` 恢复，避免切后台计时跳变。

### 3. 夏侯惇：左半屏 fixed 蒙层，一次性

**选择**：
```scss
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 50vw; height: 100vh;
  background: #000;
  z-index: 100;
  pointer-events: none;
}
```
确认后 `setActivated(true)`，无撤销 UI；用户返回上一页离开。

### 4. 霍金：旋转层包含自定义导航

**选择**：`navigationStyle: 'custom'`，结构与 `fingerUp`/`handsBarrage` 一致——外层黑底 wrapper，内层白色 screen + `transform: rotate(30deg)`，返回按钮放在旋转层内。

**config**：`pages/hawking/index.config.ts` 设 `navigationStyle: 'custom'`。

### 5. 路由与 seed 字段

| 工具 | routePath | iconKey | accent | category | heatScore（仅首次 insert） |
|------|-----------|---------|--------|----------|---------------------------|
| 时间穿越 | `/pages/timeTravel/index` | `timeTravel` | primary | fun | 400 |
| 夏侯惇模拟器 | `/pages/xiahouDun/index` | `xiahouDun` | secondary | fun | 380 |
| 霍金模拟器 | `/pages/hawking/index` | `hawking` | tertiary | fun | 360 |

`sortOrder` 接在现有工具之后（9、10、11）。

## Risks / Trade-offs

- **[Risk] seed 不再更新已有工具元数据** → 若改名/改描述需手动或单独 migration；可接受，符合「保护运行时数据」优先级
- **[Risk] 霍金 30° 旋转后内容裁切** → 外层 `overflow: hidden`，内层适当 padding
- **[Risk] 假时钟加速在低端机 RAF 掉帧** → 穿越时长仅 5–15s，可接受；必要时用倍率而非真实 1:1 秒
- **[Trade-off] 夏侯惇/霍金一次性** → 想再看需重新进入页面，符合产品决策

## Migration Plan

1. 先改 `mini-pocket-back` seed 逻辑并插入 3 条新 tool
2. 跑 `pnpm db:seed`（已有工具热度不变，仅新增 3 条）
3. 前端发版注册页面与 icon
4. 回滚：禁用 seed 中 3 条新 tool 的 `enabled: false` 或前端不下发 route

## Open Questions

（无——用户已确认交互决策）
