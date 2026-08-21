# 配置点

**配置点**（Contribution Points）是一组你在 `package.json` 的 `contributes` 字段中声明的 JSON 声明。你的插件通过注册**配置点**来扩展 Visual Studio Code 中的各种功能。以下是所有可用的**配置点**列表：

- [`authentication`](/references/contribution-points#contributes.authentication)
- [`breakpoints`](/references/contribution-points#contributes.breakpoints)
- [`chatAgents`](/references/contribution-points#contributes.chatAgents)
- [`chatInstructions`](/references/contribution-points#contributes.chatInstructions)
- [`chatPromptFiles`](/references/contribution-points#contributes.chatPromptFiles)
- [`chatSkills`](/references/contribution-points#contributes.chatSkills)
- [`colors`](/references/contribution-points#contributes.colors)
- [`commands`](/references/contribution-points#contributes.commands)
- [`configuration`](/references/contribution-points#contributes.configuration)
- [`configurationDefaults`](/references/contribution-points#contributes.configurationDefaults)
- [`customEditors`](/references/contribution-points#contributes.customEditors)
- [`debuggers`](/references/contribution-points#contributes.debuggers)
- [`grammars`](/references/contribution-points#contributes.grammars)
- [`icons`](/references/contribution-points#contributes.icons)
- [`iconThemes`](/references/contribution-points#contributes.iconThemes)
- [`jsonValidation`](/references/contribution-points#contributes.jsonValidation)
- [`keybindings`](/references/contribution-points#contributes.keybindings)
- [`languages`](/references/contribution-points#contributes.languages)
- [`languageModelChatProviders`](/references/contribution-points#contributes.languageModelChatProviders)
- [`languageModelTools`](/references/contribution-points#contributes.languageModelTools)
- [`menus`](/references/contribution-points#contributes.menus)
- [`problemMatchers`](/references/contribution-points#contributes.problemMatchers)
- [`problemPatterns`](/references/contribution-points#contributes.problemPatterns)
- [`productIconThemes`](/references/contribution-points#contributes.productIconThemes)
- [`resourceLabelFormatters`](/references/contribution-points#contributes.resourceLabelFormatters)
- [`semanticTokenModifiers`](/references/contribution-points#contributes.semanticTokenModifiers)
- [`semanticTokenScopes`](/references/contribution-points#contributes.semanticTokenScopes)
- [`semanticTokenTypes`](/references/contribution-points#contributes.semanticTokenTypes)
- [`snippets`](/references/contribution-points#contributes.snippets)
- [`submenus`](/references/contribution-points#contributes.submenus)
- [`taskDefinitions`](/references/contribution-points#contributes.taskDefinitions)
- [`terminal`](/references/contribution-points#contributes.terminal)
- [`themes`](/references/contribution-points#contributes.themes)
- [`typescriptServerPlugins`](/references/contribution-points#contributes.typescriptServerPlugins)
- [`views`](/references/contribution-points#contributes.views)
- [`viewsContainers`](/references/contribution-points#contributes.viewsContainers)
- [`viewsWelcome`](/references/contribution-points#contributes.viewsWelcome)
- [`walkthroughs`](/references/contribution-points#contributes.walkthroughs)

## contributes.authentication

为 VS Code 贡献一个身份验证提供程序。这将为你的提供程序建立一个激活事件，并将其显示在你的插件功能列表中。

```json
{
  "contributes": {
    "authentication": [
      {
        "label": "Azure DevOps",
        "id": "azuredevops"
      }
    ]
  }
}
```

## contributes.breakpoints

通常，调试器插件还会有一个 `contributes.breakpoints` 配置项，插件在其中列出可为其启用断点设置的语言文件类型。

```json
{
  "contributes": {
    "breakpoints": [
      {
        "language": "javascript"
      },
      {
        "language": "javascriptreact"
      }
    ]
  }
}
```

## contributes.chatAgents

为 Copilot Chat 贡献[自定义代理](https://code.visualstudio.com/docs/agent-customization/custom-agents)（custom agents）。自定义代理是预先配置好的 AI 角色，带有特定的指令和工具限制。使用此配置点可将可复用的自定义代理与你的插件捆绑在一起，使它们与用户自定义的代理一起出现在代理下拉列表中。

每个条目需要一个相对于插件根目录的 `.agent.md` 文件 `path`。你可以选择性地指定 `when` 子句来有条件地启用该代理。请在 `.agent.md` 的 frontmatter 中指定代理的 `name`、`description` 和其他元数据，而不是在配置点中指定。

```json
{
  "contributes": {
    "chatAgents": [
      {
        "path": "./agents/planner.agent.md"
      }
    ]
  }
}
```

### chatAgents 属性

| 属性           | 类型       | 是否必填 | 描述                                                                                  |
| -------------- | ---------- | -------- | ------------------------------------------------------------------------------------- |
| `path`         | `string`   | 是       | 相对于插件根目录的 `.agent.md` 文件路径。该路径必须解析到插件内部的位置。             |
| `when`         | `string`   | 否       | 一个 [when 子句](/references/when-clause-contexts) 条件，该条目启用时该条件必须为真。 |
| `sessionTypes` | `string[]` | 否       | 应提供此代理的聊天会话类型。                                                          |

有关所需的 `.agent.md` 文件格式（包括 `name`、`description`、`tools` 和 `model` frontmatter 字段），请参阅 [VS Code 中的自定义代理](https://code.visualstudio.com/docs/agent-customization/custom-agents)。

## contributes.chatInstructions

为 Copilot Chat 贡献[指令文件](https://code.visualstudio.com/docs/agent-customization/custom-instructions)（instructions files）。指令文件提供自定义准则，它们会自动包含在聊天请求中，以引导 Copilot 的行为。使用此配置点可将可复用的指令与你的插件捆绑在一起，例如编码约定、框架特定准则或领域特定规则。

当用户的聊天请求与指令的用例相关时，Copilot 会自动应用已贡献的指令。你无需手动附加它们。

每个条目需要一个相对于插件根目录的 Markdown 文件 `path`。你可以选择性地指定 `when` 子句来控制指令何时启用。请在 Markdown 文件本身中指定 `name` 和 `description` 元数据，而不是在配置点中指定。

```json
{
  "contributes": {
    "chatInstructions": [
      {
        "path": "./prompts/textMateGuidelines.instructions.md"
      }
    ]
  }
}
```

你可以使用可选的 `when` 子句，根据上下文有条件地启用指令：

```json
{
  "contributes": {
    "chatInstructions": [
      {
        "path": "./prompts/textMateGuidelines.instructions.md",
        "when": "resourceExtname == .tmLanguage"
      }
    ]
  }
}
```

### chatInstructions 属性

| 属性   | 类型     | 是否必填 | 描述                                                                                  |
| ------ | -------- | -------- | ------------------------------------------------------------------------------------- |
| `path` | `string` | 是       | 相对于插件根目录的 Markdown 文件路径。该路径必须解析到插件内部的位置。                |
| `when` | `string` | 否       | 一个 [when 子句](/references/when-clause-contexts) 条件，该条目启用时该条件必须为真。 |

关于贡献可复用的提示文件，请参阅 [`chatPromptFiles`](/references/contribution-points#contributes.chatPromptFiles) 配置点。

## contributes.chatPromptFiles

为 Copilot Chat 贡献[提示文件](https://code.visualstudio.com/docs/agent-customization/custom-instructions)（prompt files）。提示文件是可复用的聊天提示，用户可以在聊天中以斜杠命令的方式调用它们。使用此配置点可将现成的提示与你的插件捆绑在一起。

每个条目需要一个相对于插件根目录的 Markdown 文件 `path`。你可以选择性地指定 `when` 子句来有条件地启用该提示。请在 Markdown 文件本身中指定 `name` 和 `description` 元数据，而不是在配置点中指定。

```json
{
  "contributes": {
    "chatPromptFiles": [
      {
        "path": "./prompts/reviewAndCreateIssue.prompt.md"
      }
    ]
  }
}
```

### chatPromptFiles 属性

| 属性   | 类型     | 是否必填 | 描述                                                                                  |
| ------ | -------- | -------- | ------------------------------------------------------------------------------------- |
| `path` | `string` | 是       | 相对于插件根目录的 Markdown 文件路径。该路径必须解析到插件内部的位置。                |
| `when` | `string` | 否       | 一个 [when 子句](/references/when-clause-contexts) 条件，该条目启用时该条件必须为真。 |

关于贡献可复用的指令文件，请参阅 [`chatInstructions`](/references/contribution-points#contributes.chatInstructions) 配置点。

## contributes.chatSkills

为 Copilot Chat 贡献[Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)（代理技能）。Agent Skills 是指令、脚本和资源的文件夹，Copilot 可以在相关时加载它们以执行专门的任务。使用此配置点可将可复用的技能与你的插件捆绑在一起。

每个条目需要一个相对于插件根目录的 `SKILL.md` 文件 `path`。`SKILL.md` 文件必须遵循 [Agent Skills 规范](https://agentskills.io/specification)，并且其 `name` 字段必须与父目录名称一致。你可以选择性地指定 `when` 子句来有条件地启用该技能。

```json
{
  "contributes": {
    "chatSkills": [
      {
        "path": "./skills/my-skill/SKILL.md"
      }
    ]
  }
}
```

### chatSkills 属性

| 属性   | 类型     | 是否必填 | 描述                                                                                                                           |
| ------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `path` | `string` | 是       | 相对于插件根目录的 `SKILL.md` 文件路径。该路径必须解析到插件内部的位置，并且父目录名称必须与 `SKILL.md` 中的 `name` 字段一致。 |
| `when` | `string` | 否       | 一个 [when 子句](/references/when-clause-contexts) 条件，该条目启用时该条件必须为真。                                          |

有关所需的技能结构和 `SKILL.md` 格式，请参阅[从扩展中贡献技能](https://code.visualstudio.com/docs/agent-customization/agent-skills#contribute-skills-from-extensions)。

## contributes.colors

贡献新的可主题化颜色。插件可以在编辑器装饰器和状态栏中使用这些颜色。定义后，用户可以在 `workspace.colorCustomization` 设置中自定义颜色，用户主题也可以设置颜色值。

```json
{
  "contributes": {
    "colors": [
      {
        "id": "superstatus.error",
        "description": "Color for error message in the status bar.",
        "defaults": {
          "dark": "errorForeground",
          "light": "errorForeground",
          "highContrast": "#010203",
          "highContrastLight": "#feedc3",
        }
      }
    ]
  }
}
```

可以为浅色、深色和高对比度主题定义颜色默认值，它们既可以是现有颜色的引用，也可以是[颜色十六进制值](/references/theme-color#color-formats)。

插件可以通过 `ThemeColor` API 使用新的和现有的主题颜色：

```ts
const errorColor = new vscode.ThemeColor("superstatus.error");
```

## contributes.commands

为命令贡献 UI，由标题以及（可选的）图标、类别和启用状态组成。启用状态通过 [when 子句](/references/when-clause-contexts) 表达。默认情况下，命令显示在**命令面板**（`kb(workbench.action.showCommands)`）中，但它们也可以显示在其他[菜单](/references/contribution-points#contributes.menus)中。

所贡献命令的呈现方式取决于其所在的菜单。例如，**命令面板**会为命令添加 `category` 前缀，便于分组。然而，**命令面板**不显示图标，也不显示禁用的命令。另一方面，编辑器上下文菜单会显示禁用的项，但不显示类别标签。

> **注意：** 当命令被调用时（通过按键绑定、**命令面板**、任何其他菜单或以编程方式），VS Code 会发出一个激活事件 `onCommand:${command}`。

> **注意：** 当使用[产品图标](/references/icons-in-labels#icon-listing)中的图标时，设置 `light` 和 `dark` 将禁用该图标。
> 正确的语法是 `"icon": "$(book)"`

### 命令示例

```json
{
  "contributes": {
    "commands": [
      {
        "command": "extension.sayHello",
        "title": "Hello World",
        "category": "Hello",
        "icon": {
          "light": "path/to/light/icon.svg",
          "dark": "path/to/dark/icon.svg"
        }
      }
    ]
  }
}
```

有关在 VS Code 插件中使用命令的更多信息，请参阅[命令扩展指南](https://code.visualstudio.com/api/extension-guides/command)。

![命令配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/commands.png)

### 命令图标规范

- `大小：` 图标应为 16x16，带有 1 像素的内边距（图像为 14x14）并居中。
- `颜色：` 图标应使用单一颜色。
- `格式：` 建议图标使用 SVG，不过也接受任何图像文件类型。

![命令图标](https://code.visualstudio.com/assets/api/references/contribution-points/command-icons.png)

## contributes.configuration

贡献将暴露给用户的设置。用户将能够在设置编辑器中设置这些配置选项，或直接编辑 settings.json 文件。

此部分可以是单个对象（表示单个设置类别），也可以是对象数组（表示多个设置类别）。如果有多个设置类别，设置编辑器将在该插件的目录中显示一个子菜单，并使用 title 键作为子菜单条目的名称。

### 配置示例

```json
{
  "contributes": {
    "configuration": {
      "title": "Settings Editor Test Extension",
      "type": "object",
      "properties": {
        "settingsEditorTestExtension.booleanExample": {
          "type": "boolean",
          "default": true,
          "description": "Boolean Example"
        },
        "settingsEditorTestExtension.stringExample": {
          "type": "string",
          "default": "Hello World",
          "description": "String Example"
        }
      }
    }
  }
}
```

![配置扩展点示例](https://code.visualstudio.com/assets/api/references/contribution-points/configuration-2.png)

你可以通过 `vscode.workspace.getConfiguration('myExtension')` 从你的插件中读取这些值。

### 配置架构

你的配置条目既用于在 JSON 编辑器中编辑设置时提供智能提示，也用于定义它们在设置 UI 中的显示方式。

![带编号的设置 UI 截图](https://code.visualstudio.com/assets/api/references/contribution-points/settings-ui.png)

#### title

类别的 `title` 1️⃣️ 即用于该类别的标题。

```json
{
  "configuration": {
    "title": "GitMagic"
  }
}
```

对于包含多个设置类别的插件，如果其中一个类别的 title 与插件的显示名称相同，那么设置 UI 会将该类别视为"默认类别"，忽略该类别的 `order` 字段，并将其设置放置在插件主标题之下。

对于 `title` 和 `displayName` 字段，"Extension"、"Configuration" 和 "Settings" 等词汇是多余的。

- ✔ `"title": "GitMagic"`
- ❌ `"title": "GitMagic Extension"`
- ❌ `"title": "GitMagic Configuration"`
- ❌ `"title": "GitMagic Extension Configuration Settings"`

#### properties

你的 `configuration` 对象中的 `properties` 2️⃣ 将构成一个字典，其中键是设置 ID，值是有关该设置的更多信息。虽然插件可以包含多个设置类别，但插件的每个设置仍必须具有自己唯一的 ID。一个设置 ID 不能是另一个设置 ID 的完整前缀。

没有显式 `order` 字段的属性将按字典序显示在设置 UI 中（**而非**按清单中列出的顺序）。

### 设置标题

在设置 UI 中，将使用多个字段来为每个设置构造显示标题。键中的大写字母用于表示单词分隔。

#### 单类别与默认类别配置的显示标题

如果配置只有一个设置类别，或者某个类别与插件的显示名称相同，那么对于该类别内的设置，设置 UI 将使用设置 ID 和插件的 `name` 字段来确定显示标题。

例如，对于设置 ID `gitMagic.blame.dateFormat` 和插件名称 `authorName.gitMagic`，由于设置 ID 的前缀与插件名称的后缀匹配，设置 ID 中的 `gitMagic` 部分将从显示标题中移除："Blame: **Date Format**"。

#### 多类别配置的显示标题

如果配置有多个设置类别，且某个类别与插件的显示名称不同，那么对于该类别内的设置，设置 UI 将使用设置 ID 和类别的 `id` 字段来确定显示标题。

例如，对于设置 ID `css.completion.completePropertyWithSemicolon` 和类别 ID `css`，由于设置 ID 的前缀与类别 ID 的后缀匹配，`css` 部分将从设置 UI 中移除，生成的设置标题为 "Completion: **Complete Property With Semicolon**"。

### 配置属性架构

配置键使用 [JSON Schema](https://json-schema.org/overview/what-is-jsonschema) 的超集来定义。

#### description / markdownDescription

你的 `description` 3️⃣ 出现在标题之后、输入字段之前，但布尔值除外，此时描述用作复选框的标签。6️⃣

```json
{
  "gitMagic.blame.heatMap.enabled": {
    "description": "Specifies whether to provide a heatmap indicator in the gutter blame annotations"
  }
}
```

如果你使用 `markdownDescription` 而不是 `description`，你的设置描述将在设置 UI 中被解析为 Markdown。

```json
{
  "gitMagic.blame.dateFormat": {
    "markdownDescription": "Specifies how to format absolute dates (e.g. using the `${date}` token) in gutter blame annotations. See the [Moment.js docs](https://momentjs.com/docs/#/displaying/format/) for valid formats"
  }
}
```

对于 `markdownDescription`，若要添加换行或多个段落，请使用字符串 `\n\n` 来分隔段落，而不是仅使用 `\n`。

#### type

类型为 `number` 4️⃣、`string` 5️⃣、`boolean` 6️⃣ 的条目可以直接在设置 UI 中编辑。

```json
{
  "gitMagic.views.pageItemLimit": {
    "type": "number",
    "default": 20,
    "markdownDescription": "Specifies the number of items to show in each page when paginating a view list. Use 0 to specify no limit"
  }
}
```

如果字符串设置在其配置条目上设置了 `"editPresentation": "multilineText"`，则可以将其渲染为多行文本输入。

对于 `boolean` 条目，`markdownDescription`（若未指定 `markdownDescription`，则为 `description`）将用作复选框旁边的标签。

```json
{
  "gitMagic.blame.compact": {
    "type": "boolean",
    "description": "Specifies whether to compact (deduplicate) matching adjacent gutter blame annotations"
  }
}
```

某些 `object` 和 `array` 类型的设置将渲染在设置 UI 中。由 `number`、`string` 或 `boolean` 组成的简单数组将渲染为可编辑列表。具有 `string`、`number`、`integer` 和/或 `boolean` 类型属性的对象将渲染为可编辑的键值网格。对象设置还应将 `additionalProperties` 设置为 `false` 或具有适当 `type` 属性的对象，才能在 UI 中渲染。

如果 `object` 或 `array` 类型的设置还可以包含其他类型（如嵌套对象、数组或 null），则该值不会渲染在设置 UI 中，只能通过直接编辑 JSON 来修改。用户会看到指向 **在 settings.json 中编辑** 的链接，如上图所示。8️⃣

#### order

类别以及这些类别中的设置都可以使用整数 `order` 类型属性，它给出相对其他类别和/或设置应如何排序的参考。

如果两个类别都有 `order` 属性，则 order 数值较小的类别排在前面。如果某个类别未指定 `order` 属性，它排在被指定了该属性的类别之后。

如果同一类别中的两个设置都有 `order` 属性，则 order 数值较小的设置排在前面。如果同一类别中的另一个设置未指定 `order` 属性，它排在该类别中被指定了该属性的设置之后。

如果两个类别具有相同的 `order` 属性值，或同一类别中的两个设置具有相同的 `order` 属性值，则它们将在设置 UI 中按递增的字典序排序。

#### enum / enumDescriptions / markdownEnumDescriptions / enumItemLabels

如果你在 `enum` 7️⃣ 属性下提供一组条目，设置 UI 将渲染这些条目的下拉菜单。

你还可以提供 `enumDescriptions` 属性，它是一个与 `enum` 属性长度相同的字符串数组。`enumDescriptions` 属性在设置 UI 中为每个 `enum` 条目提供下拉菜单底部对应的描述。\
你也可以使用 `markdownEnumDescriptions` 代替 `enumDescriptions`，你的描述将被解析为 Markdown。`markdownEnumDescriptions` 优先于 `enumDescriptions`。\
要自定义设置 UI 中的下拉选项名称，可以使用 `enumItemLabels`。

示例：

```json
{
  "settingsEditorTestExtension.enumSetting": {
    "type": "string",
    "enum": ["first", "second", "third"],
    "markdownEnumDescriptions": ["The *first* enum", "The *second* enum", "The *third* enum"],
    "enumItemLabels": ["1st", "2nd", "3rd"],
    "default": "first",
    "description": "Example setting with an enum"
  }
}
```

![上方示例枚举设置的设置 UI 截图](https://code.visualstudio.com/assets/api/references/contribution-points/settings-ui-enum-example.png)

#### deprecationMessage / markdownDeprecationMessage

如果你设置了 `deprecationMessage` 或 `markdownDeprecationMessage`，该设置将获得一条带有你指定消息的警告下划线。此外，除非用户配置了该设置，否则它将从设置 UI 中隐藏。如果你设置了 `markdownDeprecationMessage`，该 Markdown 不会在设置悬停提示或问题视图中渲染。如果你同时设置了这两个属性，`deprecationMessage` 将显示在悬停提示和问题视图中，而 `markdownDeprecationMessage` 将以 Markdown 形式渲染在设置 UI 中。

示例：

```json
{
  "json.colorDecorators.enable": {
    "type": "boolean",
    "description": "Enables or disables color decorators",
    "markdownDeprecationMessage": "**Deprecated**: Please use `#editor.colorDecorators#` instead.",
    "deprecationMessage": "Deprecated: Please use editor.colorDecorators instead."
  }
}
```

#### 其他 JSON Schema 属性

你可以使用任何验证性的 JSON Schema 属性来描述配置值的其他约束：

- `default` 用于定义属性的默认值
- `minimum` 和 `maximum` 用于限制数值
- `maxLength`、`minLength` 用于限制字符串长度
- `pattern` 用于将字符串限制为给定的正则表达式
- `patternErrorMessage` 用于在模式不匹配时给出定制化的错误消息
- `format` 用于将字符串限制为已知格式，例如 `date`、`time`、`ipv4`、`email` 和 `uri`
- `maxItems`、`minItems` 用于限制数组长度
- `editPresentation` 用于控制设置编辑器中该字符串设置渲染为单行输入框还是多行文本域

#### 不支持的 JSON Schema 属性

配置部分不支持以下内容：

- `$ref` 和 `definition`：配置架构需要自包含，不能假设聚合后的设置 JSON 架构文档是什么样子。

有关这些功能和其他功能的更多详细信息，请参阅 [JSON Schema 参考](https://json-schema.org/overview/what-is-jsonschema)。

#### scope

配置设置可以具有以下可能的作用域之一：

- `application` - 应用于 VS Code 所有实例的设置，只能在用户设置中配置。
- `machine` - 特定于机器的设置，只能设置在用户设置或仅远程设置中。例如，不应跨机器共享的安装路径。这些设置的值不会被同步。
- `machine-overridable` - 特定于机器的设置，可以被工作区或文件夹设置覆盖。这些设置的值不会被同步。
- `window` - 特定于窗口（实例）的设置，可以在用户、工作区或远程设置中配置。
- `resource` - 资源设置，应用于文件和文件夹，可以在所有设置级别配置，甚至包括文件夹设置。
- `language-overridable` - 可以在语言级别覆盖的资源设置。

配置作用域决定设置何时通过设置编辑器对用户可用，以及该设置是否适用。如果未声明 `scope`，默认值为 `window`。

Below are example configuration scopes from the built-in Git extension:

```json
{
  "contributes": {
    "configuration": {
      "title": "Git",
      "properties": {
        "git.alwaysSignOff": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%config.alwaysSignOff%"
        },
        "git.ignoredRepositories": {
          "type": "array",
          "default": [],
          "scope": "window",
          "description": "%config.ignoredRepositories%"
        },
        "git.autofetch": {
          "type": [
            "boolean",
            "string"
          ],
          "enum": [
            true,
            false,
            "all"
          ],
          "scope": "resource",
          "markdownDescription": "%config.autofetch%",
          "default": false,
          "tags": [
            "usesOnlineServices"
          ]
        }
      }
    }
  }
}
```

你可以看到 `git.alwaysSignOff` 具有 `resource` 作用域，可以按用户、工作区或文件夹设置，而忽略的仓库列表使用 `window` 作用域，更全局地应用于 VS Code 窗口或工作区（可能是多根工作区）。

#### ignoreSync

你可以将 `ignoreSync` 设置为 `true`，以防止该设置与用户的设置同步。这对于不特定于用户的设置很有用。例如，`remoteTunnelAccess.machineName` 设置不特定于用户，不应同步。请注意，如果你已将 `scope` 设置为 `machine` 或 `machine-overridable`，则无论 `ignoreSync` 的值如何，该设置都不会被同步。

```json
{
  "contributes": {
    "configuration": {
      "properties": {
        "remoteTunnelAccess.machineName": {
          "type": "string",
          "default": "",
          "ignoreSync": true
        }
      }
    }
  }
}
```

#### 链接到设置

你可以在 markdown 类型的属性中使用这种特殊语法：``` `#target.setting.id#` ``` 插入指向另一个设置的链接，该链接将在设置 UI 中渲染为可点击的链接。这适用于 `markdownDescription`、`markdownEnumDescriptions` 和 `markdownDeprecationMessage`。示例：

```json
  "files.autoSaveDelay": {
    "markdownDescription": "Controls the delay in ms after which a dirty editor is saved automatically. Only applies when `#files.autoSave#` is set to `afterDelay`.",
    // ...
  }
```

在设置 UI 中，它渲染为：

![设置链接示例](https://code.visualstudio.com/assets/api/references/contribution-points/setting-link.png)

## contributes.configurationDefaults

为其他已注册的配置贡献默认值并覆盖它们的默认值。

以下示例将 `files.autoSave` 设置的默认行为覆盖为在焦点变化时自动保存文件。

```json
"configurationDefaults": {
      "files.autoSave": "onFocusChange"
}
```

你还可以为给定的语言贡献默认的编辑器配置。例如，以下代码片段为 `markdown` 语言贡献默认的编辑器配置：

```json
{
  "contributes": {
    "configurationDefaults": {
      "[markdown]": {
        "editor.wordWrap": "on",
        "editor.quickSuggestions": {
                "comments": "off",
                "strings": "off",
                "other": "off"
        }
      }
    }
  }
}
```

## contributes.customEditors

`customEditors` 配置点是你的插件告诉 VS Code 它所提供的自定义编辑器的方式。例如，VS Code 需要知道你的自定义编辑器处理哪些类型的文件，以及在 UI 中如何标识你的自定义编辑器。

以下是针对[自定义编辑器扩展示例](https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample)的基本 `customEditor` 配置：

```json
"contributes": {
  "customEditors": [
    {
      "viewType": "catEdit.catScratch",
      "displayName": "Cat Scratch",
      "selector": [
        {
          "filenamePattern": "*.cscratch"
        }
      ],
      "priority": "default"
    }
  ]
}
```

`customEditors` 是一个数组，因此你的插件可以贡献多个自定义编辑器。

- `viewType` - 你的自定义编辑器的唯一标识符。

    这是 VS Code 将 `package.json` 中的自定义编辑器配置与代码中的自定义编辑器实现关联起来的方式。它必须在所有插件中保持唯一，因此不要使用诸如 `"preview"` 这样的通用 `viewType`，务必使用对你的插件唯一的 `viewType`，例如 `"viewType": "myAmazingExtension.svgPreview"`。

- `displayName` - 在 VS Code UI 中标识自定义编辑器的名称。

    显示名称会显示在 **视图：重新打开方式（View: Reopen with）** 下拉列表等 VS Code UI 中。

- `selector` - 指定自定义编辑器对哪些文件生效。

    `selector` 是一个或多个 [glob 模式](https://code.visualstudio.com/docs/editor/glob-patterns) 的数组。这些 glob 模式会与文件名进行匹配，以确定自定义编辑器是否可用于这些文件。诸如 `*.png` 这样的 `filenamePattern` 将为所有 PNG 文件启用自定义编辑器。

    你还可以创建更具体的模式来匹配文件名或目录名，例如 `**/translations/*.json`。

- `priority` -（可选）指定何时使用自定义编辑器。

    `priority` 控制在打开资源时何时使用自定义编辑器。可能的值有：

  - `"default"` - 尝试为每个与自定义编辑器 `selector` 匹配的文件使用自定义编辑器。如果给定文件有多个自定义编辑器，用户必须选择要使用哪一个。
  - `"option"` - 默认不使用自定义编辑器，但允许用户切换到它或将其配置为默认。

你可以在[自定义编辑器](/extension-guides/custom-editors)扩展指南中了解更多信息。

## contributes.debuggers

为 VS Code 贡献一个调试器。调试器配置具有以下属性：

- `type` 是在启动配置中用于标识此调试器的唯一 ID。
- `label` 是此调试器在 UI 中对用户可见的名称。
- `program` 是实现 VS Code 调试协议并针对真实调试器或运行时运行的调试适配器的路径。
- `runtime` 如果调试适配器的路径不是可执行文件，而是需要运行时。
- `configurationAttributes` 是特定于此调试器的启动配置参数架构。请注意，不支持 JSON schema 的 `$ref` 和 `definition` 结构。
- `initialConfigurations` 列出用于填充初始 launch.json 的启动配置。
- `configurationSnippets` 列出在编辑 launch.json 时可通过 IntelliSense 获得的启动配置。
- `variables` 引入替换变量，并将它们绑定到由调试器插件实现的命令。
- `languages` 可以将调试插件视为"默认调试器"的语言。

### 调试器示例

```json
{
  "contributes": {
    "debuggers": [
      {
        "type": "node",
        "label": "Node Debug",

        "program": "./out/node/nodeDebug.js",
        "runtime": "node",

        "languages": ["javascript", "typescript", "javascriptreact", "typescriptreact"],

        "configurationAttributes": {
          "launch": {
            "required": ["program"],
            "properties": {
              "program": {
                "type": "string",
                "description": "The program to debug."
              }
            }
          }
        },

        "initialConfigurations": [
          {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/app.js"
          }
        ],

        "configurationSnippets": [
          {
            "label": "Node.js: Attach Configuration",
            "description": "A new configuration for attaching to a running node program.",
            "body": {
              "type": "node",
              "request": "attach",
              "name": "${2:Attach to Port}",
              "port": 9229
            }
          }
        ],

        "variables": {
          "PickProcess": "extension.node-debug.pickNodeProcess"
        }
      }
    ]
  }
}
```

有关如何集成 `debugger` 的完整演练，请参阅[调试器扩展](/extension-guides/debugger-extension)。

## contributes.grammars

为语言贡献一个 TextMate 语法。你必须提供此语法适用的 `language`、该语法的 TextMate `scopeName` 以及文件路径。

> **注意：** 包含语法的文件可以是 JSON 格式（以 .json 结尾的文件名）或 XML plist 格式（所有其他文件）。

### 语法示例

```json
{
  "contributes": {
    "grammars": [
      {
        "language": "markdown",
        "scopeName": "text.html.markdown",
        "path": "./syntaxes/markdown.tmLanguage.json",
        "embeddedLanguages": {
          "meta.embedded.block.frontmatter": "yaml"
        }
      }
    ]
  }
}
```

有关如何注册与语言关联的 TextMate 语法以获得语法高亮的更多信息，请参阅[语法高亮指南](/language-extensions/syntax-highlight-guide)。

![语法配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/grammars.png)

## contributes.icons

按 ID 贡献一个新的图标，并附带一个默认图标。之后，该图标 ID 可在任何可以使用 `ThemeIcon` 的地方（`new ThemeIcon("iconId")`）、在 [Markdown 字符串](/references/icons-in-labels#icon-in-labels)（`$(iconId)`）中以及在某些配置点中作为图标使用，可供插件（或任何依赖该插件的其他插件）使用。

```json
{
  "contributes": {
    "icons": {
      "distro-ubuntu": {
        "description": "Ubuntu icon",
        "default": {
          "fontPath": "./distroicons.woff",
          "fontCharacter": "\\E001"
        }
      },
      "distro-fedora": {
        "description": "Ubuntu icon",
        "default": {
          "fontPath": "./distroicons.woff",
          "fontCharacter": "\\E002"
        }
      }
    }
  }
}
```

## contributes.iconThemes

为 VS Code 贡献一个文件图标主题。文件图标显示在文件名旁边，表示文件类型。

你必须指定一个 id（在设置中使用）、一个 label 以及文件图标定义文件的路径。

### 文件图标主题示例

```json
{
  "contributes": {
    "iconThemes": [
      {
        "id": "my-cool-file-icons",
        "label": "Cool File Icons",
        "path": "./fileicons/cool-file-icon-theme.json"
      }
    ]
  }
}
```

![文件图标主题配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/file-icon-themes.png)

有关如何创建文件图标主题，请参阅[文件图标主题指南](/extension-guides/file-icon-theme)。

## contributes.jsonValidation

为特定类型的 `json` 文件贡献一个验证架构。`url` 值可以是插件中包含的架构文件的本地路径，也可以是远程服务器 URL，例如 [json schema store](https://www.schemastore.org/)。

```json
{
  "contributes": {
    "jsonValidation": [
      {
        "fileMatch": ".jshintrc",
        "url": "https://json.schemastore.org/jshintrc"
      }
    ]
  }
}
```

## contributes.keybindings

贡献一个按键绑定规则，定义用户按下按键组合时应调用哪个命令。请参阅[按键绑定](https://code.visualstudio.com/docs/configure/keybindings)主题，其中详细解释了按键绑定。

贡献按键绑定将导致默认键盘快捷方式显示你的规则，并且命令的每个 UI 表示都会显示你添加的按键绑定。当然，当用户按下按键组合时，命令将被调用。

> **注意：** 由于 VS Code 在 Windows、macOS 和 Linux 上运行，而修饰键各不相同，你可以使用 "key" 设置默认按键组合，并用特定平台覆盖它。

> **注意：** 当命令被调用时（通过按键绑定或命令面板），VS Code 会发出一个激活事件 `onCommand:${command}`。

### 按键绑定示例

定义 `kbstyle(Ctrl+F1)` 在 Windows 和 Linux 下、`kbstyle(Cmd+F1)` 在 macOS 下触发 `"extension.sayHello"` 命令：

```json
{
  "contributes": {
    "keybindings": [
      {
        "command": "extension.sayHello",
        "key": "ctrl+f1",
        "mac": "cmd+f1",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

![按键绑定配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/keybindings.png)

## contributes.languages

贡献一种编程语言的定义。这将引入一种新语言，或丰富 VS Code 对某种语言的了解。

`contributes.languages` 的主要作用：

- 定义一个可以在 VS Code API 的其他部分复用的 `languageId`，例如 `vscode.TextDocument.languageId` 和 `onLanguage` 激活事件。
  - 你可以使用 `aliases` 字段贡献一个人类可读的名称。列表中的第一项将用作人类可读的标签。
- 将文件扩展名（`extensions`）、文件名（`filenames`）、文件名 [glob 模式](https://code.visualstudio.com/docs/editor/glob-patterns)（`filenamePatterns`）、以特定行开头（如 hashbang）的文件（`firstLine`）以及 `mimetypes` 关联到该 `languageId`。
- 为所贡献的语言贡献一组[声明式语言功能](/language-extensions/overview#declarative-language-features)。在[语言配置指南](/language-extensions/language-configuration-guide)中了解更多可配置的编辑功能。
- 贡献一个图标，如果主题不包含该语言的图标，该图标可以在文件图标主题中使用

### language example

```json
{
  "contributes": {
    "languages": [
      {
        "id": "python",
        "extensions": [".py"],
        "aliases": ["Python", "py"],
        "filenames": [],
        "firstLine": "^#!/.*\\bpython[0-9.-]*\\b",
        "configuration": "./language-configuration.json",
        "icon": {
          "light": "./icons/python-light.png",
          "dark": "./icons/python-dark.png"
        }
      }
    ]
  }
}
```

## contributes.languageModelChatProviders

为 VS Code 贡献一个语言模型聊天提供程序，使插件能够提供用户可以在模型选择器中选定的自定义语言模型。每个提供程序管理自己的一组模型，并代表它们处理聊天请求。

每个提供程序注册一个条目，并为其指定唯一的 `vendor` ID。然后在插件激活时使用 `vscode.lm.registerLanguageModelChatProvider` 来接线具体实现。

```json
{
  "contributes": {
    "languageModelChatProviders": [
      {
        "vendor": "my-provider",
        "displayName": "My Provider"
      }
    ]
  }
}
```

要让用户配置该提供程序（例如输入 API 密钥），请添加 `configuration` 架构。使用 `"secret": true` 标记敏感字段，以便安全地存储它们：


### languageModelChatProviders 属性

| 属性                | 类型     | 是否必填 | 描述                                                                                                                                |
| ------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `vendor`            | `string` | 是       | 提供程序的唯一标识符，用作 `vscode.lm.registerLanguageModelChatProvider` 的第一个参数。                                             |
| `displayName`       | `string` | 是       | 显示在模型选择器 UI 中的人类可读名称。                                                                                              |
| `configuration`     | `object` | 否       | 描述提供程序配置选项（例如 API 密钥）的 JSON 架构。属性可以用 `"secret": true` 标记以便安全存储。这是让用户配置提供程序的推荐方式。 |
| `managementCommand` | `string` | 否       | _已弃用。请改用 `configuration`。_ 打开用于管理此提供程序的 UI 的命令 ID。必须在 `contributes.commands` 中声明。                    |
| `when`              | `string` | 否       | 一个 [when 子句](/references/when-clause-contexts)，控制此提供程序是否出现在"管理模型"列表中。                                      |

有关完整的实现细节，请参阅[语言模型聊天提供程序 API 指南](/extension-guides/ai/language-model-chat-provider)。

## contributes.languageModelTools

贡献语言模型可以在代理式编码工作流中自动调用的[语言模型工具](/extension-guides/ai/tools)。工具以领域特定的能力扩展代理模式，例如查询数据库、调用外部 API 或与编辑器交互。

在 `contributes.languageModelTools` 部分定义每个工具，然后在插件激活时使用 `vscode.lm.registerTool` 注册实现。

```json
{
  "contributes": {
    "languageModelTools": [
      {
        "name": "my-extension_queryDatabase",
        "displayName": "Query Database",
        "modelDescription": "Executes a read-only SQL query against the project database and returns the results as JSON. Use this tool when the user asks about data stored in the database.",
        "canBeReferencedInPrompt": true,
        "toolReferenceName": "queryDatabase",
        "icon": "$(database)",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The SQL SELECT statement to execute."
            }
          },
          "required": ["query"]
        }
      }
    ]
  }
}
```

### languageModelTools 属性

| 属性                      | 类型       | 是否必填 | 描述                                                                                                                          |
| ------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `name`                    | `string`   | 是       | 在插件实现中使用的工具唯一名称。请使用 `{verb}_{noun}` 格式并加上插件名称前缀以避免冲突。                                     |
| `displayName`             | `string`   | 是       | 显示在 UI 中的用户友好名称。                                                                                                  |
| `modelDescription`        | `string`   | 是       | 语言模型用来决定何时以及如何调用该工具的说明。请务必精确：说明该工具做什么、返回什么，以及何时应该或不应该使用它。            |
| `userDescription`         | `string`   | 否       | 显示在 UI 中工具名称旁边的面向用户的说明。                                                                                    |
| `canBeReferencedInPrompt` | `boolean`  | 否       | 设置为 `true` 可允许代理使用该工具或在聊天提示中通过 `#` 引用它。为 `true` 时，用户可以在聊天视图中启用或禁用该工具。         |
| `toolReferenceName`       | `string`   | 否       | 用户在聊天提示中于 `#` 后输入的用于引用该工具的名称（例如 `#queryDatabase`）。当 `canBeReferencedInPrompt` 为 `true` 时必填。 |
| `icon`                    | `string`   | 否       | 显示在 UI 中的图标，使用 [图标 ID](/references/icons-in-labels) 格式（例如 `$(database)`）。                                  |
| `inputSchema`             | `object`   | 否       | 描述工具输入参数的 JSON Schema。该架构必须描述一个带有类型化属性的 `object`。                                                 |
| `when`                    | `string`   | 否       | 一个 [when 子句](/references/when-clause-contexts)，控制工具何时可用。例如，使用 `"debugState == 'running'"` 限制调试工具。   |
| `tags`                    | `string[]` | 否       | 用于对工具进行分类或分组的标签。                                                                                              |

有关实现细节（包括如何处理确认、流式返回结果以及定义类型化输入参数），请参阅[语言模型工具 API 指南](/extension-guides/ai/tools)。

## contributes.menus

为编辑器或资源管理器（Explorer）贡献命令的菜单项。菜单项定义包含选中时应调用的命令以及该项应显示的条件。后者使用 `when` 子句定义，该子句使用按键绑定 [when 子句上下文](/references/when-clause-contexts)。

`command` 属性指示选中菜单项时要运行哪个命令。`submenu` 属性指示在此位置渲染哪个子菜单。

当声明 `command` 菜单项时，还可以使用 `alt` 属性定义一个替代命令。当打开菜单时按下 `kbstyle(Alt)` 将显示并调用该替代命令。在 Windows 和 Linux 上，`kbstyle(Shift)` 也有此作用，这在 `kbstyle(Alt)` 会触发窗口菜单栏的情况下很有用。

最后，`group` 属性定义菜单项的排序和分组。`navigation` 组比较特殊，因为它总是排在菜单的顶部/开头。

> **注意** `when` 子句适用于菜单，而 `enablement` 子句适用于命令。`enablement` 适用于所有菜单甚至按键绑定，而 `when` 仅适用于单个菜单。

目前，插件作者可以贡献到：

- `commandPalette` - 全局命令面板
- `comments/comment/title` - 评论标题菜单栏
- `comments/comment/context` - 评论上下文菜单
- `comments/commentThread/title` - 评论线程标题菜单栏
- `comments/commentThread/context` - 评论线程上下文菜单
- `debug/callstack/context` - 调试调用堆栈视图上下文菜单
- `debug/callstack/context` 组 `inline` - 调试调用堆栈视图内联操作
- `debug/toolBar` - 调试视图工具栏
- `debug/variables/context` - 调试变量视图上下文菜单
- `editor/context` - 编辑器上下文菜单
- `editor/lineNumber/context` - 编辑器行号上下文菜单
- `editor/title` - 编辑器标题菜单栏
- `editor/title/context` - 编辑器标题上下文菜单
- `editor/title/run` - 编辑器标题菜单栏上的运行子菜单
- `explorer/context` - 资源管理器视图上下文菜单
- `extension/context` - 扩展视图上下文菜单
- `file/newFile` - "文件"菜单和欢迎页面中的"新建文件"项
- `interactive/toolbar` - 交互窗口工具栏
- `interactive/cell/title` - 交互窗口单元格标题菜单栏
- `notebook/toolbar` - 笔记本工具栏
- `notebook/cell/title` - 笔记本单元格标题菜单栏
- `notebook/cell/execute` - 笔记本单元格执行菜单
- `scm/title` - [SCM 标题菜单](/extension-guides/scm-provider#menus)
- `scm/resourceGroup/context` - [SCM 资源组](/extension-guides/scm-provider#menus)菜单
- `scm/resourceFolder/context` - [SCM 资源文件夹](/extension-guides/scm-provider#menus)菜单
- `scm/resourceState/context` - [SCM 资源](/extension-guides/scm-provider#menus)菜单
- `scm/change/title` - [SCM 变更标题](/extension-guides/scm-provider#menus)菜单
- `scm/repository` - [SCM 仓库菜单](/extension-guides/scm-provider#menus)
- `scm/sourceControl` - [SCM 源代码管理菜单](/extension-guides/scm-provider#menus)
- `terminal/context` - 终端上下文菜单
- `terminal/title/context` - 终端标题上下文菜单
- `testing/item/context` - 测试资源管理器项上下文菜单
- `testing/item/gutter` - 测试项的装订线装饰菜单
- `timeline/title` - 时间线视图标题菜单栏
- `timeline/item/context` - 时间线视图项上下文菜单
- `touchBar` - macOS 触控栏
- `view/title` - [视图标题菜单](/references/contribution-points#contributes.views)
- `view/item/context` - [视图项上下文菜单](/references/contribution-points#contributes.views)
- `webview/context` - 任意 [webview](/extension-guides/webview) 上下文菜单
- 任意[贡献的子菜单](/references/contribution-points#contributes.submenus)

> **注意 1：** 当命令从（上下文）菜单调用时，VS Code 会尝试推断当前选定的资源，并在调用命令时将其作为参数传递。例如，资源管理器中的菜单项会传入所选资源的 URI，编辑器中的菜单项会传入文档的 URI。

> **注意 2：** 贡献到 `editor/lineNumber/context` 的菜单项命令还会传入行号。此外，这些项可以在其 `when` 子句中引用 `editorLineNumber` 上下文键，例如使用 `in` 或 `not in` 运算符，针对由插件管理的数组值上下文键进行测试。

除了标题之外，所贡献的命令还可以指定图标，当调用菜单项以按钮形式表示时（例如在标题菜单栏上），VS Code 将显示该图标。

### 菜单示例

这是一个命令菜单项：

```json
{
  "contributes": {
    "menus": {
      "editor/title": [
        {
          "when": "resourceLangId == markdown",
          "command": "markdown.showPreview",
          "alt": "markdown.showPreviewToSide",
          "group": "navigation"
        }
      ]
    }
  }
}
```

![菜单配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/menus.png)

类似地，这里有一个添加到特定视图的命令菜单项。下面的示例贡献到类似终端这样的任意视图：

```json
{
  "contributes": {
    "menus": {
      "view/title": [
        {
          "command": "terminalApi.sendText",
          "when": "view == terminal",
          "group": "navigation"
        }
      ]
    }
  }
}
```

![向 view/title 添加菜单项，并带有 view == terminal 条件，将在终端打开时在面板中显示一个操作](https://code.visualstudio.com/assets/api/references/contribution-points/menu_view_title.png)

这是一个子菜单菜单项：

```json
{
  "contributes": {
    "menus": {
      "scm/title": [
        {
          "submenu": "git.commit",
          "group": "2_main@1",
          "when": "scmProvider == git"
        }
      ]
    }
  }
}
```

![菜单配置点示例（子菜单）](https://code.visualstudio.com/assets/api/references/contribution-points/submenu.png)

### 命令面板菜单项的上下文相关可见性

当在 `package.json` 中注册命令时，它们将自动显示在**命令面板**（`kb(workbench.action.showCommands)`）中。为了对命令可见性进行更多控制，存在 `commandPalette` 菜单项。它允许你定义 `when` 条件，控制命令是否应在**命令面板**中可见。

下面的代码片段使 'Hello World' 命令仅在编辑器中有选中内容时才在**命令面板**中可见：

```json
{
  "commands": [
    {
      "command": "extension.sayHello",
      "title": "Hello World"
    }
  ],
  "menus": {
    "commandPalette": [
      {
        "command": "extension.sayHello",
        "when": "editorHasSelection"
      }
    ]
  }
}
```

### 组排序

菜单项可以排序到组中。它们按字典序排序，遵循以下默认值/规则。
你可以向这些组添加菜单项，也可以在它们之间、之下或之上添加新的菜单项组。

**编辑器上下文菜单**具有以下默认组：

- `navigation` - `navigation` 组在所有情况下都排在第一位。
- `1_modification` - 该组排在后面，包含修改代码的命令。
- `9_cutcopypaste` - 倒数第二个默认组，包含基本编辑命令。
- `z_commands` - 最后一个默认组，包含打开命令面板的条目。

![菜单组排序](https://code.visualstudio.com/assets/api/references/contribution-points/groupSorting.png)

**资源管理器上下文菜单**具有以下默认组：

- `navigation` - 与跨 VS Code 导航相关的命令。该组在所有情况下都排在第一位。
- `2_workspace` - 与工作区操作相关的命令。
- `3_compare` - 与在差异编辑器中比较文件相关的命令。
- `4_search` - 与在搜索视图中搜索相关的命令。
- `5_cutcopypaste` - 与剪切、复制和粘贴文件相关的命令。
- `6_copypath` - 与复制文件路径相关的命令。
- `7_modification` - 与文件修改相关的命令。

**编辑器标签页上下文菜单**具有以下默认组：

- `1_close` - 与关闭编辑器相关的命令。
- `3_preview` - 与固定编辑器相关的命令。

**编辑器标题菜单**具有以下默认组：

- `navigation` - 与导航相关的命令。
- `1_run` - 与运行和调试编辑器相关的命令。
- `1_diff` - 与处理差异编辑器相关的命令。
- `3_open` - 与打开编辑器相关的命令。
- `5_close` - 与关闭编辑器相关的命令。

`navigation` 和 `1_run` 显示在编辑器标题主区域中。其他组显示在次要区域 - 即 `...` 菜单下。

**终端标签页上下文菜单**具有以下默认组：

- `1_create` - 与创建终端相关的命令。
- `3_run` - 与在终端中运行/执行某项内容相关的命令。
- `5_manage` - 与管理终端相关的命令。
- `7_configure` - 与终端配置相关的命令。

**终端上下文菜单**具有以下默认组：

- `1_create` - 与创建终端相关的命令。
- `3_edit` - 与操作文本、选区或剪贴板相关的命令。
- `5_clear` - 与清除终端相关的命令。
- `7_kill` - 与关闭/终止终端相关的命令。
- `9_config` - 与终端配置相关的命令。

**时间线视图项上下文菜单**具有以下默认组：

- `inline` - 重要或常用的时间线项命令。以工具栏形式渲染。
- `1_actions` - 与处理时间线项相关的命令。
- `5_copy` - 与复制时间线项信息相关的命令。

**扩展视图上下文菜单**具有以下默认组：

- `1_copy` - 与复制扩展信息相关的命令。
- `2_configure` - 与配置扩展相关的命令。

### 组内排序

组内的顺序取决于标题或 order 属性。菜单项的组内顺序通过向组标识符追加 `@<number>` 来指定，如下所示：

```json
{
  "editor/title": [
    {
      "when": "editorHasSelection",
      "command": "extension.Command",
      "group": "myGroup@1"
    }
  ]
}
```

## contributes.problemMatchers

贡献问题匹配器（problem matcher）模式。这些配置既可在输出面板运行器中工作，也可在终端运行器中工作。下面是一个在插件中为 gcc 编译器贡献问题匹配器的示例：

```json
{
  "contributes": {
    "problemMatchers": [
      {
        "name": "gcc",
        "owner": "cpp",
        "fileLocation": ["relative", "${workspaceFolder}"],
        "pattern": {
          "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error):\\s+(.*)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "severity": 4,
          "message": 5
        }
      }
    ]
  }
}
```

现在可以通过名称引用 `$gcc` 在 `tasks.json` 文件中使用此问题匹配器。示例如下：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "command": "gcc",
      "args": ["-Wall", "helloWorld.c", "-o", "helloWorld"],
      "problemMatcher": "$gcc"
    }
  ]
}
```

另请参阅：[定义问题匹配器](https://code.visualstudio.com/docs/debugtest/tasks#defining-a-problem-matcher)

## contributes.problemPatterns

贡献可在问题匹配器（见上文）中使用的命名问题模式。

## contributes.productIconThemes

为 VS Code 贡献一个产品图标主题。产品图标是 VS Code 中除文件图标和扩展贡献的图标之外使用的所有图标。

你必须指定一个 id（在设置中使用）、一个 label 以及图标定义文件的路径。

### 产品图标主题示例

```json
{
  "contributes": {
    "productIconThemes": [
      {
        "id": "elegant",
        "label": "Elegant Icon Theme",
        "path": "./producticons/elegant-product-icon-theme.json"
      }
    ]
  }
}
```

![产品图标主题配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/product-icon-themes.png)

有关如何创建产品图标主题，请参阅[产品图标主题指南](/extension-guides/product-icon-theme)。

## contributes.resourceLabelFormatters

贡献资源标签格式化器，用于指定在工作台中各处如何显示 URI。例如，下面展示了插件如何为 scheme 为 `remotehub` 的 URI 贡献一个格式化器：

```json
{
  "contributes": {
    "resourceLabelFormatters": [
      {
        "scheme": "remotehub",
        "formatting": {
          "label": "${path}",
          "separator": "/",
          "workspaceSuffix": "GitHub"
        }
      }
    ]
  }
}
```

这意味着所有 scheme 为 `remotehub` 的 URI 将仅显示 URI 的 `path` 段来渲染，分隔符为 `/`。具有 `remotehub` URI 的工作区将在其标签中带有 GitHub 后缀。

## contributes.semanticTokenModifiers

贡献可以通过主题规则进行高亮的新语义令牌修饰符。

```json
{
  "contributes": {
    "semanticTokenModifiers": [
      {
        "id": "native",
        "description": "Annotates a symbol that is implemented natively"
      }
    ]
  }
}
```

有关语义高亮的更多信息，请参阅[语义高亮指南](/language-extensions/semantic-highlight-guide)。

## contributes.semanticTokenScopes

贡献语义令牌类型与修饰符和作用域之间的映射，既可作为回退方案，也可用于支持特定于语言的主题。

```json
{
  "contributes": {
    "semanticTokenScopes": [
      {
        "language": "typescript",
        "scopes": {
          "property.readonly": ["variable.other.constant.property.ts"]
        }
      }
    ]
  }
}
```

有关语义高亮的更多信息，请参阅[语义高亮指南](/language-extensions/semantic-highlight-guide)。

## contributes.semanticTokenTypes

贡献可以通过主题规则进行高亮的新语义令牌类型。

```json
{
  "contributes": {
    "semanticTokenTypes": [
      {
        "id": "templateType",
        "superType": "type",
        "description": "A template type."
      }
    ]
  }
}
```

有关语义高亮的更多信息，请参阅[语义高亮指南](/language-extensions/semantic-highlight-guide)。

## contributes.snippets

为特定语言贡献代码片段。`language` 属性是[语言标识符](https://code.visualstudio.com/docs/languages/identifiers)，`path` 是代码片段文件的相对路径，该文件以 [VS Code 代码片段格式](https://code.visualstudio.com/docs/editing/userdefinedsnippets#snippet-syntax) 定义代码片段。

下面的示例展示了为 Go 语言添加代码片段。

```json
{
  "contributes": {
    "snippets": [
      {
        "language": "go",
        "path": "./snippets/go.json"
      }
    ]
  }
}
```

## contributes.submenus

贡献一个子菜单作为占位符，可以向其贡献菜单项。子菜单需要一个 `label` 才能显示在父菜单中。

除了标题之外，命令还可以定义 VS Code 将在编辑器标题菜单栏中显示的图标。

### 子菜单示例

```json
{
  "contributes": {
    "submenus": [
      {
        "id": "git.commit",
        "label": "Commit"
      }
    ]
  }
}
```

![子菜单配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/submenucontrib.png)

## contributes.taskDefinitions

贡献并定义一种对象字面量结构，用于在系统中唯一标识所贡献的任务。任务定义至少具有一个 `type` 属性，但通常还会定义其他属性。例如，表示 package.json 文件中脚本的任务的任务定义如下所示：

```json
{
  "taskDefinitions": [
    {
      "type": "npm",
      "required": ["script"],
      "properties": {
        "script": {
          "type": "string",
          "description": "The script to execute"
        },
        "path": {
          "type": "string",
          "description": "The path to the package.json file. If omitted the package.json in the root of the workspace folder is used."
        }
      }
    }
  ]
}
```

任务定义使用 JSON schema 语法定义 `required` 和 `properties` 属性。`type` 属性定义任务类型。以上面的示例为例：

- `"type": "npm"` 将任务定义与 npm 任务关联起来
- `"required": [ "script" ]` 定义 `script` 属性为必填。`path` 属性是可选的。
- `"properties" : { ... }` 定义其他属性及其类型。

当插件实际创建 Task 时，它需要传递符合 package.json 文件中所贡献任务定义的 `TaskDefinition`。对于 `npm` 示例，为 package.json 文件中的 test 脚本创建任务如下所示：

```ts
let task = new vscode.Task({ type: 'npm', script: 'test' }, ....);
```

## contributes.terminal

为 VS Code 贡献一个终端配置（profile），允许插件处理配置的创建。定义后，该配置应出现在创建终端配置时

```json
{
  "activationEvents": [
    "onTerminalProfile:my-ext.terminal-profile"
  ],
  "contributes": {
    "terminal": {
      "profiles": [
        {
          "title": "Profile from extension",
          "id": "my-ext.terminal-profile"
        }
      ]
    },
  }
}
```

定义后，该配置将显示在终端配置选择器中。激活时，通过返回终端选项来处理配置的创建：

```ts
vscode.window.registerTerminalProfileProvider('my-ext.terminal-profile', {
  provideTerminalProfile(token: vscode.CancellationToken): vscode.ProviderResult<vscode.TerminalOptions | vscode.ExtensionTerminalOptions> {
    return { name: 'Profile from extension', shellPath: 'bash' };
  }
});
```

## contributes.themes

为 VS Code 贡献一个颜色主题，定义工作台颜色以及编辑器中语法令牌的样式。

你必须指定一个 label、该主题是深色主题还是浅色主题（以便 VS Code 的其余部分随之变化以匹配你的主题），以及文件的路径（JSON 格式）。

### 主题示例

```json
{
  "contributes": {
    "themes": [
      {
        "label": "Monokai",
        "uiTheme": "vs-dark",
        "path": "./themes/monokai-color-theme.json"
      }
    ]
  }
}
```

![颜色主题配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/color-themes.png)

有关如何创建颜色主题，请参阅[颜色主题指南](/extension-guides/color-theme)。

## contributes.typescriptServerPlugins

贡献可增强 VS Code 的 JavaScript 和 TypeScript 支持的 [TypeScript 服务器插件](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)：

```json
{
  "contributes": {
    "typescriptServerPlugins": [
      {
        "name": "typescript-styled-plugin"
      }
    ]
  }
}
```

上面的示例插件贡献了 [`typescript-styled-plugin`](https://github.com/microsoft/typescript-styled-plugin)，它为 JavaScript 和 TypeScript 添加了 styled-component 智能提示。该插件将从扩展中加载，并且必须作为普通的 NPM `dependency` 安装在插件中：

```json
{
  "dependencies": {
    "typescript-styled-plugin": "*"
  }
}
```

当用户使用 VS Code 自带的 TypeScript 版本时，会为所有 JavaScript 和 TypeScript 文件加载 TypeScript 服务器插件。如果用户使用的是工作区版本的 TypeScript，则不会激活它们，除非插件显式设置 `"enableForWorkspaceTypeScriptVersions": true`。

```json
{
  "contributes": {
    "typescriptServerPlugins": [
      {
        "name": "typescript-styled-plugin",
        "enableForWorkspaceTypeScriptVersions": true
      }
    ]
  }
}
```

### 插件配置

插件可以通过 VS Code 内置 TypeScript 扩展提供的 API 向所贡献的 TypeScript 插件发送配置数据：

```ts
// In your VS Code extension

export async function activate(context: vscode.ExtensionContext) {
  // Get the TS extension
  const tsExtension = vscode.extensions.getExtension('vscode.typescript-language-features');
  if (!tsExtension) {
    return;
  }

  await tsExtension.activate();

  // Get the API from the TS extension
  if (!tsExtension.exports || !tsExtension.exports.getAPI) {
    return;
  }

  const api = tsExtension.exports.getAPI(0);
  if (!api) {
    return;
  }

  // Configure the 'my-typescript-plugin-id' plugin
  api.configurePlugin('my-typescript-plugin-id', {
    someValue: process.env['SOME_VALUE']
  });
}
```

TypeScript 服务器插件通过 `onConfigurationChanged` 方法接收配置数据：

```ts
// In your TypeScript plugin

import * as ts_module from 'typescript/lib/tsserverlibrary';

export = function init({ typescript }: { typescript: typeof ts_module }) {
  return {
    create(info: ts.server.PluginCreateInfo) {
      // Create new language service
    },
    onConfigurationChanged(config: any) {
      // Receive configuration changes sent from VS Code
    }
  };
};
```

此 API 允许 VS Code 插件将 VS Code 设置与 TypeScript 服务器插件同步，或动态更改插件的行为。查看 [TypeScript TSLint 插件](https://github.com/microsoft/vscode-typescript-tslint-plugin/blob/main/src/index.ts) 和 [lit-html](https://github.com/mjbvz/vscode-lit-html/blob/master/src/index.ts) 插件，了解此 API 在实际中的用法。

## contributes.views

为 VS Code 贡献一个视图。你必须为视图指定标识符和名称。你可以贡献到以下视图容器：

- `explorer`：活动栏中的资源管理器视图容器
- `scm`：活动栏中的源代码管理（SCM）视图容器
- `debug`：活动栏中的运行和调试视图容器
- `test`：活动栏中的测试视图容器
- 由扩展贡献的[自定义视图容器](#contributes.viewsContainers)

当用户打开视图时，VS Code 将发出一个激活事件 `onView:${viewId}`（对于下面的示例为 `onView:nodeDependencies`）。你还可以通过提供 `when` 上下文值来控制视图的可见性。指定的 `icon` 将在无法显示标题时使用（例如，当视图被拖到活动栏时）。当视图移出其默认视图容器并需要额外的上下文时，将使用 `contextualTitle`。

```json
{
  "contributes": {
    "views": {
      "explorer": [
        {
          "id": "nodeDependencies",
          "name": "Node Dependencies",
          "when": "workspaceHasPackageJSON",
          "icon": "media/dep.svg",
          "contextualTitle": "Package Explorer"
        }
      ]
    }
  }
}
```

![视图配置点示例](https://code.visualstudio.com/assets/api/references/contribution-points/views.png)

视图的内容可以通过两种方式填充：

- 使用 [TreeView](https://code.visualstudio.com/api/references/vscode-api#TreeView)，通过 `createTreeView` API 提供[数据提供程序](https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider)，或通过 `registerTreeDataProvider` API 直接注册[数据提供程序](https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider)来填充数据。TreeView 非常适合显示层次化数据和列表。请参阅 [tree-view-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)。
- 使用 [WebviewView](https://code.visualstudio.com/api/references/vscode-api#WebviewView)，通过 `registerWebviewViewProvider` 注册[提供程序](https://code.visualstudio.com/api/references/vscode-api#WebviewViewProvider)。Webview 视图允许在视图中渲染任意 HTML。有关更多详情，请参阅 [webview view 示例插件](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)。

## contributes.viewsContainers

贡献一个视图容器，可以向其中贡献[自定义视图](#contributes.views)。你必须为视图容器指定标识符、标题和图标。目前，你可以将它们贡献到活动栏（`activitybar`）和面板（`panel`）。下面的示例展示了如何将 `Package Explorer` 视图容器贡献到活动栏，以及如何向其贡献视图。

```json
{
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "package-explorer",
          "title": "Package Explorer",
          "icon": "resources/package-explorer.svg"
        }
      ]
    },
    "views": {
      "package-explorer": [
        {
          "id": "package-dependencies",
          "name": "Dependencies"
        },
        {
          "id": "package-outline",
          "name": "Outline"
        }
      ]
    }
  }
}
```

![自定义视图容器](https://code.visualstudio.com/assets/api/references/contribution-points/custom-views-container.png)

### 图标规范

- `大小：` 图标应为 24x24 并居中。
- `颜色：` 图标应使用单一颜色。
- `格式：` 建议图标使用 SVG，不过也接受任何图像文件类型。
- `状态：` 所有图标继承以下状态样式：

  | 状态 | 不透明度 |
  | ---- | -------- |
  | 默认 | 60%      |
  | 悬停 | 100%     |
  | 激活 | 100%     |

## contributes.viewsWelcome

为[自定义视图](#contributes.views)贡献欢迎内容。欢迎内容仅适用于空的树视图。如果树没有子节点且没有 `TreeView.message`，则认为视图为空。按照惯例，任何单独一行上的命令链接都会显示为按钮。你可以使用 `view` 属性指定欢迎内容应应用于哪个视图。欢迎内容的可见性可以通过 `when` 上下文值控制。要显示为欢迎内容的文本通过 `contents` 属性设置。

```json
{
  "contributes": {
    "viewsWelcome": [
      {
        "view": "scm",
        "contents": "In order to use git features, you can open a folder containing a git repository or clone from a URL.\n[Open Folder](command:vscode.openFolder)\n[Clone Repository](command:git.clone)\nTo learn more about how to use git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
        "when": "config.git.enabled && git.state == initialized && workbenchState == empty"
      }
    ]
  }
}
```

![欢迎内容示例](https://code.visualstudio.com/assets/api/references/contribution-points/viewsWelcome.png)

可以向一个视图贡献多个欢迎内容项。此时，来自 VS Code 核心的内容排在前面，然后是来自内置扩展的内容，最后是来自所有其他扩展的内容。

## contributes.walkthroughs

[示例插件](https://github.com/microsoft/vscode-extension-samples/tree/main/getting-started-sample)

贡献显示在"开始"页面上的引导教程（walkthrough）。安装插件时会自动打开引导教程，它们是向用户介绍插件功能的一种便捷方式。

引导教程由标题、描述、id 和一系列步骤组成。此外，可以设置 `when` 条件，根据上下文键隐藏或显示引导教程。例如，用于解释 Linux 平台上设置的引导教程可以设置 `when: "isLinux"`，使其仅在 Linux 机器上出现。

引导教程中的每个步骤都有一个标题、描述、id 和媒体元素（图像或 Markdown 内容），以及一组可选的、会导致该步骤被勾选的事件（如下面的示例所示）。步骤描述是 Markdown 内容，支持 `**粗体**`、`__下划线__` 和 ``` ``代码`` ``` 渲染，也支持链接。与引导教程类似，步骤也可以设置 when 条件，根据上下文键隐藏或显示。

鉴于 SVG 具有缩放能力并支持 VS Code 的主题颜色，建议图像使用 SVG。使用 [Visual Studio Code Color Mapper](https://www.figma.com/community/plugin/1218260433851630449) Figma 插件可以轻松地在 SVG 中引用主题颜色。

```json
{
  "contributes": {
    "walkthroughs": [
      {
        "id": "sample",
        "title": "Sample",
        "description": "A sample walkthrough",
        "steps": [
          {
            "id": "runcommand",
            "title": "Run Command",
            "description": "This step will run a command and check off once it has been run.\n[Run Command](command:getting-started-sample.runCommand)",
            "media": { "image": "media/image.png", "altText": "Empty image" },
            "completionEvents": ["onCommand:getting-started-sample.runCommand"]
          },
          {
            "id": "changesetting",
            "title": "Change Setting",
            "description": "This step will change a setting and check off when the setting has changed\n[Change Setting](command:getting-started-sample.changeSetting)",
            "media": { "markdown": "media/markdown.md" },
            "completionEvents": ["onSettingChanged:getting-started-sample.sampleSetting"]
          }
        ]
      }
    ]
  }
}
```

![引导教程示例](https://code.visualstudio.com/assets/api/references/contribution-points/walkthroughs.png)

### 完成事件

默认情况下，如果未提供 `completionEvents` 事件，则当单击该步骤的任意按钮时，该步骤将被勾选；如果该步骤没有按钮，则在打开时被勾选。如果需要更精细的控制，可以提供 `completionEvents` 列表。

可用的完成事件包括：

- `onCommand:myCommand.id`：当命令已运行时勾选步骤。
- `onSettingChanged:mySetting.id`：一旦给定设置被修改，即勾选步骤。
- `onContext:contextKeyExpression`：当上下文键表达式求值为 true 时勾选步骤。
- `extensionInstalled:myExt.id`：如果给定插件已安装，则勾选步骤。
- `onView:myView.id`：一旦给定视图变为可见，即勾选步骤。
- `onLink:https://...`：一旦通过引导教程打开了给定链接，即勾选步骤。

一旦步骤被勾选，它将保持勾选状态，直到用户显式取消勾选该步骤或重置其进度（通过 **Getting Started: Reset Progress**（开始：重置进度）命令）。
