# 语法高亮

语法高亮决定源代码的颜色和样式，它主要负责关键字（如javascript中的`if`，`for`）、字符串、注释、变量名等等语法的着色工作。

语法高亮由两部分工作组成：

- 根据语法将文本解析成符号和作用域
- 然后根据这份作用域映射应用对应的颜色和样式

本文档只教你第一部分：根据语法将文本解析成符号和作用域，然后使用现成的颜色和样式。自定义样式的部分请参考[色彩主题指南](/extension-guides/color-theme#语法色彩)

## TextMate 语法
---

VS Code使用[TextMate 语法](https://macromates.com/manual/en/language_grammars)将文本分割成一个个符号。TextMate语法是[Oniguruma正则表达式](https://macromates.com/manual/en/regular_expressions)的集合，一般是一份plist或者JSON格式的文件。你可以在[这里](https://www.apeth.com/nonblog/stories/textmatebundle.html)找到更棒的介绍文档，在里面可以找到你感兴趣的TextMate语法。

#### 符号和作用域

符号是由一门编程语言中最常见的一到几个字符组成的。符号包括运算符（如：`+`和`*`），变量名（如：`myVar`），或者字符串（如：`"my string"`）。

每个符号都有其作用域，作用域描述了这个符号的上下文。一个符号可被由**点**符号序列查找到，比如javascript中的`+`符号有这样的作用域`keyword.operator.arithmetic.js`。

主题会把颜色和样式映射到作用域上，这样一来就实现了语法高亮。TextMate提供了一些主题中[常用的作用域](https://macromates.com/manual/en/language_grammars)，如果你想要尽可能全面地支持语法，最好从现成的主题中入手，避免重新编写主题。

作用域支持嵌套，每个符号都会关联到它的父作用域上。下面的例子使用了[作用域检查器](#作用域检查器)，可以清晰地看到javascript函数中的运算符`+`和它的作用域层级：

![scopes](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/scopes.png)

父作用域的信息也同样是主题中的一部分。当主题指定了作用域，该作用域下的所有符号都会进行对应的着色，除非主题里面对单个作用域有其特殊配置。

#### 配置基本语法

VS Code支持JSON格式的TextMate语法。你可以在[发布内容配置](/references/contribution-points)里面的`grammers`进行配置。

这个配置点可以配置的内容有：语言的id，顶层语法作用域的名称，语法文件的路径。下面是一个`abc`语言的语法配置文件：

```json
{
	"contributes": {
		"languages": [
			{
				"id": "abc",
				"extensions": [".abc"]
			}
		],
		"grammars": [
			{
				"language": "abc",
				"scopeName": "source.abc",
				"path": "./syntaxes/abc.tmGrammar.json"
			}
		]
	}
}
```

这个语法文件本身包含了一个顶层规则，里面一般分为两个部分，`patterns`列出了程序(program)和`repository`的顶层元素。语法中的其他规则需要从`repository`中使用`{ "include": "#id" }`引入。

`abc`语法标记了字母`a`，`b`和`c`作为关键字，可以被括号包起来成为一个表达式。

```json
{
	"scopeName": "source.abc",
	"patterns": [{ "include": "#expression" }],
	"repository": {
		"expression": {
			"patterns": [{ "include": "#letter" }, { "include": "#paren-expression" }]
		},
		"letter": {
			"match": "a|b|c",
			"name": "keyword.letter"
		},
		"paren-expression": {
			"begin": "\\(",
			"end": "\\)",
			"beginCaptures": {
				"0": { "name": "punctuation.paren.open" }
			},
			"endCaptures": {
				"0": { "name": "punctuation.paren.close" }
			},
			"name": "expression.group",
			"patterns": [{ "include": "#expression" }]
		}
	}
}
```

语法引擎会试着逐步将`expression`中的规则应用到文本中。比如下面这个简单的程序：

```
a
(
    b
)
x
(
    (
        c
        xyz
    )
)
(
a
```

这个例子中的语法产生了下面的作用域列表（从左到右，从最佳匹配到最不匹配）

```
a               keyword.letter, source.abc
(               punctuation.paren.open, expression.group, source.abc
    b           expression.group, source.abc
)               punctuation.paren.close, expression.group, source.abc
x               source.abc
(               punctuation.paren.open, expression.group, source.abc
    (           punctuation.paren.open, expression.group, expression.group, source.abc
        c       keyword.letter, expression.group, expression.group, source.abc
        xyz     expression.group, expression.group, source.abc
    )           punctuation.paren.close, expression.group, expression.group, source.abc
)               punctuation.paren.close, expression.group, source.abc
(               source.abc
a               keyword.letter, source.abc
```

注意文本匹配不是单一规则，比如字符串`xyz`，是包含在当前作用域中的。文件的最后一个括号在`expression.group`里面，因为不会匹配`end`规则。

#### 嵌入式语言

如果你的语法中需要在父语言中嵌入其他语言，比如HTML中的CSS，那么你可以使用`embeddedLanguages`配置，告诉VSCode怎么处理嵌入的语言。然后嵌入语言的括号匹配，注释，和其他基础语言功能都会正常运作。

`embeddedLanguages`配置将嵌入语言的作用域映射到顶层语言的作用域上。下面里的例子里，`meta.embedded.block.javascript`作用域中的任何符号都会以javscript处理：

```json
{
	"contributes": {
		"grammars": [
			{
				"path": "./syntaxes/abc.tmLanguage.json",
				"scopeName": "source.abc",
				"embeddedLanguages": {
					"meta.embedded.block.javascript": "source.js"
				}
			}
		]
	}
}
```

现在，如你对应用了`meta.embedded.block.javascript`的符号进行注释就会有正确的`//`javascript风格，如果你触发代码片段，也会提示对应的javascript片段。

## 开发全新的语法插件
---

使用[VS Code的Yeoman模板](/get-started/your-first-extension)快速创建一个新的语法插件，运行`yo code`然后选择`New Language`：

![yo-new-language](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/yo-new-language.png)

Yeoman通过问问题的方式最后生成新的插件，对于创建语法插件最重要的几点就是：

- `Language Id` - 这个语言的id
- `Language Name` - 友好的名称
- `Scope names` - TextMate根作用域名称

![yo-new-language-questions](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/yo-new-language-questions.png)

生成器会假设你要同时对新语言定义好语言id和语法。如果你只是根据已有的语言创建新的语法，那么你只要填好目标语言的信息就好，然后一定要删除生成的`package.json`中的`languages`部分。

回答了一大堆问题之后，Yeoman会创建一个新的插件，其结构如下：

![generated-new-language-extension](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/generated-new-language-extension.png)

!> 注意：如果你只是配置一个VS Code中已有语言的语法，记得删掉生成的`package.json`中的`languages`配置。

#### 迁移现成的TextMate语法

`yo code`也快成帮你把已有的TextMate语法转成一个VS Code插件。使用`yo code`，选择`Language extension`，当询问是否从已有TextMate文件插件的时候，填入后缀为`.tmLanguage`或`.json`的TextMate语法文件。

![yo-convert](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/yo-convert.png)

#### 用YAML配置语法

随着语言日益复杂，你可能很快就会难以理解和维护你的json文件。如果你发现自己需要写很多正则表达式，或是需要添加大量解释语法层面的注释，你可能需要考虑使用yaml定义语法文件了。

Yaml语法和json有着同样的结构，但是它的语法更加精简，如多行字符串和注释。

![yaml-grammar](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/yaml-grammar.png)

VS Code只能加载json语法，所以yaml格式的语法文件必须最终转换成json文件。[`js-yaml`包](https://www.npmjs.com/package/js-yaml)可以帮你完成这个任务：

```bash
# Install js-yaml as a development only dependency in your extension
$ npm install js-yaml --save-dev

# Use the command line tool to convert the yaml grammar to json
$ npx js-yaml syntaxes/abc.tmLanguage.yaml > syntaxes/abc.tmLanguage.json
```

#### 作用域检查器

VS Code自带的作用域检查器能帮你调试语法文件。它能显示当前位置*符号*作用域，以及应用在上面的主题规则和元信息。

在命令面板中输入`Developer: Inspect TM Scopes`或者[使用快捷键](https://code.visualstudio.com/docs/getstarted/keybindings)启动*作用域检查器*。

```json
{
	"key": "cmd+alt+shift+i",
	"command": "editor.action.inspectTMScopes"
}
```

![scope-inspector](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/language-extensions/images/syntax-highlighting/scope-inspector.png)

作用域检查器可以显示以下的信息：

1. 当前符号
2. 关于符号的元信息，这些值都是计算后的值。如果你使用了嵌入语言，那么这里最重要的信息就是`language`和`token type`了
3. 符号使用的主题规则。这里只显示当前应用的规则，而不显示被其他样式覆盖的规则。
4. 完整的作用域列表，越往上作用域越明确。

## 语法注入
---

你可以通过*语法注入*扩展一个现成的语法文件。*语法注入*就是常规的TextMate语法，*语法注入*的应用有：

- 高亮注释中的关键字，如`TODO`
- 对现有语法添加更明确的作用域信息
- 向Markdown中的代码区块添加语法高亮

#### 创建一个基础语法注入

*语法注入*也是在`package.json`中配置的，不过这次不需要配置`language`，而是配置`injectTo`指明目需要注入的语言作用域列表。

在这个例子里，我们会新建一个非常简单的注入语法，对javascript注释中的`TODO`进行高亮。我们在`injectTo`中用`source.js`指向目标语言的作用域。

```json
{
	"contributes": {
		"grammars": [
			{
				"path": "./syntaxes/injection.json",
				"scopeName": "todo-comment.injection",
				"injectTo": ["source.js"]
			}
		]
	}
}
```

除了顶层的`injectionSelector`，语法本身就应该是标准的TextMate语法。`injectionSelector`是一个作用域选择器，它指明了*语法注入*生效的作用域。在我们的例子里，我们想要在所有`//`注释中的`TODO`高亮。使用[作用域检查器](#作用域检查器)，我们会发现JavaScript的双斜杠存在作用域`comment.line.double-slash`，所以我们的注入选择器是`L:comment.line.double-slash`：

```json
{
	"scopeName": "todo-comment.injection",
	"injectionSelector": "L:comment.line.double-slash",
	"patterns": [
		{
			"include": "#todo-keyword"
		}
	],
	"repository": {
		"todo-keyword": {
			"match": "TODO",
			"name": "keyword.todo"
		}
	}
}
```

注入选择器中的`L:`代表注入的语法添加在现有语法规则的左边。也就是说我们注入的语法规则会在任何现有语法规则之前生效。

#### 嵌入语法

*语法注入*也可以用在嵌入语言中，在他们的父级语法中进行配置。就和普通的语法意义，*语法注入*也可以使用`embeddedLanguages`将嵌入语言的作用域映射到顶层的语言作用域上。

比如高亮JS字符串中的sql查询的插件，可以使用`embeddedLanguages`为字符串中所有匹配`meta.embedded.inline.sql`的符号应用sql语言的基本功能，比如括号匹配和片段选择。

```json
{
	"contributes": {
		"grammars": [
			{
				"path": "./syntaxes/injection.json",
				"scopeName": "sql-string.injection",
				"injectTo": ["source.js"],
				"embeddedLanguages": {
					"meta.embedded.inline.sql": "source.sql"
				}
			}
		]
	}
}
```

#### 符号类型和嵌入语言

对于嵌入语言中的注入语言还会有个副作用，那就是VS Code把所有字符串（string）中的*符号*视为字符文本，而且把注释中的所有*符号*视为符号内容（token content）。
因此诸如括号匹配和自动补全在字符串和注释中是无法使用的，如果*嵌入语言*刚好出现在字符串或注释中，那么这些功能就无法在*嵌入语言*中使用。

想要重载这个行为，你需要使用`meta.embedded.*`作用域重置VS Code标记字符串和注释行为。最佳实践就是始终将嵌入语言放在`meta.embedded.*`作用域中，确保VS Code能够正确处理嵌入语言。

如果你无法为你的语法添加`meta.embedded.*`作用域，你可以在语法配置中用`tokenTypes`，指定*作用域*到内容模式（content mode）上。
下面的`tokenTypes`确保`my.sql.template.string`作用域中的任何内容都应视为代码：

```json
{
	"contributes": {
		"grammars": [
			{
				"path": "./syntaxes/injection.json",
				"scopeName": "sql-string.injection",
				"injectTo": ["source.js"],
				"embeddedLanguages": {
					"my.sql.template.string": "source.sql"
				},
				"tokenTypes": {
					"my.sql.template.string": "other"
				}
			}
		]
	}
}
```