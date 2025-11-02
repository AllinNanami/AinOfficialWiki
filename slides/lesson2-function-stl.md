---
theme: default
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: true
info: |
  ## C++ 函数、结构体与 STL
  深入学习 C++ 编程进阶知识
drawings:
  persist: false
transition: slide-left
title: C++ 函数、结构体与 STL
mdc: true
download: true
---

# C++ 函数、结构体与 STL

C++ 进阶知识 - 函数、数据结构与标准模板库

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    开始学习 <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: section
---

# 一. C++ 函数 (Function)

---

# 什么是函数？

函数是一段执行特定任务的代码块

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### ✨ 函数的优势

- 📦 **代码重用** - 避免重复代码
- 🎯 **模块化** - 代码更清晰易管理
- 🐛 **易于调试** - 独立测试每个模块

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 🔑 函数的组成

- **返回类型** - 返回的数据类型
- **函数名** - 函数的标识符
- **参数列表** - 传入的数据
- **函数体** - 具体的执行代码

</div>

</div>

---

# 函数的定义与调用

基本语法结构

```cpp
返回类型 函数名(参数列表) {
    // 函数体
    return 返回值;  // 如果返回类型不是 void
}
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 函数语法说明

- **返回类型** - `int`, `double`, `void` 等
- **函数名** - 遵循标识符命名规则
- **参数列表** - 可以有多个参数，用逗号分隔
- **return 语句** - 返回结果并结束函数

</div>

---

# 有返回值的函数

计算两个整数的和

```cpp
#include <iostream>
#include <string>
using namespace std;

// 目标：计算两个整数的和并返回结果
int add(int a, int b) {
    int sum = a + b;
    return sum; // 'return' 关键字用于返回一个值
}

int main() {
    // 调用 add 函数，并将返回值存储在 result 变量中
    int result = add(5, 3);
    cout << "5 + 3 = " << result << endl;
    
    return 0;
}
```

**运行结果：** `5 + 3 = 8`

---

# 没有返回值的函数 (void)

打印问候消息

```cpp
#include <iostream>
#include <string>
using namespace std;

// 目标：打印一条问候消息
void printGreeting(string name) {
    cout << "Hello, " << name << "!" << endl;
    // void 函数没有 return 语句，或者使用 return; 来提前结束
}

int main() {
    // 调用 printGreeting 函数
    printGreeting("Alice");
    printGreeting("Bob");
    
    return 0;
}
```

**运行结果：**
```
Hello, Alice!
Hello, Bob!
```

---

# 参数传递：值传递 vs 引用传递

理解两种参数传递方式的区别

<div class="grid grid-cols-2 gap-4">

<div>

### 📋 值传递 (Pass-by-Value)

- **机制：** 函数接收变量的**副本**
- **效果：** 修改副本，**不影响**原变量
- **特点：** C++ 的默认方式

</div>

<div>

### 🔗 引用传递 (Pass-by-Reference)

- **机制：** 函数接收变量的**引用** (别名)
- **效果：** 修改引用，**会影响**原变量
- **语法：** 类型后添加 `&` 符号

</div>

</div>

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded text-sm">

💡 **重要提示：** 引用传递在类型后加 `&`，如 `int& x`

</div>

---

# 值传递示例

修改副本不会影响原变量

```cpp
#include <iostream>
using namespace std;

// 值传递：传入的是 num 的副本
void modifyByValue(int x) {
    x = 100; // 修改的是副本 x
    cout << "Inside modifyByValue, x = " << x << endl;
}

int main() {
    int num = 10;
    cout << "Original num = " << num << endl;
    
    modifyByValue(num);
    cout << "After modifyByValue, num = " << num << endl; // num 仍然是 10
    
    return 0;
}
```

**运行结果：**
```
Original num = 10
Inside modifyByValue, x = 100
After modifyByValue, num = 10
```

---

# 引用传递示例

修改引用会直接修改原变量

```cpp
#include <iostream>
using namespace std;

