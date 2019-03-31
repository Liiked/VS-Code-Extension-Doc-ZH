# 树视图

本节将教你如何为VS Code添加*视图容器*和*树视图*的插件，示例插件的源代码请查看[https://github.com/Microsoft/vscode-extension-samples/tree/master/tree-view-sample](https://github.com/Microsoft/vscode-extension-samples/tree/master/tree-view-sample)。

## 视图容器
---

*视图容器*包含了一列*视图(views)*，这些*视图*又包含在内置的*视图容器*中。

![view-container](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/tree-view/view-container.png)

要想配置一个视图容器，你首先得注册`package.json`中的[`contributes.viewsContainers`](/references/contribution-points#contributesviewscontainers)。你还必须配置以下字段：

- `id`: 新视图容器的名称
- `title`: 展示给用户的视图容器名称，它会显示在视图容器上方
- `icon`: 在活动栏中展示的图标

```json
"contributes": {
  "viewsContainers": {
    "activitybar": [
      {
        "id": "package-explorer",
        "title": "Package Explorer",
        "icon": "media/dep.svg"
      }
    ]
  }
}
```

## 树视图
---

*视图*是显示在视图容器中的UI片段。使用[`contributes.views`](/references/contribution-points#contributesviews)进行配置，你就可以将新的*视图*添加到内置或者你配置好的视图容器中了。

![view](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/tree-view/view.png)

要想配置一个*视图*，你首先得注册`package.json`中的[`contributes.views`](/references/vscode-api)。你必须给*视图*配置一个ID外加一个名称，你还可以配置*视图*出现的位置：

- `explorer`: 显示在资源管理器侧边栏
- `debug`: 显示在调试侧边栏
- `scm`: 显示在源代码侧边栏
- `test`: 测试侧边栏中的资源管理器视图
- 显示在你定义好的*视图容器*中

```json
"contributes": {
  "views": {
    "package-explorer": [
      {
        "id": "nodeDependencies",
        "name": "Node Dependencies",
        "when": "explorer"
      }
    ]
  }
}
```

当用户打开了对应的视图，VS Code会触发[`onView:${viewId}`](/references/activation-events?id=onview)事件(如上面例子中，这个事件写为`onView:nodeDependencies`)。你也可以通过配置`when`字段控制视图的展示。

## 视图的操作
---

你可以配置*视图*下述位置的操作：

- `view/title`: *视图*标题位置显示的操作。这里可以配置主要的操作，使用`"group": "navigation"`进行配置，剩余的二级操作则出现在`...`菜单中。
- `view/item/context`: 每个*视图项*的操作。这里可以配置主要的操作，使用`"group": "inline"`，剩余的二级操作则出现在`...`菜单中。

使用`when`属性控制这些操作的展示。

![view-actions](https://media.githubusercontent.com/media/Microsoft/vscode-docs/master/api/extension-guides/images/tree-view/view-actions.png)

例如：
```json
"contributes": {
  "commands": [
    {
      "command": "nodeDependencies.refreshEntry",
      "title": "Refresh",
      "icon": {
        "light": "resources/light/refresh.svg",
        "dark": "resources/dark/refresh.svg"
      }
    },
    {
      "command": "nodeDependencies.addEntry",
      "title": "Add"
    },
    {
      "command": "nodeDependencies.editEntry",
      "title": "Edit",
      "icon": {
        "light": "resources/light/edit.svg",
        "dark": "resources/dark/edit.svg"
      }
    },
    {
      "command": "nodeDependencies.deleteEntry",
      "title": "Delete"
    }
  ],
  "menus": {
    "view/title": [
      {
        "command": "nodeDependencies.refreshEntry",
        "when": "view == nodeDependencies",
        "group": "navigation"
      },
      {
        "command": "nodeDependencies.addEntry",
        "when": "view == nodeDependencies"
      }
    ],
    "view/item/context": [
      {
        "command": "nodeDependencies.editEntry",
        "when": "view == nodeDependencies && viewItem == dependency",
        "group": "inline"
      },
      {
        "command": "nodeDependencies.deleteEntry",
        "when": "view == nodeDependencies && viewItem == dependency"
      }
    ]
  }
}
```

!> **注意**：如果你需要针对特定的条目显示特殊的操作，定义树视图项的`TreeItem.contextValue`，并且在`when`中使用表达式，视图项的值储存在表达式的`viewItem`中。

如：

```json
"contributes": {
  "menus": {
    "view/item/context": [
      {
        "command": "nodeDependencies.deleteEntry",
        "when": "view == nodeDependencies && viewItem == dependency"
      }
    ]
  }
}
```

## 为树视图提供数据
---

插件创作者需要注册[`TreeDataProvider`](https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider)，以便动态生成*视图*中的数据。

```typescript
vscode.window.registerTreeDataProvider('nodeDependencies', new DepNodeProvider());
```

更多实现请参考[nodeDependencies.ts](https://github.com/Microsoft/vscode-extension-samples/tree/master/tree-view-sample/src/nodeDependencies.ts)

## 动态创建树视图
---

如果你想在*视图*中通过编程手段创建一些操作，你就不能再注册`window.registerTreeDataProvider`了，而是`window.createTreeView`，这样一来你就有权限提供你喜欢的视图操作了：

```typescript
vscode.window.createTreeView('ftpExplorer', {
  treeDataProvider: new FtpTreeDataProvider()
});
```

更多实现请参考[ftpExplorer.ts](https://github.com/Microsoft/vscode-extension-samples/tree/master/tree-view-sample/src/ftpExplorer.ts)