# 概述

VS Code通过语言插件可以为各式各样的编程语言提供智能的编辑体验。VS Code并不含内置语言支持，不过提供了一整套支持富文本特性的API。
比如，[HTML](https://github.com/Microsoft/vscode/tree/master/extensions/html)插件是一个可以为VS Code中的HTML文件提供语法高亮的插件。
类似的，当你输入`console.`时，智能补全会提示`log`，这是[Typescript Language Features](https://github.com/Microsoft/vscode/tree/master/extensions/typescript-language-features)插件提供的。

语言特性大致可以分为下面两种：

## 声明式语言特性
---

定义在配置文件的语言功能称之为*编程式语言特性*，比如，[html](https://github.com/Microsoft/vscode/tree/master/extensions/html)，[css](https://github.com/Microsoft/vscode/tree/master/extensions/css)和[typescript-基础支持](https://github.com/Microsoft/vscode/tree/master/extensions/typescript-basics)插件都打包在了VS Code中，所以提供了下列声明式语言特性：

- 语法高亮
- 代码片段补全
- 括号匹配
- 自动闭合括号
- 括号识别
- 启动、关闭注释
- 自动缩进
- 代码折叠

我们提供了3个指南供你开发语言插件的声明式特性：

- [语法高亮指南](/language-extensions/syntax-highlight-guide)：VS Code 使用TextMate语法来高亮代码。这个指南将教你用简单的TextMate语法开发一个VS Code插件。
- [代码片段补全指南](/language-extensions/snippet-guide)： 这个指南教你怎么把代码片段打包进插件中。
- [语言配置指南](/language-extensions/language-configuration-guide)：VS Code允许插件为任何编程语言定义 **语言配置**。这个文件控制着基本的编辑功能，如开闭注释、括号匹配/识别，和(基础)代码折叠。


## 编程式语言特性
---

编程式语言特性包括自动补全、错误检查和跳转到定义。这些功能一般通过*语言服务器*驱动，这个服务器会分析你的项目，然后提供对应的功能。最好的例子就是打包在VS Code中的[`typescript-language-features`](https://github.com/Microsoft/vscode/tree/master/extensions/typescript-language-features)插件，它利用[TypeScript Language Service](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API)提供了诸如下面罗列的编程式语言特性：

- 悬停信息（[vscode.languages.registerHoverProvider](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider)）
- 自动补全（[vscode.languages.registerCompletionItemProvider](https://code.visualstudio.com/api/references/vscode-api#languages.registerDefinitionProvider)）
- 转跳到定义（[vscode.languages.registerDefinitionProvider](https://code.visualstudio.com/api/references/vscode-api#languages.registerDefinitionProvider)）
- 错误检查
- 格式化
- 重构
- 代码折叠

下面是[编程式语言特性](/language-extensions/programmatic-language-features)的完整列表。

![multi-ls](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/overview/multi-ls.png)

## 语言服务器协议（Language Server Protocol）
---

[语言服务器协议](https://microsoft.github.io/language-server-protocol/)将语言服务器（一个静态代码分析工具）和语言客户端（一般就是源代码）之间的通信进行了标准化，这样一来插件开发者就可以只写一次代码分析程序，然后在多个编辑器中重用了。

在[编程式语言特性](/language-extensions/programmatic-language-features)列表中，你可以找到所有VS Code的语言特性，以及它和[语言服务器协议规格](https://microsoft.github.io/language-server-protocol/specification)之间的映射关系。

我们提供了一个非常详尽的指南，里面会告诉你怎么实现一个语言服务器插件：

- [语言服务器插件指南](/language-extensions/language-server-extension-guide)

![multi-editor](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/overview/multi-editor.png)

## 特殊功能
---

#### 多目录工作区支持

当用户打开了一个[多目录工作区](https://code.visualstudio.com/docs/editor/multi-root-workspaces)，你可能需要将你的语言服务器插件做相应的调整。这个主题探讨了几种多目录工作区的语言服务器的实现方法。
（译者注：官方可能尚未完成这个部分的文档）

#### 嵌入式语言

嵌入式语言在web开发中是非常常见的，比如HTML中的CSS/JS，JS/TS中的GraphQL。这个主题探讨了针对嵌入语言实现VS Code语言特性的各种方法。
（译者注：官方可能尚未完成这个部分的文档）