// 引用传递：传入的是 num 的引用（别名）
void modifyByReference(int& x) {
    x = 100; // 修改的是 x，也就是原始的 num
    cout << "Inside modifyByReference, x = " << x << endl;
}

int main() {
    int num = 10;
    cout << "Original num = " << num << endl;
    
    modifyByReference(num);
    cout << "After modifyByReference, num = " << num << endl; // num 变成了 100
    
    return 0;
}
```

**运行结果：**
```
Original num = 10
Inside modifyByReference, x = 100
After modifyByReference, num = 100
```

---

# 💡 竞赛技巧：何时使用引用传递

提高效率和实现特定功能

<div class="grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 🚀 提高效率

传递大型数据结构时使用引用避免复制

```cpp
// 避免复制，提高效率
void process(const vector<int>& v) {
    // const 保证不会修改
    for (int x : v) {
        cout << x << " ";
    }
}
```

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### ✏️ 需要修改原变量

当函数需要修改传入的变量时

```cpp
// 交换两个数
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
```

</div>

</div>

---

# 算法竞赛中的全局变量

简化代码，避免复杂传参

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### 什么是全局变量？

- **定义：** 在所有函数（包括 `main`）之外定义的变量
- **作用域：** 在程序的任何地方都可以访问
- **生命周期：** 程序运行期间一直存在

</div>

### ✅ 全局变量的好处

1. **避免复杂传参** - 递归函数不需要层层传递参数
2. **共享状态** - 多个函数可以方便地共享和修改同一数据

---

# 全局变量示例

在 DFS 中使用全局变量

```cpp
#include <iostream>
#include <vector>
using namespace std;
// --- 全局变量 ---
vector<vector<int>> graph; // 图
bool visited[100];          // 访问数组
int nodeCount = 0;          // 统计节点数
// DFS 函数可以直接访问全局变量
void dfs(int u) {
    if (visited[u]) return;
    visited[u] = true;
    nodeCount++; // 修改全局变量
    for (int v : graph[u]) {
        dfs(v);
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded text-sm">

⚠️ **注意：** 全局变量在竞赛中很方便，但在大型项目中应谨慎使用

</div>

---
layout: section
---

# 二. C++ 结构体 (Struct)

---

# 什么是结构体？

将多个不同类型的数据组合成一个单一的实体

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mt-6">

### 结构体的作用

结构体允许你创建**自定义的数据类型**，把相关的数据"打包"在一起

**例如：** 描述一个学生
- 姓名 (`string`)
- 学号 (`int`)
- 分数 (`double`)

这三个不同类型的数据可以组合成一个 `Student` 结构体

</div>

---

# 结构体的定义

基本语法结构

```cpp
struct 结构体名 {
    数据类型1 成员1;
    数据类型2 成员2;
    // ...
}; // 注意这里的分号
```

<div class="mt-6">

### 实际示例

```cpp
#include <iostream>
#include <string>
using namespace std;
// 定义一个学生结构体
struct Student {
    string name;
    int studentID;
    double score;
}; // 注意分号
int main() {
    Student s1;  // 创建一个 Student 类型的变量
    return 0;
}
```

</div>

---

# 结构体的使用

使用点运算符访问成员

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int studentID;
    double score;
};

int main() {
    // 创建结构体变量
    Student s1;
    
    // 使用 . (点运算符) 访问和修改成员
    s1.name = "Alice";
    s1.studentID = 1001;
    s1.score = 95.5;
    
    // 打印信息
    cout << s1.name << " (ID: " << s1.studentID 
         << ") Score: " << s1.score << endl;
    
    return 0;
}
```

---

# 结构体的初始化

多种初始化方式

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int studentID;
    double score;
};

int main() {
    // 方法1：先声明后赋值
    Student s1;
    s1.name = "Alice";
    s1.studentID = 1001;
    s1.score = 95.5;
    
    // 方法2：使用初始化列表 (推荐)
    Student s2 = {"Bob", 1002, 88.0};
    
    // 方法3：C++11 统一初始化
    Student s3{"Charlie", 1003, 92.5};
    
    return 0;
}
```

---

# 结构体与排序

在算法竞赛中的常见用法

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### 场景说明

当我们需要对一组复杂的数据进行排序时，可以：
1. 定义一个结构体来存储数据
2. 编写自定义的比较函数 `cmp`
3. 使用 `sort()` 函数进行排序

</div>

### 排序规则示例

- 优先按分数从高到低排序
- 如果分数相同，按学号从小到大排序

---

# 结构体排序示例

自定义比较函数实现排序

```cpp {all|6-12|15-19|22-23}
#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
using namespace std;

struct Student {
    string name;
    int studentID;
    double score;
};

// 比较函数：1. 分数降序  2. 学号升序
bool cmp(const Student& a, const Student& b) {
    if (a.score != b.score) {
        return a.score > b.score; // 分数高的在前
    }
    return a.studentID < b.studentID; // 分数相同，ID小的在前
}
```

<arrow v-click="1" x1="400" y1="250" x2="300" y2="290" color="#953" width="2" arrowSize="1" />

---

# 结构体排序完整示例

```cpp
int main() {
    vector<Student> students;
    students.push_back({"Bob", 1002, 88.0});
    students.push_back({"Alice", 1001, 95.5});
    students.push_back({"Charlie", 1003, 95.5}); // 与 Alice 同分
    
    // 使用 std::sort 和自定义的 cmp 函数
    sort(students.begin(), students.end(), cmp);
    
    cout << "--- Sorted Students ---" << endl;
    for (const auto& s : students) {
        cout << s.name << " (ID: " << s.studentID 
             << ") Score: " << s.score << endl;
    }
    return 0;
}
```

**运行结果：**
```
Alice (ID: 1001) Score: 95.5
Charlie (ID: 1003) Score: 95.5
Bob (ID: 1002) Score: 88
```

---
layout: section
---

# 三. 辅助工具

---

# typedef 和 using (类型别名)

为复杂类型创建简短的别名

<div class="grid grid-cols-2 gap-4">

<div>

### 传统方式：typedef

```cpp
#include <vector>
using namespace std;

// 为 unsigned long long 创建别名
typedef unsigned long long ull;

// 为 vector<int> 创建别名
typedef vector<int> vi;

int main() {
    ull a = 123456789ULL;
    vi numbers = {1, 2, 3};
    return 0;
}
```

</div>

<div>

### 现代方式：using (C++11)

```cpp
#include <vector>
using namespace std;

// 使用 using 定义别名 (推荐)
using ll = long long;
using ull = unsigned long long;
using vi = vector<int>;

int main() {
    ll b = -987654321;
    ull a = 123456789ULL;
    vi numbers = {1, 2, 3};
    return 0;
}
```

</div>

</div>

<div class="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded text-sm">

💡 **竞赛必备：** `using ll = long long;` 几乎是每个竞赛代码的标配

</div>

---

# pair (二元组)

存储两个值的模板结构体

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### pair 的特点

- 存储**两个**值（可以是不同类型）
- 使用 `.first` 和 `.second` 访问
- 常用于存储坐标、键值对等

</div>

### 常见应用场景

- `map` 的元素是 `pair<key, value>`
- BFS 中存储坐标 `pair<int, int>`
- 存储图的边 `pair<int, int>`

---

# pair 的使用示例

创建和使用 pair

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    // 创建方式1：声明后赋值
    pair<int, string> p1;
    p1.first = 1;
    p1.second = "Apple";
    
    // 创建方式2：C++11 初始化
    pair<double, char> p2 = {3.14, 'A'};
    
    // 创建方式3：使用 make_pair
    auto p3 = make_pair(10, "Banana");
    
    cout << "p1: " << p1.first << ", " << p1.second << endl;
    cout << "p2: " << p2.first << ", " << p2.second << endl;
    cout << "p3: " << p3.first << ", " << p3.second << endl;
    
    return 0;
}
```

---

# tuple (元组)

存储任意多个值的扩展版 pair

<div class="grid grid-cols-2 gap-4">

<div>

### tuple vs pair

- **pair：** 恰好两个值
- **tuple：** 三个或更多值
- **访问：** 使用 `get<索引>()`

### 常见应用

- BFS 中存储 `(x, y, step)`
- 需要返回多个值的函数
- 存储复杂的状态信息

</div>

<div>

```cpp
#include <iostream>
#include <string>
#include <tuple>
using namespace std;

