# 插件主机

**插件主机**（Extension Host）负责运行插件。

## 插件主机配置

根据 VS Code 的配置不同，会运行多个插件主机，它们拥有不同的运行时，位于不同的位置。

* 本地（local） – 一个运行在本地的 Node.js 插件主机，与用户界面位于同一台机器上。
* 网络（web） – 一个运行在浏览器中或本地的 Web 插件主机，与用户界面位于同一台机器上。
* 远程（remote） – 一个运行在容器或远程位置的 Node.js 插件主机。

下表展示了 VS Code 的各类配置下可用的插件主机：

| 配置                                                                                                                      | 本地插件主机 | Web 插件主机 | 远程插件主机 |
| ------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ | ------------ |
| 桌面版 VS Code                                                                                                            | ✔️            | ✔️            |              |
| [VS Code 远程开发](https://code.visualstudio.com/docs/remote/remote-overview)（容器、SSH、WSL、GitHub Codespace、Tunnel） | ✔️            | ✔️            | ✔️            |
| Web 版 VS Code（vscode.dev、github.dev）                                                                                  |              | ✔️            |              |
| 带 Codespaces 的 Web 版 VS Code                                                                                           |              | ✔️            | ✔️            |

### 插件主机运行时

* Node.js - 插件运行在 Node.js 运行时中，用于本地和远程插件主机。插件需要一个 `main` 入口文件才能在其中运行。
* 浏览器（Browser） - 插件运行在[浏览器 Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API)运行时中，用于 Web 插件主机。插件需要一个 `browser` 入口文件才能在其中运行。更多细节请参阅 [Web 插件指南](/extension-guides/web-extensions)。

### 首选插件位置

插件被加载到哪个插件主机取决于：

* VS Code 的配置所提供的可用插件主机。
* 插件的能力：它能否在 Node.js 和/或 Web 中运行，或者如果未说明，它提供了哪些配置点（contributions）？
* 插件安装在哪里：本地机器、远程机器，或两者皆有。
* 插件偏好的位置：`extensionKind` 属性。

`extensionKind` 是[插件清单](/references/extension-manifest)中的一个属性。它允许插件指定首选的运行位置。该位置可以是拥有工作区的机器（`workspace`）或用户界面所在机器（`ui`）。如果插件能在两者上运行，它可以指定一个优先顺序。

* `"extensionKind": ["workspace"]` — 表示插件需要访问工作区内容，因此需要运行在工作区所在的位置。该位置可以是本地机器、远程机器或 Codespace。大多数插件都属于这一类。
* `"extensionKind": ["ui", "workspace"]` — 表示插件**优先**作为 UI 插件运行，但对本地资源、设备或能力没有硬性要求。使用 VS Code 时，如果本地存在 VS Code 的本地插件主机，插件将运行在其中，这意味着用户无需在远程安装该插件。否则，如果远程存在 VS Code 的工作区插件主机，插件将运行在其中。当使用带 Codespaces 的 Web 版 VS Code 时，它总是运行在远程插件主机中（因为没有可用的本地插件主机）。
* `"extensionKind": ["workspace", "ui"]` — 表示插件**优先**作为工作区插件运行，但对访问工作区内容没有硬性要求。使用 VS Code 时，如果远程工作区存在 VS Code 的工作区插件主机，插件将运行在其中，否则如果本地存在 VS Code 的本地插件主机，插件将运行在其中。当使用带 Codespaces 的 Web 版 VS Code 时，它总是运行在远程插件主机中（因为没有可用的本地插件主机）。
* `"extensionKind": ["ui"]` — 表示插件**必须**在靠近 UI 的地方运行，因为它需要访问本地资源、设备或能力，或者因为需要低延迟。在使用带 Codespaces 的 Web 版 VS Code 时，由于没有可用的本地插件主机，此类插件无法加载，除非它同时也是 [Web 插件](/extension-guides/web-extensions)。此时它将被加载到 Web 插件主机中，但有一个限制：它无法实例化 Web Worker。

**注意：** 早期版本的 VS Code（<1.40）允许插件以字符串形式指定单一位置，但这一方式已弃用，取而代之的是以数组形式指定多个位置。

如果插件既能在 Node.js 中运行也能在浏览器中运行，那么在有可用的 Node.js 插件主机时会优先选择它。有一个例外：当配置为带 Codespaces 的 Web 版 VS Code 且 `extensionKind` 设置为 `ui` 时，Web 插件主机优先于远程插件主机。

如果插件仅支持 Web，那么无论 `extensionKind` 设置如何，它都将始终运行在 Web 插件主机中。在这种情况下，我们建议不要定义 `extensionKind`。

## 稳定性和性能

VS Code致力于为用户提供一个稳定且高性能的编辑环境，因此出错的插件不应该影响到用户的体验。所以**插件主机**可以预防这些事情：

- 启动性能影响
- 阻塞的UI操作
- 修改UI

另外，VS Code提供的[激活事件机制](/references/activation-events)也让插件只在用到时才懒加载它们，比如，Markdown插件应该只在用户打开了Markdown文件时才启动，因此避免了不必要CPU和内存消耗。