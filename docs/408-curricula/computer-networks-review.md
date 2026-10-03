# 计算机网络：2027王道教材全理论审阅

依据本地《27王道〈计算机网络〉高清带书签.pdf》（316个PDF文件页），核读实际理论页的OCR文字，并查看关键表图原图。本文页码均为PDF文件页，印刷页码通常少12。目录仅用于确定范围，正文是否充分覆盖以规则、条件、字段、算法和计算能否直接用于解题判断。未重制整套练习或答案。

## 范围与结果

完整纳入94个三级理论子节，包括带星号的3.8.1网桥；另纳入无三级标题的1.3、2.4、3.9、4.8、5.4、6.6章末疑难节，共100个证据映射。原有6章21个学习节点的ID、标题均保留，不新增节点；补充100张正文卡，增加13个原创计算/辨析案例。每张卡含逐项规则与必要的四级细目，而不是只新增标题。

94个三级主题的初始状态为：完整覆盖14、部分覆盖55、缺失18、需要纠错7。这些是对原正文充分性的判断，无法从词语出现次数推出。补充后逐条映射在 [computer-networks-coverage.json](computer-networks-coverage.json)，每条有教材原标题、起始PDF页、学习节点、具体正文锚点、事实变更与来源定位。

主要初始缺项为网络分类、接口四特性、链路管理、令牌传递、完整802.11帧/DCF/PCF、PPP与广域网、SDN、IPv6四子节、IP多播四子节、移动IP两子节。已有VLAN、海明码等标题仍有细目缺口，补充了位宽与边界、码距与联合检纠条件、帧字段、失败/重传规则及源目的地址追踪。RIP、OSPF、BGP原有概览进一步补齐更新流程、数据库同步、报文类型、eBGP/iBGP及本地偏好/热土豆选路。

## 明确修正的平台错误

| 原有表述或计算 | 修订后 |
|---|---|
| CRC例：101001除数1001的余数001 | 实算余数100，发送码字101001100；1101生成多项式会得到不同余数 |
| CRC余数0判为无错；非零必要求重传 | 表示未检出错误；是否重传由具体链路协议决定，以太网通常丢弃 |
| 海明综合征非零永远可以直接纠正；两位错与纠一位能力无条件并用 | 单比特假设下综合征定位；同时区分一位与两位需额外总体奇偶等机制 |
| 利用率W·Td/(Td+2Tp)无封顶 | 理想利用率取min(1,该比例)，ACK发送不可忽略时加Tack |
| 超时先cwnd=1再ssthresh=cwnd/2 | 先按事件前窗口/在途量更新门限，再把窗口设1MSS |
| HTTP持久连接弥补无状态 | 持久连接减少握手，会话关联需Cookie等机制 |
| hosts包含在DNS缓存中 | 本地静态映射与DNS缓存分别处理 |
| GET有统一固定长度上限 | 实现存在不同限制，HTTP无统一固定URL长度上限 |
| POP3与删除等同 | 支持下载保留及下载删除两种模式 |

修正采用完成脚本中的定点字段替换，保留其他原有内容与交互。计算机网络首页在六章数据之后、app之前加载该脚本；目录与正文渲染读取补充后的数据。

## 教材表述的限定条件与规范核验

