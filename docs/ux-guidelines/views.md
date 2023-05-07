# 视图

视图 是可显示在侧边栏或面板中展示内容的容器。视图可包含树视图、欢迎视图或 Webview 视图，而且视图可以展示视图操作。用户可将视图进行调整或移动到其他视图容器中（比如，从首要侧边栏移动到次要侧边栏）。控制插件所需的视图数量，因为其他插件也可能在同一个视图容器中配置视图。

✔**️推荐**

- 最好使用现成图标
- 语言文件请使用文件图标
- 用树视图展示数据
- 给每个视图都添加图标（以防该视图被移动到活动栏或者次要侧边栏——这两个容器都需要图标才能展示视图）
- 保证视图数量最小化
- 保证视图名称精简
- 尽可能不使用自定义 Webview 视图

❌**不推荐**

- 重复造轮子
- 把树视图子项当做操作按钮（比如，每点击一下触发一个命令）
- 不必要的情况下也使用 Webview 视图
- 用 活动栏子项（视图容器）在编辑器中打开 Webview

![view](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view.png)

上述示例使用了 **树视图** 来展示扁平的 **树视图子项** 列表

## 视图位置

视图可放置在 [可见的视图容器](../references/contribution-points.md#contributesviews)中，比如资源管理器，源代码管理（SCM）和调试视图容器中。它们也可通过活动栏添加到自定义视图容器中。另外，视图可放置在 **面板** 的任何视图容器中。它们也可被拖动到次要侧边栏中。

![view-locations](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-locations.png)

## 视图容器

视图容器，就如其名，是 视图 所要渲染的 “父级” 容器。插件可为 [活动栏](./activity-bar.md)、[首要侧边栏](./sidebars.md)、[面板](./panel.md) 配置自定义视图容器。用户可从活动栏将整个自定义视图容器拖动到面板（或其他区域）中，也可以单独移动视图。

![view-container](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-container.png)
放在活动栏/首要侧边栏中的一个视图容器

![view-container-panel](https://code.visualstudio.com/assets/api/ux-guidelines/examples/view-container-panel.png)
面板中的视图容器

## 树容器

树视图是一类非常强大和灵活的视图。插件可以展示从简单的列表到深度嵌套的树任意内容。

✔**️推荐**
- 如果可以的话，给列表中的每一项都使用描述性标签
- 如果可以的话，使用产品图标区分不同的列表项类型

❌**不推荐**
- 把树视图子项当做按钮来触发各类命令
- 如非必要，避免深度嵌套。针对大部分场景，少量的文件夹/子项级别就可取得平衡
- 每个子项的操作（功能）超过3个

![tree-view](https://code.visualstudio.com/assets/api/ux-guidelines/examples/tree-view.png)

## 欢迎视图

## 带进度条的视图

## 视图操作

## 相关资源