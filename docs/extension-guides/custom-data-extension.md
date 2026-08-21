# 自定义数据插件

[自定义数据格式](https://github.com/microsoft/vscode-custom-data) 可帮助插件作者轻松地扩展 VS Code 的 HTML / CSS 语言支持能力，且不用多写一行代码。

通过以下两个[配置点](/references/contribution-points) 可以使用自定义数据：
- `contributes.html.customData`
- `contributes.css.customData`

比如，在插件的`package.json`中配置这两行之后：
```json
{
  "contributes": {
    "html": {
      "customData": ["./html.html-data.json"]
    },
    "css": {
      "customData": ["./css.css-data.json"]
    }
  }
}
```

VS Code 会根据这两个文件中定义的 HTML/CSS 实体，提供对应的语言支持能力，比如自动完成、悬停提示等。

你可以在 [自定义数据示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-data-sample) 中查看。