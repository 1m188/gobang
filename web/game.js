// 五子棋核心逻辑（复刻 Qt 版 GameScene 的玩法）
// 纯逻辑与 DOM 无关：node 下可直接 require 测试；浏览器下由本文件的 UI 部分使用。
'use strict';

// ===== 常量（与原版一致）=====
const LINE_NUM = 15;      // 横竖线的数量（原版 lineNum）
const BLACK = 'black';    // 黑棋
const WHITE = 'white';    // 白棋
const HIT_RADIUS = 10;    // 落子命中半径（像素），原版为 sqrt 距离 < 10

const keyOf = (x, y) => x + ',' + y;

// ===== 判胜（照搬原版 GameScene::isWin / isExist 的算法）=====
// stones 为同一颜色棋子的坐标数组 [x, y]
// 与原版一致：对每颗棋子向两侧延伸计数，恰好 num === 5 才算胜
// （六连及以上反而不算胜，忠实复刻原版行为）
function isWin(stones) {
  const isExist = (x, y) => stones.some(([sx, sy]) => sx === x && sy === y);
  // 上下 / 左右 / 左上右下 / 右上左下 四个方向
  const directions = [
    [0, 1],
    [1, 0],
    [-1, -1],
    [1, -1],
  ];
  for (const [sx, sy] of stones) {
    for (const [dx, dy] of directions) {
      let num = 1;
      for (let i = 1; isExist(sx + dx * i, sy + dy * i); i++) {
        num++;
      }
      for (let i = 1; isExist(sx - dx * i, sy - dy * i); i++) {
        num++;
      }
      if (num === 5) {
        return true;
      }
    }
  }
  return false;
}

// ===== 点击拾取（照搬原版 mousePressEvent 的命中判定）=====
// 交点 (x, y) 的像素位置为 (x * interval, y * interval)，与点击处距离严格小于 10px 才命中
function pickPoint(mx, my, interval) {
  for (let x = 1; x <= LINE_NUM; x++) {
    for (let y = 1; y <= LINE_NUM; y++) {
      const dist = Math.hypot(x * interval - mx, y * interval - my);
      if (dist < HIT_RADIUS) {
        return { x, y };
      }
    }
  }
  return null;
}

// ===== 对局状态机 =====
// status: 'playing' | 'black-win' | 'white-win' | 'draw'
class GobangGame {
  constructor() {
    this.reset();
  }

  // 重开一局：清空棋盘，黑棋先行（对应原版再来一局的重新初始化）
  reset() {
    this._stones = new Map(); // "x,y" -> BLACK | WHITE
    this._current = BLACK;    // 原版 whichPlayer 初始为 black
    this._status = 'playing';
    this._lastMove = null;    // 最后一手，用于 UI 标记
  }

  get currentPlayer() {
    return this._current;
  }

  get status() {
    return this._status;
  }

  get lastMove() {
    return this._lastMove;
  }

  stoneAt(x, y) {
    return this._stones.get(keyOf(x, y)) ?? null;
  }

  // 落子：合法时写入棋子、判定输赢并换手
  place(x, y) {
    if (this._status !== 'playing') {
      return { ok: false, reason: 'game-over' };
    }
    if (
      !Number.isInteger(x) || !Number.isInteger(y) ||
      x < 1 || x > LINE_NUM || y < 1 || y > LINE_NUM
    ) {
      return { ok: false, reason: 'out-of-range' };
    }
    const key = keyOf(x, y);
    if (this._stones.has(key)) {
      return { ok: false, reason: 'occupied' };
    }

    const mover = this._current;
    this._stones.set(key, mover);
    this._lastMove = { x, y };

    // 判定输赢：检查刚刚落子的一方（对应原版换手后检查上一手的一方）
    const moverStones = [];
    for (const [k, color] of this._stones) {
      if (color === mover) {
        const [sx, sy] = k.split(',').map(Number);
        moverStones.push([sx, sy]);
      }
    }
    if (isWin(moverStones)) {
      this._status = mover === BLACK ? 'black-win' : 'white-win';
      return { ok: true };
    }
    if (this._stones.size === LINE_NUM * LINE_NUM) {
      this._status = 'draw';
      return { ok: true };
    }

    this._current = mover === BLACK ? WHITE : BLACK;
    return { ok: true };
  }
}

