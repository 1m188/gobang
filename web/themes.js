// 五子棋主题系统
// default/black/gray/yellow 四套移植自原版 Qt 的 QSS 配色，wood 为新增木纹风。
// DOM 侧配色由 style.css 的 body[data-theme] 变量驱动；本文件提供 Canvas 侧
// 的绘制配置，以及主题名校验与持久化（对应原版 Config 读写 config.ini）。
'use strict';

const DEFAULT_THEME = 'default';
const THEME_STORAGE_KEY = 'gobang-theme';

// 每套主题的 Canvas 绘制配置：
//   boardBg / lineColor / starColor / lastMoveColor：棋盘底色、线、星位、最后一手标记
//   blackStone / whiteStone：黑白的径向渐变起止色与描边色
const THEMES = {
  // 原版 default.qss 为空 = Qt 默认浅色窗口，GameScene 棋盘刷白
  default: {
    label: '默认',
    boardBg: '#ffffff',
    lineColor: '#000000',
    starColor: '#000000',
    lastMoveColor: '#e02020',
    blackStone: { inner: '#666666', outer: '#000000', stroke: '#000000' },
    whiteStone: { inner: '#ffffff', outer: '#d0d0d0', stroke: '#000000' },
  },
  // 移植 black.qss：#222 底 / #BBB 文字 / #333 边框 / 黄色强调
  black: {
    label: '暗黑',
    boardBg: '#191919',
    lineColor: '#888888',
    starColor: '#777777',
    lastMoveColor: '#ffd700',
    blackStone: { inner: '#5a5a5a', outer: '#000000', stroke: '#777777' },
    whiteStone: { inner: '#eeeeee', outer: '#b0b0b0', stroke: '#777777' },
  },
  // 移植 gray.qss：#888 底 / #555 边框 / 按下黑底白字
  gray: {
    label: '灰色',
    boardBg: '#aaaaaa',
    lineColor: '#333333',
    starColor: '#333333',
    lastMoveColor: '#cc0000',
    blackStone: { inner: '#555555', outer: '#000000', stroke: '#000000' },
    whiteStone: { inner: '#ffffff', outer: '#cccccc', stroke: '#333333' },
  },
  // 移植 yellow.qss：beige 底 / palegoldenrod 按钮 / darkkhaki 边框
  yellow: {
    label: '米黄',
    boardBg: '#fff8dc',
    lineColor: '#8b6f47',
    starColor: '#8b6f47',
    lastMoveColor: '#c0392b',
    blackStone: { inner: '#555555', outer: '#000000', stroke: '#000000' },
    whiteStone: { inner: '#fffdf5', outer: '#e0d8b8', stroke: '#8b6f47' },
  },
  // 新增木纹风：暖棕页面 + 木色棋盘（grain 开启棋盘横向木纹条纹）
  wood: {
    label: '木纹',
    boardBg: '#d9a75d',
    lineColor: '#5a3a1a',
    starColor: '#5a3a1a',
    lastMoveColor: '#cc2200',
    blackStone: { inner: '#666666', outer: '#000000', stroke: '#000000' },
    whiteStone: { inner: '#fffaf0', outer: '#d8c49a', stroke: '#5a3a1a' },
    grain: true,
  },
};

const THEME_NAMES = ['default', 'black', 'gray', 'yellow', 'wood'];

// 非法主题名回退默认
function normalizeTheme(name) {
  return THEME_NAMES.includes(name) ? name : DEFAULT_THEME;
}

// 从 store（localStorage 形状）读取主题；store 不可用或记录非法时回退默认
function loadTheme(store) {
  try {
    if (!store || typeof store.getItem !== 'function') {
      return DEFAULT_THEME;
    }
    return normalizeTheme(store.getItem(THEME_STORAGE_KEY));
  } catch (e) {
    return DEFAULT_THEME;
  }
}

// 写入 store；非法主题名抛错，store 不可用时静默跳过
function saveTheme(store, name) {
  if (!store) {
    return;
  }
  if (!THEME_NAMES.includes(name)) {
    throw new Error('未知主题：' + name);
  }
  store.setItem(THEME_STORAGE_KEY, name);
}

// node 测试环境导出；浏览器中由 game.js 直接使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    THEME_NAMES,
    THEMES,
    DEFAULT_THEME,
    THEME_STORAGE_KEY,
    normalizeTheme,
    loadTheme,
    saveTheme,
  };
}
