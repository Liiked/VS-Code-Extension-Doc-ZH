# Web 插件

VS Code 能以编辑器的形式运行于浏览器中。举个例子：如果你在 Github 上浏览仓库或者 PR 时，可按下 `.` 键 (句号) 打开 `github.dev` 的用户界面。当 VS Code 在 Web 中运行时，已安装的插件会在浏览器启动一个名为 'web extension host' 的插件宿主中运行。可在 web 插件宿主中运行的插件，被称之为“Web 插件”。

Web 插件的项目结构和普通的插件一样，但它们的运行时不同，不要以 Node.js 运行时的插件模式运行同样的代码。Web 插件依然可以访问完整的 VS Code API，除了 Node.js API 和模块加载。Web 插件严格运行于浏览器沙箱中，因此它和普通的插件相比有一些[限制]()。

Web 插件的运行时也同样支持 VS Code 桌面版本。如果你打算启动一个 Web 插件，这个插件可以支持 [VS Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) (包含 `vscode.dev` 和 `github.dev`) 、桌面端还有像 [GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces) 服务。

## Web 插件解析

Web 插件的文件目录结构就像[常规插件]()一样。插件清单(`package.json`)定义了插件源代码入口和插件配置点。

对Web 插件来说，`browser` 字段是定义主入口文件的地方，而不是像普通插件那样定义在 `main` 属性中。

`contributes` 的运作方式和常规插件一样。

下面是一个简单的 hello world 插件例子的 `package.json`。它运行只能在 Web 插件宿主中运行（因为它只有 `browser` 入口）。

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
    "package-web": "webpack --mode production --devtool hidden-source-map"
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

:::
注意：如果你的插件要支持低于 1.74 版本，那你需要显式地在 `activationEvents` 中声明 `onCommand:helloworld-web-sample.helloWorld`
:::

仅配置了 `main` 入口，而没有 `browser` 的就不是 Web 插件。这类插件会被 Web 插件忽略，而且在 **插件** 视图中也是不可用的。

