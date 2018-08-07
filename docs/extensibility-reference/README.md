# 扩展性参考

本章内容将深入到VS Code扩展性细节中去一窥究竟。在我们着手深入之前，重新看一下[插件介绍]()和过一遍['Hello World']()示例会更有好处。

查看VS Code插件最简单的方法就是使用[插件市场]()，一旦你构建好了你的第一个应用，就可以发不上去供其他人使用了。

## 扩展性文档索引

本章文档将着重介绍下列主题：


|  主题  |  描述  | 
| ---- | ---- | 
|  [package.json 插件配置清单]() | 每个VS Code 插件根目录都配有一个`package.json`清单文件，这个文件提供插件概览和一些必须的字段 | 
|  [发布内容配置点]() | 基于`package.json`的配置内容，你可以添加诸如：commands, themes, debuggers……的插件配置 | 
|  [激活事件]() | VS Code对插件执行懒加载机制。这篇文档提供了`package.json`中可用于激活的配置点，比如在特定文档打开时激活，命令触发时激活等等 | 
|  [API vscode 命名空间]() | 查看完整的vscode命名空间API | 
|  [API 复杂命令]() | 查看VS Code中的复杂命令API | 
|  [API 示例]() | 学习VS Code插件API的有关示例 | 
|  [用于调试的API]() | 学习将调试器和VS Code配合使用的细节 | 
|  [Markdown插件API]() | 学习VS Code插件API的有关示例 | 

## 语言插件指引

如果你正在实现编程语言支持，可以参考[语言插件指引](extensibility-reference/language-extension-guidelines)主题，这节内容提供了VS Code可以使用的各种各样的语言特性（比如：代码建议、代码行为、格式化、重命名等）和教你如何实现它们。