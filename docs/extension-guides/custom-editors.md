# 自定义编辑器 API
---

自定义编辑器允许开发者创建完全定制化的可读写编辑器，它可以替代 VS Code 中标准的文本编辑器，编辑一些特殊类型的资源。比如说：
- 预览资产(assests)文件，如直接在 VS Code 中查看3D 模型着色器
- 创建 WYSIWYG 编辑器，如 Markdown 或者 XAML
- 为 CSV、JSON或 XML 提供其他视觉渲染
- 为二进制文件或文本文件提供完全定制化的编辑体验

本章我们将大致看下自定义编辑器的 API，并实现一个基本的自定义编辑器。我们还会看一眼自定义编辑器的两种类型以及他们的差别，你应该如何选择合适的编辑器。然后我们会走一遍基本的实现。

虽然自定义编辑器是个非常强力的新功能，但实现一个基本的自定义编辑器真没那么难！不过，如果你目前还在做 VS Code 上的第一个插件，你可能需要考虑一下等到自己足够熟悉 VS Code API 的基本内容之后，再深入到编辑器开发中来。自定义编辑器立足于非常多的 VS Code 概念之上——包括 [webviews](/extension-guides/webview) 和文本文档 —— 所以如果你同时在本章接受这些概念的话，压力就会有些大了。

不过，如果你觉得自己已经准备好构建一个很酷的自定义编辑器了，那么就让我们开始吧！确保你已经下载了 [自定义编辑器 示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-editor-sample)，我们的教程将跟随这个示例和文档逐步介绍自定义编辑器的相关 API。

## 链接
---

[自定义编辑器 示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-editor-sample)

#### VS Code API 用法

