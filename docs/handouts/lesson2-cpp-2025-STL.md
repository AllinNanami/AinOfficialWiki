---
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

# C++ STL (标准模板库) 

> STL (Standard Template Library)：是 C++ 标准库的重要组成部分，不仅是一个可复用的组件库，而且是一个包罗数据结构与算法的软件框架。
>
> **通俗来说：**STL 就是将常见的数据结构（例如 顺序表，链表，栈，队列，二叉树，哈希...）以模板的形式进行封装，使用时，不用我们人为再去写，可以直接调用。并且包含常见的通用的泛型算法（一些常规的算法也不用自己实现，可以直接调用）。

### STL 六大组件

- **容器（Container）：** 各种数据结构，如 `vector`、`list`、`deque`、`set`、`map` 等，以模板类的方法提供。为了访问容器中的数据，可以使用由容器类输出的迭代器。

- **算法（Algorithm）：** 各种常用算法，提供了执行各种操作的方式，包括对容器内容执行初始化、排序、搜索和转换等操作，如 `sort`、`find`、`copy`、`erase` 函数等。函数本身与它们操作的数据的结构和类型无关，因此它们可以在从简单数组到高度复杂容器的任何数据结构上使用。

- **迭代器（Iterator）：** 迭代器提供了访问容器中对象的方法，扮演容器与算法之间的胶合剂，是所谓的“泛型指针”，共有 5 种类型，以及其他衍生变化，是一种将 `operator*`、`operator->`、`operator++`、`operator--` 等指针操作予以重载的模板类。所有的 STL 容器附带有自己专属的迭代器，因为只有容器设计者才知道如何遍历自己的元素。

  > c++11版本及以后就可以不用迭代器了。

- **仿函数（Functor）：** 也称为函数对象（Function object），行为类似函数，可作为算法的某种策略。从实现角度来看，仿函数是一种重载了 `operator()` 的类或者模板类。

- **适配器（Adaptor）：** 一种用来修饰容器、仿函数或者迭代器接口的机制。例如 STL 提供的 `queue` 和 `stack`，就是一种空间配接器，因为它们的底部完全借助于 `deque`。

- **分配器（allocator）：** 也称为空间配置器，负责空间的配置与管理。从实现的角度来看，配置器是一个实现了动态配置空间、空间管理、空间释放的模板类。



## 算法 (Algorithm)

头文件：`#include <algorithm>`

### 常用函数

- **`sort()`**

  - **功能：** `sort()` 函数可以对给定区间所有元素进行排序。
  - **参数：** `sort(begin, end, cmp)`
    - `begin`：指向待 `sort()` 的数组的第一个元素的指针。
    - `end`：指向待 `sort()` 的数组的最后一个元素的下一个位置的指针。
    - `cmp`：排序准则，可以不写，默认从小到大进行排序。

  ```c++
  #include<iostream>
  #include<algorithm>
  using namespace std;
  
  int main(){
      int num[10] = {6,5,9,1,2,8,7,3,4,0};
      // greater<int>() 是一个仿函数，表示降序排列，这里只做演示，是一个伪代码
      sort(num, num+10, greater<int>());
      // 排序后 num 变为：9 8 7 6 5 4 3 2 1 0
      return 0;
  }
  ```

- **`swap()`**交换两个数的值

  ```c++
  int a = 1, b = 2 ;
  cout << a << ' ' << b << '\n' ;
  swap(a, b) ;
  ```

- **`min()`**取最小值

- **`max()`**取最大值



### 💡 排序练习

