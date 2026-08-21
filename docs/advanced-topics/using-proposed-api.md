# 使用不稳定的API

在 Visual Studio Code，我们非常重视扩展 API 的兼容性。我们尽最大努力避免破坏性的 API 变更，插件作者可以期望已发布的插件持续正常工作。然而，这给我们带来了很大的限制：一旦我们引入了一个 API，就无法再轻易更改它。

Proposed API 为我们解决了这个问题。Proposed API 是一组已在 VS Code 中实现、但未像稳定 API 那样向公众公开的不稳定 API。它们**随时可能变更**、**仅在 Insiders 版本中可用**，且**不应在已发布的插件中使用**。尽管如此，插件作者可以在本地开发中测试这些新 API，并向 VS Code 团队提供反馈以迭代 API。最终，Proposed API 会进入稳定 API 并可供所有插件使用。

## 使用 Proposed API

以下是在本地插件开发中测试 Proposed API 的步骤：

- 使用 VS Code 的 [Insiders](https://code.visualstudio.com/insiders/) 版本。
- 在你的 `package.json` 中添加 `"enabledApiProposals": ["<proposalName>"]`。
- 将对应的 [vscode.proposed.\<proposalName\>.d.ts](https://github.com/microsoft/vscode/blob/main/src/vscode-dts) 文件复制到你的项目源码位置。

[@vscode/dts](https://github.com/microsoft/vscode-dts) CLI 工具允许你快速下载最新的 `vscode.proposed.<proposalName>.d.ts` 用于插件开发。它会根据你的 `package.json` 文件中列出的 proposals 下载定义文件。

```bash
> npx @vscode/dts dev
Downloading vscode.proposed.languageStatus.d.ts
To:   /Users/Me/Code/MyExtension/vscode.proposed.languageStatus.d.ts
From: https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageStatus.d.ts
Read more about proposed API at: https://code.visualstudio.com/api/advanced-topics/using-proposed-api
```

有一个使用 Proposed API 的示例：[proposed-api-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/proposed-api-sample)。

## Proposed API 的不兼容问题

在 main 分支上，`vscode.proposed.<proposalName>.d.ts` 始终与 `vscode.d.ts` 兼容。但是，当你将 `vscode.proposed.<proposal>.d.ts` 添加到使用了 `@types/vscode` 的项目中时，最新的 `vscode.proposed.<proposal>.d.ts` 可能与 `@types/vscode` 中的版本不兼容。

你可以通过以下任一方式解决此问题：

- 移除对 `@types/vscode` 的依赖，使用 `npx @vscode/dts main` 从 `microsoft/vscode` 的 main 分支下载 `vscode.d.ts`。
- 使用 `@types/vscode@<version>`，同时使用 `npx @vscode/dts dev <version>` 从 `microsoft/vscode` 的旧分支下载 `vscode.proposed.<proposal>.d.ts`。不过请注意，API 可能已在最新版本的 VS Code Insiders 中发生变化。

## 共享使用 Proposed API 的插件

虽然你不应在 Marketplace 上发布使用 Proposed API 的插件，但你仍然可以通过打包并共享插件来与同行分享你的插件。

要打包你的插件，你可以运行 `vsce package` 创建插件的 VSIX 文件。然后你可以将这个 VSIX 文件分享给其他人，以便在他们的 VS Code 中安装该插件。

要从 VSIX 文件安装插件，请进入扩展视图，选择 **...** 省略号（**查看和更多操作（View and More Actions）**）按钮，然后选择 **从 VSIX 安装（Install from VSIX）**。

选择 **从 VSIX 安装（Install from VSIX）** 菜单项的操作如下方短视频所示。

![演示用户进入扩展视图查找 Install from VSIX 菜单项](https://code.visualstudio.com/assets/api/advanced-topics/proposed-api/install-from-vsix.gif)

对于使用 Proposed API 的插件，启用你的插件还需要额外几步。从 VSIX 安装后，你需要退出并在命令行中重新启动 VS Code Insiders，命令为 `code-insiders . --enable-proposed-api=<YOUR-EXTENSION-ID>`（在你的项目文件夹中执行）。

如果你希望使用 Proposed API 的插件在每次启动 VS Code Insiders 时都始终可用，你可以运行 **Preferences: Configure Runtime Arguments**（首选项：配置运行时参数）命令，编辑 `.vscode-insiders/argv.json` 文件以设置已启用插件的列表。

```json
{
    ...
    "enable-proposed-api": ["<YOUR-EXTENSION-ID>"]
}
```
