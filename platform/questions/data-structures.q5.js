/* 知序 · 数据结构补充题目
   把每个实验补足到 5 题（与 data-structures.js 合并）。 */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('data-structures:lab/sequence-insert', [
    { id: 'ds-seqins-3', type: 'single', stem: '在长度为 n 的顺序表第 i 个位置（1≤i≤n+1）插入元素，需要后移多少个元素？', options: { A: 'n−i+1', B: 'n−i', C: 'i', D: 'n' }, answer: 'A', explanation: '从表尾到第 i 个元素共 n−i+1 个元素需要依次后移一格。' },
    { id: 'ds-seqins-4', type: 'judge', stem: '动态数组按固定倍数扩容时，连续 n 次尾部插入的均摊时间复杂度为 O(1)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '按倍数扩容时，总复制次数与 n 同阶，均摊到每次插入为 O(1)。' },
    { id: 'ds-seqins-5', type: 'single', stem: '在长度为 n 的顺序表删除第 i 个元素，需要前移多少个元素？', options: { A: 'n−i', B: 'n−i+1', C: 'i−1', D: 'n' }, answer: 'A', explanation: '删除第 i 个元素后，第 i+1 到第 n 个共 n−i 个元素需要前移一位。' },
  ]);

  add('data-structures:lab/linked-reverse', [
    { id: 'ds-rev-2', type: 'single', stem: '就地逆置单链表后，新的头指针应指向？', options: { A: '原链表的尾结点', B: '原链表的头结点', C: '任意结点', D: 'NULL' }, answer: 'A', explanation: '逆置后原来的尾结点成为新的首结点，头指针指向它。' },
    { id: 'ds-rev-3', type: 'judge', stem: '单链表的就地逆置只需遍历一次即可完成。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '边遍历边反转指针方向，一趟即可完成，时间 O(n)、额外空间 O(1)。' },
    { id: 'ds-rev-4', type: 'single', stem: '逆置过程中必须先用临时变量保存什么？', options: { A: '当前结点的后继指针', B: '头结点地址', C: '链表长度', D: '数据域' }, answer: 'A', explanation: '改变 cur.next 前若不保存 next，会丢失后继结点，无法继续遍历。' },
    { id: 'ds-rev-5', type: 'judge', stem: '借助栈把链表结点依次出栈重建，也能实现逆置，但额外空间为 O(n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '栈需要保存全部结点，空间 O(n)；三指针法才是 O(1) 就地逆置。' },
  ]);

  add('data-structures:lab/sequence-reverse', [
    { id: 'ds-seqrev-1', type: 'single', stem: '顺序表就地逆置（首尾交换）的时间复杂度是？', options: { A: 'O(n)', B: 'O(1)', C: 'O(log n)', D: 'O(n²)' }, answer: 'A', explanation: '需要交换约 n/2 对元素，时间 O(n)。' },
    { id: 'ds-seqrev-2', type: 'single', stem: '顺序表就地逆置需要的额外空间是？', options: { A: 'O(1)', B: 'O(n)', C: 'O(log n)', D: 'O(n²)' }, answer: 'A', explanation: '只用一个临时变量交换元素，额外空间 O(1)。' },
    { id: 'ds-seqrev-3', type: 'judge', stem: '就地逆置通过交换第 i 个与第 n−1−i 个元素实现，循环到中点即可。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'i 从 0 到 ⌊n/2⌋−1 交换两端元素即可完成逆置。' },
    { id: 'ds-seqrev-4', type: 'single', stem: '若借助辅助数组逆置顺序表，空间复杂度是？', options: { A: 'O(n)', B: 'O(1)', C: 'O(log n)', D: 'O(n²)' }, answer: 'A', explanation: '辅助数组需要与表等长的空间，为 O(n)。' },
    { id: 'ds-seqrev-5', type: 'judge', stem: '顺序表逆置后，元素之间的逻辑先后次序被反转。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '逆置就是把序列首尾对调，逻辑次序完全反转。' },
  ]);

  add('data-structures:lab/sequence-delete-min', [
    { id: 'ds-delmin-1', type: 'single', stem: '删除顺序表最小元素并用表尾元素填补空位，整体时间复杂度是？', options: { A: 'O(n)', B: 'O(1)', C: 'O(log n)', D: 'O(n²)' }, answer: 'A', explanation: '查找最小值需要扫描全表 O(n)，删除动作本身是 O(1)，整体 O(n)。' },
    { id: 'ds-delmin-2', type: 'judge', stem: '删除最小元素后用表尾元素填补，可以避免大量元素前移。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '把表尾元素放到空位即可，无需前移，删除动作 O(1)。' },
    { id: 'ds-delmin-3', type: 'single', stem: '在顺序表中查找最小元素需要？', options: { A: '从头到尾扫描一遍', B: '折半查找', C: '只比较首元素', D: '随机访问任意位置' }, answer: 'A', explanation: '顺序表无序时只能线性扫描，比较 n−1 次。' },
    { id: 'ds-delmin-4', type: 'judge', stem: '若要求删除最小值后仍保持原有元素相对次序，则需要前移元素，复杂度仍为 O(n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '保持次序必须把空位后的元素整体前移，仍是 O(n)。' },
    { id: 'ds-delmin-5', type: 'single', stem: '对空顺序表执行“删除最小元素”应？', options: { A: '返回错误标志，不做删除', B: '返回 0', C: '把表长置为 1', D: '崩溃' }, answer: 'A', explanation: '空表没有元素，应返回失败标志并保持表不变。' },
  ]);

  add('data-structures:lab/linked-head-insert', [
    { id: 'ds-headins-1', type: 'single', stem: '用头插法依次插入元素建立单链表，得到的序列与输入顺序？', options: { A: '相反', B: '相同', C: '随机', D: '升序' }, answer: 'A', explanation: '每次插到头结点之后，后插入的排在前面，因此结果与输入顺序相反。' },
    { id: 'ds-headins-2', type: 'judge', stem: '头插法每次把新结点插入到头结点之后，单次插入的时间复杂度为 O(1)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '只需修改头结点的后继指针，无需遍历。' },
    { id: 'ds-headins-3', type: 'single', stem: '用尾插法建立单链表时需要额外维护什么指针？', options: { A: '尾指针', B: '头指针的前驱', C: '栈顶指针', D: '哈希指针' }, answer: 'A', explanation: '尾插法用尾指针直接定位表尾，避免每次遍历找尾，使总时间保持 O(n)。' },
    { id: 'ds-headins-4', type: 'judge', stem: '带头结点的链表用头插法时，头结点指针始终保持不变。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '新结点插入到头结点之后，头结点本身位置不变。' },
    { id: 'ds-headins-5', type: 'single', stem: '用头插法建立含 n 个结点的单链表，总时间复杂度是？', options: { A: 'O(n)', B: 'O(n²)', C: 'O(log n)', D: 'O(1)' }, answer: 'A', explanation: 'n 次 O(1) 的插入，总计 O(n)。' },
  ]);

  add('data-structures:lab/linked-merge', [
    { id: 'ds-merge-2', type: 'judge', stem: '合并两个有序链表时用双指针逐个比较，把较小者接入结果链表。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两个指针分别指向两个链表当前结点，比较后接入较小者并后移。' },
    { id: 'ds-merge-3', type: 'single', stem: '若不比较而直接把一个链表的结点逐个头插到另一个链表，结果通常？', options: { A: '逆序', B: '仍有序', C: '保持不变', D: '为空' }, answer: 'A', explanation: '头插会反转顺序，无法保持有序，必须按序比较接入。' },
    { id: 'ds-merge-4', type: 'judge', stem: '合并两个有序单链表可以做到原地合并，额外空间为 O(1)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '直接改动指针，把结点重新串接，无需新建结点。' },
    { id: 'ds-merge-5', type: 'single', stem: '合并后结果链表仍有序的前提是两个输入链表？', options: { A: '各自有序', B: '长度相等', C: '都不带头结点', D: '都为空' }, answer: 'A', explanation: '只有两个输入链表都有序，双指针合并才能得到有序结果。' },
  ]);

  add('data-structures:lab/josephus', [
    { id: 'ds-jose-2', type: 'judge', stem: '约瑟夫环中每次报数到 m 的人出列，下一轮从出列者的下一个人重新报数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是约瑟夫环的标准规则，出列后从下一个人重新从 1 开始报数。' },
    { id: 'ds-jose-3', type: 'judge', stem: '用数组模拟约瑟夫环时，需要用标记避免已出列者被重复计数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '数组模拟时用标志位跳过已出列元素，否则计数会错乱。' },
    { id: 'ds-jose-4', type: 'single', stem: '给定 n 和 m，约瑟夫环的出列顺序是？', options: { A: '确定的唯一序列', B: '随机序列', C: '按编号升序', D: '按编号降序' }, answer: 'A', explanation: 'n、m 确定后出列顺序唯一确定，可递推或模拟求解。' },
    { id: 'ds-jose-5', type: 'judge', stem: '用循环链表模拟约瑟夫环时，删除结点后要保证链表仍然首尾相连。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '循环链表删除结点后需维持环结构，才能继续循环报数。' },
  ]);

  add('data-structures:lab/stack-demo', [
    { id: 'ds-stack-2', type: 'single', stem: '栈的插入和删除操作都在哪里进行？', options: { A: '栈顶', B: '栈底', C: '任意位置', D: '中间位置' }, answer: 'A', explanation: '栈只允许在栈顶插入（入栈）和删除（出栈）。' },
    { id: 'ds-stack-3', type: 'judge', stem: '栈是一种后进先出（LIFO）的线性结构。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '最后入栈的元素最先出栈，即后进先出。' },
    { id: 'ds-stack-4', type: 'single', stem: 'n 个元素依次入栈（可随时出栈），可能的合法出栈序列个数为？', options: { A: '卡特兰数 C(2n,n)/(n+1)', B: 'n!', C: '2ⁿ', D: 'n' }, answer: 'A', explanation: '合法出栈序列个数为第 n 个卡特兰数 C(2n,n)/(n+1)。' },
    { id: 'ds-stack-5', type: 'judge', stem: '栈既可以用数组实现，也可以用链表实现。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '顺序栈用数组加栈顶指针，链栈用链表头部作栈顶。' },
  ]);

  add('data-structures:lab/circular-queue', [
    { id: 'ds-cq-2', type: 'single', stem: '循环队列牺牲一个单元时，队列中元素个数为？', options: { A: '(rear−front+m)%m', B: 'rear−front', C: 'front−rear', D: 'm−rear+front' }, answer: 'A', explanation: '元素个数 = (rear−front+m)%m，可正确处理绕回情况。' },
    { id: 'ds-cq-3', type: 'judge', stem: '循环队列可以解决顺序队列的“假溢出”问题。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '循环队列让下标绕回利用前面空出的位置，避免假溢出。' },
    { id: 'ds-cq-4', type: 'single', stem: '不牺牲存储单元的循环队列，常用什么区分队空与队满？', options: { A: '元素计数器或标志位', B: 'front 与 rear 的值', C: '数组长度', D: '哈希值' }, answer: 'A', explanation: '用 size 计数或标志位可区分 front==rear 是空还是满，不浪费单元。' },
    { id: 'ds-cq-5', type: 'judge', stem: '循环队列队空的条件是 front == rear。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '约定 front==rear 表示队空，这是最常用的循环队列约定。' },
  ]);

  add('data-structures:lab/shared-stack', [
    { id: 'ds-shared-2', type: 'single', stem: '两个栈共享一段数组空间的主要目的是？', options: { A: '提高空间利用率，让两栈空间互补', B: '加快入栈速度', C: '实现先进先出', D: '便于排序' }, answer: 'A', explanation: '两栈从两端向中间增长，可动态互补，减少单个栈溢出而另一个栈空闲的浪费。' },
    { id: 'ds-shared-3', type: 'judge', stem: '共享栈中栈 0 从低地址向高地址增长，栈 1 从高地址向低地址增长。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两栈相向增长，只有在中间相遇时才真正溢出。' },
    { id: 'ds-shared-4', type: 'single', stem: '共享栈中栈 0 的判空条件是？', options: { A: 'top0 == −1', B: 'top0 == 0', C: 'top0 == MAXSIZE', D: 'top0 == top1' }, answer: 'A', explanation: '栈 0 从低端增长，top0==−1 表示空；栈 1 的判空条件是 top1==MAXSIZE。' },
    { id: 'ds-shared-5', type: 'judge', stem: '共享栈适合两个栈的需求此消彼长的场景。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '当两栈一增一减时共享空间利用率最高，任一栈入栈都可能加剧整体紧张。' },
  ]);

  add('data-structures:lab/deque', [
    { id: 'ds-deque-2', type: 'single', stem: '输入受限的双端队列是指？', options: { A: '只允许在一端插入，两端都可删除', B: '两端都可插入', C: '只允许一端删除', D: '两端都不可插入' }, answer: 'A', explanation: '输入受限指插入只允许在一端，删除可在两端；输出受限则相反。' },
    { id: 'ds-deque-3', type: 'judge', stem: '输出受限的双端队列只允许在一端进行删除。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '输出受限指删除只允许在一端，插入可在两端。' },
    { id: 'ds-deque-4', type: 'single', stem: '双端队列通常用哪种结构实现？', options: { A: '循环数组或双向链表', B: '单链表', C: '二叉堆', D: '邻接矩阵' }, answer: 'A', explanation: '循环数组或双向链表都能在两端 O(1) 插入删除。' },
    { id: 'ds-deque-5', type: 'judge', stem: '用双向链表或循环数组实现的双端队列，两端插入删除的时间复杂度都是 O(1)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两端都有直接访问点，故两端操作均为 O(1)。' },
  ]);

  add('data-structures:lab/preorder', [
    { id: 'ds-pre-1', type: 'single', stem: '二叉树先序遍历的访问顺序是？', options: { A: '根—左—右', B: '左—根—右', C: '左—右—根', D: '根—右—左' }, answer: 'A', explanation: '先序（前序）遍历先访问根，再递归遍历左子树、右子树。' },
    { id: 'ds-pre-2', type: 'judge', stem: '先序遍历中第一个被访问的结点一定是整棵树的根结点。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '先序先访问根，因此序列首元素就是根。' },
    { id: 'ds-pre-3', type: 'single', stem: '先序遍历的非递归实现中，为保证左孩子先于右孩子访问，入栈顺序应为？', options: { A: '先压右孩子，再压左孩子', B: '先压左孩子，再压右孩子', C: '只压左孩子', D: '同时压入' }, answer: 'A', explanation: '栈后进先出，先压右再压左，出栈时左孩子先被访问。' },
    { id: 'ds-pre-4', type: 'single', stem: '先序遍历序列常用于表示？', options: { A: '前缀表达式（波兰式）', B: '中缀表达式', C: '后缀表达式', D: '逆波兰式' }, answer: 'A', explanation: '表达式树先序遍历得到前缀（波兰）表达式，后序遍历得到后缀（逆波兰）表达式。' },
    { id: 'ds-pre-5', type: 'judge', stem: '已知先序序列和中序序列可以唯一确定一棵二叉树。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '先序定根、中序分左右，二者结合可唯一确定二叉树。' },
  ]);

  add('data-structures:lab/inorder', [
    { id: 'ds-inorder-3', type: 'single', stem: '二叉树中序遍历的访问顺序是？', options: { A: '左—根—右', B: '根—左—右', C: '左—右—根', D: '右—根—左' }, answer: 'A', explanation: '中序遍历先遍历左子树，再访问根，最后遍历右子树。' },
    { id: 'ds-inorder-4', type: 'single', stem: '对二叉排序树进行中序遍历，得到的序列是？', options: { A: '递增有序序列', B: '递减有序序列', C: '任意序列', D: '层序序列' }, answer: 'A', explanation: '二叉排序树左<根<右，中序遍历即得递增序列。' },
    { id: 'ds-inorder-5', type: 'judge', stem: '中序线索二叉树便于直接查找结点的中序前驱与后继。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '线索把空指针改为前驱/后继指针，无需栈即可遍历。' },
  ]);

  add('data-structures:lab/postorder', [
    { id: 'ds-post-1', type: 'single', stem: '二叉树后序遍历的访问顺序是？', options: { A: '左—右—根', B: '根—左—右', C: '左—根—右', D: '右—左—根' }, answer: 'A', explanation: '后序遍历先遍历左右子树，最后访问根。' },
    { id: 'ds-post-2', type: 'judge', stem: '后序遍历序列中最后一个被访问的结点一定是根结点。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '后序最后访问根，故序列末元素为根。' },
    { id: 'ds-post-3', type: 'single', stem: '表达式树的后序遍历得到的是？', options: { A: '后缀表达式（逆波兰式）', B: '前缀表达式', C: '中缀表达式', D: '层序序列' }, answer: 'A', explanation: '后序遍历表达式树得到后缀（逆波兰）表达式，便于用栈求值。' },
    { id: 'ds-post-4', type: 'judge', stem: '销毁一棵二叉树时适合用后序遍历（先释放左右子树再释放根）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '必须先释放孩子再释放父结点，避免访问已释放内存，符合后序顺序。' },
    { id: 'ds-post-5', type: 'single', stem: '后序遍历的非递归实现相比先序、中序通常？', options: { A: '更复杂，需记录结点是否已访问过右子树', B: '更简单', C: '无法实现', D: '不需要栈' }, answer: 'A', explanation: '后序需在左右子树都访问完才输出根，常用双栈或访问标记实现。' },
  ]);

  add('data-structures:lab/level-order', [
    { id: 'ds-level-2', type: 'single', stem: '层序遍历的访问顺序是？', options: { A: '从上到下、从左到右逐层访问', B: '从下到上', C: '先根后叶的深度优先', D: '随机顺序' }, answer: 'A', explanation: '层序遍历按层序，从上到下、每层从左到右访问。' },
    { id: 'ds-level-3', type: 'judge', stem: '层序遍历借助队列，结点出队时把其左右孩子依次入队。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '队列先进先出保证按层访问，出队时把孩子入队以延续层序。' },
    { id: 'ds-level-4', type: 'single', stem: '层序遍历常用于求二叉树的？', options: { A: '高度与最大宽度', B: '中序前驱', C: '排序结果', D: '哈希值' }, answer: 'A', explanation: '按层处理可统计层数与每层结点数，从而求高度与宽度。' },
    { id: 'ds-level-5', type: 'judge', stem: '对于只有左孩子（或只有右孩子）的单支树，层序序列与先序序列相同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '单支树每层只有一个结点，层序与先序都是根到叶的路径。' },
  ]);

  add('data-structures:lab/huffman', [
    { id: 'ds-huff-3', type: 'single', stem: '哈夫曼树的构造目标是使什么最小？', options: { A: '带权路径长度（WPL）', B: '树的高度', C: '结点总数', D: '叶结点个数' }, answer: 'A', explanation: '哈夫曼树是带权路径长度最小的二叉树。' },
    { id: 'ds-huff-4', type: 'judge', stem: '给定权值集合，哈夫曼树（或哈夫曼编码）可能不唯一，但带权路径长度相同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '存在权值相同的结点时可有多种形态，但 WPL 都达到最小且相等。' },
    { id: 'ds-huff-5', type: 'single', stem: '构造哈夫曼树时，每一步都？', options: { A: '选取权值最小的两棵树合并', B: '选取权值最大的两棵树合并', C: '按输入顺序合并', D: '随机合并' }, answer: 'A', explanation: '贪心策略：每次合并权值最小的两棵树，新树权值为二者之和。' },
  ]);

  add('data-structures:lab/union-find', [
    { id: 'ds-uf-2', type: 'single', stem: '并查集通常采用哪种存储结构表示集合？', options: { A: '树的双亲表示（数组）', B: '邻接矩阵', C: '栈', D: '循环队列' }, answer: 'A', explanation: '并查集用数组存父指针，每个集合是一棵树，根代表该集合。' },
    { id: 'ds-uf-3', type: 'judge', stem: '并查集的 find 操作沿父指针上溯到根，union 操作把一棵树的根接到另一棵树的根上。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'find 找根确定所属集合，union 合并两棵树的根。' },
    { id: 'ds-uf-4', type: 'single', stem: '按秩（或按大小）合并的作用是？', options: { A: '避免合并后树过高，保持操作高效', B: '加快排序', C: '减少内存', D: '实现先进先出' }, answer: 'A', explanation: '把矮树接到高树上，控制树高，配合路径压缩使操作近似 O(1)。' },
    { id: 'ds-uf-5', type: 'judge', stem: '并查集可以用来判断无向图的连通性以及加入一条边是否成环。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若一条边两端点已在同一集合，则加入它会成环；这也是 Kruskal 判环的依据。' },
  ]);

  add('data-structures:lab/threaded-tree', [
    { id: 'ds-thread-2', type: 'single', stem: '对二叉树进行线索化的主要目的是？', options: { A: '利用空指针域加速遍历，无需栈', B: '减少结点数量', C: '实现排序', D: '压缩存储数据' }, answer: 'A', explanation: '线索化把空指针改为前驱/后继线索，使遍历不需要栈或递归。' },
    { id: 'ds-thread-3', type: 'judge', stem: '含 n 个结点的二叉树共有 n+1 个空指针域。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'n 个结点共 2n 个指针域，除根外每个结点被一条指针指向，故空指针为 2n−(n−1)=n+1。' },
    { id: 'ds-thread-4', type: 'single', stem: '中序线索二叉树中查找某结点后继的规则是？', options: { A: '有右孩子则为右子树最左结点，否则为右线索', B: '直接取左孩子', C: '取根结点', D: '无法查找' }, answer: 'A', explanation: '右孩子存在时后继是右子树最左下结点；否则右线索直接指向中序后继。' },
    { id: 'ds-thread-5', type: 'judge', stem: '在中序线索二叉树上遍历不需要借助栈。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '利用线索可 O(1) 找到后继，从而无栈完成遍历。' },
  ]);

  add('data-structures:lab/bfs', [
    { id: 'ds-bfs-3', type: 'single', stem: '广度优先搜索通常借助哪种数据结构实现？', options: { A: '队列', B: '栈', C: '优先队列', D: '哈希表' }, answer: 'A', explanation: 'BFS 用队列保证按层访问，先入先出。' },
    { id: 'ds-bfs-4', type: 'single', stem: 'BFS 生成树中，源点到某顶点的路径长度代表？', options: { A: '最短边数（无权图）', B: '最长路径', C: '顶点度', D: '任意路径' }, answer: 'A', explanation: '无权图中 BFS 首次到达即最短，生成树路径即最短边数。' },
    { id: 'ds-bfs-5', type: 'judge', stem: '对连通图做一次 BFS 可以得到一棵包含所有顶点的广度优先生成树。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '连通图一次 BFS 访问所有顶点，其访问边构成生成树。' },
  ]);

  add('data-structures:lab/dfs', [
    { id: 'ds-dfs-2', type: 'single', stem: '深度优先搜索的实现通常借助？', options: { A: '递归或栈', B: '队列', C: '优先队列', D: '哈希表' }, answer: 'A', explanation: 'DFS 沿一条路径深入到底再回溯，可用递归或显式栈。' },
    { id: 'ds-dfs-3', type: 'judge', stem: 'DFS 可以用来判断图是否有环、求连通分量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '遍历中遇到已访问且非父结点的邻点即有环；每轮 DFS 对应一个连通分量。' },
    { id: 'ds-dfs-4', type: 'single', stem: '用邻接表存储图时，DFS 的时间复杂度是？', options: { A: 'O(V+E)', B: 'O(V²)', C: 'O(E²)', D: 'O(V log V)' }, answer: 'A', explanation: '每个顶点访问一次、每条边检查一次，故 O(V+E)。' },
    { id: 'ds-dfs-5', type: 'judge', stem: '用邻接矩阵存储图时，DFS 与 BFS 的时间复杂度相同（都是 O(V²)）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '邻接矩阵下两者都要扫描整行，复杂度均为 O(V²)。' },
  ]);

  add('data-structures:lab/prim', [
    { id: 'ds-prim-2', type: 'single', stem: 'Prim 算法每步选择的是？', options: { A: '连接已选顶点集合与未选集合的最小权边', B: '全局最小权边', C: '任意一条边', D: '入度最小的边' }, answer: 'A', explanation: 'Prim 从已选集合向外扩展，每次选横切边中权值最小者，基于割性质。' },
    { id: 'ds-prim-3', type: 'judge', stem: 'Prim 算法适用于带权的连通无向图。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '最小生成树针对连通带权无向图，Prim 从一个顶点逐步扩展。' },
    { id: 'ds-prim-4', type: 'single', stem: 'Prim 算法贪心策略的正确性主要依据？', options: { A: '最小生成树的割性质', B: '动态规划', C: '分治', D: '回溯' }, answer: 'A', explanation: '对任一割，横切边中权最小者必属于某棵最小生成树。' },
    { id: 'ds-prim-5', type: 'judge', stem: '若图中各边权值互不相同，则最小生成树唯一。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '边权互异时最小生成树唯一；有相等权值时才可能不唯一。' },
  ]);

  add('data-structures:lab/kruskal', [
    { id: 'ds-kruskal-2', type: 'single', stem: 'Kruskal 算法按什么顺序选边，并如何判环？', options: { A: '按边权从小到大选，用并查集判环', B: '按顶点编号选，用栈判环', C: '按边权从大到小选', D: '随机选边' }, answer: 'A', explanation: '先对边排序，依次选取不成环（两端点不在同一集合）的最小边。' },
    { id: 'ds-kruskal-3', type: 'judge', stem: 'Kruskal 算法的时间复杂度 O(E log E) 主要来自对边排序。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '排序 O(E log E) 主导，并查集判环近似线性。' },
    { id: 'ds-kruskal-4', type: 'single', stem: '含 V 个顶点的连通图，其最小生成树包含多少条边？', options: { A: 'V−1', B: 'V', C: 'E', D: '2V' }, answer: 'A', explanation: '生成树是含全部顶点、V−1 条边的无环连通子图。' },
    { id: 'ds-kruskal-5', type: 'judge', stem: '若图不连通，Kruskal 得到的是最小生成森林。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不连通图无法生成单棵生成树，各连通分量分别得到最小生成树，合为森林。' },
  ]);

  add('data-structures:lab/dijkstra', [
    { id: 'ds-dij-3', type: 'single', stem: '用邻接矩阵实现 Dijkstra 算法的时间复杂度是？', options: { A: 'O(V²)', B: 'O(V+E)', C: 'O(E log V)', D: 'O(V³)' }, answer: 'A', explanation: '每轮扫描未确定顶点找最小距离，共 V 轮，邻接矩阵下为 O(V²)。' },
    { id: 'ds-dij-4', type: 'judge', stem: 'Dijkstra 算法求的是从单个源点到其余各顶点的最短路径。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'Dijkstra 是单源最短路径算法，逐轮确定各顶点的最短距离。' },
    { id: 'ds-dij-5', type: 'single', stem: '用优先队列（堆）优化 Dijkstra 后，时间复杂度约为？', options: { A: 'O(E log V)', B: 'O(V²)', C: 'O(V·E)', D: 'O(V³)' }, answer: 'A', explanation: '堆优化把取最小与更新操作降到对数级，总体约 O(E log V)。' },
  ]);

  add('data-structures:lab/floyd', [
    { id: 'ds-floyd-2', type: 'single', stem: 'Floyd 算法三重循环中最外层循环控制的是？', options: { A: '中转点 k', B: '起点 i', C: '终点 j', D: '边数' }, answer: 'A', explanation: '以 k 为中转点，逐轮更新 d[i][j]=min(d[i][j], d[i][k]+d[k][j])。' },
    { id: 'ds-floyd-3', type: 'judge', stem: 'Floyd 算法可以处理负权边，但不能处理含负权回路的图。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '负权边不影响递推，但负权回路会使最短路径无下界。' },
    { id: 'ds-floyd-4', type: 'single', stem: 'Floyd 算法的状态转移方程是？', options: { A: 'd[i][j] = min(d[i][j], d[i][k]+d[k][j])', B: 'd[i][j] = d[i][k]×d[k][j]', C: 'd[i][j] = d[i][j]+1', D: 'd[i][j] = max(d[i][k], d[k][j])' }, answer: 'A', explanation: '考虑经 k 中转是否更短，取二者较小值。' },
    { id: 'ds-floyd-5', type: 'judge', stem: 'Floyd 算法一次运行即可求出所有顶点对之间的最短路径。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'Floyd 是动态规划的多源最短路算法，结果为全源距离矩阵。' },
  ]);

  add('data-structures:lab/topological', [
    { id: 'ds-topo-3', type: 'single', stem: '用入度法进行拓扑排序的基本步骤是？', options: { A: '反复找出入度为 0 的顶点输出并删除其出边', B: '反复找出出度为 0 的顶点', C: '按编号从小到大输出', D: '用深度优先求最短路' }, answer: 'A', explanation: '不断取出入度为 0 的顶点，输出后将其邻点入度减 1，重复至结束。' },
    { id: 'ds-topo-4', type: 'judge', stem: '若拓扑排序未能输出全部顶点，则说明有向图中存在环。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '有环时环上顶点入度始终大于 0，无法全部输出，可据此判环。' },
    { id: 'ds-topo-5', type: 'single', stem: '用邻接表实现入度法拓扑排序的时间复杂度是？', options: { A: 'O(V+E)', B: 'O(V²)', C: 'O(E log V)', D: 'O(V·E)' }, answer: 'A', explanation: '每个顶点入队一次、每条边被处理一次，故 O(V+E)。' },
  ]);

  add('data-structures:lab/critical-path', [
    { id: 'ds-cp-2', type: 'single', stem: '关键路径的长度代表？', options: { A: '完成整个工程的最短时间', B: '最长边的权值', C: '顶点个数', D: '活动总数' }, answer: 'A', explanation: '关键路径是源点到汇点的最长路径，决定工程的最短完成时间。' },
    { id: 'ds-cp-3', type: 'judge', stem: '关键活动的松弛时间（时间余量）为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '关键活动必须按时开始和完成，其最早开始时间等于最迟开始时间，余量为 0。' },
    { id: 'ds-cp-4', type: 'single', stem: '求关键路径通常需要计算事件的哪两个量？', options: { A: '最早发生时间 ve 与最迟发生时间 vl', B: '入度与出度', C: '权值与边数', D: '颜色与标号' }, answer: 'A', explanation: '先正推求 ve，再逆推求 vl，据此求活动的余量确定关键活动。' },
    { id: 'ds-cp-5', type: 'judge', stem: '缩短某个关键活动的持续时间一定能缩短整个工期。', options: { T: '正确', F: '错误' }, answer: 'F', explanation: '缩短关键活动可能使关键路径转移，只有仍在关键路径上的活动缩短才影响总工期。' },
  ]);

  add('data-structures:lab/bellman-ford', [
    { id: 'ds-bf-1', type: 'single', stem: 'Bellman–Ford 算法可以处理哪种 Dijkstra 无法处理的情况？', options: { A: '带负权边的图', B: '稠密图', C: '带权无向图', D: '稀疏图' }, answer: 'A', explanation: 'Bellman–Ford 通过多轮松弛可处理负权边，并检测负权回路。' },
    { id: 'ds-bf-2', type: 'judge', stem: 'Bellman–Ford 算法能够检测出图中是否存在负权回路。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若第 V 轮仍能松弛某条边，则存在负权回路。' },
    { id: 'ds-bf-3', type: 'single', stem: 'Bellman–Ford 算法需要对所有边进行多少轮松弛？', options: { A: 'V−1 轮', B: 'V 轮', C: 'E 轮', D: '1 轮' }, answer: 'A', explanation: '最短路径最多含 V−1 条边，故松弛 V−1 轮即可收敛。' },
    { id: 'ds-bf-4', type: 'single', stem: 'Bellman–Ford 算法的时间复杂度是？', options: { A: 'O(V·E)', B: 'O(V²)', C: 'O(E log V)', D: 'O(V³)' }, answer: 'A', explanation: '共 V−1 轮，每轮检查 E 条边，总计 O(V·E)。' },
    { id: 'ds-bf-5', type: 'judge', stem: '若第 V 轮松弛仍能使某顶点距离变小，则图中存在负权回路。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '正常情况下 V−1 轮后应收敛；第 V 轮仍更新说明存在可无限缩短的负权回路。' },
  ]);

  add('data-structures:lab/graph-representations', [
    { id: 'ds-grep-1', type: 'single', stem: '邻接矩阵存储图的空间复杂度是？', options: { A: 'O(V²)', B: 'O(V+E)', C: 'O(E)', D: 'O(V log V)' }, answer: 'A', explanation: '邻接矩阵用 V×V 的二维数组，空间 O(V²)，适合稠密图。' },
    { id: 'ds-grep-2', type: 'single', stem: '邻接表存储图的空间复杂度是？', options: { A: 'O(V+E)', B: 'O(V²)', C: 'O(E²)', D: 'O(V log V)' }, answer: 'A', explanation: '邻接表为每个顶点存一条边链表，共 O(V+E)，适合稀疏图。' },
    { id: 'ds-grep-3', type: 'judge', stem: '无向图的邻接矩阵一定是对称矩阵。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '无向边 (i,j) 与 (j,i) 相同，故矩阵关于主对角线对称。' },
    { id: 'ds-grep-4', type: 'single', stem: '有向图邻接表中，顶点 i 对应链表的长度等于？', options: { A: '顶点 i 的出度', B: '顶点 i 的入度', C: '顶点总数', D: '边总数' }, answer: 'A', explanation: '邻接表第 i 行存 i 指向的邻点，长度即出度；入度需用逆邻接表。' },
    { id: 'ds-grep-5', type: 'judge', stem: '用邻接矩阵求某顶点的度需要扫描对应的一行（或一列）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '无向图扫描一行即得度；有向图扫描行得入度、列得出度（视存储约定）。' },
  ]);

  add('data-structures:lab/graph-cross', [
    { id: 'ds-gcross-1', type: 'single', stem: '十字链表主要用于存储哪种图？', options: { A: '有向图', B: '无向图', C: '带权无向图', D: '完全图' }, answer: 'A', explanation: '十字链表把弧结点同时挂在弧头与弧尾链上，便于有向图求入度和出度。' },
    { id: 'ds-gcross-2', type: 'judge', stem: '十字链表可以同时方便地求出有向图中顶点的入度和出度。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '每个顶点有出弧链与入弧链，入度、出度都易得。' },
    { id: 'ds-gcross-3', type: 'single', stem: '邻接多重表主要用于存储哪种图？', options: { A: '无向图', B: '有向图', C: '有向无环图', D: '二部图' }, answer: 'A', explanation: '邻接多重表用一条边结点表示无向边，避免邻接表中同一条边存两次。' },
    { id: 'ds-gcross-4', type: 'judge', stem: '十字链表中每个弧结点同时链接在弧头相同的链和弧尾相同的链上。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '弧结点有 hlink（弧头链）和 tlink（弧尾链）两个指针，故称十字链表。' },
    { id: 'ds-gcross-5', type: 'single', stem: '邻接多重表中，无向图的每条边用几个结点表示？', options: { A: '1 个', B: '2 个', C: 'V 个', D: 'E 个' }, answer: 'A', explanation: '每条边只用一个边结点，两端顶点共享，节省空间。' },
  ]);

  add('data-structures:lab/binary-search', [
    { id: 'ds-bs-3', type: 'single', stem: '折半查找每比较一次可以排除多少元素？', options: { A: '约一半', B: '一个', C: '全部', D: '四分之一' }, answer: 'A', explanation: '每次与中点比较后，可在左半或右半继续查找，排除约一半元素。' },
    { id: 'ds-bs-4', type: 'judge', stem: '折半查找的判定树高度约为 ⌈log₂(n+1)⌉。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '折半查找的判定树近似平衡，高度为 ⌈log₂(n+1)⌉，即最大比较次数。' },
    { id: 'ds-bs-5', type: 'judge', stem: '折半查找的时间复杂度为 O(log n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '每次排除一半，最多比较 O(log n) 次。' },
  ]);

  add('data-structures:lab/bst-insert', [
    { id: 'ds-bsti-3', type: 'judge', stem: '在二叉排序树中插入一个已存在的关键字时，通常不再插入（或按约定放入某侧子树）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '一般约定 BST 不允许重复关键字，重复插入被忽略。' },
    { id: 'ds-bsti-4', type: 'single', stem: '依次插入一个递增有序序列来构造二叉排序树，树会退化成？', options: { A: '单支树（类似链表）', B: '完全二叉树', C: '平衡二叉树', D: '满二叉树' }, answer: 'A', explanation: '有序插入时新结点总是插在最右，树退化为单支，查找退化为 O(n)。' },
    { id: 'ds-bsti-5', type: 'judge', stem: '二叉排序树插入操作的时间复杂度与树高有关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '插入需从根比较到叶，复杂度 O(h)，h 为树高。' },
  ]);

  add('data-structures:lab/bst-search', [
    { id: 'ds-bsts-1', type: 'single', stem: '在二叉排序树中查找关键字 k 的过程是？', options: { A: '从根开始，k 小往左、k 大往右，直到找到或到空', B: '中序遍历全部结点', C: '随机访问', D: '用哈希函数定位' }, answer: 'A', explanation: '利用 BST 有序性，每次比较即可排除一侧子树。' },
    { id: 'ds-bsts-2', type: 'judge', stem: '二叉排序树查找平均时间复杂度 O(log n)，最坏 O(n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '平衡时接近 O(log n)；退化成单支树时最坏 O(n)。' },
    { id: 'ds-bsts-3', type: 'single', stem: '二叉排序树查找失败的终止条件是？', options: { A: '走到空指针', B: '树高为 0', C: '找到根', D: '比较次数达到 n' }, answer: 'A', explanation: '沿路径比较直到遇到空指针，说明关键字不存在。' },
    { id: 'ds-bsts-4', type: 'judge', stem: '对二叉排序树做中序遍历可得到有序序列，可用于验证其是否为 BST。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '中序序列递增是 BST 的等价判定条件。' },
    { id: 'ds-bsts-5', type: 'single', stem: '在含 n 个结点的二叉排序树中查找，比较次数最多为？', options: { A: '树高 h', B: 'n', C: 'n/2', D: 'log₂n + 1' }, answer: 'A', explanation: '查找沿一条从根到叶的路径，最多比较树高 h 次。' },
  ]);

  add('data-structures:lab/bst-delete', [
    { id: 'ds-bstdel-2', type: 'single', stem: '在二叉排序树中删除一个叶子结点，应？', options: { A: '直接删除并置其父指针为空', B: '用中序后继替换', C: '旋转后再删', D: '不能删除' }, answer: 'A', explanation: '叶子无孩子，直接摘除不影响 BST 结构。' },
    { id: 'ds-bstdel-3', type: 'single', stem: '删除只有一个孩子的结点时，应？', options: { A: '用其唯一孩子替代该结点', B: '用中序前驱替代', C: '直接置空', D: '删除整棵子树' }, answer: 'A', explanation: '用唯一孩子顶替，保持父结点与子树连接。' },
    { id: 'ds-bstdel-4', type: 'judge', stem: '删除有两个孩子的结点时，用中序前驱或中序后继替换可保持二叉排序树性质。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '中序前驱是左子树最大、后继是右子树最小，替换后仍满足有序性。' },
    { id: 'ds-bstdel-5', type: 'single', stem: '二叉排序树删除操作的时间复杂度是？', options: { A: 'O(h)，h 为树高', B: 'O(1)', C: 'O(n log n)', D: 'O(n²)' }, answer: 'A', explanation: '删除需先查找目标结点，复杂度取决于树高。' },
  ]);

  add('data-structures:lab/avl-rotations', [
    { id: 'ds-avl-1', type: 'single', stem: '在 AVL 树中删除一个同时有左右孩子的结点，按二叉排序树规则应如何操作后再回溯调平衡？', options: { A: '用中序后继（右子树最小结点）替换其关键字，再删除那个后继替身', B: '直接把该结点连同两棵子树一起删除', C: '把左子树整体挂到右子树最左端，无需删除关键字', D: '只删除该结点的关键字，孩子的指针保持不动' }, answer: 'A', explanation: '用中序后继替换后，问题转化为删除至多只有一个孩子的替身结点，随后从替身原位置沿路径回溯更新高度并旋转。', hint: '中序后继是右子树中最小的结点，它至多只有一个右孩子。' },
    { id: 'ds-avl-2', type: 'single', stem: '在 AVL 树中删除结点时，若被删除的结点只有一个孩子，正确的处理是？', options: { A: '用这个唯一孩子直接顶替被删结点的位置，再从顶替处向上回溯修复平衡', B: '必须先做一次单旋再删除该结点', C: '把该结点的孩子也一并删除', D: '只能改用中序后继替换后才能删除' }, answer: 'A', explanation: '至多一个孩子时用孩子顶替即可保持二叉排序树性质；与删除双孩子结点一样，之后要沿回溯路径更新高度与平衡因子，必要时旋转。' },
    { id: 'ds-avl-3', type: 'single', stem: '在 AVL 树中删除一个关键字的回溯过程中，对经过的每个结点应如何更新状态？', options: { A: '用孩子的新高度重新计算本结点高度与平衡因子，再判断是否旋转', B: '只更新平衡因子，高度最后统一计算一次即可', C: '先旋转，再看是否需要更新高度', D: '高度与平衡因子都不需更新，只需重新排序' }, answer: 'A', explanation: '自底向上回溯时，孩子的高度可能已因旋转而改变，因此每个结点都要重新计算高度与平衡因子，据此决定是否旋转，才能让祖先得到正确的高度信息。' },
  ]);

  add('data-structures:lab/red-black-tree', [
    { id: 'ds-rb-2', type: 'single', stem: '在红黑树中删除一个黑结点（其位置由孩子或后继顶替）后，为什么需要修复？', options: { A: '该位置的黑高比其兄弟少 1，破坏了从根到叶黑结点数相同这一性质', B: '破坏了根结点必须为空这一性质', C: '破坏了所有叶结点都是红结点这一性质', D: '不需要修复，红黑树允许黑高不同' }, answer: 'A', explanation: '删掉黑结点会让该路径上的黑结点数少 1，形成“双黑”亏空，必须通过变色与旋转把亏空向上传递或消解，否则黑高不再相等。', hint: '把“少了一个黑结点”理解为该位置的额外一重黑色。' },
    { id: 'ds-rb-3', type: 'judge', stem: '红黑树中从根到叶的最长路径长度不超过最短路径的两倍。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '黑高相同且红结点不相邻，保证最长路径 ≤ 2×最短路径。' },
    { id: 'ds-rb-4', type: 'single', stem: '红黑树插入新结点时通常先着为哪种颜色？', options: { A: '红色', B: '黑色', C: '随机', D: '与父结点相同' }, answer: 'A', explanation: '着红只可能违反“红结点孩子为黑”，修复代价较小；着黑会破坏黑高。' },
    { id: 'ds-rb-5', type: 'judge', stem: '红黑树是一种自平衡二叉查找树，查找、插入、删除都是 O(log n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '红黑树高度为 O(log n)，三种操作均为 O(log n)。' },
  ]);

  add('data-structures:lab/hash-chaining', [
    { id: 'ds-hc-1', type: 'single', stem: '拉链法（链地址法）处理冲突的做法是？', options: { A: '把散列到同一地址的关键字组织成链表', B: '向后逐格探测空位', C: '重新散列到另一张表', D: '直接丢弃冲突元素' }, answer: 'A', explanation: '同义词挂在同一链表中，查找时先定位桶再在链上查找。' },
    { id: 'ds-hc-2', type: 'single', stem: '拉链法的平均查找长度主要取决于？', options: { A: '装填因子 α', B: '表长是否为素数', C: '关键字的位数', D: '内存大小' }, answer: 'A', explanation: '链平均长度约为 α，查找长度随装填因子增大而增大。' },
    { id: 'ds-hc-3', type: 'judge', stem: '拉链法删除元素方便，不需要使用删除标记。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '直接在链表中摘除结点即可，不像开放定址法需要墓碑标记。' },
    { id: 'ds-hc-4', type: 'single', stem: '拉链法适合下列哪种情况？', options: { A: '装填因子较大、冲突较多', B: '装填因子接近 0', C: '不允许链表', D: '只存整数' }, answer: 'A', explanation: '链地址法对装填因子容忍度高，冲突多时性能仍可控。' },
    { id: 'ds-hc-5', type: 'judge', stem: '拉链法的装填因子可以大于 1。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '装填因子 = 元素数/表长，链表可容纳任意多元素，故可大于 1。' },
  ]);

  add('data-structures:lab/hash-linear', [
    { id: 'ds-hl-2', type: 'single', stem: '线性探测法的第 i 次探测地址公式是？', options: { A: '(H(key)+i) mod m', B: '(H(key)+i²) mod m', C: '(H(key)·i) mod m', D: 'H(key)+i' }, answer: 'A', explanation: '线性探测逐个后移：H_i=(H(key)+i) mod m。' },
    { id: 'ds-hl-3', type: 'judge', stem: '线性探测容易产生一次聚集（堆积）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '连续被占用的区域会越来越长，后续冲突元素被迫跳过更多格子，平均查找长度增大。' },
    { id: 'ds-hl-4', type: 'single', stem: '线性探测的平均查找长度随什么增大而增大？', options: { A: '装填因子 α', B: '关键字大小', C: '表长', D: '元素位数' }, answer: 'A', explanation: '装填因子越大，空位越少，探测链越长。' },
    { id: 'ds-hl-5', type: 'judge', stem: '线性探测插入时，若探测 m 次仍未找到空位，则插入失败（表满）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '最多探测 m 个位置，全都占用说明表已满。' },
  ]);

  add('data-structures:lab/hash-double', [
    { id: 'ds-hd-2', type: 'single', stem: '双散列探测的地址公式是？', options: { A: '(H1(key)+i·H2(key)) mod m', B: '(H1(key)+i) mod m', C: '(H1(key)+i²) mod m', D: 'H1(key)·H2(key)' }, answer: 'A', explanation: '步长由第二散列 H2 决定，随关键字变化以减少堆积。' },
    { id: 'ds-hd-3', type: 'judge', stem: '双散列要求第二散列值非零，且通常与表长互质。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'H2 为零会退化为不移动；与表长互质可保证探测序列遍历全表。' },
    { id: 'ds-hd-4', type: 'single', stem: '双散列相比线性探测的主要优势是？', options: { A: '减少堆积，探测序列更分散', B: '实现更简单', C: '不需要散列函数', D: '不需要处理冲突' }, answer: 'A', explanation: '步长随关键字变化，避免线性探测的连续堆积。' },
    { id: 'ds-hd-5', type: 'judge', stem: '双散列探测法删除元素时同样需要使用删除标记。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '它仍是开放定址法，直接置空会截断探测链，需用墓碑标记。' },
  ]);

  add('data-structures:lab/kmp', [
    { id: 'ds-kmp-3', type: 'single', stem: 'KMP 算法的时间复杂度是？', options: { A: 'O(n+m)', B: 'O(n·m)', C: 'O(n²)', D: 'O(log n)' }, answer: 'A', explanation: '主串指针不回退，模式串回退由 next 决定，总时间 O(n+m)。' },
    { id: 'ds-kmp-4', type: 'judge', stem: 'KMP 算法失配时主串指针不回退。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '利用已匹配信息只移动模式串，主串指针一直前进。' },
    { id: 'ds-kmp-5', type: 'single', stem: 'next[j] 的含义是？', options: { A: '模式串前 j−1 个字符的最长相等前后缀长度加 1', B: '模式串长度', C: '主串长度', D: '失配次数' }, answer: 'A', explanation: 'next[j] 指示失配时模式串应回退到的位置，由最长相等前后缀决定。' },
  ]);

  add('data-structures:lab/kmp-nextval', [
    { id: 'ds-nv-2', type: 'single', stem: 'nextval 在 next 基础上进一步优化的思路是？', options: { A: '若回退位置字符与当前失配字符相同则继续回退', B: '加快主串移动', C: '减少空间', D: '改为哈希匹配' }, answer: 'A', explanation: '避免回退后仍与同一字符比较而必然失配，继续前移。' },
    { id: 'ds-nv-3', type: 'judge', stem: 'nextval 相比 next 能进一步减少字符比较次数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '跳过必然失配的比较，效率更高。' },
    { id: 'ds-nv-4', type: 'single', stem: '计算 nextval 数组需要先得到什么？', options: { A: 'next 数组', B: '哈希表', C: '主串', D: '排序结果' }, answer: 'A', explanation: 'nextval 由 next 递推修正得到：若 p[j]==p[next[j]] 则 nextval[j]=nextval[next[j]]。' },
    { id: 'ds-nv-5', type: 'judge', stem: '按教材约定 nextval[1] = 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '下标从 1 开始时 next[1]=0，故 nextval[1]=0。' },
  ]);

  add('data-structures:lab/bf-match', [
    { id: 'ds-bfmatch-1', type: 'single', stem: 'BF（朴素）模式匹配最坏情况下的时间复杂度是？', options: { A: 'O(n·m)', B: 'O(n+m)', C: 'O(n log m)', D: 'O(1)' }, answer: 'A', explanation: '最坏时每趟都在最后一个字符失配，共约 n·m 次比较。' },
    { id: 'ds-bfmatch-2', type: 'judge', stem: 'BF 算法失配时，主串指针回退到本次匹配起点的下一个位置。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '朴素匹配每次失配都整体右移一位重新开始比较。' },
    { id: 'ds-bfmatch-3', type: 'single', stem: 'BF 算法的最好情况时间复杂度是？', options: { A: 'O(n+m)', B: 'O(n·m)', C: 'O(n²)', D: 'O(m²)' }, answer: 'A', explanation: '若首字符即失配或第一趟就匹配成功，比较次数与 n+m 同阶。' },
    { id: 'ds-bfmatch-4', type: 'judge', stem: 'BF 算法实现简单直观，但效率低于 KMP。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'BF 存在大量重复比较，KMP 利用已匹配信息更高效。' },
    { id: 'ds-bfmatch-5', type: 'single', stem: 'BF 算法中，模式串每失配一次会如何移动？', options: { A: '整体右移一位', B: '右移模式串长度', C: '不动', D: '左移一位' }, answer: 'A', explanation: '朴素匹配每次失配只把模式串右移一位，从头重新比较。' },
  ]);

  add('data-structures:lab/b-tree', [
    { id: 'ds-bt-2', type: 'single', stem: 'm 阶 B 树的每个结点最多有多少个关键字、多少个孩子？', options: { A: 'm−1 个关键字、m 个孩子', B: 'm 个关键字、m+1 个孩子', C: 'm+1 个关键字、m 个孩子', D: 'm−1 个关键字、m−1 个孩子' }, answer: 'A', explanation: 'm 阶 B 树结点至多 m−1 个关键字、至多 m 个孩子。' },
    { id: 'ds-bt-3', type: 'judge', stem: 'B 树的所有叶结点都在同一层。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'B 树是完全平衡的，所有叶结点（失败结点）位于同一层。' },
    { id: 'ds-bt-4', type: 'single', stem: 'B 树适合用于外存索引的主要原因是？', options: { A: '分支因子大、树高低，减少磁盘 I/O 次数', B: '空间占用小', C: '插入速度快', D: '支持哈希查找' }, answer: 'A', explanation: '一个结点存多个关键字，树高小，查找时访盘次数少。' },
    { id: 'ds-bt-5', type: 'judge', stem: '在 2-3 树（t=2，每结点至多 3 键、非根至少 1 键）中删除一个关键字后，若下溢结点的右兄弟恰有 2 个关键字，则应向该兄弟借一个关键字。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '兄弟关键字数多于下界 1，可以借位：父结点分隔关键字转入下溢结点，兄弟中最小的关键字上升到父结点，两个结点键数都回到合法范围。' },
  ]);

  add('data-structures:lab/b-plus-tree', [
    { id: 'ds-bpt-1', type: 'single', stem: 'B+ 树与 B 树的关键区别之一是？', options: { A: 'B+ 树所有关键字都出现在叶结点，内部结点只作索引', B: 'B+ 树不要求平衡', C: 'B+ 树叶结点不相连', D: 'B+ 树不能插入' }, answer: 'A', explanation: 'B+ 树内部结点只存索引，全部关键字（及其记录指针）在叶结点。' },
    { id: 'ds-bpt-2', type: 'single', stem: '在 B+ 树中删除某个叶结点里的记录后，若该叶的关键字数低于下界，通常如何处理？', options: { A: '先看相邻叶兄弟能否借位，兄弟也紧张时再与兄弟合并', B: '直接从内部结点中删掉对应的分隔关键字即可', C: '把整棵右子树重新插入一次', D: 'B+ 树叶结点没有关键字下界的要求' }, answer: 'A', explanation: '叶结点与 B 树一样有关键字数下界：兄弟富余时经父结点借一个关键字过来，兄弟也只有下界个关键字时则与兄弟合并，再向上修复内部结点。' },
    { id: 'ds-bpt-3', type: 'single', stem: 'B+ 树内部结点中的关键字通常是？', options: { A: '其子结点中最大（或最小）关键字的副本', B: '随机值', C: '记录指针', D: '空值' }, answer: 'A', explanation: '内部结点关键字起分界作用，是子树关键字范围的副本。' },
    { id: 'ds-bpt-4', type: 'judge', stem: 'B+ 树删除导致两个叶结点合并后，通常还需要沿着父结点方向更新相应的分隔关键字。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '合并去掉了一个子结点，父结点中指向它的分隔关键字必须重算（父索引取自右子树的最小值），否则划分区间与实际叶结点内容不再一致。' },
    { id: 'ds-bpt-5', type: 'single', stem: '在 B+ 树中查找一个关键字，通常需要？', options: { A: '一直走到叶结点', B: '在根结点即可命中', C: '随机访问任意层', D: '只查内部结点' }, answer: 'A', explanation: 'B+ 树所有关键字都在叶结点，查找必须到达叶层。' },
  ]);

  add('data-structures:lab/quick-sort', [
    { id: 'ds-qs-3', type: 'single', stem: '快速排序的平均时间复杂度和平均空间复杂度分别是？', options: { A: 'O(n log n) 与 O(log n)', B: 'O(n log n) 与 O(n)', C: 'O(n²) 与 O(1)', D: 'O(n) 与 O(n)' }, answer: 'A', explanation: '平均划分较均衡，时间 O(n log n)，递归栈平均 O(log n)。' },
    { id: 'ds-qs-4', type: 'judge', stem: '快速排序的划分操作把小于枢轴的元素放在左侧、大于枢轴的放在右侧。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'partition 以枢轴为界重新排列，使左侧不大于、右侧不小于枢轴。' },
    { id: 'ds-qs-5', type: 'judge', stem: '快速排序是不稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '划分中的交换可能改变相同关键字元素的相对次序。' },
  ]);

  add('data-structures:lab/heap-sort', [
    { id: 'ds-hs-3', type: 'single', stem: '堆排序的空间复杂度是？', options: { A: 'O(1)', B: 'O(n)', C: 'O(log n)', D: 'O(n log n)' }, answer: 'A', explanation: '堆排序在原数组上完成交换与调整，只需常数级额外空间。' },
    { id: 'ds-hs-4', type: 'judge', stem: '堆排序是不稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '堆顶与末尾交换可能改变相同关键字元素的相对次序。' },
    { id: 'ds-hs-5', type: 'single', stem: '若要把数组升序排序，通常使用？', options: { A: '大根堆', B: '小根堆', C: '散列表', D: '栈' }, answer: 'A', explanation: '大根堆堆顶最大，依次与末尾交换即可把大元素放到后面，得到升序。' },
  ]);

  add('data-structures:lab/heap-insert', [
    { id: 'ds-hins-1', type: 'single', stem: '向大根堆插入新元素时，通常先把新元素放在？', options: { A: '数组末尾，再向上调整', B: '堆顶，再向下调整', C: '任意位置', D: '中间位置' }, answer: 'A', explanation: '新元素放末尾后与父结点比较，逐步上滤直到满足堆性质。' },
    { id: 'ds-hins-2', type: 'judge', stem: '堆的插入操作时间复杂度为 O(log n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '上滤最多沿树高移动，树高为 O(log n)。' },
    { id: 'ds-hins-3', type: 'single', stem: '上滤（向上调整）时，若新元素比父结点大则？', options: { A: '与父结点交换并继续上溯', B: '停止', C: '与孩子交换', D: '删除父结点' }, answer: 'A', explanation: '大根堆要求父不小于孩子，故比父大时交换并继续向上比较。' },
    { id: 'ds-hins-4', type: 'judge', stem: '大根堆中任一结点都大于等于其孩子结点。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是大根堆的定义性质，堆顶为全局最大值。' },
    { id: 'ds-hins-5', type: 'single', stem: '堆通常用哪种结构存储？', options: { A: '完全二叉树的顺序（数组）存储', B: '二叉链表', C: '邻接矩阵', D: '十字链表' }, answer: 'A', explanation: '完全二叉树可用数组紧凑表示，父子下标关系直接可算。' },
  ]);

  add('data-structures:lab/insertion-sort', [
    { id: 'ds-ins-2', type: 'single', stem: '直接插入排序每一趟的基本操作是？', options: { A: '把当前元素插入前面已排好的有序区', B: '把最大元素放到末尾', C: '把序列一分为二', D: '随机交换' }, answer: 'A', explanation: '维护一个有序前缀，逐趟把后一个元素插入合适位置。' },
    { id: 'ds-ins-3', type: 'judge', stem: '直接插入排序是稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '插入时只在严格小于时前移，相等元素相对次序不变。' },
    { id: 'ds-ins-4', type: 'single', stem: '直接插入排序的最坏时间复杂度是？', options: { A: 'O(n²)', B: 'O(n log n)', C: 'O(n)', D: 'O(log n)' }, answer: 'A', explanation: '逆序时每个元素都要前移到底，比较与移动次数约为 n²/2。' },
    { id: 'ds-ins-5', type: 'judge', stem: '直接插入排序是原地排序，额外空间为 O(1)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '只需一个临时变量暂存待插入元素。' },
  ]);

  add('data-structures:lab/binary-insert-sort', [
    { id: 'ds-bins-1', type: 'single', stem: '折半插入排序相比直接插入排序改进之处是？', options: { A: '用折半查找确定插入位置，减少比较次数', B: '减少移动次数', C: '降低空间复杂度', D: '使算法稳定' }, answer: 'A', explanation: '在有序区用折半查找定位插入点，比较次数降为 O(n log n)，但移动次数不变。' },
    { id: 'ds-bins-2', type: 'judge', stem: '折半插入排序的元素移动次数与直接插入排序相同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '找到位置后仍需后移元素，移动次数取决于原序列，未减少。' },
    { id: 'ds-bins-3', type: 'single', stem: '折半插入排序的时间复杂度是？', options: { A: 'O(n²)', B: 'O(n log n)', C: 'O(n)', D: 'O(log n)' }, answer: 'A', explanation: '移动次数仍为 O(n²)，主导总复杂度。' },
    { id: 'ds-bins-4', type: 'judge', stem: '折半插入排序是稳定的。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '折半查找定位时取右侧边界，保持相等元素的相对次序，故稳定。' },
    { id: 'ds-bins-5', type: 'single', stem: '折半插入排序适合下列哪种情况？', options: { A: '记录数较多、比较操作代价较高', B: '记录数极少', C: '要求减少移动', D: '要求 O(1) 比较' }, answer: 'A', explanation: '减少比较次数的优势在比较代价高时更明显。' },
  ]);

  add('data-structures:lab/shell-sort', [
    { id: 'ds-shell-2', type: 'single', stem: '希尔排序的基本做法是？', options: { A: '按增量分组做插入排序，增量逐步缩小到 1', B: '每次选最小元素', C: '分治合并', D: '按位排序' }, answer: 'A', explanation: '先用较大增量使序列基本有序，再逐步减小增量，最后增量为 1 做插入排序。' },
    { id: 'ds-shell-3', type: 'judge', stem: '希尔排序是不稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '分组插入时相同元素可能跨组交换，破坏相对次序。' },
    { id: 'ds-shell-4', type: 'single', stem: '希尔排序的平均时间复杂度大致为？', options: { A: 'O(n^1.3) 量级，优于直接插入', B: 'O(n²)', C: 'O(n log n) 严格', D: 'O(1)' }, answer: 'A', explanation: '希尔排序平均约 O(n^1.3)（与增量序列有关），优于 O(n²) 的直接插入。' },
    { id: 'ds-shell-5', type: 'judge', stem: '希尔排序最后一趟的增量为 1，等价于做一次直接插入排序。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '增量为 1 时对整个序列做插入排序，此时序列已基本有序，代价低。' },
  ]);

  add('data-structures:lab/bubble-sort', [
    { id: 'ds-bub-2', type: 'single', stem: '冒泡排序每一趟的效果是？', options: { A: '把当前未排序部分的最大元素移到末尾', B: '把最小元素移到开头', C: '把序列一分为二', D: '随机打乱' }, answer: 'A', explanation: '相邻比较交换，较大者逐步“冒”到未排序区末尾。' },
    { id: 'ds-bub-3', type: 'judge', stem: '冒泡排序是稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '只在严格逆序时交换，相等元素不交换，故稳定。' },
    { id: 'ds-bub-4', type: 'single', stem: '带提前终止的冒泡排序在序列已有序时的时间复杂度是？', options: { A: 'O(n)', B: 'O(n²)', C: 'O(n log n)', D: 'O(1)' }, answer: 'A', explanation: '第一趟无交换即可判定有序并结束，只比较 n−1 次。' },
    { id: 'ds-bub-5', type: 'judge', stem: '冒泡排序最坏情况下的比较次数约为 n(n−1)/2。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '逆序时每趟比较次数递减，总计 n(n−1)/2。' },
  ]);

  add('data-structures:lab/selection-sort', [
    { id: 'ds-sel-2', type: 'single', stem: '简单选择排序每一趟的操作是？', options: { A: '从未排序区选出最小元素放到已排序区末尾', B: '相邻交换', C: '折半查找', D: '按位分配' }, answer: 'A', explanation: '每趟扫描未排序区找最小值，与未排序区首元素交换。' },
    { id: 'ds-sel-3', type: 'judge', stem: '简单选择排序是不稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '交换可能把相等元素跨越其他元素，破坏相对次序。' },
    { id: 'ds-sel-4', type: 'single', stem: '简单选择排序的元素移动次数最多为？', options: { A: 'n−1 次', B: 'n(n−1)/2 次', C: 'n² 次', D: '0 次' }, answer: 'A', explanation: '每趟至多交换一次，共 n−1 趟，移动次数最少是它的优点。' },
    { id: 'ds-sel-5', type: 'judge', stem: '简单选择排序的比较次数与初始序列无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '无论初始顺序如何，都要做 n(n−1)/2 次比较。' },
  ]);

  add('data-structures:lab/merge-sort', [
    { id: 'ds-ms-2', type: 'single', stem: '二路归并排序的基本思路是？', options: { A: '把序列不断二分，再两两合并有序子序列', B: '每次选最小元素', C: '按位分配', D: '构建堆' }, answer: 'A', explanation: '分治：递归划分到单元素，再自底向上两两归并成有序序列。' },
    { id: 'ds-ms-3', type: 'judge', stem: '归并排序是稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '合并时相等元素保持原顺序（先取左半），故稳定。' },
    { id: 'ds-ms-4', type: 'single', stem: '归并排序需要多少辅助空间？', options: { A: 'O(n)', B: 'O(1)', C: 'O(log n)', D: 'O(n log n)' }, answer: 'A', explanation: '合并需要与序列等长的辅助数组，空间 O(n)。' },
    { id: 'ds-ms-5', type: 'judge', stem: '归并排序的时间复杂度恒为 O(n log n)，与初始序列无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '划分深度 log n、每层合并 O(n)，最好与最坏都是 O(n log n)。' },
  ]);

  add('data-structures:lab/radix-sort', [
    { id: 'ds-radix-2', type: 'single', stem: '基数排序的基本操作是？', options: { A: '按关键字某一位分配与收集，逐位进行', B: '两两比较交换', C: '折半划分', D: '构建堆' }, answer: 'A', explanation: '按位（如低位到高位）分配到桶再依次收集，重复 d 趟。' },
    { id: 'ds-radix-3', type: 'judge', stem: '基数排序是稳定的排序算法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '分配收集时保持同一位相同者的原顺序，故稳定。' },
    { id: 'ds-radix-4', type: 'single', stem: '基数排序适合下列哪种数据？', options: { A: '关键字位数少、取值范围小的整数或字符串', B: '浮点数且范围极大', C: '记录数很少', D: '任意结构体' }, answer: 'A', explanation: '位数 d 和基数 r 越小越有利，故适合位数少、范围小的键。' },
    { id: 'ds-radix-5', type: 'judge', stem: '基数排序不是基于比较的排序。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '基数排序按位分配收集，不做元素间比较。' },
  ]);

  add('data-structures:lab/counting-sort', [
    { id: 'ds-cnt-1', type: 'single', stem: '计数排序的基本思想是？', options: { A: '统计每个取值出现的次数，据此直接放置元素', B: '两两比较交换', C: '递归二分', D: '构建堆' }, answer: 'A', explanation: '统计各值频次并求前缀和，确定每个元素在输出中的位置。' },
    { id: 'ds-cnt-2', type: 'judge', stem: '计数排序不是基于比较的排序，时间复杂度为 O(n+k)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'n 为元素数、k 为取值范围，只需统计与放置，无需比较。' },
    { id: 'ds-cnt-3', type: 'single', stem: '计数排序适合下列哪种情况？', options: { A: '关键字为范围不大的整数', B: '任意浮点数', C: '范围极大的稀疏整数', D: '任意字符串' }, answer: 'A', explanation: '需要长度为 k 的计数数组，k 过大则不划算。' },
    { id: 'ds-cnt-4', type: 'judge', stem: '计数排序要稳定，放置元素时应从后往前扫描原数组。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '从后往前放置可保证相同值的元素保持原相对次序，实现稳定排序。' },
    { id: 'ds-cnt-5', type: 'single', stem: '计数排序的空间复杂度是（k 为取值范围）？', options: { A: 'O(k)', B: 'O(1)', C: 'O(n)', D: 'O(n log k)' }, answer: 'A', explanation: '需要长度为 k 的计数数组，故空间 O(k)。' },
  ]);

  add('data-structures:lab/bst-insert', [
    { id: 'ds-bsti-6', type: 'single', stem: '在二叉排序树中插入的新结点总是作为？', options: { A: '叶子结点', B: '根结点', C: '内部结点', D: '任意位置' }, answer: 'A', explanation: '从根比较到空指针处插入，新结点必然是叶子。' },
    { id: 'ds-bsti-7', type: 'judge', stem: '二叉排序树插入操作不会改变已有结点之间的相对位置。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '插入只新增叶子并挂接指针，已有结点的父子关系不变。' },
  ]);

  add('data-structures:lab/avl-rotations', [
    { id: 'ds-avl-4', type: 'single', stem: '在 AVL 树中成功插入一个关键字后，与删除操作相比，旋转次数与修复范围有何不同？', options: { A: '插入只需修复最低失衡结点，一次旋转即可结束回溯；删除可能触发多次旋转', B: '插入必须修复路径上所有失衡结点，删除只需修复一个', C: '两者都只需修复最低失衡结点', D: '两者都必须沿路径进行 O(log n) 次旋转' }, answer: 'A', explanation: '插入使子树高度加一，最低失衡结点旋转后子树高度恢复到插入前，其祖先不再失衡；删除使子树高度减一，旋转后子树高度可能仍偏矮，失衡会继续上传。' },
    { id: 'ds-avl-5', type: 'single', stem: '在 AVL 树中（无论插入还是删除引起），失衡结点右孩子的右子树更高时，应执行何种旋转？', options: { A: 'RR 型：对失衡结点做一次左旋', B: 'LL 型：对失衡结点做一次右旋', C: 'LR 型：先左旋再右旋', D: 'RL 型：先右旋再左旋' }, answer: 'A', explanation: '两代孩子都偏向右侧即为 RR 型，对失衡结点左旋一次即可；旋转只改动指针与父子关系，不改变中序遍历得到的序列。' },
  ]);

  add('data-structures:lab/kmp', [
    { id: 'ds-kmp-6', type: 'single', stem: 'KMP 的 next 数组只与什么有关？', options: { A: '模式串本身', B: '主串', C: '主串与模式串', D: '匹配结果' }, answer: 'A', explanation: 'next 由模式串的最长相等前后缀决定，与主串无关，可预先计算。' },
    { id: 'ds-kmp-7', type: 'judge', stem: 'KMP 失配时，模式串回退到 next 指示的位置，主串指针不动。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这正是 KMP 避免主串回溯、提高效率的关键。' },
  ]);

  add('data-structures:lab/hash-linear', [
    { id: 'ds-hl-6', type: 'judge', stem: '线性探测删除元素需用墓碑标记，查找遇到墓碑时要继续探测。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '墓碑既表示该位置曾有元素，又不能截断探测链，查找须继续。' },
  ]);

  add('data-structures:lab/red-black-tree', [
    { id: 'ds-rb-6', type: 'single', stem: '红黑树删除中修复“双黑”时，若兄弟结点为黑色且兄弟的两个孩子也都是黑色，应如何处理？', options: { A: '把兄弟染红，把双黑上移到父结点继续修复', B: '把兄弟染红并立即结束修复', C: '直接删除兄弟结点', D: '对父结点做一次左旋即可结束' }, answer: 'A', explanation: '这属于四情形中的第②种：兄弟两侧黑结点数与双黑位置相同，把兄弟染红可使父结点以下黑高一致，亏空上移到父结点；父结点为红则直接染黑结束，否则继续修复。' },
  ]);

  add('data-structures:lab/quick-sort', [
    { id: 'ds-qs-6', type: 'single', stem: '为缓解快速排序的最坏情况，可以？', options: { A: '随机选取枢轴或三数取中', B: '总是取首元素为枢轴', C: '减少递归', D: '改成冒泡排序' }, answer: 'A', explanation: '随机化或三数取中可降低划分一边倒的概率，避免退化。' },
    { id: 'ds-qs-7', type: 'judge', stem: '快速排序每趟划分后，枢轴元素已位于其最终位置。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '划分后左侧都不大于、右侧都不小于枢轴，故枢轴位置确定。' },
  ]);

  add('data-structures:lab/heap-sort', [
    { id: 'ds-hs-6', type: 'judge', stem: '堆排序建堆时间为 O(n)，之后每趟调整堆为 O(log n)，总体 O(n log n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '自底向上建堆 O(n)，n−1 次交换调整各 O(log n)，总体 O(n log n)。' },
    { id: 'ds-hs-7', type: 'single', stem: '堆排序的时间复杂度与初始序列的关系是？', options: { A: '最好、最坏都是 O(n log n)', B: '最坏 O(n²)', C: '最好 O(n)', D: '与初始序列无关且为 O(n)' }, answer: 'A', explanation: '无论初始序列如何，建堆与逐趟调整的总代价都是 O(n log n)。' },
  ]);

  add('data-structures:lab/merge-sort', [
    { id: 'ds-ms-6', type: 'single', stem: '二路归并排序递归划分的深度是？', options: { A: 'O(log n)', B: 'O(n)', C: 'O(n log n)', D: 'O(1)' }, answer: 'A', explanation: '每次二分，递归深度为 ⌈log₂n⌉。' },
  ]);

  /* == MORE == */
})(window);
