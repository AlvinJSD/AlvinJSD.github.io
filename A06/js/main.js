// ----- Your content: edit here to add or change moods and photos -----
const MOODS = [
  {
    id: 'skybound',
    title: 'Skybound',
    accent: '#8fb0e6',
    banner: 'BlueBig.jpg',
    description: '"Skybound" captures the essence of serenity and vastness, emphasizing the beauty of the skies above. From towering trees reaching toward the blue skies, to the architectural splendor of campus buildings under the expansive afternoon sky, this collection evokes a sense of openness and tranquility. The photographs explore the interplay between nature and human creation, set against the backdrop of an ever-changing sky during the golden hours of the day.',
    pictures: ['skybound1.jpg', 'skybound3.jpg', 'skybound4.jpg', 'skybound5.jpg']
  },
  {
    id: 'pink',
    title: 'Pink Sky Collection',
    accent: '#ff8cc0',
    banner: 'bigpink.jpg',
    description: 'The Pink Skies collection captures the dreamy and surreal beauty of sunsets where the sky transforms into soft shades of pink, purple, and coral. These photographs emphasize the calm, ethereal moments when the horizon blurs into gentle pastels, creating a peaceful, almost otherworldly mood.',
    pictures: ['pink1.jpg', 'pink2.jpg', 'pink3.jpg', 'pink4.jpg', 'pink5.jpg']
  },
  {
    id: 'golden',
    title: 'Golden Hour',
    accent: '#ffc83d',
    banner: 'biggolden.jpg',
    description: '"Golden Horizons" captures the soft, radiant glow of golden hour across the familiar scenes of campus life. As the sun dips low, everyday spaces, from quiet pathways to open fields, are transformed by rich, golden light.',
    pictures: ['golden1.jpg', 'golden2.jpg', 'golden3.jpg', 'golden4.jpg', 'golden5.jpg', 'golden7.jpg']
  }
];

// ----- Setup -----
const root = document.documentElement;
const view = document.getElementById('view');
const nav = document.getElementById('nav');
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const lbCount = document.getElementById('lb-count');
const lbHeart = document.getElementById('lb-heart');
const lbPlay = document.getElementById('lb-play');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const img = f => 'img/' + f;
const find = id => MOODS.find(m => m.id === id);
const ALL = MOODS.flatMap(m => m.pictures.map(file => ({ mood: m.id, file })));
const keyOf = s => s.mood + '/' + s.file;

// Favorites are saved in this browser
let favs;
try { favs = new Set(JSON.parse(localStorage.getItem('gallery-favs') || '[]')); } catch { favs = new Set(); }
const saveFavs = () => { try { localStorage.setItem('gallery-favs', JSON.stringify([...favs])); } catch { } };

let viewList = [];

nav.innerHTML = MOODS.map(m =>
  `<a href="#${m.id}" data-id="${m.id}"><i style="background:${m.accent}"></i>${m.title.replace(' Collection', '')}</a>`
).join('') + `<a href="#favorites" data-id="favorites"><span class="hrt">&#9829;</span>Favorites <b id="favcount">${favs.size}</b></a>`;

// ----- Views -----
function shotHTML(s, i) {
  const on = favs.has(keyOf(s));
  return `
    <figure class="shot" data-tilt style="--d:${Math.min(i, 8) * 70}ms">
      <button class="open" data-i="${i}" aria-label="Open photo ${i + 1} of ${viewList.length}">
        <img src="${img(s.file)}" alt="${find(s.mood).title} photo" loading="lazy">
      </button>
      <button class="heart ${on ? 'on' : ''}" data-key="${keyOf(s)}" aria-pressed="${on}" aria-label="Favorite this photo">${on ? '&#9829;' : '&#9825;'}</button>
    </figure>`;
}

function welcomeView() {
  const cards = MOODS.map(m => `
    <a class="pick" href="#${m.id}" data-tilt>
      <img src="${img(m.banner)}" alt="">
      <div><h2>${m.title}</h2><span>${m.pictures.length} photos</span></div>
    </a>`).join('');
  return `
    <section class="welcome">
      <figure class="cover" data-tilt><img src="img/frontpage.jpg" alt="Gallery cover"></figure>
      <div>
        <h1>Welcome to my Gallery</h1>
        <p>Three moods of the sky. Pick one below, or let me choose a photo for you. Tap the heart on any photo to save it.</p>
        <button class="cta" data-surprise>Surprise me</button>
      </div>
    </section>
    <section class="picks" aria-label="Choose a mood">${cards}</section>`;
}

function moodView(m) {
  const at = MOODS.indexOf(m);
  const next = MOODS[at + 1];
  return `
    <section class="banner">
      <img src="${img(m.banner)}" alt="">
      <div>
        <h1>${m.title}</h1>
        <button class="ghost" data-play>&#9654; Slideshow <span>${m.pictures.length} photos</span></button>
      </div>
    </section>
    <p class="desc">${m.description}</p>
    <section class="masonry" aria-label="${m.title} photos">${viewList.map(shotHTML).join('')}</section>
    <a class="next" href="${next ? '#' + next.id : '#welcome'}">Switch mood <small>${next ? 'Next: ' + next.title : 'Back to the start'}</small></a>`;
}

