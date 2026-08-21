
# 编辑器操作（Editor Actions）

[编辑器操作](/references/contribution-points#contributes.commands)可以出现在编辑器工具栏中。你可以添加一个图标作为快速操作，或者在溢出菜单（**...**）下添加菜单项。

**✔️ 应该**

* 仅在合适时显示
* 使用图标库中的图标
* 对次要操作使用溢出菜单

❌ 不应该

* 添加多个图标
* 添加自定义颜色
* 使用 emoji 表情

![编辑器操作](https://code.visualstudio.com/assets/api/ux-guidelines/examples/editor-actions.png)

*此示例来自 GitHub Pull Requests and Issues 插件，它打开一个 diff 视图，并且只在有改动的文件上显示。*

## 链接

* [自定义编辑器插件指南](/extension-guides/custom-editors)
* [自定义编辑器 API 参考](/references/contribution-points#contributes.customEditors)
* [自定义编辑器插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample)
* [Webview 插件指南](/extension-guides/webview)
* [Webview 插件示例](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample)
