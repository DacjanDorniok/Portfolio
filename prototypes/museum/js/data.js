/* All museum content, kept apart from the screens that display it.
   In a production build this is what an API or CMS would supply. */

export const IMG = {
  hall: "img/hall-skeletons.jpg",
  hands: "img/hands.jpg",
  sunburst: "img/gold-sunburst.jpg",
  cracks: "img/light-cracks.jpg",
  spiral: "img/spiral-pattern.jpg",
  stone: "img/stone-inscription.jpg",
  arch: "img/greek-arch.jpg",
  goldHand: "img/gold-hand.jpg",
  map: "img/map-aged.jpg",
  diplodocus: "img/stop-diplodocus.jpg",
  dinoTour: "img/tour-dino.jpg",
  ribs: "img/ribs.jpg",
  firelight: "img/firelight.jpg",
  dinoGolden: "img/dino-golden.jpg",
  egypt: "img/egypt-torch.jpg",
  cave: "img/cave-art.jpg",
  vase: "img/vase-cerberus.jpg",
};

/* --- Onboarding ----------------------------------------------------------- */

export const LANGUAGES = [
  { name: "English", native: "United Kingdom" },
  { name: "Deutsch", native: "Deutschland" },
  { name: "Español", native: "España" },
  { name: "Français", native: "France" },
  { name: "Italiano", native: "Italia" },
  { name: "Polski", native: "Polska" },
  { name: "Türkçe", native: "Türkiye" },
  { name: "中文", native: "简体" },
  { name: "العربية", native: "Arabic" },
  { name: "Русский", native: "Russian" },
];

export const BSL = "British Sign Language";

export const FONT_SCALE = [0.875, 0.9375, 1, 1.0625, 1.15];
export const FONT_LABELS = ["Smallest", "Small", "Default", "Large", "Largest"];

export const APPEARANCES = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
  { id: "auto", name: "Auto" },
];

/* --- Visit ---------------------------------------------------------------- */

export const OPENING_HOURS = [
  { k: "Monday – Sunday", v: "10:00 – 18:00" },
  { k: "Last entry", v: "17:30" },
  { k: "Queue right now", v: "about 6 min" },
];

export const MENU_ITEMS = [
  { icon: "▤", name: "My tickets", sub: "1 ticket for today", to: "tickets" },
  { icon: "♪", name: "Tours", sub: "Four guided routes, all free", to: "tours" },
  { icon: "⌖", name: "Floor map", sub: "Live crowd levels", to: "map" },
  { icon: "⌗", name: "Scan an artefact", sub: "Camera or artefact number", to: "scan" },
  { icon: "⌂", name: "Accessibility", sub: "Text size, contrast, language", to: "access" },
  { icon: "✦", name: "Gift shop", sub: "Casts, prints and books", to: null },
];

/* --- Ticketing ------------------------------------------------------------ */

export const VISITOR_TYPES = [
  { key: "adult", name: "Adult", sub: "16 and over", price: 14 },
  { key: "reduced", name: "Reduced", sub: "Students, seniors, disabled visitors", price: 8 },
  { key: "child", name: "Child", sub: "Under 16", price: 0 },
];

export const DATES = [
  { dow: "Sat", d: "27" },
  { dow: "Sun", d: "28" },
  { dow: "Mon", d: "29" },
  { dow: "Tue", d: "30" },
  { dow: "Wed", d: "01" },
  { dow: "Thu", d: "02" },
  { dow: "Fri", d: "03" },
];

export const SLOTS = [
  { t: "09:30", end: "11:00", sub: "4 left" },
  { t: "10:00", end: "11:30", sub: "Sold out", full: true },
  { t: "10:30", end: "12:00", sub: "Busy" },
  { t: "11:00", end: "12:30", sub: "Good time" },
  { t: "11:30", end: "13:00", sub: "Good time" },
  { t: "12:00", end: "13:30", sub: "Busy" },
  { t: "12:30", end: "14:00", sub: "Sold out", full: true },
  { t: "13:00", end: "14:30", sub: "Quiet" },
];

