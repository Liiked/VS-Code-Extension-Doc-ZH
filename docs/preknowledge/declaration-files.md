# 声明文件

当你在使用VS Code编写TypeScript文件时，你不太可能在每个文件上都标明`interface`字样的接口，一旦某个文件的方法或者变量比较多，你的代码可能就会被非常多的类型注解占据，在大型项目或者是你生成的库文件中为了保持代码的整洁，你就可能需要**声明文件**的帮助。

## 创建一个声明文件
---

声明文件以`.d.ts`结尾，与TypeScript文件`.ts`稍有区别。当你的项目目录中出现了`.d.ts`结尾的文件时，所有与之关联的规则都会自动应用。声明文件支持我们前面介绍的各类语法，但是你得在语法前面加上`declare`。

## 例子
---

### 全局变量

**文档**

> 全局变量foo包含了存在组件总数。

**代码**

```typescript
console.log("Half the number of widgets is " + (foo / 2));
```

**声明**

使用declare var声明变量。 如果变量是只读的，那么可以使用 declare const。 你还可以使用 declare let如果变量拥有块级作用域。

```typescript
/** 组件总数 */
declare var foo: number;
```

### 全局函数
**文档**

> 用一个字符串参数调用greet函数向用户显示一条欢迎信息。

**代码**
```typescript
greet("hello, world");
```
**声明**

使用declare function声明函数。
```typescript
declare function greet(greeting: string): void;
```

### 带属性的对象
**文档**

> 全局变量myLib包含一个makeGreeting函数， 还有一个属性 numberOfGreetings指示目前为止欢迎数量。

**代码**

```typescript
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);

let count = myLib.numberOfGreetings;
```

**声明**

使用declare namespace描述用点表示法访问的类型或值。
```typescript
declare namespace myLib {
    function makeGreeting(s: string): string;
    let numberOfGreetings: number;
}
```
### 函数重载
**文档**

getWidget函数接收一个数字，返回一个组件，或接收一个字符串并返回一个组件数组。

**代码**
```typescript
let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("all of them");
```
**声明**
```typescript
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```
### 可重用类型（接口）
**文档**

> 当指定一个欢迎词时，你必须传入一个GreetingSettings对象。 这个对象具有以下几个属性：
>
> 1- greeting：必需的字符串
>
> 2- duration: 可选的时长（毫秒表示）
> 
> 3- color: 可选字符串，比如‘#ff00ff’

**代码**
```typescript
greet({
  greeting: "hello world",
  duration: 4000
});
```
**声明**

使用interface定义一个带有属性的类型。
```typescript
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void;
```

### 可重用类型（类型别名）
**文档**

> 在任何需要欢迎词的地方，你可以提供一个string，一个返回string的函数或一个Greeter实例。

**代码**

```typescript
function getGreeting() {
    return "howdy";
}
class MyGreeter extends Greeter { }

greet("hello");
greet(getGreeting);
greet(new MyGreeter());
```

**声明**

你可以使用类型别名来定义类型的短名：

```typescript
type GreetingLike = string | (() => string) | MyGreeter;

declare function greet(g: GreetingLike): void;
```
### 组织类型
**文档**

> greeter对象能够记录到文件或显示一个警告。 你可以为 .log(...)提供LogOptions和为.alert(...)提供选项。

**代码**
```typescript
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
```
**声明**

使用命名空间组织类型。
```typescript
declare namespace GreetingLib {
    interface LogOptions {
        verbose?: boolean;
    }
    interface AlertOptions {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
```
你也可以在一个声明中创建嵌套的命名空间：
```typescript
declare namespace GreetingLib.Options {
    // Refer to via GreetingLib.Options.Log
    interface Log {
        verbose?: boolean;
    }
    interface Alert {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
```
### 类
**文档**

> 你可以通过实例化Greeter对象来创建欢迎词，或者继承Greeter对象来自定义欢迎词。

**代码**
```typescript
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();

class SpecialGreeter extends Greeter {
    constructor() {
        super("Very special greetings");
    }
}
```
**声明**

使用declare class描述一个类或像类一样的对象。 类可以有属性和方法，就和构造函数一样。
```typescript
declare class Greeter {
    constructor(greeting: string);

    greeting: string;
    showGreeting(): void;
}
```
