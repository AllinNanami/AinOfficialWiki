---
title: C++ 函数与结构体
description: C++ 进阶讲义，包含函数定义、参数传递、结构体与常见语法实践。
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

# C++ 函数与结构体

在 C++ 编程中，我们不仅需要存储数据（如使用数组），还需要组织和处理这些数据。**函数（Function）** 允许我们将代码封装成可重用的模块，而 **结构体（Struct）** 允许我们将相关联的不同类型的数据组合成一个单一的实体。

------

### C++ 函数 (Function)

函数是一段执行特定任务的代码块。我们通过给它一个名字来“调用”它。使用函数可以使代码更清晰、更易于管理，并减少重复代码。

#### 1. 函数的定义与调用

函数的基本语法如下：

返回类型 函数名(参数列表) { ...函数体... }

- **返回类型 (Return Type):** 函数执行完毕后“返回”给调用者的数据类型。如果函数不返回任何值，则使用 `void`。
- **函数名 (Function Name):** 你给函数起的名字。
- **参数列表 (Parameter List):** 传入函数的数据。

```c++
#include <iostream>
#include <string>
using namespace std;

// --- 1. 有返回值的函数 ---
// 目标：计算两个整数的和并返回结果
int add(int a, int b) {
    int sum = a + b;
    return sum; // 'return' 关键字用于返回一个值
}

// --- 2. 没有返回值的函数 (void) ---
// 目标：打印一条问候消息
void printGreeting(string name) {
    cout << "Hello, " << name << "!" << endl;
    // void 函数没有 return 语句，或者使用 return; 来提前结束
}

int main() {
    // --- 调用函数 ---
    
    // 调用 add 函数，并将返回值存储在 result 变量中
    int result = add(5, 3);
    cout << "5 + 3 = " << result << endl;
    
    // 调用 printGreeting 函数
    printGreeting("Alice");
    
    return 0;
}
```

**运行结果示例:**

```text
5 + 3 = 8
Hello, Alice!
```



#### 2. 参数传递：值传递 vs 引用传递

这是一个非常重要的概念。当你将变量传递给函数时，有两种基本方式：

- **值传递 (Pass-by-Value)：**
  - **机制：** 函数接收的是变量的**副本 (copy)**。
  - **效果：** 在函数内部修改这个副本，**不会**影响到函数外部的原始变量。
  - 这是 C++ 的默认方式。
- **引用传递 (Pass-by-Reference)：**
  - **机制：** 函数接收的是变量的**引用 (reference)**，可以理解为变量的“别名”。这是通过在类型后添加 `&` 符号实现的。
  - **效果：** 在函数内部修改这个引用，**会**直接修改函数外部的原始变量。

```c++
#include <iostream>
using namespace std;

// 1. 值传递 (Pass-by-Value)
// 传入的是 num 的副本
void modifyByValue(int x) {
    x = 100; // 修改的是副本 x
    cout << "Inside modifyByValue, x = " << x << endl;
}

// 2. 引用传递 (Pass-by-Reference)
// 传入的是 num 的引用（别名）
void modifyByReference(int& x) {
    x = 100; // 修改的是 x，也就是原始的 num
    cout << "Inside modifyByReference, x = " << x << endl;
}

int main() {
    int num = 10;
    cout << "Original num = " << num << endl;
    
    // --- 测试值传递 ---
    modifyByValue(num);
    cout << "After modifyByValue, num = " << num << endl; // num 仍然是 10
    
    cout << "---" << endl;
    
    // --- 测试引用传递 ---
    num = 10; // 重置 num
    cout << "Original num = " << num << endl;
    modifyByReference(num);
    cout << "After modifyByReference, num = " << num << endl; // num 变成了 100

    return 0;
}
```

**运行结果示例:**

```text
Original num = 10
Inside modifyByValue, x = 100
After modifyByValue, num = 10
---
Original num = 10
Inside modifyByReference, x = 100
After modifyByReference, num = 100
```

> **💡 竞赛技巧：**
>
> 1. **效率：** 当传递大型数据结构（如 `string`, `vector`）时，使用引用传递（`const vector<int>&`）可以避免昂贵的复制操作，提高程序效率。
> 2. **修改：** 当你希望函数能修改传入的变量时（例如，`swap` 函数或 `dfs` 中修改 `visited` 数组），必须使用引用传递。



#### 3. 算法竞赛中的全局变量

