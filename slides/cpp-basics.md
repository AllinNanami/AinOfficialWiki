---
theme: default
class: text-center
highlighter: shiki
fonts:
  provider: none
  sans: HarmonyOS Sans SC, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, sans-serif
  mono: JetBrains Mono, Maple Mono, Cascadia Code, Consolas, monospace
lineNumbers: false
info: |
  ## C++ 基础教程
  C++ 编程语言基础知识
drawings:
  persist: false
transition: slide-left
title: C++ 基础教程
favicon: /favicon.ico
mdc: true
---

# C++ 基础教程

从零开始学习 C++ 编程

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    开始学习 <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: section
---

# 一. C++ 输入与输出基础

---

# 什么是 I/O？

<br>

<div class="text-lg">

**输入与输出（Input/Output, I/O）** 是程序与外界交换信息的核心机制

- 🗣️ **输出（Output）** - 程序的"嘴巴"，向外界展示信息
- 👂 **输入（Input）** - 程序的"耳朵"，接收外界信息

</div>

<br>

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mt-6">

### C++ 提供两种主要的 I/O 方式

- **C++ 风格 I/O（`<iostream>`）** - 现代、类型安全、面向对象
- **C 风格 I/O（`<cstdio>`）** - 传统、格式化能力强、某些场景下速度快

</div>

---

# C++ 标准 I/O：cout 输出

使用 `cout` 和插入运算符 `<<` 进行输出

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 20;
    
    // 1. 打印字符串
    cout << "Hello, C++!";
    
    // 2. 打印换行
    cout << '\n';
    
    // 3. 打印变量
    cout << "Your age is: " << age << '\n';
    
    // 4. 链式调用
    cout << "Next year, you will be: " << (age + 1) << '\n';
    
    // 5. 使用 endl（换行 + 刷新缓冲区）
    cout << "Goodbye!" << endl;
    
    return 0;
}
```

---

# C++ 标准 I/O：cin 输入

使用 `cin` 和提取运算符 `>>` 进行输入

```cpp
#include <iostream>
using namespace std;

int main() {
    int age;
    double height;
    
    // 单个输入
    cout << "Please enter your age: ";
    cin >> age;  // cin 会自动跳过空白字符
    
    cout << "Your age is: " << age << endl;
    
    // 链式输入：一次读取多个值
    cout << "Enter your age and height: ";
    cin >> age >> height;
    
    cout << "Age: " << age << ", Height: " << height << endl;
    
    return 0;
}
```

---

# C 风格 I/O：printf 输出

使用格式说明符进行格式化输出

<div class="grid grid-cols-2 gap-4">

<div>

### 常用格式说明符

| 说明符 | 类型 | 用途 |
|--------|------|------|
| `%d` | `int` | 整数 |
| `%f` | `double` | 浮点数 |
| `%c` | `char` | 字符 |
| `%s` | `char*` | 字符串 |

</div>

<div>

```cpp
#include <cstdio>

int main() {
    int age = 20;
    double height = 1.78;
    char grade = 'A';
    
    // 基本输出
    printf("Age: %d\n", age);
    
    // 多个变量
    printf("Grade: %c, Height: %f\n", 
           grade, height);
    
    // 控制精度（保留2位小数）
    printf("Height: %.2f\n", height);
    
    return 0;
}
```

</div>

</div>

---

# C 风格 I/O：scanf 输入

⚠️ **重要：必须使用取地址运算符 `&`**

```cpp
#include <cstdio>

int main() {
    int age;
    double height;
    
    printf("Please enter your age: ");
    
    // ⚠️ 注意：传递的是 &age（地址），而不是 age
    scanf("%d", &age);
    
    printf("Your age is: %d\n", age);
    
    // 读取多个值
    printf("Enter age and height: ");
    scanf("%d %lf", &age, &height);  // %lf 用于读取 double
    
    printf("Age: %d, Height: %.2lf\n", age, height);
    
    return 0;
}
```

---

# 处理整行输入：getline

`cin` 和 `scanf("%s")` 遇到空格就停止，如何读取完整的一行？

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    
    cout << "Please enter your full name: ";
    getline(cin, name);  // 读取整行，包括空格
    
    cout << "Hello, " << name << "!" << endl;
    // 输入 "John Doe" 会输出 "Hello, John Doe!"
    
    return 0;
}
```

