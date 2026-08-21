# 小结

在[你的第一个插件](/get-started/your-first-extension)中，你学会了如何创建，运行和调试插件。在[解析插件结构](/get-started/extension-anatomy)中，你学习了有关VS Code插件开发的基本概念。但是我们现在还只看到了冰山一角，下面我们提供了进一步打磨你开发插件能力的章节索引。

## 插件功能

在这一章中，我们把[VS Code API](/references/vscode-api)和[配置点](/references/contribution-points)分成了不同类别，每个分类都是某一功能的简明教程。在这个章节你可以验证自己的插件灵感是否可行，或者从中找到新的创作想法。

## 指南和示例

我们提供了大量示例插件，一些插件源码还包含了详细的指南，你可以在[插件指南列表](/extension-guides)找到全部的指南和示例，或者查看[vscode-extension-samples](https://github.com/Microsoft/vscode-extension-samples)仓库。

## 交互指南

为使你的插件能够自然地融入 VS Code 用户界面，请参阅[交互指南](/ux-guidelines)。在这里，你将了解创建插件 UI 的最佳实践，以及遵循 VS Code 工作流规范。

## 问题报告

VS Code 用户可以使用 **Help: Report Issue...** 命令（`workbench.action.openIssueReporter`）报告问题，或者在快速打开（Quick Open，`workbench.action.quickOpen`）中输入 `issue`，然后选择一个已安装的插件来报告问题。这样一来，用户在报告核心产品或已安装插件的问题时才会有一致的体验。

作为插件作者，你可以将插件集成到 **Help: Report Issue...** 的问题报告流程中，而无需单独提供问题报告命令。此集成还允许你在用户报告问题时附加额外信息。

要集成到问题报告流程中，你需要提供一个自定义命令和 `issue/reporter` 配置点。该自定义命令会调用 `openIssueReporter`。

以下是 `package.json` 中 `contributes` 下命令和菜单的示例。有关添加菜单配置和命令的说明，请参阅[配置点](/references/contribution-points)：

``` json
"commands": [
    {
        "command": "extension.myCommand",
        "title": "Report Issue"
    }
],
    "menus": {
        "issue/reporter": [
            {
                "command": "extension.myCommand"
            }
        ]
    }

```

我们建议此前在命令面板中提供 `workbench.action.openIssueReporter` 命令的插件开始使用这个新的问题报告流程。

## 测试和发布

本节包含有助于你开发高质量 VS Code 插件的主题。例如，你可以学习：

- 如何为插件添加[集成测试](/working-with-extensions/testing-extension)
- 如何将插件[发布](/working-with-extensions/publish-extension)到 VS Code [市场](https://marketplace.visualstudio.com/)
- 如何为插件设置[持续集成](/working-with-extensions/continuous-integration)
