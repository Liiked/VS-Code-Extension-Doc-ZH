# 标签中的图标

你可以在插件中使用github提供的开源图标[Octicons](https://octicons.github.com/)，你甚至可以在[`StatusBarItem`](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem)文本和[`QuickPickItem`](https://code.visualstudio.com/api/references/vscode-api#QuickPickItem)标签中使用。添加图标的语法如下：

```typescript
$(alert);
```

你还可以像这样使用多个标签

```typescript
$(eye) $(heart) $(mark-github) GitHub
```

#### 图标列表

**图标列表**请参考[官方文档](https://code.visualstudio.com/api/references/icons-in-labels)