# 主题

VS Code中的主题分为三类：
- **色彩主题**：UI组件ID和文本符号ID到色彩间的映射。通过色彩主题你可以修改VS Code UI组和编辑器中的文本。
- **文件图标主题**：文件类型/名称到图片之间的映射。文件图标显示于VS Code的资源管理侧边栏、快速打开列表和编辑器Tab等UI中。
- **产品图标主题**：一组贯穿整个 UI 的图标，包括侧边栏、活动栏、状态栏和编辑器字形边距中的图标。

## 色彩主题

![色彩主题](https://code.visualstudio.com/assets/api/extension-capabilities/theming/color-theme.png)

如图所示，色彩主题定义了 UI 组件的颜色，以及编辑器中的高亮颜色：

- `colors` 映射用于控制 UI 组件的颜色。
- `tokenColors` 定义编辑器中高亮的颜色和样式。有关此主题的更多信息，请参阅[语法高亮指南](/language-extensions/syntax-highlight-guide)。
- `semanticTokenColors` 映射和 `semanticHighlighting` 设置可增强编辑器中的高亮效果。相关 API 的说明请参阅[语义高亮指南](/language-extensions/semantic-highlight-guide)。

我们提供了[色彩主题指南](/extension-guides/color-theme)和[色彩主题示例](https://github.com/microsoft/vscode-extension-samples/tree/main/theme-sample)，用于说明如何创建主题。

## 文件图标主题

文件图标主题允许你：

- 创建从唯一文件图标标识符到图片或字体图标的映射。
- 按文件名或文件语言类型，将文件关联到这些唯一的文件图标标识符。

[文件图标主题指南](/extension-guides/file-icon-theme)介绍了如何创建文件图标主题。
![文件图标主题](https://code.visualstudio.com/assets/api/extension-capabilities/theming/file-icon-theme.png)

## 产品图标主题

产品图标主题允许你：

重新定义工作台中使用的所有内置图标，例如筛选操作按钮和视图图标、状态栏图标、断点图标，以及树视图和编辑器中的折叠图标。

[产品图标主题指南](/extension-guides/product-icon-theme)介绍了如何创建产品图标主题。
