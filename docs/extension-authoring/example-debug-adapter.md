# 示例-调试适配器

虽然VS Code实现了一个原生的调试界面，但是它不能直接和调试器通信，而是依赖于*调试插件*实现调试和运行时的功能特性。

这些调试插件各不相同，主要是因为他们的实现并不运行在扩展主机中，而是作为一个分离的独立程序。我们称这些调试插件为*适配器*是因为他们能“适配”API、具体的调试器，或者由VS Code定义的**调试适配器协议**(DAP)。

![适配器运行框架](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/extensibility-architecture.png)

将调试适配器作为单独的运行程序有两方面的原因：第一，对于适合的调试器或者运行时，有其对应的语言来实现；第二，一个独立的程序能运行于底层调试器或者运行时上，也更轻松地运行在特权模式中。

为了避免本地防火墙的问题，VS Code依靠stdin/stdou和适配器通信，而不是sockets等的通信流行机制。

每个调试器插件定义了一种调试`类型`，而且会被VS Code的启动配置使用。当调试器session结束，调试器也会关闭。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-arch.png)

VS Code自带Node.js的调试插件。你也可以在[插件市场](https://marketplace.visualstudio.com/vscode/Debuggers)找到更多调试插件，本篇教程接下来会告诉你怎么开发一个调试器插件。

## 插件Mock Debug
---

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
---

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

之后会弹出一个新的VS Code窗口“[扩展开发主机]”，Mock Debug插件就运行在调试模式中。在这个窗口中打开`mock test`，再打开`readme.md`文件，`F5`启动调试会话。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-mock-session.png)

现在插件已经启动在调试模式中了，你可以在`src/extension.ts`打断点，但是就如我之前所说，这个文件没有什么有意思的代码，真正重要的部分都在调试适配器中。

想要调试*调试适配器*本身，我们必须首先运行在调试模式中。运行调试适配器服务，然后配置VS Code连接上就好了。选中调试面板，从下拉面板中加载`Server`配置文件，然后按下绿色的开始按钮。

因为我们已经激活了一个插件的调试会话，VS Code调试器界面现在进入了一个多会话模式，我们也能从调试窗口中看到**Extention**和**Server**的调用栈视图：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-extension-server.png)

现在我们可以调试2个插件了，同时模拟调试适配器。使用**Extension + Server**的启动配置文件可以更快到达这一步。我们在[下面](/extension-authoring/example-debug-adapter?id=可选方案：开发一个调试插件)提供了一个更为简单的调试**插件**和**调试适配器**的方案。

那么回到正题，我们现在给`src/mockDebug.ts`的`launchRequest(...)`方法开头添加一个断点，最后在*启动配置*中添加`debugServer`和`4711`端口将mock debugger连接到调试适配服务器。

```typescript
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

如果你现在加载了这份调试配置，VS Code就不会将mock debug适配器作为分离进程启动，而是直接连接到已启动的服务器端口`4711`上，然后你就可以在`launchRequest`上打断点了。

在这个步骤之后，你就可以轻松地编辑，编译和调试Mock Debug项目了。

但是真正的工作现在才开始：你需要把`src/mockDebug.ts`和`src/mockRuntime.ts`中的关于"mock"的实现替换成真正和*调试器*或者*运行时*通信的代码，你首先可能需要理解[调试适配器协议](https://code.visualstudio.com/docs/extensionAPI/api-debugging)。

## 剖析调试插件的package.json
---

`package.json`文件除了提供调试器所需的调试适配器和调试插件的实现细节之外，这个文件还包括了各式各样和调试相关的*内容配置点*。

我们现在就来仔细看看Mock Debug的`package.json`

就像每个VS Code插件一样，`package.json`声明了基本的插件属性如**name**，**publisher**，**version**。而**categories**帮助我们能更快地在插件市场找到它。
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
    "categories": [ "Debuggers" ],

    "contributes": {
        "breakpoints": [
            { "language": "markdown" }
        ],
        "debuggers": [{
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
        }]
    },

    "activationEvents": [
        "onDebug",
        "onCommand:extension.mock-debug.getProgramName"
    ]
}
```

现在我们看看调试插件所需的**发布内容配置（contributes）**部分。

第一个是**breakpoints**内容配置点，它列出了支持设置断点的语言，没有这个配置点的话，我们就不能在Markdown文件里设置断点了。

第二个是**debuggers**部分，这里给出了一个调试器，也就是**type**描述的"mock"。用户可以在选择加载调试配置文件的时候看到这个type。可选的**label**属性作为type的别称最后会显示在界面上。

既然调试插件用了调试适配器，所以它的相对路径可以在**program**中定义。为了使插件自包含，应用必须在插件文件夹内。为了方便起见，我们把这个应用所在的文件夹命名为`out`和`bin`，不过你想用别的名字也随便。

因为让VS Code运行在不同的平台上，所以我们的调试适配程序也必须支持不同的平台，所以我们有了下列选项：

1. 如果程序是平台无关的，如：程序需要一个统一的运行时支持，那么你可以通过**runtime**指定，本项目就是采用了这个方法。到目前为止，VS Code支持`node`和`mono`运行时。

2. 如果实现你的调试适配器需要执行在不同平台，那么**program**配置可以像下面这样指定：
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

3. 组合上面的两种方式也是可行的。下面是一个Mono Debug适配器，只需要macOs和Linux，而不需要Windows支持。
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