![Extensions view](https://code.visualstudio.com/assets/api/extension-guides/web-extensions/extensions-view-item-disabled.png)

插件只声明了发布内容配置点（仅声明 `contributes`，没有声明 `main` 或 `browser`）的也是 Web 插件。插件作者无需修改此类插件，它们也可以运行在 [VS Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web)。这类声明式的插件包含主题、语法高亮和代码片段。

插件可以同时包含 `browser` 和 `main` 入口，这样就可以同时运行于浏览器和 Node.js 运行时中。[将当前插件更新为 Web 插件](#将当前插件更新为-web-插件) 小节中介绍了如何让插件同时兼容两种运行时。

[支持 Web 插件](#支持-web-插件)小节中列出了一个插件是否支持在 Web 插件宿主中加载的基本规则。

### Web 插件的主入口文件

`browser` 字段定义了Web 插件的主入口文件。这个脚本会运行在[浏览器 工作线程](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 环境的 Web 插件宿主中。受限于浏览器工作线程沙箱，它与普通插件有下列不同：

- 无法引用或加载（import / require）其他模块。`importScripts` 也不可用。所以，代码必须要打包成一个文件才行。
- 可以通过 `require('vscode')` 形式加载 [VS Code API](https://code.visualstudio.com/api/references/vscode-api)。可以这么做的原因是我们做了 `require` 的支持，但这个能力无法用于加载其他插件文件或者 node 模块。它只能支持 `require('vscode')`。
- 

## 开发 Web 插件

多亏像 Typescript 和 webpack 这样的工具，大部分浏览器运行时限制都被隐藏了，并且能让你开发普通插件一样开发 Web 插件。普通插件和 Web 插件可以从同样的源码中编译出来。

比如由 `yo code` [生成器](https://www.npmjs.com/package/generator-code)创建的 `Hello Web Extension` 项目只有编译脚本有所不同。运行和调试这个插件，和普通 Node.js 插件是一样的。使用 **Debug: Select and Start Debugging** 命令创建 `launch.json` 这样的启动配置启动即可。

## 创建 Web 插件

想要快速生成全新的 Web 插件，你可以使用 `yo code` 然后选择 **New Web Extension** 即可。但必须确保安装了最新的 [generator-code](https://www.npmjs.com/package/generator-code)(>= generator-code@1.6)。如果你不知道怎么升级，可以运行 `npm i -g yo generator-code`。

生成的项目中包含了插件的源码（显示 hello world 通知的命令）、`package.json` 文件和一个 webpack 配置文件。
  - `src/web/extension.ts` 插件入口源码。和普通的 hello 插件是一样的。 
  - `package.json` 插件清单
    - 用 `browser` 属性指定入口文件
    - 用于提供运行命令：`compile-web`、`watch-web` 和 `package-web` 分别用于编译、监听变动、打包
  - `webpack.config.js` webpack 的配置文件，用于将插件的所有源文件打包为一个文件
  - `.vscode/launch.json` 启动配置文件。用于在 VS Code 桌面版的 Web 插件宿主中运行、测试 Web 插件
  - `.vscode/task.json` 启动配置中所需的构建任务。用 `npm run watch-web` 启动，还依赖 webpack 中的 `ts-webpack-watch` 中的 问题捕捉器(problem matcher)。
  - `.vscode/extensions.json` 包含插件所需的 问题捕捉器(problem matcher)。这里面的插件需要先安装好，才能加载配置启动插件。
  - `tsconfig.json` 定义和编译 `webworker` 运行时所需的代码

[helloworld-web-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-web-sample) 中的源码和生成器生成的代码几乎没有差别。

### Webpack 配置

`yo code` 会自动生成 webpack 配置文件。它会把你的源码打包为一个单一的 Javascript 代码，最后在 Web 插件宿主中加载这个文件。

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
    extension: './src/web/extension.ts', // source of the web extension main file
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
      assert: require.resolve('assert')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser' // provide a shim for the global `process` variable
    })
  ],
  externals: {
    vscode: 'commonjs vscode' // ignored because it doesn't exist
  },
  performance: {
    hints: false
  },
  devtool: 'nosources-source-map' // create a source map that points to the original source file
};
module.exports = [webExtensionConfig];
```

`webpack.config.js` 较为重要的字段有：

- `entry` 包含了指向你插件代码和测试套件的主入口。
- `output` 编译后的文件所在目录
- `target` 编译后的 Javascript 文件最后会在哪种类型的环境中运行。对于 Web 插件 来说，我们希望这个字段是 `webworker`
- `resolve` 这个字段包含了 *别名*，以及我们不想在浏览器中运行的 *node 库降级处理* 
  - 如果你用了像 `path` 这样的包，你可以这在告诉 webpack 该怎么解析 `path`。比如，你可以通过 `path: path.resolve(__dirname, 'src/my-path-implementation-for-web.js')` 指向项目中的文件。或者你可以使用支持 浏览器 的 node 库——`path-browserify`，然后配置`path: require.resolve('path-browserify')`。
  - 查看 [webpack resolve.fallback](https://webpack.js.org/configuration/resolve/#resolvefallback) 中为 Node.js 核心模块的 polyfill。
- `plugins` 部分使用了 [DefinePlugin plugin](https://webpack.js.org/plugins/define-plugin/) 来处理全局变量——比如 Node.js 中的全局变量 `process`



## 测试你的 Web 插件

目前一共有3中方法测试 Web 插件。
- 以 `--extensionDevelopmentKind=web` 模式启动桌面版 VS Code，然后运行你的插件。
- 在 Web 版 VS Code 中安装 [@vscode/test-web](https://github.com/microsoft/vscode-test-web) 包以及你的插件，它会以本地服务器形式启动。
- 在 [vscode.dev](https://vscode.dev/) 中 [旁加载](#测试-web-插件) 你的插件，进行真实环境测试。

### 通过桌面版 VS Code 测试

VS Code 桌面版会运行一个 Web 插件宿主和常规的 Node.js 插件宿主。

`New Web Extension` 生成器中提供了 `pwa-extensionhost` 加载配置：

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
      "outFiles": ["${workspaceFolder}/dist/web/**/*.js"],
      "preLaunchTask": "npm: watch-web"
    }
  ]
}
```

该项目使用 `npm: watch-web` 任务编译插件，该任务会运行 `npm run watch-web`。该`tasks.json` 是这样的：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "watch-web",
      "group": "build",
      "isBackground": true,
      "problemMatcher": ["$ts-webpack-watch"]
    }
  ]
}
```

`$ts-webpack-watch` 是一个问题捕捉器(problem matcher)，它可以解析 webpack 输出的内容。这个解析器由 [TypeScript + Webpack Problem Matchers](https://marketplace.visualstudio.com/items?itemName=eamodio.tsl-problem-matcher) 插件提供能力支持。

在启动的 **插件开发宿主** 中，Web 插件在 Web 插件宿主中可以找到。运行 `Hello World` 命令激活插件。

打开 **运行中的插件** 视图（命令：**Developer: Show Running Extensions**）查看哪些插件运行在 Web 插件宿主中。

### 通过 @vscode/test-web 在浏览器中测试

[@vscode/test-web](https://github.com/microsoft/vscode-test-web) node 包提供了一个 CLI 和一些API 供你在浏览器中测试 Web 插件。

这个 node 包提供了一个 npm 可执行命令 `vscode-test-web`，它可以从命令行中打开 VS Code 网页版：
- 这个命令会下载 VS Code 网页版部分代码到 `.vscode-test-web` 目录中
- 然后在本地服务 `localhost:3000` 上启动
- 最后会打开浏览器 (Chromium, Firefox, 或Webkit)。

你可以这样从命令行运行：
```bash
npx @vscode/test-web --extensionDevelopmentPath=$extensionFolderPath $testDataPath
```

或者把 `@vscode/test-web` 作为开发依赖，然后从脚本中调用会更好：

```json
"devDependencies": {
  "@vscode/test-web": "*"
},
"scripts": {
  "open-in-browser": "vscode-test-web --extensionDevelopmentPath=. ."
}
```

在 [@vscode/test-web README](https://www.npmjs.com/package/@vscode/test-web) 中查看更多 CLI 选项：

| 选项                       | 参数说明                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| --browserType              | 所要启动的浏览器： `chromium`(默认), `firefox`或`webkit`                                                                                                                                         |
| --extensionDevelopmentPath | 开发中的插件目录                                                                                                                                                                                 |
| --extensionTestsPath       | 测试目录                                                                                                                                                                                         |
| --permission               | 对浏览器进行功能授权。比如：`clipboard-read`, `clipboard-write`。参阅 [完整选项列表](https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions)。该参数可重复使用。 |
| --folder-uri               | VS Code 所要打开的工作区 URI 地址。如果使用了 `folderPath`，则忽略该配置                                                                                                                         |
| --extensionPath            | 需要添加的其他插件地址。该参数可重复使用。                                                                                                                                                       |
| folderPath                 | 从何处打开 VS Code。文件夹中的内容会以虚拟文件系统模式打开。                                                                                                                                     |

VS Code Web 版的少量代码会下载到文件夹 `.vscode-test-web`，你可以通过 `.gitignore` 来忽略它。

### 通过 vscode.dev

在你最终将插件发布到 VS Code 网页版之前，你可以通过 [vscode.dev](https://vscode.dev/) 环境验证插件的行为。

要看到插件运行在 vscode.dev 上的效果，你首先需要从本机上启动服务来下载 vscode.dev，然后运行它。

在你的插件目录中，通过 `npx serve --cors -l 5000` 启动 HTTP 服务：

```bash
$ npx serve --cors -l 5000
npx: installed 78 in 2.196s

   ┌───────────────────────────────────────────────────┐
   │                                                   │
   │   Serving!                                        │
   │                                                   │
   │   - Local:            http://localhost:5000       │
   │   - On Your Network:  http://172.19.255.26:5000   │
   │                                                   │
   │   Copied local address to clipboard!              │
   │                                                   │
   └───────────────────────────────────────────────────┘
