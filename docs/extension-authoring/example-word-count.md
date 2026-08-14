# 示例 Word Count

如果你还没有接触过[你的第一个插件](/extension-authoring/example-hello-world)章节，我们建议你先去了解一下。

本篇示例将会告诉你，如何制作一个Markdown辅助编辑工具。开始之前，我们先了解一下本篇你将接触到的插件功能：当编辑Makrdown文件时状态栏会显示编辑区字数，如果你编辑文档或者打开了另一个md文件字数也会随之改变。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-word-count/wordcountevent2.gif)
::: info
小贴士：如果你碰到了什么问题，可以在这里[下载完整的项目](https://github.com/microsoft/vscode-wordcount)进行调试
:::

## 本节要点
本章将通过三个部分让你了解vscode有关的概念：
- [更新状态栏](#更新状态栏) - 在*状态栏*中显示自定义文本
- [订阅事件](#订阅事件) - 通过编辑器事件更新*状态栏*
- [释放插件资源](#释放插件资源) - 比如：释放事件订阅和UI回调函数

如果你还不熟悉生成插件的步骤，请先了解之前的章节：[生成插件-运行Yo](/extension-authoring/extension-generator#运行yo-code😎)

就像你之前在[示例：Hello-world](/extension-authoring/example-hello-world)中做的一样，使用`F5`或者`Cmd + R`运行该项目。

## 更新状态栏
将下列代码更新到`extension.ts`中。这段代码声明了一个`WordCounter`类用于控制文本计数并显示到状态栏中，我们依然用了"Hello World"这个命令来执行`updateWordCount`。

```typescript
// 'vscode'模块包含了VS Code扩展性API
// 导入你要用到的扩展类
import {
window, 
commands, 
Disposable, 
ExtensionContext, 
StatusBarAlignment, 
StatusBarItem, TextDocument
} from 'vscode';

// 当你的插件激活时，会调用这个方法。'activation'是package.json中定义好的activation events
export function activate(context: ExtensionContext) {

    // 用console对象输出诊断和错误信息(console.log / console.error).
    // 下面这行代码，只会在你的插件激活时执行一次
    console.log('Congratulations, your extension "WordCount" is now active!');

    // 新建一个字数计数器
    let wordCounter = new WordCounter();
    let disposable = commands.registerCommand('extension.sayHello', () => {
        wordCounter.updateWordCount();
    });

    // 把disposables添加到一个列表中，以便关闭插件时释放资源
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(disposable);
}

class WordCounter {
    private _statusBarItem: StatusBarItem =  window.createStatusBarItem(StatusBarAlignment.Left);

    public updateWordCount() {

        // 获取当前编辑器
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;
        
        // 只对markdown文件生效
        if (doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);
            
            // 更新状态栏
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public _getWordCount(doc: TextDocument): number {
        let docContent = doc.getText();

        // 去除多余空格
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent !== "") {
            wordCount = docContent.split(" ").length;
        }
        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}
```

现在让我们试试更新插件吧。

在VS Code中（非开发主机窗口）按下`F5`或者直接按重启按钮。假设你已经打开了一个markdown文件，然后和Hello-World示例一样，我们在*命令面板*中输入`Hello World`启动插件。

![](https://github.com/Microsoft/vscode-docs/raw/master/docs/extensions/images/example-word-count/wordcount2.png)

很棒，我们接下来做更cool的事情——实时更新字数。

## 订阅事件

我们先来看看事件中的类方法：
- `onDidChangeTextEditorSelection` - 鼠标位置变动时触发。
- `onDidChangeActiveTextEditor` - 激活编辑器（打开的编辑器）切换的时候触发。

为了实现这个目标，我们给`extension.ts`添加一个新类，订阅上述事件然后让`WordCounter`更新字数。
::: info
在实现时，你需要注意我们是如何把**消息订阅( subscription )**转换为**释放器( Disposables )**来管理的，它将监听并释放自己。
:::

根据下列代码，将`WordCounterController`类添加到`extension.ts`文件底部。
```typescript
class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;

        // 订阅 文本选区变更 和 编辑器激活事件
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // 为当前文件更新计数器
        this._wordCounter.updateWordCount();

        // 把两个事件订阅器整合成一个临时容器
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }
}
```

我们不希望通过执行命令才启动词汇计数插件，而是markdown文件一打开插件就应该启动。

首先，我们将`active`函数替换成这样：
```typescript
// 输出诊断信息
console.log('Congratulations, your extension "WordCount" is now active!');

// 新建一个词汇计数器
let wordCounter = new WordCounter();
let controller = new WordCounterController(wordCounter);

// 插件关闭时，释放器会自动释放
context.subscriptions.push(controller);
context.subscriptions.push(wordCounter);
```

然后，我们必须保证`Markdown`文件打开时才激活。在之前的示例中，我们通过`extension.sayHello`命令激活插件，而我们现在用不到了，删除`package.json`文件中原来的`contributes`键。
```json
"contributes": {
    "commands":
        [{
            "command": "extension.sayHello",
            "title": "Hello World"
        }
    ]
}
```
用下面的代码替换掉：
```json
"activationEvents": [
    "onLanguage:markdown"
]
```
为[onLanguage: ${language}]()配置一个语言，在这里是"markdown" 。这样一来打开这一类文件就会触发这个事件了。

重启插件(按下`Cmd + R`或者重启按钮)，然后新建一个`.md`文件，你应该能看到下图的效果。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-word-count/wordcountevent2.gif)

如果你在`active`函数上打了断点，你应该能看到markdown文件被打开时只触发了一次。`WordCountController`构造器运行之后，订阅了编辑器事件，这样我们整个插件就正常运行了。

## 自定义状态栏

VS Code允许你定制状态栏的颜色、图标、提示文本等额外样式。如果你不清楚**状态栏**相关的API，你可以查看该类型的代码提示，你也可以通过`vscode.d.ts`VS Code扩展性API查看，这个文件就在你生成的项目文件夹里，在编辑器中打开`node_modules\vscode\vscode.d.ts`，你能看到完整的扩展性 API和注释。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-word-count/vscode-d-ts.png)

更新StatusBarItem接口的代码
```typescript
// 更新状态栏
this._statusBarItem.text = wordCount !== 1 ? `$(pencil) ${wordCount} Words` : '$(pencil) 1 Word';
this._statusBarItem.show();
```
这样就在计数左边显示了一个[Github Oction](https://octicons.github.com/)的`pencil`图标

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/example-word-count/wordcount-pencil.png)

## 释放插件资源

现在，我们来深入了解一下VS Code是怎么通过[释放器（Disposables）](/extensibility-reference/principles-patterns#disposables（释放器）)控制资源的。

当一个插件被激活，它会传入一个`ExtensionContext`对象， 这个对象有一个用于订阅释放器（Disposable）的`subscriptions`方法。插件将=释放器添加到这个订阅列表中，VS Code则会在插件关闭的时候释放这些对象。

很多能生成工作区（workspace）或者UI对象的VS Code API（比如：`registerCommand`）会自动返回一个释放器，我们可以直接调用他们的dispose方法释放UI元素。

事件则有所不同，比如`onDid*`这类事件订阅器会返回一个释放器。插件通过释放事件的释放器（Disposable）来取消已经订阅的事件。在我们的例子里，`WordCountController`把事件订阅的释放器直接保存到自己的释放器列表中，在插件关闭时释放。
```typescript
// 订阅选区变动事件和编辑器激活事件
let subscriptions: Disposable[] = [];
window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

// 把两个事件订阅器生成一个组合的临时容器
this._disposable = Disposable.from(...subscriptions);
```
##  在本地安装你的插件

到目前为止，你的插件都还跑在插件开发模式中，要想让你的插件在正常的VS Code中运行起来将你的插件复制到`.vscode/extensions`目录下。

## 发布插件

参阅[分享插件](/extension-authoring/publish-extension)

## 下一步

[插件生成器](/extension-authoring/extension-generator) - 学习Yo Code插件生成器的更多选项

[Extenstion API](/extensibility-reference/overview) - 插件API概览

[发布插件](/extension-authoring/publish-extension) - 学会如何在应用市场发布一个公共插件

[编辑器 API](/extensibility-reference/vscode-api) - 学习更多有关文档, 文档编辑器和编辑的内容

[更多插件示例](/extension-authoring/samples) - 在插件示例列表学习其他用法