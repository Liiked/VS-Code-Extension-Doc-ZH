# 程序性语言特性

程序性语言特性是由[`vscode.languages.*`](https://code.visualstudio.com/api/references/vscode-api#languages)API提供的一系列智能编辑功能。在VS Code中有两种实现动态语言特性的途径。我们先以[悬停提示](#显示悬浮提示)为例：

```typescript
vscode.languages.registerHoverProvider('javascript', {
	provideHover(document, position, token) {
		return {
			contents: ['Hover Content']
		};
	}
});
```

正如你所见，代码中[`vscode.languages.registerHoverProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider)API可以很方便地在JS文件中提供悬停提示的内容。这个插件激活后，只要你悬停到了JS代码上，VS Code就会查询全部对JS注册了的[`HoverProvider`](https://code.visualstudio.com/api/references/vscode-api#HoverProvider)然后在悬浮提示框中显示对应内容。你可以查看下面的[语言功能列表](#语言功能列表)，里面包含了VS Code API / LSP实现的语言功能。

那么一种实现就是使用了[语言服务器协议](https://microsoft.github.io/language-server-protocol/)的语言服务器。它的实现方式如下：

- 一个为JS同时提供语言客户端和语言服务器的插件
- 语言客户端就像普通插件一样，运行于Node.js插件主机环境中。这个插件激活后，会启动另一个进程——语言服务器，然后两者通过[语言服务器协议](https://microsoft.github.io/language-server-protocol/)进行通信。
- 你悬停到JS代码上
- VS Code通知语言客户端
- 语言客户端向语言服务器发起请求，索要悬停的返回结果，最后再送回给VS Code
- VS Code将结果展示在悬浮框中

这个过程可能看起来有些复杂，但是这么做主要有两个好处：

- 语言服务器可以用任何语言实现
- 语言服务器可以被多个编辑器重用，提供更加智能的编辑体验

深入指南，请移步至[语言服务器插件指南](/language-extensions/language-server-extension-guide)

## 语言功能列表
---

| VS Code API                                                                                                                       | LSP method                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`createDiagnosticCollection`](https://code.visualstudio.com/api/references/vscode-api#languages.createDiagnosticCollection)                                   | [PublishDiagnostics](https://microsoft.github.io/language-server-protocol/specification#textDocument_publishDiagnostics)                                                                                                                 |
| [`registerCompletionItemProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider)                           | [Completion](https://microsoft.github.io/language-server-protocol/specification#textDocument_completion) & [Completion Resolve](https://microsoft.github.io/language-server-protocol/specification#completionItem_resolve)               |
| [`registerHoverProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider)                                             | [Hover](https://microsoft.github.io/language-server-protocol/specification#textDocument_hover)                                                                                                                                           |
| [`registerSignatureHelpProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerSignatureHelpProvider)                             | [SignatureHelp](https://microsoft.github.io/language-server-protocol/specification#textDocument_signatureHelp)                                                                                                                           |
| [`registerDefinitionProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDefinitionProvider)                                   | [Definition](https://microsoft.github.io/language-server-protocol/specification#textDocument_definition)                                                                                                                                 |
| [`registerTypeDefinitionProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerTypeDefinitionProvider)                           | [TypeDefinition](https://microsoft.github.io/language-server-protocol/specification#textDocument_typeDefinition)                                                                                                                         |
| [`registerImplementationProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerImplementationProvider)                           | [Implementation](https://microsoft.github.io/language-server-protocol/specification#textDocument_implementation)                                                                                                                         |
| [`registerReferenceProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerReferenceProvider)                                     | [References](https://microsoft.github.io/language-server-protocol/specification#textDocument_references)                                                                                                                                 |
| [`registerDocumentHighlightProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDocumentHighlightProvider)                     | [DocumentHighlight](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentHighlight)                                                                                                                   |
| [`registerDocumentSymbolProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDocumentSymbolProvider)                           | [DocumentSymbol](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentSymbol)                                                                                                                         |
| [`registerCodeActionsProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerCodeActionsProvider)                                 | [CodeAction](https://microsoft.github.io/language-server-protocol/specification#textDocument_codeAction)                                                                                                                                 |
| [`registerCodeLensProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerCodeLensProvider)                                       | [CodeLens](https://microsoft.github.io/language-server-protocol/specification#textDocument_codeLens) & [CodeLens Resolve](https://microsoft.github.io/language-server-protocol/specification#codeLens_resolve)                           |
| [`registerDocumentLinkProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDocumentLinkProvider)                               | [DocumentLink](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentLink) & [DocumentLink](https://microsoft.github.io/language-server-protocol/specification#documentLink_resolve)                   |
| [`registerColorProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDocumentColorProvider)                                     | [DocumentColor](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentColor) & [Color Presentation](https://microsoft.github.io/language-server-protocol/specification#textDocument_colorPresentation) |
| [`registerDocumentFormattingEditProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDocumentFormattingEditProvider)           | [Formatting](https://microsoft.github.io/language-server-protocol/specification#textDocument_formatting)                                                                                                                                 |
| [`registerDocumentRangeFormattingEditProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerDocumentRangeFormattingEditProvider) | [RangeFormatting](https://microsoft.github.io/language-server-protocol/specification#textDocument_rangeFormatting)                                                                                                                       |
| [`registerOnTypeFormattingEditProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerOnTypeFormattingEditProvider)               | [OnTypeFormatting](https://microsoft.github.io/language-server-protocol/specification#textDocument_onTypeFormatting)                                                                                                                     |
| [`registerRenameProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerRenameProvider)                                           | [Rename](https://microsoft.github.io/language-server-protocol/specification#textDocument_rename) & [Prepare Rename](https://microsoft.github.io/language-server-protocol/specification#textDocument_prepareRename)                       |
| [`registerFoldingRangeProvider`](https://code.visualstudio.com/api/references/vscode-api#languages.registerFoldingRangeProvider)                               | [FoldingRange](https://microsoft.github.io/language-server-protocol/specification#textDocument_foldingRange)                                                                                                                             |

## 提供诊断信息
---

诊断信息是提示代码问题的一种方式。

![diagnostics](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/diagnostics.gif)

##### 语言服务器协议

语言服务器需要向客户端发送`textDocument/publishDiagnostics`信息，这个信息中包含了诊断信息url的数组。

!> **注意：**客户端不会主动向服务端请求信息，需要服务器将诊断信息推送到客户端。

##### 直接实现

```typescript
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(ctx: vscode.ExtensionContext): void {
  ...
  ctx.subscriptions.push(getDisposable());
  diagnosticCollection = vscode.languages.createDiagnosticCollection('go');
  ctx.subscriptions.push(diagnosticCollection);
  ...
}

function onChange() {
  let uri = document.uri;
  check(uri.fsPath, goConfig).then(errors => {
    diagnosticCollection.clear();
    let diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();
    errors.forEach(error => {
      let canonicalFile = vscode.Uri.file(error.file).toString();
      let range = new vscode.Range(error.line-1, error.startColumn, error.line-1, error.endColumn);
      let diagnostics = diagnosticMap.get(canonicalFile);
      if (!diagnostics) { diagnostics = []; }
      diagnostics.push(new vscode.Diagnostic(range, error.msg, error.severity));
      diagnosticMap.set(canonicalFile, diagnostics);
    });
    diagnosticMap.forEach((diags, file) => {
      diagnosticCollection.set(vscode.Uri.parse(file), diags);
    });
  })
}
```

> **基础实现**
>
> 只对打开的编辑器提供诊断，保证至少在每次保存文件时诊断一次。诊断信息最好能随编辑器的文档内容变化触发。

> **进阶实现**
>
> 不仅仅为打开的编辑器提供诊断，而是诊断当前打开的文件目录中的所有资源，不论文件是被打开还是关闭。

## 提供补全建议
---

代码补全可以给用户提供内容感知建议。

![code-completion](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/code-completion.gif)

##### 语言服务器协议

在接收响应的`initialize`方法中，你的语言服务器需要声明它是否能提供补全，以及它是否支持动态计算补全项的`completionItem\resolve`方法。

```json
{
    ...
    "capabilities" : {
        "completionProvider" : {
            "resolveProvider": "true",
            "triggerCharacters": [ '.' ]
        }
        ...
    }
}
```

##### 直接实现

```typescript
class GoCompletionItemProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.CompletionItem[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(getDisposable());
    ctx.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            GO_MODE, new GoCompletionItemProvider(), '.', '\"'));
    ...
}
```

> **基础实现**
>
> 不支持本功能

> **进阶实现**
>
> 当用户挑选补全项时，动态计算补全项的相关信息，这条信息会浮现在补全项旁边。

## 显示悬浮提示
---

悬浮信息会展示在鼠标光标的下方，为用户提供符号/对象的相关信息，一般展示关于符号的类型和描述。

![hovers](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/hovers.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "hoverProvider" : "true",
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/hover`请求。

##### 直接实现

```typescript
class GoHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument, position: Position, token: CancellationToken):
        Thenable<Hover> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerHoverProvider(
            GO_MODE, new GoHoverProvider()));
    ...
}
```

> **基础实现**
> 显示符号的类型和相关文档描述。
>

> **进阶实现**
> 对方法名进行着色，就像你的源码一样

## 函数和方法签名
---

当用户输入函数和方法时，显示调用该方法的相关信息。

![signature-help](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/signature-help.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "signatureHelpProvider" : {
            "triggerCharacters": [ '(' ]
        }
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/signatureHelp`请求。

##### 直接实现

```typescript
class GoSignatureHelpProvider implements SignatureHelpProvider {
    public provideSignatureHelp(
        document: TextDocument, position: Position, token: CancellationToken):
        Promise<SignatureHelp> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerSignatureHelpProvider(
            GO_MODE, new GoSignatureHelpProvider(), '(', ','));
    ...
}
```

> **基础实现**
>
> 签名帮助需要包含参数的相关文档。

> **进阶实现**
>
> 无

## 符号定义
---

允许用户查看变量/函数/方法的定义。

![goto-definition](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/goto-definition.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "definitionProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/definition`请求。

##### 直接实现

```typescript
lass GoDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.Location> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            GO_MODE, new GoDefinitionProvider()));
    ...
}
```

> **基础实现**
>
> 如果符号有多个定义，你可以显示多条定义。

> **进阶实现**
>
> 无

## 查找符号的全部引用
---

允许用户在当前编辑器直接查看变量/函数/方法的定义的源代码。

![find-references](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/find-references.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "referencesProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/references`请求。

##### 直接实现

```typescript
class GoReferenceProvider implements vscode.ReferenceProvider {
    public provideReferences(
        document: vscode.TextDocument, position: vscode.Position,
        options: { includeDeclaration: boolean }, token: vscode.CancellationToken):
        Thenable<vscode.Location[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerReferenceProvider(
            GO_MODE, new GoReferenceProvider()));
    ...
}
```

> **基础实现**
>
> 为所有引用返回引用位置（资源的url和范围）

> **进阶实现**
>
> 无

## 高亮匹配符号
---

允许用户在打开的编辑器中查看某个符号的全部匹配项。

![document-highlights](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/document-highlights.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "documentHighlightProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/documentHighlight`请求。

##### 直接实现

```typescript
class GoDocumentHighlightProvider implements vscode.DocumentHighlightProvider {
    public provideDocumentHighlights(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        vscode.DocumentHighlight[] | Thenable<vscode.DocumentHighlight[]>;
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerDocumentHighlightProvider(
            GO_MODE, new GoDocumentHighlightProvider()));
    ...
}
```

> **基础实现**
>
> 返回引用文档

> **进阶实现**
>
> 无

## 显示当前文档中的符号定义
---

允许用户在打开的编辑器中快速跳转到任何符号定义。

![document-symbols](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/document-symbols.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "documentSymbolProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/documentSymbol`请求。

##### 直接实现

```typescript
class GoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        Thenable<vscode.SymbolInformation[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            GO_MODE, new GoDocumentSymbolProvider()));
    ...
}
```

> **基础实现**
>
> 返回文档中的所有符号。将符号分类，如变量、函数、类、方法等。

> **进阶实现**
>
> 无

## 显示文件夹中的符号定义
---

允许用户在打开的文件夹（工作区）中快速跳转到任何符号定义。

![workspace-symbols](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/workspace-symbols.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "workspaceSymbolProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`workspace/symbol`请求。

##### 直接实现

```typescript
class GoWorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {
    public provideWorkspaceSymbols(
        query: string, token: vscode.CancellationToken):
        Thenable<vscode.SymbolInformation[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerWorkspaceSymbolProvider(
            new GoWorkspaceSymbolProvider()));
    ...
}
```

> **基础实现**
>
> 返回文件夹中所有匹配的符号。将符号分类，如变量、函数、类、方法等。

> **进阶实现**
>
> 无

## 处理错误和警告
---

为用户提供处理错误和警告的办法。如果有更正操作可用，就会在那个错误边上显示一个小灯泡。当用户点击灯泡的时候，会显示出操作列表。

![quick-fixes](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/quick-fixes.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "codeActionProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/codeAction`请求。

##### 直接实现

```typescript
class GoCodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(
        document: vscode.TextDocument, range: vscode.Range,
        context: vscode.CodeActionContext, token: vscode.CancellationToken):
        Thenable<vscode.Command[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            GO_MODE, new GoCodeActionProvider()));
    ...
}
```

> **基础实现**
>
> 为错误/警告提供更正操作。

> **进阶实现**
>
> 提供源码级别的操作，如重构、提取方法等。

## CodeLens - 为源代码提供更多操作
---

为用户弹出一个可以操作、包含上下文信息的分隔弹出框。

![code-lens](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/code-lens.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能，以及它是否支持将`codeLens\resolve`方法绑定到CodeLens的命令上。

```json
{
    ...
    "capabilities" : {
        "codeLensProvider" : {
            "resolveProvider": "true"
        }
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/codeLens`请求。

##### 直接实现

```typescript
class GoCodeLensProvider implements vscode.CodeLensProvider {
    public provideCodeLenses(document: TextDocument, token: CancellationToken):
        CodeLens[] | Thenable<CodeLens[]> {
    ...
    }

    public resolveCodeLens?(codeLens: CodeLens, token: CancellationToken):
         CodeLens | Thenable<CodeLens> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            GO_MODE, new GoCodeLensProvider()));
    ...
}
```

> **基础实现**
>
> 为文档提供CodeLens结果。

> **进阶实现**
>
> 将Codelens结果绑定到响应`codeLens/resolve`的命令上。

## 颜色拾取器
---

允许用户在文件中预览和修改颜色。

![color-decorators](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/color-decorators.png)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "colorProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/documentColor`和`textDocument/colorPresentation`请求。

##### 直接实现

```typescript
class GoColorProvider implements vscode.DocumentColorProvider {
    public provideDocumentColors(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        Thenable<vscode.ColorInformation[]> {
    ...
    }
    public provideColorPresentations(
        color: Color, context: { document: TextDocument, range: Range }, token: vscode.CancellationToken):
        Thenable<vscode.ColorPresentation[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerColorProvider(
            GO_MODE, new GoColorProvider()));
    ...
}
```

> **基础实现**
>
> 返回文档中的全部颜色引用。在颜色面板岁支持色彩格式（如rgb(...)，hsl(...)）

> **进阶实现**
>
> 无

## 格式化代码
---

提供整个文档的代码格式化支持。

![format-document](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/format-document.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "documentFormattingProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/formatting`请求。

##### 直接实现

```typescript
class GoDocumentFormatter implements vscode.DocumentFormattingEditProvider {
    public formatDocument(document: vscode.TextDocument):
        Thenable<vscode.TextEdit[]> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            GO_MODE, new GoDocumentFormatter()));
    ...
}
```

> **基础实现**
>
> 不提供格式化支持

> **进阶实现**
>
> 你应该尽量减少代码格式化的影响。稍有不慎，诊断功能就可能失效。

## 格式化选中区域
---

为用户选中区域提供代码格式化支持。

![format-document-range](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/format-document-range.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "documentRangeFormattingProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/rangeFormatting`请求。

##### 直接实现

```typescript
class GoDocumentRangeFormatter implements vscode.DocumentRangeFormattingEditProvider{
    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken):
        Thenable<vscode.TextEdit[]>;
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(
            GO_MODE, new GoDocumentRangeFormatter()));
    ...
}
```

> **基础实现**
>
> 不提供格式化支持

> **进阶实现**
>
> 你应该尽量减少代码格式化的影响。稍有不慎，诊断功能就可能失效。

## 随用户输入格式化代码
---

支持用户输入时动态调整文本格式。

!> **注意：**用户[设置](https://code.visualstudio.com/docs/getstarted/settings)中的`editor.formatOnType`控制着本功能。

![format-on-type](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/format-on-type.gif)
##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。服务器还得告诉客户端哪些字符需要被格式化，`moreTriggerCharacters`是可选的。

```json
{
    ...
    "capabilities" : {
        "documentOnTypeFormattingProvider" : {
            "firstTriggerCharacter": "}",
            "moreTriggerCharacter": [";", ","]
        }
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/onTypeFormatting`请求。

##### 直接实现

```typescript
class GoOnTypingFormatter implements vscode.OnTypeFormattingEditProvider{
    public provideOnTypeFormattingEdits(
        document: vscode.TextDocument, position: vscode.Position,
        ch: string, options: vscode.FormattingOptions, token: vscode.CancellationToken):
        Thenable<vscode.TextEdit[]>;
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerOnTypeFormattingEditProvider(
            GO_MODE, new GoOnTypingFormatter()));
    ...
}
```

> **基础实现**
>
> 不提供格式化支持

> **进阶实现**
>
> 你应该尽量减少代码格式化的影响。稍有不慎，诊断功能就可能失效。

## 重命名符号
---

允许用户重命名符号，并更新对应符号的全部引用。

![rename](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/language-support/rename.gif)

##### 语言服务器协议

为了响应请求`initialize`方法，语言服务器需要声明它能提供这项功能。

```json
{
    ...
    "capabilities" : {
        "renameProvider" : "true"
        ...
    }
}
```

另外，你的语言服务器还要能够响应`textDocument/rename`请求。

##### 直接实现

```typescript
class GoRenameProvider implements vscode.RenameProvider {
    public provideRenameEdits(
        document: vscode.TextDocument, position: vscode.Position,
        newName: string, token: vscode.CancellationToken):
        Thenable<vscode.WorkspaceEdit> {
    ...
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ...
    ctx.subscriptions.push(
        vscode.languages.registerRenameProvider(
            GO_MODE, new GoRenameProvider()));
    ...
}
```

> **基础实现**
>
> 不提供本功能支持。

> **进阶实现**
>
> 返回工作区中全部需要生效的编辑区，比如当一个符号在项目的各个地方都被引用时。