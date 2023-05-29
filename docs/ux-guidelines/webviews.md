# Webviews

如果你需要展示 VS Code API 支持不了的自定义功能，你可以使用 可高度定制化的 [webviews](../extension-guides/webview.md)。要理解 webview 只有在你确实需要时才使用。
✔**️推荐**
- 只在必要时使用
- 仅在合理的上下文中激活插件
- 以激活窗口打开 webview
- 确保视图中的所有元素都支持主题（详见 [webview-view-sample](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/media/main.css) 和 [主题色](../references/theme-color.md) 文档）
- 确保视图遵循 [可访问性指南](https://code.visualstudio.com/docs/editor/accessibility)（色彩对比度、 ARIA 标签、键盘导航）
- 对照 [Webview UI Toolkit for Visual Studio Code](https://github.com/microsoft/vscode-webview-ui-toolkit) 实现你的插件，包括风格化、主题、行为和可访问特性。
- 在视图中使用工具栏触发命令操作

❌**不推荐**
- 用于分发广告（更新、捐款等等）
- 用于配置初始化
- 在每个窗口都打开
- 插件升级时打开（应该使用通知询问）
- 添加和编辑器、工作区无关的功能
- 重复造轮子（如：欢迎页、设置、配置等等）

## 示例

#### 简易浏览器

这个插件会在编辑器一边打开浏览器来预览（页面）

![webview-browser](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-browser.png)

这个例子演示了开发中的 VS Code Web 在 VS Code 右侧。Webview 面板一般用于渲染类浏览器窗口。

#### 合并请求

这个例子展示了自定义树视图中，当前工作区仓库的合并请求，并使用了 webview 来展示合并请求的详细内容。

![webview-pull-request](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-pull-request.png)

## Webview 视图

你也可以把webview 放到任意视图容器中（侧边栏或面板），这些元素叫做 [webview views](https://code.visualstudio.com/api/references/vscode-api#WebviewView)，配置它们的方式和本篇的其他教程一样。
![webview-view](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-view.png)

本 webview 视图演示了创建合并请求所用到的内容——下拉框、输入框、按钮。

## 相关资源
- [Webview 插件指南](../extension-guides/webview.md)
- [Webview 插件示例](https://github.com/Microsoft/vscode-extension-samples/tree/main/webview-sample)
- [Webview View 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
- [Webview UI Toolkit for Visual Studio Code](https://github.com/microsoft/vscode-webview-ui-toolkit)