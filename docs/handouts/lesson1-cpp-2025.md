# 一.C++ 输入与输出基础



在 C++ 中，输入与输出（Input/Output, 简称 I/O）是程序与外界（如用户、文件、网络）交换信息的核心机制。你可以把它想象成程序与你对话的“嘴巴”（输出）和“耳朵”（输入）。

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



# 三.C++ 控制流基础



在 C++ 中，**控制流**（Control Flow）指的是程序代码执行的顺序。默认情况下，代码是从上到下、逐行执行的，这称为**顺序结构**。

然而，程序通常需要更复杂的逻辑：

1. **选择**：根据某个条件，决定执行哪一段代码。
2. **循环**：重复执行某一段代码，直到满足某个条件才停止。

控制流语句就是用来实现这些“选择”和“循环”的工具，让你能够指挥程序的执行路径。



## 1. 选择结构（Conditional Statements）



选择结构允许你的程序在“岔路口”做出决定。



### `if` 语句



`if` 语句是最基本的选择结构。如果圆括号 `()` 中的条件为 `true`，就执行花括号 `{}` 中的代码。

C++

```
#include <iostream>
using namespace std;

int main() {
    int age = 18;
    
    cout << "Checking age..." << endl;
    
    // 如果 age 大于等于 18
    if (age >= 18) {
        cout << "You are an adult." << endl;
    }
    
    cout << "Check complete." << endl;
    return 0;
}
```

**运行结果示例:**

```
Checking age...
You are an adult.
Check complete.
```



### `if-else` 语句



`if-else` 提供了一个“二选一”的路径。如果 `if` 条件为 `true`，执行 `if` 块；否则（`else`），执行 `else` 块。

C++

```
#include <iostream>
using namespace std;

int main() {
    int number = 7;
    
    // 检查一个数是奇数还是偶数
    // % 是取模运算符，number % 2 == 0 意为 "number 除以 2 的余数是否为 0"
    if (number % 2 == 0) {
        cout << number << " is even." << endl;
    } else {
        cout << number << " is odd." << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```
7 is odd.
```



### `if-else if-else` 语句



当你需要处理多个“岔路口”（多种可能）时，可以使用 `if-else if-else` 结构。它会按顺序检查每个条件，一旦找到一个为 `true` 的条件，就执行对应的代码块，然后跳过所有剩余的 `else if` 和 `else`。

C++

```
#include <iostream>
using namespace std;

