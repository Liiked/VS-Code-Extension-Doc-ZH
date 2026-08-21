# VS Code 中的 AI 扩展性

本文概述 Visual Studio Code 中可用的 AI 扩展方式，帮助你为插件选择合适的方案。

VS Code 包含多项可提升编码体验的强大 AI 功能：

- **代码补全**：在输入时提供内联代码建议。
- **代理模式**：让 AI 使用专门工具自主规划并执行开发任务。
- **聊天**：让开发者通过聊天界面使用自然语言提问，或修改代码库。
- **智能操作**：在整个编辑器中集成由 AI 增强的常用开发任务操作。

你可以扩展和自定义这些内置功能，打造符合用户特定需求的 AI 体验。

## 为什么要扩展 VS Code 中的 AI？

为插件添加 AI 功能可为用户带来以下益处：

- **代理模式中的领域知识**：让代理模式访问公司的数据源和服务。
- **增强用户体验**：提供针对插件所属领域的智能辅助。
- **领域专用能力**：为特定编程语言、框架或领域创建 AI 功能。
- **扩展聊天功能**：为聊天界面添加专门的工具或助手，以实现更强大的交互。
- **提升开发者生产力**：使用 AI 功能增强调试、代码审查或测试等常见开发任务。

## 扩展聊天体验

### 语言模型工具

语言模型工具可让你使用特定领域的功能扩展 VS Code 的代理模式。在代理模式中，这些工具会根据用户的聊天提示自动调用，以执行专门任务，或从数据源或服务检索信息。用户也可以在聊天提示中通过 `#` 提及工具来显式引用它们。

要实现语言模型工具，请在 VS Code 插件中使用[语言模型工具 API](/extension-guides/ai/tools)。语言模型工具可以访问所有 VS Code 插件 API，并与编辑器深度集成。

**主要优点**：

- 在自主编码工作流中提供领域专用能力。
- 工具实现在扩展主机进程中运行，因此可以使用 VS Code API。
- 可通过 Visual Studio Marketplace 轻松分发和部署。

**主要注意事项**：

- 远程部署要求插件实现客户端与服务器之间的通信。
- 在不同工具间复用要求采用模块化设计和实现。

### MCP 工具

模型上下文协议（Model Context Protocol，MCP）工具通过标准化协议将外部服务与语言模型集成。在代理模式中，这些工具会根据用户的聊天提示自动调用，以执行专门任务或从外部数据源检索信息。

MCP 工具在 VS Code 外部运行，可以位于用户的本地计算机上，也可以作为远程服务。用户可通过 JSON 配置添加 MCP 工具，VS Code 插件也可通过编程方式配置它们。你可使用不同语言的 SDK 和部署方式实现 MCP 工具。

由于 MCP 工具在 VS Code 外部运行，因此无法访问 VS Code 插件 API。

**主要优点**：

- 在自主编码工作流中添加领域专用能力。
- 支持本地和远程部署。
- 可在其他 MCP 客户端中复用 MCP 服务器。

**主要注意事项**：

- 无法访问 VS Code 插件 API。
- 分发和部署需要用户自行设置 MCP 服务器。

### 聊天参与者

聊天参与者是专门的助手，可让用户使用领域专家扩展询问模式。在聊天中，用户可通过 `@` 提及聊天参与者，并传入有关特定主题或领域的自然语言提示来调用它。聊天参与者负责处理整个聊天交互。

要实现 Chat 参与者，请在 VS Code 插件中使用 [Chat API](/extension-guides/ai/chat)。Chat 参与者可以访问所有 VS Code 插件 API，并与编辑器深度集成。

**主要优点**：

- 可控制端到端交互流程。
- 在插件主机进程中运行，可访问 VS Code 插件 API。
- 可通过 Visual Studio Marketplace 轻松分发和部署。

**主要注意事项**：

- 远程部署要求插件实现客户端与服务器之间的通信。
- 在不同工具间复用要求采用模块化设计和实现。

## 构建自己的 AI 驱动功能

VS Code 提供对 AI 模型的直接编程访问，你可以借此在插件中创建自定义 AI 驱动功能。这种方式让你能够构建专用于编辑器的 AI 交互，而无需依赖 Chat 界面。

要直接使用语言模型，请在 VS Code 插件中使用[语言模型 API](/extension-guides/ai/language-model)。你可以将这些 AI 功能融入任意插件功能，例如代码操作、悬停提供程序、自定义视图等。

**主要优点**：

- 将 AI 功能集成到已有插件功能中，或构建新功能。
- 在插件主机进程中运行，可访问 VS Code 插件 API。
- 可通过 Visual Studio Marketplace 轻松分发和部署。

**主要注意事项**：

- 在不同体验间复用要求采用模块化设计和实现。

## 选择合适的方案

为 VS Code 插件选择合适的 AI 扩展方式时，请参考以下准则：

1. **在以下情况选择语言模型工具**：
    - 希望通过专用功能扩展 VS Code 中的聊天。
    - 希望在代理模式中根据用户意图自动调用。
    - 希望访问 VS Code API，以与 VS Code 深度集成。
    - 希望通过 VS Code Marketplace 分发工具。

1. **在以下情况选择 MCP 工具**：
    - 希望通过专用功能扩展 VS Code 中的聊天。
    - 希望在代理模式中根据用户意图自动调用。
    - 不需要与 VS Code API 集成。
    - 工具需要在不同环境中运行，而非仅限 VS Code。
    - 工具应以远程或本地方式运行。

1. **在以下情况选择聊天参与者**：
    - 希望使用具备领域知识的专用助手扩展询问模式。
    - 需要自定义整个交互流程和响应行为。
    - 希望访问 VS Code API，以与 VS Code 深度集成。
    - 希望通过 VS Code Marketplace 分发工具。

1. **在以下情况选择语言模型 API**：
    - 希望将 AI 功能集成到已有插件功能中。
    - 正在构建聊天界面之外的 UI 体验。
    - 需要对 AI 模型请求进行直接的编程控制。

## 后续步骤

选择最符合插件目标的方式：

- [实现语言模型工具](/extension-guides/ai/tools)
- [在 VS Code 插件中注册 MCP 工具](/extension-guides/ai/mcp)
- [使用语言模型 API 将 AI 集成到插件中](/extension-guides/ai/language-model)
- [实现聊天参与者](/extension-guides/ai/chat)
- [使用内联补全 API 扩展代码补全](https://code.visualstudio.com/api/references/vscode-api#InlineCompletionItemProvider)

### 示例项目

- [Chat 示例](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)：包含代理模式工具和 Chat 参与者的插件。
- [代码导师聊天参与者教程](/extension-guides/ai/chat-tutorial)：构建专用聊天助手。
- [AI 驱动的代码注释教程](/extension-guides/ai/language-model-tutorial)：使用语言模型 API 的分步指南。
- [MCP 插件示例](https://github.com/microsoft/vscode-extension-samples/blob/main/mcp-extension-sample)：注册 MCP 工具的插件。