- [`window.registerCustomEditorProvider`](https://code.visualstudio.com/api/references/vscode-api#window.registerCustomEditorProvider)
- [`CustomTextEditorProvider`](https://code.visualstudio.com/api/references/vscode-api#CustomTextEditorProvider)

## 本 API 的基础
---

自定义编辑器是特定类型资源文件的编辑视图，它会替换 VS Code 中的标准文本编辑器展示的位置。自定义编辑器分为两部分：用户可交互的**视图**和你的插件与底层资源文件进行交互的**文档模型**。

自定义编辑器的视图侧是通过 [webviews](/extension-guides/webview) 实现的，所以你可以通过标准的 HTML、CSS 和 JavaScript 构建用户体验。Webview 是不能直接访问 VS Code API 的，但是它可以通过插件进行双向通信。看看我们的 [webview 文档](/extension-guides/webview)，获取关于 webview 的最佳实践。

自定义编辑器的另外一部分是文档模型。这个模型是你的插件如何理解源（文件）以及如何相互工作的抽象。`CustomTextEditorProvider` 使用标准的 VS Code [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument)，它的文档模型和文件的所有变化都会被表达为 VS Code 中的标准文本编辑 API。`CustomReadonlyEditorProvider` 和 `CustomEditorProvider` 则需要你自己提供文档模型，所以你就拥有了非文本格式的文档编辑能力。

自定义编辑器对应的每个资源文件可能各需要一个文档模型，但有的时候多个编辑器实例（视图）可能会共用一个文档模型。比如，你可以想象一下你打开的文件包含了一个`CustomTextEditorProvider`，然后你运行了**视图：拆分编辑器**命令，这样一来，虽然`TextDocument`只有一个，因为另外一个视图中的内容只是源文件的一个副本，但是现在这个资源文件产生了两个 webview 视图。

### `CustomEditor` vs `CustomTextEditor`

我们有两种自定义编辑器类型：自定义文本编辑器和自定义编辑器。两者的主要区别在于他们定义文档模型不同。

`CustomTextEditorProvider` 使用 VS Code 标准的 [`TextDocument`](https://code.visualstudio.com/api/references/vscode-api#TextDocument) 作为数据模型。你可以对任意文本格式类型文件使用 `CustomTextEditor`。`CustomTextEditor` 相对另一种来说比较容易实现，因为 VS Code 已经知道怎么处理文本文件，以及实现了对应的操作，如保存、热退出文件恢复等。

而 `CustomEditorProvider` 有所不同，你的插件需要自己准备文档模型。这就意味着你可以把 `CustomEditor` 使用到二进制文件格式上，比如图片。但这也意味着你的插件的责任也很大，比如实现保存和备份。如果你的编辑器是只读的，你也可以跳过这些繁琐的功能，比如预览。

决定使用哪种类型的自定义编辑器很简单：如果你要处理文本格式的文件，使用`CustomTextEditorProvider`，二进制文件则使用`CustomEditorProvider`。

### 发布内容配置

`customEditors` 的[发布内容配置](/references/contribution-points) 配置了你的自定义插件何时在VS Code 中运行，VS Code 需要知道你的自定义编辑器是处理哪类文件的，以及编辑器的 ID。

下面是[自定义编辑器 示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-editor-sample)中 `customEditor` 的基本配置：

```json
"contributes": {
  "customEditors": [
    {
      "viewType": "catEdit.catScratch",
      "displayName": "Cat Scratch",
      "selector": [
        {
          "filenamePattern": "*.cscratch"
        }
      ],
      "priority": "default"
    }
  ]
}
```

`customEditors` 是一个数组，所以你的插件可以配置多个自定义编辑器。让我们分别看看自定义编辑器的配置：

- `viewType` - 自定义编辑器的唯一标识。这个字段告诉 VS Code 将你在 `package.json` 配置自定义编辑器绑定到代码实现中去。这个字段的值必须是唯一的，不要使用`"viewType"`的原生值，比如`"preview"`，你需要确保这个字段的值，和商店市场的所有插件的名字都没有重复，比如`"viewType": "myAmazingExtension.svgPreview"`
- `displayName` - 展示在 VS Code UI 中的编辑器名称。这个名称会显示在 VS Code 的 UI 中，比如下拉命令行的**视图：使用...打开**中
- `selector` - 确定哪类文件会激活自定义编辑器。`selector` 是一个或者多个 glob模式的数组。glob 模式会匹配文件的名称，文件匹配时则打开自定义编辑器。 比如 `文件名模式` 的一种模式 `*.png` 会触发所有 PNG 文件打开我们的自定义编辑器。你也可以创建更多的模式，匹配文件名，或者目录名，比如`**/translations/*.json`
- `priority` - （可选）确定自定义编辑器的使用时机。这个字段控制合适使用特定的自定义编辑器。可选值有：
  - `"default"` - 尝试对每个匹配`selector`的文件使用自定义编辑器。如果一个文件配置了多种自定义编辑器，用户需要选择使用哪个编辑器。
  - `"option"` - 默认不使用自定义编辑器，不过用户可以将该类文件进行配置，用自定义编辑器打开

### 自定义编辑器的激活

当用户打开了一个自定义编辑器，VS Code 会触发 `onCustomEditor:VIEW_TYPE` 激活事件。激活期间，你的插件必须调用 `registerCustomEditorProvider` 注册一个与预期 `viewType` 一致的自定义编辑器。

你一定要记住 `onCustomEditor` 只会在 VS Code 需要创建自定义编辑器实例的时候才会调用，如果 VS Code 只是展示自定义编辑器的一些信息，比如**视图：使用...重新打开**命令——你的插件不会被激活。

## 自定义文本编辑器
---

在自定义文本编辑器中，你可以控制文本文件的编辑功能。这类文件可以是纯文本文件、[CSV](https://en.wikipedia.org/wiki/Comma-separated_values)、JSON 或者 XML。自定义文本编辑器使用 VS Code 标准 [TextDocument](https://code.visualstudio.com/api/references/vscode-api#TextDocument) 作为文档模型。

[自定义编辑器插件示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-editor-sample)包含了一个简单的自定义文本编辑器示例，这个示例支持 *猫猫草稿文件*（其实就是以`.cscratch` 后缀结尾的JSON文件）。VS Code 会在以下场景中自动调用你的插件——发现需要创建一个新的自定义编辑器示例时，当用户关闭标签——清理编辑器实例和文档模型时。

我们从用户打开自定义文本编辑器，插件进行视图配置开始，到用户关闭自定义文本编辑器，一步步深入到自定义编辑器的实际运作原理。

### 自定义文本编辑器的生命周期

VS Code 处理自定义文本编辑器视图（webview）的视图组件生命周期和模型组件（`TextDocument`）的生命周期。VS Code 创建新的自定义编辑器实例会调用你的插件，或者用户关闭标签时，清理编辑器实例的时候会调用你的插件。

要在实践中理解这里面的工作机制，让我们从插件的视角看看用户打开/关闭一个自定义文本编辑器时，发生了什么：

#### 打开自定义文本编辑器

本示例使用[自定义编辑器插件示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-editor-sample)，下面是用户首次打开`.cscratch`文件的过程：

1. VS Code 触发`onCustomEditor:catCustoms.catScratch`激活事件。如果我们的插件还未被激活，此时就会激活插件。在激活期间，我们的插件必须通过 `registerCustomEditorProvider` 为 `catCustoms.catScratch` 注册 `CustomTextEditorProvider`。
2. VS Code 然后会为已注册`CustomTextEditorProvider`的`catCustoms.catScratch` 调用 `resolveCustomTextEditor`。这个方法会获取当前打开资源的`TextDocument`以及`WebviewPanel`。插件必须为这个 Webview 面板提供初始化的 HTML 内容。

一旦 `resolveCustomTextEditor` 执行并返回，我们的自定义编辑器就呈现给用户了。Webview 里展示的内容完全取决于你的插件。

每当打开一个自定义编辑器，上述过程都会重复发生，即使当用户分割自定义编辑器。每个自定义编辑器示例都包含它自己的 `WebviewPanel`，只是对于同一个资源文件，多个自定义编辑器之间会共用这个资源文件。记住：请把`TextDocument` 当做是资源文件的模型，而 webview 只是该模型的视图。

#### 关闭自定义文本编辑器

当用户关闭一个打开的自定义文本编辑器时，VS Code 会触发`WebviewPanel` 的 `WebviewPanel.onDidDispose` 事件。这时，你的插件需要释放当前编辑器占用的资源（事件监听、文件变动监听等等）。

当资源文件的最后一个自定义编辑器被关闭时，该资源文件的 `TextDocument` 也会被释放，因为此时不再有任何编辑器或者其他插件在占用该资源文件。你可以通过 `TextDocument.isClosed` 检查 `TextDocument` 是否被关闭。当 `TextDocument` 被关闭后，用自定义编辑器打开同一个资源文件会创建新的 `TextDocument`。

### 同步 TextDocument 的变化

由于自定义编辑器使用 `TextDocument` 作为文档模型，因此当**编辑事件**发生时，编辑器需要更新 `TextDocument`，同样的，当 `TextDocument` 变化时，编辑器也需要同步更新自身。

#### 从视图到 `TextDocument`

在自定义文本编辑器中的编辑形式是很多的，比如点击一个按钮，改动一些文本，拖动一些项目等等。不论用户何时编辑自定义文本编辑器中的内容，插件都需要更新 `TextDocument`。下面我们来看看 *猫猫草稿插件* 是怎么实现这个功能的：

1. 用户点击webview中的 **添加草稿** 按钮。webview [会发送一条消息](/extension-guides/webview?id=脚本和信息传递) 给插件。
2. 插件接受到消息。然后插件更高效文档的内部模型（在猫猫草稿插件的例子里，就是会添加一个 JSON 的入口）。
3. 插件创建一个 `WorkspaceEdit` 对 JSON 文档进行更新。这个编辑操作使用了 `vscode.workspace.applyEdit`。

你的插件需要对工作区编辑导致的**文档更新最小化**。记住，如果你在处理例如 JSON 这样的语言文件，你的插件需要观察用户现有的格式约定（如空格 vs tab，缩进大小等等）

#### 从 `TextDocument` 到 webviews

当 `TextDocument` 变化时，你还需要确保所有的 webview 能正确响应文档模型的变化。`TextDocument` 会在撤销编辑、恢复编辑甚至撤销文件事发生改变；或被其他插件的 `WorkspaceEdit` 导致变化；或者用户在 VS Code 中打开一个默认文本编辑器时产生变化。下面我们来看看 *猫猫草稿插件* 是怎么实现这个功能的：

1. 在插件中，我们需要订阅`vscode.workspace.onDidChangeTextDocument` 事件。每当 `TextDocument` 产生变化时（包括我们自定义编程器的变化）都会触发这个事件。
2. 当文档对象的变化进入到我们插件中，插件发送一个带着新的文档状态消息给 webview，然后 webview 会更新自身，并渲染更新过的文档对象。

你一定要记住，自定义编辑器的任何编辑动作都会触发 `onDidChangeTextDocument`。确保你的插件不会进入更新循环，比如用户在 webview 中编辑，然后触发了onDidChangeTextDocument，接着webview 产生了更新，结果webview 更新之后又触发了你的插件，然后再一次发送`onDidChangeTextDocument`事件，如此循环。

同样你也要记住，如果你在处理注入 JSON、XML 这样的结构化语言，文档对象校验可能会出错。你的插件必须在错误发生时优雅降级，或者给用户展示一个错误提示，以便用户能够理解错误并及时修复。

最后，如果更新所有的 webview 开销太高，请考虑 [debouncing](https://davidwalsh.name/javascript-debounce-function) 到 webview 的更新操作。

## 自定义编辑器
---

你可以使用 `CustomEditorProvider` 和 `CustomReadonlyEditorProvider` 创建二进制文件的自定义编辑器。通过这个 API，你可以完全掌控显示给用户的文件、如何编辑以及通过你的插件深入控制 `save` 操作和其他文件操作。如果你在为一个文本格式的文件构建编辑器，强烈建议你使用[`CustomTextEditor`](#自定义文本编辑器) ，在这种场景下，这个 API 实现起来更为简单。

### CustomDocument

在自定义编辑器中，你的插件需要使用 `CustomDocument` 自己实现文档模型。你的插件可以任意储存`CustomDocument`所需数据，来实现你的自定义编辑器，但这种自由度也意味着你需要自己实现基本的文档操作，比如在热退出场景下保存和备份文件数据。

每个打开的文件都有一个对应的 `CustomDocument`，用户可以针对单个资源文件打开多个编辑器，比如分割当前自定义编辑器——但是所有这些编辑器的底层 `CustomDocument` 都是相同的。

### 自定义编辑器的生命周期

**为每个文档提供多编辑器支持**

默认，VS Code 只允许每个编辑器只能使用一个自定义文档（对象）。这个限制能够帮助开发者相对轻松地实现自定义编辑器，开发者无需关心多个自定义编辑器实例的同步问题。

如果你的插件能够支持上述能力，那么我们建议在注册自定义编辑器的时候将 `supportsMultipleEditorsPerDocument: true` 设置好，然后多编辑器示例就可以共用一个文档对象了。通过这个方式，你的自定义编辑器就能像 VS Code 的普通文本编辑器一样了。

**打开自定义编辑器**

当用户打开的文件匹配 `customEditor` 配置点的时候，VS Code 会触发一个 `onCustomEditor` [激活事件](/references/activation-events)然后调用给定视图类型的供应器函数。`CustomEditorProvider` 有两个作用：给自定义编辑器提供文档对象，以及提供编辑器自身。下面是[自定义编辑器插件示例](https://github.com/microsoft/vscode-extension-samples/tree/master/custom-editor-sample) 中的 `catCustoms.pawDraw` 实际发生的事件过程：

1. VS Code 触发 `onCustomEditor:catCustoms.pawDraw` 激活事件。如果当前不存在激活插件，则激活我们的插件。确保我们的插件在激活`catCustoms.pawDraw`期间已经注册了 `CustomReadonlyEditorProvider` 或者 `CustomEditorProvider`。
2. VS Code 通过注册给 `catCustoms.pawDraw` 的 `CustomReadonlyEditorProvider` 或者 `CustomEditorProvider` 调用 `CustomReadonlyEditorProvider`。在这个地方，我们的插件会获得资源的 uri 然后为资源返回一个新的 `CustomDocument`。此时，我们的插件应该为该资源文件创建文档的内部模型对象。这可能涉及读取和解析磁盘中的初始文件状态，以及初始化我们新的 `CustomDocument`。我们的插件可以实现 `CustomDocument` 创建一个新类来定义这个模型。记住整个初始化阶段都依赖插件。VS Code 不关心插件生成 `CustomDocument` 的任何信息。
3. VS Code 带上上述第二步的 `CustomDocument` 调用 `resolveCustomEditor`，然后生成一个新的 `WebviewPanel`。我们的插件必须给自定义编辑器提供完整的初始化内容。如果有需要的话，我们也可以保存 `WebviewPanel` 的引用，以便后续使用，比如调用内部命令。

一旦 `resolveCustomEditor` 返回，我们的自定义编辑器就会展示给用户。

如果用户在另一个编辑组里面用我们的自定义编辑器打开了同一个文件——比如分割首个编辑器——那么插件的工作是一样的。这样一来，VS Code 只会调用 `resolveCustomEditor` 并传入我们打开首个编辑器所创建的 `CustomDocument`。

**关闭自定义编辑器**

假设同一个源文件，我们有两个打开的编辑器实例。当用户关闭所有编辑器时，VS Code 会通知我们的插件，然后我们就可以进行相关资源的释放工作了。

当关闭第一个编辑器时，VS Code 会触发被关闭编辑器 `WebviewPanel` 的 `WebviewPanel.onDidDispose`方法。这样我们就可以清理特定编辑器实例的相关资源了。

当第二个编辑器被关闭时，VS Code 也会调用 `WebviewPanel.onDidDispose` 方法。不过现在我们也在 `CustomDocument` 中关闭了所有编辑器。当 `CustomDocument` 中没有其他编辑器时，VS Code 会调用它的 `CustomDocument.dispose` 方法。我们插件的 `dispose` 实现了文档对象的所有相关资源清理工作。

如果用户重开了同一个资源文件，我们会新建一个 `CustomDocument` 然后重新走 `openCustomDocument`、`resolveCustomEditor` 流程。

#### 只读自定义编辑器

接下来，大部分支持编辑功能的自定义编辑器，可能听起来会有点矛盾，但是其中很多完全不需要编辑能力——想象一下图片预览功能，或者堆内存的可视化界面，这两个例子都需要使用自定义编辑器，但却完全不需要编辑功能。所以下面让我来介绍 `CustomReadonlyEditorProvider`。

`CustomReadonlyEditorProvider` 允许你创建不需要编辑能力的自定义编辑器。这些编辑器可以有交互功能，但是不支持注入撤销和保存的功能。所以相比实现一个可编辑的编辑器，这个API 可以让你的工作简单很多。

#### 可编辑自定义编辑器的基础

可编辑的自定义编辑器让你有机会深入到标准的 VS Code 操作中去，比如撤销、恢复、保存和热退出。所以可编辑自定义编辑器非常强大，但这也意味着此类实现势必比实现一个可编辑自**定义*文本*编辑器**或者只读编辑器更复杂。

可读自定义编辑器通过 `CustomEditorProvider` 实现。这个接口扩展了 `CustomReadonlyEditorProvider`，所以你要自己实现比如 `openCustomDocument` 或 `resolveCustomEditor` 以及其他基本操作。让我们先来看看`CustomEditorProvider` 中的编辑部分。

#### 编辑

编辑会影响到可编辑自定义文档对象。这个编辑操作，可以是文本变化、图片旋转、生成列表等。编辑具体的行为和规范，完全由你的插件定义，但是 VS Code 需要知道“编辑”动作在何时发生。VS Code 会在 “编辑” 发生时将文档标记为“脏文档”，然后就会启动自动保存和备份功能了。

不论用户何时触发了自定义编辑器 webview 中的编辑操作，你的插件都需要触发 `CustomEditorProvider` 的 `onDidChangeCustomDocument` 事件。`onDidChangeCustomDocument` 依据你的自定义编辑器实现，会触发为两种事件类型：`CustomDocumentContentChangeEvent` 和 `CustomDocumentEditEvent`。

#### CustomDocumentContentChangeEvent

`CustomDocumentContentChangeEvent` 是一个基本编辑单元，它仅仅告诉 VS Code 文档被编辑了。

当插件从 `onDidChangeCustomDocument` 触发 `CustomDocumentContentChangeEvent` 之时， VS Code 会将相关文档标记为“变脏中”。此时，如果需要将文档恢复到“干净”状态，需要用户保存或者撤销操作。使用了 `CustomDocumentContentChangeEvent` 的编辑器不支持VS Code 的撤销/恢复操作。

#### CustomDocumentEditEvent

`CustomDocumentEditEvent` 则是一个允许撤销/恢复的复杂编辑操作。你应该在自定义编辑器中尽量使用 `CustomDocumentEditEvent`，如果无法实现撤销/恢复时再降级到`CustomDocumentContentChangeEvent`。

`CustomDocumentContentChangeEvent` 包含下列字段：
- `document` —— 正在编辑的 `CustomDocument` 对象
- `label` —— 可选文本，描述了“编辑”操作类型（比如“剪切”，“插入”……）
- `undo` —— 当编辑操作需要被撤销时，VS Code 调用的函数方法
- `redo` —— 当编辑操作需要被恢复时，VS Code 调用的函数方法

当插件从 `onDidChangeCustomDocument` 触发 `CustomDocumentEditEvent` 时，VS Code 当相关文档标记为“脏文档”。如果需要将文档恢复到“干净”的状态，用户可以保存或者撤回操作，或者使用撤销/恢复，回到文档之前的状态。

当特定的编辑操作需要撤销或者重做时，编辑器中的 `undo` 和 `redo` 方法会被 VS Code 触发。VS Code 内部保存这编辑栈，所以你的插件触发了3 次`onDidChangeCustomDocument`编辑操作，比如说 `a`, `b`, `c`：

```typescript
onDidChangeCustomDocument(a);
onDidChangeCustomDocument(b);
onDidChangeCustomDocument(c);
```

用户的下列操作会导致：

```
undo — c.undo()
undo — b.undo()
redo — b.redo()
redo — c.redo()
redo — 哎呦, 没有更多编辑操作了
```

要实现撤销/恢复，你的插件必须更新相关自定义文档内部的状态，以及所有相关 webview 视图。要注意，你的同一个源文件可能对应着多个 webview！在更新视图时必须要保证数据的唯一性。比如说，一个图片有多个编辑器实例，他们必须展现同样的像素信息，但是每个编辑器实例应该有它们自己的缩放级别和 UI 状态。

### 保存

当用户在编辑器中执行保存，你的插件需要将源文件当前状态写入磁盘。你的自定义编辑器该怎么做，取决于你插件的 `CustomDocument` 类型和你的插件内部如何追踪编辑。

保存的第一步就是获取数据流，然后写入磁盘。常用的方法包括：
- 追溯资源状态，以后后续使用时快速地序列化。拿图片编辑器为例子，你可以将像素数据保存为 buffer。
- 上次保存操作之后记录用户编辑操作，以便生成新文件。再以图片编辑器为例子，如果想要更高效一些，我们可以追踪上次保存后的编辑操作，比如一系列的 `裁剪`、`旋转`、`缩放`等操作之后。当用户保存时，插件可以基于上次保存的文件立即应用这些操作来生成新文件。
- 保存来自自定义编辑器 `WebviewPanel` 中获取的文件数据。记住，即使自定义编辑器即使不可见也能够保存数据。因此，我面更建议你的插件在实现`保存`时不要依赖`WebviewPanel`。如果实在没办法，你可以使用`WebviewPanelOptions.retainContextWhenHidden`设置，这样 webview 会在不可见时保持存活，`retainContextWhenHidden` 会造成显著的内存消耗，因此你需要保守地使用它。

在你获取资源的数据之后，通常还需要使用 [workspace FS api](https://code.visualstudio.com/api/references/vscode-api#FileSystem) 把数据写到磁盘上。FS API 接收一个 `UInt8Array` 类型数据，这个 api 既可以写入字节码也可以写入纯文本格式文件。对于字节码数据，只要把字节数据放到 `UInt8Array`就行了。对于文本文件来说，用`Buffer`对文本进行转换之后就可以使用了：

```typescript
const writeData = Buffer.from('my text data', 'utf8');
vscode.workspace.fs.writeFile(fileUri, writeData);
```

## 下一步

如果你想要学习更多 VS Code 插件能力的相关知识，请参考下面的主题：

- [Extension API](https://code.visualstudio.com/api) - 学习完整的 VS Code 插件 API
- [插件功能](/extension-capabilities/README) - 学习其他扩展 VS Code 的方法