int main() {
    int score = 85;
    
    if (score >= 90) {
        cout << "Grade: A" << endl;
    } else if (score >= 80) { // 运行到这里时，score 必然 < 90
        cout << "Grade: B" << endl;
    } else if (score >= 70) { // 运行到这里时，score 必然 < 80
        cout << "Grade: C" << endl;
    } else { // 运行到这里时，score 必然 < 70
        cout << "Grade: F" << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```
Grade: B
```



### `switch-case` 语句



`switch` 语句是一种特殊化的选择结构。它专门用于检查**一个变量**是否等于一系列**常量值**。

- `switch` 后面跟的 `(variable)` 是你要检查的变量（通常是整数或字符）。
- `case value:` 是你期望的常量值。
- `break;` **非常重要！** 它告诉程序在执行完这个 `case` 的代码后，立即**跳出**整个 `switch` 结构。
- **如果没有 `break;`**，程序会“穿透”到下一个 `case` 并继续执行，这通常不是我们想要的。
- `default:` 类似于 `else`，如果没有任何一个 `case` 匹配，就会执行 `default` 块。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 1=Start, 2=Load, 3=Exit
    int choice = 2; 
    
    switch (choice) {
        case 1:
            cout << "Starting new game..." << endl;
            break; // 跳出 switch
        case 2:
            cout << "Loading game..." << endl;
            break; // 跳出 switch
        case 3:
            cout << "Exiting..." << endl;
            break; // 跳出 switch
        default: // 如果 choice 不是 1, 2, 或 3
            cout << "Invalid choice." << endl;
            break;
    }
    
    return 0;
}
```

**运行结果示例:**

```
Loading game...
```



### 三元运算符 (?:)



这是一个 if-else 的简洁写法，常用于给变量赋值。

语法：result = (condition) ? value_if_true : value_if_false;

C++

```
#include <iostream>
#include <string> // 需要 string 头文件
using namespace std;

int main() {
    int age = 20;
    string status;

    // 传统 if-else
    // if (age >= 18) {
    //     status = "Adult";
    // } else {
    //     status = "Minor";
    // }

    // 使用三元运算符
    status = (age >= 18) ? "Adult" : "Minor";

    cout << "Status: " << status << endl;
    return 0;
}
```

**运行结果示例:**

```
Status: Adult
```

------



## 2. 循环结构（Iteration Statements）



循环结构允许你重复执行同一段代码。



### `for` 循环



for 循环是最常用的循环结构，尤其适用于当你提前知道要循环多少次时。

它由三个部分组成，用分号 ; 隔开：

1. **初始化 (init):** 循环开始前执行一次（例如：`int i = 0`）。
2. **条件 (condition):** 每次循环开始前检查（例如：`i < 5`）。如果为 `true`，执行循环体；如果为 `false`，退出循环。
3. **更新 (update):** 每次循环体执行**之后**执行（例如：`i++`，即 `i = i + 1`）。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 打印 0 到 4
    // 1. 初始化: int i = 0
    // 2. 检查: 0 < 5 (True) -> 执行 cout -> 更新: i 变为 1
    // 3. 检查: 1 < 5 (True) -> 执行 cout -> 更新: i 变为 2
    // ...
    // 5. 检查: 4 < 5 (True) -> 执行 cout -> 更新: i 变为 5
    // 6. 检查: 5 < 5 (False) -> 退出循环
    for (int i = 0; i < 5; i++) {
        cout << "i = " << i << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```
i = 0
i = 1
i = 2
i = 3
i = 4
```



### `while` 循环



`while` 循环适用于**你不知道要循环多少次，只知道循环的终止条件**时。

它在每次循环开始前检查条件，只要条件为 `true`，就不断执行循环体。

C++

```
#include <iostream>
using namespace std;

int main() {
    int countdown = 3;
    
    // 只要 countdown 大于 0，就继续循环
    while (countdown > 0) {
        cout << "Countdown: " << countdown << endl;
        // 必须在循环体内手动更新条件变量，否则会造成“死循环”！
        countdown--; // countdown = countdown - 1
    }
    
    cout << "Liftoff!" << endl;
    return 0;
}
```

**运行结果示例:**

```
Countdown: 3
Countdown: 2
Countdown: 1
Liftoff!
```



### `do-while` 循环



do-while 循环与 while 循环类似，但它保证循环体至少被执行一次。

因为它先执行 do 块中的代码，然后才在 while() 中检查条件。

C++

```
#include <iostream>
using namespace std;

int main() {
    int choice;
    
    // 至少执行一次菜单
    do {
        cout << "--- Menu ---" << endl;
        cout << "1. Play" << endl;
        cout << "2. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;
        
        if (choice == 1) {
            cout << "Playing game..." << endl;
        }
        
    // 只要用户不输入 2，就一直重复循环
    } while (choice != 2); 
    // 注意：do-while 循环末尾必须有分号 ;
    
    cout << "Goodbye!" << endl;
    return 0;
}
```

**运行结果示例 (用户输入 1，然后输入 2):**

```
--- Menu ---
1. Play
2. Exit
Enter your choice: 1
Playing game...
--- Menu ---
1. Play
2. Exit
Enter your choice: 2
Goodbye!
```



### 范围 `for` 循环 (C++11)



这是一种现代 C++ 的写法，用于方便地遍历一个“集合”（如数组、`std::string`、`std::vector` 等）中的所有元素。

C++

```
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    
    // 语法：for (元素类型 变量名 : 集合)
    // 循环会自动遍历 arr 中的每一个元素
    // 第一次循环, n = 10
    // 第二次循环, n = 20
    // ...
    for (int n : arr) {
        cout << n << " ";
    }
    cout << endl;
    
    return 0;
}
```

**运行结果示例:**

```
10 20 30 40 50 
```

------



## 3. 跳转语句（Jump Statements）



跳转语句允许你无条件地改变程序的执行流程。



### `break`



`break` 语句有两个主要用途：

1. 在 `switch` 语句中，用来跳出 `switch` 块。
2. 在循环（`for`, `while`, `do-while`）中，用来**立即终止并跳出整个循环**。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 在数组中查找数字 22
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    
    for (int n : arr) {
        if (n == 22) {
            cout << "Found 22!" << endl;
            break; // 找到了，没必要继续循环，立即跳出 for 循环
        }
        cout << "Checking " << n << "..." << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```
