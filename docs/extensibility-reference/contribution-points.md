# 发布内容配置点

本篇会介绍`pacakge.json`[插件清单]()中各种不同的发布内容配置点。

* [`configuration`](/docs/extensionAPI/contribution-points.md#contributesconfiguration)
* [`commands`](/docs/extensionAPI/contribution-points.md#contributescommands)
* [`menus`](/docs/extensionAPI/contribution-points.md#contributesmenus)
* [`keybindings`](/docs/extensionAPI/contribution-points.md#contributeskeybindings)
* [`languages`](/docs/extensionAPI/contribution-points.md#contributeslanguages)
* [`debuggers`](/docs/extensionAPI/contribution-points.md#contributesdebuggers)
* [`breakpoints`](/docs/extensionAPI/contribution-points.md#contributesbreakpoints)
* [`grammars`](/docs/extensionAPI/contribution-points.md#contributesgrammars)
* [`themes`](/docs/extensionAPI/contribution-points.md#contributesthemes)
* [`snippets`](/docs/extensionAPI/contribution-points.md#contributessnippets)
* [`jsonValidation`](/docs/extensionAPI/contribution-points.md#contributesjsonvalidation)
* [`views`](/docs/extensionAPI/contribution-points.md#contributesviews)
* [`problemMatchers`](/docs/extensionAPI/contribution-points.md#contributesproblemmatchers)
* [`problemPatterns`](/docs/extensionAPI/contribution-points.md#contributesproblempatterns)

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
* [SCM 标题菜单](/docs/extensionAPI/api-scm.md#menus) - `scm/title`
* [SCM 资源组](/docs/extensionAPI/api-scm.md#menus) - `scm/resourceGroup/context`
* [SCM 资源](/docs/extensionAPI/api-scm.md#menus) - `scm/resource/context`
* [SCM 改变标题](/docs/extensionAPI/api-scm.md#menus) - `scm/change/title`
* [视图的标题菜单](/docs/extensionAPI/extension-points.md#contributesviews) - `view/title`
* The [视图项的菜单](/docs/extensionAPI/extension-points.md#contributesviews) - `view/item/context`



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

```json

```
![]()