int main() {
    // 创建 tuple
    tuple<int, string, double> t1 
        = {101, "Laptop", 799.99};
    
    // 访问元素 (索引从0开始)
    cout << "ID: " << get<0>(t1) << endl;
    cout << "Item: " << get<1>(t1) << endl;
    cout << "Price: " << get<2>(t1) << endl;
    
    // 修改元素
    get<2>(t1) = 749.99;
    
    return 0;
}
```

</div>

</div>

---

# C++ 指针 - 简介

理解内存地址和指针的基本概念

<div class="p-4 bg-yellow-50 dark:bg-yellow-900 rounded mb-4">

### ⚠️ 重要提示

在算法竞赛中，我们几乎总是使用：
- ✅ **STL 容器** (如 `vector`)
- ✅ **引用** (`&`)
- ✅ **全局变量**

这些方法更安全、更简单，**几乎不需要自己声明指针**

</div>

### 指针的基本概念

- **指针：** 存储内存地址的变量
- **`&` 运算符：** 获取变量的地址
- **`*` 运算符：** 获取指针指向的值（解引用）

---

# 指针示例

基本的指针操作

```cpp
#include <iostream>
using namespace std;

int main() {
    int var = 20; // 一个普通变量
    
    // int* ptr 表示 ptr 是一个 "指向 int 类型的指针"
    int* ptr = &var; // ptr 存储了 var 变量的内存地址
    
    cout << "var 的值 (var): " << var << endl;
    cout << "var 的地址 (&var): " << &var << endl;
    cout << "ptr 存储的值 (ptr): " << ptr << endl;   // var 的地址
    cout << "ptr 指向的值 (*ptr): " << *ptr << endl; // var 的值
    
    // 通过指针修改值
    *ptr = 50; 
    
    cout << "--- After *ptr = 50 ---" << endl;
    cout << "var 的新值 (var): " << var << endl; // var 变成了 50
    
    return 0;
}
```

---
layout: section
---

# 四. STL 标准模板库

---

# 什么是 STL？

Standard Template Library - 标准模板库

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded my-6">

### STL 的定义

STL 是 C++ 标准库的核心组成部分，提供了：
- **数据结构** - vector, map, set, queue, stack...
- **算法** - sort, find, binary_search...
- **无需重复造轮子** - 直接调用高效的实现

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded text-lg">

💡 **核心思想：** 将常见的数据结构和算法以模板的形式封装，提高开发效率

</div>

---

# STL 六大组件

理解 STL 的整体架构

<div class="grid grid-cols-3 gap-3 mt-6">

<div class="p-3 bg-blue-50 dark:bg-blue-900 rounded text-center">

**📦 容器**

vector, list, map, set...

</div>

<div class="p-3 bg-green-50 dark:bg-green-900 rounded text-center">

**⚙️ 算法**

sort, find, copy...

</div>

<div class="p-3 bg-purple-50 dark:bg-purple-900 rounded text-center">

**🔄 迭代器**

访问容器元素

</div>

<div class="p-3 bg-yellow-50 dark:bg-yellow-900 rounded text-center">

**🎯 仿函数**

函数对象

</div>

<div class="p-3 bg-red-50 dark:bg-red-900 rounded text-center">

**🔌 适配器**

stack, queue

</div>

<div class="p-3 bg-indigo-50 dark:bg-indigo-900 rounded text-center">

**💾 分配器**

内存管理

</div>

</div>

---
layout: section
---

# 五. STL 算法 (Algorithm)

---

# 常用 STL 算法

头文件：`#include <algorithm>`