---

# I/O 常见陷阱（1）

### ❌ scanf 忘记 &

```cpp
int age;
scanf("%d", age);  // ❌ 错误！会导致段错误
scanf("%d", &age); // ✅ 正确
```

### ⚠️ cin 和 getline 混用

```cpp
int id;
string name;

cout << "Enter ID: ";
cin >> id;  // 用户输入 101 按回车，'\n' 留在缓冲区

cout << "Enter name: ";
getline(cin, name);  // ❌ 立即读到 '\n'，name 是空的！

// ✅ 解决方法：使用 cin.ignore() 清除缓冲区
cin >> id;
cin.ignore();  // 忽略掉换行符
getline(cin, name);  // ✅ 现在可以正常工作了
```

---

# I/O 常见陷阱（2）

### ❌ printf/scanf 格式与类型不匹配

```cpp
// 错误：用 %d (整数) 打印 %f (浮点数)
printf("%d", 3.14);  // 输出垃圾值

// 错误：用 %f 读取整数
int x;
scanf("%f", &x);  // 结果未定义
```

### ⚠️ scanf("%s") 缓冲区溢出

```cpp
char str[10];  // 只能存 9 个字符 + '\0'
scanf("%s", str);  // 如果输入超过 9 个字符，会造成缓冲区溢出！

// ✅ 解决方法：使用 C++ string 或限制宽度
scanf("%9s", str);  // 最多读取 9 个字符
```

---

# 性能优化提示

在算法竞赛中，大量 I/O 可能导致超时

<div class="p-4 bg-green-50 dark:bg-green-900 rounded mt-6">

### 关闭同步以提升 cin/cout 速度

```cpp
#include <iostream>
using namespace std;

int main() {
    // 关闭 C++ 流与 C 流的同步
    ios::sync_with_stdio(false);
    // 解除 cin 与 cout 的绑定
    cin.tie(NULL);
    
    // 现在 cin/cout 的速度与 scanf/printf 相当！
    
    int n;
    cin >> n;
    cout << n << '\n';
    
    return 0;
}
```

</div>

---
layout: section
---

# 二. 变量、数据类型与常量

---

# 注释（Comments）

注释是写给**人**看的，编译器会完全忽略

```cpp
#include <iostream>
using namespace std;

// 这是单行注释
// main 函数是程序的入口点

int main() {
    cout << "Hello!" << endl;
    
    /* 这是多行注释
       可以跨越多行
       用于详细说明
       int x = 5; 
    */
    
    int y = 10; /* 行内注释 */ 
    
    cout << "y = " << y << endl;
    
    return 0; // 单行注释：程序正常结束
}
```

---

# 变量（Variables）

变量是内存中的"盒子"，用来存储数据

<div class="grid grid-cols-2 gap-4">

<div>

### 三个步骤

1. **声明** - 创建变量
2. **初始化** - 赋初始值（推荐）
3. **赋值** - 修改值

</div>

<div>

```cpp
int main() {
    // 1. 声明（未初始化，有垃圾值）
    int age;
    
    // 2. 赋值
    age = 20;
    
    // 3. 初始化（推荐）
    int score = 100;
    
    // C++11 统一初始化
    double height{1.75};
    
    // 修改值
    score = 95;
    
    return 0;
}
```

</div>

</div>

---

# 基本数据类型（1）

### 整数类型

| 类型 | 描述 | 示例 | 大小 |
|------|------|------|------|
| `short` | 短整型 | `short s = 100;` | 2 字节 |
| `int` | 整型 | `int age = 20;` | 4 字节 |
| `long` | 长整型 | `long l = 1000000L;` | 4/8 字节 |
| `long long` | 超长整型 | `long long big = 10000000000LL;` | 8 字节 |

