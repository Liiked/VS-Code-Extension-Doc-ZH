# 示例-任务

通常，在VS Code中，用户可以通过`task.json`定义一个[任务](https://code.visualstudio.com/docs/editor/tasks)。不过在软件开发中，VS Code会自动检测某些任务。本节介绍了插件应该怎样自动检测任务，为最终用户提供任务。

## 定义任务
---

想要定义一个系统级别的任务，插件需要通过properties定义任务，在下面叫做Rake的例子中，任务是这样定义的：

?>**译者注：**rake是ruby实现的任务管理和自动构建工具，详细请参考[rake](https://rubygems.org/gems/rake/)

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

上面代码里面，我们为`rake`*任务集*配置了一个**任务定义**。任务定义有两个属性`task`和`file`，`task`是Rake任务的名字，file指向了包含任务的文件。`task`属性是必须的，`file`则为可选。如果省略了`file`属性，则会使用工作区根目录下名为rake的文件。

## 任务供应器函数
---

和语言供应器函数相同，任务供应器使插件支持代码补全，一个插件可以只注册一个任务供应器函数然后执行所有可用的任务集合。使用`vscode.tasks`命名空间达成这一目标：
```typescript
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
        return undefined;
    }
});
```

目前`resolveTask`只返回了`undefined`，而将来VS Code会通过这个方法优化任务的加载。

`getRakeTasks`的实现做了下面的事情：
- 使用`rake -AT -f Rakefile`命令列出rake文件中的所有rake任务
- 转换为stdio输出
- 对每个任务创建一个`vscode.task`实现

因为一个rake任务初始化需要`package.json`中有对应的任务定义，VS Code会用TypeScript接口定义出结构，像这样：

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

假设我们的输出最终来自于一个叫`compile`的任务，那么对应的任务创建过程如下所示：
```typescript
let task = new vscode.Task({ type: 'rake', task: 'compile' }, 'compile', 'rake', new vscode.ShellExecution('rake compile'));
```

每个输出任务都对应着上述过程，最后通过调用`getRakeTasks`会返回一个任务数组。

`ShellExecution`会针对不同的系统在shell中执行`rake compile`命令（如：在Windows下会在PowerShell中执行，Ubuntu则是bash）。如果某个任务需要直接执行进程（不通过shell生成），则可以使用`vscode.ProcessExecution`。`ProcessExecution`的优势在于插件可以完全控制传入进程的参数，`ShellExecution`则会使用shell命令转义（比如：bash中的*展开）。如果`ShellExecution`是通过单个命令创建的，那么插件需要在命令内部确保引号和转义符的正确使用（比如，如何处理空格）。