
# 命令面板（Command Palette）

[命令面板](/references/contribution-points#contributes.commands)是所有命令所在的地方。正确命名你的命令非常重要，这样用户才能轻松找到它们。

**✔️ 应该**

* 在合适的地方添加快捷键
* 为命令使用清晰的名称
* 将命令分组到同一类别中

❌ 不应该

* 覆盖现有的键盘快捷键
* 在命令名称中使用 emoji 表情

![命令面板](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)

*此示例展示的命令都带有清晰的 `category` 前缀，例如“GitHub Issues”。*

## 链接

* [命令 API 参考](/references/contribution-points#contributes.commands)
* [命令插件指南](/extension-guides/command)
* [Hello World 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)
