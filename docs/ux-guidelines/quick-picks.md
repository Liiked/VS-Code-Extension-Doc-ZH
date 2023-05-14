# 快速选择

[快速选择](../extension-capabilities/common-capabilities.md#快速选择) 可以便捷地接受用户输入并执行操作。特别是选择配置，需要过滤内容、或从一堆东西中选一个时。

![quick-pick](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick.png)


✔**️推荐**

- 使用含义清晰的图标
- 如果可以的话，展示项使用更具描述性的文本
- 使用（简要）文本详情
- 需要进行一系列输入时，使用多步骤模式
- 在列表中，提供一个创建新选项的功能（如果可用的话）
- 多步骤选择时提供标题
- 无需文本输入的快速选择中，配置一个标题
- 需要文本输入时，给快速选择配置一个标题（使用占位符或例子来提示）
- 为全局功能按钮配置标题（如：一个刷新按钮）

❌不推荐

- 重复造轮子
- 多个选项都用同一个图标
- 一个列表中展示了6个以上的图标
- 占位符能表达意图时还用上了标题
- 输入框不带占位符

## 多步骤

快速选择可配置为多步骤形态。当你配置一个流程，它需要捕捉多个相关但独立的选项时，请使用该模式。不要用很多的步骤去配置一个非常长的流程——快速选择不是软件安装工具也不提供类似的体验。

![quick-pick-multi-step](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-multi-step.png)
注意快速选择标题中的 “1/3” 告知了当前步骤和该流程中的总步骤数

## 多选项

多个相近选项需要在一步中完成的，请使用 *多选快速选择*。

![quick-pick-multi-select](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-multi-select.png)

## 标题

快速选择可在主输入框和选择界面上配置一个标题栏。当用户需要更多所选项的上下文信息时请使用标题。避免快速选择输入框中的占位符和标题相同。

![quick-pick-title](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-title.png)

## 使用分隔线

使用 快速选择器分隔线 对选项进一步分组。用分割线和标签让每个区域更清晰易懂。你的插件如果需要配置多个明显成组的选项时，请使用分隔线。

## 相关资源

- [快速选择 API 参考](https://code.visualstudio.com/api/references/vscode-api#QuickPick)
- [快速选择项 API 参考](https://code.visualstudio.com/api/references/vscode-api#QuickPickItem)
- [快速选择插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/quickinput-sample)