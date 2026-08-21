
# 状态栏（Status Bar）

[状态栏](/extension-capabilities/extending-workbench#status-bar-item)位于 VS Code 工作台的底部，显示与你的工作区相关的信息和操作。条目分为两组：主要（左侧）和次要（右侧）。与整个工作区相关的条目（状态、问题/警告、同步）放在左侧，次要或上下文的条目（语言、间距、反馈）放在右侧。限制添加的条目数量，因为其他插件也会配置到同一区域。

![状态栏示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar.png)

**✔️ 应该**

* 使用简短的文本标签
* 仅在必要时使用图标
* 应使用语义清晰的图标
* 将主要（全局）条目放在左侧
* 将次要（上下文）条目放在右侧

**❌ 不应该**

* 添加自定义颜色
* 添加多个图标（除非必要）
* 添加多个条目（除非必要）

## 状态栏条目

![状态栏条目](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-item.png)

*此示例显示了 GitHub Pull Requests and Issues 插件配置的条目。它与整个工作区相关，因此放在左侧。*

### 进度状态栏条目

当需要显示低调的进度（在后台发生的进度）时，建议显示带有加载图标的状态栏条目（你也可以添加旋转动画）。如果需要将进度提升以引起用户注意，我们建议改用进度通知。

![状态栏进度](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-progress.png)

*此示例显示了低调的进度状态栏条目。*


### 错误和警告状态栏条目

如果你需要显示一个用于警告或错误目的的高度可见的条目，可以将状态栏条目配置为使用警告或错误背景色。鉴于它们在状态栏中的显眼程度，仅在万不得已时和特殊情况下使用这种模式。

![状态栏错误](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-error.png)

*此示例使用错误状态栏条目来显示文件中的阻塞性错误。*

![状态栏警告](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-warning.png)

*此示例使用警告状态栏条目来显示文件中的警告。*

## 链接

* [状态栏条目 API 参考](/references/vscode-api#StatusBarItem)
* [状态栏插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/statusbar-sample)
