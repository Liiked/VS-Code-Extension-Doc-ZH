# 色彩主题

色彩可视化工作在VS Code可以分成两种类型：
- 工作台（Workbench）色彩：在视图和编辑器中使用的工作台（Workbench）色彩，包括视图、编辑器、活动栏、状态栏等。整个色彩列表[查看这里](https://code.visualstudio.com/docs/getstarted/theme-color-reference)。
- 语法色彩：语法色彩就是编辑器中代码的颜色，它色彩基于TextMate语法和TextMate主题规则进行着色。

## 工作台色彩
---

创建工作台色彩最简单的方式就是使用现成的主题，然后开始定制。

- 在VS Code中切换到你想要编辑的色彩主题。
- 打开设置，用`workbench.colorCustomizations`修改视图和编辑器色彩。一般来说会即时生效，如果没有生效你需要自己重启VS Code。

下面是一个改变了标题栏颜色的配置
```json
{
	"workbench.colorCustomizations": {
		"titleBar.activeBackground": "#ff0000"
	}
}
```

- [完整的主题色彩列表](https://code.visualstudio.com/docs/getstarted/theme-color-reference)

## 语法色彩
---

新建语法高亮色彩有两种方式，
1. 直接使用社区现成的TextMate主题（`.tmTheme`文件）
2. 自己想一个主题规则出来

简单选项：切换到色彩主题，用[设置](https://code.visualstudio.com/docs/getstarted/settings)中的`editor.tokenColorCustomizations`进行自定义，就像上面修改工作台色彩一样，修改会立即呈现，你不需要重启VS Code。

下面的例子修改了编辑器中注释的颜色：

```json
{
	"editor.tokenColorCustomizations": {
		"comments": "#FF0000"
	}
}
```

设置支持一些简单的语法标识模型，比如“comments”，“strings”，“numbers”等等。如果你的定制更多颜色，那么直接应用TextMate语法规则就可以了，详见[语法高亮指南]()。


## 创建新的色彩主题
---

既然你已经用过`workbench.colorCustomizations`和`editor.tokenColorCustomizations`笨拙地修改过颜色，那么接下来我们可以见识见识大杀器了。

- 打开**命令面板**输入**Developer: Generate Color Theme from Current Settings**
- 使用VS Code的 [Yeoman](http://yeoman.io/) 插件生成器， [yo code](/extension-authoring/extension-generator)生成新的主题
``` npm install -g yo generator-code
yo code
```
- 如果你像下图这样选择了自定义主题，则选择'start fresh'

![生成新主题](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/api/extension-guides/images/color-theme/yocode-colortheme.png)

- 把从设置中生成的主题文件复制到新的插件中
- 如果你想使用现成的TextMate主题，那你就需要在插件生成的时候选择导入TextMate主题并打包。另外，如果你下载了一个主题，那么只要用`.tmTheme`链接替换`tokenColors`部分就可以了。

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
?> 为你的色彩文件添加`.color-theme.json`前缀，那么你在编辑这个文件时就能自动获得悬浮提示、代码补全、色彩装饰器和色彩选择器等功能了。

?> [ColorSublime](https://colorsublime.github.io/)有成百上千个现成的TextMate主题。你可以选择一个你喜欢的主题，复制下载链接，然后用Yeoman选择这个主题生成你的插件。格式如：`"https://raw.githubusercontent.com/Colorsublime/Colorsublime-Themes/master/themes/(name).tmTheme"`


## 测试新的主题
---
想要测试新主题，首先新建一个`.vscode/launch.json`文件：

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "theme",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": ["--extensionDevelopmentPath=${workspaceRoot}"]
		}
	]
}
```

把生成的主题文件夹复制到[你的`.vscode/extension`文件夹](/extension-authoring/extension-generator.md#我的插件目录在哪？)下，然后重启VS Code。

通过**文件>首选项>颜色主题**然后在下拉菜单里找到你的主题。修改了主题之后，最好重启一下VS Code，或者重载窗口。

![选择我的主题](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/api/extension-guides/images/color-theme/mytheme.png)

## 将主题发布到插件市场
---

如果你想把主题分享给社区，通过[插件市场](https://github.com/Microsoft/vscode-docs/blob/master/docs/editor/extension-gallery.md)去发布它吧。用[vsce publishing tool](/extension-authoring/publish-extension.md)打包你的主题然后发布到VS Code市场。

要想让你的插件在插件市场上看起来更好一点，我们建议你参考一下[插件市场展示小贴士](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-manifest.md#marketplace-presentation-tips)。

?> 小贴士：想要用户轻松地找到你的主题，最好修改一下`package.json`，把关键字"theme"写到插件描述（extension description）中，然后把`Category`设置为`Theme`

## 添加新的色彩id
---

[色彩配置点](extensibility-reference/contribution-points.md#contributescolors)可以配置插件的*色彩id*，当在`workbench.colorCustomizations`和主题文件中使用代码补全时，这些色彩也会出现。用户可以在[插件配置](https://code.visualstudio.com/docs/editor/extension-gallery#_extensiondetails)选项卡中看到插件定义了什么颜色。

## 更多

- [CSS Tricks - 新建一个VS Code主题](https://css-tricks.com/creating-a-vs-code-theme/)