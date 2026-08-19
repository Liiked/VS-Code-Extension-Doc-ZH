import { defineConfig } from "vitepress";
import { configureTerms } from "./terms";

const base = process.env.DOCS_BASE ?? "/VS-Code-Extension-Doc-ZH/";

const referenceItems = [
  { text: "VS Code API", link: "/references/vscode-api" },
  { text: "配置点", link: "/references/contribution-points" },
  { text: "插件清单", link: "/references/extension-manifest" },
  { text: "激活事件", link: "/references/activation-events" },
  { text: "内置命令", link: "/references/commands" },
  { text: "when 子句上下文", link: "/references/when-clause-contexts" },
  { text: "主题色彩", link: "/references/theme-color" },
  { text: "产品图标参考", link: "/references/icons-in-labels" },
  { text: "文档选择器", link: "/references/document-selector" },
];

export default defineConfig({
  lang: "zh-CN",
  title: "VS Code 插件开发文档",
  description: "VS Code 插件创作中文开发文档",
  base,
  cleanUrls: true,
  rewrites: {
    "api/index.md": "api.md",
    "extension-capabilities/index.md": "extension-capabilities.md",
    "extension-guides/index.md": "extension-guides.md",
    "language-extensions/index.md": "language-extensions.md",
  },
  srcExclude: ["_navbar.md", "_sidebar.md"],
  ignoreDeadLinks: process.env.CHECK_LINKS === "true" ? [/^\.\/index$/] : true,
  markdown: {
    html: true,
    config: configureTerms,
  },
  head: [["link", { rel: "icon", href: `${base}favicon.ico` }]],
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "内容导航",
        items: [
          { text: "预备知识", link: "/preknowledge/first-step" },
          { text: "第一步", link: "/get-started/your-first-extension" },
          { text: "插件功能", link: "/extension-capabilities/" },
          { text: "插件指南", link: "/extension-guides/" },
          { text: "语言插件", link: "/language-extensions/" },
          {
            text: "测试和发布",
            link: "/working-with-extensions/testing-extension",
          },
          { text: "进阶主题", link: "/advanced-topics/extension-host" },
        ],
      },
      { text: "参考", items: referenceItems },
      {
        text: "GitHub",
        link: "https://github.com/Liiked/VS-Code-Extension-Doc-ZH",
      },
    ],
    sidebar: [
      {
        text: "预备知识",
        collapsed: true,
        items: [
          { text: "非 JS 开发者的第一步", link: "/preknowledge/first-step" },
          { text: "变量和类型", link: "/preknowledge/variable-and-type" },
          { text: "类", link: "/preknowledge/class" },
          {
            text: "接口和命名空间",
            link: "/preknowledge/interface-and-namespace",
          },
          { text: "泛型", link: "/preknowledge/generics" },
          { text: "声明文件", link: "/preknowledge/declaration-files" },
        ],
      },
      {
        text: "概述",
        collapsed: true,
        items: [{ text: "扩展性", link: "/api/" }],
      },
      {
        text: "第一步",
        collapsed: true,
        items: [
          { text: "你的第一个插件", link: "/get-started/your-first-extension" },
          { text: "解析插件结构", link: "/get-started/extension-anatomy" },
          { text: "小结", link: "/get-started/wrapping-up" },
        ],
      },
      {
        text: "插件功能",
        collapsed: true,
        items: [
          { text: "概述", link: "/extension-capabilities" },
          {
            text: "常用功能",
            link: "/extension-capabilities/common-capabilities",
          },
          { text: "主题", link: "/extension-capabilities/theming" },
          {
            text: "扩展工作台",
            link: "/extension-capabilities/extending-workbench",
          },
        ],
      },
      {
        text: "插件指南",
        collapsed: true,
        items: [
          { text: "概述", link: "/extension-guides" },
          {
            text: "AI",
            collapsed: true,
            items: [
              {
                text: "概述",
                link: "/extension-guides/ai/ai-extensibility-overview",
              },
              {
                text: "语言模型工具",
                link: "/extension-guides/ai/tools",
              },
              {
                text: "MCP 开发指南",
                link: "/extension-guides/ai/mcp",
              },
              {
                text: "Chat 参与者",
                link: "/extension-guides/ai/chat",
              },
              {
                text: "Chat 指南",
                link: "/extension-guides/ai/chat-tutorial",
              },
              {
                text: "语言模型",
                link: "/extension-guides/ai/language-model",
              },
              {
                text: "语言模型指南",
                link: "/extension-guides/ai/language-model-tutorial",
              },
              {
                text: "语言模型 Chat 供应器",
                link: "/extension-guides/ai/language-model-chat-provider",
              },
              {
                text: "Prompt TSX",
                link: "/extension-guides/ai/prompt-tsx",
              },
            ],
          },
          { text: "命令", link: "/extension-guides/command" },
          { text: "色彩主题", link: "/extension-guides/color-theme" },
          { text: "文件图标主题", link: "/extension-guides/file-icon-theme" },
          {
            text: "产品图标主题",
            link: "/extension-guides/product-icon-theme",
          },
          { text: "树视图", link: "/extension-guides/tree-view" },
          { text: "Webview", link: "/extension-guides/webview" },
          { text: "笔记本", link: "/extension-guides/notebook" },
          { text: "自定义编辑器", link: "/extension-guides/custom-editors" },
          { text: "虚拟文档", link: "/extension-guides/virtual-documents" },
          { text: "虚拟工作区", link: "/extension-guides/virtual-workspaces" },
          { text: "Web 插件", link: "/extension-guides/web-extensions" },
          { text: "工作区信任", link: "/extension-guides/workspace-trust" },
          { text: "任务", link: "/extension-guides/task-provider" },
          { text: "源控制", link: "/extension-guides/scm-provider" },
          { text: "调试器插件", link: "/extension-guides/debugger-extension" },
          {
            text: "Markdown 插件",
            link: "/extension-guides/markdown-extension",
          },
          {
            text: "测试型插件",
            link: "/extension-guides/testing",
          },
          {
            text: "自定义数据插件",
            link: "/extension-guides/custom-data-extension",
          },
          {
            text: "遥测",
            link: "/extension-guides/telemetry",
          },
        ],
      },
      {
        text: "交互指南",
        collapsed: true,
        items: [
          {
            text: "概述",
            link: "/ux-guidelines",
          },
          {
            text: "活动栏",
            link: "/ux-guidelines/activity-bar",
          },
          {
            text: "侧边栏",
            link: "/ux-guidelines/sidebars",
          },
          {
            text: "面板",
            link: "/ux-guidelines/panel",
          },
          {
            text: "状态栏",
            link: "/ux-guidelines/status-bar",
          },
          {
            text: "视图",
            link: "/ux-guidelines/views",
          },
          {
            text: "编辑器操作",
            link: "/ux-guidelines/editor-actions",
          },
          {
            text: "快速选择",
            link: "/ux-guidelines/quick-picks",
          },
          {
            text: "命令面板",
            link: "/ux-guidelines/command-palette",
          },
          {
            text: "通知",
            link: "/ux-guidelines/notifications",
          },
          {
            text: "Webviews",
            link: "/ux-guidelines/webviews",
          },
          {
            text: "上下文菜单",
            link: "/ux-guidelines/context-menus",
          },
          {
            text: "入门向导",
            link: "/ux-guidelines/walkthroughs",
          },
          {
            text: "设置",
            link: "/ux-guidelines/settings",
          },
        ],
      },
      {
        text: "语言插件",
        collapsed: true,
        items: [
          { text: "概述", link: "/language-extensions/" },
          {
            text: "语法高亮",
            link: "/language-extensions/syntax-highlight-guide",
          },
          {
            text: "语义高亮",
            link: "/language-extensions/semantic-highlight-guide",
          },
          { text: "代码片段", link: "/language-extensions/snippet-guide" },
          {
            text: "语言配置",
            link: "/language-extensions/language-configuration-guide",
          },
          {
            text: "编程式语言特性",
            link: "/language-extensions/programmatic-language-features",
          },
          {
            text: "语言服务器",
            link: "/language-extensions/language-server-extension-guide",
          },
          { text: "嵌入语言", link: "/language-extensions/embedded-languages" },
        ],
      },
      {
        text: "测试和发布",
        collapsed: true,
        items: [
          {
            text: "测试插件",
            link: "/working-with-extensions/testing-extension",
          },
          {
            text: "发布插件",
            link: "/working-with-extensions/publish-extension",
          },
          {
            text: "打包插件",
            link: "/working-with-extensions/bundling-extension",
          },
          {
            text: "持续集成",
            link: "/working-with-extensions/continuous-integration",
          },
        ],
      },
      {
        text: "进阶主题",
        collapsed: true,
        items: [
          { text: "插件主机", link: "/advanced-topics/extension-host" },
          { text: "远程开发", link: "/advanced-topics/remote-extensions" },
          {
            text: "使用不稳定的 API",
            link: "/advanced-topics/using-proposed-api",
          },
          {
            text: "从TSLint到ESLint",
            link: "/advanced-topics/tslint-eslint-migration",
          },
          {
            text: "Python 插件模板",
            link: "/advanced-topics/python-extension-template",
          },
        ],
      },
      { text: "参考", collapsed: true, items: referenceItems },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
  },
});
