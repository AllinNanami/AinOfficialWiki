---
title: C++ 基础：变量、数据类型、常量与注释
description: 第 1 课第 2 章：变量与常量、基本数据类型、类型转换、注释与命名，打好 C++ 语法与表达式基础。
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---
# 二.C++ 基础：变量、数据类型、常量与注释

在构建复杂的程序之前，我们必须先了解那些最基本的“积木”：如何存储数据、数据有哪些种类、如何给它们命名，以及如何为自己（和他人）留下笔记。



## 1. 注释 (Comments)



**注释**是写给**人**看的笔记，而不是给电脑看的。C++ 编译器会完全忽略注释。注释的目的是解释代码“为什么”这么做，或者让代码更易读。

C++ 中有两种注释方式：

1. **单行注释 (`//`)**: 从 `//` 开始，直到这一行的末尾，所有内容都是注释。
2. **多行注释 (`/\* ... \*/`)**: 从 `/*` 开始，到 `*/` 结束，中间可以跨越多行，所有内容都是注释。

C++

```
#include <iostream>
using namespace std;

// 这是一个单行注释。main 函数是程序的入口点。
int main() {
    
    // 下面这行代码会向控制台输出 "Hello!"
    cout << "Hello!" << endl; 
    
    /* 这是一个多行注释。
       我们可以用它来写更详细的说明。
       下面的代码（虽然被注释掉了）本可以用来...
       int x = 5; 
    */
    
    // 你也可以用多行注释来临时“关闭”一行代码的一部分
    int y = 10; /* + 5; */ // 编译器只会看到 int y = 10;
    
    cout << "y = " << y << endl;

    return 0; // 单行注释：表示程序正常结束
}
```

**运行结果示例:**

```
Hello!
y = 10
```



## 2. 变量 (Variables)



**变量**可以看作是内存中一个贴了标签的“盒子”，专门用来存储特定类型的数据。你可以随时更改盒子里装的东西（即变量的值）。

使用变量分三步：

1. **声明 (Declaration)**: 告诉编译器你要创建一个盒子，它叫什么名字（标识符），能装什么类型的数据。
2. **初始化 (Initialization)**: 在声明盒子的**同时**，就给它放入一个初始值。（推荐！）
3. **赋值 (Assignment)**: 在声明之后，用新的值替换掉盒子里的旧值。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 1. 声明 (Declaration)
    // 创建了一个名为 age 的盒子，它只能装整数 (int)
    // 此时盒子里是“垃圾值”（未定义），使用它很危险
    int age; 
    
    // 2. 赋值 (Assignment)
    // 将值 20 放入 age 盒子
    age = 20;
    cout << "Age after assignment: " << age << endl;

    // 3. 初始化 (Initialization) - 推荐的方式
    // C-style (等号) 初始化
    int score = 100; 
    
    // C++11 统一初始化 (花括号) - 更现代、更安全
    double height{1.75}; 
    
    cout << "Initial score: " << score << endl;
    cout << "Initial height: " << height << endl;
    
    // 变量的值是可以被改变的
    score = 95; // 赋值，覆盖掉旧值 100
    cout << "Final score: " << score << endl;
    
    return 0;
}
```

**运行结果示例:**

```
Age after assignment: 20
Initial score: 100
Initial height: 1.75
Final score: 95
```



## 3. 基本数据类型 (Basic Data Types)



**数据类型**告诉编译器一个变量（盒子）能存储什么样的数据，以及它在内存中占多大空间。

以下是 C++ 中最常用的几种基本数据类型：

| **类型** | **描述**                                                     | **示例**                                |
| -------- | ------------------------------------------------------------ | --------------------------------------- |
| `int`    | **整型**。用于存储整数（没有小数）。                         | `int age = 20;`                         |
| `double` | **双精度浮点型**。用于存储小数，精度很高。                   | `double pi = 3.14159;`                  |
| `float`  | **单精度浮点型**。也用于存储小数，但精度和范围小于 `double`。 | `float price = 19.99f;` (注意 `f` 后缀) |
| `char`   | **字符型**。用于存储**单个**字符（字母、数字、符号）。       | `char grade = 'A';` (注意用**单引号**)  |
| `bool`   | **布尔型**。用于存储逻辑值，只有 `true` 或 `false` 两种可能。 | `bool isRaining = false;`               |

**`sizeof()` 运算符**：可以用来查看某个数据类型或变量占用了多少字节（Bytes）的内存。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 整型
    int i = 123;
    // 在算法竞赛中，如果数字非常大（超过21亿），常用 long long
    long long bigNumber = 10000000000LL; 
    
    // 浮点型
    double pi = 3.14159265; // 精度高
    float gravity = 9.8f;   // 精度低，通常加 'f' 
    
    // 字符型
    char initial = 'J';
    
    // 布尔型
    bool isLoggedIn = true; // 'true' 是一个关键字
    
    // 打印值
    cout << "Integer: " << i << endl;
    cout << "Double: " << pi << endl;
    cout << "Char: " << initial << endl;
    cout << "Bool: " << isLoggedIn << endl; // cout 默认会把 true 打印成 1
    
    // 打印占用的内存大小（单位：字节）
    // 结果可能因你的系统（32位/64位）而异
    cout << "--- Memory Sizes ---" << endl;
    cout << "Size of int: " << sizeof(int) << " bytes" << endl;
    cout << "Size of double: " << sizeof(double) << " bytes" << endl;
    cout << "Size of char: " << sizeof(char) << " byte" << endl;
    cout << "Size of bool: " << sizeof(bool) << " byte" << endl;
    
    return 0;
}
```

