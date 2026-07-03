## 1. 配置

- [x] 1.1 更新 `index.config.ts`：导航栏背景 #f7f9fc，`navigationBarTextStyle: 'black'`，标题「猜数字游戏」

## 2. 样式重构（index.scss）

- [x] 2.1 引入 `tokens.scss`，重写页面根样式：surface 背景、margin-mobile padding
- [x] 2.2 实现游戏规则 info 卡片：圆角白底、info 图标区、A primary / B secondary 色强调
- [x] 2.3 实现目标数字区：标题行 +「已锁定」徽章；未锁定输入格；锁定后虚线 `*` 格
- [x] 2.4 实现猜测数字 MD3 卡片：4 格输入（focus primary 描边 + ring）、胶囊验证按钮
- [x] 2.5 实现历史列表：序号 + 猜测数字 + 分离 `XA`/`YB` pill 徽章
- [x] 2.6 实现历史虚线空状态占位卡片
- [x] 2.7 为按钮、输入格添加 `:active` scale 反馈
- [x] 2.8 移除旧 `#f5f5f5` / `#1890ff` 样式及 `gameOverSection` 相关样式

## 3. 结构与逻辑（index.tsx）

- [x] 3.1 重构 JSX 布局：规则卡片 → 目标区 → 猜测卡片 → 历史区
- [x] 3.2 「完成」按钮改为「锁定目标」；锁定后显示徽章与 `*` 掩码
- [x] 3.3 添加 `parseResult()` 工具函数，历史项渲染分离 A/B 徽章
- [x] 3.4 历史区始终显示（锁定后）；`results.length < 2` 时渲染空状态占位
- [x] 3.5 猜对（4A0B）改为 `Taro.showModal` 祝贺 +「重新开始」，确认后 `resetGame()`
- [x] 3.6 移除 `gameOverSection` 区块与 success Toast（避免与 Modal 重复）
- [x] 3.7 验证按钮添加 AtIcon check-circle 图标
- [x] 3.8 确认保留 `useShareAppMessage` 分享 hook

## 4. 清理与验证

- [x] 4.1 确认页面不渲染 BottomNav、无设置入口、无「清空记录」
- [x] 4.2 确认允许重复数字（目标与猜测均不做唯一性校验）
- [x] 4.3 运行 `npm run dev:weapp`，验证完整流程：设目标 → 锁定 → 猜测 → 历史 → 猜对 Modal → 重新开始
- [x] 4.4 确认导航栏浅色、MD3 配色与 tokens 一致
