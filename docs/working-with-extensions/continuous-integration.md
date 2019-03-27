# 持续集成

插件测试也可以用诸如[Travis CI](https://travis-ci.org/)自动运行测试。`vscode`npm包提供了一个内置命令(`bin/test`)：

- 下载和解压VS Code
- 在VS Code中加载并测试你的插件
- 用合适的状态符号将结果输出至console(调试控制台)

下面是一些运行测试的可选环境变量：

| 名称 | 描述 |
| --- | --- |
| CODE_VERSION | 运行测试的VS Code版本（如：0.10.10）|
| CODE_DOWNLOAD_URL | 下载VS Code的完整URL |
| CODE_TESTS_PATH |	执行测试的位置（默认是process.cwd()/out/test or process.cwd()/test） |
| CODE_EXTENSIONS_PATH | 加载插件的位置（默认是process.cwd()） |
| CODE_TESTS_WORKSPACE | test实例打开的工作区位置（默认是CODE_TESTS_PATH） |

## Azure Pipelines
---
![pipelines-logo](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/continuous-integration/pipelines-logo.png)

你可以在[Azure DevOps](https://azure.microsoft.com/services/devops/)上创建免费的项目，它为你提供了代码托管、看板、构建和测试基础设施等等。最重要的是，你可以获得[10个免费的并行任务](https://azure.microsoft.com/services/devops/pipelines/)容量，用于你构建项目，不论是在Windows, macOS 还是Linux上。

注册好之后，创建一个新项目，只要简单地将下面的`build.yml`放到插件的根目录就可以了：

```yml
jobs:
- job: Windows
  pool:
    name: Hosted VS2017
    demands: npm
  steps:
  - task: NodeTool@0
    displayName: 'Use Node 8.x'
    inputs:
      versionSpec: 8.x
  - task: Npm@1
    displayName: 'Install dependencies'
    inputs:
      verbose: false
  - task: Npm@1
    displayName: 'Compile sources'
    inputs:
      command: custom
      verbose: false
      customCommand: 'run compile'
  - script: 'node node_modules/vscode/bin/test'
    displayName: 'Run tests'
- job: macOS
  pool:
    name: Hosted macOS
    demands: npm
  steps:
  - task: NodeTool@0
    displayName: 'Use Node 8.x'
    inputs:
      versionSpec: 8.x
  - task: Npm@1
    displayName: 'Install dependencies'
    inputs:
      verbose: false
  - task: Npm@1
    displayName: 'Compile sources'
    inputs:
      command: custom
      verbose: false
      customCommand: 'run compile'
  - script: 'node node_modules/vscode/bin/test'
    displayName: 'Run tests'
- job: Linux
  pool:
    name: Hosted Ubuntu 1604
    demands: npm
  steps:
  - task: NodeTool@0
    displayName: 'Use Node 8.x'
    inputs:
      versionSpec: 8.x
  - task: Npm@1
    displayName: 'Install dependencies'
    inputs:
      verbose: false
  - task: Npm@1
    displayName: 'Compile sources'
    inputs:
      command: custom
      verbose: false
      customCommand: 'run compile'
  - script: |
      set -e
      /usr/bin/Xvfb :10 -ac >> /tmp/Xvfb.out 2>&1 &
      disown -ar
    displayName: 'Start xvfb'
  - script: 'node node_modules/vscode/bin/test'
    displayName: 'Run tests'
    env:
      DISPLAY: :10
```

接下来在你的DevOps项目中新建一个Pipeline，并指向至`build.yml`文件，启动build，然后……真香~

![pipelines](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/continuous-integration/pipelines.png)