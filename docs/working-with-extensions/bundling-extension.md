# 打包插件

打包你的 Visual Studio Code 插件的首要原因是确保它在任何平台上使用 VS Code 的所有用户都能正常工作。只有打包过的插件才能用于 [github.dev](https://github.dev/) 和 [vscode.dev](https://vscode.dev/) 等 VS Code for Web 环境。当 VS Code 在浏览器中运行时，它只能为你的插件加载一个文件，因此插件代码需要打包成单个适合 Web 的 JavaScript 文件。这也适用于[笔记本输出渲染器](/api/extension-guides/notebook#notebook-renderer)，VS Code 也只会为你的渲染器插件加载一个文件。

此外，插件的体积和复杂度会迅速增长。它们可能由多个源文件编写，并依赖 [npm](https://www.npmjs.com) 中的模块。分解和复用是开发的最佳实践，但在安装和运行插件时会带来成本。加载 100 个小文件比加载一个大的文件慢得多。这就是我们推荐打包的原因。打包是将多个小源文件合并为单个文件的过程。

对于 JavaScript，有各种不同的打包器可用。流行的有 [rollup.js](https://rollupjs.org)、[Parcel](https://parceljs.org)、[esbuild](https://esbuild.github.io/) 和 [webpack](https://webpack.js.org/)。


## 使用 esbuild

`esbuild` 是一个快速且配置简单的 JavaScript 打包器。要获取 esbuild，打开终端并输入：

```bash
npm i --save-dev esbuild
```

### 运行 esbuild

你可以从命令行运行 esbuild，但为了减少重复并启用问题报告，使用一个构建脚本 `esbuild.js` 会很有帮助：

```js
const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'warning',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
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
	}
};

main().catch(e => {
	console.error(e);
	process.exit(1);
});
```

该构建脚本执行以下操作：
- 它使用 esbuild 创建一个构建上下文。该上下文配置为：
  - 将 `src/extension.ts` 中的代码打包为单个文件 `dist/extension.js`。
  - 如果传入了 `--production` 标志，则对代码进行压缩。
  - 除非传入了 `--production` 标志，否则生成 source map。
  - 将 'vscode' 模块排除在打包之外（因为它由 VS Code 运行时提供）。
- 使用 esbuildProblemMatcherPlugin 插件报告阻止打包器完成的错误。该插件以 `esbuild` 问题匹配器能够检测的格式输出错误，该匹配器也需要作为插件安装。
- 如果传入了 `--watch` 标志，它会开始监视源文件的变化，并在检测到变化时重新构建打包。

esbuild 可以直接处理 TypeScript 文件。不过，esbuild 只是剥离所有类型声明，而不做任何类型检查。
只有语法错误会被报告，并可能导致 esbuild 失败。

因此，我们单独运行 TypeScript 编译器（`tsc`）来检查类型，但不生成任何代码（`--noEmit` 标志）。

`package.json` 中的 `scripts` 部分现在看起来像这样：

```json
"scripts": {
    "compile": "npm run check-types && node esbuild.js",
    "check-types": "tsc --noEmit",
    "watch": "npm-run-all -p watch:*",
    "watch:esbuild": "node esbuild.js --watch",
    "watch:tsc": "tsc --noEmit --watch --project tsconfig.json",
    "vscode:prepublish": "npm run package",
    "package": "npm run check-types && node esbuild.js --production"
}
```

`npm-run-all` 是一个 node 模块，可以并行运行名称匹配给定前缀的脚本。对我们来说，它运行 `watch:esbuild` 和 `watch:tsc` 脚本。你需要将 `npm-run-all` 添加到 `package.json` 的 `devDependencies` 部分。

`compile` 和 `watch` 脚本用于开发，它们会生成带 source map 的打包文件。`package` 脚本由 `vscode:prepublish` 脚本使用，该脚本由 `vsce`（VS Code 的打包和发布工具）使用，并在发布插件之前运行。向 esbuild 脚本传入 `--production` 标志会使其压缩代码并生成较小的打包文件，但也会让调试变得困难，因此在开发期间会使用其他标志。要运行上述脚本，请打开终端并输入 `npm run watch`，或者从命令面板（`kb(workbench.action.showCommands)`）中选择 **Tasks: Run Task**。

如果你按以下方式配置 `.vscode/tasks.json`，你将为每个监视任务获得一个独立的终端。
```json
{
	"version": "2.0.0",
	"tasks": [
		{
            "label": "watch",
            "dependsOn": [
                "npm: watch:tsc",
                "npm: watch:esbuild"
            ],
            "presentation": {
                "reveal": "never"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        },
        {
            "type": "npm",
            "script": "watch:esbuild",
            "group": "build",
            "problemMatcher": "$esbuild-watch",
            "isBackground": true,
            "label": "npm: watch:esbuild",
            "presentation": {
                "group": "watch",
                "reveal": "never"
            }
        },
		{
            "type": "npm",
            "script": "watch:tsc",
            "group": "build",
            "problemMatcher": "$tsc-watch",
            "isBackground": true,
            "label": "npm: watch:tsc",
            "presentation": {
                "group": "watch",
                "reveal": "never"
            }
        }
    ]
}
```

这些监视任务依赖插件 [`connor4312.esbuild-problem-matchers`](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers) 进行问题匹配，你需要安装它，任务才能在问题视图中报告问题。要完成启动，必须安装这个插件。

为了不忘这一点，请在工作区中添加一个 `.vscode/extensions.json` 文件：

```json
{
  "recommendations": ["connor4312.esbuild-problem-matchers"]
}
```

最后，你会想要更新 `.vscodeignore` 文件，以便编译后的文件包含在发布的插件中。更多细节请参阅[发布](#publishing)一节。

跳转到[测试](#tests)一节继续阅读。

## 使用 webpack

webpack 这个开发工具可以在[npm](https://www.npmjs.com/)里找到，为了获取 webpack 和它的命令行界面，打开终端然后输入：

```bash
npm i --save-dev webpack webpack-cli
```

这行命令会先安装 webpack，然后更新你插件里的`package.json`中的`devDependencies`字段。Webpack 是一个 Javascrip 打包工具，但是大部分 VS Code 插件是用 Typescript 写的，所以你需要在 webpack 中配置`ts-loader`，它才能正确编译 Typescript。安装`ts-loader`：

```bash
npm i --save-dev ts-loader
```

本例的所有文件都可在 [webpack-extension](https://github.com/microsoft/vscode-extension-samples/blob/main/webpack-sample) 中找到

### 配置 webpack

既然所有的工具都安装好了，我们现在可以开始配置 webpack 了。通常来说，你的项目目录中需要创建一个`webpack.config.js`文件，webpack 才能知道按什么规则打包你的插件。下面的配置示例是 VS Code 插件专用的，让我们来开这个头吧：

```javascript
//@ts-check

'use strict';

const path = require('path');
const webpack = require('webpack');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'webworker', // vscode extensions run in webworker context for VS Code web 📖 -> https://webpack.js.org/configuration/target/#target

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
    extensions: ['.ts', '.js'],
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
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
  }
};
module.exports = config;
```

这份文件是[webpack-extension](https://github.com/Microsoft/vscode-extension-samples/blob/master/webpack-sample)中的[一部分](https://github.com/Microsoft/vscode-extension-samples/blob/master/webpack-sample/webpack.config.js)。webpack 配置最后输出的就是 JS 对象。

在上面的例子里，我们定义了如下内容：

- `traget`：'node'，因为我们的插件运行在 Node.js 环境中。
- `entry`：webpack 使用的入口文件。这就像是`package.json`中的`main`属性，有点不一样的是你还需要给 webpack 提供"source"—— 一般就是`src/extension.ts`，小心不要配置在"output"里了。webpack 可以解析 Typescript，所以我们不需要再单独执行 Typescript 编译了。
- `output`配置告诉 webpack 应该把打包好的文件放在哪里，一般而言我们会放在`dist`文件夹里。在这个例子里，webpack 最后会产生一个`dist/extension.js`文件。
- 在`resolve`和`module/rules`中配置 Typescript 和 Javascript 的解析器。
- `externals`即排除配置，在这里可以配置打包文件不应包含的文件和模块。`vscode`不需要被打包是因为它并不储存在磁盘上，它是 VS Code 热更新生成的临时文件夹。根据插件依赖的具体 node 模块，你可能需要通过这个配置优化打包文件。

### 运行 webpack

`webpack.config.js`文件创建好之后，webpack 就可以正式开始工作了。你可以从命令行中运行 webpack，不过为了避免重复工作用 npm script 会更有效率。

将下列脚本复制到`package.json`的`scripts`中去：

```json
"scripts": {
    "compile": "webpack --mode development",
    "watch": "webpack --mode development --watch",
    "vscode:prepublish": "npm run package",
    "package": "webpack --mode production --devtool hidden-source-map",
},
```

`compile`和`watch`脚本是开发时使用的，它们会产生构建文件。`vscode:prepublish`是`vsce`使用的，`vsce`是 VS Code 的打包和发布工具，你需要在发布插件之前运行这个命令。webpack 中的[mode](https://webpack.js.org/concepts/mode/)是控制优化级别的配置项，如果你使用`production`字段，那么就会打包出最小的构建文件，但是也会耗费更多时间，所以我们开发中使用`none`。想要运行上述脚本，我们可以打开终端（命令行）输入`npm run compile`或者从*命令面板*（<kbd>Ctrl+Shift+P</kbd>）中使用**运行任务**来开始。

## 运行插件

运行插件之前，你需要将`package.json`中的`main`属性指向到构建文件上，也就是我们上面提到的[`"./dist/extension"`](https://github.com/Microsoft/vscode-references-view/blob/d649d01d369e338bbe70c86e03f28269cbf87027/package.json#L26)，改好之后我们就可以运行和测试插件了。

## 测试

插件作者经常为插件源代码编写单元测试。在正确的架构分层下（插件源代码不依赖测试），webpack 和 esbuild 生成的打包文件不应包含任何测试代码。要运行单元测试，只需进行简单的编译即可。

将这些条目合并到 `package.json` 的 `scripts` 部分：

```json
"scripts": {
    "compile-tests": "tsc -p . --outDir out",
    "pretest": "npm run compile-tests",
    "test": "vscode-test"
}
```


`compile-tests` 脚本使用 TypeScript 编译器将插件编译到 `out` 文件夹。有了这些中间的 JavaScript，下面这段 `launch.json` 配置就足以运行测试。

```json
{
    "name": "Extension Tests",
    "type": "extensionHost",
    "request": "launch",
    "runtimeExecutable": "${execPath}",
    "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test"
    ],
    "outFiles": [
        "${workspaceFolder}/out/test/**/*.js"
    ],
    "preLaunchTask": "npm: compile-tests"
}
```

这种运行测试的配置与未打包的插件相同。没有理由打包单元测试，因为它们不属于插件已发布部分。

## 发布

发布前你需要更新`.vscodeignore`文件。现在所有东西都打包到了`dist/extension.js`文件中，所以应该排除这个文件还有`out`文件夹（怕你漏了，特此提醒），以及最重要的`node_modules`文件夹。

一般来说，`.vsignore`文件应该是这样的：

```bash
.vscode
node_modules
out/
src/
tsconfig.json
webpack.config.js
esbuild.js
```

## 迁移插件

用 webpack 迁移现有的插件是很容易的，整个过程就像我们上面的指南一样。真实的例子如 VS Code 的 References 视图就是从这个[pull request](https://github.com/Microsoft/vscode-references-view/pull/50)应用了 webpack 而来的。

在里面，你可以看到：

- 根据情况添加 `esbuild`。`devDependencies`中添加`webpack`，`webpack-cli`和`ts-loader`
- 更新 npm 脚本以便开发时使用上述打包器
- 更新任务配置`tasks.json`
- 添加和修改`esbuild.js` 或 `webpack.config.js`
- 更新`.vscodeignore`排除`node_modules`和其他开发时产生的临时文件
- 开始享受体积更小、安装更快的插件！

## 疑难解答

#### 压缩

使用`production`模式会执行代码压缩，它会去除源代码中的空格和注释，并把变量名和函数名进行替换——混淆和压缩。不过形如`Function.prototype.name`的代码不会压缩。

#### webpack critical dependencies

当你运行 webpack 时，你可能会碰到像**Critical dependencies: the request of a dependency is an expression**字样的警告。这些警告必须立即处理，一般来说会影响到打包过程。这句话意味着 webpack 不能静态分析某些依赖，一般是由动态使用`require`导致的，比如`require(someDynamicVariable)`。

想要处理这类警告，你需要：

- 将需要打包的部分变成静态的依赖。
- 通过`externals`排除这部分依赖，但是注意它们的 Javascript 文件还是应该保留在我们打包的插件里，在`.vscodeignore`中使用 glob 模式，比如`!node_modules/mySpecialModule`。

## 下一步

- [插件市场](https://code.visualstudio.com/docs/editor/extension-gallery) - 学习更多 VS Code 插件市场的有关内容。
- [测试插件](/working-with-extensions/testing-extension) - 测试插件，提高项目质量。
- [持续集成](/working-with-extensions/continuous-integration) - 使用 Azure Pipeline 运行插件的 CI 构建。
