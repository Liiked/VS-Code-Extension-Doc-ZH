# 树视图

树视图 API 可以让插件在 VS Code 侧边栏中展示内容。这个内容需被规整为树结构，并且符合 VS Code [内置视图](https://code.visualstudio.com/docs/getstarted/userinterface#_views) 规范。

比如，内置的 查找引用结果 视图插件在独立的视图中展示相关搜索结果。

![References Search View](https://code.visualstudio.com/assets/api/extension-guides/tree-view/references-search-tree-view.png)

**查找所有引用** 的结果展示在 **引用** 视图容器的 **引用：结果** 树视图中。

本教程会教你编写一个插件，这个插件可以在 VS Code 中配置 *树视图* 和 *视图容器*。

## 树视图 API 基础

要解释树视图 API，我们需要先构建一个名为 **Node Dependencies** 的示例插件。这个插件会使用树视图展示当前目录下所有 Node.js 的依赖。添加树视图的第一步是在 `package.json` 中配置树视图，第二步是创建一个 `TreeDataProvider`，然后注册 `TreeDataProvider`。你可以在 [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample/README.md) Github 仓库中的 `tree-view-sample` 找到这个示例插件的完整源代码。

### 配置 package.json

首先，你要让 VS Code 知道你要配置一个视图，使用 `package.json` 中的 [contributes.views](../references/contribution-points.md#contributesviews) 配置点。

你的插件可以这么配置 `package.json`：

```json
{
  "name": "custom-view-samples",
  "displayName": "Custom view Samples",
  "description": "Samples for VS Code's view API",
  "version": "0.0.1",
  "publisher": "alexr00",
  "engines": {
    "vscode": "^1.74.0"
  },
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "views": {
      "explorer": [
        {
          "id": "nodeDependencies",
          "name": "Node Dependencies"
        }
      ]
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/node": "^10.12.21",
    "@types/vscode": "^1.42.0",
    "typescript": "^3.5.1",
    "tslint": "^5.12.1"
  }
}
```

?>**注意**：如果你的插件要求 VS Code 版本高于 1.74，那你必须要显式地在`activationEvents` 中列出 `onView:nodeDependencies`。

你必须要给这个视图起一个标识名和普通名称，你可以在下列位置中配置它：

- `explorer`: 侧边栏的资源管理器面板
- `debug`: 侧边栏的运行和调试面板
- `scm`: 侧边栏的源代码管理面板
- `test`: 侧边栏的测试资源管理器面板
- [自定义视图容器](#视图容器)

### 树结构数据供应器

第二步，给你注册的视图提供数据，这样VS Code 才能在视图中展示数据。要做到这一点，你应该先实现 [TreeDataProvider](https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider)。我们的 `TreeDataProvider` 会提供 node 依赖数据，不过你可以创建提供其他类型数据的供应器。

这个API 需要你实现两个必要方法：

- `getChildren(element?: T): ProviderResult<T[]>` - 为给定元素或根节点（如果未传递任何元素）返回子元素
- `getTreeItem(element: T): TreeItem | Thenable<TreeItem>` - 视图中需要展示的元素UI  ([TreeItem](https://code.visualstudio.com/api/references/vscode-api#TreeItem))

当用户打开树视图时，`getChildren` 会以不含 `element` 的形式调用。然后，你的 `TreeDataProvider` 应返回树视图的顶层项。在我们的例子中，`collapsibleState` 的顶层元素是 `TreeItemCollapsibleState.Collapsed`，也就是说树视图的顶层元素会以折叠的形式展示。将 `collapsibleState` 设置为 `TreeItemCollapsibleState.Expanded`，树视图的每一项则会以展开的形式展示。如果让 `collapsibleState` 保持默认的 `TreeItemCollapsibleState.None`，那么树视图的每一项都不会有子项。`collapsibleState` 为 `TreeItemCollapsibleState.None` 的项目不会调用 `getChildren`。

下面是 `TreeDataProvider` 提供 node 依赖数据的一个例子：

```ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve(
        this.getDepsInPackageJson(
          path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
        )
      );
    } else {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
    }
  }

  /**
   * 获取 package.json 的路径, 然后读取 dependencies 和 devDependencies 中的依赖
   */
  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (this.pathExists(packageJsonPath)) {
      const toDep = (moduleName: string, version: string): Dependency => {
        if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Dependency(
            moduleName,
            version,
            vscode.TreeItemCollapsibleState.Collapsed
          );
        } else {
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
        }
      };

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map(dep =>
            toDep(dep, packageJson.dependencies[dep])
          )
        : [];
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep =>
            toDep(dep, packageJson.devDependencies[dep])
          )
        : [];
      return deps.concat(devDeps);
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  };
}
```

### 注册 TreeDataProvider

第三步是把上面的数据供应器注册到视图上。

有下列两种方法可以做到：

- `vscode.window.registerTreeDataProvider` - 注册树视图供应器。通过注册 视图 ID 并结合上述数据供应器的方式完成。

```ts
const rootPath =
  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;
vscode.window.registerTreeDataProvider(
  'nodeDependencies',
  new NodeDependenciesProvider(rootPath)
);
```

- `vscode.window.createTreeView` - 创建树视图。通过注册 视图 ID 并结合上述数据供应器的方式完成。这个方法要求使用 [TreeView](https://code.visualstudio.com/api/references/vscode-api#TreeView)，然后你可以用这个视图完成其他视图操作。如果你需要使用 `TreeView` API 的话，请使用 `createTreeView`

```ts
vscode.window.createTreeView('nodeDependencies', {
  treeDataProvider: new NodeDependenciesProvider(rootPath)
});
```

下面我们看下插件最后的样子：

![view](https://code.visualstudio.com/assets/api/extension-guides/tree-view/view.png)

### 更新树视图的内容

我们的 node 依赖视图还是比较简单的，数据展示出来之后，它无法及时更新。如果给视图添加一个刷新按钮，并且及时使用 `package.json` 中的内容更新这个视图，那就非常有用了。要做到这点，我们可以用 
`onDidChangeTreeData` 事件。

- `onDidChangeTreeData?: Event<T | undefined | null | void>` - 如果你的树视图数据会变，而且你想要更新树视图的话可以使用这个方法

将下列代码添加到你的 `NodeDependenciesProvider` 中。

```ts
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
```

这样我们就有了一个刷新方法，但是还没人用它。我们可以添加一个命令来调用刷新。

在 `package.json` 的 `contributes` 中添加：

```json
  "commands": [
            {
                "command": "nodeDependencies.refreshEntry",
                "title": "Refresh",
                "icon": {
                    "light": "resources/light/refresh.svg",
                    "dark": "resources/dark/refresh.svg"
                }
            },
    ]
```

然后在你插件激活时注册这个命令：

```ts
import * as vscode from 'vscode';
import { NodeDependenciesProvider } from './nodeDependencies';

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  const nodeDependenciesProvider = new NodeDependenciesProvider(rootPath);
  vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  vscode.commands.registerCommand('nodeDependencies.refreshEntry', () =>
    nodeDependenciesProvider.refresh()
  );
}
```

现在我们的命令已经可以刷新 node 依赖视图了，但如果在视图上有个按钮的话会更好。我们已经给这个命令添加了 `icon`，所以我们如果把它添加到视图上应该也能展示。

在 `package.json` 的 `contributes` 中添加：

```json
"menus": {
    "view/title": [
        {
            "command": "nodeDependencies.refreshEntry",
            "when": "view == nodeDependencies",
            "group": "navigation"
        },
    ]
}
```

## 激活

要牢记的一点是你的插件必须只在用户用到的时候才激活。所以，你应该让用户开始使用视图时才激活你的插件。当你的插件声明 view 配置的时候，VS Code 会自动帮你完成这个任务。用户打开视图时，VS Code 会抛出一个激活事件 [onView:${viewId}](../references/activation-events.md#onview) (在上面的例子是 `onView:nodeDependencies`)。

?> **注意：**高于 1.74 版本的 VS Code中，你必须显式地在 `package.json` 中注册这个激活事件，这样 VS Code 会在视图中激活你的插件：
```json
"activationEvents": [
       "onView:nodeDependencies",
],
```

## 视图容器
---

*视图容器*包含了一列*视图(views)*，这些*视图*又包含在内置的*视图容器*中。

![view-container](https://code.visualstudio.com/assets/api/extension-guides/tree-view/view-container.png)

要想配置一个视图容器，你首先得注册`package.json`中的[`contributes.viewsContainers`](/references/contribution-points#contributesviewscontainers)。你还必须配置以下字段：

- `id`: 新视图容器的ID
- `title`: 视图容器上的名称
- `icon`: 当视图容器在活动栏中时所展示的图标

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

另外，你也可以通过 `panel` 将这个视图配置在面板中。

```json
"contributes": {
  "viewsContainers": {
    "panel": [
      {
        "id": "package-explorer",
        "title": "Package Explorer",
        "icon": "media/dep.svg"
      }
    ]
  }
}
```

## 给视图容器配置视图

当你创建好视图容器后，你就可以使用 `package.json` 中的 [`contributes.views`](../references/contribution-points#contributesviews) 了。

```json
"contributes": {
  "views": {
    "package-explorer": [
      {
        "id": "nodeDependencies",
        "name": "Node Dependencies",
        "icon": "media/dep.svg",
        "contextualTitle": "Package Explorer"
      }
    ]
  }
}
```

视图可通过 `visible`、`collapsed`、`hidden` 完成可选的 `visibility` 属性配置。VS Code 只会在工作区随这个视图首次打开时才会使用这个属性。此后，就完全听从用户配置的可见性了。如果你的视图容器中有很多视图，或者你的视图不是对使用你插件的每个用户都有用，可以考虑将视图设置为 `collapsed` 或 `hidden`。被 `hidden` 的视图会出现在视图容器的 “视图” 菜单中。

![Views Menu](https://code.visualstudio.com/assets/api/extension-guides/tree-view/views-menu.png)

## 视图操作

你的每一个行内树视图项目、树项目上下文菜单和视图顶部标题区域都可以使用 **操作** 功能。操作可通过你设置的命令实现，在 `package.json` 中添加配置，可以指定它们要展示的具体位置。

你可以配置3个位置，使用 `package.json` 中的下列菜单配置：

- `view/title`: *视图*标题位置显示的操作。这里可以配置主要的操作，使用`"group": "navigation"`进行配置，剩余的二级操作则出现在`...`菜单中。
- `view/item/context`: 每个*视图项*的操作。这里可以配置主要的操作，使用`"group": "inline"`，剩余的二级操作则出现在`...`菜单中。

使用`when`属性控制这些操作的展示。

![view-actions](https://code.visualstudio.com/assets/api/extension-guides/tree-view/view-actions.png)

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

操作默认以字符顺序排序。想要指定不同的顺序，可以给需要成组的的操作添加 `@`。比如 `navigation@3` 会让 操作出现在 `navigation` 中的第三个位置上。

你可以创建不同的组，将操作分布到 `...` 菜单中。这些组名可以是任意的，不同的组名都会以字符顺序排序。

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

## 欢迎内容

如果你的视图可以为空，如果你想给插件的空视图添加一些欢迎内容，你可以配置 `viewsWelcome`。空视图是一种不含 `TreeView.message` 和没有树数据的视图。

```json
"contributes": {
  "viewsWelcome": [
    {
      "view": "nodeDependencies",
      "contents": "No node dependencies found [learn more](https://www.npmjs.com/).\n[Add Dependency](command:nodeDependencies.addEntry)"
    }
  ]
}
```

![Welcome Content](https://code.visualstudio.com/assets/api/extension-guides/tree-view/welcome-content.png)

欢迎内容支持链接。依照惯例，一行中如果只有一个链接，那么它会展示为按钮。每个欢迎内容都可包含 `when` 子句。更多示例可参考 [内置 Git 插件](https://github.com/microsoft/vscode/tree/main/extensions/git)。

## TreeDataProvider

插件作者应该程序式地注册一个 [TreeDataProvider](https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider) 来更新视图中的数据。

```ts
vscode.window.registerTreeDataProvider('nodeDependencies', new DepNodeProvider());
```

在 `tree-view-sample` 中的 [nodeDependencies.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample/src/nodeDependencies.ts) 查看实现细节。

## 树视图

如果你想让树视图程序式地实现一些 UI 内容，你可以使用 `window.createTreeView` 而不是 `window.registerTreeDataProvider`。这样你就可以控制视图，然后实现一些视图操作了。

```ts
vscode.window.createTreeView('ftpExplorer', {
  treeDataProvider: new FtpTreeDataProvider()
});
```

在 `tree-view-sample` 中的 [ ftpExplorer.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample/src/ftpExplorer.ts) 查看实现细节。
