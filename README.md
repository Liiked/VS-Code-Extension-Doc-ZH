# VS Code 插件开发文档

欢迎来到为巨硬填坑的中文文档😆

[📚 查看中文文档](https://liiked.github.io/VS-Code-Extension-Doc-ZH/
)

[📚 原文档](https://code.visualstudio.com/docs/extensions/overview)

## 提问、纠错和参与

- **提问**：欢迎大家在issue区对插件开发进行提问，虽然这里不是官方答疑平台，不过你可以在这里和国内的插件开发者进行交流。

- **纠错和润饰**：在翻译过程中难免会出现笔误、翻译不到位、存在优化空间等情况，当然最严重的应属于翻译的章节或者片段难以理解，请在issue中不吝赐教，我们会优先处理这类问题。

- **参与**：由于国内已经有过一版VS Code文档的社区翻译版本，但是质量，emmmmm……，所以本项目会采取较为严格的翻译审查，若你有热情一同学习和贡献自己的力量，请参考我们的翻译指南。

## 翻译计划

翻译计划已移动到[Progress](https://github.com/Liiked/VS-Code-Extension-Doc-ZH/blob/master/Progress.md)

如果你有兴趣、能力和时间，欢迎[贡献代码](#贡献代码)

## 翻译指南

由于原文档过于追求平白易懂，平添了许多反复解释和略显啰嗦的句子和语法，翻译者需要注意，本项目更追求易懂和流畅，不要求逐字翻译，与原文出入最低做到70%即可，但不可扭曲其原本的意思，任何翻译中的困难可在issue中探讨。

- 及时更新术语表
- 禁止机器翻译
- 约定用法
    如Promise通常不做翻译，若有必要或遇到困难的词语，请使用“中文（English）”的方式来显示，如：`异步请求（promise）`，在有参考资料后得出的翻译结果，需要在术语表释义后面注明词汇出现来源或释义链接。
- 避免冗余
    ```markdown
    By implementing a `WebviewPanelSerializer`, your webviews can be automatically restored
    when VS Code restarts. Serialization builds on `getState` and `setState`, and is only
    enabled if your extension registers a `WebviewPanelSerializer` for your webviews.
    ```
    后一句`and is only enabled if your extension registers a WebviewPanelSerializer for your webviews`再翻译出来显得多余，可以不翻译。

- 平白易懂
    ```markdown
    Consider using a helper library to construct your HTML strings, or at least
    ensure that all content from the user's workspace is properly sanitized.
    ```
    虽然这里**HTML 字符串**贴合`HTML strings`的表述，但是适当的加工则更有利于阅读，最终可考虑翻译为“**尝试使用辅助库构建你的HTML模板，或者确保所有来自用户工作区的内容都通过了审查**”。

- 兼收并蓄

    在多人合作翻译中，个人风格可能与已提交翻译不匹配，但这种情况下不建议修改现有的翻译成果。
- 术语翻译优先参考[github的开源翻译项目](https://github.com/Microsoft/vscode-loc/blob/master/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json)


## 开发指引

本项目依赖nodejs，npm，[docsify](https://docsify.js.org/)和[官方文档](https://code.visualstudio.com/docs)。另外对新手不太友好（萌新等级警告⚠️请勿轻易尝试）。

#### 贡献代码

- Markdown的格式要求，尽量避免使用`*`用于表示列表，而是使用`-`等其他符号
- 贡献流程：fork/clone本项目，根据目前的项目进度和自己的兴趣，挑选进行中的翻译，在issue面板中创建一个`help translate`告知项目owner，通过后创建分支如“fix/chapter_testing_extensions”，修改文件，提交pr到“branch/docs”
- 请在翻译中遵循[翻译指南](#翻译指南)，否则本项目的owner可能会与你进行深度的讨论~

```bash
// 本地启动开发
npm i docsify-cli -g
docsify serve docs
```

## 特别感谢

[//]: contributor-faces

<a href="https://github.com/ddzy"><img src="https://avatars3.githubusercontent.com/u/33921398?s=400&v=4" title="ddzy" width="80" height="80"></a>

[//]: contributor-faces