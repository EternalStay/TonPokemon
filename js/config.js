const CONFIG = {
  siteName:       'tonpokemon.fr',
  hashSeed:       4096,
  hashMult:       213,
  totalPokemon:   1025,
  creditsAuthor:  { label: '— EternalStay', url: '#' },
};

const COMPAT_MATRIX = {
  "L'Énigme":         { "L'Énigme":95, "Le Stratège":85, "Le Colosse":55, "Le Sauvage":20, "Le Gardien":65, "L'Ancien":70, "Le Caméléon":50, "L'Électron Libre":40 },
  "Le Stratège":      { "L'Énigme":85, "Le Stratège":75, "Le Colosse":65, "Le Sauvage":30, "Le Gardien":80, "L'Ancien":60, "Le Caméléon":45, "L'Électron Libre":60 },
  "Le Colosse":       { "L'Énigme":55, "Le Stratège":65, "Le Colosse":70, "Le Sauvage":85, "Le Gardien":90, "L'Ancien":65, "Le Caméléon":35, "L'Électron Libre":50 },
  "Le Sauvage":       { "L'Énigme":20, "Le Stratège":30, "Le Colosse":85, "Le Sauvage":65, "Le Gardien":25, "L'Ancien":40, "Le Caméléon":80, "L'Électron Libre":90 },
  "Le Gardien":       { "L'Énigme":65, "Le Stratège":80, "Le Colosse":90, "Le Sauvage":25, "Le Gardien":80, "L'Ancien":85, "Le Caméléon":40, "L'Électron Libre":30 },
  "L'Ancien":         { "L'Énigme":70, "Le Stratège":60, "Le Colosse":65, "Le Sauvage":40, "Le Gardien":85, "L'Ancien":95, "Le Caméléon":50, "L'Électron Libre":25 },
  "Le Caméléon":      { "L'Énigme":50, "Le Stratège":45, "Le Colosse":35, "Le Sauvage":80, "Le Gardien":40, "L'Ancien":50, "Le Caméléon":85, "L'Électron Libre":95 },
  "L'Électron Libre": { "L'Énigme":40, "Le Stratège":60, "Le Colosse":50, "Le Sauvage":90, "Le Gardien":30, "L'Ancien":25, "Le Caméléon":95, "L'Électron Libre":70 },
};

const TYPE_CLASSES = {
  normal:'t-normal', fire:'t-fire', water:'t-water', electric:'t-electric', grass:'t-grass',
  ice:'t-ice', fighting:'t-fighting', poison:'t-poison', ground:'t-ground', flying:'t-flying',
  psychic:'t-psychic', bug:'t-bug', rock:'t-rock', ghost:'t-ghost', dragon:'t-dragon',
  dark:'t-dark', steel:'t-steel', fairy:'t-fairy',
};

const LANG = {
  eyebrow:          'Découvre ton identité Pokémon',
  h1a:              'TON',
  h1b:              'POKÉMON',
  sub:              'Entre ton prénom. Découvre quel Pokémon tu es,<br>qui sont tes alliés naturels — et tes ennemis.',
  placeholder:      'Ton prénom…',
  btn:              'RÉVÉLER',
  profil:           'PROFIL',
  puissance:        'Puissance',
  gabarit:          'Gabarit',
  agres:            'Agressivité',
  vitesse:          'Vitesse',
  solidite:         'Solidité',
  compat:           'COMPATIBILITÉ',
  compatPlaceholder:"Prénom d'un ami…",
  compatBtn:        'TESTER',
  compatPct:        '% de compatibilité',
  soulmates:        'Tes âmes sœurs',
  soulmatesSub:     "Ceux qui partagent ces Pokémon te comprennent sans que tu aies besoin d'expliquer.",
  opposites:        'Tes opposés',
  oppositesSub:     'Pas forcément des ennemis — mais vous ne voyez pas le monde pareil.',
  save:             'Sauvegarder',
  change:           'Changer',
  archLabel:        'Ton archétype',
  pokeLabel:        'Le Pokémon de',
  creditsTitle:     'CRÉDITS',
  creditDev:        'Concept & développement',
  creditData:       'Données Pokémon',
  creditSprites:    'Sprites',
  creditContact:    'Contact',
  creditDataVal:    '— open source, communautaire',
  creditSpritesVal: '© Nintendo / Game Freak — usage non commercial',
  genLabel:         'Génération',

  ARCH_DESC: {
    "L'Énigme":         "Rare, insaisissable, redoutable. Tu dépasses ce qu'on croit connaître de toi.",
    "Le Colosse":       "Tu imposes ta présence. Là où tu passes, on ne peut pas faire semblant de ne pas t'avoir vu.",
    "Le Sauvage":       "Tu attaques. Vite, fort, sans prévenir. L'adversaire n'a pas le temps de réfléchir.",
    "Le Stratège":      "Tu réfléchis avant d'agir. Ta puissance vient de ta tête, pas de tes bras.",
    "Le Gardien":       "Tu protèges. Tu encaisses. Tu dures. Les autres s'épuisent — toi tu restes.",
    "L'Ancien":         "Tu portes quelque chose que les autres ont oublié. Une forme de sagesse qui vient du temps.",
    "Le Caméléon":      "Tu t'adaptes à tout. Personne ne sait vraiment ce que tu es capable de faire.",
    "L'Électron Libre": "Tu ne rentres dans aucune case. C'est exactement ce qui te rend dangereux.",
  },

  COMPAT_VERDICTS: {
    90: ["Une évidence. Vous fonctionnez ensemble sans effort.", "Rare. Ce genre de duo ne se calcule pas, il se ressent."],
    75: ["Complémentaires sur presque tout.", "Ce que l'un ne peut pas faire, l'autre le fait naturellement."],
    60: ["Ça fonctionne, avec un peu d'adaptation.", "Des différences qui peuvent devenir une force."],
    45: ["Terrain accidenté. Pas impossible, mais il faudra du travail.", "Vous vous frottez dans le mauvais sens... ou le bon ?"],
    0:  ["Deux mondes qui se regardent sans se comprendre.", "L'opposition totale. Soit ça explose, soit c'est fascinant."],
  },

  TYPE_NAMES: {
    normal:'Normal', fire:'Feu', water:'Eau', electric:'Électrik', grass:'Plante',
    ice:'Glace', fighting:'Combat', poison:'Poison', ground:'Sol', flying:'Vol',
    psychic:'Psy', bug:'Insecte', rock:'Roche', ghost:'Spectre', dragon:'Dragon',
    dark:'Ténèbres', steel:'Acier', fairy:'Fée',
  },
};
