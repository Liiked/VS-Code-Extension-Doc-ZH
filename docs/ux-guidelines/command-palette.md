# 命令面板

[命令面板](../references/contribution-points.md#contributescommands) 是调用所有命令的地方。确保你的命令名称清晰，以便用户能快速找到他们。

✔**️推荐**
- 适时添加快键键
- 使用清晰易懂的名称
- 对同一类别的命令进行组合

❌**不推荐**
- 不要覆盖已有的键盘快捷键
- 不要在命令名称中使用表情符号

![command-palette](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)
*这个例子展示了每个命令都显示一个清晰的 `category` 前缀,例如“GitHub Issues”。*

## 相关资源

- [命令 API 参考](../references/contribution-points.md#contributescommands)
- [命令插件指南](../extension-guides/command.md)
- [Hello World 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)