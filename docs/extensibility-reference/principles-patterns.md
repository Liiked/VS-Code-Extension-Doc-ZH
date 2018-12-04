# 扩展性原则和模式

## 扩展性实现
---

VS Code有着非常丰富的扩展性模型和生产插件的方法。不过我们没有给插件作者提供直接操作底层UI DOM的方法。在VS Code开发中，我们会不断优化底层web技术的使用使其达到高可用、高响应的状态，我们会随着这些技术和产品的演进继续调整DOM的使用方式。为了维持其性能和兼容性，插件在独立的进程中运行同时阻止插件作者直接操作DOM，这样有助于保持不同编程语言实现的插件一致性，VS Code还为很多场景提供了一整套内置的UI组件，如IntelliSense，这样一来，插件开发者也就不需要重复造轮子了。

这些规定乍看可能比较严格，我们也一直在寻找更好的方法改进我们的扩展性，增加插件的能力，期待聆听你的反馈和意见。

## 核心
---

#### 插件独立 - 稳定性

插件虽好但是它会影响到VS Code的启动性能和整体稳定性，所以VS Code为插件的加载和执行单独开辟了一条进程，`extension host process`，这样一来出错的插件就不会影响到VS Code，尤其是在VS Code刚启动的时候。

这样的架构确保了终端用户能控制住VS Code：不论什么时候，用户都可以打开、输入、保存文件，不管插件在做什么VS Code都需要保证UI的及时响应。

`extension host`是一个Node.js进程，并将VS Code API暴露给了插件开发者。VS Code在`extension host`下为插件提供了debug支持。

#### 插件激活时机 - 性能

VS Code会尽可能晚地加载插件，为了达到控制内存的目的，如果插件在会话期间没有用到就不会加载。为了帮助开发者理解插件的懒加载机制，VS Code提供了称之为`activation events`的事件表。激活事件定义了特定的触发时机，比如：一个Markdown辅助插件只需要在用户打开Markdown文件的时候启动。

#### Extension Manifest（插件配置清单）

为了激活一个懒加载插件，VS Code需要一份插件的描述文件，`插件清单（extension manifest）`是一份添加了[VS Code特定字段](/extensibility-reference/extension-manifest.md)的`package.json`文件，其中包含了激活事件的配置位置。VS Code提供了一系列插件可以使用的`发布内容配置（contribution points）`。例如，想给VS Code添加一个指令，则需要你在名为`commands`的配置点中定义指令。一旦你在`package.json`中定义好了配置。VS Code 在启动时会读取、解析这个清单然后准备相应的UI界面。

?> **译者注**：定义在发布内容配置中的有些东西会暴露在用户的**配置**中，用户可以通过setting.json等文件修改你的插件行为，因此叫做这个略拗口的名字——发布内容配置。**配置点**则是构成发布内容配置的一个个键值对。

查看更多的[package.json 发布内容配置](/extensibility-reference/contribution-points.md)

#### 扩展性API

查看[扩展性API](/extensibility-reference/vscode-api.md)取得更多细节。

为了修改和自定义UI，VS Code采用了强有力的Web技术（HTML，CSS）。你可以很轻松地给DOM添加节点，然后使用CSS定义它的样式。不过，这个技术也并非没有缺陷，尤其是在实现像VS Code这样复杂的应用时。

易变的界面结构和紧密绑定到UI上的插件一起工作时可能会导致崩溃，因此VS Code采用了预防性的措施避免这种问题——不提供操作DOM的API。

#### 基于协议的插件

在VS Code中比较常见的场景是插件在各自独立的进程中运行，然后通过特定协议与VS Code进行通信，比如：语言服务器和调试适配器。

一般来说，这个通信协议使用 stdin/stdout 标准和JSON载荷进行消息传输。

使用分离的进程有助于插件建立独立的边界，维持VS Code核心编辑器进程的稳定性，同时也有助于插件开发人员为特定的插件实现选择合适的编程语言。

## 扩展性模式
---

扩展性API遵循下列模式。

#### Promises（异步）

