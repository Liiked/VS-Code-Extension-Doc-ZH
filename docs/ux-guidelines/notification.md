# 通知

[通知](../extension-capabilities/common-capabilities.md#显示通知) 会在 VS Code 右下角弹出并展示简要的信息。

![notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification.png)

你可以发送三类通知：
- [信息](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
- [警告](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
- [错误](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

关照用户的注意力，限制你发送通知的数量。为了帮你作出是否应该展示通知的决策，你可以按照下列决策树来管理通知：

![notification-decision-tree](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-decision-tree.png)

## 通知示例

![notification-info](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-info.png)
*用户运行 **更新版本** 后会弹出这个通知。注意这里没有其他操作，仅有文本信息。 *

![notification-warning](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-warning.png)
*这个例子提示了一个 issue 以及一些功能——需要用户输入并执行相应操作来解决 issue。*

![notification-error](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-error.png)
*这个例子展示了一个错误通知，以及一些解决 issue 的操作*

✔**️推荐**

- 只在绝对必要时才发送通知，尊重用户的注意力 
- 为每个通知添加 “不再显示” 选项 
- 一次显示一个通知

❌**不推荐**

- 重复发送通知 
- 用于推广 
- 在第一次安装时就收集用户反馈 
- 如果没有任何操作，就不要显示操作 

## 进度通知

当需要显示一个不确定时间长度的进度时(例如：搭建环境)，你可以使用进度通知。这种全局的进度通知应该作为最终手段，体现进度最好的方式是在上下文中呈现进度(在一个视图或编辑器中)。

✔**️推荐**

- 显示一个链接以查看更多详细信息 (如日志) 
- 在配置过程中显示相关信息 (如：初始化、构建等) 
- 如果可以的话，提供一个操作来取消原操作
- 为超时场景添加计时器

❌**不推荐**

- 不要让通知一直显示加载状态
![notification-progress](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-progress.png)
*本例使用进度通知来展示远程链接配置过程，同时也提供一个链接来展示输出日志（**details**）*

## 相关资源
- [Hello World 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)
- [通知插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/notifications-sample)