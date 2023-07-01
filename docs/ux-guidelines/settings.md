# 设置

设置可让你的用户配置插件。设置可以是输入框、是否接受、下拉框、列表、键值对等形式。如果你的插件需要用户配置一些设置，你可以用 设置ID 打开设置界面来查询插件的设置。

✔**️推荐**

- 为每个设置项添加默认值
- 为每个设置项添加清晰的描述
- 为复杂的设置添加文档链接
- 为关联设置添加链接
- 当用户需要配置特定设置时，添加设置 ID 链接

❌**不推荐**
- 创建你自己的设置页面（或 webview）
- 使用非常长的描述

![settings](https://code.visualstudio.com/assets/api/ux-guidelines/examples/settings.png)

## 相关资源

[配置点](../references/contribution-points.md#contributesconfiguration)