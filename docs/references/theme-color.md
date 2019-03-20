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

## 差异编辑器色彩

## 编辑器小部件色彩

## 速览窗口色彩

## 合并冲突

## 面板色彩

## 状态栏色彩

## 标题栏色彩

## 菜单栏色彩

## 通知框色彩

## 插件栏

## 快速选取器

## 集成终端色彩

## 调试

## 欢迎界面

## Git色彩

## 设置编辑器色彩

## 面包屑

## 片段

## 插件色彩