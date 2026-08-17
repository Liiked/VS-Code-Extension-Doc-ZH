# 语言模型Chat供应器 API

语言模型Chat供应器 API 使你能够将自己的语言模型提供给 Visual Studio Code 中的Chat功能。

> [!NOTE]
> 如果你是 Copilot Business 或 Enterprise 用户，管理员可在 GitHub.com 的 [Copilot 策略设置](https://github.com/settings/copilot/features)中，为通过此 API 提供的模型禁用 **自带语言模型密钥** 策略。

## 概述

`LanguageModelChatProvider` 接口采用一个供应器对应多个模型的关系，使供应器能够提供多个模型。每个供应器负责：

- 发现并准备可用的语言模型。
- 处理其模型的Chat请求。
- 提供令牌计数功能。

## 语言模型信息

每个语言模型都必须通过 `LanguageModelChatInformation` 接口提供元数据。`provideLanguageModelChatInformation` 方法返回这些对象的数组，以告知 VS Code 可用的模型。

```typescript
interface LanguageModelChatInformation {
    readonly id: string;                    // 模型的唯一标识符，在供应器内唯一
    readonly name: string;                  // 语言模型的人类可读名称，显示在模型选择器中
    readonly family: string;                // 模型系列名称
    readonly version: string;               // 版本字符串
    readonly maxInputTokens: number;        // 模型可接受的最大输入令牌数
    readonly maxOutputTokens: number;       // 模型能够生成的最大输出令牌数
    readonly tooltip?: string;              // 在 UI 中悬停模型时显示的可选工具提示文本
    readonly detail?: string;               // 与模型一起呈现的人类可读文本
    readonly capabilities: {
        readonly imageInput?: boolean;      // 支持图像输入
        readonly toolCalling?: boolean | number; // 支持工具调用
    };
}
```

## 注册供应器

1. 第一步是在 `package.json` 的 `contributes.languageModelChatProviders` 部分注册供应器。请提供唯一的 `vendor` ID 和 `displayName`。

    ```json
    {
        "contributes": {
            "languageModelChatProviders": [
                {
                    "vendor": "my-provider",
                    "displayName": "My Provider"
                }
            ]
        }
    }
    ```

1. 接下来，在插件激活函数中使用 `lm.registerLanguageModelChatProvider` 方法注册语言模型供应器。

    提供在 `package.json` 中使用的供应器 ID 及供应器类的实例：

    ```typescript
    import * as vscode from 'vscode';
    import { SampleChatModelProvider } from './provider';

    export function activate(_: vscode.ExtensionContext) {
        vscode.lm.registerLanguageModelChatProvider('my-provider', new SampleChatModelProvider());
    }
    ```

1. 还可以在 `package.json` 中提供 `contributes.languageModelChatProviders.managementCommand`，以允许用户管理语言模型供应器。

    `managementCommand` 属性值必须是在 `package.json` 的 `contributes.commands` 部分定义的命令。在插件中注册该命令（`vscode.commands.registerCommand`），并实现管理供应器的逻辑，例如配置 API 密钥或其他设置。

    ```json
    {
        "contributes": {
            "languageModelChatProviders": [
                {
                    "vendor": "my-provider",
                    "displayName": "My Provider",
                    "managementCommand": "my-provider.manage"
                }
            ],
            "commands": [
                {
                    "command": "my-provider.manage",
                    "title": "Manage My Provider"
                }
            ]
        }
    }
    ```

## 实现供应器

语言供应器必须实现 `LanguageModelChatProvider` 接口，该接口有三个主要方法：

- `provideLanguageModelChatInformation`：返回可用模型列表。
- `provideLanguageModelChatResponse`：处理Chat请求并流式传输响应。
- `provideTokenCount`：实现令牌计数功能。

### 准备语言模型信息

VS Code 会调用 `provideLanguageModelChatInformation` 方法发现可用模型，该方法返回 `LanguageModelChatInformation` 对象列表。

使用 `options.silent` 参数控制是否提示用户输入凭据或进行额外配置：

```typescript
async provideLanguageModelChatInformation(
    options: { silent: boolean },
    token: CancellationToken
): Promise<LanguageModelChatInformation[]> {
    if (options.silent) {
        return []; // 静默模式下不提示用户
    } else {
        await this.promptForApiKey(); // 提示用户输入凭据
    }

    // 从服务中获取可用模型
    const models = await this.fetchAvailableModels();

    // 将模型映射为 LanguageModelChatInformation 格式
    return models.map(model => ({
        id: model.id,
        name: model.displayName,
        family: model.family,
        version: '1.0.0',
        maxInputTokens: model.contextWindow - model.maxOutput,
        maxOutputTokens: model.maxOutput,
        capabilities: {
            imageInput: model.supportsImages,
            toolCalling: model.supportsTools
        }
    }));
}
```

### 处理Chat请求

`provideLanguageModelChatResponse` 方法处理实际的Chat请求。供应器会接收 `LanguageModelChatRequestMessage` 格式的消息数组，你可以选择将其转换为语言模型 API 所需的格式（请参阅[消息格式和转换](#消息格式和转换)）。

使用 `progress` 参数流式传输响应片段。响应可以包含文本部分、工具调用和工具结果（请参阅[响应部分](#响应部分)）。

```typescript
async provideLanguageModelChatResponse(
    model: LanguageModelChatInformation,
    messages: readonly LanguageModelChatRequestMessage[],
    options: ProvideLanguageModelChatResponseOptions,
    progress: Progress<LanguageModelResponsePart>,
    token: CancellationToken
): Promise<void> {

    // TODO：实现消息转换、处理和响应流传输

    // 可选择根据模型 ID 区分行为
    if (model.id === "my-model-a") {
        progress.report(new LanguageModelTextPart("This is my A response."));
    } else {
        progress.report(new LanguageModelTextPart("Unknown model."));
    }
}
```

### 提供令牌计数

`provideTokenCount` 方法负责估计给定文本输入的令牌数：

```typescript
async provideTokenCount(
    model: LanguageModelChatInformation,
    text: string | LanguageModelChatRequestMessage,
    token: CancellationToken
): Promise<number> {
    // TODO：为模型实现令牌计数

    // 字符串的示例估算方式
    return Math.ceil(text.toString().length / 4);
}
```

## 消息格式和转换

供应器接收 `LanguageModelChatRequestMessage` 格式的消息，通常需要将其转换为服务 API 的格式。消息内容可以混合包含文本部分、工具调用和工具结果。

```typescript
interface LanguageModelChatRequestMessage {
    readonly role: LanguageModelChatMessageRole;
    readonly content: ReadonlyArray<LanguageModelInputPart | unknown>;
    readonly name: string | undefined;
}
```

你可以选择为语言模型 API 对这些消息进行适当转换：

```typescript
private convertMessages(messages: readonly LanguageModelChatRequestMessage[]) {
    return messages.map(msg => ({
        role: msg.role === vscode.LanguageModelChatMessageRole.User ? 'user' : 'assistant',
        content: msg.content
            .filter(part => part instanceof vscode.LanguageModelTextPart)
            .map(part => (part as vscode.LanguageModelTextPart).value)
            .join('')
    }));
}
```

## 响应部分

供应器可通过进度回调，使用 `LanguageModelResponsePart` 类型报告不同的响应部分，包括：

- `LanguageModelTextPart`：文本内容。
- `LanguageModelToolCallPart`：工具或函数调用。
- `LanguageModelToolResultPart`：工具结果内容。

## 开始使用

你可以从[基础示例项目](https://github.com/microsoft/vscode-extension-samples/blob/main/chat-model-provider-sample)开始。

## 相关内容

- [VS Code API 参考](https://code.visualstudio.com/api/references/vscode-api)
- [语言模型 API 指南](/extension-guides/ai/language-model)
- [Chat API 插件](/extension-guides/ai/chat)
