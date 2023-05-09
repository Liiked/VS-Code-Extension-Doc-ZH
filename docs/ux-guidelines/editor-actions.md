# 编辑器操作

编辑器操作会出现在编辑器工具栏中。你可以添加带图标的快速操作，也可以在省略菜单（`...`）中添加子菜单。

✔**️推荐**
- 在适当的上下文才展示操作
- 使用图标库中的图标
- 二级操作放到省略菜单中

❌**不推荐**
- 添加超过一个以上的图标
- 添加自定义颜色
- 使用 emoji

![editor-actions](https://code.visualstudio.com/assets/api/ux-guidelines/examples/editor-actions.png)
*这个例子展示了 GitHub Pull Requests and Issues 插件打开了 diff 视图，该操作只在文件有过变动时才展示*

## 相关资源

- [自定义编辑器插件指南](../extension-guides/custom-editors.md)
- [自定义编辑器 API 参考](../references/contribution-points.md#contributescustomeditors)
- [自定义编辑器插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample)
- Webview 插件指南
- [Webview 插件示例](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample)