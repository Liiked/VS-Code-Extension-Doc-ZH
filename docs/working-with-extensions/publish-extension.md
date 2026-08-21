
# 发布插件

一旦你制作了一个高质量的插件，就可以将其发布到 [VS Code 扩展市场（Extension Marketplace）](https://marketplace.visualstudio.com/vscode)，以便其他人能够查找、下载和使用你的插件。或者，你也可以将插件[打包](#packaging-extensions)为可安装的 VSIX 格式，并与其他用户分享。

本主题涵盖：

- 使用 [vsce](#vsce)，用于管理 VS Code 插件的命令行工具
- [打包](#packaging-extensions)、[发布](#publishing-extensions)和[撤销发布](#unpublishing-extensions)插件
- [注册发布者](#create-a-publisher)，这是发布插件所必需的

## vsce

[vsce](https://github.com/microsoft/vscode-vsce) 是 "Visual Studio Code Extensions" 的缩写，是一个用于打包、发布和管理 VS Code 插件的命令行工具。

### 安装

确保你已经安装了 [Node.js](https://nodejs.org/)。然后运行：

```bash
npm install -g @vscode/vsce
```

### 使用

你可以使用 `vsce` 轻松地[打包](#packaging-extensions)和[发布](#publishing-extensions)你的插件：

```bash
$ cd myExtension
$ vsce package
# myExtension.vsix generated
$ vsce publish
# <publisher id>.myExtension published to VS Code Marketplace
```

`vsce` 还可以搜索、检索元数据和撤销发布插件。要查看所有可用的 `vsce` 命令的参考，请运行 `vsce --help`。

## 发布扩展

---

> [!NOTE]
> 出于安全考虑，`vsce` 不会发布包含用户提供的 SVG 图片的插件。

发布工具会检查以下约束：

- `package.json` 中提供的图标不能是 SVG。
- `package.json` 中提供的徽章不能是 SVG，除非它们来自[受信任的徽章提供者](/api/references/extension-manifest#approved-badges)。
- `README.md` 和 `CHANGELOG.md` 中的图片 URL 需要解析为 `https` URL。
- `README.md` 和 `CHANGELOG.md` 中的图片不能是 SVG，除非它们来自[受信任的徽章提供者](/api/references/extension-manifest#approved-badges)。

---

Visual Studio Code 使用 [Azure DevOps](https://azure.microsoft.com/services/devops/) 提供其市场服务。这意味着插件的身份验证、托管和管理都通过 Azure DevOps 提供。

> [!IMPORTANT]
> 2026 年 12 月 1 日，Azure DevOps 中的全局个人访问令牌（PAT）将被停用。要继续发布插件，请使用基于 Microsoft Entra ID 的[安全自动化发布](#secure-automated-publishing-to-visual-studio-marketplace)，而不是 PAT。更多信息请参阅 [Azure DevOps 中全局个人访问令牌的停用](https://devblogs.microsoft.com/devops/retirement-of-global-personal-access-tokens-in-azure-devops/)。

### 向 Visual Studio Marketplace 进行安全自动化发布

我们建议插件发布使用[基于 Microsoft Entra ID 的身份验证](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/entra?view=azure-devops)，并配合**工作负载身份联合和托管身份**。这种方法消除了个人访问令牌（PAT）等长期有效的机密，并实现了安全、自动化的发布管道。

这种方法通过摆脱对存储凭据的依赖来增强整体安全态势，通过与 Azure Pipelines 和 Entra ID 的原生集成简化操作，在多种环境中高效扩展，并符合企业合规所需的新式身份和访问管理标准。更多信息请参阅 [减少 PAT 的使用](https://devblogs.microsoft.com/devops/reducing-pat-usage-across-azure-devops/)。

1. 创建服务连接（Azure DevOps）

   - 导航到 **项目设置 → 服务连接**
   - 创建一个新的 **Azure Resource Manager** 连接
   - 选择 **工作负载身份联合（手动）**
   - 以草稿模式保存连接，以便稍后收集所需的值

2. 创建托管身份（Azure）

   - 在 Azure 中创建**用户分配的托管身份**
   - 分配 **读取者（Reader）** 角色
   - 记录以下值：**客户端 ID（Client ID）**、**租户 ID（Tenant ID）**、**订阅（Subscription）** 详细信息

3. 配置联合凭据

   在 Azure DevOps 和 Azure 之间建立连接：

   - 向托管身份添加联合凭据
   - 在系统之间交换所需的值：
      * 从 Azure DevOps → Azure：**issuer 和 subject**
      * 从 Azure → Azure DevOps：**client ID、tenant ID、subscription**
   - 在 Azure DevOps 中，选择 **验证并保存（Verify and save）**

4. 授予管道访问权限

   - 打开服务连接
   - 授予负责发布的管道访问权限

5. 检索托管身份资源 ID（一次性）

   - 运行一个 Azure CLI 任务来检索身份信息：
      ```yaml
      steps:
      - task: AzureCLI@2
        displayName: 'Get identity details'
        inputs:
          azureSubscription: <ServiceConnectionName>
          scriptType: pscore
          scriptLocation: inlineScript
          inlineScript: |
            az rest -u https://app.vssps.visualstudio.com/_apis/profile/profiles/me --resource 499b84ac-1321-427f-aa17-267ca6975798
      ```
   - 从输出 JSON 中捕获托管身份资源 ID（`id` 字段）。

6. 在 Visual Studio Marketplace 中授权该身份

   - 将托管身份（使用其资源 ID）添加为你的发布者的成员。
   - 分配 **参与者（Contributor）** 角色

7. 配置 CI/CD 管道

   - 设置你的 Azure Pipelines CI/CD 工作流
   - 用基于身份的方法取代基于 PAT 的身份验证

8. 使用托管身份发布

   - 在你的管道中，通过 Azure CLI 生成 Microsoft Entra ID（AAD）访问令牌。
   - 将令牌用于你的发布命令（例如：`vsce publish --azure-credential`）。

示例 YAML 任务。将 `<ExtensionDirectory>` 替换为插件目录路径。

```yaml
# Install VS Code Extension Manager (vsce >= v2.26.1 needed) and dependencies
- script: |
    cd <ExtensionDirectory>
    npm install -g @vscode/vsce
    npm install
  displayName: "Install vsce and dependencies"

# Publish
- task: AzureCLI@2
  displayName: 'Publish using managed identity'
  inputs:
    azureSubscription: <ServiceConnectionName>
    scriptType: pscore
    scriptLocation: inlineScript
    inlineScript: |
      cd <ExtensionDirectory>
      vsce publish --azure-credential
```

***
`vsce` 也可以使用[个人访问令牌](https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)发布插件。

> [!IMPORTANT]
> Azure DevOps 中的全局 PAT 将于 2026 年 12 月 1 日停用。我们建议你使用基于 Microsoft Entra ID 的[安全自动化发布](#secure-automated-publishing-to-visual-studio-marketplace)，而不是 PAT。更多信息请参阅 [Azure DevOps 中全局个人访问令牌的停用](https://devblogs.microsoft.com/devops/retirement-of-global-personal-access-tokens-in-azure-devops/)。

### 获取个人访问令牌

你可以通过 Azure DevOps 门户创建个人访问令牌。要创建个人访问令牌：

1. 如果你还没有 Azure DevOps 组织，请按照[创建组织](https://learn.microsoft.com/azure/devops/organizations/accounts/create-organization)一文中的步骤操作。

1. 转到 [Azure DevOps 门户](https://go.microsoft.com/fwlink/?LinkId=307137)，然后选择你的组织。

1. 打开个人资料图片旁边的用户设置下拉菜单，然后选择 **个人访问令牌（Personal access tokens）**：

    ![个人设置菜单](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/menu-pat.png)

1. 在**个人访问令牌**页面上，选择 **新建令牌（New Token）**：

    ![创建新令牌按钮](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/new-token.png)

1. 在“创建新的个人访问令牌”模态框中，为令牌选择以下详细信息：

    - 名称：你想要的任何令牌名称
    - 组织：**所有可访问的组织**
    - 过期时间（可选）：设置令牌所需的过期日期
    - 作用域：**自定义定义**：
      - 点击**作用域**部分下方的 **显示所有作用域** 链接
      - 在作用域列表中，滚动到 **市场（Marketplace）** 并选择 **管理（Manage）** 作用域

    ![创建个人访问令牌](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/create-token.png)

1. 点击 **创建（Create）**。

    系统会向你展示新创建的个人访问令牌。将其**复制**到安全的位置，你之后[创建发布者](#create-a-publisher)时会用到它。

### 创建发布者

**发布者**是能够将插件发布到 Visual Studio Code Marketplace 的身份。每个插件都需要在其 [`package.json` 文件](/api/references/extension-manifest)中包含 `publisher` 标识符。

要创建发布者：

1. 转到 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)。
1. 使用你在上一节中创建[个人访问令牌](#get-a-personal-access-token)时所用的同一个 Microsoft 帐户登录。
1. 点击左侧窗格中的 **创建发布者（Create publisher）**。
1. 在新页面中，为新发布者指定必填参数——标识符和名称（分别是 **ID** 和 **Name** 字段）：

    - **ID**：你的发布者在 Marketplace 中的**唯一**标识符，将用于你的插件 URL。ID 一旦创建便无法更改。
    - **Name**：你的发布者在 Marketplace 中显示的**唯一**名称。这可以是你的公司或品牌名称。

    下面是 Python 插件的发布者标识符和名称示例：

    ![发布者标识符和名称示例](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/publisher-id-and-name.png)

1. 可选地，填写其余字段。
1. 点击 **创建（Create）**
1. 使用 `vsce` 验证新创建的发布者。在你的终端中运行以下命令，并在提示时输入上一步创建的个人访问令牌：

    ```bash
    vsce login <publisher id>

    https://marketplace.visualstudio.com/manage/publishers/
    Personal Access Token for publisher '<publisher id>': ****************************************************

    The Personal Access Token verification succeeded for the publisher '<publisher id>'.
    ```

验证通过后，你就可以发布插件了。

### 发布插件

你可以通过两种方式发布插件：

1. 自动方式，使用 `vsce publish` 命令：

    ```bash
    vsce publish
    ```

    如果你还没有通过上面的 `vsce login` 命令提供个人访问令牌，`vsce` 会要求你输入。

1. 手动方式，使用 `vsce package` 将插件打包为可安装的 VSIX 格式，然后将其上传到 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)：

    ![通过管理页面上传插件](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/add-extension.png)

## 查看插件安装与评分

[Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)让你可以访问每个插件的随时间变化的获取趋势（Acquisition Trend），以及总获取量和评分与评论。要查看报告，请点击一个插件或选择 **更多操作 > 报告（More Actions > Reports）**。

![Marketplace 插件报告](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/extension-report.png)

## 自动递增插件版本

发布插件时，你可以通过指定要递增的 [SemVer](https://semver.org/) 兼容的数字或版本（`major`、`minor` 或 `patch`）来自动递增版本号。例如，要将插件版本从 1.0.0 更新到 1.1.0，你需要指定：

```bash
vsce publish minor
```

或者

```bash
vsce publish 1.1.0
```

这两个命令都会先修改插件的 `package.json` [version](/api/references/extension-manifest#fields) 属性，然后用更新后的版本发布它。

> [!NOTE]
> 如果你在 git 仓库中运行 `vsce publish`，它还会通过 [npm-version](https://docs.npmjs.com/cli/version#description) 创建版本提交和标签。默认提交消息将是插件的版本，但你可以使用 `-m` 标志提供自定义提交消息。（可以在提交消息中使用 `%s` 引用当前版本）。

## 撤销发布插件

你可以通过点击 **更多操作 > 撤销发布（More Actions > Unpublish）**，从 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)撤销发布插件：

![通过 Marketplace 管理页面撤销发布插件](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/unpublish-extension.png)

撤销发布后，插件的可用性（Availability）状态会变为 **未发布（Unpublished）**，它将不再可以从 Marketplace 和 Visual Studio Code 中下载：

![未发布的插件](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/unpublished-extension.png)

> [!NOTE]
> 当你撤销发布插件时，Marketplace 会保留插件统计信息。该插件仍然可以公开发现，并可通过现有 API 获取。

## 移除插件

你可以通过两种方式移除插件：

1. 自动方式，使用带 `unpublish` 命令的 [`vsce`](#vsce)：

    ```bash
    vsce unpublish <publisher id>.<extension name>
    ```

1. 手动方式，通过点击 **更多操作 > 移除（More Actions > Remove）**，从 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)移除：

    ![通过 Marketplace 管理页面移除插件](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/remove-extension.png)

在两种情况下，系统都会提示你输入插件名称以确认移除。请注意，移除操作是**不可逆的**。

> [!NOTE]
> 当你移除插件时，Marketplace 也会移除所有插件统计信息。你可能更希望撤销发布插件而不是移除它。
> 重要！扩展名称在 Visual Studio Code Marketplace 中是唯一标识符。一旦插件被移除，其扩展名称会被永久保留，无法重用，即使是原始发布者也不行。这有助于保护用户免受冒名顶替，并维护 Marketplace 生态系统中的信任。在删除插件之前，请确保你不再需要该名称，因为此操作是不可逆的。

## 移除特定的插件版本

你可以通过选择 **更多操作 > 报告（More Actions > Reports）**，从 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)移除特定的插件版本：

![Marketplace 发布者管理页面中显示带 Reports 选项的 More Actions 菜单的截图](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/extension-manage.png)

在**管理（Manage）**选项卡上，选择 **删除此版本（Delete this version）**。

![显示带 Delete this version 按钮的管理选项卡的截图](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/remove-version.png)

系统会提示你输入插件名称以确认移除。此操作是**不可逆的**。

> [!IMPORTANT]
> 一旦删除，你就不能将此版本号用于新的发布。此外，你不能删除插件的最新版本。

## 弃用插件

你可以直接弃用一个插件，或者弃用以推荐另一个插件或一个设置。被弃用的插件在 UI 中会以暗淡的删除线文本呈现：

![Rust 插件在插件搜索中显示为已弃用](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/deprecated-extension.png)

每个被弃用的插件在插件磁贴的右下角都有一个黄色警告图标（见上面的截图）。将鼠标悬停在插件磁贴上时，你可以在这个图标旁边看到弃用详情，包括：

- 该插件被弃用且没有任何替代：

  ![被弃用的插件，没有替代](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/deprecated-with-no-alternatives.png)

- 该插件被弃用，以推荐另一个插件：

  ![被弃用的插件，带有替代插件](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/deprecated-with-alternative-extension.png)

- 该插件被弃用，以推荐一个设置：

  ![被弃用的插件，带有替代设置](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/deprecated-with-alternative-setting.png)

VS Code 不会自动迁移或卸载已安装的被弃用插件。如果被弃用的插件有替代插件或设置，VS Code 会显示一个**迁移（Migrate）**按钮，帮助你快速切换到指定的替代：

![带有迁移按钮的被弃用插件](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/deprecated-migrate-button.png)

要将你的插件标记为已弃用，请在[弃用插件](https://github.com/microsoft/vscode-discussions/discussions/1)讨论线程中留言。

> [!NOTE]
> 目前，插件在 Marketplace 中不会被渲染为已弃用。此功能将在以后提供。

## 打包插件

如果你想要，可以选择打包你的插件：

- 在你的 VS Code 实例上测试它。
- 在不发布到 Marketplace 的情况下分发它。
- 私下与他人分享。

打包意味着创建一个包含你的插件的 `.vsix` 文件。这个文件之后可以安装到 VS Code 中。有些插件会在其 GitHub 发布中附带 `.vsix` 文件。

要打包插件，请在插件的根文件夹中运行以下命令：

```bash
vsce package
```

此命令会在插件的根文件夹中创建一个 `.vsix` 文件。例如，`my-extension-0.0.1.vsix`。

对于用户来说，要在 VS Code 中安装 `.vsix` 文件：

* 从 VS Code 的扩展视图中：

  1. 转到扩展视图。
  1. 选择 **视图和更多操作...（Views and More Actions...）**
  1. 选择 **从 VSIX 安装...（Install from VSIX...）**

* 从命令行：

  ```bash
  # if you use VS Code
  code --install-extension my-extension-0.0.1.vsix

  # if you use VS Code Insiders
  code-insiders --install-extension my-extension-0.0.1.vsix
  ```

## 你的插件文件夹

要加载插件，你需要将文件复制到 VS Code 插件文件夹 `.vscode/extensions` 中。根据你的操作系统，这个文件夹的位置不同：

- **Windows：** `%USERPROFILE%\.vscode\extensions`
- **macOS：** `~/.vscode/extensions`
- **Linux：** `~/.vscode/extensions`

## Visual Studio Code 兼容性

编写插件时，你必须指定你的插件兼容的 VS Code 版本。为此，请在 `package.json` 中使用 `engines.vscode` 属性：

```json
{
  "engines": {
    "vscode": "^1.8.0"
  }
}
```

- 值 `1.8.0`（无插入符）意味着你的插件只兼容 VS Code `1.8.0`。
- 值 `^1.8.0` 意味着你的插件兼容 VS Code `1.8.0` 及更高版本，包括 `1.8.1`、`1.9.0` 等。

你可以使用 `engines.vscode` 属性来确保插件只被安装到包含你所依赖的 API 的客户端上。这种机制对 Stable 和 Insiders 版本都很适用。

例如，假设 VS Code 最新的 Stable 版本是 `1.8.0`。在开发版本 `1.9.0` 期间，引入了一个新 API，并通过版本 `1.9.0-insider` 在 Insider 版本中提供。如果你想发布一个受益于这个 API 的插件版本，你应该指明版本依赖 `^1.9.0`。这样，你的新插件版本将只在 VS Code `>=1.9.0` 上可用（换句话说，只有使用当前 Insiders 版本的用户可用）。使用 VS Code Stable 的用户只有在 Stable 版本达到 `1.9.0` 时才会收到更新。

要按日期定位某个 Insiders 构建，请以 `YYYYMMDD` 格式将日期标签附加到版本上。VS Code 1.57 及更高版本会强制使用日期标签。更早的版本只评估版本的数字部分。例如，`^1.56.0-20210428` 定位的是 2021 年 4 月 28 日 0:00 UTC 或之后创建的 VS Code 1.56 或更高版本。

## 高级用法

### Marketplace 集成

你可以自定义插件在 Visual Studio Marketplace 中的外观。参见 [Go 插件](https://marketplace.visualstudio.com/items/golang.go)的示例。

以下是一些让插件在 Marketplace 上看起来更出色的提示：

- 在插件的根目录添加一个 `README.md` 文件，内容为你想要在插件的 Marketplace 页面上显示的内容。

  > [!NOTE]
  > 如果你的 `package.json` 中有 `repository` 属性，且指向一个公共 GitHub 仓库，`vsce` 会自动检测到它并相应地调整相对链接，默认使用 `main` 分支。你可以在运行 `vsce package` 或 `vsce publish` 时使用 `--githubBranch` 标志覆盖它。你也可以使用 `--baseContentUrl` 和 `--baseImagesUrl` 标志为链接和图片设置基础 URL。

- 在插件的根目录添加一个 `LICENSE` 文件，包含有关插件许可的信息。
- 在插件的根目录添加一个 `CHANGELOG.md` 文件，包含插件更改历史的信息。
- 在插件的根目录添加一个 `SUPPORT.md` 文件，包含有关如何获得插件支持的信息。
- 通过 `package.json` 中的 `galleryBanner.color` 属性指定相应的十六进制值，来设置 Marketplace 页面上的横幅背景颜色。
- 通过 `package.json` 中的 `icon` 属性指定一个相对路径，指向插件中包含的至少 128x128px 的 PNG 文件，来设置图标。

更多信息请参阅 [Marketplace 展示提示](/api/references/extension-manifest#marketplace-presentation-tips)。

### 验证发布者

你可以通过验证与你品牌或身份关联的[合格域名](#eligible-domains)的所有权，成为**已验证发布者**。一旦你的发布者通过验证，Marketplace 就会在你的插件详情中添加已验证徽章。

#### 先决条件
要成为已验证发布者，发布者必须在 VS Marketplace 上拥有一个或多个插件至少 6 个月，并且域名的注册时间也至少要有 6 个月。请在满足这些条件后再申请验证。

![VS Code 中的已验证发布者标识](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/verified-publisher.png)

要验证发布者：

1. 转到 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)。
2. 在左侧窗格中，选择或[创建](#create-a-publisher)你想要验证的发布者。
3. 在主窗格中，选择 **详细信息（Details）** 选项卡。

   ![发布者详细信息选项卡位置](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/publisher-details-tab.png)

4. 在**详细信息**选项卡的**已验证域名（Verified domain）**部分下，输入一个[合格域名](#eligible-domains)。

   ![发布者详细信息选项卡，带有要验证的域名](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/publisher-details-tab-verified-domain.png)

   > **注意**：开始输入后，你会注意到**详细信息**选项卡标题旁边有一个星号（*）。就像在 VS Code 中一样，这表示你有未保存的更改。出于同样的原因，**验证（Verify）**按钮目前处于禁用状态。

5. 选择 **保存（Save）**，然后选择 **验证（Verify）**。

   ![已保存待验证的域名](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/saved-domain-to-verify.png)

   将出现一个对话框窗口，为你提供关于向域名的 DNS 配置添加 TXT 记录的说明。

   ![TXT 记录验证](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/txt-record-verification.png)

6. 按照说明向域名的 DNS 配置添加 TXT 记录。
7. 在对话框窗口中选择 **验证（Verify）**，以验证 TXT 记录已成功添加。

   ![验证已提交](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/validation-submitted.png)

   一旦你的 TXT 记录通过验证，Marketplace 团队会审查你的请求，并在 5 个工作日内告知你结果。验证包括但不限于：域名、网站和插件的[资质记录先决条件](#prerequisites)、内容资格、合法性、可信度和良好声誉。

如果验证通过，你会在 Visual Studio Marketplace 发布者管理页面的发布者名称旁边看到相应的徽章：

![已验证发布者管理](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/verified-publisher-manage.png)

> **注意**：
> - 对发布者显示名称的任何更改都会撤销已验证徽章。
> - 发布者将来如果违反上述[使用条款](https://cdn.vsassets.io/v/M190_20210811.1/_content/Microsoft-Visual-Studio-Marketplace-Terms-of-Use.pdf)或验证要求，将撤销已验证徽章。

### 合格域名

合格域名需要满足以下条件：

- 你必须能够管理 DNS 配置设置并添加 TXT 记录。
- 它不是子域名（{subdomain}.github.io、{subdomain}.contoso.com 或类似域名）。
- 它必须使用 HTTPS 协议。
- 它必须能够对 HEAD 请求响应 HTTP 200 状态。

### 插件定价标签

你可以选择在插件的 Marketplace 页面上显示定价标签，以表明它是 `Free`（免费）或 `Free Trial`（免费试用）。

要显示定价标签，请将 `pricing` 属性添加到你的 `package.json`。例如：

```json
{
  "pricing": "Free"
}
```

允许的值为：`Free` 和 `Trial`（区分大小写）。当未指定 `pricing` 属性时，默认值为 `Free`。

> [!NOTE]
> 发布插件时，请确保使用 `vsce` 版本 >= `2.10.0`，定价标签才能生效。

### 插件赞助

你可以选择启用赞助，让你的用户有一种支持你工作的方式。

要显示赞助链接，请将 `sponsor` 属性添加到你的 `package.json`。例如：

```json
"sponsor": {
  "url": "https://github.com/sponsors/nvaccess"
}
```

> [!NOTE]
> 发布插件时，请确保使用 `vsce` 版本 >= `2.9.1`，赞助才能生效。

赞助链接将出现在 Marketplace 上插件页面的插件详情标题中，也会出现在 VS Code 中：

![插件详情页面中的赞助链接](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/sponsor-link-example.png)

我们希望这能让我们的用户资助他们所依赖的插件，以提高插件的性能、可靠性和稳定性。

### 使用 .vscodeignore

你可以创建一个 `.vscodeignore` 文件，防止某些文件被包含到插件的包中。这个文件是一组 [glob](https://github.com/isaacs/minimatch) 模式，每行一个。例如：

```bash
**/*.ts
**/tsconfig.json
!file.ts
```

你应该忽略所有运行时不需要的文件。例如，如果你的插件是用 TypeScript 编写的，你应该忽略所有 `**/*.ts` 文件，就像上面的例子一样。

> [!NOTE]
> `devDependencies` 中列出的开发依赖会被自动忽略，所以你不必显式添加它们。

### 预发布步骤

你可以向清单文件添加一个预发布步骤，每次打包插件时都会调用它。例如，你可能想在此阶段调用 [TypeScript](https://www.typescriptlang.org/) 编译器：

```json
{
  "name": "uuid",
  "version": "0.0.1",
  "publisher": "someone",
  "engines": {
    "vscode": "0.10.x"
  },
  "scripts": {
    "vscode:prepublish": "tsc"
  }
}
```

### 预发布插件

用户可以在 VS Code 或 VS Code Insiders 中安装插件的预发布版本，以便在官方插件发布之前定期获取最新版本。

![GitHub PR 插件在扩展视图中的预发布版本](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/pre-release.png)

要发布预发布版本，请将 `--pre-release` 标志传给 `vsce package` 或 `vsce publish` 命令：

```bash
vsce package --pre-release
vsce publish --pre-release
```

我们只支持 `major.minor.patch` 形式的插件版本，`semver` 预发布标签**不受支持**。预发布和常规发布的版本必须不同。也就是说，如果 `1.2.3` 作为预发布上传，下一个常规发布必须以不同的版本上传，例如 `1.2.4`。将来会提供完整的 `semver` 支持。

VS Code 会自动将插件更新到可用的最高版本，所以即使某个用户选择了预发布版本，而有一个更高版本的插件发布，该用户也会被更新到已发布版本。因此，我们建议插件对发布版本使用 `major.EVEN_NUMBER.patch`，对预发布版本使用 `major.ODD_NUMBER.patch`。例如：发布版本用 `0.2.*`，预发布版本用 `0.3.*`。

如果插件作者不希望他们的预发布用户被更新到发布版本，我们建议在发布版本之前总是递增并发布一个新的预发布版本，以确保预发布版本始终更高。请注意，虽然预发布用户会在发布版本更高时被更新到发布版本，但他们仍然有资格自动更新到版本号高于发布版本的未来预发布版本。

预发布插件在 VS Code 版本 `1.63.0` 之后受支持，所以所有预发布插件都应在 `package.json` 中将 `engines.vscode` 值设置为 `>= 1.63.0`。

> [!NOTE]
> 已经有单独的独立预发布插件的插件，应联系 VS Code 团队，以启用自动卸载过时的独立插件，并安装主插件的预发布版本。

### 特定平台插件

你可以为 VS Code 运行的每个平台（Windows、Linux、macOS）发布插件的 VSIX 包。我们将此类插件称为**特定平台**插件。

从版本 `1.61.0` 开始，VS Code 会查找与当前平台匹配的插件包。

如果你的插件包含特定平台的库或依赖，特定平台插件会很有用，因为你可以控制在平台包中包含的确切二进制文件。一个常见的用例是使用**原生 node 模块**。

特定平台插件作为包含特定平台内容的独立包发布。你可以通过传入 [`--target` 标志](#publishing)来指定目标平台。如果不传这个标志，该包将被用作所有没有特定平台包的平台的回退。

目前可用的平台有：`win32-x64`、`win32-arm64`、`linux-x64`、`linux-arm64`、`linux-armhf`、`alpine-x64`、`alpine-arm64`、`darwin-x64`、`darwin-arm64` 和 `web`。

如果你希望特定平台插件也支持在浏览器中作为 [web 插件](/api/extension-guides/web-extensions)运行，发布时**必须**以 `web` 平台为目标。`web` 平台会遵循 `package.json` 中的 `browser` 入口点。要禁用 `web` 中不支持的插件能力，我们建议在 `package.json` 中使用 `when` 子句，而不是为 web 平台发布单独的 `package.json`，或删除 VSIX 中在 `web` 中无法工作的部分。

#### 发布

从版本 `1.99.0` 开始，[vsce](https://github.com/microsoft/vscode-vsce) 支持 `--target` 参数，允许你在打包和发布 VSIX 时指定目标平台。

以下是如何为 `win32-x64` 和 `win32-arm64` 平台发布 VSIX：

```bash
vsce publish --target win32-x64 win32-arm64
```

或者，你也可以在打包时使用 `--target` 标志创建特定平台的 VSIX。例如，要为 `win32-x64` 平台打包 VSIX，然后发布它：

```bash
vsce package --target win32-x64
vsce publish --packagePath PATH_TO_WIN32X64_VSIX
```

#### 持续集成

管理多个特定平台的 VSIX 可能会让人应接不暇，所以我们建议使用[持续集成](/api/working-with-extensions/continuous-integration)（CI）工具自动化你的插件构建过程。例如，你可以使用 [GitHub Actions](https://github.com/features/actions) 构建你的插件。我们的[特定平台插件示例](https://github.com/microsoft/vscode-platform-specific-sample)可以作为学习的起点：它的[工作流](https://github.com/microsoft/vscode-platform-specific-sample/blob/main/.github/workflows/ci.yml)实现了常见的场景——使用特定平台插件支持，在所有受支持的 VS Code 目标中分发原生 node 模块作为依赖。

## 下一步

- [扩展市场](/docs/configure/extensions/extension-marketplace) - 了解 VS Code 的公共扩展市场的更多信息。
- [测试插件](/api/working-with-extensions/testing-extension) - 为你的插件项目添加测试，以确保高质量。
- [打包插件](/api/working-with-extensions/bundling-extension) - 通过使用 webpack 打包插件文件来改善加载时间。

## 常见问题

### 我在尝试发布插件时收到“You exceeded the number of allowed tags of 30”错误？

Visual Studio Marketplace 不允许插件包在 `package.json` 中包含超过 30 个 `keywords`。将关键字/标签数量限制在最多 30 个，以避免此错误。

### 我在尝试发布插件时收到 403 Forbidden（或 401 Unauthorized）错误？

创建 PAT（个人访问令牌）时一个容易犯的错误，是在**组织**字段下拉框中选择特定的组织，而不是**所有可访问的组织**。另一个可能的错误是作用域不正确——你应该将授权的范围设置为 `Marketplace (Manage)`，发布才能工作。

### 我无法通过 `vsce` 工具撤销发布插件？

你可能更改了插件 ID 或发布者 ID。你也可以直接通过 [Visual Studio Marketplace 发布者管理页面](https://marketplace.visualstudio.com/manage)管理你的插件。例如，更新或[撤销发布](#unpublishing-extensions)。

### 为什么 vsce 不保留文件属性？

请注意，在 Windows 上构建和发布插件时，插件包中包含的所有文件都会缺少 POSIX 文件属性，也就是可执行位。一些 `node_modules` 依赖依赖这些属性才能正常工作。从 Linux 和 macOS 发布则符合预期。

### 我可以在持续集成（CI）构建中发布吗？

可以，请参阅[持续集成](/api/working-with-extensions/continuous-integration)主题中的[自动化发布](/api/working-with-extensions/continuous-integration#automated-publishing)部分，了解如何配置 Azure DevOps、GitHub Actions 和 GitLab CI，以自动将插件发布到 Marketplace。

### 我尝试发布插件时收到“ERROR The extension 'name' already exists in the Marketplace”错误？

Marketplace 要求每个插件的[插件名称](/api/references/extension-manifest)都是唯一的。如果 Marketplace 中已经存在同名的插件，你会收到以下错误：

```
ERROR The extension 'name' already exists in the Marketplace.
```

同样的规则也适用于插件的[显示名称](/api/references/extension-manifest)。

### 支持哪些包管理器？

你可以使用 npm 或 yarn v1 来管理插件的依赖。

### 我需要关于 VS Marketplace 帐户的帮助，或在发布插件时需要支持？

你可以登录 [Manage Publishers & Extensions](https://marketplace.visualstudio.com/manage)，然后点击右上角的“Contact Microsoft”链接，联系 VS Marketplace 支持团队。
