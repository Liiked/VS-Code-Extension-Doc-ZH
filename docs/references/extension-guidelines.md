# 插件开发准则

## 架构

VS Code UI 包含了两类元素：容器和容器项。容器是指视图的顶层层级，它包括：

![Overview of Visual Studio Code containers elements](https://code.visualstudio.com/assets/api/references/guidelines/architecture-groups.png)

1. 活动栏([Activiti Bar](/references/extension-guidelines#视图容器))
2. 侧边栏(Sidebar)
3. 编辑器(Editor)
4. 面板(Panel)
5. 状态栏(Status Bar)

容器项则在容器的内部，他们的种类就很丰富了：

![Overview of Visual Studio Code item elements](https://code.visualstudio.com/assets/api/references/guidelines/architecture-sections.png)

1. 视图容器(View Container)
2. 视图([View](/references/extension-guidelines#视图))
3. 视图工具区(View Toolbar)
4. 侧边栏工具区(Sidebar Toolbar)
5.  编辑器工具区(Editor Toolbar)
6.  面板工具区(Pannel Toolbar)
7.  状态栏项([Status Bar Item](/references/extension-guidelines#状态栏))


## 通知框

[通知框](/extension-capabilities/common-capabilities#display-notifications) 会从 VS Code 右下角弹出，它可以展示一些简要的信息。你能够设置的通知类型有三种：

- [信息提示](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
- [警告提示](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
- [错误提示](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

不要过多地发送通知，以免分散用户的注意力。

![Information notification](https://code.visualstudio.com/assets/api/references/guidelines/notification-info.png)

*这条通知是用户**更新版本**后弹出的，注意这个通知中仅仅展示了信息不含任何操作。*

![Warning notification](https://code.visualstudio.com/assets/api/references/guidelines/notification-warning.png)

*这个例子中带有一个黄色的高亮警告，附带 3 个按钮——它要求用户进行介入处理。*

![Error notification](https://code.visualstudio.com/assets/api/references/guidelines/notification-error.png)

*这个例子是无操作的错误通知。*

✔建议
- 发送通知的时候不要过分吸引用户的注意力
- 为每个通知添加 **不要再提示** 按钮
- 短时间内只提示一次

❌  不要
- 发送重复通知
- 用于促销广告
- 插件首次安装后用户收集用户反馈
- 没有必要的操作还硬加按钮

### 进度通知

当你需要展示一个不知何时才能完成的任务进度时（比如：初始化环境），你可以使用进度通知。这种类型的通知应该作为当前上下文（在视图或者编辑器内）处理进度通知类型的最后手段。

✔建议
- 提供一个查看详情的链接（比如进度日志）
- 处理过程中给出信息（比如：初始化、构建，等等）
- 提供取消操作（如果可用的话）
- 如果有超时场景，提供倒计时

❌  不要
- 不销毁进度通知

![Progress notification](https://code.visualstudio.com/assets/api/references/guidelines/notification-progress.png)

*这个例子演示了远程连接初始化时的进度通知，它同时也提供了输出日志（details）*

## 视图

[视图](/references/contribution-points#contributesviews)是内容的容器，它们会出现在注入侧边栏或者面板这样的地方。视图可以包含树视图或者自定义视图，这些视图可以包含视图操作。视图可被用户调整位置，比如放到其他视图、活动栏和面板中。请控制你的视图数量以便其他插件的视图还有空间展示。

✔建议
- 如果可以的话，使用现有的图标
- 为语言文件使用文件图标
- 用树视图展示数据
- 为每个视图提供活动栏图标
- 控制视图数量最小化
- 控制名称长度最小化
- 克制地使用自定义 webview 视图

❌  不要
- 对已有功能重新造轮子
- 使用树视图项作为唯一的操作入口（如，搜索栏）
- 非必要的情况下也使用自定义 webview
- 在编辑器中使用视图容器装载 webview

![Views example](https://code.visualstudio.com/assets/api/references/guidelines/views-example.png)

*这个例子使用了树视图展示一组测试的测试状态。每种测试结果都有其唯一图标类型与之对应。*

### 视图位置

视图可被放在[现有的视图容器](/references/contribution-points#contributesviews)中，比如文件管理器、源管理器(SCM)和调试视图容器中。你也可以在活动栏中添加自定义视图容器，然后再往里添加视图。另外，视图可被添加到任何面板或者他们自己所属的自定义视图容器中。

![View locations](https://code.visualstudio.com/assets/api/references/guidelines/views-locations.png)

### 视图容器

[视图容器](/references/contribution-points#contributesviewsContainers)是活动栏的一部分，每个容器都有其独有的图标。

![View Container](https://code.visualstudio.com/assets/api/references/guidelines/view-container.png)

这个例子用了一个边框图标来展示自定义视图容器。

### 视图中的进度条

如果你的视图在 源(SCM)视图容器中，你也可以[显示进度条](https://code.visualstudio.com/api/references/vscode-api#ProgressLocation)

### 欢迎视图

当视图没有任何内容时，你可以[添加一些内容来引导用户](/references/contribution-points#contributesviewsWelcome)如何使用你的插件。欢迎视图支持链接和图标。

✔建议
- 仅在必要时使用欢迎视图
- 如有需要可使用链接而不是按钮
- 按钮仅用于基础性的操作
- 描述清楚链接指向
- 控制内容的长度
- 控制欢迎视图的数量
- 控制视图中的按钮数量

❌  不要
- 非必要的场景中也使用按钮
- 将欢迎视图当成销售页面
- 每个链接的标题都叫"查看更多"

![Welcome Views](https://code.visualstudio.com/assets/api/references/guidelines/welcome-views.png)

这个例子使用了一个基础按钮，其他视图则包含了期待用户知晓的具体文档链接。

## Webviews
如果你需要展示的自定义功能超出了VS Code API 的能力，那么你可以使用完全可定制的 [webview](/extension-guides/webview)。再次提示开发者：仅在必要时使用 webview。

✔建议
- 仅在绝对必要时使用 webview
- 在合适的场景中启动你的插件
- 为激活窗口打开 webview
- 确保视图中的所有元素都是可定制主题的（查看 [webview-view-sample](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/media/main.css)和[color tokens](/references/theme-color)文档）
- 确保你的视图遵循[可访问性指南](https://code.visualstudio.com/docs/editor/accessibility)(色彩对比度、ARIA 标签、键盘导航)
- 在视图的工具区使用命令操作

❌  不要
- 用于广告宣传（包括升级、捐助等等）
- 作为插件的向导页面
- 在所有窗口中打开
- 插件升级后打开（请使用通知）
- 添加和编辑器或者工作区无关的功能
- 重复发明轮子（比如：欢迎页、设置、配置等等）

### 例子

**浏览器预览**
这个插件在编辑器旁边打开了一个浏览器效果预览
![Weview Sample - Browser](https://code.visualstudio.com/assets/api/references/guidelines/webview-browser.png)

**Pull Request**
这个插件为自定义树视图中的工作区仓库展示了一个 Pull Request 页面，它用 webview 显示了 PR 的详细信息。

**初次使用培训**
这个插件打开了一个快速启动页面，它包含了有用的操作、链接和更多信息。这个 Webview 仅仅在用户首次打开特定文件时展示，帮助用户检查是否遵循了特定步骤（比如安装或创建一个文件时）。

![Webview Sample - Onboarding](https://code.visualstudio.com/assets/api/references/guidelines/webview-onboarding.png)

### webview 视图

你可以在任意视图容器（侧边栏和面板）中添加 webview，这样的 webview 被称为 [webview 视图](https://code.visualstudio.com/api/references/vscode-api#WebviewView)。它的使用方式和常规的 webview 是一样的。

![Webview View](https://code.visualstudio.com/assets/api/references/guidelines/webview-view.png)

这个 webview 视图内容展示了创建一个 PR 所需的下拉菜单、输入框和按钮。

## 状态栏

[状态栏](/extension-capabilities/extending-workbench#状态栏项)位于 VS Code 工作台底部，用于展示和你的工作区相关的信息和操作。状态栏项分为两类：基础的（左）和次级的（右）。状态栏中和整个工作区（状态、问题/警告、同步状态）相关的位于左边，次级状态或者上下文相关的（语言、间距、反馈）处于右边。注意控制添加的状态栏项目数，为其他插件腾出空间。

✔建议
- 使用短的文本标签
- 仅在必要时使用图标
- 使用语义清晰的图标
- 把首要（全局）项目放在左边
- 把次要（上下文）项目放在右边

❌  不要
- 添加自定义颜色
- 添加的图标数量在 1 个以上（除非必要）
- 添加的状态栏项数量在 1 个以上（除非必要）

![Status Bar Item](https://code.visualstudio.com/assets/api/references/guidelines/statusbar-item.png)

*这个例子中，状态栏项的信息和整个工作区相关，所以展示在左边*

### 进度状态栏项目
当需要展示静默进度（进度在后台处理）时，建议用带有加载图标（你可以添加旋转动画）的状态栏项来展示。如果进度状态是需要用户注意到的，我们建议你将其提升到通知维度。

![Status Bar Progress](https://code.visualstudio.com/assets/api/references/guidelines/status-bar-progress.png)

*这个例子中，状态栏展示静默进度*

### 错误状态栏项
如果你需要展示的项目出于警示目的需要高亮，你可以使用错误状态栏项。请将错误状态栏项作为特殊场景下的最后手段。
![Status Bar Error](https://code.visualstudio.com/assets/api/references/guidelines/status-bar-error.png)

*这个例子中，错误状态栏项展示了文件中的代码错误*

## 快速选择

[快速选择](/extension-capabilities/common-capabilities#quick-pick)是一个展示操作和接受用户输入的简易手段。在选择配置、过滤内容或者从列表中挑选项目时尤为有用。
![Quick Pick](https://code.visualstudio.com/assets/api/references/guidelines/quickpick.png)

*快速选择可以包含非常多的选项。而且选项可以由图标、详情和标签组成，而且还包括默认项。在这个例子的顶部，你可以看到多步骤模式下的后退、恢复和前进等操作。*

✔建议
- 使用语义清晰的图标
- 使用具体的描述展示当前项（如果需要的话）
- 使用详情提供额外（简短）的说明
- 在需要多选输入的场景中使用多步骤模式（比如：初始化向导）
- 提供一个创建更多的选项（如果需要的话）

❌  不要
- 重复造轮子
- 多种选项公用一个图标
- 列表中超过 6 种图标

## 编辑器操作
编辑器的工具区会展示[编辑器操作](/references/contribution-points#contributescommands)。你可以添加图标作为快速操作，或者在悬浮菜单中添加菜单项（...）。

✔建议
- 在特定上下文场景中展示操作
- 尽量使用内置图标库中的图标
- 悬浮菜单中的项目应作为二级操作

❌  不要
- 添加多类图标
- 添加自定义颜色
- 使用 emoji

![Editor Actions](https://code.visualstudio.com/assets/api/references/guidelines/editor-actions.png)

*仅在 HTML 页面中展示这个图标来表示加载页面预览*

## 上下文菜单

[菜单项](/references/contribution-points#contributesmenus)会展示在视图、操作、右击菜单中。要额外注意菜单组中的菜单项要保持其一致性。如果你的插件操作和文件相关，请将操作配置到文件管理器菜单中（适时）。如果插件是针对特定文件类型的，请仅仅在此类场景中展示操作。

✔建议
- 当场景合适时才展示操作
- 相似操作分组
- 一个组中的操作过多时，使用子菜单

❌  不要
- 在所有场景中都展示操作

![Context Menu](https://code.visualstudio.com/assets/api/references/guidelines/context-menu.png)

*将 **Copy Github Link** 和其他复制命令放在一起。这个操作只会在 GitHub 仓库项目中可用*

## 设置

[设置](/references/contribution-points#contributesconfiguration)是用户配置插件的入口。设置可以是输入框、布尔值、下拉菜单、列表、键值对。如果你的插件要求用户配置特定设置，你可以打开设置 UI 然后用设置 ID 查询你的插件设置。

✔建议
- 为每项设置添加默认值
- 为每项设置添加清晰的描述
- 为复杂设置添加文档链接
- 为相关设置添加链接
- 当用户需要配置特定设置项时，提供设置 ID 链接

❌  不要
- 创建你自己的设置页面/webview
- 使用超长的描述

![Settings](https://code.visualstudio.com/assets/api/references/guidelines/settings.png)

*使用设置 ID 链接到特定设置项上*

## 命令面板

[命令面板](/references/contribution-points#contributescommands)可以找到所有命令。注意：为你的命令使用清晰的名称和标签，便于用户查找。

✔建议
- 必要时添加快捷键
- 为命令添加清晰的名字
- 为同类命令分组

❌  不要
- 重写已有的快捷键
- 命名命令时使用 emoji

![Command Palette](https://code.visualstudio.com/assets/api/references/guidelines/command-palette.png)

*命令被分组到 "Debug" 类目中， 而且每个命令都有清晰的名字，少部分命令有其快捷键*