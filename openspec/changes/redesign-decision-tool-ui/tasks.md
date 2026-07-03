## 1. 数据与配置

- [x] 1.1 更新 `src/pages/doDescription/store.ts`：默认 title「今晚吃什么？」，list 为火锅/披萨/寿司/烤肉/面条/沙拉
- [x] 1.2 更新 `src/pages/doDescription/index.config.ts`：导航栏背景 #f7f9fc，标题「做个决定吧」
- [x] 1.3 更新 `src/pages/doDescription/edit/index.config.ts`：导航栏背景 #f7f9fc

## 2. 做个决定吧主页（index）

- [x] 2.1 重写 `index.scss`：移除绿色渐变，应用 tokens.scss（surface 背景、卡片阴影、圆角）
- [x] 2.2 重构当前问题卡片：「当前问题」标签 + title + 圆形 edit 按钮
- [x] 2.3 重构转盘：MD3 灰白 conic-gradient、顶部指针、中心 GO/SPIN 按钮、4s cubic-bezier 动画、旋转中 isSpinning 防抖
- [x] 2.4 添加提示文案「摇摆不定？点击按钮，让命运来为你做决定。」
- [x] 2.5 添加底部全宽「开始抽取」主按钮（与 GO 共用 decide 逻辑）
- [x] 2.6 重构「最近常用」：始终展示、空态文案、「+ 新建」跳转 type=add
- [x] 2.7 常用列表卡片化：accent 轮换图标、选项预览、chevron、选中 border 高亮（移除 ✓）
- [x] 2.8 实现顶栏 ⋯ ActionSheet：选中项时「删除此常用」+ 确认；可选「分享给朋友」；移除 onLongPress 删除
- [x] 2.9 在 decide 结束回调处添加 TODO 注释：旋转结果展示（暂不实现）
- [x] 2.10 确认主页不渲染 BottomNav，使用 ScrollView 适配内容高度

## 3. 编辑/添加页（edit）

- [x] 3.1 重写 `edit/index.scss`：MD3 布局、Hero、卡片、虚线添加按钮、sticky 保存底栏
- [x] 3.2 抽取 OptionRow 子组件（同文件）：accent 轮换图标、Input、删除按钮；edit 方角 / add 圆角 modifier
- [x] 3.3 实现 edit 分支：Decision Tool Hero、「你的问题」卡片、选项计数、智能生成 banner（占位 toast）
- [x] 3.4 实现 add 分支：决策主题 Hero、标题 input + edit 图标、装饰插图区（decision.svg 占位）、save 图标保存按钮
- [x] 3.5 统一保存逻辑：校验 ≥2 选项、trim 空值；edit 调 updateLocalItem / add 调 addLocalItem；navigateBack
- [x] 3.6 移除 taro-ui AtButton 旧样式，改用自定义 MD3 主按钮
- [x] 3.7 add 模式 setNavigationBarTitle「添加常用」；edit 模式「编辑转盘」

## 4. 资源与清理

- [x] 4.1 移除 index 页不再使用的 Triangle 组件引用（若指针改用 AtIcon）
- [x] 4.2 移除 index 页旧 COLOR1/COLOR2/COLOR3 绿色常量
- [x] 4.3 （可选）添加本地插图 asset 替换 add 页 decision.svg 占位

## 5. 验证

- [x] 5.1 运行 `npm run dev:weapp`，确认工作坊 → 做个决定吧 → 编辑/添加 → 返回链路正常
- [x] 5.2 确认保存/添加常用后主页列表与转盘数据同步
- [x] 5.3 确认 ⋯ 删除常用项流程（选中 → 删除 → 列表更新）
- [x] 5.4 确认 GO 与「开始抽取」双入口旋转、旋转中不可重复触发
- [x] 5.5 确认二级页无 BottomNav，分享能力仍可用
