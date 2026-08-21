# 内置命令

这篇文档列出了可能需要与`vscode.commands.executeCommand`一起使用的命令集合.

阅读[命令指南](/extension-guides/command)以了解如何使用`commands`API.

下面是一个如何在 VS Code 中打开新文件夹的例子:

```javascript
let uri = Uri.file('/some/path/to/folder');
let success = await commands.executeCommand('vscode.openFolder', uri);
```
:::info
提示: 你可以用键盘快捷键编辑器 **File > Preferences > Keyboard Shortcuts** 查看 VS Code 的所有命令。键盘快捷键编辑器列出了所有 VS Code 原生和配置命令，以及这些命令的快捷键和 when 子句控制的可见性。
:::

## 命令

`vscode.executeDataToNotebook` - 调用笔记本序列化器

* _notebookType_ - 笔记本类型
* _data_ - 可转换为 Data 的 Bytes
* _(returns)_ - Notebook 数据

`vscode.executeNotebookToData` - 调用笔记本序列化器

* _notebookType_ - 笔记本类型
* _NotebookData_ - 可将笔记本 Data 转换为 Bytes
* _(returns)_ - Bytes

`notebook.selectKernel` - 根据特定笔记本插件触发内核选择器

* _options_ - 内核选项
* _(returns)_ - 无

`interactive.open` - 打开交互窗口并返回笔记本编辑器和输入 URI

* _showOptions_ - 显示选项
* _resource_ - 交互资源 Uri
* _controllerId_ - 笔记本控制器 Id
* _title_ - 交互编辑器标题
* _(returns)_ - 笔记本和输入 URI

`vscode.editorChat.start` - 启动一个新的编辑器聊天会话

* _Run arguments_ -
* _(returns)_ - 无

`vscode.executeDocumentHighlights` - 执行**文档高亮**供应器函数.

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *(returns)* - promise函数, 且参数为DocumentHighlight实例数组

`vscode.executeDocumentSymbolProvider` - 执行**文档符号**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为具有SymbolInformation和DocumentSymbol的实例数组

`vscode.executeFormatDocumentProvider` - 执行**格式化文档**供应器函数

- *uri* - 文档的Uri
- *options* - 配置项
- *(returns)* - promise函数, 且参数为TextEdits数组

`vscode.executeFormatOnTypeProvider` - 执行**格式化文档**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *ch* - 在输入某个字符之后进行格式化
- *options* - 配置项
- *(returns)* - promise函数, 且参数为TextEdits数组

`vscode.executeDefinitionProvider` - 执行所有的**定义**供应器函数

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组.

`vscode.executeTypeDefinitionProvider` - 执行所有的**类型定义**供应器函数.

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组.

`vscode.executeDeclarationProvider` - 执行所有的**声明**供应器函数.

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组.

`vscode.executeImplementationProvider` - 执行所有的**接口**供应器函数

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Location实例数组

`vscode.executeReferenceProvider` - 执行**引用**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *(returns)* - promise函数, 且参数为Location实例数组

`vscode.executeHoverProvider` - 执行所有的**悬停**供应器函数.

- *uri* - 文档的Uri
- *position* - 某个符号的位置
- *(returns)* - promise函数, 且参数为Hover实例数组

`vscode.executeSelectionRangeProvider` - 执行**选区范围**供应器函数。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的某个位置
* _(returns)_ - 解析为范围数组的 promise。

`vscode.executeWorkspaceSymbolProvider` - 执行工作区所有的**符号**供应器函数

- *query* - 搜索关键词
- *(returns)* - promise函数, 且参数为具有SymbolInformation和DocumentSymbol的实例数组.

`vscode.prepareCallHierarchy` - 在文档内的某个位置准备调用层次结构

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的某个位置
* _(returns)_ - 解析为 CallHierarchyItem 实例数组的 promise

`vscode.provideIncomingCalls` - 计算某个条目的传入调用

* _item_ - 一个调用层次结构条目
* _(returns)_ - 解析为 CallHierarchyIncomingCall 实例数组的 promise

`vscode.provideOutgoingCalls` - 计算某个条目的传出调用

* _item_ - 一个调用层次结构条目
* _(returns)_ - 解析为 CallHierarchyOutgoingCall 实例数组的 promise

`vscode.prepareRename` - 执行重命名供应器的 prepareRename。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的某个位置
* _(returns)_ - 解析为一个范围和占位符文本的 promise。

