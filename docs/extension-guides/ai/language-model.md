# 语言模型 API

语言模型 API 让你能够[使用语言模型](https://code.visualstudio.com/api/references/vscode-api#lm)，并在 Visual Studio Code 插件中集成 AI 驱动功能和自然语言处理。

你可以在不同类型的插件中使用语言模型 API。该 API 的典型用途是 [Chat 插件](/extension-guides/ai/chat)：使用语言模型解读用户请求并协助提供答案。但语言模型 API 并不局限于此场景。你可以在[语言](/language-extensions)或[调试器](/extension-guides/debugger-extension)插件中使用语言模型，也可以将其作为自定义插件中[命令](/extension-guides/command)或[任务](/extension-guides/task-provider)的一部分。例如，Rust 插件可使用语言模型提供默认名称，改善重命名体验。

使用语言模型 API 的过程包括以下步骤：

1. 构建语言模型提示。
1. 发送语言模型请求。
1. 解读响应。

以下各节将更详细地说明如何在插件中实现这些步骤。

要开始使用，可参考 [Chat 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)。

## 构建语言模型提示

要与语言模型交互，插件应先构建提示，然后向语言模型发送请求。你可以使用提示向语言模型说明使用模型完成的总体任务，也可以通过提示定义解读用户消息的上下文。

语言模型 API 在构建语言模型提示时支持两类消息：

- **用户**：用于提供说明和用户请求。
- **助手**：用于将先前语言模型响应的历史记录作为上下文添加到提示中。

> **注意**：语言模型 API 目前不支持系统消息。

构建语言模型提示可使用两种方法：

- `LanguageModelChatMessage`：通过提供一条或多条字符串消息创建提示。刚开始使用语言模型 API 时可采用此方法。
- [`@vscode/prompt-tsx`](https://www.npmjs.com/package/@vscode/prompt-tsx)：使用 TSX 语法声明提示。

若要更精细地控制语言模型提示的组成方式，可以使用 `prompt-tsx` 库。例如，该库可帮助你根据每个语言模型的上下文窗口大小动态调整提示长度。了解更多 [`@vscode/prompt-tsx`](https://www.npmjs.com/package/@vscode/prompt-tsx)，或浏览 [Chat 插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)。

要进一步了解提示工程的概念，建议阅读 OpenAI 的[提示工程指南](https://platform.openai.com/docs/guides/prompt-engineering)。

>**提示：**充分利用丰富的 VS Code 插件 API 获取最相关的上下文，并将其纳入提示中，例如编辑器中活动文件的内容。

### 使用 `LanguageModelChatMessage` 类

语言模型 API 提供 `LanguageModelChatMessage` 类以表示和创建聊天消息。你可以分别使用 `LanguageModelChatMessage.User` 或 `LanguageModelChatMessage.Assistant` 方法创建用户或助手消息。

在以下示例中，第一条消息为提示提供上下文：

- 模型在回复中使用的角色设定（本例为猫）。
- 模型生成响应时应遵循的规则（本例为使用猫的比喻，以有趣方式解释计算机科学概念）。

第二条消息提供来自用户的具体请求或指令。结合第一条消息提供的上下文，它确定要完成的具体任务。

```typescript
const craftedPrompt = [
    vscode.LanguageModelChatMessage.User('You are a cat! Think carefully and step by step like a cat would. Your job is to explain computer science concepts in the funny manner of a cat, using cat metaphors. Always start your response by stating what concept you are explaining. Always include code samples.'),
    vscode.LanguageModelChatMessage.User('I want to understand recursion')
];
```

## 发送语言模型请求

构建语言模型提示后，先使用 [`selectChatModels`](https://code.visualstudio.com/api/references/vscode-api#lm.selectChatModels) 方法选择要使用的语言模型。该方法返回符合指定条件的语言模型数组。若正在实现聊天参与者，建议改为使用聊天请求处理程序中 `request` 对象传入的模型，以确保扩展遵从用户在聊天模型下拉列表中选择的模型。然后使用 [`sendRequest`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat) 方法向语言模型发送请求。

要选择语言模型，可以指定 `vendor`、`id`、`family` 或 `version` 属性。可使用这些属性广泛匹配指定供应商或模型系列的所有模型，也可通过 ID 选择特定模型。有关这些属性的更多信息，请参阅 [API 参考](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat)。

> **注意**：语言模型系列目前支持 `gpt-4o`、`gpt-4o-mini`、`o1`、`o1-mini` 和 `claude-3.5-sonnet`。如果不确定要使用哪个模型，基于性能和质量，建议使用 `gpt-4o`。对于直接在编辑器中进行的交互，基于性能，建议使用 `gpt-4o-mini`。

如果没有符合指定条件的模型，`selectChatModels` 方法将返回空数组。插件必须妥善处理这种情况。

以下示例展示如何选择所有 `Copilot` 模型，不考虑模型系列或版本：

```typescript
const models = await vscode.lm.selectChatModels({
  vendor: 'copilot'
});

// 没有可用模型
if (models.length === 0) {
    // TODO：处理没有可用模型的情况
}
```

> **重要**：插件使用 Copilot 的语言模型前需要获得用户同意。此同意通过身份验证对话框实现。因此，应将 `selectChatModels` 作为用户发起的操作（例如命令）的一部分调用。

选择模型后，可在模型实例上调用 [`sendRequest`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat) 方法向语言模型发送请求。传入此前构建的[提示](#构建语言模型提示)、任何附加选项和取消令牌。

向语言模型 API 发出请求时，请求可能失败，例如模型不存在、用户未同意使用语言模型 API，或超过配额限制。使用 `LanguageModelError` 区分不同类型的错误。

以下代码片段展示如何发出语言模型请求：

```typescript
try {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
    const request = model.sendRequest(craftedPrompt, {}, token);
} catch (err) {
    // 发出 Chat 请求可能失败，原因包括：
    // - 模型不存在
    // - 用户未给予同意
    // - 超过配额限制
    if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
        if (err.cause instanceof Error && err.cause.message.includes('off_topic')) {
            stream.markdown(vscode.l10n.t('I\'m sorry, I can only explain computer science concepts.'));
        }
    } else {
        // 添加其他错误处理逻辑
        throw err;
    }
}
```

## 解读响应

发送请求后，需要处理语言模型 API 的响应。根据使用场景，你可以将响应直接交给用户，也可以解读响应并执行额外逻辑。

语言模型 API 的响应（[`LanguageModelChatResponse`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChatResponse)）基于流式传输，可提供流畅的用户体验。例如，结合[聊天 API](/extension-guides/ai/chat) 使用时，可以持续报告结果和进度。

处理流式响应时可能出现错误，例如网络连接问题。请确保在代码中添加适当的错误处理逻辑。

以下代码片段展示插件如何注册命令，使用语言模型将活动编辑器中的所有变量名替换为有趣的猫名。请注意，插件会将代码流式传回编辑器，以提供流畅的用户体验。

```typescript
 vscode.commands.registerTextEditorCommand('cat.namesInEditor', async (textEditor: vscode.TextEditor) => {
    // 将活动编辑器中的所有变量替换为猫名和相关词语

    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
    let chatResponse: vscode.LanguageModelChatResponse | undefined;

    const text = textEditor.document.getText();

    const messages = [
        vscode.LanguageModelChatMessage.User(`You are a cat! Think carefully and step by step like a cat would.
        Your job is to replace all variable names in the following code with funny cat variable names. Be creative. IMPORTANT respond just with code. Do not use markdown!`),
        vscode.LanguageModelChatMessage.User(text)
    ];

    try {
        chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
    } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            console.log(err.message, err.code, err.cause)
        } else {
            throw err;
        }
        return;
    }

    // 插入新内容前清空编辑器内容
    await textEditor.edit(edit => {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(textEditor.document.lineCount - 1, textEditor.document.lineAt(textEditor.document.lineCount - 1).text.length);
        edit.delete(new vscode.Range(start, end));
    });

    try {
        // 在语言模型输出代码时将其流式写入编辑器
        for await (const fragment of chatResponse.text) {
            await textEditor.edit(edit => {
                const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                edit.insert(position, fragment);
            });
        }
    } catch (err) {
        // 异步响应流可能失败，例如网络中断或服务器端错误
        await textEditor.edit(edit => {
            const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
            const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
            edit.insert(position, (<Error>err).message);
        });
    }
});
```

## 注意事项

### 模型可用性

我们无法保证特定模型会永远得到支持。在插件中引用语言模型时，发送请求应采取“防御性”方式。这意味着应妥善处理无法访问某个特定模型的情况。

### 选择合适的模型

插件作者可以选择最适合其插件的模型。基于性能和质量，我们推荐使用 `gpt-4o`。要获取可用模型的完整列表，可以使用以下代码片段：

```typescript
const allModels = await vscode.lm.selectChatModels(MODEL_SELECTOR);
```

> [!NOTE]
> 推荐的 GPT-4o 模型限制为 `64K` 个令牌。`selectChatModels` 调用返回的模型对象具有 `maxInputTokens` 属性，可显示令牌限制。随着我们进一步了解扩展如何使用语言模型，这些限制将会扩大。

### 速率限制

插件应负责任地使用语言模型，并注意速率限制。VS Code 会向用户透明展示插件如何使用语言模型、每个插件发送的请求数量，以及这如何影响各自的配额。

由于速率限制，插件不应将语言模型 API 用于集成测试。VS Code 内部使用专用的非生产语言模型进行模拟测试，我们正在研究如何为插件提供可扩展的语言模型测试解决方案。

## 测试插件

语言模型 API 提供的响应是非确定性的，即相同请求可能得到不同响应。这种行为会给插件测试带来挑战。

插件中构建提示和解读语言模型响应的部分是确定性的，因此无需实际语言模型即可进行单元测试。但是，与语言模型本身交互和获取响应是非确定性的，难以轻松测试。请考虑以模块化方式设计插件代码，以便对可测试的特定部分进行单元测试。

## 发布插件

创建 AI 插件后，可以将其发布到 Visual Studio Marketplace：

- 在发布到 VS Marketplace 前，建议阅读 [Microsoft AI 工具和实践指南](https://www.microsoft.com/en-us/ai/tools-practices)，其中提供了负责任地开发和使用 AI 技术的最佳实践。
- 发布到 VS Marketplace 即表示插件遵循 [GitHub Copilot 扩展性可接受的开发和使用政策](https://docs.github.com/en/early-access/copilot/github-copilot-extensibility-platform-partnership-plugin-acceptable-development-and-use-policy)。
- 如果插件除使用语言模型 API 外还提供其他功能，建议不要在[插件清单](/references/extension-manifest)中引入对 GitHub Copilot 的插件依赖。这样，不使用 GitHub Copilot 的插件用户无需安装它，仍可使用非语言模型功能。在此情况下访问语言模型时，请确保具备适当的错误处理。
- 按照[发布插件](/working-with-extensions/publish-extension)中的说明上传到 Marketplace。

## 相关内容

- [语言模型 API 参考](https://code.visualstudio.com/api/references/vscode-api#lm)
- [了解更多 @vscode/prompt-tsx](https://www.npmjs.com/package/@vscode/prompt-tsx)
- [构建 VS Code Chat 插件](/extension-guides/ai/chat)
