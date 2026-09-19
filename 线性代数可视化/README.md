# 线性代数 · 交互可视化

考研数学（一）线性代数的交互学习项目，内容严格按《2026 年全国硕士研究生招生考试数学考试大纲》数学（一）· 线性代数（p.15–p.19）构建，共六章。

## 内容范围

| 章 | 内容 | 主要可视化 |
| --- | --- | --- |
| 一 | 行列式 | 行列式计算与几何意义、行列式性质演示 |
| 二 | 矩阵 | 矩阵运算、高斯-约当消元 |
| 三 | 向量 | 线性组合与相关性、施密特正交化 |
| 四 | 线性方程组 | 高斯消元求解、解的结构 |
| 五 | 特征值与特征向量 | 2×2 特征方向几何、相似对角化 |
| 六 | 二次型 | 二次型标准形与曲线类型、正定性判别 |

每章附「大纲原文（逐字摘录）」与「大纲覆盖自检表」。

## 目录结构

```text
index.html                    入口
assets/css/main.css           样式
assets/js/lib/draw.js         Canvas 绘图引擎
assets/js/lib/stats.js        数值工具
assets/js/widgets/ui.js       控件外壳
assets/js/widgets/la1-6.js    各章交互组件
assets/js/app.js              路由 / 渲染 / KaTeX / 进度 / 搜索
assets/vendor/katex/          KaTeX 数学公式渲染（本地）
content/syllabus.js           大纲原文、结构与覆盖映射
content/ch1-6.js              各章知识块、公式、例题与易错点
```

## 约定

- 本目录依赖根目录的 `platform/`，交付时请使用整站 `dist/`。
- 学习进度保存在浏览器本地键 `zhixu-linear-algebra-progress-v1`。
- 矩阵与公式由 KaTeX 渲染，使用 `\begin{pmatrix}` 等环境。

## 本地预览

在仓库根目录执行 `npm run dev`，访问 http://127.0.0.1:8766/ 后选择「线性代数」。