| 教材实际定位与需限定的表述 | 核验后的教学表述 | 一手证据 |
|---|---|---|
| PDF104的Length/Type判别范围需明确边界 | ≤1500为长度，EtherType从1536起，1501~1535未定义 | [IANA IEEE 802 numbers](https://www.iana.org/assignments/ieee-802-numbers) |
| PDF109的无线数据MAC首部长度需区分地址与QoS字段 | 传统三地址非QoS首部24B，带第4地址为30B；表中常用AP方向为三地址 | [Cisco官方控制器指南图示](https://www.cisco.com/c/en/us/td/docs/wireless/controller/8-10/config-guide/b_cg810.pdf)，并按教材图3.28各字段求和核查 |
| PDF111的TCI字段需区分版本与有效语义 | PCP3位、DEI1位、VID12位；旧版本相关标志语义应与新规范区别 | [IEEE发布的802.1Q讲义第7页](https://standards.ieee.org/wp-content/uploads/import/documents/other/d2-07_james_a_simulation_based_analysis_of_dynamic_priority_allocation_strategy.pdf) |
| PDF111的VLAN数量需区分编码空间与可用VID | 编码空间4096，普通VID通常1~4094，0及4095有保留用途 | [IEEE发布的802.1Q YANG类型源](https://raw.githubusercontent.com/YangModels/yang/master/standard/ieee/published/802.1/ieee802-dot1q-types.yang) |
| PDF206的iBGP互连模型需限定参与者和部署方式 | 基础模型BGP发言人全互连；路由反射可减少会话，并非所有路由器都必须BGP全互连 | [RFC4456 §2](https://www.rfc-editor.org/rfc/rfc4456.html#section-2) |
| PDF208的UPDATE前缀数需结合路径属性限定 | 同路径属性可在一个UPDATE的NLRI携多个前缀 | [RFC4271 §3.1/§4.3](https://www.rfc-editor.org/rfc/rfc4271.html#section-3.1) |
| PDF235的跨网ARP例需区分是否启用代理ARP | 普通主机先判断异网，再查网关IP的MAC；代理ARP需专门机制 | [RFC826](https://www.rfc-editor.org/rfc/rfc826.html)、[RFC1027](https://www.rfc-editor.org/rfc/rfc1027.html) |
| PDF282的DNS长度限额需区分编码字节与展示字符 | DNS名字线缆编码含标签长度及根终止字节，总计≤255B；展示形式长度需另算 | [RFC1035 §2.3.4/§3.1](https://www.rfc-editor.org/rfc/rfc1035.html#section-2.3.4) |
| PDF302的URL大小写需区分组成字段 | scheme和host不区分；path/query可能区分 | [RFC3986 §6.2.2.1](https://www.rfc-editor.org/rfc/rfc3986.html#section-6.2.2.1) |
| PDF304的HTTP文本语法需与消息主体区分 | HTTP/1.x起始行和首部按文本语法解析，消息主体可为任意字节 | [RFC9112 §2.2](https://www.rfc-editor.org/rfc/rfc9112.html#section-2.2) |

来源口径：PDF109、111、207、208、302已查看实际扫描原图，其中UPDATE与URL说法不是OCR误识；其余表项依据实际理论OCR定位，未逐字视觉核实的措辞仅记为表述需限定，不据OCR宣布原书错误。

保留教材的考试模型条件：慢开始初值通常1MSS、门限跨越处理、简化快恢复与详细Reno恢复阶段分别说明；HTTP按1.x与题设串/并行模式计算，不把该模型泛化到全部HTTP版本。OSI参考模型功能表与实际TCP/IP/以太网行为也分别解释。

## 验证与边界

执行Node语法检查和VM数据装载，确认94个三级目录ID集合与正文集合完全相等，无漏项或多项；起始PDF页逐条一致；100个coverage锚点均在实际装载后的正文中存在，21节均保持blocks/examples/pitfalls结构。对CRC、CDMA、窗口封顶、VLSM、反码检验、窗口剩余额度及协议偏移等原创计算独立复算。

未新增学习节点，因此不需要为新节点扩展五题组；原有节点题库由根任务统一验收。此次不改共享platform/scripts/tests，不提交或部署。补充内容以文字、字段表和原创案例为主；原交互动画仍是教学简化模型，其全站浏览器与移动端回归由根任务统一执行。本科尚未独立声称浏览器端全量验证通过。

文件：计算机网络可视化/content/wangdao-completion.js、计算机网络可视化/index.html、docs/408-curricula/computer-networks-coverage.json、本文。


统一发布已完成，最终平台及线上验收见 [四科综合报告](wangdao-408-audit.md) 和 [验收记录](../verification/wangdao-408-20261002.md)。
