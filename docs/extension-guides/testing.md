
# 测试型 API

Testing API 允许 Visual Studio Code 插件在工作区中发现测试并发布结果。用户可以在测试资源管理器（Test Explorer）视图、装饰器以及命令中执行测试。借助这些新的 API，Visual Studio Code 可以比以往展示更丰富的输出和差异（diff）内容。

>**注意**：Testing API 在 VS Code 1.59 及更高版本中可用。

## 示例

VS Code 团队维护了两个测试供应器：

- [示例测试插件](https://github.com/microsoft/vscode-extension-samples/tree/main/test-provider-sample)，它在 Markdown 文件中提供测试。
- [selfhost 测试插件](https://github.com/microsoft/vscode-selfhost-test-provider)，我们用它来在 VS Code 自身中运行测试。

## 发现测试

测试由 `TestController` 提供，创建它需要一个全局唯一的 ID 和人类可读的标签：

```ts
const controller = vscode.tests.createTestController('helloWorldTests', 'Hello World Tests');
```

要发布测试，你需要将 `TestItem` 作为子项添加到控制器的 `items` 集合中。`TestItem` 是测试 API 的基础（见 `TestItem` 接口），它是一种通用类型，可以描述代码中存在的测试用例、测试套件或树形条目。它们自身又可以拥有 `children`，从而形成层级结构。例如，下面是示例测试插件创建测试的简化版本：

```ts
parseMarkdown(content, {
  onTest: (range, numberA, mathOperator, numberB, expectedValue) => {
    // If this is a top-level test, add it to its parent's children. If not,
    // add it to the controller's top level items.
    const collection = parent ? parent.children : controller.items;
    // Create a new ID that's unique among the parent's children:
    const id = [numberA, mathOperator, numberB, expectedValue].join('  ');

    // Finally, create the test item:
    const test = controller.createTestItem(id, data.getLabel(), item.uri);
    test.range = range;
    collection.add(test);
  },
  // ...
});
```

与诊断（Diagnostics）类似，何时发现测试主要由插件控制。简单的插件可能会监视整个工作区，并在激活时解析所有文件中的所有测试。不过，对于大型工作区，立即解析所有内容可能会很慢。所以你可以做两件事：

1. 监视 `vscode.workspace.onDidOpenTextDocument`，在文件于编辑器中打开时主动发现该文件的测试。
1. 设置 `item.canResolveChildren = true` 并设置 `controller.resolveHandler`。如果用户采取了要求发现测试的操作（例如在测试资源管理器中展开某个条目），就会调用 `resolveHandler`。

下面是这种策略在懒解析文件的插件中可能的样子：

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

`discoverAllFilesInWorkspace` 的实现可以使用 VS Code 现有的文件监视功能来构建。当调用 `resolveHandler` 时，你应该继续监视更改，以便测试资源管理器中的数据保持最新。

```ts
async function discoverAllFilesInWorkspace() {
  if (!vscode.workspace.workspaceFolders) {
    return []; // handle the case of no open folders
  }

  return Promise.all(vscode.workspace.workspaceFolders.map(async workspaceFolder => {
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
  }));
}
```

`TestItem` 接口很简单，没有存放自定义数据的空间。如果你需要将额外信息与 `TestItem` 关联，可以使用 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)：

```ts
const testData = new WeakMap<vscode.TestItem, MyCustomData>();

// to associate data:
const item = controller.createTestItem(id, label);
testData.set(item, new MyCustomData());

// to get it back later:
const myData = testData.get(item);
```

可以保证，传递给所有与 `TestController` 相关方法的 `TestItem` 实例与最初由 `createTestItem` 创建的实例相同，因此你可以确信从 `testData` 映射中获取条目一定有效。

对于这个示例，我们只需存储每个条目的类型：

```ts
enum ItemType {
  File,
  TestCase,
}

const testData = new WeakMap<vscode.TestItem, ItemType>();

const getType = (testItem: vscode.TestItem) => testData.get(testItem)!;
```

## 运行测试

测试通过 `TestRunProfile` 执行。每个 profile 属于特定的执行 `kind`：运行（run）、调试（debug）或覆盖率（coverage）。大多数测试插件在每个分组中最多有一个 profile，但也允许更多。例如，如果你的插件在多个平台上运行测试，你可以为每种平台与 `kind` 的组合各设置一个 profile。每个 profile 都有一个 `runHandler`，当请求该类型的运行时会被调用。

```ts

function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // todo
}

const runProfile = controller.createRunProfile('Run', vscode.TestRunProfileKind.Run, (request, token) => {
  runHandler(false, request, token);
});

const debugProfile = controller.createRunProfile('Debug', vscode.TestRunProfileKind.Debug, (request, token) => {
  runHandler(true, request, token);
});
```

`runHandler` 应至少调用一次 `controller.createTestRun`，并传入原始请求。请求包含要在测试运行中 `include`（包含）的测试（如果用户要求运行所有测试，则省略），以及可能要从运行中 `exclude`（排除）的测试。插件应使用得到的 `TestRun` 对象来更新运行中涉及的测试的状态。例如：

```ts
async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
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

除了 `runHandler`，你还可以在 `TestRunProfile` 上设置 `configureHandler`。如果存在该处理函数，VS Code 会提供 UI 让用户配置测试运行，并在用户配置时调用该处理函数。从这里开始，你可以打开文件、显示 Quick Pick，或做任何对你的测试框架合适的事情。

> VS Code 有意以不同于调试或任务配置的方式处理测试配置。这些通常是面向编辑器或 IDE 的功能，在 `.vscode` 文件夹中的特殊文件中配置。然而，测试传统上是从命令行执行的，而且大多数测试框架已有现有的配置策略。因此，在 VS Code 中，我们避免重复配置，而是将其留给插件处理。

### 测试输出

除了传递给 `TestRun.failed` 或 `TestRun.errored` 的消息外，你还可以使用 `run.appendOutput(str)` 追加通用输出。这些输出可以使用 **Test: Show Output** 在终端中显示，也可以通过 UI 中的各种按钮（例如测试资源管理器视图中的终端图标）显示。

由于该字符串是在终端中渲染的，你可以使用完整的 [ANSI 代码](https://en.wikipedia.org/wiki/ANSI_escape_code)集，包括 [ansi-styles](https://www.npmjs.com/package/ansi-styles) npm 包中可用的样式。请记住，由于是在终端中，行必须使用 CRLF（`\r\n`）换行，而不仅是 LF（`\n`），后者可能是某些工具的默认输出。

### 测试覆盖率

测试覆盖率通过 `run.addCoverage()` 方法与 `TestRun` 关联。规范做法是由 `TestRunProfileKind.Coverage` 类型 profile 的 `runHandler` 完成，但也可以在任意测试运行期间调用它。`addCoverage` 方法接受一个 `FileCoverage` 对象，它是该文件中覆盖率数据的摘要：

```ts
async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  for await (const file of readCoverageOutput()) {
    run.addCoverage(new vscode.FileCoverage(file.uri, file.statementCoverage))
  }
}
```

`FileCoverage` 包含每个文件中语句、分支和声明的总体已覆盖与未覆盖计数。根据你的运行时和覆盖率格式，你可能会看到语句覆盖率被称为行覆盖率，或者声明覆盖率被称为函数或方法覆盖率。你可以为同一个 URI 多次添加文件覆盖率，在这种情况下，新信息会替换旧信息。

当用户打开带有覆盖率的文件，或在**测试覆盖率（Test Coverage）**视图中展开某个文件时，VS Code 会请求该文件的更多信息。它会通过调用扩展在 `TestRunProfile` 上定义的 `loadDetailedCoverage` 方法来实现，传入 `TestRun`、`FileCoverage` 和 `CancellationToken`。请注意，测试运行和文件覆盖率实例与 `run.addCoverage` 中使用的相同，这有助于关联数据。例如，你可以创建一个从 `FileCoverage` 对象到你自己的数据的映射：

```ts
const coverageData = new WeakMap<vscode.FileCoverage, MyCoverageDetails>();