---

# 基本数据类型（2）

### 浮点数、字符和布尔类型

| 类型 | 描述 | 示例 | 大小 |
|------|------|------|------|
| `float` | 单精度浮点 | `float price = 19.99f;` | 4 字节 |
| `double` | 双精度浮点 | `double pi = 3.14159;` | 8 字节 |
| `char` | 字符 | `char grade = 'A';` | 1 字节 |
| `bool` | 布尔 | `bool flag = true;` | 1 字节 |

<br>

**查看大小：** `sizeof(int)` 返回类型的字节数

---

# 整数类型详解（1）

### 有符号整数（可以存负数）

| 类型 | 大小 | 范围（约） |
|------|------|------------|
| `short` | 2 字节 | -32,768 ~ 32,767 |
| `int` | 4 字节 | -2.1亿 ~ 2.1亿 |
| `long` | 4/8 字节 | 取决于系统 |
| `long long` | 8 字节 | -9×10¹⁸ ~ 9×10¹⁸ |

---

# 整数类型详解（2）

### 无符号整数（只能存非负数）

| 类型 | 大小 | 范围（约） |
|------|------|------------|
| `unsigned short` | 2 字节 | 0 ~ 65,535 |
| `unsigned int` | 4 字节 | 0 ~ 42亿 |
| `unsigned long long` | 8 字节 | 0 ~ 1.8×10¹⁹ |

<br>

💡 **提示：** 无符号类型范围更大，但不能存储负数

---

# 整数类型使用示例

不同整数类型的声明和使用

```cpp
#include <iostream>
using namespace std;

int main() {
    // 标准整型
    int age = 20;
    
    // 超长整型（需要 LL 后缀，用于大数）
    long long big = 10000000000LL;
    
    // 无符号整型（只能存非负数）
    unsigned int count = 4000000000U;
    
    cout << "int: " << age << endl;
    cout << "long long: " << big << endl;
    cout << "unsigned int: " << count << endl;
    
    return 0;
}
```

<div class="p-3 bg-blue-50 dark:bg-blue-900 rounded mt-3 text-sm">

💡 **后缀说明：** `L` = long, `LL` = long long, `U` = unsigned

</div>

---

# 常量（Constants）

常量一旦初始化就**不能被修改**

<div class="grid grid-cols-2 gap-4">

<div>

### 方法1：const 关键字（推荐）

```cpp
const double PI = 3.14159;
const string SITE = "MyWebsite.com";

// PI = 3.14; // ❌ 编译错误！

cout << "PI: " << PI << endl;
```

<div class="p-3 bg-green-50 dark:bg-green-900 rounded text-sm mt-2">
✅ 有类型、类型安全、推荐使用
</div>

</div>

<div>

### 方法2：#define 预处理器

```cpp
#define MAX_SIZE 100
// 注意：没有类型，没有分号

int arr[MAX_SIZE];

cout << "Max: " << MAX_SIZE << endl;
```

<div class="p-3 bg-yellow-50 dark:bg-yellow-900 rounded text-sm mt-2">
⚠️ 文本替换、无类型检查
</div>

</div>

</div>

---
layout: section
---

# 三. 控制流基础

---

# 控制流概述

程序的执行顺序可以通过控制流语句来管理

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 🔀 选择结构

根据条件决定执行哪段代码

- `if` 语句
- `if-else` 语句
- `if-else if-else` 语句
- `switch-case` 语句
- 三元运算符 `? :`

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 🔁 循环结构

重复执行代码块

- `for` 循环
- `while` 循环
- `do-while` 循环
- 范围 `for` 循环（C++11）

</div>

</div>

---

# if 语句

