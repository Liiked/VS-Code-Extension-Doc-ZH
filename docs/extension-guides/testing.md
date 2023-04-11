# 测试API

插件可通过测试 API 发现工作区中的测试用例并公布测试结果。用户可以从 **测试管理器** 视图、代码修饰图标、命令行中执行测试。有了这些新的API 之后，VS Code 支持了更加丰富的展示和差异，这是之前无法做到的。

?>
译者注：**测试管理器** 视图目前并不是VS Code自带的，需要安装 [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) 插件才行。


!>
**注意**：测试 API 仅在 1.59 以上的版本中才能使用

## 示例

目前有两个由 VS Code 团队维护的测试案例：

- [测试插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/test-provider-sample)：提供了 Markdown 文件的测试能力
- [自启动测试插件](https://github.com/microsoft/vscode-selfhost-test-provider)：用于让 VS Code 自己启动测试

## 发现测试集

`TestController` 提供了发现测试集的能力，这个类接受一个全局唯一的 ID 和易读的标签来创建：

```ts
const controller = vscode.tests.createTestController(
  'helloWorldTests',
  'Hello World Tests'
);
```

要想发布测试集，你可以给控制器的 `items` 集合添加 `TestItems` 作为子集。`TestItems` 是测试 API `TestItem`接口类型的最基本单元，以及用于描述测试用例、测试集、树状子项的泛型。然而，它们自己也有 `children` 属性，并依此形成层级结构。我们来看一个简单的例子，示例测试插件中如何创建测试：

```ts
parseMarkdown(content, {
  onTest: (range, numberA, mathOperator, numberB, expectedValue) => {
    // 如果最上层已经有测试了，就把他添加到父级的 children 中去；如果没有的话，就把它当做控制器最上层测试中的一员。
    const collection = parent ? parent.children : controller.items;
    // 创建一个新的ID，这个ID必须与同级 children 中的其他ID不重复:
    const id = [numberA, mathOperator, numberB, expectedValue].join('  ');

    // 最后, 创建测试项:
    const test = controller.createTestItem(id, data.getLabel(), item.uri);
    test.range = range;
    collection.add(test);
  }
  // ...
});
```

类似于 **诊断** 功能，大部分时候都需要插件来控制应何时发现测试。一个简单的插件坑需要监听整个工作区，然后插件启动时解析所有文件并找到所有测试。但是，在大项目中立即解析所有东西的过程会很慢，这有两个方法供你解决这个问题：
1. 当编辑器中打开文件时，通过监听 `vscode.workspace.onDidOpenTextDocument` 主动查找测试
2. 设置 `item.canResolveChildren = true` 并配置 `controller.resolveHandler`。如果用户要求查找测试时，`resolveHandler` 方法就会被调起，比如在 **测试管理器** 中展开一项菜单。

现在我们来看看插件中懒解析策略的实现：

```ts
// First, create the `resolveHandler`. This may initially be called with
// "undefined" to ask for all tests in the workspace to be discovered, usually
// when the user opens the Test Explorer for the first time.
controller.resolveHandler = async test => {
  if (!test) {
    await discoverAllFilesInWorkspace();
  } else {
    await parseTestsInFileContents(test);
  }
};

// When text documents are open, parse tests in them.
vscode.workspace.onDidOpenTextDocument(parseTestsInDocument);
// We could also listen to document changes to re-parse unsaved changes:
vscode.workspace.onDidChangeTextDocument(e => parseTestsInDocument(e.document));

// In this function, we'll get the file TestItem if we've already found it,
// otherwise we'll create it with `canResolveChildren = true` to indicate it
// can be passed to the `controller.resolveHandler` to gets its children.
function getOrCreateFile(uri: vscode.Uri) {
  const existing = controller.items.get(uri.toString());
  if (existing) {
    return existing;
  }

  const file = controller.createTestItem(uri.toString(), uri.path.split('/').pop()!, uri);
  file.canResolveChildren = true;
  return file;
}

function parseTestsInDocument(e: vscode.TextDocument) {
  if (e.uri.scheme === 'file' && e.uri.path.endsWith('.md')) {
    parseTestsInFileContents(getOrCreateFile(e.uri), e.getText());
  }
}

async function parseTestsInFileContents(file: vscode.TestItem, contents?: string) {
  // If a document is open, VS Code already knows its contents. If this is being
  // called from the resolveHandler when a document isn't open, we'll need to
  // read them from disk ourselves.
  if (contents === undefined) {
    const rawContent = await vscode.workspace.fs.readFile(file.uri);
    contents = new TextDecoder().decode(rawContent);
  }

  // some custom logic to fill in test.children from the contents...
}
```

`discoverAllFilesInWorkspace` 可通过 VS Code 的监听现有文件功能实现。当 `resolveHandler` 调起时，你应该继续监听变化以便 **测试管理器** 时刻保持最新状态。

```ts
async function discoverAllFilesInWorkspace() {
  if (!vscode.workspace.workspaceFolders) {
    return []; // handle the case of no open folders
  }

  return Promise.all(
    vscode.workspace.workspaceFolders.map(async workspaceFolder => {
      const pattern = new vscode.RelativePattern(workspaceFolder, '**/*.md');
      const watcher = vscode.workspace.createFileSystemWatcher(pattern);

      // When files are created, make sure there's a corresponding "file" node in the tree
      watcher.onDidCreate(uri => getOrCreateFile(uri));
      // When files change, re-parse them. Note that you could optimize this so
      // that you only re-parse children that have been resolved in the past.
      watcher.onDidChange(uri => parseTestsInFileContents(getOrCreateFile(uri)));
      // And, finally, delete TestItems for removed files. This is simple, since
      // we use the URI as the TestItem's ID.
      watcher.onDidDelete(uri => controller.items.delete(uri.toString()));

      for (const file of await vscode.workspace.findFiles(pattern)) {
        getOrCreateFile(file);
      }

      return watcher;
    })
  );
}
```

## 运行测试

测试可通过 `TestRunProfiles(测试运行配置文件)` 执行。每个配置文件都一定是下列中的`kind(类型)`： 运行、调试或覆盖率。大部分测试插件对应这些类别一般有一个文件，不过多提供几个文件也是可以的。比如你的插件可以在多个平台运行，你可以通过一个配置文件就覆盖到所有平台和`测试类型(kind)`。每个配置文件都得有一个 `runHandler`，它会在相应类型配置文件加载后运行。

```ts
function runHandler(
  shouldDebug: boolean,
  request: vscode.TestRunRequest,
  token: vscode.CancellationToken
) {
  // todo
}

const runProfile = controller.createRunProfile(
  'Run',
  vscode.TestRunProfileKind.Run,
  (request, token) => {
    runHandler(false, request, token);
  }
);

const debugProfile = controller.createRunProfile(
  'Debug',
  vscode.TestRunProfileKind.Debug,
  (request, token) => {
    runHandler(true, request, token);
  }
);
```

`runHandler` 应至少调用一次 `controller.createTestRun`，并将原始请求传入。这个请求包含着需 `含括(include)` 在测试运行时的测试用例（如果用户需要运行所有测试用例的话，则忽略），以及运行时需要 `排除(exclude)` 的测试用例。插件应使用 `TestRun` 的运行后对象来更新所有测试的状态。比如：

```ts
async function runHandler(
  shouldDebug: boolean,
  request: vscode.TestRunRequest,
  token: vscode.CancellationToken
) {
  const run = controller.createTestRun(request);
  const queue: vscode.TestItem[] = [];

  // Loop through all included tests, or all known tests, and add them to our queue
  if (request.include) {
    request.include.forEach(test => queue.push(test));
  } else {
    controller.items.forEach(test => queue.push(test));
  }

  // For every test that was queued, try to run it. Call run.passed() or run.failed().
  // The `TestMessage` can contain extra information, like a failing location or
  // a diff output. But here we'll just give it a textual message.
  while (queue.length > 0 && !token.isCancellationRequested) {
    const test = queue.pop()!;

    // Skip tests the user asked to exclude
    if (request.exclude?.includes(test)) {
      continue;
    }

    switch (getType(test)) {
      case ItemType.File:
        // If we're running a file and don't know what it contains yet, parse it now
        if (test.children.size === 0) {
          await parseTestsInFileContents(test);
        }
        break;
      case ItemType.TestCase:
        // Otherwise, just run the test case. Note that we don't need to manually
        // set the state of parent tests; they'll be set automatically.
        const start = Date.now();
        try {
          await assertTestPasses(test);
          run.passed(test, Date.now() - start);
        } catch (e) {
          run.failed(test, new vscode.TestMessage(e.message), Date.now() - start);
        }
        break;
    }

    test.children.forEach(test => queue.push(test));
  }

  // Make sure to end the run after all tests have been executed:
  run.end();
}
```

还有一点关于 `runHandler` 的补充：你可以给 `TestRunProfile` 设置 `configureHandler`。如果有这个属性的话，VS Code 会给用户提供配置*测试运行器*的 UI 界面，并且当用户操作 UI 时回调这个函数。然后，你的插件可以打开文件、展示 **快速选择** 或任意你的测试框架所需的内容。

?>
VS Code 有意将**测试（test）配置**处理地不同于**调试(debug)**或**任务(task)配置**。传统编辑器或以 IDE 为中心的功能，都在 `.vscode` 这个特殊的文件夹中配置。不过，传统项目测试都是从命令行中执行的，大部分测试框架都有自己的配置策略。因此在 VS Code 中，为了避免重复配置，我们将其上升到让插件来处理此类问题。

### 测试输出

对于传给 `TestRun.failed` 或 `TestRun.errored` 的信息，你可以用 `run.appendOutput(str)` 将其附加到原生输出中。使用 **Test: Show Output** 你就可以在终端中看到输出，你还可以通过各类界面按钮看到输出结果，比如 Test Explorer(译者注：需安装该插件) 视图中的终端按钮也可以打开输出。

因为字符在终端中渲染，所以你可以使用完整的 [ANSI 编码](https://en.wikipedia.org/wiki/ANSI_escape_code)，包括 [ansi-styles](https://www.npmjs.com/package/ansi-styles) npm 包中的样式。不过要记住，也正是因为在终端里，每一行文本换行都需要使用 CRLF(`\r\n`) ，而不能仅仅是 LF （`\n`），这也是大部分工具的默认输出格式。

### 测试标签

有时，只有特定配置才能启动测试，或者完全不启动测试。在这些场景中，你可以使用 测试标签。`TestRunProfiles` 还有一个可选的名称，如果配置了这个名称，那么配置中只有包含这个标签的测试才会执行。再次提醒：如果没有符合条件的配置文件可运行、调试或采集覆盖率，那么这些选项就不会出现在 UI 中。

```ts
// 创建一个新的标签ID "runnable"
const runnableTag = new TestTag('runnable');

// 将其赋值给一个配置文件。现在只有执行这个标签的测试，才会启动这个配置。 
runProfile.tag = runnableTag;

// 给所有可用的测试用例都加上 "runnable"
for (const test of getAllRunnableTests()) {
  test.tags = [...test.tags, runnableTag];
}
```

用户也可以在 Test Explorer UI 中筛选标签。

### 仅发布结果的控制器

运行时配置文件是可选的。你也可以使用 控制器 创建测试，在 `runHandler` 方法外调用 `createTestRun`，然后就可以更新运行中的测试状态，且无需配置文件。这种用法常见于：通过外部加载测试结果，比如 CI 或 总结性文件。

在这种场景中，这些控制器一般需要将可选的 `name` 参数传递给 `createTestRun`，同时把 `persist` 参数设置为 `false`。在这里传递 `false` 是希望 VS Code 不要保留测试结果，因为这些结果可以通过外部来源重新加载。

```typescript
const controller = vscode.tests.createTestController(
  'myCoverageFileTests',
  'Coverage File Tests'
);

vscode.commands.registerCommand('myExtension.loadTestResultFile', async file => {
  const info = await readFile(file);

  // 控制器中的项来自于读取的文件：
  controller.items.replace(readTestsFromInfo(info));

  // 生成自定义的测试运行时，然后你可以立即设置这些项目的状态
  // 并终止测试，发布结果
  const run = controller.createTestRun(
    new vscode.TestRunRequest(),
    path.basename(file),
    false
  );
  for (const result of info) {
    if (result.passed) {
      run.passed(result.item);
    } else {
      run.failed(result.item, new vscode.TestMessage(result.message));
    }
  }
  run.end();
});
```

## 从测试管理器 UI 迁移

如果你的插件已经了 Test Explorer UI，我们建议你迁移到功能更强、更高效的原生实现上去。我们已经整理了一个仓库，里面有 测试适配器 的例子在 [Git 历史](https://github.com/connor4312/test-controller-migration-example/commits/master)里面。你可以选择提交名称，从 `[1] Create a native TestController` 开始看到每个步骤。

总结一下，大致步骤如下：

1. 比起使用 Test Explorer UI 的 `TestHub` 提取和注册 `TestAdapter(测试适配器)`，更推荐使用 `const controller = vscode.tests.createTestController(...)`
2. 比起当你发现测试集然后触发 `testAdapter.tests`，更推荐往 `controller.items` 中创建和推送测试项。比如发现测试项目时调用 `vscode.test.createTestItem`，然后把前一步创建的数组传递给 `controller.items.replace`。注意：当测试集发生变化时，你可以修改测试项，也可以更新它们的子集，这些变化会自动呈现在 VS Code 视图上。
3. 对测试集进行初始化时，比如等待 `testAdapter.load()` 调用，不如主动设置 `controller.resolveHandler = () => { /* discover tests */ }`。在 [发现测试集](#发现测试集) 中了解更多信息。
4. 运行测试集时，你应该创建一个[运行配置文件](#运行测试)，然后调用 `const run = controller.createTestRun(request)` 进行处理。不推荐触发 `testStates` 事件，以及将 `TestItem` 传递给 `run` 方法更新它们的状态。

## 其他配置项

`testing/item/context` [菜单配置](../references/contribution-points.md)可以给 Test Explorer 视图中的测试集添加菜单项。在`inline` 组内配置菜单项，可以获得行内效果。其他菜单组也可用鼠标右击展示。

你的菜单项的 `when` 子句中包含很多有用的 [`上下文键`](../references/when-clause-contexts.md)：`testId`、`controllerId`、`testItemHasUri`。对于更复杂的 `when` 场景，比如你想要不同的测试项有不同的行为，可以考虑使用 `in` 条件操作符(../references/when-clause-contexts.md#条件操作符)。

如果你想在 资源管理器 中显示一个测试，你可以将这个测试传递到命令中 `vscode.commands.executeCommand('vscode.revealTestInExplorer', testItem)`。