VS Code API完全采用了promise的实现。对于插件来说允许任何promise形式的返回格式，如ES6，WinJS，A+等。

一个promise库需要它的API使用`Thenable`类型来表达，`Thenable`类型代表了一种通用特性的实现——then方法。

大多数时候promise是一个可选项，VS Code调用插件之后，它能直接处理正常的返回结果也能处理`Thenable`的结果类型。当promise是可选的API返回结果时，API会在返回类型中用`Thenable`表示。

```typescript
provideNumber(): number | Thenable<number>
```

#### Cancellation Tokens（取消式令牌）

有些事件可能从不稳定的变化状态开始，而随着状态变化这一事件最后肯能被取消了。比如：IntelliSense（智能补全）被触发后，用户持续输入的行为使得这一操作最终被取消了。

API也为这种行为提供了解决方案，你可以通过`CancellationToken`检查取消的状态（`isCancellationRequested`）或者当*取消*发生时得到通知（`onCancellationRequested`）。取消式令牌通常是API函数的最后一个（可选）参数。

#### Disposables（释放器）

VS Code API使用了[释放器模式](https://en.wikipedia.org/wiki/Dispose_pattern)，这个模式被用于事件侦听，命令，UI交互和各类语言配置上。

例如：`setStatusBarMessage(value: string)`事件返回一个`Disposable`对象，这个对象最终调用`dispose`方法移除message。

#### Events（事件）

事件在API中被暴露为函数，当你订阅一个事件侦听器时绑定。事件侦听器调用后会返回一个`Disposable`，它会在dispose触发后，移除事件侦听器。

```typescript
var listener = function(event) {
    console.log("It happened", event);
};

// 开始侦听
var subscription = fsWatcher.onDidDelete(listener);

// 你的代码

subscription.dispose(); // 停止侦听
```

事件的命名规则遵循`on[Will | Did] 动词 + 名词`的形式。通过`onWill`表示将要发生，`onDid`表示已经发生，`动词`表示行为，`名词`指代上下文或目标。

举个栗子：`window.onDidChangeActiveTextEditor`中，激活的编辑器（ActiveTextEditor：`名词`）变动（change：`动词`）后（`onDid`）会触发事件。

## 严格null检查
---

VS CodeAPI使用`undefined`和`null`的Typescript类型，同样也支持[严格null检查](https://github.com/Microsoft/TypeScript/pull/7140)。

## 在插件中使用Node.js模块
---

就像一个node模块，你可以把依赖添加到`pacakge.json`中的`dependencies`字段中去，甚至把VS Code[专用的node模块包](https://code.visualstudio.com/docs/extensionAPI/extension-manifest#_useful-node-modules)加进去。

安装和打包

VS Code不会在用户安装插件时，把你的依赖安装起来，所以你需要在发布之前使用`npm install`。插件的发布包中包含着所有的依赖。使用`vsce ls`命令列出`vsce`之后会包含的依赖包。

使用`.vscodeignore`文件排除掉已经在你插件依赖中的包。查看`vsce`发布工具，查看更多[相关细节](https://code.visualstudio.com/docs/extensions/publish-extension#_vscodeignore)。

## FAQ
---
**问：我能在插件中使用原生Node.js模块吗？**

答：如果你在Windows平台上开发了一个原生模块插件，当你发布插件时，Windows上的编译器会将原生依赖编译进去，这样一来，macOS或者Linux的用户就用不了插件了。

目前这个问题的唯一方案是，将4个平台（Windows x86和x64，Linux，macOS）的所有二进制文件包含进来，并让这些代码在不同平台上动态加载。

我们不建议插件使用原生npm模块，因为原生模块会和插件打包，每当VS Code更新，这个包会随VS Code内置的node.js版本重新编译。你能在开发者工具(帮助 > 打开开发者工具)中运行`process.versions`找到Node.js和模块版本。

## 下一步

[插件配置清单](/extensibility-reference/extension-manifest.md) - VS Code的专有package.json文件参考

[发布内容配置点](/extensibility-reference/contribution-points.md) - VS Code属性表参考

[激活事件](/extensibility-reference/activation-events.md) - VS Code激活事件参考