<div class="grid grid-cols-2 gap-4 mt-6">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### sort() 排序

对给定区间的元素进行排序

**语法：**
```cpp
sort(begin, end, cmp);
```

- `begin` - 起始位置指针
- `end` - 结束位置的下一个位置
- `cmp` - 排序准则（可选）

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 其他常用函数

- **swap(a, b)** - 交换两个值
- **min(a, b)** - 取最小值
- **max(a, b)** - 取最大值

</div>

</div>

---

# sort() 排序示例

对数组进行排序

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int num[10] = {6, 5, 9, 1, 2, 8, 7, 3, 4, 0};
    
    // 默认从小到大排序
    sort(num, num + 10);
    
    cout << "升序：";
    for (int i = 0; i < 10; i++) {
        cout << num[i] << " ";
    }
    cout << endl;
    
    // 从大到小排序（使用 greater<int>()）
    sort(num, num + 10, greater<int>());
    
    cout << "降序：";
    for (int i = 0; i < 10; i++) {
        cout << num[i] << " ";
    }
    
    return 0;
}
```

---

# 其他常用算法函数

swap, min, max 的使用

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int a = 10, b = 20;
    
    cout << "Before swap: a = " << a << ", b = " << b << endl;
    
    // swap() - 交换两个值
    swap(a, b);
    cout << "After swap: a = " << a << ", b = " << b << endl;
    
    // min() 和 max()
    int x = 5, y = 8;
    cout << "min(5, 8) = " << min(x, y) << endl;
    cout << "max(5, 8) = " << max(x, y) << endl;
    
    return 0;
}
```

