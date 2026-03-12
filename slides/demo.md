---
# 主题配置
theme: ./theme-ain
# 幻灯片标题
title: 3D环梦工坊 - 编程入门
# 幻灯片下载
download: false
# 显示行号
lineNumbers: true
# 语法高亮
highlighter: shiki
fonts:
  provider: none
  sans: Noto Sans SC, PingFang SC, Microsoft YaHei, system-ui, sans-serif
  serif: Noto Serif SC, Source Han Serif SC, serif
  mono: JetBrains Mono, Fira Code, SFMono-Regular, Menlo, Consolas, monospace
# 图标
favicon: /favicon.ico
---

# 欢迎来到 3D环梦工坊

编程竞赛组 - 幻灯片演示

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    按空格键进入下一页 <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# 什么是编程？

编程是与计算机对话的艺术

- 📝 **编写代码** - 使用编程语言表达想法
- 🎯 **解决问题** - 通过算法实现目标
- 🚀 **创造价值** - 将想法变成现实

<br>
<br>

> 编程不仅仅是写代码，更是一种思维方式

---

# C++ 基础语法

一个简单的 Hello World 程序

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, 3D环梦工坊!" << endl;
    return 0;
}
```

<arrow v-click="1" x1="200" y1="230" x2="270" y2="280" color="#564" width="3" arrowSize="1" />

<div v-click="1" class="text-sm absolute top-60 left-45">
包含标准输入输出库
</div>

---

# 变量与数据类型

C++ 中常用的数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `int` | 整数 | `int age = 18;` |
| `double` | 浮点数 | `double pi = 3.14;` |
| `char` | 字符 | `char grade = 'A';` |
| `string` | 字符串 | `string name = "张三";` |
| `bool` | 布尔值 | `bool isStudent = true;` |

---
layout: two-cols
---

# 左侧：代码示例

```cpp
// 循环输出 1-10
for (int i = 1; i <= 10; i++) {
    cout << i << " ";
}

// 条件判断
if (score >= 60) {
    cout << "及格";
} else {
    cout << "不及格";
}
```

::right::

# 右侧：输出结果

**循环输出：**
```
1 2 3 4 5 6 7 8 9 10
```

**条件判断：**
- score = 85 → 及格
- score = 45 → 不及格

---

# 算法竞赛入门

从简单问题开始

1. **A+B Problem** - 最基础的输入输出
2. **排序算法** - 冒泡、选择、快排
3. **搜索算法** - 二分查找、深度优先
4. **动态规划** - 背包问题、最长子序列

<br>

### 推荐练习平台
- 洛谷 (luogu.com.cn)
- Codeforces
- AtCoder

---
layout: center
class: text-center
---

# 谢谢观看！

[GitHub](https://ain.hmgf.hxcn.space) · [QQ群](https://qm.qq.com/q/ZlktjRUdqg) · [官网](/)

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    继续学习，一起进步！
  </span>
</div>
