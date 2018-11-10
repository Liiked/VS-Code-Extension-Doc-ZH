# VS Code Webview API
webview API为开发者提供了完全自定义视图的能力，例如内置的Markdown插件使用了webview渲染Markdown预览文件。Webview也能用于构建比VS Code原生API支持构建的更加复杂的用户交互界面。

可以把webview看成是VS Code中的`iframe`，它可以渲染几乎全部的HTML内容，它通过消息机制和插件通信。这样的自由度令我们的webview非常强劲并将插件的潜力提升到了新的高度。

## 我应该用webview吗？
---

webview虽然很赞，但是我们应该节制地使用这个功能——比如当VS Code原生API不够用时。Webview重度依赖资源，所以它脱离插件的进程而单独运行在其他环境中。在VS Code中使用设计不良的webview会让用户抓狂。

在使用webview之前，请作以下考虑：
- 这个功能真的需要VS Code来提供吗？分离成一个应用或者网站会不会更好？
- webview是实现这个特性的最后方案吗？VS Code原生API是否能达到同样的目的呢？
- 你的webview所牺牲的高资源占用是否能换得同样的用户价值？

请记住：不要因为能使用webview而滥用webview。相反，如果你有充足的理由和自信，那么本篇教程对你来说会非常有用，现在就让我们开始吧。

## Webviews API 基础
---

为了解释webviewAPI，我们先构建一个简单的**Cat Coding**插件。这个插件会用一个webview显示猫写代码的gif。随着我们不断了解API，我们会不断地给插件添加功能，包括我们的猫写了多少行代码的计数跟踪器，如果猫猫写出了bug还会有一个提示弹出框。

这是**Cat Coding**插件的第一版`package.json`，你可以在这里找到完整的代码。我们的第一版插件[提供了一个命令](https://code.visualstudio.com/docs/extensionAPI/extension-points#_contributescommands)，叫做`catCoding.start`。当用户从*命令面板*调用这个**Cat Coding: Start new cat coding session **。

```json
{
  "name": "cat-coding",
  "description": "Cat Coding",
  "version": "0.0.1",
  "publisher": "bierner",
  "engines": {
    "vscode": "^1.23.0"
  },
  "activationEvents": [
    "onCommand:catCoding.start"
  ],
  "main": "./out/src/extension",
  "contributes": {
    "commands": [
      {
        "command": "catCoding.start",
        "title": "Start new cat coding session",
        "category": "Cat Coding"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "tsc -p ./",
    "compile": "tsc -watch -p ./",
    "postinstall": "node ./node_modules/vscode/bin/install"
  },
  "dependencies": {
    "vscode": "*"
  },
  "devDependencies": {
    "@types/node": "^9.4.6",
    "typescript": "^2.8.3"
  }
}
```

现在让我们实现`catCoding.start`命令，在我们的主文件中，像下面这样注册一个基础的webview：

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        // 创建并显示新的webview
        const panel = vscode.window.createWebviewPanel(
            'catCoding', // 只供内部使用，这个webview的标识
            "Cat Coding", // 给用户显示的面板标题
            vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
            { } // Webview选项。我们稍后会用上。
        );
    }));
}
```

`vscode.window.createWebviewPanel`函数创建并在编辑区展示了一个webview，下图显示了如果你试着运行`catCoding.start`命令会显示的东西：

![cat coding](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-no_content.png)

我们的命令以正确的标题打开了一个新的webview面板，但是没有任何内容！要想把我们的猫加到这个面板里面，我们需要`webview.html`设置HTML内容。

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        // 创建和显示webview
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, { });

        // 设置HTML内容
        panel.webview.html = getWebviewContent();
    }));
}

function getWebviewContent() {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body>
                <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
            </body>
            </html>`;
}
```

如果你再次运行命令，应该能看到下图：

![cat coding](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-html.png)

大功告成！

`webview.html`应该是一个完整的HTML文档。使用HTML片段或者格式错乱的HTML会造成异常。

#### 更新webview内容

`webview.html`也能在webview创建后更新内容，让我们用猫猫轮播图使**Cat Coding**具有动态性：
```typescript
import * as vscode from 'vscode';

