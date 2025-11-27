# Python 3 基础教程 

本教程基于 Python 3.x 版本，涵盖基础语法、数据结构及控制流程。

## 1\. 注释 (Comments)

Python 中注释用于解释代码，增强可读性，不会被执行。

### 单行注释

以 `#` 开头。

```python
# 这是一个单行注释
print("Hello, World!") # 代码后也可以接注释
```

### 多行注释

使用三个单引号 `'''` 或三个双引号 `"""` 包裹。

```python
'''
这是多行注释，
使用单引号。
'''

"""
这是多行注释，
使用双引号。
"""
print("多行注释示例")
```

-----

## 2\. 运算符 (Operators)

### 算术运算符

| 运算符 | 描述              | 实例                |
| :----- | :---------------- | :------------------ |
| `+`    | 加                | `1 + 1` 输出 `2`    |
| `-`    | 减                | `2 - 1` 输出 `1`    |
| `*`    | 乘                | `2 * 3` 输出 `6`    |
| `/`    | 除 (得到浮点数)   | `10 / 2` 输出 `5.0` |
| `%`    | 取模 (余数)       | `10 % 3` 输出 `1`   |
| `**`   | 幂                | `2 ** 3` 输出 `8`   |
| `//`   | 取整除 (向下取整) | `9 // 2` 输出 `4`   |

### 比较运算符

返回布尔值 `True` 或 `False`。
`==` (等于), `!=` (不等于), `>` (大于), `<` (小于), `>=` (大于等于), `<=` (小于等于)。

### 赋值运算符

`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `//=`.

  * 例如 `c += a` 等效于 `c = c + a`。

### 逻辑运算符

| 运算符 | 描述 | 实例      |
| :----- | :--- | :-------- |
| `and`  | 与   | `x and y` |
| `or`   | 或   | `x or y`  |
| `not`  | 非   | `not x`   |

### 成员运算符

  * `in`: 如果在指定的序列中找到值返回 True。
  * `not in`: 如果在指定的序列中没有找到值返回 True。

-----

## 3\. 数字 (Number)

Python 3 支持三种数值类型：

  * **int** (整型)
  * **float** (浮点型)
  * **complex** (复数)

### 数字类型转换 & 常用数学函数

```python
import math
import random

# 1. 类型转换
a = 1.5
print(int(a))     # 输出: 1 (丢弃小数部分)
print(float(1))   # 输出: 1.0

# 2. 数学运算函数 (部分需引入 math 模块)
print(abs(-10))         # abs(): 绝对值，输出 10
print(math.ceil(4.1))   # ceil(): 向上取整，输出 5
print(math.floor(4.9))  # floor(): 向下取整，输出 4
print(max(1, 5, 3))     # max(): 最大值，输出 5
print(min(1, 5, 3))     # min(): 最小值，输出 1
print(pow(2, 3))        # pow(): x的y次方，输出 8
print(round(4.567, 2))  # round(): 四舍五入，保留2位小数，输出 4.57
print(math.sqrt(16))    # sqrt(): 平方根，输出 4.0

# 3. 随机数函数 (需引入 random 模块)
print(random.choice([1, 2, 3, 4]))  # choice(): 从序列中随机选取一个
print(random.random())              # random(): 生成 [0, 1) 范围内的实数
print(random.randint(1, 10))        # randint(): 生成指定范围整数
```

-----

## 4\. 字符串 (String)

字符串是 Python 中最常用的数据类型，使用单引号 `'` 或双引号 `"` 创建。

### 访问字符串

```python
s = "Runoob"
print(s[0])      # 索引访问，输出 'R'
print(s[1:5])    # 切片访问，输出 'unoo'
```

### 字符串格式化

```python
name = "Alice"
age = 18
# f-string (Python 3.6+)
print(f"我叫 {name}, 今年 {age} 岁。")
# format 方法
print("我叫 {}, 今年 {} 岁。".format(name, age))
```

### 常用内置方法 (Methods)

```python
s = " hello world "

# 大小写转换
print(s.capitalize())   # 首字母大写: " Hello world "
print(s.upper())        # 全大写: " HELLO WORLD "
print(s.lower())        # 全小写: " hello world "

# 搜索与替换
print(s.find("world"))  # 查找子串索引，未找到返回 -1
print(s.replace("world", "Python")) # 替换: " hello Python "
print(s.count("l"))     # 统计出现次数

# 去除空白
print(s.strip())        # 去除首尾空格: "hello world"

# 分割与连接
lst = s.split()         # 默认按空格分割: ['hello', 'world']
print("-".join(lst))    # 连接: "hello-world"

# 判断
print("123".isdigit())  # 是否全为数字: True
print("abc".isalpha())  # 是否全为字母: True
```

-----

## 5\. 列表 (List)

列表是写在方括号 `[]` 之间、用逗号分隔开的元素列表。列表索引从 0 开始。

### 基础操作

```python
list1 = ['Google', 'Runoob', 1997, 2000]
list1[2] = 2001          # 更新列表
del list1[2]             # 删除元素
```

### 列表内置函数与方法

