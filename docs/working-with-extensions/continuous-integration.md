# 持续集成

插件集成测试可以在 CI 服务上运行。[`@vscode/test-electron`](https://github.com/microsoft/vscode-test) 库帮助你在 CI 提供者上设置插件测试，并包含一个在 Azure Pipelines 上配置的[示例插件](https://github.com/microsoft/vscode-test/tree/main/sample)。你可以查看[构建管道](https://dev.azure.com/vscode/vscode-test/_build?definitionId=15)，或直接跳转到 [`azure-pipelines.yml` 文件](https://github.com/microsoft/vscode-test/blob/main/sample/azure-pipelines.yml)。

## 自动化发布

你也可以配置 CI 自动发布插件的新版本。

发布命令与使用 [`vsce`](https://github.com/microsoft/vscode-vsce) 从本地环境发布类似，但你必须以安全的方式提供个人访问令牌（PAT）。通过将 PAT 存储为 `VSCE_PAT` **密钥变量（secret variable）**，`vsce` 就能使用它。密钥变量永远不会被暴露，因此在 CI 管道中使用是安全的。

## Azure Pipelines

<a href="https://azure.microsoft.com/services/devops/"><img alt="Azure Pipelines" src="https://code.visualstudio.com/assets/api/working-with-extensions/continuous-integration/pipelines-logo.png" width="318" /></a>

[Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) 非常适合运行 VS Code 插件测试，因为它支持在 Windows、macOS 和 Linux 上运行测试。对于开源项目，你可以获得无限分钟和 10 个免费的并行作业。本节说明如何设置 Azure Pipelines 来运行你的插件测试。

首先，在 [Azure DevOps](https://azure.microsoft.com/services/devops/) 上创建一个免费帐户，并为你的插件创建一个 [Azure DevOps 项目](https://azure.microsoft.com/features/devops-projects/)。

然后，将以下 `azure-pipelines.yml` 文件添加到插件仓库的根目录。除了在无头 Linux CI 机器上运行 VS Code 所需的 Linux `xvfb` 设置脚本之外，这个配置还是非常简单的：

```yaml
trigger:
  branches:
    include:
    - main
  tags:
    include:
    - v*

strategy:
  matrix:
    linux:
      imageName: 'ubuntu-latest'
    mac:
      imageName: 'macos-latest'
    windows:
      imageName: 'windows-latest'

pool:
  vmImage: $(imageName)

steps:

- task: NodeTool@0
  inputs:
    versionSpec: '10.x'
  displayName: 'Install Node.js'

- bash: |
    /usr/bin/Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
    echo ">>> Started xvfb"
  displayName: Start xvfb
  condition: and(succeeded(), eq(variables['Agent.OS'], 'Linux'))

- bash: |
    echo ">>> Compile vscode-test"
    yarn && yarn compile
    echo ">>> Compiled vscode-test"
    cd sample
    echo ">>> Run sample integration test"
    yarn && yarn compile && yarn test
  displayName: Run Tests
  env:
    DISPLAY: ':99.0'
```

最后，在你的 DevOps 项目中[创建新的管道](https://learn.microsoft.com/azure/devops/pipelines/create-first-pipeline)，并将其指向 `azure-pipelines.yml` 文件。触发一次构建，搞定：

![pipelines](https://code.visualstudio.com/assets/api/working-with-extensions/continuous-integration/pipelines.png)

你可以让构建在推送到分支时持续运行，甚至在拉取请求上运行。更多信息请参阅[构建管道触发器](https://learn.microsoft.com/azure/devops/pipelines/build/triggers)。

### Azure Pipelines 自动化发布

1. 使用 [Azure DevOps 密钥变量说明](https://learn.microsoft.com/azure/devops/pipelines/process/variables?tabs=classic%2Cbatch#secret-variables)将 `VSCE_PAT` 设置为密钥变量。
2. 将 `vsce` 安装为 `devDependencies`（`npm install @vscode/vsce --save-dev` 或 `yarn add @vscode/vsce --dev`）。
3. 在 `package.json` 中声明一个不包含 PAT 的 `deploy` 脚本（默认情况下，`vsce` 会将 `VSCE_PAT` 环境变量用作个人访问令牌）。

```json
"scripts": {
  "deploy": "vsce publish --yarn"
}
```

4. 配置 CI，使构建在创建标签时也会运行：

```yaml
trigger:
  branches:
    include:
    - main
  tags:
    include:
    - refs/tags/v*
```

5. 在 `azure-pipelines.yml` 中添加一个 `publish` 步骤，使用密钥变量调用 `yarn deploy`。

```yaml
- bash: |
    echo ">>> Publish"
    yarn deploy
  displayName: Publish
  condition: and(succeeded(), startsWith(variables['Build.SourceBranch'], 'refs/tags/'), eq(variables['Agent.OS'], 'Linux'))
  env:
    VSCE_PAT: $(VSCE_PAT)
```

[condition](https://learn.microsoft.com/azure/devops/pipelines/process/conditions) 属性告诉 CI 只在特定情况下运行发布步骤。

在我们的示例中，条件有三个检查：

- `succeeded()` - 仅在测试通过时发布。
- `startsWith(variables['Build.SourceBranch'], 'refs/tags/')` - 仅在打了标签（发布）的构建时发布。
- `eq(variables['Agent.OS'], 'Linux')` - 如果你的构建在多个代理（Windows、Linux 等）上运行，则包含此项。如果不是，请移除条件的这一部分。

由于 `VSCE_PAT` 是密钥变量，它不能立即作为环境变量使用。因此，我们需要显式地将环境变量 `VSCE_PAT` 映射到密钥变量。

## GitHub Actions

你也可以配置 GitHub Actions 来运行你的插件 CI。在无头 Linux CI 机器上，运行 VS Code 需要 `xvfb`，所以如果当前操作系统是 Linux，请在启用 Xvfb 的环境中运行测试：

```yaml
on:
  push:
    branches:
      - main

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: $\{{ matrix.os }}
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Install Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 18.x
    - run: npm install
    - run: xvfb-run -a npm test
      if: runner.os == 'Linux'
    - run: npm test
      if: runner.os != 'Linux'
```

### GitHub Actions 自动化发布

1. 使用 [GitHub Actions 机密说明](https://docs.github.com/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)将 `VSCE_PAT` 设置为加密机密。
2. 将 `vsce` 安装为 `devDependencies`（`npm install @vscode/vsce --save-dev` 或 `yarn add @vscode/vsce --dev`）。
3. 在 `package.json` 中声明一个不包含 PAT 的 `deploy` 脚本。
    ```json
    "scripts": {
      "deploy": "vsce publish --yarn"
    }
    ```
4. 配置 CI，使构建在创建标签时也会运行：
    ```yaml
    on:
      push:
        branches:
        - main
      release:
        types:
        - created
    ```
5. 向管道添加一个 `publish` 作业，使用密钥变量调用 `npm run deploy`。
    ```yaml
    - name: Publish
      if: success() && startsWith(github.ref, 'refs/tags/') && matrix.os == 'ubuntu-latest'
      run: npm run deploy
      env:
        VSCE_PAT: $\{{ secrets.VSCE_PAT }}
    ```

[if](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idif) 属性告诉 CI 只在特定情况下运行发布步骤。

在我们的示例中，有三个检查条件：

- `success()` - 仅在测试通过时发布。
- `startsWith(github.ref, 'refs/tags/')` - 仅在打了标签（发布）的构建时发布。
- `matrix.os == 'ubuntu-latest'` - 如果你的构建在多个代理（Windows、Linux 等）上运行，则包含此项。如果不是，请移除条件的这一部分。

## GitLab CI

GitLab CI 可以用于在无头 Docker 容器中测试和发布插件。这可以通过拉取预先配置好的 Docker 镜像，或在管道期间安装 `xvfb` 和运行 Visual Studio Code 所需的库来实现。

```yaml
image: node:12-buster

before_script:
  - npm install

test:
  script:
    - |
      apt update
      apt install -y libasound2 libgbm1 libgtk-3-0 libnss3 xvfb
      xvfb-run -a npm run test
```

### GitLab CI 自动化发布

1. 使用 [GitLab CI 文档](https://docs.gitlab.com/ee/ci/variables/README.html#mask-a-cicd-variable)将 `VSCE_PAT` 设置为掩码变量。
2. 将 `vsce` 安装为 `devDependencies`（`npm install @vscode/vsce --save-dev` 或 `yarn add @vscode/vsce --dev`）。
3. 在 `package.json` 中声明一个不包含 PAT 的 `deploy` 脚本。
    ```json
    "scripts": {
      "deploy": "vsce publish --yarn"
    }
    ```
4. 添加一个 `deploy` 作业，使用掩码变量调用 `npm run deploy`，它只会在标签上触发。
    ```yaml
    deploy:
      only:
        - tags
      script:
        - npm run deploy
    ```

## 常见问题

### 我需要在持续集成中使用 Yarn 吗？

上面的所有示例都指一个用 [Yarn](https://yarnpkg.com/) 构建的假设项目，但可以调整为使用 [npm](https://www.npmjs.com/)、[Grunt](https://gruntjs.com/)、[Gulp](https://gulpjs.com/) 或任何其他 JavaScript 构建工具。
