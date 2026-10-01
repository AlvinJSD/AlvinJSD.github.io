// Cursor glow + card spotlight
const glow = document.querySelector('.glow');
window.addEventListener('pointermove', e => {
  glow.style.setProperty('--x', e.clientX + 'px');
  glow.style.setProperty('--y', e.clientY + 'px');
});
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

// Typing effect
const roles = ['Web Developer', 'Problem Solver', 'Lifelong Learner'];
const el = document.getElementById('typed');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  el.textContent = roles[0];
} else {
  let r = 0, i = 0, del = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    let wait = del ? 40 : 90;
    if (!del && i === word.length) { del = true; wait = 1400; }
    else if (del && i === 0) { del = false; r = (r + 1) % roles.length; wait = 300; }
    else i += del ? -1 : 1;
    setTimeout(tick, wait);
  })();
}

// Highlight the current section in the nav
const links = document.querySelectorAll('.links a');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section').forEach(s => io.observe(s));