export const GATES = [
  { name: "Dinosaur Era — Gate 01", sub: "4 stops · 45 min · starts at the Hall of Giants" },
  { name: "Ancient Egypt — Gate 02", sub: "5 stops · 35 min", full: true },
  { name: "Palaeolithic Period — Gate 03", sub: "3 stops · 25 min · starts at the Cave Room" },
  { name: "Mesopotamian Civilizations — Gate 04", sub: "4 stops · 30 min · starts at the Clay Hall" },
];

export const ACCOMMODATIONS = [
  "Wheelchair access",
  "Audio description",
  "Sign language guide",
  "Large-print labels",
];

export const PAYMENT_METHODS = [
  { name: "Apple Pay", icon: "", bg: "#111", fg: "#fff" },
  { name: "Google Pay", icon: "G", bg: "#fff", fg: "#111" },
  { name: "PayPal", icon: "P", bg: "#003087", fg: "#fff" },
  { name: "Klarna", icon: "K", bg: "#FFB3C7", fg: "#111" },
  { name: "Credit card", icon: "▭", bg: "rgba(240,230,211,.14)", fg: "#F0E6D3" },
];

export const SAVE_ACTIONS = [
  { icon: "", name: "Apple Wallet", to: "wallet", primary: true },
  { icon: "↓", name: "Download PDF", to: null },
  { icon: "✉", name: "Email it", to: null },
];

export const PAST_TICKETS = [
  { name: "Entrance · 2 visitors", sub: "11:00 – 12:30 · Gate 02", price: "€22", mon: "Mar", day: "14" },
  { name: "Entrance · 4 visitors", sub: "13:00 – 14:30 · Gate 01", price: "€36", mon: "Nov", day: "02" },
];

export const TICKET_REF = "HM · 2026 · 0714 · 5604";

/* --- Tours and stops ------------------------------------------------------ */

export const TOURS = [
  {
    name: "Dinosaur Era",
    img: IMG.dinoTour,
    mins: 45,
    stops: 4,
    blurb: "Explore ancient giants up close in a fast, immersive journey through the age of dinosaurs.",
  },
  {
    name: "Ancient Egypt",
    img: IMG.egypt,
    mins: 35,
    stops: 5,
    blurb: "Torchlight, hieroglyphs, and the machinery built to carry a person into the afterlife.",
  },
  {
    name: "Palaeolithic Period",
    img: IMG.cave,
    mins: 25,
    stops: 3,
    blurb: "The first images human beings ever made, and the hands that pressed them into stone.",
  },
  {
    name: "Mesopotamian Civilizations",
    img: IMG.stone,
    mins: 30,
    stops: 4,
    blurb: "Clay, cuneiform, and the invention of keeping a record that outlives you.",
  },
];

export const tourMeta = (tour) => `${tour.stops} stops · ${tour.mins} min`;

export const STOPS = [
  {
    n: 1,
    name: "Diplodocus",
    code: "#5604",
    img: IMG.diplodocus,
    hall: "Hall of Giants · Level 1",
    seconds: 190,
    transcript:
      "Stand at the tail and look along the length of it. Twenty-six metres, and almost half of that is neck and tail — an animal built like a suspension bridge…",
    body: "Diplodocus lived during the Late Jurassic, roughly 152–149 million years ago, in what is now western North America. Its fossils are common in the Morrison Formation, a region spanning Colorado, Wyoming, Montana and Utah.",
  },
  {
    n: 2,
    name: "Brontossaurus",
    code: "#5607",
    img: IMG.hall,
    hall: "Hall of Giants · Level 1",
    seconds: 165,
    transcript:
      "This one caused a hundred-year argument. For decades, palaeontologists insisted Brontosaurus didn't exist — that it was just a Diplodocus skeleton with the wrong skull attached…",
    body: "For most of the twentieth century, Brontosaurus was considered a synonym of Apatosaurus. A 2015 study of over 470 sauropod bones reinstated it as a genus in its own right, based on differences too fine for early palaeontologists to measure.",
  },
  {
    n: 3,
    name: "Pterodactyl",
    code: "#5611",
    img: IMG.dinoGolden,
    hall: "Sky Gallery · Level 2",
    seconds: 140,
    transcript:
      "It never touched dinosaur bone. Pterodactyls flew millions of years before the first bird, on wings made of skin stretched from a single elongated finger…",
    body: "Pterodactylus was the first pterosaur ever named, described in 1809 from a fossil found in the limestone quarries of Bavaria. Its wingspan rarely exceeded one metre — smaller than the giants that came later in the group's 150-million-year run.",
  },
  {
    n: 4,
    name: "Allosaurus",
    code: "#5615",
    img: IMG.ribs,
    hall: "Predator Room · Level 2",
    seconds: 220,
    transcript:
      "Look at the jaw. Allosaurus didn't crush its prey — it slashed, striking and pulling back, like a hatchet more than a set of teeth…",
    body: "Allosaurus was the dominant predator of the Late Jurassic in North America, hunting alongside — and likely preying on — young sauropods such as Diplodocus. More Allosaurus fossils have been recovered than any other large Jurassic predator.",
  },
];

