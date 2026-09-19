# Data Structures Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a no-build, offline algorithm visualization site for the six high-value data-structure chapters while moving the existing probability site into its own intact directory.

**Architecture:** Each algorithm module turns a preset case into immutable, complete step snapshots. A shared player selects snapshots and broadcasts them to a structure-specific Canvas renderer, the pseudocode panel, and the state message panel, keeping all four views synchronized.

**Tech Stack:** HTML5, CSS, browser-native JavaScript, Canvas 2D, Node.js built-in test runner.

---

## Scope note

The six algorithm families are independent content modules over one shared player/rendering foundation. Implement foundation and one complete vertical slice first, then add each family as an independently testable increment. The workspace is not currently a Git repository, so the normal commit step is replaced by a verification checkpoint after every task; no repository will be initialized without user direction.

## File map

- `概率论可视化/`: existing probability application and its source material, moved without internal edits.
- `数据结构可视化/index.html`: application shell and script loading order.
- `数据结构可视化/assets/css/main.css`: responsive layout, theme, panels, controls, and drawing legend styles.
- `数据结构可视化/assets/js/app.js`: hash navigation, experiment mounting, code/state updates, and lifecycle cleanup.
- `数据结构可视化/assets/js/core/player.js`: deterministic step index and timed playback state machine.
- `数据结构可视化/assets/js/core/canvas.js`: high-DPI Canvas sizing, palette, and primitive helpers.
- `数据结构可视化/assets/js/core/ui.js`: controls, pseudocode panel, state panel, and error boundary.
- `数据结构可视化/assets/js/visualizers/array.js`: arrays, stack, queue, and sorting states.
- `数据结构可视化/assets/js/visualizers/linked-list.js`: linked nodes and pointer changes.
- `数据结构可视化/assets/js/visualizers/tree.js`: binary, multiway, Huffman, and disjoint-set trees.
- `数据结构可视化/assets/js/visualizers/graph.js`: fixed-position graphs, weighted edges, paths, and tables.
- `数据结构可视化/assets/js/algorithms/*.js`: preset definitions, pseudocode, and step generators by chapter.
- `数据结构可视化/content/chapters.js`: six chapter and experiment registrations.
- `数据结构可视化/tests/*.test.js`: Node tests for player semantics, snapshot contracts, and algorithm outcomes.
- `数据结构可视化/README.md`: local opening instructions and experiment inventory.

### Task 1: Reorganize the workspace safely

**Files:**
- Move: `index.html`, `assets/`, `content/`, `_work/`, `README.md`, `wrong.md`, `26考研数学大纲(1).pdf` to `概率论可视化/`
- Move: `27王道《数据结构》高清带书签.pdf` to `数据结构可视化/`

- [ ] **Step 1: Record exact source paths and reject existing destinations**

Run:

```powershell
$root = (Resolve-Path -LiteralPath '.').Path
$prob = Join-Path $root '概率论可视化'
$ds = Join-Path $root '数据结构可视化'
Test-Path -LiteralPath $prob
Test-Path -LiteralPath $ds
```

Expected: both values are `False` before creating the directories.

- [ ] **Step 2: Create both project directories and move only the named items**

Use `New-Item -ItemType Directory` for the two exact paths, then `Move-Item -LiteralPath` once per named file or directory. Do not use wildcards or recursive deletion.

- [ ] **Step 3: Verify the probability application survived unchanged**

Run:

```powershell
Test-Path '概率论可视化/index.html'
Test-Path '概率论可视化/assets/js/app.js'
Test-Path '概率论可视化/content/ch8.js'
Test-Path '概率论可视化/assets/vendor/katex/katex.min.js'
```

Expected: four `True` values.

### Task 2: Establish the snapshot contract and tests

**Files:**
- Create: `数据结构可视化/assets/js/core/player.js`
- Create: `数据结构可视化/tests/player.test.js`
- Create: `数据结构可视化/tests/contracts.test.js`

- [ ] **Step 1: Write failing player tests**

Test forward/back/reset boundaries, timer replacement, stop-at-end, and subscriber delivery using Node's `node:test` and `assert/strict`. Construct the player with three snapshots and assert indices `0 → 1 → 2`, never `3`, then `reset() → 0`.

- [ ] **Step 2: Run the tests and confirm the missing module failure**

Run: `node --test 数据结构可视化/tests/player.test.js`

Expected: failure because `player.js` does not exist.

- [ ] **Step 3: Implement the browser/Node compatible player API**

Expose these exact methods:

```js
createPlayer({ steps, interval })
player.current()
player.index()
player.next()
player.prev()
player.play()
player.pause()
player.reset()
player.setInterval(ms)
player.subscribe(listener)
player.destroy()
```