Checking 64...
Checking 34...
Checking 25...
Checking 12...
Found 22!
```



### `continue`



`continue` 语句用于循环中，它会**立即跳过当前这一次循环的剩余代码**，并直接开始**下一次循环**（即 `for` 循环的“更新”或 `while` 循环的“条件检查”）。

C++

```
#include <iostream>
using namespace std;

int main() {
    // 只打印 1 到 10 之间的偶数
    for (int i = 1; i <= 10; i++) {
        // 如果 i 是奇数
        if (i % 2 != 0) {
            continue; // 跳过本次循环的 cout 语句，直接去做 i++
        }
        
        // 这行代码只有在 i 不是奇数时（即 continue 未执行时）才会运行
        cout << i << " "; 
    }
    cout << endl;
    
    return 0;
}
```

**运行结果示例:**

```
2 4 6 8 10 
```



### `return`



`return` 语句用于**跳出整个函数**。

- 当 `return` 在 `main` 函数中被调用时，它会结束整个程序。
- 在其他函数中，它会结束该函数，并（可选地）返回一个值给调用者。

C++

```
#include <iostream>
using namespace std;

// 检查年龄的函数
void checkAge(int age) {
    if (age < 0) {
        cout << "Error: Invalid age." << endl;
        return; // 发现错误，立即跳出 checkAge 函数
    }
    
    if (age >= 18) {
        cout << "Access granted." << endl;
    } else {
        cout << "Access denied." << endl;
    }
}

int main() {
    checkAge(25);
    checkAge(-5); // "Error..." 并 return
    checkAge(15); // "Access denied."
    
    return 0; // 结束 main 函数，程序终止
}
```

**运行结果示例:**

```
Access granted.
Error: Invalid age.
Access denied.
```



#  四.数组基础

在 C++ 中，**数组（Arrays）是一种用来存储固定大小、相同类型元素**的连续内存空间的数据结构。你可以把它想象成一系列排好队的小格子，每个格子都装着同一类东西。

-----

## 数组的声明和初始化

在使用数组前，我们首先要**声明**它，告诉编译器数组叫什么名字、能装多少个元素、以及元素是什么类型。**初始化**则是在声明的同时或之后给数组元素赋予初始值。

### 基本数组声明

要声明一个数组，你需要指定元素的**数据类型**、数组的**名称**以及它能容纳的**元素数量（大小）**。

```cpp
#include <iostream> 

using namespace std; 

