
# UX 指南

这些指南涵盖了在 VS Code 中创建符合原生界面和无缝集成交互模式插件的最佳实践。在这些指南中，你将看到：

- VS Code 整体 UI 架构和元素的概述
- 插件配置 UI 的推荐做法和示例
- 相关指南和示例的链接

在深入细节之前，了解 VS Code 的各个架构性 UI 部分如何组合在一起，以及你的插件如何以及在何处进行配置，是非常重要的。

## 容器（Containers）

VS Code 界面大致可以分为两个主要概念：**容器（containers）**和**条目（items）**。一般来说，容器可以看作是 VS Code 界面中渲染一个或多个条目的较大区域：

[![Visual Studio Code 容器元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png)

### 活动栏（Activity Bar）

[活动栏](/ux-guidelines/activity-bar)是 VS Code 中的核心导航界面。插件可以向活动栏配置条目，这些条目充当[视图容器（View Containers）](/references/contribution-points#contributes.viewsContainers)，在主侧边栏中渲染[视图（Views）](/ux-guidelines/views)。

### 主侧边栏（Primary Sidebar）

[主侧边栏](/ux-guidelines/sidebars#primary-sidebar)渲染一个或多个[视图](/ux-guidelines/views)。活动栏和主侧边栏紧密耦合。点击已配置的活动栏条目（即视图容器）会打开主侧边栏，其中会渲染与该视图容器关联的一个或多个视图。一个具体的例子是资源管理器（Explorer）。点击资源管理器条目会打开主侧边栏，其中可以看到文件夹、时间线（Timeline）和大纲（Outline）视图。

### 次级侧边栏（Secondary Sidebar）

[次级侧边栏](/ux-guidelines/sidebars#secondary-sidebar)也作为渲染带有视图的视图容器的界面。用户可以将终端或问题（Problems）视图等视图拖到次级侧边栏，以自定义其布局。

### 编辑器（Editor）

编辑器区域包含一个或多个编辑器组。插件可以配置[自定义编辑器](/references/contribution-points#contributes.customEditors)或 [Webview](/extension-guides/webview) 在编辑器区域中打开。它们还可以配置[编辑器操作](/ux-guidelines/editor-actions)，在编辑器工具栏中暴露额外的图标按钮。

### 面板（Panel）

[面板](/ux-guidelines/panel)是暴露视图容器的另一个区域。默认情况下，终端、问题和输出等视图在面板中一次只能在一个选项卡中查看。用户也可以像在编辑器中一样，将视图拖入拆分布局。此外，插件可以选择将视图容器专门添加到面板，而不是活动栏/主侧边栏。

### 状态栏（Status Bar）

[状态栏](/ux-guidelines/status-bar)提供关于工作区和当前活动文件的上下文信息。它渲染两组[状态栏条目](/ux-guidelines/status-bar#status-bar-items)。

## 条目（Items）

插件可以向上面列出的各种容器添加条目。

[![Visual Studio Code 容器元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-sections.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-sections.png)

### 视图（View）

[视图](/ux-guidelines/views)可以以[树视图](/ux-guidelines/views#tree-views)、[欢迎视图](/ux-guidelines/views#welcome-views)或 [Webview 视图](/ux-guidelines/webviews#webview-views)的形式配置，并且可以被拖到界面的其他区域。

### 视图工具栏（View Toolbar）

插件可以暴露特定于视图的[操作](/ux-guidelines/views#view-actions)，这些操作会以按钮形式出现在视图工具栏上。

### 侧边栏工具栏（Sidebar Toolbar）

作用域为整个视图容器的操作也可以暴露在[侧边栏工具栏](/ux-guidelines/sidebars#sidebar-toolbars)中。

### 编辑器工具栏（Editor Toolbar）

插件可以直接在编辑器工具栏中配置作用域为编辑器的[编辑器操作](/ux-guidelines/editor-actions)。

### 面板工具栏（Panel Toolbar）

[面板工具栏](/ux-guidelines/panel#panel-toolbar)可以暴露作用域为当前所选视图的选项。例如，终端视图暴露了添加新终端、拆分视图布局等操作。切换到问题视图会暴露另一组不同的操作。

### 状态栏条目（Status Bar Item）

在左侧，[状态栏条目](/ux-guidelines/status-bar#status-bar-items)作用域为整个工作区。在右侧，条目作用域为活动文件。

## 通用 UI 元素

### 命令面板（Command Palette）

插件可以配置出现在[命令面板](/ux-guidelines/command-palette)中的命令，以快速执行某些功能。

[![命令面板元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)

### 快速选择（Quick Pick）

[快速选择](/ux-guidelines/quick-picks)以多种不同方式捕获用户的输入。它们可以要求单项选择、多项选择，甚至自由格式的文本输入。

![快速选择元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick.png)

### 通知（Notifications）

[通知](/ux-guidelines/notifications)用于向用户传达信息、警告和错误消息。它们也可以用于指示进度。

![通知元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification.png)

### Webview

[Webview](/ux-guidelines/webviews)可以用于显示超出 VS Code“原生”API 的用例的自定义内容和功能。

![Webview 元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview.png)

### 上下文菜单（Context Menus）

与命令面板固定的位置不同，[上下文菜单](/ux-guidelines/context-menus)让用户能够从特定位置执行操作或配置某些内容。

![上下文菜单元素的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/context-menu.png)

### 入门向导（Walkthroughs）

[入门向导](/ux-guidelines/walkthroughs)通过包含丰富内容的多步骤清单，为用户提供一致的插件上手体验。

![入门向导 API 的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/walkthrough.png)

### 设置（Settings）

[设置](/ux-guidelines/settings)让用户能够配置与插件相关的选项。

![设置页面的概览](https://code.visualstudio.com/assets/api/ux-guidelines/examples/settings.png)
