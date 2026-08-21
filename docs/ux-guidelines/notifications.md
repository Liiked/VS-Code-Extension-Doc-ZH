
# 通知（Notifications）

[通知](/extension-capabilities/common-capabilities#display-notifications)显示从 VS Code 右下角浮出的简要信息。

![通知示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification.png)

你可以发送三种类型的通知：

* [信息](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
* [警告](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
* [错误](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

为了尊重用户的注意力，限制发送的通知数量非常重要。为了帮助你在是否应该显示通知上做出决定，请遵循我们的通知决策树：

[![如果需要立即进行多步骤用户输入，请显示多步骤快速选择。如果需要立即用户输入但不是多步骤，请显示模态对话框。如果需要显示低优先级的进度，请在状态栏中显示进度。如果交互由用户触发，请找到合适的时机再显示通知。如果需要显示多个通知，请尝试将它们合并为一个。如果用户并不真正需要被通知，请考虑不显示任何内容，放松一下。](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-decision-tree.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-decision-tree.png)

## 通知示例

![信息通知](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-info.png)

*此通知在用户运行 **Update version** 命令后出现。请注意，这里没有额外的操作，纯粹只展示信息。*

![警告通知](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-warning.png)

*此示例突出了需要用户输入解决问题，并显示了解决该问题的操作。*

![错误通知](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-error.png)

*此示例显示了错误通知和解决该问题的操作*

**✔️ 应该**

* 仅在绝对必要时发送通知，以尊重用户的注意力
* 为每个通知添加 **Do not show again**（不再显示）选项
* 一次只显示一个通知

**❌ 不应该**

* 发送重复的通知
* 用于推广
* 在首次安装时征求反馈
* 在没有操作时显示操作按钮

## 进度通知

当需要在不确定的时间范围内显示进度时（例如，设置环境），你可以使用进度通知。这种全局进度通知应作为最后的手段使用，因为进度最好保持在上下文中（在视图或编辑器内）。

**✔️ 应该**

* 显示查看更多详情（如日志）的链接
* 在设置进行过程中显示信息（初始化、构建等）
* 提供取消操作的选项（如果适用）
* 为超时场景添加计时器

**❌ 不应该**

* 让通知一直停留在进行中的状态

![进度通知](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-progress.png)

*此示例使用进度通知显示远程连接所涉及的过程，同时提供指向输出日志（**details**）的链接。*

## 模态对话框

当你需要用户立即对某个操作做出输入时，可以选择显示模态对话框。应谨慎使用此 UI 元素，因为模态对话框会阻止用户与对话框之外的内容交互，直到它被关闭。

![模态对话框](https://code.visualstudio.com/assets/api/ux-guidelines/examples/save-ai-generated-changes-dialog.png)

*此对话框在移动 JavaScript/TypeScript 文件后出现，询问是否更新其他文件中的 import 语句。*

**✔️ 应该**

* 仅在需要立即用户交互时使用模态对话框
* 在合适的情况下，提供避免重复用户确认的操作（*Always*/*Never* 操作）
* 考虑使用复选框记住用户的选择

**❌ 不应该**

* 使用模态对话框确认多个步骤
* 使用模态对话框显示不需要用户操作的消息
* 对不是由用户明确发起的操作显示模态对话框

## 链接

* [Hello World 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)
* [通知插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/notifications-sample)
