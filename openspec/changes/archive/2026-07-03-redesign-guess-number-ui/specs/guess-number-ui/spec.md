## ADDED Requirements

### Requirement: 猜数字页展示 MD3 完整结构

系统 SHALL 在 `pages/guessNumber/index` 渲染以下区块：游戏规则 info 卡片、目标数字区（未锁定/已锁定两态）、猜测数字卡片（锁定目标后出现）、历史猜测列表；页面背景色 MUST 为 surface（#f7f9fc）。页面 MUST NOT 渲染 BottomNav 或自定义 TopBar 设置入口。

#### Scenario: 页面加载完整结构
- **WHEN** 用户从工作坊进入猜数字游戏
- **THEN** 页面 MUST 显示游戏规则卡片与目标数字区，背景为 #f7f9fc

#### Scenario: 二级页无 Tab 栏
- **WHEN** 用户位于猜数字游戏页
- **THEN** 页面 MUST NOT 显示底部 Tab 导航

#### Scenario: 无设置入口
- **WHEN** 用户位于猜数字游戏页
- **THEN** 页面 MUST NOT 显示设置齿轮或等效设置入口

### Requirement: 原生导航栏浅色样式

系统 SHALL 将猜数字页原生导航栏背景设为 #f7f9fc，标题文字为黑色，标题文案为「猜数字游戏」。

#### Scenario: 导航栏配色
- **WHEN** 用户打开猜数字游戏页
- **THEN** 原生导航栏 MUST 使用浅色背景与黑色标题

### Requirement: 游戏规则说明卡片

系统 SHALL 在页面顶部展示 MD3 卡片，含 info 图标、标题「游戏规则」，以及 A/B 说明：A 为「位置和数字都正确」（primary 色强调），B 为「数字正确但位置不正确」（secondary 色强调）。

#### Scenario: 规则卡片展示
- **WHEN** 用户进入猜数字游戏页
- **THEN** 页面 MUST 显示含 A/B 规则说明的白色圆角卡片

### Requirement: 目标数字设置与锁定

系统 SHALL 提供目标数字区：未锁定时展示 4 格数字输入与「锁定目标」按钮；用户输入完整四位数字并点击「锁定目标」后 MUST 锁定目标、隐藏锁定按钮、显示「已锁定」徽章，并将 4 格改为虚线边框 `*` 掩码展示。系统 MUST 允许四位数字重复（如 `1122`），不对唯一性做校验。

#### Scenario: 输入并锁定目标
- **WHEN** 用户输入完整四位目标数字并点击「锁定目标」
- **THEN** 目标 MUST 被锁定，显示「已锁定」徽章与 `*` 掩码，猜测区 MUST 出现

#### Scenario: 未完整输入时锁定
- **WHEN** 用户点击「锁定目标」但目标数字不足四位
- **THEN** 系统 MUST Toast 提示「请输入完整的四位数」且 MUST NOT 锁定

#### Scenario: 允许重复数字
- **WHEN** 用户输入目标数字 `1122` 并锁定
- **THEN** 系统 MUST 成功锁定，MUST NOT 因重复数字拒绝

### Requirement: 猜测数字输入与验证

系统 SHALL 在目标锁定后展示猜测数字 MD3 卡片：4 格数字输入（当前输入位 primary 描边高亮）、全宽胶囊「验证」按钮（含 check 图标）。用户点击验证时 MUST 校验四位完整，MUST 计算 A/B 结果并追加至历史，MUST 清空猜测输入。

#### Scenario: 验证猜测
- **WHEN** 用户输入完整四位猜测并点击「验证」
- **THEN** 系统 MUST 计算 A/B、追加历史记录、清空猜测输入

#### Scenario: 未完整猜测
- **WHEN** 用户点击「验证」但猜测不足四位
- **THEN** 系统 MUST Toast 提示「请输入完整的四位数」

#### Scenario: 允许重复猜测数字
- **WHEN** 用户猜测 `1122`
- **THEN** 系统 MUST 正常计算 A/B 结果

### Requirement: 历史猜测徽章展示

系统 SHALL 展示历史猜测列表：每条记录含 `#NN` 序号（两位补零）、猜测数字、分离的 `XA`（primary-container 徽章）与 `YB`（secondary-container 徽章）。系统 MUST NOT 提供「清空记录」入口。

#### Scenario: 历史记录格式
- **WHEN** 用户完成一次验证且结果为 0A4B
- **THEN** 历史 MUST 显示序号、猜测数字、以及分离的 `0A` 与 `4B` 两个 pill 徽章

#### Scenario: 无清空记录
- **WHEN** 用户查看历史猜测区
- **THEN** 页面 MUST NOT 显示「清空记录」按钮或链接

### Requirement: 历史空状态占位

系统 SHALL 在历史记录少于 2 条时，于列表底部展示虚线边框占位卡片，文案为「继续猜测以查看更多历史」。

#### Scenario: 零条历史
- **WHEN** 目标已锁定且尚无历史记录
- **THEN** 历史区 MUST 显示虚线空状态占位

#### Scenario: 一条历史
- **WHEN** 历史记录仅有 1 条
- **THEN** 历史区 MUST 在记录下方显示虚线空状态占位

#### Scenario: 两条及以上历史
- **WHEN** 历史记录达到 2 条或以上
- **THEN** 虚线空状态占位 MUST NOT 显示

### Requirement: 胜利 Modal 与重新开始

系统 SHALL 在猜测结果为 `4A0B` 时弹出 Modal，标题祝贺、内容展示使用次数，确认按钮文案为「重新开始」；用户确认后 MUST 重置全部游戏状态（目标、猜测、历史、次数）。系统 MUST NOT 以页内 gameOver 区块作为主要胜利反馈。

#### Scenario: 猜对弹出 Modal
- **WHEN** 用户验证猜测且结果为 4A0B
- **THEN** 系统 MUST 弹出 Modal 显示祝贺与次数，MUST NOT 仅依赖 Toast

#### Scenario: 重新开始
- **WHEN** 用户在胜利 Modal 点击「重新开始」
- **THEN** 系统 MUST 重置游戏至初始未锁定状态

### Requirement: 分享能力保留

系统 SHALL 保留猜数字页的 `useShareAppMessage` 分享能力，UI 改版 MUST NOT 移除分享 hook。

#### Scenario: 分享仍可用
- **WHEN** 用户在猜数字页触发小程序分享
- **THEN** 分享 MUST 正常工作
