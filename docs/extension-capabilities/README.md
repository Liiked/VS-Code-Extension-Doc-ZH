# 插件功能

VS Code 提供了非常多的方法，供插件扩展VS Code本身的能力。但是有的时候也很难找到对的[发布内容配置](/references/contribution-points.md)和[VS Code API](/references/vscode-api.md)。这章内容将插件的功能分成了几个部分，每个部分都将告诉你：
- 插件可以使用的功能
- 这些功能点的细节索引
- 一些插件灵感

不过，我们也会告诉你一些[限制](#限制)，为了避免插件影响到VS Code的性能和稳定性。比如：插件不可以修改VS Code UI底层的DOM。

## 常用功能
---

[常用功能](/extension-capabilities/common-capabilities)是你在任何插件中都可能用到的核心功能。

这些功能包括：

- 注册命令、配置、快捷键绑定、菜单等。
- 保存工作区或全局数据。
- 显示通知信息。
- 使用快速选择获得用户输入。
- 打开系统的文件选择工具，以便用户选择文件或文件夹。
- 使用进度API提示耗时较长的操作。

## 主题
---

[主题](/extension-capabilities/theming)控制着VS Code的外观——编辑器中的源代码的颜色和VS Code UI颜色。如果你曾经想要把VS Code搞成绿色，想象自己在黑客帝国里写代码，或者想要追求极简性冷淡灰色风格，那么主题章节就是为你而来。

##### 插件灵感

 - 改变你的代码颜色
 - 改变VS Code UI颜色
 - 将现有的TextMate主题应用到VS Code中
 - 添加自定义图标

## 声明式添加语言特性
---

[声明式语言特性](/language-extensions/README#声明式语言特性)添加了基础的编程语言编辑支持，如括号匹配、自动缩进和语法高亮。这些功能都可以通过声明配置而不用写任何代码就可以获得，更高级的语言特性如IntelliSense或调试，请看[编程式添加语言特性](#编程式添加语言特性)

##### 插件灵感

 - 将常用的JS代码片段打包到插件中
 - 为VS Code添加新的语言支持
 - 为一门语言添加或替换语法
 - 通过注入的方式，扩展一门语法
 - 将现有的 TextMate 语法迁移到VS Code中

## 编程式添加语言特性
---

[编程式添加语言特性](/language-extensions/README#编程式语言特性)可以为编程语言添加更为丰富的特性，如：悬停提示、转跳定义、错误诊断、IntelliSense和CodeLens。这些语言特性暴露于[`vscode.languages.*`](https://code.visualstudio.com/api/references/vscode-api#languages)API。语言插件可以直接使用这些API，或是自己写一个语言服务器，通过[语言服务器库](https://github.com/Microsoft/vscode-languageserver-node)将它适配到VS Code。

虽然我们提供了一个[语言特性](/language-extensions/programmatic-language-features)列表，但是并不阻碍你发挥想象，自由使用这些API。比方说，在行内显示额外信息，使用CodeLens和代码悬停是非常好的方式，而错误诊断可以高亮拼写或代码风格错误。

##### 插件灵感

- 鼠标悬停于API上时, 出现用法示例
- 使用诊断，报告代码风格错误
- 注册新的HTML代码格式化
- 提供丰富的IntelliSense中间件
- 为一门语言添加代码折叠、面包屑、轮廓支持

## 扩展工作台
---

[扩展工作台](/extension-capabilities/extending-workbench)加强了 VS Code 工作台的UI，为资源管理侧边栏添加了新的右击行为，你甚至可以用 [TreeView](/extension-guides/tree-view)API构建自定义的资源管理侧边栏。如果你的插件需要完全自定义用户界面，那就使用[Webview API](/extension-guides/webview)和HTML，CSS，Javascript构建你自己的UI。

##### 插件灵感

 - 自定义资源管理侧边栏的菜单行为
 - 在侧边栏中创建新的、交互式的TreeView
 - 定义新的活动栏视图
 - 在状态栏显示新的信息
 - 使用`WebView` API显示自定义内容
 - 配置*源控制(git/svn等)*来源

## 调试
---

你可以利用[调试](https://code.visualstudio.com/docs/editor/debugging)来制作[调试器插件](/extension-guides/debugger-extension)，这个插件需要将VS Code的调试UI连接到真实的调试器或者运行时上。

##### 插件灵感

 - 通过[调试适配器](https://microsoft.github.io/debug-adapter-protocol/implementors/adapters/)将VS Code的调试UI连接到真实的调试器或者运行时上
 - 通过调试器插件添加语言支持
 - 为调试配置文件添加丰富的智能提示或者悬停信息
 - 为调试配置文件添加代码片段

另一方面，VS Code也提供了非常多的[调试器插件API](https://code.visualstudio.com/api/references/vscode-api#debug)，你可以用来实现任何VS Code调试器相关的功能，加强用户的调试体验。

##### 插件灵感

 - 动态生成调试器配置文件，启动调试器会话
 - 跟踪调试会话的声明周期
 - 编程式管理断点

## 限制
---

最后，我还对插件也提出了一些限制。

#### 不可访问DOM

插件没有权限访问VS Code UI的底层DOM，**禁止**添加自定义的CSS 和 HTML片段到VS Code UI上。

我们在一直努力优化VS Code底层的web技术，为用户创造高可用、持续响应的编辑器，而我们也会继续调整这些技术中使用到的DOM。为了确保不会干扰到VS Code的性能和稳定性，同时不阻断其他插件的运行，所以我们的插件都跑在[插件主机](/advanced-topics/extension-host)进程中，而且阻止了插件直接访问DOM的途径。