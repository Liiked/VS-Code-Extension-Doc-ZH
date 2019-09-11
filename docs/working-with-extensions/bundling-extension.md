# 打包插件

VS Code 插件体积常常随着更新越来越大，它会产生很多文件，而且还依赖各种[npm](https://www.npmjs.com/)包。
程序开发的最佳实践是抽象和重用，但过度拆分和庞大的代码结构产生的代价就是更大的插件体积和更慢的运行效率。加载 100 个小文件远比加载一个大文件来的慢，这就是我们更推荐打包插件的原因。
*打包*是将多个小的源文件打包成单个入口文件的过程。

对于 Javascript 而言，可选的构建工具非常多，比较流行的如[rollup.js](https://rollupjs.org/)，[parcel](https://parceljs.org/)和[webpack](https://webpack.js.org/)。大部分构建工具的概念和功能都是相似的，本节主要使用**webpack**打包。

## 使用 webpack

---

webpack 这个开发工具可以在[npm](https://www.npmjs.com/)里找到，为了获取 webpack 和它的命令行界面，打开终端然后输入：

```bash
npm i --save-dev webpack webpack-cli
```

这行命令会先安装 webpack，然后更新你插件里的`package.json`中的`devDependencies`字段。Webpack 是一个 Javascrip 打包工具，但是大部分 VS Code 插件是用 Typescript 写的，所以你需要在 webpack 中配置`ts-loader`，它才能正确编译 Typescript。安装`ts-loader`：

```bash
npm i --save-dev ts-loader
```

## 配置 webpack

---

既然所有的工具都安装好了，我们现在可以开始配置 webpack 了。通常来说，你的项目目录中需要创建一个`webpack.config.js`文件，webpack 才能知道按什么规则打包你的插件。下面的配置示例是 VS Code 插件专用的，让我们来开这个头吧：

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

"use strict";

const path = require("path");

/**@type {import('webpack').Configuration}*/
const config = {
  target: "node", // vscode插件运行在Node.js环境中 📖 -> https://webpack.js.org/configuration/node/

  entry: "./src/extension.ts", // 插件的入口文件 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // 打包好的文件储存在'dist'文件夹中 (请参考package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]"
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode" // vscode-module是热更新的临时目录，所以要排除掉。 在这里添加其他不应该被webpack打包的文件, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // 支持读取TypeScript和JavaScript文件, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
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

## 运行 webpack

---

`webpack.config.js`文件创建好之后，webpack 就可以正式开始工作了。你可以从命令行中运行 webpack，不过为了避免重复工作用 npm script 会更有效率。

将下列脚本复制到`package.json`的`scripts`中去：

```json
"scripts": {
  "vscode:prepublish": "webpack --mode production",
  "compile": "webpack --mode none",
  "watch": "webpack --mode none --watch",
},
```

`compile`和`watch`脚本是开发时使用的，它们会产生构建文件。`vscode:prepublish`是`vsce`使用的，`vsce`是 VS Code 的打包和发布工具，你需要在发布插件之前运行这个命令。webpack 中的[mode](https://webpack.js.org/concepts/mode/)是控制优化级别的配置项，如果你使用`production`字段，那么就会打包出最小的构建文件，但是也会耗费更多时间，所以我们开发中使用`none`。想要运行上述脚本，我们可以打开终端（命令行）输入`npm run compile`或者从*命令面板*（<kbd>Ctrl+Shift+P</kbd>）中使用**运行任务**来开始。

## 运行插件

---

运行插件之前，你需要将`package.json`中的`main`属性指向到构建文件上，也就是我们上面提到的[`"./dist/extension"`](https://github.com/Microsoft/vscode-references-view/blob/d649d01d369e338bbe70c86e03f28269cbf87027/package.json#L26)，改好之后我们就可以运行和测试插件了。关于调试配置，请注意更新`launch.json`中的`outFiles`属性。

## 测试

---

插件开发者一般都会给插件源代码进行单元测试，但是有了完备的底层架构支持，插件的源代码可以不依赖测试，webpack 产生的构建文件中也不应该包含任何测试代码。如果需要运行单元测试，只需要简单地编译就好了。在上面的例子里，我们有一个`test-compile`脚本，它会把调用 Typescript 编译器将插件编译至`out`目录中。这样一来我们就有了 JS 文件，再使用下面的`launch.json`就足够应付测试了。

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
  "outFiles": ["${workspaceFolder}/out/test/**/*.js"],
  "preLaunchTask": "npm: test-compile"
}
```

这个测试配置对于非 webpack 打包的插件来说也是可以使用的。我们没必要将单元测试打包起来，因为它们不应包含在我们发布的插件里。

## 发布

---

发布前你需要更新`.vscodeignore`文件。现在所有东西都打包到了`dist/extension.js`文件中，所以应该排除这个文件还有`out`文件夹（怕你漏了，特此提醒），以及最重要的`node_modules`文件夹。

一般来说，`.vsignore`文件应该是这样的：

```bash
.vscode
node_modules
out/
src/
tsconfig.json
webpack.config.js
```

## 迁移插件

---

用 webpack 迁移现有的插件是很容易的，整个过程就像我们上面的指南一样。真实的例子如 VS Code 的 References 视图就是从这个[pull request](https://github.com/Microsoft/vscode-references-view/pull/50)应用了 webpack 而来的。

在里面，你可以看到：

- `devDependencies`中添加`webpack`，`webpack-cli`和`ts-loader`
- 更新 npm 脚本以便开发时使用 webpack
- 更新调试配置文件`launch.json`
- 添加和修改`webpack.config.js`
- 更新`.vscodeignore`排除`node_modules`和其他开发时产生的临时文件
- 开始享受体积更小、安装更快的插件！

## 疑难解答

---

#### 压缩

使用`production`模式会执行代码压缩，它会去除源代码中的空格和注释，并把变量名和函数名进行替换——混淆和压缩。不过形如`Function.prototype.name`的代码不会压缩。

#### webpack critical dependencies

当你运行 webpack 时，你可能会碰到像**Critical dependencies: the request of a dependency is an expression**字样的警告。这些警告必须立即处理，一般来说会影响到打包过程。这句话意味着 webpack 不能静态分析某些依赖，一般是由动态使用`require`导致的，比如`require(someDynamicVariable)`。

想要处理这类警告，你需要：

- 将需要打包的部分变成静态的依赖。
- 通过`externals`排除这部分依赖，但是注意它们的 Javascript 文件还是应该保留在我们打包的插件里，在`.vscodeignore`中使用 glob 模式，比如`!node_modules/mySpecialModule`。

## 下一步

- [插件市场](https://code.visualstudio.com/docs/editor/extension-gallery) - 学习更多 VS Code 插件市场的有关内容。
- [测试插件](/working-with-extensions/testing-extension.md) - 测试插件，提高项目质量。
- [持续集成](/working-with-extensions/continuous-integration.md) - 使用 Azure Pipeline 运行插件的 CI 构建。