const cats = {
    'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'Compiling Cat':'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, { });

        let iteration = 0;
        const updateWebview = () => {
            const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat'
            panel.title = cat;
            panel.webview.html = getWebviewContent(cat);
        }

        // 设置初始化内容
        updateWebview();

        // 每秒更新内容
        setInterval(updateWebview, 1000);
    }));
}

function getWebviewContent(cat: keyof typeof cats) {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body>
                <img src="${cats[cat]}" width="300" />
            </body>
            </html>`;
}
```

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-update.gif)

因为`webview.html`方法替换了整个webview内容，页面看起来像重新加载了一个iframe。记住：如果你在webview中使用了脚本，那就意味着`webview.html`的重置会使脚本状态重置。

上述示例也使用了`webview.title`改变编辑器中的展示的文件名称，设置标题不会使webview重载。

#### 生命周期

webview从属于创建他们的插件，插件必须保持住从webview返回的`createWebviewPanel`。如果你的插件失去了这个关联，它就不能再访问webview了，不过即使这样，webview还会继续展示在VS Code中。

因为webview是一个文本编辑器视图，所以用户可以随时关闭webview。当用户关闭了webview面板后，webview就被销毁了。在我们的例子中，销毁webview时抛出了一个异常，说明我们上面的示例中使用的`seInterval`实际上产生了非常严重的Bug：如果用户关闭了面板，`setInterval`会继续触发，而且还会尝试更新`panel.webview.html`，这当然会抛出异常。喵星人可不喜欢异常，我们现在就来解决这个问题吧。

`onDidDispose`事件在webview被销毁时触发，我们在这个事件结束之后更新并释放webview资源。

```typescript
import * as vscode from 'vscode';

const cats = {
    'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'Compiling Cat':'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {});

        let iteration = 0;
        const updateWebview = () => {
            const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat'
            panel.title = cat;
            panel.webview.html = getWebviewContent(cat);
        }

        updateWebview();
        const interval = setInterval(updateWebview, 1000);

        panel.onDidDispose(() => {
            // 当面板关闭时，取消webview内容之后的更新
            clearInterval(interval);
        }, null, context.subscriptions)
    }));
}
```

插件也可以通过编程方式关闭webview视图——调用它们的`dispose()`方法。我们假设，现在限制我们的猫猫每天工作5秒钟：

```typescript
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {

        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {});

        panel.webview.html = getWebviewContent('https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif');

        // 5秒后，程序性地关闭webview面板
        const timeout = setTimeout(() => panel.dispose(), 5000)

        panel.onDidDispose(() => {
            // 在第五秒结束之前处理用户手动的关闭动作
            clearTimeout(timeout);
        }, null, context.subscriptions)
    }));
}
```

#### 移动和可见性

当webview面板被移动到了非激活标签上，它就隐藏起来了。但这时并不是销毁，当重新激活标签后，VS Code会从`webview.html`自动恢复webview的内容。

![restore](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-restore.gif)

`.visible`属性告诉你当前webview面板是否是可见的。

插件也可以通过调用`reveal()`方法，程序性地将webview面板激活。这个方法可以接受一个用于放置面板的目标视图布局。一个面板一次只能显示在一个编辑布局中。调用`reveal()`或者拖动webview面板到新的编辑布局中去。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-drag.gif)

现在更新我们的插件，一次只允许存在一个webview视图。如果面板处于非激活状态，那`catCoding.start`命令就把这个面板激活。

```typescript
export function activate(context: vscode.ExtensionContext) {

    // 追踪当前webview面板
    let currentPanel: vscode.WebviewPanel | undefined = undefined;

    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        if (currentPanel) {
            // 如果我们已经有了一个面板，那就把它显示到目标列布局中
            currentPanel.reveal(columnToShowIn);
        } else {
            // 不然，创建一个新面板
            currentPanel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", columnToShowIn, {});
            currentPanel.webview.html = getWebviewContent('https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif');

            // 当前面板被关闭后重置
            currentPanel.onDidDispose(() => {
                currentPanel = undefined;
            }, null, context.subscriptions);
        }
    }));
}
```

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-single_panel.gif)


