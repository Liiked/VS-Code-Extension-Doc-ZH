
# 视图（Views）

[视图](/references/contribution-points#contributes.views)是可以出现在侧边栏或面板中的内容容器。视图可以包含树视图、欢迎视图或 Webview 视图，也可以显示视图操作。视图还可以由用户重新排列，或移动到另一个视图容器（例如，从主侧边栏移到次侧边栏）。限制创建的视图数量，因为其他插件也可以配置到同一个视图容器。

**✔️ 应该**

* 尽可能使用现有图标
* 对语言文件使用文件图标
* 使用树视图显示数据
* 为每个视图添加图标（以防它被移动到活动栏或次侧边栏——两者都使用图标来表示视图）
* 将视图数量保持在最少
* 将名称长度保持在最短
* 限制自定义 Webview 视图的使用

**❌ 不应该**

* 重复现有功能
* 将树条目用作单个操作项（例如，单击时触发命令）
* 在不必要时使用自定义 Webview 视图
* 使用活动栏条目（视图容器）在编辑器中打开 Webview

![视图示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view.png)

*此示例使用树视图显示树视图条目的平面列表。*

## 视图位置

视图可以放置在[现有的视图容器](/references/contribution-points#contributes.views)中，例如文件资源管理器、源代码管理（SCM）和调试视图容器。它们也可以通过活动栏添加到自定义[视图容器](/ux-guidelines/views#view-containers)中。此外，视图可以添加到面板中的任何视图容器。它们也可以被拖到次侧边栏。

![视图位置](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-locations.png)

## 视图容器

视图容器，顾名思义，是渲染视图的“父级”容器。插件可以向[活动栏](/ux-guidelines/activity-bar)/[主侧边栏](/ux-guidelines/sidebars)或面板配置自定义视图容器。用户可以将整个视图容器从活动栏拖到面板（反之亦然），也可以移动单个视图。

![视图容器示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-container.png)

*这是放置在活动栏/主侧边栏中的视图容器示例*

![面板中的视图容器示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-container-panel.png)

*这是放置在面板中的视图容器示例*

## 树视图

树视图是在视图中显示内容的强大而灵活的格式。插件可以添加从简单的平面列表到深层嵌套树的所有内容。

* 使用描述性标签为条目提供上下文（如果适用）
* 使用产品图标区分条目类型（如果适用）

**❌ 不应该**

* 将树视图条目用作触发命令的按钮
* 除非必要，否则避免深层嵌套。多数情况下，有个几层文件夹/条目就是一个平衡的视觉方案。
* 为一个条目添加超过三个操作

![树视图示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/tree-view.png)

## 欢迎视图

当视图为空时，你可以[添加内容来引导用户](/references/contribution-points#contributes.viewsWelcome)了解如何使用你的插件或如何开始。欢迎视图支持链接和图标。

**✔️ 应该**

* 仅在必要时使用欢迎视图
* 尽可能使用链接而不是按钮
* 仅对主要操作使用按钮
* 使用清晰的链接文本以指示链接目标
* 限制内容的长度
* 限制欢迎视图的数量
* 限制视图中的按钮数量

**❌ 不应该**

* 在不必要时使用按钮
* 将欢迎视图用于推广
* 使用通用的“read more”作为链接文本

![欢迎视图](https://code.visualstudio.com/assets/api/ux-guidelines/examples/welcome-view.png)

*此示例为插件显示一个主要操作，并附有一个指向文档的链接。*

## 带进度的视图

你也可以通过引用视图的 ID 在视图中[显示进度](https://code.visualstudio.com/api/references/vscode-api#ProgressLocation)。

![带进度的视图](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-with-progress.png)

## 视图操作

视图可以在视图工具栏上暴露[视图操作](/extension-guides/tree-view#view-actions)。注意不要添加太多操作，以免造成噪音和困惑。使用内置的产品图标有助于插件与原生 UI 融为一体。不过，如果需要自定义图标，也可以提供 SVG 图标。

![视图操作示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-toolbar.png)

## 链接

* [视图容器 API 参考](/references/contribution-points#contributes.viewsContainers)
* [视图 API 参考](/references/contribution-points#contributes.views)
* [视图操作插件指南](/extension-guides/tree-view#view-actions)
* [树视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)
* [欢迎视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/welcome-view-content-sample)
* [Webview 视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
