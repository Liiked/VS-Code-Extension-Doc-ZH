# 常用功能

常用功能对你的插件来说非常重要，几乎所有的都会或多或少地用到这些功能，下面我们为你简单地介绍一下它们。

## 命令
---

命令是VS Code 运作的核心。你可以打开*命令面板*执行，用快捷键执行，还可以在菜单中鼠标右键执行。

一个插件应该：
- 使用[`vscode.commands`](https://code.visualstudio.com/api/references/vscode-api#commands)注册和执行命令
- 配置[`contributes.commands`](/references/contribution-points#contributescommands)，确保命令面板中可以顺利执行你注册的命令

在[插件指南/命令](/extension-guides/command)中学习更多相关内容。


## 配置
---

插件需要在[`contributes.configuration`](/references/contribution-points#contributesconfiguration)发布内容配置点中填写有关的配置，你可以[`workspace.getConfiguration`](https://code.visualstudio.com/api/references/vscode-api#workspace.getConfiguration)API中阅读有关内容。


## 键位绑定
---

插件可以添加自定义键位映射，在[`contributes.keybindings`](/references/contribution-points?id=contributeskeybindings)和[键位绑定](https://code.visualstudio.com/docs/getstarted/keybindings)中了解更多有关内容。

## 菜单
---

插件可以自定义上下文菜单项，菜单会根据用户右击VS Code UI的不同位置而各不相同。查看更多[`contributes.menus`](/extensibility-reference/contribution-points#contributesmenus)发布内容配置。

## 数据储存
---

VS Code中有三种数据储存方式：

- [`ExtensionContext.workspaceState`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.workspaceState)：键值对组成的工作区数据。当同一个工作区再次打开时会重新取出数据。
- [`ExtensionContext.globalState`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.globalState)：键值对组成的全局数据。当插件激活时会再次取出这些数据。
- [`ExtensionContext.storagePath`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.storagePath)：指向你的插件可以读写的本地文件夹的路径。如果你要储存比较大的数据，这是一个非常好的选择。
- [`ExtensionContext.globalStoragePath`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.globalStoragePath)：指向你的插件可以读写的本地存储的路径。如果你要存储所有工作区内的大文件，这时一个非常好的选择。

插件的执行上下文在`activate`函数中，详见[插件入口文件](/get-started/extension-anatomy#插件入口文件)。

## 显示通知
---

几乎所有的插件都需要在某些时候为用户提示信息。VS Code提供了3个API来展示不同重要程度的信息：

- [`window.showInformationMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
- [`window.showWarningMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
- [`window.showErrorMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

## 快速选择
---

使用[`vscode.QuickPick`](https://code.visualstudio.com/api/references/vscode-api#QuickPick)API，你可以轻松地收集用户输入或者为用户显示选择列表。[快速输入 示例](https://github.com/Microsoft/vscode-extension-samples/tree/master/quickinput-sample)将详细解释这个API。

## 文件选择
---

插件可以使用[`vscode.window.showOpenDialog`](https://code.visualstudio.com/api/references/vscode-api#vscode.window.showOpenDialog)API打开系统文件选择器，然后选择文件或是文件夹。

## 输出渠道
---

*输出面板*显示了一组[`输出渠道`](https://code.visualstudio.com/api/references/vscode-api#OutputChannel)，以便于你查看日志。你可以使用[`window.createOutputChannel`](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel)创建一个新的输出渠道。

## 进度API
---

使用[`vscode.Progress`](https://code.visualstudio.com/api/references/vscode-api#Progress)将处理进度报告给用户。

通过[`ProgressLocation`](https://code.visualstudio.com/api/references/vscode-api#ProgressLocation)选项，进度可以显示在不同的区域：
- 显示在通知区
- 显示在源控制视图
- VS Code窗口中的通用进度条位置

详见[进度 示例](https://github.com/Microsoft/vscode-extension-samples/tree/master/progress-sample)。