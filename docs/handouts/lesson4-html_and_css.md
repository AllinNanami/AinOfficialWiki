第一次课 HTML与CSS基础



# HTML与CSS基础





![img](https://docs.redrock.team/api/files.get?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1cGxvYWRzLzQxZTdiZGZmLTljZjgtNDljMy04OGZkLWY1ZTQ1MmQ0N2YzOS9hODU5ZGQ5Mi05NzNhLTQzZWUtODcxZi01OTM0ZTY5Y2NlNzYvaW1hZ2UucG5nIiwidHlwZSI6ImF0dGFjaG1lbnQiLCJpYXQiOjE3NjQyMjU1NTcsImV4cCI6MTc2NDIyOTE1N30.G8mb0LUUs3xR-Gd148h2bonOpUELTqjKkh-Epqjfk-U)





## 前言

**前端是什么？**

咱们先想个日常场景：打开手机刷小红书、用电脑逛淘宝、在浏览器查百度 —— 你看到的 “页面”、点的 “按钮”、滑的 “列表”，背后负责把这些 “看得见、能互动” 的东西做出来的，就是前端。

**前端和后端的区别是什么？**

如果把整个网站/APP比作一家餐厅

**后端**是“厨房”：负责准备食材（处理数据，比如你下单后计算价格、存订单信息），用户看不到；

**前端**是 “餐厅大堂”：包括你坐的桌子（界面布局）、菜单的排版（文字图片样式）、服务员的响应（点击互动）—— 所有你能直接接触到的部分，都是前端负责的。

总之，目之所及，皆为前端。

**前端三件套是什么？**

- HTML：网页的骨架，负责决定**内容的位置和结构**
- CSS：网页美化，负责控制**页面的外观**
- JavaScript：让网页动起来，负责**处理用户的各种操作**



## HTML

[大家有兴趣了解前端发展史点我哦](https://segmentfault.com/a/1190000020281750)

- HTML 指的是超文本标记语言 (**H**yper **T**ext **M**arkup **L**anguage)，是用来描述网页的一种语言。
- HTML 不是一种编程语言，而是一种标记语言 (markup language)
- 标记语言是一套标记标签 (markup tag)+语法规则
- 一句话说出html作用:

网页是由网页元素组成的，这些元素是利用html标签描述出来，然后通过浏览器解析，就可以显示给用户了。



### HTML骨架

```
<!DOCTYPE html><!-- 文档类型声明，声明当前的HTML版本 -->
<html lang="en"><!-- 根标签 -->
<!-- 头部标签 -->
<head>
    <meta charset="UTF-8"><!-- 字符编码设置 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!-- 兼容性设置 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- 移动端适配设置 -->
    <!-- 标题标签 -->
    <title>Document</title>
</head>
<!-- 文档的主体 -->
<body>

</body>
</html>
```

他们的大致结构是嵌套、并列，且大部分是有始有终的。

生成HTML骨架的快捷键：! + Tab



### HTML常用的标签



#### 排版标签

主要和css搭配使用，显示网页结构的标签，是网页布局最常用的标签，使网页更具语义化。

**标题（Heading）标签**

通过h1 - h6标签来定义，作为标题使用。

```
<h1>   标题文本   </h1> 
<h2>   标题文本   </h2> 
<h3>   标题文本   </h3> 
<h4>   标题文本   </h4> 
<h5>   标题文本   </h5> 
<h6>   标题文本   </h6>
```





![img](https://docs.redrock.team/api/files.get?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1cGxvYWRzL2VlMTIzMmY1LTVkODgtNGRiMi1hZTU4LWU1MmRlZjJhZDVkNC8yYjJiNmNkZC03MTZhLTQ0ZjUtOGQxNy00YWE3ODdlYmVjNzAvMjkwOGY1N2ItNWRkMS00NGM5LTllMjMtMWQyZTI5M2Q0ZDYxLnBuZyIsInR5cGUiOiJhdHRhY2htZW50IiwiaWF0IjoxNzY0MjI1NTU3LCJleHAiOjE3NjQyMjkxNTd9.37gOkAlpJXFCsOU2VaazE87V9DA8hW1dKvKmiy_bT9E)



**段落标签p**

如同写文章分段一样，可以把 HTML 文档分割为若干段落。

```html
<p>  文本内容  </p>
```

**换行标签br**，**水平线标签hr**

**br**：break，打断；**hr**：horizontal rule,水平线





![img](https://docs.redrock.team/api/files.get?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1cGxvYWRzL2VlMTIzMmY1LTVkODgtNGRiMi1hZTU4LWU1MmRlZjJhZDVkNC9mY2E5Mjk3Ni1kOGU4LTQyZWQtYTVjYy04ZTEzNTU1YTc0MGEvYTk2NzZmZGItYjdmMC00NGMxLWIwNzYtYTcwZTdkOGJhNzZmLnBuZyIsInR5cGUiOiJhdHRhY2htZW50IiwiaWF0IjoxNzY0MjI1NTU3LCJleHAiOjE3NjQyMjkxNTd9.hzPc6kMlf-Qkxcnx7ZlNjAYakMkid0Z8CGxB7S_OBik)



**div和span标签（重点，非常常用）**

这两个标签是没有语义的，但却是我们网页布局最常用的两个标签，都是用来装网页元素的"盒子"，区别在于网页中一行通常只能放下一个div，但是可以放下多个span。（一个是块级元素，一个是行内元素，具体区别稍后讲解）

```html
<div>这是一个div</div>  <span>这是一个span</span>
```



#### 标签属性

使用HTML制作网页时，如果想让HTML标签提供更多的信息，可以使用HTML标签的属性加以设置。



#### 链接标签（重点）

在HTML中创建超链接非常简单，只需用标签把文字包括起来就好。

```html
<a href="跳转目标" target="目标窗口的弹出方式">超链接跳转描述</a>
```

target属性取值：

- _self（默认值）：在当前页面打开
- _blank：在空白页面打开
- _parent：在父级页面打开（不常用）
- _top：在最顶层页面打开（不常用）

**注意：**

1. 外部链接 必须添加 “http://”
2. 内部链接 直接链接内部页面名称即可 比如 `<a href="index.html">首页</a>`
3. 如果当时没有确定链接目标时，通常将链接标签的href属性值定义为“#”(即href="#")，表示该链接暂时为一个空链接。
4. 不仅可以创建文本超链接，在网页中各种网页元素，如图像、表格、音频、视频等都可以添加超链接。



#### 图像标签

```html
<img src="图像URL" alt="图片未显示展示的文字" title="鼠标悬停图标上显示的文字" />
```



#### 路径(重点)

实际工作中，我们的文件不能随便乱放，否则用起来很难快速地找到他们，因此我们需要一个文件夹来管理他们。

**目录文件夹：**

就是普通文件夹，里面只不过存放了我们做页面所需要的相关素材，比如 html文件，图片等等。

**根目录**

打开目录文件夹的第一层就是根目录。

页面中的图片会非常多， 通常我们再新建一个文件夹专门用于存放图像文件（images），这时再插入图像，就需要采用“路径”的方式来指定图像文件的位置。路径可以分为： 相对路径和绝对路径

**相对路径**

以引用文件之网页所在位置为参考基础，而建立出的目录路径。因此，当保存于不同目录的网页引用同一个文件时，所使用的路径将不相同，故称之为相对路径。

| **路径分类** | **符号** | **说明**                                                     |
| ------------ | -------- | ------------------------------------------------------------ |
| 同一级路径   | “./”     | 用于访问统计目录上面的文件或者文件夹。                       |
| 下一级路径   | “/”      | 用于访问某文件夹下的文件或文件夹。                           |
| 上一级路径   | “../”    | 在文件名之前加入“../” ，如果是上两级，则需要使用 “../ ../”，以此类推。 |

相对路径，是从代码所在的这个文件出发， 去寻找我们的目标文件的，而我们所说的“上一级”、“下一级”、“同一级”， 简单说，就是图片位于HTML页面的位置。

**绝对路径**

绝对路径以Web站点根目录为参考基础的目录路径。之所以称为绝对，意指当所有网页引用同一个文件时，所使用的路径都是一样的。

“D:\web\img\logo.gif”，或完整的网络地址，例如

“https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png[”。](https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png”。)

**注意：**

绝对路径用的**较少**，我们**理解**下就可以了。 但是要注意它的写法, 特别是在Windows系统中符号 `\`并不是相对路径的 `/`



#### 列表

容器里面装载着结构，样式一致的文字或图表的一种形式，叫列表。

**特点：**

- 只能嵌套，直接在标签中输入其他标签或者文字的做法是不被允许的。
- `<li>` 标签相当于一个容器，可以容纳元素。
- 列表会带有自己的样式属性，可以用css控制。

列表最大的特点就是整齐 、整洁、 有序，跟表格类似，但是它可组合自由度会更高。

1. 无序列表 ul（熟悉）

项目的顺序并不重要，例如购物列表。用一个 `<ul>` 元素包围。

```
<ul>   
  <li>列表项1</li>   
  <li>列表项2</li>   
  <li>列表项3</li>   
  ...... 
</ul>
```

2)有序列表 ol（了解）

项目的顺序很重要，例如烹饪指南。用一个 `<ol>` 元素包围。

用法和ul类似，可以展示列表每个元素的序号。实际中ol比ul用的少很多。



#### table标签

`<tr>` 表示表格行，`<td>` 表示行里的单元格，`<th>` 表示标题单元格



#### 表单控件之“input”

- 语法：

```
<input type="属性值" value="你好">
```

- input是输入的意思
- 标签为单标签
- type属性设置不同的属性值用来指定不同的控件类型

1. type 属性

- 这个属性通过改变值，可以决定了你属于哪种input表单。
- 比如 type = 'text' 就表示单行文本框，可以做用户名，昵称等。
- 比如 type = 'password' 就是表示密码框，用户输入的内容是不可见的*。

```
用户名: <input type="text" />  密 码：<input type="password" />
```

- type = ‘radio’ 单选按钮，如果是一组，我们必须给他们命名相同的名字name，这样就可以实现单选了

- type = ‘checkbox’ 复选按钮，如果是一组，我们必须给他们命名相同的名字name，这样就可以实现多选了

  `<input type="radio" name="sex" />男 <input type="radio" name="sex" />女`

1. value属性 -> 值

```
用户名:<input type="text" name="username" value="请输入用户名">
```

- value 默认的文本值。有些表单想刚打开页面就默认显示几个文字，就可以通过这个value来设置。

1. name属性

```
用户名:<input type="text" name="username" />
```

name 表单的名字，这样，后台可以通过这个name属性找到这个表单。页面中的表单很多，name主要作用就是用于区别不同的表单。

- name属性后面的值，是我们自己定义的。

- name属性，相当于去识别这个东西的一个标签，我们现在用的较少，当我们学到ajax和后台的时候，是会用到的

1. checked属性

- 表示默认选中状态。 较常见于 单选按钮和复选按钮。

```
性别: <input type="radio" name="sex" value="男" checked />男 
<input type="radio" name="sex" value="女" />女
```

上面这个，表示就默认选中了 男 这个单选按钮

1. placeholder属性

显示描述文字，不用删除，在有文字输入时自动消失

```
<input type="text" placeholder="这里是描述文字">
```





![img](https://docs.redrock.team/api/files.get?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1cGxvYWRzL2VlMTIzMmY1LTVkODgtNGRiMi1hZTU4LWU1MmRlZjJhZDVkNC8wNjFmNmU1MS01MjUyLTRjYjUtYjhlYi04MzBmY2RmZDc0ZTgvMzBkOWY0ODItZWU1Ni00YzZmLWFlMTYtMjMwZTA2YWM1ODRhLnBuZyIsInR5cGUiOiJhdHRhY2htZW50IiwiaWF0IjoxNzY0MjI1NTU3LCJleHAiOjE3NjQyMjkxNTd9.qlEbM6j9xEbv1Kx8NckafdWYFF9PBU0cPJlMWN1jfLM)



1. input 属性小结

| **属性**    | **说明** | **作用**                                               |
| ----------- | -------- | ------------------------------------------------------ |
| type        | 表单类型 | 用来指定不同的控件类型                                 |
| value       | 表单值   | 表单里面默认显示的文本                                 |
| name        | 表单名字 | 页面中的表单很多，name主要作用就是用于区别不同的表单。 |
| checked     | 默认选中 | 表示那个单选或者复选按钮一开始就被选中了               |
| placeholder | 描述文字 | 可以介绍这里是用来做啥的                               |



### 块级元素、行内元素、行内块元素

什么是标签显示模式

- 什么是标签的显示模式？标签以什么方式进行显示，比如div自己占一行，比如span一行可以放很多个
- 作用：我们网页的标签非常多，在不同地方会用到不同类型的标签，以便更好地完成我们的网页。
- 标签的类型(分类)：HTML标签一般分为块标签和行内标签两种类型，它们也称块元素和行内元素。

块级元素(block-level)

- 例：

常见的块元素有 `<h1>`~`<h6>`、`<p>`、`<div>`、`<ul>`、`<ol>`、`<li>` 等，其中 `<div>` 标签是最典型的块元素。

- 块级元素的特点

（1）自己独占一行

（2）高度，宽度、外边距以及内边距都可以控制。

（3）宽度默认是容器（父级宽度）的100%

（4）是一个容器及盒子，里面可以放行内或者块级元素。

行内元素(inline-level)

常见的行内元素有 `<a>`、`<strong>`、`<b>`、`<em>`、`<i>`、`<del>`、`<s>`、`<ins>`、`<u>`、`<span>` 等，其中 `<span>` 标签最典型的行内元素（有的地方也称内联元素）。

- 行内元素的特点：

（1）相邻行内元素在一行上，一行可以显示多个。

（2）高、宽直接设置是无效的。

（3）默认宽度就是它本身内容的宽度。

（4）**行内元素只能容纳文本或者其他行内元素。**

行内块元素（inline-block）

- 在行内元素中有几个特殊的标签`<img />`,`<input />`，可以对它们设置宽高和对齐属性，不过有的html标签本身不支持通过属性直接修改，有些资料可能会称它们为行内块元素。

- 行内块元素的特点：

  （1）和相邻行内元素（行内块）在一行上,但是之间会有空白缝隙，一行可以显示多个。

  （2）默认宽度就是它本身内容的宽度。

  （3）高度，行高、外边距以及内边距都可以控制。



## CSS

**层叠样式表** (Cascading Style Sheets，缩写为 **CSS**），是一种 [样式表](https://developer.mozilla.org/zh-CN/docs/Web/API/StyleSheet) 语言，用来描述 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML) 或 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML/XML_Introduction)（包括如 [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)、[MathML](https://developer.mozilla.org/zh-CN/docs/Web/MathML)、[XHTML](https://developer.mozilla.org/zh-CN/docs/Glossary/XHTML) 之类的 XML 分支语言）文档的呈现。CSS 描述了在屏幕、纸质、音频等其它媒体上的元素应该如何被渲染的问题。

它是[HTML](https://developer.mozilla.org/zh-CN/docs/Glossary/HTML)之后应该开始学习的第一项技术。HTML用于定义内容的结构和语义，而CSS用于设置其样式和布局。例如，可以使用 CSS 更改内容的字体、颜色、大小和间距，将其拆分为多个列，或添加动画和其他装饰功能。



### 引入方式



#### 行内样式

在网页元素上通过 `style=""` 属性直接写样式。

基本格式：

```
<标签名 style="属性1:属性值1; 属性2:属性值2;"> 内容 </标签名>
```

举个栗子：

```html
<div style="color: green; margin-top: 30px; border: 1px solid red; width: 500px">
  行内样式实例1
</div>
```



#### 内部样式

在网页上创建嵌入的样式表，通常写在 `<head></head>` 里面。基本格式语法如下：

```
<head>
    <style type="text/CSS">
         选择器（选择的标签） {        
             属性1: 属性值1;       
             属性2: 属性值2;        
             属性3: 属性值3;     
         }     
     </style>
</head>
```



#### 外部样式(重点)

实际开发都是外部样式表. 适合于样式比较多的情况. 核心是: 样式单独写到CSS 文件中，之后把CSS文件引入到 HTML 页面中使用。引入外部样式表分为两步：

- 新建一个后缀名为`.css`的样式文件，把所有 CSS 代码都放入此文件中。
- 在 HTML 页面中，使用标签引入这个文件。

```
<head>   ...   <link rel="stylesheet" type="text/css" href="css文件路径"> </head>
```



### 选择器

简单讲讲最常用的选择器。



#### 标签选择器

标签选择器（元素选择器）是指用**HTML标签名**称作为选择器，按标签名称分类，为页面中某一类标签指定统一的CSS样式。如：

```
h1{color:red;... }
```



#### id选择器

使用id选择器时需要注意几点：

- 给要添加样式的标签元素添加id属性（自定义）。
- 长名称或词组可以使用中横线来为选择器命名。
- 不要纯数字、中文等命名， 尽量使用英文字母来表示。

id选择器使用符号`#`进行标识，后面紧跟id名。

例：

```html
<p id='title'></p>
```

```
#title{     
  ... 
}
```



#### class选择器

类选择器使用符号`.`（英文点号）进行标识，后面紧跟类名。

使用方法与ID选择器类似，如：

```
.title{     
  ... 
}
```



#### tips

一个元素可以有多个class，但只能有一个id。多个类名的表示在`class=""`中用空格隔开。

```html
<div class="box container">box</div>
```



### 盒模型

**网页布局的本质**

- 首先利用CSS设置好盒子的大小，然后摆放盒子的位置。
- 最后把网页元素比如文字图片等等，放入盒子里面。

在 CSS 中我们广泛地使用两种“盒子” —— **块级盒子** (**block box**) 和 **内联盒子** (**inline box**)。

这两种盒子会在**页面流**（page flow）和元素之间的关系方面表现出不同的行为：



#### 块级盒子

- 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，在绝大数情况下意味着盒子会和父容器一样宽。
- 每个盒子都会换行。
- `width` 和 `height` 属性可以调整宽高。
- 内边距（padding）, 外边距（margin）和 边框（border）会将其他元素从当前盒子周围“推开”。



#### 内联盒子

- 盒子不会产生换行。
- `width` 和 `height` 属性将不起作用。
- 垂直方向的内边距、外边距以及边框会被应用但是不会把其他处于 `inline` 状态的盒子推开。
- 水平方向的内边距、外边距以及边框会被应用且会把其他处于 `inline` 状态的盒子推开。

我们通过对盒子`display` 属性的设置，比如 `inline` 或者 `block` ，来控制盒子的外部显示类型。



### 一些CSS属性

最基本的**width、height**设置宽高，color设置字体颜色，

设置字体样式的还有font-size、font-weight、font-family...

盒模型相关的**border、padding、margin**

设置背景用**background**



### 层叠与继承



#### 层叠

与[层叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Cascade)**密切相关的概念是**[优先级（specificity）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)，决定在发生冲突的时候应该使用哪条规则。

有三点需要考虑：

1. 资源顺序
2. 优先级
3. 重要程度



#### 继承

顾名思义是元素属性的继承，那继承的方式又是怎样的呢，其实就是在网页元素嵌套中，子元素继承父元素的属性。



### 浮动



#### 为什么需要浮动？

- 让多个盒子水平排成一排
- 实现盒子向左向右对齐



#### 浮动的作用：

使盒子

1. 脱离标准普通流的控制
2. 移动到指定位置。

**语法**

属性默认值none，可设置为left或right向左右浮动对齐。

```
... float:none; ...
```



### 定位position（重点）

 position 属性用于定义元素在文档中的**定位方式**，通过它可控制元素脱离正常文档流或在特定参考系中精准放置。



#### 相对定位（relative）

相对定位的特点（务必记住）：

- 相对于自己原来在标准流中位置来移动的
- 原来**在标准流的区域继续占有**，后面的盒子仍然以标准流的方式对待它。



#### 绝对定位（absolute）

绝对定位是元素以带有定位的父级元素来移动位置，所以我们使用定位通常遵循**子绝父相**的原则。其特点：

- **完全脱标** —— 完全不占位置。
- **父元素没有定位**，则以**浏览器**为准定位（Document 文档）。
- 将元素依据最近的已经定位（绝对、固定或相对定位）的父元素（祖先）进行定位。



### 居中小技巧



#### 水平居中

```
* {     
  margin: auto;     
  text-align: center; 
}
```



#### 垂直居中

利用行高line-height设置为元素高度来进行**单行文字**的垂直居中



### 去除默认样式

去除a标签的下划线

```
a {     
  text-decoration: none;
}
```

去除ul列表的 · 以及ol列表的序号

```
li {list-style: none;}
```

去除默认的margin和padding

```
* {margin: 0;padding: 0;}
```




                                                                     