在算法竞赛中，为了简化问题，我们经常使用**全局变量**。

- **定义：** 在所有函数（包括 `main` 函数）之外定义的变量。
- **作用域：** 它们在程序的任何地方（所有函数内部）都是可见和可访问的。

**好处：**

1. **避免复杂传参：** 在递归函数（如 `dfs`）中，你不需要把像 `visited` 数组、图 `G`、最终答案 `ans` 等变量一层层传递下去，函数可以直接访问它们。
2. **共享状态：** 多个函数可以方便地共享和修改同一个数据。

```c++
#include <iostream>
#include <vector>
using namespace std;

// --- 全局变量 ---
vector<vector<int>> graph; // 图
bool visited[100];       // 访问数组
int nodeCount = 0;         // 统计节点数

// DFS 函数可以直接访问全局变量
void dfs(int u) {
    if (visited[u]) return;
    
    visited[u] = true;
    nodeCount++; // 修改全局变量
    
    // 遍历 graph
    for (int v : graph[u]) {
        dfs(v);
    }
}

int main() {
    int n, m; // 假设 n 个点, m 条边
    cin >> n >> m;
    
    graph.resize(n + 1); // 调整全局 vector 大小
    
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    
    // 从节点 1 开始 DFS
    dfs(1); 
    
    cout << "Nodes visited: " << nodeCount << endl;
    
    return 0;
}
```

**注意：** 虽然全局变量在竞赛中很方便，但在大型工程项目中，过度使用会导致代码难以维护。不过在算法竞赛中，追求的是**快速**和**正确**，所以它是一个非常有用的技巧。

------

### C++ 结构体 (Struct)

结构体是一种用户自定义的数据类型，它允许你将多个不同类型的数据项组合成一个单一的单元。

#### 1. 结构体的定义与使用

- **定义：** 使用 `struct` 关键字。
- **访问：** 使用 `.` (点运算符) 来访问其成员。

```c++
#include <iostream>
#include <string>
#include <algorithm> // 包含 sort
#include <vector>
using namespace std;

// --- 1. 定义一个结构体 ---
// 目标：封装一个学生的信息
struct Student {
    string name;
    int studentID;
    double score;
}; // 注意这里的分号

// --- 2. 结构体与排序 (非常常见) ---
// (这是结构体在算法竞赛中非常常见的用法)

// 比较函数：
// 1. 优先按分数(score)降序排列
// 2. 如果分数相同，按学号(studentID)升序排列
bool cmp(const Student& a, const Student& b) {
    if (a.score != b.score) {
        return a.score > b.score; // 分数高的在前
    }
    return a.studentID < b.studentID; // 分数相同，ID小的在前
}

int main() {
    // --- 3. 创建和使用结构体实例 ---
    vector<Student> students;
    students.push_back({"Bob", 1002, 88.0});
    students.push_back({"Alice", 1001, 95.5});
    students.push_back({"Charlie", 1003, 95.5}); // 与 Alice 同分

    // 使用 std::sort 和我们自定义的 cmp 函数
    sort(students.begin(), students.end(), cmp);
    
    cout << "--- Sorted Students ---" << endl;
    for (const auto& s : students) { // 使用引用(const &)避免复制，提高效率
        cout << s.name << " (ID: " << s.studentID << ") Score: " << s.score << endl;
    }
    
    return 0;
}
```

**运行结果示例:**

```text
--- Sorted Students ---
Alice (ID: 1001) Score: 95.5
Charlie (ID: 1003) Score: 95.5
Bob (ID: 1002) Score: 88.0
```

---

###  

### 辅助工具 (Typedef, Pair, Tuple)

#### 1. `typedef` 和 `using` (类型别名)

当你使用非常长或复杂的类型（比如 `unsigned long long` 或 `map<string, vector<int>>`）时，`typedef` 可以让你为它创建一个更短、更易读的别名。

- **`typedef` 语法：** `typedef 原类型名 别名;`
- **`using` 语法 (C++11)：** `using 别名 = 原类型名;` (更现代，推荐使用)

```c++
#include <iostream>
#include <vector>
using namespace std;

// --- 1. 使用 typedef ---
typedef unsigned long long ull; // ull 现在是 unsigned long long 的别名
typedef vector<int> vi;         // vi 现在是 vector<int> 的别名

// --- 2. 使用 using (C++11 及以后) ---
using ll = long long;          // ll 现在是 long long 的别名
using v_str = vector<string>;  // v_str 是 vector<string> 的别名

int main() {
    ull a = 1234567890123456789ULL; // ULL 后缀表示这是 ull 类型
    ll b = -987654321;
    vi numbers = {1, 2, 3, 4, 5};
    
    cout << "ull a: " << a << endl;
    cout << "ll b: " << b << endl;
    cout << "vi numbers[0]: " << numbers[0] << endl;
    
    return 0;
}
```

