# VS Code API

**VS Code API**是VS Code提供给插件使用的一系列Javascript API。

!> 注意：VS Code API 变动较快，翻译版本的参与人员和精力有限无法保证实时跟进，有需要的小伙伴请自行参考[官方文档](https://code.visualstudio.com/api/references/vscode-api)，其中包含了完整而且是最新的VS Code API列表。

## API模式
---

以下将介绍我们在VS Code中经常使用的API模式。

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

#### 严格null检查

VS CodeAPI使用`undefined`和`null`的Typescript类型，同样也支持[严格null检查](https://github.com/Microsoft/TypeScript/pull/7140)。