int main() {
    // 声明一个包含5个整数的数组，名为 'numbers'
    // 此时，数组中的5个位置已经被分配，但里面的值是不确定的（通常是“垃圾值”）
    int numbers[5]; 
    
    // 初始化数组元素：逐个赋值
    // 数组的索引（下标）从0开始，这意味着第一个元素是 numbers[0]，
    // 第二个是 numbers[1]，以此类推。
    numbers[0] = 10;
    numbers[1] = 20;
    numbers[2] = 30;
    numbers[3] = 40;
    numbers[4] = 50; // 因为数组大小是5，所以最后一个元素的索引是 4 (即 5 - 1)

    // 访问数组元素：使用循环遍历并打印每个元素
    // 循环条件 i < 5 确保我们不会访问到数组范围之外的内存，
    // 因为索引最大只到 4。
    for (int i = 0; i < 5; i++) {
        cout << "numbers[" << i << "] = " << numbers[i] << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```
numbers[0] = 10
numbers[1] = 20
numbers[2] = 30
numbers[3] = 40
numbers[4] = 50
```

### 数组初始化方法

C++ 提供了多种方便的方式来初始化数组，让你的代码更简洁。

```cpp
#include <iostream> 
using namespace std; 

int main() {
    // 方法1：使用初始化列表
    // 这是最常见和推荐的方式。编译器会根据列表中的元素数量自动确定数组大小，
    // 或者如果你指定了大小，它会检查是否匹配。
    int arr1[5] = {1, 2, 3, 4, 5}; 
    
    // 方法2：自动计算大小
    // 当你不确定数组需要多大，或者想让编译器帮你数时，可以省略方括号里的数字。
    // 编译器会自动计算出 arr2 的大小是 5。
    int arr2[] = {10, 20, 30, 40, 50}; 
    
    // 方法3：部分初始化（其余元素为0）
    // 如果初始化列表中的元素数量少于数组声明的大小，
    // 那么剩余的元素会自动被初始化为0。
    int arr3[5] = {1, 2, 3}; // arr3 将是 {1, 2, 3, 0, 0}
    
    // 方法4：全部初始化为0
    // 这是一个便捷的方法，将数组的所有元素都初始化为0。
    int arr4[5] = {0}; // arr4 将是 {0, 0, 0, 0, 0}
    
    // 方法5：C++11 统一初始化（推荐的现代C++写法）
    // C++11 引入了花括号 {} 作为通用的初始化方式，语法更统一，更安全。
    // 当然有些比赛（比如蓝桥杯）或者做题网站可能使用C++98、C++6之类的老引擎，这时就用不了这种方法了。
    int arr5[5]{1, 2, 3, 4, 5}; // 功能与方法1相同

    // 输出 arr1 的内容
    cout << "arr1: ";
    for (int i = 0; i < 5; i++) {
        cout << arr1[i] << " ";
    }
    cout << endl; 
    
    // 输出 arr3 的内容，观察未初始化的元素是否为0
    cout << "arr3: ";
    for (int i = 0; i < 5; i++) {
        cout << arr3[i] << " ";
    }
    cout << endl; 
    
    return 0;
}
```

**运行结果示例:**

```
arr1: 1 2 3 4 5 
arr3: 1 2 3 0 0 
```

-----

**关键点回顾：**

  * **索引从0开始：** 如果数组有 N 个元素，它们的索引是 `0` 到 `N-1`。
  * **固定大小：** C++ 中的普通数组一旦声明，其大小就固定了，不能在运行时改变。
  * **内存连续：** 数组的元素在内存中是紧挨着存放的，这使得访问速度非常快。

-----


## 多维数组

多维数组可以看作是“数组的数组”。最常见的是二维数组（如表格或矩阵）和三维数组（如立方体或空间网格）。

### 二维数组

**二维数组**就像一个表格，有行和列，横的是行，竖的是列。声明时，你需要指定行数和列数。访问元素时，则需要两个索引：`[行索引][列索引]`。

```cpp
#include <iostream>
using namespace std; 

int main() {
    // 声明并初始化一个 2x3 的二维数组 (2行, 3列)
    // 它可以被想象成：
    // [1, 2, 3]
    // [4, 5, 6]
    int matrix[2][3] = {
        {1, 2, 3}, // 第一行（索引 0）
        {4, 5, 6}  // 第二行（索引 1）
    };
    
    // 访问二维数组元素
    // 外层循环控制行，内层循环控制列
    for (int i = 0; i < 2; i++) { // 遍历行 (i 从 0 到 1)
        for (int j = 0; j < 3; j++) { // 遍历列 (j 从 0 到 2)
            cout << "matrix[" << i << "][" << j << "] = " << matrix[i][j] << endl;
        }
    }
    
    // 打印矩阵形式：更直观地显示二维数组内容
    cout << "\nMatrix:" << endl; 
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << matrix[i][j] << " "; 
        }
        cout << endl; 
    }
    
    return 0;
}
```

**运行结果示例:**

```
matrix[0][0] = 1
matrix[0][1] = 2
matrix[0][2] = 3
matrix[1][0] = 4
matrix[1][1] = 5
matrix[1][2] = 6

Matrix:
1 2 3 
4 5 6 
```

-----

### 三维数组

**三维数组**可以看作是二维数组的集合，或者说是一个“立方体”。你需要三个索引来定位一个元素：`[第一维索引][第二维索引][第三维索引]`。

>你可以这样理解这些索引：
>
>* **第一维索引**：这相当于你**堆叠的二维数组的层数**。想象你把多个二维表格（像Excel工作表）一个接一个地叠起来，第一维索引就是用来选择你要看哪一张表格。
>* **第二维索引**：在你选定的那一张二维表格（层）里，这代表着表格的**行数**。
>* **第三维索引**：这代表着表格中具体某一行里的**列数**。

---

```cpp
#include <iostream>
using namespace std;

int main() {
    // 声明并初始化一个 2x3x2 的三维数组 (2层, 每层3行, 每行2列)
    int cube[2][3][2] = {
        // 第一层（索引 0）
        {
            {1, 2},  // 0,0,x
            {3, 4},  // 0,1,x
            {5, 6}   // 0,2,x
        },
        // 第二层（索引 1）
        {
            {7, 8},  // 1,0,x
            {9, 10}, // 1,1,x
            {11, 12} // 1,2,x
        }
    };
    
    // 访问三维数组元素：使用三层嵌套循环
    for (int i = 0; i < 2; i++) {   // 遍历第一维 (层)
        for (int j = 0; j < 3; j++) { // 遍历第二维 (行)
            for (int k = 0; k < 2; k++) { // 遍历第三维 (列)
                cout << "cube[" << i << "][" << j << "][" << k 
                     << "] = " << cube[i][j][k] << endl;
            }
        }
    }
    
    return 0;
}
```

**运行结果示例:**

```
cube[0][0][0] = 1
cube[0][0][1] = 2
cube[0][1][0] = 3
cube[0][1][1] = 4
cube[0][2][0] = 5
cube[0][2][1] = 6
cube[1][0][0] = 7
cube[1][0][1] = 8
cube[1][1][0] = 9
cube[1][1][1] = 10
cube[1][2][0] = 11
cube[1][2][1] = 12
```

-----

## 字符数组和字符串

在 C++ 中，**字符串**通常以两种方式表示：C 风格字符串（即**字符数组**）和 C++ 标准库中的 `std::string`。这里我们先关注基础的字符数组,`std::string` 将在后面的课程中学习，感兴趣的同学可以提前了解一下。

**字符数组**是 `char` 类型元素的数组，用来存储一系列字符。一个 C 风格字符串以**空字符 `\0`** 结尾，这个空字符标志着字符串的结束。

```cpp
#include <iostream>
#include <cstring> 
using namespace std;

int main() {
    // 字符数组声明和初始化
    // char str1[10] 可以存储最多9个字符 + 1个空字符\0
    char str1[10] = "Hello"; 
    // char str2[] 编译器会自动计算大小，包括空字符\0
    char str2[] = "World"; 
    
    // 直接打印字符数组，cout 会识别并打印直到遇到空字符为止
    cout << "str1: " << str1 << endl;
    cout << "str2: " << str2 << endl;
    
    // 字符串长度：使用 strlen() 函数 (来自 <cstring>)
    // 它返回字符串中字符的数量，不包括终止空字符。
    cout << "Length of str1: " << strlen(str1) << endl; 
    
    // 字符串复制：使用 strcpy() 函数 (来自 <cstring>)
    // 将 str1 的内容复制到 str3。str3 必须有足够的空间。
    char str3[20]; // 声明一个足够大的字符数组
    strcpy(str3, str1); 
    cout << "str3 (copied): " << str3 << endl;
    
    // 字符串连接：使用 strcat() 函数 (来自 <cstring>)
    // 将一个字符串连接到另一个字符串的末尾。
    strcat(str3, " "); // 在 str3 后连接一个空格
    strcat(str3, str2); // 在 str3 后连接 str2 的内容
    cout << "str3 (concatenated): " << str3 << endl;
    
    // 字符串比较：使用 strcmp() 函数 (来自 <cstring>)
    // 如果两个字符串相等，返回0。否则返回非0值。
    if (strcmp(str1, str2) == 0) {
        cout << "str1 equals str2" << endl;
    } else {
        cout << "str1 does not equal str2" << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```
str1: Hello
str2: World
Length of str1: 5
str3 (copied): Hello
str3 (concatenated): Hello World
str1 does not equal str2
```

-----

**多维数组和字符数组的总结：**

  * **多维数组**通过增加方括号来扩展维度，每个维度都有自己的索引。它适用于表示表格、图像、游戏地图等需要多个坐标来定位的数据。
  * **字符数组**是 C++ 中处理字符串的传统方式，需要特别注意字符串末尾的**空字符 `\0`**。操作字符数组时，通常会用到 `<cstring>` 库中的函数（如 `strlen`, `strcpy`, `strcat`, `strcmp`）。

-----



## 数组作为函数参数

在 C++ 中，当你将一个数组传递给函数时，实际上数组会“退化”成一个指向其第一个元素的**指针**。这意味着函数接收到的是数组的内存地址，而不是数组的完整副本。

这个特性有几个重要的含义：

1.  **不会复制整个数组**：这对于大型数组来说非常高效，避免了不必要的内存开销和复制时间。
2.  **函数可以修改原始数组**：由于函数接收的是地址，它可以通过这个地址直接访问并修改原始数组中的元素。这种行为被称为“传引用”（pass-by-reference）的效果，尽管技术上数组是“传值”了一个指针。
3.  **需要传递数组大小**：因为数组退化成了指针，函数内部无法直接知道数组的原始大小。因此，通常需要额外传递一个参数来表示数组的元素数量。


```cpp
#include <iostream>
#include <cstring> 
using namespace std; 

// 函数：打印数组元素
// arr[] 表示接收一个整数数组（实际是一个指向int的指针）
// size 表示数组的元素数量
void printArray(int arr[], int size) {
    cout << "Array elements: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

// 函数：修改数组元素
// 注意：对 arr 的修改会直接影响到 main 函数中传递进来的原始数组
void modifyArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] *= 2;  // 将每个元素乘以2
    }
}