`vscode.executeDocumentRenameProvider` - 执行**重命名**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *newName* - 新的符号名称
- *(returns)* - promise函数, 且参数为WorkspaceEdit

`vscode.executeLinkProvider` - 执行**文档链接**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为DocumentLink实例数组

`vscode.provideDocumentSemanticTokensLegend` - 为文档提供语义令牌图例

* _uri_ - 文本文档的 Uri
* _(returns)_ - 解析为 SemanticTokensLegend 的 promise。

`vscode.provideDocumentSemanticTokens` - 为文档提供语义令牌

* _uri_ - 文本文档的 Uri
* _(returns)_ - 解析为 SemanticTokens 的 promise。

`vscode.provideDocumentRangeSemanticTokensLegend` - 为文档范围提供语义令牌图例

* _uri_ - 文本文档的 Uri
* _range_ - （可选）文本文档中的某个范围
* _(returns)_ - 解析为 SemanticTokensLegend 的 promise。

`vscode.provideDocumentRangeSemanticTokens` - 为文档范围提供语义令牌

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的某个范围
* _(returns)_ - 解析为 SemanticTokens 的 promise。



`vscode.executeCompletionItemProvider` - 执行**自动补全**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *triggerCharacter* - (可选的)当用户输入诸如(`,` `(`)之类的字符时触发
- *itemResolveCount* - (可选的)补全的符号数量(数目太大会减慢补全速度)
- *(returns)* - promise函数, 且参数为CompletionList实例

`vscode.executeSignatureHelpProvider` - 执行**符号帮助**供应器函数

- *uri* - 文档的Uri
- *position* - 在文档中的位置
- *triggerCharacter* - (可选的)当用户输入特定字符时（如`,` 或 `(`）触发符号帮助
- itemResolveCount - (可选) 需要处理的自动完成数量 (数量太多时会减慢自动完成)
- *(returns)* - promise函数, 且参数为SignatureHelp

`vscode.executeCodeLensProvider` - 执行**CodeLens**供应器函数

- *uri* - 文档的Uri
- *itemResolveCount* - (可选的)需要解析的lenses数量, 数目太大会影响性能
- *(returns)* - promise函数, 且参数为CodeLens实例数组

`vscode.executeCodeActionProvider` - 执行**代码操作小灯泡提示**供应器函数

- *uri* - 文档的Uri
- *range* - 在文档中的范围
- *(returns)* - promise函数, 且参数为Command实例数组

`vscode.executeDocumentColorProvider` - 执行**文档颜色**供应器函数

- *uri* - 文档的Uri
- *(returns)* - promise函数, 且参数为ColorInfomation对象数组

`vscode.executeColorPresentationProvider` - 执行**色彩呈现**供应器函数

- *color* - 需要展示并插入的颜色
- *context* - 上下文对象, 包括uri和影响范围
- *(returns)* - promise函数, 且参数为ColorPresentation对象数组

`vscode.executeFormatRangeProvider` - 执行**局部格式化**供应器函数

- *uri* - 文档的Uri
- *range* - 限制的范围
- *options* - 配置项
- *(returns)* - promise函数, 且参数为TextEdits数组

`vscode.executeInlayHintProvider` - 执行**内联提示**供应器函数

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的某个范围
* _(returns)_ - 解析为 Inlay 对象数组的 promise

`vscode.executeFoldingRangeProvider` - 执行**折叠范围**供应器函数

* _uri_ - 文本文档的 Uri
* _(returns)_ - 解析为 FoldingRange 对象数组的 promise

`vscode.resolveNotebookContentProviders` - 解析笔记本内容提供程序

* _(returns)_ - 解析为 NotebookContentProvider 静态信息对象数组的 promise。

`vscode.executeInlineValueProvider` - 执行**内联值**供应器函数

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的某个范围
* _context_ - 一个 InlineValueContext
* _(returns)_ - 解析为 InlineValue 对象数组的 promise

`vscode.open` - 在编辑器打开指定文件

- *resource* - 要打开的文件
- *columnOrOptions* - (可选)可以是要打开的编辑器列，也可以是编辑器选项，参考`vscode.TextDocumentShowOptions`
- label - 编辑器标签 (可选)
- (returns) - 无

`vscode.openWith` - 使用特定编辑器打开所提供的资源。

* _resource_ - 要打开的资源
* _viewId_ - 自定义编辑器视图 id，或使用 VS Code 默认编辑器的 'default'
* _columnOrOptions_ - （可选）打开的列或编辑器选项，参见 vscode.TextDocumentShowOptions
* _(returns)_ - 无

