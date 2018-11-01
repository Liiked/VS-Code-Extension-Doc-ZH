# 插件生成器

## 预先准备
你需要安装Node.js，并配置好`$PATH`。Node.js安装好之后通常会包含npm——Node.js的包管理器，也就是我们马上要用来安装插件生成器的东西。

## 安装生成器
---
在终端（windows环境下为cmd, powershell）输入
```bash
npm install -g yo generator-code
```

#### 运行Yo Code😎

听起来好像有点啰嗦？我们马上就开始了，将下列命令输入到终端：
```bash
yo code
```
![run yo code](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/yocode/yocode.png)

!> 注意：yo code会根据最新的vscode版本生成发开目录，如果遇到运行失败的问题，请检查`package.json`中`engines.vscode`的版本号是否与您当前的vscode一致

## 生成器选项
---
> Yeoman生成器能帮你创建一个新插件的骨架，也可以基于已有的TetMate配置文件创建一个开箱即用的语言、主题或者片段。

#### 新插件（TypeScript）
我们接下来要创建一个"hello world"项目作为本节示例，请：
- 输入插件名称，在当前目录下生成同名文件夹
- 新建几个基础文件夹，source，test，output
- 模板生成器会创建`package.json`和一些基本文件
- 新建`launch.json`和`tasks.json`，以便到时候按F5能debugger代码
- （可选）生成Git仓库

创建好之后，用vscode打开这个文件夹，查看`vsc-extension-quickstart.md`，你就知道接下来要干什么了。

#### 新插件（JavaScript）
和上面的过程一样，不过是用JavaScript语言。

#### 新主题
基于已有的TextMate文件生成主题插件，或者直接来个全新的。
- 推荐你使用已有的基础样式生成新的主题。
- 根据`.tmTheme`文件生成一个新主题。

接下来：
- 输入主题名称，同时会生成对应的色彩主题名称(light/dark)。
- 输入插件名称，创建同名的项目文件夹。

同样，一旦你都做完了这些事情，去查看目录下的`vsc-extension-quickstart.md`吧。
#### 新的语法高亮
生成一个色彩高亮插件
- 输入已有的TextMate文件（.tmLanguage，.plist，.json），文件会自动导入到新插件中。如果你需要用新的语法创建高亮，把名字留空就行了。
- 输入插件名称，你就能得到一个同名文件夹。

#### 新的代码片段
- 输入包含TextMate snippets (.tmSnippet) 或者 Sublime snippets (.sublime-snippet)的文件夹目录，这些文件待会会自动转为vscode代码片段。
- 选择需要激活的编程语言
- 输入插件名称，得到同名项目文件夹

然后继续去看`vsc-extension-quickstart.md`咯

#### 新的插件包
用你喜欢的插件创建一个插件包
- 输入已经安装的插件名称，加入到你的插件包里
- 输入插件名称，得到同名项目文件夹

## 我的插件目录在哪？
---
每个操作系统的插件目录都不一样，你可能会用到的。

``` bash
Windows %USERPROFILE%\.vscode\extensions
macOS ~/.vscode/extensions
Linux ~/.vscode/extensions
```
如果你需要在每次vscode运行时加载插件，把你的项目复制到`.vscode/extensions`目录下。如：`~/.vscode/extensions/myextension`


## FAQ
---
**问: 为什么`yo code`在我的windows 10上无法识别键盘方向键？**

![yo-workaround](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/yocode/yo-workaround.png)

答： 如果方向键没有任何反应，可以试试在管理员权限下运行终端。

## 下一步
- [发布工具](/extension-authoring/publish-extension)
- [Hello World](/extension-authoring/example-hello-world)
- [其他例子](/extension-authoring/samples)