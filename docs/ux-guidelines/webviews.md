
# Webview

如果你需要显示超出 VS Code API 支持范围的自定义功能，可以使用 [webview](/extension-guides/webview)，它是完全可以自定义的。重要的是要理解，只有在绝对需要时才应该使用 webview。

**✔️ 应该**

* 仅在绝对必要时使用 webview
* 仅在上下文合适时激活你的插件
* 仅对活动窗口打开 webview
* 确保视图中的所有元素都可应用主题（参见 [webview-view-sample](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/media/main.css) 和[颜色令牌](/references/theme-color)文档）
* 确保你的视图遵循[无障碍指南](/docs/configure/accessibility/accessibility)（颜色对比度、ARIA 标签、键盘导航）
* 在工具栏和视图中使用命令操作

❌ 不应该

* 用于推广（升级、赞助商等）
* 用于向导
* 在每个窗口打开
* 在插件更新时打开（改用通知来询问）
* 添加与编辑器或工作区无关的功能
* 重复现有功能（欢迎页、设置、配置等）

## Webview 示例

**简单浏览器（Simple Browser）**

该插件在编辑器旁边打开一个浏览器预览。

![Webview 示例 - 浏览器](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-browser.png)

*此示例展示了 VS Code Web 直接在 VS Code 中开发。Webview 面板用于渲染类似浏览器的窗口。*

**拉取请求（Pull Request）**

该插件在自定义树视图中显示工作区仓库的拉取请求，然后使用 webview 显示拉取请求的详细信息视图。

![Webview 示例 - 拉取请求](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-pull-request.png)

## Webview 视图

你也可以将 webview 放入任何视图容器（侧边栏或面板）中，这些元素称为 [webview 视图](/references/vscode-api#WebviewView)。相同的 webview 指南也适用于 webview 视图。

![Webview 视图](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-view.png)

*此 webview 视图显示用于创建拉取请求的内容，其中使用了下拉框、输入框和按钮。*

## 链接

* [Webview 插件指南](/extension-guides/webview)
* [Webview 插件示例](https://github.com/Microsoft/vscode-extension-samples/tree/main/webview-sample)
* [Webview 视图插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
