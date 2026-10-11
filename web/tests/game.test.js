// 五子棋核心逻辑测试（node --test 运行）
// 复刻 Qt 版 GameScene 的核心行为：
//   - 15x15 棋盘（坐标 1..15），黑棋先行，轮流落子
//   - 已占用的交点、越界坐标拒绝落子
//   - 横/竖/两条斜线「恰好 5 连」判胜（六连及以上不算，与原版 num == 5 一致）
//   - 胜利后不再接受落子；reset 清盘回到黑先
//   - pickPoint 与原版 10px 命中半径一致（sqrt 距离 < 10）
'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { GobangGame, isWin, pickPoint, BLACK, WHITE, LINE_NUM } = require('../game.js');

// 依次落子的辅助：按传入坐标顺序落子，返回每一步的结果
function playMoves(game, moves) {
  return moves.map(([x, y]) => game.place(x, y));
}

test('新对局：黑棋先行，15x15 棋盘为空，状态 playing', () => {
  const g = new GobangGame();
  assert.equal(g.currentPlayer, BLACK);
  assert.equal(g.status, 'playing');
  assert.equal(LINE_NUM, 15);
  for (let x = 1; x <= LINE_NUM; x++) {
    for (let y = 1; y <= LINE_NUM; y++) {
      assert.equal(g.stoneAt(x, y), null, `(${x},${y}) 应为空`);
    }
  }
});

test('黑白轮流落子', () => {
  const g = new GobangGame();
  assert.ok(g.place(8, 8).ok);
  assert.equal(g.currentPlayer, WHITE);
  assert.ok(g.place(9, 8).ok);
  assert.equal(g.currentPlayer, BLACK);
  assert.equal(g.stoneAt(8, 8), BLACK);
  assert.equal(g.stoneAt(9, 8), WHITE);
});

test('已有棋子的交点拒绝落子且不改变状态', () => {
  const g = new GobangGame();
  assert.ok(g.place(5, 5).ok);
  assert.equal(g.place(5, 5).ok, false);
  assert.equal(g.stoneAt(5, 5), BLACK); // 棋子未被覆盖
  assert.equal(g.currentPlayer, WHITE); // 回合未变
});

test('越界坐标拒绝落子', () => {
  const g = new GobangGame();
  for (const [x, y] of [[0, 8], [16, 8], [8, 0], [8, 16]]) {
    assert.equal(g.place(x, y).ok, false, `(${x},${y}) 应越界`);
  }
  assert.equal(g.status, 'playing');
});

test('横向恰好五连判胜', () => {
  const g = new GobangGame();
  const results = playMoves(g, [
    [3, 8], [3, 9], // 黑 白
    [4, 8], [4, 9],
    [5, 8], [5, 9],
    [6, 8], [6, 9],
    [7, 8],         // 黑第 5 子
  ]);
  assert.ok(results.every((r) => r.ok));
  assert.equal(g.status, 'black-win');
});

test('纵向五连判胜', () => {
  const g = new GobangGame();
  playMoves(g, [
    [8, 3], [9, 3],
    [8, 4], [9, 4],
    [8, 5], [9, 5],
    [8, 6], [9, 6],
    [8, 7],
  ]);
  assert.equal(g.status, 'black-win');
});

test('左上到右下斜线五连判胜', () => {
  const g = new GobangGame();
  playMoves(g, [
    [3, 3], [3, 4],
    [4, 4], [4, 5],
    [5, 5], [5, 6],
    [6, 6], [6, 7],
    [7, 7],
  ]);
  assert.equal(g.status, 'black-win');
});

test('右上到左下斜线五连判胜', () => {
  const g = new GobangGame();
  playMoves(g, [
    [11, 3], [11, 4],
    [10, 4], [10, 5],
    [9, 5], [9, 6],
    [8, 6], [8, 7],
    [7, 7],
  ]);
  assert.equal(g.status, 'black-win');
});

test('六连及以上不判胜（复刻原版 num == 5 行为）', () => {
  const g = new GobangGame();
  // 逐子加长横向连必然先经过「恰好五连」，因此用原版 quirk 的真实触发方式：
  // 黑棋两条四连之间留一个空位，最后一手桥接成九连——全程从未出现恰好五连
  playMoves(g, [
    [1, 8], [3, 9],
    [2, 8], [5, 9],
    [3, 8], [7, 9],
    [4, 8], [9, 9],   // 黑棋左段四连
    [6, 8], [11, 9],
    [7, 8], [13, 9],
    [8, 8], [2, 2],
    [9, 8], [2, 4],   // 黑棋右段四连
    [5, 8],           // 桥接成九连
  ]);
  assert.equal(g.status, 'playing'); // 九连 ≠ 恰好五连，不判胜
});

