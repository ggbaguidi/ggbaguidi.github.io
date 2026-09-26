const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function syncThemeButton() {
  const light = root.dataset.theme === 'light';
  themeButton?.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
  themeMeta?.setAttribute('content', light ? '#f8f8f8' : '#1b1b1b');
}

themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', root.dataset.theme);
  syncThemeButton();
});
syncThemeButton();

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  navLinks?.classList.toggle('open', !open);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    navLinks.classList.remove('open');
  });
});

const observedSections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navAnchors.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-15% 0px -70% 0px', threshold: [0, .25, .5] });
observedSections.forEach((section) => sectionObserver.observe(section));

const bibtexButton = document.querySelector('.bibtex-toggle');
const bibtex = document.querySelector('#bibtex');
bibtexButton?.addEventListener('click', () => {
  const open = bibtexButton.getAttribute('aria-expanded') === 'true';
  bibtexButton.setAttribute('aria-expanded', String(!open));
  bibtex.hidden = open;
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const terminalForm = document.querySelector('.terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const terminalOutput = document.querySelector('.terminal-output');
const promptClock = document.querySelector('.prompt-clock');
const sectionNames = ['about', 'news', 'research', 'projects', 'experience', 'skills', 'service', 'contact'];
const sectionAliases = { community: 'service', organizations: 'service', work: 'experience' };

function updatePromptClock() {
  if (!promptClock) return;
  promptClock.textContent = `at ${new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Africa/Kigali' }).format(new Date())}`;
}
updatePromptClock();
if (promptClock) setInterval(updatePromptClock, 1000);

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return;
  terminalOutput.classList.remove('has-error');

  const targetName = command.replace(/^(cd|open|cat)\s+/, '').replace(/^\.\//, '').replace(/\/$/, '').replace(/\.txt$/, '');
  const section = sectionAliases[targetName] || targetName;
  if (sectionNames.includes(section)) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    terminalOutput.textContent = `Opening ~/${section}/`;
    return;
  }

  switch (command) {
    case 'help':
      terminalOutput.textContent = 'Commands: ls, pwd, whoami, about, news, research, projects, experience, skills, community, contact, cv, github, email, theme, clear. You can also use cat <section>.txt or cd <section>.';
      break;
    case 'ls':
      terminalOutput.textContent = sectionNames.map((name) => `${name}/`).join('  ');
      break;
    case 'pwd':
      terminalOutput.textContent = '/home/guy/portfolio';
      break;
    case 'whoami':
      terminalOutput.textContent = 'Ahonakpon Guy Gbaguidi — software engineer and AI researcher.';
      break;
    case 'theme':
      themeButton?.click();
      terminalOutput.textContent = `Theme switched to ${root.dataset.theme}.`;
      break;
    case 'cv':
      window.open('data/Ahonakpon_Gbaguidi_CV.pdf', '_blank', 'noopener');
      terminalOutput.textContent = 'Opening CV…';
      break;
    case 'github':
      window.open('https://github.com/ggbaguidi', '_blank', 'noopener');
      terminalOutput.textContent = 'Opening GitHub…';
      break;
    case 'email':
      window.location.href = 'mailto:agbaguid@andrew.cmu.edu';
      terminalOutput.textContent = 'Opening email…';
      break;
    case 'clear':
      terminalOutput.textContent = '';
      break;
    default:
      terminalOutput.textContent = `Command not found: ${rawCommand.trim()}. Type help to see available commands.`;
      terminalOutput.classList.add('has-error');
      return;
  }
  terminalOutput.classList.remove('has-error');
}

terminalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  terminalOutput.classList.remove('has-error');
  runCommand(terminalInput.value);
  terminalInput.value = '';
});

terminalOutput?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-command]');
  if (button) runCommand(button.dataset.command);
});
