# 主题

VS Code中的主题分为两类：
- **色彩主题**：UI组件ID和文本符号ID到色彩间的映射。通过色彩主题你可以修改VS Code UI组和编辑器中的文本。
- **图标主题**：文件类型/名称到图片之间的映射。文件图标显示于VS Code的资源管理侧边栏、快速打开列表和编辑器Tab等UI中。

## 色彩主题
---

![color-theme](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-capabilities/images/theming/color-theme.png)

如上图所示，色彩主题定义了2种映射：
- `colors`控制UI组件的颜色
- `tokenColors`控制了每个代码标记单元(你的代码会根据[语法](/language-extensions/syntax-highlight-guide)分割成一个个标记单元)的颜色。

创建主题详见[色彩主题指南](/extension-guides/color-theme)和[色彩主题 示例](https://github.com/Microsoft/vscode-extension-samples/tree/master/theme-sample)

## 图标主题
---
图标主题允许你：
- 将图标ID映射至图片或者字体图标上。
- 根据文件名或这个文件的语言类型关联上图标ID

[图标主题指南](/extension-guides/icon-theme)会详细探讨其中的细节。
![icon-theme](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-capabilities/images/theming/icon-theme.png)