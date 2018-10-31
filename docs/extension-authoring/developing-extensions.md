# 开发插件

这个章节会详细地讲解如何插件的运行，调试和故障排除。这些技巧也同样适用于调试你从市场安装的问题应用。

## 创建你自己的插件
---
为了开发VS Code插件，VS Code本身提供了以下几个工具，帮你快速开发：
- Yeoman生成器，用脚手脚创建一个插件
- 智能补全——悬停和找到你需要的插件API
- 编译Typescript（如果用Typescript实现的话）
- 运行和调试插件
- 发布插件

我们建议你用脚手架生成基础文件，Yeoman的`yo code`命令可以完成这个工作，生成器能极大地提升你的开发体验，我们在[插件生成器](/extension-authoring/extension-generator.md)里面有详细的步骤。

!> **注意**：以下部分假设你已经掌握了`yo code`Yeoman 插件生成器，和创建`launch.json`、`task.json`的基础知识。

## 运行和调试插件
---
按下`F5`，你就可以很轻松地调试插件了。这个命令会打开一个加载了你的插件的新窗口，插件输出的信息能在`调试控制台`里找到，在这个模式下你可以打断点、一步步地调试代码，在`调试`侧边栏或者`调试控制台`（用console方法输出才可以）检查变量。

![](https://github.com/Microsoft/vscode-docs/raw/master/docs/extensions/images/developing-extensions/debug.png)

根据插件的不同，你可能需要更多关于调试适配器或者语言服务器插件的相关教程：

- [示例：语言服务器](/extension-authoring/example-language-server.md) - 学习如何实现一个语言服务器插件
- [示例：调试器](/extension-authoring/developing-extensions.md) - 通过VS Code Debug Protocol接入调试器

## 编译Typescript
如果你的插件是Typescript实现的，那你首先就要把代码编译成Javascript。
编译过程的配置如下所示：
- `tsconfig.json`定义了Typescript的编译选项。了解更多[Typescript wiki](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)或者[Typescript语言章节](https://code.visualstudio.com/docs/languages/typescript#_tsconfigjson)
- 当前Typescript编译器的版本在`node_modules`文件夹里面
- API定义在`node_modules/vscode`中

运行插件前，Typescript编译器会被触发。`.vscode/launch.json`中的`preLaunchTask`属性定义了这项工作，在调试会话启动前会先启动这个配置好的任务。

如果你的插件在很久之前就编译好了，比如依赖于`0.1.0`ts版本，而`2.0.0`已经老早就出来了，那么通过下列步骤来升级你的插件：

```json
// 访问 https://go.microsoft.com/fwlink/?LinkId=733558
// 查看更多关于tasks.json格式的内容
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "npm",
            "script": "watch",
            "problemMatcher": "$tsc-watch",
            "isBackground": true,
            "presentation": {
                "reveal": "never"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

将下列设置添加到*settings.json*中


```json
  // 关边tsc的自动检测任务，因为我们在添加了npm脚本
    "typescript.tsc.autoDetect": "off"
```

确保*launch.json.*中引用了正确的*预运行任务*：
```json
"preLaunchTask": "npm: watch"
```
?> **注意：**Typescript编译器运行在watch模式下，所以任何文件变动都会自动编译

## 加载你的插件
你的插件会加载在`插件开发环境`的新窗口中。用`extensionDevelopmentPath`命令行也可以达到同样的效果，这个选项告诉VS Code去哪里查找新的插件：

```bash
code --extensionDevelopmentPath=_my_extension_folder
```

一旦插件环境加载完毕，VS Code就会把调试器附加上去，然后启动调试会话。

下面是按下`F5`之后的会发生的事情：

1. `.vscode/launch.json`指示VS Code先运行一个叫做`npm`的任务
2. `.vscode/tasks.json`定义了`npm`任务，其实就是`npm run compile`的脚本命令
3. `package.json`定义`compile`为`tsc -watch -p ./`
4. 然后会调用node_modules文件夹下的Typescript编译器，然后生成`out/extension.js`和`out/extension.js.map`
5. Typescript编译成功之后，生成`code --extensionDevelopmentPath=${workspaceFolder}`进程
6. 加载运行在**扩展环境**下的第二个VS Code实例，它会搜寻`${workspaceFolder}`下的插件

## 修改你的插件

你可以在VS Code状态栏的左侧观察Typscript编译器的进度，在状态栏中你也可以找到编译的错误和警告。当编译通过之后，你必须重启**扩展开发环境**才能查看到你的修改。重启扩展开发环境有两种可选的方式：

- 在调试面板中按下`重启`
- 在插件开发环境中按`Ctrl+R`（macOS：Cmd+R）

## 分析你的插件

你可以用Chrome DevTool内存和CUP分析工具分析你的插件。

跟我做：
1. 在命令行中带上`--inspect-extensions=<port>`标识，启动你的VS Code，比如：`code --inspect-extensions=9333`
2. 在VS Code的**命令面板(`Shfit + Cttl+ P`)**中选择并打开**Developer: Toggle Developer Tools**
3. 在打开的DevTool中查看`Console`标签，找到`Debugger listening on port 9333`开头的`chrome-devtools`链接信息
4. 打开你自己的Chrome浏览器，输入该链接，然后会进入DevTool提供的专用调试环境
5. 使用内存和CPU分析器，了解内存和计算资源的使用情况

![chrome-devtools](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/developing-extensions/chrome-devtools.png)

## 问题追踪

当你自己的的插件或者市场上的插件出现问题时，你可以参考这些建议进行问题追踪：

#### 禁用插件，启动VS Code

通过`--disable-extensions`命令行，禁用VS Code会话中的所有插件。这个方式可以帮你逐步缩小问题范围——到底是插件问题，还是VS Code本身的问题。

```bash
code --disable-extensions
```
#### 使用开发工具控制台

如果你安装的插件不能正常工作，第一步工作最好是先检查一下VS Code**开发者工具**的Console面板。插件作者可能在开发插件的时候已经添加了一些日志——VS Code 运行于Electron之上，所以你可以通过Chrome**开发者工具**获得有力的支持。

通过**帮助**>**切换开发人员工具**（Windows/Linux：`Ctrl + Shift + I`，macOS：`Cmd + Shift + I`）打开**开发工具**然后选择**Console**标签。试着运行插件的功能，检查Console的输出。你可以使用`console.log`输出各类信息以及VS Code扩展环境抛出的详细异常。

?> **开发者小贴士：**当你制作插件的时候，请为用户提供有用的日志信息，你给用户的信息越多，用户越能够独立地解决问题。好的日志也同样能帮你快速地找到真正的问题所在。

#### 重装插件

有时候安装插件会失败或者报错，所以任何插件不能正常工作的时候，你都可以尝试卸载然后重装插件的方式来解决。VS Code提供了一个非常方便的命令**Developer: Reinstall Extension**，输入这串命令之后，你可以在下拉框里选择你要重装的插件，最后按照指示重载VS Code就好了。

#### 查看插件的README

为了正常运行，有些插件会有一些其他的依赖，比如独立的语法检查器、编译器、自定义的配置文件等。因此在侧边栏**插件**中点击某个插件后显示的**插件详情**页面会非常有用，它就是插件的**README**，其中可能包含了插件的配置和使用方式。

## FAQ

**问：我怎么在插件里使用VS Code新版本引入的API？**

答：如果你想用最新的VS Code API，你可以在插件的`package.json`中的`engines`声明你想要用的引擎版本。

步骤如下：

- 在`package.json`中的`engines`字段设置你的插件所需要的最低VS Code版本
- 在`package.json`中添加`postinstall`脚本：
    ```json
    "scripts": {
        "postinstall": "node ./node_modules/vscode/bin/install"
    }
    ```
- 在你的插件根目录下输入`npm install`
- `vscode`模块根据`engine`中声明的版本下载对应的`vscode.d.ts`
- 回到VS Code，用代码补全验证是否出现了你想要的API提示

## 下一步

- [测试你的插件](/extension-authoring/testing-extensions.md) - 学习如何写单元测试和集成测试。
- [发布工具](/extension-authoring/publish-extension.md) - 用vsce命令行工具发布你的插件。
- [插件配置清单](/extensibility-reference/extension-manifest.md) - VS Code插件清单文件参阅。
- [插件API](/extensibility-reference/vscode-api.md) - 学习更多VS Code扩展性API。