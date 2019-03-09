# 内置命令

这篇文档列出了可能需要与`vscode.commands.executeCommand`一起使用的命令集合.

阅读[命令指南]()以了解如何使用`commands`API.

下面是一个如何在 VS Code 中打开新文件夹的例子:

```js
let uri = Uri.file('/some/path/to/folder');
let success = await commands.executeCommand('vscode.openFolder', uri);
```

## 命令

`vscode.executeWorkspaceSymbolProvider` - 执行工作区所有的**符号**供应器函数

- *query* - 搜索关键词
- *(returns)* - promise函数, 且参数为具有SymbolInformation和DocumentSymbol的实例数组.

`vscode.executeDefinitionProvider` - 执行所有的**定义**供应器函数

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组.

`vscode.executeDeclarationProvider` - 执行所有的**声明**供应器函数.

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组.

`vscode.executeTypeDefinitionProvider` - 执行所有的**类型定义**供应器函数.

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组.

`vscode.executeImplementationProvider` - 执行所有的**接口**供应器函数

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组

`vscode.executeHoverProvider` - 执行所有的**悬停**供应器函数.

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Hover实例数组

`vscode.executeDocumentHighlights` - 执行**文档高亮**供应器函数.

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *(returns)* - promise函数, 且参数为DocumentHighlight实例数组

`vscode.executeReferenceProvider` - 执行**引用**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *(returns)* - promise函数, 且参数为Location实例数组

`vscode.executeDocumentRenameProvider` - 执行**重命名**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *newName* - 新的符号名称
- *(returns)* - promise函数, 且参数为WorkspaceEdit

`vscode.executeSignatureHelpProvider` - 执行**符号帮助**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *triggerCharacter* - (可选的)当用户输入特定字符时（如, 或 (）触发符号帮助
- *(returns)* - promise函数, 且参数为SignatureHelp

`vscode.executeDocumentSymbolProvider` - 执行**文档符号**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为具有SymbolInformation和DocumentSymbol的实例数组

`vscode.executeCompletionItemProvider` - 执行**自动补全**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *triggerCharacter* - (可选的)当用户输入诸如(, (, ))之类的字符时触发
- *itemResolveCount* - (可选的)补全的符号数量(数目太大会减慢补全速度)
- *(returns)* - promise函数, 且参数为CompletionList实例

`vscode.executeCodeActionProvider` - 执行**代码操作小灯泡提示**供应器函数

- *uri* - 文档的Uri
- *range* - 在文档中的范围
- *(returns)* - promise函数, 且参数为Command实例数组

`vscode.executeCodeLensProvider` - 执行**CodeLens**供应器函数

- *uri* - 文档的Uri
- *itemResolveCount* - (可选的)需要解析的lenses数量, 数目太大会影响性能
- *(returns)* - promise函数, 且参数为CodeLens实例数组

`vscode.executeFormatDocumentProvider` - 执行**格式化文档**供应器函数

- *uri* - 文档的Uri
- *options* - 配置项
- *(returns)* - promise函数, 且参数为TextEdits数组

`vscode.executeFormatRangeProvider` - 执行**局部格式化**供应器函数

- *uri* - 文档的Uri
- *range* - 限制的范围
- *options* - 配置项
- *(returns)* - promise函数, 且参数为TextEdits数组

`vscode.executeFormatOnTypeProvider` - 执行**格式化文档**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *ch* - 在输入某个字符之后进行格式化
- *options* - 配置项
- *(returns)* - promise函数, 且参数为TextEdits数组

`vscode.executeLinkProvider` - 执行**文档链接**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为DocumentLink实例数组

`vscode.executeDocumentColorProvider` - 执行**文档颜色**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为ColorInfomation对象数组

`vscode.executeColorPresentationProvider` - 执行**色彩呈现**供应器函数

- *color* - 需要展示并插入的颜色
- *context* - 上下文对象, 包括uri和影响范围
- *(returns)* - promise函数, 且参数为ColorPresentation对象数组

`vscode.previewHtml` - 在编辑器窗口中渲染HTML

- *uri* - 要预览的uri
- *column* - (可选的)要展示在窗口的哪一列
- *label* - (可选的)预览的标题
- *options* - (可选的)webview环境配置项

`vscode.openFolder` - 在当前窗口或者新的窗口打开一个文件夹或者工作区

- *uri* - 被打开的文件夹或工作区Uri. 如果未提供, 会打开一个询问提示框
- *newWindow* - (可选的)是否在新窗口打开. 默认在本窗口

!> **注意：** 在当前窗口打开, 如果未设置`newWindow = true`, 会在指定的工作区或者文件夹开启新的拓展主机进程, 并且关闭当前拓展主机进程.

`vscode.diff` - 在diff编辑器中打开指定资源以比较它们的内容

- *left* diff编辑器左边的文件
- *right* diff编辑器右边的文件
- *title* (可选)diff编辑器标题
- *options* (可选)编辑器配置项, 参考`vscode.TextDocumentShowOptions`

`vscode.open` - 在编辑器打开指定文件

- *resource* - 要打开的文件
- *columnOrOptions* - (可选)可以是要打开的编辑器列，也可以是编辑器选项，参考`vscode.TextDocumentShowOptions`

可以是文本文件、二进制文件、http(s) url. 如果需要更多的配置项, 使用`vscode.window.showTextDocument`代替.

`vscode.removeFromRecentlyOpened` - 在最近打开的列表中移除一个路径

- *path* - 被移除的路径

`vscode.setEditorLayout` - 设置编辑器布局

- *layout* - 被设置的布局

