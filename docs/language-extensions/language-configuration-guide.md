# 语言配置

通过[`contributes.languages`](/extensibility-reference/contribution-points#contributeslanguages)配置点，你可以配置以下*声明式语言特性*：

- 启用/关闭注释
- 定义括号
- 自动闭合符号
- 自动环绕符号
- 代码折叠
- 单词匹配
- 缩进规则

[语言配置示例](https://github.com/Microsoft/vscode-extension-samples/tree/master/language-configuration-sample)中配置JavaScript文件中的编辑功能。本篇指南会详细解释`language-configuration.json`中的内容：
::: warning
**注意**：如果你的语言配置文件以`language-configuration.json`结尾或就叫这个名称，那么VS Code会帮你添加代码补全和校验功能。
:::

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": ["/*", "*/"]
	},
	"brackets": [["{", "}"], ["[", "]"], ["(", ")"]],
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string", "comment"] },
		{ "open": "/**", "close": " */", "notIn": ["string"] }
	],
	"autoCloseBefore": ";:.,=}])>` \n\t",
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["'", "'"],
		["\"", "\""],
		["`", "`"]
	],
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*#?region\\b",
			"end": "^\\s*//\\s*#?endregion\\b"
		}
	},
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)",
	"indentationRules": {
		"increaseIndentPattern": "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
		"decreaseIndentPattern": "^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$"
	}
}
```

## 启用/关闭注释

VS Code提供了切换注释开关的命令：

- **Toggle Line Comment**
- **Toggle Block Comment**

分别来配置`comments.lineComment`控制块注释和`comments.blockComment`控制行注释。

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": ["/*", "*/"]
	}
}
```
`lineComment` 支持两种不同的后向兼容格式：
- 用字符值表示简单的单行注释
- 用对象来配置更多注释行的缩进

```json
{
  "comments": {
    "lineComment": {
      "comment": "//",
      "noIndent": true
    },
    "blockComment": ["/*", "*/"]
  }
}
```

## 定义括号

你在VS Code中将鼠标移动到一个括号边上时，VS Code会自动高亮对应的括号。

```json
{
	"brackets": [["{", "}"], ["[", "]"], ["(", ")"]]
}
```

另外，当你运行**Go to Bracket**或**Select to Bracket**时，VS Code会自动使用你的定义找到最近、最匹配的括号。

## 自动闭合符号

当你输入`'`时，VS Code会自动帮你补全另一个单引号然后将光标放在引号中间，我们来看看是怎么做的：

```json
{
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string", "comment"] },
		{ "open": "/**", "close": " */", "notIn": ["string"] }
	]
}
```

配置`notIn`键（key）可以在你需要的时候关闭这个功能。比如你在写下面的代码：

```javascript
// ES6's Template String
`ES6's Template String`;
```

此时单引号就不会闭合。

用户可以使用`editor.autoClosingQuotes`和`editor.autoClosingBrackets`设置*自动闭合符号*的行为。

#### 在XXX前闭合符号

如果符号的右边有空白，那么VS Code默认会启用符号闭合，所以当你在JSX代码中输入`{`时，符号并不会闭合：

```javascript
const Component = () =>
  <div className={>
                  ^ VS Code默认不会闭合此处的括号
  </div>
```

但是你可以用下面的定义覆盖默认行为：

```json
{
	"autoCloseBefore": ";:.,=}])>` \n\t"
}
```

现在如果你在`>`前面输入`{`，VS Code会自动补全`}`。

## 自动环绕符号

当你选择了一堆文本然后输入左括号时，VS Code会对选中内容外围加上对应的括号。这个功能叫做*自动环绕符号*，你可以参考下面的代码指定这项功能：

```json
{
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["'", "'"],
		["\"", "\""],
		["`", "`"]
	]
}
```

注意用户可以通过`editor.autoSurround`设置*自动环绕符号*的行为。

## 代码折叠

在VS Code中有三种代码折叠类型：

- 缩进折叠：这是VS Code中默认的缩进行为，当两行内容有着相同的缩进级别时，你就可以看到折叠标记了。
- 语言配置折叠：当VS Code发现`folding.markers`同时定义了`start`和`end`时，对应区域内就会出现折叠标记。下述配置会对`//#region`和`//#endregionJSON`区域创建代码折叠标记：

```json
{
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*#?region\\b",
			"end": "^\\s*//\\s*#?endregion\\b"
		}
	}
}
```

- 语言服务器折叠：语言服务器获取到[textDocument/foldingRange](https://microsoft.github.io/language-server-protocol/specification#textDocument_foldingRange)请求中的代码折叠列表数据，VS Code之后根据这份列表创建折叠标记。通过语言服务器协议学习更多关于[程序性语言特性](/language-extensions/programmatic-language-features)。

## 单词匹配

`wordPattern`定义了程序语言中*单词*单位。因此当你使用词语相关的命令，如：**Move cursor to word start**（<kbd>Ctrl+Left</kbd>）或者**Move cursor to word end**（<kbd>Ctrl+Right</kbd>）时，编辑器会根据正则寻找单词边界。

```json
{
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)"
}
```

## 缩进规则

`indentationRules`定义了编辑器应该如何调整当前行或你粘贴、输入、移动的下一行缩进。

```json
{
	"indentationRules": {
		"increaseIndentPattern": "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
		"decreaseIndentPattern": "^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$"
	}
}
```

比如，`if (true) {`匹配`increasedIndentPattern`，然后如果你在`{`后面按下<kbd>Enter</kbd>后，编辑器会自动缩进一次，你如代码看起来会像这样：

```javascript
if (true) {
	console.log();
```

如果没有设置缩进规则，当行尾以开符号结尾时编辑器会左缩进，以闭合符号结尾时右缩进。这里的*开闭符号*由`brackets`定义。

注意`editor.formatOnPaste`是由[DocumentRangeFormattingEditProvider](https://code.visualstudio.com/api/references/vscode-api#DocumentRangeFormattingEditProvider)控制，而不由自动缩进控制。

## 回车键规则

`onEnterRules` 定义了在编辑器中按下 <kbd>Enter</kbd> 时会执行的一系列规则。

```json
{
  "onEnterRules": [{
    "beforeText": "^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async).*?:\\s*$",
    "action": { "indent": "indent" }
  }]
}
```

按下 `kbstyle(Enter)` 时，会针对以下属性检查光标之前、之后或上一行的文本：

- `beforeText`（必填）。匹配光标前文本（限定在当前行）的正则表达式。
- `afterText`。匹配光标后文本（限定在当前行）的正则表达式。
- `previousLineText`。匹配光标上一行文本的正则表达式。

如果所有指定的属性都匹配，则该规则被视为匹配，并且不再评估后续的 `onEnterRules`。一个 `onEnterRule` 可以指定以下操作：

- `indent`（必填）。`none, indent, outdent, indentOutdent` 之一。
  - `none` 表示新行将继承当前行的缩进。
  - `indent` 表示新行将相对于当前行缩进。
  - `outdent` 表示新行将相对于当前行减少缩进。
  - `indentOutdent` 表示将插入两个新行，第一个缩进，第二个减少缩进。
- `appendText`。将附加到新行和缩进之后的字符串。
- `removeText`。要从新行缩进中删除的字符数。