**运行结果：**
```
Before swap: a = 10, b = 20
After swap: a = 20, b = 10
min(5, 8) = 5
max(5, 8) = 8
```

---
layout: section
---

# 六. STL 容器 (Container)

---

# 什么是容器？

存放数据的数据结构

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded my-6">

### 容器的概念

容器是用来存储和管理数据的类，如：
- 数组、链表、栈、队列、集合、映射...
- 所有容器都是一个**类**
- 使用**点运算符 `.`** 访问成员函数

</div>

<div class="grid grid-cols-3 gap-3">

<div class="p-3 bg-green-50 dark:bg-green-900 rounded text-center">
**vector** - 动态数组
</div>

<div class="p-3 bg-yellow-50 dark:bg-yellow-900 rounded text-center">
**map** - 映射
</div>

<div class="p-3 bg-purple-50 dark:bg-purple-900 rounded text-center">
**set** - 集合
</div>

<div class="p-3 bg-red-50 dark:bg-red-900 rounded text-center">
**queue** - 队列
</div>

<div class="p-3 bg-indigo-50 dark:bg-indigo-900 rounded text-center">
**stack** - 栈
</div>

<div class="p-3 bg-pink-50 dark:bg-pink-900 rounded text-center">
**string** - 字符串
</div>

</div>

---

# vector (动态数组)

长度可以自动改变的数组

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### vector 的特点

- **动态大小** - 长度根据需要自动改变
- **连续存储** - 元素在内存中连续存放
- **随机访问** - 可以用 `[]` 快速访问任意元素

</div>

### 定义方式

```cpp
#include <vector>
using namespace std;

vector<int> v;              // 空 vector
vector<int> v2 = {1, 2, 3}; // 初始化列表
vector<int> v3(10);         // 10 个元素，默认为 0
vector<int> v4(10, 5);      // 10 个元素，都是 5
```

---

# vector 常用函数

操作动态数组

