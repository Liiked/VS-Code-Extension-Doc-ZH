# 支持远程开发和 GitHub 代码空间

[VS Code 远程开发](https://code.visualstudio.com/docs/remote/remote-overview)允许你无缝在远程机器上开发代码。有了这项支持后，你就可以完全使用VS Code本地插件和你熟悉的方式远程工作了。[GitHub 代码空间](https://github.com/features/codespaces) 是一项预览功能，它扩展了云端编辑环境，比如浏览器中的编辑器和 VS Code。

为了保证性能，远程开发和 GitHub 代码空间都会在远程运行一些插件。当然，这对插件的运行会产生微妙的影响。大部分插件都不需要刻意去适配远程开发，如果你需要插件在所有环境中都能稳定运行，你可能需要做点功课，但一般来说，改动不会太大。

本节会介绍远程开发相关的知识，[VS Code远程开发 插件架构](#架构和插件类型)，在远程目录[测试插件](#测试和调试插件)，和[远程插件不能正常工作](#常见问题)的一些建议。大部分插件不需要改动就能适应远程开发环境，其他的插件也只要稍微改动一点就能适配远程开发了。

## 架构和插件类型
---

为了使远程开发尽力透明化，便于理解，我们可以将插件分为两类：

- **UI 插件：** 这些插件可以配置VS Code的用户界面，而且只运行在用户的本地机器上。UI插件不能直接访问工作区的文件，或者在工作区的机器上运行脚本/工具。这类插件如：主题、代码片段、语言语法、快捷键映射。
- **工作区插件：** 这类插件运行在工作区所在机器上。当运行在本地时，*工作区插件*运行在本地机器上；运行在远程项目或代码空间中时，工作区插件运行在远程机器上。工作区插件可以访问工作区的文件并提供富文本支持和多语言服务器，调试和其他复杂的操作（也包含被脚本/工具调起的文件）。不过工作区插件在自定义UI上稍有限制，你可以配置的UI组件有资源管理器，视图容器等其他UI组件。

当一个用户安装了一个插件，VS Code会基于插件类型自动让插件安装到正确的环境：UI 插件运行在VS Code的[本地插件主机](/advanced-topics/extension-host.md)中，工作区插件则运行在一个非常小的**VS Code 服务器**的**远程插件主机**中。当你打开一个Windows Subsystem for Linux(WSL)、容器、或者远程SSH主机时这个服务会自动安装（更新）。VS Code还会自动管理这个服务的启停，所以用户根本意识不到它的存在。

![architecture](https://code.visualstudio.com/assets/api/advanced-topics/remote-extensions/architecture.png)

VS Code API 会自动运行在正确的机器上（不管是本地还是远程）。但是如果你的插件使用的api不是VS Code提供的——比如运行shell脚本的Node API——当运行在远程时可能不会正常工作，因此我们建议你在所有的环境中测试一下你的插件。

## 调试插件
---

这个部分将说明如何在远程目录下测试和调试插件。在这之前，我们先看一下怎么使用本地[开发容器](https://code.visualstudio.com/docs/remote/containers)测试一个插件。本地测试容器是跨平台的，很容易部署，但是限制了访问文件系统的端口。由于只占用了非常小的OS空间，开发容器可以提供最为接近插件的真实运行环境。WSL，换句话说，就是一个典型的最小自治SSH主机。大部分场景下，你只要做小小的调整就可以解决问题了，相关主题查看[常见问题](#常见问题)。

当你学会[在远程环境安装开发版插件](#安装开发版插件)包用于测试，如果你遇到了问题，你可能会想直接在远程环境中调试插件。本章，我们会介绍如何在 [Github 代码空间](#在-github-代码空间中调试)、[本地容器](#在本地容器中调试)、[SSH 主机](#在-ssh-中调试)、[WSL](#在-wsl-中调试) 中编辑、加载、调试你的插件。

通常来说，我们测试的最佳起点就是使用限制端口访问的远程环境（比如使用了防火墙限制端口访问的代码空间、容器或远程 SSH 主机等），因为插件在这些环境中总是任意使用资源。

### 在 GitHub 代码空间中调试

你可以使用 [GitHub 代码空间](https://docs.github.com/github/developing-online-with-codespaces) 预览版 开始你的调试。

遵循以下步骤：
1. 安装 [代码空间](https://marketplace.visualstudio.com/items?itemName=ms-vsonline.vsonline) 插件
2. 创建一个新的 [代码空间](https://docs.github.com/github/developing-online-with-codespaces/creating-a-codespace)
3. 如果你还没连接到你的代码空间，用 `F1` 打开命令面板选择 **Codespaces: Connect to Codespace** 建立连接。
4. 连接好之后，你可以用 **文件 > 打开.../ 打开文件夹...** 选择你插件所在的代码空间，或者使用命令面板的 **Git: Clone** 将代码复制下来，然后打开它。
5. GitHub 代码空间基于云端环境，所以应该包含了大部分插件所需的预备依赖，你可以在 VS Code 终端窗口中安装任何所需依赖（比如使用 `yarn install` 或者 `apt-get`）
6. 最后，按 `F5` 或者使用 **运行视图** ，在代码空间中加载插件

!> 注意：你无法像窗口展示的那样，打开展示出来的插件源代码目录，但是你可以在代码空间中打开子目录或其他位置的目录。

插件开发主机窗口启动后，会将插件运行在 代码空间 中，现在也同时可以使用调试了。

**使用基于浏览器的编辑器编辑代码空间**

如果你的既有代码空间，也有插件源代码，那么你可以使用[前往 GitHub portal](https://docs.github.com/github/developing-online-with-codespaces/developing-in-a-codespace) 连接，或者使用命令面板中的 **Codespaces: Open in Browser** 命令。连接到代码空间之后，你可以在**浏览器中编辑和调试代码**，就像从 VS Code 中操作一样。

### 在本地容器中调试

遵循以下步骤：
1. 请先 [安装和配置 Remote-Container 插件](https://code.visualstudio.com/docs/remote/containers#_getting-started)，然后用 **文件 > 打开... / 打开文件夹...**在本地打开你的源代码。
2. 从命令面板中执行 **Remote-Containers: Add Development Container Configuration Files...**，然后选择 **Node.js 8 & TypeScript**(如果你不使用 TypeScript 的话，直接选择 Nodejs 8) 添加所需的容器配置文件
3. 【可选】命令运行之后你可以修改 `.devcontainer` 文件夹中的内容，配置额外的构建或运行时所需要的东西。请参考 [Remote - Containers](https://code.visualstudio.com/docs/remote/create-dev-container#_set-up-a-folder-to-run-in-a-container)查看更多。
4. 运行 **Remote-Containers: Reopen Folder in Container**，此时 VS Code 会初始化容器然后连接。现在你可以在容器中像在本地环境操作那样部署你的源代码了。
5. 在 VS Code 终端窗口(**⌃⇧`**)中运行 `yarn install` 或者 `npm install`，配置好 Linux 中的开发环境。你也可以安装其他 OS 或者运行时依赖，但是你也需要把这些东西添加到 `.devcontainer/Dockerfile` 中去，这样你在重启容器的时候，配置就不会丢失了。
6. 最后，按下 `F5` 或者使用 **运行窗口** 在容器中启动插件和调试。

!> 注意：你无法像窗口展示的那样，打开展示出来的插件源代码目录，但是你可以在代码空间中打开子目录或其他位置的目录。

### 在 SSH 中调试

遵循以下步骤：

1. 请先 [安装和配置 Remote-SSH 插件](https://code.visualstudio.com/docs/remote/ssh#_getting-started)，然后执行命令面板中的 **Remote-SSH: Connect to Host...**连接到主机上。
2. 连接好之后，**文件 > 打开... / 打开文件夹...** 打开你插件源代码所在的远程目录。或者使用命令面板的 **Git: Clone** 将代码复制下来，然后打开它。
3. 你可以在 VS Code 终端窗口中安装所需依赖（比如使用 `yarn install` 或者 `apt-get`）
4. 最后，按下 `F5` 或者使用 **运行窗口** 在容器中启动插件和调试。

!> 注意：你无法像窗口展示的那样，打开展示出来的插件源代码目录，但是你可以在代码空间中打开子目录或其他位置的目录。
### 在 WSL 中调试

遵循以下步骤：

1. 请先 [安装和配置 Remote-WSL 插件](https://code.visualstudio.com/docs/remote/ssh#_getting-started)，然后执行命令面板中的 **Remote-WSL: New Window**。
2. 在新出现的窗口中，**文件 > 打开... / 打开文件夹...** 打开你插件源代码所在的远程目录。或者使用命令面板的 **Git: Clone** 将代码复制下来，然后打开它。

?> 提示：如果你使用的是 Windows 系统，你可以在 `/mnt/c` 中克隆代码

3. 你可以在 VS Code 终端窗口中安装所需依赖（比如使用 `yarn install` 或者 `apt-get`），并确保 Linux 环境已经准备好了 Node 相关的依赖。
4. 最后，按下 `F5` 或者使用 **运行窗口** 在容器中启动插件和调试。

!> 注意：你无法像窗口展示的那样，打开展示出来的插件源代码目录，但是你可以在代码空间中打开子目录或其他位置的目录。

## 安装开发版插件
---

目前，VS Code自动在SSH主机、容器、WSL安装插件时会使用插件市场的版本(而不是你本机上当前安装的版本)。大部分时候这么做事合理的，但是我们现在可能需要一个未发布的版本来测试，所以你可以将插件打包成`VSIX`格式，然后打开已经连接到远程VS Code窗口中手动安装这个插件。

遵循以下步骤：

1. 如果这个插件已经发布，你需要将配置文件`setting.json`设置成`"extensions.autoUpdate": false`，阻止插件自动更新到插件市场的最新版本。
2. 下一步，使用`vsce package`将你的插件打包成VSIX
3. 连接到 [代码空间](https://docs.github.com/github/developing-online-with-codespaces)、[开发容器](https://code.visualstudio.com/docs/remote/containers)、[SSH主机](https://code.visualstudio.com/docs/remote/ssh)或[WSL环境](https://code.visualstudio.com/docs/remote/wsl)
4. 在你已经连接远程目录的项目中，使用命令 **Install from VSIX...**安装你打包好的插件
5. 完成后重启

?> **小提示：**安装完毕后，你可以使用 **Developer: Show Running Extensions**命令查看VS Code在本地运行插件还是在远程运行插件的。

## 常见问题
---

VS Code API 会根据项目自动运行在正确的环境上。记住这点，然后我们来看看几个API，它会帮助你避免一些意外问题。

#### 不正确的执行环境

如果你的插件出错了，它有可能是运行在了错误环境中。比较常见的场景是，你原本期望它运行在本地却运行在了远程上。你可以使用命令面板的 **Developer: Show Running Extensions**命令查看插件的运行情况。

如果这个命令显示某个UI 插件被当做工作区插件或者类似的情况，你可以试着在插件的`package.json`中设置`extensionKind`属性：

VS Code 1.40 之后，这个值支持使用数组，插件可以定义多种类型。比如：

```json
{
  "extensionKind": ["ui", "workspace"]
}
```

- `"extensionKind": "workspace"` —— 表示插件需要访问工作区内容，因此当连接到远程工作区或者代码空间中时，插件会运行到 VS Code 服务器中。大部分插件都是使用该类别。
- `"extensionKind": "ui"` —— 表示插件需要访问本地资源、设备或其他能力，插件被视为 UI 插件，强制在本地运行。无法在 *代码空间的编辑器* 中运行，因为该环境没有本地插件主机。
- `"extensionKind": ["ui", "workspace"]` —— 表示插件**优先**以 UI 插件的方式运行，不强制依赖本地资源、设备或其他能力。使用 VS Code 的时候，如果本地插件主机可用，插件会已本地的方式运行，如果工作区插件主机可用，则会以工作区插件的方式运行。当在云端环境使用时，它会运行在远程插件主机中（因为没有本地插件主机可用）。旧的 `ui` 值作为兼容映射，我们会逐步考虑废弃它。
- `"extensionKind":["workspace", "ui"]` —— 表示插件**优先**以 工作区插件的方式运行，但不依赖工作区内容。使用 VS Code 的时候，如果在远程工作区中使用，会以工作区插件运行，本地插件主机可用则在本地运行。当在云端环境使用时，它只会以远程插件主机运行。

你也可以在[设置](https://code.visualstudio.com/docs/getstarted/settings)中修改 `remote.extensionKind`插件的类型，这项配置可以立竿见影地看到效果。比如，你想把 [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)插件强制设置为 UI 插件（默认是工作区插件）然后把[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)设置为工作区插件（默认是UI 插件），你可以这么设置：

```json
{
  "remote.extensionKind": {
    "ms-azuretools.vscode-cosmosdb": "ui",
    "msjsdiag.debugger-for-chrome": "workspace"
  }
}
```
使用 `remote.extensionKind`可以快速地测试发行版插件，而不用修改插件的`package.json`或重新构建插件。

#### 保存插件数据或状态

有的时候，你的插件需要保留住不属于`settings.json`的数据或者独立的工作区配置文件（如`.eslintrc`），你可以使用插件激活入口的`vscode.ExtensionContext`对象。如果你的插件已经使用好了这些属性那就应该不会出错。

但是，你的插件如果依赖VS Code的路径约定（如 `~/.vscode`）或者特定的OS目录（比如Linux上的 `~/.config/Code`）来保存数据，那你就可能会遇到问题。不过还好这些小问题只要稍加修改插件就能处理掉。

如果你只是想保存一些键值对全局状态信息，你可以使用`vscode.ExtensionContext.workspaceState`或`vscode.ExtensionContext.globalState`。如果数据不止键值对且更为复杂，访问`globalStoragePath`和`storagePath`可以安全地获取对应的储存路径，供你读写文件。

如何使用我们上面介绍的API:

```typescript
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myAmazingExtension.persistWorkspaceData', () => {

        // 如果插件所属的工作区不存在储存路径，则创建一个
        if (!fs.existsSync(context.storagePath)) {
            fs.mkdirSync(context.storagePath);
        }

        // 将文件写入储存目录
        fs.writeFileSync(
            path.join(context.storagePath, 'workspace-data.json'),
            JSON.stringify({ now: Date.now() }));
    }));

    context.subscriptions.push(
        vscode.commands.registerCommand('myAmazingExtension.persistGlobalData', () => {

        // 如果插件所属的全局（跨工作区）文件夹不存在则创建一个
        if (!fs.existsSync(context.globalStoragePath)) {
            fs.mkdirSync(context.globalStoragePath);
        }

        // 为插件创建一个全局储存文件
        fs.writeFileSync(
            path.join(context.globalStoragePath, 'global-data.json'),
            JSON.stringify({ now: Date.now() }));
    }));
}
```

#### 保留密钥

如果你的插件需要保留密码或者其他密钥，你可能会想到使用本地操作系统的密钥储存功能（Windows Cert Store、 macOS KeyChain、Linux 的 `libsecret`-based keyring），而不是使用远程主机的储存功能。更有可能的是，你可能需要在Linux上使用`libsecret`，在插件中使用`gnome-keyring`去储存你的密钥，通常来说，这项功能在服务端或者容器内不一定能运作起来。

VS Code本身不提供密钥储存机制，不过需要插件作者会转而使用[`keytar` node module](https://www.npmjs.com/package/keytar)包。因此，VS Code内建了`keytar`，你在 *工作区插件* 中如果使用了它，它就会**自动无声**地运行在后台。这样一来你就可以使用本地系统的 keychain/ keyring/ cert store 同时还避免了各种问题。

比如：

```typescript
import { env } from 'vscode';
import * as keytarType from 'keytar';

declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;
function getNodeModule<T>(moduleName: string): T | undefined {
  const r = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  try {
    return r(`${env.appRoot}/node_modules.asar/${moduleName}`);
  } catch (err) {
    // 不在ASAR中
  }
  try {
    return r(`${env.appRoot}/node_modules/${moduleName}`);
  } catch (err) {
    // 不可用
  }
  return undefined;
}

// 使用它
const keytar = getNodeModule<typeof keytarType>('keytar');
await keytar.setPassword('my-service-name', 'my-account', 'iamal337d00d');
const password = await keytar.getPassword('my-service-name', 'my-account');
```

#### 使用剪贴板

由于历史原因，大部分插件作者会使用诸如`clipboardy`等Node.js的包和剪贴板交互。不幸的的是，如果你使用了这样的包，那么它就很有可能会运行在远程机器上。

VS Code 1.30引入的剪贴板则解决了这个问题。它总是运行在本地中，所以同样的，你只要修改你的`engines.vscode`版本就可以使用这个API了。

在插件中使用剪贴板API：

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('myAmazingExtension.clipboardIt', async () => {
      // 读取剪贴板
      const text = await vscode.env.clipboard.readText();

      // 写入剪贴板
      await vscode.env.clipboard.writeText(
        `It looks like you're copying "${text}". Would you like help?`
      );
    })
  );
}
```

#### 在本地浏览器或者其他应用中打开些什么

在本地的场景下，通过使用子进程或者`opn`包启动浏览器或者其他应用是完全可行的，但是一旦插件运行到了远程上，这就会导致应用加载错误。VS Code远程开发**部分**兼容了`opn`包使得现有插件可以正常运行。你可以使用URI调用这个包，VS Code会带上这个URL在客户端唤起默认应用。由于不是完整实现，有些配置是不支持的，也不会返回`child_process`对象。

除了依赖第三方包，我们建议你使用`vscode.env.openExternal`方法在本地操作系统上启动默认应用打开对应的URI。而且`vscode.env.openExternal`**还支持自动端口转发**！你可以指向到远程的web server上，即使那个端口外部不可访问。

!> 注意：当前代码空间（云编辑器环境）中的转发机制仅支持 **http 和 https**。从转发页面或 JavaScript 代码发送的 Websocket 是无法工作的。不过远程开发和代码空间插件不受此影响，查看 [MicrosoftDocs/vscodespaces#19](https://github.com/MicrosoftDocs/vscodespaces/issues/19) 了解更多。

如何使用`vscode.env.openExternal`API：

```typescript
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('myAmazingExtension.openExternal', () => {
      // 示例 1 - 在默认浏览器中打开VS Code主页
      vscode.env.openExternal(vscode.Uri.parse('https://code.visualstudio.com'));

      // 示例 2 -  打开 localhost HTTP 服务器进行自动转发
      vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000'));

      // 示例 3 - 打开默认email应用
      vscode.env.openExternal(vscode.Uri.parse('mailto:vscode@microsoft.com'));
    })
  );
}
```

#### 转发 localhost

[`vscode.env.openExternal` 中的 localhost 转发机制非常的有用](#在本地浏览器或者其他应用中打开些什么)，但是你也会有想要转发一些东西，但是又不想新开一个浏览器窗口或者应用的时候。现在就是`vscode.env.asExternalUri` 登场的时候了。

!> 注意：当前代码空间（云编辑器环境）中的转发机制仅支持 **http 和 https**。从转发页面或 JavaScript 代码发送的 Websocket 是无法工作的。不过远程开发和代码空间插件不受此影响，查看 [MicrosoftDocs/vscodespaces#19](https://github.com/MicrosoftDocs/vscodespaces/issues/19) 了解更多。

使用 `vscode.env.asExternalUri` API：

```typescript
import * as vscode from 'vscode';
import { getExpressServerPort } from './server';

export async function activate(context: vscode.ExtensionContext) {

    const dynamicServerPort = await getWebServerPort();

    context.subscriptions.push(vscode.commands.registerCommand('myAmazingExtension.forwardLocalhost', async () =>

        // 确保端口可用，获取完整的 URI
        const fullUri = await vscode.env.asExternalUri(
            vscode.Uri.parse(`http://localhost:${dynamicServerPort}`));

        // ... 用 fullUri 做点啥 ...
    }));
}
```

务必注意被传递回来的的 URI 可能根本不会引用 localhost，所以你必须完整地使用它，尤其当你在使用云编辑器的时候。

#### 回调和 URI 处理程序

插件可通过 `vscode.window.registerUriHandler` 注册一个自定义的 URI，如果会在浏览器中打开，则触发一个回调事件。URI 处理程序的常见用法是使用 OAuth 2.0 授权服务（比如 Azure AD）提供服务标识。当然你也可以用在外部应用或者浏览器的通信。

远程开发和代码空间插件显式地将 URI 传递到你的插件里，不管它实际运行在哪（本地或远程）。但是，`vscode://` 这样的 URI 无法在代码空间（云编辑器）中工作，因为浏览器中打开这样的 URI 会试图发送到本地 VS Code 客户端而不是云编辑器上。幸运的是，我们可以通过`vscode.env.asExternalUri` 补救。