profile.loadDetailedCoverage = (testRun, fileCoverage, token) => {
  return coverageData.get(fileCoverage).load(token);
}

async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  for await (const file of readCoverageOutput()) {
    const coverage = new vscode.FileCoverage(file.uri, file.statementCoverage);
    coverageData.set(coverage, file)
    run.addCoverage(coverage);
  }
}
```

Alternatively you might subclass `FileCoverage` with an implementation that includes that data:

```ts
class MyFileCoverage extends vscode.FileCoverage {
  // ...
}

profile.loadDetailedCoverage = async (testRun, fileCoverage, token) => {
  return fileCoverage instanceof MyFileCoverage ? await fileCoverage.load() : [];
}

async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  for await (const file of readCoverageOutput()) {
    // 'file' is MyFileCoverage:
    run.addCoverage(file);
  }
}
```

`loadDetailedCoverage` 预期返回一个 Promise，其解析值为 `DeclarationCoverage` 和/或 `StatementCoverage` 对象的数组。两个对象都包含一个 `Position` 或 `Range`，指示它们在源文件中的位置。`DeclarationCoverage` 对象包含被声明事物的名称（如函数或方法名）以及该声明被进入或调用的次数。语句包含它们被执行次数，以及零个或多个关联分支。更多信息请参阅 `vscode.d.ts` 中的类型定义。

在很多情况下，你的测试运行可能会留下一些持久文件。最佳实践是将此类覆盖率输出放在系统的临时目录中（你可以通过 `require('os').tmpdir()` 获取），但你也可以在 VS Code 提示不再需要保留测试运行时主动清理它们：

```ts
import { promises as fs } from 'fs';

