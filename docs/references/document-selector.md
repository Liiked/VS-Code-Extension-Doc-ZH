# 文档选择器

插件的特性可以通过语言、类型、位置等文档选择器类型加以筛选，本节将深入文档选择器、文档协议等插件创作者应该了解的内容。

## 不在磁盘上的文件

并不是所有文件都是储存在磁盘上的，比如一份刚刚创建的文件。除非特别指明，文档选择器通常会应用于**所有**文档类型。使用[DocumentFilter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter)的`scheme`属性将协议范围缩小，比如说，`{ scheme: 'file', language: 'typescript' }`是特定的用于储存在磁盘上的TypeScript文件。

## 文档选择器

VS Code插件API结合了特定的语言特性, 通过文档选择器的[DocumentSelector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector)类型, 可以支持例如智能感知(IntelliSense)等特性. 这是实现特定语言所支持特性的最为简单的机制.

下面的片段注册了一个Typescript文件的[HoverProvider](https://code.visualstudio.com/api/references/vscode-api#HoverProvider), 此时的文档选择器是`typescript`语言标识符.

```typescript
vscode.languages.registerHoverProvider('typescript', {
  provideHover(doc: vscode.TextDocument) {
    return new vscode.Hover('For *all* TypeScript documents.');
  }
});
```

文档选择器可以不只是一个语言标识符, 还可以是复杂选择器——比如基于`协议(scheme)`和文件路径的[DocumentFilter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter), 文件路径支持`pattern`参数和glob模式:

```typescript
vscode.languages.registerHoverProvider(
  { pattern: '**/test/**' },
  {
    provideHover(doc: vscode.TextDocument) {
      return new vscode.Hover('For documents inside `test`-folders only');
    }
  }
);
```

下面这个片段, 使用合并后的`协议(scheme)`过滤器和语言标识符作为参数. `未命名的(untitled)`协议正是为暂未保存到本地磁盘的文件准备的.

```typescript
vscode.languages.registerHoverProvider(
  { scheme: 'untitled', language: 'typescript' },
  {
    provideHover(doc: vscode.TextDocument) {
      return new vscode.Hover('For new, unsaved TypeScript documents only');
    }
  }
);
```

## 文档协议

`文档协议`经常会被忽视, 但是它提供了很重要的信息. 插件开发者经常假设自己正在处理的文档也是存在磁盘上的. 用一个简单的`typescript`选择器做个例子, 假设**Typescript文件在磁盘上**, 不过大部分开发场景都过于宽松了，使用了诸如`{ scheme: 'file', language: 'typescript' }`显式的选择器。

当某项功能依赖于从磁盘上读/写文件时, 这个问题显得尤为重要. 请看下面的代码:

```typescript
// 👎 too lax
vscode.languages.registerHoverProvider('typescript', {
  provideHover(doc: vscode.TextDocument) {
    const { size } = fs.statSync(doc.uri.fsPath); // ⚠️ what about 'untitled:/Untitled1.ts' or others?
    return new vscode.Hover(`Size in bytes is ${size}`);
  }
});
```

上面的例子中, 悬浮提示器想展示文件占用的磁盘大小, 但是它不会检查文档是不是真的存储在磁盘上. 比如, 一个新创建但是未保存的文件. 正确的做法是告诉VS Code只在文件存储在磁盘上时才开始工作.

```typescript
// 👍 only works with files on disk
vscode.languages.registerHoverProvider(
  { scheme: 'file', language: 'typescript' },
  {
    provideHover(doc: vscode.TextDocument) {
      const { size } = fs.statSync(doc.uri.fsPath);
      return new vscode.Hover(`Size in bytes is ${size}`);
    }
  }
);
```

## 总结
文档通常都储存在文件系统中，但也有例外：未保存的新文件、Git使用的缓存文件、FTP上的远程文件等等。如果你的插件特性依赖于磁盘读取，那么你就要用文档选择器时应带上file协议。

## 下一步

阅读下列文章来了解更多有关于VS Code可拓展模型的知识.

- [插件清单](/references/extension-manifest) - VS Code的package.json(插件清单)文件配置相关
- [发布内容配置](/references/contribution-points) - VS Code发布内容相关
