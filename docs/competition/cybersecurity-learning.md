# 网络安全学习指南

网络安全是计算机领域的重要方向，就业前景好，但入门门槛也不低。这份指南帮你从零开始学网安。

## 学习路线

### 第一阶段：计算机基础（3-6 个月）

学网安之前，先打好计算机基础：

**操作系统：**

- Linux 基本命令
- 文件系统、进程管理
- 权限管理
- 推荐：装个 Ubuntu/Kali Linux，日常使用

**计算机网络：**

- TCP/IP 协议栈
- HTTP/HTTPS 协议
- DNS、ARP、ICMP
- 抓包工具：Wireshark、tcpdump
- 推荐：《计算机网络：自顶向下方法》

**编程语言：**

- **Python**：必学，写脚本、写工具
- **C/C++**：理解底层，漏洞分析
- **JavaScript**：Web 安全必备
- **Shell**：Linux 脚本
- **SQL**：数据库注入

**数据库：**

- MySQL/PostgreSQL 基本操作
- SQL 注入原理
- 数据库安全配置

### 第二阶段：Web 安全（3-6 个月）

Web 安全是入门最快的分支：

**基础漏洞：**

- **SQL 注入**：联合查询、盲注、堆叠注入
- **XSS**：反射型、存储型、DOM 型
- **CSRF**：跨站请求伪造
- **SSRF**：服务端请求伪造
- **文件上传**：绕过上传限制
- **文件包含**：本地包含、远程包含
- **命令注入**：系统命令执行
- **XXE**：XML 外部实体注入
- **反序列化**：Java、PHP 反序列化漏洞

**工具使用：**

- **Burp Suite**：Web 抓包神器
- **SQLMap**：自动化 SQL 注入
- **Nmap**：端口扫描
- **Dirb/Gobuster**：目录扫描
- **Metasploit**：渗透测试框架

**靶场练习：**