| 函数 | 功能 | 时间复杂度 |
|------|------|-----------|
| `push_back(x)` | 在末尾添加元素 x | O(1) |
| `pop_back()` | 删除最后一个元素 | O(1) |
| `back()` | 返回最后一个元素 | O(1) |
| `front()` | 返回第一个元素 | O(1) |
| `size()` | 返回元素个数 | O(1) |
| `clear()` | 清空所有元素 | O(N) |
| `insert(it, x)` | 在迭代器 it 处插入 x | O(N) |
| `erase(it)` | 删除迭代器 it 处的元素 | O(N) |

---

# vector 使用示例

基本操作演示

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    
    // 添加元素
    v.push_back(10);
    v.push_back(20);
    v.push_back(30);
    
    cout << "Size: " << v.size() << endl;
    cout << "First: " << v.front() << endl;
    cout << "Last: " << v.back() << endl;
    
    // 遍历 vector (C++11 范围 for)
    cout << "Elements: ";
    for (auto x : v) {
        cout << x << " ";
    }
    cout << endl;
    
    return 0;
}
```

---

# vector 遍历方式

传统迭代器 vs C++11 范围 for

<div class="grid grid-cols-2 gap-4">

<div>

### 传统迭代器

```cpp
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    
    vector<int>::iterator it;
    for (it = v.begin(); 
         it != v.end(); 
         it++) {
        cout << *it << '\n';
    }
    
    return 0;
}
```

</div>

<div>

### C++11 范围 for (推荐)

```cpp
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    
    // auto 自动推导类型
    for (auto i : v) {
        cout << i << ' ';
    }
    
    return 0;
}
```

<div class="mt-4 p-2 bg-green-50 dark:bg-green-900 rounded text-sm">

✅ 更简洁，更易读

</div>

</div>

</div>

---

# string (字符串)

C++ 封装的字符串类

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### string 的优势

- 不需要手动管理内存
- 可以动态改变大小
- 提供丰富的操作函数
- 比 C 风格字符数组更安全

</div>

### 定义方式

```cpp
#include <string>
using namespace std;

string s1;                  // 空字符串
string s2 = "Hello";        // 初始化
string s3("World");         // 构造函数
string s4 = s2 + " " + s3;  // 字符串拼接
```

---

# string 常用函数

字符串操作

| 函数 | 功能 | 示例 |
|------|------|------|
| `+=` | 字符串拼接 | `s += "abc"` |
| `==`, `!=`, `<` | 字典序比较 | `if (s1 == s2)` |
| `length()` / `size()` | 返回长度 | `s.length()` |
| `substr(pos, len)` | 提取子串 | `s.substr(0, 5)` |
| `find(str)` | 查找子串 | `s.find("abc")` |
| `push_back(c)` | 末尾添加字符 | `s.push_back('a')` |
| `pop_back()` | 删除最后字符 | `s.pop_back()` |
| `clear()` | 清空字符串 | `s.clear()` |

---

# string 使用示例

字符串操作演示

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s1 = "Hello";
    string s2 = "World";
    // 拼接
    string s3 = s1 + " " + s2;
    cout << s3 << endl; // Hello World
    // 长度
    cout << "Length: " << s3.length() << endl;
    // 子串
    string sub = s3.substr(0, 5); // "Hello"
    cout << "Substring: " << sub << endl;
    // 查找
    int pos = s3.find("World");
    cout << "Position of 'World': " << pos << endl;
    return 0;
}
```

---

# map (映射)

键值对的关联容器

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### map 的特点

- 存储 **键值对** (key-value)
- 每个 key 对应一个 value
- key **不能重复**
- 自动按 key **从小到大排序**

</div>

### 定义方式

```cpp
#include <map>
using namespace std;

map<int, int> mp;           // int -> int 的映射
map<int, char> mp2;         // int -> char 的映射
map<string, int> mp3;       // string -> int 的映射
```

---

# map 常用操作