export const ARTEFACTS = [
  {
    name: "Diplodocus",
    latin: "Diplodocus longus, Marsh 1878",
    code: "#5604",
    img: IMG.diplodocus,
    figImg: IMG.ribs,
    figCaption:
      "Dorsal vertebrae, mounted 1908. The chevrons that give the genus its name sit further along the tail.",
    plaque: [
      { k: "Period", v: "Late Jurassic · 152–149 Ma" },
      { k: "Found", v: "Como Bluff, Wyoming · 1899" },
      { k: "Length", v: "26 metres" },
      { k: "On display since", v: "1908" },
    ],
    origin1:
      "Diplodocus is an extinct genus of long-necked sauropod dinosaurs that lived during the Late Jurassic period, roughly 152–149 million years ago, in what is now western and mid-western North America. Its fossils are especially common in the Morrison Formation, a sediment-rich region spanning Colorado, Wyoming, Montana and Utah.",
    origin2:
      "The first Diplodocus fossils were discovered in 1877 by S. W. Williston, and the genus was formally named in 1878 by the palaeontologist Othniel Charles Marsh. The name comes from the Greek diplos, “double”, and dokos, “beam” — a reference to the double-beamed chevron bones on the underside of its tail.",
    habits1:
      "Diplodocus was a herbivore, feeding primarily on Jurassic vegetation such as conifers, ferns and other soft plants. Its narrow, peg-like teeth — located only at the front of the jaws — were adapted for stripping leaves, not chewing. Estimates suggest it consumed around 41 kg of plant material a day.",
    habits2:
      "Its long neck let it reach vegetation at various heights, and some evidence suggests it could rear up on its hind legs to reach higher branches, using its powerful tail as a stabilising prop.",
  },
  {
    name: "Brontosaurus",
    latin: "Brontosaurus excelsus, Marsh 1879",
    code: "#5607",
    img: IMG.hall,
    figImg: IMG.dinoGolden,
    figCaption:
      "Cervical vertebrae. The hollow chambers inside kept a fourteen-tonne animal light enough to walk.",
    plaque: [
      { k: "Period", v: "Late Jurassic · 156–146 Ma" },
      { k: "Found", v: "Como Bluff, Wyoming · 1879" },
      { k: "Length", v: "22 metres" },
      { k: "On display since", v: "1912" },
    ],
    origin1:
      "Brontosaurus — “thunder lizard” — was named by Othniel Charles Marsh in 1879 from a near-complete skeleton recovered at Como Bluff, Wyoming. It lived across the same Morrison Formation floodplains as Diplodocus, browsing the same conifer stands.",
    origin2:
      "For most of the twentieth century the name was considered invalid: a 1903 study concluded the animal was simply an Apatosaurus, and museums quietly relabelled their mounts. A 2015 analysis of more than 470 sauropod bones reinstated Brontosaurus as a genus in its own right.",
    habits1:
      "Brontosaurus was a bulk herbivore, stripping foliage with blunt, spatulate teeth and swallowing it whole. Digestion happened in an enormous gut rather than in the mouth, and gastroliths — swallowed stones — may have helped break the material down.",
    habits2:
      "Its neck was held closer to horizontal than older reconstructions suggested, sweeping side to side across low vegetation rather than reaching up into the canopy. Trackways indicate herds moved together, with juveniles kept toward the centre.",
  },
  {
    name: "Pterodactylus",
    latin: "Pterodactylus antiquus, Cuvier 1809",
    code: "#5611",
    img: IMG.dinoGolden,
    figImg: IMG.cracks,
    figCaption:
      "Wing-finger phalanges. A single elongated fourth finger carried the entire wing membrane.",
    plaque: [
      { k: "Period", v: "Late Jurassic · 150.8–148.5 Ma" },
      { k: "Found", v: "Solnhofen limestone, Bavaria" },
      { k: "Wingspan", v: "1.04 metres" },
      { k: "On display since", v: "1931" },
    ],
    origin1:
      "Pterodactylus was the first pterosaur ever named, described by Georges Cuvier in 1809 from a fossil split out of the Solnhofen limestone quarries in Bavaria. The stone there is so fine that wing membranes, throat pouches and stomach contents survive as impressions.",
    origin2:
      "It was not a dinosaur, and it was not a bird. Pterosaurs were a separate order of flying reptiles that took to the air tens of millions of years before the first feathered flight, and held it for around 150 million years.",
    habits1:
      "Pterodactylus fed mainly on fish and small invertebrates, taken from the shallow lagoons that covered southern Germany in the Late Jurassic. Its long, narrow jaws carried around ninety fine teeth, tapering toward the tip.",
    habits2:
      "Wing proportions suggest slow, manoeuvrable flight rather than sustained soaring. On the ground it walked on all fours, folding the wing-finger up and out of the way — a gait confirmed by fossil trackways.",
  },
  {
    name: "Allosaurus",
    latin: "Allosaurus fragilis, Marsh 1877",
    code: "#5615",
    img: IMG.ribs,
    figImg: IMG.hall,
    figCaption:
      "Left maxilla. Serrated, blade-like teeth were shed and regrown continuously throughout life.",
    plaque: [
      { k: "Period", v: "Late Jurassic · 155–145 Ma" },
      { k: "Found", v: "Cleveland-Lloyd Quarry, Utah" },
      { k: "Length", v: "8.5 metres" },
      { k: "On display since", v: "1927" },
    ],
    origin1:
      "Allosaurus was the dominant large predator of Late Jurassic North America, named by Othniel Charles Marsh in 1877. The Cleveland-Lloyd Quarry in Utah has produced more Allosaurus material than any other site — at least forty-six individuals from a single deposit.",
    origin2:
      "Why so many predators died in one place remains unsettled. The leading explanation is a shallow, drying watering hole that trapped prey, then trapped the animals that came for it.",
    habits1:
      "Allosaurus hunted the sauropods it shared the floodplain with, including juvenile Diplodocus. Its skull was built light and flexible, and its teeth were blades rather than crushers — evidence points to slashing attacks that let the animal strike and withdraw.",
    habits2:
      "Many specimens carry healed injuries: broken ribs, damaged shoulder blades, infected bone. These were animals that survived serious harm and kept hunting, sometimes for years afterwards.",
  },
];

