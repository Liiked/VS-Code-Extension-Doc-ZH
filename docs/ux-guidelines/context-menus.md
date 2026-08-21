
# 上下文菜单（Context Menus）

[菜单项](/references/contribution-points#contributes.menus)会出现在视图、操作和右键菜单中。菜单分组中保持一致性非常重要。如果你的插件有文件相关操作，请在**文件资源管理器**上下文菜单中(适时)放置你的操作。如果插件有针对特定文件类型的操作，请只对那些条目显示菜单。

**✔️ 应该**

* 时机合适时展示操作
* 将相似的操作分组在一起
* 将大量操作放入子菜单

❌ 不应该

* 不分场合为每个文件显示操作

![上下文菜单](https://code.visualstudio.com/assets/api/ux-guidelines/examples/context-menu.png)

*此示例将 **Copy GitHub Permalink** 放在其他复制命令旁边。此操作仅出现在来自 GitHub 仓库的文件上。*

## 链接

* [上下文菜单 API 参考](/references/contribution-points#contributes.menus)