```python
nums = [3, 1, 4, 1, 5, 9]

# 通用函数
print(len(nums))    # 长度: 6
print(max(nums))    # 最大值: 9
print(list((1, 2))) # 强制转换为列表

# 列表对象方法
nums.append(2)      # 末尾添加元素: [3, 1, 4, 1, 5, 9, 2]
nums.insert(1, 10)  # 指定位置插入: [3, 10, 1, 4, 1, 5, 9, 2]
nums.pop()          # 移除末尾元素并返回
nums.remove(4)      # 移除第一个匹配值
print(nums.count(1))# 统计元素出现次数

nums.sort()         # 排序 (修改原列表)
print(nums)         # 输出: [1, 1, 3, 5, 9, 10]

nums[::-1]
nums.reverse()      # 反转
nums.clear()        # 清空列表
```

-----

## 6\. 元组 (Tuple)

元组与列表类似，不同之处在于元组的**元素不能修改**。元组写在小括号 `()` 里。

### 基础操作

```python
tup1 = ('Google', 'Runoob', 1997, 2000)
tup2 = (1, 2, 3, 4, 5)

# 访问
print(tup1[0])
print(tup2[1:3])

# 注意：包含一个元素的元组需要加逗号
tup3 = (50,) 
```

### 元组内置函数

由于元组不可变，它没有 `append`、`sort` 等修改方法。

```python
tup = (3, 1, 4, 1, 5, 9)
print(len(tup))     # 计算元素个数
print(max(tup))     # 返回最大值
print(min(tup))     # 返回最小值
print(tuple([1,2])) # 将列表转换为元组
```

-----

## 7\. 字典 (Dictionary)

字典是可变容器模型，可存储任意类型对象。字典的每个键值 `key:value` 对用冒号分割，整个字典包括在花括号 `{}` 中。**键必须是唯一的，且不可变。**

### 基础操作

```python
d = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}
print(d['Name'])        # 访问
d['Age'] = 8            # 修改
d['School'] = "菜鸟"    # 添加
del d['Name']           # 删除条目
```

### 字典内置函数与方法

```python
d = {'Name': 'Runoob', 'Age': 7}

# 内置函数
print(len(d))       # 计算键值对数量
print(str(d))       # 输出字典可打印的字符串表示

# 对象方法
print(d.keys())     # 返回所有键: dict_keys(['Name', 'Age'])
print(d.values())   # 返回所有值
print(d.items())    # 返回所有键值对元组

print(d.get('Age'))         # 安全地获取值，不存在不报错
print(d.get('Sex', 'NA'))   # 获取值，不存在返回默认值 'NA'

d.pop('Age')        # 删除并返回指定键的值
d.update({'Age': 10, 'Sex': 'Male'}) # 更新/合并字典
d.clear()           # 清空字典
```

-----

## 8\. 集合 (Set)

集合是一个无序的不重复元素序列。可以使用大括号 `{}` 或者 `set()` 函数创建集合。
**注意**：创建一个空集合必须用 `set()` 而不是 `{}`，因为 `{}` 是用来创建一个空字典。

### 基础操作

```python
basket = {'apple', 'orange', 'apple', 'pear', 'orange', 'banana'}
print(basket)  # 自动去重，输出可能乱序

# 集合运算
a = set('abracadabra')
b = set('alacazam')
print(a - b)   # 差集
print(a | b)   # 并集
print(a & b)   # 交集
print(a ^ b)   # 对称差集（不同时存在的元素）
```

### 集合内置方法

```python
s = {1, 2, 3}

s.add(4)            # 添加元素
s.update([5, 6])    # 添加多个元素
s.remove(1)         # 移除元素，不存在会报错
s.discard(10)       # 移除元素，不存在不会报错
s.pop()             # 随机移除一个元素
s.clear()           # 清空
```

-----

## 9\. 条件控制 (Conditionals)

Python 通过 `if` 语句实现条件控制。

### 语法结构

```python
# if - elif - else
age = 20
if age < 0:
    print("输入错误")
elif age < 18:
    print("未成年")
else:
    print("已成年")

# 嵌套 if
num = 8
if num % 2 == 0:
    if num % 3 == 0:
        print("能被 2 和 3 整除")
    else:
        print("能被 2 整除，但不能被 3 整除")
```

-----

## 10\. 循环语句 (Loops)

Python 提供了 `while` 和 `for` 循环。

### While 循环

```python
n = 0
sum = 0
while n <= 10:
    sum += n
    n += 1
print(f"1到10之和为: {sum}")
```

### For 循环

常用于遍历序列（列表、元组、字符串）或使用 `range()`。

```python
sites = ["Baidu", "Google","Runoob","Taobao"]
for site in sites:
    print(site)

# 使用 range()
for i in range(5):       # 0 到 4
    print(i, end=',') 

for i in range(0, 10, 3): # 步长为 3: 0, 3, 6, 9
    print(i)
```

### 循环控制语句

  * **break**: 跳出整个循环。
  * **continue**: 跳过当前循环块中的剩余语句，继续下一轮循环。
  * **pass**: 空语句，为了保持程序结构的完整性。

<!-- end list -->

```python
for letter in 'Runoob': 
   if letter == 'o':
      continue # 跳过 'o'
   if letter == 'b':
      break    # 遇到 'b' 结束循环
   print('当前字母 :', letter)
```

