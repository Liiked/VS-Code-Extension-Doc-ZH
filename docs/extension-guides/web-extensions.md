
# Web 插件

Visual Studio Code 可以作为浏览器中的编辑器运行。一个例子是 `github.dev` 用户界面，在 GitHub 中浏览仓库或拉取请求时按下 `.`（句点键）即可访问。当 VS Code 在 Web 中使用时，已安装的插件会运行在浏览器中的一个插件主机中，称为“Web 插件主机”。能够在 Web 插件主机中运行的插件称为“Web 插件”。

Web 插件与普通插件结构相同，但由于运行环境不同，它们不会像为 Node.js 运行时编写的插件那样运行相同的代码。Web 插件仍然可以访问完整的 VS Code API，但无法再访问 Node.js API 和模块加载。相反，Web 插件受浏览器沙箱的限制，因此与普通插件相比有[局限性](#web-extension-main-file)。

Web 插件运行时在 VS Code 桌面版上也受支持。如果你决定将插件创建为 Web 插件，它将在 [VS Code for the Web](/docs/remote/vscode-web)（包括 `vscode.dev` 和 `github.dev`）以及桌面版和 [GitHub Codespaces](/docs/remote/codespaces) 等服务中受支持。

## Web 插件的结构

Web 插件的[结构与普通插件相同](/api/get-started/extension-anatomy)。插件清单（`package.json`）定义了插件源代码的入口文件，并声明了插件的配置。

对于 Web 插件，[主入口文件](#web-extension-main-file)由 `browser` 属性定义，而不是像普通插件那样由 `main` 属性定义。

`contributes` 属性对 Web 插件和普通插件的作用方式相同。

下面的示例展示了简单的 hello world 插件的 `package.json`，它只在 Web 插件主机中运行（它只有 `browser` 入口点）：

```json
{
  "name": "helloworld-web-sample",
  "displayName": "helloworld-web-sample",
  "description": "HelloWorld example for VS Code in the browser",
  "version": "0.0.1",
  "publisher": "vscode-samples",
  "repository": "https://github.com/microsoft/vscode-extension-samples/helloworld-web-sample",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "browser": "./dist/web/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "helloworld-web-sample.helloWorld",
        "title": "Hello World"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run package-web",
    "compile-web": "webpack",
    "watch-web": "webpack --watch",
    "package-web": "webpack --mode production --devtool hidden-source-map",
  },
  "devDependencies": {
    "@types/vscode": "^1.59.0",
    "ts-loader": "^9.2.2",
    "webpack": "^5.38.1",
    "webpack-cli": "^4.7.0",
    "@types/webpack-env": "^1.16.0",
    "process": "^0.11.10"
  }
}
```

:::info
 **注意**：如果你的插件面向的是 1.74 之前的 VS Code 版本，你必须将 `onCommand:helloworld-web-sample.helloWorld` 显式地列出在 `activationEvents` 中。
:::

只有 `main` 入口点而没有 `browser` 的插件不是 Web 插件。它们会被 Web 插件主机忽略，也不会在扩展视图中提供下载。

![扩展视图](https://code.visualstudio.com/assets/api/extension-guides/web-extensions/extensions-view-item-disabled.png)

只有声明式配置（只有 `contributes`，没有 `main` 或 `browser`）的插件可以是 Web 插件。它们可以在[VS Code for the Web](/docs/remote/vscode-web)中安装和运行，无需插件作者做任何修改。声明式配置插件的例子包括主题、语法和代码片段。

插件可以同时有 `browser` 和 `main` 入口点，以便在浏览器和 Node.js 运行时中运行。[将既有插件更新为 Web 插件](#update-existing-extensions-to-web-extensions)一节介绍了如何迁移插件使其在两个运行时中都能工作。

[Web 插件启用](#web-extension-enablement)一节列出了用于决定插件是否能在 Web 插件主机中加载的规则。

### Web 插件主文件

Web 插件的主文件由 `browser` 属性定义。该脚本在 Web 插件主机中运行于[浏览器 WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API)环境。它受浏览器 worker 沙箱的限制，与在 Node.js 运行时中运行的普通插件相比有局限性。

* 不支持导入或 require 其他模块。`importScripts` 也不可用。因此，代码必须打包为单个文件。
* [VS Code API](/api/references/vscode-api) 可以通过 `require('vscode')` 模式加载。这会生效是因为存在一个 `require` 的 shim，但这个 shim 不能用来加载额外的插件文件或额外的 node 模块。它只对 `require('vscode')` 有效。
* Node.js 全局变量和库（如 `process`、`os`、`setImmediate`、`path`、`util`、`url`）在运行时不可用。不过，它们可以通过 webpack 等工具添加。[webpack 配置](#webpack-configuration)一节说明了如何实现。
* 打开的工作区或文件夹位于虚拟文件系统上。访问工作区文件需要通过 `vscode.workspace.fs` 提供的 VS Code [文件系统](/api/references/vscode-api#FileSystem) API。
* [插件上下文](/api/references/vscode-api#ExtensionContext)位置（`ExtensionContext.extensionUri`）和存储位置（`ExtensionContext.storageUri`、`globalStorageUri`）也位于虚拟文件系统上，需要通过 `vscode.workspace.fs` 访问。
* 访问 Web 资源时，必须使用 [Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API) API。所访问的资源需要支持[跨源资源共享](https://developer.mozilla.org/docs/Web/HTTP/CORS)（CORS）。
* 创建子进程或运行可执行文件是不可能的。不过，可以通过 [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) API 创建 web worker。这用于运行语言服务器，如 [Web 插件中的语言服务器协议](#language-server-protocol-in-web-extensions)一节所述。
* 与普通插件一样，需要通过 `exports.activate = ...` 模式导出插件的 `activate/deactivate` 函数。

## 开发 Web 插件

幸运的是，TypeScript 和 webpack 等工具可以隐藏许多浏览器运行时限制，让你像编写普通插件一样编写 Web 插件。Web 插件和普通插件通常可以从同一份源代码生成。

例如，由 `yo code` [生成器](https://www.npmjs.com/package/generator-code)创建的 `Hello Web Extension` 仅在构建脚本上有所不同。你可以像调试传统 Node.js 插件一样，使用 **Debug: Select and Start Debugging** 命令提供的启动配置来运行和调试生成的插件。

## 创建 Web 插件

要搭建一个新的 Web 插件，请使用 `yo code` 并选择 **New Web Extension**。确保安装了最新版本的 [generator-code](https://www.npmjs.com/package/generator-code)（>= generator-code@1.6）。要更新生成器和 yo，请运行 `npm i -g yo generator-code`。

创建的插件由插件的源代码（一个显示 hello world 通知的命令）、`package.json` 清单文件以及一个 webpack 或 esbuild 配置文件组成。

为了简化起见，我们假设你使用 `webpack` 作为打包器。在文章末尾，我们还会说明选择 `esbuild` 时有什么不同。

* `src/web/extension.ts` 是插件的入口源代码文件。它与普通的 hello 插件相同。
* `package.json` 是插件清单。
  * 它使用 `browser` 属性指向入口文件。
  * 它提供了 `compile-web`、`watch-web` 和 `package-web` 脚本，用于编译、监视和打包。
* `webpack.config.js` 是 webpack 配置文件，负责将插件源代码编译并打包为单个文件。
* `.vscode/launch.json` 包含在 VS Code 桌面版中使用 Web 插件主机运行 Web 插件和测试的启动配置（不再需要设置 `extensions.webWorker`）。
* `.vscode/task.json` 包含启动配置使用的构建任务。它使用 `npm run watch-web`，并依赖于 webpack 特有的 `ts-webpack-watch` 问题匹配器。
* `.vscode/extensions.json` 包含提供问题匹配器的插件。要使启动配置正常工作，需要安装这些插件。
* `tsconfig.json` 定义了与 `webworker` 运行时匹配的编译选项。

[helloworld-web-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-web-sample) 中的源代码与生成器创建的内容类似。

### webpack 配置

webpack 配置文件由 `yo code` 自动生成。它将插件源代码打包为单个 JavaScript 文件，以便在 Web 插件主机中加载。

稍后我们会说明如何将 esbuild 用作打包器，但现在我们先从 webpack 开始。

[webpack.config.js](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/webpack.config.js)

```js
const path = require('path');
const webpack = require('webpack');

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const webExtensionConfig = {
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  target: 'webworker', // extensions run in a webworker context
  entry: {
    'extension': './src/web/extension.ts', // source of the web extension main file
    'test/suite/index': './src/web/test/suite/index.ts' // source of the web extension test runner
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist/web'),
    libraryTarget: 'commonjs',
    devtoolModuleFilenameTemplate: '../../[resource-path]'
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
    extensions: ['.ts', '.js'], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
      'assert': require.resolve('assert')
    }
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
          loader: 'ts-loader'
      }]
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser', // provide a shim for the global `process` variable
    }),
  ],
  externals: {
    'vscode': 'commonjs vscode', // ignored because it doesn't exist
  },
  performance: {
    hints: false
  },
  devtool: 'nosources-source-map' // create a source map that points to the original source file
};
module.exports = [webExtensionConfig];
```

`webpack.config.js` 中一些重要的字段是：

* `entry` 字段包含插件和测试套件的主入口点。
  * 你可能需要调整此路径，使其正确指向插件入口点。
  * 对于既有插件，你可以先将此路径指向 `package.json` 中当前用于 `main` 的文件。
  * 如果你不想打包测试，可以省略测试套件字段。
* `output` 字段指明编译后文件的位置。
  * `[name]` 会被替换为 `entry` 中使用的键。因此，在生成的配置文件中，会产生 `dist/web/extension.js` 和 `dist/web/test/suite/index.js`。
* `target` 字段指明编译后的 JavaScript 文件将在哪种环境中运行。对于 Web 插件，你需要将其设为 `webworker`。
* `resolve` 字段包含为在浏览器中无法工作的 node 库添加别名和 fallback 的能力。
  * 如果你使用 `path` 之类的库，可以指定在 Web 编译上下文中如何解析 `path`。例如，你可以用 `path: path.resolve(__dirname, 'src/my-path-implementation-for-web.js')` 指向项目中定义 `path` 的文件。或者你可以使用该库的 Browserify node 打包版本 `path-browserify`，并指定 `path: require.resolve('path-browserify')`。
  * 参见 [webpack resolve.fallback](https://webpack.js.org/configuration/resolve/#resolvefallback) 获取 Node.js 核心模块 polyfill 列表。
* `plugins` 部分使用 [DefinePlugin 插件](https://webpack.js.org/plugins/define-plugin/) 对 `process` 等 Node.js 全局变量进行 polyfill。

## 测试你的 Web 插件

目前有三种方法可以在发布到 Marketplace 之前测试 Web 插件。

* 使用在桌面版上运行的 VS Code，加上 `--extensionDevelopmentKind=web` 选项，在运行于 VS Code 中的 Web 插件主机里运行你的 Web 插件。
* 使用 [@vscode/test-web](https://github.com/microsoft/vscode-test-web) node 模块，打开一个包含你的插件（由本地服务器提供）的 VS Code for the Web 浏览器。
* [侧载](#test-your-web-extension-in-vscode.dev)你的插件到 [vscode.dev](https://vscode.dev) 上，在真实环境中查看你的插件。

### 在桌面版 VS Code 中测试你的 Web 插件

要使用现有的 VS Code 插件开发体验，桌面版 VS Code 支持在常规 Node.js 插件主机之外，同时运行一个 Web 插件主机。

使用 **New Web Extension** 生成器提供的 `pwa-extensionhost` 启动配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Web Extension in VS Code",
      "type": "pwa-extensionHost",
      "debugWebWorkerHost": true,
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionDevelopmentKind=web"
      ],
      "outFiles": [
        "${workspaceFolder}/dist/web/**/*.js"
      ],
      "preLaunchTask": "npm: watch-web"
    }
  ]
}
```

它使用 `npm: watch-web` 任务，通过调用 `npm run watch-web` 来编译插件。该任务预期在 `tasks.json` 中：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "watch-web",
      "group": "build",
      "isBackground": true,
      "problemMatcher": [
        "$ts-webpack-watch"
      ]
    }
  ]
}
```

`$ts-webpack-watch` 是一个可以解析 webpack 工具输出的问题匹配器。它由 [TypeScript + Webpack Problem Matchers](https://marketplace.visualstudio.com/items?itemName=eamodio.tsl-problem-matcher) 插件提供。

在启动的**插件开发主机（Extension Development Host）**实例中，Web 插件将可用并在 Web 插件主机中运行。运行 `Hello World` 命令来激活插件。

打开**正在运行的插件（Running Extensions）**视图（命令：**Developer: Show Running Extensions**），查看哪些插件正在 Web 插件主机中运行。

### 使用 @vscode/test-web 在浏览器中测试你的 Web 插件

[@vscode/test-web](https://github.com/microsoft/vscode-test-web) node 模块提供了 CLI 和 API，用于在浏览器中测试 Web 插件。

该 node 模块提供一个名为 `vscode-test-web` 的 npm 二进制文件，可以从命令行打开 VS Code for the Web：

* 它将 VS Code 的 Web 部分下载到 `.vscode-test-web`。
* 在 `localhost:3000` 上启动本地服务器。
* 打开一个浏览器（Chromium、Firefox 或 Webkit）。

你可以从命令行运行它：

```bash
npx @vscode/test-web --extensionDevelopmentPath=$extensionFolderPath $testDataPath
```

或者更好的是，将 `@vscode/test-web` 作为开发依赖添加到插件中，并在脚本中调用它：

```json
  "devDependencies": {
    "@vscode/test-web": "*"
  },
  "scripts": {
    "open-in-browser": "vscode-test-web --extensionDevelopmentPath=. ."
  }
```

更多 CLI 选项，请查看 [@vscode/test-web README](https://www.npmjs.com/package/@vscode/test-web)：

| 选项                       | 参数说明                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| --browserType              | 要启动的浏览器：`chromium`（默认）、`firefox` 或 `webkit`                                                                                                                                              |
| --extensionDevelopmentPath | 指向要包含的开发中插件的路径。                                                                                                                                                                         |
| --extensionTestsPath       | 要运行的测试模块的路径。                                                                                                                                                                               |
| --permission               | 授予已打开浏览器的权限：例如 `clipboard-read`、`clipboard-write`。<br>参见[完整选项列表](https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions)。该参数可以多次提供。 |
| --folder-uri               | 要在其上打开 VS Code 的工作区 URI。当提供了 `folderPath` 时会被忽略。                                                                                                                                  |
| --extensionPath            | 指向包含要包含的其他插件的文件夹的路径。<br>该参数可以多次提供。                                                                                                                                       |
| folderPath                 | 要在其上打开 VS Code 的本地文件夹。<br>文件夹内容将作为虚拟文件系统提供，并作为工作区打开。                                                                                                            |

VS Code 的 Web 部分会下载到 `.vscode-test-web` 文件夹。你应该将其添加到 `.gitignore` 文件中。

### 在 vscode.dev 中测试你的 Web 插件

在发布插件供大家在 VS Code for the Web 上使用之前，你可以验证插件在真实的 [vscode.dev](https://vscode.dev) 环境中的行为。

要在 vscode.dev 上看到你的插件，你首先需要从你的机器上托管它，供 vscode.dev 下载和运行。

首先，你需要[安装 `mkcert`](https://github.com/FiloSottile/mkcert#installation)。

然后，将 `localhost.pem` 和 `localhost-key.pem` 文件生成到一个你不会丢失的位置（例如 `$HOME/certs`）：

```
$ mkdir -p $HOME/certs
$ cd $HOME/certs
$ mkcert -install
$ mkcert localhost
```

然后，从你的插件路径运行 `npx serve` 启动一个 HTTP 服务器：

```
$ npx serve --cors -l 5000 --ssl-cert $HOME/certs/localhost.pem --ssl-key $HOME/certs/localhost-key.pem
npx: installed 78 in 2.196s

   ┌────────────────────────────────────────────────────┐
   │                                                    │
   │   Serving!                                         │
   │                                                    │
   │   - Local:            https://localhost:5000       │
   │   - On Your Network:  https://172.19.255.26:5000   │
   │                                                    │
   │   Copied local address to clipboard!               │
   │                                                    │
   └────────────────────────────────────────────────────┘
```

最后，打开 [vscode.dev](https://vscode.dev)，从命令面板运行 **Developer: Install Extension From Location...**（`kb(workbench.action.showCommands)`），粘贴上面的 URL（示例中是 `https://localhost:5000`），然后选择 **Install**。

**检查日志**

你可以查看浏览器开发者工具控制台中的日志，以查看插件的错误、状态和日志。

你可能还会看到 vscode.dev 自身的其他日志。此外，你不太容易设置断点，也看不到插件的源代码。这些限制使得在 vscode.dev 中调试的体验不太理想，因此我们建议在侧载到 vscode.dev 之前，先使用前两种方法进行测试。在发布插件之前，侧载是一个很好的最终 sanity check。

## Web 插件测试

Web 插件测试受支持，并且可以像普通插件测试一样实现。请参阅[测试插件](/api/working-with-extensions/testing-extension)一文了解插件测试的基本结构。

[@vscode/test-web](https://github.com/microsoft/vscode-test-web) node 模块相当于 [@vscode/test-electron](https://github.com/microsoft/vscode-test)（以前称为 `vscode-test`）。它允许你在 Chromium、Firefox 和 Safari 上从命令行运行插件测试。

该工具执行以下步骤：

1. 从本地 Web 服务器启动 VS Code for the Web 编辑器。
2. 打开指定的浏览器。
3. 运行提供的测试运行器脚本。

你可以在持续构建中运行测试，以确保插件在所有浏览器上都能正常工作。

测试运行器脚本在 Web 插件主机中运行，与 [Web 插件主文件](#web-extension-main-file)具有相同的限制：

* 所有文件都会打包为单个文件。它应该包含测试运行器（例如 Mocha）和所有测试（通常是 `*.test.ts`）。
* 只支持 `require('vscode')`。

由 `yo code` Web 插件生成器创建的 [webpack 配置](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/webpack.config.js)有一个针对测试的部分。它期望测试运行器脚本位于 `./src/web/test/suite/index.ts`。提供的[测试运行器脚本](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/src/web/test/suite/index.ts)使用 Web 版本的 Mocha，并包含 webpack 特有的语法来导入所有测试文件。

```ts
require('mocha/mocha'); // import the mocha web build

export function run(): Promise<void> {

  return new Promise((c, e) => {
    mocha.setup({
      ui: 'tdd',
      reporter: undefined
    });

    // bundles all files in the current directory matching `*.test`
    const importAll = (r: __WebpackModuleApi.RequireContext) => r.keys().forEach(r);
    importAll(require.context('.', true, /\.test$/));

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
      console.error(err);
      e(err);
    }
  });
}
```

要从命令行运行 Web 测试，请将以下内容添加到 `package.json`，并用 `npm test` 运行它。

```json
  "devDependencies": {
    "@vscode/test-web": "*"
  },
  "scripts": {
    "test": "vscode-test-web --extensionDevelopmentPath=. --extensionTestsPath=dist/web/test/suite/index.js"
  }
```

要在一个带有测试数据的文件夹上打开 VS Code，请将本地文件夹路径（`folderPath`）作为最后一个参数传入。

要在 VS Code（Insiders）桌面版中运行（和调试）插件测试，请使用 `Extension Tests in VS Code` 启动配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension Tests in VS Code",
      "type": "extensionHost",
      "debugWebWorkerHost": true,
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionDevelopmentKind=web",
        "--extensionTestsPath=${workspaceFolder}/dist/web/test/suite/index"
      ],
      "outFiles": [
        "${workspaceFolder}/dist/web/**/*.js"
      ],
      "preLaunchTask": "npm: watch-web"
    }
  ]
}
```

## 发布 Web 插件

Web 插件与其他插件一起托管在 [Marketplace](https://marketplace.visualstudio.com/vscode) 上。

请确保使用最新版本的 `vsce` 来发布插件。`vsce` 会将所有 Web 插件标记出来。为此，`vsce` 使用 [Web 插件启用](#web-extension-enablement)一节中列出的规则。

## 将既有插件更新为 Web 插件

### 无代码的插件

没有代码、只有配置点（例如主题、代码片段和基础语言插件）的插件不需要任何修改。它们可以在 Web 插件主机中运行，并可以从扩展视图中安装。

重新发布不是必需的，但在发布新版本的插件时，请确保使用最新版本的 `vsce`。

### 迁移有代码的插件

有源代码（由 `main` 属性定义）的插件需要提供 [Web 插件主文件](#web-extension-main-file)，并在 `package.json` 中设置 `browser` 属性。

使用以下步骤为浏览器环境重新编译插件代码：

* 添加 [webpack 配置](#webpack-configuration)一节所示的 webpack 配置文件。如果你已经有用于 Node.js 插件代码的 webpack 文件，可以为 Web 添加一个新的部分。以 [vscode-css-formatter](https://github.com/aeschli/vscode-css-formatter/blob/master/webpack.config.js) 为例。
* 添加 [测试你的 Web 插件](#test-your-web-extension)一节所示的 `launch.json` 和 `tasks.json` 文件。
* 在 webpack 配置文件中，将输入文件设置为现有的 Node.js 主文件，或为 Web 插件创建一个新的主文件。
* 在 `package.json` 中，添加 [Web 插件的结构](#web-extension-anatomy)一节所示的 `browser` 和 `scripts` 属性。
* 运行 `npm run compile-web` 来调用 webpack，查看让插件在 Web 中运行需要做哪些工作。

为了尽可能多地复用源代码，这里有一些技巧：

* 要对 `path` 等 Node.js 核心模块进行 polyfill，请在 [resolve.fallback](https://webpack.js.org/configuration/resolve/#resolvefallback) 中添加一个条目。
* 要提供 `process` 等 Node.js 全局变量，请使用 [DefinePlugin 插件](https://webpack.js.org/plugins/define-plugin)。
* 使用在浏览器和 node 运行时都能工作的 node 模块。node 模块可以通过同时定义 `browser` 和 `main` 入口点来实现这一点。webpack 会自动使用与其目标匹配的那一个。这样做的 node 模块示例有 [request-light](https://github.com/microsoft/node-request-light) 和 [@vscode/l10n](https://github.com/microsoft/vscode-l10n)。
* 要为 node 模块或源文件提供替代实现，请使用 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias)。
* 将代码分成浏览器部分、Node.js 部分和公共部分。在公共部分中，只使用在浏览器和 Node.js 运行时中都能工作的代码。为在 Node.js 和浏览器中具有不同实现的功能创建抽象。
* 注意 `path`、`URI.file`、`context.extensionPath`、`rootPath`、`uri.fsPath` 的使用。这些在虚拟工作区（非文件系统）中无法工作，因为它们在 VS Code for the Web 中使用。请改用带有 `URI.parse`、`context.extensionUri` 的 URI。[vscode-uri](https://www.npmjs.com/package/vscode-uri) node 模块提供了 `joinPath`、`dirName`、`baseName`、`extName`、`resolvePath`。
* 注意 `fs` 的使用。请改用 vscode 的 `workspace.fs`。

当插件在 Web 中运行时，提供较少的功能是可以接受的。使用 [when 子句上下文](/api/references/when-clause-contexts)来控制哪些命令、视图和任务在 Web 上的虚拟工作区中可用或隐藏。

* 使用 `virtualWorkspace` 上下文变量来了解当前工作区是否是非文件系统工作区。
* 使用 `resourceScheme` 检查当前资源是否是 `file` 资源。
* 如果存在平台 shell，请使用 `shellExecutionSupported`。
* 实现替代的命令处理程序，显示对话框以解释命令为何不适用。

WebWorker 可以用作 fork 进程的替代方案。我们已经将多个语言服务器更新为以 Web 插件形式运行，包括内置的 [JSON](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features)、[CSS](https://github.com/microsoft/vscode/tree/main/extensions/css-language-features) 和 [HTML](https://github.com/microsoft/vscode/tree/main/extensions/html-language-features) 语言服务器。下面的[语言服务器协议](#language-server-protocol-in-web-extensions)一节提供了更多细节。

浏览器运行时环境只支持执行 JavaScript 和 [WebAssembly](https://webassembly.org/)。用其他编程语言编写的库需要交叉编译，例如有工具可以将 [C/C++](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm) 和 [Rust](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm) 编译为 WebAssembly。例如，[vscode-anycode](https://github.com/microsoft/vscode-anycode) 插件使用的 [tree-sitter](https://www.npmjs.com/package/tree-sitter) 就是编译为 WebAssembly 的 C/C++ 代码。

### Web 插件中的语言服务器协议

[vscode-languageserver-node](https://github.com/Microsoft/vscode-languageserver-node) 是[语言服务器协议](https://microsoft.github.io/language-server-protocol)（LSP）的一种实现，用作 [JSON](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features)、[CSS](https://github.com/microsoft/vscode/tree/main/extensions/css-language-features) 和 [HTML](https://github.com/microsoft/vscode/tree/main/extensions/html-language-features) 等语言服务器实现的基础。

自 3.16.0 起，客户端和服务器现在也提供了浏览器实现。服务器可以在 web worker 中运行，连接基于 web worker 的 `postMessage` 协议。

浏览器的客户端可以在 'vscode-languageclient/browser' 中找到：

```typescript
import { LanguageClient } from `vscode-languageclient/browser`
```

服务器在 `vscode-languageserver/browser`。

[lsp-web-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample) 展示了这是如何工作的。

## Web 插件启用

如果满足以下条件，VS Code 会自动将插件视为 Web 插件：

* 插件清单（`package.json`）有 `browser` 入口点。
* 插件清单没有 `main` 入口点，并且没有以下配置点中的任何一个：`localizations`、`debuggers`、`terminal`、`typescriptServerPlugins`。

如果插件想在 Web 插件主机中也提供调试器或终端，则需要定义 `browser` 入口点。


## 使用 ESBuild

如果你想使用 esbuild 而不是 webpack，请执行以下操作：

添加一个 `esbuild.js` 构建脚本：
```js
const esbuild = require('esbuild');
const glob = require('glob');
const path = require('path');
const polyfill = require('@esbuild-plugins/node-globals-polyfill');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/web/extension.ts',
			'src/web/test/suite/extensionTests.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'browser',
		outdir: 'dist/web',
		external: ['vscode'],
		logLevel: 'warning',
		// Node.js global to browser globalThis
		define: {
			global: 'globalThis',
		},

		plugins: [
			polyfill.NodeGlobalsPolyfillPlugin({
				process: true,
				buffer: true,
			}),
			testBundlePlugin,
			esbuildProblemMatcherPlugin, /* add to the end of plugins array */
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

/**
 * For web extension, all tests, including the test runner, need to be bundled into
 * a single module that has a exported `run` function .
 * This plugin bundles implements a virtual file extensionTests.ts that bundles all these together.
 * @type {import('esbuild').Plugin}
 */
const testBundlePlugin = {
	name: 'testBundlePlugin',
	setup(build) {
		build.onResolve({ filter: /[\/\\]extensionTests\.ts$/ }, args => {
			if (args.kind === 'entry-point') {
				return { path: path.resolve(args.path) };
			}
		});
		build.onLoad({ filter: /[\/\\]extensionTests\.ts$/ }, async args => {
			const testsRoot = path.join(__dirname, 'src/web/test/suite');
			const files = await glob.glob('*.test.{ts,tsx}', { cwd: testsRoot, posix: true });
			return {
				contents:
					`export { run } from './mochaTestRunner.ts';` +
					files.map(f => `import('./${f}');`).join(''),
				watchDirs: files.map(f => path.dirname(path.resolve(testsRoot, f))),
				watchFiles: files.map(f => path.resolve(testsRoot, f))
			};
		});
	}
};

/**
 * This plugin hooks into the build process to print errors in a format that the problem matcher in
 * Visual Studio Code can understand.
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
        if (location == null) return;
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

main().catch(e => {
	console.error(e);
	process.exit(1);
});
```

该构建脚本执行以下操作：
- 它使用 esbuild 创建一个构建上下文。该上下文配置为：
  - 将 `src/web/extension.ts` 中的代码打包为单个文件 `dist/web/extension.js`。
  - 将所有测试（包括测试运行器 mocha）打包为单个文件 `dist/web/test/suite/extensionTests.js`。
  - 如果传入了 `--production` 标志，则对代码进行压缩。
  - 除非传入了 `--production` 标志，否则生成 source map。
  - 将 'vscode' 模块排除在打包之外（因为它由 VS Code 运行时提供）。
  - 为 `process` 和 `buffer` 创建 polyfill。
  - 使用 esbuildProblemMatcherPlugin 插件报告阻止打包器完成的错误。该插件以 `esbuild` 问题匹配器能够检测的格式输出错误，该匹配器也需要作为插件安装。
  - 使用 testBundlePlugin 实现一个测试主文件（`extensionTests.js`），它引用所有测试文件和 mocha 测试运行器 `mochaTestRunner.js`。
- 如果传入了 `--watch` 标志，它会开始监视源文件的变化，并在检测到变化时重新构建打包。

esbuild 可以直接处理 TypeScript 文件。不过，esbuild 只是剥离所有类型声明，而不做任何类型检查。
只有语法错误会被报告，并可能导致 esbuild 失败。

因此，我们单独运行 TypeScript 编译器（`tsc`）来检查类型，但不生成任何代码（`--noEmit` 标志）。

`package.json` 中的 `scripts` 部分现在看起来像这样：
```json
  "scripts": {
    "vscode:prepublish": "npm run package-web",
    "compile-web": "npm run check-types && node esbuild.js",
    "watch-web": "npm-run-all -p watch-web:*",
    "watch-web:esbuild": "node esbuild.js --watch",
    "watch-web:tsc": "tsc --noEmit --watch --project tsconfig.json",
    "package-web": "npm run check-types && node esbuild.js --production",
    "check-types": "tsc --noEmit",
    "pretest": "npm run compile-web",
    "test": "vscode-test-web --browserType=chromium --extensionDevelopmentPath=. --extensionTestsPath=dist/web/test/suite/extensionTests.js",
    "run-in-browser": "vscode-test-web --browserType=chromium --extensionDevelopmentPath=. ."
  }
```

`npm-run-all` 是一个 node 模块，可以并行运行名称匹配给定前缀的脚本。对我们来说，它运行 `watch-web:esbuild` 和 `watch-web:tsc` 脚本。你需要将 `npm-run-all` 添加到 `package.json` 的 `devDependencies` 部分。

下面的 `tasks.json` 文件为每个监视任务提供了独立的终端：
```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "watch-web",
			"dependsOn": [
				"npm: watch-web:tsc",
				"npm: watch-web:esbuild"
			],
			"presentation": {
				"reveal": "never"
			},
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"runOptions": {
				"runOn": "folderOpen"
			}
		},
		{
			"type": "npm",
			"script": "watch-web:esbuild",
			"group": "build",
			"problemMatcher": "$esbuild-watch",
			"isBackground": true,
			"label": "npm: watch-web:esbuild",
			"presentation": {
				"group": "watch",
				"reveal": "never"
			}
		},
		{
			"type": "npm",
			"script": "watch-web:tsc",
			"group": "build",
			"problemMatcher": "$tsc-watch",
			"isBackground": true,
			"label": "npm: watch-web:tsc",
			"presentation": {
				"group": "watch",
				"reveal": "never"
			}
		},
		{
			"label": "compile",
			"type": "npm",
			"script": "compile-web",
			"problemMatcher": [
				"$tsc",
				"$esbuild"
			]
		}
	]
}
```

这是 esbuild 构建脚本中引用的 `mochaTestRunner.js`：
```ts
// Imports mocha for the browser, defining the `mocha` global.
import 'mocha/mocha';

mocha.setup({
	ui: 'tdd',
	reporter: undefined
});

export function run(): Promise<void> {

	return new Promise((c, e) => {
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
			console.error(err);
			e(err);
		}
	});
}
```

## 示例

* [helloworld-web-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-web-sample)
* [lsp-web-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample)