// 函数：查找数组中的最大值
// 返回数组中的最大整数
int findMax(int arr[], int size) {
    int maxVal = arr[0]; // 假设第一个元素是最大值
    for (int i = 1; i < size; i++) { // 从第二个元素开始比较
        if (arr[i] > maxVal) {
            maxVal = arr[i]; // 更新最大值
        }
    }
    return maxVal;
}

int main() {
    // 声明并初始化一个整数数组
    int numbers[] = {1, 2, 3, 4, 5};
    // 计算数组的元素数量：数组总字节大小 / 单个元素字节大小
    int size = sizeof(numbers) / sizeof(numbers[0]); 
    
    cout << "Original array:" << endl;
    printArray(numbers, size); // 打印原始数组
    
    cout << "Maximum value: " << findMax(numbers, size) << endl; // 查找并打印最大值
    
    modifyArray(numbers, size); // 调用函数修改数组
    cout << "Modified array:" << endl;
    printArray(numbers, size); // 再次打印数组，观察修改后的结果
    
    return 0;
}
```

**运行结果示例:**

```
Original array:
Array elements: 1 2 3 4 5 
Maximum value: 5
Modified array:
Array elements: 2 4 6 8 10 
```

-----

**关键点回顾：**

  * 当数组作为函数参数传递时，它会**退化为指向其第一个元素的指针**。
  * 这意味着函数内部对数组的修改会**直接影响到原始数组**。
  * 为了在函数内部知道数组的大小，你通常需要**额外传递一个表示数组大小的参数**。

------


# C++ 数组：常见操作

-----

数组作为一种基础的数据结构，我们不仅需要学会如何声明和初始化它，更重要的是掌握如何对数组中的数据进行各种**常见操作**。这些操作是许多算法和程序的基础。

-----

## 数组的常见操作

下面我们将通过一个例子，演示如何在 C++ 中对数组进行查找、求和、计算平均值以及反转等操作。

```cpp
#include <iostream>  
#include <algorithm> 
using namespace std; 

