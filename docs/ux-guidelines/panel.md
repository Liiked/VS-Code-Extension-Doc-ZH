
# 面板（Panel）

面板充当显示[视图容器](/references/contribution-points#contributes.viewsContainers)的另一个主要区域。

**✔️ 应该**

- 在面板中展示向水平空间延伸的视图
- 用于提供辅助功能的视图

**❌ 不应该**

- 用于本应始终可见的视图，因为用户经常会最小化面板
- 渲染自定义 Webview 内容，而且在被拖到其他视图容器（如主侧边栏或次侧边栏）时无法正确调整大小/重排。

![面板示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel.png)

## 面板工具栏

面板工具栏会展示当前所选视图的选项。例如，终端视图展示了添加新终端、拆分视图布局等[视图操作](/extension-guides/tree-view#view-actions)。切换到问题视图会展示另一组不同的操作。与[侧边栏工具栏](/ux-guidelines/sidebars#sidebar-toolbar)类似，只有在只有一个视图时，工具栏才会渲染。如果使用多个视图，每个视图都会渲染自己的工具栏。

**✔️ 应该**

- 如果可用，使用现有的[产品图标](/references/icons-in-labels#icon-listing)
- 提供清晰、有用的工具提示

**❌ 不应该**

- 不要添加过多的图标按钮。如果某个特定按钮需要更多选项，请考虑使用[上下文菜单](/references/contribution-points#contributes.menus)。
- 不要使用重复默认的面板图标（折叠/展开、关闭等）

![带有单个视图的面板工具栏示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel-toolbar.png)

*在此示例中，面板中渲染的单个视图会将其视图操作渲染在主面板工具栏中。*

![带有多个视图的面板工具栏示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel-toolbar-multiple-views.png)

*在此示例中，使用了多个视图，因此每个视图都会暴露自己特定的视图操作。*

## 链接

- [视图容器配置点](/references/contribution-points#contributes.viewsContainers)
- [视图配置点](/references/contribution-points#contributes.views)
- [视图操作插件指南](/extension-guides/tree-view#view-actions)
