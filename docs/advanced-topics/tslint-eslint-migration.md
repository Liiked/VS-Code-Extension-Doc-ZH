# 从 TSLint 迁移到 ESLint

[TSLint](https://palantir.github.io/tslint/) 曾经是推荐的 linter，但现在 TSLint 已被弃用，[ESLint](https://eslint.org/) 正在接管其职责。本文将帮助你从 TSLint 迁移到 ESLint。

## ESLint：安装

你需要安装 ESLint。ESLint 本身不支持 TypeScript，因此你还需要安装 eslint-typescript-support：

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

或者如果你使用 yarn 作为包管理器：

```bash
yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --dev
```

上面的命令添加了 ESLint，添加了一个让 ESLint 理解 TypeScript 的解析器，并添加了一些 TypeScript 专用的规则。

现在，为了简化实际的迁移，运行 [tslint-to-eslint-config](https://github.com/typescript-eslint/tslint-to-eslint-config) 工具。该工具将获取你的 TSLint 配置，并从中创建“最接近”的 ESLint 配置。

```bash
npx tslint-to-eslint-config
```

此命令会[下载并执行](https://www.npmjs.com/package/npx)该工具来执行迁移。如需更多选项，请查看该工具的[使用指南](https://github.com/typescript-eslint/tslint-to-eslint-config#usage)。

现在应该会有一个新的 `.eslintrc.js` 文件、一个日志文件（`tslint-to-eslint-config.log`），并且可能还会更改其他文件，例如 `.vscode/settings.json`。请仔细审阅这些更改，尤其是对现有文件所做的更改，并检查日志文件。

## ESLint：配置

`.eslintrc.js` 文件通常足以开始使用，但 `parserOptions.project` 属性可能仍然指向你的 `tsconfig.json` 文件。这意味着 ESLint 规则可以使用语义信息，例如，这个变量是字符串还是数字数组？这种配置启用了一些强大的规则，但也意味着 ESLint 的计算时间要长得多。插件的默认规则不需要语义信息，除非你添加了需要语义信息的规则，否则我们建议你移除 `parserOptions.project` 属性。

## ESLint：运行

你现在可以运行 ESLint 了，但在那之前，我们建议你禁用 TSLint。为此，请打开扩展视图，并在 TSLint 插件的上下文菜单中选择**禁用（Disable）**。

是时候进行 lint 了！使用此命令：`eslint -c .eslintrc.js --ext .ts <mySrcFolder>`（注意 `--ext .ts` 选项，它告诉 ESLint 查找 TypeScript 文件）。我们建议将该命令放在你的 `package.json` 文件的 `scripts` 部分，如下所示：

```json
"lint": "eslint -c .eslintrc.js --ext .ts <mySrcFolder>"
```

要将 ESLint 与 Visual Studio Code 集成，请执行以下操作：

* 安装 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 插件。
* 通过 **Tasks: Configure Task** 命令创建一个任务，并选择 **npm: lint**。
* 在生成的 `tasks.json` 文件中，将问题匹配器配置为 `$eslint-stylish`。

**提示**：ESLint 有时在做事情的方式上“更正确”，你可能会看到以前没有的警告，例如指出缺少分号。尝试使用 `--fix` 选项，让 ESLint 为你清理这些问题。

## TSLint：移除

恭喜。你现在应该已经有一个可用的 ESLint 配置了，是时候进行清理了。

移除 TSLint 取决于你的项目，但通常有以下几个步骤：

* 更新 `.vscode/extensions.json`，推荐 ESLint 插件而不再推荐 TSLint：

  ```json
  "recommendations": [
    "dbaeumer.vscode-eslint"
  ]
  ```

* 删除 `tslint.json` 文件。
* 移除 `package.json` 文件中 `tslint` 的依赖。
* 使用 `npm uninstall tslint` 卸载 TSLint。
