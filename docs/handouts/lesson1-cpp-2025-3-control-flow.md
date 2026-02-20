---
title: C++ 控制流基础
description: 第 1 课第 3 章：控制流基础，包含 if/switch 条件分支、for/while/do-while 循环，以及 break/continue 等常用语句。
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---
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
