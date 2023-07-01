# UX 指南

这些指南会涉及创建与 VS Code 无缝集成的插件创作最佳实践。你将阅读到以下内容：

- VS Code 整体 UI 架构和元素
- 插件配置 UI 的推荐方式和示例
- 相关指南和示例的链接

深入细节之前，你需要掌握 VS Code 各种各样的 UI 组件是怎么组织起来的，以及你的插件应该如何配置。

## 容器

VS Code 交互界面可以粗略地划分为两个主要概念：**容器** 和 **视图子项**，你可以把容器当做是 VS Code 用于组合和渲染一个或多个交互视图的区块。

![architecture-containers](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png)

### 活动栏
活动栏是 VS Code 界面中的核心导航区。插件可以在活动栏配置子项，比如可以在次要侧边栏渲染[视图](../ux-guidelines/views.md)的 [视图容器](../references/contribution-points.md#contributesviewscontainers)。

### 主要侧边栏

[主要侧边栏](../ux-guidelines/sidebars.md) 可渲染一个或多个[视图](../ux-guidelines/views.md)。活动栏和主要侧边栏经常配合使用。点击一个配置好的活动栏按钮时（阅读：视图容器）会打开主要侧边栏中与之相关的视图容器。具体的例子如 资源管理器，点击资源管理器的时会打开主要侧边栏，然后展示出与之相关的文件夹、时间线、大纲视图等。

### 次要侧边栏

[次要侧边栏](../ux-guidelines/sidebars.md#次要侧边栏)也是一种渲染视图的手段。用户可将 **终端、问题** 等视图拖动到次要侧边栏来定制化他们的布局。

### 编辑器

编辑器区域可包含一或多的编辑器组。插件可在编辑器区域打开 [自定义编辑器](../references/contribution-points.md#contributescustomeditors) 或 [Webview](../extension-guides/webview.md)。你也可以配置 [编辑器操作](../ux-guidelines/editor-actions.md) 在编辑器工具栏上展示更多图标按钮。

### 面板

[面板](../ux-guidelines/panel.md)也是一个容纳 *视图容器* 的区域。像 终端、问题、输出 等视图会在面板中单独展示。用户可以拖动视图来切分布局就像操作编辑器布局一样。

### 状态栏

[状态栏](../ux-guidelines/status-bar.md) 提供工作区和当前文件有关的情景信息。它由两组 [状态栏子项](../ux-guidelines/status-bar.md#状态栏子项) 组成。

## 子项

插件可给容器添加各类子项，如下图所示：

![architecture-sections](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-sections.png)

### 视图

视图可配置在 [树视图](../ux-guidelines/views.md#树视图)、[欢迎视图](../ux-guidelines/views.md#欢迎视图)或 [Webview 视图](../ux-guidelines/webviews.md#webview-视图)中，而且可拖动到界面的其他区域。

### 视图工具栏

插件可在视图工具栏上暴露特定的视图[操作](../ux-guidelines/views.md#视图操作)，如按钮。

### 侧边栏工具条

对整个视图容器生效的操作，可放置在 [侧边栏工具条](../ux-guidelines/sidebars.md#侧边栏工具条) 中。

### 编辑器工具栏

插件可在编辑器工具栏上直接配置对某个编辑器生效的 [编辑器操作](../ux-guidelines/editor-actions.md)。

### 面板工具栏

[面板工具栏](../ux-guidelines/panel.md#面板工具栏) 配置对当前已选视图的操作。比如 终端视图 可配置新建终端、拆分布局等等操作。切换到 问题视图 又可以展示出其他操作。

### 状态栏子项

状态栏左侧，[状态栏子项](../ux-guidelines/status-bar.md#状态栏子项) 是与整个工作区相关的内容。右侧则是与当前文件相关的内容。

## 常见 UI 元素

### 命令面板

插件可配置展示在 [命令面板](../ux-guidelines/command-palette.md) 中的命令来快速执行某些功能。

![command-palette](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)

### 快速选择

[快速选择](../ux-guidelines/quick-picks.md)会通过不同的方式捕获用户的输入，如单选、多选或自由的文本输入。

![quick-pick](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick.png)

### 通知

[通知](../ux-guidelines/notifications.md) 常用于给用户展示信息、警告和错误，也可用来提示进度。

![notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification.png)

### Webview

[Webview](../ux-guidelines/webviews.md) 用于展示自定义内容和功能，比如某些超出 VS Code 原生能力的内容。

![webview](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview.png)

### 上下文菜单

与命令面板始终在一个位置使用不同，[上下文菜单](../ux-guidelines/context-menus.md)让用户在特定位置执行某些操作或配置。

![context-menu](https://code.visualstudio.com/assets/api/ux-guidelines/examples/context-menu.png)

### 引导

可通过 [引导](../ux-guidelines/walkthroughs.md) 的多步骤清单和富文本内容为落地用户提供连贯的体检

![walkthrough](https://code.visualstudio.com/assets/api/ux-guidelines/examples/walkthrough.png)

### 设置

设置 可让用户配置插件

![settings](https://code.visualstudio.com/assets/api/ux-guidelines/examples/settings.png)

# 相关资源

- [视图容器 API 参考](../references/contribution-points.md#contributesviewscontainers)
- [视图 API 参考](../references/contribution-points.md#contributesviews)
- [视图操作插件指南](../extension-guides/tree-view.md#视图操作)
- [树视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)
- [欢迎视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/welcome-view-content-sample)
- [Webview 视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)