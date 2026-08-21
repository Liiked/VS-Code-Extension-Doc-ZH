# VS Code 插件开发文档

![Maintenance](https://img.shields.io/maintenance/yes/2026?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/liiked/VS-Code-Extension-Doc-ZH?style=for-the-badge)


欢迎来到为巨硬填坑的中文文档😆
[📚 中文文档（github 版）](https://liiked.github.io/VS-Code-Extension-Doc-ZH/)

[📚 原文档](https://code.visualstudio.com/docs/extensions/overview)

## 本地开发

本项目使用 VitePress 构建文档站点，需要 Node.js 20 或更高版本。

```bash
npm ci
npm run docs:dev
```

执行生产构建：

```bash
npm run docs:build
```

执行包含站内链接检查的构建：

```bash
npm run docs:check-links
```

历史 Docsify 提示块和内部链接的迁移脚本保留在 `scripts/` 中。它们可重复执行：

```bash
npm run docs:migrate-callouts
npm run docs:migrate-links
```

## 部署

推送到 `master` 分支会触发 GitHub Actions，将 `docs/.vitepress/dist` 发布至 GitHub Pages。仓库的 Pages 来源应设置为 **GitHub Actions**。

GitHub Pages 项目页默认使用 `/VS-Code-Extension-Doc-ZH/` 作为站点根路径；其他部署环境可以通过 `DOCS_BASE` 覆盖。

## 评论

Gitalk 是可选功能。将 [docs/.env.example](docs/.env.example) 复制为 `docs/.env.local` 并填写配置，开发服务器或构建才会挂载评论区。Gitalk 的 OAuth 客户端密钥会在浏览器中使用，不能视为保密信息；生产站点应使用专门的公开 OAuth 应用，或改用不依赖客户端密钥的评论服务。

## 提问、纠错和参与

- **提问**：欢迎大家在[issue区](https://github.com/Liiked/VS-Code-Extension-Doc-ZH/issues/104)对插件开发进行提问，虽然这里不是官方答疑平台，不过你可以在[讨论区](https://github.com/Liiked/VS-Code-Extension-Doc-ZH/discussions)和国内的插件开发者进行交流。具体的开发问题，可以参考 VS Code 官方提供的 [`Stack Overflow` 中 VS Code 相关问题标签](https://stackoverflow.com/questions/tagged/visual-studio-code)、[Gitter 频道](https://gitter.im/Microsoft/vscode) 和 [VS Code Dev Slack 讨论区](https://join.slack.com/t/vscode-dev-community/shared_invite/enQtMjIxOTgxNDE3NzM0LWU5M2ZiZDU1YjBlMzdlZjA2YjBjYzRhYTM5NTgzMTAxMjdiNWU0ZmQzYWI3MWU5N2Q1YjBiYmQ4MzY0NDE1MzY)。

- **纠错和润饰**：在翻译过程中难免会出现笔误、翻译不到位、存在优化空间等情况，当然最严重的应属于翻译的章节或者片段难以理解，请在[issue](https://github.com/Liiked/VS-Code-Extension-Doc-ZH/issues/104)中不吝赐教，我们会优先处理这类问题。

- **参与**：由于国内已经有过一版VS Code文档的社区翻译版本，但是质量，emmmmm……，所以本项目会采取较为严格的翻译审查，若你有热情一同学习和贡献自己的力量，请参考我们的翻译指南。

## 翻译计划

翻译计划见[项目计划](https://github.com/Liiked/VS-Code-Extension-Doc-ZH/projects/2)

如果你有兴趣、能力和时间，欢迎[贡献代码](https://github.com/Liiked/VS-Code-Extension-Doc-ZH/issues/104)

## 特别感谢

[//]: contributor-faces

<a href="https://github.com/ddzy"><img src="https://avatars3.githubusercontent.com/u/33921398?s=400&v=4" title="ddzy" width="80" height="80"></a>

[//]: contributor-faces