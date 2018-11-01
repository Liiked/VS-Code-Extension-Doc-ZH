# 调试器API

VS Code 允许插件创作者制作新的**调试器插件**，或为已有的调试功能添加**特性**。

我们提供了两个领域的API：
- 通过成熟又强力的**协议**生成新的VS Code常规调试界面
- 常规的**插件API**，但不包括VS Code的全部调试功能

提供这两种截然不同的API是因为VS Code的“热拔插调试器”插件架构（我们不会移除向后兼容的基于*协议*的调试器连接方法）

下列图片展示了两种API在VS Code中协作的方式：

![debug-extension-api](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/api-debugging/debug-extension-api.png)

**调试适配器**是一个典型的脱机程序，通过**调试适配器协议（Debug Adapter Protocol）**连接到真实的调试器和具体的调试器API上。因为调试适配器可以用任意的语言实现，因此非常适合先前*已有*的调试器或者运行时存在的场合，连接协议比实现了协议本身的客户端库提供的API更加重要。

调试适配器并不是VS Code本身的插件，而要创作者封装出一个调试器插件才行，不要担心，你并不需要写太多代码。这个插件只是一个容器，在`package.json`中只要提供必要的**配置项**即可。当调试器会话运行后，VS Code会进入调试器插件，启动调试适配器，然后用调试适配器协议通信。

下面是我们为调试器插件提供的最新的API。

## 调试器插件API
---

