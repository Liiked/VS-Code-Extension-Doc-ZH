
# 设置（Settings）

[设置](/references/contribution-points#contributes.configuration)是用户配置插件的方式。设置可以是输入框、布尔值、下拉框、列表、键/值对。如果你的插件需要用户配置特定设置，你可以打开设置 UI，并通过设置 ID 查询你的插件设置。

**✔️ 应该**

* 为每个设置添加默认值
* 为每个设置添加清晰的描述
* 为复杂的设置链接到文档
* 链接到相关的其他设置
* 在需要用户配置特定设置时链接到设置 ID

❌ 不应该

* 创建自己的设置页面/webview
* 创建冗长的描述

![设置](https://code.visualstudio.com/assets/api/ux-guidelines/examples/settings.png)

*此示例使用设置 ID 链接到特定设置。*

## 链接

* [配置配置点](/references/contribution-points#contributes.configuration)
