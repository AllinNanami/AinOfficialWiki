---
theme: default
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: true
info: |
  ## 算法入门：复杂度、排序与二分查找
  掌握算法分析和经典算法
drawings:
  persist: false
transition: slide-left
title: 算法入门：复杂度、排序与二分查找
mdc: true
download: true
---

# 算法入门

复杂度、排序与二分查找

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    开始学习 <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: section
---

# 一. 时间与空间复杂度

---

# 什么是复杂度？

评估算法性能的关键指标

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### ⏱️ 时间复杂度

描述算法的**执行效率**（运行时间）

- 越低越好
- 是算法竞赛的主要挑战
- 决定程序能否在时限内通过

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 💾 空间复杂度

描述算法占用的**内存量**

- 竞赛中通常较宽松
- 但仍需注意大数据量
- 有时需要空间优化

</div>

</div>

---

# 时间复杂度表示法

使用大 O 表示法 O(f(N))

<div class="mt-6">

### 常见的时间复杂度（从快到慢）

| 复杂度 | 名称 | 示例 |
|--------|------|------|
| $O(1)$ | 常数时间 | 数组访问 `a[i]` |
| $O(\log N)$ | 对数时间 | 二分查找、GCD |
| $O(\sqrt{N})$ | 平方根时间 | 质数判定 |
| $O(N)$ | 线性时间 | 数组遍历 |

</div>

---

# 时间复杂度表示法（续）

更复杂的时间复杂度

<div class="mt-6">

### 常见的时间复杂度（续）

| 复杂度 | 名称 | 示例 |
|--------|------|------|
| $O(N \log N)$ | 线性对数时间 | 快排、归并排序 |
| $O(N^2)$ | 平方时间 | 冒泡排序、双层循环 |
| $O(2^N)$ | 指数时间 | 枚举子集 |
| $O(N!)$ | 阶乘时间 | 全排列 |

</div>

---

# 核心原则：忽略常数因子

为什么 O(2N) = O(5N) = O(N)?

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

### 大 O 表示法的含义

- 大 O 表示法代表**增长趋势**
- 常数因子不影响渐近行为
- 在 N 足够大时，常数的影响可以忽略

</div>

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

**示例：**
- `2N + 5` → O(N)
- `3N² + 2N + 1` → O(N²)
- `N/2` → O(N)

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

**特殊情况：**
- 常数操作如 `A + B` → O(1)
- 即使执行多次，只要是常数次就是 O(1)

</div>

</div>

---

# 复杂度分析示例 1

寻找数组中的最小值

```cpp
const int MAXN = 200000 + 5;
int a[MAXN];
int n;

int min_val = 2e9; // 初始化为正无穷
for (int i = 1; i <= n; ++i) { // 循环 N 次
    if (a[i] < min_val) {
        min_val = a[i];
    }
}
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 复杂度分析

- 循环执行 **N 次**
- 循环内操作（比较、赋值）都是 **O(1)**
- 总操作数约为 $C \times N$
- **时间复杂度：** $O(N)$

</div>

---

# 复杂度分析示例 2

最大公约数 (GCD) - 欧几里得算法

```cpp
int gcd(int x, int y) {
    if (y == 0) {
        return x;
    }
    return gcd(y, x % y); // 递归调用
}
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 复杂度分析

- 每一步递归中，Y 都在减小
- 保证至少会减半
- 递归深度最多为 $O(\log N)$
- **时间复杂度：** $O(\log N)$

</div>

---

# 复杂度分析示例 3

一个特殊的嵌套循环

```cpp
int n;
long long c = 0;
for (int i = 1; i <= n; ++i) {
    for (int j = i; j <= n; j += i) {
        c++;
    }
}
```

<div class="mt-6">

### 复杂度分析

- `i=1` 时，执行 N/1 次
- `i=2` 时，执行 N/2 次
- `i=3` 时，执行 N/3 次
- 总次数：$N \times (1 + \frac{1}{2} + \frac{1}{3} + ... + \frac{1}{N})$ = $N \times \ln N$
- **时间复杂度：** $O(N \log N)$