export const SEARCH_RESULTS = [
  { name: "Diplodocus", sub: "#5604 · Hall of Giants · Level 1", img: IMG.diplodocus, artefact: 0 },
  { name: "Diplodocus vertebra cast", sub: "#5604-A · Hall of Giants · Level 1", img: IMG.ribs, artefact: 0 },
  { name: "Diplodocus jaw fragment", sub: "#5602 · Hall of Giants · Level 1", img: IMG.dinoGolden, artefact: 0 },
];

export const SHOP_ITEMS = [
  { name: "Diplodocus resin cast", price: "€18", img: IMG.diplodocus },
  { name: "Field Guide to the Jurassic", price: "€12", img: IMG.goldHand },
  { name: "Museum tote bag", price: "€9", img: IMG.ribs },
];

export const COMPLETE_STATS = [
  { n: "4", k: "Stops seen" },
  { n: "45", k: "Minutes" },
  { n: "152M", k: "Years back" },
];

/* --- Floor plan ----------------------------------------------------------- */

export const LEVELS = [
  {
    title: "Ground floor",
    sub: "Entrance · Tickets · Café",
    rooms: [
      { n: "Café", sub: "Moderate", crowd: "moderate", x: 4, y: 26, w: 40, h: 26 },
      { n: "Gift Shop", sub: "Quiet", crowd: "quiet", x: 56, y: 26, w: 40, h: 26 },
      { n: "Cloakroom & Lockers", sub: "Quiet", crowd: "quiet", x: 4, y: 54, w: 40, h: 22 },
      { n: "Ticket Desk", sub: "Moderate", crowd: "moderate", x: 56, y: 54, w: 40, h: 22 },
      { n: "Stairs & Lift · to Level 1", sub: "Open", crowd: "service", x: 4, y: 4, w: 92, h: 20 },
      { n: "Entrance Hall · Gates 01–04", sub: "Quiet", crowd: "quiet", x: 4, y: 78, w: 92, h: 18 },
    ],
    doors: [
      { x: 44, y: 34, l: 10, v: true },
      { x: 56, y: 34, l: 10, v: true },
      { x: 44, y: 60, l: 10, v: true },
      { x: 56, y: 60, l: 10, v: true },
      { x: 44, y: 24, l: 12, v: false },
      { x: 44, y: 78, l: 12, v: false },
    ],
    pins: [],
    here: [18, 84],
    route: "M18 84 L50 84 L50 78 L50 24",
  },
  {
    title: "Level 1",
    sub: "Hall of Giants · Dinosaur Era stops 1–2",
    rooms: [
      { n: "Hall of Giants", sub: "Overcrowded · 18 min", crowd: "busy", x: 4, y: 4, w: 92, h: 42 },
      { n: "East Wing · Fossils", sub: "Moderate", crowd: "moderate", x: 4, y: 52, w: 42, h: 24 },
      { n: "West Wing · Geology", sub: "Quiet", crowd: "quiet", x: 54, y: 52, w: 42, h: 24 },
      { n: "Stairs & Lift · to Level 2", sub: "Open", crowd: "service", x: 4, y: 78, w: 92, h: 18 },
    ],
    doors: [
      { x: 50, y: 46, l: 14, v: false },
      { x: 25, y: 52, l: 12, v: false },
      { x: 75, y: 52, l: 12, v: false },
      { x: 50, y: 76, l: 14, v: false },
    ],
    pins: [
      { n: 1, name: "Diplodocus", x: 24, y: 14, target: 0 },
      { n: 2, name: "Brontosaurus", x: 72, y: 26, target: 1 },
    ],
    here: [18, 83],
    route: "M18 83 L50 83 L50 76 L50 46 L24 18",
  },
  {
    title: "Level 2",
    sub: "Sky Gallery · Dinosaur Era stops 3–4",
    rooms: [
      { n: "Sky Gallery", sub: "Quiet", crowd: "quiet", x: 4, y: 4, w: 44, h: 38 },
      { n: "Predator Room", sub: "Moderate", crowd: "moderate", x: 52, y: 4, w: 44, h: 38 },
      { n: "Corridor", sub: "Quiet", crowd: "service", x: 4, y: 46, w: 92, h: 12 },
      { n: "Clay Hall · Mesopotamia", sub: "Quiet", crowd: "quiet", x: 4, y: 60, w: 92, h: 20 },
      { n: "Stairs & Lift", sub: "Open", crowd: "service", x: 4, y: 82, w: 92, h: 14 },
    ],
    doors: [
      { x: 26, y: 42, l: 12, v: false },
      { x: 74, y: 42, l: 12, v: false },
      { x: 50, y: 58, l: 14, v: false },
      { x: 50, y: 80, l: 14, v: false },
    ],
    pins: [
      { n: 3, name: "Pterodactylus", x: 26, y: 13, target: 2 },
      { n: 4, name: "Allosaurus", x: 74, y: 13, target: 3 },
    ],
    here: [18, 87],
    route: "M18 87 L50 87 L50 52 L26 42 L26 17",
  },
];