int main() {
    // 声明并初始化一个整数数组
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    // 计算数组的元素数量：
    // sizeof(arr) 返回整个数组在内存中占用的总字节数。
    // sizeof(arr[0]) 返回数组第一个元素（即单个 int 类型）在内存中占用的字节数。
    // 两者相除，即可得到数组中元素的数量。
    // 这种方法只适用于在当前作用域内完整定义的静态数组。
    int size = sizeof(arr) / sizeof(arr[0]);
    
    // 打印原始数组
    cout << "Original array: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    // --- 查找元素 ---
    // 目标：检查某个特定值是否存在于数组中，并找出其位置。
    int searchValue = 25; // 我们要查找的值
    bool found = false;   // 标记是否找到
    int index = -1;       // 存储找到的索引
    
    // 遍历数组，逐个比较
    for (int i = 0; i < size; i++) {
        if (arr[i] == searchValue) {
            found = true; // 找到啦！
            index = i;    // 记录它的索引
            break;        // 找到后就可以停止查找了，提高效率
        }
    }
    
    if (found) {
        cout << "Found " << searchValue << " at index " << index << endl;
    } else {
        cout << searchValue << " not found" << endl;
    }
    
    // --- 计算总和 ---
    // 目标：将数组中所有元素的值加起来。
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i]; // 累加每个元素
    }
    cout << "Sum: " << sum << endl;
    
    // --- 计算平均值 ---
    // 目标：计算数组中所有元素的平均值。
    // 注意：需要将 `sum` 转换为 `double` 类型，以避免整数除法造成的精度丢失。
    double average = (double)sum / size;//(double)sum可以把sum强制转换为double形
    cout << "Average: " << average << endl;
    
    // --- 反转数组 ---
    // 目标：将数组的元素顺序颠倒，例如 {1,2,3,4} 变为 {4,3,2,1}。
    // 思路：交换数组两端的元素，然后逐渐向中间靠拢。
    for (int i = 0; i < size / 2; i++) {
        // 使用 std::swap 交换 arr[i] 和 arr[size - 1 - i]
        // std::swap 用法：std::swap (a,b) 即为把 a 和 b 的值互换。
        // 例如：i=0 交换 arr[0] 和 arr[size-1]
        //       i=1 交换 arr[1] 和 arr[size-2]
        swap(arr[i], arr[size - 1 - i]);
    }
    
    cout << "Reversed array: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

