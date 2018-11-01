# 复杂命令

本篇列出了VS Code中一系列的复杂命令。因为这些命令需要参数，还会返回一些值，所以我们称之为复杂命令。你可以通过`executeCommand`API，将各个命令联合起来使用。

下面是一个预览HTML文档的例子：
```javascript
let uri = Uri.parse('file:///some/path/to/file.html');
let success = await commands.executeCommand('vscode.previewHtml', uri);
```

## 命令
---

`vscode.executeWorkspaceSymbolProvider` - 执行工作区全部的符号供应函数（symbol provider）
* _query_ - 搜索文本
* _(returns)_ - promise函数，且返回SymbolInformation实例数组

`vscode.executeDefinitionProvider` - 执行全部定义供应函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回Location实例数组

`vscode.executeTypeDefinitionProvider` - 执行全部的定义供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回Location实例数组

`vscode.executeImplementationProvider` - 执行全部的**实现**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回Location实例数组

`vscode.executeHoverProvider` - 执行全部的**悬浮提示**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回Hover实例数组

`vscode.executeDocumentHighlights` -  执行**文档高亮**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回DocumentHighlight实例数组

`vscode.executeReferenceProvider` - 执行**引用**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回Location实例数组

`vscode.executeDocumentRenameProvider` - 执行**重命名**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _newName_ - 新符号的名称
* _(returns)_ - promise函数，且返回WorkspaceEdit

`vscode.executeSignatureHelpProvider` - 执行**符号帮助**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _triggerCharacter_ - (可选) 当用户输入特定字符时（如`,` 或 `(`）触发符号帮助
* _(returns)_ - promise函数，且返回SignatureHelp

`vscode.executeDocumentSymbolProvider` - 执行**文档符号**供应器函数。

* _uri_ - 文档的Uri
* _(returns)_ - promise函数，且返回SymbolInformation实例数组

`vscode.executeCompletionItemProvider` - 执行**补全**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _triggerCharacter_ - (可选) 当用户输入特定字符时（如`,` 或 `(`）触发符号帮助
* _itemResolveCount_ - (可选) 解析的补全数量 (该数字太大会减慢补全项解析的过程)
* _(returns)_ - promise函数，且返回CompletionList实例数组

`vscode.executeCodeActionProvider` - 执行**代码激活**供应器函数。

* _uri_ - 文档的Uri
* _range_ - 文本文档的范围
* _(returns)_ - promise函数，且返回Command实例数组

`vscode.executeCodeLensProvider` - 执行CodeLens供应器函数。

* _uri_ - 文档的Uri
* _itemResolveCount_ - (可选) 解析的结果数量，该配置可能会影响性能
* _(returns)_ - promise函数，且返回CodeLens实例数组

`vscode.executeFormatDocumentProvider` - 执行**文档格式化**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _(returns)_ - promise函数，且返回TextEdits实例数组

`vscode.executeFormatRangeProvider` - 执行**范围格式化**供应器函数。

* _uri_ - 文档的Uri
* _range_ - 文本文档的范围
* _options_ - 格式化选项
* _(returns)_ - promise函数，且返回TextEdits实例数组

`vscode.executeFormatOnTypeProvider` - 执行**文档格式化**供应器函数。

* _uri_ - 文档的Uri
* _position_ - 某个符号的位置
* _ch_ - 输入的字符
* _options_ - 格式化选项
* _(returns)_ - promise函数，且返回TextEdits实例数组

`vscode.executeLinkProvider` - 执行**文档链接**供应器函数。

* _uri_ - 文档的Uri
* _(returns)_ - * _(returns)_ - promise函数，且返回DocumentLink实例数组

`vscode.executeDocumentColorProvider` - 执行**文档色彩**供应器函数。

* _uri_ - 文档的Uri
* _(returns)_ - promise函数，且返回ColorInformation对象数组

`vscode.executeColorPresentationProvider` - 执行**色彩呈现**供应器函数。