export const MAP_LEGEND = [
  { name: "Quiet", colour: "rgba(240,230,211,.45)" },
  { name: "Moderate", colour: "#E08B3A" },
  { name: "Overcrowded", colour: "#C4443E" },
];

export const CROWD_ROWS = [
  { k: "Current wait", v: "about 18 min" },
  { k: "Visitors inside", v: "42 of 30 capacity" },
  { k: "Expected to clear", v: "11:45" },
];

/* --- Navigation ----------------------------------------------------------- */

export const TABS = [
  {
    id: "home",
    name: "Home",
    d: "M3.5 11.2 12 4.2l8.5 7v8.3a1 1 0 0 1-1 1h-4.7v-5.8H9.2v5.8H4.5a1 1 0 0 1-1-1z",
  },
  {
    id: "tours",
    name: "Tours",
    d: "M4 14.2v-2a8 8 0 0 1 16 0v2M4 14.2h2.6a.6.6 0 0 1 .6.6v4.6a.6.6 0 0 1-.6.6H5a1 1 0 0 1-1-1zM20 14.2h-2.6a.6.6 0 0 0-.6.6v4.6a.6.6 0 0 0 .6.6H19a1 1 0 0 0 1-1z",
  },
  {
    id: "scan",
    name: "Scan",
    d: "M4 8.4V5.5a1.5 1.5 0 0 1 1.5-1.5H8.4M15.6 4h2.9A1.5 1.5 0 0 1 20 5.5v2.9M20 15.6v2.9a1.5 1.5 0 0 1-1.5 1.5h-2.9M8.4 20H5.5A1.5 1.5 0 0 1 4 18.5v-2.9M4.6 12h14.8",
  },
  {
    id: "map",
    name: "Map",
    d: "M12 20.8c4.4-4.5 6.6-7.9 6.6-10.4a6.6 6.6 0 1 0-13.2 0c0 2.5 2.2 5.9 6.6 10.4zM12 8.3a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z",
  },
  {
    id: "tickets",
    name: "Ticket",
    d: "M3.2 9.4V7.2a1.2 1.2 0 0 1 1.2-1.2h15.2a1.2 1.2 0 0 1 1.2 1.2v2.2a2.6 2.6 0 0 0 0 5.2v2.2a1.2 1.2 0 0 1-1.2 1.2H4.4a1.2 1.2 0 0 1-1.2-1.2v-2.2a2.6 2.6 0 0 0 0-5.2zM14.6 6.4v11.2",
  },
];