不论何时，如果webview的可见性改变了，或者当webview移动到了新的视图布局中，就会触发`onDidChangeViewState`。我们的插件可以利用这个时间改变布局中的webview显示的猫：

```typescript
const cats = {
    'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'Compiling Cat':'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
};

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {});
        panel.webview.html = getWebviewContent(cats['Coding Cat']);

        // 根据视图状态变动更新内容
        panel.onDidChangeViewState(e => {
            const panel = e.webviewPanel;
            switch (panel.viewColumn) {
                case vscode.ViewColumn.One:
                    updateWebviewForCat(panel, 'Coding Cat');
                    return;

                case vscode.ViewColumn.Two:
                    updateWebviewForCat(panel, 'Compiling Cat');
                    return;

                case vscode.ViewColumn.Three:
                    updateWebviewForCat(panel, 'Testing Cat');
                    return;
            }
        }, null, context.subscriptions);
    }));
}

function updateWebviewForCat(panel: vscode.WebviewPanel, catName: keyof typeof cats) {
    panel.title = catName;
    panel.webview.html = getWebviewContent(cats[catName]);
}
```
![ondidchangeview state](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-ondidchangeviewstate.gif)

#### 检查和调试webviews

在命令面板中输入**Developer: Toggle Developer Tools**能帮助你调试webview。运行命令之后会为当前可见的webview加载一个devtool：

![webview Developer Tools](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/basics-developer_tools.png)

webview的内容是在webview文档中的一个iframe中的，用开发者工具检查和修改webview的DOM，在webview内调试脚本。

如果你用了webview开发者工具的console，确保你在Console面板左上角的下拉框里选中了当前**激活窗体**环境：
![debug-active-frame](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/debug-active-frame.png)

**激活窗体**环境是webview脚本执行的地方，另外，**Developer: Reload Webview**命令会刷新所有已激活的webview。如果你需要重置一个webview的状态，这个命令会非常有用，或者你想要读取硬盘内容的webview更新一下，也可以使用这个方法。

## 加载本地内容
---

webview运行在独立的环境中，因此不能直接访问本地资源，这是出于安全性考虑的做法。这也意味着要想从你的插件中加载图片、样式等其他资源，或是从用户当前的工作区加载任何内容的话，你必须使用webview中的`vscode-resource:`协议。

`vscode-resource:`协议就像`file:`协议一样，不过它只允许访问本地文件。和`file:`一样的是，`vscode-resource:`只能从绝对路径中加载资源。

想想一下，我们想要从本地把喵喵们的gif打包进来，而不是从Giphy（国外出名的gif收集站）里加载进来。要想做到这点，我们首先给本地文件新建一个URI，然后用`vscode-resource:`协议更新这些URI：

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, { });

        // 获取磁盘上的资源路径
        const onDiskPath = vscode.Uri.file(path.join(extensionPath, 'media', 'cat.gif'));

        // 获取在webview中使用的特殊URI
        const catGifSrc = onDiskPath.with({ scheme: 'vscode-resource' });

        panel.webview.html = getWebviewContent(catGifSrc);
    }));
}
```

`catGifSrc`的值最后会像这样

```
vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
```

默认情况下，`scode-resource:`只能访问下列地址的资源：
- 你的插件安装的目录
- 用户当前激活的工作区

你也可以用data URI将资源直接嵌套到webview中去。

#### 控制本地资源访问

使用`localResourceRoots`选项，webview可以控制`vscode-resource:`加载的的资源。
`localResourceRoots`定义了可能被加载的本地内容的根URI。

我们用`localResourceRoots`去约束**Cat Coding**webview只加载我们插件的`media`目录下的内容：

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {
            // Only allow the webview to access resources in our extension's media directory
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'media'))
            ]
        });

        const onDiskPath = vscode.Uri.file(path.join(extensionPath, 'media', 'cat.gif'));
        const catGifSrc = onDiskPath.with({ scheme: 'vscode-resource' });

        panel.webview.html = getWebviewContent(catGifSrc);
    }));
}
```