test('四连不判胜', () => {
  const g = new GobangGame();
  playMoves(g, [
    [3, 8], [3, 9],
    [4, 8], [4, 9],
    [5, 8], [5, 9],
    [6, 8], [6, 9],
  ]);
  assert.equal(g.status, 'playing');
});

test('isWin：同色连续才算连，有缺口不算', () => {
  assert.equal(isWin([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]), true);
  assert.equal(isWin([[1, 1], [2, 1], [3, 1], [4, 1], [6, 1]]), false); // 缺 (5,1)
  assert.equal(isWin([[5, 1], [5, 2], [5, 3], [5, 4], [5, 5]]), true);  // 竖向
  assert.equal(isWin([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]), true);  // 撇向对角
  assert.equal(isWin([[5, 1], [4, 2], [3, 3], [2, 4], [1, 5]]), true);  // 捺向对角
  assert.equal(isWin([[1, 1], [2, 1], [3, 1], [4, 1]]), false);         // 不足五连
  assert.equal(isWin([]), false);
});

test('白棋五连判胜', () => {
  const g = new GobangGame();
  playMoves(g, [
    [1, 1], [3, 8], // 黑 白
    [2, 1], [4, 8],
    [3, 1], [5, 8],
    [4, 1], [6, 8],
    [13, 13], [7, 8], // 白第 5 子（黑棋散子不成五连）
  ]);
  assert.equal(g.status, 'white-win');
});

test('胜利后拒绝继续落子', () => {
  const g = new GobangGame();
  playMoves(g, [
    [3, 8], [3, 9],
    [4, 8], [4, 9],
    [5, 8], [5, 9],
    [6, 8], [6, 9],
    [7, 8],
  ]);
  assert.equal(g.status, 'black-win');
  assert.equal(g.place(9, 9).ok, false); // 胜利后不可再落子
  assert.equal(g.stoneAt(9, 9), null);
});

test('reset 清盘并回到黑棋先行', () => {
  const g = new GobangGame();
  g.place(8, 8);
  g.place(9, 8);
  g.reset();
  assert.equal(g.currentPlayer, BLACK);
  assert.equal(g.status, 'playing');
  assert.equal(g.stoneAt(8, 8), null);
  assert.equal(g.stoneAt(9, 8), null);
  // 重开后仍可正常落子
  assert.ok(g.place(7, 7).ok);
});

test('pickPoint：交点 10px 内命中，之外不命中（与原版一致）', () => {
  // 坐标换算：交点 (x, y) 的像素位置为 (x * interval, y * interval)
  assert.deepEqual(pickPoint(80, 40, 40), { x: 2, y: 1 });   // 正中交点
  assert.deepEqual(pickPoint(80, 49, 40), { x: 2, y: 1 });   // 偏 9px 仍命中
  assert.equal(pickPoint(80, 50, 40), null);                 // 恰好 10px 不命中（原版为严格小于）
  assert.equal(pickPoint(20, 20, 40), null);                 // 远离交点（距最近交点约 28px）
  assert.deepEqual(pickPoint(41, 41, 40), { x: 1, y: 1 });   // sqrt(2) ≈ 1.4px
  assert.deepEqual(pickPoint(200, 200, 40), { x: 5, y: 5 }); // 交点正中
});

test('平局：棋盘下满且无人五连', () => {
  const g = new GobangGame();
  // 构造无任何方向五连的满盘涂色：p(x,y) = (x + 2y) mod 4 < 2
  // 四个方向上同色最长连都只有 2；15x15 下 p=0 恰好 113 个（黑棋手数）、p=1 恰好 112 个（白棋手数）
  // （注意不能用只依赖 x+y 的图案：反斜线方向 x+y 恒定，会形成整条同色连）
  const zeros = [];
  const ones = [];
  for (let y = 1; y <= 15; y++) {
    for (let x = 1; x <= 15; x++) {
      (x + 2 * y) % 4 < 2 ? zeros.push([x, y]) : ones.push([x, y]);
    }
  }
  assert.equal(zeros.length, 113);
  assert.equal(ones.length, 112);
  const order = [];
  for (let i = 0; i < ones.length; i++) order.push(zeros[i], ones[i]);
  order.push(zeros[112]);
  assert.equal(order.length, 225);
  const results = playMoves(g, order);
  assert.ok(results.every((r) => r.ok), '225 步都应成功');
  assert.equal(g.status, 'draw');
});
