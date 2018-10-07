# VS Code插件开发文档

## 提问、质疑和参与
---
- **提问**：欢迎大家在issue区对插件开发进行提问，但这里不是官方答疑平台，不过你可以在这里和国内的插件开发者进行交流。

- **纠错和润饰**：在翻译过程中难免会出现笔误或是翻译不到位的情况，当然最严重的应属于翻译的章节或者片段难以理解，请在issue中不吝赐教，我们会优先处理这类问题。

- **参与**：请参考我们的翻译指南，本项目的翻译审查较为严格，但欢迎大家共同参与和学习。

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
    - ☑️ [文本选择](https://code.visualstudio.com/docs/extensionAPI/document-selectors)
    - ☑️ [vscode 命名空间API](https://code.visualstudio.com/docs/extensionAPI/vscode-api)
    - ✅ [复杂命令](https://code.visualstudio.com/docs/extensionAPI/vscode-api-commands)
    - ✅ [调试器API](https://code.visualstudio.com/docs/extensionAPI/api-debugging)
    - ☑️ [源控制](https://code.visualstudio.com/docs/extensionAPI/api-scm)
    - ☑️ [Markdown插件](https://code.visualstudio.com/docs/extensionAPI/api-markdown)

- **第三期计划** - 审阅文档中的链接和内容

## 开发指引
---
本项目依赖nodejs，npm，docsify和官方文档。另外对新手不太友好（萌新等级警告⚠️请勿轻易尝试）。

```bash
// 本地启动开发
npm i docsify-cli -g
docsify serve docs
```

## 翻译指南
---
我们首次帮助巨硬引入了众多概念的解释，因此在翻译术语时尤其需要注意。所有遇到的术语都需要提交到术语表中，以便读者和译者查阅、参考。

#### 翻译风格

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
虽然这里**HTML 字符串**贴合`HTML strings`的表述，但是适当的加工则更有利于阅读，最终翻译为**可以考虑用一个辅助库去构建HTML模板，或者确保所有来自用户工作区的内容都通过了审查**。

## 术语表
---
术语表收录出现在VS Code中独有的或是易引起歧义的词汇，不包含常见词汇，如Extension。该表按首字母排序。

!> 约定用法，如Promise通常不做翻译，如有必要，请使用“中文（原共识英文）”的方式来显示，即：异步请求（promise），在有参考资料后得出的翻译结果，需要在术语表释义后面注明来源或链接。

术语翻译优先参考[github的开源翻译项目](https://github.com/Microsoft/vscode-loc/blob/master/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json)

- [Activation Events](https://code.visualstudio.com/docs/extensionAPI/overview) 激活事件
- [Contribution Points](https://code.visualstudio.com/docs/extensionAPI/overview) 发布内容配置点
- [Debug Adapter](https://code.visualstudio.com/docs/extensions/overview#_language-servers) 调试适配器
- [Extension Manifest](https://code.visualstudio.com/docs/extensionAPI/overview) 插件清单
- Extensibility 扩展性
- [Extension Host](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles) 扩展主机
- [Extension Host Process](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles) 扩展主机环境
- [Language Servers](https://code.visualstudio.com/docs/extensions/overview#_language-servers) 语言服务器