最基本的选择结构

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 18;
    
    cout << "Checking age..." << endl;
    
    // 如果条件为 true，执行代码块
    if (age >= 18) {
        cout << "You are an adult." << endl;
    }
    
    cout << "Check complete." << endl;
    
    return 0;
}
```


---

# if-else 语句

二选一的分支

```cpp
#include <iostream>
using namespace std;

int main() {
    int number = 7;
    
    // 检查奇偶性
    if (number % 2 == 0) {
        cout << number << " is even." << endl;
    } else {
        cout << number << " is odd." << endl;
    }
    
    return 0;
}
```

**输出示例：** `7 is odd.`

---

# if-else if-else 语句

多条件判断

```cpp
#include <iostream>
using namespace std;

int main() {
    int score = 85;
    
    if (score >= 90) {
        cout << "Grade: A" << endl;
    } else if (score >= 80) {  // score < 90
        cout << "Grade: B" << endl;
    } else if (score >= 70) {  // score < 80
        cout << "Grade: C" << endl;
    } else {  // score < 70
        cout << "Grade: F" << endl;
    }
    
    return 0;
}
```

**运行结果：** `Grade: B`

---

# switch-case 语句

专门用于检查变量是否等于一系列常量值

```cpp
#include <iostream>
using namespace std;

int main() {
    int choice = 2;  // 1=Start, 2=Load, 3=Exit
    
    switch (choice) {
        case 1:
            cout << "Starting new game..." << endl;
            break;  // ⚠️ 重要！跳出 switch
        case 2:
            cout << "Loading game..." << endl;
            break;
        case 3:
            cout << "Exiting..." << endl;
            break;
        default:  // 类似于 else
            cout << "Invalid choice." << endl;
            break;
    }
    
    return 0;
}
```

---

# 三元运算符（? :）

if-else 的简洁写法，常用于赋值

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 20;
    string status;
    
    // 传统 if-else 写法
    // if (age >= 18) {
    //     status = "Adult";
    // } else {
    //     status = "Minor";
    // }
    
    // 三元运算符：更简洁
    status = (age >= 18) ? "Adult" : "Minor";
    //       条件          true值    false值
    
    cout << "Status: " << status << endl;
    
    return 0;
}
```

---

# for 循环

最常用的循环，适合已知循环次数的情况

### 语法结构

```cpp
for (初始化; 条件; 更新) {
    // 循环体
}
```

1. **初始化** - 循环开始前执行一次
2. **条件** - 每次循环前检查，为 true 则继续
3. **更新** - 每次循环体执行后执行

```cpp
// 打印 0 到 4
for (int i = 0; i < 5; i++) {
    cout << "i = " << i << endl;
}
// 输出: i = 0, i = 1, i = 2, i = 3, i = 4
```

---

# while 循环

适合不知道循环次数，只知道终止条件的情况

```cpp
#include <iostream>
using namespace std;

int main() {
    int countdown = 3;
    
    // 只要条件为 true，就继续循环
    while (countdown > 0) {
        cout << "Countdown: " << countdown << endl;
        countdown--;  // ⚠️ 必须手动更新，否则死循环！
    }
    
    cout << "Liftoff!" << endl;
    
    return 0;
}
```

---

# do-while 循环

保证循环体**至少执行一次**

```cpp
#include <iostream>
using namespace std;

int main() {
    int choice;
    
    // 先执行，再检查条件
    do {
        cout << "--- Menu ---" << endl;
        cout << "1. Play" << endl;
        cout << "2. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;
        
        if (choice == 1) {
            cout << "Playing game..." << endl;
        }
        
    } while (choice != 2);  // ⚠️ 注意分号
    
    cout << "Goodbye!" << endl;
    return 0;
}
```

---

# 范围 for 循环（C++11）