function favoritesView() {
  if (!viewList.length) return `
    <section class="empty">
      <h1>No favorites yet</h1>
      <p>Tap the heart on any photo and it will show up here.</p>
      <a class="cta" href="#welcome" style="display:inline-block">Browse the moods</a>
    </section>`;
  return `
    <section class="fav-head">
      <h1>Your favorites</h1>
      <p>${viewList.length} photo${viewList.length > 1 ? 's' : ''} you saved</p>
      <button class="cta" data-play>&#9654; Play slideshow</button>
    </section>
    <section class="masonry" aria-label="Favorite photos">${viewList.map(shotHTML).join('')}</section>
    <div style="height:70px"></div>`;
}

function render(keepScroll) {
  const hash = location.hash.slice(1);
  const mood = find(hash);
  const id = mood ? mood.id : hash === 'favorites' ? 'favorites' : 'welcome';
  const y = scrollY;

  document.body.dataset.mood = id;
  document.title = (mood ? mood.title : id === 'favorites' ? 'Favorites' : 'Gallery') + (id === 'welcome' ? '' : ' | Gallery');
  nav.querySelectorAll('a').forEach(a => {
    if (a.dataset.id === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  viewList = mood ? mood.pictures.map(file => ({ mood: mood.id, file }))
    : id === 'favorites' ? ALL.filter(s => favs.has(keyOf(s))) : [];
  view.innerHTML = mood ? moodView(mood) : id === 'favorites' ? favoritesView() : welcomeView();
  scrollTo(0, keepScroll ? y : 0);
}

// Switching view: color circle grows from the click point (where supported)
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const r = a.getBoundingClientRect();
  root.style.setProperty('--cx', (e.detail ? e.clientX : r.left + r.width / 2) + 'px');
  root.style.setProperty('--cy', (e.detail ? e.clientY : r.top + r.height / 2) + 'px');
});
window.addEventListener('hashchange', () => {
  if (document.startViewTransition && !reduce) document.startViewTransition(() => render());
  else render();
});

// ----- Favorites -----
function setHeart(el, on) {
  el.innerHTML = on ? '&#9829;' : '&#9825;';
  el.classList.toggle('on', on);
  el.setAttribute('aria-pressed', on);
}
function toggleFav(k) {
  if (favs.has(k)) favs.delete(k); else favs.add(k);
  saveFavs();
  const on = favs.has(k);
  document.querySelectorAll(`.heart[data-key="${k}"]`).forEach(h => {
    setHeart(h, on);
    h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop');
  });
  document.getElementById('favcount').textContent = favs.size;
  if (lb.open && keyOf(list[idx]) === k) setHeart(lbHeart, on);
  if (!lb.open && location.hash === '#favorites') render(true); // photo leaves the favorites page
}

// ----- Photo viewer -----
let list = [], idx = 0, timer = null;

function paint() {
  const s = list[idx];
  lbImg.classList.remove('swap'); void lbImg.offsetWidth; lbImg.classList.add('swap');
  lbImg.src = img(s.file);
  lbImg.alt = find(s.mood).title + ' photo';
  lbCap.textContent = find(s.mood).title;
  lbCount.textContent = (idx + 1) + ' / ' + list.length;
  setHeart(lbHeart, favs.has(keyOf(s)));
}
function step(n) { idx = (idx + n + list.length) % list.length; paint(); }
function setPlay(on) {
  clearInterval(timer);
  lbPlay.setAttribute('aria-pressed', on);
  lbPlay.innerHTML = on ? '&#10074;&#10074;' : '&#9654;';
  if (on) timer = setInterval(() => step(1), 3500);
}
function openViewer(l, i, play) {
  if (!l.length) return;
  list = l; idx = i; paint(); lb.showModal(); setPlay(!!play);
}

view.addEventListener('click', e => {
  const open = e.target.closest('.open');
  const heart = e.target.closest('.heart');
  if (open) openViewer(viewList, Number(open.dataset.i));
  else if (heart) toggleFav(heart.dataset.key);
  else if (e.target.closest('[data-play]')) openViewer(viewList, 0, true);
  else if (e.target.closest('[data-surprise]')) openViewer(ALL, Math.floor(Math.random() * ALL.length));
});

document.getElementById('lb-prev').addEventListener('click', () => step(-1));
document.getElementById('lb-next').addEventListener('click', () => step(1));
document.getElementById('lb-close').addEventListener('click', () => lb.close());
lbHeart.addEventListener('click', () => toggleFav(keyOf(list[idx])));
lbPlay.addEventListener('click', () => setPlay(lbPlay.getAttribute('aria-pressed') !== 'true'));
lb.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});
lb.addEventListener('click', e => {
  const r = lb.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) lb.close(); // dark backdrop
});
lb.addEventListener('close', () => { setPlay(false); if (location.hash === '#favorites') render(true); });

// Swipe left / right on touch screens
let sx = null;
lbImg.addEventListener('pointerdown', e => { sx = e.clientX; });
lbImg.addEventListener('pointerup', e => {
  if (sx !== null && Math.abs(e.clientX - sx) > 50) step(e.clientX < sx ? 1 : -1);
  sx = null;
});

// ----- Tilt toward the cursor -----
view.addEventListener('pointermove', e => {
  const t = e.target.closest('[data-tilt]');
  if (!t || e.pointerType === 'touch' || reduce) return;
  const r = t.getBoundingClientRect();
  t.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 10 + 'deg');
  t.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 10 + 'deg');
});
view.addEventListener('pointerout', e => {
  const t = e.target.closest('[data-tilt]');
  if (t && !t.contains(e.relatedTarget)) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); }
});

render();