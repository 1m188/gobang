// 主题模块测试（node --test 运行）
// 主题系统对应原版 Qt 的四套 QSS 主题（default/black/gray/yellow）+ 新增 wood：
//   - THEME_NAMES / THEMES：主题清单与每套主题的 Canvas 配置
//   - normalizeTheme：非法主题名回退到默认
//   - loadTheme / saveTheme：经可注入的 store（localStorage 形状）持久化
'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const {
  THEME_NAMES,
  THEMES,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  normalizeTheme,
  loadTheme,
  saveTheme,
} = require('../themes.js');

// 假 localStorage
function fakeStore(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
  };
}

test('主题清单：五套主题，含原版四套命名', () => {
  assert.deepEqual([...THEME_NAMES].sort(), ['black', 'default', 'gray', 'wood', 'yellow']);
  assert.equal(DEFAULT_THEME, 'default');
});

test('每套主题都有完整的 Canvas 绘制配置', () => {
  for (const name of THEME_NAMES) {
    const t = THEMES[name];
    assert.ok(t, `缺少主题 ${name}`);
    assert.equal(typeof t.label, 'string', `${name}.label`);
    assert.match(t.boardBg, /^#/u, `${name}.boardBg`);
    assert.match(t.lineColor, /^#/u, `${name}.lineColor`);
    assert.match(t.starColor, /^#/u, `${name}.starColor`);
    assert.match(t.lastMoveColor, /^#/u, `${name}.lastMoveColor`);
    for (const stoneKey of ['blackStone', 'whiteStone']) {
      const s = t[stoneKey];
      assert.match(s.inner, /^#/u, `${name}.${stoneKey}.inner`);
      assert.match(s.outer, /^#/u, `${name}.${stoneKey}.outer`);
      assert.match(s.stroke, /^#/u, `${name}.${stoneKey}.stroke`);
    }
  }
});

test('normalizeTheme：合法名原样返回，非法名回退默认', () => {
  for (const name of THEME_NAMES) {
    assert.equal(normalizeTheme(name), name);
  }
  assert.equal(normalizeTheme('no-such-theme'), DEFAULT_THEME);
  assert.equal(normalizeTheme(''), DEFAULT_THEME);
  assert.equal(normalizeTheme(undefined), DEFAULT_THEME);
  assert.equal(normalizeTheme(null), DEFAULT_THEME);
});

test('THEME_STORAGE_KEY 为固定键名', () => {
  assert.equal(THEME_STORAGE_KEY, 'gobang-theme');
});

test('loadTheme：从 store 读取合法主题名', () => {
  const store = fakeStore({ [THEME_STORAGE_KEY]: 'black' });
  assert.equal(loadTheme(store), 'black');
});

test('loadTheme：无记录 / 非法记录 / store 不可用时回退默认', () => {
  assert.equal(loadTheme(fakeStore()), DEFAULT_THEME);
  assert.equal(loadTheme(fakeStore({ [THEME_STORAGE_KEY]: 'hacker' })), DEFAULT_THEME);
  assert.equal(loadTheme(null), DEFAULT_THEME);
  // localStorage 访问本身抛异常时也要安全回退
  const throwing = { getItem() { throw new Error('disabled'); } };
  assert.equal(loadTheme(throwing), DEFAULT_THEME);
});

test('saveTheme：写入 store，非法名抛错且不写入', () => {
  const store = fakeStore();
  saveTheme(store, 'wood');
  assert.equal(store.data[THEME_STORAGE_KEY], 'wood');
  assert.throws(() => saveTheme(store, 'no-such-theme'), Error);
  assert.equal(store.data[THEME_STORAGE_KEY], 'wood'); // 未被破坏
});

test('saveTheme：store 不可用时静默跳过', () => {
  assert.doesNotThrow(() => saveTheme(null, 'gray'));
});