/* Which tab lights up for a given screen. */
export const TAB_FOR_SCREEN = {
  home: "home",
  tours: "tours",
  tourdetail: "tours",
  stop: "tours",
  complete: "tours",
  map: "map",
  mapcrowd: "map",
  scan: "scan",
  scanning: "scan",
  found: "scan",
  searchnum: "scan",
  searchname: "scan",
  artefact: "scan",
  tickets: "tickets",
  confirm: "tickets",
};

export const SCREENS_WITH_TAB_BAR = [
  "home", "tours", "tourdetail", "map", "scan", "tickets", "artefact", "complete", "confirm",
];

/* Screens whose top chrome sits over a full-bleed photograph. */
export const SCREENS_OVER_PHOTO = [
  "home", "artefact", "tourdetail", "stop", "map", "mapcrowd", "complete", "language",
];

export const SCREENS_WITHOUT_TOP_NAV = [
  "splash", "langloading", "paying", "scanning", "menu", "wallet", "found", "scan", "home",
];

export const SCREENS_WITHOUT_SCRIM = [
  "splash", "langloading", "paying", "scanning", "scan", "menu", "wallet", "found", "mapcrowd",
];

export const TOP_NAV_TITLES = {
  language: "Setup",
  access: "Setup",
  ticket1: "Ticket · 1 of 4",
  tickettime: "Ticket · 2 of 4",
  ticket2: "Ticket · 3 of 4",
  ticket3: "Ticket · 4 of 4",
  checkout: "Checkout",
  confirm: "Your ticket",
  tickets: "My tickets",
  map: "Level plan",
  mapcrowd: "Level plan",
  searchnum: "Artefact number",
  searchname: "Search",
  artefact: "Artefact",
  tours: "All tours",
  tourdetail: "Dinosaur Era",
  complete: "Dinosaur Era",
};