`vscode.diff` - 在diff编辑器中打开指定资源以比较它们的内容

- *left* diff编辑器左边的文件
- *right* diff编辑器右边的文件
- *title* (可选)diff编辑器标题
- *options* (可选)编辑器配置项, 参考`vscode.TextDocumentShowOptions`

`vscode.changes` - 在变更编辑器中打开资源列表以比较它们的内容。

* _title_ - 变更编辑器的人类可读标题
* _resourceList_ - 要比较的资源列表

`vscode.prepareTypeHierarchy` - 在文档内的某个位置准备类型层次结构

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的某个位置
* _(returns)_ - 解析为 TypeHierarchyItem 实例数组的 promise

`vscode.provideSupertypes` - 计算某个条目的父类型

* _item_ - 一个类型层次结构条目
* _(returns)_ - 解析为 TypeHierarchyItem 实例数组的 promise

`vscode.provideSubtypes` - 计算某个条目的子类型

* _item_ - 一个类型层次结构条目
* _(returns)_ - 解析为 TypeHierarchyItem 实例数组的 promise

`vscode.revealTestInExplorer` - 在资源管理器中显示测试实例

* _testItem_ - 一个 VS Code TestItem。
* _(returns)_ - 无

`setContext` - 设置一个可在 when 子句中使用的自定义上下文键值。

* _name_ - 上下文键名
* _value_ - 上下文键值
* _(returns)_ - 无

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

`editor.toggleFold` - 根据编辑器当前状态折叠或展开内容

`editor.actions.findWithArgs` - 使用特定选项打开一个新的编辑器内查找小部件。

* searchString - 用于预填查找输入的字符串
* replaceString - 用于预填替换输入的字符串
* isRegex - 启用正则表达式
* preserveCase - 替换时尝试保持相同的大小写
* findInSelection - 将查找位置限制在当前选区
* matchWholeWord - 匹配整个单词
* isCaseSensitive - 区分大小写

`editor.action.goToLocations` - 从文件中的某个位置跳转到其他位置

* _uri_ - 开始查找的文本文档
* _position_ - 开始查找的位置
* _locations_ - 位置数组。
* _multiple_ - 定义有多个结果时的行为，可以是 `peek`、`gotoAndPeek` 或 `goto`
* _noResultsMessage_ - 位置为空时显示的人类可读消息。

`editor.action.peekLocations` - 从文件中的某个位置预览其他位置

* _uri_ - 开始查找的文本文档
* _position_ - 开始查找的位置
* _locations_ - 位置数组。
* _multiple_ - 定义有多个结果时的行为，可以是 `peek`、`gotoAndPeek` 或 `goto`

`workbench.action.quickOpen` - 快速访问

* _prefix_ - 前缀

`notebook.cell.toggleOutputs` - 切换输出

* _options_ - 单元格范围选项

`notebook.fold` - 折叠单元格

* _index_ - 单元格索引

`notebook.unfold` - 展开单元格

* _index_ - 单元格索引

`notebook.selectKernel` - 笔记本内核参数

* _kernelInfo_ - 内核信息

`notebook.cell.changeLanguage` - 更改单元格语言

* _range_ - 单元格范围
* _language_ - 目标单元格语言

`notebook.execute` - 全部运行

* _uri_ - 文档 uri

`notebook.cell.execute` - 执行单元格

* _options_ - 单元格范围选项

`notebook.cell.executeAndFocusContainer` - 执行单元格并聚焦容器

* _options_ - 单元格范围选项

`notebook.cell.cancelExecution` - 停止单元格执行

* _options_ - 单元格范围选项

`workbench.action.findInFiles` - 打开工作区搜索

* _A set of options for the search_ - 一组搜索选项

`_interactive.open` - 打开交互窗口

* _showOptions_ - 显示选项
* _resource_ - 交互资源 Uri
* _controllerId_ - 笔记本控制器 Id
* _title_ - 笔记本编辑器标题

`interactive.execute` - 执行输入框的内容

* _resource_ - 交互资源 Uri

`search.action.openNewEditor` - 打开一个新的搜索编辑器。传入的参数可以包含诸如 ${relativeFileDirname} 之类的变量。

* _Open new Search Editor args_ - 打开新搜索编辑器的参数

`search.action.openEditor` - 打开一个新的搜索编辑器。传入的参数可以包含诸如 ${relativeFileDirname} 之类的变量。

