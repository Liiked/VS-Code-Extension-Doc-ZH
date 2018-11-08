# VS Code中的源控制
---

VS Code 允许插件创作者通过扩展API去定义*源控制管理*特性（Source Control Management，SCM），VS Code整合了各式各样的SCM体系，而只给用户展现了一组小巧、强大的API接口，还是带用户界面的那种。

![main.png](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/api-scm/main.png)


VS Code自带一个源控制器：Git，本篇能帮你在VS Code中加入你自己的SCM系统。

如果你需要帮助，请查看[vscode命名空间API](https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/vscode-api.md#scm)。

## 源控制模型
---
`SourceControl`负责生产源控制模型的实体，它里面有`SourceControlResourceState`实例的**资源状态**，而资源状态又是`SourceControlResourceGroup`实例整理成**组**的。

通过`vscode.scm.createSourceControl`创建一个新的*源控制器*。

为了更好地理解这几种实体的交互，让我们拿Git来做例子，考虑下列`git status`输出：
```bash
vsce master* → git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        modified:   README.md
        renamed:    src/api.ts -> src/test/api.ts

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    .travis.yml
        modified:   README.md
```
这个工作区里面发生了很多事，首先，`README.md`文件已经被修改了但还没有提交，然后立刻又被修改了。 其次，`src/api.ts`文件被移动到了`src/test/api.ts`，这个修改已经存备（staged）， 最后，`.travis.yml`文件被删除。

对于这个工作区而言，Git定义了两个资源组：**工作中（Working tree）**和**已索引（Index）**，对于单个组而言，每次**文件修改**就会产生一些资源状态：
- **已索引** - 资源组
    - 修改`README.md` - 资源状态
    - 移动`src/api.ts`到`src/test/api.ts` - 资源状态
- **工作中** - 资源组
    - 删除`.travis.yml` - 资源状态
    - 修改`README.md` - 资源状态

同一个`README.md`是怎么成为两组截然不同的资源状态呢？

下面揭秘Git是如何创建这个模型的：

```typescript
function createResourceUri(relativePath: string): vscode.Uri {
  const absolutePath = path.join(vscode.workspace.rootPath, relativePath);
  return vscode.Uri.file(absolutePath);
}

const gitSCM = vscode.scm.createSourceControl('git', "Git");

const index = gitSCM.createResourceGroup('index', "Index");
index.resourceStates = [
  { resourceUri: createResourceUri('README.md') },
  { resourceUri: createResourceUri('src/test/api.ts') }
];

const workingTree = gitSCM.createResourceGroup('workingTree', "Changes");
workingTree.resourceStates = [
  { resourceUri: createResourceUri('.travis.yml') },
  { resourceUri: createResourceUri('README.md') }
];
```

源变动和最终产生的资源组会传递到源控制视图上。

## 源控制视图
---
当源变动时，VS Code会生成源控制视图。源状态可通过`SourceControlResourceDecorations`自定义：

```typescript
export interface SourceControlResourceState {
  readonly decorations?: SourceControlResourceDecorations;
}
```

上述例子已经足以让源控制视图生成一个简单的列表，不过用户可能想要在不同的资源状态上进行不同的操作。比如，当用户点击资源状态时，会发生什么呢？资源状态提供了一个可选命令去处理这类场景：
```typescript
export interface SourceControlResourceState {
  readonly command?: Command;
}
```

### 菜单

要想提供更加丰富的交互效果，我们提供了5个源控制菜单项供你使用。

`scm/title`菜单在源控制视图的顶部右上方，菜单项水平排列在标题栏中，另外一些会在`...`下拉菜单中。`scm/resourceGroup/context`和`scm/resourceState/context`是类似的，你可以通过前者自定义资源组，后者则是定义资源状态。将菜单项放在`inline`组里，可以水平在视图中展示它们。而其他的菜单项可以通过鼠标右击的形式展示在菜单中。菜单中调用的命令会传入资源状态作为参数。注意SCM视图提供多选，因此命令函数可能一次性会接收一个或多个参数。

例如，Git支持往`scm/resourceState/context`菜单中添加`git.stage`命令和使用下列方法，提供多个文件的存备（staged）：
```typescript
stage(...resourceStates: SourceControlResourceState[]): Promise<void>;
```
创建它们的时候，`SourceControl`和`SourceControlResourceGroup`实例会需要你提供一个string类型的`id`，这些值最终会在`scmProvider`和`scmResourceGroup`以上下文键值的形式出现。在菜单项的`when`语法中使用这些[上下文键值](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts)。看个Git如何通过`git.stage`命令显示菜单项的：
```
{
  "command": "git.stage",
  "when": "scmProvider == git && scmResourceGroup == merge",
  "group": "inline"
}
```

`scm/change/title`可以对*行内变动*配置标题栏的命令（contribute commands to the title bar of an inline change）。命令中的参数有文档的URI，变动数组，当前行内变动所在索引。例如下面是一个可以配置菜单的Git`stageChange`命令声明：

```typescript
async stageChange(uri: Uri, changes: LineChange[], index: number): Promise<void>;
```

`scm/sourceControl`菜单根据环境出现在源控制实例的边上。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/api-scm/sourcecontrol-menu.png)

最后，`scm/change/title`菜单是和快速Diff功能相关联的，越新的文件越靠前，你可以针对特定的代码变动调用命令。

### SCM 输入框
源控制输入框位于每个源控制视图的顶部，接收用户输入的信息。你可以获取（或设置）这个信息供后续使用。在Git中，比如说，这可以作为一个commit框，用户输入了提交信息后，触发`git commit`命令：

```typescript
export interface SourceControlInputBox {
  value: string;
}

export interface SourceControl {
  readonly inputBox: SourceControlInputBox;
}
```

用户可以通过<kbd>Ctrl+Enter</kbd>（Mac上是<kbd>Cmd+Enter</kbd>）接收任意信息，在`SourceControl`中的`acceptInputCommand`处理这类事件。
```typescript
export interface SourceControl {
  readonly acceptInputCommand?: Command;
}
```
## 快速Diff
---
VS Code支持显示快速Diff编辑器的高亮槽，点击这些槽会出现一个内部diff交互器，你可以在这里为上下文配置命令。

![](https://raw.githubusercontent.com/Microsoft/vscode-docs/master/docs/extensionAPI/images/api-scm/quickdiff.png)

这些高亮槽是VS Code自己计算出来的，你要做的就是根据给定的文件提供原始文件内容

```typescript
export interface SourceControl {
  quickDiffProvider?: QuickDiffProvider;
}
```

使用`QuickDiffProvider`，你的实现需要告诉VS Code——参数传入的给定资源URI所对应的原始资源URI。

## 下一步

想要学习更多关于VS Code扩展性模型，请参考：

* [SCM API 参考](https://code.visualstudio.com/docs/extensionAPI/vscode-api#_scm) - 查看完整的SCM API文档
* [Git 插件](https://github.com/Microsoft/vscode/tree/master/extensions/git) - 学习Git插件实现
* [插件API概览](/extensibility-reference/overview.md) - 学习全部的VS Code扩展性模型
* [插件配置清单](/extensibility-reference/extension-manifest.md) - VS Code package.json插件配置清单参考
* [发布内容配置点](/extensibility-reference/contribution-points.md) - VS Code发布内容配置点参考