插入、访问和遍历

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> mp;
    // 插入方式1：直接使用 []
    mp["apple"] = 5;
    mp["banana"] = 3;
    // 插入方式2：使用 insert
    mp.insert({"orange", 7});
    // 访问
    cout << "apple: " << mp["apple"] << endl;
    // C++11 遍历
    for (auto [key, value] : mp) {
        cout << key << " -> " << value << endl;
    }
    return 0;
}
```

---

# map 遍历方式

不同 C++ 版本的遍历方法

```cpp
#include <map>
using namespace std;

int main() {
    map<int, int> mp = {{1, 10}, {2, 20}, {3, 30}};
    // 方式1：传统迭代器
    for (auto i = mp.begin(); i != mp.end(); i++) {
        cout << i->first << ' ' << i->second << '\n';
    }
    // 方式2：C++11 auto
    for (auto i : mp) {
        cout << i.first << ' ' << i.second << '\n';
    }
    // 方式3：C++17 结构化绑定
    for (auto [key, val] : mp) {
        cout << key << ' ' << val << '\n';
    }
    
    return 0;
}
```

---

# queue (队列)

先进先出 (FIFO) 的数据结构

<div class="grid grid-cols-2 gap-4 mb-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 队列的特点

- **先进先出** (FIFO)
- 从队尾添加元素
- 从队首删除元素
- 类似排队买票

</div>

<div>

```
    队首 ← ← ← ← 队尾
    ┌───┬───┬───┬───┐
    │ 1 │ 2 │ 3 │ 4 │
    └───┴───┴───┴───┘
     ↑               ↑
   pop()         push()
```

</div>

</div>

---

# queue 常用函数

队列的基本操作方法

| 函数 | 功能 |
|------|------|
| `push(x)` | 将 x 入队（队尾） |
| `pop()` | 队首元素出队 |
| `front()` | 返回队首元素 |
| `back()` | 返回队尾元素 |
| `size()` | 返回队列大小 |
| `empty()` | 判断是否为空 |

---

# queue 使用示例

队列操作演示

```cpp
#include <iostream>
#include <queue>
using namespace std;
int main() {
    queue<int> q;
    // 入队
    q.push(10);
    q.push(20);
    q.push(30);
    cout << "Front: " << q.front() << endl; // 10
    cout << "Back: " << q.back() << endl;   // 30
    cout << "Size: " << q.size() << endl;   // 3
    // 出队
    q.pop(); // 删除 10
    cout << "After pop, Front: " << q.front() << endl; // 20
    return 0;
}
```

**运行结果：**
```
Front: 10
Back: 30
Size: 3
After pop, Front: 20
```

---

# stack (栈)

先进后出 (LIFO) 的数据结构

<div class="grid grid-cols-2 gap-4 mb-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 栈的特点

- **先进后出** (LIFO)
- 只能在栈顶操作
- 类似叠盘子
- 最后放的最先取出

</div>

<div>

```
        push() ↓
            ┌───┐
            │ 4 │ ← top()
            ├───┤
            │ 3 │
            ├───┤
            │ 2 │
            ├───┤
            │ 1 │
            └───┘
        pop() ↑
```

</div>

</div>

---

# stack 常用函数

栈的基本操作方法

| 函数 | 功能 |
|------|------|
| `push(x)` | 将 x 压入栈顶 |
| `pop()` | 弹出栈顶元素 |
| `top()` | 返回栈顶元素 |
| `size()` | 返回栈的大小 |
| `empty()` | 判断是否为空 |

---

# stack 使用示例

栈操作演示

```cpp
#include <iostream>
#include <stack>
using namespace std;
int main() {
    stack<int> s;
    // 压栈
    s.push(10);
    s.push(20);
    s.push(30);
    cout << "Top: " << s.top() << endl;   // 30
    cout << "Size: " << s.size() << endl; // 3
    // 弹栈
    s.pop(); // 删除 30
    cout << "After pop, Top: " << s.top() << endl; // 20
    // 判断是否为空
    if (!s.empty()) {
        cout << "Stack is not empty" << endl;
    }
    return 0;
}
```

---

# set (集合)

自动排序且不含重复元素的容器

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded mb-4">

### set 的特点

- **自动排序** - 元素从小到大
- **自动去重** - 不含重复元素
- **基于红黑树** - 查找效率高 O(log N)

</div>

---

# set 常用函数

集合的基本操作方法

| 函数 | 功能 | 时间复杂度 |
|------|------|-----------|
| `insert(x)` | 插入元素 x | O(log N) |
| `find(x)` | 查找元素 x | O(log N) |
| `erase(x)` | 删除元素 x | O(log N) |
| `size()` | 返回元素个数 | O(1) |
| `clear()` | 清空集合 | O(N) |

---

# set 访问方式

只能通过迭代器访问

<div class="grid grid-cols-2 gap-4">

<div>

### 传统迭代器

```cpp
#include <set>
using namespace std;

