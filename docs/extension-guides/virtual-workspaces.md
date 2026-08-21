
# 虚拟工作区

像 [GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) 这样的插件会基于一个或多个由[文件系统供应器](/extension-guides/virtual-documents#file-system-api)支撑的文件夹打开 VS Code。当插件实现了文件系统供应器后，工作区资源可能不在本地磁盘上，而是**虚拟的**，位于服务器或云端，编辑操作也在那里进行。

这种配置称为**虚拟工作区**。当 VS Code 窗口中打开虚拟工作区时，会在左下角的远程指示器中显示一个标签，与其他[远程开发](/docs/remote/remote-overview)窗口类似。

![远程指示器](https://code.visualstudio.com/assets/api/extension-guides/virtual-workspaces/remote-indicator.png)

并非所有插件都能处理虚拟资源，有些插件可能要求资源位于磁盘上。一些插件使用的工具依赖磁盘访问、需要同步的文件访问，或者缺乏必要的文件系统抽象。在这些情况下，处于虚拟工作区时，VS Code 会向用户提示：他们正运行在受限模式下，部分插件已被停用，或只能以有限的功能运行。

一般来说，用户希望尽可能多的插件能在虚拟工作区中运行，并在浏览和编辑远程资源时获得良好的用户体验。本指南介绍插件如何针对虚拟工作区进行测试，说明为使其在虚拟工作区中运行所需进行的修改，并介绍 `virtualWorkspaces` 能力属性。

让插件适配虚拟工作区，也是在 [VS Code for the Web](/docs/remote/vscode-web) 中良好运行的重要一步。VS Code for the Web 完全运行在浏览器中，由于浏览器沙箱的限制，工作区是虚拟的。更多细节参见 [Web 插件](/extension-guides/web-extensions) 指南。

## 我的插件是否受影响？

当插件没有可执行代码，纯粹是声明式的（如主题、键绑定、代码片段或语法插件）时，它可以运行在虚拟工作区中，无需任何修改。

带有代码的插件（即定义了 `main` 入口点的插件）需要检查，并且可能需要修改。

## 在虚拟工作区中运行你的插件

安装 [GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) 插件，并从命令面板运行 **Open GitHub Repository...** 命令。该命令会显示一个 Quick Pick 下拉框，你可以粘贴任何 GitHub URL，或者选择搜索特定的仓库或拉取请求。

这会打开一个虚拟工作区的 VS Code 窗口，其中所有资源都是虚拟的。

## 检查插件代码是否已为虚拟资源做好准备

VS Code 对虚拟文件系统的 API 支持已经存在相当长一段时间了。你可以查阅[文件系统供应器 API](/extension-guides/virtual-documents#file-system-api)。

文件系统供应器为一个新的 URI scheme 注册（例如 `vscode-vfs`），该文件系统上的资源将使用该 scheme 的 URI 表示（`vscode-vfs://github/microsoft/vscode/package.json`）

检查你的插件如何处理从 VS Code API 返回的 URI：

* 不要假设 URI scheme 是 `file`。`URI.fsPath` 只有在 URI scheme 为 `file` 时才能使用。
* 注意 `fs` node 模块用于操作文件。如果可以的话，请使用 `vscode.workspace.fs` API，它会委托给相应的文件系统供应器。
* 检查第三方组件是否依赖了 `fs`（例如语言服务器或 node 模块）。
* 如果你命令去运行可执行文件或者任务，请检查这些命令在虚拟工作区窗口中是否有合理，以及是否应该禁用它们。

## 声明你的插件是否能处理虚拟工作区

`package.json` 中 `capabilities` 下的 `virtualWorkspaces` 属性用于声明插件是否能与虚拟工作区一起工作。

### 不支持虚拟工作区

下面的示例声明插件不支持虚拟工作区，在这种配置下不应由 VS Code 启用。

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

### 部分支持和完整支持虚拟工作区

当插件能与虚拟工作区一起工作或部分工作时，应定义 `"virtualWorkspaces": true`。

```json
{
  "capabilities": {
    "virtualWorkspaces": true
  }
}
```

如果插件可以工作，但功能有限，它应向用户说明这个限制：

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

该描述会显示在扩展视图（Extensions view）中：

![扩展视图](https://code.visualstudio.com/assets/api/extension-guides/virtual-workspaces/extensions-view.png)

然后，插件应按下面的说明，禁用虚拟工作区中不支持的功能。

### 默认

对于所有尚未填写 `virtualWorkspaces` 能力的插件，`"virtualWorkspaces": true` 是默认值。

不过，在测试虚拟工作区时，我们整理了一份我们认为应该在虚拟工作区中禁用的插件列表。
该列表可以在 [issue #122836](https://github.com/microsoft/vscode/issues/122836) 中找到。这些插件的默认值是 `"virtualWorkspaces": false`。

当然，插件作者更有资格做出这个决定。插件 `package.json` 中的 `virtualWorkspaces` 能力会覆盖我们的默认值，我们最终也会停用这份列表。

## 打开虚拟工作区时禁用功能

### 禁用命令和视图配置

命令、视图以及许多其他配置的可用性，可以通过 [when 子句](/references/when-clause-contexts)中的上下文键来控制。

当所有工作区文件夹都位于虚拟文件系统上时，会设置 `virtualWorkspace` 上下文键。下面的示例仅在不处于虚拟工作区时，才在命令面板中显示 `npm.publish` 命令：

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

`resourceScheme` 上下文键会设置为文件资源管理器中当前选中元素或编辑器中打开元素的 URI scheme。

在下面的示例中，仅当底层资源位于本地磁盘时，`npm.runSelectedScript` 命令才会显示在编辑器上下文菜单中。

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

### 以编程方式检测虚拟工作区

要检查当前工作区是否包含非 `file` 协议且为虚拟工作区，可以使用以下源代码：

```ts
const isVirtualWorkspace = 
workspace.workspaceFolders &&
workspace.workspaceFolders.every(f => f.uri.scheme !== 'file');
```

## 语言插件与虚拟工作区

### 在虚拟工作区的提供语言支持需要些什么？

要求所有插件都能完全处理虚拟资源并不现实。许多插件使用的外部工具需要同步的文件访问和磁盘上的文件。因此，只提供有限的功能是可以接受的，例如下面列出的**基础**（Basic）和**单文件**（Single-file）支持。

A. **基础**语言支持：

* TextMate 分词和着色
* 特定语言的编辑支持：括号对、注释、回车规则、折叠标记
* 代码片段

B. **单文件**语言支持：

* 文档符号（大纲）、折叠、选择范围
* 文档高亮、语义高亮、文档颜色
* 补全、悬停、签名帮助、基于当前文件符号和静态语言库的查找引用/声明
* 格式化、关联编辑
* 语法验证和同文件语义验证以及代码操作（Code Actions）

C. **跨文件、感知工作区**的语言支持：

* 跨文件引用
* 工作区符号
* 对工作区/项目中所有文件的验证

VS Code 自带的丰富语言插件（TypeScript、JSON、CSS、HTML、Markdown）在处理虚拟资源时，仅限于单文件语言支持。

### 禁用语言插件

如果在单个文件上工作不可行，语言插件也可以决定在虚拟工作区中禁用该插件。

如果你的插件同时提供语法和需要被禁用的丰富语言支持，那么语法也会被禁用。为避免这种情况，你可以创建一个与丰富语言支持分离的基础语言插件（语法、语言配置、代码片段），从而拥有两个插件。

* 基础语言插件的 `"virtualWorkspaces": true`，提供语言 ID、配置、语法和代码片段。
* 丰富语言插件的 `"virtualWorkspaces": false`，包含 `main` 文件。它贡献语言支持和命令，并对基础语言插件有插件依赖（`extensionDependencies`）。丰富语言插件应保留既有插件的插件 ID，这样用户只需安装一个插件即可继续拥有完整功能。

你可以在内置语言插件中看到这种方法，例如 JSON，它由一个 JSON 插件和一个 JSON 语言功能插件组成。

这种分离也有助于 [不受信任的工作区](/extension-guides/workspace-trust) 在[受限模式](/docs/editor/workspace-trust#restricted-mode)下运行。丰富语言插件通常需要信任，而基础语言功能可以在任何配置下运行。

### 语言选择器

为语言功能（例如补全、悬停、代码操作等）注册供应器时，请确保指定供应器支持的 schemes：

```ts
return vscode.languages.registerCompletionItemProvider({ language: 'typescript', scheme: 'file' }, {
  provideCompletionItems(document, position, token) {
    // ...
  }
});
```

### 语言服务器协议（LSP）对访问虚拟资源的支持情况如何？

正在进行的相关工作将为 LSP 添加文件系统供应器支持。跟踪进度可查看语言服务器协议 [issue #1264](https://github.com/microsoft/language-server-protocol/issues/1264)。
