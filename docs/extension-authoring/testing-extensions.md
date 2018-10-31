# 测试你的插件

VS Code可以运行和调试支持VS Code API的插件。这些测试会运行在VS Code的特殊实例`扩展开发环境`中，这个环境有权访问全部的API。我们将这样的测试称为集成测试，因为它远远超越了单独运行在VS Code中的单元测试。本篇侧重于VS Code的集成测试，至于单元测试，你可以使用任何流行的测试框架，如[Mocha](https://mochajs.org/)或者[Jasmine](https://jasmine.github.io/)。

## Yo Code测试脚手架
---
[yo code 生成器](/extension-authoring/extension-generator.md)基础插件项目包含了一些示例测试和必要的基础设施。

!> **注意：**本篇假设你已经创建了一个Typescript插件（或Javascript插件），不然先参考[基础部分](extension-authoring/extension-generator)

打开一个插件项目目录，打开**调试**侧边栏选择`Extension Tests`配置。

![launch-tests](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/testing-extensions/launch-tests.png)

选中配置之后，点击绿色的小角标，启动调试。VS Code会在`扩展开发环境`实例中加载插件，然后运行调试。测试的输出会进入*调试控制台*：

![test-output](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensions/images/testing-extensions/test-output.png)

生成的测试使用了[Mocha 测试框架](https://mochajs.org/)的测试运行器和库。

插件项目文件夹中的附带了`src/test`，其中有一个`index.ts`文件，定义了Mocha测试运行器的配置，`extension.test.ts`中包含着测试示例`Something 1`。通常来说你可以不管`index.ts`，不过你也可以调整Mocha的配置。

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
用这个方式，你的测试就可以运行在可预测的文件结构中运行了。

## 从项目中排除测试文件
---
当你想要分享插件的时候，你可能就不需要测试文件出现在*插件包*里了。[.vscodeignore](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md#advance-usage)文件可以让你在使用[vsce构建工具](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md)的时候排除测试文件。默认情况下，`yo code`生成的项目会排除`test`和`out/test`文件夹。
```
out/test/**
```

## 使用Travis CI自动测试
---
你也可以用诸如[Travis CI](https://travis-ci.org/)自动构建机器来自动运行测试。

为了启动自动插件测试，`vscode`包需要提供一个可以运行下列任务的测试命令：
- 下载和解压VS Code
- 在VS Code内加载插件测试任务
- 将测试结果输出到控制台中，或在异常中退出

为了完成这项命令，打开你的`package.json`然后将下列代码添加到`scripts`中：
```json
"test": "node ./node_modules/vscode/bin/test"
```

你可以在顶层配置一个`.travis.yml`文件，就可以轻松地启用Travis CI了：
```yml
sudo: false

os:
  - osx
  - linux

before_install:
  - if [ $TRAVIS_OS_NAME == "linux" ]; then
      export CXX="g++-4.9" CC="gcc-4.9" DISPLAY=:99.0;
      sh -e /etc/init.d/xvfb start;
      sleep 3;
    fi

install:
  - npm install
  - npm run vscode:prepublish

script:
  - npm test --silent
```

上述脚本可以运行在Linux和macOS上，值得注意的一点是为了在Linux上运行测试，你需要配置一个`before_install`告诉Linux在构建中启动VS Code。

下面是一些用于测试运行器的可选的环境变量：

| 名称 | 描述 |
| --- | --- |
| CODE_VERSION | 运行测试的VS Code版本（如：0.10.10）|
| CODE_DOWNLOAD_URL | 下载VS Code的完整URL |
| CODE_TESTS_PATH |	执行测试的位置（默认是process.cwd()/out/test or process.cwd()/test） |
| CODE_EXTENSIONS_PATH | 加载插件的位置（默认是process.cwd()） |
| CODE_TESTS_WORKSPACE | test实例打开的工作区位置（默认是CODE_TESTS_PATH） |

## 在Windows中使用AppVeyor测试
---
你也可以在Windows中用[AppVeyor](https://www.appveyor.com/)进行测试

## 下一步

- [发开插件](/extension-authoring/developing-extensions.md) - 学习更多调试插件的内容。
- [vsce](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensions/publish-extension.md) - 使用VSCE命令行工具发布插件。
- [插件配置清单](/extensibility-reference/extension-manifest.md) - VS Code插件配置清单参阅。
- [扩展API](/extensibility-reference/vscode-api.md) - 学习更多VS Code扩展性API。