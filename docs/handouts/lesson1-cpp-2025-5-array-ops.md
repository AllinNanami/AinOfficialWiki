---
title: C++ 数组常见操作
description: 第 1 课第 5 章：数组常见操作，聚焦查找、统计、最大最小、反转等基础操作，配合练习巩固。
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---
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