让我们把 `vscode.window.registerUriHandler` 和 `vscode.env.asExternalUri` 结合起来，看看这个 OAuth 授权回调通信示例：

```typescript
import * as vscode from 'vscode';

// 来自 package.json 中的 ${publisher}.${name}
const extensionId = 'my.amazing-extension';

export async function activate(context: vscode.ExtensionContext) {
  // 注册 URI 处理程序处理授权回调
  vscode.window.registerUriHandler({
    handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
      // 当授权完成时，运行你想要做的事情
      if (uri.path === '/auth-complete') {
        vscode.window.showInformationMessage('Sign in successful!');
      }
    }
  });

  // 在命令中注册登录事件
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionId}.signin`, async () => {
      // 获取外部回调函数得到 URI，将该 URI 提供给授权处理程序使用
      const callbackUri = await vscode.env.asExternalUri(
        vscode.Uri.parse(`${vscode.env.uriScheme}://${extensionId}/auth-complete`)
      );

      // 将你的代码和授权处理程序整合——此处，我们使用伪代码
      vscode.env.clipboard.writeText(callbackUri.toString());
      await vscode.window.showInformationMessage(
        'Open the URI copied to the clipboard in a browser window to authorize.'
      );
    })
  );
}
```

在 VS Code 中运行上例后，`vscode://` 或 `vscode-insiders://` 可用作授权处理的回调。在云编辑器环境中运行时，它会连接到 `https://*.github.dev` URI，无需改变任何代码或分支语句。

