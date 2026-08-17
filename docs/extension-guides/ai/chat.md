# Chat Participant API

Chat 参与者是专门的助手，可让用户通过领域专家扩展 [VS Code Chat](/docs/chat/chat-overview)。用户通过 `@` 提及调用 Chat 参与者，参与者随后负责处理用户的自然语言提示。

本插件指南介绍如何使用 Chat Participant API 创建 Chat 参与者。

VS Code 提供多个内置 Chat 参与者，例如 `@vscode`、`@terminal` 或 `@workspace`。它们针对各自领域的问题进行了优化。

Chat 参与者不同于[语言模型工具](/extension-guides/ai/tools)。后者由 LLM 在编排解决用户 Chat 提示所需步骤时调用；Chat 参与者会接收用户提示，并自行编排所需任务。

## 为什么要在插件中实现 Chat 参与者？

在插件中实现 Chat 参与者有多项优势：

- **扩展 Chat**：提供专用的领域知识和专业能力。例如，内置的 `@vscode` 参与者了解 VS Code 及其插件 API。
- **掌控会话**：管理端到端的用户 Chat 提示和响应。
- **与 VS Code 深度集成**：使用丰富的插件 API。例如，使用[调试 API](/extension-guides/debugger-extension)获取当前调试上下文，并将其作为工具功能的一部分。
- **分发和部署**：通过 Visual Studio Marketplace 分发 Chat 参与者，为用户提供可靠且无缝的体验，无需单独安装和更新。

如果希望提供可作为自主代理式编码会话一部分自动调用的领域专用能力，可以考虑实现[语言模型工具](/extension-guides/ai/tools)或 [MCP 服务器](/extension-guides/ai/mcp)。有关不同选项及如何选择方法的详细信息，请参阅 [AI 扩展性概述](/extension-guides/ai/ai-extensibility-overview)。

## Chat 用户体验的组成部分

下图展示示例插件在 Visual Studio Code Chat 体验中的不同 Chat 概念。

