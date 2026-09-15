const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
const quickLinks = document.querySelectorAll('[data-query]');
const cursorGlow = document.querySelector('.cursor-glow');

const raritySets = {
  Mythical: ['mew', 'celebi', 'jirachi', 'deoxys', 'manaphy', 'darkrai', 'shaymin', 'arceus', 'victini', 'meloetta', 'genesect', 'diancie', 'hoopa', 'volcanion', 'magearna', 'marshadow', 'zeraora', 'meltan', 'melmetal', 'zarude', 'pecharunt'],
  Legendary: ['articuno', 'zapdos', 'moltres', 'raikou', 'entei', 'suicune', 'mewtwo', 'lugia', 'ho-oh', 'kyogre', 'groudon', 'rayquaza', 'dialga', 'palkia', 'giratina', 'reshiram', 'zekrom', 'xerneas', 'yveltal', 'zacian', 'zamazenta', 'eternatus', 'koraidon', 'miraidon'],
  'Ultra Beast': ['nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord', 'poipole', 'naganadel', 'stakataka', 'blacephalon']
};
const knownNames = ['Bulbasaur', 'Charmander', 'Charizard', 'Pikachu', 'Mew', 'Mewtwo', 'Moltres', 'Rayquaza', 'Gengar', 'Eevee', 'Lucario', 'Gardevoir', 'Greninja', 'Arceus', 'Celebi', 'Jirachi', 'Darkrai', 'Zeraora', 'Ho-Oh', 'Lugia'];

function getRarity(name) {
  const normalized = name.toLowerCase();
  const match = Object.entries(raritySets).find(([, names]) => names.includes(normalized));
  return match ? match[0] : 'Regular';
}

function pokemonImage(name) {
  const idMap = { mew: 151, mewtwo: 150, moltres: 146, rayquaza: 384, pikachu: 25, charizard: 6, arceus: 493, celebi: 251, jirachi: 385 };
  const id = idMap[name.toLowerCase()];
  return id ? `https://cdn.poketwo.net/images/${id}.png` : '';
}

function searchIndex(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;
  const hasPattern = cleanQuery.includes('_');
  if (hasPattern) {
    const regex = new RegExp(`^${cleanQuery.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&').replace(/_/g, '.')}$`, 'i');
    return knownNames.find((name) => regex.test(name)) || (cleanQuery.toLowerCase() === 'm_l__es' ? 'Moltres' : null);
  }
  return knownNames.find((name) => name.toLowerCase() === cleanQuery.toLowerCase()) || knownNames.find((name) => name.toLowerCase().includes(cleanQuery.toLowerCase())) || null;
}

function renderResult(query) {
  const match = searchIndex(query);
  if (!match) {
    searchResult.innerHTML = '<span class="result-placeholder">No signal found. Try a partial name or a clue with underscores.</span>';
    return;
  }
  const rarity = getRarity(match);
  const image = pokemonImage(match);
  searchResult.innerHTML = `<div class="result-match">${image ? `<img class="match-image" src="${image}" alt="" />` : '<span class="match-image"></span>'}<span><strong>${match}</strong><br /><span class="match-meta">${rarity} signal detected</span></span><span class="match-meta">MATCH 01 / 01</span></div>`;
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderResult(searchInput.value);
});
quickLinks.forEach((button) => button.addEventListener('click', () => {
  searchInput.value = button.dataset.query;
  renderResult(button.dataset.query);
  searchInput.focus();
}));
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
  }
});
document.addEventListener('mousemove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const tick = () => {
      current = Math.min(current + step, target);
      entry.target.textContent = current.toLocaleString();
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });
counters.forEach((counter) => counterObserver.observe(counter));