- [DVWA](https://github.com/digininja/DVWA)：经典 Web 靶场
- [SQLi-labs](https://github.com/Audi-1/sqli-labs)：SQL 注入专项
- [Pikachu](https://github.com/zhuifengshaonianhanlu/pikachu)：中文靶场
- [Upload-labs](https://github.com/c0ny1/upload-labs)：文件上传专项
- [Vulhub](https://github.com/vulhub/vulhub)：漏洞复现环境

### 第三阶段：渗透测试（3-6 个月）

从 Web 扩展到整个系统：

**信息收集：**

- 子域名枚举
- 端口扫描
- 指纹识别
- 社工库（合法使用）

**漏洞利用：**

- MSF 框架使用
- 权限提升
- 横向移动
- 持久化

**内网渗透：**

- 域渗透基础
- Kerberos 协议
- Pass the Hash
- 黄金票据

**工具：**

- Metasploit
- Cobalt Strike（了解）
- Empire
- BloodHound

### 第四阶段：安全开发（3-6 个月）

从攻击转向防御：

**安全开发：**

- 代码审计
- 安全编码规范
- SAST/DAST 工具
- DevSecOps

**安全运营：**

- 日志分析
- 入侵检测
- 应急响应
- 威胁情报

**安全合规：**

- 等级保护
- ISO 27001
- GDPR

## 学习资源网站

### 综合学习平台

**国内：**

- [安全客](https://www.anquanke.com/)：安全资讯和技术文章
- [先知社区](https://xianzhisecurity.com/)：漏洞分析
- [FreeBuf](https://www.freebuf.com/)：安全资讯
- [看雪论坛](https://bbs.kanxue.com/)：逆向和漏洞分析
- [吾爱破解](https://www.52pojie.cn/)：逆向和破解
- [T00ls](https://www.t00ls.net/)：渗透测试
- [网安学习资源](https://wyuanlin.top)：综合资源

**国外：**

- [Hack The Box](https://www.hackthebox.eu/)：在线靶场
- [TryHackMe](https://tryhackme.com/)：入门友好
- [PortSwigger](https://portswigger.net/web-security)：Web 安全学院
- [CyberDefenders](https://cyberdefenders.org/)：蓝队训练
- [PentesterLab](https://pentesterlab.com/)：渗透测试练习

### 视频教程

- [B 站网安教程](https://search.bilibili.com/all?keyword=网络安全)
- [i 春秋](https://www.ichunqiu.com/)：专业安全培训
- [安全牛](https://www.aqniu.com/)：安全课程

### 书籍推荐

**入门：**

- 《白帽子讲 Web 安全》- 吴翰清
- 《Web 安全攻防：渗透测试实战指南》- 徐焱
- 《黑客攻防技术宝典：Web 实战篇》

**进阶：**

- 《代码审计：企业级 Web 代码安全架构》
- 《内网安全攻防：渗透测试实战指南》
- 《加密与解密》- 段钢

**专业方向：**

- 《逆向工程核心原理》
- 《恶意代码分析实战》
- 《二进制安全》

## CTF 竞赛

### 什么是 CTF

CTF（Capture The Flag）是网络安全竞赛，通过解决安全挑战来获取 flag。

### CTF 题目类型

**Web：**

- SQL 注入、XSS、命令注入
- 反序列化、代码审计
- 框架漏洞

**Pwn（二进制漏洞利用）：**

- 栈溢出
- 堆利用
- 格式化字符串漏洞
- ROP 链

**Reverse（逆向工程）：**

- 程序分析
- 脱壳
- 算法逆向
- 恶意代码分析

**Crypto（密码学）：**

- 古典密码
- RSA、AES
- 哈希碰撞
- 随机数攻击

**Misc（杂项）：**

- 隐写术
- 流量分析
- 编码解码
- OSINT

### CTF 学习资源

**平台：**

- [CTFHub](https://www.ctfhub.com/)：入门友好
- [BUUCTF](https://buuoj.cn/)：题目丰富
- [攻防世界](https://adworld.xctf.org.cn/)：综合平台
- [picoCTF](https://picoctf.org/)：入门级
- [CTFtime](https://ctftime.org/)：国际赛事

**工具：**

- **Pwn**：pwntools、GDB、IDA
- **Web**：Burp Suite、SQLMap
- **Reverse**：IDA Pro、Ghidra、x64dbg
- **Crypto**：Python、SageMath
- **Misc**：Wireshark、Stegsolve、binwalk

**学习路线：**

1. 先学基础（Linux、网络、编程）
2. 选一个方向深入（Web 或 Misc 入门）
3. 刷题，从简单到难
4. 参加比赛，积累经验
5. 看 Writeup，学习别人的思路

### 重要 CTF 比赛

**国内：**

- **XCTF**：国内最大的 CTF 联赛
- **强网杯**：国家级比赛
- **网鼎杯**：公安系统主办
- **CISCN**：全国大学生信息安全竞赛
- **春秋杯**：i 春秋主办

**国际：**

- **DEF CON CTF**：最顶级的 CTF
- **Google CTF**：谷歌主办
- **PlaidCTF**：PPP 战队主办
- **HITB**：Hack In The Box

## 安全认证

### 国内认证

- **NISP**：国家信息安全水平考试
  - NISP 一级：入门级
  - NISP 二级：专业级
  - NISP 三级：高级

- **CISP**：注册信息安全专业人员
  - CISE：工程师
  - CISO：管理人员
  - CISP-PTE：渗透测试工程师

- **软考-信息安全工程师**：中级职称

### 国际认证

**入门级：**

- **CompTIA Security+**：入门首选
- **CEH**：道德黑客认证
- **eJPT**：初级渗透测试

**专业级：**

- **OSCP**：渗透测试认证（含金量高）
- **OSWE**：Web 安全认证
- **OSEP**：高级渗透测试
- **GPEN**：GIAC 渗透测试
- **GWEB**：GIAC Web 安全

**管理级：**

- **CISSP**：信息系统安全专业人员
- **CISM**：信息安全管理
- **CISA**：信息系统审计

### 认证选择建议

- **入门**：Security+ 或 NISP 一级
- **求职**：CISP-PTE 或 OSCP
- **进阶**：OSCP + CISSP
- **不要盲目考证**：实战经验比证书重要

## 就业方向

### 安全岗位类型

**攻击方向：**

- 渗透测试工程师
- 红队工程师
- 安全研究员
- 漏洞挖掘工程师

**防御方向：**

- 安全运营工程师
- 蓝队工程师
- 应急响应工程师
- 安全分析师

**开发方向：**

- 安全开发工程师
- 安全产品工程师
- 代码审计工程师

**合规方向：**

- 安全咨询师
- 等保测评师
- 安全审计师

### 薪资水平

- **应届生**：10-20K（一线城市）
- **3-5 年**：20-40K
- **5-10 年**：40-80K
- **安全专家/架构师**：80K+

### 求职建议

- **多打 CTF**：证明技术能力
- **挖漏洞**：SRC 挖洞，有奖金
- **写博客**：展示技术深度
- **做项目**：有自己的安全工具
- **考认证**：CISP-PTE、OSCP

## 安全工具

### 信息收集

- **Nmap**：端口扫描
- **Shodan**：网络空间搜索引擎
- **Censys**：互联网设备搜索
- **Subfinder**：子域名枚举
- **Amass**：信息收集

### Web 安全

- **Burp Suite**：Web 抓包
- **SQLMap**：SQL 注入
- **Nuclei**：漏洞扫描
- **Dirsearch**：目录扫描
- **XSStrike**：XSS 检测

### 二进制安全

- **IDA Pro**：反汇编
- **Ghidra**：逆向工程
- **GDB**：调试器
- **pwntools**：Pwn 工具
- **Radare2**：逆向框架

### 密码学

- **Hashcat**：密码破解
- **John the Ripper**：密码破解
- **CyberChef**：编码解码
- **SageMath**：数学计算

## 安全社区

### 论坛和社区

- [看雪论坛](https://bbs.kanxue.com/)
- [吾爱破解](https://www.52pojie.cn/)
- [先知社区](https://xianzhisecurity.com/)
- [安全客](https://www.anquanke.com/)
- [FreeBuf](https://www.freebuf.com/)

### 公众号

- 安全客
- FreeBuf
- 看雪学院
- 先知安全
- 嘶吼

### 会议

- **KCon**：黑客大会
- **XCON**：安全焦点
- **HITB**：Hack In The Box
- **Black Hat**：黑帽大会
- **DEF CON**：顶级黑客大会

## 相关资源

- [飞书文档 - 网安学习资源](https://my.feishu.cn/wiki/VVv1w0kCzirT04kmHwKc5PDWnBg)
- [网安学习资源汇总](https://wyuanlin.top)
- [金山文档 - 网安资源](https://www.kdocs.cn/l/cagbu0iHI8eA)

**参考视频：**

<BiliBili bvid="BV12zDkBWE3e" />