/* Sheets slide up from the bottom rather than cross-fading. */
export const SHEET_SCREENS = ["menu", "wallet", "mapcrowd", "found"];

/* Where the back control goes from each screen. */
export const BACK_TARGETS = {
  menu: "home",
  ticket1: "home",
  tickettime: "ticket1",
  ticket2: "tickettime",
  ticket3: "ticket2",
  checkout: "ticket3",
  confirm: "home",
  wallet: "confirm",
  tickets: "home",
  mapcrowd: "map",
  scanning: "scan",
  found: "scan",
  searchnum: "scan",
  searchname: "scan",
  tours: "home",
  tourdetail: "tours",
  stop: "tourdetail",
  complete: "tourdetail",
  map: "home",
  scan: "home",
  access: "language",
  language: "splash",
};

/* --- Presentation copy (the harness, not the app) ------------------------- */

export const SCREEN_INFO = {
  splash: { t: "App loading", ch: "01 · Arrival", note: "The collection wakes: a slow drift over the great hall, grain, and one amber ember of light." },
  language: { t: "Choose your language", ch: "01 · Arrival", note: "Accessibility is the first question the app asks, not a settings page found on day three. British Sign Language sits at the same level as every spoken language." },
  langloading: { t: "Preparing your visit", ch: "01 · Arrival", note: "A gold-leaf hold while the guide is fetched, then a cross-fade into the next step." },
  access: { t: "Make it readable", ch: "01 · Arrival", note: "Text size, appearance and contrast are live here — move them and the whole prototype responds." },
  home: { t: "Home", ch: "02 · Plan", note: "One hero, one primary action. Tours are labelled free before anyone can mistake them for paid." },
  menu: { t: "Menu", ch: "02 · Plan", note: "A sheet rather than a page, so you never lose your place." },
  ticket1: { t: "Visitors & tickets", ch: "03 · Ticket", note: "Ticket type and visitor count are one decision now, made first, instead of split across two separate screens." },
  tickettime: { t: "Date & time slot", ch: "03 · Ticket", note: "Timed entry, sold-out slots marked before they are tapped." },
  ticket2: { t: "Starting gate", ch: "03 · Ticket", note: "Choosing a starting tour and gate distributes the crowd before anyone arrives. Full gates are visible, not hidden." },
  ticket3: { t: "Visitor details", ch: "03 · Ticket", note: "Locker and accommodation questions are radio buttons now — one glance, one tap — after testing showed dropdowns felt heavy." },
  checkout: { t: "Checkout", ch: "03 · Ticket", note: "Total first, method second, one commitment." },
  paying: { t: "Processing", ch: "03 · Ticket", note: "A held beat before the confirmation lands, so it registers as an event." },
  confirm: { t: "Ticket ready", ch: "03 · Ticket", note: "Save actions sit above the fold — the fix for testers who were not sure the ticket had saved." },
  wallet: { t: "Added to Wallet", ch: "03 · Ticket", note: "Explicit confirmation, then straight back to the visit." },
  tickets: { t: "My tickets", ch: "03 · Ticket", note: "Always in the menu, always in the same place." },
  map: { t: "Floor map", ch: "04 · Inside", note: "Aged cartography over the museum plan. Levels cross-fade, crowd density pulses live, pins reveal in sequence." },
  mapcrowd: { t: "Overcrowded room", ch: "04 · Inside", note: "“Skip that room for now” becomes a one-glance decision, with an alternative offered." },
  scan: { t: "Scan an artefact", ch: "04 · Inside", note: "Explanatory text on the scanner, after testers read the code icon as a calculator." },
  scanning: { t: "Focus lock", ch: "04 · Inside", note: "The reticle closes on the code and the frame breathes — you can feel it working." },
  found: { t: "Artefact found", ch: "04 · Inside", note: "The object announces itself before the page opens." },
  searchnum: { t: "Enter the number", ch: "04 · Inside", note: "For when the crowd beat you to the code, or a phone camera is not an option." },
  searchname: { t: "Search by name", ch: "04 · Inside", note: "Same destination, different route in." },
  artefact: { t: "Artefact label", ch: "04 · Inside", note: "A wall label that scrolls: plaque first, audio guide second, the long read after. Each of the four tour stops opens its own label." },
  tours: { t: "All tours", ch: "05 · Tour", note: "Prices removed entirely; every card says free with your ticket." },
  tourdetail: { t: "Dinosaur Era", ch: "05 · Tour", note: "Four stops, forty-five minutes, laid out as a route rather than a list." },
  stop: { t: "Tour stop", ch: "05 · Tour", note: "The audio player is the screen. Waveform, transcript, and Previous / Next spelled out." },
  complete: { t: "Tour complete", ch: "06 · Remember", note: "Recommendations toned right down: what the discount is, and that it is optional." },
};

