# 示例-调试适配器

虽然VS Code实现了一个原生的调试界面，但是它不能直接和调试器通信，而是依赖于*调试插件*实现调试和运行时的功能特性。

这些调试插件各不相同，主要是因为他们的实现并不运行在扩展主机中，而是作为一个分离的独立程序。我们称这些调试插件为*适配器*是因为他们能“适配”API、具体的调试器，或者由VS Code定义的*调试适配器协议*(DAP)。

![适配器运行框架](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/extensibility-architecture.png)

将调试适配器作为单独的运行程序有两方面的原因：第一，对于适合的调试器或者运行时，有其对应的语言来实现；第二，一个独立的程序能运行于底层调试器或者运行时上，也更轻松地运行在特权模式中。

为了避免本地防火墙的问题，VS Code依靠stdin/stdou和适配器通信，而不是sockets等的通信流行机制。

每个调试器插件定义了一种调试`类型`，而且会被VS Code的启动配置使用。当调试器session结束，调试器也会关闭。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-arch.png)

VS Code自带Node.js的调试插件。你也可以在[插件市场](https://marketplace.visualstudio.com/vscode/Debuggers)找到更多调试插件，本篇教程接下来会告诉你怎么开发一个调试器插件。

## 插件Mock Debug

从零开始做一个调试适配器对本篇教程来说实在太重了。因此我们会从一个简单的教学适配器开始，这个模拟的调试插件支持步进，继续，断点，异常捕捉和变量审查，但它并不会真的连接到调试器上。

不过在深入开发模拟调试器之前，我们先安装一个插件市场上的[预编译版本](https://marketplace.visualstudio.com/items/andreweinand.mock-debug)来玩玩：

- 切换到*插件*侧边栏，输入“mock”然后找到Mock Debug插件。
- 安装然后重启VS Code

试试Mock Debug吧：
- 创建一个空文件夹`mock test`，然后用VS Code打开
- 新建`readme.md`，然后输入几行文字
- 切换到*调试*侧边栏，然后按齿轮⚙按钮
- VS Code会让你选择“environment”，然后创建一个默认的启动配置文件。选择“Mock Debug”。
- 按下绿色的开始按钮，然后进入我们的`readme.md`文件

调试会话（debug session）就开始了，你可以按“步进（step）”，设置断点，捕捉异常（如果文本中出现`exception`字样）

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/mock-debug.gif)

那么现在我们要正式学习Mock Debug示例了，我们建议你先删除这个插件。

## Mock Debug开发设置

接下来让我们获取源码，在VS Code中开始开发吧：
```bash
git clone https://github.com/Microsoft/vscode-mock-debug.git
cd vscode-mock-debug
npm install
```

打开项目文件夹`vscode-mock-debug`，看看里面有什么：
- `package.json` mock-debug插件的配置清单
    - 列出了插件的发布内容配置点
    - `complie`脚本用于编译Typescript到`out`文件夹中，`watch`则是侦听后续的源码变动
    - `vscode-debugprotocol`、`vscode-debugadapter` 、`vscode-debugadapter-testsupport`是NPM模块，简化了基于node的调试适配器开发工作
- `src/mockRuntime.ts` 提供了简单API的虚拟运行时
- `src/mockDebug.ts`适配代码运行时到调试适配器协议中，你能在这个文件中找到各种各样的调试适配器协议和请求。
- 因为调试插件的实现就在调试适配器中，所以我们就完全没有编写平常要求的*插件*代码的必要了（如：运行在扩展主机环境的代码），不过Mock Debug有一个小的`src/extension.ts`文件，这个文件描述了一个调试插件都能做些什么。

现在构建然后加载Mock Debug插件，选择**插件**加载配置，然后按下`F5`，一开始，全部的Typescript编译会进入编译，然后输出到`out`文件夹中。全部构建完成后，会启动一个`watch task`用于监听你所作的任何改动。

之后会弹出一个新的VS Code窗口“[插件开发主机]”，Mock Debug插件就运行在调试模式中。在这个窗口中打开`mock test`，再打开`readme.md`文件，`F5`启动调试会话。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-mock-session.png)

现在插件已经启动在调试模式中了，你可以在`src/extension.ts`打断点，但是就如我之前所说，这个文件没有什么有意思的代码，真正重要的部分都在调试适配器中。

想要调试*调试适配器*本身，我们必须首先运行在调试模式中。运行调试适配器服务，然后配置VS Code连接上就好了。选中调试面板，从下拉面板中加载`Server`配置文件，然后按下绿色的开始按钮。

因为我们已经激活了一个插件的调试会话，VS Code调试器界面现在进入了一个多会话模式，我们也能从调试窗口中看到**Extention**和**Server**的调用栈视图：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-extension-server.png)

现在我们可以调试2个插件了，同时模拟调试适配器。使用**Extension + Server**的启动配置文件可以更快到达这一步。

