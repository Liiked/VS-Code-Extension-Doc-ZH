# 解析插件结构

上一节中，你已经能够自己创建一个基础的插件了，但是在面纱之下，它究竟是怎么运作的呢？

`Hello World`插件包含了3个部分：
- 注册[`onCommand`](/references/activation-events#onCommand) [**激活事件**](/references/activation-events): `onCommand:extension.helloWorld`，所以用户可以在输入`Hello World`命令后激活插件。
  
	:::info
	**注意**: 从 VS Code 1.74.0 开始, 在 `package.json` 的 `commands` 声明的命令会在插件唤起时自动激活，无需再从`activationEvents` 显式注册 `onCommand`
	:::
- 使用[`contributes.commands`](/references/contribution-points#contributescommands) [**配置点**](/references/contribution-points)，绑定一个命令ID `extension.helloWorld`，然后 `Hello World`命令就可以在命令面板中使用了。
- 使用[`commands.registerCommand`](/references/vscode-api#commandsregisterCommand) [**VS Code API**](/references/vscode-api) 将一个函数绑定到你注册的命令ID`extension.helloWorld`上。

理解下面三个关键概念你才能作出一个基本的插件：
- [**激活事件**](/references/activation-events): 插件激活的时机。
- [**配置点**](/references/contribution-points): VS Code扩展了 `package.json` [插件清单](/get-started/extension-anatomy#插件清单)的字段以便于开发插件。
- [**VS Code API**](/references/vscode-api): 你的插件代码中需要调用的一系列JavaScript API。

大体上，你的插件就是通过组合发布内容配置和VS Code API扩展VS Code的功能。你能在[插件功能概述](/extension-capabilities)主题中找到合适你插件的配置点和VS Code API。

好了，现在让我们自己瞧一瞧`Hello World`示例的源码部分，以及我们上面提到的3个概念是如何应用其中的。

## 插件目录结构

```
.
├── .vscode
│   ├── launch.json     // 插件加载和调试的配置
│   └── tasks.json      // 配置TypeScript编译任务
├── .gitignore          // 忽略构建输出和node_modules文件
├── README.md           // 一个友好的插件文档
├── src
│   └── extension.ts    // 插件源代码
├── package.json        // 插件配置清单
├── tsconfig.json       // TypeScript配置
```

下面的几个文件超出了本节讨论的范围，你可以自行前往相应的章节挖掘详细内容：
- `launch.json` 用于配置VS Code [调试]()
- `tasks.json` 用于定义VS Code [任务]()
- `tsconfig.json` 参阅TypeScript [Handbook]()

现在，让我们把精力集中在这个插件的关键部分——`package.json`和`extensions.ts`。

#### 插件清单

每个VS Code插件都必须包含一个`package.json`，它就是插件的[配置清单](/references/extension-manifest)。`package.json`混合了Node.js字段，如：`scripts`、`dependencies`，还加入了一些VS Code独有的字段，如：`publisher`、`activationEvents`、`contributes`等。关于这些VS Code字段说明都在[插件清单参考]()中可以找到。我们在本节介绍一些非常重要的字段：

- `name` 和 `publisher`: VS Code 使用`<publisher>.<name>`作为一个插件的ID。你可以这么理解，Hello World 例子的 ID 就是`vscode-samples.helloworld-sample`。VS Code 使用 ID 区分各个独一无二的插件。
- `main`: 插件的主入口。
- `activationEvents` 和 `contributes`: [激活事件](/references/activation-events) and [配置点](/references/contribution-points)。
- `engines.vscode`: 描述了这个插件依赖的最低VS Code API版本。

```json
{
  "name": "helloworld-sample",
  "displayName": "helloworld-sample",
  "description": "HelloWorld example for VS Code",
  "version": "0.0.1",
  "publisher": "vscode-samples",
  "repository": "https://github.com/microsoft/vscode-extension-samples/helloworld-sample",
  "engines": {
    "vscode": "^1.51.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "helloworld.helloWorld",
        "title": "Hello World"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/node": "^8.10.25",
    "@types/vscode": "^1.51.0",
    "tslint": "^5.16.0",
    "typescript": "^3.4.5"
  }
}
```

## 插件入口文件

插件入口文件会导出两个函数，`activate` 和 `deactivate`，你注册的**激活事件**被触发之时执行`activate`，`deactivate`则提供了插件关闭前执行清理工作的机会。

[`vscode`](https://www.npmjs.com/package/vscode)模块包含了一个位于`node ./node_modules/vscode/bin/install`的脚本，这个脚本会拉取`package.json`中`engines.vscode`字段定义的VS Code API。这个脚本执行过后，你就得到了智能代码提示，定义跳转等TS特性了。

```typescript
// 模块 'vscode' 包含 VS Code 插件 API
// 导入模块，并以别名 vscode 在代码中使用
import * as vscode from 'vscode';

// 这个方法会在你的插件激活时唤起
// 扩展会在首次执行该命令时激活
export function activate(context: vscode.ExtensionContext) {
  // 使用控制台输出诊断信息（console.log）和错误信息（console.error）
  // 此行代码仅会在扩展激活时执行一次
  console.log('Congratulations, your extension "helloworld-sample" is now active!');

  // 该命令已在 package.json 文件中定义
  // 现在使用 registerCommand 提供命令的实现
  // commandId 参数必须与 package.json 中的 command 字段一致
  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
    // 每次执行命令时，都会运行这里的代码

    // 向用户显示消息框
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(disposable);
}

// 此方法会在扩展停用时调用
export function deactivate() {}
```
