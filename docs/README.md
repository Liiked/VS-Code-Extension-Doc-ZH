# VS Code插件开发文档

## 提问、纠错和参与
---
- **提问**：欢迎大家在issue区对插件开发进行提问，虽然这里不是官方答疑平台，不过你可以在这里和国内的插件开发者进行交流。

- **纠错和润饰**：在翻译过程中难免会出现笔误、翻译不到位、存在优化空间等情况，当然最严重的应属于翻译的章节或者片段难以理解，请在issue中不吝赐教，我们会优先处理这类问题。

- **参与**：由于国内已经有过一版VS Code文档的社区翻译版本，但是质量，emmmmm……，所以本项目会采取较为严格的翻译审查，若你有热情一同学习和贡献自己的力量，请参考我们的翻译指南。

## 翻译计划
---
- **第一期计划** - 翻译*插件创作*内的所有章节
    - ✅ [示例：语言服务器](https://code.visualstudio.com/docs/extensions/example-language-server)
    - ✅ [调试适配器](https://code.visualstudio.com/docs/extensions/example-debuggers)
    - ✅ [Webview API](https://code.visualstudio.com/docs/extensions/webview)
    - ✅ [更多例子](https://code.visualstudio.com/docs/extensions/samples)
    - ✅ [开发插件](https://code.visualstudio.com/docs/extensions/developing-extensions)
    - ✅ [发布插件](https://code.visualstudio.com/docs/extensions/publish-extension)
    - ✅ [测试插件](https://code.visualstudio.com/docs/extensions/testing-extensions)

- **第二期计划** - 翻译*扩展性参阅*内的所有章节
    - ✅ [扩展性参阅](https://code.visualstudio.com/docs/extensionAPI/overview)
    - ✅ [扩展性原则和模式](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles)
    - ✅ [语言插件指引](https://code.visualstudio.com/docs/extensionAPI/language-support)
    - ✅ [插件清单](https://code.visualstudio.com/docs/extensionAPI/extension-manifest)
    - ✅ [发布内容配置](https://code.visualstudio.com/docs/extensionAPI/extension-points)
    - ✅ [激活事件](https://code.visualstudio.com/docs/extensionAPI/activation-events)
    - ✅ [文档选择器](https://code.visualstudio.com/docs/extensionAPI/document-selectors)
    - ✅ [vscode 命名空间API](https://code.visualstudio.com/docs/extensionAPI/vscode-api)
    - ✅ [复杂命令](https://code.visualstudio.com/docs/extensionAPI/vscode-api-commands)
    - ✅ [调试器API](https://code.visualstudio.com/docs/extensionAPI/api-debugging)
    - ✅ [源控制](https://code.visualstudio.com/docs/extensionAPI/api-scm)
    - ✅ [Markdown插件](https://code.visualstudio.com/docs/extensionAPI/api-markdown)

- **第三期计划** - 审阅文档中的链接和内容
    - ☑️ 审阅插件创作和Readme
        - ✅ 介绍部分
        - ✅ 从示例开始
        - ☑️ 开发步骤 + 进阶
    - ☑️ 审阅扩展性参考
     - ☑️ 1-4节
     - ☑️ 5-7节
     - ☑️ 8-10节

- **第四期计划**
    - 添加[示例-任务](https://code.visualstudio.com/docs/extensions/example-tasks)章节
    - 添加术语速查小插件
    - 添加快速入门章节（待定）

## 开发指引
---
本项目依赖nodejs，npm，[docsify](https://docsify.js.org/)和[官方文档](https://code.visualstudio.com/docs)。另外对新手不太友好（萌新等级警告⚠️请勿轻易尝试）。

#### 贡献代码

- Markdown的格式要求，尽量避免使用`*`用于表示列表，而是使用`-`等其他符号
- 贡献流程：fork本项目，修改文件，提交pr，贡献成员到时候会显示到github项目主页中
- 请在翻译中遵循[翻译指南](#翻译指南)，否则本项目的owner可能会与你进行深度的讨论~

```bash
// 本地启动开发
npm i docsify-cli -g
docsify serve docs
```

## 翻译指南
---

由于原文档过于追求平白易懂，平添了许多英语中重复和特指的句子和语法，翻译者需要特别注意，本翻译只追求易懂和流畅，不要求逐字翻译，与原文出入最低做到70%即可，但不可扭曲其原本的意思，任何翻译中的困难可在issue中探讨。

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
虽然这里**HTML 字符串**贴合`HTML strings`的表述，但是适当的加工则更有利于阅读，最终可翻译为**可以考虑用一个辅助库去构建HTML模板，或者确保所有来自用户工作区的内容都通过了审查**。

- 兼收并蓄

在多人合作翻译中，个人风格可能与已提交翻译不匹配，但这种情况下不建议修改现有的翻译成果，除非您的释义能极大地帮助读者理解文档原意。

- 及时更新术语表
- 禁止机器翻译

## 术语表
---
术语表收录出现在VS Code中独有的或是易引起歧义的词汇，不包含常见词汇，如Extension。该表按首字母排序。

!> 约定用法，如Promise通常不做翻译，若有必要或遇到困难的词语，请使用“中文（English）”的方式来显示，如：`异步请求（promise）`，在有参考资料后得出的翻译结果，需要在术语表释义后面注明词汇出现来源或释义链接。

术语翻译优先参考[github的开源翻译项目](https://github.com/Microsoft/vscode-loc/blob/master/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json)

- [Activation Events](https://code.visualstudio.com/docs/extensionAPI/overview) 激活事件
- [Contribution Points](https://code.visualstudio.com/docs/extensionAPI/overview) 发布内容配置点
- [Debug Adapter](https://code.visualstudio.com/docs/extensions/overview#_language-servers) 调试适配器
- [Extension Manifest](https://code.visualstudio.com/docs/extensionAPI/overview) 插件清单
- Extensibility 扩展性
- [Extension Host](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles) 扩展主机
- [Extension Host Process](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles) 扩展主机环境/插件主机环境
- [Language Servers](https://code.visualstudio.com/docs/extensions/overview#_language-servers) 语言服务器
- [Language Identifier](https://code.visualstudio.com/docs/extensions/themes-snippets-colorizers#_language-identifiers) 语言标识符