方便地遍历集合中的所有元素

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    
    // 语法：for (元素类型 变量名 : 集合)
    // 自动遍历数组中的每个元素
    for (int n : arr) {
        cout << n << " ";
    }
    cout << endl;
    
    return 0;
}
```

**输出：** `10 20 30 40 50`

---

# 跳转语句：break

立即终止并跳出**整个循环**

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    
    // 查找数字 22
    for (int n : arr) {
        if (n == 22) {
            cout << "Found 22!" << endl;
            break;  // 找到了，立即跳出循环
        }
        cout << "Checking " << n << "..." << endl;
    }
    
    return 0;
}
```

---

# 跳转语句：continue

跳过**当前这次**循环的剩余代码，开始下一次循环

```cpp
#include <iostream>
using namespace std;

int main() {
    // 只打印 1 到 10 之间的偶数
    for (int i = 1; i <= 10; i++) {
        // 如果 i 是奇数
        if (i % 2 != 0) {
            continue;  // 跳过本次循环，直接进入下一次
        }
        
        // 只有偶数才会执行到这里
        cout << i << " ";
    }
    cout << endl;
    
    return 0;
}
```

**输出：** `2 4 6 8 10`

---

# 跳转语句：return

跳出整个函数

```cpp
#include <iostream>
using namespace std;

void checkAge(int age) {
    if (age < 0) {
        cout << "Error: Invalid age." << endl;
        return;  // 立即跳出函数
    }
    
    if (age >= 18) {
        cout << "Access granted." << endl;
    } else {
        cout << "Access denied." << endl;
    }
}

int main() {
    checkAge(25);   // Access granted.
    checkAge(-5);   // Error: Invalid age.
    checkAge(15);   // Access denied.
    
    return 0;  // 结束 main，程序终止
}
```

---
layout: section
---

# 四. 数组基础

---

# 什么是数组？

**数组**是一种用来存储**固定大小、相同类型元素**的连续内存空间

<div class="flex items-center justify-center mt-8">

```
┌─────┬─────┬─────┬─────┬─────┐
│  10 │  20 │  30 │  40 │  50 │
└─────┴─────┴─────┴─────┴─────┘
   [0]   [1]   [2]   [3]   [4]
```

</div>

<div class="grid grid-cols-3 gap-4 mt-8">

<div class="p-3 bg-blue-50 dark:bg-blue-900 rounded text-center">

**索引从 0 开始**

第一个元素是 `arr[0]`

</div>

<div class="p-3 bg-green-50 dark:bg-green-900 rounded text-center">

**固定大小**

声明后大小不能改变

</div>

<div class="p-3 bg-purple-50 dark:bg-purple-900 rounded text-center">

**内存连续**

元素紧挨着存储

</div>

</div>

---

# 数组的声明

指定类型、名称和大小

```cpp
#include <iostream>
using namespace std;

int main() {
    // 声明一个包含5个整数的数组
    int numbers[5];
    
    // 逐个赋值（索引从 0 开始）
    numbers[0] = 10;
    numbers[1] = 20;
    numbers[2] = 30;
    numbers[3] = 40;
    numbers[4] = 50;  // 最后一个元素的索引是 4（即 5-1）
    
    // 遍历打印
    for (int i = 0; i < 5; i++) {
        cout << "numbers[" << i << "] = " << numbers[i] << endl;
    }
    
    return 0;
}
```

---

# 数组的初始化方法（1）

### 基本初始化方式

```cpp
// 方法1：完整初始化列表
int arr1[5] = {1, 2, 3, 4, 5};

// 方法2：自动计算大小
int arr2[] = {10, 20, 30, 40, 50};  
// 编译器自动计算大小为 5

// 方法3：C++11 统一初始化
int arr3[5]{1, 2, 3, 4, 5};
```

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mt-4 text-sm">

✅ **推荐：** 方法1 最常用，语法清晰易懂

</div>

---

# 数组的初始化方法（2）

### 部分初始化和全零初始化

```cpp
// 部分初始化（其余为0）
int arr1[5] = {1, 2, 3};  
// 结果: {1, 2, 3, 0, 0}

// 全部初始化为0
int arr2[5] = {0};  
// 结果: {0, 0, 0, 0, 0}

// 全部初始化为0（更简洁）
int arr3[5] = {};
// 结果: {0, 0, 0, 0, 0}
```

