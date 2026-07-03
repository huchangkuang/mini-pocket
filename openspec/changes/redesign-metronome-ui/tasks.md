## 1. 数据与配置

- [x] 1.1 更新 `constant.ts`：新增 `PRESET_BPM_LIST = [60, 72, 84, 120]` 及预设标签映射；保留 `CommonBeatList`
- [x] 1.2 新增 `settings.ts`（或同目录工具）：localStorage 读写 `MetronomeSettings`（soundEnabled 默认 true，vibrateEnabled 默认 false）
- [x] 1.3 更新 `index.config.ts`：导航栏背景 #f7f9fc，`navigationBarTextStyle: 'black'`

## 2. 状态与核心逻辑重构（index.tsx）

- [x] 2.1 统一 BPM 状态：移除 `selectNum`/Picker，改为单一 `bpm` state（默认 72）+ `customInput` 受控值
- [x] 2.2 实现 `setBpm(val)`：更新 bpm、Dial 进度弧、预设高亮；播放中自动 clearInterval + 重启
- [x] 2.3 重构 `goBeatN`：声音关时跳过 audio；震动开时调用 `Taro.vibrateShort`（支付宝分支 try/catch）
- [x] 2.4 保留现有 validate 逻辑与 errorToast；移除播放时 disabled 锁定
- [x] 2.5 页面 mount 时从 localStorage 恢复 settings；settings 变更时写回

## 3. UI 布局与样式（index.scss）

- [x] 3.1 重写页面根样式：移除 #333 深色，应用 tokens.scss（surface 背景、margin-mobile padding）
- [x] 3.2 实现 4 节拍胶囊：首拍更高、active scaleY + primary-container + glow 动画
- [x] 3.3 实现中央 BPM Dial：SVG 双 circle 进度弧、TEMPO/BPM 标签、128rpx 大数字、± 圆钮
- [x] 3.4 实现常用节拍区：标题 +「查看全部」链接、4 列预设卡片（选中 primary-container 高亮）
- [x] 3.5 实现自定义频率 MD3 卡片：label + Input + 清除 AtIcon
- [x] 3.6 实现声音/震动双卡片 + Switch（MD3 蓝色样式覆盖）
- [x] 3.7 实现底部 fixed FAB（$fab-size、$shadow-fab、play/pause 图标切换）；主内容 padding-bottom 预留 FAB 空间
- [x] 3.8 为卡片、± 按钮、FAB 添加 `:active` scale 反馈
- [x] 3.9 移除 `isAlipay` input 背景 hack（若浅色主题下不再需要）

## 4. 查看全部面板

- [x] 4.1 实现半屏 ScrollView/Modal 面板：展示 CommonBeatList 全部 BPM（建议 4 列网格）
- [x] 4.2 选中项关闭面板并调用 setBpm；点击遮罩关闭

## 5. 清理

- [x] 5.1 移除 Picker、AtIcon chevron-right、旧 formItem 布局相关代码与样式
- [x] 5.2 确认保留 `useShareAppMessage` 分享能力
- [x] 5.3 确认页面不渲染 BottomNav

## 6. 验证

- [x] 6.1 运行 `npm run dev:weapp`，确认工作坊 → 节拍器链路正常
- [x] 6.2 确认 ±、预设、全量列表、自定义输入均可更新 BPM 与 Dial
- [x] 6.3 确认播放/暂停 FAB、节拍胶囊高亮、声音开关、震动开关（真机）
- [x] 6.4 确认播放中改 BPM 自动重启；无效值 toast 阻止播放
- [x] 6.5 确认 settings 持久化：离开再进入开关状态保持
- [x] 6.6 确认导航栏浅色、无 BottomNav、分享仍可用
