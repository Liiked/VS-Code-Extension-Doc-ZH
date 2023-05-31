# 上下文菜单

[菜单项](../references/contribution-points.md#contributesmenus)可出现在视图、操作和右击菜单中。分组菜单的一致性也需要重视。如果你的插件需要操作文件，把操作放在 **资源管理器** 上下文菜单中（如果可以的话）。如果插件只是操作特定的文件类型，那就只为这些文件展示相关操作。

✔**️推荐**
- 在适当的环境中展示
- 对相似操作进行分组
- 将大组别操作放到子菜单中

❌**不推荐**
- 不考虑上下文，对所有文件都展示操作菜单

![context-menu](https://code.visualstudio.com/assets/api/ux-guidelines/examples/context-menu.png)
本示例将 Copy GitHub Permalink 命令放在了其他复制命令的旁边。只有来源于 GitHub 仓库的文件才展示此操作。 

## 相关资源
- [上下文菜单 API 参考](../references/contribution-points.md#contributesmenus)