# 示例：Hello World

## 你的第一个插件
---
本节通过Hello World这个完整的项目手把手教你掌握VS Code扩展性概念。
在本项目中，我们会给VS Code添加一个新的命令，虽然只是用来显示"Hello World"信息。在本节的最后，你将和编辑器编辑器互动，查找用户选中的文本。
#### 预备工作
请查看[生成插件-预备工作](/extension-authoring/extension-generator?id=预先准备)

#### 生成新插件
请查看[生成插件-运行Yo](/extension-authoring/extension-generator?id=运行yo-code😎)
## 运行插件
---
- 打开VS Code，选择`文件`>`打开文件夹`，选择你刚刚生成的项目目录
- 点击`F5`或者`Debug`按钮，然后点击`开始`
- 新的VS Code实例会运行在特殊环境中（`Extension Development Host`
- 按下`⇧⌘P`(windows `shift + ctrl + p`)，输入命令`Hello world`
- 恭喜！你的第一个VS Code插件执行成功了

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-hello-world/running.png)
## 插件的目录结构
---

构建完毕之后，你的插件开发目录看起来应该是这样的
```
.
├── .gitignore
├── .vscode                     // VS Code 文件
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── .vscodeignore               // 发布插件时忽略的文件
├── README.md
├── src
│   └── extension.ts            // 插件的入口（源文件）
├── test                        // 测试文件夹
│   ├── extension.test.ts       // extension.test.js, 如果是 JavaScript 插件的话
│   └── index.ts                // index.js, 如果是 JavaScript 插件的话
├── node_modules
│   ├── vscode                  // 包含了vscode插件开发时的类型定义文件
│   └── typescript              // typescript的编译器 (TypeScript only)
├── out                         // 编译出口 (TypeScript only)
│   ├── extension.js            // 插件入口
│   ├── extension.js.map
│   └── test
│       ├── extension.test.js
│       ├── extension.test.js.map
│       ├── index.js
│       └── index.js.map
├── package.json                // 插件清单
├── tsconfig.json               // jsconfig.json, 如果是 JavaScript 插件的话
└── vsc-extension-quickstart.md // 快速上手插件开发
```
让我们看看这些文件夹都是干什么用的：
#### 插件清单：`package.json`
- 每个VS Code插件都有`package.json`文件，文件内包含了这个插件功能和用处。
- 当项目启动时，VS Code会立即读取这个文件中的每个`配置(contributes)`部分并作出响应。
- 请阅读[package.json插件清单](/extensibility-reference/extension-manifest.md)参考文档
- 更多信息请参阅[package.json发布内容配置](/extensibility-reference/contribution-points.md)参考文档

?> 译者注：为了便于理解，`contribution / contributes`在本教程中译为**发布内容配置/配置**，`contribution points`译为**发布内容配置点/配置点**。

**示例：基于TypeScript的pacakge.json**

```json
{
    "name": "myFirstExtension",
    "description": "",
    "version": "0.0.1",
    "publisher": "",
    "engines": {
        "vscode": "^1.5.0"
    },
    "categories": [
        "Other"
    ],
    "activationEvents": [
        "onCommand:extension.sayHello"
    ],
    "main": "./out/extension",
    "contributes": {
        "commands": [{
            "command": "extension.sayHello",
            "title": "Hello World"
        }]
    },
    "scripts": {
        "vscode:prepublish": "tsc -p ./",
        "compile": "tsc -watch -p ./",
        "postinstall": "node ./node_modules/vscode/bin/install",
        "test": "node ./node_modules/vscode/bin/test"
    },
    "devDependencies": {
       "typescript": "^2.0.3",
        "vscode": "^1.5.0",
        "mocha": "^2.3.3",
        "@types/node": "^6.0.40",
        "@types/mocha": "^2.2.32"
   }
}
```
!> 提示: 基于JavaScript的插件没有scripts部分，因为不需要编译。

这份`package.json`文件说了什么呢？
- **配置部分(contributes)**给*命令面板*定义了一个叫做`Hello world`的入口，它会调用'extension.sayHello'。
- 当命令"extension.sayHello"调用时，执行`loaded`(激活事件)请求。
- 在"`./out/extension.js`"中，存放着我们的主文件。

