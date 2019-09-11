# 发布插件

## vsce —— 发布工具参阅

[vsce](https://github.com/Microsoft/vsce)是一个用于将插件发布到[市场](https://code.visualstudio.com/docs/editor/extension-gallery)上的命令行工具。

## 安装

---

请确认本机已经安装了[Node.js](https://nodejs.org/)，然后运行：

```bash
npm install -g vsce
```

## 使用

---

然后你就可以在命令行里直接使用`vsce`了。下面是一个快速发布的示例（在你登录和打包好插件之后）:

```bash
$ vsce publish
Publishing uuid@0.0.1...
Successfully published uuid@0.0.1!
```

更多可用的命令参数，请使用`vsce --help`

## 发布教程

---

!> **注意：** 出于安全考虑，`vsce`不会发布包含用户提供 SVG 图片的插件。

发布工具会检查以下内容：

- `pacakge.json`文件中的 icon 不可以是 SVG。
- `pacakge.json`中的徽章不可以是 SVG，除非来自于[可靠的图标来源](/extensibility-reference/extension-manifest.md#使用认证过的标志)
- `README.md`和`CHANGELOG.md`中的图片链接需要使用`https`协议
- `README.md`和`CHANGELOG.md`中的图片不可以是 SVG，除非来自[可靠的图标来源](/extensibility-reference/extension-manifest.md#使用认证过的标志)

---

VS Code 插件市场的服务是[Visual Studio Team Services](https://visualstudio.microsoft.com/team-services)提供的，因此验证、代理、管理插件都是由这个服务提供的。

`vsce`只能用[Personal Access Tokens](https://docs.microsoft.com/vsts/integrate/get-started/authentication/pats)发布插件，所以至少要创建一个 Token 以便发布插件。

#### 获取 Personal Access Token

首先，你得有一个[Azure DevOps 组织](https://docs.microsoft.com/azure/devops/organizations/accounts/create-organization-msa-or-work-student)。

下面的例子里，我们假设组织名为`vscode`，从你的组织主页（例如：`https://dev.azure.com/vscode` ）进入**安全（Security）**页面：

![publishers1](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/publishing-extension/token1.png)

选择 Personal Access Token，点击**New Token**创建一个新的 Personal Access Token

![publishers2](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/publishing-extension/token2.png)

给 Personal Access Token 添加描述，过期时间等等，你最好把过期时间设置为 1 年，这样你接下就能方便很多，选择**custom defined（用户自定义）**范围，然后点击**Show all scopes(显示全部)**

![publishers3](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/publishing-extension/token3.png)

最后，在这个列表中找到**Marketplace**，并勾选**Acquire**和**Manage**

![publishers4](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/publishing-extension/token4.png)

点击**Create**，你就会看到新创建的 Personal Access Token 了，复制好，你接下来就会用到这个 token 来创建一个*发行方*了。

#### 创建一个发行方

**发行方**是 VS Code 市场有权发布插件的唯一标识，每个插件的[package.json](/extensibility-reference/extension-manifest.md)文件都包含着`publisher`字段。

现在我们已经有了[Personal Access Token](#获取Personal-Access-Token)，我们马上可以用`vsce`创建一个发行方：

```bash
vsce create-publisher (publisher name)
```

`vsce`会记住这个 Personal Access Token，日后你需要再次使用的时候会自动带上。

?> 注意：另外，你也可以在市场的发行方[管理页](https://marketplace.visualstudio.com/manage)中创建发行方，然后用这个账号登录`vsce`。

#### 发行方登录

如果你已经有发行方账号了：

```bash
vsce login (publisher name)
```

和`create-publisher`命令类似地，`vsce`会要求输入你的 Personal Access Token。

你也可以用命令参数`-p <token>`直接登录然后立即发布插件：

```bash
vsce publish -p <token>
```

#### 增量更新插件版本

用 SemVer 语义标识符：`major`，`minor`，`patch`增量更新插件版本号。

例如，你想把插件从 1.0.0 更新到 1.1.0，那么加上`minor`：

```bash
vsce publish minor
```

插件`package.json`的 version 会先更新，然后才发布插件。

你也可以通过命令行指定版本号：

```bash
vsce publish 2.0.1
```

#### 下架插件

通过指定插件 id`publisher.extension`下架插件：

```
vsce unpublish (publisher name).(extension name)
```

!> **注意：**当你下架插件的时候，市场会移除所有插件的历史统计数据，请在下架前再三考虑，最好还是更新插件吧。

#### 插件打包

你也可能只是想打包一下插件，而不是发布到商店里。用下列命令将插件打包到`.vsix`文件中：

```
vsce package
```

这个命令会在当前目录生成一个`.vsix`文件，直接从`.vsix`安装插件是允许的，查看[从 VSIX 安装插件](https://github.com/Microsoft/vscode-docs/blob/master/docs/editor/extension-gallery.md#install-from-a-vsix)了解更多内容。

#### VS Code 版本兼容性

当你制作插件的时候，你需要描述插件对 VS Code 的版本兼容性——修改`package.json`中的`engines.vscode`：

```json
{
  "engines": {
    "vscode": "^1.8.0"
  }
}
```

`1.8.0`表示你的插件只能兼容`1.8.0`版本的 VS Code，`^1.8.0`则表示你的插件向上兼容，包括`1.8.1, 1.9.0`等等。

使用`engines.vscode`可以确保插件安装环境包含了插件依赖的 API。这个机制在稳定版和 Insider 版本都适用。

现在我们假设最新的稳定版 API 是`1.8.0`，而`1.9.0`引入了新的 API，所以你可以用`1.9.0-insider`标识插件在 Insider 版中也可正常使用。
如果你想使用这些刚刚引入的 API，则将依赖版本设置为`^1.9.0`，你的插件则只能安装在`>=1.9.0`的 VS Code 上，也就意味着所有当前的 Insider 版本都可以用得上，而稳定版只有在更新到`1.9.0`才能使用你的插件。

## 进阶用法

---

#### 符合市场的插件

你可以自定义插件在市场中的外观，查看示例[GO 插件](https://marketplace.visualstudio.com/items/ms-vscode.Go)。

下面是一些让你的插件在市场看起来更酷的小提示：

- 插件根目录下面的`README.md`文件可以用来填充插件市场的页面内容。`vsce`会将 README 中的链接通过下面两种方式修改掉：
  - 如果你的`package.json`的`repository`字段是一个 Github 仓库，`vsce`会自动检测，然后相应地调整链接。
  - 运行`vsce package`时，加上`--baseContentUrl`和`--baseImagesUrl`标识重载上述行为。
- 插件根目录下的`LICENSE`会成为插件的 license。
- 同样的`CHANGELOG.md`文件会成为插件的发布日志。
- 通过设置`package.json`的`galleryBanner.color`hex 值，修改 banner 的背景色。
- 通过给`package.json`中的`icon`设置一个相对路径，可以将一个`128px`的 PNG 图标放进你的插件中。

- 参见[插件市场展现小提示](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-manifest.md#marketplace-presentation-tips)

#### `.vscodeignore`

创建一个`.vscodeignore`文件可以排除插件目录中的内容。这个文件支持[glob](https://github.com/isaacs/minimatch)模式，每个表达式一行。

例如：

```
**/*.ts
**/tsconfig.json
!file.ts
```

你应该忽略哪些不必在运行时用到的文件。例如：你的插件是用 Typescript 写的，那么你就应该忽略所有的`**/*.ts`文件。

?> **注意：**在`devDependencies`列出的开发依赖会被自动忽略，你不必将他们加入到`.vscodeignore`中。

##### 预发布步骤

你是可以在清单文件中添加预发布步骤的，下面的命令会在插件每次打包时执行：

```json
{
  "name": "uuid",
  "version": "0.0.1",
  "publisher": "joaomoreno",
  "engines": {
    "vscode": "0.10.x"
  },
  "scripts": {
    "vscode:prepublish": "tsc"
  }
}
```

上面的示例会在每次插件打包时调用 Typescript 编译器。

## FAQ

##### 问：当我发布插件时遇到了 403 Forbidden（或 401 Unauthorized）错误？

答：很有可能是你创建 PAT (Personal Access Token) 时没有选择`all accessible accounts`。你还需要将授权范围设置为`All scopes`，这样发布工具才能工作。

##### 问：我没办法用`vsce`工具下架插件？

答：你可能改变了插件 ID 或者发行方名称。不过你还可以在[管理页面](https://marketplace.visualstudio.com/manage)发布或者下架插件。

##### 问：为什么 vsce 不保留文件属性？

答：请注意，当你在 Windows 平台构建和发布插件的时候，所有插件包内的文件会丢失 POSIX 文件属性，或称之为执行位（executable bit）的东西。一些基于这些属性的`node_modules`依赖则会调整工作方式。从 Linux 和 macOS 平台构建则会如预期执行。

## 下一步

- [插件市场](https://code.visualstudio.com/docs/editor/extension-gallery) - 学习更多 VS Code 公共插件市场。
- [测试插件](/working-with-extensions/testing-extension.md) - 添加插件测试，提高插件质量。
