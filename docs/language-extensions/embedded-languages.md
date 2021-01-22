# 嵌入语言
---

VS Code 为编程语言提供了丰富的功能。就如你在 [语言服务器](/language-extensions/language-server-extension-guide) 中看到的那样，语言服务器可以支持任何编程语言。但要支持嵌入的语言，我们还要做更多工作。

时至今日，嵌入语言日与俱增，比如：
- HTML 中的 JavaScript 和 CSS
- JavaScript 中的 JSX
- 模板语法，比如 Vue，Handlebars 和 Razor
- PHP 中的 HTML

本篇指南着重于实现嵌入语言的各种语言功能。如果你只是对嵌入语言的语法高亮感兴趣，请参考[语法高亮指南](/language-extensions/syntax-highlight-guide)。

本指南包含两个示例，它们介绍了 2 种构建嵌入语言服务器的方法——**语言服务**和**请求转发**。我们将学习这两个示例，并了解它们各自的优点和缺点。

示例代码见下：

- [嵌入语言服务器（语言服务实现）](https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-embedded-language-service)
- [嵌入语言服务器（请求转发实现）](https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-embedded-request-forwarding)

我们先看看我们要构建的嵌入语言服务器实现的效果：

![embedded languages](https://code.visualstudio.com/assets/api/language-extensions/embedded-languages/embedded-lsp-sample.gif)

两个示例都分别配置了一个新的语言——`html1`。你可以创建一个`.html1`文件，然后测试下列功能：
- HTML 标签的自动填充
- `<style>`标签中 CSS 的自动填充功能
- CSS 语法诊断（仅在**语言服务**实现中可用）

## 语言服务
---

**语言服务**是实现了[程序性语言功能](https://code.visualstudio.com/api/language-extensions/programmatic-language-features)的库。**语言服务器**可嵌入到语言服务中，解决嵌入语言的各类问题。

下面是 VS Code 为 HTML 提供的功能大纲：
- 内建的 [html 插件](https://github.com/microsoft/vscode/tree/master/extensions/html) 只提供了语法高亮和 HTML 的语言配置能力
- 内建的 [html 语言功能插件](https://github.com/microsoft/vscode/tree/master/extensions/html-language-features)包含 HTML 语言服务器，为 HTML 提供程序性语言特性
-  HTML 语言服务器使用 [vscode-html-languageservice](https://github.com/microsoft/vscode-html-languageservice) 支持 HTML
-  CSS 语言服务器使用 [vscode-css-languageservice](https://github.com/microsoft/vscode-css-languageservice) 支持 HTML 中的 CSS

HTML 语言服务器分析 HTML 文档，将其分解为**语言域**，然后使用对应的**语言服务**处理语言服务器的请求。

比如：
- `<|` 的自动补全请求，HTML 语言服务器使用 HTML 语言服务提供 HTML 的自动补全。
- `<style>.foo { | }</style>` 的自动补全请求，HTML 语言服务器则使用 CSS 语言服务器提供 CSS 补全功能。

现在让我们在 [lsp-embedded-language-service](https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-embedded-language-service) 示例中检验一下。

### 语言服务示例

!> 注意: 本示例假设你已经掌握了 [程序性语言特性](https://code.visualstudio.com/api/language-extensions/programmatic-language-features) 和 [语言服务器](/language-extensions/language-server-extension-guide) 这2章内容。本示例构建于 [lsp-sample](https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-sample)

与 [lsp-sample](https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-sample) 相同的是，本示例的客户端代码都是一样的。

我们刚刚在上面提到了，服务器会将文档切分为不同的**语言域**，然后分别处理对应的嵌入内容。

我看个简单示例
```html
<div></div>
<style>.foo { }</style>
```

这个例子里，服务器检测到`<style>`标签，然后将 `.foo{ }` 标记为 **CSS 域**。

特定位置产生的自动补全请求，服务器会遵循下列逻辑返回响应对象：

- 如果当前位置属于**“域”**
  - 为域中的语言生成一份虚拟文档，其他域则使用空白符填充
- 如果当前位置不属于任何**“域”**
  - 使用 HTML 虚拟文档处理，所有域都视为空白符

比如，当我在下列光标位置使用自动补全

```html
<div></div>
<style>.foo { | }</style>
```

服务器会现当前位置在**“域”**中，然后生成一个虚拟 CSS 文档，该文档包含下面的内容（█ 表示空白符）

```html
███████████
███████.foo { | }████████
```

服务器随后使用 `vscode-css-languageservice` 分析该文档，然后计算出一个自动补全项的列表。因为现在内容不包含 HTML 了，所以 CSS 语言服务器就可以轻松地处理了。通过将非CSS 内容替换为空白符，我们就不用手动处理语言事件发生的具体位置和偏移位置了。

处理补全请求的服务端代码：

```typescript
connection.onCompletion(async (textDocumentPosition, token) => {
  const document = documents.get(textDocumentPosition.textDocument.uri);
  if (!document) {
    return null;
  }

  const mode = languageModes.getModeAtPosition(document, textDocumentPosition.position);
  if (!mode || !mode.doComplete) {
    return CompletionList.create();
  }
  const doComplete = mode.doComplete!;

  return doComplete(document, textDocumentPosition.position);
});
```
CSS 模型则负责处理落入 CSS 域的所有语言服务器请求
```typescript
export function getCSSMode(
  cssLanguageService: CSSLanguageService,
  documentRegions: LanguageModelCache<HTMLDocumentRegions>
): LanguageMode {
  return {
    getId() {
      return 'css';
    },
    doComplete(document: TextDocument, position: Position) {
      // Get virtual CSS document, with all non-CSS code replaced with whitespace
      const embedded = documentRegions.get(document).getEmbeddedDocument('css');
      // Compute a response with vscode-css-languageservice
      const stylesheet = cssLanguageService.parseStylesheet(embedded);
      return cssLanguageService.doComplete(embedded, position, stylesheet);
    }
  };
}
```

这是个处理嵌入语言非常简单有效的办法。但是这个方法也有很多问题：
- 你需要持续更新维护**语言服务器**依赖的**语言服务**
- 你的**语言服务器**很难引入一个非同语言实现的**语言服务**。比如用 PHP 实现的 PHP 语言服务器很难接入 TypeScript实现的 `vscode-css-languageservice`。

别急，我们马上来实现 `请求转发` 解决上面的问题。

## 请求转发
---

简单来说，请求转发和语言服务的工作机制是类似的。请求转发方法，也接收语言服务器的请求，计算虚拟文档，然后返回结果。

主要的不同点在于：
- 语言服务使用**库**去响应语言语言服务器，而请求转发则把请求发送回 VS Code 查询所有的语言服务器，然后转发它们的处理结果。
- 分发工作由语言客户端处理，而不是语言服务器

我们再来看下这个例子：

```html
<div></div>
<style>.foo { | }</style>
```

补全工作的流程像这样：

- 语言客户端为`embedded-content` 注册一个虚拟文本文档供应器函数（`workspace.registerTextDocumentContentProvider`）
- 语言服务器劫取`<FILE_URI>`的补全请求
- 语言服务器确定请求位置落入 **CSS 域**
- 语言服务器构建一个新的 URI，比如 `embedded-content://css/<FILE_URI>.css`
- 然后服务器调用 `commands.executeCommand('vscode.executeCompletionItemProvider', ...)`
  - VS Code 的 CSS 语言服务器响应该请求
  - 虚拟文本文档供应器函数，给 CSS 语言服务器提供虚拟文档内容，其中所有非 CSS 的代码都已经被替换为空白符
  - 语言客户端接收到 VS Code 的响应，然后返回该响应

这样一来，即使我们的代码不包含 CSS 处理库，也能够完成 CSS 的自动补全。而且 VS Code 更新 CSS 语言服务器的时候，我们的插件不用改动一行代码也获得了最新的 CSS 支持。

现在，我们来看看示例代码：

### 请求转发示例

!> 注意: 本示例假设你已经掌握了 [程序性语言特性](https://code.visualstudio.com/api/language-extensions/programmatic-language-features) 和 [语言服务器](/language-extensions/language-server-extension-guide) 这2章内容。本示例构建于 [lsp-sample](https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-sample)


建立文档 URI 和它们对应虚拟文档的映射，根据这个映射提供对应的请求：

```typescript
const virtualDocumentContents = new Map<string, string>();

workspace.registerTextDocumentContentProvider('embedded-content', {
  provideTextDocumentContent: uri => {
    // 移除前置 `/` 和结尾的 `.css`，获取原始 URI
    const originalUri = uri.path.slice(1).slice(0, -4);
    const decodedUri = decodeURIComponent(originalUri);
    return virtualDocumentContents.get(decodedUri);
  }
});
```
通过使用语言客户端的`middleware`，我们劫持了自动补全请求：

```typescript
let clientOptions: LanguageClientOptions = {
  documentSelector: [{ scheme: 'file', language: 'html' }],
  middleware: {
    provideCompletionItem: async (document, position, context, token, next) => {
      // 如果不在 `<style>`中, 不使用请求转发
      if (
        !isInsideStyleRegion(
          htmlLanguageService,
          document.getText(),
          document.offsetAt(position)
        )
      ) {
        return await next(document, position, context, token);
      }

      const originalUri = document.uri.toString();
      virtualDocumentContents.set(
        originalUri,
        getCSSVirtualContent(htmlLanguageService, document.getText())
      );

      const vdocUriString = `embedded-content://css/${encodeURIComponent(originalUri)}.css`;
      const vdocUri = Uri.parse(vdocUriString);
      return await commands.executeCommand<CompletionList>(
        'vscode.executeCompletionItemProvider',
        vdocUri,
        position,
        context.triggerCharacter
      );
    }
  }
};
```

## 潜在问题
---

当实现嵌入语言服务器的时候，我们会遇到很多问题，到目前为止，我们也没有找到完美的方案，所以当你遇到下面的问题，可别说我们没有事先说过。

### 很难实现语言特性

通常来说，围绕**语言域**的语言特性都是很难实现的。自动补全或者悬停信息比较容易实现，是因为你可以检测嵌入内容的语言，并计算出一个结果。但是像代码格式化、全局重命名等功能就需要特殊处理了。在格式化功能中，你需要处理缩进和多个**域**各自的的格式化配置问题。在重命名功能中，你也很在众多**域**中找到正确的替换目标。

### 语言服务器的状态太多而无法嵌入

VS Code 的 HTML 支持提供了 HTML、CSS 和 JavaScript特性。虽然 HTML 和 CSS 的语言服务是无状态的，但是受 TypeScript 服务器加强过的 JavaScript 语言特性就不一样了。我们只在 HTML 文档中的 JavaScript 提供了基本的支持，因为在这个里面，我们很难告诉 TypeScript 这个项目状态到底是什么。比如说，如果出用 `<script>` 引入了一个CDN 上的 `lodash` 库，那么其他每个 `<script>` 脚本中都应该能够使用 `_.`自动补全。

### 编码和解码

文件的首要语言和嵌入的语言，他们的编解码和转义规则可能完全不同。比如，根据 [HTML 规范](https://www.w3.org/TR/html401/appendix/notes.html#h-B.3.2)，下面的 HTML 文档是无效的：

```html
<SCRIPT type="text/javascript">
  document.write ("<EM>This won't work</EM>")
</SCRIPT>
```

在这个例子里，语言服务器在处理`</`时应该转义为`<\/`才行。

## 总结
---

我们的这两种方法各有千秋。

语言服务：
- + 可获完全掌控语言服务器和用户体验
- + 无需依赖其他语言服务器。所有代码都在一个仓库内完成
- + 语言服务器可被所有 [LSP-兼容的代码编辑器](https://microsoft.github.io/language-server-protocol/implementors/tools/) 重用
- - 可能很难嵌入用其他语言实现的语言服务
- - 需要持续维护语言服务依赖来获得新的特性

请求转发：
- + 避免**嵌入语言服务**与**语言服务器**的非同构的问题（比如，在 Razor 语言服务器嵌入的 C# 编译器去支持 C#）
- + 无需维护上游的语言服务器来获取新功能
- + 无需诊断上游语言服务器的错误
- - 由于缺乏控制，很难和其他语言服务器分享状态信息
- - 多语言特性可能很难实现（比如，当书写 `<div class="foo">` 中的 `.foo`时提供 CSS 补全）

总体来说，我们还是更推荐用嵌入**语言服务**构建嵌入语言服务器，因为这个方法更能掌控用户体验，而且这个服务器还可被任何 LSP 兼容的编辑器复用。但是如果你的场景比较简单，无需上下文、依赖语言服务器的状态或者没有能力打包一个 Node.js 库，那么你也可以考虑使用请求转发的方式。
