# 插件主机

你已经在[插件诊断](/get-started/extension-anatomy)中学习了插件会将`active`和`deactive`声明周期函数暴露给VS Code，在本节我们来看看**插件主机/插件宿主(Extension Host)**是怎么管理所有运行中的插件的。

**插件主机**是VS Code中负责加载和运行插件的Node.js进程，虽然你在写插件时不必关心这件事，但是掌握插件主机的运行原理对你创作插件还是非常有用的。

## 稳定性和性能
---

VS Code致力于为用户提供一个稳定且高性能的编辑环境，因此出错的插件不应该影响到用户的体验。所以**插件主机**可以预防这些事情：

- 启动性能影响
- 阻塞的UI操作
- 修改UI

另外，VS Code提供的[激活事件机制](/references/activation-events)也让插件只在用到时才懒加载它们，比如，Markdown插件应该只在用户打开了Markdown文件时才启动，因此避免了不必要CPU和内存消耗。