[P5740 【深基7.例9】最厉害的学生 - 洛谷](https://www.luogu.com.cn/problem/P5740)

# P5740 【深基7.例9】最厉害的学生

## 题目描述

现有 $N$ 名同学参加了期末考试，并且获得了每名同学的信息：姓名（不超过 $8$ 个字符的仅有英文小写字母的字符串）、语文、数学、英语成绩（均为不超过 $150$ 的自然数）。总分最高的学生就是最厉害的，请输出最厉害的学生各项信息（姓名、各科成绩）。如果有多个总分相同的学生，输出靠前的那位。

## 输入格式

第一行输入一个正整数 $N$，表示学生个数。

第二行开始，往下 $N$ 行，对于每一行首先先输入一个字符串表示学生姓名，再输入三个自然数表示语文、数学、英语的成绩。均用空格相隔。

## 输出格式

输出最厉害的学生。

## 输入输出样例 #1

### 输入 #1

```
3
senpai 114 51 4
lxl 114 10 23
fafa 51 42 60
```

### 输出 #1

```
senpai 114 51 4
```

## 说明/提示

数据保证，$1 \leq N \leq 1000$，姓名为长度不超过 $8$ 的字符串，语文、数学、英语成绩均为不超过 $150$ 的自然数。

---

**自定义 `cmp` 函数实现结构体排序**

```c++
#include <bits/stdc++.h>
using namespace std ;
const int N = 1008 ;

struct node {
    string name ;
    int a, b, c ;
    int sum ;
    int num ;
} no[N];

// 自定义比较函数
bool cmp(node x, node y) {
    // 如果总分相同
    if (x.sum == y.sum) {
        // 按学号从小到大
        return x.num < y.num ;
    }
    // 否则按总分从大到小
    return x.sum > y.sum ;
}

int main() {
    int n ;
    cin >> n ;
    for (int i = 1 ; i <= n ; i ++) {
        cin >> no[i].name >> no[i].a >> no[i].b >> no[i].c ;
        no[i].sum = no[i].a + no[i].b + no[i].c ;
        no[i].num = i ;
    }

    // 使用自定义的 cmp 函数进行排序
    sort(no + 1, no + n + 1, cmp) ;

    cout << no[1].name << ' ' << no[1].a << ' ' << no[1].b << ' ' << no[1].c <<'\n' ;
    return 0 ;
}
```

------



## 📦 容器 (Container)

容器是存放数据的数据结构，比如链表，数组，队列... 容器都是一个类（用法与结构体相似）。访问类对象内的函数或变量用点运算符 `.`。

### `vector` (可变长度数组)

vector翻译为向量，但是这里使用“变长数组”的叫法更容易理解，也即“长度根据需要而自动改变的数组”。我们知道在C语言中，普通数组大小一旦确定就不能改变了，在做题时有时会碰到只用普通数组会超内存的情况，这时我们就可以使用vector来定义不定长数组节省空间。

#### 定义

```c++
#include <vector>
vector<typename> name;

// 示例：
vector<int> v = {1, 2, 3};
```

#### 常用函数

- `push_back(x)`：在 vector 后面添加一个元素 `x`，时间复杂度 O(1)。
- `pop_back()`：删除 vector 最后一个元素，时间复杂度 O(1)。
- `back()`：返回最后一个元素的值。
- `front()`：返回第一个元素的值。
- `size()`：返回 vector 中元素的个数，时间复杂度 O(1)。
- `clear()`：清空 vector 中的所有元素，时间复杂度 O(N)。
- `insert(it, x)`：向迭代器 `it` 处插入一个元素 `x`，时间复杂度 O(N)。
- `erase(it)`：删除迭代器 `it` 处的元素。
- `erase(first, last)`：删除 `[first, last)` 区间内的所有元素。

#### 迭代器

```c++
vector<int> v = {1, 2, 3};
vector<int>::iterator it ;

// 传统迭代器遍历
for (it = v.begin() ; it != v.end() ; it ++) {
    cout << *it << '\n' ;
}

// C++11 
// 
// 
// 
for (auto i : v) { // auto 自动推导类型
    cout << i << ' ' ;
}
```



#### 练习

[P1567 统计天数 - 洛谷](https://www.luogu.com.cn/problem/P1567)

# P1567 统计天数

## 题目描述

炎热的夏日，KC 非常的不爽。他宁可忍受北极的寒冷，也不愿忍受厦门的夏天。最近，他开始研究天气的变化。他希望用研究的结果预测未来的天气。


经历千辛万苦，他收集了连续 $N(1 \leq N \leq 10^6)$ 天的最高气温数据。

现在，他想知道最高气温一直上升的最长连续天数。

## 输入格式

第 1 行：一个整数 $N$ 。$1 \leq N \leq 10^6$

第 2 行：$N$个空格隔开的整数，表示连续 $N$ 天的最高气温。$0 \leq$ 最高气温 $\leq 10^9$ 。

## 输出格式

1 行：一个整数，表示最高气温一直上升的最长连续天数。

## 输入输出样例 #1

### 输入 #1

```
10
1 2 3 2 4 5 6 8 5 9
```

### 输出 #1

```
5
```

---

```c++
#include <bits/stdc++.h>
using namespace std ;

int main() {
    int n ;
    cin >> n ;
    vector<int> a;

    for (int i = 1 ; i <= n ; i ++) {
        int x ;
        cin >> x ;
        a.push_back(x) ;
    }

    int ans = 1, tmp = 1 ;
    for (int i = 1 ; i < a.size() ; i ++) {
        if (a[i] > a[i - 1]) {
            tmp ++ ;
        } else {
            ans = max(ans, tmp) ;
            tmp = 1 ;
        }
    }
    ans = max(ans, tmp) ; // 别忘了最后一次的比较

    cout << ans << '\n' ;
    return 0 ;
}
```

------



### `string` (字符串)

C++ 在 STL 中加入了 `string` 类型，对字符串常用的需求功能进行了封装，使得操作起来更方便，且不易出错。

#### 头文件

```c++
#include <string>
```

#### 定义

```c++
string a = "abcd";
```

#### 常用函数

- `+=`：字符串拼接，假设有两个字符串`a`和`b`，可用`a+=b`或`a=a+b`来将`b`接到`a`的后面。
- `==`, `!=`, `<`, `<=`, `>`, `>=`：按字典序比较大小。
- `length()` / `size()`：返回字符串长度，O(1)。
- `erase(it)`：删除 `it` 处的字符，`it` 为迭代器。
- `erase(first, last)`：删除 `[first, last)` 区间的字符，`first`, `last` 为迭代器。
- `erase(pos, length)`：`pos` 为开始删除的起始位置，`length` 为删除的字符个数。
- `clear()`：清空字符串 O(1)。
- `substr(pos, len)`：返回从 `pos` 号位置开始、长度为 `len` 的子串，O(len)。
- `find(str2)`：当 `str2` 是 `str` 的子串时，返回其在 `str` 中第一次出现的位置；否则返回 `string::npos`。O(NM)。
- `front()`：返回第一个字符。
- `back()`：返回最后一个字符。
- `push_back(x)`：将字符 `x` 加到字符串后。
- `pop_back()`：删除最后一个字符。

------



### `map` (映射)

Map (映射) 元素包含两部分（key, value），key 和 value 可以是任意类型。在 map 里面，一个 key 对应一个 value，类似函数里一个 x 对应一个 y。并且在 map 里，key 不能重复，自动按 key 从小到大排序。

#### 定义

```c++
#include <map>

map<int, int> mp; // 定义了一个 int 映射 int 的 map
map<int, char> mp; // int -> char
```

#### 常见函数

- `insert(make_pair(x, y))`：插入 key 为 `x`，value 为 `y` 的映射。

- `insert({x,y})`：C++11 版本之后，可以用花括号来生成 pair 二元组。

- **遍历 map**

  ```c++
  map<int, int>::iterator i;
  for(i = mp.begin(); i != mp.end(); i++) {
      cout << i->first << ' ' << i->second; // first 是 key, second 是 value
  }
  
  // C++11 
  // 
  // 
  // 
  for(auto i : mp) {
      cout << i.first << ' ' << i.second << '\n';
  }
  
  // C++17 
  // 
  // 
  // 
  for(auto [a,b] : mp) { // 结构化绑定
      cout << a << ' ' << b << '\n';
  }
  ```

#### 练习

[P1125[NOIP2008 提高组] 笨小猴 - 洛谷](https://www.luogu.com.cn/problem/P1125)

# P1125 [NOIP 2008 提高组] 笨小猴

## 题目描述

笨小猴的词汇量很小，所以每次做英语选择题的时候都很头疼。但是他找到了一种方法，经试验证明，用这种方法去选择选项的时候选对的几率非常大！

这种方法的具体描述如下：假设 $\text{maxn}$ 是单词中出现次数最多的字母的出现次数，$\text{minn}$ 是单词中出现次数最少的字母的出现次数，如果 $\text{maxn}-\text{minn}$ 是一个质数，那么笨小猴就认为这是个 Lucky Word，这样的单词很可能就是正确的答案。

## 输入格式

一个单词，其中只可能出现小写字母，并且长度小于 $100$。

## 输出格式

共两行，第一行是一个字符串，假设输入的单词是 Lucky Word，那么输出 `Lucky Word`，否则输出 `No Answer`；

第二行是一个整数，如果输入的单词是 Lucky Word，输出 $\text{maxn}-\text{minn}$ 的值，否则输出 $0$。

## 输入输出样例 #1

### 输入 #1

```
error
```

### 输出 #1

```
Lucky Word
2
```

## 输入输出样例 #2

### 输入 #2

```
olympic
```

### 输出 #2

```
No Answer
0
```

## 说明/提示

【输入输出样例 1 解释】

单词 `error` 中出现最多的字母 $\texttt r$ 出现了 $3$ 次，出现次数最少的字母出现了 $1$ 次，$3-1=2$，$2$ 是质数。

【输入输出样例 2 解释】

单词 `olympic` 中出现最多的字母 $\texttt i$ 出现了 $1$ 次，出现次数最少的字母出现了 $1$ 次，$1-1=0$，$0$ 不是质数。

（本处原题面错误已经修正）

noip2008 提高第一题

---

```c++
#include <bits/stdc++.h>
#define inf 0x3f3f3f3f
using namespace std ;

map<char, int> cnt; // 统计每个字符出现的次数

// 判断是否为素数
bool judge(int x) {
    if (x == 0 || x == 1) {
        return false ;
    }
    for (int i = 2 ; i * i <= x ; i ++) {
        if (x % i == 0) {
            return false ;
        }
    }
    return true ;
}

int main() {
    string s ;
    cin >> s ;
    for (auto i : s) {
        cnt[i] ++ ; // map可以直接用[]来访问和修改value
    }

    int minn = inf, maxn = -1 ;
    for (auto i : s) {
        minn = min(minn, cnt[i]) ;
        maxn = max(maxn, cnt[i]) ;
    }

    if (judge(maxn - minn)) {
        cout << "Lucky Word" << '\n' ;
        cout << maxn - minn << '\n' ;
    } else {
        cout << "No Answer\n0\n" ;
    }
    return 0 ;
}
```

------



### `queue` (队列)

队列是一种**先进先出 (FIFO)** 的数据结构。和现实中的队列一个样，从队尾添加元素，从队头删除元素。

#### 定义

```c++
#include <queue>
queue<typename> name;
```

#### 常用函数

- `push(x)`：将 `x` 入队（到队尾）。
- `pop()`：将队首元素出队。
- `front()`：返回队首元素。
- `back()`：返回队尾元素。
- `size()`：返回队列元素个数。
- `empty()`：返回队列是否为空。为空时返回 `true`。

#### 练习

[B3616 【模板】队列 - 洛谷](https://www.luogu.com.cn/problem/B3616)

# B3616 【模板】队列

## 题目描述

请你实现一个队列（queue），支持如下操作：
- `push(x)`：向队列中加入一个数 $x$。
- `pop()`：将队首弹出。如果此时队列为空，则不进行弹出操作，并输出 `ERR_CANNOT_POP`。
- `query()`：输出队首元素。如果此时队列为空，则输出 `ERR_CANNOT_QUERY`。
- `size()`：输出此时队列内元素个数。

## 输入格式

第一行，一个整数 $n$，表示操作的次数。  

接下来 $n$ 行，每行表示一个操作。格式如下：

- `1 x`，表示将元素 `x` 加入队列。
- `2`，表示将队首弹出队列。
- `3`，表示查询队首。
- `4`，表示查询队列内元素个数。

## 输出格式

输出若干行，对于每个操作，按「题目描述」输出结果。

每条输出之间应当用空行隔开。

## 输入输出样例 #1

### 输入 #1

```
13
1 2
3
4
1 233
3
2
3
2
4
3
2
1 144
3
```

### 输出 #1

```
2
1
2
233
0
ERR_CANNOT_QUERY
ERR_CANNOT_POP
144
```

## 说明/提示

### 样例解释
首先插入 `2`，队首为 `2`、队列内元素个数为 `1`。  
插入 `233`，此时队首为 `2`。  
弹出队首，此时队首为 `233`。  
弹出队首，此时队首为空。  
再次尝试弹出队首，由于队列已经为空，此时无法弹出。  
插入 `144`，此时队首为 `144`。  

### 数据规模与约定

对于 $100\%$ 的测试数据，满足 $n\leq 10000$，且被插入队列的所有元素值是 $[1, 1000000]$ 以内的正整数。

---

```c++
#include <bits/stdc++.h>
using namespace std ;

int main() {
    int n ;
    cin >> n ;
    queue<int> q ;

    while (n --) {
        int op ;
        cin >> op ;
        if (op == 1) {
            int x ;
            cin >> x ;
            q.push(x) ;
        } else if (op == 2) {
            if (q.empty()) {
                cout << "ERR_CANNOT_POP" << '\n' ;
            } else {
                q.pop() ;
            }
        } else if (op == 3) {
            if (q.empty()) {
                cout << "ERR_CANNOT_QUERY" << '\n' ;
            } else {
                cout << q.front() << '\n' ;
            }
        } else {
            cout << q.size() << '\n' ;
        }
    }
    return 0 ;
}
```

------



### `stack` (栈)

栈是一种**先进后出 (LIFO)** 的数据结构，并且只能在栈顶进行插入和删除操作。

#### 定义

```c++
#include <stack>
stack<typename> name;
```

#### 常用函数

- `push(x)`：将 `x` 压入栈（到栈顶）。
- `pop()`：将栈顶元素弹出。
- `top()`：返回栈顶元素。
- `size()`：返回栈中元素个数。
- `empty()`：返回栈是否为空。

#### 练习

[B3614 【模板】栈 - 洛谷](https://www.luogu.com.cn/problem/B3614)

# B3614 【模板】栈

## 题目描述

请你实现一个栈（stack），支持如下操作：
- `push(x)`：向栈中加入一个数 $x$。
- `pop()`：将栈顶弹出。如果此时栈为空则不进行弹出操作，输出 `Empty`。
- `query()`：输出栈顶元素，如果此时栈为空则输出 `Anguei!`。
- `size()`：输出此时栈内元素个数。

## 输入格式

**本题单测试点内有多组数据**。  
输入第一行是一个整数 $T$，表示数据组数。对于每组数据，格式如下：  
每组数据第一行是一个整数，表示操作的次数 $n$。  
接下来 $n$ 行，每行首先由一个字符串，为 `push`，`pop`，`query` 和 `size` 之一。若为 `push`，则其后有一个整数 $x$，表示要被加入的数，$x$ 和字符串之间用空格隔开；若不是 `push`，则本行没有其它内容。

## 输出格式

对于每组数据，按照「题目描述」中的要求依次输出。每次输出占一行。

## 输入输出样例 #1

### 输入 #1

```
2
5
push 2
query
size
pop
query
3
pop
query
size
```

### 输出 #1

```
2
1
Anguei!
Empty
Anguei!
0
```

## 说明/提示

### 样例 1 解释
对于第二组数据，始终为空，所以 `pop` 和 `query` 均需要输出对应字符串。栈的 size 为 0。

### 数据规模与约定

对于全部的测试点，保证 $1 \leq T, n\leq 10^6$，且单个测试点内的 $n$ 之和不超过 $10^6$，即 $\sum n \leq 10^6$。保证 $0 \leq x \lt 2^{64}$。

### 提示
- 请注意大量数据读入对程序效率造成的影响。
- 因为一开始数据造错了，请注意输出的 `Empty` 不含叹号，`Anguei!` 含有叹号。

---

```c++
#include <bits/stdc++.h>
#define int unsigned long long 
// 
// 
// 
using namespace std ;

void solve() {
    stack<int> s ;
    int n ;
    cin >> n ;
    while (n --) {
        string ss ;
        cin >> ss ;
        if (ss == "push") {
            int x ;
            cin >> x ;
            s.push(x) ;
        } else if (ss == "pop") {
            if (s.empty()) {
                cout << "Empty" << '\n' ;
            } else {
                s.pop() ;
            }
        } else if (ss == "query") {
            if (s.empty()) {
                cout << "Anguei!" << '\n' ;
            } else {
                cout << s.top() << '\n' ;
            }
        } else { // "size"
            cout << s.size() << '\n' ;
        }
    }
}

signed main() {
    ios::sync_with_stdio(false) ; // 加速cin
    cin.tie(0) ; // 解除cin和cout的绑定
    int T ;
    cin >> T ;
    while (T --) {
        solve() ;
    }
    return 0 ;
}
```

------



### `set` (集合)

Set 集合，是一个内部自动有序且不含重复元素的容器。若插入重复元素，会自动忽略该次插入操作，并且 set 里面的元素自动从小到大排序。

#### 定义

```c++
#include <set>
set<typename> name;
```

#### 访问

Set 只能通过迭代器访问。

```c++
set<int> st;
// ... 插入元素 ...

// 1. 迭代器
set<int>::iterator it; 
for(it = st.begin(); it != st.end(); it++) {
    printf("%d", *it); // 可以通过 *it 来访问 set 里的元素
}

// 2. C++11 
// 
// 
// 
for(auto i : st) {
    printf("%d", i);
}
```

#### 常用函数

- `insert(x)`：将 `x` 插入 set 中，并自动递增排序和去重，时间复杂度为 O(logN)。
- `find(x)`：返回 set 中值为 `x` 的迭代器，时间复杂度为 O(logN)。如果找不到，返回 `s.end()`。
- `erase(it)`：`it` 为所需要删除元素的迭代器。时间复杂度为 O(1)。
- `erase(x)`：删除值为 `x` 的元素，时间复杂度为 O(logN)。
- `erase(first, last)`：删除区间 `[first, last)` 内的元素，`first`, `last` 为迭代器。
- `size()`：返回 set 内元素个数。
- `clear()`：清空 set 中的所有元素。

#### 练习

[P1138 第 k 小整数 - 洛谷](https://www.luogu.com.cn/problem/P1138)

# P1138 第 k 小整数

## 题目描述

现有 $n$ 个正整数，要求出这 $n$ 个正整数中的第 $k$ 个最小整数（相同大小的整数只计算一次）。

## 输入格式

第一行为 $n$ 和 $k$; 第二行开始为 $n$ 个正整数的值，整数间用空格隔开。

## 输出格式

第$k$个最小整数的值；若无解，则输出 `NO RESULT`。

## 输入输出样例 #1

### 输入 #1

```
10 3
1 3 3 7 2 5 1 2 4 6
```

### 输出 #1

```
3
```

## 说明/提示

$n \leq 10000$，$k \leq 4000$，正整数均小于 $30000$。

---

方法一 (使用 set):

set 自动排序和去重，非常适合这道题。

```c++
#include <bits/stdc++.h>
using namespace std ;

int main() {
    set<int> s ;
    int n, k ;
    cin >> n >> k ;

    for (int i = 1 ; i <= n ; i ++) {
        int x ;
        cin >> x ;
        s.insert(x) ; // 自动去重和排序
    }

    if (k > s.size()) { // 如果k大于去重后的元素个数
        cout << "NO RESULT" << '\n' ;
    } else {
        int pos = 1 ;
        for (auto i : s) { // 遍历set
            if (pos == k) {
                cout << i << '\n' ;
                break ;
            }
            pos ++ ;
        }
    }
    return 0 ;
}
```

方法二 (使用 vector + map 或 bool 数组去重):

手动去重，然后排序。

```c++
#include <bits/stdc++.h>
using namespace std ;

map<int, bool> vis ; // 用map标记是否出现过

int main() {
    vector<int> a ;
    int n, k ;
    cin >> n >> k ;

    for (int i = 1 ; i <= n ; i ++) {
        int x ;
        cin >> x ;
        if (vis[x]) { // 如果出现过
            continue ;
        }
        vis[x] = true ; // 标记为出现过
        a.push_back(x) ;
    }

    if (k > a.size()) {
        cout << "NO RESULT" << '\n' ;
    } else {
        sort(a.begin(), a.end()) ; // 排序
        cout << a[k - 1] << '\n' ; // vector下标从0开始，第k个是 a[k-1]
    }
    return 0 ;
}
```

