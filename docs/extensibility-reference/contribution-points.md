# 发布内容配置点

本篇会介绍`pacakge.json`[插件清单]()中各种不同的发布内容配置点。

* [`configuration`](extensibility-reference/contribution-points.md#contributesconfiguration)
* [`commands`](extensibility-reference/contribution-points.md#contributescommands)
* [`menus`](extensibility-reference/contribution-points.md#contributesmenus)
* [`keybindings`](extensibility-reference/contribution-points.md#contributeskeybindings)
* [`languages`](extensibility-reference/contribution-points.md#contributeslanguages)
* [`debuggers`](extensibility-reference/contribution-points.md#contributesdebuggers)
* [`breakpoints`](extensibility-reference/contribution-points.md#contributesbreakpoints)
* [`grammars`](extensibility-reference/contribution-points.md#contributesgrammars)
* [`themes`](extensibility-reference/contribution-points.md#contributesthemes)
* [`snippets`](extensibility-reference/contribution-points.md#contributessnippets)
* [`jsonValidation`](extensibility-reference/contribution-points.md#contributesjsonvalidation)
* [`views`](extensibility-reference/contribution-points.md#contributesviews)
* [`problemMatchers`](extensibility-reference/contribution-points.md#contributesproblemmatchers)
* [`problemPatterns`](extensibility-reference/contribution-points.md#contributesproblempatterns)
* [`taskDefinitions`](extensibility-reference/contribution-points.md#contributestaskDefinitions)
* [`colors`](extensibility-reference/contribution-points.md#contributescolors)


## contributes.configuration
---
在configuration中配置的内容会暴露给用户，用户可以从“用户设置”和“工作区设置”中修改你暴露的选项。

configuration是JSON格式的键值对，VS Code为用户提供了良好的设置支持。

你可以用`vscode.workspace.getConfiguration('myExtension')`读取配置值。

#### 示例

```json
"contributes": {
    "configuration": {
        "type": "object",
        "title": "TypeScript configuration",
        "properties": {
            "typescript.useCodeSnippetsOnMethodSuggest": {
                "type": "boolean",
                "default": false,
                "description": "Complete functions with their parameter signature."
            },
            "typescript.tsdk": {
                "type": ["string", "null"],
                "default": null,
                "description": "Specifies the folder path containing the tsserver and lib*.d.ts files to use."
            }
        }
    }
}
```

![configuration](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/configuration.png)

## contributes.configurationDefaults
---
为特定的语言配置编辑器的默认值，修改这个配置会覆盖编辑器已经为语言提供的默认配置。

下面的示例是修改`markdown`语言的默认配置。

#### 示例

```json
"contributes": {
    "configurationDefaults": {
        "[markdown]": {
            "editor.wordWrap": "on",
            "editor.quickSuggestions": false
        }
    }
}
```

## contributes.commands
---
设置命令标题和命令体，随后这个命令会显示在**命令面板**中。你也可以加上`category`前缀，在**命令面板**中会以分类显示。

?>**注意：**当调用命令时（通过组合键或者在**命令面板**中调用），VS Code会触发激活事件`onCommand:${command}`。

下面的示例是修改`markdown`语言的默认配置。

#### 示例

```json
"contributes": {
    "commands": [{
        "command": "extension.sayHello",
        "title": "Hello World",
        "category": "Hello"
    }]
}
```
![commands](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/commands.png)

## contributes.menus
---

为编辑器或者文件管理器设置命令的*菜单项*。菜单项至少包含1️⃣选中时调用的命令和2️⃣何时显示这个菜单项的时机。显示菜单的时机由`when`键定义，而对应的值语法需要参考键值绑定的[when语法](https://github.com/Microsoft/vscode-docs/blob/master/docs/getstarted/keybindings.md#when-clause-contexts)。

`command`键则是必须的。可选的命令使用`alt`定义，当你按下ALT键时，菜单中会显示对应的菜单项。

最后，`group`属性定义了菜单的分组。`navigation`值不同于普通的`group`值，一旦设置这个值就会总是显示在菜单的最顶端。

当前插件创作者可以配置的菜单的地方有：

* 全局命令面板 - `commandPalette`
* 资源管理器上下文菜单 - `explorer/context`
* 编辑器上下文菜单 - `editor/context`
* 编辑器标题栏 - `editor/title`
* 编辑器标题上下文菜单 - `editor/title/context`
* 调试栈视图的上下文菜单 - `debug/callstack/context`
* [SCM 标题菜单](extensibility-reference/api-scm.md#菜单) - `scm/title`
* [SCM 资源组](extensibility-reference/api-scm.md#菜单) - `scm/resourceGroup/context`
* [SCM 资源](extensibility-reference/api-scm.md#菜单) - `scm/resource/context`
* [SCM 改变标题](extensibility-reference/api-scm.md#菜单) - `scm/change/title`
* [视图的标题菜单](#contributesviews) - `view/title`
* [视图项的菜单](#contributesviews) - `view/item/context`



?>**注意：**当菜单中的命令被调用，VS Code会将当前选中资源作为参数传给调用的命令。比方说，资源管理器的菜单被触发，选中资源的URI会作为参数，编辑器中的菜单项被触发，则将当前文件的URI作为参数传入。

关于*标题*还有一点要说，命令还可以定义图标，VS Code会显示在编辑器的标题菜单栏中。

#### 示例

```json
"contributes": {
    "menus": {
        "editor/title": [{
            "when": "resourceLangId == markdown",
            "command": "markdown.showPreview",
            "alt": "markdown.showPreviewToSide",
            "group": "navigation"
        }]
    }
}
```
![menus](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/menus.png)

#### 让菜单项只显示在命令面板中

注册的命令默认显示在**命令面板**中。要想控制命令的可见性，我们提供了一个`commandPalette`菜单配置，在这个配置中，你可以定义一个`when`控制是否在**命令菜单**中显示。

下面的片段只在编辑器中选中了什么东西的时候才会在**命令面板**中显示出‘Hello World’：

```json
"commands": [{
    "command": "extension.sayHello",
    "title": "Hello World"
}],
"menus": {
    "commandPalette": [{
        "command": "extension.sayHello",
        "when": "editorHasSelection"
    }]
}
```

#### 分组排序

菜单项可以通过组来分类。根据下列默认规则，然后按照字母排序，

**编辑器上下文菜单**默认有这些分组：

- `navigation` - `navigation`组始终在最上方。
- `1_modification` - 紧接上一个组，这个组包含可以修改你代码的命令。
- `9_cutcopypaste` - 然后是基础编辑命令。
- `z_commands` - 最后一个分组则是命令面板入口。

![groupSorting](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/groupSorting.png)

**资源管理器上下文菜单**默认有下列分组：

* `navigation` -  在VS Code中导航的相关命令。`navigation`组始终在最上方。
* `2_workspace` - 和工作区操作相关的命令。
* `3_compare` - 比较文件和diff相关的命令。
* `4_search` - 在搜索视图中和搜索相关的命令。
* `5_cutcopypaste` - 和剪切、复制、粘贴文件相关的命令。
* `7_modification` - 修改文件的相关命令。

**编辑器标签菜单**默认有下列分组

* 1_close - 和关闭编辑器相关的命令。
* 3_preview - 和固定编辑器相关的命令。

**编辑器标题菜单**默认有下列分组

* 1_diff - diff编辑器相关的命令。
* 3_open - 打开编辑器的相关命令。
* 5_close - 和关闭编辑器相关的命令。

#### 组内排序

组内的菜单顺序取决于标题或者*序号属性*。菜单的组内顺序由`@<number>`加到`group`值的后面得以确定：

```json
"editor/title": [{
    "when": "editorHasSelection",
    "command": "extension.Command",
    "group": "myGroup@1"
}]
```

## contributes.keybindings
---

这个配置确定了用户输入按键组合时的触发规则。在[快捷键绑定]()中，你可以了解更加细节的东西。

配置快捷键绑定会使*默认键盘快捷方式*中显示你的规则，每一处和命令相关的UI部分也会显示你添加的快捷键组合。

?>**注意**因为VS Code支持Windows，macOS和Linux平台，而

#### 示例
Windows和Linux下使用`Ctrl+F1`，macOS下使用`Cmd+F1`调用`"extension.sayHello"`命令：
```json
"contributes": {
    "keybindings": [{
        "command": "extension.sayHello",
        "key": "ctrl+f1",
        "mac": "cmd+f1",
        "when": "editorTextFocus"
    }]
}
```
![keybindings](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/keybindings.png)

## contributes.languages
---

配置一门语言，引入一门新的语言或者加强VS Code已有的语言支持。

在这部分内容中，一个语言必须要有一个标识符（identifier）关联到文件上（查看 `TextDocument.getLanguageId()`）。

VS Code提供三种文件应该关联哪种语言的方式。每种方式都可以可以“单独”加强：

1. 插件的文件名
2. 文件名
3. 文件内的首行

用户打开文件后，三种规则都会使用，然后确定语言。接着VS Code就会触发激活事件`onLanguage:${language}`（比如：下面的`onLanguage:python`例子）

`aliases`属性包含着这门语言的可读性名称。这个列表的第一项会作为语言标签（在VS Code右下角状态栏显示）。

`configuration`属性确定了语言配置文件的路径。路径是指相对插件文件夹的路径，通常是`./language-configuration.json`，这个文件是JSON格式的，包含着下列可配置属性：

* `comments` - 定义了注释的符号
  * `blockComment` - 用于标识块注释的起始和结束token。被'Toggle Block Comment'使用
  * `lineComment` - 用于标识行注释的起始token。被'Add Line Comment'使用
* `brackets` - 定义括号，同时也会影响括号内的代码缩进。进入新的一行时，被编辑器用来确定或是更正新的缩进距离
* `autoClosingPairs` - 为*自动闭合功能*定义某个符号的开闭符（open and close symbols）。*开符号*输入后，编辑器会自动插入*闭符号*。使用`notIn`参数，关闭字符串或者注释中的*符号对*
* `surroundingPairs` - 定义选中文本的开闭符号
* `folding` - 定义编辑器中的代码应何时、应怎么样折叠
  * `offSide` - 和一下个缩进块之间的代码块尾部的空行（用于基于缩进的语言，如Python or F#）
  * `markers` - 使用正则自定义代码中的折叠区域标识符
* `wordPattern` - 使用正则匹配编程语言中哪些词应该是单个词

如果你的语言配置文件是`language-configuration.json`，或者以这样的字符串结尾的，VS Code就会提供校验和编辑支持。

#### 示例
```json
...
"contributes": {
    "languages": [{
        "id": "python",
        "extensions": [ ".py" ],
        "aliases": [ "Python", "py" ],
        "filenames": [ ... ],
        "firstLine": "^#!/.*\\bpython[0-9.-]*\\b",
        "configuration": "./language-configuration.json"
    }]
}
```

language-configuration.json
```json
{
    "comments": {
        "lineComment": "//",
        "blockComment": [ "/*", "*/" ]
    },
    "brackets": [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    "autoClosingPairs": [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
        { "open": "'", "close": "'", "notIn": ["string", "comment"] },
        { "open": "/**", "close": " */", "notIn": ["string"] }
    ],
    "surroundingPairs": [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
        ["<", ">"],
        ["'", "'"]
    ],
    "folding": {
        "offSide": true,
        "markers": {
            "start": "^\\s*//#region",
            "end": "^\\s*//#endregion"
        }
    },
    "wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)"
}
```

## contributes.debuggers
---

配置VS Code的调试器，调试器配置有下列属性：

* `type` 用于加载配置的调试器唯一标识——ID。
* `label` 会在UI中显示的调试器名称。
* `program` 调试适配的路径，调试适配通过VS Code debug protocol连接到真正的调试器或者运行时。
* `runtime` 如果调试适配器的路径不是可执行程序，那么就会用到这个运行时。
* `configurationAttributes` 调试器的启动配置参数。
* `initialConfigurations` 列出了初始化launch.json需要的加载配置。
* `configurationSnippets` 列出了编辑launch.json文件时可以提供的加载配置智能提示。
* `variables` 引入替代变量，并绑定到调试器插件实现的命令上。
* `languages` 调试插件会使用“默认调试器”的语言
* `adapterExecutableCommand` 调试适配器执行路径和参数动态计算的命令。命令返回的格式如下：
  ```json
  command: "<executable>",
  args: [ "<argument1>", "<argument2>", ... ]
  ```
  `command`属性必须是一个可执行程序的**绝对路径**，或者是通过PATH环境变量可以查找到可执行程序的名称。使用特殊值`node`，则会映射到VS Code内建的node运行时，而不会在PATH中查找。

#### 示例
```json
"contributes": {
    "debuggers": [{
        "type": "node",
        "label": "Node Debug",

        "program": "./out/node/nodeDebug.js",
        "runtime": "node",

        "languages": ["javascript", "typescript", "javascriptreact", "typescriptreact"],

        "configurationAttributes": {
            "launch": {
                "required": [ "program" ],
                "properties": {
                    "program": {
                        "type": "string",
                        "description": "The program to debug."
                    }
                }
            }
        },

        "initialConfigurations": [{
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/app.js"
        }],

        "configurationSnippets": [
            {
                "label": "Node.js: Attach Configuration",
                "description": "A new configuration for attaching to a running node program.",
                "body": {
                    "type": "node",
                    "request": "attach",
                    "name": "${2:Attach to Port}",
                    "port": 9229
                }
            }
        ],

        "variables": {
            "PickProcess": "extension.node-debug.pickNodeProcess"
        }
    }]
}
```
想要完整地学习`debugger`，移步至[调试器](/extension-authoring/example-debug-adapter.md)

## contributes.breakpoints
---

通常调试器插件会有`contributes.breakpoints`入口，插件可以在这里面设置哪些语言可以设置断点。

```json
"contributes": {
    "breakpoints": [
        {
            "language": "javascript"
        },
        {
            "language": "javascriptreact"
        }
    ]
}
```

## contributes.grammars
---
为一门语言配置TextMate语法。你必须提供应用语法的`language`，TextMate的`scopeName`确定了语法和文件路径。

!>**注意：**包含语法的文件必须是JSON（以.json结尾的文件）或者XML的plist格式文件。

#### 示例

```json
"contributes": {
    "grammars": [{
        "language": "markdown",
        "scopeName": "text.html.markdown",
        "path": "./syntaxes/markdown.tmLanguage.json",
        "embeddedLanguages": {
            "meta.embedded.block.frontmatter": "yaml",
            ...
        }
    }]
}
```

查看[添加语言着色器]()学习使用[yo code插件生成器](/extension-authoring/extension-generator.md)将TextMate.tmLanguage文件快速打包成VS Code插件。

![grammars](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/grammars.png)

## contributes.themes
---
为VS Code添加TextMate主题。你必须添加一个label，指定这个主题是dark还是light的（以便VS Code根据你的主题调整界面），当然还需要加上目标文件路径（XML plist 格式）。

!>**注意：**包含语法的文件必须是JSON（以.json结尾的文件）或者XML的plist格式文件。

#### 示例

```json
"contributes": {
    "themes": [{
        "label": "Monokai",
        "uiTheme": "vs-dark",
        "path": "./themes/Monokai.tmTheme"
    }]
}
```
![themes](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/themes.png)

查看[改变色彩主题](docs/extension-authoring/themes-snippets-colorizers.md)学习使用[yo code插件生成器](/extension-authoring/extension-generator.md)将TextMate.tmTheme文件快速打包成VS Code插件。

## contributes.snippets
---
为语言添加代码片段。`language`属性必须是[语言标识符](https://code.visualstudio.com/docs/languages/identifiers)而`path`则必须是使用[VS Code代码片段格式](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax)的代码片段文件的相对路径。

#### 示例
下面是一个Go语言的代码片段：
```json
"contributes": {
    "snippets": [{
        "language": "go",
        "path": "./snippets/go.json"
    }]
}
```
## contributes.jsonValidation
---
为`json`文件添加校验器。`url`值可以是本地路径也可以是插件中的模式文件（schema file），或者是远程服务器的URL比如：[json schema](http://schemastore.org/json)

#### 示例
```json
"contributes": {
    "jsonValidation": [{
        "fileMatch": ".jshintrc",
        "url": "http://json.schemastore.org/jshintrc"
    }]
}
```

## contributes.views
---
为VS Code 添加视图。你需要为视图指定唯一标识和名称。可以配置的属性如下：

* `explorer`: 活动栏中的资源管理视图容器。
* `scm`: 活动栏中的源代码管理(SCM) 视图容器。
* `debug`: 活动栏中的调试视图容器。
* `test`: 活动栏中的测试视图容器。
* [Custom view containers](#contributesviewscontainers) 由插件提供的自定义视图容器。

当用户打开视图，VS Code会触发`onView:${viewId}`激活事件（比如：下面示例中的`onView:nodeDependencies`）。你也可以用`when`控制视图的可见性。

#### 示例
```json
"contributes": {
    "views": {
        "explorer": [
            {
                "id": "nodeDependencies",
                "name": "Node Dependencies",
                "when": "workspaceHasPackageJSON"
            }
        ]
    }
}
```

![views](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/views.png)

插件创作者应该通过`createTreeView`API提供的[data provider](https://code.visualstudio.com/docs/extensionAPI/vscode-api#TreeDataProvider)创建一个[TreeView](https://code.visualstudio.com/docs/extensionAPI/vscode-api#TreeView)或者直接使用`registerTreeDataProvider`注册一个[data provider](https://code.visualstudio.com/docs/extensionAPI/vscode-api#TreeDataProvider)。更多示例参考[这里](https://github.com/Microsoft/vscode-extension-samples/tree/master/tree-view-sample)

## contributes.viewsContainers
---
配置[自定义视图]()的视图容器。你需要为视图指定唯一标识和标题和图标。目前你只可以配置活动栏（activitybar），下面的示例展示了活动栏中的`Package Explorer`视图容器应该如何配置。

#### 示例
```json
"contributes": {
    "viewsContainers": {
        "activitybar": [
            {
                "id": "package-explorer",
                "title": "Package Explorer",
                "icon": "resources/package-explorer.svg"
            }
        ]
    },
    "views": {
        "package-explorer": [
            {
                "id": "package-dependencies",
                "name": "Dependencies"
            },
            {
                "id": "package-outline",
                "name": "Outline"
            }
        ]
    }
}
```

![custom-views-container](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/extension-points/custom-views-container.png)

**图标规格**

* `Size:` 28x28的图标居中于50x40的视图块上。
* `Color:` 图标应使用黑白单色。
* `Format:` 虽然图片格式的图标都是可以的，但建议使用SVG图标。
* `States:` 所有图标状态继承下列样式：

|State|Opacity|
|---|---|
|Default|60%|
|Hover|100%|
|Active|100%|

## contributes.problemMatchers
---
配置问题定位器的模式。这些配置在输出面板和终端中都会有所体现，下面是一个配置了插件中的gcc编译器的问题定位器示例：

#### 示例
```json
"contributes": {
    "problemMatchers": [
        {
            "name": "gcc",
            "owner": "cpp",
            "fileLocation": ["relative", "${workspaceFolder}"],
            "pattern": {
                "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error):\\s+(.*)$",
                "file": 1,
                "line": 2,
                "column": 3,
                "severity": 4,
                "message": 5
            }
        }
    ]
}
```
这个问题定位器现在可以通过名称引用`$gcc`在`task.json`中使用了，示例如下：

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "command": "gcc",
            "args": ["-Wall", "helloWorld.c", "-o", "helloWorld"],
            "problemMatcher": "$gcc"
        }
    ]
}
```

更多内容请查看：[实现一个问题定位器](https://code.visualstudio.com/docs/editor/tasks#_defining-a-problem-matcher)

## contributes.problemPatterns
---
配置可以在问题定位器（见上）中可以使用的问题模式的名称。

## contributes.taskDefinitions
---
配置和定义一个object结构，定义系统中唯一的*配置任务*。任务定义最少需要一个`type`属性，不过通常需要更多的属性配置。
在package.json文件中，*一个展示脚本的任务*看起来是这样的：
```json
"taskDefinitions": [
    {
        "type": "npm",
        "required": [
            "script"
        ],
        "properties": {
            "script": {
                "type": "string",
                "description": "The script to execute"
            },
            "path": {
                "type": "string",
                "description": "The path to the package.json file. If omitted the package.json in the root of the workspace folder is used."
            }
        }
    }
]
```

任务定义是JSON格式的，且包含`required`和`properties`两个属性。
`type`属性定义了任务类型，如果上述例子变成：
- `"type": "npm"`要求任务与npm任务相关联
- `"required": [ "script" ]`其中`script`属性不可或缺。`path`属性变成可选。
- `"properties": {...}`：定义了其他属性和他们的类型

当插件真的创建了一个任务，它需要传入一个与package.json中任务配置对应的`TaskDefinition`。对于`npm`任务来说，pacakge.json中的脚本应该是这样的：
```javascript
let task = new vscode.Task({ type: 'npm', script: 'test' }, ....);
```

## contributes.colors
---
这些色彩可用于状态栏的编辑器装饰器。定义之后，用户可以在`workspace.colorCustomization`设置中自定义颜色，用户的主题会覆盖这些色值。

```json
"contributes": {
  "colors": [{
      "id": "superstatus.error",
      "description": "Color for error message in the status bar.",
      "defaults": {
          "dark": "errorForeground",
          "light": "errorForeground",
          "highContrast": "#010203"
      }
  }]
}
```

## contributes.typescriptServerPlugins
---
配置VS Code的Javascript和Typescript支持的[Typescript 服务器插件](https://github.com/Microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)：

```json
"contributes": {
   "typescriptServerPlugins": [
      {
        "name": "typescript-styled-plugin"
      }
    ]
}
```

上述例子配置了[`typescript-styled-plugin`](https://github.com/Microsoft/typescript-styled-plugin)，这个插件为Javascript和Typescript添加了风格化的组件智能提示。这个插件会从扩展插件中加载，而且必须在`dependency`中列明：

```json
{
    "dependencies": {
        "typescript-styled-plugin": "*"
    }
}
```

Typescript 服务器插件可以被所有Javascript和Typescript文件加载，只有当用户的工作区使用Typescript时才会激活。

## 下一步

学习更多VS Code的扩展性模型，试着查看下面的主题吧：

- [插件配置清单](/extensibility-reference/extension-manifest.md) - VS Code的package.json插件配置清单参考
- [激活事件](/extensibility-reference/activation-events.md) - VS Code的激活事件参考


