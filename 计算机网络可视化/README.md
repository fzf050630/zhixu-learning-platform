# 计算机网络 · 交互可视化

408 计算机网络的交互学习项目，知识主线参考王道《计算机网络》，覆盖第 1~6 章。

## 内容范围

| 章 | 内容 | 主要可视化 |
| --- | --- | --- |
| 1 | 计算机网络体系结构 | 时延与带宽计算器、OSI / TCP-IP 分层 |
| 2 | 物理层 | 奈氏准则与香农定理、编码波形 |
| 3 | 数据链路层 | 组帧、CRC 计算、滑动窗口时空图、CSMA/CD、交换机自学习 |
| 4 | 网络层 | IPv4 首部与分片、子网划分/CIDR、ARP 流程、距离向量算法 |
| 5 | 传输层 | UDP/TCP 首部、三次握手/四次挥手、滑动窗口、拥塞控制 |
| 6 | 应用层 | DNS 解析、电子邮件流程、HTTP 请求与持久连接 |

## 目录结构

```text
index.html                    入口
assets/css/main.css           样式
assets/js/lib/draw.js         Canvas 绘图引擎
assets/js/widgets/ui.js       控件外壳
assets/js/widgets/net1-6.js   各章交互组件
assets/js/app.js              路由 / 渲染 / 进度 / 搜索 / 主题
content/syllabus.js           章节结构与考点覆盖
content/ch1-6.js              各章知识块、例题、易错点
```

## 约定

- 本目录依赖根目录的 `platform/`，交付时请使用整站 `dist/`。
- 学习进度保存在浏览器本地键 `zhixu-computer-networks-progress-v1`。
- 可播放组件在离开页面时由 `Draw.prune()` 释放计时器与观察器。

## 本地预览

在仓库根目录执行 `npm run dev`，访问 http://127.0.0.1:8766/ 后选择「计算机网络」。
