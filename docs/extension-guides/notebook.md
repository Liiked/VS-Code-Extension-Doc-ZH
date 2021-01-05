# 记事本 API

记事本 API 允许 Visual Studio Code 以记事本的形式打开文件，执行记事本代码单元，把记事本的内容以多种丰富的并且可交互式的格式展现。在 Visual Studio Code 里面，你可以获得与 Jupyter、Google Colab 等流行的记事本相似的书写体验。

!> **注意：**记事本相关的 API 目前还处于开发状态，所以目前只能在 [VS Code Insiders](https://github.com/microsoft/vscode-docs/blob/master/insiders) 版本内部使用，同时需要给你的插件项目添加 `vscode.proposed.d.ts` 文件。想了解更多的有关于试验性 API 的内容， 可以 [点这里](https://github.com/microsoft/vscode-docs/blob/master/api/advanced-topics/using-proposed-api)。

?> **译者注：**译文中的 `单元格`，可以通俗的理解为文件中的每一行。

## 记事本的构成

---

一个记事本由一系列具有特定顺序的单元格以及输出构成。单元格由 VS Code 核心进程负责渲染，它有两种类型，一种是 **Markdown 单元格**，另一种是**代码单元格**。输出同样由 VS Code 核心进程负责渲染，有多种格式，比如普通文本、JSON、图片、HTML。其它的特殊数据和交互式的进程，由插件负责渲染。

记事本的读写操作是由 `NotebookContentProvider` 控制的，`NotebookContentProvider` 从文件系统中读取数据并将其转化为单元格，同时将记事本的改动同步给文件系统。可以使用 `NotebookKernel` 来操作**代码单元格**，它接收单元格的普通文本内容并将其转化为多种格式化文本或交互式的应用程序。最后由 `NotebookOutputRenderer` 将内容渲染为不同应用程序所支持的格式。

一图胜千言：

![结构概览](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/architecture-overview.png)

## 内容提供商

---

[参考 NotebookContentProvider API](https://github.com/microsoft/vscode/blob/43184b2beda9edb613caadc2bab29ec50bad863f/src/vs/vscode.proposed.d.ts#L1792-L1805)

可以使用 `NotebookContentProvider` 来获取序列化的记事本并生成 Markdown 列表和代码单元。与此同时，`NotebookContentProvider` 会将记事本中产生的更改同步到源文件中。

下面是一些范例：

- [.ipynb 内容提供商](https://github.com/microsoft/notebook-extension-samples/tree/master/notebook-provider)：笔记本采用 [Jupyter](https://nbformat.readthedocs.io/en/latest/format_description.html) 格式。
- [Markdown 内容提供商](https://github.com/microsoft/vscode-markdown-notebook)：以记事本的格式打开和编辑 Markdown。

### 举个例子

下面的例子中，我们创建了一个简化版的后缀名为 `.notebook` 的记事本提供商插件，用来查看 [Jupyter](https://nbformat.readthedocs.io/en/latest/format_description.html) 格式的文件。

内容提供商是定义在 `package.json` 的 `contributes.notebookProvider` 字段中的，像下面这样：

```json
{
    ...
    "activationEvents": ["onNotebook:my-notebook-provider"],
    "contributes": {
        ...
        "notebookProvider": [
            {
                "viewType": "my-notebook-provider",
                "displayName": "My Notebook Provider",
                "selector": [
                    {
                        "filenamePattern": "*.notebook"
                    }
                ]
            }
        ]
    }
}
```

然后在插件的 activate 事件中注册：

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.notebook.registerNotebookContentProvider(
      'my-notebook-provider',
      new SampleProvider()
    )
  );
}

class SampleProvider implements vscode.NotebookContentProvider {
  async openNotebook(uri: vscode.Uri): Promise<vscode.NotebookData> {
    const content = JSON.parse((await vscode.workspace.fs.readFile(uri)).toString());
    return {
      languages: [],
      metadata: { custom: content.metadata },
      cells: content.cells.map((cell: any) => {
        if (cell.cell_type === 'markdown') {
          return {
            cellKind: vscode.CellKind.Markdown,
            source: cell.source,
            language: 'markdown',
            outputs: [],
            metadata: {}
          };
        } else if (cell.cell_type === 'code') {
          return {
            cellKind: vscode.CellKind.Code,
            source: cell.source,
            language: content.metadata?.language_info?.name || 'python',
            outputs: [
              /* not implemented */
            ],
            metadata: {}
          };
        } else {
          console.error('Unexpected cell:', cell);
        }
      })
    };
  }

  // 下面是一些伪方法，与本例无关
  onDidChangeNotebook = new vscode.EventEmitter<vscode.NotebookDocumentEditEvent>().event;
  async resolveNotebook(): Promise<void> {}
  async saveNotebook(): Promise<void> {}
  async saveNotebookAs(): Promise<void> {}
  async backupNotebook(): Promise<vscode.NotebookDocumentBackup> {
    return { id: '', delete: () => {} };
  }
}
```

紧接着，启动你的插件并在插件窗口中打开后缀名为 `.notebook` 的 Jupyter 格式文件：

![简单的供应商——ipynb](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/ipynb-simple-provider.png)

现在，我们可以打开和编辑 Jupyter 格式的记事本，并且以普通文本和 Markdown 的形式预览单元格。然而，在编辑的时候由于并不会自动并持续性的将内容写入到磁盘中，所以需要实现 `saveNotebook` 方法，上面的代码中也提到了这个方法。同时，如果要运行每个单元格，需要实现 `NotebookKernel` 方法。

!> **注意：**默认情况下，输出的 MIME 类型的顺序是通过记事本提供的 `NotebookData#metadata.displayOrder` 属性来定义的，你也可以在 `openNotebook` 方法中自行设置。

## 内核

---

[参考 NotebookKernel API](https://github.com/microsoft/vscode/blob/43184b2beda9edb613caadc2bab29ec50bad863f/src/vs/vscode.proposed.d.ts#L1807-L1812)

`NotebookKernel` 负责接收一个代码单元，并将其转化为一个或一组输出。

可以通过设置 `NotebookContentProvider#kernel` 属性，将记事本内核（`NotebookKernel`）与一个内容提供商直接关联；或者调用 `vscode.registerNotebookKernel` 方法来全局注册，`registerNotebookKernel` 方法接收三个参数：

- 一个内核的标识符
- 与验证文件相关的正则表达式列表
- 一个 `vscode.NotebookKernel` 对象：

  ```typescript
  vscode.notebook.registerNotebookKernel(
      "http-kernel",
      ["*.http"],
      {
          label: "Http Kernel",
          executeCell(document: NotebookDocument, cell: NotebookCell, token: CancellationToken): Promise<void> { ... }
          executeAllCells(document: NotebookDocument, token: CancellationToken): Promise<void> { ... }
      }
  )
  ```

如果已经通过 `NotebookContentProvider#kernel` 属性为 `NotebookContentProvider` 注册了一个内核，那么当你打开某个记事本的时候， 这个内核会被默认选中。否则，会从已注册的内核中选取，你也可以使用 **Notebook: Select Notebook Kernel** 命令来自行切换要使用的内核。

一个小例子：

- [Github Issues 记事本](https://github.com/microsoft/vscode-github-issue-notebooks/blob/master/src/extension/notebookProvider.ts)：一个记事本内核，用来执行 Github Issues 查询

### 最佳实践

尽管一个记事本内核只需要返回一个输出，实际上你仍然可以在其执行每一个单元格的时候，设置单元格的 `metadata`，借此来实现诸如时间计数器、执行徽标排序、运行状态图标此类的功能。下面的代码演示了如何使用 `executeCell` 方法：

```typescript
async function executeCell(
  document: vscode.NotebookDocument,
  cell: vscode.NotebookCell,
  token: vscode.CancellationToken
) {
  try {
    cell.metadata.runState = vscode.NotebookCellRunState.Running;
    const start = +new Date();
    cell.metadata.runStartTime = start;
    cell.metadata.executionOrder = ++this.runIndex;
    const result = await doExecuteCell(document, cell, token);
    cell.outputs = [result];
    cell.metadata.runState = vscode.NotebookCellRunState.Success;
    cell.metadata.lastRunDuration = +new Date() - start;
  } catch (e) {
    cell.outputs = [
      {
        outputKind: vscode.CellOutputKind.Error,
        ename: e.name,
        evalue: e.message,
        traceback: [e.stack]
      }
    ];
    cell.metadata.runState = vscode.NotebookCellRunState.Error;
    cell.metadata.lastRunDuration = undefined;
  }
}
```

## 输出类型

---

输出的类型一定是以下这三种格式中的一个：

- 文本
- 错误
- 富文本

每一个单元格都可能会产生多种输出，这种情况下输出为一个列表。

一些简单的输出格式，比如文本、错误、富文本（HTML，Markdown，JSON），由 VS Code 核心进程负责渲染；而一些增强型的输出格式，比如特殊的富文本应用，则由 [NotebookOutputRenderer](#输出渲染器) 负责渲染。插件可以自行决定要渲染 “简单的” 输出类型，比如添加 Markdown 对 LaTeX 的支持。

![内核](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/kernel.png)

### 输出文本

文本格式仅仅由 `text` 条目组成，会以普通文本的形式渲染，是最简单的输出格式，输出文本所做的工作和很多其它的编辑器相似。

```typescript
{
    outputKind: vscode.CellOutputKind.Text,
    text: '...'
}
```

![输出文本](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/text-output.png)

### 输出错误

输出错误可以通过一种易于理解的方式来展示运行时发生的异常。它包含 `ename`、`evalue`、`traceback` 这几个属性，前两者分别用来展示错误类型和错误信息，`traceback` 接收一个字符串数组并以调用栈的形式展示。并且数组中的字符串可以使用 ANSI 编码来进行着色：

```typescript
{
    outputKind: vscode.CellOutputKind.Error,
    ename: 'Error Name',
    evalue: 'Error Value',
    traceback: ['\x1b[35mstack frame 1\x1b[0m', 'stack frame 2', 'stack frame 3', 'stack frame 4']
}
```

![输出错误](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/error-output.png)

### 输出富文本

富文本以 MIME 类型作为 key 值，可以为输出的数据提供多种不同的展现形式，是展示单元格的最高级的输出格式。假如单元格是一个 Github Issue，那么内核会基于单元格的 `data` 配置项，产生以下几种不同格式的输出：

- `text/html`：将 Github Issue 转化为 HTML 输出
- `application/json`：输出 JSON 格式的数据
- `application/github-issue`：可以使用 `NotebookOutputRenderer` 来创建一个完整的关于该 Github Issue 的交互式视图

`text/html` 和 `application/json` 由 VS Code 自己负责渲染，而 `application/github-issue` 则交给 `NotebookOutputRenderer` 负责渲染，如果没有为 MIME 类型注册一个 `NotebookOutputRenderer`，那么就会展示一个错误。

```typescript
{
    outputKind: vscode.CellOutputKind.Rich,
    data: {
        'text/html': '<b>Hello</b> World',
        'application/json': { hello: 'world' },
        'application/custom': 'my-custom-data-interchange-format',
    }
}
```

![输出富文本](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/rich-output.gif)

一般情况下，VS Code 可以渲染以下几种 MIME 类型：

- application/json
- application/javascript
- text/html
- image/svg+xml
- text/markdown
- image/png
- image/jpeg
- text/plain
- text/x-javascript

如果你想渲染其它类型的 MIME，就需要为这个 MIME 注册一个 `NotebookOutputRenderer`。

## 输出渲染器

---

输出渲染器负责接收并渲染 MIME 类型的输出数据，最终呈现的渲染结果可以是简单的 HTML，也可以是复杂的交互式应用程序。在本章节，我们将摸索一些技术，来渲染一个关于 Github Issue 的视图。

### 一个简单的, 非交互式的渲染器

为了渲染一组 MIME 类型的数据，你可以在你的插件项目的 `package.json` 文件中的 `contributes.notebookOutRenderer` 字段下声明渲染器。我们假设已经安装的内核能够正常提供渲染器，那么当你输入 `ms-vscode.github-issue-notebook/github-issue` 的时候，这个渲染器就会开始工作。

```json
{
  "activationEvents": ["...."],
  "contributes": {
    ...
    "notebookOutputRenderer": [
      {
        "id": "github-issue-static-renderer",
        "displayName": "Static Issue Renderer",
        "entrypoint": "./out/renderer.js",
        "mimeTypes": [
          "ms-vscode.github-issue-notebook/github-issue"
        ]
      }
    ]
  }
}
```

为了避免输出渲染器和 VS Code 的 UI 发生冲突，导致 VS Code 性能下降，输出渲染器总是被放到一个独立的 `iframe` 中。上述代码中 “entrypoint” 字段指的是一个独立的脚本文件，可以是自己手写，也可以是 Webpack、Rollup、Parcel 打包后的文件，当 `iframe` 里面有需要渲染的输出的时候，就会加载这个脚本。

当 “entrypoint” 脚本加载完成之后，会立刻调用 `acquireNotebookRendererApi()` 函数并传入你的渲染器 ID 作为参数，与此同时，开始监听记事本的输出事件。比如，下面的代码会把整个 Github Issue 作为 JSON 传递给单元格作为输出：

```javascript
const notebookApi = acquireNotebookRendererApi('github-issue-static-renderer');

notebookApi.onDidCreateOutput(evt => {
  const output = evt.output.data[evt.mimeType];
  evt.element.innerText = JSON.stringify(output);
});
```

完整的 API 声明可以 [看这里](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode-notebook-renderer/index.d.ts)。如果你用的是 TypeScript，那么为了使用上述的 API 声明，你首先需要安装 `@types/vscode-notebook-renderer`，然后在 `tsconfig.json` 文件的 `types` 字段中添加 `vscode-notebook-renderer`。因为 `acquireNotebookRendererApi` 方法是一个全局变量，所以我们把 `@types/vscode` 和 `@types/vscode-notebook-renderer` 这两个声明文件分开了。

要创建富文本内容，你可以手动创建 DOM 元素，或者直接使用 Preact 这样的框架，将内容直接注入到指定的元素，看下面的例子：

```typescript
import { h, render } from 'preact';

const notebookApi = acquireNotebookRendererApi("github-issue-static-renderer");

const Issue: FunctionComponent<{ issue: GithubIssue }> = ({ issue }) => (
  <div key={issue.number}>
    <h2>
      {issue.title}
      (<a href={`https://github.com/${issue.repo}/issues/${issue.number}`}>#{issue.number}</a>)
    </h2>
    <img src={issue.user.avatar_url} style={{ float: 'left', width: 32, borderRadius: '50%', marginRight: 20 }} />
    <i>@{issue.user.login}</i> Opened: <div style="margin-top: 10px">{issue.body}</div>
  </div>
);

const GithubIssues: FunctionComponent<{ issues: GithubIssue[]; }> = ({ issues }) => (
  <div>{issues.map(issue => <Issue key={issue.number} issue={issue} />)}</div>
);

notebookApi.onDidCreateOutput((evt) => {
  const output = evt.output.data[evt.mimeType];
  render(<GithubIssues issues={output} />, evt.element);
});
```

现在可以在输出单元格上通过运行 `ms-vscode.github-issue-notebook/github-issue` 来预览结果，如下图所示：

![静态的渲染器示例](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/static-renderer-sample.png)

如果在单元格的 DOM 容器外部有其它的元素，或者有一些异步任务，那么你可以在 `onWillDestroyOutput` 方法中进行释放。`onWillDestroyOutput`方法会在以下几个条件下执行：

- 单元格输出被清空后
- 当前单元格被删除之后
- 当前单元格的输出进行渲染之前

可以看下面的例子：

```javascript
const intervals = new Map();

notebookApi.onDidCreateOutput(evt => {
  const output = evt.output.data[evt.mimeType];
  render(<GithubIssues issues={output} />, evt.element);

  // 创建一个定时器，在每一秒进行修改 h2 的颜色
  intervals.set(
    evt.outputId,
    setInterval(() => {
      evt.element.querySelector('h2').style.color = `hsl(${Math.random() *
        360}, 100%, 50%)`;
    }, 1000)
  );
});

notebookApi.onWillDestroyOutput(scope => {
  if (scope === undefined) {
    // 如果 scope 是 undefined 的话，所有的输出都会被销毁
    for (const interval of intervals.values()) {
      clearInterval(interval);
    }
    intervals.clear();
  } else {
    // 反之，销毁一个单独的输出
    clearInterval(intervals.get(scope.outputId));
    intervals.delete(scope.outputId);
  }
});
```

需要注意的是，一个记事本中的每个单元格，会被渲染到同一个 iframe 的不同 DOM 元素上，所以为了避免产生冲突，当你使用诸如 `document.querySelector` 此类的选择器的时候，要确保每个单元格都有一个特定的标识。在上面的例子中，我们通过使用 `evt.element.querySelector` 来避免这个问题。

### 交互式的记事本

想象一下，如果我们想通过点击一个按钮，然后查看这个 Github Issue 的评论，应该怎么做呢？在这里，我们假设在运行 `ms-vscode.github-issue-notebook/github-issue-with-comments` 命令之后，内核（`kernel`）可以正常提供带有评论的 Github Issue，下面是代码实现：

```typescript
const Issue: FunctionComponent<{ issue: GithubIssueWithComments }> = ({ issue }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div key={issue.number}>
      <h2>
        {issue.title}
        (<a href={`https://github.com/${issue.repo}/issues/${issue.number}`}>#{issue.number}</a>)
      </h2>
      <img src={issue.user.avatar_url} style={{ float: 'left', width: 32, borderRadius: '50%', marginRight: 20 }} />
      <i>@{issue.user.login}</i> Opened: <div style="margin-top: 10px">{issue.body}</div>
      <button onClick={() => setShowComments(true)}>Show Comments</button>
      {showComments && issue.comments.map(comment => <div>{comment.text}</div>)}
    </div>
  );
};
```

上面的代码存在几个明显的问题：

- 在点击按钮之前，就已经把所有 Issue 的评论都加载了
- 仅仅是展示更多数据，就需要引用记事本内核（`kernel`）的支持

而实际上，记事本内核可以通过包含一个预加载项，在向渲染器提供更多功能的同时，也会在 iframe 里面加载 VS Code（使得 iframe 可以访问 VS Code 提供一些 API）。这个加载项脚本可以通过其自身的 postMessage 接口来访问 `acquireVsCodeApi()`，你可以把它封装为 iframe 中的全局对象。

![内核通讯](https://media.githubusercontent.com/media/microsoft/vscode-docs/master/api/extension-guides/images/notebook/kernel-communication.png)

举个例子，为了引用新文件，你可能会去修改记事本内核的 `preloads` 脚本，在 `preloads` 脚本里面创建一个连接，与插件主机双向通信，与此同时，向外暴露一个全局变量，给记事本渲染器使用，具体代码如下：

```typescript
globalThis.githubIssueCommentProvider = {
  loadComments(issueId: string, callback: (comments: GithubComment[]) => void) {
    vscodeApi.postMessage({ command: 'comments', issueId });
    const listener = event => {
      if (event.data.type === 'comments' && event.data.issueId === issueId) {
        callback(event.data.comments);
        window.removeEventListener('message', listener);
      }
    };

    window.addEventListener('message', listener);
  }
};
```

由于其他开发者可能在其它的记事本上创建了 Github Issue 输出，并且没有实现 `githubIssueCommentProvider`，因此在这种情况下，我们在渲染器中首先要判断预加载脚本中的全局对象是否存在并且可用，并且只在可用的情况下显示 “Load Comments（加载评论）” 按钮：

```typescript
const canLoadComments = globalThis.githubIssueCommentProvider !== undefined;

const Issue: FunctionComponent<{ issue: GithubIssue }> = ({ issue }) => {
  const [comments, setComments] = useState([]);
  const loadComments = () =>
    globalThis.githubIssueCommentProvider.loadComments(issue.id, setComments);

  return (
    <div key={issue.number}>
      <h2>
        {issue.title}
        (<a href={`https://github.com/${issue.repo}/issues/${issue.number}`}>#{issue.number}</a>)
      </h2>
      <img src={issue.user.avatar_url} style={{ float: 'left', width: 32, borderRadius: '50%', marginRight: 20 }} />
      <i>@{issue.user.login}</i> Opened: <div style="margin-top: 10px">{issue.body}</div>
      {canLoadComments && <button onClick={loadComments}>Load Comments</button>}
      {comments.map(comment => <div>{comment.text}</div>)}
    </div>
  );
};
```

最后，通过 `NotebookKernelProvider.resolveKernel` 方法提供的 webview 参数与 webview 进行通信，当你为某个文档选择记事本内核的时候，这个方法会被执行。要实现这个方法，可以给 `onDidReceiveMessage` 方法设置一个监听器：

```typescript
export class MyKernelProvider extends vscode.NotebookKernelProvider {
  // ...

  public resolveKernel(kernel, document, webview) {
    webview.onDidReceiveMessage(message => {
      if (message.command === 'comments') {
        kernel.getCommentsForIssue(message.issueId).then(comments => webview.postMessage({
          type: 'comments',
          issueId: message.issueId,
          comments,
        }));
      }
    });
  }
```

## 支持调试

---

对于一些实现了编程语言支持的记事本内核，支持单元格的调试是很有必要的。可以通过以下几种方式来添加内核对于调试的支持：

- 可以利用记事本内核实现一个 [调试器插件](/extension-guides/debugger-extension.md)
- 直接实现一个 [调试器协议(DAP)](https://microsoft.github.io/debug-adapter-protocol/)
- 通过代理，将协议转换为现有的记事本调试器（查阅 ‘vscode-simple-jupyter-notebook’）

当然，最简单的方式就是使用现有的未经修改的调试器插件，并将调试器协议（DAP）转化为符合当前记事本要求的协议（查阅 ‘vscode-nodebook’）。

最后附上案例：

- [vscode-nodebook](https://github.com/microsoft/vscode-nodebook)：基于 VS Code 内置的 JavaScript 调试器和一些简单的转换协议，提供的 Node.js 记事本调试器
- [vscode-simple-jupyter-notebook](https://github.com/microsoft/vscode-simple-jupyter-notebook)：基于已存的 Xeus 调试器