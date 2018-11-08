# VS Code 插件示例
我们已经在一开始尝试了2个示例，也了解了不少核心概念：
- [你的第一个插件](/extension-authoring/example-hello-world.md) - 阐释了扩展性的一些核心观念。
- [计数器插件](/extension-authoring/example-word-count.md) - 在上面示例的基础上的另一个示例。

## 示例插件

| 示例 | 描述 | 类型 | 已发布到市场 |
| :----|:---- |:---- |:---- |
| [字数计数器](https://github.com/Microsoft/vscode-wordcount) | 在状态栏展示Markdown文件的字数计数，我们提供了这个示例的[引导章节](/extension-authoring/example-hello-world.md) | 插件 | Y |
| [MD工具](https://github.com/Microsoft/vscode-MDTools) | 为选中的文本提供诸如：转换大写，转换为HTML等功能 | 插件 | Y |
| [装饰器](https://github.com/Microsoft/vscode-extension-samples/tree/master/decorator-sample) | 如何为编辑器中的文本添加入边框、颜色、鼠标指针，还有给miniMap添加高亮的示例 | 插件 | N |
| [文本内容提供器](https://github.com/Microsoft/vscode-extension-samples/tree/master/contentprovider-sample) | 教你如何使用API命令，怎么用`TextDocumentContentProvider`API创建虚拟文档的例子 | 插件 | Y |
| [TSLint](https://github.com/Microsoft/vscode-tslint) | 用这个插件校验Typescript文件语法 | 语言服务器 | Y |
| [模拟调试器](https://github.com/Microsoft/vscode-mock-debug) | 帮你生成和测试调试器 | 调试器 | Y |
| [GO语言支持](https://github.com/microsoft/vscode-go) | 为[Go Lang]提供丰富的语言支持——如：智能补全，调试，转跳，重命名变量，语法插件…… | 插件 | Y |
| [树形数据提供器](https://github.com/Microsoft/vscode-extension-samples/tree/master/tree-view-sample) | 学习使用`TreeDataProvider`API，给VS Code加上自定义视图 | 插件 | N |

## 示例仓库

在[VS Code Extension Samples](https://github.com/Microsoft/vscode-extension-samples)里面有更多的VS Code 示例插件，你会发现示例基本上采用了最佳实践和最新的API。

## 文档
---

想要了解VS Code扩展性模型，请参阅：
- [原则和模式](/extensibility-reference/principles-patterns.md) - 包含扩展性的核心观念和模式
- [语言插件指引](/extensibility-reference/language-extension-guidelines.md) - 学习声明式的、程序式的语言集合。

## 构建插件的工具

| 工具 | 目的 |
| :----- | :----- |
| [插件生成器](/extension-authoring/extension-generator.md) | 为了帮你实现一个基本的插件，我们提供了[Yeoman](http://yeoman.io/)生成器。这个插件能帮你初始化插件开发环境、API类型文件、相关的模块。这个插件的源码[在这](https://github.com/Microsoft/vscode-generator-code) |
| [开发插件](http://yeoman.io/) | 我们努力为大家提供了一条简单的插件开发、调试之路 |
| [发布工具](docs/extension-authoring/publish-extension.md) | 如果你的插件一切顺利，那就是时候把它分享到[插件市场](https://code.visualstudio.com/docs/editor/extension-gallery)上了，只需要一个非常简单的命令行工具。源码在[这里](https://github.com/Microsoft/vsce)哦 |

## 下一步

- [插件市场](https://code.visualstudio.com/docs/editor/extension-gallery) - 学习更多关于VS Code公共插件市场的内容。
- ['code'Yeoman 生成器](/extension-authoring/extension-generator.md) - 快速创建你的第一个VS Code插件。
- [扩展性参阅](/extensibility-reference/overview.md) - 关于API的更多细节。
