# 设计语言模型提示

可以通过字符串拼接构建语言模型提示，但这不利于组合功能，也难以确保提示位于语言模型的上下文窗口内。为克服这些限制，可以使用 [`@vscode/prompt-tsx`](https://github.com/microsoft/vscode-prompt-tsx) 库。

`@vscode/prompt-tsx` 库提供以下功能：

- **基于 TSX 的提示呈现**：使用 TSX 组件组合提示，提高可读性和可维护性。
- **基于优先级的裁剪**：自动裁剪提示中较不重要的部分，使其适应模型的上下文窗口。
- **灵活的令牌管理**：使用 `flexGrow`、`flexReserve` 和 `flexBasis` 等属性协作使用令牌预算。
- **工具集成**：与 VS Code 的语言模型工具 API 集成。

有关所有功能的完整概述和详细使用说明，请参阅[完整 README](https://github.com/microsoft/vscode-prompt-tsx/blob/main/README.md)。

本文介绍使用该库设计提示的实用示例。这些示例的完整代码可在 [prompt-tsx 仓库](https://github.com/microsoft/vscode-prompt-tsx/tree/main/examples)中找到。

## 管理会话历史中的优先级

在提示中包含会话历史很重要，因为这样用户可以针对之前的消息继续提问。但历史会随时间变长，因此需要确保其优先级得到适当处理。通常最合理的优先级顺序如下：

1. 基础提示说明。
2. 当前用户查询。
3. 最近几轮聊天历史。
4. 任何支持数据。
5. 在空间允许的前提下尽可能多地保留其余历史。

因此，应在提示中将历史拆分为两部分，使最近的提示轮次优先于一般上下文信息。

在此库中，树中的每个 TSX 节点都有一个优先级，其概念类似于 zIndex，数值越高表示优先级越高。

### 第 1 步：定义 HistoryMessages 组件

要列出历史消息，请定义 `HistoryMessages` 组件。此示例是不错的起点，但如果需要处理更复杂的数据类型，可能需要对其扩展。

此示例使用 `PrioritizedList` 帮助器组件，它会自动为每个子项分配升序或降序优先级。

```tsx
import {
	UserMessage,
	AssistantMessage,
	PromptElement,
	BasePromptElementProps,
	PrioritizedList,
} from '@vscode/prompt-tsx';
import { ChatContext, ChatRequestTurn, ChatResponseTurn, ChatResponseMarkdownPart } from 'vscode';

interface IHistoryMessagesProps extends BasePromptElementProps {
	history: ChatContext['history'];
}

export class HistoryMessages extends PromptElement<IHistoryMessagesProps> {
	render(): PromptPiece {
		const history: (UserMessage | AssistantMessage)[] = [];
		for (const turn of this.props.history) {
			if (turn instanceof ChatRequestTurn) {
				history.push(<UserMessage>{turn.prompt}</UserMessage>);
			} else if (turn instanceof ChatResponseTurn) {
				history.push(
					<AssistantMessage name={turn.participant}>
						{chatResponseToMarkdown(turn)}
					</AssistantMessage>
				);
			}
		}
		return (
			<PrioritizedList priority={0} descending={false}>
				{history}
			</PrioritizedList>
		);
	}
}
```

### 第 2 步：定义 Prompt 组件

接下来，定义 `MyPrompt` 组件，其中包含基础说明、用户查询和具有适当优先级的历史消息。优先级值仅在同级节点之间生效。请注意，在处理提示中其他内容之前，可能希望先裁剪历史中的旧消息，因此需要拆分两个 `<HistoryMessages>` 元素：

```tsx
import {
	UserMessage,
	PromptElement,
	BasePromptElementProps,
} from '@vscode/prompt-tsx';

interface IMyPromptProps extends BasePromptElementProps {
	history: ChatContext['history'];
	userQuery: string;
}

export class MyPrompt extends PromptElement<IMyPromptProps> {
	render() {
		return (
			<>
				<UserMessage priority={100}>
					Here are your base instructions. They have the highest priority because you want to make
					sure they're always included!
				</UserMessage>
				{/* Older messages in the history have the lowest priority since they're less relevant */}
				<HistoryMessages history={this.props.history.slice(0, -2)} priority={0} />
				{/* The last 2 history messages are preferred over any workspace context you have below */}
				<HistoryMessages history={this.props.history.slice(-2)} priority={80} />
				{/* The user query is right behind the based instructions in priority */}
				<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
				<UserMessage priority={70}>
					With a slightly lower priority, you can include some contextual data about the workspace
					or files here...
				</UserMessage>
			</>
		);
	}
}
```

现在，库会先裁剪所有较旧的历史消息，再尝试裁剪提示中的其他元素。

### 第 3 步：定义 History 组件

为使使用更方便，定义包装历史消息的 `History` 组件，并使用 `passPriority` 属性将其作为透传容器。使用 `passPriority` 后，其子项在确定优先级时会被视为包含元素的直接子项。

```tsx
import { PromptElement, BasePromptElementProps } from '@vscode/prompt-tsx';

interface IHistoryProps extends BasePromptElementProps {
	history: ChatContext['history'];
	newer: number; // last 2 message priority values
	older: number; // previous message priority values
	passPriority: true; // require this prop be set!
}

export class History extends PromptElement<IHistoryProps> {
	render(): PromptPiece {
		return (
			<>
				<HistoryMessages history={this.props.history.slice(0, -2)} priority={this.props.older} />
				<HistoryMessages history={this.props.history.slice(-2)} priority={this.props.newer} />
			</>
		);
	}
}
```

现在，可以使用和复用此单个元素来包含聊天历史：

```tsx
<History history={this.props.history} passPriority older={0} newer={80}/>
```

## 扩展文件内容以适应空间

本例希望在提示中包含用户当前查看的所有文件内容。这些文件可能很大，以至于全部包含会导致其文本被裁剪。本例说明如何使用 `flexGrow` 属性协作调整文件内容大小，使其适应令牌预算。

### 第 1 步：定义基础说明和用户查询

首先，定义包含基础说明的 `UserMessage` 组件。

```tsx
<UserMessage priority={100}>Here are your base instructions.</UserMessage>
```

然后使用 `UserMessage` 组件包含用户查询。该组件具有较高优先级，以确保其紧跟基础说明之后包含。

```tsx
<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
```

### 第 2 步：包含文件内容

现在可使用 `FileContext` 组件包含文件内容。为其分配值为 `1` 的 [`flexGrow`](https://github.com/microsoft/vscode-prompt-tsx?tab=readme-ov-file#flex-behavior)，以确保它在基础说明、用户查询和历史之后呈现。

```tsx
<FileContext priority={70} flexGrow={1} files={this.props.files} />
```

设置 `flexGrow` 值后，元素会获得传入其 `render()` 和 `prepare()` 调用的 `PromptSizing` 对象中任何_未使用_的令牌预算。有关弹性元素的行为，请参阅 [prompt-tsx 文档](https://github.com/microsoft/vscode-prompt-tsx?tab=readme-ov-file#flex-behavior)。

### 第 3 步：包含历史记录

接下来，使用前面创建的 `History` 组件包含历史消息。这稍微复杂一些，因为既希望显示部分历史，又希望文件内容占据提示的大部分空间。

因此，为 `History` 组件分配 `2` 的 `flexGrow` 值，以确保它在包括 `<FileContext />` 在内的所有其他元素之后呈现。同时，设置 `"/5"` 的 `flexReserve` 值，为历史保留总预算的五分之一。

```tsx
<History
	history={this.props.history}
	passPriority
	older={0}
	newer={80}
	flexGrow={2}
	flexReserve="/5"
/>
```

### 第 3 步：组合提示的所有元素

现在，将所有元素组合到 `MyPrompt` 组件中。

```tsx
import {
	UserMessage,
	PromptElement,
	BasePromptElementProps,
} from '@vscode/prompt-tsx';
import { History } from './history';

interface IFilesToInclude {
	document: TextDocument;
	line: number;
}

interface IMyPromptProps extends BasePromptElementProps {
	history: ChatContext['history'];
	userQuery: string;
	files: IFilesToInclude[];
}

export class MyPrompt extends PromptElement<IMyPromptProps> {
	render() {
		return (
			<>
				<UserMessage priority={100}>Here are your base instructions.</UserMessage>
				<History
					history={this.props.history}
					passPriority
					older={0}
					newer={80}
					flexGrow={2}
					flexReserve="/5"
				/>
				<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
				<FileContext priority={70} flexGrow={1} files={this.props.files} />
			</>
		);
	}
}
```

### 第 4 步：定义 FileContext 组件

最后，定义 `FileContext` 组件，其中包含用户当前查看文件的内容。由于使用了 `flexGrow`，可以利用 `PromptSizing` 中的信息实现逻辑，为每个文件获取“感兴趣”行周围尽可能多的行。

为简洁起见，省略了 `getExpandedFiles` 的实现逻辑。你可以在 [prompt-tsx 仓库](https://github.com/microsoft/vscode-prompt-tsx/blob/5501d54a5b9a7608582e8419cd968a82ca317cc9/examples/file-contents.tsx#L103)中查看。

```tsx
import { PromptElement, BasePromptElementProps, PromptSizing, PromptPiece } from '@vscode/prompt-tsx';

class FileContext extends PromptElement<{ files: IFilesToInclude[] } & BasePromptElementProps> {
	async render(_state: void, sizing: PromptSizing): Promise<PromptPiece> {
		const files = await this.getExpandedFiles(sizing);
		return <>{files.map(f => f.toString())}</>;
	}

	private async getExpandedFiles(sizing: PromptSizing) {
		// Implementation details are summarized here.
		// Refer to the repo for the complete implementation.
	}
}
```

## 小结

在这些示例中，创建了 `MyPrompt` 组件，其中包含具有不同优先级的基础说明、用户查询、历史消息和文件内容。使用 `flexGrow` 协作调整文件内容的大小，使其适应令牌预算。

遵循此模式，可以确保提示中最重要的部分始终被包含，而较不重要的部分会根据需要裁剪，以适应模型的上下文窗口。有关 `getExpandedFiles` 方法和 `FileContextTracker` 类的完整实现详情，请参阅 [prompt-tsx 仓库](https://github.com/microsoft/vscode-prompt-tsx/tree/main/examples)。
