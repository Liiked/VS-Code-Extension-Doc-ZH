# 测试插件

VS Code为你的插件提供了运行和调试的能力。这些测试会运行在一个特殊的VS Code实例中`扩展开发环境`，这个实例拥有访问VS Code API的全部权限。我们把这些测试称之为集成测试，是因为它们不是可以在VS Code环境外就能随便运行的单元测试。本篇侧重于VS Code的集成测试，至于单元测试，你可以使用任何流行的测试框架，如[Mocha](https://mochajs.org/)或者[Jasmine](https://jasmine.github.io/)。

## Yo Code测试脚手架

如果你正在使用[yo code 生成器](https://github.com/Microsoft/vscode-generator-code)，那么生成的项目中应该已经包含了一些测试示例和指引。

!> **注意：**本节内容需要你至少已经创建了一个TS/JS插件，这两类插件有些许不同，但是原理都是一样的。

用VS Code 打开你新创建的插件项目，打开**调试**侧边栏选择`Extension Tests`配置。

![launch-tests](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/testing-extension/launch-tests.png)

启用这个配置之后，点击绿色的小角标(<kbd>F5</kbd>)，启动调试，VS Code会将你的插件加载进`扩展开发环境`中。测试输出（的日志、错误等）会显示在**调试控制台**中。

![test-output](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/working-with-extensions/images/testing-extension/test-output.png)

生成器生成的测试使用了[Mocha 测试框架](https://mochajs.org/)的测试运行器和库。

插件项目文件夹中的附带了`src/test`，其中有一个`index.ts`文件，定义了Mocha测试运行器的配置，`extension.test.ts`中包含着测试示例`Something 1`。通常来说你可以不管`index.ts`，不过你也可以通过修改它调整Mocha的配置。

```
├── src
│   └── test
│       ├── extension.test.ts
│       └── index.ts
```

你可以在`test`目录下创建更多的`test.ts`文件，它们会被自动构建（到`out/test`）然后运行。测试运行器只会匹配`*.test.ts`模式的文件。

## 加载测试配置
---

`Extension Tests`的配置文件在项目的`.vscode\launch.json`的文件中。就像`Extension`配置一样，通过`--extensionTestsPath`参数，指定编译的测试文件位置（假设是Typescript项目）。
```json
{
    "name": "Extension Tests",
    "type": "extensionHost",
    "request": "launch",
    "runtimeExecutable": "${execPath}",
    "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test"
    ],
    "outFiles": [
        "${workspaceFolder}/out/test/**/*.js"
    ]
}
```

## 将参数传递到扩展开发环境中
---
在加载配置中添加参数列表，然后测试示例就能在你指定的目录或文件中启动测试了。
```json
"args": [
    "file or folder name",
    "--extensionDevelopmentPath=${workspaceFolder}",
    "--extensionTestsPath=${workspaceFolder}/out/test"
]
```
这样一来，你的测试就可以运行在安全的目录结构中了。

## 从项目中排除测试文件
---
当你想要分享插件的时候，你可能不希望测试文件出现在*插件包*里。[.vscodeignore](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md#advance-usage)文件可以让你在使用[vsce构建工具](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md)的时候排除测试文件。默认情况下，`yo code`生成的项目会排除`test`和`out/test`文件夹。
```
out/test/**
```

## 下一步

- [持续集成](/working-with-extensions/continuous-integration.md)：将你的插件运行在持续集成服务中，比如Azure Devops。