async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  run.onDidDispose(async () => {
    await fs.rm(coverageOutputDirectory, { recursive: true, force: true });
  });
}
```

### 测试标签

有时测试只能在特定配置下运行，或者根本无法运行。对于这些用例，你可以使用测试标签（Test Tags）。`TestRunProfile` 可以可选地关联一个标签，如果关联了标签，那么只有带有该标签的测试才能在该 profile 下运行。同样，如果没有符合条件的 profile 可以运行、调试或收集某个特定测试的覆盖率，这些选项将不会显示在 UI 中。

```ts
// Create a new tag with an ID of "runnable"
const runnableTag = new TestTag('runnable');

// Assign it to a profile. Now this profile can only execute tests with that tag.
runProfile.tag = runnableTag;

// Add the "runnable" tag to all applicable tests.
for (const test of getAllRunnableTests()) {
  test.tags = [...test.tags, runnableTag];
}
```

用户还可以在测试资源管理器 UI 中按标签筛选。

### 仅发布控制器

运行 profile 的存在是可选的。允许控制器在没有 profile 的情况下创建测试、在 `runHandler` 之外调用 `createTestRun`，并更新运行中测试的状态。这种做法的常见用例是从外部来源（如 CI 或摘要文件）加载结果的控制器。

在这种情况下，这些控制器通常应向 `createTestRun` 传入可选的 `name` 参数，并为 `persist` 参数传入 `false`。在这里传入 `false` 会指示 VS Code 不保留测试结果（就像编辑器中的运行那样），因为这些结果可以从外部来源重新加载。

```ts
const controller = vscode.tests.createTestController('myCoverageFileTests', 'Coverage File Tests');

vscode.commands.registerCommand('myExtension.loadTestResultFile', async file => {
  const info = await readFile(file);

  // set the controller items to those read from the file:
  controller.items.replace(readTestsFromInfo(info));

  // create your own custom test run, then you can immediately set the state of
  // items in the run and end it to publish results:
  const run = controller.createTestRun(new vscode.TestRunRequest(), path.basename(file), false);
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

## 从 Test Explorer UI 迁移

如果你有使用 Test Explorer UI 的既有插件，我们建议你迁移到原生体验，以获得更多功能和更高的效率。我们准备了一个仓库，其中包含 Test Adapter 示例迁移的示例，在它的 [Git 历史](https://github.com/connor4312/test-controller-migration-example/commits/master)中。你可以从 `[1] Create a native TestController` 开始，通过选择提交名称查看每个步骤。

总而言之，一般步骤如下：

1. 与其从 Test Explorer UI 的 `TestHub` 获取并注册 `TestAdapter`，不如调用 `const controller = vscode.tests.createTestController(...)`。

1. 与其在发现或重新发现测试时触发 `testAdapter.tests`，不如创建测试并将其推入 `controller.items`，例如通过调用 `controller.items.replace` 并传入由 `vscode.test.createTestItem` 创建的已发现测试数组。请注意，随着测试变化，你可以修改测试条目上的属性并更新其子项，更改会自动反映在 VS Code 的 UI 中。

1. 要最初加载测试，与其等待 `testAdapter.load()` 方法调用，不如设置 `controller.resolveHandler = () => { /* discover tests */ }`。有关测试发现如何工作的更多信息，请参阅[发现测试](#discovering-tests)。

1. 要运行测试，你应该创建一个带处理函数的[运行 Profile](#running-tests)，该处理函数调用 `const run = controller.createTestRun(request)`。与其触发 `testStates` 事件，不如将 `TestItem` 传递给 `run` 上的方法来更新其状态。

## 额外的配置点

`testing/item/context` [菜单配置点](/api/references/contribution-points#contributes.menus)可用于向测试资源管理器视图中的测试添加菜单项。将菜单项放在 `inline` 组中即可内联显示。所有其他菜单项分组将显示在使用鼠标右键访问的上下文菜单中。

你的菜单项的 `when` 子句中可以使用额外的[上下文键](/api/references/when-clause-contexts)：`testId`、`controllerId` 和 `testItemHasUri`。对于更复杂的 `when` 场景（希望操作对不同测试条目可选可用），请考虑使用 [`in` 条件运算符](/api/references/when-clause-contexts#in-and-not-in-conditional-operators)。

如果你想在资源管理器中显示某个测试，可以将该测试传给命令 `vscode.commands.executeCommand('vscode.revealTestInExplorer', testItem)`。
