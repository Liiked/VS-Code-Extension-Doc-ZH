# 调试器插件

VS Code已经内置了一套通用的用户界面，插件作者能够通过VS Code的调试架构轻松将已有的调试器整合进来。

VS Code已经内置了一个[Node.js](https://nodejs.org/)调试器插件，它将成为你学习VS Code调试器特性的绝佳搭档。

![VS Code调试功能](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/debug-features.png)

上面的截图展示了以下调试功能：

1. 管理调试器配置
2. 开始、停止、步进等调试操作
3. 源、函数、条件断点、行断点和记录点
4. 支持多线程和多进程的调用栈
5. 在*视图*中浏览复杂的数据，鼠标悬停在数据上可以看到更多信息
6. 鼠标悬停在源代码中可以看到变量的值
7. 管理watch表达式
8. 调试控制台支持交互操作，如求值、自动补全等

本节将帮你创建一个任意调试器都可以和VS Code协作的调试器插件。

## VS Code 中的调试架构
---

VS Code基于抽象协议，实现了一个原生（非语言相关的）的调试器UI，它可以和任意后台调试程序通信。通常来讲，调试器不会实现这份协议，因此调试器中需要一些中间件去“适配”这个协议。这个中间件一般而言是一个独立和调试器通信的进程。

![VS Code的调试架构](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/debug-arch1.png)

我们将这个中间件称为**调试适配器（Debug Adapter）**（简写为**DA**），在VS Code和DA之间通信的抽象协议称之为**调试适配器协议(Debug Adapter Protocol)** (简写**DAP**)。调试适配器协议独立于VS Code，它有自己的[网站](https://microsoft.github.io/debug-adapter-protocol/)，你在上面可以找到相关的[介绍和概述](https://microsoft.github.io/debug-adapter-protocol/overview)，以及详细的[说明书](https://microsoft.github.io/debug-adapter-protocol/specification)，上面还列出了一些[已知实现和支持工具](https://microsoft.github.io/debug-adapter-protocol/implementors/adapters/)，这份努力背后的故事和动机，我们都记录在了[博客](https://code.visualstudio.com/blogs/2018/08/07/debug-adapter-protocol-website#_why-the-need-for-decoupling-with-protocols)中。

因为调试适配器独立于VSCode，所以它可用在[其他开发工具](https://microsoft.github.io/debug-adapter-protocol/implementors/tools/)中，它们无需匹配VS Code的插件架构，而只需基于插件和*发布内容配置*即可。

出于这个原因，VS Code提供了一个配置点`debuggers`，调试适配器在这里可以配置特定的调试类型（例如：Node.js调试器使用`node`）。用户只要启动了这个类型的调试适配器会话，VS Code就能加载注册好的调试适配器。

因此调试适配器的最小形式就是声明一个配置，对应调试适配器的实现，这个插件就是调试适配器的装载容器，而且不需要任何多余的代码。

![VS Code调试架构-2](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/debug-arch2.png)

一个更贴近现实的调试器插件往往会添加很多配置，如下面的：
- 调试器支持的语言。VS Code会为这些语言启用UI界面的断点功能
- 由调试器引入的JSON格式的调试配置属性。VS Code会使用这个格式校验launch.json中的配置，并提供补全功能
- 首次加载调试时，VS Code自动生成初始launch.json文件
- 用户可以给launch.json添加的调试配置片段
- 声明调试配置中可以使用的变量

想要了解更多相关内容，请查看[contributes.breakpoints](/extensibility-reference/contribution-points#contributesbreakpoints)和[contributes.debuggers](/extensibility-reference/contribution-points#contributesdebuggers)。

## 模拟调试插件
---

由于从头开始创建一个调试适配器太繁琐了，所以我们将从简单的DA(我们已经创建过的**入门级调试适配器**)开始。因为它不与真正的调试器进行通信，所以就叫它——*模拟调试*吧。

*模拟调试*模拟了调试器功能，支持：

- 单步调试
- 跳到下一个断点
- 断点
- 异常
- 访问变量

在深入了解开发中的*模拟调试*之前，我们先去VS Code插件市场安装个[预构建版本](https://marketplace.visualstudio.com/items?itemName=andreweinand.mock-debug)玩一玩，就像下面这样：

- 打开VS Code的插件面板，输入"mock"并找到**Mock Debug**插件
- **安装**并**重启**

通过如下流程来启动*模拟调试*：

- 新建一个空的文件夹`mock test`并在VS Code中打开
- 创建一个`readme.md`，在里面随便写点什么东西
- 切换到**调试**视图，点一下**齿轮图标**
- VS Code会让你选择一个"环境"，并将其作为默认的启动配置。这里选择"Mock Debug"。
- 点击绿色的**开始**按钮，然后开始调试

至此，一个调试会话就开始了，你可以在`readme.md`文件中进行单步调试、打断点。如果某一行出现异常则会跳进该异常。

![模拟运行调试工具](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/mock-debug.gif)

在使用*模拟调试*之前，我们建议你卸载掉[预构建版本](https://marketplace.visualstudio.com/items?itemName=andreweinand.mock-debug)：

- 切换到Extensions视图，然后单击*模拟调试*插件的齿轮图标
- 卸载该插件并重启VS Code

## 开发环境配置模拟调试
---

现在让我们下载Mock Debug的源码，然后用VS Code进行开发吧：

```bash
git clone https://github.com/Microsoft/vscode-mock-debug.git
cd vscode-mock-debug
npm install
```

用VS Code打开`vscode-mock-debug`项目

我们的项目里面有什么呢？

- `package.json`是mock-debug插件的配置清单：
    - 里面是mock-debug插件的*发布内容配置*清单
    - `compile`和`watch`脚本会将Typescript源码编译到`out`文件夹中，然后`watch`脚本会追踪源码每个细微的修改
    - `vscode-debugprotocol`，`vscode-debugadapter`和`vscode-debugadapter-testsupport`npm依赖包简化了基于node的调试适配器开发工作
- `src/mockRuntime.ts`是一个**模拟的**运行时，仅仅包含一些简单的调试API
- `src/mockDebug.ts`是我们的主要代码，是它将*运行时*适配到**调试适配器**上。你可以在里面找到各种处理DAP请求的方式。
- 调试插件实现于调试适配器，所以你可以完全不使用创建普通插件的代码（比如：原来插件的代码运行在扩展主机环境中），但是mock-debug还是有个小小的`src/extension.ts`，这份代码里面阐释了调试器插件中*插件*部分的代码可以做些什么。

现在构建项目，然后加载Mock Debug插件。选择**调试侧边栏**，加载 **Extension** 配置，然后按下`F5`。接下来，会启动插件的Typescript编译工作，将转换后的代码输出到`out`文件夹中，然后进行全量编译，再接着，*watcher*任务会启动以便侦听你的改动。

代码编译完成后，带有"[Extension Development Host]"（中文环境下是"[扩展开发主机]"）VS Code新窗口会自动打开，Mock Debug插件就运行在调试模式中了。在这个窗口中，打开`mock test`项目，打开里面的`readme.md`，然后直接按下<kbd>F5</kbd>启动调试会话，现在你就可以调试了！

![模拟调试会话](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/debug-mock-session.png)

因为的你插件运行在 *调试模式* 中，所以你能在`src/extension.ts`里面打断点，不过就如上文所说，这个插件关于*插件*本身的代码是没有多少的，最有意思的代码运行在调试适配器里，它是一个独立的进程。

要想调试调试适配器本身，我们需要把它运行在调试模式里。最简单的办法就是将调试适配器以*服务器模式*运行，然后配置VS Code去连接它。在你的vscode-mock-debug项目中，重新在打开的调试侧边栏的配置下拉菜单中选择*Server*配置，按下旁边的绿色开始按钮。

因为我们已经启动了一个调试会话，所以VS Code 调试器UI现在会进入 *多会话* 模式，在**调用栈（CALL STACK）**视图中你现在可以看到2个调试会话—— **Extension** 和 **Server** 。

![调试插件和服务器](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/debugger-extension-server.png)

现在我们可以同时调试插件和DA（调试适配器）了。到我们目前这一步还有个更快的方式，启动调试时选择**Extension + Server**配置就会自动加载这两个会话。

另外，调试插件和调试适配器更简单的方式会在[下面](#开发调试器插件的其他方式)说明。

在`src/mockDebug.ts`中的`launchRequest(...)`最开始的地方打上断点，然后最后一步则是在你的mock test启动配置中添加`debugServer`属性和对应的端口值`4711`就完成了调试器和调试适配器的连接。

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "mock",
			"request": "launch",
			"name": "mock test",
			"program": "${workspaceFolder}/readme.md",
			"stopOnEntry": true,
			"debugServer": 4711
		}
	]
}
```
如果你现在就加载这个调试配置，调试适配器不会以分离的进程启动，而是直接连接到已经存在的本地服务器端口4711上。现在你可以在`launchRequest`打断点了。

经过这样一连串的配置，你终于可以轻松地编辑、编译和调试Mock Debug插件了。

但是好戏才刚刚开始：你需要替换`src/mockDebug.ts`和`src/mockRuntime.ts`的中的调试适配器代码，让它可以和“真正的”调试器或者运行时通信。这项工作涉及到理解和实现调试适配器协议。

更多内容请查看[这里](https://microsoft.github.io/debug-adapter-protocol/overview#How_it_works)。

## 剖析调试器插件的package.json
---

除了提供调试适配的特定实现之外，调试器插件还需要一个配置各种各样和调试相关的`package.json`。

所以下面我们进一步看看Mock Debug的`package.json`.

就像一般的VS Code插件，`package.json`声明了一些基础信息，如插件的**name** ，**publisher**，**version**等。其中配置**categories**字段可以让你的插件更容易在插件市场中被其他人发现。

```json
{
	"name": "mock-debug",
	"displayName": "Mock Debug",
	"version": "0.24.0",
	"publisher": "...",
	"description": "Starter extension for developing debug adapters for VS Code.",
	"author": {
		"name": "...",
		"email": "..."
	},
	"engines": {
		"vscode": "^1.17.0",
		"node": "^7.9.0"
	},
	"icon": "images/mock-debug-icon.png",
	"categories": ["Debuggers"],

	"contributes": {
		"breakpoints": [{ "language": "markdown" }],
		"debuggers": [
			{
				"type": "mock",
				"label": "Mock Debug",

				"program": "./out/mockDebug.js",
				"runtime": "node",

				"configurationAttributes": {
					"launch": {
						"required": ["program"],
						"properties": {
							"program": {
								"type": "string",
								"description": "Absolute path to a text file.",
								"default": "${workspaceFolder}/${command:AskForProgramName}"
							},
							"stopOnEntry": {
								"type": "boolean",
								"description": "Automatically stop after launch.",
								"default": true
							}
						}
					}
				},

				"initialConfigurations": [
					{
						"type": "mock",
						"request": "launch",
						"name": "Ask for file name",
						"program": "${workspaceFolder}/${command:AskForProgramName}",
						"stopOnEntry": true
					}
				],

				"configurationSnippets": [
					{
						"label": "Mock Debug: Launch",
						"description": "A new configuration for launching a mock debug program",
						"body": {
							"type": "mock",
							"request": "launch",
							"name": "${2:Launch Program}",
							"program": "^\"\\${workspaceFolder}/${1:Program}\""
						}
					}
				],

				"variables": {
					"AskForProgramName": "extension.mock-debug.getProgramName"
				}
			}
		]
	},

	"activationEvents": ["onDebug", "onCommand:extension.mock-debug.getProgramName"]
}
```

现在我们来看看调试器插件中的`contributes`部分。

首先，**breakpoints**配置部分列出了可以使用断点的语言列表，没有这个配置的话，就不可能在 Markdown文件中设置断点了。

接下来是**debuggers**部分，这里引入了一个类型是`mock`的调试器，用户可以在调试器加载配置中引用这个类型。可选属性**label**是这个调试器的名字，它会显示在UI上。

因为调试器插件使用了调试适配器，所以它的的关联路径得通过**program**属性配置。为了保证插件的自包含性（self-contained），这个应用必须在我们的插件文件夹中。按惯例，我们将这个应用放在`out`或者`bin`中，当然你也可以使用其他名称的文件夹存放。

因为VS Code运行在不同的平台上，我们需要确保DA程序也能够支持不同的平台。对于这点，我们提供了下列选项：

1. 如果程序在平台上的实现都是各自独立的，比如：这个程序的运行时支持所有平台，你可以在**runtime**属性中指明。
到目前为止，VS Code支持`node`和`moni`运行时，我们的Mock Debug就使用了这个方式。
2. 如果你的DA在不同的平台上对应着不同的可执行程序，那么你可以这样使用**program**属性：

```json
"debuggers": [{
    "type": "gdb",
    "windows": {
        "program": "./bin/gdbDebug.exe",
    },
    "osx": {
        "program": "./bin/gdbDebug.sh",
    },
    "linux": {
        "program": "./bin/gdbDebug.sh",
    }
}]
```

3. 组合上面两种方式也是可以的。下面的例子实现了在macOS和Linux上使用同一个mono应用，但是Windows上就不是。

```json
"debuggers": [{
    "type": "mono",
    "program": "./bin/monoDebug.exe",
    "osx": {
        "runtime": "mono"
    },
    "linux": {
        "runtime": "mono"
    }
}]
```

**configurationAttributes**声明了这个调试器的`launch.json`中的属性可以使用的协议。这个协议用于校验`launch.json`，同时支持编辑加载配置时的智能补全和悬停帮助。

**initialConfigurations**定义了这个调试器的初始`launch.json`。当一个项目没有`launch.json`，然后用户打开了调试会话时，就会使用这个启动配置。然后VS Code会让用户选择一个调试环境，接着再创建对应的`launch.json`：

![调试速选框](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/debugger-extension/debug-init-config.png)

除了在`package.json`中静态定义`launch.json`的初始内容，你还可以使用`DebugConfigurationProvider`动态注入初始配置内容（详情见下[使用DebugConfigurationProvider](#使用DebugConfigurationProvider)）。

**configurationSnippets**定义了编辑`launch.json`会为用户呈现的代码补全提示。同样，按约定`label`属性定义了调试环境的名称，所以当大量补全提示出现的时候，用户才能一眼认出自己想要的那个。

**variables**配置，将“变量”绑定到了“命令”上。这些变量会出现在加载配置（launch.json）中，用法是**${command:xyz}**，调试会话启动后，其中的值会被命令中的返回值替换。

*命令*实现在插件（而不是调试适配器）中，它可以由一句简单的表达式实现，也可以复杂到基于插件API和UI特性实现。Mock Debug将变量`AskForProgramName`绑定到了命令`extension.mock-debug.getProgramName`，这个命令的[实现](https://github.com/Microsoft/vscode-mock-debug/blob/606454ff3bd669867a38d9b2dc7b348d324a3f6b/src/extension.ts#L21-L26)在`src/extension.ts`中，代码中的`showInputBox`允许用户为程序命名：

```typescript
vscode.commands.registerCommand('extension.mock-debug.getProgramName', config => {
	return vscode.window.showInputBox({
		placeHolder: 'Please enter the name of a markdown file in the workspace folder',
		value: 'readme.md'
	});
});
```

现在加载配置（launch.json）中可以使用**${command:AskForProgramName}**中的值（文本类型）了。


## 使用DebugConfigurationProvider
---

如果你觉得`package.json`中和调试相关的发布内容配置不够你用，`DebugConfigurationProvider`可以动态控制调试插件下列方面的内容：

- 动态生成launch.json中的配置。比如：根据工作区的信息生成一些配置。
- 在启动新的调试会话前，解析（或修改）加载配置。有了这个功能，你可以根据工作区的不同填入对应的配置默认值。

`src/extension.ts`中的`MockConfigurationProvider`实现了`resolveDebugConfiguration`，它会检测调试会话启动时是不是还没有launch.json文件，而且Markdown文件已经打开了。这种场景非常常见，用户已经打开了文件，他想要立刻启动调试而且不想要搞任何配置。

通过`vscode.debug.registerDebugConfigurationProvider`注册*调试配置供应器函数*，它一般在插件的`active`函数中。`DebugConfigurationProvider`需要尽早注册，一旦调试功能被使用到了，插件就应该启动。我们通过`package.json`中的`onDebug`事件轻松搞定这个需求：

```json
"activationEvents": [
    "onDebug",
    // ...
],
```

在低开销的插件启动时（启动时不会花太多时间），这个机制会如预期工作。但是如果插件的启动开销较大（比如启动一个语言服务器），那么`onDebug`事件可能会对其他调试插件产生副作用，因为`onDebug`事件已经激活了其他插件，但是其他插件因为阻塞还来不及接收到具体的调试类型。

对于高开销的调试插件来说，更好的方法就是使用粒度更细的 激活事件：

- `onDebugInitialConfigurations`会在`DebugConfigurationProvider`的`provideDebugConfigurations`调用前触发
- `onDebugResolve:type`会在`DebugConfigurationProvider`的`resolveDebugConfiguration`取得具体的调试类型前触发

!> **首要原则：**如果调试插件的开销很小，就用`onDebug`，根据`DebugConfigurationProvider`是否实现了`provideDebugConfigurations`或`resolveDebugConfiguration`，然后在对应的`onDebugInitialConfigurations`或者`onDebugResolve`中处理。

## 发布调试器插件
---

通过下面的步骤将你的调试适配器发布到市场上：

- 更新`package.json`中的发布配置内容表明你调试适配器的功能和目标
- 参考[发布插件](/working-with-extensions/publish-extension)部分然后将你的插件上传到市场上

## 开发调试器插件的其他方式
---

如我们所见，开发一个调试插件涉及到*一个普通插件*再加上一个调试适配器，它们分别运行在不同的会话中。VS Code支持这样的实现，但是简单的办法是还是把*插件*和调试适配器用一个程序实现，这样你就可以在一个调试会话中同时调试了。

实际上，只要你的调试适配器是基于Typescript/Javascript实现的，这个方法就都是可行的。基本的思路是把调试适配器实现为一个服务器，让*插件*去启动这个服务，再让VS Code连接上去，这样你就不用每个调试会话都启动一个新的调试适配器了。

Mock Debug的例子阐述了一个[DebugAdapterDescriptorFactory](https://github.com/Microsoft/vscode-mock-debug/blob/6a2ef01b95bb22cdf55683f4d616cad501051510/src/extension.ts#L74-L98)可以怎样创建和[注册](https://github.com/Microsoft/vscode-mock-debug/blob/6a2ef01b95bb22cdf55683f4d616cad501051510/src/extension.ts#L32-L36)一个基于服务器的调试适配器。通过将编译时的[`EMBED_DEBUG_ADAPTER`](https://github.com/Microsoft/vscode-mock-debug/blob/6a2ef01b95bb22cdf55683f4d616cad501051510/src/extension.ts#L17)配置设置为true启用这个特性。现在如果你用**F5**启动调试，你就不仅仅是在插件开发主机中打了断点，你也同时在调试适配器中打了同样的断点。