// ===== 浏览器 UI 部分（对应原版 StartScene / GameScene 的界面与交互） =====
if (typeof document !== 'undefined') {
  const CANVAS_SIZE = 640;                          // 画布边长（像素）
  const INTERVAL = CANVAS_SIZE / (LINE_NUM + 1);    // 线间距，对应原版 interval = width / (lineNum + 1)

  // 星位与天元（15 路棋盘，坐标 1..15）
  const STAR_POINTS = [[4, 4], [4, 12], [8, 8], [12, 4], [12, 12]];
  // 木纹条纹位置 [y, 高度]（固定值保证重绘稳定，仅 wood 主题使用）
  const GRAIN_BANDS = [
    [28, 6], [86, 4], [149, 9], [207, 5], [283, 7],
    [341, 4], [419, 8], [497, 5], [563, 7], [611, 4],
  ];

  const TITLES = {
    [BLACK]: '五子棋-请黑棋落子',
    [WHITE]: '五子棋-请白棋落子',
  };

  const game = new GobangGame();

  const startScene = document.getElementById('start-scene');
  const gameScene = document.getElementById('game-scene');
  const statusTitle = document.getElementById('status-title');
  const canvas = document.getElementById('board');
  const backButton = document.getElementById('back-button');
  const startButton = document.getElementById('start-button');
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');
  const modalYes = document.getElementById('modal-yes');
  const modalNo = document.getElementById('modal-no');
  const themeSelect = document.getElementById('theme-select');
  const ctx = canvas.getContext('2d');

  // 场景切换（对应原版场景间的 show / hide 切换）
  function showScene(name) {
    startScene.classList.toggle('hidden', name !== 'start');
    gameScene.classList.toggle('hidden', name !== 'game');
  }

  // 初始化画布：按设备像素比放大实际分辨率，保证线条清晰
  function initCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // 绘制棋盘与棋子（对应原版 paintEvent，配色随主题）
  function drawBoard() {
    const theme = THEMES[currentTheme];
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // 棋盘底色
    ctx.fillStyle = theme.boardBg;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // 木纹条纹（仅 wood 主题）：固定位置横条，保证重绘稳定
    if (theme.grain) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#8a5a24';
      for (const [bandY, bandH] of GRAIN_BANDS) {
        ctx.fillRect(0, bandY, CANVAS_SIZE, bandH);
      }
      ctx.restore();
    }
    // 背景线：第 1..15 条，两端通到画布边缘，与原版一致
    ctx.strokeStyle = theme.lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i <= LINE_NUM; i++) {
      const p = i * INTERVAL;
      ctx.moveTo(0, p);
      ctx.lineTo(CANVAS_SIZE, p);
      ctx.moveTo(p, 0);
      ctx.lineTo(p, CANVAS_SIZE);
    }
    ctx.stroke();
    // 星位与天元
    ctx.fillStyle = theme.starColor;
    for (const [sx, sy] of STAR_POINTS) {
      ctx.beginPath();
      ctx.arc(sx * INTERVAL, sy * INTERVAL, INTERVAL * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    // 棋子：圆心在交点上，直径等于线间距；径向渐变高光 + 落影
    for (let x = 1; x <= LINE_NUM; x++) {
      for (let y = 1; y <= LINE_NUM; y++) {
        const stone = game.stoneAt(x, y);
        if (stone === null) {
          continue;
        }
        const cx = x * INTERVAL;
        const cy = y * INTERVAL;
        const r = INTERVAL / 2;
        const cfg = stone === BLACK ? theme.blackStone : theme.whiteStone;
        const grad = ctx.createRadialGradient(
          cx - r * 0.35, cy - r * 0.35, r * 0.1,
          cx, cy, r
        );
        grad.addColorStop(0, cfg.inner);
        grad.addColorStop(1, cfg.outer);
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = cfg.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
        // 最后一手标记环
        if (game.lastMove && game.lastMove.x === x && game.lastMove.y === y) {
          ctx.strokeStyle = theme.lastMoveColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }

  // 刷新标题与棋盘（对应原版 setWindowTitle + update）
  function refresh() {
    statusTitle.textContent = TITLES[game.currentPlayer];
    drawBoard();
  }

  // 对局结束弹窗（对应原版 QMessageBox::information）
  function showEndModal() {
    if (game.status === 'black-win') {
      modalText.textContent = '游戏结束，黑棋胜！是否想要再来一局？';
    } else if (game.status === 'white-win') {
      modalText.textContent = '游戏结束，白棋胜！是否想要再来一局？';
    } else {
      modalText.textContent = '平局！是否想要再来一局？';
    }
    modal.classList.remove('hidden');
  }

  // 落子（对应原版 mousePressEvent：交点 10px 内命中后落子）
  canvas.addEventListener('click', (event) => {
    if (game.status !== 'playing') {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mx = (event.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const my = (event.clientY - rect.top) * (CANVAS_SIZE / rect.height);
    const point = pickPoint(mx, my, INTERVAL);
    if (!point) {
      return;
    }
    const result = game.place(point.x, point.y);
    if (!result.ok) {
      return;
    }
    refresh();
    if (game.status !== 'playing') {
      showEndModal();
    }
  });

  // 开始新游戏：重开一局并进入游戏场景（对应原版 StartScene::newGameButtonClicked）
  startButton.addEventListener('click', () => {
    game.reset();
    modal.classList.add('hidden');
    showScene('game');
    refresh();
  });

  // 游戏中返回首页
  backButton.addEventListener('click', () => {
    showScene('start');
  });

  // 弹窗「再来一局」：清盘重开、黑棋先行（对应原版 QMessageBox::Yes 分支）
  modalYes.addEventListener('click', () => {
    game.reset();
    modal.classList.add('hidden');
    refresh();
  });

  // 弹窗「返回首页」：回到开始场景（对应原版 QMessageBox::No 分支）
  modalNo.addEventListener('click', () => {
    modal.classList.add('hidden');
    showScene('start');
  });

  // ===== 主题初始化（对应原版 Config 的持久化，存 localStorage） =====
  // localStorage 访问可能被浏览器禁用，安全降级为仅切换、不持久化
  const themeStore = (() => {
    try {
      return window.localStorage;
    } catch (e) {
      return null;
    }
  })();
  let currentTheme = loadTheme(themeStore);

  // 应用主题：设置 body 属性、同步下拉框并重绘棋盘
  function applyTheme(name) {
    currentTheme = normalizeTheme(name);
    document.body.dataset.theme = currentTheme;
    themeSelect.value = currentTheme;
    refresh();
  }

  for (const name of THEME_NAMES) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = THEMES[name].label;
    themeSelect.appendChild(option);
  }
  themeSelect.addEventListener('change', () => {
    const name = normalizeTheme(themeSelect.value);
    saveTheme(themeStore, name);
    applyTheme(name);
  });

  initCanvas();
  applyTheme(currentTheme);
}

// node 测试环境导出；浏览器中由上方 UI 部分直接使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GobangGame, isWin, pickPoint, BLACK, WHITE, LINE_NUM, HIT_RADIUS };
}