为了禁止所有的本地资源，只要把`localResourceRoots`设为`[]`就好了。
通常来说，webview应该和加载本地资源一样严格，然而，`vscode-resource`和`localResourceRoots`并不保证百分百的安全性。请确保你的webview遵循[安全性最佳实践](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/webview.md#security)，强烈建议考虑添加一个[内容安全政策](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/webview.md#content-security-policy)以便约束之后加载的内容。

#### 给webview内容加上主题
webview可以基于当前的VS Code主题和CSS改变自身的样式。VS Code将主题分成3中类别，而且在`body`元素上加上了特殊类名以表明当前主题：
- `vscode-light`——亮色主题
- `vscode-dark`——暗色主题
- `vscode-high-contrast`——高反差主题

下列CSS改变了基于用户当前主题的webview字体颜色：
```css
body.vscode-light {
    color: black;
}

body.vscode-dark {
    color: white;
}

body.vscode-high-contrast {
    color: red;
}
```
当开发一个webview应用的时候，请保证应用能在三种主题下都可以运作，务必在高反差模式下测试你的webview，以便有视觉障碍的用户也能正常使用。

webview可以通过[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)访问VS Code主题，这些变量以`vscode`为前缀，并且用`-`替代了`.`，例如`editor.foreground`变成了`var(--vscode-editor-foreground)`：
```css
code {
    color: var(--vscode-editor-foreground);
}
```
## 脚本和信息传递
---

既然webview就像iframe一样，也就是说它们也可以运行脚本，webview中的Javascript默认是禁用的，不过我们能用`enableScripts: true`打开它。

让我们写一段脚本，追踪我们家喵星人写代码的行数。运行一个基础脚本非常的容易，但是注意这个示例只作演示用途，在实践中，你的webview应该遵循[内容安全政策](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/webview.md#content-security-policy)，禁止行内脚本。

```typescript
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {
            // 在webview中启用脚本
            enableScripts: true
        });

        panel.webview.html = getWebviewContent();
    }));
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>

    <script>
        const counter = document.getElementById('lines-of-code-counter');

        let count = 0;
        setInterval(() => {
            counter.textContent = count++;
        }, 100);
    </script>
</body>
</html>`;
}
```
![scripts-basic](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/scripts-basic.gif)

哇！真是位高产的喵主子!

!> webveiw的脚本能做到任何普通网页脚本能做到的事情，但是webview运行在自己的上下文中，脚本不能访问VS Code API。

#### 将插件的信息传递到webview

插件可以用`webview.postMessage()`将数据发送到它的webview中。这个方法能发送任何序列化的JSON数据到webview中，在webview中则通过`message`事件接受信息。

我们现在就来看看这个实现，在Cat Coding中新增一个命令来表示我们家的喵在重构他的代码（所以会减少代码总行数）。新增`catCoding.doRefactor`命令，利用`postMessage`把指示发送到webview中，webview中的`window.addEventListener('message' event => { ... })`则会处理这些信息：

```typescript
export function activate(context: vscode.ExtensionContext) {

    // 现在只有一只喵喵程序员了
    let currentPanel: vscode.WebviewPanel | undefined = undefined;

    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.One);
        } else {
            currentPanel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {
                enableScripts: true
            });
            currentPanel.webview.html = getWebviewContent();
            currentPanel.onDidDispose(() => { currentPanel = undefined; }, undefined, context.subscriptions);
        }
    }));

    // 我们新的命令
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.doRefactor', () => {
        if (!currentPanel) {
            return;
        }

        // 把信息发送到webview
        // 你可以发送任何序列化的JSON数据
        currentPanel.webview.postMessage({ command: 'refactor' });
    }));
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>

    <script>
        const counter = document.getElementById('lines-of-code-counter');

        let count = 0;
        setInterval(() => {
            counter.textContent = count++;
        }, 100);

        // Handle the message inside the webview
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            switch (message.command) {
                case 'refactor':
                    count = Math.ceil(count * 0.5);
                    counter.textContent = count;
                    break;
            }
        });
    </script>
