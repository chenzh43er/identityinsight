/**
 * Fix UTF-8 truncation corruption (�? and ??) across HTML files.
 * Run: node scripts/fix-encoding-corruption.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function walkHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'shared', 'scripts', 'worker'].includes(entry.name)) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const REPLACEMENTS = [
  // Critical HTML breakage
  [/id="menuToggle">\uFFFD\?\/button>/g, 'id="menuToggle">☰</button>'],
  [/id="menuToggle">\?\?\/button>/g, 'id="menuToggle">☰</button>'],
  [
    /toggle\.textContent = isOpen \? '×' : '\uFFFD\?[^'\n]*/g,
    "toggle.textContent = isOpen ? '×' : '☰'; // 用字符切换：汉堡 ☰ X",
  ],
  [
    /toggle\.textContent = isOpen \? '×' : '\?\?[^'\n]*/g,
    "toggle.textContent = isOpen ? '×' : '☰'; // 用字符切换：汉堡 ☰ X",
  ],

  // Breadcrumb separators
  [/<\/li>\s*\r?\n\s*\uFFFD\?\s*\r?\n\s*<li>/g, '</li>\n      >\n      <li>'],
  [/<\/li>\s*\r?\n\s*\?\?\s*\r?\n\s*<li>/g, '</li>\n      >\n      <li>'],
  [/`\s*\r?\n\s*\uFFFD\?\s*\r?\n\s*<li>/g, '`\n      >\n      <li>'],

  // En dashes in date ranges and prose
  [/(\d)\s*\uFFFD\?(\s*[A-Za-z])/g, '$1 –$2'],
  [/(\d)\s*\?\?(\s*[A-Za-z])/g, '$1 –$2'],
  [/(\d)\s*\uFFFD\?(\s*\d)/g, '$1 – $2'],
  [/(\d)\s*\?\?(\s*\d)/g, '$1 – $2'],
  [/(\w)\s*\uFFFD\?(\s*[A-Z])/g, '$1 – $2'],
  [/(\w)\s*\?\?(\s*[A-Z])/g, '$1 – $2'],
  [/maart\s*\uFFFD\?(\d)/g, 'maart – $1'],
  [/March\s*\uFFFD\?(\d)/g, 'March – $1'],
  [/March\s*\?\?(\d)/g, 'March – $1'],
  [/April\s*\uFFFD\?(\d)/g, 'April – $1'],
  [/April\s*\?\?(\d)/g, 'April – $1'],
  [/May\s*\uFFFD\?(\d)/g, 'May – $1'],
  [/May\s*\?\?(\d)/g, 'May – $1'],
  [/Zodiacus\\"\uFFFD\?/g, 'Zodiacus\\", '],
  [/Zodiacus\\"\?\?/g, 'Zodiacus\\", '],
  [/Zodiaken\uFFFD\?/g, 'Zodiaken – '],
  [/Zodiaken\?\?/g, 'Zodiaken – '],
  [/Zodiacus,\uFFFD\?/g, 'Zodiacus,” '],
  [/Zodiacus,\?\?/g, 'Zodiacus,” '],
  [/Astrologi\s*\uFFFD\?Vanlige/g, 'Astrologi – Vanlige'],
  [/Astrologi\s*\?\?Vanlige/g, 'Astrologi – Vanlige'],
  [/djurskretsen\uFFFD\?/g, 'djurskretsen”.'],
  [/djurskretsen\?\?/g, 'djurskretsen”.'],
  [/animals\.\uFFFD\?/g, 'animals.”'],
  [/animals\.\?\?/g, 'animals.”'],

  // Smart quotes in legal / privacy copy
  [/“Company\uFFFD\?/g, '“Company”,'],
  [/“Company\?\?/g, '“Company”,'],
  [/“we\uFFFD\?/g, '“we”,'],
  [/“we\?\?/g, '“we”,'],
  [/“us\uFFFD\?/g, '“us”,'],
  [/“us\?\?/g, '“us”,'],
  [/“our\uFFFD\?/g, '“our”,'],
  [/“our\?\?/g, '“our”,'],
  [/“IdentityInsight\uFFFD\?/g, '“IdentityInsight”,'],
  [/“IdentityInsight\?\?/g, '“IdentityInsight”,'],
  [/“Website\uFFFD\?/g, '“Website”.'],
  [/“Website\?\?/g, '“Website”.'],
  [/“Facebook Pixel\uFFFD\?/g, '“Facebook Pixel”'],
  [/“Facebook Pixel\?\?/g, '“Facebook Pixel”'],
  [/“App Analytics\uFFFD\?/g, '“App Analytics”'],
  [/“App Analytics\?\?/g, '“App Analytics”'],
  [/“Facebook Re\/Marketing Functions\uFFFD\?/g, '“Facebook Re/Marketing Functions”'],
  [/“Facebook Re\/Marketing Functions\?\?/g, '“Facebook Re/Marketing Functions”'],
  [/“Facebook-Ads\uFFFD\?/g, '“Facebook-Ads”'],
  [/“Facebook-Ads\?\?/g, '“Facebook-Ads”'],
  [/“Google Marketing Services\uFFFD\?/g, '“Google Marketing Services”'],
  [/“Google Marketing Services\?\?/g, '“Google Marketing Services”'],
  [/“DoubleClick\uFFFD\?/g, '“DoubleClick”'],
  [/“DoubleClick\?\?/g, '“DoubleClick”'],
  [/“AdSense\uFFFD\?/g, '“AdSense”'],
  [/“AdSense\?\?/g, '“AdSense”'],
  [/“web beacon,\uFFFD\?/g, '“web beacon,”'],
  [/“web beacon,\?\?/g, '“web beacon,”'],
  [/“Public Profile Information\uFFFD\?/g, '“Public Profile Information”'],
  [/“Public Profile Information\?\?/g, '“Public Profile Information”'],
  [/“Unregister\uFFFD\?/g, '“Unregister”'],
  [/“Unregister\?\?/g, '“Unregister”'],
  [/“Like\uFFFD\?/g, '“Like”'],
  [/“Like\?\?/g, '“Like”'],
  [/“plugins\uFFFD\?/g, '“plugins”'],
  [/“plugins\?\?/g, '“plugins”'],
  [/“Company\uFFFD\?\s*“we/g, '“Company”, “we'],
  [/“Company\?\?\s*“we/g, '“Company”, “we'],
  [/Users\s*\uFFFD\?Refers/g, 'Users – Refers'],
  [/Users\s*\?\?Refers/g, 'Users – Refers'],
  [/Data\s*\uFFFD\?Refers/g, 'Data – Refers'],
  [/Data\s*\?\?Refers/g, 'Data – Refers'],
  [/Service\s*\uFFFD\?refers/g, 'Service – refers'],
  [/Service\s*\?\?refers/g, 'Service – refers'],
  [/Cookies\s*\uFFFD\?Refer/g, 'Cookies – Refer'],
  [/Cookies\s*\?\?Refer/g, 'Cookies – Refer'],
  [/Address\s*\uFFFD\?An/g, 'Address – An'],
  [/Address\s*\?\?An/g, 'Address – An'],
  [/device\s*\uFFFD\?/g, 'device” '],
  [/device\?\?/g, 'device” '],
  [/users\uFFFD\?/g, 'users’ '],
  [/users\?\?/g, 'users’ '],
  [/interests of\s*\uFFFD\?/g, 'interests of ”'],
  [/interests of\s*\?\?/g, 'interests of ”'],

  // Japanese
  [/最も試され\uFFFD\?/g, '最も試された'],
  [/最も試され\?\?/g, '最も試された'],
  [/ホームページに戻\uFFFD\?/g, 'ホームページに戻る'],

  // Chinese comments and UI strings
  [/路\uFFFD\?/g, '路径'],
  [/路\?\?/g, '路径'],
  [/非关\uFFFD\?/g, '非关键'],
  [/非关\?\?/g, '非关键'],
  [/渲染内\uFFFD\?/g, '渲染内容'],
  [/渲染内\?\?/g, '渲染内容'],
  [/右对\uFFFD\?/g, '右对齐'],
  [/右对\?\?/g, '右对齐'],
  [/左对\uFFFD\?/g, '左对齐'],
  [/左对\?\?/g, '左对齐'],
  [/移动端样\uFFFD\?/g, '移动端样式'],
  [/移动端样\?\?/g, '移动端样式'],
  [/\uFFFD\?关键/g, '★关键'],
  [/\?\?关键/g, '★关键'],
  [/Firefox\uFFFD\?/g, 'Firefox）'],
  [/Firefox\?\?/g, 'Firefox）'],
  [/Safari\uFFFD\?/g, 'Safari）'],
  [/Safari\?\?/g, 'Safari）'],
  [/下划\uFFFD\?/g, '下划线'],
  [/下划\?\?/g, '下划线'],
  [/底部横\uFFFD\?/g, '底部横条'],
  [/底部横\?\?/g, '底部横条'],
  [/回调函\uFFFD\?/g, '回调函数'],
  [/回调函\?\?/g, '回调函数'],
  [/插入\uFFFD\?`head`\s*\uFFFD\?/g, '插入到`head` 中'],
  [/插入\?\?`head`\s*\?\?/g, '插入到`head` 中'],
  [/初始化数\uFFFD\?/g, '初始化数据'],
  [/初始化数\?\?/g, '初始化数据'],
  [/今天的日\uFFFD\?/g, '今天的日期'],
  [/今天的日\?\?/g, '今天的日期'],
  [/月份\uFFFD\?0\s*开\uFFFD\?/g, '月份从0 开始'],
  [/月份\?\?0\s*开\?\?/g, '月份从0 开始'],
  [/关键资\uFFFD\?/g, '关键资源'],
  [/关键资\?\?/g, '关键资源'],
  [/优先加\uFFFD\?/g, '优先加载'],
  [/优先加\?\?/g, '优先加载'],
  [/停止检\uFFFD\?/g, '停止检测'],
  [/停止检\?\?/g, '停止检测'],
  [/视口的顶\uFFFD\?/g, '视口的顶部'],
  [/视口的顶\?\?/g, '视口的顶部'],
  [/视口\uFFFD\?/g, '视口）'],
  [/视口\?\?/g, '视口）'],
  [/推送广\uFFFD\?/g, '推送广告'],
  [/推送广\?\?/g, '推送广告'],
  [/重新推送广\uFFFD\?/g, '重新推送广告'],
  [/重新推送广\?\?/g, '重新推送广告'],
  [/空数组情\uFFFD\?/g, '空数组情况'],
  [/空数组情\?\?/g, '空数组情况'],
  [/跳转页\uFFFD\?/g, '跳转页面'],
  [/跳转页\?\?/g, '跳转页面'],
  [/所有图\uFFFD\?/g, '所有图片'],
  [/所有图\?\?/g, '所有图片'],
  [/来自缓\uFFFD\?/g, '来自缓存'],
  [/来自缓\?\?/g, '来自缓存'],
  [/更严格的\uFFFD\?/g, '更严格的值'],
  [/更严格的\?\?/g, '更严格的值'],
  [/600\uFFFD\?80/g, '600或80'],
  [/600\?\?80/g, '600或80'],
  [/页面总高\uFFFD\?/g, '页面总高度'],
  [/页面总高\?\?/g, '页面总高度'],
  [/页面滚动已锁\uFFFD\?/g, '页面滚动已锁定'],
  [/页面滚动已锁\?\?/g, '页面滚动已锁定'],
  [/页面滚动已解\uFFFD\?/g, '页面滚动已解锁'],
  [/页面滚动已解\?\?/g, '页面滚动已解锁'],
  [/滚动到下一\uFFFD\?/g, '滚动到下一页'],
  [/滚动到下一\?\?/g, '滚动到下一页'],
  [/响应式样\uFFFD\?/g, '响应式样式'],
  [/响应式样\?\?/g, '响应式样式'],
  [/文字居\uFFFD\?/g, '文字居中'],
  [/文字居\?\?/g, '文字居中'],
  [/文件选择\uFFFD\?/g, '文件选择器'],
  [/文件选择\?\?/g, '文件选择器'],
  [/class\s*\uFFFD\?my-img/g, 'class="my-img'],
  [/class\s*\?\?my-img/g, 'class="my-img'],
  [/菜\uFFFD\?/g, '菜单'],
  [/菜\?\?/g, '菜单'],
  [/桌面端：右对齐菜\uFFFD\?/g, '桌面端：右对齐菜单'],
  [/桌面端：右对齐菜\?\?/g, '桌面端：右对齐菜单'],
  [/让两部分之间有一些间\uFFFD\?/g, '让两部分之间有一些间距'],
  [/让两部分之间有一些间\?\?/g, '让两部分之间有一些间距'],
  [/年份\uFFFD\?025/g, '年份：2025'],
  [/年份\?\?025/g, '年份：2025'],
  [/周日\s*-\s*周六\uFFFD\?/g, '周日 - 周六）'],
  [/周日\s*-\s*周六\?\?/g, '周日 - 周六）'],
  [/对应\uFFFD\?DOM/g, '对应的 DOM'],
  [/对应\?\?DOM/g, '对应的 DOM'],
  [/移除所\uFFFD\?active/g, '移除所有 active'],
  [/移除所\?\?active/g, '移除所有 active'],
  [/填充\uFFFD\?HTML/g, '填充到 HTML'],
  [/填充\?\?HTML/g, '填充到 HTML'],
  [/渲染函数：把 JSON 数据填充\uFFFD\?/g, '渲染函数：把 JSON 数据填充到'],
  [/渲染函数：把 JSON 数据填充\?\?/g, '渲染函数：把 JSON 数据填充到'],
  [/\uFFFD\?秒检查一\uFFFD\?/g, '10秒检查一次'],
  [/\?\?秒检查一\?\?/g, '10秒检查一次'],
  [/生成\uFFFD\?JS/g, '生成 JS'],
  [/生成\?\?JS/g, '生成 JS'],
  [/生成\uFFFD\?quizData JS/g, '生成 quizData JS'],
  [/生成\?\?quizData JS/g, '生成 quizData JS'],
  [/请输\uFFFD\?quiz/g, '请输入 quiz'],
  [/请输\?\?quiz/g, '请输入 quiz'],
  [/添加结\uFFFD\?/g, '添加结果'],
  [/添加结\?\?/g, '添加结果'],
  [/添加问\uFFFD\?/g, '添加问题'],
  [/添加问\?\?/g, '添加问题'],
  [/添加答\uFFFD\?/g, '添加答案'],
  [/添加答\?\?/g, '添加答案'],
  [/\.jpg\s*\uFFFD\?https/g, '.jpg 或 https'],
  [/\.jpg\s*\?\?https/g, '.jpg 或 https'],
  [/answer:\s*"\uFFFD\?,/g, 'answer: "A",'],
  [/answer:\s*"\?\?,/g, 'answer: "A",'],
  [/`\uFFFD\?\{index \+ 1\}/g, '`第${index + 1}'],
  [/`\\?\?\{index \+ 1\}/g, '`第${index + 1}'],
  [/`\uFFFD\?\{page\}/g, '`第${page}'],
  [/`\\?\?\{page\}/g, '`第${page}'],
  [/空字符\uFFFD\?/g, '空字符串'],
  [/空字符\?\?/g, '空字符串'],
  [/文字反过\uFFFD\?/g, '文字反过来'],
  [/文字反过\?\?/g, '文字反过来'],
  [/Tiere\uFFFD\?bedeutet/g, 'Tiere“ bedeutet'],
  [/Tiere\?\?bedeutet/g, 'Tiere“ bedeutet'],
  [/瑞典语版\uFFFD\?/g, '瑞典语版本'],
  [/瑞典语版\?\?/g, '瑞典语版本'],
  [/挪威语版\uFFFD\?/g, '挪威语版本'],
  [/挪威语版\?\?/g, '挪威语版本'],
  [/荷兰语版\uFFFD\?/g, '荷兰语版本'],
  [/荷兰语版\?\?/g, '荷兰语版本'],
  [/\/\/\s*\uFFFD\?渲染函数/g, '// ★渲染函数'],
  [/\/\/\s*\?\?渲染函数/g, '// ★渲染函数'],
  [/分页状\uFFFD\?/g, '分页状态'],
  [/分页状\?\?/g, '分页状态'],
  [/innerText = `\uFFFD\?\{page\}/g, 'innerText = `第${page}'],
  [/innerText = `\?\?\{page\}/g, 'innerText = `第${page}'],
  [/”Zodiacus\uFFFD\?\s+som/g, '”Zodiacus”, som'],
  [/”Zodiacus\?\?\s+som/g, '”Zodiacus”, som'],
  [/跳\uFFFD\?URL\uFFFD\?/g, '跳转 URL'],
  [/跳\?\?URL\?\?/g, '跳转 URL'],
  [/初始化页\uFFFD\?/g, '初始化页面'],
  [/初始化页\?\?/g, '初始化页面'],
  [/下面的广\uFFFD\?/g, '下面的广告'],
  [/下面的广\?\?/g, '下面的广告'],
  [/下一\uFFFD\?/g, '下一页'],
  [/下一\?\?/g, '下一页'],
  [/选择文件\uFFFD\?/g, '选择文件后'],
  [/选择文件\?\?/g, '选择文件后'],
  [/可以\uFFFD\?Ajax/g, '可以用 Ajax'],
  [/可以\?\?Ajax/g, '可以用 Ajax'],
  [/成功后跳\uFFFD\?/g, '成功后跳转'],
  [/成功后跳\?\?/g, '成功后跳转'],
  [/对应结\uFFFD\?/g, '对应结果'],
  [/对应结\?\?/g, '对应结果'],
  [/添加结果\uFFFD\?/g, '添加结果'],
  [/添加结果\?\?/g, '添加结果'],
  [/添加新问\uFFFD\?/g, '添加新问题'],
  [/添加新问\?\?/g, '添加新问题'],
  [/预置答\uFFFD\?/g, '预置答案'],
  [/预置答\?\?/g, '预置答案'],
  [/下一\uFFFD\?aId/g, '下一个 aId'],
  [/下一\?\?aId/g, '下一个 aId'],
  [/示例问\uFFFD\?/g, '示例问题'],
  [/示例问\?\?/g, '示例问题'],
  [/>\uFFFD\?添加/g, '>＋ 添加'],
  [/>\?\?添加/g, '>＋ 添加'],

  // Generic trailing corruption after CJK chars in comments
  [/([\u4e00-\u9fff])\uFFFD\?(?=\*\/)/g, '$1'],
  [/([\u4e00-\u9fff])\?\?(?=\*\/)/g, '$1'],

  // Remaining generic smart-quote closings
  [/“([^“”\n]{1,80}?)\uFFFD\?/g, '“$1”'],
  [/“([^“”\n]{1,80}?)\?\?/g, '“$1”'],

  // Cleanup artifacts from sequential quote/comma fixes
  [/“,“/g, '”, “'],
  [/“we”,“us”/g, '“we”, “us”'],
  [/”, , is/g, '”, is'],
  [/“Website”\. \./g, '“Website”.'],
  [/”, , /g, '”, '],
];

function fixContent(content) {
  let out = content;
  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function main() {
  const files = walkHtmlFiles(ROOT);
  let updated = 0;
  let remaining = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const fixed = fixContent(original);
    if (fixed !== original) {
      fs.writeFileSync(file, fixed, 'utf8');
      updated += 1;
    }
    if (fixed.includes('\uFFFD')) {
      remaining += 1;
    }
  }

  console.log(`Updated ${updated}/${files.length} HTML files.`);
  console.log(`Files still containing corruption markers: ${remaining}`);
}

main();
