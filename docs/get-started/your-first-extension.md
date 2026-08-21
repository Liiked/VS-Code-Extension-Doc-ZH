# 你的第一个插件

在本小节中，我们会教你一些基础概念，请先安装好[Node.js](https://nodejs.org/en/)和[Git](https://git-scm.com/)

然后安装[Yeoman](http://yeoman.io/)和[VS Code Extension Generator](https://www.npmjs.com/package/generator-code)来创建一个可用于开发的 JS 或者 TS 项目：

- 如果你只是想临时用一下 Yeoman，请使用下列命令
```bash
npx --package yo --package generator-code -- yo code
```

- 如果你希望在全局重复使用 Yeoman，请使用下列命令

```bash
npm install --global yo generator-code

yo code
```

对于 Typescript 项目，请填写以下表单：

```bash
# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? HelloWorld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Initialize a git repository? Y
# ? Which bundler to use? unbundled
# ? Which package manager to use? npm

# ? Do you want to open the new folder with Visual Studio Code? Open with `code`
```

完成后进入 VS Code，按下`F5`，你会立即看到一个**扩展开发宿主**窗口，其中就运行着插件。

在命令面板(`Ctrl+Shift+P`)中输入`Hello World`命令。

<video loop muted playsinline controls>
  <source src="https://code.visualstudio.com/assets/api/get-started/your-first-extension/launch.mp4" type="video/mp4">
</video>

如果你看到了`Hello World from HelloWorld!`提示弹窗，恭喜你成功了！

如果你在命令面板中没有看到`Hello World`命令，请检查 `package.json` 中的 `engines.vscode` 版本是否与当前安装的 VS Code 版本一致。

## 开发插件

现在让我们稍稍改动一下弹窗显示的内容：

1. 将项目文件`extension.ts`中的`Hello World from HelloWorld!`改为`Hello VS Code`
2. 重新加载开发窗口（命令为 **Developer: Reload Window**）
3. 再次运行`Hello World`命令

你应该就能看到显示的消息更新了：

<video loop muted playsinline controls>
  <source src="https://code.visualstudio.com/assets/api/get-started/your-first-extension/reload.mp4" type="video/mp4">
</video>

请浏览你的项目目录和代码，然后进行下面的小练习：

- 为命令面板中的`Hello World`换一个名字
- [配置](/references/contribution-points)一个新的命令：打开一个提示弹窗，显示当前时间。配置点是[插件清单](/references/extension-manifest)`package.json`中用于拓展 VS Code 的静态声明。
- 用显示警告信息的[VS Code API](/references/vscode-api)`vscode.window.showInformationMessage`替换原本的文本

## 调试插件

VS Code 内置的调试功能已经非常方便了，在代码序号的左侧空白处点击一下，VS Code 就会设下断点，进入调试模式后将鼠标悬停于变量上显示变量值，或是在调试侧边栏中检查变量值，此时，你还可以用**调试控制台**直接对表达式求值。

<video loop muted playsinline controls>
  <source src="https://code.visualstudio.com/assets/api/get-started/your-first-extension/debug.mp4" type="video/mp4">
</video>

有关 Node.js 调试的部分，请参考[Node.js 调试](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)部分。

## 下一步

在下个主题[解析插件结构](/get-started/extension-anatomy)中，我们会大致看一下`Hello World`示例的源码，然后解释一些关键的概念。

本节教程的源码可参考[https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)。
此外，[插件指引](/extension-guides)章节还包含其他示例代码，每个例子都对应着不同的 VS Code Api 和发布内容配置。

#### 使用 Javascript

在本指南中，我们主要使用 TypeScript 开发 VS Code 插件，因为我们认为 TS 是开发插件的最佳实践。如果你想使用 JS，我们也同样提供了源码[helloworld-minimal-sample](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-minimal-sample)

#### 交互指南
你也可以适时使用我们的[交互指南](/ux-guidelines)，使用VS Code中的最佳实践来设计插件的交互界面