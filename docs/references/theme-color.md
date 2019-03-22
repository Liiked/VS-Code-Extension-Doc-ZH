# 主题色彩

可以通过[用户设置](https://code.visualstudio.com/docs/getstarted/settings)的`workbench.colorCustomizations`配置项, 定制Visual Studio Code的[色彩主题](https://code.visualstudio.com/docs/getstarted/themes).

```json
{
  "workbench.colorCustomizations": {
    "activityBar.background": "#00AA00"
  }
}
```

!> **注意**: 如果你想用现成的颜色主题的话, 通过**首选项: 颜色主题**的下拉菜单选取即可(<kbd>Ctrl+K Ctrl+T</kbd>), 参阅[色彩主题](https://code.visualstudio.com/docs/getstarted/themes).

## 颜色格式

可以使用RGBA来定义色值. 同样, 也支持十六进制表示法: `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`. R(红), G(绿), B(蓝), A(阿尔法)是一个十六进制字符(0-9, a-f, A-F). `#RRGGBB`和`#RRGGBBAA`分别可以简写为`#RGB`和`#RGBA`. 比如, `#ee3355ff`和`#e35f`是一样的效果.

如果没有定义alpha值, 那么它的默认值是`ff`(不透明, 没有透明度). 反之, 如果设为`00`, 则完全透明.

为了不遮挡其他注释的视线, 一些颜色应该设置成透明的. 查看颜色描述来了解哪些颜色应该使用这个规则.

## 对比色

一般用于高对比度的主题. 通过给UI项添加额外的边框来增强对比度.

- `contrastActiveBorder`: 在活动元素周围额外的一层边框，用来提高对比度从而区别其他元素
- `contrastBorder`: 在元素周围额外的一层边框，用来提高对比度从而区别其他元素

## 基色

- `focusBorder`: 焦点元素的整体边框颜色。此颜色仅在不被其他组件覆盖时适用
- `foreground`: 整体前景色。此颜色仅在不被组件覆盖时适用
- `widget.shadow`: 编辑器内小组件（如查找/替换）的阴影颜色
- `selection.background`: 工作台所选文本的背景颜色（例如输入字段或文本区域）。注意，本设置不适用于编辑器
- `descriptionForeground`: 提供其他信息的说明文本的前景色，例如标签文本
- `errorForeground`: 错误信息的整体前景色。此颜色仅在不被组件覆盖时适用

## 文本颜色

文本文档中的颜色, 比如欢迎页

- `textBlockQuote.background`: 文本中块引用的背景颜色
- `textBlockQuote.border`: 文本中块引用的边框颜色
- `textCodeBlock.background`: 文本中代码块的背景颜色
- `textLink.activeForeground`: 文本中链接在点击或鼠标悬停时的前景色
- `textLink.foreground`: 文本中链接的前景色
- `textPreformat.foreground`: 预格式化文本段的前景色
- `textSeparator.foreground`: 文字分隔符的颜色

## 按钮控件

按钮小组件的颜色, 例如新窗口的资源管理器中的**打开文件夹**按钮

![按钮控件](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/button.png)

- `button.background`: 按钮背景色
- `button.foreground`: 按钮前景色
- `button.hoverBackground`: 按钮在悬停时的背景颜色

## 下拉列表控件

下拉列表小部件颜色, 例如集成终端和输出面板.

!> **注意**: macOS目前还不能用该控件

![下拉列表控件](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/dropdown.png)

- `dropdown.background`: 下拉列表背景色
- `dropdown.listBackground`: 下拉列表背景色
- `dropdown.border`: 下拉列表边框
- `dropdown.foreground`: 下拉列表前景色

## 输入框控件

输入框控件颜色, 例如搜索视图、搜索/替换对话框

![输入框控件](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/input.png)

- `input.background`: 输入框背景色
- `input.border`: 输入框边框
- `input.foreground`: 输入框前景色
- `input.placeholderForeground`: 输入框中占位符的前景色
- `inputOption.activeBorder`: 输入字段中已激活选项的边框颜色
- `inputValidation.errorBackground`: 输入验证结果为错误级别时的背景色
- `inputValidation.errorForeground`: 输入验证结果为错误级别时的前景色
- `inputValidation.errorBorder`: 严重性为错误时输入验证的边框颜色
- `inputValidation.infoBackground`: 输入验证结果为信息级别时的背景色
- `inputValidation.infoForeground`: 输入验证结果为信息级别时的前景色
- `inputValidation.infoBorder`: 严重性为信息时输入验证的边框颜色
- `inputValidation.warningBackground`: 严重性为警告时输入验证的背景色
- `inputValidation.warningForeground`: 输入验证结果为警告级别时的前景色
- `inputValidation.warningBorder`: 严重性为警告时输入验证的边框颜色

## 滚动条控件

- `scrollbar.shadow`: 表示视图被滚动的滚动条阴影
- `scrollbarSlider.activeBackground`: 滚动条滑块在被点击时的背景色
- `scrollbarSlider.background`: 滚动条滑块背景色
- `scrollbarSlider.hoverBackground`: 滚动条滑块在悬停时的背景色

## 徽标

Badge 是小型的信息标签，如表示搜索结果数量的标签

- `badge.foreground`: Badge前景色
- `badge.background`: Badge背景色

## 进度条

- `progressBar.background`: 表示长时间操作的进度条的背景色

## 列表和树

列表和树的色彩, 例如资源管理器. 活动的列表/树具有键盘焦点, 反之则没有.

- `list.activeSelectionBackground`: 已选项在列表或树活动时的背景颜色。
- `list.activeSelectionForeground`: 已选项在列表或树活动时的前景颜色
- `list.dropBackground`: 使用鼠标移动项目时，列表或树进行拖放的背景颜色
- `list.focusBackground`: 焦点项在列表或树活动时的背景颜色
- `list.focusForeground`: 焦点项在列表或树活动时的背景颜色
- `list.highlightForeground`: 在列表或树中搜索时，其中匹配内容的高亮颜色
- `list.hoverBackground`: 使用鼠标移动项目时，列表或树的背景颜色
- `list.hoverForeground`: 鼠标在项目上悬停时，列表或树的前景颜色
- `list.inactiveSelectionBackground`: 已选项在列表或树非活动时的背景颜色
- `list.inactiveSelectionForeground`: 已选项在列表或树非活动时的前景颜色
- `list.inactiveFocusBackground`: 非活动的列表或树控件中焦点项的背景颜色
- `list.invalidItemForeground`: 列表或树中无效项的前景色，例如资源管理器中没有解析的根目录
- `list.errorForeground`: 包含错误的列表项的前景颜色
- `list.warningForeground`: 包含警告的列表项的前景颜色
- `listFilterWidget.background`: 列表和树中类型筛选器小组件的背景色
- `listFilterWidget.outline`: 列表和树中类型筛选器小组件的轮廓颜色
- `listFilterWidget.noMatchesOutline`: 当没有匹配项时，列表和树中类型筛选器小组件的轮廓颜色

## 活动栏

活动栏显示在最左侧或最右侧，并允许在侧边栏的视图间切换

- `activityBar.background`: 活动栏背景色
- `activityBar.dropBackground`: 活动栏项在被拖放时的反馈颜色。此颜色应有透明度，以便活动栏条目能透过此颜色
- `activityBar.foreground`: 活动栏项在活动时的前景色
- `activityBar.inactiveForeground`: 活动栏项在非活动时的前景色
- `activityBar.border`: 活动栏分隔侧边栏的边框颜色
- `activityBarBadge.background`: 活动通知徽章背景色
- `activityBarBadge.foreground`: 活动通知徽章前景色

## 侧边栏

侧边栏是资源管理器和搜索等视图的容器

- `sideBar.background`: 侧边栏背景色
- `sideBar.foreground`: 侧边栏前景色
- `sideBar.border`: 侧边栏分隔编辑器的边框颜色
- `sideBar.dropBackground`: 侧边栏中的部分在拖放时的反馈颜色
- `sideBarTitle.foreground`: 侧边栏标题前景色
- `sideBarSectionHeader.background`: 侧边栏节标题的背景颜色
- `sideBarSectionHeader.foreground`: 侧边栏节标题的前景色
- `sideBarSectionHeader.border`: 侧边栏节标题的边框颜色

## 编辑器组 & 选项卡

编辑器组是多个编辑器的容器 一个编辑器组可以包含多个编辑器.  一个选项卡是一个编辑器的容器. 可以在一个编辑器组里面打开多个选项卡

- `editorGroup.border`: 将多个编辑器组彼此分隔开的颜色

![编辑器组边框](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/editorGroup-border.gif)

- `editorGroup.dropBackground`: 拖动编辑器时的背景颜色

![编辑器组拖动背景色](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/editorGroup-dropbackground.gif)

- `editorGroupHeader.noTabsBackground`: 禁用选项卡 (`"workbench.editor.showTabs": false`) 时编辑器组标题颜色

![禁用选项卡时的编辑器组标题颜色](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/editorgroupheader-notabsbackground.gif)

- `editorGroupHeader.tabsBackground`: 启用选项卡时编辑器组标题的背景颜色

![启用选项卡时编辑器组标题的背景颜色](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/editorgroupheader-tabsbackground.gif)

- `editorGroupHeader.tabsBorder`: 选项卡启用时编辑器组标题的边框颜色。

![启用选项卡时编辑器组标题的边框](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/editorgroupheader-tabsborder.gif)

- `editorGroup.emptyBackground`: 空编辑器组的背景色
- `editorGroup.focusedEmptyBorder`: 编辑器组被聚焦时的边框颜色
- `tab.activeBackground`: 活动选项卡的背景色。在编辑器区域
- `tab.activeForeground`: 活动组中活动选项卡的前景色
- `tab.border`: 用于将选项卡彼此分隔开的边框
- `tab.activeBorder`: 活动选项卡底部的边框
- `tab.unfocusedActiveBorder`: 在失去焦点的编辑器组中的活动选项卡底部的边框
- `tab.activeBorderTop`: 活动选项卡顶部的边框
- `tab.unfocusedActiveBorderTop`: 在失去焦点的编辑器组中的活动选项卡顶部的边框
- `tab.inactiveBackground`: 非活动选项卡的背景色
- `tab.inactiveForeground`: 活动组中非活动选项卡的前景色
- `tab.unfocusedActiveForeground`: 一个失去焦点的编辑器组中的活动选项卡的前景色
- `tab.unfocusedInactiveForeground`: 在一个失去焦点的组中非活动选项卡的前景色
- `tab.hoverBackground`: 选项卡被悬停时的背景色
- `tab.unfocusedHoverBackground`: 非焦点组选项卡被悬停时的背景色
- `tab.hoverBorder`: 选项卡被悬停时用于突出显示的边框
- `tab.unfocusedHoverBorder`: 非焦点组选项卡被悬停时用于突出显示的边框
- `tab.activeModifiedBorder` : 在活动编辑器组中已修改 (存在更新) 的活动选项卡的顶部边框
- `tab.inactiveModifiedBorder`: 在活动编辑器组中已修改 (存在更新) 的非活动选项卡的顶部边框
- `tab.unfocusedActiveModifiedBorder`: 在未获焦点的编辑器组中已修改 (存在更新) 的活动选项卡的顶部边框
- `tab.unfocusedInactiveModifiedBorder`: 在未获焦点的编辑器组中已修改 (存在更新) 的非活动选项卡的顶部边框
- `editorPane.background`: 居中编辑器布局中左侧与右侧编辑器窗格的背景色

## 编辑器色彩

编辑器里面最突出的色彩主要是语法高亮, 并且基于你已经安装的语言. 可以在色彩主题中或者使用`editor.tokenColorCustomizations`配置. 参阅[定制色彩主题](https://code.visualstudio.com/docs/getstarted/themes#_customizing-a-color-theme)以了解更新色彩主题和可用的标记类型

下面列出了所有的编辑器色彩:

- `editor.background`: 编辑器背景色
- `editor.foreground`: 编辑器前景色
- `editorLineNumber.foreground`: 编辑器行号的颜色
- `editorLineNumber.activeForeground`: 编辑器活动行号的颜色
- `editorCursor.background`: 编辑器光标的背景色。可以自定义块型光标覆盖字符的颜色
- `editorCursor.foreground`: 编辑器光标的前景色。可以自定义块型光标覆盖字符的颜色

当选中多个字符时会显示选区颜色. 这是为了高亮显示与所选文本相关的区域

![选区高亮](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/selectionhighlight.png)

- `editor.selectionBackground`: 编辑器所选内容的颜色
- `editor.selectionForeground`: 用以彰显高对比度的所选文本的颜色
- `editor.inactiveSelectionBackground`: 非活动编辑器中所选内容的颜色，颜色必须透明，以免隐藏下面的装饰效果
- `editor.selectionHighlightBackground`: 具有与所选项相关内容的区域的颜色。颜色必须透明，以免隐藏下面的修饰效果
- `editor.selectionHighlightBorder`: 与所选项内容相同的区域的边框颜色

光标在符号或单词内部时会触发符号高亮. 取决于受支持的语言文件, 所有匹配到的引用和声明会根据读和写显示不同的颜色, 反之, 只会字符高亮:

![符号和单词高亮](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/occurrences.png)

- `editor.wordHighlightBackground`: 读取访问期间符号的背景色，例如读取变量时。颜色必须透明，以免隐藏下面的修饰效果
- `editor.wordHighlightBorder`: 符号在进行读取访问操作时的边框颜色，例如读取变量
- `editor.wordHighlightStrongBackground`: 写入访问过程中符号的背景色，例如写入变量时。颜色必须透明，以免隐藏下面的修饰效果
- `editor.wordHighlightStrongBorder`: 符号在进行写入访问操作时的边框颜色，例如写入变量

搜索匹配项的颜色取决于搜索/替换对话框中的输入文字:

![搜索匹配项](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/findmatches.png)

- `editor.findMatchBackground`: 当前搜索匹配项的颜色
- `editor.findMatchHighlightBackground`: 其他搜索匹配项的颜色。颜色必须透明，以免隐藏下面的修饰效果
- `editor.findRangeHighlightBackground`: 限制搜索范围的颜色(启用搜索小组件的'Find in Selection'配置项)。颜色必须透明，以免隐藏底层装饰
- `editor.findMatchBorder`: 当前搜索匹配项的边框颜色
- `editor.findMatchHighlightBorder`: 其他搜索匹配项的边框颜色
- `editor.findRangeHighlightBorder`: 限制搜索的范围的边框颜色(启用搜索小组件的'Find in Selection'配置项)

鼠标悬停符号时的颜色:

![悬停高亮](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/hoverhighlight.png)

- `editor.hoverHighlightBackground`: 在下面突出显示悬停的字词。颜色必须透明，以免隐藏下面的修饰效果

当前行(光标所在行)只会显示背景高亮或者边框高亮(两者之一)

![行高亮](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/line.png)

- `editor.lineHighlightBackground`: 光标所在行高亮内容的背景颜色
- `editor.lineHighlightBorder`: 标所在行四周边框的背景颜色

点击链接时的颜色:

![点击链接](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/link.png)

- `editorLink.activeForeground`: 文本中链接在点击或鼠标悬停时的前景色

选择搜索结果时的高亮区域:

![高亮区域](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/rangehighlight.png)

- `editor.rangeHighlightBackground`: 限制搜索范围的颜色, 用于快速打开、文件中的符号、搜索结果。颜色不能不透明，以免隐藏底层装饰
- `editor.rangeHighlightBorder`: 限制搜索的范围的边框颜色

要查看编辑器在空白字符上显示符号的方式, 启用(enable)**Toggle Render Whitespace**配置项

- `editorWhitespace.foreground`: 编辑器中空白字符的前景色

使用`"editor.renderIndentGuides: true"`配置编辑器显示缩进参考线

- `editorIndentGuide.background`: 编辑器缩进参考线的颜色
- `editorIndentGuide.activeBackground`: 编辑器活动缩进参考线的颜色

使用`"editor.rulers"`来配置编辑器标尺

- `editorRuler.foreground`: 编辑器标尺的前景色

CodeLens:

![CodeLens](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/codelens.png)

- `editorCodeLens.foreground`: 编辑器 CodeLens 的前景色

匹配括号:

![匹配括号](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/bracket-colors.png)

- `editorBracketMatch.background`: 匹配括号的背景色
- `editorBracketMatch.border`: 匹配括号外框的颜色

概览标尺:

位于编辑器右边缘滚动条下方, 可以概览整个编辑器.

- `editorOverviewRuler.border`: 概览标尺边框的颜色
- `editorOverviewRuler.findMatchForeground`: 用于查找匹配项的概述标尺标记颜色, 颜色必须透明，以免隐藏下面的修饰效果
- `editorOverviewRuler.rangeHighlightForeground`: 用于突出显示范围的概述标尺标记颜色, , 比如快速打开、文件中的符号、查找功能. 颜色必须透明，以免隐藏下面的修饰效果
- `editorOverviewRuler.selectionHighlightForeground`: 用于突出显示所选内容的概述标尺标记颜色。颜色必须透明，以免隐藏下面的修饰效果
- `editorOverviewRuler.wordHighlightForeground`: 用于突出显示符号的概述标尺标记颜色。颜色必须透明，以免隐藏下面的修饰效果
- `editorOverviewRuler.wordHighlightStrongForeground`: 用于突出显示写权限符号的概述标尺标记颜色。颜色必须透明，以免隐藏下面的修饰效果
- `editorOverviewRuler.modifiedForeground`: 概览标尺中已修改内容的颜色
- `editorOverviewRuler.addedForeground`: 概览标尺中已增加内容的颜色
- `editorOverviewRuler.deletedForeground`: 概览标尺中已删除内容的颜色
- `editorOverviewRuler.errorForeground`: 概览标尺中错误内容的颜色
- `editorOverviewRuler.warningForeground`: 概览标尺中警告信息的颜色
- `editorOverviewRuler.infoForeground`: 概览标尺中信息的颜色
- `editorOverviewRuler.bracketMatchForeground`: 概览标尺上表示匹配括号的标记颜色

错误和警告:

- `editorError.foreground`: 错误信息的整体前景色。此颜色仅在不被组件覆盖时适用
- `editorError.border`: 编辑器中错误波浪线的边框颜色
- `editorWarning.foreground`: 编辑器中警告波浪线的前景色
- `editorWarning.border`: 编辑器中警告波浪线的边框颜色
- `editorInfo.foreground`: 编辑器中信息波浪线的前景色
- `editorInfo.border`: 编辑器中信息波浪线的边框颜色
- `editorHint.foreground`: 编辑器中提示波浪线的前景色
- `editorHint.border`: 编辑器中提示波浪线的边框颜色

未使用的源代码:

- `editorUnnecessaryCode.border`: 编辑器中不必要(未使用)的源代码的边框颜色
- `editorUnnecessaryCode.opacity`: 不必要（未使用）代码的在编辑器中显示的不透明度。例如，`"#000000c0"` 将以 75% 的不透明度显示代码。对于高对比度主题，请使用 `"editorUnnecessaryCode.border"` 主题来为非必须代码添加下划线，以避免颜色淡化

导航线包括边缘符号和行号:

- `editorGutter.background`: 编辑器导航线的背景色, 导航线包括边缘符号和行号
- `editorGutter.modifiedBackground`: 编辑器导航线中被修改行的背景颜色
- `editorGutter.addedBackground`: 编辑器导航线中已插入行的背景颜色
- `editorGutter.deletedBackground`: 编辑器导航线中被删除行的背景颜色

## 差异编辑器色彩

已插入或者移除的文字的颜色, 使用背景色或者边框色(两者选其一)

- `diffEditor.insertedTextBackground`: 已插入的文本的背景色。颜色必须透明，以免隐藏下面的修饰效果
- `diffEditor.insertedTextBorder`: 插入的文本的轮廓颜色
- `diffEditor.removedTextBackground`: 已删除的文本的背景色。颜色必须透明，以免隐藏下面的修饰效果
- `diffEditor.removedTextBorder`: 被删除文本的轮廓颜色
- `diffEditor.border`: 两个文本编辑器之间的边框颜色

## 编辑器小部件色彩

编辑器组件在其内容的前面. 例如(查找/替换)对话框、建议组件、编辑器悬停提示框

- `editorWidget.background`: 编辑器组件(如查找/替换)背景颜色
- `editorWidget.border`: 编辑器小部件的边框颜色。此颜色仅在小部件有边框且不被小部件重写时适用
- `editorWidget.resizeBorder`: 编辑器小部件大小调整条的边框颜色。此颜色仅在小部件有调整边框且不被小部件颜色覆盖时使用
- `editorSuggestWidget.background`: 建议小组件的背景色
- `editorSuggestWidget.border`: 建议小组件的边框颜色
- `editorSuggestWidget.foreground`: 建议小组件的前景色
- `editorSuggestWidget.highlightForeground`: 建议小组件中匹配内容的高亮颜色
- `editorSuggestWidget.selectedBackground`: 建议小组件中所选条目的背景色
- `editorHoverWidget.background`: 编辑器悬停提示背景颜色
- `editorHoverWidget.border`: 编辑器悬停提示边框颜色

异常小组件是一个速览窗口, 当调试抛出异常时出现

- `debugExceptionWidget.background`: 异常小组件背景颜色
- `debugExceptionWidget.border`: 异常小组件边框颜色

编辑器标记, 当导航至编辑器中的错误和警告时出现(**跳到下一个错误或警告**命令)

- `editorMarkerNavigation.background`: 编辑器标记导航小组件背景色
- `editorMarkerNavigationError.background`: 编辑器标记导航小组件错误颜色
- `editorMarkerNavigationWarning.background`: 编辑器标记导航小组件警告颜色
- `editorMarkerNavigationInfo.background`: 编辑器标记导航小组件信息颜色

## 速览窗口色彩

速览窗口在编辑器内部, 将引用和声明显示为视图

![速览窗口](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/peek-view.png)

- `peekView.border`: 速览视图边框和箭头颜色
- `peekViewEditor.background`: 速览视图编辑器背景色
- `peekViewEditorGutter.background`: 速览视图编辑器中装订线的背景色
- `peekViewEditor.matchHighlightBackground`: 在速览视图编辑器中匹配突出显示颜色
- `peekViewEditor.matchHighlightBorder`: 在速览视图编辑器中匹配项的突出显示边框
- `peekViewResult.background`: 速览视图结果列表背景色
- `peekViewResult.fileForeground`: 速览视图结果列表中文件节点的前景色
- `peekViewResult.lineForeground`: 速览视图结果列表中行节点的前景色
- `peekViewResult.matchHighlightBackground`: 在速览视图结果列表中匹配突出显示颜色
- `peekViewResult.selectionBackground`: 速览视图结果列表中所选条目的背景色
- `peekViewResult.selectionForeground`: 速览视图结果列表中所选条目的前景色
- `peekViewTitle.background`: 速览视图标题区域背景颜色
- `peekViewTitleDescription.foreground`: 速览视图标题信息颜色
- `peekViewTitleLabel.foreground`: 速览视图标题颜色

## 合并冲突

合并冲突装饰, 当编辑器包含范围差异时显示

![合并范围差异](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/merge-ranges.png)

- `merge.currentHeaderBackground`: 当前标题背景的内联合并冲突. 颜色不能不透明，以免隐藏底层装饰
- `merge.currentContentBackground`: 内联合并冲突中的当前内容背景. 颜色必须透明，以免隐藏下面的修饰效果
- `merge.incomingHeaderBackground`: 内联合并冲突中的传入标题背景. 颜色必须透明, 以免隐藏下面的修饰效果
- `merge.incomingContentBackground`: 内联合并冲突中的传入内容背景. 颜色必须透明, 以免隐藏下面的修饰效果
- `merge.border`: 内联合并冲突中标头和分割线的边框颜色
- `merge.commonContentBackground`: 内联合并冲突中的常见祖先内容背景. 颜色必须透明, 以免隐藏下面的修饰效果
- `merge.commonHeaderBackground`: 内联合并冲突中的常见祖先标头背景, 颜色必须透明, 以免隐藏下面的修饰效果
- `editorOverviewRuler.currentContentForeground`: 内联合并冲突中当前版本区域的概览标尺前景色
- `editorOverviewRuler.incomingContentForeground`: 内联合并冲突中传入的版本区域的概览标尺前景色
- `editorOverviewRuler.commonContentForeground`: 内联合并冲突中共同祖先区域的概览标尺前景色

## 面板色彩

面板显示在编辑器区域下方，可包含输出和集成终端等视图

- `panel.background`: 面板的背景色
- `panel.border`: 将面板与编辑器隔开的边框的颜色
- `panel.dropBackground`: 面板标题项在拖放时的反馈颜色, 此颜色应有透明度，以便面板项仍能透过
- `panelTitle.activeBorder`: 活动面板标题的边框颜色
- `panelTitle.activeForeground`: 活动面板的标题颜色
- `panelTitle.inactiveForeground`: 非活动面板的标题颜色

## 状态栏色彩

状态栏显示在工作区底部

- `statusBar.background`: 工作区打开时状态栏的背景色
- `statusBar.foreground`: 工作区打开时状态栏的前景色
- `statusBar.border`: 状态栏分隔侧边栏和编辑器的边框颜色
- `statusBar.debuggingBackground`: 调试程序时状态栏的背景色
- `statusBar.debuggingForeground`: 调试程序时状态栏的前景色
- `statusBar.debuggingBorder`: 调试程序时区别于侧边栏和编辑器的状态栏边框颜色
- `statusBar.noFolderForeground`: 没有打开文件夹时状态栏的前景色
- `statusBar.noFolderBackground`: 没有打开文件夹时状态栏的背景色
- `statusBar.noFolderBorder`: 当没有打开文件夹时，用来使状态栏与侧边栏、编辑器分隔的状态栏边框颜色
- `statusBarItem.activeBackground`: 单击时的状态栏项背景色
- `statusBarItem.hoverBackground`: 悬停时的状态栏项背景色
- `statusBarItem.prominentBackground`: 状态栏突出显示项的背景颜色, 突出显示项比状态栏中的其他条目更醒目以表明其重要性, 在命令面板中更改`切换 Tab 键是否移动焦点`可查看示例
- `statusBarItem.prominentHoverBackground`: 状态栏突出显示项在被悬停时的背景颜色, 突出显示项比状态栏中的其他条目更醒目以表明其重要性. 在命令面板中更改`切换 Tab 键是否移动焦点`可查看示例

## 标题栏色彩

- `titleBar.activeBackground`: 窗口处于活动状态时的标题栏背景色
- `titleBar.activeForeground`: 窗口处于活动状态时的标题栏前景色
- `titleBar.inactiveBackground`: 窗口处于非活动状态时的标题栏背景色
- `titleBar.inactiveForeground`: 窗口处于非活动状态时的标题栏前景色
- `titleBar.border`: 标题栏边框颜色

## 菜单栏色彩

- `menubar.selectionForeground`: 菜单栏中选定菜单项的前景色
- `menubar.selectionBackground`: 菜单栏中选定菜单项的背景色
- `menubar.selectionBorder`: 菜单栏中所选菜单项的边框颜色
- `menu.foreground`: 菜单项的前景颜色
- `menu.background`: 菜单项的背景颜色
- `menu.selectionForeground`: 菜单中选定菜单项的前景色
- `menu.selectionBackground`: 菜单中所选菜单项的背景色
- `menu.selectionBorder`: 菜单中所选菜单项的边框颜色
- `menu.separatorBackground`: 菜单中分隔线的颜色

## 通知框色彩

!> **注意**: 下列的色彩只适用于VS Code-1.21或更高版本

通知横幅从窗口右下角滑入

![通知横幅](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/notification-toast.png)

打开的通知中心会在一个带有标题的列表中显示

![通知中心](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/references/images/theme-color/notification-center.png)

- `notificationCenter.border`: 通知中心的边框颜色
- `notificationCenterHeader.foreground`: 通知中心头部的前景色
- `notificationCenterHeader.background`: 通知中心头部的背景色
- `notificationToast.border`: 通知横幅的边框颜色
- `notifications.foreground`: 通知的前景色
- `notifications.background`: 通知的背景色
- `notifications.border`: 通知中心中分隔通知的边框的颜色
- `notificationLink.foreground`: 通知链接的前景色

如果你使用的VS Code版本低于1.21(2018-2), 可以使用旧的色彩(不再支持):

- `notification.background`
- `notification.foreground`
- `notification.buttonBackground`
- `notification.buttonForeground`
- `notification.buttonHoverBackground`
- `notification.errorBackground`
- `notification.errorForeground`
- `notification.infoBackground`
- `notification.infoForeground`
- `notification.warningBackground`
- `notification.warningForeground`

## 拓展栏

- `extensionButton.prominentForeground`: 扩展中突出操作的按钮前景色(比如 **安装**按钮)
- `extensionButton.prominentBackground`: 扩展中突出操作的按钮背景色
- `extensionButton.prominentHoverBackground`: 扩展中突出操作的按钮被悬停时的颜色

## 快速选取器

- `pickerGroup.border`: 快速选取(快速打开)器分组边框的颜色
- `pickerGroup.foreground`: 快速选取(快速打开)器分组标签的颜色

## 集成终端色彩

- `terminal.background`: 终端视口的背景颜色
- `terminal.border`: 分隔终端中拆分窗格的边框的颜色。默认值为 panel.border 的颜色
- `terminal.foreground`: 集成终端的默认前景色
- `terminal.ansiBlack`: 终端中的'黑色'ANSI
- `terminal.ansiBlue`: 终端中的'蓝色'ANSI
- `terminal.ansiBrightBlack`: 终端中的'亮黑色'ANSI
- `terminal.ansiBrightBlue`: 终端中的'亮蓝色'ANSI
- `terminal.ansiBrightCyan`: 终端中的'亮青色'ANSI
- `terminal.ansiBrightGreen`: 终端中的'亮绿色'ANSI
- `terminal.ansiBrightMagenta`: 终端中的'亮品红色'ANSI
- `terminal.ansiBrightRed`: 终端中的'亮红色'ANSI
- `terminal.ansiBrightWhite`: 终端中的'亮白色'ANSI
- `terminal.ansiBrightYellow`: 终端中的'亮黄色'ANSI
- `terminal.ansiCyan`: 终端中的'青色'ANSI
- `terminal.ansiGreen`: 终端中的'绿色'ANSI
- `terminal.ansiMagenta`: 终端中的'品红色'ANSI
- `terminal.ansiRed`: 终端中的'红色'ANSI
- `terminal.ansiWhite`: 终端中的'白色'ANSI
- `terminal.ansiYellow`: 终端中的'黄色'ANSI
- `terminal.selectionBackground`: 终端中选中内容的背景色
- `terminalCursor.background`: 终端光标的背景色. 允许自定义被 block 光标遮住的字符的颜色
- `terminalCursor.foreground`: 终端光标的前景色

## 调试

- `debugToolBar.background`: 调试工具栏背景颜色
- `debugToolBar.border`: 调试工具栏边框颜色
- `editor.stackFrameHighlightBackground`: 堆栈帧中顶部一行的高亮背景色
- `editor.focusedStackFrameHighlightBackground`: 堆栈帧中焦点一行的高亮背景色

## 欢迎界面

- `welcomePage.background`: 欢迎页面的背景色
- `welcomePage.buttonBackground`: 欢迎页按钮的背景色
- `welcomePage.buttonHoverBackground`: 欢迎页按钮被悬停时的背景色
- `walkThrough.embeddedEditorBackground`: 嵌入于交互式操场中的编辑器的背景颜色

## Git色彩

- `gitDecoration.addedResourceForeground`: 新增的Git资源的前景色. 用于显示文件标签和源代码管理
- `gitDecoration.modifiedResourceForeground`: 修改过的Git资源的前景色. 用于显示文件标签和源代码管理
- `gitDecoration.deletedResourceForeground`: 移除过的Git资源的前景色. 用于显示文件标签和源代码管理
- `gitDecoration.untrackedResourceForeground`: 未跟踪的Git资源的前景色. 用于文件标签和源代码管理
- `gitDecoration.ignoredResourceForeground`: 已忽视的Git资源的前景色. 用于文件标签和源代码管理
- `gitDecoration.conflictingResourceForeground`: 冲突的Git资源的前景色. 用于文件标签和源代码管理
- `gitDecoration.submoduleResourceForeground`: 子模块资源的前景色

## 设置编辑器色彩

!> **注意**: 下列色彩配置只适用于GUI(图形用户界面)设置编辑器, 可以通过`首选项: 打开设置(UI)`命令打开.

- `settings.headerForeground`: 小节标题与活动标题的前景色
- `settings.modifiedItemIndicator`: 已修改设置指示器的颜色
- `settings.dropdownBackground`: 下拉列表的背景色
- `settings.dropdownForeground`: 下拉列表的前景色
- `settings.dropdownBorder`: 下拉列表的边框颜色
- `settings.dropdownListBorder`: 下拉列表选项的边框颜色
- `settings.checkboxBackground`: 复选框的背景色
- `settings.checkboxForeground`: 复选框的前景色
- `settings.checkboxBorder`: 复选框的边框颜色
- `settings.textInputBackground`: 文本输入框的背景色
- `settings.textInputForeground`: 文本输入框的前景色
- `settings.textInputBorder`: 文本输入框的边框颜色
- `settings.numberInputBackground`: 数字输入框的背景色
- `settings.numberInputForeground`: 数字输入框的前景色
- `settings.numberInputBorder`: 数字输入框的边框颜色

## 导航路径

导航路径(面包屑)的色彩主题:

- `breadcrumb.background`: 导航路径的背景色
- `breadcrumb.foreground`: 导航路径的前景色
- `breadcrumb.background`: 导航路径项的背景色
- `breadcrumb.focusForeground`: 焦点导航路径的颜色
- `breadcrumb.activeSelectionForeground`: 已选导航路径项的颜色
- `breadcrumbPicker.background`: 导航路径项选择器的背景色

## 片段

片段的色彩主题:

- `editor.snippetTabstopHighlightBackground`: 代码片段 Tab 位的高亮背景色
- `editor.snippetTabstopHighlightBorder`: 代码片段 Tab 位的高亮边框颜色
- `editor.snippetFinalTabstopHighlightBackground`: 代码片段中最后的 Tab 位的高亮背景色
- `editor.snippetFinalTabstopHighlightBorder`: 代码片段中最后的 Tab 位的高亮边框颜色

也可以根据[发布内容的颜色配置项](), 使用插件来发布色彩id(Ids). 当在`workbench.colorCustomizations`配置项中使用代码补全或者编辑色彩主题文件时, 这些色彩也会出现. 用户可以在[插件发布](https://code.visualstudio.com/docs/editor/extension-gallery#_extension-details)选项卡中看到插件定义的色彩.

## 插件色彩

也可以根据[发布内容的颜色配置项](), 使用插件来发布色彩id(Ids). 当在`workbench.colorCustomizations`配置项中使用代码补全或者编辑色彩主题文件时, 这些色彩也会出现. 用户可以在[插件发布](https://code.visualstudio.com/docs/editor/extension-gallery#_extension-details)选项卡中看到插件定义的色彩.