# 代码片段

[`contributes.snippets`](/extensibility-reference/contribution-points#contributessnippets)配置允许你将*代码片段*打包进VS Code插件中。

[创建代码片段](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets)主题详细介绍了新建代码片段的全部内容。本篇指南只是告诉你关于打包*代码片段*的大体思路。比较推荐的做法是：

- 用`Preferences: Configure User Snippets`命令创建和调试代码片段。
- 如果你觉得满意了，将整个JSON文件复制到插件目录下，起个名字比如说`snippets.json`文件。
- 将下列配置添加到你的`package.json`中

```json
{
	"contributes": {
		"snippets": [
			{
				"language": "javascript",
				"path": "./snippets.json"
			}
		]
	}
}
```

本篇的源代码在[https://github.com/Microsoft/vscode-extension-samples/tree/master/snippet-sample](https://github.com/Microsoft/vscode-extension-samples/tree/master/snippet-sample)

?> 提示：在`package.json`中添加如下分类，用户才能轻松找到你的插件。

```json
{
	"categories": ["Snippets"]
}
```

## 使用TextMate代码片段
---

你也可以用[yo code](/get-started/your-first-extension)将TextMate代码片段（.tmSnippets）直接添加到插件里去。生成器中的可选项`New Code Snippets`会帮你指向.tmSnippets的目录，它们最后都会一起打包到VS Code 插件里。生成器甚至还支持Sublime代码片段（.sublime-snippets）。

生成器最终输出的文件有两个：一份插件清单`package.json`，和一份转换为VS Code代码片段的`snippets.json`。

```bash
.
├── snippets                    // VS Code integration
│   └── snippets.json           // The JSON file w/ the snippets
└── package.json                // extension's manifest
```

把生成的代码片段文件夹复制到你的`.vscode/extensions`下的新文件夹中，然后重启VS Code。