所有供调试使用的插件API都在`vscode.debug`下的命名空间中，你可以在[vscode 命名空间API参考](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/vscode-api.md#debug)中查看。

#### 调试型钩子

所有调试型的钩子都在`DebugConfigurationProvider`中。

`registerDebugConfigurationProvider`注册了`DebugConfigurationProvider`，调试器类型本身是在[发布内容配置项`debugger`](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-points.md#contributesdebuggers)中配置的。

当前，你可以使用的钩子有：

- 只要VS Code通过`launch.json`初始化出一个新的调试器配置就会为所有注册了`DebugConfigurationProviders`的插件调用`provideDebugConfigurations`，然后合并返回的调试器配置，注入到package.json中。
- VS Code每次在启动调试会话前调用`resolveDebugConfiguration`方法，`resolveDebugConfiguration`的实现可以通过给调试配置中传入缺省值或者添加/改变/移除配置项的方式和调试配置“通信”。通过这个机制，甚至可以实时调整调试类型。

- `debugAdapterExecutable`方法会在VS Code启动了调试器之后调用，这个方法会返回调试适配器执行的路径（接受可选参数）。如果没有实现这个方法，VS Code则会使用package.json中配置的静态路径。


#### 调试会话生命周期API

一个调试会话在插件API中表示为`DebugSession`，它的声明周期可以通过下列方式控制和追踪：
- `startDebugging `：调试启动时触发，可以接受一个命名的调试器/复合配置/内存中的配置。
- `onDidStartDebugSession`：调试会话启动后触发。
- 当前激活的调试会话可由变量`activeDebugSession`获得，调试会话变动反应在`onDidChangeActiveDebugSession`事件中。
- `onDidTerminateDebugSession`：调试会话关闭后触发。

#### 调试会话API

目前调试会话的API还比较少：

- 通过`customRequest`方法将调试适配器的请求发送到受控调试方。
- 自定义的调试适配器事件在`onDidReceiveDebugSessionCustomEvent`中获取。

#### 断点API

所有的断点类型都是`Breakpoint`的子类，当前提供的子类有`SourceBreakpoint`和`FunctionBreakpoint`

- `vscode.debug.breakpoints`提供了工作区所有的断点集合。用`instanceof`检查单个断点的具体对象类型。
- `vscode.debug.onDidChangeBreakpoints`侦听断点的添加、移除、改变事件。
- `SourceBreakpoints`和`FunctionBreakpoints`只能通过`addBreakpoints`和`removeBreakpoints`函数添加。

!>注意：一开始获取断点可能是一个空数组，而随后则会触发`BreakpointsChangeEvent`事件并更新`vscode.debug.breakpoints`，在这个时间点你就能获得正确的集合。所以如果你需要正确的断点集合，不要忘了注册`BreakpointsChangeEvent`事件。

## 调试适配器协议（DAP - Debug Adapter Protocol）
---
你可以在[vscode-debugadapter-node](https://github.com/Microsoft/vscode-debugadapter-node)仓库中找到JSON格式或者TypeScript定义的[调试适配器协议](https://microsoft.github.io/debug-adapter-protocol)规格说明书。这两个文件都详细地列出了每个协议的请求、响应和事件结构。这个协议在NPM库[vscode-debugprotocol](https://www.npmjs.com/package/vscode-debugprotocol)中也可以找到。

我们已经实现了调试适配器协议的TypeScript和C#客户端版本，不过只有JavaScript/TypeScript的客户端库在NPM[vscode-debugadapter-node](https://github.com/Microsoft/vscode-debugadapter-node)中是可用的。C#的库可以在[Mono Debug](https://github.com/Microsoft/vscode-mono-debug/blob/master/src/DebugSession.cs)中找到。

下列调试器插件项目会教你如何实现调试适配器：

GitHub项目 | 描述 | 实现语言
--- | --- | ---
[Mock Debug](https://github.com/Microsoft/vscode-mock-debug.git) | 一个假的调试器 | TypeScript
[Node Debug2](https://github.com/Microsoft/vscode-node-debug2.git) | 内建的基于CDP-based的Node.js调试器 |TypeScript
[Node Debug](https://github.com/Microsoft/vscode-node-debug.git) | 内建的传统Node.js调试器 |TypeScript
[Mono Debug](https://github.com/Microsoft/vscode-mono-debug.git) | 一个供Mono使用的简单的C#调试器 | C#

## 一语道破——调试适配器协议
---
我们快速地看一下VS Code和调试器间的互动，这应该能帮你快速地实现基于调试适配器协议的调试适配器。

调试器会话启动，VS Code加载调试适配器，通过*stdin*和*stdout*进行通信。VS Code发送了一个**初始化**请求，然后用*行列值是0，1*的路径格式信息（原生或URI）配置好调试器。如果你的调试器是TypeScript或C#实现的`Debugsession`中派生出来的，你则不需要自行处理初始化请求。

根据用户创建的启动配置文件中的*请求*属性，VS Code会发送*加载（launch）*或是*附加（attch）*请求。对于**加载**类型，调试适配器需要加载一个运行时或者可以调试的程序。如果这个程序可以通过stdin/stdout和用户进行交互，那么调试适配器就会在一个可交互的终端或者控制台加载这个程序。对于**附加**类型，调试适配器则会连接或者附加到一个已经运行的程序上面。

因为这两种请求的参数都高度依赖特定的调试适配器实现，所以调试适配器协议不提供任何参数描述。而VS Code则会把所有用户启动配置传给*加载*或*附加*请求。这两种属性的智能补全和悬停信息提示可以在适配器插件中的`package.json`进行配置，以帮助用户知道何时可以创建或编辑*启动配置*。

VS Code会帮调试适配器保留断点，所以必须要在调试会话启动时，对应地注册适配器中的断点。因为VS Code不知道注册断点的最佳时机，所以调试适配器会发送一个**initialize**事件给VS Code，告知它已经准备好接收断点配置请求了。

然后VS Code就会调用断点配置请求，发送所有的断点：

* **setBreakpoints** 为每个源文件带上断点，
* **setFunctionBreakpoints** 如果调试适配器支持函数断点，
* **setExceptionBreakpoints** 如果调试适配器支持异常选项，
* **configurationDoneRequest** 指示配置序列已经结束。

所以，当你准备好了的时候不要忘了发送*initialize*事件接收断点。不然已保留的断点不会再储存下来。

*setBreakpoints*请求为文件设置所有已存在的断点（所以不是增量的哦）。常见的场景就是为某个文件清除所有的断点，然后再根据请求设置断点。*setFunctionBreakpoints*和*setFunctionBreakpoints*需要返回真正的断点，然后VS Code就会动态地更新UI，如果断点无法跟随请求设置然后就会在后台移除。

当程序停止（在程序入口，断点命中，抛出异常，或者用户需要暂停执行），那么调试适配器必须发出**stopped**事件，带上原因和线程id。根据这条信息，VS Code会先请求**threads**（见下），然后列出停止的线程的堆栈追踪日志（栈帧列表）。如果用户深入到栈帧（stack frame）中去，VS Code会先请求这个栈帧的**scopes**，然后是这个scope的变量。如果变量是自构建的，VS Code会通过额外的*variables*请求获取它的属性。这个过程会生成下列事件层级：

```
Threads
   Stackframes
      Scopes
         Variables
            ...
               Variables
```
VS Code调试界面支持多线程（如果你只用Node.js调试器的话可能还不知道这个功能）。当VS Code接收到**stopped**或**thread**事件，然后它会立刻请求当时所有的**threads**并显示到界面上。如果只检测到一个线程，VS Code则会保留在单线程模式。**Thread**事件是可选的，不过调试适配器可以强制发送这个事件，即使不在暂停状态，VS Code也会动态地更新线程界面。

成功地**加载**或**附加**了调试适配器后，VS Code会发送**threads**请求当前线程，获取线程基线，然后开始侦听**threads**事件检查是否有新的或是终止的线程。即使你的调试适配器不支持多线程，它也必须实现**threads**请求，然后返回一个（虚假的）线程。线程的id必须要在所有需要线程id的地方消费掉，比如：**stacktrace**， **pause**，**continue**，**next**，**stepIn**，和 **stepOut**。

当发送**disconnect**请求时，VS Code会终止调试会话。如果调试目标在*加载*时被断开了，那么则会终止目标程序（如果必要的话，会强制终止）。如果调试目标在*附加*初始化时断开，那么则会立刻断开目标（程序则会继续执行）。在目标正常终止或崩溃时，调试适配器必须触发一个**terminated**事件。收到断开请求后，VS Code就会关闭调试适配器。

## 下一步
学习更多VS Code扩展性模型，请参阅下列主题：

* [示例：调试器](/extension-authoring/example-debug-adapter.md) - 查看一个可执行的'模拟'调试器示例。
* [插件API概览](/extensibility-reference/vscode-api.md) - 学习完整的VS Code扩展性模型。
* [插件配置清单](/extensibility-reference/extension-manifest.md) - VS Code的package.json插件配置清单参阅
* [发布内容配置](/extensibility-reference/contribution-points.md) - VS Code发布内容配置参阅