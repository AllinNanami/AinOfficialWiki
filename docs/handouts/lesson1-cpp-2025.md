---
title: C++ 输入与输出基础
description: 第 1 课第 1 章：讲解 C++ 标准输入输出（cin/cout、endl、格式化输出）与常见输入陷阱，并介绍 C 风格 I/O（printf/scanf）。
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---
# 一.C++ 输入与输出基础

在 C++ 中，输入与输出（Input/Output, 简称 I/O）是程序与外界（如用户、文件、网络）交换信息的核心机制。你可以把它想象成程序与你对话的"嘴巴"（输出）和"耳朵"（输入）。

C++ 提供了两种主要的 I/O 方式：

1. **C++ 风格 I/O（`<iostream>`）**：这是 C++ 的标准方式，基于“流”（Stream）的概念，是面向对象的、类型安全的。
2. **C 风格 I/O（`<cstdio>`）**：继承自 C 语言，基于函数（如 `printf` 和 `scanf`），在某些特定场合（如算法竞赛）因其格式化能力和潜在速度而被使用。

我们将从 C++ 风格的 `<iostream>` 开始，然后介绍 C 风格的 `<cstdio>`。



## 1.C++ 标准 I/O（`<iostream>`）



要使用 C++ 风格的 I/O，你必须包含 `<iostream>` 头文件。它为你提供了两个核心对象：`cin`（标准输入流，通常是键盘）和 `cout`（标准输出流，通常是屏幕）。



### 基本输出：`cout`



`cout` 与“插入运算符”（`<<`）配合使用，将数据“插入”到输出流中。

C++

```
#include <iostream> // 包含输入输出流头文件

// 'std' 是一个命名空间，cout 和 endl 都在里面。
// "using namespace std;" 可以让我们在下面直接写 cout，
// 否则你需要写 std::cout 和 std::endl。
// 在大型项目中不推荐全局使用，但在教学和简单程序中很常见。
using namespace std; 

int main() {
    // 声明并初始化一个变量
    int age = 20;
    
    // 1. 打印字符串字面量
    cout << "Hello, C++!";
    
    // 2. 打印换行符 '\n'
    // '\n' 是一个转义字符，代表换行
    cout << '\n'; 
    
    // 3. 打印变量
    cout << "Your age is: ";
    cout << age;
    cout << '\n';
    
    // 4. 链式调用：将多个输出连接在一起
    cout << "Next year, you will be: " << (age + 1) << '\n';
    
    // 5. 使用 endl (end line)
    // endl 的作用是：1. 换行 2. 刷新输出缓冲区
    // 刷新缓冲区能确保你立即看到输出，但频繁使用可能比 '\n' 慢
    cout << "Goodbye!" << endl;
    
    return 0;
}
```

**运行结果示例:**

```
Hello, C++!
Your age is: 20
Next year, you will be: 21
Goodbye!
```



### 基本输入：`cin`



`cin` 与“提取运算符”（`>>`）配合使用，从输入流中“提取”数据并存入变量。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 声明变量，准备接收输入
    int age;
    double height;
    
    // 提示用户输入
    cout << "Please enter your age: ";
    
    // 1. 从键盘读取一个整数，存入 'age'
    // cin 会自动跳过开头的空白（空格、Tab、换行）
    // 然后读取数据，直到遇到下一个空白或无效字符
    cin >> age;
    
    cout << "Your age is: " << age << endl;
    
    // 2. 链式读取：一次读取多个值
    // cin 会按顺序等待输入
    cout << "Enter your age and height (separated by a space): ";
    cin >> age >> height;
    
    cout << "New age: " << age << ", Height: " << height << endl;
    
    return 0;
}
```

**运行结果示例 (用户输入 25，然后输入 30 1.75):**

```
Please enter your age: 25
Your age is: 25
Enter your age and height (separated by a space): 30 1.75
New age: 30, Height: 1.75
```

------



## 2.C 风格 I/O（`<cstdio>`）



要使用 C 风格的 I/O，你需要包含 `<cstdio>` 头文件（在 C 语言中是 `<stdio.h>`）。它提供了 `printf`（格式化输出）和 `scanf`（格式化输入）等函数。



### C 风格输出：`printf`



`printf`（print formatted）函数允许你按照指定的“格式化字符串”来输出数据。

- 它通过**格式说明符**（format specifier，以 `%` 开头）来指定后续变量应被如何格式化。

| **说明符** | **类型** | **示例**                            |
| ---------- | -------- | ----------------------------------- |
| `%d`       | `int`    | 整数                                |
| `%f`       | `double` | 浮点数                              |
| `%lf`      | `double` | (在 `printf` 中 `%f` 和 `%lf` 相同) |
| `%c`       | `char`   | 单个字符                            |
| `%s`       | `char*`  | C 风格字符串                        |

C++

```
#include <cstdio> // 包含 C 风格 I/O 头文件

int main() {
    int age = 20;
    double height = 1.78;
    char grade = 'A';
    char name[] = "Alice"; // C 风格字符串（字符数组）
    
    // 1. 打印普通文本，使用 \n 换行
    printf("Hello, C-style output!\n");
    
    // 2. 打印变量
    // %d 会被 age 的值替换
    printf("Age: %d\n", age); 
    
    // 3. 打印多个变量
    // 格式说明符必须与变量的类型和顺序一一对应
    printf("Name: %s, Grade: %c, Height: %f\n", name, grade, height);
    
    // 4. 格式化：控制浮点数精度
    // %.2f 表示保留两位小数
    printf("Height (2 decimal places): %.2f\n", height);
    
    return 0;
}
```

**运行结果示例:**

```
Hello, C-style output!
Age: 20
Name: Alice, Grade: A, Height: 1.780000
Height (2 decimal places): 1.78
```



### C 风格输入：`scanf`



`scanf`（scan formatted）函数按照格式化字符串从标准输入读取数据。

**极其重要：** `scanf` 在读取数据到变量时，**必须**传递变量的**内存地址**。我们使用“取地址运算符”（`&`）来获取地址。

C++

```
#include <cstdio>

