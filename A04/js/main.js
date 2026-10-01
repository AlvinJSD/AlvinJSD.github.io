// Detach / attach the Joy-Con
const btn = document.getElementById('detach');
const consoleEl = document.getElementById('console');
const label = btn.querySelector('span');

btn.addEventListener('click', () => {
  const detached = consoleEl.classList.toggle('detached');
  btn.setAttribute('aria-pressed', detached);
  label.textContent = detached ? 'Attach Joy-Con' : 'Detach Joy-Con';
});