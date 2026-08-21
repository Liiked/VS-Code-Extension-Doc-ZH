# MCP 开发者指南

模型上下文协议（Model Context Protocol，MCP）是一项开放标准，使 AI 模型能够通过统一接口与外部工具和服务交互。Visual Studio Code 实现了完整的 MCP 规范，使你能够创建 MCP 服务器，为扩展 VS Code 中 AI 代理能力提供工具、提示和资源。

MCP 服务器提供 VS Code 中可用的三类工具之一，另两类是内置工具和插件提供的工具。了解更多[工具类型](/docs/agents/concepts/tools.md#types-of-tools)。

本指南涵盖构建可与 VS Code 和其他 MCP 客户端无缝协作的 MCP 服务器所需的全部知识。

> [!TIP]
> 有关终端用户如何使用 MCP 服务器的信息，请参阅[在 VS Code 中使用 MCP 服务器](/docs/agent-customization/mcp-servers.md)。

## 为什么使用 MCP 服务器？

实现 MCP 服务器以通过语言模型工具扩展 VS Code Chat，具有以下优势：

- **扩展代理模式**：提供专用的领域工具，在响应用户提示时自动调用。例如，启用数据库脚手架和查询，以动态向 LLM 提供相关上下文。
- **灵活的部署选项**：支持本地和远程场景。
- **复用**：可跨不同工具和平台复用 MCP 服务器。

在以下场景中，可以考虑使用[语言模型 API](/extension-guides/ai/tools)实现语言模型工具：

- 希望使用插件 API 与 VS Code 深度集成。
- 希望通过 Visual Studio Marketplace 分发工具及其更新。

## VS Code 支持的 MCP 功能

VS Code 支持以下 MCP 能力：

* [传输方式](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)：
    * 本地标准输入/输出（`stdio`）。
    * 可流式传输的 HTTP（`http`）。
    * 服务器发送事件（`sse`），提供旧版支持。

* [功能](https://modelcontextprotocol.io/specification/2025-06-18#features)：
    * 工具：使用额外工具扩展[代理模式](/docs/chat/chat-overview)。
    * 提示：在 Chat 中将可复用提示添加为斜杠命令。
    * 资源：提供用户可添加为 Chat 上下文，或直接在 VS Code 中交互的数据和内容。
    * 引导：请求用户输入。
    * 采样：使用用户配置的模型和订阅发出语言模型请求。
    * 身份验证：使用 OAuth 授权访问 MCP 服务器。
    * 服务器说明。
    * 根目录：提供用户工作区根文件夹的信息。
    * [MCP 应用](https://modelcontextprotocol.github.io/ext-apps/api/)：由工具返回交互式 UI 组件。

### 工具

#### 工具定义

VS Code 在代理模式中支持 MCP 工具，可根据任务需要调用它们。用户可使用工具选择器启用和配置工具。工具说明会显示在工具选择器中，与工具名称并列；在运行工具前请求确认的对话框中也会显示。

![代理模式中的 MCP 工具选择器](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-tools-picker.png)

用户可在工具确认对话框中编辑模型生成的输入参数。未标记 `readOnlyHint` 注解的所有工具都会显示确认对话框。

![MCP 工具输入参数确认对话框](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-tool-input-parameters.png)

#### 动态工具发现

VS Code 还支持[动态工具发现](https://modelcontextprotocol.io/docs/concepts/tools#tool-discovery-and-updates)，允许服务器在运行时注册工具。例如，服务器可根据工作区中检测到的框架或语言，或根据用户聊天提示提供不同工具。

#### 工具注解

要为工具行为提供额外元数据，可以使用[工具注解](https://modelcontextprotocol.io/docs/concepts/tools#tool-annotations)：

- `title`：工具的人类可读标题，在调用工具时显示在 Chat 视图中。
- `readOnlyHint`：表示工具为只读的可选提示。VS Code 运行只读工具时不会请求确认。

### 资源

资源使你能够以结构化方式向用户提供数据和内容。用户可以直接在 VS Code 中访问资源，或将其作为 Chat 提示的上下文。例如，MCP 服务器可以生成屏幕截图并将其作为资源提供，或提供对日志文件的访问，并实时更新这些文件。

定义 MCP 资源后，资源名称会显示在 MCP 资源快速选择中。可通过 **MCP: Browse Resources** 命令打开资源，或选择 **Add Context** 后选择 **MCP Resource** 将资源附加到聊天请求。资源可以包含文本或二进制内容。

![MCP 资源快速选择](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-resources-picker.png)

VS Code 支持资源更新，使用户能够在编辑器中实时查看资源内容的变化。

#### 资源模板

VS Code 还支持[资源模板](https://modelcontextprotocol.io/docs/concepts/resources#resource-templates)，使用户在引用资源时能够提供输入参数。例如，数据库查询工具可要求输入数据库表名。

使用模板访问资源时，会在快速选择中提示用户输入所需参数。你可以提供补全建议参数值。

### 提示

提示是可复用的 Chat 提示模板，用户可在 Chat 中使用斜杠命令（`mcp.servername.promptname`）调用。提示可突出不同工具，或提供适应用户本地上下文和服务的内置复杂工作流，从而帮助用户了解服务器。

如果定义[补全](https://modelcontextprotocol.io/specification/2025-06-18/server/utilities/completion)以建议提示输入参数的值，VS Code 会显示对话框来收集用户输入。

```typescript
server.prompt(
    "teamGreeting", "Generate a greeting for team members",
    {
        name: completable(z.string(), (value) => {
            return ["Alice", "Bob", "Charlie"].filter(n => n.startsWith(value));
        })
    },
    async ({ name }) => ({
        messages: [{
            role: "assistant",
            content: { type: "text", text: `Hello ${name}, welcome to the team!` }
        }]
    })
);
```

![带输入参数的 MCP 提示对话框](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-prompt-argument.png)

> [!NOTE]
> 用户可以在提示对话框中输入终端命令，并将命令输出用作提示输入。

在提示响应中包含资源类型时，VS Code 会将该资源作为上下文附加到 Chat 提示。

### 授权

VS Code 支持需要身份验证的 MCP 服务器，使用户能够与代表其服务帐户运行的 MCP 服务器交互。

[授权规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)将 MCP 服务器作为资源服务器与授权服务器清晰分离，使开发人员可将身份验证委托给现有身份提供程序（IdP），而无需从头构建 OAuth 实现。

VS Code 内置支持 GitHub 和 Microsoft Entra 身份验证。如果 MCP 服务器实现最新规范并使用 GitHub 或 Microsoft Entra 作为授权服务器，用户可以通过相应帐户的 **Accounts menu** > **Manage Trusted MCP Servers** 操作，管理哪些 MCP 服务器可访问其帐户。

![包含管理受信任 MCP 服务器操作的帐户菜单](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/manage-trusted-mcp.png)

VS Code 支持使用 OAuth 2.1 和 2.0 标准向 GitHub 和 Microsoft Entra 之外的其他 IdP 授权。VS Code 会先启动[动态客户端注册（DCR）](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#dynamic-client-registration)握手；如果 IdP 不支持 DCR，则回退到客户端凭据工作流。这使不同 IdP 可以更灵活地相应地为每个 MCP 服务器创建静态客户端 ID 或特定的客户端 ID 与密钥对。

用户还可通过 **Accounts menu** 查看身份验证状态。要删除动态客户端注册，用户可在命令面板中使用 **Authentication: Remove Dynamic Authentication Providers** 命令。

以下清单可确保 MCP 服务器和 VS Code 的 OAuth 工作流正常运行：

1. MCP 服务器定义了 [MCP 授权规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)。
2. IdP 必须支持 DCR 或客户端凭据。
3. 重定向 URL 列表必须包含以下 URL：`http://127.0.0.1:33418` 和 `https://vscode.dev/redirect`。

当 MCP 服务器不支持 DCR 时，用户将使用回退客户端凭据流程：

![MCP 服务器不支持 DCR 时的授权](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-auth-dynamic-client-required.png)

![请求 MCP 服务器客户端 ID 时的授权](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-auth-client-id.png)

![请求 MCP 服务器客户端密钥时的授权](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-auth-client-secret.png)

> [!NOTE]
> VS Code 仍支持作为授权服务器运行的 MCP 服务器，但建议新服务器使用最新规范。

### 采样

VS Code 为 MCP 服务器提供[采样](https://modelcontextprotocol.io/docs/concepts/sampling)访问。这样 MCP 服务器可使用用户配置的模型和订阅发出语言模型请求。例如，可使用采样汇总大型数据集、在向客户端发送前提取信息，或在工具中实现代理式决策逻辑。

MCP 服务器首次执行采样请求时，会提示用户授权服务器访问其模型。

![允许 MCP 服务器访问模型的授权提示](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-allow-sampling.png)

使用特定模型发出采样请求时，请注意用户可通过命令面板中的 **MCP: List Servers** > **Configure Model Access** 命令限制 MCP 服务器可使用的模型。在 MCP 服务器中指定 `modelPreferences` 来提示用于采样的模型时，VS Code 将从允许的模型中选择。

![MCP 服务器的配置模型访问对话框](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-configure-model-access.png)

用户可通过命令面板中的 **MCP: List Servers** > **Show Sampling Requests** 命令查看 MCP 服务器发出的采样请求。

### 工作区根目录

VS Code 向 MCP 服务器提供用户工作区根文件夹信息。

### MCP 应用

MCP 应用使工具能够返回交互式 UI 组件，以在 Chat 中内联呈现，而不只是文本输出。这适用于拖放列表重新排序、可视化、表单和多步骤工作流等场景。

#### 架构

MCP 应用使用“工具 + UI 资源”模式：

1. 定义返回指向 UI 资源的 `_meta.ui.resourceUri` 的工具。
1. 使用 `ui://` URI 方案和 `text/html;profile=mcp-app` MIME 类型创建 UI 资源。
1. HTML 资源在沙盒 iframe 中运行，并使用 MCP Apps SDK 与 VS Code 通信。

#### SDK

使用 [`@modelcontextprotocol/ext-apps`](https://github.com/modelcontextprotocol/ext-apps) 包构建 MCP 应用。SDK 提供：

- **`App` 类**：与宿主通信的主接口。
    - `connect()`：与 VS Code 建立连接。
    - `callServerTool(name, args)`：调用源 MCP 服务器上的工具。
    - `sendMessage(content)`：向 Chat 输入框发送消息。
    - `updateModelContext(context)`：为后续会话轮次提供上下文。
    - `openLink(url)`：请求在浏览器中打开 URL。
    - `sendLog(level, message)`：发送调试日志，不会添加到会话中。

- **通知处理程序**：设置这些处理程序以接收来自 VS Code 的事件。
    - `ontoolinput`：接收完整工具参数。
    - `ontoolinputpartial`：接收流式传输的部分参数。
    - `ontoolresult`：接收工具执行结果。
    - `ontoolcancelled`：处理工具取消。
    - `onhostcontextchanged`：响应主题或区域设置变化。
    - `onteardown`：在卸载前清理。

#### VS Code 行为和限制

| 功能                     | VS Code 支持情况                                |
| ------------------------ | ----------------------------------------------- |
| 显示模式                 | 仅支持 `inline`，不支持 `fullscreen` 或 `pip`。 |
| 发送消息                 | 填充 Chat 输入框，不会自动发送。                |
| 上下文更新               | 显示为附件。                                    |
| 写入剪贴板               | 支持。                                          |
| 摄像头、麦克风、地理位置 | 不支持。                                        |

#### 安全性

MCP 应用在强制执行内容安全策略（CSP）的沙盒 iframe 中运行。定义 UI 资源时，请声明应用需要访问的域：

- `connectDomains`：用于 fetch/XHR 请求的域名。
- `resourceDomains`：用于图像、字体和其他资源的域名。
- `frameDomains`：可嵌入 iframe 的域名。

#### 了解更多

- [MCP Apps 规范](https://modelcontextprotocol.github.io/ext-apps/api/)
- [MCP Apps SDK 和示例](https://github.com/modelcontextprotocol/ext-apps)
- [MCP Apps 发布公告](https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support)

### 图标

VS Code 支持 MCP 服务器、资源和工具提供的 `icons`。MCP 图标具有 `src` 属性，它是图像的 URI：

- 使用 HTTP 或 SSE 传输的 MCP 服务器可以从其托管所在的同一授权域提供图像。例如，配置为 `https://example.com/mcp` 的服务器可从 `example.com` 提供图像。
- 使用 stdio 传输的 MCP 服务器可以使用 `file:///` URI 从文件系统提供图像。
- 任何 MCP 服务器都可以嵌入以 `data:` 开头的数据 URI 图像。

## 向 VS Code 添加 MCP 服务器

用户可以通过多种方式在 VS Code 中添加 MCP 服务器：

- 直接从 Web 安装：在网站上使用专用 MCP 安装 URL（`vscode:mcp/install`）。
- 工作区配置：在工作区的 `.vscode/mcp.json` 文件中指定服务器配置。
- 全局配置：在用户[配置文件](/docs/configure/profiles)中全局定义服务器。
- 自动发现：VS Code 可从 Claude Desktop 等其他工具发现服务器。
- 插件：VS Code 插件可通过编程方式注册 MCP 服务器。
- 命令行：使用 VS Code 命令行选项 `--add-mcp` 从命令行安装 MCP 服务器。

了解[向 VS Code 添加 MCP 服务器](/docs/agent-customization/mcp-servers#add-an-mcp-server)的不同方式。

## 管理 MCP 服务器

可从 VS Code 的插件视图（`kb(workbench.view.extensions)`）管理已安装 MCP 服务器列表。

![插件视图中的 MCP 服务器](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/extensions-view-mcp-servers.png)

右键单击 MCP 服务器，或选择齿轮图标，对服务器执行不同的管理操作。也可以从命令面板运行 **MCP: List Servers** 命令查看已配置 MCP 服务器列表，再选择服务器并执行操作。

> [!TIP]
> 打开 `.vscode/mcp.json` 文件时，VS Code 会在编辑器中显示命令，以便直接从编辑器启动、停止或重启服务器。
>
> ![带管理 CodeLens 的 MCP 服务器配置](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-server-config-lenses.png)

## 创建 MCP 安装 URL

VS Code 提供 URL 处理程序，可通过链接安装 MCP 服务器：`vscode:mcp/install?{json-configuration}`（Insiders：`vscode-insiders:mcp/install?{json-configuration}`）。

以 `{\"name\":\"server-name\",\"command\":...}` 的形式提供 JSON 服务器配置，然后对其进行 JSON 序列化和 URL 编码。例如，可使用以下逻辑创建安装 URL：

```typescript
// 对于 Insiders，请使用 `vscode-insiders` 而非 `code`
const link = `vscode:mcp/install?${encodeURIComponent(JSON.stringify(obj))}`;
```

该链接可在浏览器中使用，或在命令行中打开，例如在 Linux 上通过 `xdg-open $LINK` 打开。

## 在插件中注册 MCP 服务器

要在插件中注册 MCP 服务器，需要执行以下步骤：

1. 在插件的 `package.json` 文件中定义 MCP 服务器定义提供程序。
1. 使用 [`vscode.lm.registerMcpServerDefinitionProvider`](https://code.visualstudio.com/api/references/vscode-api#lm.registerMcpServerDefinitionProvider) API 在插件代码中实现 MCP 服务器定义提供程序。

可以从[如何在 VS Code 插件中注册 MCP 服务器的基础示例](https://github.com/microsoft/vscode-extension-samples/blob/main/mcp-extension-sample)开始。

### 1. 在 `package.json` 中进行静态配置

希望注册 MCP 服务器的插件必须在 `package.json` 中提供 `contributes.mcpServerDefinitionProviders` 配置点，并指定提供程序 `id`。该 `id` 应与实现中使用的 ID 匹配。

```json
{
    ...
    "contributes": {
        "mcpServerDefinitionProviders": [
            {
                "id": "exampleProvider",
                "label": "Example MCP Server Provider"
            }
        ]
    }
    ...
}
```

### 2. 实现提供程序

要在插件中注册 MCP 服务器，请使用 [`vscode.lm.registerMcpServerDefinitionProvider`](https://code.visualstudio.com/api/references/vscode-api#lm.registerMcpServerDefinitionProvider) API 提供服务器的 [MCP 配置](/docs/agents/reference/mcp-configuration.md)。该 API 接受 `providerId` 字符串和 `McpServerDefinitionProvider` 对象。

`McpServerDefinitionProvider` 对象具有三个属性：

- `onDidChangeMcpServerDefinitions`：MCP 服务器配置变更时触发的事件。
- `provideMcpServerDefinitions`：返回 MCP 服务器配置数组（`vscode.McpServerDefinition[]`）的函数。
- `resolveMcpServerDefinition`：MCP 服务器需要启动时由编辑器调用的函数。可使用此函数执行可能需要用户交互的额外操作，例如身份验证。

`McpServerDefinition` 对象可以是以下类型之一：

- `vscode.McpStdioServerDefinition`：表示通过运行本地进程并操作其 stdin 和 stdout 流提供的 MCP 服务器。
- `vscode.McpHttpServerDefinition`：表示通过可流式传输 HTTP 传输方式提供的 MCP 服务器。

<details>
<summary>MCP 服务器定义提供程序示例</summary>

以下示例演示如何在插件中注册 MCP 服务器，并在启动服务器时提示用户输入 API 密钥。

```ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const didChangeEmitter = new vscode.EventEmitter<void>();

    context.subscriptions.push(vscode.lm.registerMcpServerDefinitionProvider('exampleProvider', {
        onDidChangeMcpServerDefinitions: didChangeEmitter.event,
        provideMcpServerDefinitions: async () => {
            let servers: vscode.McpServerDefinition[] = [];

            // 简单 stdio 服务器定义示例
            servers.push(new vscode.McpStdioServerDefinition(
            {
                label: 'myServer',
                command: 'node',
                args: ['server.js'],
                cwd: vscode.Uri.file('/path/to/server'),
                env: {
                    API_KEY: ''
                },
                version: '1.0.0'
            });

            // HTTP 服务器定义示例
            servers.push(new vscode.McpHttpServerDefinition(
            {
                label: 'myRemoteServer',
                uri: 'http://localhost:3000',
                headers: {
                    'API_VERSION': '1.0.0'
                },
                version: '1.0.0'
            }));

            return servers;
        },
        resolveMcpServerDefinition: async (server: vscode.McpServerDefinition) => {

            if (server.label === 'myServer') {
                // 从用户获取 API 密钥，例如使用 vscode.window.showInputBox
                // 使用 API 密钥更新服务器定义
            }

            // 返回 undefined 表示不应启动服务器，或抛出错误
            // 如果存在待处理的工具调用，编辑器将取消它并向语言模型返回错误消息
            return server;
        }
    }));
}
```

</details>

## 排查和调试 MCP 服务器

### VS Code 中的 MCP 开发模式

开发 MCP 服务器时，可在 MCP 服务器配置中添加 `dev` 键，为 MCP 服务器启用_开发模式_。该对象有两个属性：

* `watch`：用于监视文件变更并重启 MCP 服务器的 glob 模式或 glob 模式数组。
* `debug`：允许为 MCP 服务器设置调试器。VS Code 当前支持调试 Node.js 和 Python MCP 服务器。

    <details>
    <summary>Node.js MCP 服务器</summary>

    要调试 Node.js MCP 服务器，请将 `debug.type` 属性设置为 `node`。

    ```json
    {
        "servers": {
            "my-mcp-server": {
                "type": "stdio",
                "command": "node",
                "cwd": "${workspaceFolder}",
                "args": [ "./build/index.js" ],
                "dev": {
                    "watch": "src/**/*.ts",
                    "debug": { "type": "node" }
                }
            }
        }
    }
    ```

    </details>

    <details>
    <summary>Python MCP 服务器</summary>

    要调试 Python MCP 服务器，请将 `debug.type` 属性设置为 `debugpy`。如果 `debugpy` 模块未安装在默认 Python 环境中，还可选择将 `debug.debugpyPath` 属性设置为该模块的路径。

    ```json
    {
        "servers": {
            "my-python-mcp-server": {
                "type": "stdio",
                "command": "python",
                "cwd": "${workspaceFolder}",
                "args": [ "./server.py" ],
                "dev": {
                    "watch": "**/*.py",
                    "debug": {
                        "type": "debugpy",
                        "debugpyPath": "/path/to/debugpy"
                    }
                }
            }
        }
    }
    ```

    </details>

### MCP 输出日志

当 VS Code 遇到 MCP 服务器问题时，会在聊天视图中显示错误指示器。

![MCP 服务器错误](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-error-loading-tool.png)

在聊天视图中选择错误通知，再选择 **Show Output** 选项以查看服务器日志。或者从命令面板运行 **MCP: List Servers**，选择服务器后再选择 **Show Output**。

![MCP 服务器错误输出](https://code.visualstudio.com/assets/api/extension-guides/ai/mcp/mcp-server-error-output.png)

## 最佳实践

- **遵循命名约定**，确保名称唯一且描述清晰。
- **实现适当的错误处理和验证**，并提供描述性错误消息。
- **使用进度报告**，让用户了解长时间运行的操作。
- **保持工具操作聚焦且原子化**，避免复杂交互。
- **清晰记录工具文档**，说明何时应使用工具。
- **妥善处理缺少的输入参数**，提供默认值或清晰的错误消息。
- **为资源设置 MIME 类型**，确保 VS Code 正确处理不同内容类型。
- **使用资源模板**，使用户访问资源时能够提供输入参数。
- **缓存资源内容**，提高性能并减少不必要的网络请求。
- **为采样请求设置合理的令牌限制**，避免过度占用资源。
- **在使用采样响应前进行验证**。

### 命名约定

建议 MCP 服务器及其组件采用以下命名约定：

| 组件         | 命名约定准则                                                                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 工具名称     | <ul><li>在 MCP 服务器内唯一。</li><li>描述操作及其目标。</li><li>使用蛇形命名法，结构为 `{verb}_{noun}`。</li><li>示例：`generate_report`、`fetch_data`、`analyze_code`。</li></ul>     |
| 工具输入参数 | <ul><li>描述参数用途。</li><li>多词参数使用 camelCase。</li><li>示例：`path`、`queryString`、`userId`。</li></ul>                                                                       |
| 资源名称     | <ul><li>在 MCP 服务器内唯一。</li><li>描述资源内容。</li><li>使用标题式大小写。</li><li>示例：`Application Logs`、`Database Table`、`GitHub Repository`。</li></ul>                     |
| 资源模板参数 | <ul><li>描述参数用途。</li><li>多词参数使用 camelCase。</li><li>示例：`name`、`repo`、`fileType`。</li></ul>                                                                            |
| 提示名称     | <ul><li>在 MCP 服务器内唯一。</li><li>描述提示的预期用途。</li><li>多词参数使用 camelCase。</li><li>示例：`generateApiRoute`、`performSecurityReview`、`analyzeCodeQuality`。</li></ul> |
| 提示输入参数 | <ul><li>描述参数用途。</li><li>多词参数使用 camelCase。</li><li>示例：`filePath`、`queryString`、`userId`。</li></ul>                                                                   |

## 开始创建 MCP 服务器

VS Code 拥有开发自己的 MCP 服务器所需的全部工具。虽然任何能够处理 `stdout` 的语言都可用于编写 MCP 服务器，但 MCP 官方 SDK 是很好的起点：

- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Java SDK](https://github.com/modelcontextprotocol/java-sdk)
- [Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk)
- [C# SDK](https://github.com/modelcontextprotocol/csharp-sdk)

[MCP for Beginners 课程](https://github.com/microsoft/mcp-for-beginners)也有助于开始构建第一个 MCP 服务器。

## 相关内容

- [提供语言模型工具](/extension-guides/ai/tools)
- [在代理模式中使用 MCP 工具](/docs/agent-customization/mcp-servers.md)
- [VS Code 精选 MCP 服务器列表](https://code.visualstudio.com/mcp)
- [模型上下文协议文档](https://modelcontextprotocol.io/)
