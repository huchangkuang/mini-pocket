## 1. 配置与页面骨架

- [x] 1.1 更新 `src/pages/returnClock/index.config.ts`：导航栏背景 #f7f9fc、`navigationBarTextStyle: "black"`，保留分享配置
- [x] 1.2 重写 `index.scss` 页面骨架：surface 背景、点阵纹理、flex 居中布局，引入 `tokens.scss`
- [x] 1.3 移除旧版深色拟物样式（#333 背景、重阴影边框）

## 2. 逆时针模拟钟

- [x] 2.1 重构钟面 DOM：576rpx 圆盘、径向渐变、白边、柔和阴影、primary 中心点
- [x] 2.2 数字 1-12 逆时针排列（角度 0, -30, -60 ... -330）
- [x] 2.3 三根指针负角度旋转（时/分/秒），秒针 secondary 红色
- [x] 2.4 移除旧版顺时针数字 SCSS `@for` 循环与拟物高光 overlay

## 3. 时间与状态

- [x] 3.1 实现 `fakeTime` ref + `requestAnimationFrame` delta 驱动，替换 `setInterval`
- [x] 3.2 添加数字时间展示（HH:MM:SS，96rpx tabular-nums）
- [x] 3.3 添加状态行（圆点 + 文案），reverse/accelerate 模式加 breathe 动画
- [x] 3.4 实现 `useDidHide` / `useDidShow` 或 cleanup 停止/恢复 rAF 循环

## 4. 三模式控制

- [x] 4.1 定义 FlowMode 类型：`reverse` | `accelerate` | `pause` | `normal`
- [x] 4.2 实现三按钮 grid：加速逆流 / 时空暂停 / 正常流动
- [x] 4.3 实现「加速逆流」两档逻辑：默认 reverse 1x，再点切换 accelerate 10x
- [x] 4.4 实现 pause（冻结）与 normal（正向 1x）模式切换
- [x] 4.5 从 pause/normal 点回「加速逆流」重置为 reverse 1x

## 5. 按钮视觉与交互

- [x] 5.1 激活态：primary 蓝底白字、无图标
- [x] 5.2 未激活态：浅色底 + 边框 + AtIcon 图标在上 + 文字在下
- [x] 5.3 所有按钮 `:active` scale 按压反馈

## 6. 清理与验证

- [x] 6.1 保留 `useShareAppMessage`，确认分享 title/path 不变
- [x] 6.2 确认页面不渲染 BottomNav
- [x] 6.3 运行 `npm run dev:weapp`，验证工作坊 → 反方向的钟链路
- [x] 6.4 验证默认 1x 逆流、10x 加速切换、暂停、正常流动四种行为
- [x] 6.5 验证页面切换后 rAF 正确停止与恢复
