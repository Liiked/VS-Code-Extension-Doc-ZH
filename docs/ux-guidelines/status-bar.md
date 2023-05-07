# 状态栏

[状态栏](../extension-capabilities/extending-workbench.md#状态栏项)位于 VS Code 工作台底部，它会展示和你的工作区相关的信息和操作。其中的子项会被分成两组：主要（左边）和次要（右边）。整个工作区（状态、问题/警告，同步）相关的子项在左边，和上下文（语言、间距、反馈）相关的子项在右边。控制添加子项的量，因为其他插件也会在该区域配置内容。

![status-bar](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar.png)

✔**️推荐**

- 使用简短的文本标签
- 必要时才使用图标
- 所使用的图标要能够清晰地传达含义
- 将主要的（全局相关的）子项放在左边
- 将次要的（上下文相关的）子项放在右边

❌**不推荐**

- 使用自定义颜色
- 图标数量大于1（除必要时）
- 子项数量大于1（除必要时）

## 状态栏子项

![status-bar-item](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-item.png)

上述例子展示了 *Github Pull Requests and Issues 插件配置的子项*。它和整个工作区相关，所以放在左侧。

### 带进度的状态栏子项

如需展示不太显眼的进度（后台进度），推荐展示一个带加载图标（你也可以添加旋转动画）的子项。如需展示让用户注意到的进度，我们推荐你放到 **进度通知** 中去。

![status-bar-progress](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-progress.png)
上述例子展示了一个不太引人注目的状态栏进度子项

### 错误和警告状态栏子项

如需展示高度可见的警告或错误，你可以给状态栏子项配置背景色。应将该方法作为状态栏突出展示特殊情况的最终手段。

![status-bar-error](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-error.png)
上述例子使用了错误状态栏子项来展示文件中导致插件停用的错误

![status-bar-warning](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-warning.png)
上述例子使用了警告状态栏子项来展示文件中的警告

## 相关资源
- [Status Bar Item API 参考](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem)
- [Status Bar 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/statusbar-sample)