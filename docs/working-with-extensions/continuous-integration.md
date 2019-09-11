# 持续集成

插件测试也可以用诸如[Travis CI](https://travis-ci.org/)自动运行测试。[`vscode-test`](https://github.com/Microsoft/vscode-test)库可以基于 CI 设置插件测试，而且里面还包含了一个 Azure Pipelines 的[示例插件](https://github.com/microsoft/vscode-test/tree/master/sample)。你可以先看看[构建管线](https://dev.azure.com/vscode/vscode-test/_build?definitionId=15)是什么样子的，或者直接查看[`azure-pipelines.yml`file](https://github.com/microsoft/vscode-test/blob/master/sample/azure-pipelines.yml)。

## Azure Pipelines

---

![pipelines-logo](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/continuous-integration/pipelines-logo.png)

你可以在[Azure DevOps](https://azure.microsoft.com/services/devops/)上创建免费的项目，它为你提供了代码托管、看板、构建和测试基础设施等等。最重要的是，你可以获得[10 个免费的并行任务](https://azure.microsoft.com/services/devops/pipelines/)容量，用于你构建项目，不论是在 Windows, macOS 还是 Linux 上。

首先，你需要创建一个免费的[Azure DevOps](https://azure.microsoft.com/services/devops/)账号，然后给你的插件创建一个[Azure DevOps 项目](https://azure.microsoft.com/en-us/features/devops-projects/)。

然后，把`azure-pipelines.yml`文件添加到插件仓库的根目录下，不同于 Linux 中的`xvfb`配置脚本，需要 VS Code 运行在 Linux 的无头 CI 机器上，我们的配置文件非常简单：

```yaml
trigger:
  - master

strategy:
  matrix:
    linux:
      imageName: "ubuntu-16.04"
    mac:
      imageName: "macos-10.13"
    windows:
      imageName: "vs2017-win2016"

pool:
  vmImage: $(imageName)

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "8.x"
    displayName: "Install Node.js"

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
      DISPLAY: ":99.0"
```

最后，在你的 DveOps 项目里[创建一个新的管线](https://docs.microsoft.com/azure/devops/pipelines/get-started-yaml?view=vsts#get-your-first-build)，然后指向`azure-pipelines.yml`文件，启动 build，然后……真香~

![pipelines](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/continuous-integration/pipelines.png)

你可以启用持续构建——每当有 pull requests 进入特定分支的时候自动进行构建。相关内容请查看[构建管线触发器](https://docs.microsoft.com/azure/devops/pipelines/build/triggers)。

## Travis CI

---

[vscode-test](https://github.com/microsoft/vscode-test)还包含了一份[Travis CI 构建文件](https://github.com/microsoft/vscode-test/blob/master/.travis.yml)，因为 Travis 上的环境变量定义和 Azure 所有不同，`xvfb`脚本也有些许不一样：

```yaml
language: node_js
os:
  - osx
  - linux
node_js: 8

install:
  - |
    if [ $TRAVIS_OS_NAME == "linux" ]; then
      export DISPLAY=':99.0'
      /usr/bin/Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
    fi
script:
  - |
    echo ">>> Compile vscode-test"
    yarn && yarn compile
    echo ">>> Compiled vscode-test"
    cd sample
    echo ">>> Run sample integration test"
    yarn && yarn compile && yarn test
cache: yarn
```