* _color_ - 要显示和插入的颜色
* _context_ - 上下文对象，包含uri和影响范围
* _(returns)_ - promise函数，且返回ColorPresentation对象数组

`vscode.previewHtml` - 在编辑器窗口中渲染HTML

* _uri_ - 要预览的Uri
* _column_ - (可选) 显示在窗口的哪一列
* _label_ - (可选) 字符串，显示为预览的标题
* _options_ - (可选) 控制webivew环境的选项

查看 [使用HTML预览](extensibility-reference/vscode-api-commands?id=使用html-preview)章节获取更多最佳实践和插件创作的信息。

`vscode.openFolder` - 在当前工作区打开文件夹，或者根据传入的参数打开新窗口

* _uri_ - (可选) 要打开的文件夹或者工作区文件。如果不提供的话，会打开一个原生对话框窗口给用户选择。
* _newWindow_ - (可选) 是否在新窗口中打开文件夹/工作区。默认在当前窗口打开。

!> 注意：在当前窗口打开会关闭当前插件进程，然后根据新的文件夹/工作区启动新的插件进程，除非你配置了newWindow参数

`vscode.diff` - 在diff编辑器中打开选中的源文件以便比较他们的内容。

* _left_ - diff编辑器左边的文件
* _right_ - diff编辑器右边的文件
* _title_ - (可选) diff编辑器的标题
* _options_ - (可选) 编辑器选项，请查看vscode.TextDocumentShowOptions

`vscode.open` - 在编辑器中打开提供的资源文件

* _resource_ - 要打开的资源文件
* _columnOrOptions_ - (可选) 可以是要打开的编辑器列，也可以是编辑器选项，查看 vscode.TextDocumentShowOptions

可以是文本文件、二进制文件、http(s) url。如果你需要打开文本文件时的更多控制，请使用vscode.window.showTextDocument

`vscode.removeFromRecentlyOpened` - 在最近打开的列表中移除一个路径。

* _path_ - 路径

`vscode.setEditorLayout` - 设置编辑器的布局

* _layout_ - 要设置的布局

布局是一个对象，带有初始布局方向（可选，0 = 水平布局，1 = 垂直布局），还有一个包含编辑器组的数组。每个编辑器组又有一个尺寸和另一个数组，其中有矩形布局和方向信息。如果设置了编辑器组的大小，每一行或者每一列的总和必须为1。比如一个2x2的网格：`{ orientation: 0, groups: [{ groups: [{}, {}], size: 0.5 }, { groups: [{}, {}], size: 0.5 }] }`

`cursorMove` - 将鼠标指针移动到视图的逻辑位置上。

* _Cursor move argument object_

  这个参数可以配置以下键值对：

  * 'to': 必须，鼠标要移动到的逻辑坐标值
    ```
    'left', 'right', 'up', 'down'
    'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter'
    'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter'
    'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside'
    ```
  * 'by': 移动的单位，默认根据'to'值计算
    ```
    'line', 'wrappedLine', 'character', 'halfLine'
    ```
  * 'value': 步进数。默认为'1'
  * 'select': 设为'true'时则选中文本。默认是 'false'

  
`editorScroll` - 给定方向，滚动编辑器

* _Editor scroll argument object_

  这个参数可以配置以下键值对：

  * 'to': 必须，方向的值
    ```
    'up', 'down'
    ```
  * 'by': 移动的单位。默认根据'to'值计算。
    ```
    'line', 'wrappedLine', 'page', 'halfPage'
    ```
  * 'value': 步进数。默认为'1'
  * 'revealCursor': 如果设为'true'，那么滚动超出视口时也显示鼠标.


`revealLine` - 根据给定的逻辑位置显示行

* _Reveal line argument object_

  这个参数可以配置以下键值对：

  * 'lineNumber': 必须，行数
  * 'at': 显示行的逻辑位置
    ```
    'top', 'center', 'bottom'
    ```

