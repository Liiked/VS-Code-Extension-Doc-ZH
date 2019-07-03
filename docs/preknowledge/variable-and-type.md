# 认识Typescript-变量和类型

本节将介绍基础的Typescript变量以及它的类型系统，它本质上和javascript是一样的，不过东西会更多一点，对于非js开发者来说，你可能会遇到熟悉的“枚举”、“元组”类型，了解了这点，或许能让你安心并更快地掌握TS，但是这并不意味着你就可以高枕无忧了，虽然TS扩展了JS的类型能力，但它本质上依旧是一门弱类型语言，请在书写代码时遵循社区的最佳实践并保持谨慎。

?> 本文参考社区翻译文档，详见[https://www.tslang.cn/docs/handbook/basic-types.html](https://www.tslang.cn/docs/handbook/basic-types.html)

## 类型

变量声明的基础规则请自行参考Javascript，Javascript支持加分号和不加分号两种风格，方便起见，本章的所有示例代码都不会刻意添加分号，有关分号风格，请参阅[]()。

### 类型注解
规则：在变量、声明的后面立即加上冒号`:`，如：

```typescript
// 字符串注解
const XXX: string = 'string type'
// 布尔值注解
let true_or_false: boolean = false
// 函数参数类型注解
function params (value: string) {
    console.log(value) // 返回string类型
}
// 函数返回值类型注解
function returnValue (): string {
    return 'value is stirng'
}
```

请注意，类型注释应使用小写，而不是使用首字母大写的Javascript的衍生类型（应使用`string`，而不是`String`）

#### 布尔值

最基本的数据类型就是简单的true/false值，在JavaScript和TypeScript里叫做boolean（其它语言中也一样）。

```typescript
let isDone: boolean = false;
```
