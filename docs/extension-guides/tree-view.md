# 树视图

Tree View API 允许插件在 Visual Studio Code 的侧边栏中显示内容。这些内容以树的形式组织，并遵循 VS Code [内置视图](/docs/editing/userinterface.md#views)的样式。

例如，内置的“引用搜索视图”插件会将引用搜索结果显示为单独的视图。

![引用搜索视图](https://code.visualstudio.com/assets/api/extension-guides/tree-view/references-search-tree-view.png)

**查找所有引用**的结果显示在 **References: Results** 树视图中，该视图位于 **References** 视图容器中。

本指南将教你如何编写一个向 Visual Studio Code 提供 Tree View 和 View Container 的插件。

## Tree View API 基础

为了解释 Tree View API，我们将构建一个名为 **Node Dependencies** 的示例插件。该插件将使用树视图显示当前文件夹中的所有 Node.js 依赖项。添加树视图的步骤是：在 `package.json` 中配置树视图，创建 `TreeDataProvider`，并注册 `TreeDataProvider`。你可以在这个 [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample/README.md) GitHub 仓库的 `tree-view-sample` 中找到该示例插件的完整源代码。

### package.json 配置

首先，你需要使用 `package.json` 中的 [contributes.views](/api/references/contribution-points#contributes.views) 配置点让 VS Code 知道你正在配置一个视图。

这是我们插件第一个版本的 `package.json`：

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

:::info
 **注意**：如果你的插件面向早于 1.74 的 VS Code 版本，则必须显式在 `activationEvents` 中列出 `onView:nodeDependencies`。
:::

你必须为视图指定标识符和名称，并且可以将其配置到以下位置：

- `explorer`：侧边栏中的资源管理器视图。
- `debug`：侧边栏中的“运行和调试”视图。
- `scm`：侧边栏中的源代码管理视图。
- `test`：侧边栏中的测试资源管理器视图。
- [自定义视图容器](#view-container)。

### Tree Data Provider

第二步是为已注册的视图提供数据，以便 VS Code 可以在视图中显示数据。为此，你首先应该实现 [TreeDataProvider](/api/references/vscode-api#TreeDataProvider)。我们的 `TreeDataProvider` 将提供节点依赖项数据，但你可以拥有提供其他类型数据的数据提供器。

此 API 中有两个你必须实现的方法：

- `getChildren(element?: T): ProviderResult<T[]>` —— 实现此方法以返回给定 `element` 或根节点（如果未传入元素）的子项。
- `getTreeItem(element: T): TreeItem | Thenable<TreeItem>` —— 实现此方法以返回显示在视图中的元素的 UI 表示（[TreeItem](/api/references/vscode-api#TreeItem)）。

当用户打开 Tree View 时，`getChildren` 方法会在不传入 `element` 的情况下被调用。然后，你的 `TreeDataProvider` 应返回顶层树项。在我们的示例中，顶层树项的 `collapsibleState` 是 `TreeItemCollapsibleState.Collapsed`，这意味着顶层树项将以折叠状态显示。将 `collapsibleState` 设置为 `TreeItemCollapsibleState.Expanded` 会导致树项以展开状态显示。将 `collapsibleState` 保留为默认值 `TreeItemCollapsibleState.None` 表示树项没有子项。对于 `collapsibleState` 为 `TreeItemCollapsibleState.None` 的树项，不会调用 `getChildren`。

以下是一个提供节点依赖项数据的 `TreeDataProvider` 实现示例：

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
            return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
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
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
        if (this.pathExists(packageJsonPath)) {
            const toDep = (moduleName: string, version: string): Dependency => {
                if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
                    return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
                } else {
                    return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
                }
            };

            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            const deps = packageJson.dependencies
                ? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
                : [];
            const devDeps = packageJson.devDependencies
                ? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep]))
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
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
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

第三步是向你的视图注册上述数据提供器。

可以通过以下两种方式完成：

- `vscode.window.registerTreeDataProvider` —— 通过提供已注册的视图 ID 和上述数据提供器来注册树数据提供器。

    ```typescript
    const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    vscode.window.registerTreeDataProvider('nodeDependencies', new NodeDependenciesProvider(rootPath));
    ```

- `vscode.window.createTreeView` —— 通过提供已注册的视图 ID 和上述数据提供器来创建 Tree View。这将让你访问 [TreeView](/api/references/vscode-api#TreeView)，你可以使用它执行其他视图操作。如果你需要 `TreeView` API，请使用 `createTreeView`。

    ```typescript
    vscode.window.createTreeView('nodeDependencies', { treeDataProvider: new NodeDependenciesProvider(rootPath)});
    ```

这是插件运行时的效果：

![视图](https://code.visualstudio.com/assets/api/extension-guides/tree-view/view.png)

### 更新 Tree View 内容

我们的节点依赖项视图很简单，数据一旦显示后就不会更新。但是，在视图中提供一个刷新按钮，并用 `package.json` 的当前内容更新节点依赖项视图会更有用。为此，我们可以使用 `onDidChangeTreeData` 事件。

- `onDidChangeTreeData?: Event<T | undefined | null | void>` —— 如果你的树数据可能发生变化，并且你想更新树视图，请实现此事件。

在 `NodeDependenciesProvider` 中添加以下内容。

```ts
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
```

现在我们有了解刷方法，但还没有人调用它。我们可以添加一个命令来调用 refresh。

在 `package.json` 的 `contributes` 部分中，添加：

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

并在插件激活中注册该命令：

```ts
import * as vscode from 'vscode';
import { NodeDependenciesProvider } from './nodeDependencies';

export function activate(context: vscode.ExtensionContext) {
    const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    const nodeDependenciesProvider = new NodeDependenciesProvider(rootPath);
    vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
    vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
}
```

现在我们有了解刷新节点依赖项视图的命令，但视图上的按钮会更好。我们已经为命令添加了 `icon`，因此将其添加到视图时，它会以该图标显示。

在 `package.json` 的 `contributes` 部分中，添加：

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

重要的是，只有在用户需要你的插件提供的功能时才激活它。在这种情况下，你应该考虑仅在用户开始使用视图时激活插件。当你的插件声明视图配置时，VS Code 会自动为你执行此操作。当用户打开视图时，VS Code 会发出激活事件 [onView:${viewId}](/api/references/activation-events#onView)（对于上面的示例为 `onView:nodeDependencies`）。

:::info
**注意**：对于早于 1.74.0 的 VS Code 版本，你必须显式在 `package.json` 中注册此激活事件，以便 VS Code 在此视图上激活你的插件：
```json
"activationEvents": [
        "onView:nodeDependencies",
],
```
:::

## 视图容器

视图容器包含一系列视图，这些视图与内置的视图容器一起显示在活动栏或面板中。内置视图容器的示例包括源代码管理和资源管理器。

![视图容器](https://code.visualstudio.com/assets/api/extension-guides/tree-view/view-container.png)

要配置视图容器，你首先应该使用 `package.json` 中的 [contributes.viewsContainers](/api/references/contribution-points#contributes.viewsContainers) 配置点注册它。

你必须指定以下必填字段：

- `id` —— 你正在创建的新视图容器的 ID。
- `title` —— 显示在视图容器顶部的名称。
- `icon` —— 视图容器在活动栏中显示时使用的图像。

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

或者，你可以通过将其放在 `panel` 节点下，将此视图配置到面板。

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

## 向视图容器配置视图

创建视图容器后，你可以使用 `package.json` 中的 [contributes.views](/api/references/contribution-points#contributes.views) 配置点。

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

视图还可以有一个可选的 `visibility` 属性，可以设置为 `visible`、`collapsed` 或 `hidden`。此属性仅在你第一次使用此视图打开工作区时被 VS Code 采用。之后，可见性将设置为用户选择的任何值。如果你的视图容器有许多视图，或者你的视图并非对插件的每个用户都有用，请考虑将视图设置为 `collapsed` 或 `hidden`。`hidden` 视图将出现在视图容器的 “Views” 菜单中：

![视图菜单](https://code.visualstudio.com/assets/api/extension-guides/tree-view/views-menu.png)

## 视图操作

操作（Actions）可以作为单个树项上的内联图标、树项上下文菜单中以及视图标题顶部提供。操作是你在 `package.json` 中添加配置而设置显示在这些位置的命令。

要为这三个位置提供配置，你可以在 package.json 中使用以下菜单配置点：

- `view/title` —— 在视图标题中显示操作的位置。主要或内联操作使用 `"group": "navigation"`，其余为次要操作，位于 `...` 菜单中。
- `view/item/context` —— 为树项显示操作的位置。内联操作使用 `"group": "inline"`，其余为次要操作，位于 `...` 菜单中。

你可以使用 [when 子句](/api/references/when-clause-contexts)控制这些操作的可见性。

![视图操作](https://code.visualstudio.com/assets/api/extension-guides/tree-view/view-actions.png)

Examples:

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

默认情况下，操作按字母顺序排序。要指定不同的顺序，请在组名后添加 `@` 和所需的顺序。例如，`navigation@3` 会使操作显示在 `navigation` 组的第 3 位。

你还可以通过创建不同的组来进一步分离 `...` 菜单中的项目。这些组名是任意的，并按组名的字母顺序排序。

:::info
**注意：** 如果要为特定树项显示操作，可以通过使用 `TreeItem.contextValue` 定义树项的上下文，并在 `when` 表达式中为 `viewItem` 键指定上下文值。
:::

示例：

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

## Welcome 内容

如果你的视图可能为空，或者你想为其他插件的空视图添加 Welcome 内容，你可以配置 `viewsWelcome` 内容。空视图是指没有 `TreeView.message` 且树为空的视图。

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

![Welcome 内容](https://code.visualstudio.com/assets/api/extension-guides/tree-view/welcome-content.png)

Welcome 内容中支持链接。按照惯例，独占一行的链接是一个按钮。每个 Welcome 内容还可以包含 `when` 子句。更多示例请参阅[内置的 Git 插件](https://github.com/microsoft/vscode/tree/main/extensions/git)。

## TreeDataProvider

插件作者应该通过编程方式注册 [TreeDataProvider](/api/references/vscode-api#TreeDataProvider) 以在视图中填充数据。

```typescript
vscode.window.registerTreeDataProvider('nodeDependencies', new DepNodeProvider());
```

参见 `tree-view-sample` 中的 [nodeDependencies.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample/src/nodeDependencies.ts) 了解实现。

## TreeView

如果你想以编程方式对视图执行一些 UI 操作，可以使用 `window.createTreeView` 而不是 `window.registerTreeDataProvider`。这将让你访问视图，你可以使用它执行视图操作。

```typescript
vscode.window.createTreeView('ftpExplorer', {
  treeDataProvider: new FtpTreeDataProvider()
});
```

参见 `tree-view-sample` 中的 [ftpExplorer.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample/src/ftpExplorer.ts) 了解实现。
