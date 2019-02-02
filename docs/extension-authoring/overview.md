# 扩展Visual Studio Code
所有的VS Code插件都共享一套注册、加载和连接`VS Code extensibility API`的通用模型，但其中有两大插件类型与通用插件模型有些许出入——`语言服务器`和`调试器`。他们有一些专属的调用协议，我们会在后面的章节里单独介绍这两个插件类型。

- 插件类型
    - [普通插件](#插件) - 基本的插件类型
    - [语言服务器](#语言服务器) - 高IO/CPU密集型任务的插件
    - [调试器](#调试适配器debug-adapter) - 通过`调试适配器`连接外部调试器的插件

![调用示意图](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/api/language-extensions/images/language-server-extension-guide/extensibility-architecture.png)

## 插件
---

插件激活后会运行在我们的共享插件主机环境(shared extension host process)中，这种插件进程分离的设计确保VS Code能在繁杂的任务中不会宕机。

插件能够的运行的时机包括：
- `激活`：当检测到某类文件/存在某类文件/使用命令面板/使用组合键时，加载插件
- `工作区`：打开编辑器、状态栏、信息提示
- `事件`：编辑器的生命周期事件，如：`open, close, change`等等
- `编辑器`：读取文件，操作和选择文本
- `编辑器加强`：加强诸如IntelliSense，Peek，Hover，Diagnostics等富文本编辑支持功能

我们提供了两个端到端的基础教程，供你快速入门：
1. [Hello World](/extension-authoring/example-hello-world) - 生成一个本地运行的基础插件，了解插件的目录结构、配置文件，理解`激活`的触发机制。
2. [Word Count](docs/extension-authoring/example-word-count) - 根据特定的文件类型更新状态栏，响应编辑器的文本操作，学习文件被删除时该如何处理。

另外，首先建议你阅读一下[扩展性原则和模式](/extensibility-reference/principles-patterns)部分，能帮助你了解贯穿整个`extensibility API`的编程模式。

## 语言服务器

语言服务器是一种特殊的插件，它能加强VS Code中各种语言的编辑体验。有了语言服务器后，你可以实现诸如“转跳到定义”、“错误检查”和其他[语言功能](/extensibility-reference/language-extension-guidelines)了。

## 调试适配器(Debug Adapter)

VS Code实现了一套原生的调试器UI，并通过`调试适配器`连接到`调试器插件`上。调试适配器专属进程控制VS Code和`VS Code debug protcol`的通信，它能通过任何语言来实现。

详情查看创建[调试器插件](/extension-authoring/example-debug-adapter)

---

尝试VS Code插件最简单的方式就是去[插件市场](https://code.visualstudio.com/docs/editor/extension-gallery)，里面有非常多有用的插件，安装然后试试这些插件，你说不定会有所启发。

## 语言插件指南

通过`extensibility API`学习如何使用语言服务器协议——[语言插件指南](/extensibility-reference/language-extension-guidelines)。

## 主题，代码片段和高亮

在VS Code中你可以自定义主题、代码片段和语法高亮。通过TextMate配置文件，你可以很轻松地重用你原来的主题，或者你也可以在你的插件中直接使用`.tmTheme .tmSnippets .tmLanguage`文件。

## 写插件吧!

使用Yeoman[插件生成器](/extension-authoring/extension-generator)轻松创建插件项目。

## 测试你的插件

我们还提供了强力的[测试支持](/extension-authoring/testing-extensions)，通过VS Code API轻松测试你的VS Code实例。

## 获取插件灵感

大量的社区灵感应该转化为插件而不是产品本身的功能，这样用户才有更广的选择余地，VS Code团队将潜在的插件打上了`*extension-candidate`标签，你可以通过[VS Code repository](https://github.com/Microsoft/vscode)的issue列表找到还在开发中的插件，为喜欢的插件贡献一份力量吧。