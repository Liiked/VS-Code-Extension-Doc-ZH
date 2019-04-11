# 内置命令

这篇文档列出了可能需要与`vscode.commands.executeCommand`一起使用的命令集合.

阅读[命令指南]()以了解如何使用`commands`API.

下面是一个如何在 VS Code 中打开新文件夹的例子:

```javascript
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
- *triggerCharacter* - (可选的)当用户输入特定字符时（如`,` 或 `(`）触发符号帮助
- *(returns)* - promise函数, 且参数为SignatureHelp

`vscode.executeDocumentSymbolProvider` - 执行**文档符号**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为具有SymbolInformation和DocumentSymbol的实例数组

`vscode.executeCompletionItemProvider` - 执行**自动补全**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *triggerCharacter* - (可选的)当用户输入诸如(`,` `(`)之类的字符时触发
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

布局是一个对象，带有初始布局方向（可选，0 = 水平布局，1 = 垂直布局），还有一个包含编辑器组的数组。每个编辑器组又有一个尺寸和另一个数组，其中有矩形布局和方向信息。如果设置了编辑器组的大小，每一行或者每一列的总和必须为1。比如一个2x2的网格：`{ orientation: 0, groups: [{ groups: [{}, {}], size: 0.5 }, { groups: [{}, {}], size: 0.5 }] }`

`cursorMove` - 移动光标到视图的合理位置

- *Cursor move argument object*

  可以传递的键值对

    - 'to': 必选, 鼠标要移动到的合理位置
    ```
    'left', 'right', 'up', 'down'
    'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter'
    'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter'
    'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside'
    ```
    - 'by': 移动的单位. 默认根据'to'来计算.
    ```
    'line', 'wrappedLine', 'character', 'halfLine'
    ```
    - 'value': 单位步数. 默认为'1'.
    - 'select': 如果为'true'则会选中. 默认为'false'.

`editorScroll` - 编辑器滚动方向

- *Editor scroll argument object*

  可以传递的键值对

    - 'to': 必须的. 方向值
    ```
    'up', 'down'
    ```
    - 'by': 移动的单位. 默认根据'to'来计算.
    ```
    'line', 'wrappedLine', 'page', 'halfPage'
    ```
    - 'value': 单位步数. 默认为'1'.
    - 'revealCursor': 如果为'true', 在超出滚动视图也会显示光标.

`revealLine` - 在给定的位置显示行

- *Reveal line argument object*

  可以传递的键值对

    - 'lineNumber': 必须的. 行号
    - 'at': 显示的合理位置
    ```
    'top', 'center', 'bottom'
    ```

`editor.unfold` - 展开编辑器内容

- *Unfold editor argument*

  可以传递的键值对

    - 'levels': 展开的层级数. 默认为 1.
    - 'direction': 如果是'up', 向上展开, 否则向下展开
    - 'selectionLines': 要使用展开功能的起始行（从0起）。如果不设置，就会使用当前激活的行（选中区）.

`editor.fold` - 折叠编辑器内容

- `Fold editor argument`

  可以传递的键值对

    - 'levels': 折叠的的层级数。默认为1
    - 'direction':  如果设置为'up'，向上折叠，不然向下折叠
    - 'selectionLines': 要使用折叠功能的起始行（从0起）。如果不设置，就会使用当前激活的行（选中区）

`editor.action.showReferences` - 在文件中显示引用

- *uri* - 要显示引用的文件
- *position* - 要显示的位置
- *locations* - 位置数组

`moveActiveEditor` - 通过标签或者组移动激活的编辑器

- *Active editor move argument*

  参数

  - 'to': String. 目标位置
  - 'by': String. 移动的单位(通过标签或者组).
  - 'value': Number. 要移动的位置或者绝对位置值

## 简单命令

简单的命令不需要参数, 可以在`keybindings.json`的**键盘快捷方式**列表中找到. 在文件底部的注释块中列出了未绑定的命令.

查看`keybindings.json`:

Windows, Linux: **文件** > **首选项** > **键盘快捷方式** > `keybindings.json`

macOS: **编码** > **首选项** > **键盘快捷方式** > `keybindings.json`