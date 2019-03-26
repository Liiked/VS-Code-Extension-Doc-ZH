# 虚拟文档

通过VS Code的文本内容供应器API(text document content provider API)，你可以为任意来源的文件创建只读文档。本示例源码请查看[https://github.com/Microsoft/vscode-extension-samples/blob/master/virtual-document-sample/README.md](https://github.com/Microsoft/vscode-extension-samples/blob/master/virtual-document-sample/README.md)

## TextDocumentContentProvider
---

这个API工作于uri协议之上，你需要声明一个*供应器函数(provider)*，然后这个函数还需要返回文本内容。供应器函数必须提供*协议(scheme)*，而且函数注册之后不可改变这个协议。一个供应器函数可以对应多个协议，而多个供应器函数也可以只注册一个协议。

```typescript
vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider);
```

调用`registerTextDocumentContentProvider`函数会返回一个用于释放资源的*释放器*。供应器函数还必须实现`provideTextDocumentContent`函数，这个函数需要传入uri参数和取消式令牌(cancellation token)调用。

```typescript
const myProvider = class implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		// 简单调用cowsay, 直接把uri-path当做文本内容
		return cowsay.say({ text: uri.path });
	}
};
```

!> **注意**：我们的供应器函数不为虚拟文档创建uri——他的角色仅仅只是**根据uri返回对应的文本内容**。

下面我们简单使用一个'cowsay'命令创建一个uri，然后编辑器就能显示了：

```typescript
vscode.commands.registerCommand('cowsay.say', async () => {
	let what = await vscode.window.showInputBox({ placeHolder: 'cow say?' });
	if (what) {
		let uri = vscode.Uri.parse('cowsay:' + what);
		let doc = await vscode.workspace.openTextDocument(uri); // 调用供应器函数
		await vscode.window.showTextDocument(doc, { preview: false });
	}
});
```

这个命令首先弹出了一个输入框，然后创建了一个*`cowsay`协议*的uri，再然后根据这个uri读取了文档，最后为这个文档内容打开了一个编辑器（这里的“编辑器”不是指VS Code本身，而是VS Code中打开的单个编辑区tab）。在第三步中，*供应器函数*需要为这个uri提供对应的内容。

经过这整个流程，我们才算完整地实现了一个*文本内容供应器*，接下来的部分我们继续学习怎么更新虚拟文档，怎么注册虚拟文档的 UI命令。

### 更新虚拟文档

为了支持跟踪虚拟文档发生的变化，供应器实现了`onDidChange`事件。如果文档正在被使用，那么必须为其提供一个uri来调用它，同时编辑器会请求新的内容。

`vscode.Event`定义了VS Code的事件规范。实现事件的最好方式就是使用`vscode.EventEmitter`，比如：

```typescript
const myProvider = class implements vscode.TextDocumentContentProvider {
  // 事件发射器和事件
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  //...
};
```

上述就是VS Code监听虚拟文档变化所必须的内容。下面将使用事件发射器来添加*编辑器行为*。

### 添加编辑器命令

为了阐述事件变动和获取更多cowsay，我们需要倒叙cow刚刚说的东西。首先我们需要一个命令：

```typescript
// 注册一个可以更新当前cow的命令
subscriptions.push(
	vscode.commands.registerCommand('cowsay.backwards', async () => {
		if (!vscode.window.activeTextEditor) {
			return; // 不打开编辑器
		}
		let { document } = vscode.window.activeTextEditor;
		if (document.uri.scheme !== myScheme) {
			return; // 不是我的协议时直接返回
		}
		// 获取path的内容, 对这个内容倒序处理, 然后创建一个新的uri
		let say = document.uri.path;
		let newSay = say
			.split('')
			.reverse()
			.join('');
		let newUri = document.uri.with({ path: newSay });
		await vscode.window.showTextDocument(newUri, { preview: false });
	})
);
```

上面的代码片段检查了我们当前是不是激活了一个编辑器（用户当前选中的编辑器tab），对应的文档是不是符合我们的协议。因为命令是对任何人生效的，所以我们有必要去做这些检查。然后uri的path对象被翻转，再重新创建出一个新的uri，最后则打开了一个编辑器。


注册命令最重要事就是在`package.json`中声明配置。我们在`contributes`部分添加下列配置：
```json
"menus": {
  "editor/title": [
    {
      "command": "cowsay.backwards",
      "group": "navigation",
      "when": "resourceScheme == cowsay"
    }
  ]
}
```
`contributes/commands`中的`cowsay.backwards`命令告诉编辑器*操作*出现在编辑器的标题菜单中（工具栏右上角），但如果只是这样简单的配置，每个编辑器就都会显示这个命令。然后我们的`when`语句就出场了，它描述了何时才显示这个操作。在这个例子中，文档的资源协议必须是`cowsay`，我们的命令才会生效。这个配置对默认显示全部命令的`commandPalette`菜单同样生效。

![cowsay-bwd](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/virtual-documents/cowsay-bwd.png)

### 事件的可见性

*文档供应器函数*是VS Code中的一等公民，它们的内容以常规的文本文档格式呈现，它们共用一套基础实现方式——如：使用了文件系统的实现。这也就意味着“你的”文档无法被隐藏，它们必定会出现在`onDidOpenTextDocument`和`onDidCloseTextDocument`事件中，它们是`vscode.workspace.textDocuments`中的一部分。通用的准则就是根据文档的`协议`决定你是否需要对文档进行什么操作。

### 文件系统API

如果你需要更强的灵活性和掌控力，请查看[`FileSystemProvider`](https://code.visualstudio.com/api/references/vscode-api#FileSystemProvider)API，它可以实现整套完整的文件系统，获取文件、文件夹、二进制数据，删除文件，创建文件等等。