</div>

---

# 空间复杂度

衡量算法占用的临时存储空间

<div class="mt-6">

### 常见的空间复杂度

| 数据结构 | 空间复杂度 | 示例 |
|----------|-----------|------|
| 单个变量 | $O(1)$ | `int x;` |
| 一维数组 | $O(N)$ | `int arr[N];` |
| 二维数组 | $O(N \times M)$ | `int grid[N][M];` |
| 递归栈 | $O(\text{深度})$ | 快排 $O(\log N)$ |

</div>

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

💡 **提示：** 算法竞赛中空间限制通常较宽松，除非题目明确要求优化

</div>

---
layout: section
---

# 二. 冒泡排序 (Bubble Sort)

---

# 冒泡排序核心思想

最基础、最直观的排序算法

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 核心思想

- 重复遍历数组，比较相邻元素
- 如果顺序错误就交换它们
- 较大的元素会像"气泡"一样逐渐"浮"到数组末尾
- 每一轮确定一个最大值的位置

</div>

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

💡 **形象比喻：** 就像水中的气泡逐渐上浮到水面

</div>

---

# 冒泡排序动画演示

<div class="mt-6">

![](https://gastigado.cnies.org/d/public/157380_bubble_sort.gif)

</div>

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">

每次比较相邻元素，将较大的交换到右边

</div>

---

# 冒泡排序代码实现

```cpp {all|4-5|6-9}
// 对数组 a[1...n] 进行冒泡排序
void bubble_sort(int a[], int n) {
    // 外层循环：需要 n-1 轮
    for (int i = 1; i < n; i++) {
        // 内层循环：每轮比较相邻元素
        for (int j = 1; j <= n - i; j++) {
            // 如果前面的元素大于后面的，交换它们
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
            }
        }
    }
}
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 代码说明

- **外层循环：** 控制轮数，需要 n-1 轮
- **内层循环：** 每轮比较相邻元素并交换
- **范围缩小：** 每轮后最大的元素已就位，下一轮范围减 1

</div>

---

# 冒泡排序优化版本

提前结束已经有序的情况

```cpp {all|4|6-7|13-14}
// 优化版冒泡排序
void bubble_sort_optimized(int a[], int n) {
    for (int i = 1; i < n; i++) {
        bool swapped = false; // 标记本轮是否发生交换
        
        for (int j = 1; j <= n - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        
        // 如果本轮没有发生交换，说明已经有序，提前退出
        if (!swapped) break;
    }
}
```

<div class="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded">

💡 **优化思路：** 如果某一轮没有发生任何交换，说明数组已经有序，可以提前结束

</div>

---

# 冒泡排序复杂度分析

<div class="mt-6">

| 指标 | 复杂度 | 说明 |
|------|--------|------|
| **平均时间** | $O(N^2)$ | 需要约 N²/2 次比较 |
| **最坏时间** | $O(N^2)$ | 数组完全逆序时 |
| **最好时间** | $O(N)$ | 数组已有序（优化版本） |
| **空间复杂度** | $O(1)$ | 只需常数级额外空间 |
| **稳定性** | **稳定** | 相等元素不会交换位置 |

</div>

<div class="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded">

### ❌ 为什么不推荐冒泡排序？

- 时间复杂度太高（$O(N^2)$）
- 在数据量大时效率极低
- 实际应用中几乎不使用
- **但是：** 理解冒泡排序有助于理解排序的基本思想

</div>

---

# 冒泡排序示例

排序过程演示

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 初始数组

```
[5, 3, 8, 4, 2]
```

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 排序过程

**第 1 轮：**（比较相邻元素）
- 比较 5 和 3，交换 → `[3, 5, 8, 4, 2]`
- 比较 5 和 8，不交换 → `[3, 5, 8, 4, 2]`
- 比较 8 和 4，交换 → `[3, 5, 4, 8, 2]`
- 比较 8 和 2，交换 → `[3, 5, 4, 2, 8]` ✓ 最大值就位

**第 2 轮：**
- 比较 3 和 5，不交换 → `[3, 5, 4, 2, 8]`
- 比较 5 和 4，交换 → `[3, 4, 5, 2, 8]`
- 比较 5 和 2，交换 → `[3, 4, 2, 5, 8]` ✓ 次大值就位

**第 3 轮：**
- 比较 3 和 4，不交换 → `[3, 4, 2, 5, 8]`
- 比较 4 和 2，交换 → `[3, 2, 4, 5, 8]` ✓

**第 4 轮：**
- 比较 3 和 2，交换 → `[2, 3, 4, 5, 8]` ✓ 排序完成

</div>

</div>

---
layout: section
---

# 三. 快速排序 (Quick Sort)

---

# 快速排序核心思想

基于"分治"（Divide and Conquer）的高效排序

<div class="mt-6 grid grid-cols-3 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">

### 1. 分 (Partition)

选取基准值(Pivot)

将数组分为两部分

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded text-center">

### 2. 治 (Conquer)

递归排序左右子数组

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900 rounded text-center">

### 3. 合 (Combine)

原地排序，无需合并

</div>

</div>

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

**关键特性：** 小于基准值的在左边，大于基准值的在右边

</div>

---

# 快速排序代码模板

```cpp {all|5|8-10|12-20}
// a[] 是全局数组
void quick_sort(int l, int r) {
    if (l >= r) return; // 递归出口

    // 1. 选取基准值和初始化指针
    int x = a[l + r >> 1], i = l - 1, j = r + 1;

    // 2. 核心分区循环
    while (i < j) {
        // 3. 移动左指针，找到第一个 >= x 的元素
        while (a[++i] < x);
        // 4. 移动右指针，找到第一个 <= x 的元素
        while (a[--j] > x);
        
        // 5. 交换
        if (i < j) swap(a[i], a[j]);
    }

    // 6. 递归处理子区间
    quick_sort(l, j);
    quick_sort(j + 1, r);
}
```

---

# 快速排序步骤详解（1/3）

基准值与指针初始化

<div class="mt-6">

```cpp
int x = a[l + r >> 1], i = l - 1, j = r + 1;
```

</div>

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 基准值选择

- `l + r >> 1` 等价于 `(l + r) / 2`
- 选取**中间位置**的元素作为基准值
- 位运算效率更高

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 指针初始化（精髓！）

- `i = l - 1`：左指针从左边界外开始
- `j = r + 1`：右指针从右边界外开始
- 配合 `++i` 和 `--j` 使用

</div>

</div>

---

# 快速排序步骤详解（2/3）

双指针移动与交换

```cpp
while (i < j) {
    while (a[++i] < x);  // 先右移，找到 >= x 的位置
    while (a[--j] > x);  // 先左移，找到 <= x 的位置
    
    if (i < j) swap(a[i], a[j]);
}
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 移动规则

1. **左指针 i：** 不断右移，直到找到一个 `>= x` 的元素（不该在左边的）
2. **右指针 j：** 不断左移，直到找到一个 `<= x` 的元素（不该在右边的）
3. **交换：** 如果 `i < j`，交换它们，将元素放到正确的分区
4. **结束：** 当 `i >= j` 时，分区完成

</div>

---

# 快速排序步骤详解（3/3）

递归子区间

```cpp
quick_sort(l, j);
quick_sort(j + 1, r);
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 为什么是 j 和 j+1？（第二个精髓！）

- 循环结束时，`j` 左侧（包括 `j`）的元素都 **≤ x**
- `j` 右侧的元素都 **≥ x**
- 将数组分为 `[l, j]` 和 `[j+1, r]` 两部分
- 递归排序这两个子区间

</div>

<div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

💡 **注意：** 使用 `j` 作为分界点，无论 `i` 和 `j` 重合还是交错都能正确处理

</div>

---

# 快速排序复杂度分析

<div class="mt-6">

| 指标 | 复杂度 | 说明 |
|------|--------|------|
| **平均时间** | $O(N \log N)$ | 大多数情况下的表现 |
| **最坏时间** | $O(N^2)$ | 数组已有序且基准值总选到极值 |
| **空间复杂度** | $O(\log N)$ | 递归栈的深度 |
| **稳定性** | 不稳定 | 相同元素的相对位置可能改变 |

</div>

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

### ⚠️ 避免最坏情况

- 选择**中间位置**作为基准值（而非第一个或最后一个）
- 或使用**随机化**快排

</div>

---
layout: section
---

# 四. 归并排序 (Merge Sort)

---

# 归并排序核心思想

以稳定、高效著称的分治排序

<div class="mt-6 grid grid-cols-3 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">

### 1. 分 (Divide)

不断对半切分

直到只剩一个元素

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded text-center">

### 2. 治 (Conquer)

递归排序子数组

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900 rounded text-center">

### 3. 合 (Merge)

合并两个有序数组

成为更大的有序数组

</div>

</div>

<div class="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded">

**核心特点：** 需要额外的 O(N) 空间来存储合并结果

</div>

---

# 归并排序代码模板

```cpp {all|5|8-10|13-24}
// a[] 和 N 是全局的
void merge_sort(int l, int r) {
    if (l >= r) return; // 递归出口
    // 1. 临时数组，用于合并
    int temp[N];
    // 2. 分：计算中点并递归
    int mid = l + r >> 1;
    merge_sort(l, mid);
    merge_sort(mid + 1, r);
    // 3. 合：合并两个有序子数组 [l, mid] 和 [mid+1, r]
    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (a[i] < a[j]) temp[k++] = a[i++];
        else temp[k++] = a[j++];
    }
    // 4. 处理剩余元素
    while (i <= mid) temp[k++] = a[i++];
    while (j <= r) temp[k++] = a[j++];
    // 5. 将排好序的 temp 数组复制回原数组 a
    for (int i = l, j = 0; i <= r; i++, j++) a[i] = temp[j];
}
```

---

# 归并排序步骤详解（1/2）

分治过程

<div class="mt-6">

```cpp
// 2. 分：计算中点并递归
int mid = l + r >> 1;
merge_sort(l, mid);
merge_sort(mid + 1, r);
```

</div>

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 分治过程

1. 计算中点 `mid`
2. 递归排序左半部分 `[l, mid]`
3. 递归排序右半部分 `[mid+1, r]`
4. 当这两行执行完，两个子数组各自内部已经有序

</div>

---

# 归并排序步骤详解（2/2）

合并两个有序数组

```cpp
int k = 0, i = l, j = mid + 1;
while (i <= mid && j <= r) {
    if (a[i] < a[j]) temp[k++] = a[i++];
    else temp[k++] = a[j++];
}
while (i <= mid) temp[k++] = a[i++];
while (j <= r) temp[k++] = a[j++];

for (int i = l, j = 0; i <= r; i++, j++) a[i] = temp[j];
```

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 合并过程

- 使用双指针 `i` 和 `j`
- 每次选择较小的元素放入 `temp`
- 移动对应的指针

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 处理剩余

- 将未处理完的子数组元素全部复制
- 最后将 `temp` 复制回原数组

</div>

</div>

---

# 归并排序复杂度分析

<div class="mt-6">

| 指标 | 复杂度 | 说明 |
|------|--------|------|
| **平均时间** | $O(N \log N)$ | 非常稳定 |
| **最坏时间** | $O(N \log N)$ | 无论什么情况都是这个复杂度 |
| **空间复杂度** | $O(N)$ | 需要额外的 temp 数组 |
| **稳定性** | **稳定** | 相等元素的相对顺序不变 |

</div>

<div class="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded">

### ✅ 归并排序的优势

- **时间稳定：** 无论什么情况都是 $O(N \log N)$
- **稳定排序：** 保持相等元素的相对顺序
- **分治思想：** 是很多高级算法的基础

</div>

---

# 实际开发中的选择

99% 的情况下使用 std::sort

<div class="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 rounded-lg">

### 🎉 恭喜！你学完了两种核心的 O(N log N) 排序算法

**然而，在 99% 的实际开发和算法竞赛中...**

</div>

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-red-50 dark:bg-red-900 rounded">

### ❌ 手写排序

- 容易出错
- 可能有性能问题
- 代码冗长

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### ✅ 使用 std::sort

```cpp
sort(a, a + n);  // 一行搞定！
```

- 更快（高度优化）
- 更安全（规避最坏情况）
- 更省心

</div>

</div>

<div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded text-sm">

⚠️ **但是：** 归并排序的"稳定"特性和"分治"思想仍需牢记！面试要考！

</div>

---
layout: section
---

# 五. 二分查找 (Binary Search)

---

# 二分查找原理

在有序数组中高效查找

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 核心思想

- 不断将搜索区间**减半**
- 每次排除一半的元素
- 时间复杂度 $O(\log N)$

</div>

<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">

### ⚠️ 前提条件

数组必须是**有序的**！

</div>

---

# 二分查找图解

<div class="mt-6">

![](https://gastigado.cnies.org/d/public/157380_f93a5c31dc-PIC2.png)

</div>

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">

每次比较中间元素，决定往左还是往右继续搜索

</div>

---

# 二分查找的两个模板

解决不同的问题

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 模板 1：查找左边界

查找**第一个**满足条件的位置

```cpp
while (l < r) {
    int mid = l + r >> 1;
    if (check(mid)) 
        r = mid;
    else 
        l = mid + 1;
}
```

**用途：** 找第一个 ≥ x 的数

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 模板 2：查找右边界

查找**最后一个**满足条件的位置

```cpp
while (l < r) {
    int mid = l + r + 1 >> 1;
    if (check(mid)) 
        l = mid;
    else 
        r = mid - 1;
}
```

**用途：** 找最后一个 ≤ x 的数

</div>

</div>

---

# 模板 1：查找左边界

寻找第一个满足条件的位置

```cpp
// 检查 q[mid] 是否满足条件
while (l < r) {
    int mid = l + r >> 1; // 向下取整
    if (check(q[mid])) 
        r = mid;     // 答案可能在 [l, mid]
    else 
        l = mid + 1; // 答案一定在 [mid+1, r]
}
// 循环结束时 l == r，即为答案
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 流程说明

1. `mid` **向下取整**（不加 1）
2. 如果 `check(mid)` 为真，说明答案可能是 `mid` 或在其左边，所以 `r = mid`
3. 如果为假，说明 `mid` 不是答案，答案在右边，所以 `l = mid + 1`

</div>

---

# 模板 2：查找右边界

寻找最后一个满足条件的位置

```cpp
// 检查 q[mid] 是否满足条件
while (l < r) {
    int mid = l + r + 1 >> 1; // 向上取整
    if (check(q[mid])) 
        l = mid;     // 答案可能在 [mid, r]
    else 
        r = mid - 1; // 答案一定在 [l, mid-1]
}
// 循环结束时 l == r，即为答案
```

<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 流程说明（注意 +1！）

1. `mid` **向上取整**（必须加 1，防止死循环！）
2. 如果 `check(mid)` 为真，说明答案可能是 `mid` 或在其右边，所以 `l = mid`
3. 如果为假，说明 `mid` 不是答案，答案在左边，所以 `r = mid - 1`

</div>

---

# 为什么模板 2 必须 +1？

防止死循环

<div class="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded">

### 不加 1 会导致死循环

假设 `l = 5, r = 6`：
- `mid = (5 + 6) / 2 = 5`（向下取整）
- 如果 `check(5)` 为真，执行 `l = mid = 5`
- **问题：** `l` 和 `r` 都没变，死循环！

</div>

<div class="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded">

### 加 1 解决问题

假设 `l = 5, r = 6`：
- `mid = (5 + 6 + 1) / 2 = 6`（向上取整）
- 如果 `check(6)` 为真，执行 `l = 6`，循环结束
- 如果 `check(6)` 为假，执行 `r = 5`，循环结束

</div>

---

# 二分查找总结

选择正确的模板

<div class="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 rounded-lg text-lg">

### 🎯 记住这个规则

- 当更新逻辑是 `r = mid` 时，`mid` **向下取整**（不加 1）
- 当更新逻辑是 `l = mid` 时，`mid` **向上取整**（加 1）

</div>

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

**模板 1** - 查找左边界
- `r = mid`
- `mid = l + r >> 1`
- 找第一个满足条件的

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

**模板 2** - 查找右边界
- `l = mid`
- `mid = l + r + 1 >> 1`
- 找最后一个满足条件的

</div>

</div>

---
layout: section
---

# 六. 总结对比

---

# 排序与查找算法对比

<div class="mt-6">

| 算法 | 核心思想 | 平均时间 | 最坏时间 | 空间 | 稳定性 | 备注 |
|------|---------|---------|---------|------|--------|------|
| **冒泡排序** | 交换 | $O(N^2)$ | $O(N^2)$ | $O(1)$ | **稳定** | 简单但低效，仅用于学习 |
| **快速排序** | 分治 | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ | 不稳定 | 原地排序，实现精妙 |
| **归并排序** | 分治 | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | **稳定** | 时间稳定，需额外空间 |
| **二分查找** | 减治 | $O(\log N)$ | $O(\log N)$ | $O(1)$ | N/A | **前提：数组有序** |
| **std::sort** | 混合 | $O(N \log N)$ | $O(N \log N)$ | $O(\log N)$ | 不稳定 | **推荐使用** |
| **stable_sort** | 归并 | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | **稳定** | 需要稳定排序时用 |

</div>

---

# 何时使用哪种算法？

根据需求选择合适的算法

<div class="mt-6 grid grid-cols-2 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 排序需求

- **一般情况：** `std::sort`
- **需要稳定性：** `stable_sort`
- **学习/面试：** 手写快排/归并
- **特殊场景：** 基数排序、计数排序

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 查找需求

- **有序数组：** 二分查找 O(log N)
- **无序数组：** 顺序查找 O(N)
- **频繁查询：** 先排序再二分
- **动态数据：** 使用 `set` 或 `map`

</div>

</div>

---
layout: center
class: text-center
---

# 总结

<div class="mt-8 grid grid-cols-3 gap-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">

### 📊 复杂度分析

- 时间复杂度
- 空间复杂度
- 大 O 表示法

</div>

<div class="p-4 bg-green-50 dark:bg-green-900 rounded">

### 🔄 排序算法

- 冒泡排序
- 快速排序
- 归并排序
- std::sort

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900 rounded">

### 🔍 二分查找

- 查找左边界
- 查找右边界
- 二分答案

</div>

</div>

<div class="mt-12 text-2xl">

🎉 掌握这些算法，算法竞赛更上一层楼！

</div>

---
layout: center
class: text-center
---

# 课后练习

<div class="mt-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">

### 📝 推荐练习题目

1. **洛谷 P1923** - 求第 k 小的数（快速排序）
2. **洛谷 P1024** - 一元三次方程求解（二分查找）
3. **洛谷 P2440** - 木材加工（二分答案）
4. **洛谷 P1177** - 快速排序模板题
5. **洛谷 P1059** - 明明的随机数（去重排序）

</div>

<div class="mt-8">

💡 **提示：** 先尝试自己实现，再对比标准答案

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
  <a href="/handouts/lesson3-sort-2025" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block">
    查看完整教程 →
  </a>
</div>

</div>

---
layout: end
---

# 谢谢观看

继续学习，持续进步 💪

