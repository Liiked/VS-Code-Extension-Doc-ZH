# 扩展Visual Studio Code
所有的vscode插件都共享一套注册、加载和连接`vscode extensibility API`的通用模型，其中的两大插件类型与通用模型有些许出入——`语言服务器`和`调试器`。他们有一些专属的调用协议，稍后我们会单独介绍这两个插件类型。

- 插件类型
    - [普通插件]() - 基础构建原型
    - [语言服务器]() - 高IO/CPU密集型任务
    - [调试器]() - 通过`调试适配器`连接的外部调试器

![调用示意图](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/overview/extensibility-architecture.png)

## 插件

当插件激活时，会运行在我们的`共享插件进程(shared extension host process)`中，这种分离插件进程的设计确保vscode能在繁杂的任务中不会宕机。

插件能够的运行的时机包括：
- `激活`：当检测到某类文件/存在某类文件/使用命令面板/使用组合键时，加载插件
- `工作区`：打开编辑器、状态栏、信息提示
- `事件`：编辑器的生命周期事件，如：`open, close, change`等等
- `编辑器`：读取文件，操作和选择文本
- `编辑器加强`：加强诸如IntelliSense，Peek，Hover，Diagnostics等富文本编辑支持功能

我们提供了两个端到端的基础教程，供你快速入门：
1. [Hello World]() - 生成一个本地运行的基础插件，了解插件的目录结构、配置文件，理解`激活`的触发机制。
2. [Word Count]() - 根据特定的文件类型更新状态栏，响应编辑器的文本操作，学习文件被删除时该如何处理。

另外，建议你首先阅读一下[扩展原则和模式]()部分，能帮助你了解贯穿整个`extensibility API`的编程模式。
## 更多
- **语言服务器**

专有的语言服务器避免了高开销CPU任务和IO密集型任务对其他插件造成的影响，如linters。

- **调试适配器(Debug Adapter)**

vscode实现了一套原生的调试器UI，并通过`调试适配器`连接到`调试器插件`上。调试适配器专属进程控制vscode和`vscode debug protcol`的通信，它能通过任何语言来实现。

- **语言插件指南**

通过`extensibility API`学习如何使用语言服务协议，[语言插件指南]()能帮你可能需要的特性。

- **主题，代码片段和高亮**

在vscode中，你可以自定义主题、代码片段和语法高亮，通过TextMate配置文件，你可以很轻松地重用你原来的主题。或者你也可以在你的插件中直接使用`.tmTheme .tmSnippets .tmLanguage`文件。

- **写插件吧!**

使用Yeoman extension generator轻松创建插件项目。

- **测试你的插件**

我们还提供了强力的测试支持，通过VS Code APIs轻松测试你的vscode实例。

- **获取插件灵**

大量的社区灵感应该转化为插件而不是产品的核心功能，这样用户才有更广的选择余地，vscode团队将潜在的插件打上了`*extension-candidat`标签，你可以通过[vscode repository](https://github.com/Microsoft/vscode)的issue列表找到还在开发中的插件，为喜欢的插件贡献一份力量吧。