<div class="p-4 bg-green-50 dark:bg-green-900 rounded mt-4 text-sm">

💡 **技巧：** 用 `{0}` 快速将数组全部初始化为0

</div>

---

# 多维数组：二维数组

二维数组就像一个表格，有行和列

```cpp
#include <iostream>
using namespace std;

int main() {
    // 声明并初始化 2x3 的二维数组（2行3列）
    int matrix[2][3] = {
        {1, 2, 3},  // 第一行
        {4, 5, 6}   // 第二行
    };
    
    // 使用嵌套循环访问
    cout << "Matrix:" << endl;
    for (int i = 0; i < 2; i++) {      // 遍历行
        for (int j = 0; j < 3; j++) {  // 遍历列
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

---

# 字符数组和字符串（1）

C 风格字符串以**空字符 `\0`** 结尾

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    // 字符数组声明
    char str1[10] = "Hello";  // 最多 9 个字符 + '\0'
    char str2[] = "World";    // 自动计算大小
    
    cout << "str1: " << str1 << endl;
    
    // 字符串长度（使用 strlen）
    cout << "Length: " << strlen(str1) << endl;
    
    return 0;
}
```

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mt-4 text-sm">

⚠️ **注意：** C 风格字符串必须以 `\0` 结尾，否则函数无法正确识别字符串的结束位置

</div>

---

# 字符数组和字符串（2）

字符串的复制和连接操作

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char str1[] = "Hello";
    char str2[] = "World";
    char str3[20];  // 确保有足够空间
    
    // 字符串复制
    strcpy(str3, str1);
    cout << "Copied: " << str3 << endl;
    
    // 字符串连接
    strcat(str3, " ");    // 添加空格
    strcat(str3, str2);   // 连接 str2
    cout << "Concatenated: " << str3 << endl;
    
    return 0;
}
```

**输出：** `Copied: Hello`, `Concatenated: Hello World`

---

# 数组作为函数参数（1）

数组传递给函数时会退化为**指针**

```cpp
#include <iostream>
using namespace std;

// 函数：打印数组元素
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printArray(numbers, size);  // 输出: 1 2 3 4 5
    
    return 0;
}
```

<div class="p-4 bg-yellow-50 dark:bg-yellow-900 rounded mt-2 text-sm">

⚠️ **重要：** 必须同时传递数组大小，因为函数内部无法获取数组的原始大小

</div>

---

# 数组作为函数参数（2）

函数可以**直接修改原数组**

```cpp
#include <iostream>
using namespace std;

// 修改数组元素（会影响原数组）
void doubleArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] *= 2;  // 将每个元素翻倍
    }
}

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int size = 5;
    
    cout << "Before: 1 2 3 4 5" << endl;
    doubleArray(numbers, size);
    cout << "After: 2 4 6 8 10" << endl;
    
    return 0;
}
```

---

# 数组的常见操作（1）

### 查找元素

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    // 查找元素
    int target = 25;
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            cout << "Found " << target 
                 << " at index " << i << endl;
            break;  // 找到后停止
        }
    }
    
    return 0;
}
```

**输出：** `Found 25 at index 2`

---

# 数组的常见操作（2）

### 求和与平均值

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    // 求和
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    cout << "Sum: " << sum << endl;
    
    // 平均值（注意类型转换）
    double avg = (double)sum / size;
    cout << "Average: " << avg << endl;
    
    return 0;
}
```

**输出：** `Sum: 258`, `Average: 36.86`

---

# 数组的常见操作（3）

### 数组反转

交换两端元素，向中间靠拢

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    // 反转数组：交换首尾元素
    for (int i = 0; i < size / 2; i++) {
        swap(arr[i], arr[size - 1 - i]);
    }
    
    // 输出结果
    for (int n : arr) cout << n << " ";
    
    return 0;
}
```