</body>
</html>`;
```

#### 将webview的信息传递到插件中

webview也可以把信息传递回对应的插件中，用VS Code API 为webview提供的`postMessage`函数我们就可以完成这个目标。调用webview中的`acquireVsCodeApi`获取VS Code API对象。这个函数在一个会话中只能调用一次，你必须保持住这个方法返回的VS Code API实例，然后再转交到需要调用这个实例的地方。

现在我们在**Cat Coding**添加一个弹出bug的警示框：

```typescript
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {
            enableScripts: true
        });

        panel.webview.html = getWebviewContent();

        // 处理webview中的信息
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, undefined, context.subscriptions);
    }));
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>

    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            const counter = document.getElementById('lines-of-code-counter');

            let count = 0;
            setInterval(() => {
                counter.textContent = count++;

                // Alert the extension when our cat introduces a bug
                if (Math.random() < 0.001 * count) {
                    vscode.postMessage({
                        command: 'alert',
                        text: '🐛  on line ' + count
                    })
                }
            }, 100);
        }())
    </script>
</body>
</html>`;
}
```

![scripts-webview_to_extension](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/scripts-webview_to_extension.gif)

出于安全性考虑，你必须保证VS Code API的私有性，也不会泄露到全局状态中去。

## 安全性
---

每一个你创建的webview都必须遵循这些基础的安全性最佳实践。

#### 限制能力

webview应该留有它所需的最小功能集合即可。例如：如果你的webview不需要运行脚本，就不要设置`enableScripts: true`。如果你的webview不需要加载用户工作区的资源，就把`localResourceRoots`设置为`[vscode.Uri.file(extensionContext.extensionPath)]`或者`[]`以便禁止访问任何本地资源。

#### 内容安全策略
[内容安全策略]()可以进一步限制webview可以加载和执行的内容。例如：内容安全策略强制可以运行在webview中的脚本白名单，或者告诉webview只加载带`https`协议的图片。

要想加上内容安全策略，将`<meta http-equiv="Content-Security-Policy">`指令放到webview的`<head>`中

```typescript
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta http-equiv="Content-Security-Policy" content="default-src 'none';">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Cat Coding</title>
</head>
<body>
    ...
</body>
</html>`;
}
```
`default-src 'none';`策略直接禁止了所有内容。我们可以按插件需要的最少内容修改这个指令，如只允许通过`https`加载本地脚本、样式和图片：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src vscode-resource:; style-src vscode-resource:;">
```
上述策略也隐式地禁用了内联脚本和样式。把内联样式和脚本提取到外部文件中是一个非常好的实践，也不会与内容安全策略冲突。

#### 只通过https加载内容
如果你的webview允许加载外部资源，我们强烈建议你只允许通过`https`加载而不要使用http，上面的例子已经用内容安全策略展示了使用`https`的方式。

#### 审查用户输入

就像构建普通HTML页面一样，你也同样需要在webview中审查用户输入的内容。
没有审查输入内容可能会导致内容注入，也就意味着将用户置于了危险之中。

可能需要审查的值：

- 文件内容
- 文件和文件夹路径
- 用户工作区设置

可以考虑用一个辅助库去构建HTML模板，或者确保所有来自用户工作区的内容都通过了审查

只依赖审查内容的安全性是不够的，你也要遵循其他安全性的最佳实践，尽可能减少潜在的内容注入。

## 持久性
---

在webview的标准[生命周期](#生命周期)中，`createWebviewPanel`负责创建和销毁（用户关闭或者调用`.dispose()`方法）webview。而webview的内容再是在webview可见时创建的，在webview处于非激活状态时销毁。webview处于非激活标签中时，任何webview中的保留的状态都会丢失。

所以最好减少webview中的状态，取而代之用[消息传递](/extension-authoring/webview-api?id=将webview的信息传递到插件中)储存状态。

#### getState和setState

运行在webview中的脚本可以使用`getState`和`setState`方法保存和恢复JSON序列化的状态对象。这个状态可以一直保留，即使webview面板已经被隐藏，只有当它销毁时，状态则会一起销毁。

```typescript
// webview中的脚本
const vscode = acquireVsCodeApi();