如果你的 OAuth 场景超出了本文档，你可以适当修改本例。你也可以在处理程序之前再构建一个代理服务，因为并不是所有处理程序都允许 `vscode://` 这样的回调 URI，而且有些可能不允许使用域名通配符当作回调（比如 HTTPS）。为了提升回调的安全性，我们建议只要在能够使用的场景下，尽量使用 [带 PKCE 流的 OAuth 2.0 授权码](https://oauth.net/2/pkce/)。

#### 在远程或 Codespace 浏览器编辑器中运行时改变行为

有的时候，你的工作区插件可能需要在远程/云代码环境的运行期间改变行为。VS Code 提供了 3 个 API 检测这些情况：`vscode.env.uiKind`、`extension.extensionKind`、`vscode.env.remoteName`。

你可以像这样使用这些 API:

```typescript
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  // 当本地运行时 extensionKind 返回 ExtensionKind.UI，所以可以用来检测是否在远程运行
  const extension = vscode.extensions.getExtension('your.extensionId');
  if (extension.extensionKind === vscode.ExtensionKind.Workspace) {
    vscode.window.showInformationMessage('I am running remotely!');
  }

  // 云编辑器环境运行时 uiKind 会返回 UIKind.Web
  if (vscode.env.uiKind === vscode.UIKind.Web) {
    vscode.window.showInformationMessage('I am running in the Codespaces browser editor!');
  }

  // 在本地工作区运行时，remoteName 会返回 undefined
  if (typeof vscode.env.remoteName === 'undefined') {
    vscode.window.showInformationMessage('Not currently connected to a remote workspace.');
  }
}
```

#### 使用命令在插件间通信

一些插件意在被其他插件调用（通过`vscode.extension.getExtension(extensionName).exports`），因此会在激活时返回一些API。如果这些插件都在同一环境（都是UI插件，或者都是工作区插件时）下工作不会出什么问题，但是如果一个是UI插件，一个是工作区插件就会出问题了。

如果你的插件需要彼此产生交互，使用私有命令暴露功能可以避免一些问题。不过记住一点，所有你传入的对象参数都会被字符串化（`JSON.stringify`），因此这些对象不可以有循环引用，这会导致接受方只收到一个"字符串化的object类型"。

示例：

```typescript
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  // 注册私有命令
  const echoCommand = vscode.commands.registerCommand(
    '_private.command.called.echo',
    (value: string) => {
      return value;
    }
  );
  context.subscriptions.push(echoCommand);
}
```

使用命令的更多细节，请参考[命令API指南](/extension-guides/command.md)

## 使用Webview API
---

就像剪贴板API，[Webview API](/extension-guides/webview.md)也总是运行在本地环境，即使是 *工作区插件* 调用的。也就是说大部分基于webview的插件都可以正常工作，但是还有些注意事项需要交代一下。

#### 请使用 asWebviewUri

你应该使用 `asWebviewUri` 管理插件资源。不要硬编码`vscode-resource://`，而是使用 `asWebviewUri` 确保你的插件在云端环境也能正常运行。请参考[Webview API](https://code.visualstudio.com/api/extension-guides/webview)，不过我们先来快速地看一个例子：

```typescript
// 创建 webview
const panel = vscode.window.createWebviewPanel(
  'catWebview',
  'Cat Webview',
  vscode.ViewColumn.One
);

// 获取内容的 Uri
const catGifUri = panel.webview.asWebviewUri(
  vscode.Uri.file(path.join(context.extensionPath, 'media', 'cat.gif'))
);

// 在你的内容中引用它
panel.webview.html = `<!DOCTYPE html>
<html>
<body>
    <img src="${catGifUri}" width="300" />
</body>
</html>`;
```

#### 为动态的 webview 内容使用消息传递

VS Code 中，webview包含一个 [message passing](/extension-guides/webview?id=脚本和信息传递)API，你无需使用本地的 web 服务器，它就能帮你动态更新webview 的内容。通过这个 API，你可以直接在插件中操作，而不是直接操作 HTML。

这对于远程开发和云环境来说是个非常重要的安全模式。

**为什么使用消息传递，而不是本地 web 服务器**

这个模式的替代方案是使用 `iframe` 或者和让本地服务器提供 webview。不幸的是，webview 中的 `localhost` 默认解析到开发者的本地机器上，也就是说如果工作区插件运行在远程，webview 是无法获得插件生成的本地服务器的。即使你使用机器的 IP 地址 ，端口也会被云虚拟机或容器默认屏蔽掉。虽然它能在 VS Code 中运行，但不代表这个机制能在云环境中运行。

我们来看一下示意图

![webview to remote](https://code.visualstudio.com/assets/api/advanced-topics/remote-extensions/webview-problem.png)

即使看起来能走的通，你也应该尽量不要做这种事，因为你的插件会变得更复杂。[消息传递](/extension-guides/webview?id=脚本和信息传递)可以做到同样的用户体验，而且不会有这些头疼的问题。

#### 从 webview 访问localhost

如果你不用 使用 webview的[message passing](/extension-guides/webview?id=脚本和信息传递)，那么还有 2 种方法帮你解决远程开发和代码空间插件的问题。但因为 [MicrosoftDocs/vscodespaces#11](https://github.com/MicrosoftDocs/vscodespaces/issues/11)，这两种方法目前都无法支持云编辑器。

这两种方式都允许 webview 内容通过特定信道路由到 VS Code 服务器上。比如，如果我们更新一下上面的图，我们就会得到：

![Access to remote](https://code.visualstudio.com/assets/api/advanced-topics/remote-extensions/webview-solution.png)

**方法 1 - 使用 asExternalUri**

VS Code 1.40 引入了 `vscode.env.asExternalUri`，插件可以通过程序式的方法将本地的 http 和 https 请求转发到远程。所以你也可以用这个API 把 webview 的请求转发到本地 web 服务器上。未来，如果你只需要在 iframe 中使用远程服务，你可以通过这个功能支持代码空间中的云编辑器，只是该功能当前因为 [MicrosoftDocs/vscodespaces#11](https://github.com/MicrosoftDocs/vscodespaces/issues/11)被屏蔽了。

!> 注意: 除了上面的这些问题，当前代码空间（云编辑器环境）中的转发机制仅支持 **http 和 https**。从转发页面或 JavaScript 代码发送的 Websocket 是无法工作的。不过远程开发和代码空间插件不受此影响，查看 [MicrosoftDocs/vscodespaces#19](https://github.com/MicrosoftDocs/vscodespaces/issues/19) 了解更多。

使用 API 获取 iframe 完整的 URI，你还需要在 webview 中为这个功能启用 CSP。

```typescript
// 使用 asExternalUri 获得 web 服务器的 URI
const dynamicWebServerPort = await getWebServerPort();
const fullWebServerUri = await vscode.env.asExternalUri(
  vscode.Uri.parse(`http://localhost:${dynamicWebServerPort}`)
);

// 新建 webview
const panel = vscode.window.createWebviewPanel(
  'asExternalUriWebview',
  'asExternalUri Example',
  vscode.ViewColumn.One,
  {
    enableScripts: true
  }
);

const cspSource = panel.webview.cspSource;
panel.webview.html = `<!DOCTYPE html>
        <head>
            <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'none'; frame-src ${fullWebServerUri} ${cspSource} https:; img-src ${cspSource} https:; script-src ${cspSource}; style-src ${cspSource};"
            />
        </head>
        <body>
        <!-- All content from the web server must be in an iframe -->
        <iframe src="${fullWebServerUri}">
    </body>
    </html>`;
```

注意任何被服务器启动的 iframe 中（包含上例）都**需要使用相对路径**，而不是`localhost`这样的硬编码。

**方法 2 - 使用端口映射**

如果你不想支持代码空间中的云编辑器，你还可以 **添加端口映射** 告诉webview哪些端口可以直接转发到远程机器上。

端口映射可以将webview所使用的localhost端口映射到远程插件启动的任意端口上。如果你的 *工作区插件* 运行在远程，而且你也定义了端口映射，那么这些流量会自动、安全地转发到远程机器上。如果你的插件只是运行在本地，端口映射则会将一个localhost端口重新映射到另一个端口上。Webview端口映射同时支持*UI插件*和*工作区插件*，也同时支持本地和远程环境。

使用端口映射，只要在你创建的webview中添加传入一个`portMapping`对象即可：

```typescript
const LOCAL_STATIC_PORT = 3000;
const dynamicServerPort = await getWebServerPort();

// 创建webview然后传入portMapping
const panel = vscode.window.createWebviewPanel(
  'remoteMappingExample',
  'Remote Mapping Example',
  vscode.ViewColumn.One,
  {
    portMapping: [
      // 这里映射了 webview 的 localhost:3000 到远程主机的 express 服务器端口
      { webviewPort: LOCAL_STATIC_PORT, extensionHostPort: dynamicServerPort }
    ]
  }
);

// 你可以在HTML中使用"webviewPort"查看端口
panel.webview.html = `<!DOCTYPE html>
    <body>
        <!-- This will resolve to the dynamic server port on the remote machine -->
        <img src="http://localhost:${LOCAL_STATIC_PORT}/canvas.png">
    </body>
    </html>`;
```

现在不管是远程还是本地的请求，webview前往`localhost:3000`的流量都会走到Express.js web 服务器上了。

## 使用原生Node.js模块
---

和插件打包（或动态引入的包）的原生node包会被[Electorn的`electron-rebuild`](https://electronjs.org/docs/tutorial/using-native-node-modules)重新编译。但是VS Code Server运行在一个标准的（非Electron）的Node.js中，因此可能造成远程二进制库失效问题。

解决这个问题需要：

1. 同时引入Node.js和Elctron标准的两种二进制包（别忘了动态引入的包）。
2. 检查`vscode.extensions.getExtension('your.extensionId').extensionKind === vscode.ExtensionKind.Workspace`是否根据环境使用了正确的包。
3. 如果你想支持非x86_64构建目标和Alpine Linux则遵循[下述类似逻辑](#为非x86_64主机或Apline Linux容器提供支持)。

使用VS Code的 **Help > Developer Tools**然后在控制台（console）中打印`process.versions.modules`可以找到VS Code使用的模块（modules）类型。如果你想要确保原生模块在各个Node.js环境中都能无缝运行，你可能把所有可能支持的平台（Electron Node.js, 官方Node.js Windows/Darwin/Linux的全部版本）相关的包全部引入。[node-tree-sitter](https://github.com/tree-sitter/node-tree-sitter/releases/tag/v0.14.0)包在这方面是个非常好的例子。

## 为非x86_64主机或Apline Linux容器提供支持
---

如果你的插件只是用JavasSript/TypeScript写的，你的插件可能什么都不用做就能支持其他进程架构或基于`musl`的Apline Linux。

但是如果你的插件可以运行在Debian 9+, Ubuntu 16.04+, 或者基于 RHEL / CentOS 7+ 的远程SSH主机、容器或 WSL上，却无法支持非x86_64(比如 ARMv7l)或Alpine Linux容器，插件可能需要包含了x86_64的`glibc`特定机器码或运行时，所以导致了这些架构/操作系统上出现问题。

比如，你的插件坑包含了x86_64编译的原生模块或运行时版本。对于Alpine Linux来说就是因[基础架构差异](https://wiki.musl-libc.org/functional-differences-from-glibc.html)而无法运行这样的插件。

为了解决这个问题：

1. 如果你是动态引入编译码，你可以用`process.arch`检测环境，然后根据对应架构下载对应架构下的依赖。如果你已经在插件中直接使用了二进制包，你也可以用同样的逻辑使用正确的包。
2. 对于Alpine Linux来说，你可以用`await fs.exists('/etc/alpine-release')`检测操作系统，然后下载或者使用基于`musl`的正确的二进制包。
3. 如果你不想支持这些平台，你也可以用同样的逻辑提供良好的错误提示。

你要非常注意一些第三方包可能依赖了导致这个问题的源码包。所以有时候你需要联系npm包作者提供额外的编译版本。

## 避免使用Electron模块
---

虽然依赖未暴露的内置Electron或者VS Code模块非常方便，但是你必须知道VS Code Server运作在标准的（非Electron）Node.js环境中，当插件运行在远程时就会丢失这些包。除了少数个例，比如[keytar](#保留密钥)，用了特殊的实现所以在所有环境中都能正常工作。

使用基于Node.js的模块从而避免这些问题。如果你一定要用Electron模块，那就要确保如果包丢失的时候提供合适的后备方案。

下面的例子使用了Electron的`original-fs`包，缺失时则使用Node.js的`fs`模块。

```typescript
function requireWithFallback(electronModule: string, nodeModule: string) {
  try {
    return require(electronModule);
  } catch (err) {}
  return require(nodeModule);
}

const fs = requireWithFallback('original-fs', 'fs');
```

但是不论何时，你都应该避免这些问题。

## 已知问题
---

目前我们还有些影响 工作区插件 功能的问题亟待解决。见[原文档 - 已知问题](https://code.visualstudio.com/api/advanced-topics/remote-extensions#known-issues)

## FAQ
---

- 查看[提示和解决方法](https://code.visualstudio.com/docs/remote/troubleshooting)或者[FAQ](https://code.visualstudio.com/docs/remote/faq)
- 在 [Stack Overflow](https://stackoverflow.com/questions/tagged/vscode-remote)上查找答案
- [支持或者新建一项功能](https://aka.ms/vscode-remote/feature-requests)，查看[已知问题](https://aka.ms/vscode-remote/issues)，或者[报告问题](https://aka.ms/vscode-remote/issues/new)
- 贡献一个[开发容器配置](https://aka.ms/vscode-dev-containers)方便大家使用
- 贡献[文档](https://github.com/Microsoft/vscode-docs)或者[VS Code](https://github.com/Microsoft/vscode)
- 查看我们的[贡献](https://aka.ms/vscode-remote/contributing)指南查看更多详情