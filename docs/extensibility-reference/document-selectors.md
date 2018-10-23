# 文档选择器

插件的特性可以通过语言、类型、位置等文档选择器类型加以筛选，本节将深入文档选择器、文档协议等插件创作者应该了解的内容。

### 不在磁盘上的文件

并不是所有文件都是储存在磁盘上的，比如一份刚刚创建的文件。除非特别指明，文档选择器通常会**应用**于所有文档类型。用[DocumentFilter](https://code.visualstudio.com/docs/extensionAPI/vscode-api#DocumentFilter)的`scheme`属性将协议范围缩小，比如说，`{ scheme: 'file', language: 'typescript' }`是特用于储存在磁盘上的TypeScript文件的。

## 文档选择器
---
VS Code插件 API结合了特定的语言特性，通过文档选择器的[DocumentSelector](https://code.visualstudio.com/docs/extensionAPI/vscode-api#DocumentSelector)类型，可以支持如智能感知（IntelliSense）的特性，这是实现特定语言所支持特性的最为简单的机制。

下面的片段注册了一个TypeScript文件的[HoverProvider](https://code.visualstudio.com/docs/extensionAPI/vscode-api#HoverProvider)，文档选择器以`typescript`作为语言标识符。

```typescript
vscode.languages.registerHoverProvider('typescript', {
    provideHover(doc: vscode.TextDocument) {
        return new vscode.Hover('For *all* TypeScript documents.');
    }
})
```

文档选择器可以不只是语言标识符，还可以是[DocumentFilter](https://code.visualstudio.com/docs/extensionAPI/vscode-api#DocumentFilter)中`scheme`实现的复杂选择器，文件路径支持`pattern`参数和glob模式。

```typescript
vscode.languages.registerHoverProvider({ pattern: '**/test/**' }, {
    provideHover(doc: vscode.TextDocument) {
        return new vscode.Hover('For documents inside `test`-folders only');
    }
})
```

下面这个代码片段使用了`scheme`过滤器和语言标识符。`untitled`协议正是为未存到本地磁盘的文件准备的。

```typescript
vscode.languages.registerHoverProvider({ scheme: 'untitled', language: 'typescript' }, {
    provideHover(doc: vscode.TextDocument) {
        return new vscode.Hover('For new, unsaved TypeScript documents only');
    }
})
```

## 文档协议
---
文档的`scheme`常常不受人待见，但是它实际上提供了非常重要的信息。大部分文件都是储存在磁盘上的，插件创作者也常假设自己正在处理的文档也是存在磁盘上的。用一个简单的`typescript`选择器做个例子，其中的假设就是**Typescript在磁盘上**，不过大部分开发场景都过于宽松了，使用了诸如`{ scheme: 'file', language: 'typescript' }`显式的选择器。

当插件特定依赖于从磁盘上读写时，这个问题显得尤为重要。请看下面的代码：

```typescript
vscode.languages.registerHoverProvider('typescript', { // 👎 过于宽松
    provideHover(doc: vscode.TextDocument) {
        const { size } = fs.statSync(doc.uri.fsPath); // ⚠️ 'untitled:/Untitled1.ts' 或者其他情况会则么样?
        return new vscode.Hover(`Size in bytes is ${size}`);
    }
})
```

上面的例子里，悬浮提示器想要展示该文档在磁盘上的大小，但是它没有检测文档是不是真的储存在磁盘上，比如一个新创建但还没有保存的文档。正确的方法是告诉VS Code这个功能只在文件储存在磁盘上时才工作：

```typescript
vscode.languages.registerHoverProvider({ scheme: 'file', language: 'typescript' }, { // 👍 文件储存在磁盘上时才工作
    provideHover(doc: vscode.TextDocument) {
        const { size } = fs.statSync(doc.uri.fsPath);
        return new vscode.Hover(`Size in bytes is ${size}`);
    }
})
```

## 总结
---
文档通常都储存在文件系统中，但也有例外：未保存的新文件、Git使用的缓存文件、FTP上的远程文件等等。如果你的插件特性依赖于磁盘读取，那么你就要用文档选择器时应带上`file`协议。