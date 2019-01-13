# 你的第一个插件

在本小节中，我们会教你一些基础的概念，请你先安装好[Node.js](https://nodejs.org/en/)和[Git](https://git-scm.com/)，然后安装[Yeoman](http://yeoman.io/)和[VS Code Extension Generator](https://www.npmjs.com/package/generator-code)：

```bash
npm install -g yo generator-code
```
这个脚手架会生成一个可以马上开发的项目。运行生成器，然后填好下列字段：

```bash
yo code

# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? HelloWorld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Enable stricter TypeScript checking in 'tsconfig.json'? Yes
# ? Setup linting using 'tslint'? Yes
# ? Initialize a git repository? Yes
# ? Which package manager to use? npm

code ./helloworld
```

完成后进入编辑器，按下`F5`，这会立马在一个新的**插件发开主机**窗口中运行插件。

在命令面板(`Ctrl+Shift+P`)中输入`Hello World`命令。

<video loop muted playsinline controls>
  <source src="https://code.visualstudio.com/api/get-started/your-first-extension/launch.mp4" type="video/mp4">
</video>

请浏览你的项目目录和代码，然后进行下面的小练习：
- 为命令面板中的`Hello World`换一个名字
- 配置一个新的命令：打开一个信息提示，显示当前时间
- 用显示警告信息的VS Code API替换`vscode.window.showInformationMessage`