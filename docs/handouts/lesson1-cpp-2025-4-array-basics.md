---
title: C++ 数组基础
description: 第 1 课第 4 章：数组基础，涵盖数组声明与初始化、下标访问与遍历，以及常见越界等注意事项。
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---
# 四.数组基础

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