`editor.unfold` - 展开编辑器中的内容

* _Unfold editor argument_

  这个参数可以配置以下键值对：

  * 'levels': 展开的层级数。默认为1
  * 'direction': 如果设置为'up'，向上展开，不然向下展开
  * 'selectionLines': 要使用展开功能的起始行（从0起）。如果不设置，就会使用当前激活的行（选中区）.

`editor.fold` - 折叠编辑器中的内容

* _Fold editor argument_

  这个参数可以配置以下键值对：

  * 'levels': 折叠的的层级数。默认为1
  * 'direction': 如果设置为'up'，向上折叠，不然向下折叠
  * 'selectionLines': 要使用折叠功能的起始行（从0起）。如果不设置，就会使用当前激活的行（选中区）.

  `editor.action.showReferences` - 在同个文件中显示引用的位置

* _uri_ - 要实现引用的文件
* _position_ - 要显示的位置
* _locations_ - 位置数组


`moveActiveEditor` - 依据标签或者组移动激活的编辑器

* _Active editor move argument_

  参数值：

  * 'to': String
  * 'by': String，移动的单位（标签：'tab'，组：'group'）
  * 'value': Number，要移动的位置或者绝对位置值

## 使用HTML Preview
---

### 样式

VS Code会动态解析HTML 的Body元素，加上下列类标签`vscode-light`，`vscode-dark`，`vscode-high-contrast`，以便符合VS Code当前的主题。

### 链接

文档中的链接是VS Code来处理的，VS Code也支持`file`和[virtual](https://github.com/Microsoft/vscode/blob/master/src/vs/vscode.d.ts#L3295)资源，还可以通过`command`协议触发命令。使用JSON格式的参数传入command-uri。注意：URL必须要encode。

下面的片段展示了一个命令的链接形式:

```javascript
  let href = encodeURI('command:vscode.previewHtml?' + JSON.stringify(someUri));
  let html = '<a href="' + href + '">Show Resource...</a>.';
```

### 安全性小贴士

作为插件的创作者，如果你使用了HTML预览，那么你就要避免用户接触到恶意内容。最危险的是攻击者使用你的HTML预览伪造了一个工作区，然后执行脚本和一些不安全的行为。遵循WEB安全的最佳实践，下面的内容有助于保护用户。

#### 审查内容

作为防御的第一条，当你使用HTML预览时，请先审查来自工作区设置或者用户的文件系统的输入内容。对于HTML内容，最好使用安全的tag和attribute白名单。使用[sanitize-html](https://www.npmjs.com/package/sanitize-html)库可以帮到你。

```html
<iframe sandbox srcdoc="<!DOCTYPE html>..."></iframe>
```

如果你的预览需要一些本机内容，用 `sandbox="allow-same-origin"`:

```html
<iframe sandbox="allow-same-origin" srcdoc="<!DOCTYPE html>..."></iframe>
```

`sandbox="allow-same-origin"` 禁用了`iframe`内的脚本执行，不过允许加载用户的本机内容，比如样式和图片。最好还是禁用所有本机资源访问，除非你确实需要加载一些东西。

#### 使用内容安全协议

如果你的预览需要一些脚本，请使用[content security policy](https://developer.mozilla.org/docs/Web/HTTP/CSP)禁用掉来自非可信用户的脚本。

比如，下面的内容保护协议允许了任意来源的图片，用户本地的样式，但是禁用了全部脚本:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src *; style-src 'self'; script-src 'none';">
  <title>...</title>
</head>
<body>
  Content
</body>
</html>
```

要想选择性地启动脚本，最好的方法是为白名单脚本动态生成[nonce](https://developers.google.com/web/fundamentals/security/csp/)：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src *; style-src 'self'; script-src 'nonce-123456';">
  <title>...</title>
</head>
<body>
  Content
  <script nonce="123456" src="file:///path/to/extension/my_trusted_script.js"></script>
</body>
</html>
```