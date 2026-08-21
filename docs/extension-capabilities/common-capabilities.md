# 常用功能

常用功能对你的插件来说非常重要，几乎所有的都会或多或少地用到这些功能，下面我们为你简单地介绍一下它们。

## 命令

命令是VS Code 运作的核心。你可以打开*命令面板*执行，用快捷键执行，还可以在菜单中鼠标右键执行。

一个插件应该：
- 使用[`vscode.commands`](https://code.visualstudio.com/api/references/vscode-api#commands)注册和执行命令
- 配置[`contributes.commands`](/references/contribution-points#contributescommands)，确保命令面板中可以顺利执行你注册的命令

在[插件指南/命令](/extension-guides/command)中学习更多相关内容。


## 配置

插件需要在[`contributes.configuration`](/references/contribution-points#contributesconfiguration)配置点点中填写有关的配置，你可以[`workspace.getConfiguration`](https://code.visualstudio.com/api/references/vscode-api#workspace.getConfiguration)API中阅读有关内容。


## 键位绑定

插件可以添加自定义键位映射，在[`contributes.keybindings`](/references/contribution-points#contributeskeybindings)和[键位绑定](https://code.visualstudio.com/docs/getstarted/keybindings)中了解更多有关内容。

## 菜单

插件可以自定义上下文菜单项，菜单会根据用户右击VS Code UI的不同位置而各不相同。查看更多[`contributes.menus`](/extensibility-reference/contribution-points#contributesmenus)配置点。

## 数据储存

VS Code中有三种数据储存方式：

- [`ExtensionContext.workspaceState`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.workspaceState)：键值对组成的工作区数据。当同一个工作区再次打开时会重新取出数据。
- [`ExtensionContext.globalState`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.globalState)：键值对组成的全局数据。当插件激活时会再次取出这些数据。
- [`ExtensionContext.storageUri`](/api/references/vscode-api#ExtensionContext.storageUri)：指向本地目录的工作区专用存储 URI，插件对该目录拥有读写权限。如果需要存储只能由当前工作区访问的大型文件，这是一个合适的选择。
- [`ExtensionContext.globalStorageUri`](/api/references/vscode-api#ExtensionContext.globalStorageUri)：指向本地目录的全局存储 URI，插件对该目录拥有读写权限。如果需要存储可供所有工作区访问的大型文件，这是一个合适的选择。
- [`ExtensionContext.secrets`](/api/references/vscode-api#ExtensionContext.secrets)：用于存储密钥或其他敏感信息的全局存储，存储内容会被加密，且不会在不同设备之间同步。对于桌面版 VS Code，它使用 Electron 的 [safeStorage API](https://www.electronjs.org/docs/latest/api/safe-storage)；对于网页版 VS Code，它使用双密钥加密（Double Key Encryption，DKE）实现。

插件的执行上下文在`activate`函数中，详见[插件入口文件](/get-started/extension-anatomy#插件入口文件)。

### setKeysForSync 示例

如果你的插件需要在不同设备之间保留部分用户状态，请使用 `vscode.ExtensionContext.globalState.setKeysForSync` 将该状态提供给[设置同步](https://code.visualstudio.com/docs/configure/settings-sync)。

你可以使用以下模式：

```TypeScript
// 激活时
const versionKey = 'shown.version';
context.globalState.setKeysForSync([versionKey]);

// 稍后显示页面时
const currentVersion = context.extension.packageJSON.version;
const lastVersionShown = context.globalState.get(versionKey);
if (isHigher(currentVersion, lastVersionShown)) {
    context.globalState.update(versionKey, currentVersion);
}
```

通过共享已关闭或已查看标记，在不同设备之间共享状态可以避免用户多次看到欢迎页或更新页。

## 显示通知

几乎所有的插件都需要在某些时候为用户提示信息。VS Code提供了3个API来展示不同重要程度的信息：

- [`window.showInformationMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
- [`window.showWarningMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
- [`window.showErrorMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

## 快速选择

使用[`vscode.QuickPick`](https://code.visualstudio.com/api/references/vscode-api#QuickPick)API，你可以轻松地收集用户输入或者为用户显示选择列表。[快速输入 示例](https://github.com/Microsoft/vscode-extension-samples/tree/master/quickinput-sample)将详细解释这个API。

## 文件选择

插件可以使用[`window.showOpenDialog`](https://code.visualstudio.com/api/references/vscode-api#vscode.window.showOpenDialog)API打开系统文件选择器，然后选择文件或是文件夹。

## 输出渠道

*输出面板*显示了一组[`输出渠道`](https://code.visualstudio.com/api/references/vscode-api#OutputChannel)，以便于你查看日志。你可以使用[`window.createOutputChannel`](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel)创建一个新的输出渠道。

## 进度API

使用[`vscode.Progress`](https://code.visualstudio.com/api/references/vscode-api#Progress)将处理进度报告给用户。

通过[`ProgressLocation`](https://code.visualstudio.com/api/references/vscode-api#ProgressLocation)选项，进度可以显示在不同的区域：
- 显示在通知区
- 显示在源控制视图
- VS Code窗口中的通用进度条位置

详见[进度 示例](https://github.com/Microsoft/vscode-extension-samples/tree/master/progress-sample)。