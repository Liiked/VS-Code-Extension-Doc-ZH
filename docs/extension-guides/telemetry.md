# 遥测插件指南

VS Code 会收集使用数据并发送给 Microsoft 帮助提升产品和服务。请阅读我们的 [隐私政策](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409) 和 [遥测文档](https://code.visualstudio.com/docs/getstarted/telemetry)。

本章主要指导插件作者们遵守 VS Code 遥测的最佳实践和要求。

:::info
注意：如果你不想把使用数据发送给 Microsoft，你可以将[用户设置](https://code.visualstudio.com/docs/getstarted/settings)中的 `telemetry.telemetryLevel` 配置为 `off`。
:::

## 遥测模块
VS Code 团队维护了 [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm 模块，这个模块为 VS Code 提供了一致且安全的内部遥测数据采集模式。该模块会把遥测数据上报给 [Azure Monitor and Application Insights](https://azure.microsoft.com/services/monitor/) 并保证历史 VS Code 版本的后向兼容。

按照本[指南](https://learn.microsoft.com/azure/azure-monitor/app/nodejs)设置好 [Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/app/nodejs) 然后获得应用洞察（Application Insights）的访问密钥。

## 不使用遥测模块

不想使用 应用洞察（Application Insights）的插件作者，可以配置好您自己的解决方案然后把数据上报上去。不过，你任然要注意尊重用户的选择，调用 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` API 即可做到这一点。这样一来，用户就可以统一地配置遥测了。

## 自定义遥测设置

插件可能希望让用户来控制遥测而不是通过 VS Code 来配置。这种场合下，我们建议你引入特定插件配置。建议使用`telemetry` 和 `usesOnlineServices` 进行标记自定义遥测设置，以便用户在 **设置** 页面中轻松地找到他们。添加自定义遥测设置不意味着插件就可以不尊重用户的选择，请务必尊重 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` 配置，如果 `isTelemetryEnabled ` 返回 `false`，你的插件启动后也不应该发送遥测数据。

## telemetry.json

我们很清楚对于大部分用户来说都是一个非常敏感的话题，因此我们致力于将这个过程透明化。VS Code 的核心产品和大部分第一方插件，其根目录下都自带 `telemetry.json` 文件。用户就可以使用 VS Code CLI 的 `--telemetry` 参数去接收 VS Code 产生的所有遥测 dump 日志。插件作者也可以在根目录下添加一个 `telemetry.json` 文件，这要一来，你的日志也会出现在 CLI 的 dump 日志中。

## 行为准则

✔️应该

- 如果可以使用 应用洞察（Application Insights），那么请优先使用 [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm 包
- 不然，请遵照 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` 行事
- 自定义遥测设置应使用 `telemetry` 和 `usesOnlineServices` 进行标记
- 尽可能少收集遥测数据
- 你所收集的信息应尽可能对你的用户保持透明

❌不应该

- 未经用户同意就使用遥测采集方案
- 采集个人身份标识信息（PII）
- 采集非必要信息
- 仅仅使用 `telemetry.telemetryLevel` 设置的片面数据，而不使用 `isTelemetryEnabled` 这个更准确的数据