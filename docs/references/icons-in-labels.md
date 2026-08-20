# 产品图标参考

Visual Studio Code 包含一组内置图标，用于视图和编辑器中，也可以在悬停提示、状态栏以及插件中使用。这些图标是**产品图标**，与**文件图标**相对，文件图标用于整个 UI 中文件名旁边。

VS Code 附带的产品图标包含在 [Codicon 图标字体](https://github.com/microsoft/vscode-codicons) 中，并构成**默认**产品图标主题。插件可以提供新的[产品图标主题](/extension-guides/product-icon-theme)来重新定义这些图标，为 VS Code 赋予全新的外观。

为实现这一点，所有产品图标都通过 ID 标识。图标标识符即用于 UI 组件的标签（`$(pencil)`）、API 中的 `ThemeIcon` 以及需要图标的配置点中。

图标标识符与实际图标字型之间的关联发生在产品图标主题中。

## 标签中的图标

图标可以在悬停提示的 Markdown 标签、[StatusBarItem](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem) 文本以及 [QuickPickItem](https://code.visualstudio.com/api/references/vscode-api#QuickPickItem) 标签 API 中使用。在 Markdown 中添加图标的语法是 `$(iconIdentifier)`：

```ts
$(alert);
```

你还可以嵌入文本并使用多个图标：

```ts
$(eye) $(heart) $(mark-github) GitHub
```

要在标签中放置字面量 `${...}` 文本，请使用反斜杠转义 `$`：

```ts
\$(eye)
```

## 动画

你可以通过在图标的名称后追加 `~spin`，为以下图标应用旋转动画：

- `sync`
- `loading`
- `gear`

```ts
$(sync~spin)
```

## 图标配置点

图标配置点允许插件按 ID 定义额外的图标，并附带一个默认图标。之后，该图标 ID 可以在标签（`$(iconId)`）中或任何可以使用 `ThemeIcon` 的地方（`new ThemeIcon("iconId")`）使用，可供插件（或任何依赖该插件的其他插件）使用。

```json
"contributes": {
  "icons": {
        "distro-ubuntu": {
            "description": "Ubuntu icon",
            "default": {
                "fontPath": "./distroicons.woff",
                "fontCharacter": "\\E001"
            }
        },
        "distro-fedora": {
            "description": "Ubuntu icon",
            "default": {
                "fontPath": "./distroicons.woff",
                "fontCharacter": "\\E002"
            }
        }
    }
}
```

产品图标主题可以重新定义该图标（如果它们知道该图标 ID 的话）。

## 图标列表

**图标列表**请参考[官方文档](https://code.visualstudio.com/api/references/icons-in-labels)