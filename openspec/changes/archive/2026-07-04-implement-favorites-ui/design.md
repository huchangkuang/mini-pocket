## Context

Taro 3.6 + React + SCSS 小程序。收藏页当前复用 `HomeTopBar` + 简单 emptyState 文案。工作坊页已有 MD3 Token（`tokens.scss`）、`CategoryChips`、`BottomNav` 等组件。

Stitch 提供两套收藏页设计：
1. **列表态**：顶栏 + 搜索 + Chips + 横向收藏卡列表（3 张 demo）
2. **空状态态**：同款顶栏 + 心形放大镜插图 + 文案 +「去发现」按钮

**用户决策**：
- 首版默认展示 demo 卡（现有工具映射），后续只换数据源
- Demo 数据来自 `classifyList` 中已有工具，不用虚构 JSON/AI 工具
- 顶栏左侧 `>_` 终端：占位 toast
- 筛选 tune：占位 toast

## Goals / Non-Goals

**Goals:**
- 完整还原 Stitch 收藏页 UI 结构与视觉层次
- Demo 数据层与 UI 层分离，便于 Phase 2 接 storage
- 搜索 / Chips 对 demo 列表本地过滤
- 取消收藏（♥）从列表移除，空时切空状态
- 空状态插图与文案对齐新 Stitch 稿
- 复用现有 design tokens 与 BottomNav

**Non-Goals:**
- 工作坊页添加「收藏」入口
- `Taro.setStorage` 持久化收藏
- 筛选 tune 的真实排序/分组逻辑
- 终端按钮业务功能
- 收藏页 FAB

## Decisions

### D1: 专用 FavoritesTopBar，不复用 HomeTopBar

**选择**：新建 `favoritesTopBar`（或通用 `tabPageHeader`）。

**布局**：
```
[ >_ ]  收藏                    [ tune ]
```

**理由**：收藏页顶栏是 Tab 内页标题模式，与工作坊品牌顶栏职责不同。

### D2: Demo 数据从 classifyList 派生

**选择**：`pages/favorites/constants.ts` 定义 `demoFavoriteIds` 或完整 `demoFavorites` 数组，字段扩展：

```typescript
type FavoriteDemoItem = ToolItem & {
  id: string;
  tag: string;              // 展示用，如 "PRODUCTIVITY"
  favoriteCategory: 'dev' | 'efficiency' | 'fun';
};
```

**首版 demo 3 条（现有工具）**：
| 工具 | path | favoriteCategory | tag |
|---|---|---|---|
| 二维码生成 | `/pages/qrcode/index` | efficiency | PRODUCTIVITY |
| 指尖轮盘 | `/pages/fingerUp/index` | fun | ENTERTAINMENT |
| 做个决定吧 | `/pages/doDescription/index` | fun | ENTERTAINMENT |

**理由**：用户要求用现有工具；3 条足够展示列表 UI，且覆盖 efficiency + fun 两类 filter。

### D3: 收藏页 Chips 独立常量

```typescript
export const favoriteFilterChips = [
  { id: 'all', label: '全部' },
  { id: 'dev', label: '开发工具' },
  { id: 'efficiency', label: '效率办公' },
  { id: 'fun', label: '趣味生成' },
];
```

复用 `CategoryChips` 组件，传入不同 chips 数组。

### D4: FavoriteCard 横向布局

与工作坊 `ToolCard`（竖向 Bento）分离：

```
┌─────────────────────────────────────┐
│ [icon 64] │ 标题              ♥    │
│           │ 描述                  │
│           │ [TAG]                 │
└─────────────────────────────────────┘
```

- 爱心：`AtIcon heart`，secondary 色；点击 `onUnfavorite`
- 卡片点击：`navigateTo(path)`
- `:active` scale 0.96

### D5: 双态切换逻辑

```typescript
const [favorites, setFavorites] = useState(demoFavorites);
const filtered = applySearchAndChip(favorites, query, chip);

// 渲染
favorites.length === 0 ? <FavoritesEmpty /> : (
  filtered.length === 0 ? <NoResults /> : <FavoriteCardList />
);
```

- **全局空**（favorites 被删光）：Stitch 空状态 + 去发现
- **过滤空**（有数据但搜索/筛选无匹配）：轻提示「无匹配结果」（可选，首版可简化为空列表区域）

首版默认 `useState(demoFavorites)` 非空，开发时可切 `[]` 验证空状态。

### D6: 空状态视觉（新 Stitch 稿）

- 插图：本地 SVG（心形 + 放大镜），不用外链 Google 图
- 标题：**还没有收藏的工具**
- 描述：**去工作坊逛逛，发现让你心动的百宝工具吧！**
- CTA：**去发现** → `Taro.reLaunch({ url: '/pages/classify/index' })`

### D7: 搜索框实现

使用 Taro `Input`，左侧搜索图标，placeholder「搜索我的收藏工具...」。

`onInput` 更新 query state，filter 函数匹配 `text + desc`。

### D8: 占位交互

| 控件 | 行为 |
|---|---|
| 终端 `>_` | `errorToast('更多功能正在开发中...')` |
| 筛选 tune | 同上 |
| ♥ 取消收藏 | 从 state 移除该项 |

## Risks / Trade-offs

| 风险 | 缓解 |
|---|---|
| demo 与真数据字段不一致 | 复用 `ToolItem` 类型并只扩展 favorite 字段 |
| 开发工具类 demo 为空 | Chips 可切换至「开发工具」显示空列表；可接受 |
| HomeTopBar 误复用 | 收藏页移除 HomeTopBar，换 FavoritesTopBar |
| 空状态插图体积 | 优先 SVG，单文件 < 10KB |

## Migration Plan

1. 新增组件与 constants
2. 重构 favorites 页
3. 验证：demo 列表、搜索、筛选、取消收藏→空状态、去发现、工具跳转
4. 后续 change：工作坊加收藏入口 + storage

## Open Questions

- 「开发工具」类 demo 是否补一条工具映射——首版允许该 Chip 过滤结果为空
- 过滤无结果时是否单独文案——首版可实现简单「无匹配收藏」提示
