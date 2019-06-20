# 插件 API
VS Code内置了扩展能力，在插件API加持之下，VS Code几乎每一个部分都可以自定义或者加强。而且，VS Code中的很多核心功能已编译为[插件](https://github.com/Microsoft/vscode/tree/master/extensions)，它们都共用了一套插件API。

本文档将介绍：
- 如何构建、运行、调试、测试和发布插件
- 如何利用好VS Code丰富的插件API
- 代码示例和各个指南的位置，方便你快速入门。如果你只是想看看已经发布的插件，可移步至[VS Code插件市场](https://marketplace.visualstudio.com/vscode)

## 插件能做什么？
---

下面我们看看使用插件API能做到些什么：
- 改变VS Code的颜色和图标主题——[主题](/extension-capabilities/theming.md)
- 在UI中添加自定义组件和视图——[扩展工作台](/extension-capabilities/extending-workbench.md)
- 创建Webview，使用HTML/CSS/JS显示自定义网页——[Webview指南](/extension-guides/webview.md)
- 支持新的编程语言——[语言插件概览](/language-extensions/README.md)
- 支持特定运行时的调试——[调试插件指南](/extension-guides/debugger-extension.md)

如果你想大概浏览一下所有的插件API，请参阅[插件功能概述](/extension-capabilities/README.md)。[插件指南](/extension-guides/README.md)列出了各种插件API使用的示例代码和指南。

## 如何构建插件？
---

想要做出一个好插件需要花费不少精力，我们来看看这个教程的每个章节能为你做点什么：

- **第一步** [Hello World示例]()会教你贯穿于制作插件时的基本概念
- **开发插件** 包含了各类插件开发更深的主题，比如[发布]()和[测试]()插件
- **插件功能** 将VS Code庞杂的API拆解成了几个小分类，帮你掌握到每个主题下的开发细节
- **插件指南** 包括指南和代码实例，详细介绍特定API的使用场景
- **语言插件** 通过代码和指南阐述如何添加编程语言支持
- **进阶主题** 解释了[插件主机](/advanced-topics/extension-host.md)和[使用不稳定的API](/advanced-topics/using-proposed-api.md)等更深层级的概念

## 寻求帮助
---

如果你在开发中遇到了问题，请尝试：
- [ Stack Overflow](https://stackoverflow.com/questions/tagged/visual-studio-code)：其中有将近[12k](https://stackoverflow.com/questions/tagged/visual-studio-code)个打了`visual-studio-code`标签的问题，而且半数以上都已经有了答案，搜索你遇到的问题，提问，或者帮助其他人解决VS Code中遇到的问题。

- [Gitter频道](https://gitter.im/Microsoft/vscode)和[VS Code Dev Slack](https://join.slack.com/t/vscode-dev-community/shared_invite/enQtMjIxOTgxNDE3NzM0LWU5M2ZiZDU1YjBlMzdlZjA2YjBjYzRhYTM5NTgzMTAxMjdiNWU0ZmQzYWI3MWU5N2Q1YjBiYmQ4MzY0NDE1MzY)：插件开发人员的公共聊天室，VS Code项目组成员偶尔也会出现。

你若对本文档有任何建议，请在[Microsoft/vscode-docs](https://github.com/Microsoft/vscode-docs/issues)中创建issue。如果你的插件问题无法解决，或者对VS Code插件API有任何建议，请在[Microsoft/vscode](https://github.com/Microsoft/vscode/issues)中新建issue。