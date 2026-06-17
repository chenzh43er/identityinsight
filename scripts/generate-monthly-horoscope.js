/**
 * June 2026 monthly horoscope cycle generator.
 * Sources: Astrology Cafe (Jun 17), TODAY.com (June 2026 monthly), key transit dates.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'shared/horoscope/js/en/16.js');
const LANGS = ['en', 'de', 'sv', 'fr', 'nl', 'no'];
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const MONTH = 'June';
const YEAR = 2026;

const JUNE_EVENTS = {
  1: 'Mercury enters Cancer, adding depth and emotion to communication.',
  9: 'Jupiter-Venus conjunction brings one of the luckiest windows of the month.',
  13: 'Venus enters Leo, amplifying romance, creativity, and self-expression.',
  14: 'New Moon in Gemini highlights fresh ideas and honest conversations.',
  17: 'Venus opposes Pluto — feelings surface; avoid power struggles and extremes.',
  21: 'Sun enters Cancer and the summer solstice invites emotional grounding.',
  28: 'Mars enters Gemini, boosting drive through words, plans, and networking.',
  29: 'Mercury retrograde in Cancer plus Full Moon in Capricorn call for review and patience.',
  30: 'Jupiter enters Leo, expanding confidence, joy, and bold new chapters.',
};

const MOON_THEMES = {
  1: 'A thoughtful start to the month favors planning and heartfelt talks.',
  2: 'Steady routines help you build momentum without burning out.',
  3: 'Curiosity is high — follow leads that genuinely excite you.',
  4: 'Home and comfort matter; nurture what feels safe and supportive.',
  5: 'Creative sparks fly; share ideas before self-doubt creeps in.',
  6: 'Details count today — organize one area that has felt messy.',
  7: 'Relationships benefit from fairness; meet others halfway.',
  8: 'Intensity can be productive if you channel it into clear goals.',
  9: 'Luck favors prepared minds — say yes to aligned opportunities.',
  10: 'Patience with process pays off more than forcing outcomes.',
  11: 'Community connections open doors you cannot reach alone.',
  12: 'Rest and reflection restore focus for the week ahead.',
  13: 'Passion returns — lead with warmth, not pressure.',
  14: 'Set intentions under the Gemini New Moon; speak what you mean.',
  15: 'Emotional honesty clears the air in personal matters.',
  16: 'Flexibility beats rigidity when plans shift unexpectedly.',
  17: 'Buried feelings may rise; breathe before reacting.',
  18: 'Mid-month energy supports practical steps toward long-term aims.',
  19: 'Adventure calls, but check logistics before committing.',
  20: 'Collaboration thrives when roles and expectations are clear.',
  21: 'Solstice light invites celebration and reconnection with family.',
  22: 'Sensitivity is a strength — listen more than you defend.',
  23: 'Financial clarity improves when you simplify commitments.',
  24: 'A small bold move can unlock stalled progress.',
  25: 'Health routines deserve an upgrade; start with sleep and hydration.',
  26: 'Social plans energize you if you protect downtime too.',
  27: 'Career conversations go well with facts plus empathy.',
  28: 'Words carry power — choose them carefully in negotiations.',
  29: 'Retrograde fog favors review, not brand-new launches.',
  30: 'Optimism grows as Jupiter enters Leo; dream bigger.',
  31: 'Close the month by noting wins and releasing what drained you.',
};

const MONTHLY_BY_SIGN = {
  Aries: 'Set boundaries in relationships and avoid projecting frustration onto others this month.',
  Taurus: 'Care for loved ones, but say no when someone crosses your limits.',
  Gemini: 'Put your needs first without guilt — independence strengthens every bond.',
  Cancer: 'Travel, tech, and communication glitches are possible; move slowly and rest often.',
  Leo: 'Jupiter expands your horizons in June — pursue goals that once felt too big.',
  Virgo: 'Plant seeds in love and work; soulful commitment can flourish now.',
  Libra: 'Give back to your community; advocacy brings purpose and pride.',
  Scorpio: 'Responsibilities peak early in June; stress eases after Jupiter shifts on the 30th.',
  Sagittarius: 'Mercury retrograde stirs old feelings — speak honestly to restore energy.',
  Capricorn: 'Past issues may resurface; face them calmly and choose genuine connections.',
  Aquarius: 'Clarify what you want intellectually and emotionally before rushing romance.',
  Pisces: 'Loosen up for better work-life balance; relationship drama can finally soften.',
};

const JUN17_DAILY = {
  Aries: 'Transits bring tense but revealing energy. Venus opposite Pluto highlights pleasure, friendship, and hidden resentments — take time to play without letting complicated ties drain you.',
  Taurus: 'Warm trust starts the day, but life-work balance tensions may surface. Compromise beats all-or-nothing reactions; plan for the future once emotions settle.',
  Gemini: 'Dreamy moods meet sharp words. Avoid tricky topics early; Venus-Pluto may stir communication friction — acknowledge fears instead of over-managing every detail.',
  Cancer: 'Discoveries feel magical, yet sensitivity runs high. Attachments are tested; aim for moderation and learn from what triggers you.',
  Leo: 'Charm is strong with Venus in your sign, but relationship intensity builds. Release the need to control outcomes and seek understanding over winning.',
  Virgo: 'Do not read too much into others\' words today. You need rest and healing, yet fear of falling behind may nag — compromise between duty and recovery.',
  Libra: 'Social ease continues, but desires run deep under Venus-Pluto. Detach enough to unwind rather than drowning in complicated connections.',
  Scorpio: 'Responsibilities feel urgent, then personal life pulls focus. Compartmentalize where possible — conflicts can lead to real insight.',
  Sagittarius: 'Spirit runs high, yet opinions may clash. Leave your post without guilt sometimes; not every debate is about losing power.',
  Capricorn: 'Money and power dynamics in relationships need care. Avoid possessiveness; today\'s depth can become a personal revelation.',
  Aquarius: 'Wants and needs feel misaligned temporarily. Meet others halfway instead of stubborn all-or-nothing stands.',
  Pisces: 'Patience wears thin easily today. Trust issues may flare, but do not let insecurities stop you from giving your best to meaningful work.',
};

const SIGN_TRAITS = {
  Aries: { love: 'passion and direct honesty', work: 'initiative and leadership', money: 'bold moves with quick decisions' },
  Taurus: { love: 'stability and sensual comfort', work: 'steady progress and craftsmanship', money: 'slow, reliable growth' },
  Gemini: { love: 'wit, conversation, and variety', work: 'ideas, networking, and multitasking', money: 'flexible side projects' },
  Cancer: { love: 'emotional security and nurturing', work: 'team loyalty and intuition', money: 'saving for home and family' },
  Leo: { love: 'romance, admiration, and play', work: 'visibility and creative leadership', money: 'generous spending on joy' },
  Virgo: { love: 'acts of service and reliability', work: 'precision and problem-solving', money: 'budgeting and practical plans' },
  Libra: { love: 'harmony, fairness, and partnership', work: 'diplomacy and design', money: 'balanced shared resources' },
  Scorpio: { love: 'depth, loyalty, and truth', work: 'research and transformation', money: 'strategic investments' },
  Sagittarius: { love: 'adventure and honesty', work: 'big-picture planning', money: 'risk-aware expansion' },
  Capricorn: { love: 'commitment and respect', work: 'ambition and structure', money: 'long-term security' },
  Aquarius: { love: 'friendship and freedom', work: 'innovation and teamwork', money: 'tech and community ventures' },
  Pisces: { love: 'empathy and imagination', work: 'creativity and compassion', money: 'intuitive but cautious choices' },
};

function loadTemplate() {
  const code = `${fs.readFileSync(TEMPLATE, 'utf8')}\n;module.exports = dataPage;`;
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(code, sandbox);
  return JSON.parse(JSON.stringify(sandbox.module.exports));
}

function formatDailyDate(day) {
  return `Jun ${String(day).padStart(2, '0')}, ${YEAR}`;
}

function weekRange(day) {
  if (day <= 7) return 'Jun 01 - Jun 07';
  if (day <= 14) return 'Jun 08 - Jun 14';
  if (day <= 21) return 'Jun 15 - Jun 21';
  if (day <= 28) return 'Jun 22 - Jun 28';
  return 'Jun 29 - Jul 05';
}

function hashScore(sign, day, category, min, max) {
  const s = `${sign}-${day}-${category}`;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return min + (h % (max - min + 1));
}

function scoreToStars(score) {
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 0.5 : 0;
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    if (i < full) stars.push(1.0);
    else if (i === full && half) stars.push(0.5);
    else stars.push(0.0);
  }
  return stars;
}

function makeBadges(sign, day) {
  const names = ['LOVE', 'CAREER', 'MOOD', 'ENERGY', 'HEALTH'];
  return names.map((name) => {
    const score = hashScore(sign, day, name, 1, 5) + (hashScore(sign, day, name + 'x', 0, 1) ? 0.5 : 0);
    return { name, stars: scoreToStars(score), score };
  });
}

function eventForDay(day) {
  if (JUNE_EVENTS[day]) return JUNE_EVENTS[day];
  return MOON_THEMES[day];
}

function buildDailyCopy(sign, day) {
  if (day === 17 && JUN17_DAILY[sign]) {
    const core = JUN17_DAILY[sign];
    const traits = SIGN_TRAITS[sign];
    return {
      general: core,
      love: `In love, ${sign} thrives on ${traits.love}. ${day === 17 ? 'Intensity is high — choose honesty over control.' : 'Stay open and present with your partner or crush.'}`,
      work: `At work, lean on ${traits.work}. ${eventForDay(day)}`,
      money: `Financially, ${traits.money} suits you now. Avoid impulsive choices near emotional peaks.`,
    };
  }

  const traits = SIGN_TRAITS[sign];
  const event = eventForDay(day);
  const monthly = MONTHLY_BY_SIGN[sign];
  return {
    general: `${event} ${monthly}`,
    love: `${sign}, romance favors ${traits.love} today. Listen as much as you speak.`,
    work: `Professionally, ${traits.work} helps you stand out. Focus on one priority at a time.`,
    money: `Money matters reward ${traits.money}. Review subscriptions and small leaks in your budget.`,
  };
}

function buildArticleHtml(sign, day, copy, rank) {
  return `\n<h3>FORTUNE RANKING: No.${rank}</h3>\n<p>${eventForDay(day)}</p>\n<h3>General:</h3><p>${copy.general}</p><h3>Love:</h3><p>${copy.love}</p><h3>Work:</h3><p>${copy.work}</p><h3>Money:</h3><p>${copy.money}</p> `;
}

function buildDesc(copy) {
  return `<h3>General:</h3><p>${copy.general}</p><h3>Love:</h3><p>${copy.love}</p><h3>Work:</h3><p>${copy.work}</p><h3>Money:</h3><p>${copy.money}</p>`;
}

function updateSection(section, sign, day, type) {
  if (!section) return;
  const slug = sign.toLowerCase();
  const dateStr = formatDailyDate(day);
  const copy = buildDailyCopy(sign, day);
  const rank = ((hashScore(sign, day, 'rank', 0, 11) % 12) + 1);

  if (type === 'daily') {
    section.section_date = dateStr;
    section.badges = makeBadges(sign, day);
    section.article_html = buildArticleHtml(sign, day, copy, rank);
    section.desc = buildDesc(copy);
  } else if (type === 'weekly') {
    section.section_date = weekRange(day);
    section.article_html = `\n<h3>Week at a Glance</h3><p>${copy.general}</p><p>Key transit: ${eventForDay(day)}</p> `;
    section.desc = `<h3>Week at a Glance</h3><p>${copy.general}</p>`;
  } else if (type === 'monthly') {
    section.section_date = MONTH;
    section.article_html = `\n<h3>June ${YEAR} Overview</h3><p>${MONTHLY_BY_SIGN[sign]}</p><p>${eventForDay(day)}</p> `;
    section.desc = `<h3>June ${YEAR} Overview</h3><p>${MONTHLY_BY_SIGN[sign]}</p>`;
  } else if (type === 'yearly') {
    section.section_date = String(YEAR);
  } else if (['love', 'health', 'career', 'sex'].includes(type)) {
    section.section_date = dateStr;
  }

  section.section_href = section.section_href || `https://www.astrologiez.com/horoscope/${type}/${slug}/`;
  section.name = sign;
}

function generateDayFile(template, day) {
  const data = JSON.parse(JSON.stringify(template));
  for (const sign of SIGNS) {
    const block = data[sign];
    if (!block) continue;
    for (const type of Object.keys(block)) {
      updateSection(block[type], sign, day, type);
    }
  }
  return `const dataPage = ${JSON.stringify(data, null, 4)};\n`;
}

function writeLanguageFiles(template) {
  const legacy = ['3', '4', '6', '7', '8', '9', '11', '14', '15', '16', '21', 'zodic.json'];
  for (const lang of LANGS) {
    const dir = path.join(ROOT, 'shared/horoscope/js', lang);
    fs.mkdirSync(dir, { recursive: true });
    for (let day = 1; day <= 31; day += 1) {
      const file = path.join(dir, `${day}.js`);
      fs.writeFileSync(file, generateDayFile(template, day), 'utf8');
    }
    for (const old of legacy) {
      const oldPath = path.join(dir, `${old}.js`);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    console.log(`Generated ${lang}: 1.js – 31.js`);
  }
}

function updateHtmlDayMapping() {
  const re = /const dayToJs = \{[\s\S]*?\};\s*\n\s*const scriptSrc = dayToJs\[day\] \|\| '1\.js';/;
  const replacement = "const scriptSrc = `${day}.js`;";
  let count = 0;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', '.git', 'shared', 'scripts', 'worker'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html') && full.includes(`${path.sep}horoscope${path.sep}`)) {
        let html = fs.readFileSync(full, 'utf8');
        if (!html.includes('dayToJs')) continue;
        const next = html.replace(re, replacement);
        if (next !== html) {
          fs.writeFileSync(full, next, 'utf8');
          count += 1;
        }
      }
    }
  }

  walk(ROOT);
  console.log(`Updated day mapping in ${count} horoscope HTML files.`);
}

function main() {
  console.log('Loading template…');
  const template = loadTemplate();
  console.log('Generating June 2026 cycle (31 days × 12 signs)…');
  writeLanguageFiles(template);
  updateHtmlDayMapping();
  console.log('Done.');
}

main();
