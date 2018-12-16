# 示例：语言服务器

语言服务器提供了你自己的文件校验逻辑，一般用来检查编程语言文件的合法性，不过你也可以用来校验其他文件类型——例如检查脏话。

一般来说，校验一门编程语言的开销是很高的，尤其是校验器需要解析多个文件并建立起抽象语法树的时候。为了避免高开销，VS Code中的语言服务器在单独的进程中执行。这样一来，语言服务器也可以用除了Javascript/TypeScript之外的语言来写了，同时为编辑器提供高开销的其他语言特性，如代码补全或者`查找全部引用`。

通常为多个编辑器开发不同的语言插件需要花费大量精力。对于语言插件开发者来说，他们需要根据不同编辑器各自的API来实现插件。而从编辑器的角度来讲，他们也不能指望语言工具API统一。最终导致了为`N`种编辑器实现`M`种语言需要花费`N*M`的工作和精力。

为了解决这些问题，微软提供了[语言服务器协议(Language Server Protocol)](https://microsoft.github.io/language-server-protocol)意图为语言插件和编辑器提供社区规范。这样一来，语言服务器就可以用任何一种语言来实现，用协议通讯也避免了插件在主进程中运行的高开销。而且任何LSP兼容的语言插件，都能和LSP兼容的代码编辑器整合起来，LSP是语言插件开发者和第三方编辑器的共赢方案。

![语言服务器](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/lsp-languages-editors.png)

该章节需要你已经了解[什么是插件开发](/extension-authoring/overview)，如果你还没有准备好，请先回过去了解一下吧。

在本章，我们将：
- 根据[Node SDK](https://github.com/Microsoft/vscode-languageserver-node)，学习如何在VS Code中新建一个语言服务器插件
- 学习如何运行、调试、记录日志和测试语言服务器插件
- 为你提供更多进阶的语言服务器

?> **译者注**：本文及其他章节所涉及的**LSP**全为Language Server Protocol的缩写。**语言服务器协议**是VS Code为了调试、分析语言的自带的中间层协议。众所周知，VS Code本身只是一个编辑器，它不含任何编程语言的功能和运行时（javascript和typescript除外），而是将语言的各种特性交给了插件创作者自由实现。

## 实现你自己的语言服务器
---

#### 概览

在VS Code中，一个语言服务器有两个部分：
- **语言客户端**：一个由Javascript/Typescript组成的普通插件，这个插件能使用所有的[VS Code 命名空间API](/extensibility-reference/vscode-api.md)。
- **语言服务端**：运行在单独进程中的语言分析工具。

把语言服务器放在隔离进程中运行的好处简单来说有两个：
- 只要能通过LSP通信，语言分析工具可以用任何语言实现。
- 语言分析工具一般非常消耗CPU和内存，在单独的进程中运行能避免大性能开销

下面是一个运行了2个**语言服务器插件**的示意图。HTML语言客户端和PHP语言客户端就是常见的VS Code插件。两个客户端都用LSP与各自对应的语言服务器进行通信.即使PHP语言服务器是用PHP写的，但是任然能通过LSP与PHP语言客户端通信。

![语言服务器示意图](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/lsp-illustration.png)

本篇将指引你学习如何用我们的[Node SDK](https://github.com/Microsoft/vscode-languageserver-node)构建一个语言客户端/服务器。剩下的内容都建立在你已经了解VS Code[插件开发](/extension-authoring/overview)的基础之上。

## 示例：一个简单的纯文本语言服务器
---

让我们首先实现一个简单的语言服务器插件吧，这个插件的功能是自动补全、诊断纯文本文件。我们会同时学习客户端/服务端的配置。
如果你想直接上手代码：
- [lsp-sample](https://github.com/Microsoft/vscode-extension-samples/tree/master/lsp-sample)：本篇教程的主要源代码，有大量注释
- [lsp-multi-server-sample](https://github.com/Microsoft/vscode-extension-samples/tree/master/lsp-multi-server-sample)：**lsp-sample**的进阶版本，同样有大量注释，支持[多目录工作区](https://code.visualstudio.com/docs/editor/multi-root-workspaces)特性的语言服务器实例。

复制[Microsoft/vscode-extension-samples](https://github.com/Microsoft/vscode-extension-samples)然后打开示例：
```bash
> cd lsp-sample
> npm install
> npm run compile
> code .
```

安装完所有依赖然后打开**lsp-sample**工作，里面包含客户端和服务器的代码。下面是一个整体的**lsp-sample**目录结构：

```
.
├── client // 语言客户端
│   ├── src
│   │   ├── test // 语言客户端 / 服务器 的端到端测试
│   │   └── extension.ts // 语言客户端入口
├── package.json // 插件配置清单
└── server // 语言服务器
    └── src
        └── server.ts // 语言服务器入口
```

## 什么是'Client'
---

我们先看看`/package.json`，这个文件描述了语言客户端的能力。里面有3个有趣的部分：

首先看看[activationEvents](/extensibility-reference/activation-events.md)：
```json
"activationEvents": [
    "onLanguage:plaintext"
]
```

这个部分告诉VS Code只要打开纯文本文件之后就立刻激活插件（例如：打开一个`.txt`文件）

下一步看看[configuration](/extensibility-reference/contribution-points.md#contributesconfiguration)部分：

```json
"configuration": {
    "type": "object",
    "title": "Example configuration",
    "properties": {
		"languageServerExample.maxNumberOfProblems": {
			"scope": "resource",
            "type": "number",
            "default": 100,
            "description": "Controls the maximum number of problems produced by the server."
        }
    }
}
```

这个部分配置了用户可以自定义的`configuration`，用户通过这个配置可以在**设置**中对你的插件做一些修改。这并不是本节重点，稍后示例将通过代码呈现——插件如何在设置变动后将改*修后的配置*应用到我们的语言服务器上。

真正的语言客户端代码和对应的`package.json`在`/client`文件夹中。`package.json`最有趣的部分是`vscode`插件主机API和`vscode-languageclient`这两个依赖库。
```json
"dependencies": {
    "vscode": "^1.1.18",
    "vscode-languageclient": "^4.1.4"
}
```

正如上面所说，客户端实现就是一个普通的VS Code插件，它有使用全部VS Code API的能力。

下面是extension.ts文件的对应内容，也是**lsp-sample**插件的入口：

```typescript
import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// 服务器由node实现
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// 为服务器提供debug选项
	// --inspect=6009: 运行在Node's Inspector mode，这样VS Code就能调试服务器了
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// 如果插件运行在调试模式那么就会使用debug server options
	// 不然就使用run options
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// 控制语言客户端的选项
	let clientOptions: LanguageClientOptions = {
		// 注册纯文本服务器
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// 当文件变动为'.clientrc'中那样时，统治服务器
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};
    // 创建语言客户端并启动
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// 启动客户端，这也同时启动了服务器
	client.start();
}

export function deactivate(): Thenable<void> {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

```

## 什么是'Server'
---

在这个例子中，服务器是Typescript实现的，由Node.js运行。因为VS Code自带Node.js运行时，所以你无需安装其他依赖，除非你对运行时有特别需求。

这个语言服务器的源码在`/server`中。比较重要的`pacakge.json`部分是：
```json
"dependencies": {
    "vscode-languageserver": "^4.1.3"
}
```

下面是一个服务器的实现，提供了简单的纯文本管理——从VS Code向服务器发送文件的全部内容。

```typescript
import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams
} from 'vscode-languageserver';

// 创建一个服务器连接。使用Node的IPC作为传输方式。
// 也包含所有的预览、建议等LSP特性
let connection = createConnection(ProposedFeatures.all);

// 创建一个简单的文本管理器。
// 文本管理器只支持全文本同步。
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// 客户端是否支持`workspace/configuration`请求?
	// 如果不是的话，降级到使用全局设置
	hasConfigurationCapability =
		capabilities.workspace && !!capabilities.workspace.configuration;
	hasWorkspaceFolderCapability =
		capabilities.workspace && !!capabilities.workspace.workspaceFolders;
	hasDiagnosticRelatedInformationCapability =
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation;

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			// 告诉客户端，服务器支持代码补全
			completionProvider: {
				resolveProvider: true
		}
	}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// 为所有配置Register for all configuration changes.
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined
		);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// 配置示例
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// 当客户端不支持`workspace/configuration`请求时，使用global settings
// 请注意，在这个例子中服务器使用的客户端并不是问题所在，而是这种情况还可能发生在其他客户端身上。
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// 对所有打开的文档配置进行缓存
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// 重置所有已缓存的文档配置
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// 重新验证所有打开的文本文档
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// 只对打开的文档保留设置
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// 文档的文本内容发生了改变。
// 这个事件在文档第一次打开或者内容变动时才会触发。
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// 在这个简单的示例中，每次校验运行时我们都获取一次配置
	let settings = await getDocumentSettings(textDocument.uri);

	// 校验器如果检测到连续超过2个以上的大写字母则会报错
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray;

    let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnosic);
	}
    // 将错误处理结果发送给VS Code
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// 监测VS Code中的文件变动
	connection.console.log('We received an file change event');
});

// 这个处理函数提供了初始补全项列表
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	// 传入的变量包含了文本请求代码补全的位置。
	// 如果我们忽略了这个信息，那就只能提供同样的代码补全项了。
	return [
		{
			label: 'TypeScript',
			kind: CompletionItemKind.Text,
			data: 1
		},
		{
			label: 'JavaScript',
			kind: CompletionItemKind.Text,
			data: 2
		}
		];
	}
);

// 这个函数为补全列表的选中项提供了更多信息
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.detail = 'TypeScript details';
			item.documentation = 'TypeScript documentation';
		} else if (item.data === 2) {
			item.detail = 'JavaScript details';
			item.documentation = 'JavaScript documentation';
		}
		return item;
	}
);

/*
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// 让文档管理器监听文档的打开，变动和关闭事件。
documents.listen(connection);

// 连接后启动监听
connection.listen();

```

## 添加一个简单的语法校验器
---

为了给服务器添加文本校验，我们给text document manager添加一个listener然后在文本变动时调用，接下来就交给服务器去判断调用校验器的最佳时机了。在我们的示例中，服务器的功能是校验纯文本然后给所有大写单词进行标记。对应的代码片段：

```typescript
// 事件在文档第一次打开，或者内容变动时触发。
documents.onDidChangeContent(async (change) => {
	// 在这个简单的示例中，每次校验运行时我们都获取一次配置
	let settings = await getDocumentSettings(textDocument.uri);

	// 校验器如果检测到连续超过2个以上的大写字母则会报错
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text))) {
		problems++;
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnosic);
	}

	// 将错误处理结果发送给VS Code
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
```

## 诊断提示和小技巧
---

- 如果出错的开始点和结束点在同一个位置，VS Code会在那个单词的位置上打上波浪线
- 如果你想要把波浪线加到行未为止，就把`end position`设置为`Number.MAX_VALUE`

运行语言服务器步骤：
1. 启动build任务。这个任务会把客户端和服务器端都编译掉。
2. 打开调试侧边栏，选择`启动客户端`加载配置，然后按`开始调试`按钮启动`扩展开发主机`。
3. 在根目录下新建一个'test.txt'文件，然后粘贴下述内容：

```
TypeScript lets you write JavaScript the way you really want to.
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
ANY browser. ANY host. ANY OS. Open Source.
```

`扩展开发主机`实例看起来像是这样：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/validation.png)

## 调试客户端和服务端
---

调试客户端代码就像调试普通插件一样简单。在代码中打上断点，然后启动插件调试。（如何启动代码调试的部分，请参阅[开发插件](/extension-authoring/developing-extensions.md)）

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/debugging-client.png)

因为服务器是由`LanguageClient`启动的，我们需要附加一个*调试器*给运行中的服务器。为了做到这一点，切换到**调试**侧边栏，选择加载配置`Attach to Server`然后启动调试（要保证server已经启动哦，也就是上面一步），看起来会像这样：

![调试语言服务器](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/debugging-server.png)

## 为语言服务器加上日志
---

如果你是用`vscode-languageclient`实现的客户端，你可以配置`[langId].trace.server`指示客户端在`output(输出)`面板中显示通信日志。

对于**Isp-sample**你能在`"languageServerExample.trace.server": "verbose"`进行配置。现在看看"Language Server Example"频道，你应该能看到这些日志：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/lsp-log.png)

因为语言服务器通信会非常啰嗦（5s的正常使用会产生5000行日志），因此我们提供了一个可视化和可筛选的日志工具。你可以先从频道中保存所有的日志，然后在[语言服务器协议检查器](https://microsoft.github.io/language-server-protocol/inspector/)中加载。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/lsp-inspector.png)

在服务器中设置`Configuration`

当我们写插件的客户端部分的时候，我们已经定义了一个控制最大问题报告数的配置。所以我们也可以在服务器中写一段读取客户端配置的代码：

```typescript
function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}
```

现在唯一要做的事情就是在服务器端中监听用户修改的设置变动，然后重新验证已经打开的文本文件。为了重用文本变动事件的处理函数，我们把代码提取到`validateTextDocument`函数中，然后新建一个`maxNumberOfProblems`变量：

```typescript
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// 在这个简单的示例中，每次校验运行时我们都获取一次配置
	let settings = await getDocumentSettings(textDocument.uri);

	// 校验器如果检测到连续超过2个以上的大写字母则会报错
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnosic);
	}

	// 将错误处理结果发送给VS Code
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
```

添加一个*通知处理函数*监听配置文件变动。

```typescript
connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// 重新验证所有打开的文本文档
	documents.all().forEach(validateTextDocument);
});
```

再次启动客户端，然后把设置中的`maximum report`改为1，就能看到：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/validationOneProblem.png)

## 添加其他语言特性
---

第一个有趣的东西是，语言服务器通常会实现成文档校验器，从这个点来说，即使一个linter也算一个语言服务器，所以VS Code中的linter通常都是作为语言服务器实现的（参照[eslint](https://github.com/Microsoft/vscode-eslint)和[jslint](https://github.com/Microsoft/vscode-jshint)）。但是语言服务器还能做得更多，他们能提供代码不全，查找所有匹配项或者转跳到定义。下面的代码展示了为服务器添加代码补全的功能，它提供了2个建议单词"TypeScript"和"JavaScript"。

```typescript
// 这个处理函数提供了初始补全项列表
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// 传入的变量包含了文本请求代码补全的位置。
		// 如果我们忽略了这个信息，那就只能提供同样的代码补全项了。
		return [
			{
				label: 'TypeScript',
				kind: CompletionItemKind.Text,
				data: 1
			},
			{
				label: 'JavaScript',
				kind: CompletionItemKind.Text,
				data: 2
			}
		];
	}
);

// 这个函数为补全列表的选中项提供了更多信息
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			(item.detail = 'TypeScript details'),
				(item.documentation = 'TypeScript documentation');
		} else if (item.data === 2) {
			(item.detail = 'JavaScript details'),
				(item.documentation = 'JavaScript documentation');
		}
		return item;
	}
);
```

`data`字段用于鉴别处理函数中传入的补全项。这个属性对协议来说是透明的，因为底层协议信息传输是基于JSON的，因此data字段只能保留从JSON序列化而来的数据。

那么现在只缺告诉VS Code服务器能提供代码补全请求。为了做到点，将对应标记添加到初始化函数中：

```typescript
connection.onInitialize((params): InitializeResult => {
	...
	return {
		capabilities: {
			...
			// 告诉客户端，服务器支持代码补全
			completionProvider: {
				resolveProvider: true
			}
		}
	};
});
```

下面的截屏显示了运行在纯文本文件中的补全代码：

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-language-server/codeComplete.png)

## 测试语言服务器
---

为了创建一个高质量的语言服务器，我们需要构建一个能覆盖到它所有功能点的测试套件。有两种常见的测试服务器的方式：

- 单元测试：如果你想测试特定的功能点，这是一个非常有用的方式，模拟数据然后发送进去。VC Code的HTML/CSS/JSON语言服务器就采用了这种测试方式。LSP的npm模块包也是用这种方式。在[这里](https://github.com/Microsoft/vscode-languageserver-node/blob/master/protocol/src/test/connection.test.ts)查看更多使用npm协议模块的单元测试。
- 端到端测试：就像[VS Code 插件测试](/extension-authoring/testing-extensions.md)一样，这个方式的好处是通过运行VS Code实例，打开文件，激活语言服务器/客户端然后执行VS Code命令来测试的，如果你配置了文件、设置和依赖（如`node_modules`）以及难以模拟数据的时候，你应该优先考虑这种模式，流行的Python插件就采用了这种测试方式。

你可以用任何你喜欢的测试框架做单元测试。这里我们只介绍如何对语言服务器插件进行端到端测试。

打开`.vscode/launch.json`，你能找到`E2E`测试目标：
```json
{
	"name": "Language Server E2E Test",
	"type": "extensionHost",
	"request": "launch",
	"runtimeExecutable": "${execPath}",
	"args": [
		"--extensionDevelopmentPath=${workspaceRoot}",
		"--extensionTestsPath=${workspaceRoot}/client/out/test",
		"${workspaceRoot}/client/testFixture"
	],
	"stopOnEntry": false,
	"sourceMaps": true,
	"outFiles": ["${workspaceRoot}/client/out/test/**/*.js"]
}
```

如果你运行了这个测试目标，它会打开一个VS Code实例和一个叫做`client/testFixtur`的激活工作区。VS Code然后会执行所有`client/src/test`中的测试。一点调试的小提示，你可以在`client/src/test`的Typescript文件中添加断点。

我们再来看看`completion.test.ts`文件：
```typescript
import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

describe('Should do completion', () => {
	const docUri = getDocUri('completion.txt');

	it('Completes JS/TS in txt file', async () => {
		await testCompletion(docUri, new vscode.Position(0, 0), {
			items: [
				{ label: 'JavaScript', kind: vscode.CompletionItemKind.Text },
				{ label: 'TypeScript', kind: vscode.CompletionItemKind.Text }
			]
		});
	});
});

async function testCompletion(
	docUri: vscode.Uri,
	position: vscode.Position,
	expectedCompletionList: vscode.CompletionList
) {
	await activate(docUri);

	// 执行 `vscode.executeCompletionItemProvider` 命令，模拟激活代码补全功能
	const actualCompletionList = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		docUri,
		position
	)) as vscode.CompletionList;

	assert.equal(actualCompletionList.items.length, expectedCompletionList.items.length);
	expectedCompletionList.items.forEach((expectedItem, i) => {
		const actualItem = actualCompletionList.items[i];
		assert.equal(actualItem.label, expectedItem.label);
		assert.equal(actualItem.kind, expectedItem.kind);
	});
}
```

在这个测试中，我们：
- 激活了插件
- 带上了一个URI和位置模拟信息，然后运行了`vscode.executeCompletionItemProvider`去触发补全
- 断言返回的补全项是不是达到了我们的预期

我们再深入一点看看`activate(docURI)`函数。它被定义在`client/src/test/helper.ts`中：
```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

/**
 * 激活 vscode.lsp-sample 插件
 */
export async function activate(docUri: vscode.Uri) {
	// extensionId来自于package.json中的`publisher.name`
	const ext = vscode.extensions.getExtension('vscode.lsp-sample');
	await ext.activate();
	try {
		doc = await vscode.workspace.openTextDocument(docUri);
		editor = await vscode.window.showTextDocument(doc);
		await sleep(2000); // 等待服务器激活
	} catch (e) {
		console.error(e);
	}
}

async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
```
在激活部分，我们：
- 用`publisher.name` `extensionId`在`package.json`中获取到了插件
- 打开特定的文档，然后显示在文本编辑区
- 休眠2秒，确保启动了语言服务器

准备好之后，我们可以运行对应语言特性的[VS Code命令](/extensibility-reference/vscode-api-commands.md)，然后对结果进行断言测试。
这还有一个关于诊断特性的测试实现，如果你感兴趣，可以查看这个文件`client/src/test/diagnostics.test.ts`

## 进阶主题
---

到目前为止，本篇教程提供了：
- 一个简短的**语言服务器**和**语言服务器协议**概览
- VS Code中的语言服务器插件架构
- 实现了一个**Isp-sample**插件，和如何开发、调试、检查和测试语言服务器

#### 更多语言服务器特性

除了代码补全之外，VS Code还支持下列特性：

- 文档高亮：高亮文本中的符号
- 悬停：为选中的文本符号提供悬停信息
- Signature Help：为选中的文本提供提供Signature Help
- 转跳到定义：为选中的文本符号提供定义转跳
- 转跳到类型定义：为选中的文本符号提供类型/接口定义转跳
- 转跳到实现：为选中的文本符号提供实现转跳
- 引用查找：从整个项目中查找选中文本符号的引用
- 列出文件符号：列出文本文件中的全部符号
- 列出工作区符号：列出整个项目中的符号
- 执行代码：在给定文件和范围的条件下运行命令（通常如：美化、重构）
- CodeLens: 为给定文件计算 CodeLens 统计数据
- 文件格式化：包括整个文件的格式化，部分文本格式化和根据类型格式化
- 重命名：重命名整个项目内的某些符号
- 文件链接：计算和解析文件中的链接
- 文件色彩：计算和解析文件中的色彩，并提供编辑器内的取色器

## 增量文本同步更新
---

在`vscode-languageserver`模块中，我们做了一个简单的`text document manager`同步VS Code和语言服务器。

但是这种方式有两个缺点：

- 文件变动时，会重复地发送整个文本数据，这个传递的数据量相当可观。
- 现有的库通常都支持增量文本更新，不可避免地，我们会进行不必要的转换和创建抽象语法树。

LSP因此直接提供了增量文本更新的API。

现在我们要通过增加3个通知函数实现我们的增量文本更新：

- onDidOpenTextDocument：当文件打开后调用
- onDidChangeTextDocument：当文本变动后调用
- onDidCloseTextDocument：当文件关闭后调用

下面的代码片段展示了怎么在通信中挂上这些通知函数钩子，在初始化时因如何返回函数：

```typescript
connection.onInitialize((params): InitializeResult => {
	...
	return {
		capabilities: {
			// 启用文档增量更新同步
			textDocumentSync: TextDocumentSyncKind.Incremental,
			...
		}
	};
});

connection.onDidOpenTextDocument((params) => {
	// 当文档打开后触发，params.uri提供了文档的唯一地址。如果文档储存在硬盘上，那么就会是一个file类型的URI
	// params.text——提供了文档一开始的内容
});

connection.onDidChangeTextDocument((params) => {
	// 文档的文本内容发生了改变时触发。
	// params.uri提供了文档的唯一地址。
	// params.contentChanges 包含文档的变动内容
});

connection.onDidCloseTextDocument((params) => {
	// 文档关闭后触发。
	// params.uri提供了文档的唯一地址。
});
```

#### 直接用VS Code API实现语言特性

语言服务器有这么多好处，只是用来提供VS Code编辑扩展能力就显得有些大材小用了。下面的例子里，我们使用`vscode.languages.register[LANGUAGE_FEATURE]Provider`选项为某类文件提供一些简单的语言服务器特性。

[completions-sample](https://github.com/Microsoft/vscode-extension-samples/tree/master/completions-sample)是一个使用`vscode.languages.registerCompletionItemProvider`为纯文本添加代码片段的例子。

更多例子请参阅[https://github.com/Microsoft/vscode-extension-samples](https://github.com/Microsoft/vscode-extension-samples)

#### 语言服务器的容错解析器

大多数时候，编辑器中的代码都是不完整的，甚至语法都是错的，但是开发人员肯定希望自动补全等语言功能保持正常工作。因此，容错解析器就显得十分必要：解析器仍能从不完整的代码中创建有意义的AST，然后语言服务器根据这份AST提供服务。

我们之前在VS Code中做过PHP的支持，我们意识到PHP官方解析器并没有自带容错，而且也不能直接在语言服务器中直接重用。所以我们一起努力做了[ Microsoft/tolerant-php-parser](https://github.com/Microsoft/tolerant-php-parser)，并留下了详细的[笔记](https://github.com/Microsoft/tolerant-php-parser/blob/master/docs/HowItWorks.md)，或许能帮上需要容错解析器的语言服务器作者。

## FAQ

- **问：当我试着向debug添加服务器的时候，我得到了"cannot connect to runtime process (timeout after 5000ms)"的信息？**

	答：如果服务器没有运行你还强行添加debbuger的时候，会出现这个超时问题，你也可能需要关闭服务器中的断点。

- **问：虽然我看完了[LSP Specification](https://microsoft.github.io/language-server-protocol/)，但是我还有很多问题解决不了，我可以在哪获得帮助？**

	答：可以在[https://github.com/Microsoft/language-server-protocol](https://github.com/Microsoft/language-server-protocol)中开issue。