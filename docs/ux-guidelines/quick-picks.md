
# 快速选择（Quick Picks）

[快速选择](/extension-capabilities/common-capabilities#quick-pick)是执行操作和接收用户输入的简单方式。这在选择配置选项、需要过滤内容或从项目列表中选择时很有帮助。

![快速选择示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick.png)

**✔️ 应该**

* 使用语义清晰的图标
* 使用能增加清晰且有区分度的图标
* 使用描述来显示当前条目（如果适用）
* 使用详细信息来提供（简短的）额外上下文
* 对一系列基本输入使用多步骤模式
* 从列表中选择时，提供创建新条目的选项（如果适用）
* 为多步骤快速选择使用标题
* 为没有文本输入的快速选择使用标题
* 为要求文本输入的快速选择使用标题（使用占位符显示提示或示例）
* 为带有全局按钮（例如刷新图标）的快速选择使用标题

❌ 不应该

* 重复现有功能
* 在占位符本身可以描述用途时使用标题
* 使用没有占位符的输入

## 多步骤

快速选择可以配置为包含多个步骤。当你需要在单个流程中捕获相关但独立的多个选择时，请使用它们。避免将快速选择用于步骤很多的长流程——它们不太适合充当向导或类似复杂的体验。

![多步骤快速选择示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-multi-step.png)

*注意快速选择标题中的“1/3”文本，它表示流程中的当前步骤数和总步骤数。*

## 多选

对于需要在一步中完成的紧密相关的选择，请使用多选快速选择。

![多选快速选择示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-multi-select.png)

## 标题

快速选择也可以配置为在主输入和选择 UI 上方显示标题栏。当用户需要更多关于所做选择的上下文时，请使用标题。避免使用已在快速选择输入占位符中使用的标签作为标题。

![带标题的快速选择示例](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-title.png)

## 使用分隔符

可以使用快速选择分隔符将快速选择条目分组为清晰的区块。这些分隔符带有分隔线和标签，以清晰显示区块。如果插件提供的快速选择包含多个明显的选择组，请使用分隔符。

![带分隔符的快速选择](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-separators.png)

## 链接

* [快速选择 API 参考](/references/vscode-api#QuickPick)
* [快速选择条目 API 参考](/references/vscode-api#QuickPickItem)
* [快速选择插件示例](https://github.com/microsoft/vscode-extension-samples/tree/main/quickinput-sample)
