# 术语表和说明

## 提问、纠错和参与
---
- **提问**：欢迎大家在issue区对插件开发进行提问，虽然这里不是官方答疑平台，不过你可以在这里和国内的插件开发者进行交流。

- **纠错和润饰**：在翻译过程中难免会出现笔误、翻译不到位、存在优化空间等情况，当然最严重的应属于翻译的章节或者片段难以理解，请在issue中不吝赐教，我们会优先处理这类问题。

- **参与**：由于国内已经有过一版VS Code文档的社区翻译版本，但是质量，emmmmm……，所以本项目会采取较为严格的翻译审查，若你有热情一同学习和贡献自己的力量，请参考我们的[开发和翻译指南](https://github.com/Liiked/VS-Code-Extension-Doc-ZH)。

## 术语表
---
术语表收录出现在VS Code中独有的或是易引起歧义的词汇，不包含常见词汇，如Extension。该表按首字母排序。
该表格式：
- 普通词汇 `英文名称 术语名称`
- 单义词 `[出处或参考解释链接]() 术语名称：解释`
- 多义词 `[出处或参考解释链接]() 术语名称1/术语名称2：解释`

[terms]: 该术语表是术语表插件的源数据，激活术语表插件的关键字即下述链接后的文字请用逗号分隔，术语描述则是冒号后面的内容

- [Activation Events](https://code.visualstudio.com/docs/extensionAPI/overview) 激活事件：用于激活插件的VS Code事件钩子。
- [Contribution Points](https://code.visualstudio.com/docs/extensionAPI/overview) 发布内容配置点：插件清单的一部分，用于配置插件启动命令、用户可更改的插件配置，可以理解为插件的主要配置文件。
- [Debug Adapter](https://code.visualstudio.com/docs/extensions/overview#_language-servers) 调试适配器
- [Extension Manifest](https://code.visualstudio.com/docs/extensionAPI/overview) 插件清单：VS Code自定义的pacakge.json文件，其中包含着插件的入口、配置等重要信息。
- Extensibility 扩展性
- [Extension Host](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles) 扩展主机：用于插件开发者调试尚未完成插件的特殊VS Code实例。
- [Language Servers](https://code.visualstudio.com/docs/extensions/overview#_language-servers) 语言服务器：VS Code使用的C/S结构的插件模式中的服务器端，用于高消耗的特殊插件场景，如语言解析、智能提示等。
- [Language Identifier](https://code.visualstudio.com/docs/languages/identifiers) 语言标识符