# 虚拟工作区

像 [GitHub Repositories]() 这样的插件会在 VS Code 后台中打开1个或多个 [文件系统供应器]()。当插件实现了文件系统供应器时，工作区的资源可能是完全**虚拟**的，它压根不位于本地磁盘。它实际可能在服务或云上，编辑行为也会在其之上运行。

这个配置叫做 **虚拟工作区**。当 VS Code 窗口打开一个虚拟工作区时，像其他的 [远程开发]() 窗口一样，在左下角显示*远程指示器*的位置上展示出来。

![remote-indicator](https://code.visualstudio.com/assets/api/extension-guides/virtual-workspaces/remote-indicator.png)

不过并非所有插件都可以在虚拟资源上运行，比如依赖磁盘资源的插件就做不到。有些插件所使用的工具可能非常依赖磁盘访问权限、同步磁盘访问或是没有实现文件系统抽象（文件系统供应器）。这些场景中，如果VS Code 处于虚拟工作区状态，它会告诉用户插件正运行在受限模式中——有些插件可能没有激活或者只启动了部分功能。

总之，用户希望虚拟工作区也有良好的浏览和编辑远程资源的体验，就需要运行尽可能多的插件。本篇指南会展示插件如何在虚拟工作区中测试，它们那些部分需要修改，并介绍 `virtualWorkspaces` 的功能属性。

将插件修改为可在虚拟工作区中运行，也是 [VS Code for the Web]() 非常重要的第一步。Web 中的 VS Code 完全运行在浏览器中，它们的工作区由于采用了浏览器沙箱，因此也是虚拟的。你可以从 [Web 插件]() 中了解更多信息。

## 我的插件受到影响了吗？

如果你的插件是纯声明式的，像主题、键位绑定、代码片段或者语法高亮等插件，没有任何需要执行的代码，那就什么都不用改。

如果插件中包含了使用了 `main` 入口进行编程和调试，那么很可能就需要调整了。

## 在虚拟工作区中运行你的插件

安装 [GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) 插件，然后通过命令面板运行 **Open GitHub Repository...** 命令。这个命令会弹出一个快速选择器，在输入框中粘贴任何 GitHub URL，或者搜索你想要的仓库或合并请求。

然后 VS Code 就会打开一个虚拟工作区，这里所有的资源都是虚拟的。

## 检查插件代码是否可使用虚拟资源

VS Code API 支持虚拟文件系统有一段时间了，你可以先看下 [文件系统供应器 API](https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api)。

使用全新的 URI 协议（比如 `vscode-vfs`）注册文件系统供应器函数，该文件系统内的资源会通过 URI 协议来表示（比如 `vscode-vfs://github/microsoft/vscode/package.json`）

现在我们来看下你的插件应该如何处理 VS Code API 返回的 URI：

- 千万不要想着 URL协议 会是 `file` 格式。`URI.fsPath` 只有当 URI 协议是 `file` 时才可用。
- 需要操作文件系统时，请查看 `fs` 模块的用法。条件允许的话，请使用 `vscode.workspace.fs` API，它对文件操作系统供应器进行了适当的封装。
- 请检查依赖 `fs` 的第三方组件（比如所依赖的语言服务器或 node 包）
- 如果你通过命令的方式运行了可执行程序或任务，请检查这些命令是否能在虚拟工作区中可用，如果不行，请禁用它们

## 告知你的插件是否可以在虚拟工作区中运行

`package.json` 中的 `capabilities` 下的 `virtualWorkspaces` 属性可用于提示插件是否可在虚拟工作区中运行。

### 不支持虚拟工作区

该例子中演示了插件如果不支持虚拟工作区，VS Code 会禁用它。

```json
{
  "capabilities": {
    "virtualWorkspaces": {
      "supported": false,
      "description": "Debugging is not possible in virtual workspaces."
    }
  }
}
```

### 部分或完整支持虚拟工作区

插件如果可以支持部分能力或能够完整支持虚拟工作区，那么它应配置 `"virtualWorkspaces": true`

```json
{
  "capabilities": {
    "virtualWorkspaces": true
  }
}
```

但还有种情况是插件正常运行，但是插件本身的部分功能会受限，那么它也应该为用户提供受限解释：

```json
{
  "capabilities": {
    "virtualWorkspaces": {
      "supported": "limited",
      "description": "In virtual workspaces, resolving and finding references across files is not supported."
    }
  }
}
```

这个说明会像下面这样展示在插件视图中：

![Extensions view](https://code.visualstudio.com/assets/api/extension-guides/virtual-workspaces/extensions-view.png)

插件应该像上述图片中一样在虚拟工作区中禁用相应的功能。


### 默认

`"virtualWorkspaces": true` 是所有没有填写 `virtualWorkspaces` 插件的默认配置。

不过，在测试虚拟工作区时，我们提出了一个我们认为应该被禁用的插件清单，这个清单在 [issue #122836](https://github.com/microsoft/vscode/issues/122836) 中。这些插件的默认配置是 `"virtualWorkspaces": false`。

当然，插件创作者可以更好地作出决定。插件中的 `package.json` `virtualWorkspaces` 配置会覆盖我们的默认值，希望能最终从我们的清单中消失。

## 在虚拟工作区中关闭功能

### 禁用命令和视图配置

通过 [when 子句]() 可控制可用的命令、视图还有其他配置。

当工作区内的所有文件夹都是虚拟文件系统时，`virtualWorkspace` 为 `true` 。下例仅仅展示了 **命令面板** 中的 `npm.publish` 命令不在虚拟工作区中的配置方式

```json
{
  "menus": {
    "commandPalette": [
      {
        "command": "npm.publish",
        "when": "!virtualWorkspace"
      }
    ]
  }
}
```

在**资源管理器**选中元素，或是编辑器当前有打开的内容时，`resourceScheme` 上下文变量会设置为相应的 URI 协议。

下例中，只有当底层资源位于本地磁盘上时，`npm.runSelectedScript` 命令才会出现在编辑器上下文菜单中。

```json
{
  "menus": {
    "editor/context": [
      {
        "command": "npm.runSelectedScript",
        "when": "resourceFilename == 'package.json' && resourceScheme == file"
      }
    ]
  }
}
```

### 编程式检测虚拟工作区

想要检测当前工作区是否包含非 `file` 协议且是虚拟工作区的方法如下：

```ts
const isVirtualWorkspace =
  workspace.workspaceFolders &&
  workspace.workspaceFolders.every(f => f.uri.scheme !== 'file');
```

## 语言插件和虚拟工作区

### 在虚拟工作区中对语言支持类插件有什么要求呢？

要求所有插件都能完整支持虚拟资源明显是不现实的。许多使用外部工具的插件会需要同步文件访问权限，或是访问本地磁盘内容。因此，在这类场景中限制功能是很正常的，比如下列 **基本** 和 **单文件** 的支持级别要求如下。

A. **基本**级别语言支持
  - TextMate 词法切分和着色
  - 特定语言编辑支持：括号匹配，注释，回车规则，代码折叠标记
  - 代码片段

B. **单文件**级别语言支持
  - 文档语法符号（大纲），代码折叠，范围选择
  - 文档高亮，语义高亮，文档着色
  - 自动补全，悬停提示，标记帮助，查找基于当前文件和静态语言库符号级别的引用/声明
  - 格式化、跳转编辑
  - 语法校验和同文件中的语义校验以及 **代码操作**

C. **跨文件，工作区检测**级别语言支持
  - 跨文件引用
  - 工作区语法符号
  - 校验工作区/项目中的所有文件

VS Code 中的大量插件（TypeScript, JSON, CSS, HTML, Markdown）对虚拟资源的语言支持都仅限于 **单文件**级别。

### 禁用某个语言插件

如果无法实现 **单文件** 级别的能力，虚拟工作区中语言插件也可以决定是否直接禁用自身。

如果你的插件提供了语法（grammar）和其他语言支持能力，那么禁用时，其语法（grammar）能力也会被禁用。为避免这种情况，你可以单独创建一个基础语言插件（语法、语言配置、代码片段），将其与其他语言能力分开。

- 基本的语言插件打开 `"virtualWorkspaces": true` 配置，并且提供语言标识符，配置，语法和代码片段等功能。
- 富能力语言插件则配置 `"virtualWorkspaces": false`，并且包含 `main` 入口文件。该插件配置语言支持、命令以及对基本语言插件的依赖(`extensionDependencies`) 。富能力语言插件应与基础语言插件使用同一个插件ID，这样用户才可以通过安装一个插件获得完整的功能。

你可以在内置的语言插件中找到相应实现，比如 JSON，它就包含了一个 JSON 基本插件和一个 JSON 语言功能插件。

这种分离模式也可以让 [未受信的工作区](https://code.visualstudio.com/api/extension-guides/workspace-trust) 运行在 [严格模式](https://code.visualstudio.com/docs/editor/workspace-trust#restricted-mode) 中。富能力语言插件常常要求授信，而基础语言插件可以运行在任何配置下。

### 语言选择器

注册了语言功能的供应器函数后（比如：代码补全、悬停提示、代码操作等），请确保指明了该供应器所支持的协议：

```ts
return vscode.languages.registerCompletionItemProvider(
  { language: 'typescript', scheme: 'file' },
  {
    provideCompletionItems(document, position, token) {
      // ...
    }
  }
);
```

### 语言服务器协议(LSP)访问虚拟资源的支持如何？

这项工作还在进行中，应该会让 LSP 支持文件系统供应器。跟踪语言服务器协议的进度 [issue #1264](https://github.com/microsoft/language-server-protocol/issues/1264) 。