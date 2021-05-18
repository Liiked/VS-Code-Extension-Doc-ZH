# when 子句上下文

VS Code 为元素是否处于可见和激活状态，设置了不同的上下文值。这些上下文可以禁用或者启用插件的某些命令和 UI 元素，比如菜单和视图。

比如，VS Code 用 when 子句启停命令快捷键，你可以在默认快捷键绑定 JSON 文件中找到（**首选项：打开默认键盘快捷键(JSON)**）：

```json
{ 
    "key": "f5",  
    "command": "workbench.action.debug.start",
    "when": "debuggersAvailable && !inDebugMode" 
}
```

上述内置**启动调试器**命令的快键键是 `F5`，它仅仅在适当的调试器可用（上下文中的 `debuggersAvailable` 为 true 时）且编辑器不在调试模式中（上下文中的 `inDebugMode` 为 false 时）才会启动。

## 条件操作符

你可以使用下列条件操作符

| 操作符 | 符号   | 例子                                                                                      |
| ------ | ------ | ----------------------------------------------------------------------------------------- |
| 相等   | `==`   | `"editorLangId == typescript"`                                                            |
| 不相等 | `!=`   | `"resourceExtname != .js"`                                                                |
| 或     | `\|\|` | `"isLinux \|\| isWindows"`                                                                |
| 且     | `&&`   | `"textInputFocus && !editorReadonly"`                                                     |
| 非     | `!`    | `!editorReadonly`                                                                         |
| 匹配   | `=~`   | `"resourceScheme =~ /^untitled$^file$/"  `                                                |
| 大于   | `> >=` | `"gitOpenRepositoryCount >= 1"`                                                           |
| 小于   | `< <=` | `"workspaceFolderCount < 2"`                                                              |
| 包含   | `in`   | `resourceFilename in supportedFolders `([详见](#_39in39-条件操作符) 下方 'in'-条件操作符) |

### 键-值 when 子句操作符

`when`子句中可以使用键值对匹配操作符。表达式 `key =~ value` 会把右侧作为正则表达式来匹配左侧。比如配置 Docker 文件的菜单项，你可以使用：

```json
"when": "resourceFilename =~ /docker/"
```

## 可用上下文变量

下面是一些`when`子句中可以使用的上下文变量，这些值最终会被解析为布尔值 true/false。

这个表并不包含所有值，你可以在键盘快键键编辑器（**首选项:打开键盘快捷键**）或者默认快捷键绑定 JSON 文件（**首选项：打开默认键盘快捷键(JSON)**）中找到所有上下文变量。

| 上下文名称                         | 何时为真                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **编辑器上下文**                   |
| `editorFocus`                      | 编辑器聚焦时，不管是聚焦到文本还是小部件                                                                                            |
| `editorTextFocus`                  | 编辑器内的文本聚焦时（光标闪动）                                                                                                    |
| `textInputFocus`                   | 任何编辑器聚焦时（常规编辑器, 调试 REPL等等).                                                                                       |
| `inputFocus`                       | 任何文本输入区域聚焦时（编辑器或文本框）                                                                                            |
| `editorHasSelection`               | 编辑器中的文本被选中时                                                                                                              |
| `editorHasMultipleSelections`      | 多文本区被选中时（多个光标）                                                                                                        |
| `editorReadonly`                   | 编辑器只读时                                                                                                                        |
| `editorLangId`                     | 当编辑器的[语言 ID](https://code.visualstudio.com/docs/languages/identifiers) 匹配时。比如: `"editorLangId == typescript"`.         |
| `isInDiffEditor`                   | 激活的编辑器处于差异编辑器状态时                                                                                                    |
| `isInEmbeddedEditor`               | 在嵌入式编辑器聚焦时                                                                                                                |
| **操作系统上下文**                 |
| `isLinux`                          | 系统是 Linux 时                                                                                                                     |
| `isMac`                            | 系统是 macOS 时                                                                                                                     |
| `isWindows`                        | 系统是 Windows  时                                                                                                                  |
| `isWeb`                            | 从 web 访问编辑器时                                                                                                                 |
| **列表上下文**                     |
| `listFocus`                        | 聚焦到列表时                                                                                                                        |
| `listSupportsMultiselect`          | 列表支持多选时                                                                                                                      |
| `listHasSelectionOrFocus`          | 列表被选中或聚焦时                                                                                                                  |
| `listDoubleSelection`              | 列表包含 2 个元素时                                                                                                                 |
| `listMultiSelection`               | 列表包含多个元素时                                                                                                                  |
| **模式上下文**                     |
| `inSnippetMode`                    | 编辑器处于代码片段模式                                                                                                              |
| `inQuickOpen`                      | 聚焦到快速选择时                                                                                                                    |
| **资源上下文**                     |
| `resourceScheme`                   | 资源的 Uri 协议匹配时。比如：`"resourceScheme == file"`                                                                             |
| `resourceFilename`                 | 资源管理器或编辑器的文件名匹配时。比如: `"resourceFilename == gulpfile.js"`                                                         |
| `resourceExtname`                  | 资源管理器或编辑器的扩展文件名匹配时。比如: `"resourceExtname == .js"`                                                              |
| `resourceDirname`                  | 资源管理器或编辑器的资源文件夹绝对路径匹配时。比如: `"resourceDirname == /users/alice/project/src"`                                 |
| `resourcePath`                     | 资源管理器或编辑器的资源绝对路径匹配时。比如: `"resourcePath == /users/alice/project/gulpfile.js"`                                  |
| `resourceLangId`                   | 资源管理器或编辑器的[语言 ID](https://code.visualstudio.com/docs/languages/identifiers)匹配时，比如: `"resourceLangId == markdown"` |
| `isFileSystemResource`             | 资源管理器或编辑器的文件是文件系统供应器可处理的文件系统类型时                                                                      |
| `resourceSet`                      | 资源管理器或编辑器文件成组时                                                                                                        |
| `resource`                         | 资源管理器或编辑器的完整 Uri                                                                                                        |
| **资源管理器上下文**               |
| `explorerViewletVisible`           | 当资源管理器视图可见时                                                                                                              |
| `explorerViewletFocus`             | 当资源管理器视图受键盘聚焦时                                                                                                        |
| `filesExplorerFocus`               | 文件资源管理器区域受键盘聚焦时                                                                                                      |
| `openEditorsFocus`                 | 打开的编辑器区域受键盘聚焦时                                                                                                        |
| `explorerResourceIsFolder`         | 资源管理器中选中了一个文件夹时                                                                                                      |
| **编辑器小部件上下文**             |
| `findWidgetVisible`                | 编辑器查找小部件可见时                                                                                                              |
| `suggestWidgetVisible`             | 建议小部件可见时（智能提示）                                                                                                        |
| `suggestWidgetMultipleSuggestions` | 展示了多个提示时                                                                                                                    |
| `renameInputVisible`               | 重命名输入框可见时                                                                                                                  |
| `referenceSearchVisible`           | 查找引用窗口可见时                                                                                                                  |
| `inReferenceSearchEditor`          | 查找引用编辑器聚焦时                                                                                                                |
| `config.editor.stablePeek`         | 引用编辑器保持打开时 (设置中的 `editor.stablePeek`)                                                                                 |
| `quickFixWidgetVisible`            | 快速修复小部件可见时                                                                                                                |
| `parameterHintsVisible`            | 参数提示可见时 (设置中的 `editor.parameterHints.enabled`).                                                                          |
| `parameterHintsMultipleSignatures` | 多参数提示可见时                                                                                                                    |
| **调试器上下文**                   |
| `debuggersAvailable`               | 有合适的调试器插件可用时                                                                                                            |
| `inDebugMode`                      | 调试器会话在运行时                                                                                                                  |
| `debugState`                       | 调试器激活状态，可用值有 `inactive`, `initializing`, `stopped`, `running`.                                                          |
| `debugType`                        | 调试器类型匹配时，比如: `"debugType == 'node'"`.                                                                                    |
| `inDebugRepl`                      | 调试控制台 REPL 聚焦时                                                                                                              |
| **终端上下文**                     |
| `terminalFocus`                    | 聚焦到终端时                                                                                                                        |
| `terminalIsOpen`                   | 终端打开时                                                                                                                          |
| **时间线视图上下文**               |
| `timelineFollowActiveEditor`       | 时间线视图跟随激活的编辑器时                                                                                                        |
| **时间线视图项 上下文**            |
| `timelineItem`                     | 时间线项目的上下文变量匹配时，比如: `"timelineItem =~ /git:file:commit\\b/"`.                                                       |
| **插件上下文**                     |
| `extension`                        | 插件 ID 匹配时，比如: `"extension == eamodio.gitlens"`.                                                                             |
| `extensionStatus`                  | 插件安装时，比如: `"extensionStatus == installed"`.                                                                                 |
| `extensionHasConfiguration`        | 插件存在配置时                                                                                                                      |
| **全局UI上下文**                   |
| `notificationFocus`                | 键盘聚焦到通知窗口                                                                                                                  |
| `notificationCenterVisible`        | 通知中心在 VS Code 右下角可见时                                                                                                     |
| `notificationToastsVisible`        | 通知窗口在 VS Code 右下角可见时                                                                                                     |
| `searchViewletVisible`             | 搜索视图打开时                                                                                                                      |
| `sideBarVisible`                   | 侧边栏展示时                                                                                                                        |
| `sideBarFocus`                     | 聚焦到侧边栏时                                                                                                                      |
| `panelFocus`                       | 聚焦到面板焦时                                                                                                                      |
| `inZenMode`                        | 窗口处于禅模式                                                                                                                      |
| `isCenteredLayout`                 | 编辑器处于中心布局模式                                                                                                              |
| `workbenchState`                   | 值为 `empty`、 `folder` (至少包含一个文件夹) 或 `workspace`.                                                                        |
| `workspaceFolderCount`             | 工作区文件夹数量                                                                                                                    |
| `replaceActive`                    | 搜索视图中的替换文本框打开时                                                                                                        |
| `view`                             | 视图 ID 匹配时，比如: `"view == myViewsExplorerID"`.                                                                                |
| `viewItem`                         | 视图项上下文匹配时，比如:  `"viewItem == someContextValue"`.                                                                        |
| `isFullscreen`                     | 窗口全屏时                                                                                                                          |
| `focusedView`                      | 当前聚焦视图的 ID                                                                                                                   |
| `canNavigateBack`                  | 导航是否可以后退                                                                                                                    |
| `canNavigateForward`               | 导航是否可以前进                                                                                                                    |
| `canNavigateToLastEditLocation`    | 是否可以导航到上一次编辑位置                                                                                                        |
| **全局编辑器 UI 上下文**           |
| `textCompareEditorVisible`         | 最少有一个差异（对比）编辑器可见时                                                                                                  |
| `textCompareEditorActive`          | 最少有一个差异（对比）编辑器激活                                                                                                    |
| `editorIsOpen`                     | 至少有一个编辑器打开时                                                                                                              |
| `groupEditorsCount`                | 一个组内的编辑器数量                                                                                                                |
| `activeEditorGroupEmpty`           | 激活的编辑器组内没有编辑器时                                                                                                        |
| `activeEditorGroupIndex`           | 编辑器群块中的编辑器组的下标位置，从数字 `1` 开始。下标 `1` 表示从左上角开始计数的首个编辑器组                                      |
| `activeEditorGroupLast`            | 编辑器群块中的最后一个编辑器组                                                                                                      |
| `multipleEditorGroups`             | 多个编辑器群出现时                                                                                                                  |
| `activeEditor`                     | 组内的某个激活的编辑器ID                                                                                                            |
| `activeEditorIsDirty`              | 组内的某个激活的编辑器为脏时                                                                                                        |
| `activeEditorIsNotPreview`         | 组内的某个激活的编辑器不在预览模式中                                                                                                |
| `activeEditorIsPinned`             | 组内的某个激活的编辑器被固定时                                                                                                      |
| `inSearchEditor`                   | 当焦点在搜索编辑器内时                                                                                                              |
| **设置上下文**                     |
| `config.editor.minimap.enabled`    | 当设置中的 `editor.minimap.enabled` 为 `true` 时                                                                                    |

?> 注意：你可以使用`config.`前缀，使用任意用户或工作区设置中的值。

## 激活/聚焦视图或面板相关的上下文变量

你可以用 when 子句检查特定视图是否是可见的

| 上下文名称    | 何时为真                                                         |
| ------------- | ---------------------------------------------------------------- |
| activeViewlet | 当视图可见时，比如`"activeViewlet == 'workbench.view.explorer'"` |
| activePanel   | 当面板可见时，比如`"activePanel == 'workbench.panel.explorer'"`  |
| focusedView   | 当聚焦到视图时，比如`"focusedView == myViewsExplorerID"`         |

视图标识：

* workbench.view.explorer - 资源文件管理器
* workbench.view.search - 搜索
* workbench.view.scm - 源控制
* workbench.view.debug - 运行
* workbench.view.extensions - 插件

面板标识:

* workbench.panel.markers - 问题
* workbench.panel.output - 输出
* workbench.panel.repl - 调试控制台
* terminal - 终端
* workbench.panel.comments - 评论
* workbench.view.search - 搜索， 当 `search.location` 设置到 `panel` 时

如果你想要在特定视图或者面板聚焦时触发 when 子句，使用 `sideBarFocus` 或 `panelFocus` 与 `activeViewlet` 或 `activiewFocus` 进行组合。

比如，下列 when 子句只会在文件资源管理器聚焦时才会为真

```json
"sideBarFocus && activeViewlet == 'workbench.view.explorer'"
```

## 在 when 子句中检查设置

在 when 子句中，你可以使用`config.`获取配置（设置）中的值。比如 `config.editor.tabCompletion` 或 `config.breadcrumbs.enabled`

## 添加自定义 when 子句上下文

如果你的插件需要使用 when 子句启动/禁用命令、菜单或者视图，而已有的上下文变量都不满足你的需求，你可以用 `setContext` 命令设置你自己的变量。

下面的第一个例子设置键`myExtension:showMyCommand`为真，你就可以在命令中或者 `when` 属性中进行使用了。第二个例子储存了一个值，那么你就可以在 `when` 子句中检查这个属性值是否大于 2 了。

```typescript
vscode.commands.executeCommand('setContext', 'myExtension.showMyCommand', true);

vscode.commands.executeCommand('setContext', 'myExtension.numberOfCoolOpenThings', 4);
```

## 'in' 条件操作符

`when`中的操作符`in` 允许在上下文变量中动态查找其他的上下文变量值。比如，给包含特定文件的文件夹添加一个特殊的菜单命令（或者无法静态得知的其他东西），你可以使用 `in` 操作符来实现。

第一，确定需要支持的文件夹类型，比如是一个名称数组。然后，使用 `setContext` 命令把数组注入到上下文变量中：

```typescript
vscode.commands.executeCommand('setContext', 'ext.supportedFolders', [
  'test',
  'foo',
  'bar'
]);

// 或者

// 注意本例（使用了一个对象）, 具体值是无关紧要的只要键存在于对象中
vscode.commands.executeCommand('setContext', 'ext.supportedFolders', {
  test: true,
  foo: 'anything',
  bar: false
});
```

然后在 `package.json` 中添加`explorer/context`菜单配置：

```json
// 注意，本例假设你已经定义了一个叫做ext.doSpecial的命令
"menus": {
  "explorer/context": [
    {
      "command": "ext.doSpecial",
      "when": "explorerResourceIsFolder && resourceFilename in ext:supportedFolders"
    }
  ]
}
```

在这个例子里，我们拿到 `resourceFilename` 的值（在本例中也就是文件夹的名字）然后检查它是否在 `ext:supportedFolders` 之中。如果存在的话，菜单就会展示出来。这个强大的操作符使得更复杂的条件分支得以实现，同时也支持了动态配置。

## 查看上下文变量的工具

如果你想在运行时查看当前所有激活的上下文变量，你可以打开命令面板(`⇧⌘P`) 使用 **开发人员:检查上下文键值** 命令。这个命令会打开 VS Code 开发者工具的 **Console** 标签（或 **帮助 > 打开开发者工具**）然后显示出上下文变量的键值。

当你运行 **开发人员:检查上下文键值**，你的鼠标会高亮 VS Code UI 中的元素，当你点击一个元素时，对应的上下文变量和它们的状态就会输出到 **Console** 中。

![inspect-context-keys](https://code.visualstudio.com/assets/api/references/when-clause-contexts/inspect-context-keys.png)

一系列可能包含 [自定义上下文变量](#添加自定义-when-子句上下文) 的键值对会展示出来。

!> 注意：部分 VS Code 内部使用的上下文变量在未来可能会有所变化。