Use a UMD-style export: `module.exports` under Node and `window.DS.Player` in the browser.

- [ ] **Step 4: Add snapshot contract assertions**

Every step must have a nonempty string `id`, positive integer `line`, nonempty string `message`, and object `state`. Every registered experiment must have `id`, `title`, `visualizer`, `code`, `presets`, and `createSteps`.

- [ ] **Step 5: Run tests**

Run: `node --test 数据结构可视化/tests/*.test.js`

Expected: all tests pass.

### Task 3: Build the application shell and one vertical slice

**Files:**
- Create: `数据结构可视化/index.html`
- Create: `数据结构可视化/assets/css/main.css`
- Create: `数据结构可视化/assets/js/core/canvas.js`
- Create: `数据结构可视化/assets/js/core/ui.js`
- Create: `数据结构可视化/assets/js/app.js`
- Create: `数据结构可视化/content/chapters.js`
- Create: `数据结构可视化/assets/js/visualizers/array.js`
- Create: `数据结构可视化/assets/js/algorithms/linear.js`

- [ ] **Step 1: Register the six chapter shells and the sequence-list insertion experiment**

Use stable hash routes `#/chapter/<chapter-id>` and `#/lab/<experiment-id>`. The initial experiment returns complete array snapshots containing `values`, `active`, `moved`, `insertIndex`, and `phase`.

- [ ] **Step 2: Create the semantic application shell**

Include sidebar chapter navigation, experiment title, Canvas region, pseudocode `<ol>`, state message, and controls with accessible labels. Load scripts in dependency order and avoid ES modules so `file://` works.

- [ ] **Step 3: Implement high-DPI Canvas primitives**

Provide `fitCanvas`, `clear`, `roundRect`, `arrow`, `drawArrayCell`, `drawNode`, and `drawEdge`. `fitCanvas` must multiply backing dimensions by `devicePixelRatio` while drawing in CSS pixels.

- [ ] **Step 4: Wire the vertical slice**

Changing player index must render the array, highlight `step.line`, replace the state message, update the counter, and set control disabled states. Route changes must call `destroy()` on the previous player.

- [ ] **Step 5: Verify locally**

Run: `python -m http.server 8765 --directory 数据结构可视化`

Expected: `http://127.0.0.1:8765` opens the chapter grid and the sequence-list insertion lab supports all controls.

### Task 4: Complete linear-list and stack/queue modules

**Files:**
- Modify: `数据结构可视化/assets/js/algorithms/linear.js`
- Create: `数据结构可视化/assets/js/algorithms/stack-queue.js`
- Create: `数据结构可视化/assets/js/visualizers/linked-list.js`
- Create: `数据结构可视化/tests/linear-stack.test.js`

- [ ] **Step 1: Write outcome tests**

Assert the final snapshots for sequence deletion, linked insertion/deletion/reversal, stack push/pop, circular queue enqueue/dequeue, bracket matching, and infix-to-postfix conversion. Use presets with empty/full boundary states where meaningful.

- [ ] **Step 2: Confirm tests fail for missing generators**

Run: `node --test 数据结构可视化/tests/linear-stack.test.js`

Expected: missing export failures.

- [ ] **Step 3: Implement immutable generators and renderers**