const counter = document.getElementById('lines-of-code-counter');

// 检查是否需要恢复状态
const previousState = vscode.getState();
let count = previousState ? previousState.count : 0;
counter.textContent = count;

setInterval(() => {
    counter.textContent = count++;
    // 更新已经保存的状态
    vscode.setState({ count })
}, 100);
```

`getState`和`setState`是用来保存状态的比较好的办法，因为他们的性能消耗要远低于`retainContextWhenHidden`。

#### 序列化

使用`WebviewPanelSerializer`之后，你的webview可以在VS Code关闭后自动恢复。序列化构建于`getState`和`setState`之上，只有你的插件注册了`WebviewPanelSerializer`，这个功能才会生效。

给插件的`package.json`添加一个`onWebviewPanel`激活事件，然后我们的代码喵就能在VS Code重启后继续工作了：
```json
"activationEvents": [
    ...,
    "onWebviewPanel:catCoding"
]
```
这个激活事件确保我们的插件不论VS Code何时恢复`catCoding`webview时都会启动。

然后在我们插件的`activate`方法中调用`registerWebviewPanelSerializer`注册一个新的`WebviewPanelSerializer`，这个函数负责恢复webview之前保存的内容。其中的state就是webview用`setState`设置的JSON格式的状态。
```typescript
export function activate(context: vscode.ExtensionContext) {
    // 常见设置...

    // 确保我们注册了一个序列化器
    vscode.window.registerWebviewPanelSerializer('catCoding', new CatCodingSerializer());
}

class CatCodingSerializer implements vscode.WebviewPanelSerializer {
    async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        // `state`是webview内调用`setState`保留住的
        console.log(`Got state: ${state}`);

        // 恢复我们的webview内容
        //
        // 确保我们将`webviewPanel`传递到了这里
        // 然后用事件侦听器恢复我们的内容
        webviewPanel.webview.html = getWebviewContent();
    }
}
```
在VS Code中打开一个喵喵打代码的面板，关闭后重启就能看到这个面板恢复到了之前的状态和位置。

#### 隐藏时保留上下文

如果webview的视图非常复杂，或者状态不能很快地保存和恢复，你则可以用`retainContextWhenHidden`选项，这个选项在不可见的状态中保存了webview的内容，即使webview本身不处于激活状态。

虽然**Cat Coding**说不上有很复杂的状态，不过我们可以打开`retainContextWhenHidden`看看webview的行为会发生什么变化：

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('catCoding.start', () => {
        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = getWebviewContent();
    }));
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>

    <script>
        const counter = document.getElementById('lines-of-code-counter');

        let count = 0;
        setInterval(() => {
            counter.textContent = count++;
        }, 100);
    </script>
</body>
</html>`;
}
```
![persistence-retrain](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/webview/persistence-retrain.gif)

我们可以注意到计数器没有重置，webview隐藏之后就恢复了。而且不需要多余的代码！`retainContextWhenHidden`的行为就像浏览器一样，脚本和其他内容被暂时挂起，但是一旦webview可见之后就会立即恢复。但是在webview隐藏状态下，你还是不能给它发送消息的。

虽然`retainContextWhenHidden`很吸引人，但是记住这个功能的内容占用很高，只有其他的持久化技术无能为力之时再选择这种方式。

## 下一步

如果你想了解学习更多VS Code扩展性的内容，请查看下列主题：
- [扩展Visual Studio Code](/extensibility-reference/overview.md) - 其他扩展VS Code的方式
- [其他插件示例](/extension-authoring/samples.md) - 我们的插件项目示例列表