**运行结果示例:**

```
Original array: 64 34 25 12 22 11 90 
Found 25 at index 2
Sum: 258
Average: 36.8571
Reversed array: 90 11 22 12 25 34 64 
```

-----


## 数组的限制和注意事项

尽管数组是 C++ 中非常基础和有用的数据结构，但它也有一些固有的**限制**和需要特别注意的地方。理解这些限制可以帮助你避免常见的编程错误，编写出更健壮的代码。


### 1\. 固定大小

C++ 中的**普通数组**一旦声明，其大小（能容纳的元素数量）就**固定**了，在程序运行时不能改变。这意味着如果你声明了一个 `int arr[5];` 的数组，它就只能存储 5 个整数。

尝试访问数组范围之外的内存（称为**越界访问**）会导致**未定义行为**。这可能导致程序崩溃、输出错误数据，或者在某些情况下，程序甚至能正常运行，但会在未来引发难以调试的问题。

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[5]; // 声明一个包含5个元素的数组，索引范围是 0 到 4

    // arr[5] = 10; // 错误且危险：这是一个越界访问！
                  // 数组只有 arr[0] 到 arr[4]

    // 编译时通常不会报错，但运行时会带来问题，切记避免！

    return 0;
}
```

**如何避免越界访问？**

  * **始终检查索引**：在循环或任何访问数组元素的代码中，确保索引值在 `0` 到 `size - 1` 的有效范围内。

  * **使用常量定义大小**：在算法竞赛（一般会限定最大输入量）或大型项目中，通常会使用 `const int` 定义数组的最大尺寸，这样可以集中管理和避免硬编码数字。

    ```cpp
    const int N = 1000; // 定义一个最大值
    int my_array[N];    // 使用常量声明数组，避免越界
    ```

### 2\. 不能直接复制

与基本数据类型不同，C++ 中的数组不能像这样直接通过赋值运算符 `=` 进行整体复制：

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr1[5] = {1, 2, 3, 4, 5};
    int arr2[5];
    
    // arr2 = arr1; // 错误：C++ 不允许直接使用赋值运算符复制整个数组
    
    // 正确的复制方法：逐个元素复制
    for (int i = 0; i < 5; i++) {
        arr2[i] = arr1[i];
    }

    // 验证复制是否成功
    cout << "arr2 after copy: ";
    for (int i = 0; i < 5; i++) {
        cout << arr2[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

**提示：**

  * 对于字符数组（C 风格字符串），你可以使用 `strcpy` 函数进行复制（但要注意目标数组空间是否足够）。

### 3\. 不能直接返回

C++ 函数不能直接返回一个完整的数组。当你尝试返回数组名时，实际上返回的是指向该数组第一个元素的**指针**。

```cpp
#include <iostream>
using namespace std;