export const CHAPTERS = [
  { num: "01", name: "Arrival", note: "Language and reading comfort before anything is asked of you.", ids: ["splash", "language", "langloading", "access"] },
  { num: "02", name: "Plan", note: "What is here, when it opens, what it costs.", ids: ["home", "menu"] },
  { num: "03", name: "Ticket", note: "Visitors and ticket type first, then time, then gate.", ids: ["ticket1", "tickettime", "ticket2", "ticket3", "checkout", "paying", "confirm", "wallet", "tickets"] },
  { num: "04", name: "Inside", note: "Finding the thing, and hearing about it.", ids: ["map", "mapcrowd", "scan", "scanning", "found", "searchnum", "searchname", "artefact"] },
  { num: "05", name: "Tour", note: "A narrative that chains the stops together.", ids: ["tours", "tourdetail", "stop"] },
  { num: "06", name: "Remember", note: "A quiet ending, not a sales pitch.", ids: ["complete"] },
];

export const THUMBS = {
  splash: IMG.hall, language: IMG.hands, langloading: IMG.sunburst, access: IMG.cracks,
  home: IMG.hall, menu: IMG.spiral, ticket1: IMG.stone, tickettime: IMG.stone,
  ticket2: IMG.arch, ticket3: IMG.arch, checkout: IMG.goldHand, paying: IMG.goldHand,
  confirm: IMG.sunburst, wallet: IMG.sunburst, tickets: IMG.spiral, map: IMG.map,
  mapcrowd: IMG.map, scan: IMG.cracks, scanning: IMG.cracks, found: IMG.diplodocus,
  searchnum: IMG.spiral, searchname: IMG.spiral, artefact: IMG.diplodocus,
  tours: IMG.dinoTour, tourdetail: IMG.dinoTour, stop: IMG.ribs, complete: IMG.firelight,
};

export const PALETTE = [
  { name: "Obsidian", hex: "#1A1714", use: "Ink" },
  { name: "Parchment", hex: "#F0E6D3", use: "Surfaces" },
  { name: "Amber", hex: "#D4782F", use: "Wayfinding" },
  { name: "Crimson", hex: "#B5312C", use: "Alerts" },
];

/* --- Derived helpers ------------------------------------------------------ */

export const NUMPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

/** Bar heights for the fake audio waveform — deterministic, so it never jitters. */
export const WAVE = Array.from({ length: 42 }, (_, i) =>
  5 + Math.round(9 + 7 * Math.sin(i * 0.8) + 5 * Math.sin(i * 0.33 + 1))
);

/** A plausible-looking 21×21 QR code: real finder patterns, filler data. */
export const QR_CELLS = (() => {
  const N = 21;
  const inFinder = (r, c) => {
    const inBox = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    if (!(inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0))) return null;
    const br = r >= N - 7 ? r - (N - 7) : r % 7;
    const bc = c >= N - 7 ? c - (N - 7) : c % 7;
    if (br === 0 || br === 6 || bc === 0 || bc === 6) return true;
    return br >= 2 && br <= 4 && bc >= 2 && bc <= 4;
  };
  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const f = inFinder(r, c);
      cells.push(f === null ? (r * 7 + c * 13 + ((r * c) % 5)) % 3 !== 0 : f);
    }
  }
  return cells;
})();

/** Seconds as m:ss. */
export function formatTime(seconds) {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