![Chat 概念说明](https://code.visualstudio.com/assets/api/extension-guides/ai/chat/chat.png)

1. 使用 `@` 语法调用 `@cat` Chat 参与者。
1. 使用 `/` 语法调用 `/teach` 命令。
1. 用户提供的查询，也称为用户提示。
1. 图标和参与者 `fullName`，表明 Copilot 正在使用 `@cat` Chat 参与者。
1. `@cat` 提供的 Markdown 响应。
1. Markdown 响应中包含的代码片段。
1. `@cat` 响应中包含的按钮，该按钮调用 VS Code 命令。
1. Chat 参与者提供的建议[后续问题](#4-注册后续请求)。
1. Chat 输入框，其中的占位文本由 Chat 参与者的 `description` 属性提供。

## 创建 Chat 参与者

实现 Chat 参与者包括以下部分：

1. 在插件的 `package.json` 文件中定义 Chat 参与者。
1. 实现请求处理程序以处理用户 Chat 提示并返回响应。
1. （可选）实现 Chat 斜杠命令，为用户提供常见任务的简写。
1. （可选）定义建议的后续问题。
1. （可选）实现参与者检测，使 VS Code 无需用户显式提及即可自动将 Chat 请求路由到适当的 Chat 参与者。

可以从[基础示例项目](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)开始。

![插件如何提供 Chat 功能的示意图](https://code.visualstudio.com/assets/api/extension-guides/ai/chat/diagram.png)

### 1. 注册 Chat 参与者

创建 Chat 插件的第一步，是在 `package.json` 中注册它，并提供以下属性：

- `id`：在 `package.json` 文件中定义的 Chat 参与者唯一标识符。
- `name`：Chat 参与者的短名称，用于在 Chat 中使用 `@` 提及。
- `fullName`：Chat 参与者的全名，显示在响应的标题区域。
- `description`：Chat 参与者用途的简短说明，用作 Chat 输入框的占位文本。
- `isSticky`：布尔值，指示 Chat 参与者在响应后是否持续显示在 Chat 输入框中。

```json
"contributes": {
        "chatParticipants": [
            {
                "id": "chat-sample.my-participant",
                "name": "my-participant",
                "fullName": "My Participant",
                "description": "What can I teach you?",
                "isSticky": true
            }
        ]
}
```

建议 `name` 使用小写，`fullName` 使用标题式大小写，以与现有 Chat 参与者保持一致。有关详细信息，请参阅[Chat 参与者命名约定](#chat-参与者命名约定)。

> [!NOTE]
> 某些参与者名称已被保留。如果使用此类保留名称，VS Code 将显示 Chat 参与者的完全限定名称（包括插件 ID）。

### 2. 实现请求处理程序

使用 [Chat Participant API](https://code.visualstudio.com/api/references/vscode-api#chat) 实现 Chat 参与者，包括以下步骤：

1. 插件激活时，使用 `vscode.chat.createChatParticipant` 创建参与者。

    提供在 `package.json` 中定义的 ID，以及下一步实现的请求处理程序引用。

    ```typescript
    export function activate(context: vscode.ExtensionContext) {

        // Register the chat participant and its request handler
        const cat = vscode.chat.createChatParticipant('chat-sample.my-participant', handler);

        // Optionally, set some properties for @cat
        cat.iconPath = vscode.Uri.joinPath(context.extensionUri, 'cat.jpeg');

        // Add the chat request handler here
    }
    ```

1. 在 `activate` 函数中定义 `vscode.ChatRequestHandler` 请求处理程序。

    请求处理程序负责在 VS Code Chat 视图中处理用户 Chat 请求。每当用户在 Chat 输入框中输入提示，都会调用 Chat 请求处理程序。

    ```typescript
    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<ICatChatResult> => {

        // Chat request handler implementation goes here

    };
    ```

1. 从 `vscode.ChatRequest` 确定用户意图。

    要确定用户请求的意图，可以引用 `vscode.ChatRequest` 参数来访问用户提示文本、命令和 Chat 位置。

    还可以利用语言模型而非传统逻辑来确定用户意图。`request` 对象包含用户在 Chat 模型下拉列表中选择的语言模型实例。了解如何在插件中使用[语言模型 API](/extension-guides/ai/language-model)。

    以下代码片段展示基本结构：先使用命令，再使用用户提示确定用户意图：

    ```typescript
    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<ICatChatResult> => {

        // Test for the `teach` command
        if (request.command == 'teach') {

            // Add logic here to handle the teaching scenario
            doTeaching(request.prompt, request.variables);

        } else {

            // Determine the user's intent
            const intent = determineUserIntent(request.prompt, request.variables, request.model);

            // Add logic here to handle other scenarios
        }
    };
    ```

1. 添加处理用户请求的逻辑。

    Chat 插件通常使用 `request.model` 语言模型实例处理请求。在这种情况下，可以调整语言模型提示以匹配用户意图。

    也可以通过调用后端服务、使用传统编程逻辑，或结合这些选项来实现插件逻辑。例如，可以调用 Web 搜索来收集额外信息，再将其作为上下文提供给语言模型。

    处理当前请求时，可能需要参考以前的 Chat 消息。例如，如果之前的响应返回了 C# 代码片段，用户当前请求可能是“用 Python 给出代码”。了解如何[使用 Chat 消息历史](#使用-chat-消息历史)。

    如果希望根据 Chat 输入位置（Chat 视图、快速 Chat、内联 Chat）以不同方式处理请求，可以使用 `vscode.ChatRequest` 的 `location` 属性。例如，用户从终端内联 Chat 发送请求时，可以查找 shell 命令；而在 Chat 视图中，则可以返回更详细的响应。

1. 向用户返回 Chat 响应。

    处理请求后，需要在 Chat 视图中向用户返回响应。可以使用流式传输响应用户查询。

    响应可以包含不同内容类型：Markdown、图像、引用、进度、按钮和文件树。

    ![Cat 插件响应包含代码、Markdown 和按钮](https://code.visualstudio.com/assets/api/extension-guides/ai/chat/stream.png)

    插件可以按以下方式使用响应流：

    ```typescript
    stream.progress('Picking the right topic to teach...');
    stream.markdown(`\`\`\`typescript
    const myStack = new Stack();
    myStack.push(1); // pushing a number on the stack (or let's say, adding a fish to the stack)
    myStack.push(2); // adding another fish (number 2)
    console.log(myStack.pop()); // eating the top fish, will output: 2
    \`\`\`
    So remember, Code Kitten, in a stack, the last fish in is the first fish out - which we tech cats call LIFO (Last In, First Out).`);

    stream.button({
        command: 'cat.meow',
        title: vscode.l10n.t('Meow!'),
        arguments: []
    });
    ```

    有关详细信息，请参阅[支持的 Chat 响应输出类型](#支持的-chat-响应输出类型)。

    实践中，插件通常会向语言模型发送请求。收到语言模型响应后，可能会进一步处理，并决定是否向用户流式返回内容。VS Code Chat API 基于流式传输，并与流式[语言模型 API](/extension-guides/ai/language-model)兼容。这使插件能够持续报告进度和结果，以提供流畅的用户体验。了解如何使用[语言模型 API](/extension-guides/ai/language-model)。

### 3. 注册斜杠命令

Chat 参与者可以提供斜杠命令，它们是插件提供的特定功能的快捷方式。用户可在 Chat 中使用 `/` 语法引用斜杠命令，例如 `/explain`。

回答问题时的一项任务是确定用户意图。例如，VS Code 可推断 `Create a new workspace with Node.js Express Pug TypeScript` 表示想要创建新项目，但 `@workspace /new Node.js Express Pug TypeScript` 更明确、简洁，并节省输入时间。在 Chat 输入框中键入 `/` 时，VS Code 会提供注册命令及其说明的列表。

![Chat 中 @workspace 的命令列表](https://code.visualstudio.com/assets/api/extension-guides/ai/chat/commands.png)

Chat 参与者可在 `package.json` 中添加斜杠命令及其说明：

```typescript
"contributes": {
    "chatParticipants": [
        {
            "id": "chat-sample.cat",
            "name": "cat",
            "fullName": "Cat",
            "description": "Meow! What can I teach you?",
            "isSticky": true,
            "commands": [
                {
                    "name": "teach",
                    "description": "Pick at random a computer science concept then explain it in purfect way of a cat"
                },
                {
                    "name": "play",
                    "description": "Do whatever you want, you are a cat after all"
                }
            ]
        }
    ]
}
```

有关详细信息，请参阅[斜杠命令命名约定](#斜杠命令命名约定)。

### 4. 注册后续请求

每次 Chat 请求后，VS Code 都会调用后续提供程序来获取要显示给用户的建议后续问题。用户可选择后续问题并立即将其发送到 Chat 插件。使用 [`ChatFollowupProvider`](https://code.visualstudio.com/api/references/vscode-api#ChatFollowupProvider) API 注册 [`ChatFollowup`](https://code.visualstudio.com/api/references/vscode-api#ChatFollowup) 类型的后续提示。

以下代码片段展示如何在 Chat 插件中注册后续请求：

```typescript
cat.followupProvider = {
    provideFollowups(result: ICatChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
        if (result.metadata.command === 'teach') {
            return [{
                prompt: 'let us play',
                label: vscode.l10n.t('Play with the cat')
            } satisfies vscode.ChatFollowup];
        }
    }
};
```

> [!TIP]
> 后续内容应写成问题或指示，而不只是简短命令。

### 5. 实现参与者检测

为便于使用自然语言调用 Chat 参与者，可以实现参与者检测。参与者检测可将用户问题自动路由到适当参与者，无需在提示中显式提及参与者。例如，用户询问“如何为项目添加登录页？”时，问题会自动路由到 `@workspace` 参与者，因为它可回答有关用户项目的问题。

VS Code 使用 Chat 参与者说明和示例来确定应将 Chat 提示路由到哪个参与者。可以在插件 `package.json` 文件的 `disambiguation` 属性中指定此信息。`disambiguation` 属性包含检测类别列表，每个类别都具有说明和示例。

| 属性          | 说明                                                             | 示例                                                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `category`    | 检测类别。如果参与者服务于不同用途，可以为每种用途设置一个类别。 | <ul><li>`cat`</li><li>`workspace_questions`</li><li>`web_questions`</li></ul>                                                                                                         |
| `description` | 适合此参与者处理的问题类型的详细说明。                           | <ul><li>`The user wants to learn a specific computer science topic in an informal way.`</li><li>`The user just wants to relax and see the cat play.`</li></ul>                        |
| `examples`    | 具有代表性的示例问题列表。                                       | <ul><li>`Teach me C++ pointers using metaphors`</li><li>`Explain to me what is a linked list in a simple way`</li><li>`Can you show me a cat playing with a laser pointer?`</li></ul> |

可以为整个 Chat 参与者、特定命令或两者的组合定义参与者检测。

以下代码片段展示如何在参与者级别实现参与者检测。

```json
"contributes": {
    "chatParticipants": [
        {
            "id": "chat-sample.cat",
            "fullName": "Cat",
            "name": "cat",
            "description": "Meow! What can I teach you?",

            "disambiguation": [
                {
                    "category": "cat",
                    "description": "The user wants to learn a specific computer science topic in an informal way.",
                    "examples": [
                        "Teach me C++ pointers using metaphors",
                        "Explain to me what is a linked list in a simple way",
                        "Can you explain to me what is a function in programming?"
                    ]
                }
            ]
        }
    ]
}
```

同样，也可在 `commands` 属性的一个或多个项目中添加 `disambiguation` 属性，在命令级别配置参与者检测。

应用以下准则可提高插件参与者检测的准确性：

- **保持具体**：说明和示例应尽可能具体，以避免与其他参与者冲突。避免在参与者和命令信息中使用泛泛术语。
- **使用示例**：示例应能代表适合参与者处理的问题类型。使用同义词和变体以覆盖广泛的用户查询。
- **使用自然语言**：说明和示例应使用自然语言编写，就像你把参与者解释给用户听一样。
- **测试检测**：使用变体示例问题测试参与者检测，并确认不会与内置 Chat 参与者冲突。

> [!NOTE]
> 内置 Chat 参与者在参与者检测中具有优先级。例如，处理工作区文件的 Chat 参与者可能与内置 `@workspace` 参与者冲突。

## 使用 Chat 消息历史

参与者可以访问当前 Chat 会话的消息历史。参与者只能访问其中被提及的消息。`history` 项为 `ChatRequestTurn` 或 `ChatResponseTurn`。例如，可使用以下代码片段检索当前 Chat 会话中用户发送给参与者的所有先前请求：

```typescript
const previousMessages = context.history.filter(h => h instanceof vscode.ChatRequestTurn);
```

历史记录不会自动包含在提示中。参与者自行决定在向语言模型传递消息时，是否将历史记录作为附加上下文。

## 支持的 Chat 响应输出类型

要返回 Chat 请求的响应，请使用 [`ChatRequestHandler`](https://code.visualstudio.com/api/references/vscode-api#ChatRequestHandler) 上的 [`ChatResponseStream`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream) 参数。

以下列表列出 Chat 视图中 Chat 响应的输出类型。Chat 响应可组合多种不同输出类型。

- **Markdown**

    呈现一段 Markdown 文本、纯文本或图像。可以使用 [CommonMark](https://commonmark.org/) 规范中的任意 Markdown 语法。使用 [`ChatResponseStream.markdown`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.markdown) 方法并提供 Markdown 文本。

    示例代码片段：

    ```typescript
    // Render Markdown text
    stream.markdown('# This is a title \n');
    stream.markdown('This is stylized text that uses _italics_ and **bold**. ');
    stream.markdown('This is a [link](https://code.visualstudio.com).\n\n');
    stream.markdown('![VS Code](https://code.visualstudio.com/assets/favicon.ico)');
    ```

- **代码块**

    呈现支持 IntelliSense、代码格式化和交互控件的代码块，以便将代码应用到活动编辑器。要显示代码块，请使用 [`ChatResponseStream.markdown`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.markdown) 方法并应用代码块的 Markdown 语法（使用反引号）。

    示例代码片段：

    ```typescript
    // Render a code block that enables users to interact with
    stream.markdown('```bash\n');
    stream.markdown('```ls -l\n');
    stream.markdown('```');
    ```

- **命令链接**

    在 Chat 响应中呈现内联链接，用户可选择该链接来调用 VS Code 命令。要显示命令链接，请使用 [`ChatResponseStream.markdown`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.markdown) 方法，并使用链接的 Markdown 语法 `[链接文本](command:commandId)`，其中 URL 中提供命令 ID。例如，以下链接会打开命令面板：`[命令面板](command:workbench.action.showCommands)`。

    从服务加载 Markdown 文本时，为防止命令注入，必须使用 [`vscode.MarkdownString`](https://code.visualstudio.com/api/references/vscode-api#MarkdownString) 对象，并将其 `isTrusted` 属性设置为受信任 VS Code 命令 ID 列表。该属性是使命令链接生效的必要条件。如果未设置 `isTrusted` 属性，或命令未列入其中，命令链接将无法工作。

    示例代码片段：

    ```typescript
    // Use command URIs to link to commands from Markdown
    let markdownCommandString: vscode.MarkdownString = new vscode.MarkdownString(`[Use cat names](command:${CAT_NAMES_COMMAND_ID})`);
    markdownCommandString.isTrusted = { enabledCommands: [ CAT_NAMES_COMMAND_ID ] };

    stream.markdown(markdownCommandString);
    ```

    如果命令接受参数，需要先对参数进行 JSON 编码，再将 JSON 字符串编码为 URI 组件。然后将编码后的参数作为查询字符串追加到命令链接。

    ```typescript
    // Encode the command arguments
    const encodedArgs = encodeURIComponent(JSON.stringify(args));

    // Use command URIs with arguments to link to commands from Markdown
    let markdownCommandString: vscode.MarkdownString = new vscode.MarkdownString(`[Use cat names](command:${CAT_NAMES_COMMAND_ID}?${encodedArgs})`);
    markdownCommandString.isTrusted = { enabledCommands: [ CAT_NAMES_COMMAND_ID ] };

    stream.markdown(markdownCommandString);
    ```

- **命令按钮**

    呈现调用 VS Code 命令的按钮。该命令可以是内置命令，也可以是在插件中定义的命令。使用 [`ChatResponseStream.button`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.button) 方法并提供按钮文本和命令 ID。

    示例代码片段：

    ```typescript
    // Render a button to trigger a VS Code command
    stream.button({
        command: 'my.command',
        title: vscode.l10n.t('Run my command')
    });
    ```

- **文件树**

    呈现文件树控件，让用户预览单个文件。例如，在建议创建新工作区时显示工作区预览。使用 [`ChatResponseStream.filetree`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.filetree) 方法，并提供文件树元素数组及文件的基准位置（文件夹）。

    示例代码片段：

    ```typescript
    // Create a file tree instance
    var tree: vscode.ChatResponseFileTree[] = [
        { name: 'myworkspace', children: [
            { name: 'README' },
            { name: 'app.js' },
            { name: 'package.json' }
        ]}
    ];

    // Render the file tree control at a base location
    stream.filetree(tree, baseLocation);
    ```

- **进度消息**

    在长时间运行的操作期间呈现进度消息，为用户提供中间反馈。例如，报告多步骤操作中每一步的完成情况。使用 [`ChatResponseStream.progress`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.progress) 方法并提供消息。

    示例代码片段：

    ```typescript
    // Render a progress message
    stream.progress('Connecting to the database.');
    ```

- **引用**

    在引用列表中为外部 URL 或编辑器位置添加引用，以表明使用了哪些信息作为上下文。使用 [`ChatResponseStream.reference`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.reference) 方法并提供引用位置。

    示例代码片段：

    ```typescript
    const fileUri: vscode.Uri = vscode.Uri.file('/path/to/workspace/app.js');  // On Windows, the path should be in the format of 'c:\\path\\to\\workspace\\app.js'
    const fileRange: vscode.Range = new vscode.Range(0, 0, 3, 0);
    const externalUri: vscode.Uri = vscode.Uri.parse('https://code.visualstudio.com');

    // Add a reference to an entire file
    stream.reference(fileUri);

    // Add a reference to a specific selection within a file
    stream.reference(new vscode.Location(fileUri, fileRange));

    // Add a reference to an external URL
    stream.reference(externalUri);
    ```

- **内联引用**

    为 URI 或编辑器位置添加内联引用。使用 [`ChatResponseStream.anchor`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.anchor) 方法并提供锚点位置和可选标题。要引用符号（例如类或变量），应使用编辑器中的位置。

    示例代码片段：

    ```typescript
    const symbolLocation: vscode.Uri = vscode.Uri.parse('location-to-a-symbol');

    // Render an inline anchor to a symbol in the workspace
    stream.anchor(symbolLocation, 'MySymbol');
    ```

> **重要**：图像和链接仅在其来源域名位于受信任域名列表中时可用。有关详细信息，请参阅 [VS Code 中的链接保护](/docs/editing/editingevolved#outgoing-link-protection)。

## 实现工具调用

为响应用户请求，Chat 插件可调用语言模型工具。了解更多[语言模型工具](/extension-guides/ai/tools)和[工具调用流程](/extension-guides/ai/tools#工具调用流程)。

可以通过两种方式实现工具调用：

- 使用 [`@vscode/chat-extension-utils` 库](https://www.npmjs.com/package/@vscode/chat-extension-utils)，以简化在 Chat 插件中调用工具的过程。
- 自行实现工具调用，以获得对工具调用过程的更多控制，例如在将工具响应发送给 LLM 前执行额外验证或以特定方式处理工具响应。

### 使用 Chat 插件库实现工具调用

可以使用 [`@vscode/chat-extension-utils` 库](https://www.npmjs.com/package/@vscode/chat-extension-utils)，以简化在 Chat 插件中调用工具的过程。

在 [Chat 参与者](/extension-guides/ai/chat) 的 `vscode.ChatRequestHandler` 函数中实现工具调用。

1. 确定当前 Chat 上下文中相关的工具。可以使用 `vscode.lm.tools` 访问所有可用工具。

    以下代码片段展示如何筛选仅具有特定标签的工具。

    ```ts
    const tools = request.command === 'all' ?
        vscode.lm.tools :
        vscode.lm.tools.filter(tool => tool.tags.includes('chat-tools-sample'));
    ```

1. 使用 `sendChatParticipantRequest` 将请求和工具定义发送给 LLM。

    ```ts
    const libResult = chatUtils.sendChatParticipantRequest(
        request,
        chatContext,
        {
            prompt: 'You are a cat! Answer as a cat.',
            responseStreamOptions: {
                stream,
                references: true,
                responseText: true
            },
            tools
        },
        token);
    ```

    `ChatHandlerOptions` 对象具有以下属性：

    - `prompt`：（可选）Chat 参与者提示的说明。
    - `model`：（可选）用于请求的模型。未指定时，使用 Chat 上下文中的模型。
    - `tools`：（可选）请求时要考虑的工具列表。
    - `requestJustification`：（可选）描述发出请求原因的字符串。
    - `responseStreamOptions`：（可选）使 `sendChatParticipantRequest` 将响应流式传回 VS Code。还可选择启用引用和响应文本。

1. 返回 LLM 的结果，其中可能包含错误详细信息或工具调用元数据。

    ```ts
    return await libResult.result;
    ```

此[工具调用示例](https://github.com/microsoft/vscode-extension-samples/blob/main/chat-sample/src/chatUtilsSample.ts)的完整源代码可在 VS Code 插件示例仓库中获得。

### 自行实现工具调用

对于更高级的场景，也可以自行实现工具调用。还可选择使用 `@vscode/prompt-tsx` 库来设计 LLM 提示。自行实现工具调用可获得对该流程的更多控制，例如在将工具响应发送给 LLM 前执行额外验证，或以特定方式处理工具响应。

在 VS Code 插件示例仓库中查看使用 [prompt-tsx 实现工具调用](https://github.com/microsoft/vscode-extension-samples/blob/main/chat-sample/src/toolParticipant.ts)的完整源代码。

## 衡量成功度

建议为 `Unhelpful` 用户反馈事件以及参与者处理的请求总数添加遥测日志，以衡量参与者的成功度。初始的参与者成功指标可定义为：`unhelpful_feedback_count / total_requests`。

```typescript
const logger = vscode.env.createTelemetryLogger({
     // telemetry logging implementation goes here
});

cat.onDidReceiveFeedback((feedback: vscode.ChatResultFeedback) => {
    // Log chat result feedback to be able to compute the success metric of the participant
    logger.logUsage('chatResultFeedback', {
        kind: feedback.kind
    });
});
```

与 Chat 响应的任何其他用户交互都应作为正向指标衡量，例如用户选择 Chat 响应中生成的按钮。使用遥测来衡量成功度对于使用 AI 至关重要，因为 AI 是非确定性技术。请运行实验、进行度量并迭代改进参与者，以确保良好的用户体验。

## 指南和约定

### 指南

Chat 参与者不应只是问答机器人。构建 Chat 参与者时，应发挥创造力并使用现有 VS Code API 在 VS Code 中创建丰富的集成。用户也喜欢丰富且便利的交互，例如响应中的按钮、将用户引导到 Chat 参与者的菜单项。请思考 AI 能帮助用户的真实场景。

并非每个插件都适合提供 Chat 参与者。Chat 中存在过多参与者可能造成不佳的用户体验。当希望控制完整提示（包括给语言模型的说明）时，Chat 参与者最为适合。你可以复用精心设计的 Copilot 系统消息，也可以向其他参与者提供上下文。

例如，语言插件（如 C++ 插件）还可以通过多种方式提供功能：

- 提供将语言服务智能能力带入用户查询的工具。例如，C++ 插件可将 `#cpp` 工具解析为工作区的 C++ 状态，为 Copilot 语言模型提供正确的 C++ 上下文，以提升其 C++ 答案质量。
- 提供使用语言模型的智能操作，也可选择结合传统语言服务知识以带来良好用户体验。例如，C++ 可能已提供“提取为方法”智能操作，使用语言模型为新方法生成合适的默认名称。

Chat 插件在即将执行成本高昂的操作，或编辑、删除无法撤销的内容时，应明确征得用户同意。为获得良好用户体验，不建议插件提供多个 Chat 参与者。每个插件最多一个 Chat 参与者是可在 UI 中良好扩展的简单模型。

### Chat 参与者命名约定

| 属性          | 说明                                                                                      | 命名准则                                                                                                                                                                                                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | Chat 参与者的全局唯一标识符。                                                             | <ul><li>字符串值。</li><li>使用插件名称作为前缀，后跟插件内唯一 ID。</li><li>示例：`chat-sample.cat`、`code-visualizer.code-visualizer-participant`。</li></ul>                                                                                                                                                             |
| `name`        | 用户通过 `@` 符号引用的 Chat 参与者名称。                                                 | <ul><li>由字母数字字符、下划线和连字符组成的字符串值。</li><li>建议仅使用小写，以与现有 Chat 参与者保持一致。</li><li>通过公司名称或功能，确保名称能明显表达参与者用途。</li><li>某些参与者名称已被保留；使用保留名称时会显示包含插件 ID 的完全限定名称。</li><li>示例：`vscode`、`terminal`、`code-visualizer`。</li></ul> |
| `fullName`    | （可选）参与者全名，显示为来自参与者的响应标签。                                          | <ul><li>字符串值。</li><li>建议使用[标题式大小写](https://en.wikipedia.org/wiki/Title_case)。</li><li>使用公司名称、品牌名称或对用户友好的参与者名称。</li><li>示例：`GitHub Copilot`、`VS Code`、`Math Tutor`。</li></ul>                                                                                                  |
| `description` | （可选）Chat 参与者用途的简短说明，显示为 Chat 输入框中的占位符文本或参与者列表中的说明。 | <ul><li>字符串值。</li><li>建议使用句式大小写，末尾不加标点。</li><li>保持说明简短，避免水平滚动。</li><li>示例：`Ask questions about VS Code`、`Generate UML diagrams for your code`。</li></ul>                                                                                                                           |

在属性、Chat 响应或 Chat 用户界面等任何面向用户的元素中引用 Chat 参与者时，建议不要使用术语*参与者*，因为这是 API 的名称。例如，`@cat` 插件可称为“用于 GitHub Copilot 的 Cat 插件”。

### 斜杠命令命名约定

| 属性          | 说明                                                                                         | 命名准则                                                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | 用户通过 `/` 符号引用的斜杠命令名称。                                                        | <ul><li>字符串值。</li><li>建议使用[小驼峰命名法](https://en.wikipedia.org/wiki/Camel_case)，以与现有斜杠命令保持一致。</li><li>确保命令用途可从其名称中明显看出。</li><li>示例：`fix`、`explain`、`runCommand`。</li></ul> |
| `description` | （可选）斜杠命令功能的简短说明，显示为 Chat 输入框中的占位符文本或参与者和命令列表中的说明。 | <ul><li>字符串值。</li><li>建议使用句式大小写，末尾不加标点。</li><li>保持说明简短，避免水平滚动。</li><li>示例：`Search for and execute a command in VS Code`、`Generate unit tests for the selected code`。</li></ul>     |

## 发布插件

创建 AI 插件后，可以将其发布到 Visual Studio Marketplace：

- 在发布到 VS Marketplace 前，建议阅读 [Microsoft AI 工具和实践指南](https://www.microsoft.com/en-us/ai/tools-practices)，其中提供了负责任地开发和使用 AI 技术的最佳实践。
- 发布到 VS Marketplace 即表示插件遵循 [GitHub Copilot 扩展性可接受的开发和使用政策](https://docs.github.com/en/early-access/copilot/github-copilot-extensibility-platform-partnership-plugin-acceptable-development-and-use-policy)。
- 按照[发布插件](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)中的说明上传到 Marketplace。
- 如果插件除 Chat 外还提供其他功能，建议不要在[插件清单](/references/extension-manifest)中引入对 GitHub Copilot 的插件依赖。这样，不使用 GitHub Copilot 的插件用户无需安装它，仍可使用非 Chat 功能。

## 通过 GitHub Apps 扩展 GitHub Copilot

另一种方法是创建在 Chat 视图中提供 Chat 参与者的 GitHub App 来扩展 GitHub Copilot。GitHub App 由服务支持，可跨 github.com、Visual Studio 和 VS Code 等所有 GitHub Copilot 界面运行。另一方面，GitHub Apps 无法完全访问 VS Code API。有关通过 GitHub App 扩展 GitHub Copilot 的更多信息，请参阅 [GitHub 文档](https://docs.github.com/en/copilot/building-copilot-extensions/about-building-copilot-extensions)。

## 使用语言模型

Chat 参与者可以通过多种方式使用语言模型。一些参与者仅使用语言模型回答自定义提示，例如[示例 Chat 参与者](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)。另一些参与者更高级，像自主代理一样在语言模型帮助下调用多个工具。内置的 `@workspace` 就是此类高级参与者的示例，它了解工作区并可回答相关问题。在内部，`@workspace` 由多个工具支持：GitHub 知识图谱、语义搜索、本地代码索引和 VS Code 语言服务。

## 相关内容

- [Chat Participant API 参考](https://code.visualstudio.com/api/references/vscode-api#chat)
- [在插件中使用语言模型 API](/extension-guides/ai/language-model)
- [提供语言模型工具](/extension-guides/ai/tools)
