function hashPokemon(pseudo) {
  const s = pseudo.toLowerCase().trim();
  let h = CONFIG.hashSeed;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h, CONFIG.hashMult) + s.charCodeAt(i) | 0;
  return (Math.abs(h) % CONFIG.totalPokemon) + 1;
}

function getPoke(pseudo) {
  const id = hashPokemon(pseudo);
  return POKEDEX.find(p => p.id === id) || POKEDEX[0];
}

function vecDist(v1, v2) {
  return Math.sqrt(v1.reduce((s, x, i) => s + (x - v2[i]) ** 2, 0));
}

function rawScore(p1, p2) {
  const maxD = Math.sqrt(5 * 100 * 100);
  const vs = (1 - vecDist(p1.v, p2.v) / maxD) * 100;
  const as = COMPAT_MATRIX[p1.arch]?.[p2.arch] ?? 50;
  return vs * 0.65 + as * 0.35;
}

function compatibility(pseudo1, pseudo2) {
  const p1 = getPoke(pseudo1);
  const p2 = getPoke(pseudo2);
  const p2raw = rawScore(p1, p2);
  const all = POKEDEX.map(p => rawScore(p1, p)).sort((a, b) => a - b);
  return Math.round(all.filter(s => s <= p2raw).length / POKEDEX.length * 100);
}

function getAffinities(myPoke) {
  const sorted = POKEDEX.map(p => ({ p, raw: rawScore(myPoke, p) }))
    .sort((a, b) => b.raw - a.raw);
  return {
    top:   sorted.filter(x => x.p.id !== myPoke.id).slice(0, 5).map(x => x.p),
    worst: sorted.filter(x => x.p.id !== myPoke.id).slice(-5).reverse().map(x => x.p),
  };
}

function pokeName(p) { return p.name; }
function pokeArch(p) { return p.arch; }
function typeName(t) { return LANG.TYPE_NAMES[t] || t; }
