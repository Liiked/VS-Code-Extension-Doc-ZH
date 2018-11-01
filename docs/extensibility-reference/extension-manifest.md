# 插件清单文件——pacakge.json

每个VS Code插件需要根目录下的`package.json`文件。

## 字段
---

名称 | 必须 | 类型 | 详细
---- |:--------:| ---- | -------
`name` | Y | `string` | 插件的名称必须用全小写无空格的字母组成。
`version` | Y | `string` | [SemVer](https://semver.org/)版本模式兼容。
`publisher` | Y | `string` | [发行方名称](/extension-authoring/publish-extension.md#创建一个发行方)
`engines` | Y | `object` | 一个至少包含`vscode`字段的对象，其值必须[兼容](/extension-authoring/publish-extension.md#VS-Code版本兼容性) VS Code版本。不可以是`*`。例如：`^0.10.5` 表明最小兼容`0.10.5`版本的VS Code。
`license` | | `string` | 参考[npm's documentation](https://docs.npmjs.com/files/package.json#license)。如果你在插件根目录已经提供了`LICENSE`文件。那么`license`的值应该是`"SEE LICENSE IN <filename>"`。
`displayName` | | `string`| 插件市场所显示的插件名称。
`description` | | `string` | 简单地描述一下你的插件是做什么的。
`categories` | | `string[]` | 你想要使用的插件分类，可选值有：`[Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs]`
`keywords` | | `array` | **关键字**（数组），这样用户可以更方便地找到你的插件。到时候会和市场上的其他插件以**标签**筛选在一起。
`galleryBanner` | | `object` | 根据你的icon格式化市场的头部显示。详情见下。
`preview` | | `boolean` | 在市场中会显示Preview标记。
`main` | | `string` | 你的插件入口
[`contributes`](/extensibility-reference/contribution-points.md) | | `object` | 描述插件[发布内容](/extensibility-reference/contribution-points.md)的对象。
[`activationEvents`](/extensibility-reference/activation-events.md) | | `array` | [激活事件](/extensibility-reference/activation-events.md)数组。
`badges` | | `array` | 显示在插件市场页面侧边栏的[合法](#使用认证过的标志)标记。 每个标记都是一个对象，包含了3个属性：`url` 标记的图片URL，当用户点击标记和`description`时，会跳转到`href`。
`markdown` | | `string` | 控制市场中使用的Markdown渲染引擎。可以是`github` (默认) 或 `standard`。
`qna` | | `marketplace` (默认), `string`, `false` | 控制市场中的**Q & A** 链接。 设置成`marketplace`时，自动使用市场默认的Q & A网址。或者提供一个URL转跳到你的Q & A 地址。设置为`false`时禁用。
`dependencies` | | `object` | Node.js 运行时依赖。等同于[npm's `dependencies`](https://docs.npmjs.com/files/package.json#dependencies).
`devDependencies` | | `object` | Node.js 开发时依赖。 等同于[npm's `devDependencies`](https://docs.npmjs.com/files/package.json#devdependencies).
`extensionDependencies` | | `array` | 插件依赖，由插件ID组成的数组。当主要插件安装完成后，其他插件会相应安装。插件ID的格式为 `${publisher}.${name}`。比如：`vscode.csharp`。
`scripts` | | `object` | 等同于[npm的 `scripts`](https://docs.npmjs.com/misc/scripts)，不过有VS Code额外字段如[vscode:prepublish](/extension-authoring/publish-extension.md#预发布步骤)或[vscode:uninstall](#插件卸载钩子).
`icon` | | `string` | icon的文件路径，最小 128x128 像素 (视网膜屏幕则需 256x256)。

你还可以参考[npm的`package.json`](https://docs.npmjs.com/files/package.json)

## 示例
---
下面是一份完整的`package.json`示例


```json
{
    "name": "wordcount",
    "displayName": "Word Count",
    "version": "0.1.0",
    "publisher": "ms-vscode",
    "description": "Markdown Word Count Example - reports out the number of words in a Markdown file.",
    "author": {
        "name": "seanmcbreen"
    },
    "categories": [
        "Other"
    ],
    "icon": "images/icon.png",
    "galleryBanner": {
        "color": "#C80000",
        "theme": "dark"
    },
    "activationEvents": [
        "onLanguage:markdown"
    ],
    "engines": {
        "vscode": "^1.0.0"
    },
    "main": "./out/extension",
    "scripts": {
        "vscode:prepublish": "node ./node_modules/vscode/bin/compile",
        "compile": "node ./node_modules/vscode/bin/compile -watch -p ./"
    },
    "devDependencies": {
        "vscode": "0.10.x",
        "typescript": "^1.6.2"
    },
    "license": "SEE LICENSE IN LICENSE.txt",
    "bugs": {
        "url": "https://github.com/Microsoft/vscode-wordcount/issues",
        "email": "smcbreen@microsoft.com"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/Microsoft/vscode-wordcount.git"
    },
    "homepage": "https://github.com/Microsoft/vscode-wordcount/blob/master/README.md"
}
```

## 市场展示建议
---
下面是一些让你的插件在[市场](https://marketplace.visualstudio.com/VSCode)上看起来狂拽酷帅吊炸天的小建议。

使用`npm install -g vsce`安装最新的`vsce`。

在插件根目录中新建一个`README.md`文件，我们会把里面的内容作为插件的介绍（在市场上），你可以在`README.md`提供图片的相对路径。

下面是两个栗子🌰：

1. [Word Count](extension-authoring/example-word-count)
2. [MD Tools](https://marketplace.visualstudio.com/items/seanmcbreen.MDTools)

好的名字和描述是市场展示产品非常重要的部分。下述字符串用于VS Code文本搜索，带上关键字更容易被找到。

```json
    "displayName": "Word Count",
    "description": "Markdown Word Count Example - reports out the number of words in a Markdown file.",
```

Icon和banner颜色会展示在市场页面头部，`theme`属性是指banner中使用的字体主题——`dark`或`light`。

```json
{
    "icon": "images/icon.png",
    "galleryBanner": {
        "color": "#C80000",
        "theme": "dark"
    },
}
```

下面的几个可选链接（`bugs`，`homepage`，`repository`）会在市场的**Resources**部分显示：

```json
{
    "license": "SEE LICENSE IN LICENSE.txt",
    "homepage": "https://github.com/Microsoft/vscode-wordcount/blob/master/README.md",
    "bugs": {
        "url": "https://github.com/Microsoft/vscode-wordcount/issues",
        "email": "smcbreen@microsoft.com"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/Microsoft/vscode-wordcount.git"
    },
}
```

| 市场资源链接 | 对应的package.json属性 |
| -----------------|----------------------- |
| Issues | `bugs:url` |
| Repository | `repository:url` |
| Homepage | `homepage` |
| License | `license` |

设置插件的`category`，`category`一样的插件会分类到一起以便用户查找和筛选。

> **注意：**请使用有意义的分类值，允许的值有`[Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs]`。有语法高亮、代码补全功能的插件，请使用`Programming Languages`。`Language Packs`分类是为本地化保留的插件类别（例如：简体中文（本地化））。

```json
{
    "categories": [
        "Linters", "Programming Languages", "Other"
    ],
}
```

?> **小贴士：** The [Extension Manifest Editor](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.extension-manifest-editor) 插件可以帮你预览预览你的插件中的`README.md` 和 `package.json`， 生成的预览就像你已经发布到插件市场了一样。

## 使用认证过的标志
---
出于安全考虑，我们只允许可信服务商提供的标志。
我们允许来自下列URL前缀的标志：

* api.travis-ci.org
* badge.fury.io
* badges.frapsoft.com
* badges.gitter.im
* badges.greenkeeper.io
* cdn.travis-ci.org
* ci.appveyor.com
* codacy.com
* codeclimate.com
* codecov.io
* coveralls.io
* david-dm.org
* deepscan.io
* gemnasium.com
* githost.io
* gitlab.com
* img.shields.io
* isitmaintained.com
* marketplace.visualstudio.com
* opencollective.com
* snyk.io
* travis-ci.com
* travis-ci.org
* vsmarketplacebadge.apphb.com
* www.bithound.io
* www.versioneye.com
* nodesecurity.io

如果你想用其他标志，欢迎在我们的Github [issue](https://github.com/Microsoft/vscode/issues)页面提供建议。

## 整合插件配置内容
---
`yo code`可以帮你轻松地打包TextMate 主题，着色器，代码片段和创建新插件。当你运行了生成器，每一次配置都会创建一个完整、独立的插件包。但是，将多个配置内容整合进一个插件会更方便。比如：你想要支持一门新的语言，你会希望同时提供语法高亮和代码片段，甚至调试支持。

为了整合插件配置，编辑已有的`package.json`文件，然后添加新的配置内容，关联相关文件。

下面是一个包含了LaTex语言定义（语言标识符和相关文件插件），（语法）着色器和代码片段。

```json
{
    "name": "language-latex",
    "description": "LaTex Language Support",
    "version": "0.0.1",
    "publisher": "someone",
    "engines": {
        "vscode": "0.10.x"
    },
    "categories": [
        "Programming Languages",
        "Snippets"
    ],
    "contributes": {
        "languages": [{
            "id": "latex",
            "aliases": ["LaTeX", "latex"],
            "extensions": [".tex"]
        }],
        "grammars": [{
            "language": "latex",
            "scopeName": "text.tex.latex",
            "path": "./syntaxes/latex.tmLanguage.json"
        }],
        "snippets": [{
            "language": "latex",
            "path": "./snippets/snippets.json"
        }]
    }
}
```
注意插件的`categories`字段现在包含了`Programming Languages`和`Snippets`，以便用户在市场中找到这个插件。

?> **小贴士：** 整合好的配置文件应该使用同样的标识符。在上述例子中，所有的标识符都用了"latex"。这样VS Code 才知道（语法）着色器和代码片段是为LaTeX语言准备的，当编辑LaTeX文件的时候才会激活插件。

## 插件包
---
你也可以将几个独立的插件打包成一个“插件包”。插件包是指一组可以无冲突安装的插件集合。然后你就可以很方便地把插件分享给其他人，或者为特定情境创建一组插件，比如帮助PHP工程师在VS Code中快速上手。

一个插件包可以包含其他插件，或者直接将其打包到自身中。`package.json`中的`extensionDependencies`描述了这项依赖。

举个例子🌰，下面是一个PHP插件包，其中包含了调试器，语言服务器和格式化器。

```json
{
  "extensionDependencies": [
      "felixfbecker.php-debug",
      "felixfbecker.php-intellisense",
      "Kasik96.format-php"
  ]
}
```

当安装插件包的时候，VS Code会连同它的插件依赖一起安装。

插件包需要使用市场分类中的`Extension Packs`：

```json
{
  "categories": [
      "Extension Packs"
  ],
}
```

想要创建插件包，你可以使用`yo code`Yeoman生成器。另外，你也可以用你VS Code中已有的一些插件生成插件包，然后你就可以很轻松地从喜欢的插件中创建出插件包，再发布到市场上或者分享给其他用户。

插件包不应该有除了它内部打包之外的其他插件包，打包好的插件包应该是在整个包里面可以独立管理的。如果一个插件非常依赖另外一个插件，那么这个依赖性应该在`extensionDependencies`中声明。

#### 插件卸载钩子
---
如果你的插件在删除时需要做一些清理工作，你可以在package.json中的卸载钩子`vscode:uninstall`中注册一个`node`脚本。
```json
{
  "scripts": {
    "vscode:uninstall": "node ./out/src/lifecycle"
  }
}
```
这个脚本会在插件完全卸载之后执行，也就是插件完全卸载之后——VS Code重载（关闭然后启动）之后执行。

!> 注意：只支持Node.js脚本

## 使用 Node 模块
---
下面有几个npmjs的Node.js 模块，可以帮你实现VS Code插件。你可以在插件的`dependencies`部分包含进去。

- [vscode-nls](https://www.npmjs.com/package/vscode-nls) - 支持插件的国际化和本地化。
- [vscode-uri](https://www.npmjs.com/package/vscode-uri) - 使用VS Code实现的URI。
- [jsonc-parser](https://www.npmjs.com/package/jsonc-parser) - 允许带注释的JSON检查器。
- [request-light](https://www.npmjs.com/package/request-light) - 带代理支持的轻量级Node.js请求库。
- [vscode-extension](https://www.npmjs.com/package/vscode-extension-telemetry) - 提供VS Code 插件的持续遥测监控报告。
- [vscode-languageclient](https://www.npmjs.com/package/vscode-languageclient) - 轻松地将语言服务器绑定到语言服务器协议上。

## 下一步
学习更多VS Code扩展性模型，看看下面的话题：

- [发布内容配置点](/extensibility-reference/contribution-points.md) - VS Code 发布内容配置点参考
- [激活事件](/extensibility-reference/activation-events.md) - VS Code 激活事件参考
- [插件市场](https://code.visualstudio.com/docs/editor/extension-gallery) - 阅读更多关于 VS Code 插件市场的内容