在算法竞赛中，`using ll = long long;` 几乎是必备的。

#### 2. `pair`

`pair` 是一个模板结构体，它恰好可以存储**两个**值（可以是不同类型）。

- **访问：** 使用 `.first` 和 `.second`。
- **应用：** 常用于 `map` 的键值对、`bfs` 中存储坐标 (x, y)、存储图的边（`pair<int, int> edge`）等。

```c++
#include <iostream> //包含 pair
#include <string>
using namespace std;

int main() {
    // 创建一个 pair
    pair<int, string> p1;
    p1.first = 1;
    p1.second = "Apple";
    
    // C++11 初始化
    pair<double, char> p2 = {3.14, 'A'};
    
    // 使用 make_pair
    auto p3 = make_pair(10, "Banana"); // auto 自动推断类型
  	// 在 C++17 中引入了更简单的写法，但很多比赛并不支持 C++17 （比如蓝桥杯和睿抗）。
		//pair p3 = {10, "Banana"}; 
    
    cout << "p1: " << p1.first << ", " << p1.second << endl;
    cout << "p2: " << p2.first << ", " << p2.second << endl;
    
    return 0;
}
```

#### 3. `tuple`

`tuple` (元组) 是 `pair` 的扩展，它可以存储**任意多个**值（三个或更多）。

- **头文件：** `<tuple>`
- **访问：** 使用 `std::get<索引>()` (索引从 0 开始)。
- **应用：** 当你需要一次性返回或存储三个值（比如 `bfs` 中的 `x, y, step`）时非常有用。

```c++
#include <iostream>
#include <string>
#include <tuple> // 包含 tuple
using namespace std;

int main() {
    // 创建一个 tuple (C++11)
    tuple<int, string, double> t1 = {101, "Laptop", 799.99};
  	// C++17 
		// tuple t2 = {101, "Laptop", 799.99}; // 编译器自动推导 t2 为 tuple<int, const char*, double>
    
    // 访问元素
    cout << "ID: " << get<0>(t1) << endl;     // 访问第 0 个元素
    cout << "Item: " << get<1>(t1) << endl;   // 访问第 1 个元素
    cout << "Price: " << get<2>(t1) << endl;  // 访问第 2 个元素
    
    // 修改元素
    get<2>(t1) = 749.99; // 打折
    cout << "New Price: " << get<2>(t1) << endl;

    return 0;
}
```

------

### C++ 指针 (Pointers) - 简介

在算法竞赛中，我们几乎总是使用 **STL 容器**（如 `vector`）、**引用**（`&`）和**全局变量**来管理数据，这些方法更安全、更简单。

不过，为了完整性，这里是 C++ 指针的（最基本）概念：

- 指针 (Pointer) 是一个变量，它存储的不是一个值（如 10），而是一个内存地址。
- `&` (地址运算符)：获取一个变量的内存地址。
- `*` (解引用运算符)：获取一个指针所指向的地址上的**值**。

```c++
#include <iostream>
using namespace std;

int main() {
    int var = 20; // 一个普通变量
    
    // int* ptr; 表示 ptr 是一个 "指向 int 类型的指针"
    int* ptr = &var; // ptr 存储了 var 变量的内存地址
    
    cout << "var 的值 (var): " << var << endl;
    cout << "var 的地址 (&var): " << &var << endl;
    cout << "ptr 存储的值 (ptr): " << ptr << endl;   // (会打印 var 的地址)
    cout << "ptr 指向的值 (*ptr): " << *ptr << endl; // (会打印 var 的值)
    
    // 通过指针修改值
    *ptr = 50; 
    
    cout << "--- After *ptr = 50 ---" << endl;
    cout << "var 的新值 (var): " << var << endl; // var 变成了 50
}
```

了解指针有助于理解 C++ 的底层（例如 `vector` 为什么比 C 数组慢一点点，因为它在堆上分配内存），但在算发竞赛中，**你几乎不需要自己声明或使用指针**。如果想要用c和c++进行开发的同学可以深入了解指针。
