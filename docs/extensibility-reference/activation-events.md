# 激活事件 - package.json

在VS Code中，插件都是懒加载的，所以你得为VS Code提供插件激活的时机。 我们提供了下列激活时机：

* [`onLanguage:${language}`](extensibility-reference/activation-events#activationeventsonlanguage)
* [`onCommand:${command}`](extensibility-reference/activation-events#activationeventsoncommand)
* [`onDebug`](extensibility-reference/activation-events#activationeventsondebug)
* [`workspaceContains:${toplevelfilename}`](extensibility-reference/activation-events#activationeventsworkspacecontains)
* [`onFileSystem:${scheme}`](extensibility-reference/activation-events#activationeventsonfilesystem)
* [`onView:${viewId}`](extensibility-reference/activation-events#activationeventsonview)
* [`onUri`](extensibility-reference/activation-events#activationeventsonuri)
* [`*`](extensibility-reference/activation-events#activationevents)

我们在[`package.json` 插件清单](extensibility-reference/extension-manifest.md)中提供了一个插件最少所需的激活事件。

## activationEvents.onLanguage

特定语言文件打开时激活：

```json
...
"activationEvents": [
    "onLanguage:python"
]
...
```

`onLanguage`只支持[语言标识符](/docs/languages/identifiers.md)中的值。

在`activationEvents`数组中声明多个`onLanguage`入口实现多语言支持

```json
"activationEvents": [
    "onLanguage:json",
    "onLanguage:markdown",
    "onLanguage:typescript"
]
...
```

## activationEvents.onCommand

当调用命令时激活事件：

```json
...
"activationEvents": [
    "onCommand:extension.sayHello"
]
...
```

## activationEvents.onDebug

调试会话（debug session）启动前激活：

```json
...
"activationEvents": [
    "onDebug"
]
...
```

### onDebugInitialConfigurations and onDebugResolve

这是两个粒度更细的激活事件：

* `onDebugInitialConfigurations` 在`DebugConfigurationProvider`中的 `provideDebugConfigurations`方法之前触发。
* `onDebugResolve:type` 在`DebugConfigurationProvider`的`resolveDebugConfiguration`方法之前触发。

**首要原则：** 如果调试插件的激活事件比较轻量，那么就用`onDebug`。相反，根据`DebugConfigurationProvider`实现的对应方法（ `provideDebugConfigurations`或`resolveDebugConfiguration`），使用`onDebugInitialConfigurations`或`onDebugResolve` 。参见 [Debug Type specific Hooks](/docs/extensionAPI/api-debugging.md#debug-type-specific-hooks)。

## activationEvents.workspaceContains

文件夹打开后，且文件夹中至少包含一个符合glob模式的文件时触发。

```json
...
"activationEvents": [
    "workspaceContains:**/.editorconfig"
]
...
```

## activationEvents.onFileSystem

从*协议（scheme）*打开的文件或文件夹打开时触发。通常是`file`-协议，也可以用自定义的文件供应器函数替换掉，比如`ftp`、`ssh`。

```json
...
"activationEvents": [
    "onFileSystem:sftp"
]
...
```

## activationEvents.onView

指定的视图id展开时触发：

```json
...
"activationEvents": [
    "onView:nodeDependencies"
]
...
```

## activationEvents.onUri

插件的系统级URI打开时触发。这个URI协议需要带上`vscode` 或者 `vscode-insiders`协议。URI授权必须是插件的唯一标识，剩余的URI是可选的。

```json
...
"activationEvents": [
    "onUri"
]
...
```

如果 `vscode.git`插件定义了`onUri`激活事件，那么下列任意URI打开时就会触发：

- `vscode://vscode.git/init`
- `vscode://vscode.git/clone?url=https%3A%2F%2Fgithub.com%2FMicrosoft%2Fvscode-vsce.git`
- `vscode-insiders://vscode.git/init` (for VS Code Insiders)

## activationEvents.*

当VS Code启动时触发。为了保证良好的用户体验，只在你的插件没有其他任何激活事件的前提下，添加这个激活事件。

```json
...
"activationEvents": [
    "*"
]
...
```

!> **注意：** 一个插件如果侦听了多个激活事件，那么最好用`"*"`替换掉。

!> **注意：** 插件**必须**从它的主模块中输出一个`activate()`函数，当任意的激活事件触发时，VS Code会**仅仅调用一次这个函数**。此外，插件也**应该** 导出一个`deactivate()`函数，当VS Code关闭时执行清理的任务。如果清理进程是异步的，插件的`deactivate()`**必须**返回一个Promise。如果这个清理任务是同步的，那么`deactivate()`可以返回`undefined`。

## 下一步

学习更多VS Code扩展性模型，看看下列主题：

* [插件清单](/docs/extensionAPI/extension-manifest.md) - VS Code package.json 插件清单文件参考
* [发布内容配置点](/docs/extensionAPI/extension-points.md) - VS Code 发布内容配置点参考