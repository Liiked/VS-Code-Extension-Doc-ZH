# 编写 Python 插件

:::info
**注意**：如果你是 VS Code 插件编写的新手，建议先阅读[你的第一个插件](/get-started/your-first-extension)教程，并尝试创建一个简单的 Hello World 插件。
:::

[Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) 插件为其他插件提供了 API，用于处理用户机器上可用的 Python 环境。请查看 [@vscode/python-extension](https://www.npmjs.com/package/@vscode/python-extension) npm 模块，它包含用于从你的插件访问这些 API 的类型和辅助工具。

## Python 插件模板

[Python 插件模板](https://github.com/microsoft/vscode-python-tools-extension-template)帮助你开始为你喜欢的 Python 工具构建 Visual Studio Code 插件。它可以是 linter、格式化器或代码分析工具，或者所有这些的组合。该模板将为你提供构建将你的工具集成到 VS Code 的插件所需的基本构建块，并且它已经可以访问上面提到的 Python API。

## 编程语言和框架

插件模板由两部分组成：插件部分和语言服务器部分。插件部分用 TypeScript 编写，语言服务器部分用 Python 编写，基于 `pygls`（Python 语言服务器）库。

使用此模板时，你大部分时间会在代码的 Python 部分工作。你将使用[语言服务器协议](https://microsoft.github.io/language-server-protocol)将你的工具与插件部分集成。`pygls` 目前基于 [LSP 3.16 版本](https://microsoft.github.io/language-server-protocol/specifications/specification-3-16)工作。

TypeScript 部分负责处理与 VS Code 及其 UI 的交互。插件模板内置了一些可供你的工具使用的设置。如果你需要添加新设置来支持你的工具，你将需要处理一些 TypeScript 代码。插件模板提供了一些设置的示例，你也可以查看我们团队为一些流行工具开发的[扩展](#examples)。

## 要求

1. VS Code 1.64.0 或更高版本
1. Python 3.7 或更高版本
1. node >= 14.19.0
1. npm >= 8.3.0（`npm` 随 node 一起安装，检查 npm 版本，使用 `npm install -g npm@8.3.0` 更新）
1. 适用于 VS Code 的 [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) 插件

你应该知道如何创建和使用 Python 虚拟环境。

## 快速开始

要开始，请按照模板 [README](https://github.com/microsoft/vscode-python-tools-extension-template#readme) 中的说明操作。在那里你将学习如何使用[模板创建你的仓库](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)，以及如何安装必要的工具（例如 [nox](https://nox.thea.codes) 任务运行器）和可选依赖（测试支持）。

[README](https://github.com/microsoft/vscode-python-tools-extension-template#readme) 包含最新的说明，并且还详细介绍了如何自定义插件的 `package.json` 占位符（`<pythontool-module>`、`<pythontool-display-name>` 等）。

## 模板的功能

通过模板创建插件后，它将包含以下插件配置。假设 `<pytool-module>` 被替换为 `mytool`，`<pytool-display-name>` 被替换为 `My Tool`：

1. 一个 **My Tool: Restart Server** 命令（命令 ID：`mytool.restart`）。
1. 以下设置：
    * `mytool.logLevel`
    * `mytool.args`
    * `mytool.path`
    * `mytool.importStrategy`
    * `mytool.interpreter`
    * `mytool.showNotification`
1. 以下插件激活触发器：
    * 在语言 `python` 上。
    * 在打开的工作区中发现带有 `.py` 扩展名的文件时。
    * 在命令 `mytool.restart` 上。
1. 用于日志记录的输出通道 **输出（Output）** > **My Tool**。

## 整合你的工具

生成的 `bundled/tool/server.py` 文件是你进行大部分更改的地方。文件中的 `TODO` 注释指出了各种自定义点。也请在其他位置的模板中搜索 `TODO` 注释，例如其他 Python 和 Markdown 文件。你需要审阅 LICENSE 文件，即使你想保留 MIT License。

## 示例

有多个由该模板创建的示例实现：

* [Pylint](https://github.com/microsoft/vscode-pylint/tree/main/bundled/tool) - 在文件的 `open`、`save` 和 `close` 时实现 linting 和代码操作（Code Actions）。
* [Flake8](https://github.com/microsoft/vscode-flake8/tree/main/bundled/tool) - 实现 linting 和代码操作。
* [Black Formatter](https://github.com/microsoft/vscode-black-formatter/tree/main/bundled/tool) - 集成了 [*Black*](https://github.com/python/black) 格式化器。
* [autopep8](https://github.com/microsoft/vscode-autopep8/tree/main/bundled/tool) - 集成了 [autopep8](https://pypi.org/project/autopep8) 格式化器。
* [isort](https://github.com/microsoft/vscode-isort/blob/main/bundled/tool) - 添加排序 import 的代码操作。

你也可以查看[语言服务器协议规范](https://microsoft.github.io/language-server-protocol/specifications/specification-3-16)，以更好地理解 `pygls` 语言服务器集成。

## 插件开发

模板 README 详细介绍了模板附带的[开发周期支持](https://github.com/microsoft/vscode-python-tools-extension-template#debugging)。模板提供了命令和配置，以便你可以构建、运行、调试和测试你的插件。

如果在开发过程中遇到问题，有一个[疑难解答](https://github.com/microsoft/vscode-python-tools-extension-template#troubleshooting)部分可以帮助解决常见问题。

## 打包和发布

在发布插件之前，你需要针对你的特定插件更新插件的 `package.json` 字段（如 `publisher` 和 `license`）。你还需要更新辅助的 Markdown 文件（`CODE_OF_CONDUCT.md`、`CHANGELOG.md` 等）。

一旦你的插件准备好发布，有一个 `nox` 的 `build-package` 任务可以创建 `.vsix` 文件，然后你可以将其上传到你的插件[管理页面](https://marketplace.visualstudio.com/manage)。

如果你是创建和发布 VS Code 插件的新手，我们建议你遵循主 VS Code [插件编写](/api/working-with-extensions/publishing-extension#advanced-usage)主题中概述的最佳实践。在这里你会找到帮助你的插件在 Marketplace 上看起来更出色的指南，以及如何成为已验证发布者，让用户放心安装你的插件。
