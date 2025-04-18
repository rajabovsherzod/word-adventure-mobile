export interface Word {
  id: string;
  english: string;
  uzbek: string;
  level: number;
  cardId: number;
  lessonId: number;
  englishDefinition?: string;
  uzbekDefinition?: string;
  examples?: { english: string; uzbek: string }[];
}

export const words: Word[] = [
  // Card 1 - Boshlang'ich
  // Dars 1
  {
    id: "1-1-1",
    english: "apple",
    uzbek: "olma",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-2",
    english: "book",
    uzbek: "kitob",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-3",
    english: "cat",
    uzbek: "mushuk",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-4",
    english: "dog",
    uzbek: "it",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-5",
    english: "house",
    uzbek: "uy",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-6",
    english: "tree",
    uzbek: "daraxt",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-7",
    english: "sun",
    uzbek: "quyosh",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-8",
    english: "moon",
    uzbek: "oy",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-9",
    english: "star",
    uzbek: "yulduz",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },
  {
    id: "1-1-10",
    english: "water",
    uzbek: "suv",
    level: 1,
    cardId: 1,
    lessonId: 1,
  },

  // Dars 2
  {
    id: "1-2-1",
    english: "pen",
    uzbek: "ruchka",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-2",
    english: "desk",
    uzbek: "parta",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-3",
    english: "chair",
    uzbek: "stul",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-4",
    english: "table",
    uzbek: "stol",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-5",
    english: "door",
    uzbek: "eshik",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-6",
    english: "window",
    uzbek: "deraza",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-7",
    english: "cup",
    uzbek: "piyola",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-8",
    english: "plate",
    uzbek: "likop",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-9",
    english: "fork",
    uzbek: "vilka",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },
  {
    id: "1-2-10",
    english: "spoon",
    uzbek: "qoshiq",
    level: 1,
    cardId: 1,
    lessonId: 2,
  },

  // Dars 3
  {
    id: "1-3-1",
    english: "car",
    uzbek: "mashina",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-2",
    english: "bus",
    uzbek: "avtobus",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-3",
    english: "bike",
    uzbek: "velosiped",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-4",
    english: "train",
    uzbek: "poezd",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-5",
    english: "plane",
    uzbek: "samolyot",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-6",
    english: "ship",
    uzbek: "kema",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-7",
    english: "road",
    uzbek: "yo'l",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-8",
    english: "street",
    uzbek: "ko'cha",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-9",
    english: "bridge",
    uzbek: "ko'prik",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },
  {
    id: "1-3-10",
    english: "park",
    uzbek: "park",
    level: 1,
    cardId: 1,
    lessonId: 3,
  },

  // Dars 4
  {
    id: "1-4-1",
    english: "red",
    uzbek: "qizil",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-2",
    english: "blue",
    uzbek: "ko'k",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-3",
    english: "green",
    uzbek: "yashil",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-4",
    english: "yellow",
    uzbek: "sariq",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-5",
    english: "black",
    uzbek: "qora",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-6",
    english: "white",
    uzbek: "oq",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-7",
    english: "brown",
    uzbek: "jigarrang",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-8",
    english: "orange",
    uzbek: "apelsin",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-9",
    english: "pink",
    uzbek: "pushti",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },
  {
    id: "1-4-10",
    english: "purple",
    uzbek: "binafsha",
    level: 1,
    cardId: 1,
    lessonId: 4,
  },

  // Dars 5
  {
    id: "1-5-1",
    english: "one",
    uzbek: "bir",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-2",
    english: "two",
    uzbek: "ikki",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-3",
    english: "three",
    uzbek: "uch",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-4",
    english: "four",
    uzbek: "to'rt",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-5",
    english: "five",
    uzbek: "besh",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-6",
    english: "six",
    uzbek: "olti",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-7",
    english: "seven",
    uzbek: "yetti",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-8",
    english: "eight",
    uzbek: "sakkiz",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-9",
    english: "nine",
    uzbek: "to'qqiz",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },
  {
    id: "1-5-10",
    english: "ten",
    uzbek: "o'n",
    level: 1,
    cardId: 1,
    lessonId: 5,
  },

  // Card 2 - O'rta
  // Dars 1
  {
    id: "2-1-1",
    english: "beautiful",
    uzbek: "chiroyli",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-2",
    english: "computer",
    uzbek: "kompyuter",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-3",
    english: "difficult",
    uzbek: "qiyin",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-4",
    english: "important",
    uzbek: "muhim",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-5",
    english: "language",
    uzbek: "til",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-6",
    english: "education",
    uzbek: "ta'lim",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-7",
    english: "knowledge",
    uzbek: "bilim",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-8",
    english: "experience",
    uzbek: "tajriba",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-9",
    english: "opportunity",
    uzbek: "imkoniyat",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },
  {
    id: "2-1-10",
    english: "success",
    uzbek: "muvaffaqiyat",
    level: 2,
    cardId: 2,
    lessonId: 1,
  },

  // Dars 2
  {
    id: "2-2-1",
    english: "technology",
    uzbek: "texnologiya",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-2",
    english: "internet",
    uzbek: "internet",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-3",
    english: "information",
    uzbek: "ma'lumot",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-4",
    english: "communication",
    uzbek: "aloqa",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-5",
    english: "development",
    uzbek: "rivojlanish",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-6",
    english: "research",
    uzbek: "tadqiqot",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-7",
    english: "science",
    uzbek: "fan",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-8",
    english: "discovery",
    uzbek: "kashfiyot",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-9",
    english: "innovation",
    uzbek: "innovatsiya",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },
  {
    id: "2-2-10",
    english: "progress",
    uzbek: "taraqqiyot",
    level: 2,
    cardId: 2,
    lessonId: 2,
  },

  // Dars 3
  {
    id: "2-3-1",
    english: "business",
    uzbek: "biznes",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-2",
    english: "economy",
    uzbek: "iqtisodiyot",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-3",
    english: "market",
    uzbek: "bozor",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-4",
    english: "investment",
    uzbek: "investitsiya",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-5",
    english: "finance",
    uzbek: "moliyaviy",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-6",
    english: "management",
    uzbek: "boshqaruv",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-7",
    english: "strategy",
    uzbek: "strategiya",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-8",
    english: "competition",
    uzbek: "raqobat",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-9",
    english: "product",
    uzbek: "mahsulot",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },
  {
    id: "2-3-10",
    english: "service",
    uzbek: "xizmat",
    level: 2,
    cardId: 2,
    lessonId: 3,
  },

  // Dars 4
  {
    id: "2-4-1",
    english: "culture",
    uzbek: "madaniyat",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-2",
    english: "tradition",
    uzbek: "an'ana",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-3",
    english: "heritage",
    uzbek: "meros",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-4",
    english: "custom",
    uzbek: "odat",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-5",
    english: "festival",
    uzbek: "festival",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-6",
    english: "celebration",
    uzbek: "bayram",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-7",
    english: "ceremony",
    uzbek: "marosim",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-8",
    english: "ritual",
    uzbek: "marosim",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-9",
    english: "dance",
    uzbek: "raqs",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },
  {
    id: "2-4-10",
    english: "music",
    uzbek: "musiqa",
    level: 2,
    cardId: 2,
    lessonId: 4,
  },

  // Dars 5
  {
    id: "2-5-1",
    english: "health",
    uzbek: "sog'liq",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-2",
    english: "medicine",
    uzbek: "dori",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-3",
    english: "exercise",
    uzbek: "mashq",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-4",
    english: "nutrition",
    uzbek: "ovqatlanish",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-5",
    english: "diet",
    uzbek: "parhez",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-6",
    english: "fitness",
    uzbek: "fitnes",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-7",
    english: "wellness",
    uzbek: "farovonlik",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-8",
    english: "treatment",
    uzbek: "davolash",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-9",
    english: "prevention",
    uzbek: "oldini olish",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },
  {
    id: "2-5-10",
    english: "recovery",
    uzbek: "tuzalish",
    level: 2,
    cardId: 2,
    lessonId: 5,
  },

  // Card 3 - Yuqori
  // Dars 1
  {
    id: "3-1-1",
    english: "sophisticated",
    uzbek: "murakkab",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-2",
    english: "entrepreneur",
    uzbek: "tadbirkor",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-3",
    english: "perseverance",
    uzbek: "bardosh",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-4",
    english: "resilience",
    uzbek: "bardoshlilik",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-5",
    english: "ambition",
    uzbek: "orzu",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-6",
    english: "determination",
    uzbek: "qat'iyat",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-7",
    english: "dedication",
    uzbek: "sadoqat",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-8",
    english: "commitment",
    uzbek: "sodiqlik",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-9",
    english: "excellence",
    uzbek: "mukammallik",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },
  {
    id: "3-1-10",
    english: "achievement",
    uzbek: "yutuq",
    level: 3,
    cardId: 3,
    lessonId: 1,
  },

  // Dars 2
  {
    id: "3-2-1",
    english: "philosophy",
    uzbek: "falsafa",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-2",
    english: "metaphysics",
    uzbek: "metafizika",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-3",
    english: "epistemology",
    uzbek: "epistemologiya",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-4",
    english: "ontology",
    uzbek: "ontologiya",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-5",
    english: "ethics",
    uzbek: "axloq",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-6",
    english: "aesthetics",
    uzbek: "estetika",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-7",
    english: "logic",
    uzbek: "mantiq",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-8",
    english: "reasoning",
    uzbek: "fikrlash",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-9",
    english: "consciousness",
    uzbek: "ong",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },
  {
    id: "3-2-10",
    english: "perception",
    uzbek: "idrok",
    level: 3,
    cardId: 3,
    lessonId: 2,
  },

  // Dars 3
  {
    id: "3-3-1",
    english: "diplomacy",
    uzbek: "diplomatiya",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-2",
    english: "negotiation",
    uzbek: "muzokara",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-3",
    english: "mediation",
    uzbek: "vositachilik",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-4",
    english: "arbitration",
    uzbek: "arbitraj",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-5",
    english: "conciliation",
    uzbek: "kelishuv",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-6",
    english: "reconciliation",
    uzbek: "yarashtirish",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-7",
    english: "compromise",
    uzbek: "kelishuv",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-8",
    english: "consensus",
    uzbek: "kelishuv",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-9",
    english: "agreement",
    uzbek: "kelishuv",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },
  {
    id: "3-3-10",
    english: "treaty",
    uzbek: "shartnoma",
    level: 3,
    cardId: 3,
    lessonId: 3,
  },

  // Dars 4
  {
    id: "3-4-1",
    english: "quantum",
    uzbek: "kvant",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-2",
    english: "relativity",
    uzbek: "nisbiylik",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-3",
    english: "cosmology",
    uzbek: "kosmologiya",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-4",
    english: "astrophysics",
    uzbek: "astrofizika",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-5",
    english: "particle",
    uzbek: "zarra",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-6",
    english: "nucleus",
    uzbek: "yadro",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-7",
    english: "molecule",
    uzbek: "molekula",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-8",
    english: "atom",
    uzbek: "atom",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-9",
    english: "electron",
    uzbek: "elektron",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },
  {
    id: "3-4-10",
    english: "proton",
    uzbek: "proton",
    level: 3,
    cardId: 3,
    lessonId: 4,
  },

  // Dars 5
  {
    id: "3-5-1",
    english: "jurisprudence",
    uzbek: "yurisprudensiya",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-2",
    english: "constitution",
    uzbek: "konstitutsiya",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-3",
    english: "legislation",
    uzbek: "qonunchilik",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-4",
    english: "jurisdiction",
    uzbek: "yurisdiktsiya",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-5",
    english: "precedent",
    uzbek: "pretsedent",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-6",
    english: "litigation",
    uzbek: "sud jarayoni",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-7",
    english: "arbitration",
    uzbek: "arbitraj",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-8",
    english: "mediation",
    uzbek: "vositachilik",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-9",
    english: "appeal",
    uzbek: "shikoyat",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
  {
    id: "3-5-10",
    english: "verdict",
    uzbek: "hukm",
    level: 3,
    cardId: 3,
    lessonId: 5,
  },
];

export const getWordsByCardAndLesson = (
  cardId: number,
  lessonId: number
): Word[] => {
  return words.filter(
    (word) => word.cardId === cardId && word.lessonId === lessonId
  );
};

export const getWordsByLevel = (level: number): Word[] => {
  return words.filter((word) => word.level === level);
};

export const searchWords = (
  query: string,
  searchType: "english" | "uzbek" = "english"
): Word[] => {
  if (!query || query.trim() === "") {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase().trim();

  return words
    .filter((word) => {
      if (searchType === "english") {
        return word.english.toLowerCase().includes(lowerCaseQuery);
      } else {
        return word.uzbek.toLowerCase().includes(lowerCaseQuery);
      }
    })
    .map((word) => ({
      ...word,
      englishDefinition: getWordDefinition(word, "english"),
      uzbekDefinition: getWordDefinition(word, "uzbek"),
      examples: getWordExamples(word),
    }));
};

export const getWordById = (id: string): Word | null => {
  const word = words.find((w) => w.id === id);
  if (!word) {
    return null;
  }

  return {
    ...word,
    englishDefinition: getWordDefinition(word, "english"),
    uzbekDefinition: getWordDefinition(word, "uzbek"),
    examples: getWordExamples(word),
  };
};

// Helper funksiyalar
function getWordDefinition(word: Word, language: "english" | "uzbek"): string {
  // Eng ko'p ishlatilgan so'zlar uchun real definitionlar
  const englishDefinitions: { [key: string]: string } = {
    apple: "A round fruit with red, yellow, or green skin and crisp flesh.",
    book: "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
    cat: "A small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws.",
    dog: "A domesticated carnivorous mammal that typically has a long snout and an acute sense of smell.",
    house:
      "A building for human habitation, especially one that is lived in by a family or small group of people.",
    tree: "A perennial plant with a single woody stem or trunk, growing to a considerable height and bearing lateral branches.",
    sun: "The star around which the earth orbits and provides the light and warmth necessary for life.",
    water:
      "A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain.",
    car: "A road vehicle powered by an engine and designed to carry a small number of passengers.",
    table:
      "A piece of furniture with a flat top and one or more legs, providing a surface for eating, writing, or working.",
    door: "A hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle.",
    window:
      "An opening in the wall or roof of a building or vehicle, fitted with glass in a frame to admit light or air.",
    pen: "An instrument for writing or drawing with ink, typically consisting of a metal nib or ball.",
    chair:
      "A separate seat for one person, typically with a back and four legs.",
    food: "Any nutritious substance that people or animals eat or drink to maintain life and growth.",
    friend:
      "A person whom one knows and with whom one has a bond of mutual affection.",
    school:
      "An institution for educating children or people under college age.",
    teacher: "A person who teaches, especially in a school.",
    student: "A person who is studying at a school, college, or university.",
    work: "Activity involving mental or physical effort done in order to achieve a purpose or result.",
  };

  const uzbekDefinitions: { [key: string]: string } = {
    olma: "Qizil, sariq yoki yashil po'stli va qattiq etli dumaloq meva.",
    kitob:
      "Bir tomoni yopishtirilgan yoki tikilgan va muqovalangan sahifalardan iborat yozma yoki bosma asar.",
    mushuk:
      "Yumshoq junli, kalta tumshukli va tortib olinadigan tirnoqlari bor kichik uy yirtqich hayvoni.",
    it: "Odatda uzun tumshukli va hid sezish qobiliyati o'tkir bo'lgan uy yirtqich hayvoni.",
    uy: "Inson yashashi uchun mo'ljallangan bino, ayniqsa oila yoki kichik guruh odamlar yashaydigan bino.",
    daraxt:
      "Tanasi yog'ochsimon bo'lgan, ancha balandlikka o'sadigan va yon shoxlari bor ko'p yillik o'simlik.",
    quyosh:
      "Yer uning atrofida aylanadigan va hayot uchun zarur bo'lgan yorug'lik va issiqlikni ta'minlab beruvchi yulduz.",
    suv: "Dengizlar, ko'llar, daryolar va yomg'irlarni hosil qiluvchi rangsiz, shaffof, hidsiz suyuqlik.",
    mashina:
      "Dvigatel bilan harakatlanadigan va oz sonli yo'lovchilarni tashish uchun mo'ljallangan yo'l transport vositasi.",
    stol: "Bir yoki bir nechta oyoqlari bor yassi ustki qismli, ovqatlanish, yozish yoki ishlash yuzasi sifatida xizmat qiluvchi mebel.",
    eshik:
      "Bino, xona yoki transport vositasiga kirish joyidagi sharnirli, sirg'aluvchan yoki aylanuvchi to'siq.",
    deraza:
      "Bino yoki transport vositasining devor yoki tomidagi, yorug'lik yoki havo kirishi uchun romga o'rnatilgan shisha bilan jihozlangan ochilish joyi.",
    ruchka:
      "Siyoh bilan yozish yoki chizish uchun mo'ljallangan, odatda metall uchi yoki shariki bo'lgan asbob.",
    stul: "Bir kishi uchun mo'ljallangan, odatda orqa suyanchig'i va to'rtta oyog'i bo'lgan alohida o'rindiq.",
    ovqat:
      "Odamlar yoki hayvonlar hayot va o'sishni saqlab qolish uchun iste'mol qiladigan har qanday to'yimli modda.",
    "do'st": "Inson biladigan va o'zaro mehr-muhabbat aloqasi bo'lgan shaxs.",
    maktab:
      "Bolalar yoki kollej yoshidan kichik bo'lgan odamlarni o'qitish instituti.",
    "o'qituvchi": "O'qituvchi, ayniqsa maktabda dars beruvchi shaxs.",
    "o'quvchi": "Maktab, kollej yoki universitetda ta'lim olayotgan shaxs.",
    ish: "Biror maqsad yoki natijaga erishish uchun bajarilgan aqliy yoki jismoniy faoliyat.",
  };

  if (language === "english") {
    return (
      englishDefinitions[word.english] ||
      `A word referring to ${word.english}, commonly translated as "${word.uzbek}" in Uzbek.`
    );
  } else {
    return (
      uzbekDefinitions[word.uzbek] ||
      `"${word.uzbek}" so'zi, ingliz tilida "${word.english}" deb tarjima qilinadi.`
    );
  }
}

function getWordExamples(word: Word): { english: string; uzbek: string }[] {
  // Eng ko'p ishlatilgan so'zlar uchun real misollar
  const examples: { [key: string]: { english: string; uzbek: string }[] } = {
    apple: [
      {
        english: "I eat an apple every morning for breakfast.",
        uzbek: "Men har kuni ertalab nonushtaga olma yeyman.",
      },
      {
        english: "The apple trees in our garden produce delicious fruit.",
        uzbek: "Bog'imizdagi olma daraxtlari mazali meva beradi.",
      },
    ],
    book: [
      {
        english: "I'm reading an interesting book about history.",
        uzbek: "Men tarix haqida qiziqarli kitob o'qiyapman.",
      },
      {
        english: "He writes books for children.",
        uzbek: "U bolalar uchun kitoblar yozadi.",
      },
    ],
    cat: [
      {
        english: "My cat likes to sleep on the windowsill.",
        uzbek: "Mushugim deraza tokchasida uxlashni yaxshi ko'radi.",
      },
      {
        english: "The cat caught a mouse in the garden.",
        uzbek: "Mushuk bog'da sichqon tutdi.",
      },
    ],
    dog: [
      {
        english: "We take our dog for a walk every evening.",
        uzbek: "Biz itimizni har kuni kechqurun sayrga olib chiqamiz.",
      },
      {
        english: "The dog barked at the stranger.",
        uzbek: "It notanish odamga qarab hurdi.",
      },
    ],
    house: [
      {
        english: "They built a new house last year.",
        uzbek: "Ular o'tgan yili yangi uy qurdilar.",
      },
      {
        english: "Our house has three bedrooms and two bathrooms.",
        uzbek: "Bizning uyimizda uchta yotoqxona va ikkita hammom bor.",
      },
    ],
    water: [
      {
        english: "You should drink eight glasses of water every day.",
        uzbek: "Siz har kuni sakkiz stakan suv ichishingiz kerak.",
      },
      {
        english: "The water in this lake is very clear.",
        uzbek: "Bu ko'ldagi suv juda toza.",
      },
    ],
  };

  // So'z uchun alohida misollar bo'lsa, ularni qaytaramiz
  if (examples[word.english]) {
    return examples[word.english];
  }

  // Aks holda, standart misollarni qaytaramiz
  return [
    {
      english: `I can see the ${word.english} over there.`,
      uzbek: `Men anavi yerdagi ${word.uzbek}ni ko'ra olaman.`,
    },
    {
      english: `She likes the ${word.english} very much.`,
      uzbek: `U ${word.uzbek}ni juda yaxshi ko'radi.`,
    },
  ];
}

export const getAllWordsSorted = (
  lang: "english" | "uzbek" = "english"
): Word[] => {
  // Barcha so'zlarni ko'chirish va har biriga haqiqiy definitionlar va misollar qo'shish
  const allWords = words.map((word) => ({
    ...word,
    englishDefinition: getWordDefinition(word, "english"),
    uzbekDefinition: getWordDefinition(word, "uzbek"),
    examples: getWordExamples(word),
  }));

  // Alifbo bo'yicha saralash
  return allWords.sort((a, b) => {
    if (lang === "english") {
      return a.english.localeCompare(b.english);
    } else {
      return a.uzbek.localeCompare(b.uzbek);
    }
  });
};
