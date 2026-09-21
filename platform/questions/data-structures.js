/* 知序 · 数据结构自测题库（原创“真题风格”题，覆盖全部 6 章）
   挂载到 window.ZhixuQuestions。 */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'data-structures:lab/sequence-insert': [
      { id: 'ds-seqins-1', type: 'single', stem: '在长度为 n 的顺序表第 i 个位置（1≤i≤n+1）插入一个元素，平均需要移动多少个元素？', options: { A: 'n/2', B: '(n+1)/2', C: 'n', D: 'n−i+1' }, answer: 'A', explanation: '各插入位置移动次数平均后为 n/2，因此顺序表插入的时间复杂度为 O(n)。', hint: '把每个位置需要后移的元素个数加起来再取平均。' },
      { id: 'ds-seqins-2', type: 'judge', stem: '顺序表插入元素的时间复杂度是 O(n)，而按位查找的时间复杂度是 O(1)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '顺序表支持随机访问，按位查找 O(1)；插入需要移动元素，平均 O(n)。' },
    ],
    'data-structures:lab/linked-reverse': [
      { id: 'ds-rev-1', type: 'single', stem: '就地逆置一个单链表（不允许新建结点）通常需要几个指针变量协同？', options: { A: '1 个', B: '2 个', C: '3 个', D: '4 个' }, answer: 'C', explanation: '经典做法用 prev、cur、next 三个指针，边遍历边改变指针方向，额外空间 O(1)。' },
    ],
    'data-structures:lab/linked-merge': [
      { id: 'ds-merge-1', type: 'single', stem: '合并两个长度分别为 m、n 的有序单链表为一个有序链表，时间复杂度是？', options: { A: 'O(m+n)', B: 'O(m·n)', C: 'O(log(m+n))', D: 'O(m²+n²)' }, answer: 'A', explanation: '两个链表各遍历一次，比较次数不超过 m+n−1，时间 O(m+n)。' },
    ],
    'data-structures:lab/josephus': [
      { id: 'ds-jose-1', type: 'single', stem: '模拟约瑟夫环（报数出列）问题时，最直观的存储结构是？', options: { A: '循环链表（或循环数组）', B: '二叉排序树', C: '栈', D: '邻接矩阵' }, answer: 'A', explanation: '约瑟夫环首尾相接、循环报数，用循环链表或循环数组模拟最自然。' },
    ],
    'data-structures:lab/stack-demo': [
      { id: 'ds-stack-1', type: 'single', stem: '若入栈序列为 1,2,3,4，则下列哪个不可能是合法的出栈序列？', options: { A: '1,2,3,4', B: '4,3,2,1', C: '3,2,4,1', D: '3,1,2,4' }, answer: 'D', explanation: '若 3 先出栈，说明 1、2 仍在栈中且 2 在 1 之上，出栈顺序只能是 2 在 1 前，因此 3,1,2,4 不可能。', hint: '出栈时，栈中元素的相对次序不能颠倒。' },
    ],
    'data-structures:lab/circular-queue': [
      { id: 'ds-cq-1', type: 'judge', stem: '循环队列牺牲一个存储单元以区分队空与队满时，队满条件是 (rear+1)%m == front。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '约定 front==rear 表示队空；当 rear 的下一个位置是 front 时表示队满，即 (rear+1)%m==front。' },
    ],
    'data-structures:lab/shared-stack': [
      { id: 'ds-shared-1', type: 'judge', stem: '两个栈共享一段数组空间时，只有两栈顶相邻（top0+1==top1）才表示栈满。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '共享栈从两端向中间增长，两栈顶相邻时才真正占满整个数组。' },
    ],
    'data-structures:lab/deque': [
      { id: 'ds-deque-1', type: 'judge', stem: '双端队列允许在队头和队尾两端都进行插入和删除操作。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '双端队列（deque）两端都可入队、出队；若限定某一端只能出或只能入，则得到输入/输出受限的双端队列。' },
    ],
    'data-structures:lab/inorder': [
      { id: 'ds-inorder-1', type: 'single', stem: '已知一棵二叉树的前序遍历序列和中序遍历序列，能否唯一确定这棵二叉树？', options: { A: '能', B: '不能，还需后序', C: '不能，还需层序', D: '永远无法确定' }, answer: 'A', explanation: '前序确定根、中序划分左右子树，二者结合可唯一确定一棵二叉树；仅前序+后序不能。' },
      { id: 'ds-inorder-2', type: 'judge', stem: '二叉树中序遍历的非递归实现需要借助栈。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '中序非递归遍历用栈保存待回溯的祖先结点，沿左链一路入栈再回溯访问。' },
    ],
    'data-structures:lab/level-order': [
      { id: 'ds-level-1', type: 'single', stem: '实现二叉树的层序遍历需要借助哪种数据结构？', options: { A: '队列', B: '栈', C: '优先队列', D: '哈希表' }, answer: 'A', explanation: '层序遍历按层访问，用队列先进先出地保存待访问的左右孩子。' },
    ],
    'data-structures:lab/huffman': [
      { id: 'ds-huff-1', type: 'single', stem: '含有 n 个叶结点的哈夫曼树共有多少个结点？', options: { A: '2n−1', B: '2n', C: 'n−1', D: 'n+1' }, answer: 'A', explanation: '哈夫曼树是严格二叉树（无单分支结点），叶结点 n 个、内部结点 n−1 个，共 2n−1 个。' },
      { id: 'ds-huff-2', type: 'single', stem: '哈夫曼编码属于哪一类编码？', options: { A: '前缀编码且平均码长最短', B: '定长编码', C: '有歧义编码', D: '后缀编码' }, answer: 'A', explanation: '哈夫曼编码是前缀编码，任一编码都不是另一编码的前缀，且在给定权值下平均码长最短。' },
    ],
    'data-structures:lab/union-find': [
      { id: 'ds-uf-1', type: 'single', stem: '并查集在同时使用按秩合并与路径压缩后，单次操作的均摊时间复杂度近似为？', options: { A: 'O(α(n))，近似 O(1)', B: 'O(log n)', C: 'O(n)', D: 'O(n log n)' }, answer: 'A', explanation: '路径压缩加按秩合并后，均摊时间由反阿克曼函数 α(n) 界定，实际近似常数。' },
    ],
    'data-structures:lab/threaded-tree': [
      { id: 'ds-thread-1', type: 'single', stem: '在中序线索二叉树中，若某结点没有右孩子，则它的右线索指向？', options: { A: '中序后继', B: '中序前驱', C: '右子树的根', D: '根结点' }, answer: 'A', explanation: '中序线索中，空右指针指向该结点的中序后继，空左指针指向中序前驱。' },
    ],
    'data-structures:lab/bfs': [
      { id: 'ds-bfs-1', type: 'single', stem: '用邻接表存储图时，广度优先搜索的时间复杂度是？', options: { A: 'O(V+E)', B: 'O(V²)', C: 'O(V·E)', D: 'O(E²)' }, answer: 'A', explanation: 'BFS 每个顶点入队一次、每条边被检查一次，邻接表下为 O(V+E)。' },
      { id: 'ds-bfs-2', type: 'judge', stem: '在无权图中，BFS 首次访问到某顶点时经过的边数就是该顶点到源点的最短路径长度。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'BFS 按层扩展，首次到达即层数最小，因此是无权图单源最短路。' },
    ],
    'data-structures:lab/dfs': [
      { id: 'ds-dfs-1', type: 'single', stem: '用邻接矩阵存储图时，深度优先搜索的时间复杂度是？', options: { A: 'O(V²)', B: 'O(V+E)', C: 'O(E)', D: 'O(V log V)' }, answer: 'A', explanation: '邻接矩阵下每个顶点都要扫描一整行判断邻接关系，共 O(V²)。' },
    ],
    'data-structures:lab/prim': [
      { id: 'ds-prim-1', type: 'single', stem: 'Prim 算法求最小生成树更适合哪类图？', options: { A: '稠密图，复杂度 O(V²)', B: '稀疏图，复杂度 O(E log E)', C: '有向图', D: '带负权边的图' }, answer: 'A', explanation: 'Prim 以顶点为中心，邻接矩阵实现为 O(V²)，适合稠密图；稀疏图更适合 Kruskal。' },
    ],
    'data-structures:lab/kruskal': [
      { id: 'ds-kruskal-1', type: 'single', stem: 'Kruskal 算法求最小生成树更适合哪类图？', options: { A: '稀疏图，复杂度 O(E log E)', B: '稠密图，复杂度 O(V²)', C: '有向无环图', D: '含负权环的图' }, answer: 'A', explanation: 'Kruskal 按边权排序后用并查集判环，复杂度 O(E log E)，适合边较少的稀疏图。' },
    ],
    'data-structures:lab/dijkstra': [
      { id: 'ds-dij-1', type: 'judge', stem: 'Dijkstra 算法可以正确处理带负权边的图。', options: { T: '正确', F: '错误' }, answer: 'F', explanation: 'Dijkstra 基于贪心，假定已确定的最短距离不再变小；负权边会破坏该前提，应改用 Bellman–Ford。' },
      { id: 'ds-dij-2', type: 'single', stem: 'Dijkstra 算法每一轮选择哪个顶点加入已确定集合？', options: { A: '未确定顶点中当前距离最小者', B: '任意未确定顶点', C: '入度最小的顶点', D: '编号最小的顶点' }, answer: 'A', explanation: '每轮从未确定集合中取出距离最小的顶点，将其距离“确定”，再松弛其邻边。' },
    ],
    'data-structures:lab/floyd': [
      { id: 'ds-floyd-1', type: 'single', stem: 'Floyd 算法的时间复杂度及其适用场景是？', options: { A: 'O(V³)，求任意两点间最短路径', B: 'O(V²)，求单源最短路', C: 'O(E log V)，求单源最短路', D: 'O(V·E)，求最小生成树' }, answer: 'A', explanation: 'Floyd 用三重循环动态规划，复杂度 O(V³)，一次求出所有顶点对之间的最短路径。' },
    ],
    'data-structures:lab/topological': [
      { id: 'ds-topo-1', type: 'single', stem: '一个有向图能够进行拓扑排序的充要条件是？', options: { A: '图中不存在回路（是 DAG）', B: '图是连通的', C: '每个顶点入度都大于 0', D: '图是强连通的' }, answer: 'A', explanation: '拓扑排序要求顶点间先后关系不出现环，即有向无环图。' },
      { id: 'ds-topo-2', type: 'judge', stem: '只要是有向无环图，它的拓扑排序序列就一定唯一。', options: { T: '正确', F: '错误' }, answer: 'F', explanation: '当某一步存在多个入度为 0 的顶点时，可任选其一，得到不同的拓扑序列；序列唯一要求每一步恰有一个入度为 0 的顶点。' },
    ],
    'data-structures:lab/critical-path': [
      { id: 'ds-cp-1', type: 'single', stem: 'AOE 网中的关键路径是指？', options: { A: '从源点到汇点路径长度最长的路径', B: '边数最少的路径', C: '边权之和最小的路径', D: '经过顶点最多的路径' }, answer: 'A', explanation: '关键路径决定整个工程的最短完成时间，是源点到汇点路径长度（活动时间之和）最大的路径。' },
    ],
    'data-structures:lab/binary-search': [
      { id: 'ds-bs-1', type: 'single', stem: '折半查找适用的存储结构是？', options: { A: '有序顺序表', B: '无序链表', C: '有序链表', D: '任意二叉树' }, answer: 'A', explanation: '折半查找需要随机访问中间元素，因此要求有序的顺序存储结构。' },
      { id: 'ds-bs-2', type: 'single', stem: '对长度为 n 的有序表做折半查找，成功时的最大比较次数约为？', options: { A: '⌈log₂(n+1)⌉', B: 'n/2', C: 'n', D: '√n' }, answer: 'A', explanation: '折半查找的判定树高度约为 ⌈log₂(n+1)⌉，因此最大比较次数为该值。' },
    ],
    'data-structures:lab/bst-delete': [
      { id: 'ds-bstdel-1', type: 'single', stem: '在二叉排序树中删除一个同时具有左右孩子的结点，常用做法是？', options: { A: '用中序前驱或中序后继替换该结点，再删除前驱/后继', B: '直接把该结点置空', C: '把左子树整体接到右子树根上', D: '删除后无需调整' }, answer: 'A', explanation: '用中序前驱（左子树最右）或中序后继（右子树最左）的值替换后，转化为删除一个至多有一个孩子的结点。' },
    ],
    'data-structures:lab/hash-double': [
      { id: 'ds-hd-1', type: 'single', stem: '双散列探测法中，第二散列函数的主要作用是？', options: { A: '决定探测步长，使探测序列随关键字变化以减少堆积', B: '计算初始地址', C: '统计冲突次数', D: '决定装载因子' }, answer: 'A', explanation: 'H_i=(H1(key)+i·H2(key)) mod m，第二散列提供与关键字相关的步长，缓解线性探测的堆积。' },
    ],
    'data-structures:lab/kmp-nextval': [
      { id: 'ds-nextval-1', type: 'single', stem: 'KMP 的 nextval 数组相比 next 数组的主要改进是？', options: { A: '避免模式串中相同字符导致的无效比较', B: '减少主串指针移动次数', C: '降低空间复杂度', D: '把时间复杂度降到 O(log n)' }, answer: 'A', explanation: '当模式串回退位置的字符与当前失配字符相同时，nextval 继续向前回退，跳过必然失配的比较。' },
    ],
    'data-structures:lab/b-tree': [
      { id: 'ds-btree-1', type: 'single', stem: 'm 阶 B 树中，除根结点外每个非叶结点至少含有多少个关键字？', options: { A: '⌈m/2⌉−1', B: 'm−1', C: '⌈m/2⌉', D: '1' }, answer: 'A', explanation: 'm 阶 B 树每个结点至多 m−1 个关键字、至少 ⌈m/2⌉−1 个（根除外）。' },
    ],
    'data-structures:lab/insertion-sort': [
      { id: 'ds-ins-1', type: 'single', stem: '直接插入排序在待排序列基本有序时，时间复杂度接近？', options: { A: 'O(n)', B: 'O(n²)', C: 'O(n log n)', D: 'O(log n)' }, answer: 'A', explanation: '基本有序时每次插入只需很少的比较与移动，最好情况退化为 O(n)。' },
    ],
    'data-structures:lab/selection-sort': [
      { id: 'ds-sel-1', type: 'single', stem: '简单选择排序的比较次数与初始序列的排列情况？', options: { A: '无关，恒为 n(n−1)/2', B: '有关，最好为 n−1', C: '有关，最好为 n log n', D: '随机变化' }, answer: 'A', explanation: '无论初始序列如何，选择排序都要做 n(n−1)/2 次比较，移动次数较少。' },
    ],
    'data-structures:lab/bubble-sort': [
      { id: 'ds-bub-1', type: 'judge', stem: '冒泡排序是稳定的，并且当某一趟没有发生交换时可以提前结束。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '相邻元素相等时不交换，故稳定；某趟无交换说明已有序，可提前终止。' },
    ],
    'data-structures:lab/shell-sort': [
      { id: 'ds-shell-1', type: 'single', stem: '希尔排序属于哪类排序，且是否稳定？', options: { A: '插入排序的改进（缩小增量），不稳定', B: '交换排序，稳定', C: '选择排序，稳定', D: '归并排序，不稳定' }, answer: 'A', explanation: '希尔排序按增量分组做插入排序，是不稳定的排序算法，平均性能优于直接插入。' },
    ],
    'data-structures:lab/radix-sort': [
      { id: 'ds-radix-1', type: 'single', stem: '基数排序的时间复杂度是（n 个记录、d 位、r 个基数）？', options: { A: 'O(d(n+r))', B: 'O(n log n)', C: 'O(n²)', D: 'O(n·d²)' }, answer: 'A', explanation: '基数排序按位分配与收集，共 d 趟，每趟 O(n+r)，且是稳定的排序算法。' },
    ],
  });
})(window);
