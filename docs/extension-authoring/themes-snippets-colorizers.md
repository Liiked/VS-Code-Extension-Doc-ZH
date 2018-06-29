# 主题，代码片段和着色器

vscode提供了大量已有的TextMate自定义文件，你可以在插件里直接使用`.tmTheme`, `.tmSnippets`，和`.tmLanguage`文件。这个章节将教你怎么使用TextMate文件，创建和分享你自己的主题、代码片段和着色器。

## 添加新的色彩主题

色彩可视化工作在vscode可以分成两种类型：
- 在视图和编辑器中使用的工作台（Workbench）色彩，包括活动栏和状态栏。整个色彩列表[查看这里](https://code.visualstudio.com/docs/getstarted/theme-color-reference)。
- 编辑器中使用的语法高亮。

#### 工作台色彩

创建工作台色彩最简单的方式就是使用已有的主题，然后开始定制。

- 在vscode中切换到你想要编辑的色彩主题。
- 打开设置，用`workbench.colorCustomizations`修改视图和编辑器色彩。一般来说会即时生效，如果没有生效的话，需要你自己重启vscode。
- [完整的配置项列表](https://code.visualstudio.com/docs/getstarted/theme-color-reference)

#### 语法高亮色彩

新建语法高亮色彩有两种方式，
1. 直接使用社区已有的TextMate主题（`.tmTheme`文件）
2. 自己想一个主题规则出来

简单选项：切换到色彩主题，用设置中的`editor.tokenColorCustomizations`进行自定义。

困难选项：见下。

#### TextMate 主题规则

想要写出符合TextMate的规则，你需要知道TextMate语法和作用域。
`TextMate语法`由一系列构成源代码语法树的的常规表达式组成。每一个树节点产生一个包含的范围，也被称之为`作用域`。每个作用域会有一个名字代表代码范围（如函数，代码块，注释）和还有符号（如关键字，数字，操作符）。

这里是一个Javascript作用域层级的例子：

```javascript
function f1() {
```

![作用域](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/themes-snippets-colorizers/TM-scopes.png)

由区块点号构成了作用域的名字。最后一个区块归属于语言的`符号`类型：`entity.name.function.js`。

TextMate语法通常产生的作用域名称可以[参考这里](https://www.sublimetext.com/docs/3/scope_naming.html)。

每一个规则包含了一个或多个作用域和一组样式：颜色（前景色和背景色），字体样式（粗体，斜体，下划线）。

如果设置了`符号（Symbols）`的偏移距离，那么这个作用域的偏移距离会自动计算。然后规则会从上到下逐次开始处理，`作用域选择器（scope selector）`通过设定好的作用域进行匹配，最为明确的作用域规则会首先采用。

下面是一个例子：`scope`属性列出了所有的作用域选择器，`setting`属性描述了规则匹配后使用的样式，`name`属性的作用是描述和注释，不参与规则的实际执行。

- TextMate 可以将一组样式设置给一组或多组作用域。样式包含前景色，背景色，粗体，下划线等。一个主题通常有多组规则。为了计算符号的样式，规则会从第一个执行到最后一个，每一个作用域选择器会从符号作用域中匹配到父作用域。最为匹配的规则被使用后，会加上对应的样式。

- 作用域选择器支持前缀匹配和父作用域匹配。

```json
{
    "name": "Variables",
    "scope": "variable",
    "settings": {
        "foreground": "#dc3958",
        "fontStyle": "bold underline"
    }
},
{
    "name": "Functions",
    "scope": [
        "entity.name.function",
        "meta.selector.css entity.name.tag",
        "entity.name.method - source.java"
    ],
    "settings": {
        "foreground": "#8ab1b0"
    }
}
```
- `variable`会匹配所有由`variable`开头的作用域：`variable.js, variable.parameter.java`……
- `meta.selector.css entity.name.tag` 会匹配由`entity.name.tag`开头且父作用域符合`meta.selector.css`的作用域
- `entity.name.method - source.java`会匹配由`entity.name.method`开头但是父作用域不在`source.java`中的作用域
- 学习[更多](https://manual.macromates.com/en/scope_selectors)关于作用域选择器的内容

你可以在**命令面板**（shift + ctrl/cmd + p）中输入**Developer: Inspect TM Scopes**，那么你的鼠标指针位置位置会显示对应符号的作用域匹配项和使用了什么主题规则。

![检查作用域](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/themes-snippets-colorizers/inspect-scopes.png)

## 创建新的色彩主题

- 打开**命令面板**输入**Developer: Generate Color Theme from Current Settings**
- 使用vscode的 [Yeoman](http://yeoman.io/) 插件生成器， [yo code](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/yocode.md)生成新的主题
``` npm install -g yo generator-code
yo code
```
- 如果你像下图这样选择了自定义主题，则选择'start fresh'

![生成新主题](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/themes-snippets-colorizers/yocode-colortheme.png)

- 把从设置中生成的主题文件复制到新的插件中
- 如果你想使用已有的TextMate主题，那你就需要在插件生成的时候选择导入TextMate主题并打包。另外，如果你下载了一个主题，那么只要用`.tmTheme`链接替换`tokenColors`部分就可以了。

```json
{
    "type": "dark",
    "colors": {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorIndentGuide.background": "#404040",
        "editorRuler.foreground": "#333333",
        "activityBarBadge.background": "#007acc",
        "sideBarTitle.foreground": "#bbbbbb"
    },
    "tokenColors": "./Diner.tmTheme"
}
```
## 测试新的主题

想要测试新主题，把生成的主题文件夹复制到[你的`.vscode/extension`文件夹](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/yocode.md#your-extensions-folder)下，然后重启vscode。

通过**文件>首选项>颜色主题**然后在下拉菜单里找到你的主题。修改了主题之后，最好重启一下vscode，或者重载窗口。

![选择我的主题](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/themes-snippets-colorizers/mytheme.png)


## 将主题发布到插件市场

如果你想把主题分享给社区，通过[插件市场](https://github.com/Microsoft/vscode-docs/blob/master/docs/editor/extension-gallery.md)去发布它吧。用[vsce publishing tool](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md)打包你的主题然后发布到vscode市场。

要想让你的插件在插件市场上看起来更好一点，我们建议你参考一下[插件市场展示小贴士](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-manifest.md#marketplace-presentation-tips)。

?> 小贴士：想要用户轻松地找到你的主题，最好修改一下`package.json`，把关键字"theme"写到插件描述（extension description）中，然后把`Category`设置为`Theme`

## 添加新的图标主题

你能使用图标文件（最好是SVG）和字体图标创建自己的图标主题。作为示例，你可以参考一下2个内置主题：[Minimal](https://github.com/Microsoft/vscode/tree/master/extensions/theme-defaults)，[Seti](https://github.com/Microsoft/vscode/tree/master/extensions/theme-seti)

首先，创建一个vscode插件，然后把`iconTheme`配置点(contribution point)添加进去

```json
"contributes": {
    "iconThemes": [
        {
            "id": "turtles",
            "label": "Turtles",
            "path": "./fileicons/turtles-icon-theme.json"
        }
    ]
}
```

- `id`作为这个图标主题的标识，目前只做内部使用，未来可能会用在设置里面，所以最好设置一个可读性强的唯一值。
- `label`会显示在主题选择下拉框中。
- `path`指示了图标系列文件所在的位置。如果你的图标系列名称遵循`*icon-theme.json`命名规范，那么vscode就能提供完整的支持。

#### 图标系列文件(Icon set file)
图标系列文件是一个JSON文件，包含了所有的**关联图标**和图标定义。

一个**关联图标**将**图标定义**映射到一个文件上（类型如：文件，文件夹，json文件...）。**图标定义**指示了图标的所在位置：可以是一个图片文件，或者glyph字体。

#### 图标定义

`iconDefinitions`部分包含了所有定义。每个定义有一个id，用于指向定义。一个定义能供多个文件关联引用。

```json
"iconDefinitions": {
    "_folder_dark": {
        "iconPath": "./images/Folder_16x_inverse.svg"
    }
}
```

这里，**图标定义**包含了一个定义标识符`_folder_dark`。除此之外还支持以下属性：

- iconPath：当使用svg/png文件时：指向图片的路径。
- fontCharacter：当使用glyph字体时：字体中使用的字符。
- fontColor：当使用glyph字体时：设置glyph的颜色。
- fontSize：当使用字体时：设置字体大小。默认情况下会使用字体本身定义的字体大小。这个值应为父级字号的相对值(如 150%)。
- fontId：当使用字体时: 字体的ID。如果没有指定，则会采用`font specification`部分的第一个字体。

#### 关联文件

图标能关联到文件夹，文件夹名称，文件，文件名称，文件插件，和[语言Id](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-points.md#contributeslanguages)。

这些关联都能被提炼为诸如'light'和'highContrast'色彩主题。

每个文件关联指向一个**图标定义**

```json
"file": "_file_dark",
"folder": "_folder_dark",
"folderExpanded": "_folder_open_dark",
"folderNames": {
    ".vscode": "_vscode_folder",
},
"fileExtensions": {
    "ini": "_ini_file",
},
"fileNames": {
    "win.ini": "_win_ini_file",
},
"languageIds": {
    "ini": "_ini_file"
},
"light": {
    "folderExpanded": "_folder_open_light",
    "folder": "_folder_light",
    "file": "_file_light",
    "fileExtensions": {
        "ini": "_ini_file_light",
    }
},
"highContrast": {
}
```

- `file`是一个默认文件图标，为那些没有匹配到任何插件、文件名、语言类型的文件使用的。目前所有文件图标属性都会被继承。
- `folder`收起的文件夹图标，如果`folderExpanded`没有设置，那么展开的文件夹也会使用这个图标。使用`folderNames`关联特殊名称的文件夹。文件夹图标是可选的，如果不设置，那文件夹就不会显示任何图标。
- `folderExpanded`展开的文件夹图标。这个图标是可选的，如果不设置就会使用`folder`定义好的图标。
- `folderNames`特殊名称文件夹图标。这个键是用于文件夹名称的，不支持包含路径的名称，不支持匹配模式和通配符。大小写不敏感。
- `folderNamesExpanded`展开的特殊名称文件夹图标。
- `languageIds`语言类型图标。这个键将匹配在*语言配置点（contribution point）*配置的[语言id](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-points.md#contributeslanguages)。Note that the 'first line match' of the language contribution is not considered.
- `fileExtensions`文件插件图标。根据文件插件的名称匹配。插件名称是文件名点号后面（不包含点号）。拥有多重点号的文件名称，如`lib.d.ts`会匹配多个模式——`d.ts`和`ts`。大小写敏感。
- `fileNames`文件图标。这个键需要文件的全称进行匹配，不支持包含路径的名称，不支持模式和通配符。大小写敏感。`fileNames`是最高优先匹配。

匹配优先级：`fileNames` > `fileExtensions` > `languageIds`

`light`和`highContrast`部分的属性表和上面相同，只是会在对应的主题下覆盖原有图标配置。

#### 字体定义

在'font'部分添加任意你喜欢的字形和字体。定义好之后，你就可以在图标定义中使用它们了。如果没有指定字体id，那么默认使用第一个定义的字体。

将字体文件移动到你的插件中，设置好对应的路径。推荐使用[WOFF](https://developer.mozilla.org/zh-CN/docs/WOFF)字体。

- 设置格式为'woff'
- 字重键值对在[这里]()定义
- 样式键值对在[这里]()定义
- 使用图标引用该字体时的字号。因此字体字号总是以百分比表示。

```json
"fonts": [
    {
        "id": "turtles-font",
        "src": [
            {
                "path": "./turtles.woff",
                "format": "woff"
            }
        ],
        "weight": "normal",
        "style": "normal",
        "size": "150%"
    }
],
"iconDefinitions": {
    "_file": {
        "fontCharacter": "\\E002",
        "fontColor": "#5f8b3b",
        "fontId": "turtles-font"
    }
}
```

#### 图标主题中的文件夹图标

文件图标主题会告诉文件浏览器不要显示默认文件夹图标（倒三角或者横杠），这个模式可在配置中加入`"hidesExplorerArrows":true`覆盖默认vscode的设置。

---

## 使用TextMate代码片段

使用[yo code](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/yocode.md)插件生成器添加TextMate片段（.tmSnippets）。生成器中的`New Code Snippets`选项帮你生成包含多个.tmSnippets文件的目录，最终他们会被打包成vscode代码片段插件。生成器也支持Sublime代码片段（.sublime-snippets）。

最终生成器会产出两个文件：一个插件清单`package.json`——整合vscode代码片段的元数据，和一个将源代码片段文件转换成vscode代码片段格式的`sinppets.json`。

```
.
├── snippets                    // VS Code 整合目录
│   └── snippets.json           // JSON文件-代码片段
└── package.json                // 插件清单
```

## 在市场中分享你的代码片段

现在如果你测试过了代码片段的功能，打算发布到社区的话，可以跟寻下面的步骤。

你如果是用`yo code`生成的话，那么你的代码片段插件就已经发布到市场了。

如果你想分享你的*用户代码片段（user snippets）*，你需要把你的snippet json文件连带插件清单一起打包起来。

因平台而异，你的代码片段可能在下列位置：

- **Windows** %APPDATA%\Code\User\snippets\(language).json
- **macOS** $HOME/Library/Application Support/Code/User/snippets/(language).json
- **Linux** $HOME/.config/Code/User/snippets/(language).json

其中，`(language).json`取决于代码片段的目标语言（如`markdown.json`是Markdown的代码片段）。

为你的插件创建一个新文件夹，新建一个子目录`snippets`，然后把snippet文件复制进去。现在在插件目录下添加一个插件清单`package.json`文件。代码片段插件清单遵循[插件清单参阅](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-manifest.md)规则，请在[`snippets`配置点](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-points.md#contributessnippets)配置。

下面是一个Markdown代码片段的`package.json`配置

```json
{
    "name": "DM-Markdown",
    "publisher": "mscott",
    "description": "Dunder Mifflin Markdown snippets",
    "version": "0.1.0",
    "engines": { "vscode": "0.10.x" },
    "categories": ["Snippets"],
    "contributes": {
        "snippets": [
            {
                "language": "markdown",
                "path": "./snippets/markdown.json"
            }
        ]
    }
}
```

注意`snippets`需要和`language`关联起来。可以是vscode内置的[支持语言](https://github.com/Microsoft/vscode-docs/blob/master/docs/languages/overview.md)类型，或者是由其他插件提供的语言。请确保`language`的值书写正确无误。

?> 小贴士：想要用户轻松地找到你的主题，最好修改一下`package.json`，把关键字"snippet"写到插件描述（extension description）中，然后把`Category`设置为`snippet`

要想让你的插件在插件市场上看起来更好一点，我们建议你参考一下[插件市场展示小贴士](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-manifest.md#marketplace-presentation-tips)。

## 添加新的语言（着色器）

使用[Yo code](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/yocode.md)生成器，从你vscode中已经安装的语言中挑选一个类型生成插件，为这个语言添加语法高亮和括号匹配。

**语言支持插件**的核心是一份描述着色器规则的TextMate[语言规格](https://manual.macromates.com/en/language_grammars)文件（.tmLanguage）。生成器也能从已有的TextMate语言规格文件中生成，当然你自己开个新的也成。

学习TextMate .tmLanguage 文件最好的地方是在Github上——找到你感兴趣的语言和对应的TextMate包，找到其中的`Syntatxes`文件夹就可以开始看了。

Yeoman能导入.tmLanguage或.pList文件。当插入URL或者文件地址时，请使用原始路径，比如：[https://raw.githubusercontent.com/textmate/ant.tmbundle/master/Syntaxes/Ant.tmLanguage](https://raw.githubusercontent.com/textmate/ant.tmbundle/master/Syntaxes/Ant.tmLanguage)。请确保路径指向的是文件内容，而不是显示文件内容的HTML文件。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/themes-snippets-colorizers/yocodelanguage.png)

下面是一个类XML语言的例子：

```json
{
    "comments": {
        "lineComment": "",
        "blockComment": ["<!--", "-->"]
    },
    "brackets": [
        ["<", ">"]
    ],
    "autoClosingPairs": [
        ["<", ">"],
        ["'", "'"],
        ["\"", "\""]
    ],
    "surroundingPairs": [
        ["<", ">"],
        ["'", "'"],
        ["\"", "\""]
    ]
}
```
更多细节请查看[语言配置点文档](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-points.md#contributeslanguages)

Yeoman生成的`vsc-extension-quickstart.md`文件包含了如何运行和debug插件的信息。 

想要在你稳定版的vscode中使用这个插件，将整个输出文件夹复制到[你的.vscode/extensions文件夹](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/yocode.md#your-extensions-folder)中，然后重启vscode。重启之后，在语言选择下拉框中就能查看你的新语言了。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/themes-snippets-colorizers/antlanguage.png)

## 在市场中发布语言支持

使用[vsce publishing tool](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md)工具将你的插件发布到vscode市场上。

?> 小贴士：想要用户轻松地找到你的语言支持，最好修改一下`package.json`，把关键字"language"或者"language support"写到插件描述（extension description）中，然后把`Category`设置为`Programming Languages`

## 添加你的语言支持插件(插件组合)

当你给vscode添加新语言的时候，如果能加上代码片段那就更好了。将多个[插件组合](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-manifest.md#combining-extension-contributions)起来并不是难事，修改着色器插件清单`package.json`，添加`snippets`配置和snippets.json。

```json
{
    "name": "language-latex",
    "description": "LaTeX Language Support",
    "version": "0.0.1",
    "publisher": "someone",
    "engines": {
        "vscode": "0.10.x"
    },
    "categories": [
        "Programming Languages",
        "Snippets"
    ],
    "contributes": {
        "languages": [{
            "id": "latex",
            "aliases": ["LaTeX", "latex"],
            "extensions": [".tex"]
        }],
        "grammars": [{
            "language": "latex",
            "scopeName": "text.tex.latex",
            "path": "./syntaxes/latex.tmLanguage"
        }],
        "snippets": [
            {
                "language": "latex",
                "path": "./snippets/snippets.json"
            }
        ]
    }
}
```

## 语言标识符

在vscode中，每个语言模型都有一个独一无二的语言标识符，除了用户特意查看设置，不然这个标识符很少会被用户看到，这种场景可能发生在文件插件和语言关联起来。

```json
"files.associations": {
    "*.myphp": "php"
}
```

!>注意：语言标识符是大小写敏感的（'Markdown' != 'markdown'）

每个语言都在配置点的`languages`中都定义了*id*

```json
"languages": [{
    "id": "java",
    "extensions": [ ".java", ".jav" ],
    "aliases": [ "Java", "java" ]
}]
```

语言支持则通过**语言标识符**进行添加

```json
"grammars": [{
    "language": "groovy",
    "scopeName": "source.groovy",
    "path": "./syntaxes/Groovy.tmLanguage"
}],
"snippets": [{
    "language": "groovy",
    "path": "./snippets/groovy.json"
}]
```

#### 新的标识符指引
当你定义一个新语言标识符的时候，请遵照下列指引：

- 使用小写的编程语言名称
- 在市场中查找这个语言标识符是不是已经被用过了

已经支持的语言标识符可以在[这里](https://github.com/Microsoft/vscode-docs/blob/master/docs/languages/identifiers.md)找到

## 下一步

如果你想要查看更多关于vscode的扩展能力，请查阅下列主题：

- [扩展vscode](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/overview.md) - 学习其他扩展vscode的方式
- [其他插件示例](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/samples.md) - 看看我们的示例插件项目


