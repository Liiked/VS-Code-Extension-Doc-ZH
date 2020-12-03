# 产品图标主题（预览）

VS Code 包含了大量内置图标，他们可以用在视图、编辑器、悬浮栏、状态栏，甚至插件中。文末的示例中演示了在过滤器按钮、视图按钮、状态栏、断点、树视图折叠按钮、编辑器中使用图标。

产品图标主题让插件可以自定义 VS Code 的整体外观。但是 *产品主题图标* 不包含文件图标（会被文件图标主题覆盖）和插件配置的图标。

VS Code 要求图标一定是图标字体定义的字形，用于限制（当前）产品图标统一为一种颜色。图标的颜色可以在使用时，可被当前激活的主题色所修改。

!> 注意：产品图标主题仍在预览阶段，其配置格式还会有所修改。在正式发布之前，如果插件需要定义产品图标主题，需要打开`enableProposedApi`设置。你需要注意开发中的插件只能在 [Insider release](https://code.visualstudio.com/insiders/) 版本中运行。同时，你无法将这类插件发布到市场上。

## 添加一个新的产品图标主题

在 `package.json` 中的 `productIconTheme` 配置产品图标主题

```json
{
  "contributes": {
    "productIconTheme": [
      {
        "id": "aliensAreBack",
        "label": "Aliens Are Back",
        "path": "./producticons/aliens-product-icon-theme.json"
      }
    ]
  }
}
```

其中 `id` 是这个产品图标主题的唯一标识。它会显示在设置中，所以你定义 `id` 时注意要有唯一性和可读性。
`label` 则会展示在产品图标主题选择下拉框中。`path` 则指向了插件定义图标系列的地方。如果你的文件名遵循 `*product-icon-theme.json` 的格式，那么你在编辑图标主题文件时，你就会获得代码补全和悬浮提示。

当你完成图标主题之后，你还得在`package.json`中加上下面的配置

```json
"enableProposedApi": true
```

## 产品图标定义文件

产品图标定义文件由一个或多个图标字体组成的图标定义集合的 JSON 文件。

### 字体定义

`font`部分可以声明一个以上的字形字体。
这些字体稍后会在图标定义文件中可以引用。如果图标定义不指定字体 ID，那么默认会使用第一个声明的字体。

将字体文件复制到你的插件里，然后设置好相应的路径。

我们建议你使用 [WOFF](https://developer.mozilla.org/docs/Web/Guide/WOFF) 字体

- 设置字体格式为'woff'
- weight 属性值定义[在这](https://developer.mozilla.org/docs/Web/CSS/font-weight#Values)
- style 属性值定义[在这](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-style#Values)

```json
{
  "fonts": [
    {
      "id": "alien-font",
      "src": [
        {
          "path": "./alien.woff",
          "format": "woff"
        }
      ],
      "weight": "normal",
      "style": "normal"
    }
  ]
}
```

### 图标定义

VS Code 维护了一个被视图引用的图标ID列表，产品图标的 `iconDefinitions` 可以将新的图标设置到这些 ID 上。

每个定义都要使用 `fontId` 引用定义在 `fonts` 部分的字体，如果遗漏了 `fontId`，则会取字体定义中的首个字体。

```json
{
  "iconDefinitions": {
    "dialog-close": {
      "fontCharacter": "\\43",
      "fontId": "alien-font"
    }
  }
}
```

所有图标的 ID 可以在 [图标参考](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing) 中查看


## 开发和测试

VS Code 为 `package.json` 内置了多种编辑特性。想在产品图标主题文件中启动这个功能，你的主题文件需要以 `product-icon-theme.json` 结尾。然后你就获得了所有属性的代码补全、悬浮提示和校验。

现在试一下产品图标主题，在 VS Code 中打开你的产品图标主题插件目录，然后按下`F5`，接着 VS Code 会启动插件开发主机并运行你的插件。这个窗口启用了你的插件，并且自动使用了第一个产品图标主题。

并且 VS Code 会监测主题文件的变动，任何图标的更新都会自动应用到 VS Code 界面上。只要你修改了产品图标定义文件，你就可以在界面上看到实时变化。

使用**Preferences: Product Icon Theme**切换产品图标主题。

想要知道 VS Code UI的某个图标到底用的是什么，打开**Help > Toggle Developer Tools**然后：
- 点击开发者工具左上角的检查工具
- 将鼠标移动到你想要检查的图标上
- 如果图标的类名是`codicon.codicon-remote`，那么这个图标的 ID 就是`remote`

![dev-tool-select-tool](https://code.visualstudio.com/assets/api/extension-guides/product-icon-theme/dev-tool-select-tool.png)

## 示例

[产品颜色主题示例](https://github.com/microsoft/vscode-extension-samples/tree/master/product-icon-theme-sample) 可以供你体验和使用。