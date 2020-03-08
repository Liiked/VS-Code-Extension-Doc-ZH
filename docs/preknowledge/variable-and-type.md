# 认识TypeScript-变量和类型

本节将介绍基础的TypeScript变量以及它的类型系统，它本质上和JavaScript是一样的，不过东西会更多一点，对于非js开发者来说，你可能会遇到熟悉的“枚举”、“元组”类型，了解了这点，或许能让你安心并更快地掌握TS，但是这并不意味着你就可以高枕无忧了，虽然TS扩展了JS的类型能力，但它本质上依旧是一门弱类型语言，请在书写代码时遵循社区的最佳实践并保持谨慎。

?> 本文参考社区翻译文档，详见[https://www.tslang.cn/docs/handbook/basic-types.html](https://www.tslang.cn/docs/handbook/basic-types.html)

## 类型
---

变量声明的基础规则请自行参考JavaScript，JavaScript支持加分号和不加分号两种风格，方便起见，本章的所有示例代码都不会刻意添加分号，有关分号风格，请参阅[]()。

### 类型注解
TS扩展了JS的语法格式，规则：在变量、声明的后面立即加上冒号`:`，如：

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

请注意，类型注释应使用小写，而不是使用首字母大写的JavaScript的衍生类型（应使用`string`，而不是`String`）

#### 布尔值

最基本的数据类型就是简单的true/false值，在JavaScript和TypeScript里叫做boolean（其它语言中也一样）。

```typescript
let isDone: boolean = false;
```

#### 数字

和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是 number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。非JS开发者需要注意的是，TS和JS一样，没有区分数字类型（如Int，Long），如果你需要整数，需使用`Number.parseInt()`方法。

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

#### 字符串

JavaScript程序的另一项基本操作是处理网页或服务器端的文本数据。 像其它语言里一样，我们使用 string表示文本数据类型。 和JavaScript一样，可以使用双引号（ "）或单引号（'）表示字符串。

```typescript
let name: string = "bob";
name = "smith";
```

你还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ \`），并且以`${ expr }`这种形式嵌入表达式

```typescript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.
I'll be ${ age + 1 } years old next month.`;
```

这与下面定义`sentence`的方式效果相同：

```typescript
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

#### 数组
TypeScript像JavaScript一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：
```typescript
let list: number[] = [1, 2, 3];
```
第二种方式是使用数组泛型，Array<元素类型>：
```typescript
let list: Array<number> = [1, 2, 3];
```

#### 元组 Tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string和number类型的元组。

```typescript
// 声明一个元组
let x: [string, number];
// 将其初始化
x = ['hello', 10]; // OK
// 将其错误地初始化
x = [10, 'hello']; // Error
当访问一个已知索引的元素，会得到正确的类型：

console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number'类型没有'substr'方法
```

#### 枚举
enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

默认情况下，从0开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从 1开始编号：

```typescript
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```typescript
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：

```typescript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
```

#### Any
有时候，我们会想要为那些在编写阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any类型来标记这些变量：

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 合法, 定义了一个布尔值
```

当你只知道一部分数据的类型时，any类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```typescript
let list: any[] = [1, true, "free"];

list[1] = 100;
```

#### Void
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```typescript
function warnUser(): void {
    console.log("This is my warning message");
}
```
声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：

```typescript
let unusable: void = undefined;
```

#### Object
object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。

使用object类型，就可以更好的表示像`Object.create`这样的API。例如：

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

## TypeScript类型表
---

| 类型                     | 例子                                                      |
| ------------------------ | --------------------------------------------------------- |
| **基本类型**             |
| boolean                  | `x: boolean = false`                                      |
| number                   | `x: number = 10`                                          |
| string                   | `x: string = '10'`                                        |
| undefined                | `x: undefined = undefined`                                |
| null                     | `x: null = null`                                          |
| **引用类型以及其他类型** |
| object                   | `x: object = { age: '14', name: 'John' }`                 |
| array                    | `x: array = [1, '2', 3.0]`                                |
| function                 | `x: function = (args) => { console.log(args) }`           |
| symbol                   | `x: symbol = Symbol('id')`                                |
| **TypeScript 补充类型**  |
| any                      | `x: any = null`                                           |
| never                    | `function error (msg): never => { throw new Error(msg) }` |
| enum                     | `enum Color {Red = 1, Green, Blue}`                       |
| tuple                    | `x: [string, number] = ['name', 12]`                      |

## 类型断言
---

有时候你会遇到这样的情况，你比TypeScript更了解某个值的具体信息。

通过*类型断言*这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。TypeScript会假设你——程序员——已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：

```typescript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
另一个为as语法：

```typescript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

!> 注意：本章全部采用了let，const关键字，以及你接下来可以见到的所有例子中，都不再使用var声明变量，为了避免var带来的副作用和影响，我们更提倡使用新的关键字。

## 变量声明
---

### let声明

由于本章侧重于帮助读者流畅地阅读文档中出现的TS代码，因此本节不再赘述var和新关键字之间的区别，读者如有兴趣可自行参考[TypeScript文档]()。

let的声明格式

```typescript
let hello = "Hello!";
```

##### 块作用域

当用let声明一个变量，它使用的是词法作用域或块作用域。 不同于使用 var声明的变量那样可以在包含它们的函数外访问，块作用域变量在包含它们的块或for循环之外是不能访问的。

```typescript
function f(input: boolean) {
    let a = 100;

    if (input) {
        // 你在这里还可以访问到a
        let b = a + 1;
        return b;
    }

    // 错误: 'b'不存在
    return b;
}
```

这里我们定义了2个变量`a`和`b`。 `a`的作用域在`f`函数体内，而`b`的作用域只在`if`语句块里。

拥有块级作用域的变量的另一个特点是，它们不能在被声明之前读或写。 虽然这些变量始终“存在”于它们的作用域里，但在直到声明它的代码之前的区域都属于 *暂时性死区*。 它只是用来说明我们不能在 let语句之前访问它们，幸运的是TypeScript可以告诉我们这些信息。

```typescript
a++; // illegal to use 'a' before it's declared;
let a;
```

注意一点，我们仍然可以在一个拥有块作用域变量被声明前获取它。 只是我们不能在变量声明前去调用那个函数。 如果生成代码目标为ES2015，运行时会抛出一个错误；然而，目前TypeScript是不会报错的。

```typescript
function foo() {
    // okay to capture 'a'
    return a;
}

// 不能在'a'被声明前调用'foo'
// 运行时会抛出错误
foo();

let a;

```

#### 重定义及屏蔽

你不可以重复定义同一个变量，在使用`var`时，这是被允许的。

```typescript
let x = 10;
let x = 20; // 错误，不能在1个作用域里多次声明`x`
```

以下情况，TypeScript均会报错

```typescript
function f(x) {
    let x = 100; // error: interferes with parameter declaration
}

function g() {
    let x = 100;
    var x = 100; // error: can't have both declarations of 'x'
}
```

注意函数作用域和块作用域不同，你可以在函数作用域里嵌套块作用域，作用域之间的变量声明互不影响，同时，块作用域是允许嵌套的。

在一个嵌套作用域里引入一个新名字的行为称做**屏蔽**。 它是一把双刃剑，它可能会不小心地引入新问题，还可能会遮蔽掉一些错误。 

```typescript
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // returns 0
f(true, 0);  // returns 100
```

### const声明


`const`声明是声明变量的另一种方式。它们与let声明相似，但是就像它的名字所表达的，它们被赋值后不能再改变。 换句话说，它们拥有与 let相同的作用域规则，但是不能对它们重新赋值。

这很好理解，它们引用的值是不可变的。

```typescript
const numLivesForCat = 9;
const kitty = {
    name: "Aurora",
    numLives: numLivesForCat,
}

// Error
kitty = {
    name: "Danielle",
    numLives: numLivesForCat
};

// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

除非你使用特殊的方法去避免，实际上const变量的内部状态是可修改的。

## 访问/设置对象的属性和方法
---

我们在前面已经看过很多对象的例子了，而且JavaScript的各种衍生类型都是基于Object构造出来的，所以本小节介绍的内容也同时适用数组、元组等数据类型。

#### 点表示法

对象的名字表现为一个命名空间(namespace)，它必须写在第一位——当你想访问对象内部的属性或方法时，然后是一个点`.`，紧接着是你想要访问的项目，标识可以是简单属性的名字(name)，或者是数组属性的一个子元素，又或者是对象的方法调用。
```typescript
person.age
person.interests[1]
person.bio()
```

创建一个对象在TypeScript中非常简单，在赋值语句右侧使用形如`{}`的方式就能创建对象
```typescript
const name = {
  first : 'Bob',
  last : 'Smith'
}
```
用点表示法访问对象属性
```typescript
name.first
name.last
```



#### 中括号表示法
另外一种访问属性的方式是使用括号表示法(bracket notation)，替代这样的代码
```typescript
person.age
person.name.first
```

```typescript
person['age']
person['name']['first']
```

同样，创建一个数组也非常容易
```typescript
const name = ['Bob', 'Smith']
```

用中括号表示法访问数组元素
```typescript
name[0]
name[1]

// 数组或类数组格式的数据只能用括号表示法访问元素，不可以使用`name.0`方式访问
```

#### 设置对象成员
分别用点表示法和中括号表示法设置对象成员的值
```typescript
person.age = 45
person['name']['last'] = 'Cratchit'
```

设置成员并不意味着你只能更新已经存在的属性的值，你完全可以创建新的成员，尝试以下代码：
```typescript
person['eyes'] = 'hazel'
person.farewell = function() { alert("Bye everybody!") }
```

现在你可以测试你新创建的成员
```typescript
person['eyes']
person.farewell()
```

## 变量解构
---

ES2015的变量解构参照了名为[模式匹配]()的设计模式，本质来说是一种便利的语法糖

### 解构数组

最简单的解构莫过于数组的解构赋值了：

```typescript
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2
```

上面的例子等价于

```typescript
first = input[0];
second = input[1];
```

作用于函数参数：
```typescript
function f([first, second]: [number, number]) { // 注意后面部分[number, number]是typescript的类型注解
    console.log(first);
    console.log(second);
}

const input = [12, 44]

f(input);
```

你可以在数组里使用`...`语法创建剩余变量：

```typescript
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

当然，由于是JavaScript, 你可以忽略你不关心的尾随元素：

```typescript
let [first] = [1, 2, 3, 4];
console.log(first); // outputs 1
```

或其它元素：

```typescript
let [, second, , fourth] = [1, 2, 3, 4];
```

### 对象解构

你也可以解构对象：

```typescript
let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let { a, b } = o;
```

你可以在对象里使用`...`语法创建剩余变量：

```typescript
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
```

你也可以给属性以不同的名字：

```typescript
let { a: newName1, b: newName2 } = o;
```

这里的语法开始有些混乱。 你可以将 `a: newName1` 读做讲 "a" 取出作为 "newName1"。 方向是从左到右，好像你写成了以下样子：

```typescript
let newName1 = o.a;
let newName2 = o.b;
```

令你困惑的可能是=这里的冒号不是指示类型的，我们前面说，以冒号后跟的是*类型注解*。 如果你想指定它的类型，仍然需要在其后写上完整的模式。

```typescript
// 正确
let {a, b}: {a: string, b: number} = o;
// 错误
let {a: n1, b: n2}: {n1: string, n2: number} = o;
```

### 默认值

默认值可以让你在属性为 undefined 时使用缺省值：
```typescript
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}
```

现在，即使 `b` 为 `undefined` ， keepWholeObject 函数的变量 `wholeObject` 的属性 a 和 b 都会有值。

### 函数声明

解构也能用于函数声明。 看以下简单的情况：

```typescript

type C = { a: string, b?: number }
// 普通写法
function f(C) {
    // ...
}
// 解构
function f({ a, b }: C): void {
    // ...
}
```

### 变量展开

展开操作符正与解构相反。 它允许你将一个数组展开为另一个数组，或将一个对象展开为另一个对象。 例如：

```typescript
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
```

这会令bothPlus的值为`[0, 1, 2, 3, 4, 5]`。 展开操作创建了 first和second的一份**浅拷贝**。 它们不会被展开操作所改变。

你还可以展开对象：

```typescript
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
```

search的值为`{ food: "rich", price: "$$", ambiance: "noisy" }`。 对象的展开比数组的展开要复杂的多。 像数组展开一样，它是从左至右进行处理，但结果仍为对象。 这就意味着出现在**展开对象后面的属性会覆盖前面的属性**。 因此，如果我们修改上面的例子，在结尾处进行展开的话：

```typescript
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
```

那么，defaults里的food属性会重写`food: "rich"`，在这里这并不是我们想要的结果。

## 下一步

- [类](/preknowledge/class.md) - 进一步了解TypeScript所规定的类
- [泛型和命名空间](/preknowledge/generics-and-modules.md) - 进一步了解TypeScript所规定的语法