Linked snapshots store `{ nodes, next, head, pointers }`; circular queue snapshots store `{ values, front, rear, capacity }`; expression snapshots store `{ input, cursor, operators, output }`.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test 数据结构可视化/tests/linear-stack.test.js 数据结构可视化/tests/contracts.test.js`

Expected: all tests pass.

### Task 5: Implement tree algorithms

**Files:**
- Create: `数据结构可视化/assets/js/algorithms/tree.js`
- Create: `数据结构可视化/assets/js/visualizers/tree.js`
- Create: `数据结构可视化/tests/tree.test.js`

- [ ] **Step 1: Write tree invariant tests**

Assert traversal orders, level-order queue states, thread predecessor/successor links, Huffman root weight and leaf codes, and disjoint-set representatives after union.

- [ ] **Step 2: Confirm tests fail for the missing module**

Run: `node --test 数据结构可视化/tests/tree.test.js`

Expected: module-not-found failure.

- [ ] **Step 3: Implement complete tree snapshots**

Each state stores stable node IDs, labels, child links, highlighted nodes/edges, auxiliary stack or queue, and output sequence. Tree layout is derived from IDs and structure without mutating state.

- [ ] **Step 4: Run tree and contract tests**

Run: `node --test 数据结构可视化/tests/tree.test.js 数据结构可视化/tests/contracts.test.js`

Expected: all tests pass.

### Task 6: Implement graph algorithms

**Files:**
- Create: `数据结构可视化/assets/js/algorithms/graph.js`
- Create: `数据结构可视化/assets/js/visualizers/graph.js`
- Create: `数据结构可视化/tests/graph.test.js`

- [ ] **Step 1: Write graph result tests**

For fixed labeled graphs assert BFS/DFS order, Prim/Kruskal MST weight and edge count, Dijkstra distances and predecessors, Floyd final matrix, valid topological order, and critical-path activities.

- [ ] **Step 2: Confirm tests fail**

Run: `node --test 数据结构可视化/tests/graph.test.js`

Expected: module-not-found failure.

- [ ] **Step 3: Implement generators with fixed node coordinates**

Graph states store `{ nodes, edges, activeNodes, activeEdges, visited, frontier, table }`. Keep coordinates in preset data so forward/back navigation never changes layout.

- [ ] **Step 4: Run graph and contract tests**

Run: `node --test 数据结构可视化/tests/graph.test.js 数据结构可视化/tests/contracts.test.js`

Expected: all tests pass.

### Task 7: Implement search algorithms

**Files:**
- Create: `数据结构可视化/assets/js/algorithms/search.js`
- Modify: `数据结构可视化/assets/js/visualizers/tree.js`
- Create: `数据结构可视化/tests/search.test.js`

- [ ] **Step 1: Write search invariant tests**

Assert binary-search interval shrinkage, BST in-order ordering after insert/delete, AVL balance factors after LL/RR/LR/RL rotations, B-tree node capacity/order after split, and hash probe/chaining results.

- [ ] **Step 2: Confirm tests fail**

Run: `node --test 数据结构可视化/tests/search.test.js`

Expected: missing export failures.

- [ ] **Step 3: Implement search snapshots**

Binary search uses array states; BST/AVL/B-tree use stable tree IDs; hash states expose buckets, probe index, collision status, and chain contents.

- [ ] **Step 4: Run search and contract tests**

Run: `node --test 数据结构可视化/tests/search.test.js 数据结构可视化/tests/contracts.test.js`

Expected: all tests pass.

### Task 8: Implement sorting algorithms and comparison

**Files:**
- Create: `数据结构可视化/assets/js/algorithms/sort.js`
- Modify: `数据结构可视化/assets/js/visualizers/array.js`
- Create: `数据结构可视化/tests/sort.test.js`

- [ ] **Step 1: Write sorting correctness tests**

Run all seven sort generators against the same preset, assert ascending final output and assert algorithm-specific state such as quick-sort pivot, heap boundary, merge ranges, and Shell gap.

- [ ] **Step 2: Confirm tests fail**

Run: `node --test 数据结构可视化/tests/sort.test.js`

Expected: module-not-found failure.

- [ ] **Step 3: Implement generators and comparison snapshots**

Each algorithm records comparisons, writes, active indices, fixed/sorted indices, and its special state. The comparison experiment aligns algorithms by normalized progress and displays operation counters without claiming wall-clock performance.

- [ ] **Step 4: Run sort and contract tests**

Run: `node --test 数据结构可视化/tests/sort.test.js 数据结构可视化/tests/contracts.test.js`

Expected: all tests pass.

### Task 9: Integration, resilience, and documentation

**Files:**
- Modify: `数据结构可视化/assets/js/app.js`
- Modify: `数据结构可视化/assets/css/main.css`
- Create: `数据结构可视化/tests/integration.test.js`
- Create: `数据结构可视化/README.md`

- [ ] **Step 1: Add registry integrity tests**

Assert every chapter points to existing experiments, every visualizer name is registered, every experiment has at least two valid snapshots, all code-line references are within bounds, and IDs are globally unique.

- [ ] **Step 2: Implement lifecycle and experiment error boundaries**

Pause on `visibilitychange`; stop and destroy the old player on route changes; catch generator/render errors inside the lab and show a local retry panel while leaving navigation usable.

- [ ] **Step 3: Complete responsive styling and README**

Document direct opening and local-server opening, list all experiments, state that source material defines scope but the site uses original wording and examples, and document keyboard controls.

- [ ] **Step 4: Run the full automated suite**

Run: `node --test 数据结构可视化/tests/*.test.js`

Expected: zero failures.

- [ ] **Step 5: Run browser smoke checks**

Open every lab at desktop and narrow widths. Verify forward/back/play/pause/reset/speed, code-line synchronization, route cleanup, Canvas resizing, theme repaint, and direct `file://` operation.

- [ ] **Step 6: Re-run the existing probability verification scripts**

Run: `python 概率论可视化/_work/verify_all.py`

Expected: the same pass result as before relocation; if scripts encode old absolute paths, update only those paths and rerun.
