## ADDED Requirements

### Requirement: 全局设计 Token 文件存在且可被引用
系统 SHALL 提供 `src/style/tokens.scss`，包含 Stitch 设计稿对齐的色彩、间距、圆角、字号变量，供页面与组件通过 `@import` 引用。

#### Scenario: 页面引用 Token
- **WHEN** 开发者在新页面样式文件中 `@import` tokens.scss
- **THEN** 该页面 MUST 能使用 `$color-primary`、`$spacing-md` 等变量而无需硬编码 hex 值

#### Scenario: 核心色板完整
- **WHEN** 审查 tokens.scss
- **THEN** 文件 MUST 包含 primary（#005ea4）、secondary（#b7131a）、tertiary（#705d00）、surface（#f7f9fc）及 on-surface、outline-variant 等 MD3 语义色

### Requirement: Token 尺寸使用 rpx 单位
系统 SHALL 将 Stitch 设计稿 px 值按 750 设计稿换算为 rpx（1px = 2rpx）定义间距与字号 Token。

#### Scenario: 间距 Token 可换算
- **WHEN** 设计稿指定 margin-mobile 为 16px
- **THEN** tokens.scss 中对应变量 MUST 为 32rpx

#### Scenario: 字号 Token 可换算
- **WHEN** 设计稿指定 headline-md 为 20px
- **THEN** tokens.scss 中对应变量 MUST 为 40rpx
