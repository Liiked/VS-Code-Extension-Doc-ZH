
# 侧边栏（Sidebars）

主侧边栏和次侧边栏由一个或多个由[视图容器](/ux-guidelines/views#view-containers)配置的[视图](/ux-guidelines/views)组成。插件可以向现有的视图容器（例如资源管理器）配置视图，也可以配置一个全新的视图容器。

**✔️ 应该**

- 将相关的视图和内容组成组
- 为视图容器及其视图使用清晰、描述性的名称

**❌ 不应该**

- 使用过多的视图容器。单个视图容器（例如带有该插件特有视图的侧边栏）通常对大多数插件来说就足够了
- 使用过多的视图（3-5 个是大多数屏幕尺寸舒适的极限）
- 向侧边栏添加简单命令即可处理的内容
- 重复现有功能

![两个侧边栏的示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebars.png)

## 主侧边栏

鉴于主侧边栏能给予内容很高的可见性，许多插件选择向主侧边栏配置视图和/或视图容器。在这里添加内容时请谨慎判断——过多的配置 UI 可能会导致杂乱无章的体验，让用户感到困惑。

![主侧边栏的示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/primary-sidebar.png)

## 次要侧边栏

顾名思义，次要侧边栏通常被视为视图的辅助位置。虽然默认情况下插件不能直接向它配置视图，但用户可以从主侧边栏或面板拖拽视图来自定义其布局。

![次要侧边栏的示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/secondary-sidebar.png)

## 侧边栏工具栏

默认情况下，侧边栏中具有多个视图的视图容器会在侧边栏工具栏中显示一个 `...` 图标按钮，用于显示和隐藏每个视图。看起来大致是这样的：

![带有两个视图的侧边栏](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebar-toolbar-default.png)

不过，如果只使用一个视图，侧边栏会自动整合 UI，使用侧边栏工具栏来渲染该视图的所有操作。在 `...` 按钮的位置，会渲染与“Notes”视图关联的两个操作：

![带有单个视图和带操作工具栏的侧边栏](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebar-toolbar-actions.png)

与其他工具栏一样，注意不要添加太多操作，以减少杂乱和困惑。如果可能，请使用现有的产品图标，并配上描述性的命令名称。

## 链接

- [视图容器配置点](/references/contribution-points#contributes.viewsContainers)
- [视图配置点](/references/contribution-points#contributes.views)
- [视图操作插件指南](/extension-guides/tree-view#view-actions)
- [欢迎视图配置点](/references/contribution-points#contributes.viewsWelcome)
- [树视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)
- [Webview 视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
- [欢迎视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/welcome-view-content-sample)