```
然后打开另一个终端，运行 `npx localtunnel -p 5000`:

```bash
$ npx localtunnel -p 5000
npx: installed 22 in 1.048s
your url is: https://hungry-mole-48.loca.lt/
```

**关键步骤：** 然后点击生成的链接（本例为：`https://hungry-mole-48.loca.lt/`），接着选择 **Click to Continue**
![localtunnel](https://code.visualstudio.com/assets/api/extension-guides/web-extensions/localtunnel.png)

最后，打开 [vscode.dev](https://vscode.dev/)，从命令面板(<kbd>Ctrl+Shift+P</kbd>)中执行 **Developer: Install Web Extension...**，然后把上一个步骤获得的 URL 粘贴进去。在本例中是 `https://hungry-mole-48.loca.lt/`，然后选择 **安装**。

**检查日志**

你能在浏览器的开发者工具查看错误、运行状态和你的插件日志。

你也可能会看到很多 vscode.dev 自身的日志。另外，在浏览器开发者工具中，你无法简单地设置断点或查看源码。这些限制可能会让人觉得在 vscode.dev 中调试的体验不太好，所以我们更推荐先使用前两种方法，最后再用 vscode.dev 的旁加载模式调试。旁加载模式是发布插件前的最终全面检查。

## Web 插件自动化测试

像普通插件自动化测试一样，Web 插件也支持测试套件。在 [测试插件]() 章节中介绍了基本插件测试结构。

[@vscode/test-web](https://github.com/microsoft/vscode-test-web) node 包等价于 [@vscode/test-electron](https://github.com/microsoft/vscode-test) (之前叫 `vscode-test`)。有了它之后，你就可以从命令行运行基于 Chromium、Firefox和Safari的测试了。

这个工具的执行步骤如下：
1. 启动本地页面服务，依此打开 VS Code 网页版
2. 打开选定的浏览器
3. 运行测试脚本

你可以在持续集成中运行这些测试脚本，以便确保插件能在所有浏览器中运行。

测试脚本运行在 Web 插件宿主中，它的运行时限制和 [Web 插件主入口文件](#web-插件的主入口文件) 定义的一样：

- 所有文件会打包到一个文件中。项目应该包含测试工具 (如：Mocha) 和所有的测试套件 (一般是 `*.test.ts`)。
- 只支持 `require('vscode')`

由 `yo code` 创建的项目中，[webpack 配置文件](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/webpack.config.js) 包含了测试套件的部分。项目会运行位于 `./src/web/test/suite/index.ts` 的测试入口文件。同时，[测试入口脚本](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/src/web/test/suite/index.ts)使用了网页版的 Mocha，还囊括导入所有测试脚本的 webpack 语法。

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

将下列配置添加到你的 `package.json` 中去，然后运行 `npm test`

```json
"devDependencies": {
  "@vscode/test-web": "*"
},
"scripts": {
  "test": "vscode-test-web --extensionDevelopmentPath=. --extensionTestsPath=dist/web/test/suite/index.js"
}
```

如果需要 VS Code 打开时默认加载测试数据，将本地文件夹目录（`folderPath`）放在参数末位。

如果需要让插件运行/调试在 VS Code（Insiders） 桌面版中，使用 `Extension Tests in VS Code` 的启动配置(launch 配置)。

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
      "outFiles": ["${workspaceFolder}/dist/web/**/*.js"],
      "preLaunchTask": "npm: watch-web"
    }
  ]
}
```

## 发布 Web 插件

Web 插件和其他插件一样都在 [插件市场](https://marketplace.visualstudio.com/vscode) 上。

确保你已经使用了最新版本的 `vsce` 来发布你的插件。`vsce` 会对Web 插件打上标记，相应的标记规则可在 [启用 Web 插件](#启用-web-插件)中查看。

## 将当前插件更新为 Web 插件

### 无需编写代码的插件

只使用了配置项且没有任何代码的插件（比如：主题、代码片段和基础语言插件）无需任何修改就可以支持Web 插件。它们可以运行于 Web 插件宿主环境中，而且可以从 *插件* 视图中进行安装。

无需为此重新发布插件，不过如果你要发布此插件的新版本时，请更新 `vsce` 到最新版本。

### 迁移含代码的插件

含有源代码的插件（定义了 `main` 属性的）需要提供 [Web 插件的主入口文件](#web-插件的主入口文件)并且将 `package.json` 中的 `browser` 设置好。

遵循以下步骤将你的插件重新编译打包：

- 添加一个和 [webpack 配置](#webpack-配置) 一节中一样的 webpack 配置文件。如果你已经有 webpack 文件了，你可以再添加一个 web 版本的新配置。你可以参考 [vscode-css-formatter](https://github.com/aeschli/vscode-css-formatter/blob/master/webpack.config.js) 这个例子。
- 在 webpack 配置文件中，将入口 (input) 文件设置为原先的 Node.js 主入口文件或为 web 版新建一个入口文件。
- 将 `package.json` 中的 `browser` 和 `scripts` 进行设置，你可以参考 [Web 插件](#web-插件解析) 一节。
- 运行 `npm run compile-web` 唤起 webpack，然后看看还需要做些什么（比如处理报错）。

为了尽可能重用原来的代码，你可以参考下列技巧：

- 将原先的 Node.js 如 `path` 这样的核心模块进行 polyfill，再添加一个 [resolve.fallback](https://webpack.js.org/configuration/resolve/#resolvefallback) 的入口。
- 使用 [DefinePlugin 插件](https://webpack.js.org/plugins/define-plugin) 提供 Node.js 中的全局环境变量，如 `process`。
- 使用可同时运行在浏览器和 node 运行时的 node 包。这类 Node 包会同时定义`package.json`中的 `browser` 和 `main` 入口。webpack 会自动使用符合构建目标的入口文件。这类 node 包的例子如 [node-request-light](https://github.com/microsoft/node-request-light) 和 [vscode-nls](https://github.com/Microsoft/vscode-nls)。
- 使用 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias) 提供原文件或 node 包的其他实现。
- 将你原来的代码再抽象出浏览器部分、Node 部分和公用部分。大部分情况下，都使用可同时运行在两端的代码。只在两端完全不同的实现上创建独立的抽象。
- 检查使用 `path`、`URI.file`、`context.extensionPath`、`rootPath`、`uri.fsPath`的地方。这些API无法在Web版 VS Code 中的虚拟工作区(非实体文件系统)中运行。在需要 URI 的地方请使用 `URI.parse`、`context.extensionUri`。[vscode-uri](https://www.npmjs.com/package/vscode-uri) 包也提供了`joinPath`、`dirName`、`baseName`、`extName`、`resolvePath` 等API。
- 检查使用 `fs` 的地方。将其替换为 `workspace.fs`。

当你的插件运行在 web 中时，减少插件可用的功能也是可以的。使用 *when 子句* 控制哪些命令、视图和任务等是可用的。

- 使用 `virtualWorkspace` 环境变量查看当前工作区是否是一个非实体文件系统工作区
- 使用 `resourceScheme` 当前的资源是否是 `file` 类型资源
- 使用 `shellExecutionSupported` 检测 shell 是否可用
- 某些命令不可用时展示对话框，并解释为什么该命令不可用

Web Worker 技术可用于创建进程的替代品。我们已经更新了几个语言服务器以 Web 插件的形式运行，如内置的JSON、CSS和HTML语言服务器。下面的 [语言服务器协议](#web-插件中的语言服务器协议) 中有具体信息。

浏览器的运行时环境仅支持执行 Javascript 和 [WebAssembly](https://webassembly.org/)。由其他语言编写的库需要进行跨平台编译，比如将 [C/C++](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm) 和 [Rust](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm) 编译到 WebAssembly。[vscode-anycode](https://github.com/microsoft/vscode-anycode) 使用了 [tree-sitter](https://www.npmjs.com/package/tree-sitter) 这个包，这个包就把 C/C++ 代码编译为了 WebAssembly。

### Web 插件中的语言服务器协议

[vscode-languageserver-node](https://github.com/Microsoft/vscode-languageserver-node) 是 [语言服务器协议(LSP)](https://microsoft.github.io/language-server-protocol) 的一种实现，它也是内置 [JSON](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features)、[CSS](https://github.com/microsoft/vscode/tree/main/extensions/css-language-features)、[HTML](https://github.com/microsoft/vscode/tree/main/extensions/html-language-features) 的底层语言服务器实现。

从 3.16.0 版本开始，我们也提供了浏览器版本的客户端和服务端实现。服务端会以 web worker 的形式运行，并通过 `postMessage` 与主进程连接。

浏览器的客户端可在 `'vscode-languageclient/browser'` 中找到：

```typescript
import { LanguageClient } from `vscode-languageclient/browser`;
```
服务端也在 `vscode-languageserver/browser`。

[lsp-web-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample) 给出了这种用法。

## 启用为 Web 插件

如果符合以下条件，VS Code 会自动将插件视为 Web 插件：

- 插件清单(`package.json`) 包含 `browser` 入口
- 插件清单没有 `main` 文件入口，也不包含这些配置：`localizations`，`debuggers`，`terminal`，`typescriptServerPlugins`。

如果插件需要提供可在浏览器环境中使用的调试器或者终端，那么还是要定义 `browser` 入口的。

## 示例

- [helloworld-web-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-web-sample)
- [lsp-web-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample)