!> 注意：VS Code **不会一启动就加载插件**。插件必须在`activationEvents`中描述它的启动时机，比如`loaded`事件。
#### 生成的代码
自动生成的代码存放在**extension.ts**（或者**extension.js**中）。
```typescript
// 'vscode'模块包含了VS Code extensibility API
// 按下述方式导入这个模块
import * as vscode from 'vscode';

// 一旦你的插件激活，vscode会立刻调用下述方法
export function activate(context: vscode.ExtensionContext) {

    // 用console输出诊断信息(console.log)和错误(console.error)
    // 下面的代码只会在你的插件激活时执行一次
    console.log('Congratulations, your extension "my-first-extension" is now active!');

    // 入口命令已经在package.json文件中定义好了，现在调用registerCommand方法
    // registerCommand中的参数必须与package.json中的command保持一致
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // 把你的代码写在这里，每次命令执行时都会调用这里的代码
        // ...
        // 给用户显示一个消息提示
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
```
- 每个插件都应该在主文件中注册一个`activate()`函数，因为这个函数只会调用一次。你只有`在package.json`中注册了`activationEvents`列表中的事件，激活事件才会被调用。
- 如果插件使用了系统资源(如：生成进程），则需要从主文件中导出名为`deactive()`的函数去清理释放这些资源，VS Code会在关闭时调用这个方法。
- 这个插件导入了VS Code API，然后注册了"extension.sayHello"命令和回调函数，执行后在VS Code中显示一条"Hello World!"消息。

!> 注意： `package.json`的`contributes`部分给*命令面板*添加了一个调用入口。`extension.ts/.js`定义了`extension.sayHello`的实现。对于 Typescript类型的插件来说，生成的`out/extension.js`会在运行时加载。
#### 其他文件
- `vscode/launch.json` 告诉VS Code启用插件开发模式。它也描述了`.vscode/tasks.json`中需要Typescript编译器的预加载任务。
- `vscode/settings.json` 默认排除外部文件夹。你如果想隐藏一些文件，可以修改这个配置。
- `gitignore` - 告诉git不跟踪哪些文件。
- `vscodeignore` - 告诉打包工具，发布插件时应该忽略哪些文件。
- `README.md` - 为插件的使用用户提供良好的文档。
- `vsc-extension-quickstart.md` - 你的快速开始指南。
- `test/extension.test.ts` - 把你的单元测试放在这里，看看和VS Code API有哪些出入。
## 插件激活过程
--- 
我们刚刚已经了解了开发目录下的每个文件，现在我们看看你的插件是怎么运行起来的：
1. 插件开发环境发现了这个插件，然后读取它的`package.json`
2. 你按下`ctrl shift p`时，*命令面板*显示出已注册的命令列表
3. 在列表中你找到`package.json`中定义的`Hello world`命令入口
4. 选中并执行`Hello world`，随即执行真实的"`extension.sayHello`"命令
    - 创建`"onCommand:extension.sayHello"`激活事件
    - 激活所有注册在`activationEvents`的事件
        - Javascript虚拟机加载`./out/extension.js`文件
        - VS Code查找导出的`activate`函数，并调用
5. 调用`"extension.sayHello"`注册的函数
6. 函数执行，显示出"Hello world"消息
## 调试插件
---
直接在你的代码里打上断点就可以调试了，很简单吧。

![调试](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-hello-world/hitbp.png)

!> 注意：VS Code具有解析sourcemap的能力，所以你可以直接在Typescript代码中调试。

?>小提示：调试控制台(Debug Console)能输出所有console打印的日志。

查看更多关于插件[开发环境](/extension-authoring/developing-extensions.md)的东西。
## 小小的改造
---
试着修改你的`extension.ts`（或者`extension.js`）中`extension.sayHello`的实现，我们把它改造成一个对选中文本计数的功能。
```typescript
let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    // 每当你执行命令，这里的代码都会执行一次

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // 没有打开的编辑器
    }

    let selection = editor.selection;
    let text = editor.document.getText(selection);

    // 给用户一个消息提示框
    vscode.window.showInformationMessage('Selected characters: ' + text.length);
});
```
!> 当你修改了代码，你需要按<kbd>Ctrl + R</kbd>(macOS <kbd>Cmd + R</kbd>)重启Extension Development Host，或者直接按VS Code上面的重启按钮

新建一个文件，输入一些文本然后选中。当你运行**Hello World**命令，你应该能看到字符计数的消息框。

![文字计数](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-hello-world/selection-length.png)
## 在本地安装你的插件
---
好了，现在你已经完成了一个运行在开发模式下的插件，为了让你的插件运行在所有VS Code实例中，你需要在本地插件目录下新建一个文件夹，然后复制过去：
- Windows: `%USERPROFILE%\.vscode\extensions`
- macOS/Linux: `$HOME\.vscode\extensions`

## 发布插件
---
参阅[分享插件](/extension-authoring/publish-extension.md)
## 下一步
---
在本篇指引中，我们实现了一个小小的插件。在[示例-Word Count](docs/extension-authoring/example-word-count.md)中你能找到完整的例子，学习如何在Markdown文件中监听编辑器的文档变动事件、显示文本字数。

如果你想查看更多extension API的概述，看看这些主题吧：
- [Extension API 概览](/extensibility-reference/overview.md) - 了解完整的VS Code扩展性模型。
- [API原则和模式](/extensibility-reference/principles-patterns.md) - VS Code的扩展性基于这些指导性原则和模式。
- [发布内容配置](/extensibility-reference/contribution-points.md) - 各种各样的VS Code发布内容配置项
- [激活事件](/extensibility-reference/activation-events.md) - VS Code激活事件参考
- [更多插件示例](/extension-authoring/samples.md) - 看看我们的插件示例列表