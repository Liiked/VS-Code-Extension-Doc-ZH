
# 遥测插件作者指南

Visual Studio Code 会收集使用数据并将其发送给 Microsoft，以帮助我们改进产品和服务。请阅读我们的[隐私声明](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409)和[遥测文档](/docs/getstarted/telemetry)了解更多信息。

本主题为插件作者提供指南，以便他们的插件能够符合 VS Code 的遥测要求和最佳实践。

>**注意**：如果你不想向 Microsoft 发送使用数据，可以将 `telemetry.telemetryLevel` 用户[设置](/docs/configure/settings)设为 `off`。

## 遥测模块

VS Code 团队维护着 [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm 模块，它提供了在 VS Code 中一致且安全地收集遥测的方式。该模块将遥测上报到 [Azure Monitor 和 Application Insights](https://azure.microsoft.com/services/monitor/)，并保证与 VS Code 旧版本向后兼容。

请按照本指南设置 [Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/app/nodejs)，并获取你的 Application Insights 检测密钥（instrumentation key）。

## 不使用遥测模块

不想使用 Application Insights 的插件作者可以使用自己的自定义方案来发送遥测。在这种情况下，插件作者仍然需要利用 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` API 来尊重用户的选择。这样做后，用户将有一个集中控制其遥测设置的地方。

## 自定义遥测设置

插件可能希望让用户控制独立于 VS Code 遥测的插件专属遥测。在这种情况下，我们建议你引入一个特定的插件设置。建议将自定义遥测设置标记为 `telemetry` 和 `usesOnlineServices`，以便用户更容易在设置 UI 中查询它们。添加自定义遥测设置并不能免除尊重用户决定的责任，`isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` 标志必须始终被尊重。如果 `isTelemetryEnabled` 报告为 false，即使你的设置已启用，也绝不能发送遥测。

## telemetry.json

我们理解遥测对许多用户来说可能是一个敏感话题，我们力求尽可能透明。VS Code 核心产品和大多数第一方插件都在其根目录中附带一个 `telemetry.json` 文件。这允许用户使用带 `--telemetry` 标志的 VS Code CLI，接收 VS Code 产生的所有遥测数据的转储。插件作者可以在根目录中包含 `telemetry.json` 文件，它也会出现在 CLI 转储中。

## 注意事项

✔️ 应该

* 如果 Application Insights 适合你，请使用 [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm 模块。
* 否则，请尊重 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` API。
* 如果你有自定义遥测设置，请将其标记为 `telemetry` 和 `usesOnlineServices`。
* 尽可能少地收集遥测数据。
* 尽可能向用户透明地说明你收集了什么。

❌ 不应该

* 引入不询问用户同意的自定义遥测收集方案。
* 收集个人身份信息（PII）。
* 收集超出必要的遥测数据。
* 只使用 `telemetry.telemetryLevel` 设置，因为它与 `isTelemetryEnabled` 相比有时可能不准确。
