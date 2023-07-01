# 侧边栏

首要和次要侧边栏都可以包含[视图容器](../ux-guidelines/views.md#视图容器)，不论视图容器内有只有一个 [视图](../ux-guidelines/views.md) 或是多个视图。插件可以将视图配置到现有视图容器中（比如资源管理器），也可以配置出一个全新的视图容器。

✔**️推荐**

- 将相关视图和内容整理成组
- 使用清晰、易懂的视图、视图容器名称

❌**不推荐**

- 使用大量视图容器。大部分插件一般只需要一个视图容器（比如在侧边栏注册很多视图的插件就已经足够特别了）就够了。
- 使用大量视图（大部分屏幕尺寸能够比较舒服地展示3-5个视图）
- 使用一个简单的命令就能把内容添加到侧边栏
- 重复造轮子

![sidebars](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebars.png)

## 首要侧边栏

许多插件都选择把视图/视图容器配置到首页侧边栏，因为首要侧边栏的内容可见性很高。但是你要认真想想要不要把内容放在这，在这配置太多视图只会让用户觉得凌乱和混乱。

![primary-sidebar](https://code.visualstudio.com/assets/api/ux-guidelines/examples/primary-sidebar.png)

## 次要侧边栏

正如其名，次要侧边栏一般作为视图的备用展示位置。当插件无法直接配置视图时，用户可以从首要视图中拖动视图、面板到这来，以便于他们自定义布局。

![secondary-sidebar](https://code.visualstudio.com/assets/api/ux-guidelines/examples/secondary-sidebar.png)

## 侧边栏工具条

侧边栏的视图容器中超过一个以上的视图时，默认会在侧边栏的工具栏上展示一个 `...` 图标按钮，它可用于展示和隐藏每个视图。看起来像这样：

![sidebar-toolbar-default](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebar-toolbar-default.png)

不过，如果只有一个视图，侧边栏则会自动合并视图UI，并且使用 侧边栏上的工具栏 渲染该视图的所有操作。在展示 `...` 按钮的地方，“Notes” 视图展示了两个操作。 

![sidebar-toolbar-actions](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebar-toolbar-actions.png)

至于其他工具栏，你也要注意不要添加太多的操作，减少割裂感和混乱。可以的话，最好使用具有描述性的命令名称配以已有的产品图标。

## 相关资源

- [视图容器配置](../references/contribution-points.md#contributesviewscontainers)
- [视图配置](../references/contribution-points.md#contributesviews)
- [视图操作插件指南](../extension-guides/tree-view.md#视图操作)
- [欢迎视图配置](../references/contribution-points.md#contributesviewswelcome)
- [树视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)
- [Webview View 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
- [Welcome View 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/welcome-view-content-sample)