**输出：** `90 11 22 12 25 34 64` （已反转）

---

# 数组的限制（1）

### ⚠️ 固定大小 - 越界访问很危险

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[5];  // 只有索引 0 到 4
    
    // arr[5] = 10;  // ❌ 越界！索引 5 不存在
    // arr[10] = 20; // ❌ 越界！可能导致程序崩溃
    
    // ✅ 使用常量定义大小
    const int N = 1000;
    int my_array[N];
    
    // ✅ 始终检查索引范围
    for (int i = 0; i < 5; i++) {  // 确保 i < 5
        arr[i] = i * 10;
    }
    
    return 0;
}
```

---

# 数组的限制（2）

### ❌ 不能直接复制

```cpp
int arr1[5] = {1, 2, 3, 4, 5};
int arr2[5];

// arr2 = arr1;  // ❌ 错误！不能直接赋值

// ✅ 正确方法：逐个复制
for (int i = 0; i < 5; i++) {
    arr2[i] = arr1[i];
}
```

<div class="p-3 bg-yellow-50 dark:bg-yellow-900 rounded mt-3 text-sm">

💡 **提示：** C++ 标准库的 `std::array` 或 `std::vector` 支持直接复制

</div>

---

# 数组的限制（3）

### ❌ 不能直接返回

```cpp
// ❌ 错误示范：返回局部数组
// int[] getArray() {
//     int arr[5] = {1, 2, 3, 4, 5};
//     return arr;  // 危险！返回局部数组的地址
// }
```

<div class="mt-4">

### ✅ 正确方法

1. **通过参数传递**（推荐）
2. **使用 static 数组**（可能有副作用）
3. **使用动态内存分配**（需要手动释放）
4. **使用 STL 容器**（最推荐，如 `vector`）

</div>

---

# 常见错误示例（1）

### 数组越界

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    
    // 尝试访问不存在的索引
    cout << arr[10] << endl;  // ❌ 未定义行为！
    
    // 可能输出：
    // - 随机数字
    // - 程序崩溃（段错误）
    // - 看似"正常"但实际已损坏
    
    return 0;
}
```

---

# 常见错误示例（2）

### 未初始化的数组

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[5];  // 未初始化！
    
    // 打印垃圾值
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << " ";  // 输出随机数
    }
    cout << endl;
    
    // ✅ 正确做法：初始化
    int arr2[5] = {0};  // 全部初始化为 0
    
    return 0;
}
```

---

# 常见错误示例（3）

### 字符串缓冲区溢出

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char str[5];  // 只能容纳 4 个字符 + '\0'
    
    // "Hello World" 有 11 个字符 + '\0' = 12 字节
    strcpy(str, "Hello World");  // ❌ 缓冲区溢出！
    
    cout << str << endl;
    
    // 可能后果：
    // - 程序崩溃
    // - 数据损坏
    // - 安全漏洞
    
    // ✅ 使用 C++ string 更安全
    string s = "Hello World";
    
    return 0;
}
```

---
layout: center
class: text-center
---

# 总结

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 基础概念

- I/O 输入输出
- 变量与数据类型
- 注释与常量

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 控制流

- 选择结构（if/switch）
- 循环结构（for/while）
- 跳转语句（break/continue）

</div>

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900 rounded mt-6">

### 数组

- 一维数组、多维数组
- 数组初始化与操作
- 常见陷阱与注意事项

</div>

<div class="mt-8 text-2xl">

🎉 恭喜你完成 C++ 基础学习！

</div>

---
layout: center
class: text-center
---

# 想要更详细的内容？

<div class="mt-8 text-xl">

📖 **完整教程文档**

查看更详细的 C++ 基础教程，包含更多示例和深入讲解

<div class="mt-6">
  <a href="/resource/cpp" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block">
    查看完整文档 →
  </a>
</div>

</div>

---
layout: end
---

# 谢谢观看

继续学习，持续进步 💪