**configurationAttributes**表示这个调试器是支持`launch.json`配置，开启之后它会校验`launch.json`。另外这个属性还会启用：编辑*启动配置*文件时的智能提示和悬浮帮助文本。

**initialConfigurations**定义了`launch.json`的初始默认内容。以便于项目不包含`launch.json`文件时，用户打开调试或者按下调试侧边栏的齿轮按钮后仍能启动调试会话，VS Code会让用户选择一个调试环境，然后生成对应的`launch.json`：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-debuggers/debug-init-config.png)

**configurationSnippets**定义了编辑`launch.json`*启动配置*文件的配置补全。方便起见，给调试环境名称加上`label`前缀以便于补全下拉框出现时能快速地找到我们的目标。

**variables**字段将"variables"绑定到了"commands"，用**${command:Xxxx}**语法在*启动配置*中使用这些变量，调试会话启动后这些值会被替换掉。

命令是在插件中实现的，它可既可以提供简单的无界面实现，也可以通过插件API提供界面中的复杂功能点。Mock Debug将`AskForProgramName`变量绑定到`extension.mock-debug.getProgramName`命令上。这个命令的[实现](https://github.com/Microsoft/vscode-mock-debug/blob/431857ca27e618e2e7164628ff41fa8cedd01bff/src/extension.ts#L33)在`src/extension.ts`中，让用户用`showInputBox`输入程序的名称。
```typescript
vscode.commands.registerCommand('extension.mock-debug.getProgramName', config => {
    return vscode.window.showInputBox({
        placeHolder: "Please enter the name of a markdown file in the workspace folder",
        value: "readme.md"
    });
});
```
这个变量可以用**${command:AskForProgramName}**形式注入到任何*加载配置*允许字符串类型的地方。

## 使用DebugConfigurationProvider
---

如果`package.json`中的静态调试*发布配置内容*不够，那`DebugConfigurationProvider`就派上用场了，它能动态控制调试插件的下列内容：

- 动态生成launch.json中的debug配置，例如：基于一些工作区可用的上下文信息。
- 启动新的调试会话前“解析”*加载配置*，比如根据工作区的一些信息填充默认值。
- 动态计算调试适配器的可执行路径或者其他命令行参数。

`src/extension.ts`中的`MockConfigurationProvider`实现了`resolveDebugConfiguration`，如果Markdown文件打开而启动调试会话后检测是否有launch.json文件存在。这是一个非常典型的用户场景，用户在编辑器内打开了文件，想要调试的时候却发现没有launch.json文件。

`vscode.debug.registerDebugConfigurationProvider`是一个调试供应器（debug configuration provider）注册的特殊调试类型，一般出现在`activate`函数中。为了确保`DebugConfigurationProvider`尽早注册，插件必须在调试功能启动之前就激活，我们可以在`package.json`的`onDebug`事件中配置插件激活事件：

```json
"activationEvents": [
    "onDebug",
    // ...
],
```

这个总的`onDebug`事件在调试功能一启动就会被调用。如果插件的启动开销不大（如：启动时不要花太多时间）那就会运行正常。如果调试插件的启动开销很大（如：启动一个语言服务器），那么`onDebug`激活事件就会对其他调试插件产生负面影响了，因为它只想尽早启动，而不会把其他类型的调试器考虑在内。

对于高开销调试插件的更好办法是用粒度更细的激活事件：
- `onDebugInitialConfigurations`：在`DebugConfigurationProvider`的`provideDebugConfigurations`调用前触发。
- `onDebugResolve:type`：在`DebugConfigurationProvider`的`resolveDebugConfiguration`调用前触发。

!> **首要准则**：如果插件的开销不大，就用`onDebug`。如果插件的开销比较高，根据`DebugConfigurationProvider`是否调用`provideDebugConfigurations`或`resolveDebugConfiguration`，在对应的`onDebugInitialConfigurations`或者`onDebugResolve`中处理。

## 发布你的调试适配器
---

通过下面的步骤将你的调试适配器发布到市场上：
- 更新`package.json`中的发布配置内容表明你调试适配器的功能和目标
- 根据[分享插件](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md)部分把你的插件上传到市场上

## 可选方案：开发一个调试插件
---

开发调试插件一般既包含插件，也包含*调试器*和*调试适配器*这两个平行session。就如上面解释的，VS Code对一点支持非常友好，不过如果想要开发得更容易的话，还是把插件和调试适配器放在一个程序里，用一个会话启动更方便些。

当你在使用Typescript/Javascript实现调试适配器的时候会更容易。

基本的思路是在`DebugConfigurationProvider`的`resolveDebugConfiguration`方法中拦截调试会话的加载，然后对*连接请求*就行侦听，对每一个请求创建新的调试适配器会话。为了确保VS Code使用*连接请求*（而不是总是加载新的调试适配器），可以修改*加载配置*，加上`debugServer`。

这是几行**Mock Debug**项目[实现的这个方法的代码](https://github.com/Microsoft/vscode-mock-debug/blob/042d19a27a8e3a08f27a24110506b53fbecc75ce/src/extension.ts#L61-L71)

通过将编译时间标识`EMBED_DEBUG_ADAPTER`设置为true启用这个特性。现在如果你用**F5**启动调试，你不仅仅可以插件中打断点了，调试器适配器里也同样可以。