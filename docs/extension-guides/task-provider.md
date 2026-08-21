# 任务

通常，在VS Code中，用户可以通过`task.json`定义一个[任务](https://code.visualstudio.com/docs/editor/tasks)。不过在软件开发中，VS Code会自动检测某些任务。

本节介绍了插件应该怎样使用[Rakefiles](https://ruby.github.io/rake/)中的**自动检测任务**配置项，为最终用户提供任务。完整的源代码请参阅[这里](https://github.com/Microsoft/vscode-extension-samples/tree/master/task-provider-sample)。

## 定义任务

想要定义一个系统级别的任务，插件需要通过properties定义任务，在下面叫做Rake的例子中，任务是这样定义的：
::: info
**译者注：**rake是ruby实现的任务管理和自动构建工具，详细请参考[rake](https://rubygems.org/gems/rake/)
:::

```json
"taskDefinitions": [
    {
        "type": "rake",
        "required": [
            "task"
        ],
        "properties": {
            "task": {
                "type": "string",
                "description": "The Rake task to customize"
            },
            "file": {
                "type": "string",
                "description": "The Rake file that provides the task. Can be omitted."
            }
        }
    }
]
```

上面代码里面，我们为`rake`*任务集*配置了一个**任务定义**。任务定义有两个属性`task`和`file`，`task`是Rake任务的名字，file指向了包含任务的文件。`task`属性是必须的，`file`则为可选。如果省略了`file`属性，则会使用工作区根目录下名为`RakeFile`的文件。

### when 子句

任务定义可以可选地带有 `when` 属性。`when` 属性指定了此类任务何时可用的条件。`when` 属性的作用方式与 [VS Code 中其他带 `when` 属性的地方](/api/references/when-clause-contexts)相同。创建任务定义时，应始终考虑以下上下文：

- `shellExecutionSupported`：当 VS Code 可以运行 `ShellExecution` 任务时为 True，例如 VS Code 作为桌面应用程序运行时，或使用 Dev Containers 等远程插件时。
- `processExecutionSupported`：当 VS Code 可以运行 `ProcessExecution` 任务时为 True，例如 VS Code 作为桌面应用程序运行时，或使用 Dev Containers 等远程插件时。目前，它始终与 `shellExecutionSupported` 具有相同的值。
- `customExecutionSupported`：当 VS Code 可以运行 `CustomExecution` 时为 True。这始终为 True。

## 任务供应器

与让插件支持代码补全的语言供应器类似，插件可以注册一个任务供应器来计算所有可用的任务。这是通过 `vscode.tasks` 命名空间完成的，如下面的代码片段所示：

```ts
import * as vscode from 'vscode';

let rakePromise: Thenable<vscode.Task[]> | undefined = undefined;
const taskProvider = vscode.tasks.registerTaskProvider('rake', {
  provideTasks: () => {
    if (!rakePromise) {
      rakePromise = getRakeTasks();
    }
    return rakePromise;
  },
  resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const task = _task.definition.task;
		// A Rake task consists of a task and an optional file as specified in RakeTaskDefinition
		// Make sure that this looks like a Rake task by checking that there is a task.
		if (task) {
			// resolveTask requires that the same definition object be used.
			const definition: RakeTaskDefinition = <any>_task.definition;
			return new vscode.Task(definition, _task.scope ?? vscode.TaskScope.Workspace, definition.task, 'rake', new vscode.ShellExecution(`rake ${definition.task}`));
		}
		return undefined;  }
});
```

与 `provideTasks` 类似，`resolveTask` 方法由 VS Code 调用，以从插件获取任务。`resolveTask` 可以替代 `provideTasks` 被调用，旨在为实现了它的供应器提供可选的性能提升。例如，如果用户有一个运行插件所提供任务的键绑定，那么 VS Code 最好是针对该任务供应器调用 `resolveTask`，快速只获取这一个任务，而不是调用 `provideTasks` 并等待插件提供其所有任务。提供一个允许用户关闭单个任务供应器的设置是良好实践，因此这种做法很常见。用户可能会注意到来自某个特定供应器的任务获取较慢，于是关闭该供应器。在这种情况下，用户可能仍会在他们的 `tasks.json` 中引用该供应器的一些任务。如果未实现 `resolveTask`，那么会出现警告，提示 `tasks.json` 中的任务未创建。有了 `resolveTask`，插件仍然可以为 `tasks.json` 中定义的任务提供任务。

`getRakeTasks` 实现执行以下操作：

- 使用 `rake -AT -f Rakefile` 命令为每个工作区文件夹列出 `Rakefile` 中定义的所有 rake 任务。
- 解析 stdio 输出。
- 为列出的每个任务创建一个 `vscode.Task` 实现。

由于 Rake 任务的实例化需要 `package.json` 文件中定义的任务定义，VS Code 也用 TypeScript 接口定义该结构，如下所示：

```typescript
interface RakeTaskDefinition extends vscode.TaskDefinition {
  /**
   * The task name
   */
  task: string;

  /**
   * The rake file containing the task
   */
  file?: string;
}
```

假设输出来自第一个工作区文件夹中一个名为 `compile` 的任务，相应的任务创建如下所示：

```typescript
let task = new vscode.Task(
  { type: 'rake', task: 'compile' },
  vscode.workspace.workspaceFolders[0],
  'compile',
  'rake',
  new vscode.ShellExecution('rake compile')
);
```

对于输出中列出的每个任务，都使用上述模式创建相应的 VS Code 任务，然后从 `getRakeTasks` 调用返回所有任务的数组。

`ShellExecution` 在操作系统特定的 shell 中执行 `rake compile` 命令（例如在 Windows 下命令会在 PowerShell 中执行，在 Ubuntu 下则会在 bash 中执行）。如果任务应该直接执行一个进程（不启动 shell），可以使用 `vscode.ProcessExecution`。`ProcessExecution` 的优点是插件可以完全控制传递给进程的参数。使用 `ShellExecution` 会利用 shell 的命令解释功能（如 bash 下的通配符展开）。如果用单个命令行创建 `ShellExecution`，那么插件需要确保命令内部有正确的引号和转义（例如处理空白字符）。

## CustomExecution（自定义执行）

一般来说，最好使用 `ShellExecution` 或 `ProcessExecution`，因为它们很简单。不过，如果你的任务需要在多次运行之间保存大量状态、不适合作为独立的脚本或进程运行，或者需要对输出进行大量处理，那么 `CustomExecution` 可能是一个不错的选择。现有的 `CustomExecution` 用法通常用于复杂的构建系统。`CustomExecution` 只有一个在任务运行时执行的回调。这让任务能做的事情更加灵活，但也意味着任务供应器要负责所需的任何进程管理和输出解析。任务供应器还要负责实现 `Pseudoterminal`，并从 `CustomExecution` 回调中返回它。

```typescript
return new vscode.Task(definition, vscode.TaskScope.Workspace, `${flavor} ${flags.join(' ')}`,
  CustomBuildTaskProvider.CustomBuildScriptType, new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
    // When the task is executed, this callback will run. Here, we setup for running the task.
    return new CustomBuildTaskTerminal(this.workspaceRoot, flavor, flags, () => this.sharedState, (state: string) => this.sharedState = state);
  }));
```

The full example, including the implementation of `Pseudoterminal` is at [https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample/src/customTaskProvider.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample/src/customTaskProvider.ts).