# 语义高亮指南
---

语义高亮是对[语法高亮](/language-extensions/syntax-highlight-guide)的一种补充。VS Code 的主要分词引擎是 TextMate 语法器。TextMate 使用正则表达式，并根据词法规则将文件分割成一系列的符号。

语言服务器将项目上下文的符号进行解析，使得语义服务器也能提供**符号**的相关信息。主题可以选择性地使用语义符号来提升语法高亮的体验。编辑器使用语义高亮优先于语法高亮。

下面是一个语义高亮的例子：

没有语义高亮：

![no-semantic-highlighting](https://code.visualstudio.com/assets/api/language-extensions/semantic-highlighting/no-semantic-highlighting.png)

有语义高亮：

![with-semantic-highlighting](https://code.visualstudio.com/assets/api/language-extensions/semantic-highlighting/with-semantic-highlighting.png)

注意下列颜色差异：
- 第 10 行：`languageMode` 被着色为参数
- 第 11 行：`Range` 和 `Position` 被着色为“类”，`document` 被着色为参数
- 第 13 行：`getFoldingRanges` 着色为函数

## 语义分词供应器函数
---

要实现语义高亮，插件需要使用文档的语言类型或文件名注册一个 `semantic token provider`。编辑器发现需要进行语义分词时，会向该供应器发起请求。

```typescript
const tokenTypes = ['class', 'interface', 'enum', 'function', 'variable'];
const tokenModifiers = ['declaration', 'documentation'];
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

const provider: vscode.DocumentSemanticTokensProvider = {
  provideDocumentSemanticTokens(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.SemanticTokens> {
    // 分析文档，并返回语义符号

    const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
    // 第一行的1-5个词，是类型声明
    tokensBuilder.push(
      new vscode.Range(new vscode.Position(1, 1), new vscode.Position(1, 5)),
      'class',
      ['declaration']
    );
    return tokensBuilder.build();
  }
};

const selector = { language: 'java', scheme: 'file' }; // 为所有本地的 Java 文档注册

vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend);
```

语义分词供应器函数 API 为插件实现提供了两种方式：
1. `DocumentSemanticTokensProvider` - 将整个文档作为输入内容
   - `provideDocumentSemanticTokens` - 为文档提供所有**符号**
   - `provideDocumentSemanticTokensEdits` - 对上次响应提供文档的所有**符号**
2. `DocumentRangeSemanticTokensProvider` - 只作用于局部范围
   - `provideDocumentRangeSemanticTokens` - 为局部文档提供所有**符号**

每个被供应器函数返回的**符号**都会含有分类信息，分类信息中包含了符号的类型、修改的符号数量、符号的具体语言等。这个信息和 [语法高亮](/language-extensions/syntax-highlight-guide) 中的 TextMate 作用域生成的信息很像，不过它有自己专属的更干净的分类系统。

就如上例所示，这个供应器命名了类型和具体修改，这些东西随后就会被`SemanticTokensLegend`使用，`provide` api 将类型和具体修改作为下标返回给 legend。

## 语义分词种类
---

下面是一些VS Code 预定义的标准**语义符号类型**和**语义符号修饰器**

标准类型和修饰器覆盖了很多语言中常见的概念，虽然很多语言都有自己的类型和修饰器术语，但是有了标准分类之后，主题开发者也能够根据这套标准实现跨语言的主题了。

标准语义符号类型：

| Id              | 描述                                       |
| --------------- | ------------------------------------------ |
| `namespace`     | 声明或引用了一个命名空间、模块或包         |
| `class`         | 声明或引用了一个“类”类型                   |
| `enum`          | 声明或引用了一个枚举类型                   |
| `interface`     | 声明或引用了一个接口类型                   |
| `struct`        | 声明或引用了一个结构类型                   |
| `typeParameter` | 声明或引用了一个类型参数                   |
| `type`          | 声明或引用了一个未被上述类型提及的其他类型 |
| `parameter`     | 声明或引用了一个函数或方法的参数           |
| `variable`      | 声明或引用了一个本地或全局变量             |
| `property`      | 声明或引用了一个成员属性，成员域或成员变量 |
| `enumMember`    | 声明或引用了一个可枚举的属性、常量或成员   |
| `event`         | 声明或引用了一个可枚举的属性               |
| `function`      | 声明或引用了一个函数                       |
| `method`        | 声明或引用了一个函数或方法                 |
| `macro`         | 声明或引用了一个宏                         |
| `label`         | 声明或引用了一个标签                       |
| `comment`       | 表示注释                                   |
| `string`        | 表示字符串字面量                           |
| `keyword`       | 表示语言关键字                             |
| `number`        | 表示数字字面量                             |
| `regexp`        | 表示正则表达式字面量                       |
| `operator`      | 表示操作符                                 |

标准语义符号修饰符：

| Id               | 描述                       |
| ---------------- | -------------------------- |
| `declaration`    | 符号的声明                 |
| `definition`     | 符号的定义，比如文件头     |
| `readonly`       | 只读变量或成员域，或称常量 |
| `static`         | 类成员中的静态成员对象     |
| `deprecated`     | 表示不再使用的符号         |
| `abstract`       | 表示类型或成员方法是抽象的 |
| `async`          | 被标记为异步的函数         |
| `modification`   | 被引用变量的原始赋值位置   |
| `documentation`  | 符号表示文档的位置         |
| `defaultLibrary` | 符号表示标准库             |

必要之时，插件也可以定义新的类型和修饰符，或者通过`semanticTokenTypes` 和 `semanticTokenModifiers` 配置点创建现有类型的子类型。

```json
{
  "contributes": {
    "semanticTokenTypes": [
      {
        "id": "templateType",
        "superType": "type",
        "description": "A template type."
      }
    ],
    "semanticTokenModifiers": [
      {
        "id": "native",
        "description": "Annotates a symbol that is implemented natively"
      }
    ]
  }
}
```
已配置的类型，可以声明它的父级类型，并继承其所有样式规则。

## 主题化
---

主题化是指将颜色和样式应用到 **符号** 的过程。色彩主题确定了主题化的规则，但是用户也可以通过用户设置来自定义主题规则。

使用 `semanticHighlighting` 时，色彩主题可以告诉编辑器是否展示**语义符号**。

如果启用的话，语义符号会优先于`semanticTokenColors`定义的语义符号规则使用：

```json
{
  "semanticTokenColors": {
    "variable.readonly:java": "#ff0000"
  }
}
```

`variable.readonly:java`被称为选择器，它的格式是`(*|tokenType)(.tokenModifier)*(:tokenLanguage)?`

这是一个样式选择器的例子：
- `"*.declaration": { "fontStyle": "bold" }` : 所有声明都标记为粗体
- `"class:java": { "foreground": "#00ff00" "fontStyle": "bold" }` ：java 中的类

如果没有匹配到任何规则，VS Code 会使用 [语义分词作用域映射](#语义分词作用域映射) 将当前语义符号解析为 TextMate 的作用域。然后这个作用域会根据TextMate 主题规则中的 `tokenColors` 进行匹配。

## 语义分词作用域映射
---

为了使语义高亮在没有任何定义语义规则的主题中能够降级使用，VS Code 维护了一个映射表，将语义符号选择器映射到 TextMate 作用域。

| 语义符号选择器                     | 降级 TextMate Scope                                 |
| ---------------------------------- | --------------------------------------------------- |
| `namespace`                        | `entity.name.namespace`                             |
| `type`                             | `entity.name.type`                                  |
| `type.defaultLibrary`              | `support.type`                                      |
| `struct`                           | `storage.type.struct`                               |
| `class`                            | `entity.name.type.class`                            |
| `class.defaultLibrary`             | `support.class`                                     |
| `interface`                        | `entity.name.type.interface`                        |
| `enum`                             | `entity.name.type.enum`                             |
| `function`                         | `entity.name.function`                              |
| `function.defaultLibrary`          | `support.function`                                  |
| `method`                           | `entity.name.function.member`                       |
| `macro`                            | `entity.name.function.macro`                        |
| `variable`                         | `variable.other.readwrite` , `entity.name.variable` |
| `variable.readonly`                | `variable.other.constant`                           |
| `variable.readonly.defaultLibrary` | `support.constant`                                  |
| `parameter`                        | `variable.parameter`                                |
| `property`                         | `variable.other.property`                           |
| `property.readonly`                | `variable.other.constant.property`                  |
| `enumMember`                       | `variable.other.enummember`                         |
| `event`                            | `variable.other.event`                              |
 
这份表可通过`semanticTokenScopes`配置点进行扩展。

我们来看两个例子
- 当主题未定义语义符号的主题规则时，插件定义了自定义的符号类型和符号修饰器给 TextMate 作用域作为降级方案。

```json
{
  "contributes": {
    "semanticTokenScopes": [
      {
        "scopes": {
          "templateType": ["entity.name.type.template"]
        }
      }
    ]
  }
}
```
- TextMate 的供应器函数可以添加特定语言作用域，这样主题就可以针对特对语言实现具体的主题规则。

```json
{
  "contributes": {
    "semanticTokenScopes": [
      {
        "language": "typescript",
        "scopes": {
          "property.readonly": ["variable.other.constant.property.ts"]
        }
      }
    ]
  }
}

```

## 试试看
---

我们有一份 [语义符号示例](https://github.com/microsoft/vscode-extension-samples/tree/master/semantic-tokens-sample) 展示了如何创建一个语义符号供应器函数。

[作用域检查器](/language-extensions/syntax-highlight-guide#作用域检查器) 可以帮你查看一份源文件中展示了哪些语义符号，以及他们应用了什么规则。想要看到语义符号，你可以打开一个 TyepScript 文件，然后使用内置主题（比如 Dark+）。