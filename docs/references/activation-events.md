# 激活事件

**激活事件**是在`package.json`中的`activationEvents`字段声明的一个JSON对象, 参考[插件清单](/references/extension-manifest.md). 当**激活事件**触发时, 插件就会被激活. 下面是可用的**激活事件**列表

- [onLanguage](#onLanguage)
- [onCommand](#onCommand)
- [onDebug](#onDebug)
  - [onDebugInitialConfigurations](#onDebugInitialConfigurations)
  - [onDebugResolve](#onDebugResolve)
- [workspaceContains](#workspaceContains)
- [onFileSystem](#onFileSystem)
- [onView](#onView)
- [onUri](#onUri)
- [onWebviewPanel](#onWebviewPanel)

`package.json`的配置项都可以在[插件清单]中找到.