**运行结果示例 (在 64 位系统上):**

```
Integer: 123
Double: 3.14159
Char: J
Bool: 1
--- Memory Sizes ---
Size of int: 4 bytes
Size of double: 8 bytes
Size of char: 1 byte
Size of bool: 1 byte
```



## 4. 常量 (Constants)



**常量**和变量很像，也是一个存储数据的“盒子”，但它有一个**铁律**：一旦在初始化时放入了值，就**永远不能再被修改**。

常量用来存储那些在程序运行期间不应改变的值（如圆周率 $\pi$、数学常数、配置参数等）。

有两种定义常量的方式：

1. **`const` 关键字 (C++ 方式 - 推荐)**: 这是现代 C++ 的首选方式。它创建了一个真正的、有类型的常量。
2. **`#define` 预处理器 (C 风格方式)**: 这是一个预处理器指令。它在**编译前**会把代码中所有的 `MAX_SIZE` 文本**直接替换**为 `100`。

C++

```
#include <iostream>
using namespace std;

// 方法2：#define 预处理器
// 注意：没有类型，没有分号 ;
// 在算法竞赛中常用于定义数组的最大大小
#define MAX_ARRAY_SIZE 100

int main() {
    // 方法1：const 关键字 (推荐)
    // 'const' 告诉编译器，PI 的值不能被修改
    const double PI = 3.14159; 
    const string SITE_NAME = "MyWebsite.com";
    
    cout << "Constant PI: " << PI << endl;
    cout << "Constant Site: " << SITE_NAME << endl;
    
    // 尝试修改 const 常量会导致编译错误！
    // PI = 3.14; // <-- 这行代码会报错！
    
    // #define 的使用
    int myArray[MAX_ARRAY_SIZE]; // 编译器实际看到的是 int myArray[100];
    
    cout << "Max array size: " << MAX_ARRAY_SIZE << endl;
    
    return 0;
}
```

**运行结果示例:**

```
Constant PI: 3.14159
Constant Site: MyWebsite.com
Max array size: 100
```



### 关键点回顾：



- **注释** (`//`, `/* */`)：给开发者看的笔记，编译器会忽略。
- **变量** (`int x = 5;`)：可变的、有类型的“盒子”，用于存储数据。
- **数据类型** (`int`, `double`, `char`, `bool`)：定义了“盒子”能装什么、占多大。
- **常量** (`const double PI = 3.14;`)：不可变的“盒子”，初始化后值不能被修改。
