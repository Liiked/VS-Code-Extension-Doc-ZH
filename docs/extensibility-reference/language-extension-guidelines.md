
# 语言插件指引

当你听到VS Code支持了一门语言，你一般能想到语法高亮、代码补全，或者还有调试支持。能想到这么多很好，但是语言插件还可以承担更多的任务。

通过适当地配置文件，语言插件可以语法高亮、代码片段和智能括号匹配，更多高级特性则可以通过VS Code的[扩展性API](/extensibility-reference/vscode-api.md)或者[语言服务器](/extension-authoring/example-language-server.md)来实现。

语言服务器是一个使用[language server protocol](https://microsoft.github.io/language-server-protocol)通信的独立服务器。你能在适当的任务中使用适当的语言实现一个服务器，例如：你想支持一个非常棒的Python库，那你可能会想要用Python来实现你的语言服务器。如果你想要用Javascript或者Typescript实现语言服务器，那么直接用VS Code顶层的[npm modules](https://github.com/Microsoft/vscode-languageserver-node)构建即可。

在实现语言支持时，你也可以自由选择你想要实现的language server protocol，在protocol的`initialize`方法中声明语言服务器的功能。

不过语言服务器架构并不是提供语言特性的唯一途径，你也可以在插件的主要代码中直接实现功能。在本章指引中，我们不仅展示了基于**Language Server Protocol**的实现（要求使用events和configuration），也展示了通过注册 *语言功能提供器(language feature provider)* **直接实现** 实现语言特性（如：`registerHoverProvider`）

为了让你更方便地决定哪些特性应该先实现，哪些应该是之后用来改进代码的，我们按language server protocol的类名和方法的出现顺序一一展示在下面。每个指引下面都包含了**基础**支持和**进阶**实现。

## 基于**配置**的语言支持
---
[语法高亮](#语法高亮)，[代码片段](#源代码片段)和[智能括号匹配](#智能括号匹配)可以通过声明配置而不需要任何插件代码直接实现。

#### 语言标识符

VS Code 通过语言标识符映射不同的语言配置和对应的语言实现。语言标识符是*小写字符串*表示的编程语言或文件类型。例如，Javascript的语言ID是`javascript`，而Markdown文件则是`markdown`。已经支持的语言标识符可以在[这里](https://code.visualstudio.com/docs/languages/identifiers)找到。

## 语法高亮
---
![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/syntax-highlighting.png)

想要支持语法高亮，插件需要在`package.json`中注册一个TextMate语法`.tmLanguage`。

```json
"contributes": {
    "languages": [
        {
            "id": "markdown",
            ...
        }
    ],
    "grammars": [
        {
            "language": "markdown",
            "scopeName": "text.html.markdown",
            "path": "./syntaxes/markdown.tmLanguage.json"
        }
    ], ...
}
```

VS Code支持两种格式的语法文件——Plist（`.tmLanguage`）和JSON（`.tmLanguage.json`）。Plist文件因为过于混乱，通常我们会从其他语言编译而来，如：YAML。如果你需要创建一种全新的语法，我们更推荐使用JSON语法。

> **基础**

> 为一种简单的语法提供字符串、注释、关键字高亮

> **进阶**

> 为语法提供术语、表达式解析，然后支持变量和函数引用等等的色彩支持。

## 源代码片段
---
![snippets](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/snippets.gif)

有了代码片段之后，你可以用占位符的形式提供源代码片段模板。在插件的`package.json`中注册一个包含代码片段的文件。在[创建你自己的代码片段](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets)章节中学习更多VS Code代码片段协议。
```json
"contributes": {
    "snippets": [
        {
            "language": "javascript",
            "path": "./snippets/javascript.json"
        }, ...
    ], ...
}
```

> **基础**

> 在这个例子中用占位符提供`markdown`代码片段：
> ```json
> "Insert ordered list": {
>    "prefix": "ordered list",
>    "body": [
>        "1. ${first}",
>        "2. ${second}",
>        "3. ${third}",
>        "$0"
>    ],
>    "description": "Insert ordered list"
> }
> ```

> **进阶**

> 用显式的tab符阻止引导用户，然后用嵌套的占位符快速开发：
> ```json
> "key: \"value\" (Hash Pair)": {
>     "prefix": "key",
>     "body": "${1:key}: ${2:\"${3:value}\"}"
> }
> ```

## 智能括号匹配
---
![smart-editing](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/smart-editing.gif)

在插件的`package.json`中进行配置

```json 
"contributes": {
    "languages": [
        {
            "id": "typescript",
            ...
            "configuration": "./language-configuration.json"
        }, ...
    ]
    ...
}
```

> **基础**

> 无

> **进阶**

> 下面是一个Typescript示例：
> ```json
> {
>    "comments": {
>        "lineComment": "//",
>        "blockComment": [ "/*", "*/" ]
>    },
>    "brackets": [
>        ["{", "}"],
>        ["[", "]"],
>        ["(", ")"],
>        ["<", ">"]
>    ],
>    "autoClosingPairs": [
>        { "open": "{", "close": "}" },
>        { "open": "[", "close": "]" },
>        { "open": "(", "close": ")" },
>        { "open": "'", "close": "'", "notIn": ["string", "comment"] },
>        { "open": "\"", "close": "\"", "notIn": ["string"] },
>        { "open": "`", "close": "`", "notIn": ["string", "comment"] },
>        { "open": "/**", "close": " */", "notIn": ["string"] }
>    ],
>    "surroundingPairs": [
>        ["{", "}"],
>        ["[", "]"],
>        ["(", ")"],
>        ["<", ">"],
>        ["'", "'"],
>        ["\"", "\""],
>        ["`", "`"]
>    ]
> }
> ```

## 编程语言支持
---

除上面介绍的语言特性外，剩下的特性需要写一些插件代码去处理VS Code的请求。你可以通过[language server protocol](https://microsoft.github.io/language-server-protocol)将插件实现为独立的服务器，或者直接在插件的`active`方法内注册一个*供应器（provider）*。这两种方法在接下的篇章里面会分别以**通过语言服务器实现**和**直接实现**展示。

language server protocol方式遵循在`initialize`请求中确定服务器的能力，然后基于用户行为处理特定的请求。

直接实现方式则要求插件激活时注册好*特性供应器（feature provider）*，常常以`DocumentSelector`的出现作为供应器的标识。

在下面的例子里，是一个Go语言文件的供应器：

```typescript
const GO_MODE: vscode.DocumentFilter = { language: 'go', scheme: 'file' };
```

## 显示悬浮提示（Hovers）
---
*悬浮提示*提供了鼠标悬停处关于 符号/对象 的相关信息，显示的内容通常是符号的类型和描述。

![hovers](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/hovers.gif)

#### 通过语言服务器实现
在`initialize`响应方法中，你的语言服务器首先要声明能够提供*悬浮提示*
```json
{
    ...
    "capabilities" : {
        "hoverProvider" : "true",
        ...
    }
}
```
另外，你的语言服务器需要响应`textDocument/hover`请求。

#### 直接实现

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

> **基础**

> 显示一些类型信息，也可以显示文档。

> **进阶**

> 按照你的主题对匹配的*method*进行着色

## 显示代码补全提示
---

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/code-completion.gif)

代码补全提供了上下文感知，并为用户提供提示：

#### 通过语言服务器实现

在`initialize`响应方法中，你的语言服务器首先要声明能够提供*代码补全*，在`completionItem\resolve`方法中对计算出得补全项添加其他信息。

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

#### 直接实现

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

> **基础**
>
> 不需要你提供解析函数

> **进阶**
>
> 为用户选择的代码补全项提供解析函数和其他信息，信息就显示在选中项的旁边。

## 提供诊断信息
---

诊断信息是一种提示代码错误的常见方式。

#### 通过语言服务器实现

你的语言服务器将`textDocument/publishDiagnostics`信息发送给语言客户端。这个信息由一系列包含诊断项和源URI的数组组成。

![diagnostics](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/diagnostics.gif)

**注意：**客户端不会主动向服务器要诊断信息，而是服务器将诊断信息推送给客户端。

#### 直接实现

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

>**基础**
>
> 为打开的编辑器提供诊断报告。较差的实现，每次保存时至少报告一次。更好的做法是，基于未保存的内容自动提供诊断。

>**进阶**
>
> 不仅仅为打开的编辑器报告诊断信息，而是为项目文件夹的所有资源提供诊断，不论这些资源是不是在编辑器中打开。

## 为函数和方法提供帮助信息
---
当用户输入函数或者方法时，显示将要调用的函数/方法的相关信息。

![signature-help](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/signature-help.gif)

#### 通过语言服务器实现
首先响应`initialize`方法，声明提供*特征值*支持，然后还要响应`textDocument/signatureHelp`请求
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

#### 直接实现

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

>**基础**
>
> 确保signature help函数中包含了函数或方法的文档说明。

>**进阶**
>
> 无

## 显示符号定义
---

允许用户查看变量、函数、方法的定义。
![goto-definition](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/goto-definition.gif)

#### 通过语言服务器实现

除了响应`initialize`方法外，语言服务器还要声明提供转跳到定义位置的特性。当然你的语言服务器还需要响应`textDocument/definition`请求。

```json
{
    ...
    "capabilities" : {
        "definitionProvider" : "true"
        ...
    }
}
```

#### 直接实现

```typescript
class GoDefinitionProvider implements vscode.DefinitionProvider {
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

>**基础**
>
> 如果符号的含义模棱两可，你把多个定义都显示出来。

>**进阶**
>
> 无

## 查找符号的所有引用

允许用户查看某个变量/函数/方法/符号的所有源代码的位置。

![find-references](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/find-references.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*定位符号引用*的特性。当然你的语言服务器还需要响应`textDocument/references`请求。
```json
{
    ...
    "capabilities" : {
        "definitionProvider" : "true"
        ...
    }
}
```

#### 直接实现

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

>**基础**
>
> 返回所有引用的位置（资源的URI和范围）。

>**进阶**
>
> 无

## 高亮文档中所有匹配的符号

允许用户查看打开的编辑器中所有匹配的符号。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/document-highlights.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*文档符号定位*的特性。当然你的语言服务器还需要响应`textDocument/documentHighlight`请求。
```json
{
    ...
    "capabilities" : {
        "documentHighlightProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 你需要返回文档中找到的所有引用。

>**进阶**
>
> 无

## 显示文档中所有符号定义
---
允许用户快速跳转到编辑器中的任何符号定义。

![document-symbols](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/document-symbols.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*文档符号定位*的特性。当然你的语言服务器还需要响应`textDocument/documentSymbol`请求。
```json
{
    ...
    "capabilities" : {
        "documentSymbolProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 返回文档中的所有符号。定义的符号类型诸如：变量、函数、类、方法等。

>**进阶**
>
> 无

## 显示文档中所有符号定义
---
允许用户快速跳转到打开的文件夹（工作区）中的任何符号定义。

![workspace-symbols](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/workspace-symbols.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*全局符号定位*的特性。当然你的语言服务器还需要响应`workspace/symbol`请求。
```json
{
    ...
    "capabilities" : {
        "workspaceSymbolProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 返回打开文件中的所有符号。定义的符号类型诸如：变量、函数、类、方法等。

>**进阶**
>
> 无

## 修正错误和警告
---
允许用户对错误或者警告进行更正。如果有可用的操作，就会有个灯泡💡出现在错误/警告旁边。当用户点击灯泡的时候，会出现可用的*代码操作*。

![quick-fixes](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/quick-fixes.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*代码操作*的特性。当然你的语言服务器还需要响应`textDocument/codeAction`请求。
```json
{
    ...
    "capabilities" : {
        "codeActionProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 为更正错误/警告提供*代码操作*。

>**进阶**
>
> 提供重构级别的源代码修改，如**提取方法**

## CodeLens —— 为上下文提供源代码信息
---
在横屏弹出框中为用户提供可操作的、上下文级别的源代码。

![code-lens](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/code-lens.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*CodeLens*的特性，将`textDocument/codeAction`绑定到*CodeLens*命令上。当然你的语言服务器还需要响应`textDocument/codeLens`请求。
```json
{
    ...
    "capabilities" : {
        "codeLensProvider" : {
            "resolveProvider": "true"
        }
    }
}
```

#### 直接实现

```typescript
class GoRCodeLensProvider implements vscode.CodeLensProvider {
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
>**基础**
>
> 定义当前文档可用的CodeLens结果

>**进阶**
>
> 将CodeLens结果绑定到`codeLens/resolve`上

## 符号重命名
---
运行用户重命名符号，更新所有引用的符号。

![rename](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/rename.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*重命名*特性。当然你的语言服务器还需要响应`textDocument/rename`请求。
```json
{
    ...
    "capabilities" : {
        "renameProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 不提供重命名支持。

>**进阶**
>
> 返回工作区所有需要执行更改的编辑区，例如：跨文件查找引用了相关符号的编辑区。

## 在编辑器中格式化源代码
---
为用户提供整个文档的格式化特性。

![format-document](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/format-document.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*格式化*特性。当然你的语言服务器还需要响应`textDocument/formatting`请求。
```json
{
    ...
    "capabilities" : {
        "documentFormattingProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 不提供格式化支持。

>**进阶**
>
> 不管多小的文本区域都不要放过，尽可能地对文档进行格式化，这对诊断信息提示至关重要，不然可能导致代码错误位置不正确或者丢失报错标记。

## 对选中行进行格式化
---
为用户提供选中片段的格式化特性。

![format-document-range](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/format-document-range.gif)

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*选中片段格式化*特性。当然你的语言服务器还需要响应`textDocument/rangeFormatting`请求。
```json
{
    ...
    "capabilities" : {
        "documentRangeFormattingProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 不提供格式化支持。

>**进阶**
>
> 不管多小的文本区域都不要放过，尽可能地对文档进行格式化，这对诊断信息提示至关重要，不然可能导致代码错误位置不正确或者丢失报错标记。

## 对用户输入自动格式化
---
为用户提供输入时的实时格式化特性。

![format-document-type](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/format-on-type.gif)

!> **注意**：用户[设置](https://code.visualstudio.com/docs/getstarted/settings)中的`editor.formatOnType`控制着这项功能。

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*用户输入格式化*特性。当然你的语言服务器还需要响应`textDocument/onTypeFormatting`请求。你还需要告诉客户端哪些字符可以触发这个特性，`moreTriggerCharacters`是个可选项。
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

#### 直接实现

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
>**基础**
>
> 不提供格式化支持。

>**进阶**
>
> 不管多小的文本区域都不要放过，尽可能地对文档进行格式化，这对诊断信息提示至关重要，不然可能导致代码错误位置不正确或者丢失报错标记。

## 显示取色器
---
允许用户预览和修改文档中的颜色。

![color-decorators](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/language-support/color-decorators.png)

!> **注意**：用户[设置](https://code.visualstudio.com/docs/getstarted/settings)中的`editor.formatOnType`控制着这项功能。

#### 通过语言服务器实现
除了响应`initialize`方法外，语言服务器还要声明提供*用户输入格式化*特性。当然你的语言服务器还需要响应`textDocument/documentColor`和`textDocument/colorPresentation`请求。
```json
{
    ...
    "capabilities" : {
        "colorProvider" : "true"
        ...
    }
}
```

#### 直接实现

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
>**基础**
>
> 返回文档中的色彩引用值。提供色彩格式和展示（如：rgb(...)，hsl(...)）

>**进阶**
>
> 无
