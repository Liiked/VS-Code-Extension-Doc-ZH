# 语言模型工具 API

语言模型工具使你能够在 Chat 中使用领域专用能力扩展大型语言模型（LLM）的功能。为处理用户的 Chat 提示，VS Code 中的[代理](/docs/chat/chat-overview.md)可自动调用这些工具，作为会话的一部分执行专门任务。

通过在 VS Code 插件中提供语言模型工具，可以扩展代理式编码工作流，同时与编辑器深度集成。插件工具是 VS Code 中可用的三类工具之一，另外两类是[内置工具和 MCP 工具](/docs/agents/concepts/tools.md#types-of-tools)。

本插件指南将介绍如何使用语言模型工具 API 创建语言模型工具，以及如何在 Chat 插件中实现工具调用。

还可以通过提供 [MCP 服务器](/extension-guides/ai/mcp)使用专用工具扩展 Chat 体验。有关不同选项及如何选择方法的详细信息，请参阅[AI 扩展性概述](/extension-guides/ai/ai-extensibility-overview)。

> [!TIP]
> 有关终端用户如何使用工具的信息，请参阅[使用代理工具](/docs/agents/run/tools.md)。

## LLM 中的工具调用是什么？

语言模型工具是可作为语言模型请求的一部分调用的函数。例如，你可能有一个从数据库检索信息、执行计算或调用在线 API 的函数。在 VS Code 插件中提供工具后，代理模式即可根据会话上下文调用该工具。

LLM 实际上不会自行执行工具，而是生成用于调用工具的参数。请清晰说明工具的用途、功能和输入参数，以便在正确的上下文中调用工具。

下图展示 VS Code 代理模式中的工具调用流程。有关具体步骤，请参阅[工具调用流程](#工具调用流程)。

![展示 Copilot 工具调用流程的示意图](https://code.visualstudio.com/assets/api/extension-guides/ai/tools/copilot-tool-calling-flow.png)

在 OpenAI 文档中了解更多[函数调用](https://platform.openai.com/docs/guides/function-calling)内容。

## 为什么要在插件中实现语言模型工具？

在插件中实现语言模型工具有多项优势：

- **扩展代理模式**：提供专用的领域工具，在响应用户提示时自动调用。例如，启用数据库脚手架和查询，以动态向 LLM 提供相关上下文。
- **与 VS Code 深度集成**：使用丰富的插件 API。例如，使用[调试 API](/extension-guides/debugger-extension)获取当前调试上下文，并将其作为工具功能的一部分。
- **分发和部署**：通过 Visual Studio Marketplace 分发工具，为用户提供可靠且无缝的体验，无需为工具单独安装和更新。

在以下场景中，可以考虑使用 [MCP 服务器](/extension-guides/ai/mcp)实现语言模型工具：

- 已有 MCP 服务器实现，并希望在 VS Code 中使用它。
- 希望在不同开发环境和平台中复用同一工具。
- 工具作为服务远程托管。
- 不需要访问 VS Code API。

了解更多[工具类型之间的差异](/docs/agents/concepts/tools.md#types-of-tools)。

## 创建语言模型工具

实现语言模型工具包括两个主要部分：

1. 在插件的 `package.json` 文件中定义工具配置。
1. 使用[语言模型 API 参考](https://code.visualstudio.com/api/references/vscode-api#lm)在插件代码中实现工具。

可以从[基础示例项目](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)开始。

### 1. 在 `package.json` 中进行静态配置

在插件中定义语言模型工具的第一步，是在插件的 `package.json` 文件中定义它。此配置包括工具名称、说明、输入架构和其他元数据：

1. 在插件 `package.json` 文件的 `contributes.languageModelTools` 部分为工具添加条目。

1. 为工具指定唯一名称：

    | 属性          | 说明                                                                                                      |
    | ------------- | --------------------------------------------------------------------------------------------------------- |
    | `name`        | 工具的唯一名称，用于在插件实现代码中引用工具。名称格式为 `{verb}_{noun}`。请参阅[命名准则](#指南和约定)。 |
    | `displayName` | 用于在 UI 中显示的、对用户友好的工具名称。                                                                |

1. 如果工具可与[代理](/docs/agents/overview.md#built-in-agents)一起使用，或可在 Chat 提示中通过 `#` 引用，请添加以下属性：

    用户可以在 Chat 视图中启用或禁用工具，方式与[模型上下文协议（MCP）工具](/docs/agent-customization/mcp-servers.md)相同。

    | 属性                      | 说明                                                                                                      |
    | ------------------------- | --------------------------------------------------------------------------------------------------------- |
    | `canBeReferencedInPrompt` | 如果工具可与[代理](/docs/agents/overview.md#built-in-agents)一起使用，或可在 Chat 中引用，请设为 `true`。 |
    | `toolReferenceName`       | 用户通过 `#` 在 Chat 提示中引用工具时使用的名称。                                                         |
    | `icon`                    | 在 UI 中显示的工具图标。                                                                                  |
    | `userDescription`         | 在 UI 中显示的、对用户友好的工具说明。                                                                    |

1. 在 `modelDescription` 中添加详细说明。LLM 使用此信息确定应在何种上下文中使用工具。

    - 工具具体执行什么操作？
    - 它返回什么类型的信息？
    - 何时应使用或不应使用它？
    - 说明工具的重要限制或约束。

1. 如果工具接受输入参数，请添加描述工具输入参数的 `inputSchema` 属性。

    此 JSON Schema 描述了一个对象，包括工具接受的输入属性以及这些属性是否必需。文件路径应为绝对路径。

    请说明每个参数的作用及其与工具功能的关系。

1. 添加 `when` 子句以控制工具何时可用。

    `languageModelTools` 配置点允许你使用 [when 子句](/references/when-clause-contexts)限制工具何时可用于代理模式或可在提示中引用。例如，获取调试调用堆栈信息的工具应仅在用户调试时可用。

    ```json
    "contributes": {
        "languageModelTools": [
            {
                "name": "chat-tools-sample_tabCount",
                ...
                "when": "debugState == 'running'"
            }
        ]
    }
    ```

<details>
<summary>工具定义示例</summary>

以下示例展示如何定义一个用于统计选项卡组中活动选项卡数量的工具。

```json
"contributes": {
    "languageModelTools": [
        {
            "name": "chat-tools-sample_tabCount",
            "tags": [
                "editors",
                "chat-tools-sample"
            ],
            "toolReferenceName": "tabCount",
            "displayName": "Tab Count",
            "modelDescription": "The number of active tabs in a tab group in VS Code.",
            "userDescription": "Count the number of active tabs in a tab group.",
            "canBeReferencedInPrompt": true,
            "icon": "$(files)",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "tabGroup": {
                        "type": "number",
                        "description": "The index of the tab group to check. This is optional- if not specified, the active tab group will be checked.",
                        "default": 0
                    }
                }
            }
        }
    ]
}
```

</details>

### 2. 工具实现

使用[语言模型 API](https://code.visualstudio.com/api/references/vscode-api#lm)实现语言模型工具，包括以下步骤：

1. 插件激活时，使用 [`vscode.lm.registerTool`](https://code.visualstudio.com/api/references/vscode-api#lm.registerTool) 注册工具。

    提供在 `package.json` 的 `name` 属性中指定的工具名称。

    如果希望工具仅供插件私有使用，请跳过工具注册步骤。

    ```ts
    export function registerChatTools(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.lm.registerTool('chat-tools-sample_tabCount', new TabCountTool()));
    }
    ```

1. 创建实现 [`vscode.LanguageModelTool<>`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelTool&lt;T&gt;) 接口的类。

1. 在 `prepareInvocation` 方法中添加工具确认消息。

    插件提供的工具始终会显示通用确认对话框，但工具可以自定义确认消息。请向用户提供足够的上下文，以便理解工具正在执行的操作。该消息可以是包含代码块的 `MarkdownString`。

    以下示例展示如何为选项卡计数工具提供确认消息。

    ```ts
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ITabCountParameters>,
        _token: vscode.CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Count the number of open tabs',
            message: new vscode.MarkdownString(
                `Count the number of open tabs?` +
                (options.input.tabGroup !== undefined
                    ? ` in tab group ${options.input.tabGroup}`
                    : '')
            ),
        };

        return {
            invocationMessage: 'Counting the number of tabs',
            confirmationMessages,
        };
    }
    ```

    如果 `prepareInvocation` 返回 `undefined`，将显示通用确认消息。请注意，用户还可以为特定工具选择“始终允许”。

1. 定义描述工具输入参数的接口。

    该接口用于 `vscode.LanguageModelTool` 类的 `invoke` 方法。输入参数会根据在 `package.json` 的 `inputSchema` 中定义的 JSON Schema 进行验证。

    以下示例展示选项卡计数工具的接口。

    ```ts
    export interface ITabCountParameters {
        tabGroup?: number;
    }
    ```

1. 实现 `invoke` 方法。当处理 Chat 提示时调用语言模型工具，会调用该方法。

    `invoke` 方法通过 `options` 参数接收工具输入参数。参数会根据 `package.json` 的 `inputSchema` 中定义的 JSON Schema 进行验证。

    发生错误时，请抛出包含 LLM 能理解的消息的错误。还可选择说明 LLM 接下来应执行的操作，例如使用不同参数重试或执行其他操作。

    以下示例展示选项卡计数工具的实现。工具结果是 `vscode.LanguageModelToolResult` 类型的实例。

    ```ts
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ITabCountParameters>,
        _token: vscode.CancellationToken
    ) {
        const params = options.input;
        if (typeof params.tabGroup === 'number') {
            const group = vscode.window.tabGroups.all[Math.max(params.tabGroup - 1, 0)];
            const nth =
                params.tabGroup === 1
                    ? '1st'
                    : params.tabGroup === 2
                        ? '2nd'
                        : params.tabGroup === 3
                            ? '3rd'
                            : `${params.tabGroup}th`;
            return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`There are ${group.tabs.length} tabs open in the ${nth} tab group.`)]);
        } else {
            const group = vscode.window.tabGroups.activeTabGroup;
            return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`There are ${group.tabs.length} tabs open.`)]);
        }
    }
    ```

在 VS Code 插件示例仓库中查看实现[语言模型工具](https://github.com/microsoft/vscode-extension-samples/blob/main/chat-sample/src/tools.ts)的完整源代码。

## 工具调用流程

当用户发送 Chat 提示时，将发生以下步骤：

1. Copilot 根据用户配置确定可用工具列表。

    工具列表由内置工具、插件注册的工具和 [MCP 服务器](/docs/agent-customization/mcp-servers.md)提供的工具组成。你可以通过插件或 MCP 服务器为代理模式提供功能（图中以绿色显示）。

1. Copilot 向 LLM 发送请求，并提供提示、Chat 上下文和要考虑的工具定义列表。

    LLM 生成响应，其中可能包含一个或多个调用工具的请求。

1. 如有需要，Copilot 会使用 LLM 提供的参数值调用建议的工具。

    一个工具响应可能会引发更多工具调用请求。

1. 如果存在错误或后续工具请求，Copilot 会迭代工具调用流程，直至解决所有工具请求。

1. Copilot 向用户返回最终响应，其中可能包含多个工具的响应。

## 指南和约定

- **命名**：为工具和参数编写清晰且具有描述性的名称。

    - **工具名称**：应唯一，并清晰描述其意图。工具名称使用 `{verb}_{noun}` 格式。例如：`get_weather`、`get_azure_deployment` 或 `get_terminal_output`。

    - **参数名称**：应描述参数用途。参数名称使用 `{noun}` 格式。例如：`destination_location`、`ticker` 或 `file_name`。

- **说明**：为工具和参数编写详细说明。

    - 说明工具执行什么操作，以及何时应或不应使用它。例如：“此工具检索给定位置的天气。”
    - 说明每个参数的作用及其与工具功能的关系。例如：“`destination_location` 参数指定检索天气的位置。它应为有效的位置名称或坐标。”
    - 说明工具的重要限制或约束。例如：“此工具仅检索美国境内位置的天气数据，可能不适用于其他地区。”

- **用户确认**：为工具调用提供确认消息。插件提供的工具始终会显示通用确认对话框，但工具可以自定义确认消息。请向用户提供足够上下文，以便理解工具正在执行的操作。

- **错误处理**：发生错误时，抛出包含 LLM 能理解的消息的错误。还可选择说明 LLM 接下来应执行的操作，例如使用不同参数重试或执行其他操作。

在 [OpenAI 文档](https://platform.openai.com/docs/guides/function-calling?api-mode=chat#best-practices-for-defining-functions)和 [Anthropic 文档](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)中了解更多创建工具的最佳实践。

## 相关内容

- [语言模型 API 参考](https://code.visualstudio.com/api/references/vscode-api#lm)
- [在 VS Code 插件中注册 MCP 服务器](/extension-guides/ai/mcp)
- [在代理模式中使用 MCP 工具](/docs/agent-customization/mcp-servers.md)
