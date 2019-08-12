# 测试插件

VS Code 为你的插件提供了运行和调试的能力。测试会运行在一个特殊的 VS Code 实例中——`扩展开发环境`，这个特殊实例拥有访问 VS Code API 的全部权限。本篇侧重于 VS Code 的集成测试，至于单元测试，你可以使用任何流行的测试框架，如[Mocha](https://mochajs.org/)或者[Jasmine](https://jasmine.github.io/)。

## 概述

---

_如果你原本使用`vscode`库进行测试，可以参考[从`vscode`迁移](#从-vscode-迁移)部分_

如果你正在使用[yo code 生成器](https://github.com/Microsoft/vscode-generator-code)，那么生成的项目中应该已经包含了一些测试示例和指引。

使用`npm run test`或者`yarn test`启动集成测试，测试工程随后会：

- 下载并解压最新的 VS Code 版本
- 运行插件的**测试脚本**中所规定的[Mocha](https://mochajs.org/)测试

你可以在[helloworld-test-sample](https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-test-sample)中找到本篇示例，本篇剩余部分将解释例子中的如下部分：

- 测试入口（[src/test/runTest.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/runTest.ts)）
- 测试脚本([src/test/suite/index.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/suite/index.ts))

## 测试入口

---

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

**测试入口**（[src/test/runTest.ts](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/runTest.ts)））使用了`vscode-test`API，简化了下载、解压、启动 VS Code 的测试流程：

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

## 测试脚本

---

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

## 调试测试文件

---

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
  <source src="https://code.visualstudio.com/api/working-with-extensions/testing-extension/debug.mp4" type="video/mp4">
</video>

## 提示

---

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

#### 使用`vscode-test`自定义配置

你可能会需要自定义一些启动配置，比如启动测试前执行`code --install-extension`安装一些其他插件这样的场景。`vscode-test`提供粒度更细的 API 来操作这样的场景：

```typescript
const cp = require("child_process");
const {
  downloadAndUnzipVSCode,
  resolveCliPathFromExecutablePath
} = require("vscode-test");
const vscodeExecutablePath = await downloadAndUnzipVSCode("1.34.0");
const cliPath = resolveCliPathFromExecutablePath(vscodeExecutablePath);

// Use cp.spawn / cp.exec for custom setup
cp.spawnSync(
  cliPath,
  ["--install-extension", "<EXTENSION-ID-OR-PATH-TO-VSIX>"],
  {
    encoding: "utf-8",
    stdio: "inherit"
  }
);

// Run the extension test
await runTests({
  // Use the specified `code` executable
  vscodeExecutablePath,
  extensionPath,
  testRunnerPath
});
```

#### 从 vscode 迁移

`vscode`中的集成测试模块已迁移到`vscode-test`，你可以按下面的步骤进行迁移：

- 移除`vscode`依赖
- 添加`vscode-test`依赖
- 由于旧的`vscode`模块会下载 VS Code 类型定义，所以你需要

  - 手动安装`@types/vscode`，这个版本需和你`package.json`的`engine.vscode`版本一致，比如你的`engine.vscode`版本是`1.30`，那么就安装`@types/vscode@1.30`
  - 删除`package.json`中的`"postinstall": "node ./node_modules/vscode/bin/install"`

- 添加一个[测试入口](#测试入口)，你可以像我们的示例一样，用`runTest.ts`作为入口。
- 指定`package.json`中的`test`脚本，运行编译后的`runTest.ts`。
- 添加一个[测试脚本](#测试脚本)，你可以用[sample test runner script](https://github.com/microsoft/vscode-extension-samples/blob/master/helloworld-test-sample/src/test/suite/index.ts)作为入口。注意`vscode`过去依赖`mocha@4`和`glob`，现在你需要自己安装到`devDependency`里去。

## 下一步

- [持续集成](/working-with-extensions/continuous-integration.md)：将你的插件运行在持续集成服务中，比如 Azure Devops。
