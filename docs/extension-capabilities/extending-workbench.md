# 扩展工作台
“工作台”是指整个VS Code UI和其中包含的下列UI 组件：
- 标题栏
- 活动栏
- 侧边栏
- 面板
- 编辑器群
- 状态栏

VS Code提供了各式各样的API让在工作台你添加自己的组件。比如下图：

![]()

- 活动栏：[Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)添加了一个[视图容器](#view-container)
- 侧边栏：内置的[NPM 插件](https://github.com/Microsoft/vscode/tree/master/extensions/npm) 添加了一个 [Tree View](#tree-view) 到资源管理器视图
- 编辑器群：内置的[Markdown 插件](https://github.com/Microsoft/vscode/tree/master/extensions/markdown-language-features) 添加了一个[Webview](#webview) 到编辑器的旁边
- 状态栏：[VSCodeVim 插件](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) 添加了一个[状态栏项目](#status-bar-item)

## 视图容器

在[`contributes.viewsContainers`]()发布内容配置中，你可以添加新的视图容器在5个内置的视图容器中。学习更多[树视图]()。

## 树视图
在[`contributes.views`]()发布内容配置中，你可以添加在任何视图容器岁添加新的视图。学习更多[树视图]()。

## Webview

Webview是使用HTML/CSS/JS高度定制的视图。它们显示在编辑器区域中。详见[Webview指南]()。

## 状态栏项

插件可以创建自定义的[`StatusBarItem`]()显示在状态栏中。状态栏项可以显示文本和图标，还可以在点击事件触发时运行命令。
- 显示文本和图标
- 点击时运行命令
状态栏插件的例子可以[戳这里]()