int main() {
    int age;
    double height;
    
    printf("Please enter your age: ");
    
    // 1. 读取一个整数
    // 注意：我们传递的是 &age (age 的地址)，而不是 age
    // scanf 会将读取到的值放入该地址对应的内存中
    scanf("%d", &age);
    
    printf("Your age is: %d\n", age);
    
    // 2. 读取多个值
    // %lf 用于读取 double 类型
    printf("Enter your age and height (separated by a space): ");
    scanf("%d %lf", &age, &height);
    
    printf("New age: %d, Height: %.2lf\n", age, height);
    
    // 3. 读取 C 风格字符串（字符数组）
    // 特例：数组名本身就代表地址，所以不需要 &
    char name[50];
    printf("Enter your name: ");
    scanf("%s", name); // 注意：name 前没有 &
    
    printf("Hello, %s!\n", name);
    
    return 0;
}
```

**运行结果示例 (用户输入 25，然后输入 30 1.75，然后输入 Bob):**

```
Please enter your age: 25
Your age is: 25
Enter your age and height (separated by a space): 30 1.75
New age: 30, Height: 1.75
Enter your name: Bob
Hello, Bob!
```



## 3.性能问题

**性能提示：** 在算法竞赛中，如果 I/O 量非常大，`cin`/`cout` 默认的同步可能导致超时。可以通过在 `main` 函数开头添加 `std::ios::sync_with_stdio(false); std::cin.tie(NULL);` 来关闭同步，使其速度与 `scanf`/`printf` 媲美。



------

## 4.处理整行输入（带空格的字符串）



`cin` 和 `scanf("%s", ...)` 的一个共同问题是：它们遇到**空格**就会停止读取。



### `getline`



要读取一整行（包括空格），我们使用 `getline` 函数。它需要 `<string>` 头文件。

C++

```
#include <iostream>
#include <string> // 必须包含 <string> 才能使用 std::string 和 getline
using namespace std;

int main() {
    string name;
    
    cout << "Please enter your full name: ";
    
    // getline(cin, variable)
    // 它会从 cin 读取一行，存入 name，直到遇到换行符
    getline(cin, name); 
    
    cout << "Hello, " << name << "!" << endl;
    
    return 0;
}
```

**运行结果示例 (用户输入 "John Doe"):**

```
Please enter your full name: John Doe
Hello, John Doe!
```

------



## 5.I/O 的常见陷阱和注意事项



1. scanf 忘记 &

   这是 C 风格 I/O 中最致命的错误。

   C++

   ```
   int age;
   // 错误！没有 &。程序会尝试写入一个无效的内存地址
   // 极有可能导致 "段错误" (Segmentation Fault) 或程序崩溃
   scanf("%d", age); 
   
   // 正确
   scanf("%d", &age);
   ```

2. cin 和 getline 混用

   这是一个非常隐蔽的陷阱。

   C++

   ```
   int id;
   string name;
   
   cout << "Enter ID: ";
   cin >> id; // 用户输入 101，然后按回车
   
   // 此时，'101' 被 cin 读取了，
   // 但是换行符 '\n' 仍然留在输入缓冲区中
   
   cout << "Enter name: ";
   // getline 立即读到了那个被留下的 '\n'
   // 它认为这一行已经结束了，所以 name 是空的
   getline(cin, name); 
   
   cout << "ID: " << id << ", Name: '" << name << "'" << endl;
   
   // 运行结果:
   // Enter ID: 101
   // Enter name: ID: 101, Name: '' 
   ```

   **解决方法：** 在 `getline` 之前，使用 `cin.ignore()` 清除缓冲区中多余的换行符。

   C++

   ```
   // ...
   cin >> id; 
   cin.ignore(); // 忽略掉缓冲区里的一个字符（那个换行符）
   getline(cin, name); // 现在就可以正常工作了
   // ...
   ```

3. printf / scanf 格式与类型不匹配

   编译器通常会警告，但不会阻止你。

   C++

   ```
   // 错误：用 %d (整数) 打印 %f (浮点数)
   printf("%d", 3.14); // 输出垃圾值
   
   // 错误：用 %f (浮点数) 打印 %d (整数)
   printf("%f", 10); // 输出垃圾值
   
   int x;
   // 错误：用 %f 读取整数
   scanf("%f", &x); // 结果未定义
   ```

4. scanf("%s", ...) 的缓冲区溢出

   scanf("%s", ...) 不知道你的字符数组有多大，它会一直读取直到遇到空白。

   C++

   ```
   #include <cstdio>
   
   int main() {
       // 只能安全存储 9 个字符 + 1 个 '\0'
       char str[10]; 
   
       printf("Enter a long string: ");
   
       // 如果用户输入 "HelloWorldThisIsTooLong"
       // scanf 会写入超过 10 个字节，破坏程序内存
       // 这是一个严重的安全漏洞！
       scanf("%s", str); 
   
       return 0;
   }
   ```

   **解决方法：** 使用 C++ 的 `std::string` 和 `cin`，它们会自动管理内存，没有溢出风险。或者在 C 风格中指定宽度 `scanf("%9s", str);`。
