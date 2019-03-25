# 命令

命令会触发VS Code中注册的行为，如果你[配置过键位](https://code.visualstudio.com/docs/getstarted/keybindings)，那么你就处理过了命令。命令也是插件将功能暴露给用户的地方，它绑定了VS Code UI中的行为，并在内部处理了相关逻辑。

## 使用命令
---

VS Code内部含有大量和编辑器交互、控制UI、后台操作的[内置命令](/references/commands)。许多插件将它们的核心功能暴露为*命令*的形式供用户或者其他插件使用。

### 程序性执行一个命令

[`vscode.commands.executeCommand`](https://code.visualstudio.com/api/references/vscode-api#commands.executeCommand)API可以程序性调用一个命令，你可以通过它将VS Code的内置函数构建在你的插件中，比如VS Code内置的Git和Markdown插件中的东西。

我们看个例子🌰：`editor.action.addCommentLine`命令可以将当前选中行变成注释(你可以偷偷把这个功能地集成到你自己的插件中哦)：
```typescript
import * as vscode from 'vscode';

function commentLine() {
	vscode.commands.executeCommand('editor.action.addCommentLine');
}
```

有些命令可以接收改变行为的参数，有些会有返回结果。形如`vscode.executeDefinitionProvider`的API，它要求传入一个document的URI地址和position作为参数，并返回一个包含定义列表的promise：

```typescript
import * as vscode from 'vscode';

async function printDefinitionsForActiveEditor() {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		return;
	}

	const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
		'vscode.executeDefinitionProvider',
		activeEditor.document.uri,
		activeEditor.selection.active
	);

	for (const definition of definitions) {
		console.log(definition);
	}
}
```

更多命令详见：
- [浏览键盘快捷键](https://code.visualstudio.com/docs/getstarted/keybindings)
- [VS Code内置高级命令API](/references/commands)

### 命令的URLs

命令URI是执行注册命令的链接。它们可被用于悬停文本上的可点击链接，代码补全提示中的细节信息，甚至可以出现在webview中。

命令URI使用`command`作为协议头，然后紧跟着命令名称。比如：`editor.action.addCommentLine`的命令URI是：`command:editor.action.addCommentLine`。下面是一个显示在当前行注释中显示链接的悬停函数。

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerHoverProvider(
		'javascript',
		new class implements vscode.HoverProvider {
			provideHover(
				_document: vscode.TextDocument,
				_position: vscode.Position,
				_token: vscode.CancellationToken
			): vscode.ProviderResult<vscode.Hover> {
				const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
				const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);

				// command URIs如果想在Markdown 内容中生效, 你必须设置`isTrusted`。
				// 当创建可信的Markdown 字符, 请合理地清理所有的输入内容
				// 以便你期望的命令command URIs生效
				contents.isTrusted = true;

				return new vscode.Hover(contents);
			}
		}()
	);
}
```

命令上的参数列表会从JSON数组变成URI格式：下面的例子使用了`git.stage`命令创建一个悬停操作——将当前文件进行git暂存：

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerHoverProvider(
		'javascript',
		new class implements vscode.HoverProvider {
			provideHover(
				document: vscode.TextDocument,
				_position: vscode.Position,
				_token: vscode.CancellationToken
			): vscode.ProviderResult<vscode.Hover> {
				const args = [{ resourceUri: document.uri }];
				const commentCommandUri = vscode.Uri.parse(
					`command:git.stage?${encodeURIComponent(JSON.stringify(args))}`
				);
				const contents = new vscode.MarkdownString(`[Stage file](${commentCommandUri})`);
				contents.isTrusted = true;
				return new vscode.Hover(contents);
			}
		}()
	);
}
```

## 新建命令
---

### 注册一个命令

[`vscode.commands.registerCommand`](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)会把命令ID绑定到你插件的函数上：
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const command = 'myExtension.sayHello';

	const commandHandler = (name?: string = 'world') => {
		console.log(`Hello ${name}!!!`);
	};

	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}
```

只要`myExtension.sayHello`命令执行，就会调用对应的处理函数，你也可以通过`executeCommand`程序性调用它，或者从VS Code UI中，抑或快捷键的方式调用。

### 创建面向用户的命令
`vscode.commands.registerCommand`仅仅是将命令id绑定到了处理函数上，如果想让用户从*命令面板*中找到你的命令，你还需要在`package.json`中配置对应的命令`配置项(contribution)`：
```json
{
	"contributes": {
		"commands": [
			{
				"command": "myExtension.sayHello",
				"title": "Say Hello"
			}
		]
	}
}
```

`commands`配置告诉VS Code你的插件提供了一个命令，而且允许你控制命令在UI中的显示。现在，我们的命令终于出现在*命令面板*中了：

![命令面板](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/commands/palette.png)

我们依旧需要使用`registerCommand`将真实的命令id绑定到函数上。也就是说，如果我们的插件没有激活，那么用户从*命令面板*中选择`myExtension.sayHello`也不会有任何效果。为了避免这种事，插件必须注册一个面向全部用户场景的命令`onCommand` `activiationEvent`：
```json
{
	"activationEvents": ["onCommand:myExtension.sayHello"]
}
```
现在当用户第一次调用`myExtension.sayHello`时，插件就会自动激活，`registerCommand`会将`myExtension.sayHello`绑定到正确的处理函数上。

对于内部命令你不需要使用`onCommand`，但是下面的场景中你必须定义好激活事件：
- 需要使用*命令面板*调用
- 需要快捷键调用
- 需要通过VS Code UI调用，比如在编辑器标题栏上触发
- 意在供其他插件使用时

### 控制命令出现在*命令面板*的时机

默认情况下，所有*命令面板*中出现的命令都可以在`package.json`的`commands`部分中配置。不过，有些命令是场景相关的，比如在特定的语言的编辑器中，或者只有用户设置了某些选项时才展示。

[`menus.commandPalette`](/references/contribution-points#contributesmenus)发布内容配置运行你限制命令出现在*命令面板*的时机。你需要配置命令ID和一条[when语句](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts)：
```json
{
	"contributes": {
		"menus": {
			"commandPalette": [
				{
					"command": "myExtension.sayHello",
					"when": "editorLangId == markdown"
				}
			]
		}
	}
}
```

现在`myExtension.sayHello`命令只会出现在用户的Markdown文件中了。