// 错误示范：不能直接返回数组
// int[] getArrayBad() {
//     int arr[5] = {1, 2, 3, 4, 5}; // 局部数组在函数结束后会被销毁
//     return arr; // 返回一个指向已销毁内存的指针，非常危险！
// }

// 正确的方法：返回一个指向数组的指针
// 注意：这里使用 static 关键字，确保数组在函数结束后依然存在于内存中。
//      但通常不推荐返回局部静态数组，因为它可能引起意想不到的副作用。
int* getArray() {
    static int arr[5] = {1, 2, 3, 4, 5}; // static 局部变量在程序生命周期内都存在
    cout << "Inside getArray: " << arr[0] << endl;
    return arr; // 返回数组第一个元素的地址
}

int main() {
    int* myArrPtr = getArray(); // 接收返回的指针
    
    cout << "Elements from returned array: ";
    for (int i = 0; i < 5; i++) {
        cout << myArrPtr[i] << " "; // 通过指针访问数组元素
    }
    cout << endl;
    
    return 0;
}
```

**更安全的替代方案：**

  * **通过参数传递**：让函数接受一个数组（或指针）作为参数，并在函数内部修改它（正如我们前面“数组作为函数参数”一节所学）。


-----

## 如何使程序“崩溃”（或产生未定义行为）

了解这些常见错误可以帮助你避免它们。尝试以下操作来观察程序的行为，并理解其危险性：

1. **数组越界**：
   试图访问数组的有效索引范围之外的元素。

   ```cpp
   #include <iostream>
   using namespace std;
   
   int main() {
       int arr[5] = {1, 2, 3, 4, 5};
       // 尝试访问索引 10，但数组只有索引 0 到 4
       cout << "Attempting to access arr[10]: " << arr[10] << endl; // 越界访问！
       return 0;
   }
   ```

     * **你会看到什么？** 程序可能会崩溃（段错误），或者打印出一个随机的、无意义的数字。这是因为你正在读取不属于你程序内存区域的数据。

2. **未初始化的数组**：
   声明数组后，如果没有明确地初始化所有元素，那么它们会包含“垃圾值”（即之前内存中残留的随机数据）。

   ```cpp
   #include <iostream>
   using namespace std;
   
   int main() {
       int arr[5]; // 声明，但未完全初始化
       cout << "Uninitialized array elements: ";
       for (int i = 0; i < 5; i++) {
           cout << arr[i] << " "; // 打印未定义的值
       }
       cout << endl;
       return 0;
   }
   ```

     * **你会看到什么？** 你会看到一些看起来像随机数的奇怪数字。这些值是不可预测的，并且在每次程序运行时可能都不同。

3. **字符串缓冲区溢出**：
   当你尝试将一个比目标字符数组更大的字符串复制进去时，就会发生缓冲区溢出。这会写入到数组之外的内存区域。

   ```cpp
   #include <iostream>
   #include <cstring> // For strcpy
   using namespace std;
   
   int main() {
       // str 只能容纳 5 个字符，包括末尾的空字符 '\0'。
       // 所以它最多只能存储 4 个实际字符。
       char str[5]; 
       
       // "Hello World" 有 11 个字符 + 1 个空字符 = 12 个字节。
       // 这远超 str 的 5 个字节容量。
       strcpy(str, "Hello World"); // 缓冲区溢出！
       
       cout << "Overflowed string: " << str << endl;
       return 0;
   }
   ```

     * **你会看到什么？** 程序可能会崩溃，或者打印出部分字符串，后面跟着一些奇怪的字符，甚至可能影响到其他变量的值。这是非常危险的，因为它可以被恶意利用。

-----

通过了解这些限制和常见的陷阱，你就能更好地掌握 C++ 数组的使用，并编写出更安全、更可靠的代码。当你遇到上述问题时，首先检查你的数组索引、初始化以及是否使用了合适的标准库容器。

