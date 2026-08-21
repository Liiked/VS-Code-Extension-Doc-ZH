# 测试插件

VS Code 为你的插件提供了运行和调试的能力。测试会运行在一个特殊的 VS Code 实例中——`扩展开发环境`，这个特殊实例拥有访问 VS Code API 的全部权限。本篇侧重于 VS Code 的集成测试，至于单元测试。

## 概述


如果你正在使用[yo code 生成器](https://github.com/Microsoft/vscode-generator-code)，那么生成的项目中应该已经包含了一些测试示例和指引。

使用`npm run test`或者`yarn test`启动集成测试，测试工程随后会：

- 下载并解压最新的 VS Code 版本
- 运行插件的**测试脚本**中所规定的[Mocha](https://mochajs.org/)测试

你可以在[helloworld-test-sample](https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-test-sample)中找到本篇示例，本篇剩余部分将解释例子中的如下部分：

- 测试入口（[src/test/runTest.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/runTest.ts)）
- 测试脚本([src/test/suite/index.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/suite/index.ts))

## 快速配置：测试 CLI

VS Code 团队发了一个用于测试插件的命令行工具。你可以在插件示例仓库中找到相关示例。

测试 CLI 提供了快速配置能力，你可以很轻松地在 VS Code UI 中使用 Extension Test Runner 来调试测试套件。CLI 底层仅仅使用了 Mocha。

开始之前你需要先安装 `@vscode/test-cli`，以及 `@vscode/test-electron`，这样才能在VS Code  桌面环境中运行测试:

```bash
npm install --save-dev @vscode/test-cli @vscode/test-electron
```

安装好这些模块后， 你就可以使用 `vscode-test` 命令了，然后你可以在`package.json` 的 `scripts` 部分使用:


```json{4}
{
  "name": "my-cool-extension",
  "scripts": {
+   "test": "vscode-test"
```

`vscode-test` 会查找当前相对工作路径下的 [`.vscode-test.js/mjs/cjs`](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-cli-sample/.vscode-test.mjs) 文件。这个文件可以配置测试器，你可以在此查看[整个文件](https://github.com/microsoft/vscode-test-cli/blob/main/src/config.cts)的定义。

常用选项如下：
- **(必须)** files - 一个规则或者一组规则，或者包含测试套件运行的绝对路径
- version - 运行测试套件的 VS Code 版本 (默认为 stable 版本).
- workspaceFolder - 测试套件运行期间可打开的工作区
- extensionDevelopmentPath - 插件的文件路径 (默认为本配置文件所在目录)
- mocha - 传递给 Mocha 的对象

示例配置如下：

```js
// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({ files: 'out/test/**/*.test.js' });
```

进阶可参考：

```js
// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig([
  {
    label: 'unitTests',
    files: 'out/test/**/*.test.js',
    version: 'insiders',
    workspaceFolder: './sampleWorkspace',
    mocha: {
      ui: 'tdd',
      timeout: 20000
    }
  }
  // you can specify additional test configurations, too
]);
```
如果你用数组定义了多个配置，那么 `vscode-test` 就会按序执行每个测试。你可以用 `label` 来单独运行测试，传递 `--label` 标记来运行单个测试，比如 `vscode-test --label unitTests`。用 `vscode-test --help` 查看所有吗命令行选项。


### 测试脚本

CLI 配置好之后，你就编写和运行你自己的测试了。测试脚本可以访问 VS Code API，而且运行在 Mocha 之下。这里有一个例子🌰 [src/test/suite/extension.test.ts](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/extension.test.ts)

你可以用 `npm test` 命令来运行，或者等你装了 VS Code 的 [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner) 之后用 **Test: Run All Tests** 运行测试。你还可以用 **Test: Debug All Tests** 命令调试测试套件。

```ts
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});

```

## 进阶配置：你自己的测试运行器

本节的配置在 [helloworld-test-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-test-sample)。本节的剩余文档主要解释示例中的以下几个文件：

- 测试脚本 ([src/test/runTest.ts](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/runTest.ts))
- 测试运行脚本 ([src/test/suite/index.ts](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/index.ts))

VS Code 提供了 2 个 CLI 参数来运行插件测试——`--extensionDevelopmentPath`和`--extensionTestsPath`。

例如：

```bash
# - Launches VS Code Extension Host
# - Loads the extension at <EXTENSION-ROOT-PATH>
# - Executes the test runner script at <TEST-RUNNER-SCRIPT-PATH>
code \
--extensionDevelopmentPath=<EXTENSION-ROOT-PATH> \
--extensionTestsPath=<TEST-RUNNER-SCRIPT-PATH>
```

**测试入口**（[src/test/runTest.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/runTest.ts)）使用了`vscode-test`API，简化了下载、解压、启动 VS Code 的测试流程：

```typescript
import * as path from "path";

import { runTests } from "vscode-test";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    // Download VS Code, unzip it and run the integration test
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
```

`vscode-test`还支持：

- 启动 VS Code 时打开指定工作区
- 下载不同版本的 VS Code
- 使用其他 CLI 参数启动

你可以在[microsoft/vscode-test](https://github.com/microsoft/vscode-test)中找到更多用法。

### 测试脚本

当你运行插件的集成测试时，`--extensionTestsPath`会指向**测试脚本**([src/test/suite/index.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/suite/index.ts))，然后这个脚本会进一步运行测试套件。下面是`helloworld-test-sample`中的[测试脚本](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/suite/index.ts)，它使用了 Mocha 运行测试套件。你可以把这个文件视为测试的起点，你可以用[Mocha 的 API](https://mochajs.org/api/mocha)自定义启动时的配置，你也可以用其他任意喜欢的测试框架替代 Mocha。

```typescript
import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd"
  });
  mocha.useColors(true);

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise((c, e) => {
    glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run(failures => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (err) {
        e(err);
      }
    });
  });
}
```

所有测试脚本和`*.test.js`文件都有访问 VS Code API 的权限。
看看这个例子([src/test/suite/extension.test.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/suite/extension.test.ts))

```typescript
import * as assert from "assert";
import { after } from "mocha";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../extension';

suite("Extension Test Suite", () => {
  after(() => {
    vscode.window.showInformationMessage("All tests done!");
  });

  test("Sample test", () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
```

### 调试测试文件

调试测试文件和调试插件是一样的，我们看一个`launch.json`调试器配置的例子：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": ["${workspaceFolder}/out/test/**/*.js"]
    }
  ]
}
```

<video loop muted playsinline controls>
  <source src="https://code.visualstudio.com/assets/api/working-with-extensions/testing-extension/debug.mp4" type="video/mp4">
</video>

## 提示

#### 使用 Insider 版本开发插件

由于 VS Code 的限制，如果你使用 VS Code 稳定版来运行集成测试，它会报错：

```
Running extension tests from the command line is currently only supported if no other instance of Code is running.
```

所以推荐你使用[VS Code Insiders](https://code.visualstudio.com/insiders/)测试插件。

#### 调试时禁用其他插件

当你在 VS Code 中对测试进行调试时，VS Code 使用的是全局安装的 VS Code 实例，它会加载所有插件。你可以在`launch.json`中添加`--disable-extensions`或者在`runTests`的`launchArgs`选项中添加该项以禁用其他插件。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": [
        "--disable-extensions",
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": ["${workspaceFolder}/out/test/**/*.js"]
    }
  ]
}
```

```typescript
await runTests({
  extensionDevelopmentPath,
  extensionTestsPath,
  /**
   * A list of launch arguments passed to VS Code executable, in addition to `--extensionDevelopmentPath`
   * and `--extensionTestsPath` which are provided by `extensionDevelopmentPath` and `extensionTestsPath`
   * options.
   *
   * If the first argument is a path to a file/folder/workspace, the launched VS Code instance
   * will open it.
   *
   * See `code --help` for possible arguments.
   */
  launchArgs: ["--disable-extensions"]
});
```

#### 使用@vscode/test-electron自定义配置

你可能会需要自定义一些启动配置，比如启动测试前执行`code --install-extension`安装一些其他插件这样的场景。`@vscode/test-electron`提供粒度更细的 API 来操作这样的场景：

```typescript
import * as cp from 'child_process';
import * as path from 'path';
import {
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
  runTests
} from '@vscode/test-electron';

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');
    const vscodeExecutablePath = await downloadAndUnzipVSCode('1.40.1');
    const [cliPath, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

    // Use cp.spawn / cp.exec for custom setup
    cp.spawnSync(
      cliPath,
      [...args, '--install-extension', '<EXTENSION-ID-OR-PATH-TO-VSIX>'],
      {
        encoding: 'utf-8',
        stdio: 'inherit'
      }
    );

    // Run the extension test
    await runTests({
      // Use the specified `code` executable
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();

```

## 测试工作区信任行为

如果你的插件在 `package.json` 中声明了 `capabilities.untrustedWorkspaces`，请为受信任和不受信任的工作区都添加集成测试。你无法从插件测试中以编程方式授予或撤销工作区信任。请对受信任和不受信任的状态分别进行测试运行。

当使用 `@vscode/test-cli` 时，请定义单独的测试配置，以便你可以独立运行每种信任状态：

- **trustedWorkspaceTests**：提供一个不应用信任限制的基线运行。这有助于验证你插件的完整功能行为，并捕获受信任路径中的回归。
- **untrustedWorkspaceTests**：在仍启用工作区信任的情况下验证受限模式行为。使用专用的 `--user-data-dir` 可以防止先前持久化的信任决策使这次运行意外地变为受信任。

因为每个配置都有自己的 `label`，你可以独立运行它们（例如，`vscode-test --label trustedWorkspaceTests` 和 `vscode-test --label untrustedWorkspaceTests`），或者按顺序运行两者。

```js
// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');
const path = require('path');

module.exports = defineConfig([
  {
    label: 'trustedWorkspaceTests',
    files: 'out/test/**/*.test.js',
    workspaceFolder: './test/fixtures/trusted-workspace',
    // Optional: disables Workspace Trust for this run
    launchArgs: ['--disable-workspace-trust'],
  },
  {
    label: 'untrustedWorkspaceTests',
    files: 'out/test/**/*.test.js',
    workspaceFolder: './test/fixtures/untrusted-workspace',
    // Keep Workspace Trust enabled and isolate user data for deterministic runs
    launchArgs: [
      '--user-data-dir',
      path.join(__dirname, '.vscode-test', 'user-data-untrusted'),
    ],
  },
]);
```

在你的测试中，通过检查 `vscode.workspace.isTrusted` 来断言感知信任的行为：

```ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Workspace Trust Tests', () => {
  test('extension behavior changes by trust state', async () => {
    const isFeatureAvailable = await vscode.commands.executeCommand<boolean>(
      'myExtension.isRestrictedFeatureEnabled'
    );

    if (vscode.workspace.isTrusted) {
      assert.strictEqual(isFeatureAvailable, true);
    } else {
      assert.strictEqual(isFeatureAvailable, false);
    }
  });
});
```

关于如何在插件清单中声明信任要求，以及如何使用 `vscode.workspace.isTrusted` API 的更多信息，请参阅[工作区信任插件指南](/api/extension-guides/workspace-trust)。

## Next steps

- [Continuous Integration](/api/working-with-extensions/continuous-integration) - Run your extension tests in a Continuous Integration service such as Azure DevOps.
- [Workspace Trust Extension Guide](/api/extension-guides/workspace-trust) - Learn how to declare and handle workspace trust in your extension.

