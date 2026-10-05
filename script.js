const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const form = document.querySelector('.terminal-form');
const input = document.querySelector('#terminal-input');
const output = document.querySelector('#command-output');
const sections = ['about', 'news', 'research', 'projects', 'experience', 'skills', 'community', 'contact'];
const aliases = { service: 'community', organizations: 'community', work: 'experience', home: 'about' };
const completions = ['help', 'ls', 'pwd', 'whoami', 'date', 'theme', 'clear', 'cv', 'github', 'email', ...sections, ...sections.filter(name => name !== 'about').map(name => `cat ${name}.txt`), 'tree projects/'];
const history = [];
let historyIndex = 0;
const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent = `theme: ${theme}`;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  themeMeta?.setAttribute('content', theme === 'dark' ? '#1b1b1b' : '#f1f0eb');
  try { localStorage.setItem('theme', theme); } catch (_) {}
}
setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
const sessionDate = document.querySelector('#session-date');
if (sessionDate) {
  const now = new Date();
  sessionDate.dateTime = now.toISOString();
  sessionDate.textContent = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kigali' }).format(now);
}

const bibtexButton = document.querySelector('.bibtex-toggle');
const bibtex = document.querySelector('#bibtex');
bibtexButton?.addEventListener('click', () => {
  const open = bibtexButton.getAttribute('aria-expanded') === 'true';
  bibtexButton.setAttribute('aria-expanded', String(!open));
  bibtexButton.textContent = open ? '[bibtex +]' : '[bibtex −]';
  bibtex.hidden = open;
});

function say(message, error = false) {
  output.textContent = message;
  output.classList.toggle('has-error', error);
}

function jumpTo(name) {
  document.getElementById(name)?.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
  say(`~/${name === 'projects' ? 'projects/' : `${name}.txt`}`);
}

function runCommand(raw) {
  const command = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return;
  history.push(raw.trim());
  historyIndex = history.length;

  let target = command.replace(/^(cat|cd|open)\s+/, '').replace(/^\.\//, '').replace(/^~\//, '').replace(/\/$/, '').replace(/\.txt$/, '');
  target = aliases[target] || target;
  if (sections.includes(target)) { jumpTo(target); return; }
  if (command === 'tree' || command === 'tree projects' || command === 'tree projects/') { jumpTo('projects'); return; }

  switch (command) {
    case 'help':
      say('Commands: help · ls · whoami · cat <file>.txt · tree projects/ · pwd · date · theme · cv · github · email · clear. Use ↑ for history and Tab to complete.');
      break;
    case 'ls': case 'ls -l': case 'ls -la':
      document.getElementById('directory')?.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
      say('8 entries in ~/portfolio');
      break;
    case 'pwd': say('/home/guy/portfolio'); break;
    case 'whoami': jumpTo('about'); break;
    case 'date': say(new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium', timeZone: 'Africa/Kigali' }).format(new Date()) + ' CAT'); break;
    case 'theme': setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'); say(`Theme: ${root.dataset.theme}`); break;
    case 'cv': case 'cat cv.pdf': case 'open cv.pdf':
      window.open('data/Ahonakpon_Gbaguidi_CV.pdf', '_blank', 'noopener'); say('Opening cv.pdf…'); break;
    case 'github':
      window.open('https://github.com/ggbaguidi', '_blank', 'noopener'); say('Opening GitHub…'); break;
    case 'email':
      window.location.href = 'mailto:agbaguid@andrew.cmu.edu'; say('Opening mail client…'); break;
    case 'clear':
      window.scrollTo({ top: 0, behavior: scrollBehavior }); say(''); break;
    default:
      say(`${raw.trim()}: command not found. Type help for available commands.`, true);
  }
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  runCommand(input.value);
  input.value = '';
});
input?.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && history.length) {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = history[historyIndex];
  } else if (event.key === 'ArrowDown' && history.length) {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    input.value = history[historyIndex] || '';
  } else if (event.key === 'Tab') {
    const value = input.value.toLowerCase();
    const matches = completions.filter(item => item.startsWith(value));
    if (value && matches.length === 1) { event.preventDefault(); input.value = matches[0]; }
  } else if (event.key === 'Escape') {
    input.value = '';
  }
});

document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => runCommand(button.dataset.command));
});