* _Open new Search Editor args_ - 打开新搜索编辑器的参数

`search.action.openNewEditorToSide` - 打开一个新的搜索编辑器。传入的参数可以包含诸如 ${relativeFileDirname} 之类的变量。

* _Open new Search Editor args_ - 打开新搜索编辑器的参数

`vscode.openFolder` - 在当前窗口或者新的窗口打开一个文件夹或者工作区

- *uri* - 被打开的文件夹或工作区Uri. 如果未提供, 会打开一个询问提示框
- *_options_* - (可选) 选项。对象中可使用以下属性
  -  `forceNewWindow`: 是否在当前或者新窗口中打开文件夹/工作区。默认在同一窗口中打开 
  -  `forceReuseWindow`: 是否强制在当前窗口中打开文件夹/工作区。默认为否 
  -  `noRecentEntry`: 打开 URI 时是否展示在 'Open Recent(最近打开)' 列表中。默认为否。
  
  注意，为了后向兼容，选项可以直接设置为布尔类型来表示 `forceNewWindow`

`vscode.newWindow` - 根据 newWindow 参数打开一个新窗口。

* _options_ - （可选）选项。包含以下属性的对象：`reuseWindow`：是否打开新窗口还是使用同一窗口。默认在新窗口中打开。

`vscode.removeFromRecentlyOpened` - 在最近打开的列表中移除一个路径

- *path* - 被移除的路径

`moveActiveEditor` - 通过标签或者组移动激活的编辑器

- *Active editor move argument*

  参数

  - 'to': String. 目标位置
  - 'by': String. 移动的单位(通过标签或者组).
  - 'value': Number. 要移动的位置或者绝对位置值

布局是一个对象，带有初始布局方向（可选，0 = 水平布局，1 = 垂直布局），还有一个包含编辑器组的数组。每个编辑器组又有一个尺寸和另一个数组，其中有矩形布局和方向信息。如果设置了编辑器组的大小，每一行或者每一列的总和必须为1。比如一个2x2的网格：`{ orientation: 0, groups: [{ groups: [{}, {}], size: 0.5 }, { groups: [{}, {}], size: 0.5 }] }`


`copyActiveEditor` - 按组复制活动编辑器

* _Active editor copy argument_ - 参数属性：
  * 'to'：提供复制位置的字符串值。
  * 'value'：提供要复制的多少个位置或绝对位置的数字值。

`vscode.getEditorLayout` - 获取编辑器布局

* _(returns)_ - 一个编辑器布局对象，格式与 vscode.setEditorLayout 相同

`workbench.action.files.newUntitledFile` - 新建未命名文本文件

* _New Untitled Text File arguments_ - 编辑器视图类型或语言 ID（如果已知）

`workbench.extensions.installExtension` - 安装给定的扩展

* _extensionIdOrVSIXUri_ - 扩展 id 或 VSIX 资源 uri
* _options_ - （可选）安装扩展的选项。包含以下属性的对象：`installOnlyNewlyAddedFromExtensionPackVSIX`：启用后，VS Code 仅安装扩展包 VSIX 中新增的扩展。此选项仅在安装 VSIX 时生效。

`workbench.extensions.uninstallExtension` - 卸载给定的扩展

* _Id of the extension to uninstall_ - 要卸载的扩展的 Id

`workbench.extensions.search` - 搜索特定的扩展

* _Query to use in search_ - 搜索中使用的查询

`workbench.action.tasks.runTask` - 运行任务

* _args_ - 过滤快速选择（Quick Pick）中显示的任务

`workbench.action.openIssueReporter` - 打开问题报告器，并可选择预填部分表单。

* _options_ - 用于预填问题报告器的数据。

`vscode.openIssueReporter` - 打开问题报告器，并可选择预填部分表单。

* _options_ - 用于预填问题报告器的数据。

`workbench.action.openLogFile` - workbench.action.openLogFile

* _logFile_ - 日志文件

`workbench.action.openWalkthrough` - 打开引导教程。

* _walkthroughID_ - 要打开的引导教程的 ID。
* _toSide_ - 在侧边的新编辑器组中打开引导教程。


## 简单命令

简单的命令不需要参数, 可以在`keybindings.json`的**键盘快捷方式**列表中找到. 在文件底部的注释块中列出了未绑定的命令.

查看默认 `keybindings.json`，请打开命令面板(<kbd>Ctrl+Shift+P</kbd>) 输入 **Preferences: Open Default Keyboard Shortcuts (JSON)**
