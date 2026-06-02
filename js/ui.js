let currentPseudo = '';
let currentPoke   = null;

function reveal() {
  const pseudo = document.getElementById('pseudo-input').value.trim();
  if (!pseudo) return;
  currentPseudo = pseudo;
  currentPoke   = getPoke(pseudo);
  renderResult(pseudo, currentPoke);
}

function renderResult(pseudo, poke) {
  document.getElementById('res-pseudo').textContent    = pseudo.toUpperCase();
  document.getElementById('res-sprite').src            = poke.sprite;
  document.getElementById('res-name').textContent      = pokeName(poke);
  document.getElementById('res-gen').textContent       = `${LANG.genLabel} ${poke.gen}  ·  #${poke.id}  ·  BST ${poke.bst}`;
  document.getElementById('res-arch').textContent      = pokeArch(poke);
  document.getElementById('res-arch-desc').textContent = LANG.ARCH_DESC[poke.arch] || '';
  document.querySelector('.poke-pseudo-label').textContent = LANG.pokeLabel;
  document.querySelector('.arch-label').textContent        = LANG.archLabel;

  const typesEl = document.getElementById('res-types');
  typesEl.innerHTML = '';
  poke.types.forEach(type => {
    const pill = document.createElement('span');
    pill.className   = 'type-pill ' + (TYPE_CLASSES[type] || '');
    pill.textContent = typeName(type);
    typesEl.appendChild(pill);
  });

  ['puissance','gabarit','agressivite','vitesse','solidite'].forEach((k, i) => {
    document.getElementById('val-' + k).textContent = poke.v[i];
    setTimeout(() => { document.getElementById('bar-' + k).style.width = poke.v[i] + '%'; }, 300 + i * 80);
  });

  renderAffinities(poke);

  document.getElementById('compat-result').classList.remove('visible');
  document.getElementById('compat-input').value = '';
  document.getElementById('screen-hero').style.display = 'none';
  document.getElementById('screen-result').classList.add('visible');
  window.scrollTo(0, 0);
  SFX.reveal();
}

function renderAffinities(poke) {
  const { top, worst } = getAffinities(poke);

  function makeSection(entries) {
    const first = entries[0];
    const rest  = entries.slice(1);
    return `
      <div class="affinity-poke affinity-poke--first">
        <img src="${first.sprite}" alt="${pokeName(first)}">
        <div class="affinity-poke-name">${pokeName(first)}</div>
      </div>
      <div class="affinity-rest">
        ${rest.map(e => `
          <div class="affinity-poke">
            <img src="${e.sprite}" alt="${pokeName(e)}">
            <div class="affinity-poke-name">${pokeName(e)}</div>
          </div>`).join('')}
      </div>`;
  }

  document.getElementById('top-affinities').innerHTML   = makeSection(top);
  document.getElementById('worst-affinities').innerHTML = makeSection(worst);
}

function checkCompat() {
  const pseudo2 = document.getElementById('compat-input').value.trim();
  if (!pseudo2 || !currentPseudo) return;
  const poke2 = getPoke(pseudo2);
  const score = compatibility(currentPseudo, pseudo2);

  document.getElementById('compat-img-a').src             = currentPoke.sprite;
  document.getElementById('compat-name-a').textContent    = pokeName(currentPoke);
  document.getElementById('compat-pseudo-a').textContent  = currentPseudo;
  document.getElementById('compat-img-b').src             = poke2.sprite;
  document.getElementById('compat-name-b').textContent    = pokeName(poke2);
  document.getElementById('compat-pseudo-b').textContent  = pseudo2;
  document.getElementById('compat-score').textContent     = score + '%';

  const threshold = [90, 75, 60, 45, 0].find(t => score >= t);
  const list = LANG.COMPAT_VERDICTS[threshold];
  document.getElementById('compat-verdict').textContent = list[Math.floor(Math.random() * list.length)];
  document.getElementById('compat-result').classList.add('visible');
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function goBack() {
  document.getElementById('screen-result').classList.remove('visible');
  document.getElementById('screen-hero').style.display = 'flex';
  document.getElementById('pseudo-input').value = '';
  document.getElementById('pseudo-input').focus();
}

function initCredits() {
  const a = document.getElementById('credit-author');
  const c = document.getElementById('credit-contact');
  if (a) { a.textContent = CONFIG.creditsAuthor.label;  a.href = CONFIG.creditsAuthor.url; }
  if (c) { c.textContent = CONFIG.creditsContact.label; c.href = CONFIG.creditsContact.url; }
}

function triggerEasterEgg() {
  SFX.reveal();
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => img.style.filter = 'brightness(0)');
  setTimeout(() => imgs.forEach(img => img.style.filter = ''), 3000);
}

const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function tone(freq, type, vol, attack, decay, start) {
    const c = getCtx();
    const g = c.createGain();
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + attack);
    g.gain.exponentialRampToValueAtTime(0.001, start + attack + decay);
    o.connect(g);
    g.connect(c.destination);
    o.start(start);
    o.stop(start + attack + decay + 0.05);
  }

  return {
    reveal() {
      const c = getCtx();
      const t = c.currentTime;
      tone(440, 'sine', 0.12, 0.01, 0.15, t);
      tone(660, 'sine', 0.10, 0.01, 0.12, t + 0.08);
      tone(880, 'sine', 0.08, 0.01, 0.20, t + 0.16);
    },
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pseudo-input').addEventListener('keydown', e => { if (e.key === 'Enter') reveal(); });
  document.getElementById('compat-input').addEventListener('keydown', e => { if (e.key === 'Enter') checkCompat(); });
  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
  });

  let seq = '';
  const CODE = 'arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba';
  document.addEventListener('keydown', e => {
    seq += e.key.toLowerCase().replace(' ', '');
    if (!CODE.startsWith(seq)) seq = '';
    if (seq === CODE) { seq = ''; triggerEasterEgg(); }
  });

  initCredits();
});
