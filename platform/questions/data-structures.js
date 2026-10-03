/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */
(function(g){
  g.ZhixuQuestionBankVersion="question-quality-20261002-r2";
  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},{
  "data-structures:lab/sequence-insert": [
    {
      "id": "ds-seqins-1-r2",
      "type": "single",
      "stem": "长度为n的顺序表有n+1个合法插入位置，等概率选择其中一个且无需扩容，平均需要移动多少个旧元素？",
      "options": {
        "A": "n/2",
        "B": "(n+1)/2",
        "C": "n",
        "D": "n−i+1"
      },
      "answer": "A",
      "explanation": "各插入位置移动次数平均后为 n/2，因此顺序表插入的时间复杂度为 O(n)。",
      "hint": "把每个位置需要后移的元素个数加起来再取平均。"
    },
    {
      "id": "ds-seqins-2",
      "type": "judge",
      "stem": "顺序表插入元素的时间复杂度是 O(n)，而按位查找的时间复杂度是 O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "顺序表支持随机访问，按位查找 O(1)；插入需要移动元素，平均 O(n)。"
    },
    {
      "id": "ds-seqins-3",
      "type": "single",
      "stem": "在长度为 n 的顺序表第 i 个位置（1≤i≤n+1）插入元素，需要后移多少个元素？",
      "options": {
        "A": "n−i+1",
        "B": "n−i",
        "C": "i",
        "D": "n"
      },
      "answer": "A",
      "explanation": "从表尾到第 i 个元素共 n−i+1 个元素需要依次后移一格。"
    },
    {
      "id": "ds-seqins-4-r2",
      "type": "judge",
      "stem": "从空动态数组开始，容量按固定倍数大于1扩容；连续n次尾插的总时间为O(n)，每次尾插的均摊时间为O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "按倍数扩容时，总复制次数与 n 同阶，均摊到每次插入为 O(1)。"
    },
    {
      "id": "ds-seqins-5",
      "type": "single",
      "stem": "在长度为 n 的顺序表删除第 i 个元素，需要前移多少个元素？",
      "options": {
        "A": "n−i",
        "B": "n−i+1",
        "C": "i−1",
        "D": "n"
      },
      "answer": "A",
      "explanation": "删除第 i 个元素后，第 i+1 到第 n 个共 n−i 个元素需要前移一位。"
    },
    {
      "id": "qa-20261002-data-structures-lab-sequence-insert-01",
      "type": "single",
      "stem": "顺序表[2,4,6,8]容量充足，先在1起第3位插入5，再删除第2位。两个操作共发生多少次元素移动（每移动一项计一次，含删除时新插入元素的移动）？",
      "options": {
        "A": "5",
        "B": "2",
        "C": "3",
        "D": "6"
      },
      "answer": "A",
      "explanation": "插入移动原6、8共2项，成[2,4,5,6,8]；删4移动5、6、8共3项，总5。"
    }
  ],
  "data-structures:lab/linked-reverse": [
    {
      "id": "ds-rev-1-r2",
      "type": "single",
      "stem": "经典迭代法用prev记录已逆置前缀、cur记录当前结点，并用next暂存后继。此方案使用几个遍历指针变量？",
      "options": {
        "A": "1 个",
        "B": "2 个",
        "C": "3 个",
        "D": "4 个"
      },
      "answer": "C",
      "explanation": "经典做法用 prev、cur、next 三个指针，边遍历边改变指针方向，额外空间 O(1)。"
    },
    {
      "id": "ds-rev-2-r2",
      "type": "single",
      "stem": "一个非空、不带头结点的单链表就地逆置后，新头指针应指向？",
      "options": {
        "A": "原链表的尾结点",
        "B": "原链表的头结点",
        "C": "任意结点",
        "D": "NULL"
      },
      "answer": "A",
      "explanation": "逆置后原来的尾结点成为新的首结点，头指针指向它。"
    },
    {
      "id": "ds-rev-3",
      "type": "judge",
      "stem": "单链表的就地逆置只需遍历一次即可完成。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "边遍历边反转指针方向，一趟即可完成，时间 O(n)、额外空间 O(1)。"
    },
    {
      "id": "ds-rev-4",
      "type": "single",
      "stem": "逆置过程中必须先用临时变量保存什么？",
      "options": {
        "A": "当前结点的后继指针",
        "B": "头结点地址",
        "C": "链表长度",
        "D": "数据域"
      },
      "answer": "A",
      "explanation": "改变 cur.next 前若不保存 next，会丢失后继结点，无法继续遍历。"
    },
    {
      "id": "ds-rev-5",
      "type": "judge",
      "stem": "借助栈把链表结点依次出栈重建，也能实现逆置，但额外空间为 O(n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "栈需要保存全部结点，空间 O(n)；三指针法才是 O(1) 就地逆置。"
    },
    {
      "id": "qa-20261002-data-structures-lab-linked-reverse-01",
      "type": "single",
      "stem": "无哨兵链表A→B→C→NULL，用prev=NULL、cur=A的迭代逆置处理完A和B后，prev、cur及A.next分别为？",
      "options": {
        "A": "C、NULL、A",
        "B": "B、C、NULL",
        "C": "A、B、C",
        "D": "B、C、B"
      },
      "answer": "B",
      "explanation": "处理A后A.next=NULL，处理B后B.next=A；prev=B，cur=C。"
    }
  ],
  "data-structures:lab/sequence-reverse": [
    {
      "id": "ds-seqrev-1",
      "type": "single",
      "stem": "顺序表就地逆置（首尾交换）的时间复杂度是？",
      "options": {
        "A": "O(n)",
        "B": "O(1)",
        "C": "O(log n)",
        "D": "O(n²)"
      },
      "answer": "A",
      "explanation": "需要交换约 n/2 对元素，时间 O(n)。"
    },
    {
      "id": "ds-seqrev-2",
      "type": "single",
      "stem": "顺序表就地逆置需要的额外空间是？",
      "options": {
        "A": "O(1)",
        "B": "O(n)",
        "C": "O(log n)",
        "D": "O(n²)"
      },
      "answer": "A",
      "explanation": "只用一个临时变量交换元素，额外空间 O(1)。"
    },
    {
      "id": "ds-seqrev-3",
      "type": "judge",
      "stem": "就地逆置通过交换第 i 个与第 n−1−i 个元素实现，循环到中点即可。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "i 从 0 到 ⌊n/2⌋−1 交换两端元素即可完成逆置。"
    },
    {
      "id": "ds-seqrev-4",
      "type": "single",
      "stem": "若借助辅助数组逆置顺序表，空间复杂度是？",
      "options": {
        "A": "O(n)",
        "B": "O(1)",
        "C": "O(log n)",
        "D": "O(n²)"
      },
      "answer": "A",
      "explanation": "辅助数组需要与表等长的空间，为 O(n)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-sequence-reverse-01",
      "type": "single",
      "stem": "0起数组[10,20,30,40,50,60]按i与n−1−i交换，完成前两次交换后数组为？",
      "options": {
        "A": "[60,50,40,30,20,10]",
        "B": "[10,20,40,30,50,60]",
        "C": "[60,50,30,40,20,10]",
        "D": "[60,20,30,40,50,10]"
      },
      "answer": "C",
      "explanation": "依次交换(0,5)、(1,4)，中间(2,3)未处理。"
    }
  ],
  "data-structures:lab/sequence-delete-min": [
    {
      "id": "ds-delmin-1",
      "type": "single",
      "stem": "删除顺序表最小元素并用表尾元素填补空位，整体时间复杂度是？",
      "options": {
        "A": "O(n)",
        "B": "O(1)",
        "C": "O(log n)",
        "D": "O(n²)"
      },
      "answer": "A",
      "explanation": "查找最小值需要扫描全表 O(n)，删除动作本身是 O(1)，整体 O(n)。"
    },
    {
      "id": "ds-delmin-2",
      "type": "judge",
      "stem": "删除最小元素后用表尾元素填补，可以避免大量元素前移。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "把表尾元素放到空位即可，无需前移，删除动作 O(1)。"
    },
    {
      "id": "ds-delmin-3-r2",
      "type": "single",
      "stem": "在含n≥1个元素的无序顺序表中，仅通过关键字比较确定最小元素，通常需要？",
      "options": {
        "A": "从头到尾扫描一遍",
        "B": "折半查找",
        "C": "只比较首元素",
        "D": "随机访问任意位置"
      },
      "answer": "A",
      "explanation": "顺序表无序时只能线性扫描，比较 n−1 次。"
    },
    {
      "id": "ds-delmin-4",
      "type": "judge",
      "stem": "若要求删除最小值后仍保持原有元素相对次序，则需要前移元素，复杂度仍为 O(n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "保持次序必须把空位后的元素整体前移，仍是 O(n)。"
    },
    {
      "id": "ds-delmin-5",
      "type": "single",
      "stem": "对空顺序表执行“删除最小元素”应？",
      "options": {
        "A": "返回错误标志，不做删除",
        "B": "返回 0",
        "C": "把表长置为 1",
        "D": "崩溃"
      },
      "answer": "A",
      "explanation": "空表没有元素，应返回失败标志并保持表不变。"
    },
    {
      "id": "qa-20261002-data-structures-lab-sequence-delete-min-01",
      "type": "single",
      "stem": "无序表[7,2,9,4]删除唯一最小值并用原表尾补位，新的逻辑表为？",
      "options": {
        "A": "[7,9,4]",
        "B": "[2,7,9]",
        "C": "[7,2,9]",
        "D": "[7,4,9]"
      },
      "answer": "D",
      "explanation": "最小2在第2位，以4覆盖并减表长，9仍第3位；该删除不稳定。"
    }
  ],
  "data-structures:lab/linked-head-insert": [
    {
      "id": "ds-headins-1",
      "type": "single",
      "stem": "用头插法依次插入元素建立单链表，得到的序列与输入顺序？",
      "options": {
        "A": "相反",
        "B": "相同",
        "C": "随机",
        "D": "升序"
      },
      "answer": "A",
      "explanation": "每次插到头结点之后，后插入的排在前面，因此结果与输入顺序相反。"
    },
    {
      "id": "ds-headins-2",
      "type": "judge",
      "stem": "头插法每次把新结点插入到头结点之后，单次插入的时间复杂度为 O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "只需修改头结点的后继指针，无需遍历。"
    },
    {
      "id": "ds-headins-3",
      "type": "single",
      "stem": "用尾插法建立单链表时需要额外维护什么指针？",
      "options": {
        "A": "尾指针",
        "B": "头指针的前驱",
        "C": "栈顶指针",
        "D": "哈希指针"
      },
      "answer": "A",
      "explanation": "尾插法用尾指针直接定位表尾，避免每次遍历找尾，使总时间保持 O(n)。"
    },
    {
      "id": "ds-headins-5",
      "type": "single",
      "stem": "用头插法建立含 n 个结点的单链表，总时间复杂度是？",
      "options": {
        "A": "O(n)",
        "B": "O(n²)",
        "C": "O(log n)",
        "D": "O(1)"
      },
      "answer": "A",
      "explanation": "n 次 O(1) 的插入，总计 O(n)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-linked-head-insert-01",
      "type": "single",
      "stem": "带头结点空链表先依次头插1、2，再对当前表尾尾插3，所得元素序列是？",
      "options": {
        "A": "[2,1,3]",
        "B": "[3,2,1]",
        "C": "[1,2,3]",
        "D": "[2,3,1]"
      },
      "answer": "A",
      "explanation": "头插1得[1]，头插2得[2,1]；尾插3只接最后。"
    }
  ],
  "data-structures:lab/linked-merge": [
    {
      "id": "ds-merge-1",
      "type": "single",
      "stem": "合并两个长度分别为 m、n 的有序单链表为一个有序链表，时间复杂度是？",
      "options": {
        "A": "O(m+n)",
        "B": "O(m·n)",
        "C": "O(log(m+n))",
        "D": "O(m²+n²)"
      },
      "answer": "A",
      "explanation": "两个链表各遍历一次，比较次数不超过 m+n−1，时间 O(m+n)。"
    },
    {
      "id": "ds-merge-2",
      "type": "judge",
      "stem": "合并两个有序链表时用双指针逐个比较，把较小者接入结果链表。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两个指针分别指向两个链表当前结点，比较后接入较小者并后移。"
    },
    {
      "id": "ds-merge-3-r2",
      "type": "single",
      "stem": "升序链表L1为[1,3]、L2为[2,4]。不比较关键字，依次取L1结点1、3并头插到L2，结果为？",
      "options": {
        "A": "[3,1,2,4]",
        "B": "[1,2,3,4]",
        "C": "[4,3,2,1]",
        "D": "[1,3,2,4]"
      },
      "answer": "A",
      "explanation": "先插1得[1,2,4]，再插3得[3,1,2,4]；只反转搬入部分，不保证整个结果逆序或有序。"
    },
    {
      "id": "ds-merge-4",
      "type": "judge",
      "stem": "合并两个有序单链表可以做到原地合并，额外空间为 O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "直接改动指针，把结点重新串接，无需新建结点。"
    },
    {
      "id": "ds-merge-5-r2",
      "type": "single",
      "stem": "按每次接入较小首元的算法合并两单链表，要保证结果升序，输入应满足？",
      "options": {
        "A": "按同一比较规则各自升序",
        "B": "长度相等",
        "C": "都不带头结点",
        "D": "关键字都不同"
      },
      "answer": "A",
      "explanation": "只有两个输入链表都有序，双指针合并才能得到有序结果。"
    },
    {
      "id": "exam-data-structures-lab-linked-merge-2024-10-b-r2",
      "type": "single",
      "stem": "两个有序序列长度为 3 和 4，二路归并的关键字比较次数最多为？",
      "options": {
        "A": "3 次",
        "B": "4 次",
        "C": "7 次",
        "D": "6 次"
      },
      "answer": "D",
      "explanation": "最坏比较次数为 m+n−1=6；一个序列耗尽后剩余元素直接接入。"
    },
    {
      "id": "qa-20261002-data-structures-lab-linked-merge-01",
      "type": "single",
      "stem": "稳定归并两升序链L=[1L,3L,5L]、R=[1R,2R,5R]，平局先取L；输出所有结点前做多少次关键字比较？",
      "options": {
        "A": "3",
        "B": "5",
        "C": "4",
        "D": "6"
      },
      "answer": "B",
      "explanation": "依次比较1L/1R、3L/1R、3L/2R、3L/5R、5L/5R，共5；R余5R直接接尾。"
    }
  ],
  "data-structures:lab/josephus": [
    {
      "id": "ds-jose-1",
      "type": "single",
      "stem": "模拟约瑟夫环（报数出列）问题时，最直观的存储结构是？",
      "options": {
        "A": "循环链表（或循环数组）",
        "B": "二叉排序树",
        "C": "栈",
        "D": "邻接矩阵"
      },
      "answer": "A",
      "explanation": "约瑟夫环首尾相接、循环报数，用循环链表或循环数组模拟最自然。"
    },
    {
      "id": "ds-jose-2",
      "type": "judge",
      "stem": "约瑟夫环中每次报数到 m 的人出列，下一轮从出列者的下一个人重新报数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是约瑟夫环的标准规则，出列后从下一个人重新从 1 开始报数。"
    },
    {
      "id": "ds-jose-3-r2",
      "type": "judge",
      "stem": "用数组保留原有槽位、以alive标志表示是否出列时，模拟约瑟夫报数必须跳过alive=false的槽位。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "数组模拟时用标志位跳过已出列元素，否则计数会错乱。"
    },
    {
      "id": "ds-jose-4-r2",
      "type": "single",
      "stem": "n个人按编号1至n围成环，从1号开始报1，数到m者出列，下轮从其后继报1。给定正整数n,m，出列顺序是？",
      "options": {
        "A": "确定的唯一序列",
        "B": "随机序列",
        "C": "按编号升序",
        "D": "按编号降序"
      },
      "answer": "A",
      "explanation": "n、m 确定后出列顺序唯一确定，可递推或模拟求解。"
    },
    {
      "id": "ds-jose-5",
      "type": "judge",
      "stem": "用循环链表模拟约瑟夫环时，删除结点后要保证链表仍然首尾相连。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "循环链表删除结点后需维持环结构，才能继续循环报数。"
    },
    {
      "id": "exam-data-structures-lab-josephus-2013-1-a-r2",
      "type": "single",
      "stem": "约瑟夫问题的 0 起始编号递推式为？",
      "options": {
        "A": "J(n)=n−m",
        "B": "J(n)=J(n−1) mod m",
        "C": "J(1)=0，J(n)=(J(n−1)+m) mod n",
        "D": "J(n)=2J(n−1)+1"
      },
      "answer": "C",
      "explanation": "每轮删去一个人后，幸存者编号相对偏移 m 位，得到该递推。"
    },
    {
      "id": "qa-20261002-data-structures-lab-josephus-01",
      "type": "single",
      "stem": "5人编号1至5顺时针成环，从1报1、数到3出列，后继重新报1。最后留下的编号是？",
      "options": {
        "A": "2",
        "B": "5",
        "C": "4",
        "D": "1"
      },
      "answer": "C",
      "explanation": "出列3、1、5、2，最后4；可用0起递推J1=0,J2=1,J3=1,J4=0,J5=3得到1起4。"
    }
  ],
  "data-structures:lab/stack-demo": [
    {
      "id": "ds-stack-1",
      "type": "single",
      "stem": "若入栈序列为 1,2,3,4，则下列哪个不可能是合法的出栈序列？",
      "options": {
        "A": "1,2,3,4",
        "B": "4,3,2,1",
        "C": "3,2,4,1",
        "D": "3,1,2,4"
      },
      "answer": "D",
      "explanation": "若 3 先出栈，说明 1、2 仍在栈中且 2 在 1 之上，出栈顺序只能是 2 在 1 前，因此 3,1,2,4 不可能。",
      "hint": "出栈时，栈中元素的相对次序不能颠倒。"
    },
    {
      "id": "ds-stack-2",
      "type": "single",
      "stem": "栈的插入和删除操作都在哪里进行？",
      "options": {
        "A": "栈顶",
        "B": "栈底",
        "C": "任意位置",
        "D": "中间位置"
      },
      "answer": "A",
      "explanation": "栈只允许在栈顶插入（入栈）和删除（出栈）。"
    },
    {
      "id": "ds-stack-3",
      "type": "judge",
      "stem": "栈是一种后进先出（LIFO）的线性结构。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "最后入栈的元素最先出栈，即后进先出。"
    },
    {
      "id": "ds-stack-4-r2",
      "type": "single",
      "stem": "n个互异元素按固定顺序入初始空栈，期间可随时合法出栈，全部出栈的不同序列数为？",
      "options": {
        "A": "卡特兰数 C(2n,n)/(n+1)",
        "B": "n!",
        "C": "2ⁿ",
        "D": "n"
      },
      "answer": "A",
      "explanation": "合法出栈序列个数为第 n 个卡特兰数 C(2n,n)/(n+1)。"
    },
    {
      "id": "ds-stack-5",
      "type": "judge",
      "stem": "栈既可以用数组实现，也可以用链表实现。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "顺序栈用数组加栈顶指针，链栈用链表头部作栈顶。"
    },
    {
      "id": "exam-ds-stack-2024-2-r2",
      "type": "single",
      "stem": "将中缀表达式 x + y × (z − u) / v 转成后缀表达式，正确结果是哪一个？",
      "options": {
        "A": "x y z u − × v / +",
        "B": "x y z u − v / × +",
        "C": "x y + z u − × v /",
        "D": "x y z u × − v / +"
      },
      "answer": "A",
      "explanation": "括号内先计算 z−u，再依次执行乘法、除法，最后与 x 相加。"
    },
    {
      "id": "qa-20261002-data-structures-lab-stack-demo-01",
      "type": "single",
      "stem": "1、2、3、4依次入栈，允许交错出栈。要生成出栈序列2、1、4、3，栈最小所需容量为？",
      "options": {
        "A": "1",
        "B": "3",
        "C": "4",
        "D": "2"
      },
      "answer": "D",
      "explanation": "先压1、2再弹2、1，后压3、4再弹4、3；峰值2，弹2前必须同时容纳1和2。"
    }
  ],
  "data-structures:lab/circular-queue": [
    {
      "id": "ds-cq-1-r2",
      "type": "judge",
      "stem": "容量数组为m，front指队头元素、rear指下一入队槽，牺牲一槽。队满条件是(rear+1)%m==front。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "约定 front==rear 表示队空；当 rear 的下一个位置是 front 时表示队满，即 (rear+1)%m==front。"
    },
    {
      "id": "ds-cq-2-r2",
      "type": "single",
      "stem": "容量数组为m，front指队头元素、rear指下一入队槽，牺牲一槽。元素个数为？",
      "options": {
        "A": "(rear−front+m)%m",
        "B": "rear−front",
        "C": "front−rear",
        "D": "m−rear+front"
      },
      "answer": "A",
      "explanation": "元素个数 = (rear−front+m)%m，可正确处理绕回情况。"
    },
    {
      "id": "ds-cq-3",
      "type": "judge",
      "stem": "循环队列可以解决顺序队列的“假溢出”问题。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "循环队列让下标绕回利用前面空出的位置，避免假溢出。"
    },
    {
      "id": "ds-cq-4",
      "type": "single",
      "stem": "不牺牲存储单元的循环队列，常用什么区分队空与队满？",
      "options": {
        "A": "元素计数器或标志位",
        "B": "front 与 rear 的值",
        "C": "数组长度",
        "D": "哈希值"
      },
      "answer": "A",
      "explanation": "用 size 计数或标志位可区分 front==rear 是空还是满，不浪费单元。"
    },
    {
      "id": "ds-cq-5-r2",
      "type": "judge",
      "stem": "front指队头元素、rear指下一入队槽，牺牲一槽的循环队列队空条件是front==rear。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "约定 front==rear 表示队空，这是最常用的循环队列约定。"
    },
    {
      "id": "qa-20261002-data-structures-lab-circular-queue-01",
      "type": "single",
      "stem": "8槽循环队列保留一槽，front指首元、rear指下一空槽。初始front=6,rear=1，连续入队2次再出队1次，最后长度为？",
      "options": {
        "A": "4",
        "B": "3",
        "C": "5",
        "D": "6"
      },
      "answer": "A",
      "explanation": "初始长度(1−6+8)%8=3，后长3+2−1=4，最后front=7,rear=3。"
    }
  ],
  "data-structures:lab/shared-stack": [
    {
      "id": "ds-shared-1",
      "type": "judge",
      "stem": "两个栈共享一段数组空间时，只有两栈顶相邻（top0+1==top1）才表示栈满。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "共享栈从两端向中间增长，两栈顶相邻时才真正占满整个数组。"
    },
    {
      "id": "ds-shared-2",
      "type": "single",
      "stem": "两个栈共享一段数组空间的主要目的是？",
      "options": {
        "A": "提高空间利用率，让两栈空间互补",
        "B": "加快入栈速度",
        "C": "实现先进先出",
        "D": "便于排序"
      },
      "answer": "A",
      "explanation": "两栈从两端向中间增长，可动态互补，减少单个栈溢出而另一个栈空闲的浪费。"
    },
    {
      "id": "ds-shared-3",
      "type": "judge",
      "stem": "共享栈中栈 0 从低地址向高地址增长，栈 1 从高地址向低地址增长。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两栈相向增长，只有在中间相遇时才真正溢出。"
    },
    {
      "id": "ds-shared-4-r2",
      "type": "single",
      "stem": "0起数组共享栈中，栈0从低端向高端增长，top0指当前栈顶并以−1初始化。栈0的判空条件是？",
      "options": {
        "A": "top0 == −1",
        "B": "top0 == 0",
        "C": "top0 == MAXSIZE",
        "D": "top0 == top1"
      },
      "answer": "A",
      "explanation": "栈 0 从低端增长，top0==−1 表示空；栈 1 的判空条件是 top1==MAXSIZE。"
    },
    {
      "id": "ds-shared-5",
      "type": "judge",
      "stem": "共享栈适合两个栈的需求此消彼长的场景。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "当两栈一增一减时共享空间利用率最高，任一栈入栈都可能加剧整体紧张。"
    },
    {
      "id": "qa-20261002-data-structures-lab-shared-stack-01",
      "type": "single",
      "stem": "10槽共享栈top0=2、top1=7，两顶指已有元素且相向增长，当前还能成功入栈多少个元素（两栈任意分配）？",
      "options": {
        "A": "7",
        "B": "4",
        "C": "3",
        "D": "5"
      },
      "answer": "B",
      "explanation": "左占0..2三槽、右占7..9三槽，空3..6四槽；最后两顶相邻。"
    }
  ],
  "data-structures:lab/deque": [
    {
      "id": "ds-deque-1",
      "type": "judge",
      "stem": "双端队列允许在队头和队尾两端都进行插入和删除操作。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "双端队列（deque）两端都可入队、出队；若限定某一端只能出或只能入，则得到输入/输出受限的双端队列。"
    },
    {
      "id": "ds-deque-2",
      "type": "single",
      "stem": "输入受限的双端队列是指？",
      "options": {
        "A": "只允许在一端插入，两端都可删除",
        "B": "两端都可插入",
        "C": "只允许一端删除",
        "D": "两端都不可插入"
      },
      "answer": "A",
      "explanation": "输入受限指插入只允许在一端，删除可在两端；输出受限则相反。"
    },
    {
      "id": "ds-deque-4",
      "type": "single",
      "stem": "双端队列通常用哪种结构实现？",
      "options": {
        "A": "循环数组或双向链表",
        "B": "单链表",
        "C": "二叉堆",
        "D": "邻接矩阵"
      },
      "answer": "A",
      "explanation": "循环数组或双向链表都能在两端 O(1) 插入删除。"
    },
    {
      "id": "ds-deque-5-r2",
      "type": "judge",
      "stem": "用维护首尾指针的双向链表，或无需扩容的循环数组实现双端队列，两端插入删除均可为O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两端都有直接访问点，故两端操作均为 O(1)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-deque-01",
      "type": "single",
      "stem": "输入受限双端队列只允许右端插入，左右端均可删除，输入1、2、3、4依次到达。哪一输出序列不可能？",
      "options": {
        "A": "1,3,2,4",
        "B": "2,1,4,3",
        "C": "4,2,1,3",
        "D": "4,3,2,1"
      },
      "answer": "C",
      "explanation": "4先出要求四项均已右插，余队[1,2,3]，下一只能1或3，不能2；其余可通过端点删除构造。"
    }
  ],
  "data-structures:lab/preorder": [
    {
      "id": "ds-pre-1",
      "type": "single",
      "stem": "二叉树先序遍历的访问顺序是？",
      "options": {
        "A": "根—左—右",
        "B": "左—根—右",
        "C": "左—右—根",
        "D": "根—右—左"
      },
      "answer": "A",
      "explanation": "先序（前序）遍历先访问根，再递归遍历左子树、右子树。"
    },
    {
      "id": "ds-pre-3",
      "type": "single",
      "stem": "先序遍历的非递归实现中，为保证左孩子先于右孩子访问，入栈顺序应为？",
      "options": {
        "A": "先压右孩子，再压左孩子",
        "B": "先压左孩子，再压右孩子",
        "C": "只压左孩子",
        "D": "同时压入"
      },
      "answer": "A",
      "explanation": "栈后进先出，先压右再压左，出栈时左孩子先被访问。"
    },
    {
      "id": "ds-pre-4",
      "type": "single",
      "stem": "先序遍历序列常用于表示？",
      "options": {
        "A": "前缀表达式（波兰式）",
        "B": "中缀表达式",
        "C": "后缀表达式",
        "D": "逆波兰式"
      },
      "answer": "A",
      "explanation": "表达式树先序遍历得到前缀（波兰）表达式，后序遍历得到后缀（逆波兰）表达式。"
    },
    {
      "id": "ds-pre-5-r2",
      "type": "judge",
      "stem": "结点标识互异且给定序列确实来自同一二叉树时，先序序列和中序序列可以唯一确定该树。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "先序定根、中序分左右，二者结合可唯一确定二叉树。"
    },
    {
      "id": "exam-ds-tree-2024-3-r2",
      "type": "single",
      "stem": "结点 v 有左、右子树；在一棵二叉树的中序序列中，p 紧邻 v 的前面，q 紧邻 v 的后面。必然成立的是？",
      "options": {
        "A": "p 没有右孩子，q 没有左孩子",
        "B": "p 有右孩子，q 有左孩子",
        "C": "p 没有左孩子，q 没有右孩子",
        "D": "p 与 q 都是 v 的孩子"
      },
      "answer": "A",
      "explanation": "p 是左子树中序序列的最后一个结点，q 是右子树中序序列的第一个结点；两者分别不能再向对应方向延伸。"
    },
    {
      "id": "exam-ds-tree-2022-3-r2",
      "type": "single",
      "stem": "二叉树中序序列里 p、q 相邻且 p 在前。下列关系哪一种不可能成立？",
      "options": {
        "A": "q 是 p 的父结点",
        "B": "q 是 p 的右孩子",
        "C": "q 是 p 的右兄弟",
        "D": "q 是 p 的祖父结点"
      },
      "answer": "C",
      "explanation": "若 p、q 是右兄弟，中序遍历必须先访问 p、再访问它们的父结点、最后访问 q，因此二者不会相邻。"
    },
    {
      "id": "qa-20261002-data-structures-lab-preorder-01",
      "type": "single",
      "stem": "树根A，左孩子B、右孩子C，B只有右孩子D，C只有左孩子E，其先序序列是？",
      "options": {
        "A": "B D A E C",
        "B": "D B E C A",
        "C": "A B C D E",
        "D": "A B D C E"
      },
      "answer": "D",
      "explanation": "先根A，再完整左子树B D，最后完整右子树C E。"
    }
  ],
  "data-structures:lab/inorder": [
    {
      "id": "ds-inorder-1-r2",
      "type": "single",
      "stem": "结点标识互异，已知来自同一棵二叉树的前序与中序序列，能否唯一确定该树？",
      "options": {
        "A": "能",
        "B": "不能，还需后序",
        "C": "不能，还需层序",
        "D": "永远无法确定"
      },
      "answer": "A",
      "explanation": "前序确定根、中序划分左右子树，二者结合可唯一确定一棵二叉树；仅前序+后序不能。"
    },
    {
      "id": "ds-inorder-2-r2",
      "type": "judge",
      "stem": "所有非递归二叉树中序遍历算法都必须使用显式栈。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "常规算法使用显式栈，但Morris遍历通过暂时改写空右指针建立回溯线索，可不用显式栈并在结束后恢复树。"
    },
    {
      "id": "ds-inorder-3",
      "type": "single",
      "stem": "二叉树中序遍历的访问顺序是？",
      "options": {
        "A": "左—根—右",
        "B": "根—左—右",
        "C": "左—右—根",
        "D": "右—根—左"
      },
      "answer": "A",
      "explanation": "中序遍历先遍历左子树，再访问根，最后遍历右子树。"
    },
    {
      "id": "ds-inorder-4",
      "type": "single",
      "stem": "对二叉排序树进行中序遍历，得到的序列是？",
      "options": {
        "A": "递增有序序列",
        "B": "递减有序序列",
        "C": "任意序列",
        "D": "层序序列"
      },
      "answer": "A",
      "explanation": "二叉排序树左<根<右，中序遍历即得递增序列。"
    },
    {
      "id": "ds-inorder-5",
      "type": "judge",
      "stem": "中序线索二叉树便于直接查找结点的中序前驱与后继。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "线索把空指针改为前驱/后继指针，无需栈即可遍历。"
    },
    {
      "id": "qa-20261002-data-structures-lab-inorder-01",
      "type": "single",
      "stem": "互异结点树先序为A B D C E，中序为B D A E C，其后序是？",
      "options": {
        "A": "D B E C A",
        "B": "B D E C A",
        "C": "D E B C A",
        "D": "A B D E C"
      },
      "answer": "A",
      "explanation": "根A按中序分左BD、右EC；左根B右D，右根C左E；后序DBECA。"
    }
  ],
  "data-structures:lab/postorder": [
    {
      "id": "ds-post-1",
      "type": "single",
      "stem": "二叉树后序遍历的访问顺序是？",
      "options": {
        "A": "左—右—根",
        "B": "根—左—右",
        "C": "左—根—右",
        "D": "右—左—根"
      },
      "answer": "A",
      "explanation": "后序遍历先遍历左右子树，最后访问根。"
    },
    {
      "id": "ds-post-3",
      "type": "single",
      "stem": "表达式树的后序遍历得到的是？",
      "options": {
        "A": "后缀表达式（逆波兰式）",
        "B": "前缀表达式",
        "C": "中缀表达式",
        "D": "层序序列"
      },
      "answer": "A",
      "explanation": "后序遍历表达式树得到后缀（逆波兰）表达式，便于用栈求值。"
    },
    {
      "id": "ds-post-4",
      "type": "judge",
      "stem": "销毁一棵二叉树时适合用后序遍历（先释放左右子树再释放根）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "必须先释放孩子再释放父结点，避免访问已释放内存，符合后序顺序。"
    },
    {
      "id": "ds-post-5",
      "type": "single",
      "stem": "后序遍历的非递归实现相比先序、中序通常？",
      "options": {
        "A": "更复杂，需记录结点是否已访问过右子树",
        "B": "更简单",
        "C": "无法实现",
        "D": "不需要栈"
      },
      "answer": "A",
      "explanation": "后序需在左右子树都访问完才输出根，常用双栈或访问标记实现。"
    },
    {
      "id": "exam-data-structures-lab-postorder-2019-2-a-r2",
      "type": "single",
      "stem": "将森林转换为左孩子右兄弟二叉树后，原森林的后根遍历对应二叉树的？",
      "options": {
        "A": "先序遍历",
        "B": "后序遍历",
        "C": "层序遍历",
        "D": "中序遍历"
      },
      "answer": "D",
      "explanation": "森林后根遍历与对应二叉树的中序遍历序列一致。"
    },
    {
      "id": "qa-20261002-data-structures-lab-postorder-01",
      "type": "single",
      "stem": "表达式树根为−，左叶8，右子树根÷且叶依次为6、2；按后序用栈求值，结果是？",
      "options": {
        "A": "7",
        "B": "5",
        "C": "1",
        "D": "−1"
      },
      "answer": "B",
      "explanation": "后缀8 6 2 ÷ −，6÷2=3，再8−3=5；弹栈顺序不可交换操作数。"
    }
  ],
  "data-structures:lab/level-order": [
    {
      "id": "ds-level-1",
      "type": "single",
      "stem": "实现二叉树的层序遍历需要借助哪种数据结构？",
      "options": {
        "A": "队列",
        "B": "栈",
        "C": "优先队列",
        "D": "哈希表"
      },
      "answer": "A",
      "explanation": "层序遍历按层访问，用队列先进先出地保存待访问的左右孩子。"
    },
    {
      "id": "ds-level-3",
      "type": "judge",
      "stem": "层序遍历借助队列，结点出队时把其左右孩子依次入队。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "队列先进先出保证按层访问，出队时把孩子入队以延续层序。"
    },
    {
      "id": "ds-level-4",
      "type": "single",
      "stem": "层序遍历常用于求二叉树的？",
      "options": {
        "A": "高度与最大宽度",
        "B": "中序前驱",
        "C": "排序结果",
        "D": "哈希值"
      },
      "answer": "A",
      "explanation": "按层处理可统计层数与每层结点数，从而求高度与宽度。"
    },
    {
      "id": "ds-level-5",
      "type": "judge",
      "stem": "对于只有左孩子（或只有右孩子）的单支树，层序序列与先序序列相同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "单支树每层只有一个结点，层序与先序都是根到叶的路径。"
    },
    {
      "id": "qa-20261002-data-structures-lab-level-order-01",
      "type": "single",
      "stem": "根A的左右孩子为B、C；B左右孩子D、E；C只有右孩子F。按出队后入左右孩子的层序算法，弹出B并入其孩子后队列为？",
      "options": {
        "A": "[C,F,D,E]",
        "B": "[D,E]",
        "C": "[C,D,E]",
        "D": "[D,E,C]"
      },
      "answer": "C",
      "explanation": "弹A入B,C；弹B时C仍在队首，随后入D,E。F在弹C后才入队。"
    }
  ],
  "data-structures:lab/huffman": [
    {
      "id": "ds-huff-1",
      "type": "single",
      "stem": "含有 n 个叶结点的哈夫曼树共有多少个结点？",
      "options": {
        "A": "2n−1",
        "B": "2n",
        "C": "n−1",
        "D": "n+1"
      },
      "answer": "A",
      "explanation": "哈夫曼树是严格二叉树（无单分支结点），叶结点 n 个、内部结点 n−1 个，共 2n−1 个。"
    },
    {
      "id": "ds-huff-2",
      "type": "single",
      "stem": "哈夫曼编码属于哪一类编码？",
      "options": {
        "A": "前缀编码且平均码长最短",
        "B": "定长编码",
        "C": "有歧义编码",
        "D": "后缀编码"
      },
      "answer": "A",
      "explanation": "哈夫曼编码是前缀编码，任一编码都不是另一编码的前缀，且在给定权值下平均码长最短。"
    },
    {
      "id": "ds-huff-4",
      "type": "judge",
      "stem": "给定权值集合，哈夫曼树（或哈夫曼编码）可能不唯一，但带权路径长度相同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "存在权值相同的结点时可有多种形态，但 WPL 都达到最小且相等。"
    },
    {
      "id": "ds-huff-5",
      "type": "single",
      "stem": "构造哈夫曼树时，每一步都？",
      "options": {
        "A": "选取权值最小的两棵树合并",
        "B": "选取权值最大的两棵树合并",
        "C": "按输入顺序合并",
        "D": "随机合并"
      },
      "answer": "A",
      "explanation": "贪心策略：每次合并权值最小的两棵树，新树权值为二者之和。"
    },
    {
      "id": "qa-20261002-data-structures-lab-huffman-01",
      "type": "single",
      "stem": "叶权1、2、3、7构建二进制哈夫曼树，其最小WPL为？",
      "options": {
        "A": "19",
        "B": "26",
        "C": "13",
        "D": "22"
      },
      "answer": "D",
      "explanation": "先1+2=3，再3+3=6，最后6+7=13；WPL等于合并权和3+6+13=22。"
    }
  ],
  "data-structures:lab/union-find": [
    {
      "id": "ds-uf-1",
      "type": "single",
      "stem": "并查集在同时使用按秩合并与路径压缩后，单次操作的均摊时间复杂度近似为？",
      "options": {
        "A": "O(α(n))，近似 O(1)",
        "B": "O(log n)",
        "C": "O(n)",
        "D": "O(n log n)"
      },
      "answer": "A",
      "explanation": "路径压缩加按秩合并后，均摊时间由反阿克曼函数 α(n) 界定，实际近似常数。"
    },
    {
      "id": "ds-uf-3",
      "type": "judge",
      "stem": "并查集的 find 操作沿父指针上溯到根，union 操作把一棵树的根接到另一棵树的根上。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "find 找根确定所属集合，union 合并两棵树的根。"
    },
    {
      "id": "ds-uf-4",
      "type": "single",
      "stem": "按秩（或按大小）合并的作用是？",
      "options": {
        "A": "避免合并后树过高，保持操作高效",
        "B": "加快排序",
        "C": "减少内存",
        "D": "实现先进先出"
      },
      "answer": "A",
      "explanation": "把矮树接到高树上，控制树高，配合路径压缩使操作近似 O(1)。"
    },
    {
      "id": "ds-uf-5",
      "type": "judge",
      "stem": "并查集可以用来判断无向图的连通性以及加入一条边是否成环。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "若一条边两端点已在同一集合，则加入它会成环；这也是 Kruskal 判环的依据。"
    },
    {
      "id": "qa-20261002-data-structures-lab-union-find-01",
      "type": "single",
      "stem": "parent=[0,0,1,2,4]采用根自指，对元素3执行完整路径压缩Find后，parent[1]、parent[2]、parent[3]为？",
      "options": {
        "A": "0,0,0",
        "B": "0,1,2",
        "C": "0,0,2",
        "D": "1,2,3"
      },
      "answer": "A",
      "explanation": "3→2→1→0根；压缩使路径上1、2、3均直连0，元素4不变。"
    }
  ],
  "data-structures:lab/threaded-tree": [
    {
      "id": "ds-thread-1",
      "type": "single",
      "stem": "在中序线索二叉树中，若某结点没有右孩子，则它的右线索指向？",
      "options": {
        "A": "中序后继",
        "B": "中序前驱",
        "C": "右子树的根",
        "D": "根结点"
      },
      "answer": "A",
      "explanation": "中序线索中，空右指针指向该结点的中序后继，空左指针指向中序前驱。"
    },
    {
      "id": "ds-thread-2",
      "type": "single",
      "stem": "对二叉树进行线索化的主要目的是？",
      "options": {
        "A": "利用空指针域加速遍历，无需栈",
        "B": "减少结点数量",
        "C": "实现排序",
        "D": "压缩存储数据"
      },
      "answer": "A",
      "explanation": "线索化把空指针改为前驱/后继线索，使遍历不需要栈或递归。"
    },
    {
      "id": "ds-thread-3-r2",
      "type": "judge",
      "stem": "采用左右孩子指针表示的非空二叉树含n个结点，共有n+1个空孩子指针域。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "n 个结点共 2n 个指针域，除根外每个结点被一条指针指向，故空指针为 2n−(n−1)=n+1。"
    },
    {
      "id": "ds-thread-4",
      "type": "single",
      "stem": "中序线索二叉树中查找某结点后继的规则是？",
      "options": {
        "A": "有右孩子则为右子树最左结点，否则为右线索",
        "B": "直接取左孩子",
        "C": "取根结点",
        "D": "无法查找"
      },
      "answer": "A",
      "explanation": "右孩子存在时后继是右子树最左下结点；否则右线索直接指向中序后继。"
    },
    {
      "id": "ds-thread-5-r2",
      "type": "judge",
      "stem": "在中序线索二叉树上遍历不需要借助栈。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "中序线索支持不用栈遍历；有右子树时找下一后继可能沿左链耗时O(h)，但整棵树的全部遍历为O(n)，辅助空间O(1)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-threaded-tree-01",
      "type": "single",
      "stem": "中序线索树结点x有真实右孩子r，r无左孩子，r的左域是一条线索；x的中序后继为？",
      "options": {
        "A": "整树根",
        "B": "r",
        "C": "r的左线索目标",
        "D": "x的父结点"
      },
      "answer": "B",
      "explanation": "右子树存在时取右子树最左真实孩子结点；r已无真实左孩子即为后继，不能沿左线索循环走。"
    }
  ],
  "data-structures:lab/bfs": [
    {
      "id": "ds-bfs-1",
      "type": "single",
      "stem": "用邻接表存储图时，广度优先搜索的时间复杂度是？",
      "options": {
        "A": "O(V+E)",
        "B": "O(V²)",
        "C": "O(V·E)",
        "D": "O(E²)"
      },
      "answer": "A",
      "explanation": "BFS 每个顶点入队一次、每条边被检查一次，邻接表下为 O(V+E)。"
    },
    {
      "id": "ds-bfs-2",
      "type": "judge",
      "stem": "在无权图中，BFS 首次访问到某顶点时经过的边数就是该顶点到源点的最短路径长度。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "BFS 按层扩展，首次到达即层数最小，因此是无权图单源最短路。"
    },
    {
      "id": "ds-bfs-4",
      "type": "single",
      "stem": "BFS 生成树中，源点到某顶点的路径长度代表？",
      "options": {
        "A": "最短边数（无权图）",
        "B": "最长路径",
        "C": "顶点度",
        "D": "任意路径"
      },
      "answer": "A",
      "explanation": "无权图中 BFS 首次到达即最短，生成树路径即最短边数。"
    },
    {
      "id": "ds-bfs-5-r2",
      "type": "judge",
      "stem": "对非空连通无向图从任一顶点做一次完整BFS，可得到包含全部顶点的广度优先生成树。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "连通图一次 BFS 访问所有顶点，其访问边构成生成树。"
    },
    {
      "id": "exam-ds-graph-2023-41-r2",
      "type": "single",
      "stem": "有向简单图按Edge[i][j]=1表示弧v_i→v_j存在、否则0存邻接矩阵。称出度大于入度者为K顶点，应比较？",
      "options": {
        "A": "第 i 行和大于第 i 列和",
        "B": "第 i 列和大于第 i 行和",
        "C": "第 i 行非零项数为 1",
        "D": "第 i 列非零项数为 0"
      },
      "answer": "A",
      "explanation": "邻接矩阵第 i 行统计从 vᵢ 发出的边，第 i 列统计进入 vᵢ 的边。"
    },
    {
      "id": "exam-ds-graph-2022-6-r2",
      "type": "single",
      "stem": "无向简单图的邻接矩阵为 A。矩阵平方 A² 的对角元素 A²[i][i] 表示什么？",
      "options": {
        "A": "顶点 vᵢ 的度",
        "B": "图中边总数",
        "C": "顶点 vᵢ 的连通分量编号",
        "D": "顶点 vᵢ 的最短路径长度"
      },
      "answer": "A",
      "explanation": "A²[i][i] 计数从 vᵢ 出发、经过一条边再回到 vᵢ 的长度为 2 的通路；每条邻边贡献一次，因此等于度。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bfs-01",
      "type": "single",
      "stem": "无权无向图边为s-a,s-b,a-c,b-d,c-d。从s进行BFS，顶点d的距离（边数）为？",
      "options": {
        "A": "4",
        "B": "1",
        "C": "2",
        "D": "3"
      },
      "answer": "C",
      "explanation": "存在s-b-d两边路径；d不直接邻s，所以至少2。发现顺序影响父结点不改变最短层数。"
    }
  ],
  "data-structures:lab/dfs": [
    {
      "id": "ds-dfs-1",
      "type": "single",
      "stem": "用邻接矩阵存储图时，深度优先搜索的时间复杂度是？",
      "options": {
        "A": "O(V²)",
        "B": "O(V+E)",
        "C": "O(E)",
        "D": "O(V log V)"
      },
      "answer": "A",
      "explanation": "邻接矩阵下每个顶点都要扫描一整行判断邻接关系，共 O(V²)。"
    },
    {
      "id": "ds-dfs-2",
      "type": "single",
      "stem": "深度优先搜索的实现通常借助？",
      "options": {
        "A": "递归或栈",
        "B": "队列",
        "C": "优先队列",
        "D": "哈希表"
      },
      "answer": "A",
      "explanation": "DFS 沿一条路径深入到底再回溯，可用递归或显式栈。"
    },
    {
      "id": "ds-dfs-3-r2",
      "type": "judge",
      "stem": "DFS可用于检测简单无向图的环，并通过从每个尚未访问顶点启动DFS求连通分量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "简单无向图DFS遇已访问且不是当前父结点的邻点表示有环；每次新启动的DFS访问一个连通分量。有向图判环须区分仍在递归栈中的顶点，强连通分量需另行算法。"
    },
    {
      "id": "ds-dfs-5",
      "type": "judge",
      "stem": "用邻接矩阵存储图时，DFS 与 BFS 的时间复杂度相同（都是 O(V²)）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "邻接矩阵下两者都要扫描整行，复杂度均为 O(V²)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-dfs-01",
      "type": "single",
      "stem": "无向图邻居按字母升序；边A-B,A-C,B-D,C-D。从A递归DFS的首次访问序列是？",
      "options": {
        "A": "A B C D",
        "B": "A C B D",
        "C": "B D C A",
        "D": "A B D C"
      },
      "answer": "D",
      "explanation": "A先B，B到D，D未访问邻C，故ABDC；C回溯时A、D均已访问。"
    }
  ],
  "data-structures:lab/prim": [
    {
      "id": "ds-prim-1-r2",
      "type": "single",
      "stem": "使用邻接矩阵及逐轮扫描顶点的朴素Prim算法，时间复杂度及通常适合的图密度为？",
      "options": {
        "A": "O(V²)，稠密图",
        "B": "O(ElogE)，稀疏图",
        "C": "O(V³)，稠密图",
        "D": "O(V+E)，任意图"
      },
      "answer": "A",
      "explanation": "Prim 以顶点为中心，邻接矩阵实现为 O(V²)，适合稠密图；稀疏图更适合 Kruskal。"
    },
    {
      "id": "ds-prim-2",
      "type": "single",
      "stem": "Prim 算法每步选择的是？",
      "options": {
        "A": "连接已选顶点集合与未选集合的最小权边",
        "B": "全局最小权边",
        "C": "任意一条边",
        "D": "入度最小的边"
      },
      "answer": "A",
      "explanation": "Prim 从已选集合向外扩展，每次选横切边中权值最小者，基于割性质。"
    },
    {
      "id": "ds-prim-3",
      "type": "judge",
      "stem": "Prim 算法适用于带权的连通无向图。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "最小生成树针对连通带权无向图，Prim 从一个顶点逐步扩展。"
    },
    {
      "id": "ds-prim-4",
      "type": "single",
      "stem": "Prim 算法贪心策略的正确性主要依据？",
      "options": {
        "A": "最小生成树的割性质",
        "B": "动态规划",
        "C": "分治",
        "D": "回溯"
      },
      "answer": "A",
      "explanation": "对任一割，横切边中权最小者必属于某棵最小生成树。"
    },
    {
      "id": "ds-prim-5",
      "type": "judge",
      "stem": "若图中各边权值互不相同，则最小生成树唯一。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "边权互异时最小生成树唯一；有相等权值时才可能不唯一。"
    },
    {
      "id": "qa-20261002-data-structures-lab-prim-01",
      "type": "single",
      "stem": "无向加权图边AB=2,AC=5,BC=1,BD=4,CD=3，从A运行Prim，所选三条边的权依次是？",
      "options": {
        "A": "2,1,3",
        "B": "1,2,3",
        "C": "2,4,1",
        "D": "5,1,3"
      },
      "answer": "A",
      "explanation": "先割{A}取AB2，再割{A,B}取BC1，再连接D取CD3；总6。"
    }
  ],
  "data-structures:lab/kruskal": [
    {
      "id": "ds-kruskal-1",
      "type": "single",
      "stem": "Kruskal 算法求最小生成树更适合哪类图？",
      "options": {
        "A": "稀疏图，复杂度 O(E log E)",
        "B": "稠密图，复杂度 O(V²)",
        "C": "有向无环图",
        "D": "含负权环的图"
      },
      "answer": "A",
      "explanation": "Kruskal 按边权排序后用并查集判环，复杂度 O(E log E)，适合边较少的稀疏图。"
    },
    {
      "id": "ds-kruskal-2",
      "type": "single",
      "stem": "Kruskal 算法按什么顺序选边，并如何判环？",
      "options": {
        "A": "按边权从小到大选，用并查集判环",
        "B": "按顶点编号选，用栈判环",
        "C": "按边权从大到小选",
        "D": "随机选边"
      },
      "answer": "A",
      "explanation": "先对边排序，依次选取不成环（两端点不在同一集合）的最小边。"
    },
    {
      "id": "ds-kruskal-4",
      "type": "single",
      "stem": "含 V 个顶点的连通图，其最小生成树包含多少条边？",
      "options": {
        "A": "V−1",
        "B": "V",
        "C": "E",
        "D": "2V"
      },
      "answer": "A",
      "explanation": "生成树是含全部顶点、V−1 条边的无环连通子图。"
    },
    {
      "id": "ds-kruskal-5",
      "type": "judge",
      "stem": "若图不连通，Kruskal 得到的是最小生成森林。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "不连通图无法生成单棵生成树，各连通分量分别得到最小生成树，合为森林。"
    },
    {
      "id": "qa-20261002-data-structures-lab-kruskal-01",
      "type": "single",
      "stem": "无向图三角形AB=1,BC=2,AC=3，再有CD=4,BD=5。Kruskal排序扫描，第一条被跳过的边是？",
      "options": {
        "A": "BD",
        "B": "AC",
        "C": "BC",
        "D": "CD"
      },
      "answer": "B",
      "explanation": "先选AB、BC，A/C已同集合，AC会成三角环；其后CD接新顶点D。"
    }
  ],
  "data-structures:lab/dijkstra": [
    {
      "id": "ds-dij-1",
      "type": "judge",
      "stem": "Dijkstra 算法可以正确处理带负权边的图。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "Dijkstra 基于贪心，假定已确定的最短距离不再变小；负权边会破坏该前提，应改用 Bellman–Ford。"
    },
    {
      "id": "ds-dij-2",
      "type": "single",
      "stem": "Dijkstra 算法每一轮选择哪个顶点加入已确定集合？",
      "options": {
        "A": "未确定顶点中当前距离最小者",
        "B": "任意未确定顶点",
        "C": "入度最小的顶点",
        "D": "编号最小的顶点"
      },
      "answer": "A",
      "explanation": "每轮从未确定集合中取出距离最小的顶点，将其距离“确定”，再松弛其邻边。"
    },
    {
      "id": "ds-dij-3",
      "type": "single",
      "stem": "用邻接矩阵实现 Dijkstra 算法的时间复杂度是？",
      "options": {
        "A": "O(V²)",
        "B": "O(V+E)",
        "C": "O(E log V)",
        "D": "O(V³)"
      },
      "answer": "A",
      "explanation": "每轮扫描未确定顶点找最小距离，共 V 轮，邻接矩阵下为 O(V²)。"
    },
    {
      "id": "ds-dij-4",
      "type": "judge",
      "stem": "Dijkstra 算法求的是从单个源点到其余各顶点的最短路径。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "Dijkstra 是单源最短路径算法，逐轮确定各顶点的最短距离。"
    },
    {
      "id": "ds-dij-5-r2",
      "type": "single",
      "stem": "采用邻接表及支持decrease-key的二叉堆实现Dijkstra，V个顶点、E条边的常见时间上界为？",
      "options": {
        "A": "O((V+E)logV)",
        "B": "O(V²E)",
        "C": "O(VE)",
        "D": "O(V³)"
      },
      "answer": "A",
      "explanation": "最多V次取堆顶及E次松弛/更新，每次堆操作O(logV)，故O((V+E)logV)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-dijkstra-01",
      "type": "single",
      "stem": "有向非负图s→a=4,s→b=1,b→a=2,a→t=1,b→t=7，Dijkstra求得s至t最短距离是？",
      "options": {
        "A": "8",
        "B": "3",
        "C": "4",
        "D": "5"
      },
      "answer": "C",
      "explanation": "s-b-a-t=1+2+1=4，先确定b后将a改为3，再由a将t改为4。"
    }
  ],
  "data-structures:lab/floyd": [
    {
      "id": "ds-floyd-1",
      "type": "single",
      "stem": "Floyd 算法的时间复杂度及其适用场景是？",
      "options": {
        "A": "O(V³)，求任意两点间最短路径",
        "B": "O(V²)，求单源最短路",
        "C": "O(E log V)，求单源最短路",
        "D": "O(V·E)，求最小生成树"
      },
      "answer": "A",
      "explanation": "Floyd 用三重循环动态规划，复杂度 O(V³)，一次求出所有顶点对之间的最短路径。"
    },
    {
      "id": "ds-floyd-2",
      "type": "single",
      "stem": "Floyd 算法三重循环中最外层循环控制的是？",
      "options": {
        "A": "中转点 k",
        "B": "起点 i",
        "C": "终点 j",
        "D": "边数"
      },
      "answer": "A",
      "explanation": "以 k 为中转点，逐轮更新 d[i][j]=min(d[i][j], d[i][k]+d[k][j])。"
    },
    {
      "id": "ds-floyd-3",
      "type": "judge",
      "stem": "Floyd 算法可以处理负权边，但不能处理含负权回路的图。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "负权边不影响递推，但负权回路会使最短路径无下界。"
    },
    {
      "id": "ds-floyd-4",
      "type": "single",
      "stem": "Floyd 算法的状态转移方程是？",
      "options": {
        "A": "d[i][j] = min(d[i][j], d[i][k]+d[k][j])",
        "B": "d[i][j] = d[i][k]×d[k][j]",
        "C": "d[i][j] = d[i][j]+1",
        "D": "d[i][j] = max(d[i][k], d[k][j])"
      },
      "answer": "A",
      "explanation": "考虑经 k 中转是否更短，取二者较小值。"
    },
    {
      "id": "qa-20261002-data-structures-lab-floyd-01",
      "type": "single",
      "stem": "Floyd某轮允许k中转前，d[i][j]=9,d[i][k]=4,d[k][j]=−2（无负环）。更新后d[i][j]为？",
      "options": {
        "A": "9",
        "B": "6",
        "C": "−2",
        "D": "2"
      },
      "answer": "D",
      "explanation": "经过k路径长4−2=2，取min(9,2)=2；负边本身允许。"
    }
  ],
  "data-structures:lab/topological": [
    {
      "id": "ds-topo-1",
      "type": "single",
      "stem": "一个有向图能够进行拓扑排序的充要条件是？",
      "options": {
        "A": "图中不存在回路（是 DAG）",
        "B": "图是连通的",
        "C": "每个顶点入度都大于 0",
        "D": "图是强连通的"
      },
      "answer": "A",
      "explanation": "拓扑排序要求顶点间先后关系不出现环，即有向无环图。"
    },
    {
      "id": "ds-topo-2",
      "type": "judge",
      "stem": "只要是有向无环图，它的拓扑排序序列就一定唯一。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "当某一步存在多个入度为 0 的顶点时，可任选其一，得到不同的拓扑序列；序列唯一要求每一步恰有一个入度为 0 的顶点。"
    },
    {
      "id": "ds-topo-3",
      "type": "single",
      "stem": "用入度法进行拓扑排序的基本步骤是？",
      "options": {
        "A": "反复找出入度为 0 的顶点输出并删除其出边",
        "B": "反复找出出度为 0 的顶点",
        "C": "按编号从小到大输出",
        "D": "用深度优先求最短路"
      },
      "answer": "A",
      "explanation": "不断取出入度为 0 的顶点，输出后将其邻点入度减 1，重复至结束。"
    },
    {
      "id": "ds-topo-4",
      "type": "judge",
      "stem": "若拓扑排序未能输出全部顶点，则说明有向图中存在环。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "有环时环上顶点入度始终大于 0，无法全部输出，可据此判环。"
    },
    {
      "id": "ds-topo-5",
      "type": "single",
      "stem": "用邻接表实现入度法拓扑排序的时间复杂度是？",
      "options": {
        "A": "O(V+E)",
        "B": "O(V²)",
        "C": "O(E log V)",
        "D": "O(V·E)"
      },
      "answer": "A",
      "explanation": "每个顶点入队一次、每条边被处理一次，故 O(V+E)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-topological-01",
      "type": "single",
      "stem": "DAG边A→C,B→C,C→D,B→D，合法拓扑序列总数为？",
      "options": {
        "A": "2",
        "B": "1",
        "C": "4",
        "D": "6"
      },
      "answer": "A",
      "explanation": "C在A、B之后且D在C之后，只有ABCD和BACD；B→D未增加自由度。"
    }
  ],
  "data-structures:lab/critical-path": [
    {
      "id": "ds-cp-1",
      "type": "single",
      "stem": "AOE 网中的关键路径是指？",
      "options": {
        "A": "从源点到汇点路径长度最长的路径",
        "B": "边数最少的路径",
        "C": "边权之和最小的路径",
        "D": "经过顶点最多的路径"
      },
      "answer": "A",
      "explanation": "关键路径决定整个工程的最短完成时间，是源点到汇点路径长度（活动时间之和）最大的路径。"
    },
    {
      "id": "ds-cp-3",
      "type": "judge",
      "stem": "关键活动的松弛时间（时间余量）为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "关键活动必须按时开始和完成，其最早开始时间等于最迟开始时间，余量为 0。"
    },
    {
      "id": "ds-cp-4",
      "type": "single",
      "stem": "求关键路径通常需要计算事件的哪两个量？",
      "options": {
        "A": "最早发生时间 ve 与最迟发生时间 vl",
        "B": "入度与出度",
        "C": "权值与边数",
        "D": "颜色与标号"
      },
      "answer": "A",
      "explanation": "先正推求 ve，再逆推求 vl，据此求活动的余量确定关键活动。"
    },
    {
      "id": "ds-cp-5-r2",
      "type": "judge",
      "stem": "缩短某个关键活动的持续时间一定能缩短整个工期。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "若两条关键路径均长10且仅缩短其中一条独有的活动，另一条仍长10，工期不变；应检查所有当前关键路径是否都缩短以及新的瓶颈。"
    },
    {
      "id": "qa-20261002-data-structures-lab-critical-path-01",
      "type": "single",
      "stem": "AOE边S→A=3,S→B=2,A→T=4,B→T=4；总工期和活动S→B的时间余量分别为？",
      "options": {
        "A": "9与2",
        "B": "7与1",
        "C": "6与0",
        "D": "7与0"
      },
      "answer": "B",
      "explanation": "两路径长7、6，工期7；veS=0,vlB=7−4=3，活动SB最迟开始=3−2=1，最早0，余量1。"
    }
  ],
  "data-structures:lab/bellman-ford": [
    {
      "id": "ds-bf-1",
      "type": "single",
      "stem": "Bellman–Ford 算法可以处理哪种 Dijkstra 无法处理的情况？",
      "options": {
        "A": "带负权边的图",
        "B": "稠密图",
        "C": "带权无向图",
        "D": "稀疏图"
      },
      "answer": "A",
      "explanation": "Bellman–Ford 通过多轮松弛可处理负权边，并检测负权回路。"
    },
    {
      "id": "ds-bf-2-r2",
      "type": "judge",
      "stem": "以指定源初始化距离、仅对有限距离顶点做松弛的Bellman–Ford，可检测源点可达的负权回路。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "V−1轮后再一轮仍可松弛表示源可达负环；不可达负环的距离一直为∞，不会触发更新。检测全图可添加超级源。"
    },
    {
      "id": "ds-bf-3-r2",
      "type": "single",
      "stem": "V个顶点的图无源点可达负环时，普通Bellman–Ford求单源最短路至多需要多少轮全边松弛（不计额外负环检测轮）？",
      "options": {
        "A": "V−1 轮",
        "B": "V 轮",
        "C": "E 轮",
        "D": "1 轮"
      },
      "answer": "A",
      "explanation": "最短路径最多含 V−1 条边，故松弛 V−1 轮即可收敛。"
    },
    {
      "id": "ds-bf-4",
      "type": "single",
      "stem": "Bellman–Ford 算法的时间复杂度是？",
      "options": {
        "A": "O(V·E)",
        "B": "O(V²)",
        "C": "O(E log V)",
        "D": "O(V³)"
      },
      "answer": "A",
      "explanation": "共 V−1 轮，每轮检查 E 条边，总计 O(V·E)。"
    },
    {
      "id": "ds-bf-5",
      "type": "judge",
      "stem": "若第 V 轮松弛仍能使某顶点距离变小，则图中存在负权回路。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正常情况下 V−1 轮后应收敛；第 V 轮仍更新说明存在可无限缩短的负权回路。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bellman-ford-01",
      "type": "single",
      "stem": "有向图源s，s→a=1,a→b=−2,b→a=1，另孤立顶点c。Bellman–Ford的额外检测轮会报告什么？",
      "options": {
        "A": "仅c不可达故不能运行",
        "B": "负边一定等价负环",
        "C": "存在源可达负环",
        "D": "无负环且b距离−1"
      },
      "answer": "C",
      "explanation": "a-b-a总权−1且从s可达，可重复循环使距离无下界。c不影响检测。"
    }
  ],
  "data-structures:lab/graph-representations": [
    {
      "id": "ds-grep-1",
      "type": "single",
      "stem": "邻接矩阵存储图的空间复杂度是？",
      "options": {
        "A": "O(V²)",
        "B": "O(V+E)",
        "C": "O(E)",
        "D": "O(V log V)"
      },
      "answer": "A",
      "explanation": "邻接矩阵用 V×V 的二维数组，空间 O(V²)，适合稠密图。"
    },
    {
      "id": "ds-grep-2",
      "type": "single",
      "stem": "邻接表存储图的空间复杂度是？",
      "options": {
        "A": "O(V+E)",
        "B": "O(V²)",
        "C": "O(E²)",
        "D": "O(V log V)"
      },
      "answer": "A",
      "explanation": "邻接表为每个顶点存一条边链表，共 O(V+E)，适合稀疏图。"
    },
    {
      "id": "ds-grep-3",
      "type": "judge",
      "stem": "无向图的邻接矩阵一定是对称矩阵。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "无向边 (i,j) 与 (j,i) 相同，故矩阵关于主对角线对称。"
    },
    {
      "id": "ds-grep-4",
      "type": "single",
      "stem": "有向图邻接表中，顶点 i 对应链表的长度等于？",
      "options": {
        "A": "顶点 i 的出度",
        "B": "顶点 i 的入度",
        "C": "顶点总数",
        "D": "边总数"
      },
      "answer": "A",
      "explanation": "邻接表第 i 行存 i 指向的邻点，长度即出度；入度需用逆邻接表。"
    },
    {
      "id": "ds-grep-5-r2",
      "type": "judge",
      "stem": "简单图按A[i][j]表示边i→j存在的0/1邻接矩阵存储，无向图的度可扫一行；有向图的出度扫一行、入度扫一列。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "行固定起点i，1的个数是出度；列固定终点i，1的个数是入度。无向矩阵对称，所以一行可得度。"
    },
    {
      "id": "qa-20261002-data-structures-lab-graph-representations-01",
      "type": "single",
      "stem": "简单有向图弧A→B,A→C,C→A。按行起点列终点的0/1邻接矩阵，A出度、入度分别为？",
      "options": {
        "A": "1与2",
        "B": "3与0",
        "C": "2与2",
        "D": "2与1"
      },
      "answer": "D",
      "explanation": "A行向B、C两项1，A列仅C→A一项1。"
    }
  ],
  "data-structures:lab/graph-cross": [
    {
      "id": "ds-gcross-1",
      "type": "single",
      "stem": "十字链表主要用于存储哪种图？",
      "options": {
        "A": "有向图",
        "B": "无向图",
        "C": "带权无向图",
        "D": "完全图"
      },
      "answer": "A",
      "explanation": "十字链表把弧结点同时挂在弧头与弧尾链上，便于有向图求入度和出度。"
    },
    {
      "id": "ds-gcross-3",
      "type": "single",
      "stem": "邻接多重表主要用于存储哪种图？",
      "options": {
        "A": "无向图",
        "B": "有向图",
        "C": "有向无环图",
        "D": "二部图"
      },
      "answer": "A",
      "explanation": "邻接多重表用一条边结点表示无向边，避免邻接表中同一条边存两次。"
    },
    {
      "id": "ds-gcross-4",
      "type": "judge",
      "stem": "十字链表中每个弧结点同时链接在弧头相同的链和弧尾相同的链上。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "弧结点有 hlink（弧头链）和 tlink（弧尾链）两个指针，故称十字链表。"
    },
    {
      "id": "ds-gcross-5",
      "type": "single",
      "stem": "邻接多重表中，无向图的每条边用几个结点表示？",
      "options": {
        "A": "1 个",
        "B": "2 个",
        "C": "V 个",
        "D": "E 个"
      },
      "answer": "A",
      "explanation": "每条边只用一个边结点，两端顶点共享，节省空间。"
    },
    {
      "id": "qa-20261002-data-structures-lab-graph-cross-01",
      "type": "single",
      "stem": "简单有向图5顶点7条弧采用十字链表，忽略顶点数组，仅需多少个弧结点？",
      "options": {
        "A": "7",
        "B": "14",
        "C": "5",
        "D": "12"
      },
      "answer": "A",
      "explanation": "每条弧只分配一个弧结点，同时连接入弧链、出弧链；不是两份邻接项。"
    }
  ],
  "data-structures:lab/binary-search": [
    {
      "id": "ds-bs-1",
      "type": "single",
      "stem": "折半查找适用的存储结构是？",
      "options": {
        "A": "有序顺序表",
        "B": "无序链表",
        "C": "有序链表",
        "D": "任意二叉树"
      },
      "answer": "A",
      "explanation": "折半查找需要随机访问中间元素，因此要求有序的顺序存储结构。"
    },
    {
      "id": "ds-bs-2",
      "type": "single",
      "stem": "对长度为 n 的有序表做折半查找，成功时的最大比较次数约为？",
      "options": {
        "A": "⌈log₂(n+1)⌉",
        "B": "n/2",
        "C": "n",
        "D": "√n"
      },
      "answer": "A",
      "explanation": "折半查找的判定树高度约为 ⌈log₂(n+1)⌉，因此最大比较次数为该值。"
    },
    {
      "id": "ds-bs-3",
      "type": "single",
      "stem": "折半查找每比较一次可以排除多少元素？",
      "options": {
        "A": "约一半",
        "B": "一个",
        "C": "全部",
        "D": "四分之一"
      },
      "answer": "A",
      "explanation": "每次与中点比较后，可在左半或右半继续查找，排除约一半元素。"
    },
    {
      "id": "ds-bs-5",
      "type": "judge",
      "stem": "折半查找的时间复杂度为 O(log n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "每次排除一半，最多比较 O(log n) 次。"
    },
    {
      "id": "exam-ds-search-2022-9-r2",
      "type": "single",
      "stem": "在含 1024 个元素的有序顺序表中进行折半查找，最坏情况下最多比较多少次？",
      "options": {
        "A": "9 次",
        "B": "10 次",
        "C": "11 次",
        "D": "1024 次"
      },
      "answer": "C",
      "explanation": "每次比较将候选区间缩小一半；ceil(log₂(1024+1))=11。"
    },
    {
      "id": "qa-20261002-data-structures-lab-binary-search-01",
      "type": "single",
      "stem": "数组[2,5,8,11,14,17,20]，0起low=0,high=6,mid=floor((low+high)/2)，查找14成功需比较多少次？",
      "options": {
        "A": "1",
        "B": "3",
        "C": "2",
        "D": "4"
      },
      "answer": "B",
      "explanation": "先mid3值11转右[4,6]；mid5值17转左[4,4]；mid4值14，三次。"
    }
  ],
  "data-structures:lab/bst-insert": [
    {
      "id": "ds-bsti-3",
      "type": "judge",
      "stem": "在二叉排序树中插入一个已存在的关键字时，通常不再插入（或按约定放入某侧子树）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "一般约定 BST 不允许重复关键字，重复插入被忽略。"
    },
    {
      "id": "ds-bsti-4",
      "type": "single",
      "stem": "依次插入一个递增有序序列来构造二叉排序树，树会退化成？",
      "options": {
        "A": "单支树（类似链表）",
        "B": "完全二叉树",
        "C": "平衡二叉树",
        "D": "满二叉树"
      },
      "answer": "A",
      "explanation": "有序插入时新结点总是插在最右，树退化为单支，查找退化为 O(n)。"
    },
    {
      "id": "ds-bsti-5",
      "type": "judge",
      "stem": "二叉排序树插入操作的时间复杂度与树高有关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "插入需从根比较到叶，复杂度 O(h)，h 为树高。"
    },
    {
      "id": "ds-bsti-6",
      "type": "single",
      "stem": "在二叉排序树中插入的新结点总是作为？",
      "options": {
        "A": "叶子结点",
        "B": "根结点",
        "C": "内部结点",
        "D": "任意位置"
      },
      "answer": "A",
      "explanation": "从根比较到空指针处插入，新结点必然是叶子。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bst-insert-01",
      "type": "single",
      "stem": "空BST依次插入40、20、60、30、25，查找并插入25时经过的已有结点依次为？",
      "options": {
        "A": "40,60,30",
        "B": "20,30,40",
        "C": "40,20,30",
        "D": "40,20"
      },
      "answer": "C",
      "explanation": "25<40到20，25>20到30，25<30接左；不会旋转原树。"
    }
  ],
  "data-structures:lab/avl-rotations": [
    {
      "id": "ds-avl-1",
      "type": "single",
      "stem": "在 AVL 树中删除一个同时有左右孩子的结点，按二叉排序树规则应如何操作后再回溯调平衡？",
      "options": {
        "A": "用中序后继（右子树最小结点）替换其关键字，再删除那个后继替身",
        "B": "直接把该结点连同两棵子树一起删除",
        "C": "把左子树整体挂到右子树最左端，无需删除关键字",
        "D": "只删除该结点的关键字，孩子的指针保持不动"
      },
      "answer": "A",
      "explanation": "用中序后继替换后，问题转化为删除至多只有一个孩子的替身结点，随后从替身原位置沿路径回溯更新高度并旋转。",
      "hint": "中序后继是右子树中最小的结点，它至多只有一个右孩子。"
    },
    {
      "id": "ds-avl-2",
      "type": "single",
      "stem": "在 AVL 树中删除结点时，若被删除的结点只有一个孩子，正确的处理是？",
      "options": {
        "A": "用这个唯一孩子直接顶替被删结点的位置，再从顶替处向上回溯修复平衡",
        "B": "必须先做一次单旋再删除该结点",
        "C": "把该结点的孩子也一并删除",
        "D": "只能改用中序后继替换后才能删除"
      },
      "answer": "A",
      "explanation": "至多一个孩子时用孩子顶替即可保持二叉排序树性质；与删除双孩子结点一样，之后要沿回溯路径更新高度与平衡因子，必要时旋转。"
    },
    {
      "id": "ds-avl-3",
      "type": "single",
      "stem": "在 AVL 树中删除一个关键字的回溯过程中，对经过的每个结点应如何更新状态？",
      "options": {
        "A": "用孩子的新高度重新计算本结点高度与平衡因子，再判断是否旋转",
        "B": "只更新平衡因子，高度最后统一计算一次即可",
        "C": "先旋转，再看是否需要更新高度",
        "D": "高度与平衡因子都不需更新，只需重新排序"
      },
      "answer": "A",
      "explanation": "自底向上回溯时，孩子的高度可能已因旋转而改变，因此每个结点都要重新计算高度与平衡因子，据此决定是否旋转，才能让祖先得到正确的高度信息。"
    },
    {
      "id": "ds-avl-4-r2",
      "type": "single",
      "stem": "在 AVL 树中成功插入一个关键字后，与删除操作相比，旋转次数与修复范围有何不同？",
      "options": {
        "A": "插入修复最低失衡点，做一次单旋或双旋；删除可能向上多次修复",
        "B": "插入必须修复全部祖先，删除只修复一个",
        "C": "两者都只修复最低失衡点",
        "D": "两者都必须旋转O(logn)次"
      },
      "answer": "A",
      "explanation": "插入在最低失衡点做单旋或双旋后，子树高度恢复插入前值，祖先不再失衡。双旋包括两次基本旋转。删除可能使高度继续下降，修复可上传。"
    },
    {
      "id": "ds-avl-5-r2",
      "type": "single",
      "stem": "AVL结点z满足右子树比左子树高2层，且z的右孩子的右子树比其左子树更高，应如何恢复z平衡？",
      "options": {
        "A": "RR 型：对失衡结点做一次左旋",
        "B": "LL 型：对失衡结点做一次右旋",
        "C": "LR 型：先左旋再右旋",
        "D": "RL 型：先右旋再左旋"
      },
      "answer": "A",
      "explanation": "两代孩子都偏向右侧即为 RR 型，对失衡结点左旋一次即可；旋转只改动指针与父子关系，不改变中序遍历得到的序列。"
    },
    {
      "id": "qa-20261002-data-structures-lab-avl-rotations-01",
      "type": "single",
      "stem": "空AVL依次插30、10、20，在最低失衡点应执行哪类旋转及得到哪个根？",
      "options": {
        "A": "LL单右旋，根10",
        "B": "RR单左旋，根20",
        "C": "RL双旋，根30",
        "D": "LR双旋，根20"
      },
      "answer": "D",
      "explanation": "30左重，新键在其左孩子10的右侧，先对10左旋再对30右旋，20成为根。"
    }
  ],
  "data-structures:lab/hash-chaining": [
    {
      "id": "ds-hc-1",
      "type": "single",
      "stem": "拉链法（链地址法）处理冲突的做法是？",
      "options": {
        "A": "把散列到同一地址的关键字组织成链表",
        "B": "向后逐格探测空位",
        "C": "重新散列到另一张表",
        "D": "直接丢弃冲突元素"
      },
      "answer": "A",
      "explanation": "同义词挂在同一链表中，查找时先定位桶再在链上查找。"
    },
    {
      "id": "ds-hc-2",
      "type": "single",
      "stem": "拉链法的平均查找长度主要取决于？",
      "options": {
        "A": "装填因子 α",
        "B": "表长是否为素数",
        "C": "关键字的位数",
        "D": "内存大小"
      },
      "answer": "A",
      "explanation": "链平均长度约为 α，查找长度随装填因子增大而增大。"
    },
    {
      "id": "ds-hc-3",
      "type": "judge",
      "stem": "拉链法删除元素方便，不需要使用删除标记。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "直接在链表中摘除结点即可，不像开放定址法需要墓碑标记。"
    },
    {
      "id": "ds-hc-5",
      "type": "judge",
      "stem": "拉链法的装填因子可以大于 1。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "装填因子 = 元素数/表长，链表可容纳任意多元素，故可大于 1。"
    },
    {
      "id": "qa-20261002-data-structures-lab-hash-chaining-01",
      "type": "single",
      "stem": "拉链哈希表有5桶，桶长度分别2、0、3、1、0，每条链固定次序查找，6个键等概率成功，成功ASL（链内比较数）为？",
      "options": {
        "A": "5/3",
        "B": "6/5",
        "C": "2",
        "D": "3/2"
      },
      "answer": "A",
      "explanation": "总比较(1+2)+(1+2+3)+1=10，除6得5/3；空桶对成功ASL无贡献。"
    }
  ],
  "data-structures:lab/kmp": [
    {
      "id": "ds-kmp-3",
      "type": "single",
      "stem": "KMP 算法的时间复杂度是？",
      "options": {
        "A": "O(n+m)",
        "B": "O(n·m)",
        "C": "O(n²)",
        "D": "O(log n)"
      },
      "answer": "A",
      "explanation": "主串指针不回退，模式串回退由 next 决定，总时间 O(n+m)。"
    },
    {
      "id": "ds-kmp-4",
      "type": "judge",
      "stem": "KMP 算法失配时主串指针不回退。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "利用已匹配信息只移动模式串，主串指针一直前进。"
    },
    {
      "id": "ds-kmp-5-r2",
      "type": "single",
      "stem": "采用教材1起KMP约定next[1]=0，对j≥2，next[j]的含义是？",
      "options": {
        "A": "模式前j−1字符最长相等真前后缀长度加1",
        "B": "模式串长度",
        "C": "主串长度",
        "D": "失配次数"
      },
      "answer": "A",
      "explanation": "next[j] 指示失配时模式串应回退到的位置，由最长相等前后缀决定。"
    },
    {
      "id": "ds-kmp-6",
      "type": "single",
      "stem": "KMP 的 next 数组只与什么有关？",
      "options": {
        "A": "模式串本身",
        "B": "主串",
        "C": "主串与模式串",
        "D": "匹配结果"
      },
      "answer": "A",
      "explanation": "next 由模式串的最长相等前后缀决定，与主串无关，可预先计算。"
    },
    {
      "id": "qa-20261002-data-structures-lab-kmp-01",
      "type": "single",
      "stem": "1起KMP next[1]=0，模式ababaca，在j=6失配时回退到next[6]，其值为？",
      "options": {
        "A": "0",
        "B": "4",
        "C": "3",
        "D": "2"
      },
      "answer": "B",
      "explanation": "此前ababa的最长真前后缀aba长3，回退到模式第4字符；不是pi的值3。"
    }
  ],
  "data-structures:lab/bst-search": [
    {
      "id": "ds-bsts-1",
      "type": "single",
      "stem": "在二叉排序树中查找关键字 k 的过程是？",
      "options": {
        "A": "从根开始，k 小往左、k 大往右，直到找到或到空",
        "B": "中序遍历全部结点",
        "C": "随机访问",
        "D": "用哈希函数定位"
      },
      "answer": "A",
      "explanation": "利用 BST 有序性，每次比较即可排除一侧子树。"
    },
    {
      "id": "ds-bsts-2-r2",
      "type": "judge",
      "stem": "若BST高度为O(logn)，查找为O(logn)；普通BST若退化成n结点单链，最坏查找为O(n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "平衡时接近 O(log n)；退化成单支树时最坏 O(n)。"
    },
    {
      "id": "ds-bsts-3",
      "type": "single",
      "stem": "二叉排序树查找失败的终止条件是？",
      "options": {
        "A": "走到空指针",
        "B": "树高为 0",
        "C": "找到根",
        "D": "比较次数达到 n"
      },
      "answer": "A",
      "explanation": "沿路径比较直到遇到空指针，说明关键字不存在。"
    },
    {
      "id": "ds-bsts-4",
      "type": "judge",
      "stem": "对二叉排序树做中序遍历可得到有序序列，可用于验证其是否为 BST。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "中序序列递增是 BST 的等价判定条件。"
    },
    {
      "id": "ds-bsts-5-r2",
      "type": "single",
      "stem": "非空BST的树高h按层数计算；最坏查找比较次数，以h表达的紧确值为？",
      "options": {
        "A": "h",
        "B": "h−1",
        "C": "2h",
        "D": "2^h"
      },
      "answer": "A",
      "explanation": "查找沿一条从根到叶的路径，最多比较树高 h 次。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bst-search-01",
      "type": "single",
      "stem": "BST依次插8、4、12、2、6、10、14，查找11失败时比较的关键字序列是？",
      "options": {
        "A": "8,12,14",
        "B": "8,10,12",
        "C": "8,12,10",
        "D": "8,4,6"
      },
      "answer": "C",
      "explanation": "11>8至12，11<12至10，11>10至右空指针，三次比较。"
    }
  ],
  "data-structures:lab/bst-delete": [
    {
      "id": "ds-bstdel-1",
      "type": "single",
      "stem": "在二叉排序树中删除一个同时具有左右孩子的结点，常用做法是？",
      "options": {
        "A": "用中序前驱或中序后继替换该结点，再删除前驱/后继",
        "B": "直接把该结点置空",
        "C": "把左子树整体接到右子树根上",
        "D": "删除后无需调整"
      },
      "answer": "A",
      "explanation": "用中序前驱（左子树最右）或中序后继（右子树最左）的值替换后，转化为删除一个至多有一个孩子的结点。"
    },
    {
      "id": "ds-bstdel-2-r2",
      "type": "single",
      "stem": "在二叉排序树中删除一个叶子结点，应？",
      "options": {
        "A": "将父结点指向该叶的孩子指针置空并释放叶（若为根则根置空）",
        "B": "必须用中序后继替换",
        "C": "必须旋转后再删",
        "D": "不能删除"
      },
      "answer": "A",
      "explanation": "删除叶应断开父结点的相应孩子链。若该叶就是唯一根，则更新根指针为空。"
    },
    {
      "id": "ds-bstdel-3",
      "type": "single",
      "stem": "删除只有一个孩子的结点时，应？",
      "options": {
        "A": "用其唯一孩子替代该结点",
        "B": "用中序前驱替代",
        "C": "直接置空",
        "D": "删除整棵子树"
      },
      "answer": "A",
      "explanation": "用唯一孩子顶替，保持父结点与子树连接。"
    },
    {
      "id": "ds-bstdel-5",
      "type": "single",
      "stem": "二叉排序树删除操作的时间复杂度是？",
      "options": {
        "A": "O(h)，h 为树高",
        "B": "O(1)",
        "C": "O(n log n)",
        "D": "O(n²)"
      },
      "answer": "A",
      "explanation": "删除需先查找目标结点，复杂度取决于树高。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bst-delete-01",
      "type": "single",
      "stem": "BST根20，左10，右30且30左25右40，25右27。以中序后继法删20后，新根及30的左孩子为？",
      "options": {
        "A": "30与25",
        "B": "25与NULL",
        "C": "27与25",
        "D": "25与27"
      },
      "answer": "D",
      "explanation": "将25值换至根，再删除原25，25唯一右孩子27接为30的左孩子。"
    }
  ],
  "data-structures:lab/hash-linear": [
    {
      "id": "ds-hl-2",
      "type": "single",
      "stem": "线性探测法的第 i 次探测地址公式是？",
      "options": {
        "A": "(H(key)+i) mod m",
        "B": "(H(key)+i²) mod m",
        "C": "(H(key)·i) mod m",
        "D": "H(key)+i"
      },
      "answer": "A",
      "explanation": "线性探测逐个后移：H_i=(H(key)+i) mod m。"
    },
    {
      "id": "ds-hl-3",
      "type": "judge",
      "stem": "线性探测容易产生一次聚集（堆积）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "连续被占用的区域会越来越长，后续冲突元素被迫跳过更多格子，平均查找长度增大。"
    },
    {
      "id": "ds-hl-4",
      "type": "single",
      "stem": "线性探测的平均查找长度随什么增大而增大？",
      "options": {
        "A": "装填因子 α",
        "B": "关键字大小",
        "C": "表长",
        "D": "元素位数"
      },
      "answer": "A",
      "explanation": "装填因子越大，空位越少，探测链越长。"
    },
    {
      "id": "ds-hl-5",
      "type": "judge",
      "stem": "线性探测插入时，若探测 m 次仍未找到空位，则插入失败（表满）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "最多探测 m 个位置，全都占用说明表已满。"
    },
    {
      "id": "ds-hl-6-r2",
      "type": "judge",
      "stem": "线性探测中若删除采用墓碑标记，查找遇墓碑应继续探测，不能将其当从未使用的空槽。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "墓碑既表示该位置曾有元素，又不能截断探测链，查找须继续。"
    },
    {
      "id": "qa-20261002-data-structures-lab-hash-linear-01",
      "type": "single",
      "stem": "7槽线性探测h(k)=k mod7，依次插10、17、24，再以墓碑删17。成功查找24需访问哪些槽？",
      "options": {
        "A": "3,4,5",
        "B": "3,5",
        "C": "5",
        "D": "3,4"
      },
      "answer": "A",
      "explanation": "三键初址3，实际3、4、5；删4保留墓碑，查24仍需检查3、4、5。"
    }
  ],
  "data-structures:lab/hash-double": [
    {
      "id": "ds-hd-1",
      "type": "single",
      "stem": "双散列探测法中，第二散列函数的主要作用是？",
      "options": {
        "A": "决定探测步长，使探测序列随关键字变化以减少堆积",
        "B": "计算初始地址",
        "C": "统计冲突次数",
        "D": "决定装载因子"
      },
      "answer": "A",
      "explanation": "H_i=(H1(key)+i·H2(key)) mod m，第二散列提供与关键字相关的步长，缓解线性探测的堆积。"
    },
    {
      "id": "ds-hd-2",
      "type": "single",
      "stem": "双散列探测的地址公式是？",
      "options": {
        "A": "(H1(key)+i·H2(key)) mod m",
        "B": "(H1(key)+i) mod m",
        "C": "(H1(key)+i²) mod m",
        "D": "H1(key)·H2(key)"
      },
      "answer": "A",
      "explanation": "步长由第二散列 H2 决定，随关键字变化以减少堆积。"
    },
    {
      "id": "ds-hd-3",
      "type": "judge",
      "stem": "双散列要求第二散列值非零，且通常与表长互质。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "H2 为零会退化为不移动；与表长互质可保证探测序列遍历全表。"
    },
    {
      "id": "ds-hd-5-r2",
      "type": "judge",
      "stem": "双散列探测删除时，直接置为从未使用的空槽可能截断探测链；可用删除标记并在查找时继续探测。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "它仍是开放定址法，直接置空会截断探测链，需用墓碑标记。"
    },
    {
      "id": "qa-20261002-data-structures-lab-hash-double-01",
      "type": "single",
      "stem": "双散列表长m=12、初址1、步长8；探测序列重复前能访问多少个不同槽？",
      "options": {
        "A": "12",
        "B": "3",
        "C": "4",
        "D": "6"
      },
      "answer": "B",
      "explanation": "周期m/gcd(12,8)=12/4=3；槽1、9、5后回1，所以尚有空槽也可能无法插入。"
    }
  ],
  "data-structures:lab/kmp-nextval": [
    {
      "id": "ds-nextval-1",
      "type": "single",
      "stem": "KMP 的 nextval 数组相比 next 数组的主要改进是？",
      "options": {
        "A": "避免模式串中相同字符导致的无效比较",
        "B": "减少主串指针移动次数",
        "C": "降低空间复杂度",
        "D": "把时间复杂度降到 O(log n)"
      },
      "answer": "A",
      "explanation": "当模式串回退位置的字符与当前失配字符相同时，nextval 继续向前回退，跳过必然失配的比较。"
    },
    {
      "id": "ds-nv-4-r2",
      "type": "single",
      "stem": "按照从next推导nextval的教材方法，nextval用于修正哪一个数组给出的回退位置？",
      "options": {
        "A": "next 数组",
        "B": "哈希表",
        "C": "主串",
        "D": "排序结果"
      },
      "answer": "A",
      "explanation": "nextval 由 next 递推修正得到：若 p[j]==p[next[j]] 则 nextval[j]=nextval[next[j]]。"
    },
    {
      "id": "ds-nv-5",
      "type": "judge",
      "stem": "按教材约定 nextval[1] = 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "下标从 1 开始时 next[1]=0，故 nextval[1]=0。"
    },
    {
      "id": "qa-20261002-data-structures-lab-kmp-nextval-01",
      "type": "single",
      "stem": "1起KMP next[1]=0，模式aaaa，按相同字符继续跳转的nextval规则，nextval[4]为？",
      "options": {
        "A": "2",
        "B": "3",
        "C": "0",
        "D": "1"
      },
      "answer": "C",
      "explanation": "next4=3但p4=p3，继续继承nextval3；全部a连跳至0。"
    }
  ],
  "data-structures:lab/bf-match": [
    {
      "id": "ds-bfmatch-1",
      "type": "single",
      "stem": "BF（朴素）模式匹配最坏情况下的时间复杂度是？",
      "options": {
        "A": "O(n·m)",
        "B": "O(n+m)",
        "C": "O(n log m)",
        "D": "O(1)"
      },
      "answer": "A",
      "explanation": "最坏时每趟都在最后一个字符失配，共约 n·m 次比较。"
    },
    {
      "id": "ds-bfmatch-2",
      "type": "judge",
      "stem": "BF 算法失配时，主串指针回退到本次匹配起点的下一个位置。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "朴素匹配每次失配都整体右移一位重新开始比较。"
    },
    {
      "id": "ds-bfmatch-3-r2",
      "type": "single",
      "stem": "BF匹配非空长度m的模式串，若第一候选起点一次匹配成功，字符比较次数为？",
      "options": {
        "A": "m",
        "B": "n*m",
        "C": "n²",
        "D": "m²"
      },
      "answer": "A",
      "explanation": "第一位置连续m对字符全部相等后立即返回，没有扫描其余n−m字符。"
    },
    {
      "id": "ds-bfmatch-4-r2",
      "type": "judge",
      "stem": "BF实现简单，但最坏字符比较次数可为O(nm)；KMP含预处理的最坏总时间为O(n+m)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "BF 存在大量重复比较，KMP 利用已匹配信息更高效。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bf-match-01",
      "type": "single",
      "stem": "主串aaaaab、模式aaab，BF从左至右逐起点尝试。从开始到首次匹配成功为止（含成功那次尝试），总字符比较次数为？",
      "options": {
        "A": "10",
        "B": "8",
        "C": "6",
        "D": "12"
      },
      "answer": "D",
      "explanation": "起点1三a后a/b失配4次；起点2同样4次；起点3 aaab成功4次，共12。"
    }
  ],
  "data-structures:lab/red-black-tree": [
    {
      "id": "ds-rb-2",
      "type": "single",
      "stem": "在红黑树中删除一个黑结点（其位置由孩子或后继顶替）后，为什么需要修复？",
      "options": {
        "A": "该位置的黑高比其兄弟少 1，破坏了从根到叶黑结点数相同这一性质",
        "B": "破坏了根结点必须为空这一性质",
        "C": "破坏了所有叶结点都是红结点这一性质",
        "D": "不需要修复，红黑树允许黑高不同"
      },
      "answer": "A",
      "explanation": "删掉黑结点会让该路径上的黑结点数少 1，形成“双黑”亏空，必须通过变色与旋转把亏空向上传递或消解，否则黑高不再相等。",
      "hint": "把“少了一个黑结点”理解为该位置的额外一重黑色。"
    },
    {
      "id": "ds-rb-3",
      "type": "judge",
      "stem": "红黑树中从根到叶的最长路径长度不超过最短路径的两倍。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "黑高相同且红结点不相邻，保证最长路径 ≤ 2×最短路径。"
    },
    {
      "id": "ds-rb-4",
      "type": "single",
      "stem": "红黑树插入新结点时通常先着为哪种颜色？",
      "options": {
        "A": "红色",
        "B": "黑色",
        "C": "随机",
        "D": "与父结点相同"
      },
      "answer": "A",
      "explanation": "着红只可能违反“红结点孩子为黑”，修复代价较小；着黑会破坏黑高。"
    },
    {
      "id": "ds-rb-5",
      "type": "judge",
      "stem": "红黑树是一种自平衡二叉查找树，查找、插入、删除都是 O(log n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "红黑树高度为 O(log n)，三种操作均为 O(log n)。"
    },
    {
      "id": "ds-rb-6-r2",
      "type": "single",
      "stem": "红黑树删除中修复“双黑”时，若兄弟结点为黑色且兄弟的两个孩子也都是黑色，应如何处理？",
      "options": {
        "A": "兄弟染红；若父为红则父染黑结束，若父为黑则把黑亏空上移",
        "B": "兄弟染红后不管父颜色都结束",
        "C": "删除兄弟",
        "D": "不管结构都左旋父结点"
      },
      "answer": "A",
      "explanation": "兄弟染红使两侧黑高同时降低。若父红，父染黑补回亏空即结束；若父黑，则黑亏空移到父位置，继续修复或在根消解。"
    },
    {
      "id": "qa-20261002-data-structures-lab-red-black-tree-01",
      "type": "single",
      "stem": "红黑树中黑结点x仅有一个非NIL孩子，该孩子为红色。直接用孩子替代x后，恢复黑高通常只须？",
      "options": {
        "A": "将孩子染黑",
        "B": "将孩子染红",
        "C": "删除孩子",
        "D": "必须双旋"
      },
      "answer": "A",
      "explanation": "黑结点被红孩子顶替时该路径少一黑；把红孩子染黑即可补回，不必一概旋转。"
    }
  ],
  "data-structures:lab/b-tree": [
    {
      "id": "ds-btree-1-r2",
      "type": "single",
      "stem": "m 阶 B 树中，除根结点外每个非叶结点至少含有多少个关键字？",
      "options": {
        "A": "⌈m/2⌉−1",
        "B": "m−1",
        "C": "⌈m/2⌉",
        "D": "1"
      },
      "answer": "A",
      "explanation": "按最大孩子数m的定义，非根内部结点至少ceil(m/2)个孩子，对应ceil(m/2)−1键。删除下溢需借或并以恢复占用约束；叶深约束另须保持。"
    },
    {
      "id": "ds-bt-2",
      "type": "single",
      "stem": "m 阶 B 树的每个结点最多有多少个关键字、多少个孩子？",
      "options": {
        "A": "m−1 个关键字、m 个孩子",
        "B": "m 个关键字、m+1 个孩子",
        "C": "m+1 个关键字、m 个孩子",
        "D": "m−1 个关键字、m−1 个孩子"
      },
      "answer": "A",
      "explanation": "m 阶 B 树结点至多 m−1 个关键字、至多 m 个孩子。"
    },
    {
      "id": "ds-bt-4",
      "type": "single",
      "stem": "B 树适合用于外存索引的主要原因是？",
      "options": {
        "A": "分支因子大、树高低，减少磁盘 I/O 次数",
        "B": "空间占用小",
        "C": "插入速度快",
        "D": "支持哈希查找"
      },
      "answer": "A",
      "explanation": "一个结点存多个关键字，树高小，查找时访盘次数少。"
    },
    {
      "id": "ds-bt-5-r2",
      "type": "judge",
      "stem": "最小度t=2的B树（2-3-4树，非根至少1键、至多3键）中，删除使某结点下溢到0键，且有同父右兄弟含2键，可经父分隔键向右兄弟借位恢复下界。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "兄弟关键字数多于下界 1，可以借位：父结点分隔关键字转入下溢结点，兄弟中最小的关键字上升到父结点，两个结点键数都回到合法范围。"
    },
    {
      "id": "qa-20261002-data-structures-lab-b-tree-01",
      "type": "single",
      "stem": "按最大孩子数m定义的5阶B树，非根内部结点只有1个关键字，其他性质均正确，该结点是否合法？",
      "options": {
        "A": "只需所有键为正就合法",
        "B": "不合法，至少2键",
        "C": "合法，最少1键",
        "D": "不合法，至少4键"
      },
      "answer": "B",
      "explanation": "ceil(5/2)−1=2，1键下溢；须借位或合并恢复占用下界。"
    }
  ],
  "data-structures:lab/b-plus-tree": [
    {
      "id": "ds-bpt-1",
      "type": "single",
      "stem": "B+ 树与 B 树的关键区别之一是？",
      "options": {
        "A": "B+ 树所有关键字都出现在叶结点，内部结点只作索引",
        "B": "B+ 树不要求平衡",
        "C": "B+ 树叶结点不相连",
        "D": "B+ 树不能插入"
      },
      "answer": "A",
      "explanation": "B+ 树内部结点只存索引，全部关键字（及其记录指针）在叶结点。"
    },
    {
      "id": "ds-bpt-2-r2",
      "type": "single",
      "stem": "在 B+ 树中删除某个叶结点里的记录后，若该叶的关键字数低于下界，通常如何处理？",
      "options": {
        "A": "先看相邻叶兄弟能否借位，兄弟也紧张时再与兄弟合并",
        "B": "直接从内部结点中删掉对应的分隔关键字即可",
        "C": "把整棵右子树重新插入一次",
        "D": "B+ 树叶结点没有关键字下界的要求"
      },
      "answer": "A",
      "explanation": "同父相邻叶兄弟有富余时，将其边缘记录移入下溢叶并更新父索引；否则合并叶、删除父的相应孩子/索引项并处理父下溢。父索引只起边界作用，不像B树借位那样作为唯一记录移入叶。占用下界以该B+树定义为准。"
    },
    {
      "id": "ds-bpt-3",
      "type": "single",
      "stem": "B+ 树内部结点中的关键字通常是？",
      "options": {
        "A": "其子结点中最大（或最小）关键字的副本",
        "B": "随机值",
        "C": "记录指针",
        "D": "空值"
      },
      "answer": "A",
      "explanation": "内部结点关键字起分界作用，是子树关键字范围的副本。"
    },
    {
      "id": "ds-bpt-4-r2",
      "type": "judge",
      "stem": "B+ 树删除导致两个叶结点合并后，通常还需要沿着父结点方向更新相应的分隔关键字。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "叶合并会使父结点少一个孩子，应删除相应索引项并维护其余边界键；若父下溢继续向上处理。边界取子树最大键还是最小键须遵循该B+树定义。"
    },
    {
      "id": "ds-bpt-5",
      "type": "single",
      "stem": "在 B+ 树中查找一个关键字，通常需要？",
      "options": {
        "A": "一直走到叶结点",
        "B": "在根结点即可命中",
        "C": "随机访问任意层",
        "D": "只查内部结点"
      },
      "answer": "A",
      "explanation": "B+ 树所有关键字都在叶结点，查找必须到达叶层。"
    },
    {
      "id": "qa-20261002-data-structures-lab-b-plus-tree-01",
      "type": "single",
      "stem": "B+树叶链依次为[2,5]→[8,10]→[13,16]，查范围[6,14]时先定位第一候选叶，再顺叶链扫描，输出为？",
      "options": {
        "A": "8,10,13,16",
        "B": "10,13",
        "C": "8,10,13",
        "D": "5,8,10,13"
      },
      "answer": "C",
      "explanation": "第一候选是[8,10]，接着[13,16]只取13；5<6、16>14。"
    }
  ],
  "data-structures:lab/quick-sort": [
    {
      "id": "ds-qs-3",
      "type": "single",
      "stem": "快速排序的平均时间复杂度和平均空间复杂度分别是？",
      "options": {
        "A": "O(n log n) 与 O(log n)",
        "B": "O(n log n) 与 O(n)",
        "C": "O(n²) 与 O(1)",
        "D": "O(n) 与 O(n)"
      },
      "answer": "A",
      "explanation": "平均划分较均衡，时间 O(n log n)，递归栈平均 O(log n)。"
    },
    {
      "id": "ds-qs-4",
      "type": "judge",
      "stem": "快速排序的划分操作把小于枢轴的元素放在左侧、大于枢轴的放在右侧。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "partition 以枢轴为界重新排列，使左侧不大于、右侧不小于枢轴。"
    },
    {
      "id": "ds-qs-5",
      "type": "judge",
      "stem": "快速排序是不稳定的排序算法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "划分中的交换可能改变相同关键字元素的相对次序。"
    },
    {
      "id": "ds-qs-6",
      "type": "single",
      "stem": "为缓解快速排序的最坏情况，可以？",
      "options": {
        "A": "随机选取枢轴或三数取中",
        "B": "总是取首元素为枢轴",
        "C": "减少递归",
        "D": "改成冒泡排序"
      },
      "answer": "A",
      "explanation": "随机化或三数取中可降低划分一边倒的概率，避免退化。"
    },
    {
      "id": "ds-qs-7-r2",
      "type": "judge",
      "stem": "采用将枢轴放入最终分界位置的教材双向扫描划分法时，快速排序每趟划分结束后枢轴的最终位置已确定。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "划分后左侧都不大于、右侧都不小于枢轴，故枢轴位置确定。"
    },
    {
      "id": "qa-20261002-data-structures-lab-quick-sort-01",
      "type": "single",
      "stem": "升序快排每次取首键作枢轴，教材归位partition处理互异已升序n键，递归最大深度量级为？",
      "options": {
        "A": "O(logn)",
        "B": "O(1)",
        "C": "O(nlogn)",
        "D": "O(n)"
      },
      "answer": "D",
      "explanation": "每次枢轴最小，剩余n−1进入一侧，形成线性深度；原地划分不能消除递归栈。"
    }
  ],
  "data-structures:lab/heap-sort": [
    {
      "id": "ds-hs-3",
      "type": "single",
      "stem": "堆排序的空间复杂度是？",
      "options": {
        "A": "O(1)",
        "B": "O(n)",
        "C": "O(log n)",
        "D": "O(n log n)"
      },
      "answer": "A",
      "explanation": "堆排序在原数组上完成交换与调整，只需常数级额外空间。"
    },
    {
      "id": "ds-hs-4",
      "type": "judge",
      "stem": "堆排序是不稳定的排序算法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "堆顶与末尾交换可能改变相同关键字元素的相对次序。"
    },
    {
      "id": "ds-hs-5",
      "type": "single",
      "stem": "若要把数组升序排序，通常使用？",
      "options": {
        "A": "大根堆",
        "B": "小根堆",
        "C": "散列表",
        "D": "栈"
      },
      "answer": "A",
      "explanation": "大根堆堆顶最大，依次与末尾交换即可把大元素放到后面，得到升序。"
    },
    {
      "id": "ds-hs-6",
      "type": "judge",
      "stem": "堆排序建堆时间为 O(n)，之后每趟调整堆为 O(log n)，总体 O(n log n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "自底向上建堆 O(n)，n−1 次交换调整各 O(log n)，总体 O(n log n)。"
    },
    {
      "id": "ds-hs-7-r2",
      "type": "single",
      "stem": "标准原地二叉堆排序的最坏时间复杂度为？",
      "options": {
        "A": "O(nlogn)",
        "B": "O(n²)",
        "C": "O(logn)",
        "D": "O(1)"
      },
      "answer": "A",
      "explanation": "建堆O(n)，每次摘最大后下滤最多O(logn)，共n−1次，最坏总O(nlogn)。特定重复键输入和提前停止实现最好可更低。"
    },
    {
      "id": "qa-20261002-data-structures-lab-heap-sort-01",
      "type": "single",
      "stem": "大根堆数组[9,7,8,3,4,5]做一趟升序堆排序：9与末尾5交换，缩至5键再下滤，当前数组为？",
      "options": {
        "A": "[8,7,5,3,4,9]",
        "B": "[7,5,8,3,4,9]",
        "C": "[5,7,8,3,4,9]",
        "D": "[8,5,7,3,4,9]"
      },
      "answer": "A",
      "explanation": "换后[5,7,8,3,4,9]，选较大孩子8与5换；5位2无有效孩子，停止。"
    }
  ],
  "data-structures:lab/insertion-sort": [
    {
      "id": "ds-ins-1-r2",
      "type": "single",
      "stem": "直接插入排序处理n条记录，输入逆序对总数为O(n)，则总比较和移动时间量级为？",
      "options": {
        "A": "O(n)",
        "B": "O(n²)",
        "C": "O(n log n)",
        "D": "O(log n)"
      },
      "answer": "A",
      "explanation": "标准直接插入排序的成本为O(n+I)，I为逆序对数；每次右移对应一个逆序对，I=O(n)时总时间O(n)。"
    },
    {
      "id": "ds-ins-2",
      "type": "single",
      "stem": "直接插入排序每一趟的基本操作是？",
      "options": {
        "A": "把当前元素插入前面已排好的有序区",
        "B": "把最大元素放到末尾",
        "C": "把序列一分为二",
        "D": "随机交换"
      },
      "answer": "A",
      "explanation": "维护一个有序前缀，逐趟把后一个元素插入合适位置。"
    },
    {
      "id": "ds-ins-3",
      "type": "judge",
      "stem": "直接插入排序是稳定的排序算法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "插入时只在严格小于时前移，相等元素相对次序不变。"
    },
    {
      "id": "ds-ins-4",
      "type": "single",
      "stem": "直接插入排序的最坏时间复杂度是？",
      "options": {
        "A": "O(n²)",
        "B": "O(n log n)",
        "C": "O(n)",
        "D": "O(log n)"
      },
      "answer": "A",
      "explanation": "逆序时每个元素都要前移到底，比较与移动次数约为 n²/2。"
    },
    {
      "id": "qa-20261002-data-structures-lab-insertion-sort-01",
      "type": "single",
      "stem": "直接插入排序只移动严格大于待插键的旧记录，对[4,1,3,2]升序排序，旧记录右移总数为？",
      "options": {
        "A": "6",
        "B": "4",
        "C": "3",
        "D": "5"
      },
      "answer": "B",
      "explanation": "插1右移4一次；插3右移4一次；插2右移4、3两次，共4，等于逆序对数。"
    }
  ],
  "data-structures:lab/merge-sort": [
    {
      "id": "ds-ms-2",
      "type": "single",
      "stem": "二路归并排序的基本思路是？",
      "options": {
        "A": "把序列不断二分，再两两合并有序子序列",
        "B": "每次选最小元素",
        "C": "按位分配",
        "D": "构建堆"
      },
      "answer": "A",
      "explanation": "分治：递归划分到单元素，再自底向上两两归并成有序序列。"
    },
    {
      "id": "ds-ms-3",
      "type": "judge",
      "stem": "归并排序是稳定的排序算法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "合并时相等元素保持原顺序（先取左半），故稳定。"
    },
    {
      "id": "ds-ms-4",
      "type": "single",
      "stem": "归并排序需要多少辅助空间？",
      "options": {
        "A": "O(n)",
        "B": "O(1)",
        "C": "O(log n)",
        "D": "O(n log n)"
      },
      "answer": "A",
      "explanation": "合并需要与序列等长的辅助数组，空间 O(n)。"
    },
    {
      "id": "ds-ms-5",
      "type": "judge",
      "stem": "归并排序的时间复杂度恒为 O(n log n)，与初始序列无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "划分深度 log n、每层合并 O(n)，最好与最坏都是 O(n log n)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-merge-sort-01",
      "type": "single",
      "stem": "稳定归并[2a,4a]与[2b,3b]，a段在原数组左侧，相等先取左，结果为？",
      "options": {
        "A": "[2a,3b,2b,4a]",
        "B": "[2b,3b,2a,4a]",
        "C": "[2a,2b,3b,4a]",
        "D": "[2b,2a,3b,4a]"
      },
      "answer": "C",
      "explanation": "先2a后2b保原相对顺序，再3b最后4a；稳定性需要平局规则。"
    }
  ],
  "data-structures:lab/bubble-sort": [
    {
      "id": "ds-bub-1",
      "type": "judge",
      "stem": "冒泡排序是稳定的，并且当某一趟没有发生交换时可以提前结束。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "相邻元素相等时不交换，故稳定；某趟无交换说明已有序，可提前终止。"
    },
    {
      "id": "ds-bub-2-r2",
      "type": "single",
      "stem": "升序冒泡排序从左向右扫描未排序区，相邻逆序才交换。一趟完整扫描的效果是？",
      "options": {
        "A": "把当前未排序部分的最大元素移到末尾",
        "B": "把最小元素移到开头",
        "C": "把序列一分为二",
        "D": "随机打乱"
      },
      "answer": "A",
      "explanation": "相邻比较交换，较大者逐步“冒”到未排序区末尾。"
    },
    {
      "id": "ds-bub-4",
      "type": "single",
      "stem": "带提前终止的冒泡排序在序列已有序时的时间复杂度是？",
      "options": {
        "A": "O(n)",
        "B": "O(n²)",
        "C": "O(n log n)",
        "D": "O(1)"
      },
      "answer": "A",
      "explanation": "第一趟无交换即可判定有序并结束，只比较 n−1 次。"
    },
    {
      "id": "ds-bub-5",
      "type": "judge",
      "stem": "冒泡排序最坏情况下的比较次数约为 n(n−1)/2。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "逆序时每趟比较次数递减，总计 n(n−1)/2。"
    },
    {
      "id": "qa-20261002-data-structures-lab-bubble-sort-01",
      "type": "single",
      "stem": "升序冒泡左至右，输入[3,1,2,4]，有无交换标志可提前终止，总关键字比较次数为？",
      "options": {
        "A": "3",
        "B": "6",
        "C": "4",
        "D": "5"
      },
      "answer": "D",
      "explanation": "首趟3次交换得[1,2,3,4]，次趟未排前三项比较2次无交换终止，共5。"
    }
  ],
  "data-structures:lab/selection-sort": [
    {
      "id": "ds-sel-1",
      "type": "single",
      "stem": "简单选择排序的比较次数与初始序列的排列情况？",
      "options": {
        "A": "无关，恒为 n(n−1)/2",
        "B": "有关，最好为 n−1",
        "C": "有关，最好为 n log n",
        "D": "随机变化"
      },
      "answer": "A",
      "explanation": "无论初始序列如何，选择排序都要做 n(n−1)/2 次比较，移动次数较少。"
    },
    {
      "id": "ds-sel-2",
      "type": "single",
      "stem": "简单选择排序每一趟的操作是？",
      "options": {
        "A": "从未排序区选出最小元素放到已排序区末尾",
        "B": "相邻交换",
        "C": "折半查找",
        "D": "按位分配"
      },
      "answer": "A",
      "explanation": "每趟扫描未排序区找最小值，与未排序区首元素交换。"
    },
    {
      "id": "ds-sel-3",
      "type": "judge",
      "stem": "简单选择排序是不稳定的排序算法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "交换可能把相等元素跨越其他元素，破坏相对次序。"
    },
    {
      "id": "ds-sel-4-r2",
      "type": "single",
      "stem": "含n≥1个元素的简单选择排序，每趟最多做一次交换，总交换次数至多为？",
      "options": {
        "A": "n−1 次",
        "B": "n(n−1)/2 次",
        "C": "n² 次",
        "D": "0 次"
      },
      "answer": "A",
      "explanation": "n−1趟每趟至多一次交换，最多n−1次交换。用临时变量交换两记录通常计3次记录移动，不能混称n−1次移动。"
    },
    {
      "id": "qa-20261002-data-structures-lab-selection-sort-01",
      "type": "single",
      "stem": "简单选择排序每趟与未排区首项交换，输入[2a,2b,1]，第一趟后等键标签次序如何？",
      "options": {
        "A": "2b在2a前",
        "B": "2a仍在2b前",
        "C": "两个2都被删除",
        "D": "不发生任何交换"
      },
      "answer": "A",
      "explanation": "最小1和2a交换得[1,2b,2a]，远距交换破坏原a在b前次序。"
    }
  ],
  "data-structures:lab/shell-sort": [
    {
      "id": "ds-shell-1",
      "type": "single",
      "stem": "希尔排序属于哪类排序，且是否稳定？",
      "options": {
        "A": "插入排序的改进（缩小增量），不稳定",
        "B": "交换排序，稳定",
        "C": "选择排序，稳定",
        "D": "归并排序，不稳定"
      },
      "answer": "A",
      "explanation": "希尔排序按增量分组做插入排序，是不稳定的排序算法，平均性能优于直接插入。"
    },
    {
      "id": "ds-shell-2",
      "type": "single",
      "stem": "希尔排序的基本做法是？",
      "options": {
        "A": "按增量分组做插入排序，增量逐步缩小到 1",
        "B": "每次选最小元素",
        "C": "分治合并",
        "D": "按位排序"
      },
      "answer": "A",
      "explanation": "先用较大增量使序列基本有序，再逐步减小增量，最后增量为 1 做插入排序。"
    },
    {
      "id": "ds-shell-4-r2",
      "type": "single",
      "stem": "关于希尔排序的时间复杂度，哪项最准确？",
      "options": {
        "A": "依赖增量序列，不能不指定增量就断言统一平均阶",
        "B": "任何增量均严格O(nlogn)",
        "C": "任何增量均严格O(n)",
        "D": "任何增量均严格O(1)"
      },
      "answer": "A",
      "explanation": "不同增量序列具有不同理论界与实测表现；n^1.3不是希尔排序普遍保证。最后只取增量1甚至等同直接插入。"
    },
    {
      "id": "ds-shell-5",
      "type": "judge",
      "stem": "希尔排序最后一趟的增量为 1，等价于做一次直接插入排序。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "增量为 1 时对整个序列做插入排序，此时序列已基本有序，代价低。"
    },
    {
      "id": "qa-20261002-data-structures-lab-shell-sort-01",
      "type": "single",
      "stem": "对[5,4,3,2,1]做希尔排序仅第一趟增量2，各组直接插入升序后数组是？",
      "options": {
        "A": "[5,2,3,4,1]",
        "B": "[1,2,3,4,5]",
        "C": "[3,2,1,4,5]",
        "D": "[1,4,3,2,5]"
      },
      "answer": "B",
      "explanation": "0,2,4组[5,3,1]变[1,3,5]；1,3组[4,2]变[2,4]，交织恰好全序。"
    }
  ],
  "data-structures:lab/heap-insert": [
    {
      "id": "ds-hins-1",
      "type": "single",
      "stem": "向大根堆插入新元素时，通常先把新元素放在？",
      "options": {
        "A": "数组末尾，再向上调整",
        "B": "堆顶，再向下调整",
        "C": "任意位置",
        "D": "中间位置"
      },
      "answer": "A",
      "explanation": "新元素放末尾后与父结点比较，逐步上滤直到满足堆性质。"
    },
    {
      "id": "ds-hins-2",
      "type": "judge",
      "stem": "堆的插入操作时间复杂度为 O(log n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "上滤最多沿树高移动，树高为 O(log n)。"
    },
    {
      "id": "ds-hins-3",
      "type": "single",
      "stem": "上滤（向上调整）时，若新元素比父结点大则？",
      "options": {
        "A": "与父结点交换并继续上溯",
        "B": "停止",
        "C": "与孩子交换",
        "D": "删除父结点"
      },
      "answer": "A",
      "explanation": "大根堆要求父不小于孩子，故比父大时交换并继续向上比较。"
    },
    {
      "id": "ds-hins-4",
      "type": "judge",
      "stem": "大根堆中任一结点都大于等于其孩子结点。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是大根堆的定义性质，堆顶为全局最大值。"
    },
    {
      "id": "ds-hins-5",
      "type": "single",
      "stem": "堆通常用哪种结构存储？",
      "options": {
        "A": "完全二叉树的顺序（数组）存储",
        "B": "二叉链表",
        "C": "邻接矩阵",
        "D": "十字链表"
      },
      "answer": "A",
      "explanation": "完全二叉树可用数组紧凑表示，父子下标关系直接可算。"
    },
    {
      "id": "exam-data-structures-lab-heap-insert-2024-9-b-r2",
      "type": "single",
      "stem": "0起数组存二叉堆，非根结点下标i≥1，其父下标为？",
      "options": {
        "A": "2i+1",
        "B": "2i+2",
        "C": "i/2+1",
        "D": "⌊(i−1)/2⌋"
      },
      "answer": "D",
      "explanation": "0 起始数组堆中父结点下标是 floor((i−1)/2)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-heap-insert-01",
      "type": "single",
      "stem": "0起大根堆[20,15,18,8,10]插入17，经上滤后数组为？",
      "options": {
        "A": "[20,18,17,8,10,15]",
        "B": "[17,20,18,8,10,15]",
        "C": "[20,15,18,8,10,17]",
        "D": "[20,17,18,8,10,15]"
      },
      "answer": "C",
      "explanation": "新键槽5父槽floor((5−1)/2)=2值18；17≤18不换，并非和槽1的15比较。"
    }
  ],
  "data-structures:lab/radix-sort": [
    {
      "id": "ds-radix-1",
      "type": "single",
      "stem": "基数排序的时间复杂度是（n 个记录、d 位、r 个基数）？",
      "options": {
        "A": "O(d(n+r))",
        "B": "O(n log n)",
        "C": "O(n²)",
        "D": "O(n·d²)"
      },
      "answer": "A",
      "explanation": "基数排序按位分配与收集，共 d 趟，每趟 O(n+r)，且是稳定的排序算法。"
    },
    {
      "id": "ds-radix-3",
      "type": "judge",
      "stem": "基数排序是稳定的排序算法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "分配收集时保持同一位相同者的原顺序，故稳定。"
    },
    {
      "id": "ds-radix-4",
      "type": "single",
      "stem": "基数排序适合下列哪种数据？",
      "options": {
        "A": "关键字位数少、取值范围小的整数或字符串",
        "B": "浮点数且范围极大",
        "C": "记录数很少",
        "D": "任意结构体"
      },
      "answer": "A",
      "explanation": "位数 d 和基数 r 越小越有利，故适合位数少、范围小的键。"
    },
    {
      "id": "ds-radix-5",
      "type": "judge",
      "stem": "基数排序不是基于比较的排序。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "基数排序按位分配收集，不做元素间比较。"
    },
    {
      "id": "qa-20261002-data-structures-lab-radix-sort-01",
      "type": "single",
      "stem": "LSD十进制基数排序[21,13,12,11]，仅个位一趟稳定排序结果是？",
      "options": {
        "A": "[11,12,13,21]",
        "B": "[11,21,12,13]",
        "C": "[13,12,21,11]",
        "D": "[21,11,12,13]"
      },
      "answer": "D",
      "explanation": "个位1桶按原次序保21再11，随后2桶12和3桶13；十位尚未排序。"
    }
  ],
  "data-structures:lab/counting-sort": [
    {
      "id": "ds-cnt-2",
      "type": "judge",
      "stem": "计数排序不是基于比较的排序，时间复杂度为 O(n+k)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "n 为元素数、k 为取值范围，只需统计与放置，无需比较。"
    },
    {
      "id": "ds-cnt-3",
      "type": "single",
      "stem": "计数排序适合下列哪种情况？",
      "options": {
        "A": "关键字为范围不大的整数",
        "B": "任意浮点数",
        "C": "范围极大的稀疏整数",
        "D": "任意字符串"
      },
      "answer": "A",
      "explanation": "需要长度为 k 的计数数组，k 过大则不划算。"
    },
    {
      "id": "ds-cnt-4-r2",
      "type": "judge",
      "stem": "计数数组C[v]存≤v的元素累计数；按位置C[v]−1放置并将C[v]减1时，要保持等键原次序，应从后往前扫描输入。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "从后往前放置可保证相同值的元素保持原相对次序，实现稳定排序。"
    },
    {
      "id": "ds-cnt-5-r2",
      "type": "single",
      "stem": "标准稳定计数排序为n条记录分配输出数组，并为k个键值分配计数数组，辅助空间为？",
      "options": {
        "A": "O(n+k)",
        "B": "O(1)",
        "C": "O(n)",
        "D": "O(nlogk)"
      },
      "answer": "A",
      "explanation": "输出数组n及计数数组k都属于辅助空间，故O(n+k)。只重建裸整数频数的非稳定版本可O(k)。"
    },
    {
      "id": "qa-20261002-data-structures-lab-counting-sort-01",
      "type": "single",
      "stem": "稳定计数排序输入[2a,1b,2c,1d]，累计上界C=[0,2,4]（值0,1,2），从右往左放置，输出为？",
      "options": {
        "A": "[1b,1d,2a,2c]",
        "B": "[1d,1b,2c,2a]",
        "C": "[1b,1d,2c,2a]",
        "D": "[1d,1b,2a,2c]"
      },
      "answer": "A",
      "explanation": "先1d放槽1，2c放槽3，1b放槽0，2a放槽2；等键标签原序保留。"
    }
  ],
  "data-structures:lab/binary-insert-sort": [
    {
      "id": "ds-bins-1",
      "type": "single",
      "stem": "折半插入排序相比直接插入排序改进之处是？",
      "options": {
        "A": "用折半查找确定插入位置，减少比较次数",
        "B": "减少移动次数",
        "C": "降低空间复杂度",
        "D": "使算法稳定"
      },
      "answer": "A",
      "explanation": "在有序区用折半查找定位插入点，比较次数降为 O(n log n)，但移动次数不变。"
    },
    {
      "id": "ds-bins-2",
      "type": "judge",
      "stem": "折半插入排序的元素移动次数与直接插入排序相同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "找到位置后仍需后移元素，移动次数取决于原序列，未减少。"
    },
    {
      "id": "ds-bins-3",
      "type": "single",
      "stem": "折半插入排序的时间复杂度是？",
      "options": {
        "A": "O(n²)",
        "B": "O(n log n)",
        "C": "O(n)",
        "D": "O(log n)"
      },
      "answer": "A",
      "explanation": "移动次数仍为 O(n²)，主导总复杂度。"
    },
    {
      "id": "ds-bins-4-r2",
      "type": "judge",
      "stem": "折半插入排序每次将新元素放在已有所有相等关键字之后，并顺序后移其后记录，则算法稳定。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "折半查找定位时取右侧边界，保持相等元素的相对次序，故稳定。"
    },
    {
      "id": "qa-20261002-data-structures-lab-binary-insert-sort-01",
      "type": "single",
      "stem": "稳定折半插入已有[1a,2b,2c,4d]，新2e应选择的0起插入下标为？",
      "options": {
        "A": "4",
        "B": "3",
        "C": "1",
        "D": "2"
      },
      "answer": "B",
      "explanation": "必须插在所有已有等键之后、4d之前，即upper_bound=3；取1会让2e提前而不稳定。"
    }
  ],
  "data-structures:knowledge/ch1": [
    {
      "id": "ds-wangdao-ch1-1",
      "type": "single",
      "stem": "一条订单记录含订单号、金额、状态。若整条记录作为处理对象，金额属于哪一层概念？",
      "options": {
        "A": "数据项",
        "B": "数据对象",
        "C": "抽象数据类型",
        "D": "存储结构"
      },
      "answer": "A",
      "explanation": "金额是记录内部的组成成分，即数据项；整条订单记录为数据元素。"
    },
    {
      "id": "ds-wangdao-ch1-2",
      "type": "judge",
      "stem": "同一线性表可以采用顺序存储或链式存储，而不改变元素的一对一逻辑关系。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "逻辑结构描述关系，存储结构描述其实现，两者应分开。"
    },
    {
      "id": "ds-wangdao-ch1-3",
      "type": "single",
      "stem": "循环变量i从1开始，每轮乘2，直到i≥n。忽略循环体其他成本，循环次数量级为？",
      "options": {
        "A": "O(n)",
        "B": "O(n²)",
        "C": "O(log n)",
        "D": "O(1)"
      },
      "answer": "C",
      "explanation": "i按2的幂增长，约log₂n轮达到n。"
    },
    {
      "id": "ds-wangdao-ch1-4",
      "type": "judge",
      "stem": "共享同一输入数组的递归函数，辅助空间必为O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "最大同时存在的递归调用现场也占空间；共享输入数组不能消除调用栈。"
    },
    {
      "id": "ds-wangdao-ch1-5",
      "type": "single",
      "stem": "抽象数据类型ADT主要规定什么？",
      "options": {
        "A": "特定语言的指针布局",
        "B": "数学模型及可执行操作",
        "C": "CPU指令序列",
        "D": "固定内存地址"
      },
      "answer": "B",
      "explanation": "ADT规定抽象值域、关系和操作，具体内存表示属于实现。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch1-01",
      "type": "single",
      "stem": "for i=1..n，内层j=1,2,4,...且j≤n；循环体常数成本，总时间量级为？",
      "options": {
        "A": "O(n²)",
        "B": "O(n)",
        "C": "O(nlogn)",
        "D": "O(logn)"
      },
      "answer": "C",
      "explanation": "外n轮内floor(log2n)+1轮，乘积为Theta(nlogn)。"
    }
  ],
  "data-structures:knowledge/ch2": [
    {
      "id": "ds-wangdao-ch2-1",
      "type": "single",
      "stem": "长度为5的顺序表，在第2位（1起）插入新元素，需后移几个旧元素？",
      "options": {
        "A": "2",
        "B": "3",
        "C": "4",
        "D": "5"
      },
      "answer": "C",
      "explanation": "第2至第5个共4个旧元素从后往前移动。"
    },
    {
      "id": "ds-wangdao-ch2-2",
      "type": "judge",
      "stem": "已知单链表结点p的地址，删除其后继且后继存在时，局部改链可为O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "有前驱p即可重接p.next并释放后继；无需遍历定位。"
    },
    {
      "id": "ds-wangdao-ch2-3",
      "type": "single",
      "stem": "带头结点的空循环单链表，常用判空条件是？",
      "options": {
        "A": "head=NULL",
        "B": "head.next=NULL",
        "C": "head.next=head",
        "D": "head.prior=head"
      },
      "answer": "C",
      "explanation": "循环表空时头结点的next指回自己；普通非循环表才常用next=NULL。"
    },
    {
      "id": "ds-wangdao-ch2-4",
      "type": "judge",
      "stem": "静态链表使用数组，因此按逻辑位序取第i个元素一定为O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "静态链表按游标链接表达次序，仍需沿链定位；数组槽位与逻辑位序不同。"
    },
    {
      "id": "ds-wangdao-ch2-5",
      "type": "single",
      "stem": "单链表中把s插在p后，正确的主要指针更新顺序是？",
      "options": {
        "A": "p.next=s；s.next=p.next",
        "B": "s.next=p.next；p.next=s",
        "C": "s.next=p；p.next=NULL",
        "D": "先释放p再连接s"
      },
      "answer": "B",
      "explanation": "先保存旧后继到s.next，再更新p.next，避免丢失原链。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch2-01",
      "type": "single",
      "stem": "单链表head→A→B→C，p指A、q=p.next。执行p.next=q.next后再执行q.next=p.next，若不再改head，B是否仍在主链？",
      "options": {
        "A": "仍在A与C之间",
        "B": "变成首元",
        "C": "所有结点成环",
        "D": "不在，主链A→C"
      },
      "answer": "D",
      "explanation": "第一句A.next=C已绕过B；第二句B.next=C不把B重新接回head可达链，需另接入。"
    }
  ],
  "data-structures:knowledge/ch3": [
    {
      "id": "ds-wangdao-ch3-1",
      "type": "single",
      "stem": "循环队列牺牲一槽，容量数组MaxSize=8，front=6、rear=2，队列长度为？",
      "options": {
        "A": "2",
        "B": "3",
        "C": "4",
        "D": "6"
      },
      "answer": "C",
      "explanation": "(rear−front+8)%8=4，对应槽6、7、0、1。"
    },
    {
      "id": "ds-wangdao-ch3-2",
      "type": "judge",
      "stem": "共享栈左顶初值−1、右顶初值MaxSize，满条件为top1+1=top2。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两个栈从两端增长，当两顶相邻时无空槽。"
    },
    {
      "id": "ds-wangdao-ch3-3",
      "type": "single",
      "stem": "后缀表达式“9 4 - 2 *”的值为？",
      "options": {
        "A": "−10",
        "B": "10",
        "C": "1",
        "D": "18"
      },
      "answer": "B",
      "explanation": "先弹4作右操作数，再弹9作左操作数，得9−4=5，再乘2得10。"
    },
    {
      "id": "ds-wangdao-ch3-4",
      "type": "single",
      "stem": "按下三角行优先压缩4阶对称矩阵，矩阵1起、一维数组0起，a(2,4)存在哪个下标？",
      "options": {
        "A": "5",
        "B": "6",
        "C": "7",
        "D": "8"
      },
      "answer": "C",
      "explanation": "先镜像到a(4,2)，k=4×3/2+2−1=7。"
    },
    {
      "id": "ds-wangdao-ch3-5",
      "type": "judge",
      "stem": "递归空间应按整个运行过程中调用总次数计算，而不看同时在栈中的深度。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "已返回的调用现场已撤销，峰值空间由最大同时存在的调用深度及每层现场决定。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch3-01",
      "type": "single",
      "stem": "二维数组A[3][4]按行优先，0起下标，每项2字节、首址100，A[2][1]地址为？",
      "options": {
        "A": "118",
        "B": "110",
        "C": "116",
        "D": "120"
      },
      "answer": "A",
      "explanation": "线性偏移2×4+1=9项，字节偏移18，地址118。"
    }
  ],
  "data-structures:knowledge/ch4": [
    {
      "id": "ds-wangdao-ch4-1",
      "type": "judge",
      "stem": "仅包含一个空格字符的串，其长度为0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "空格是一个有效字符，该串长1；空串不含任何字符。"
    },
    {
      "id": "ds-wangdao-ch4-2",
      "type": "single",
      "stem": "1起下标朴素匹配中，主串指针i、模式指针j处失配，候选起点后移一位应更新为？",
      "options": {
        "A": "i=i+1，j保持",
        "B": "i=i−j+2，j=1",
        "C": "i=1，j=j+1",
        "D": "i=i−j，j=0"
      },
      "answer": "B",
      "explanation": "当前候选起点为i−j+1，下一起点为i−j+2，模式重置到1。"
    },
    {
      "id": "ds-wangdao-ch4-3",
      "type": "single",
      "stem": "模式ababaca的0起pi为[0,0,1,2,3,0,1]。教材1起next[6]为？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "3",
        "D": "4"
      },
      "answer": "D",
      "explanation": "第6位失配时已匹配前5字符ababa，其最长真前后缀为aba长3，所以next[6]=4。"
    },
    {
      "id": "ds-wangdao-ch4-4",
      "type": "judge",
      "stem": "nextval优化可改变模式串在主串中首次出现的位置。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "nextval跳过确定无益的重复比较，成功位置和匹配语义不变。"
    },
    {
      "id": "ds-wangdao-ch4-5",
      "type": "single",
      "stem": "块链串每块可容纳3字符，逻辑串长5且不计其他信息，最后一块有几个有效字符？",
      "options": {
        "A": "1",
        "B": "2",
        "C": "3",
        "D": "5"
      },
      "answer": "B",
      "explanation": "共两块，第一块3字符，第二块2有效字符，剩余填充不属于串值。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch4-01",
      "type": "single",
      "stem": "两个串S=\"ab\"、T=\"aba\"，按通常字符字典序比较，关系为？",
      "options": {
        "A": "仅长度相同才能比较",
        "B": "S<T",
        "C": "S>T",
        "D": "S=T"
      },
      "answer": "B",
      "explanation": "前两字符相等且S是T的真前缀，较短前缀在字典序中更小。"
    }
  ],
  "data-structures:knowledge/ch5": [
    {
      "id": "ds-wangdao-ch5-1",
      "type": "single",
      "stem": "非空二叉树有7个度2结点，叶结点数为？",
      "options": {
        "A": "6",
        "B": "7",
        "C": "8",
        "D": "14"
      },
      "answer": "C",
      "explanation": "二叉树总有n₀=n₂+1，所以叶数8。"
    },
    {
      "id": "ds-wangdao-ch5-2",
      "type": "judge",
      "stem": "结点标识互异时，先序与后序序列总能唯一确定一般二叉树。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "单孩子是左还是右可能无法区分；一般唯一重建需先序+中序或后序+中序。"
    },
    {
      "id": "ds-wangdao-ch5-3-r2",
      "type": "single",
      "stem": "普通树采用孩子—兄弟方式转成二叉树，原树的后根遍历对应哪一种二叉遍历？",
      "options": {
        "A": "先序",
        "B": "中序",
        "C": "后序",
        "D": "层序"
      },
      "answer": "B",
      "explanation": "孩子—兄弟二叉表示中，左子树代表当前结点的孩子森林，右孩子代表当前结点的下一个兄弟。二叉中序先遍历左侧孩子森林，再访问本结点，最后处理右侧兄弟，得到原树的后根序列。不是先处理当前结点的兄弟再访问当前结点。"
    },
    {
      "id": "ds-wangdao-ch5-4",
      "type": "single",
      "stem": "叶权为2、3、7，哈夫曼构造的WPL为？",
      "options": {
        "A": "12",
        "B": "15",
        "C": "17",
        "D": "24"
      },
      "answer": "C",
      "explanation": "先合并2与3，再与7合并；WPL=2×2+3×2+7=17。"
    },
    {
      "id": "ds-wangdao-ch5-5",
      "type": "judge",
      "stem": "并查集对同一集合的两个元素再次Union时，应直接把代表根链接到自己。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "相同代表元时不再合并；根指向自己可能违背负数标记等表示约定并破坏Find。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch5-01",
      "type": "single",
      "stem": "非空二叉树共20个结点，其中度1结点7个，叶结点数为？",
      "options": {
        "A": "8",
        "B": "13",
        "C": "7",
        "D": "6"
      },
      "answer": "C",
      "explanation": "设n2=x,n0=x+1，20=7+2x+1得x=6，叶7。"
    }
  ],
  "data-structures:knowledge/ch6": [
    {
      "id": "ds-wangdao-ch6-1",
      "type": "judge",
      "stem": "有向图从某顶点一次DFS能访问全部顶点，就可判定该图强连通。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "只说明该点能到达全部顶点，其他顶点不一定能反向到达它。"
    },
    {
      "id": "ds-wangdao-ch6-2",
      "type": "single",
      "stem": "无向图用普通邻接表存储，每条边两个端点各存一个边结点。有E条边时边结点数为？",
      "options": {
        "A": "E",
        "B": "2E",
        "C": "V+E",
        "D": "E/2"
      },
      "answer": "B",
      "explanation": "同一无向边在两个端点的邻接链中各出现一次。"
    },
    {
      "id": "ds-wangdao-ch6-3",
      "type": "single",
      "stem": "普通Dijkstra正确性所需的重要条件是？",
      "options": {
        "A": "所有边权严格正且相同",
        "B": "所有边权非负",
        "C": "图必须无向",
        "D": "图必须是一棵树"
      },
      "answer": "B",
      "explanation": "非负边使已确定的最小距离不会因后续绕行变短；零权边允许。"
    },
    {
      "id": "ds-wangdao-ch6-4",
      "type": "single",
      "stem": "AOV图有约束A→C、B→C，下列哪个是合法拓扑序？",
      "options": {
        "A": "C,A,B",
        "B": "A,C,B",
        "C": "B,A,C",
        "D": "C,B,A"
      },
      "answer": "C",
      "explanation": "A、B都必须在C前，二者可互换。"
    },
    {
      "id": "ds-wangdao-ch6-5",
      "type": "judge",
      "stem": "存在两条不同关键路径时，只缩短其中一条上的活动一定能缩短总工期。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "若另一关键路径长度未变，它仍决定原工期；必须分析该活动是否同时影响所有瓶颈路径。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch6-01",
      "type": "single",
      "stem": "带权无向图AB=−2,BC=1,AC=4。最小生成树权值及Dijkstra普遍正确性的结论为？",
      "options": {
        "A": "2；两算法都禁止负边",
        "B": "−1；Dijkstra必正确",
        "C": "5；负权边不能选",
        "D": "−1；负边下无普遍保证"
      },
      "answer": "D",
      "explanation": "MST选AB、BC权−1，负边不妨碍割性质；标准Dijkstra对负权图无普遍正确性。"
    }
  ],
  "data-structures:knowledge/ch7": [
    {
      "id": "ds-wangdao-ch7-1",
      "type": "single",
      "stem": "某记录查找概率为0.5、0.3、0.2，比较次数为1、2、3，成功ASL为？",
      "options": {
        "A": "1.5",
        "B": "1.7",
        "C": "2",
        "D": "2.3"
      },
      "answer": "B",
      "explanation": "ASL=0.5×1+0.3×2+0.2×3=1.7。"
    },
    {
      "id": "ds-wangdao-ch7-2",
      "type": "judge",
      "stem": "有序单链表可直接按普通数组折半查找获得O(log n)总时间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "链表不支持O(1)中点随机定位，比较次数与总访问成本需要区分。"
    },
    {
      "id": "ds-wangdao-ch7-3",
      "type": "single",
      "stem": "教材m阶B树每结点的最大关键字数为？",
      "options": {
        "A": "m",
        "B": "m+1",
        "C": "m−1",
        "D": "ceil(m/2)"
      },
      "answer": "C",
      "explanation": "m限制最多孩子数，一个结点最多m−1个关键字分隔其孩子范围。"
    },
    {
      "id": "ds-wangdao-ch7-4",
      "type": "judge",
      "stem": "红黑树必须满足每个结点左右子树高度差绝对值≤1。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "这是AVL条件；红黑树用颜色和路径黑高度约束控制高度。"
    },
    {
      "id": "ds-wangdao-ch7-5",
      "type": "single",
      "stem": "线性探测散列表删除某项后，为防止同探测链的其他键提前失败，通常采用？",
      "options": {
        "A": "把槽当作从未使用的空槽",
        "B": "保留墓碑标记或重建探测链",
        "C": "删除后停止所有查找",
        "D": "只改散列函数"
      },
      "answer": "B",
      "explanation": "搜索遇墓碑应继续；从未使用的空槽才可按该规则终止。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch7-01",
      "type": "single",
      "stem": "8槽线性探测，h(k)=k mod8，已按次序插1、9、17，均匀成功查这3键，ASL为？",
      "options": {
        "A": "2",
        "B": "1",
        "C": "3",
        "D": "4/3"
      },
      "answer": "A",
      "explanation": "三个键分别在槽1、2、3，比较1、2、3次，平均(1+2+3)/3=2。"
    }
  ],
  "data-structures:knowledge/ch8": [
    {
      "id": "ds-wangdao-ch8-1",
      "type": "single",
      "stem": "折半插入排序在数组上减少比较次数，但最坏总体时间仍为？",
      "options": {
        "A": "O(log n)",
        "B": "O(n)",
        "C": "O(n log n)",
        "D": "O(n²)"
      },
      "answer": "D",
      "explanation": "后缀搬移最坏累计为O(n²)，二分只降低比较成本。"
    },
    {
      "id": "ds-wangdao-ch8-2",
      "type": "judge",
      "stem": "快速排序在原数组划分，因此任何输入上的全部辅助空间都为O(1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "还须计算递归栈，通常平均O(log n)，退化时可O(n)。"
    },
    {
      "id": "ds-wangdao-ch8-3",
      "type": "single",
      "stem": "自底向上建立二叉堆的总时间量级为？",
      "options": {
        "A": "O(n)",
        "B": "O(n log n)",
        "C": "O(n²)",
        "D": "O(log n)"
      },
      "answer": "A",
      "explanation": "多数结点靠近叶端、下滤短，按层累计为O(n)。"
    },
    {
      "id": "ds-wangdao-ch8-4",
      "type": "single",
      "stem": "10个初始归并段做3路平衡归并，按完整分层轮次模型需要几趟归并？",
      "options": {
        "A": "1",
        "B": "2",
        "C": "3",
        "D": "4"
      },
      "answer": "C",
      "explanation": "ceil(log₃10)=3，因为3²<10≤3³。初始段生成另计。"
    },
    {
      "id": "ds-wangdao-ch8-5",
      "type": "judge",
      "stem": "置换—选择中，本段最近输出20，新读入12时应冻结12到下一段。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "12小于当前段最后输出，放入本段会破坏段内有序，故留待下一段。"
    },
    {
      "id": "qa-20261002-data-structures-knowledge-ch8-01",
      "type": "single",
      "stem": "外排序有17个初始有序段，每趟最多4路归并且每趟所有段参与一次完整分层归并，几趟得到单段？",
      "options": {
        "A": "5",
        "B": "3",
        "C": "2",
        "D": "4"
      },
      "answer": "B",
      "explanation": "段数17→ceil(17/4)=5→ceil(5/4)=2→1，共3；4²=16不足。"
    }
  ]
});
})(window);
