// Altitude meter: climbs from 400 m to the Matterhorn's 4,478 m as you scroll
const alt = document.getElementById('alt');
const bar = document.getElementById('bar');
const summit = document.getElementById('summit');

const START = 400;
const PEAK = 4478;

function update() {
  const end = summit.offsetTop + summit.offsetHeight - window.innerHeight;
  const progress = Math.min(Math.max(window.scrollY / end, 0), 1);
  const meters = Math.round(START + progress * (PEAK - START));
  alt.textContent = meters.toLocaleString('en-US') + ' m';
  bar.style.width = progress * 100 + '%';
}

window.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', update);
update();