int main() {
    set<int> st = {3, 1, 4, 1, 5};
    // 自动去重和排序：1, 3, 4, 5
    
    set<int>::iterator it;
    for (it = st.begin(); 
         it != st.end(); 
         it++) {
        cout << *it << " ";
    }
    
    return 0;
}
```

</div>

<div>

### C++11 范围 for

```cpp
#include <set>
using namespace std;

int main() {
    set<int> st = {3, 1, 4, 1, 5};
    // 自动去重和排序：1, 3, 4, 5
    
    for (auto i : st) {
        cout << i << " ";
    }
    
    return 0;
}
```

<div class="mt-4 p-2 bg-green-50 dark:bg-green-900 rounded text-sm">

✅ 简洁易读

</div>

</div>

</div>

---

# set 使用示例

自动去重和排序

```cpp
#include <iostream>
#include <set>
using namespace std;
int main() {
    set<int> s;
    // 插入元素（自动去重）
    s.insert(3);
    s.insert(1);
    s.insert(4);
    s.insert(1); // 重复，会被忽略
    s.insert(5);
    cout << "Size: " << s.size() << endl; // 4 (去重后)
    // 遍历（自动排序）
    cout << "Elements: ";
    for (auto x : s) {
        cout << x << " "; // 1 3 4 5
    }
    cout << endl;
    return 0;
}
```

---

# STL 容器总结

选择合适的容器

| 容器 | 特点 | 适用场景 |
|------|------|---------|
| `vector` | 动态数组，随机访问 | 需要频繁访问元素 |
| `string` | 字符串，操作方便 | 字符串处理 |
| `map` | 键值对，自动排序 | 需要关联存储 |
| `set` | 去重排序 | 需要唯一且有序的元素 |
| `queue` | 先进先出 | BFS、模拟队列 |
| `stack` | 先进后出 | DFS、括号匹配 |

<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm">

💡 **选择原则：** 根据数据的访问模式和操作需求选择合适的容器

</div>

---
layout: center
class: text-center
---

# 总结

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 函数与结构体

- 函数的定义与调用
- 值传递 vs 引用传递
- 全局变量的使用
- 结构体与排序
- 辅助工具 (pair, tuple)

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### STL 标准模板库

- 常用算法 (sort, swap...)
- vector 动态数组
- string 字符串
- map 映射
- queue 队列 & stack 栈
- set 集合

</div>

</div>

<div class="mt-8 text-2xl">

🎉 掌握这些工具，让算法竞赛事半功倍！

</div>

---
layout: center
class: text-center
---

# 想要更详细的内容？

<div class="mt-8 text-xl">

📖 **完整教程文档**

查看更详细的教程文档，包含更多练习题和深入讲解

<div class="mt-6">
  <a href="/handouts/lesson2-cpp-2025-function" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block mr-4">
    查看函数与结构体 →
  </a>
  <a href="/handouts/lesson2-cpp-2025-STL" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block">
    查看 STL 教程 →
  </a>
</div>

</div>

---
layout: end
---

# 谢谢观看

继续学习，持续进步 💪

