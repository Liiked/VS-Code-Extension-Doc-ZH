# 面板

面板是另一个展示 [视图容器]() 的主要区域

✔**️推荐**

- 在面板中渲染的视图可更加充分地利用横向空间
- 最好给提供功能的视图使用

❌**不推荐**

- 由于用户经常会最小化面板，所以不推荐那些需要长时间可见的视图使用
- 渲染无法正确调整大小、重绘的自定义 Webview 内容，比如当拖拽视图到其他视图容器(像首要、次要侧边栏)时

![panel](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel.png)

## 面板工具栏

面板工具栏会把当前选中的视图操作暴露给用户使用。比如 **终端** 视图会暴露添加新终端、拆分终端等视图操作。切换到 **问题** 视图时，则会暴露其他一系列操作。类似于 [侧边栏工具条](./sidebars.md#侧边栏工具条)，工具条只会在只有一个视图时才出现，如果使用了一个以上的视图，则每个视图会渲染它自己的工具条。

✔**️推荐**

- 如果可以的话，最好使用现有的[产品图标]()
- 提供清晰、有用的帮助提示

❌**不推荐**

- 不要添加太多图标和按钮，如果功能太多可考虑使用上下文菜单
- 不要重复使用默认面板图标（收起/展开、关闭等）

![panel-toolbar](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel-toolbar.png)
上述例子中，面板中的单一视图会把它的视图操作渲染在主面板的工具栏中

![panel-toolbar-multiple-views](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel-toolbar-multiple-views.png)
上述例子中，使用了多个视图，所以每个视图都会有自己的视图操作工具栏

## 相关资源

- [视图容器配置](../references/contribution-points.md#contributesviewscontainers)
- [视图配置](../references/contribution-points.md#contributesviews)
- [视图操作插件指南](../extension-guides/tree-view.md#视图操作)