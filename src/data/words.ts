export type Word = {
  id: string;
  english: string;
  uzbek: string;
  englishDefinition: string;
  uzbekDefinition: string;
  examples: {
    english: string;
    uzbek: string;
  }[];
};

export const words: Word[] = [
  {
    id: "1",
    english: "book",
    uzbek: "kitob",
    englishDefinition:
      "A written or printed work consisting of pages glued or sewn together",
    uzbekDefinition:
      "Yopishqoq yoki tikilgan sahifalardan iborat yozma yoki bosma asar",
    examples: [
      {
        english: "I bought a book today",
        uzbek: "Men bugun kitob sotib oldim",
      },
      {
        english: "She loves reading books",
        uzbek: "U kitoblarni o'qishni yaxshi ko'radi",
      },
    ],
  },
  {
    id: "2",
    english: "house",
    uzbek: "uy",
    englishDefinition: "A building for human habitation",
    uzbekDefinition: "Odamlar yashashi uchun bino",
    examples: [
      {
        english: "I live in a big house",
        uzbek: "Men katta uyda yashayman",
      },
      {
        english: "They are building a new house",
        uzbek: "Ular yangi uy qurishyapti",
      },
    ],
  },
  {
    id: "3",
    english: "car",
    uzbek: "mashina",
    englishDefinition:
      "A road vehicle with an engine, four wheels, and seats for a small number of people",
    uzbekDefinition:
      "Kichik sonli odamlar uchun o'rindiqlar, to'rt g'ildirak va dvigatel bilan jihozlangan yo'l transporti",
    examples: [
      {
        english: "He bought a new car last week",
        uzbek: "U o'tgan hafta yangi mashina sotib oldi",
      },
      {
        english: "I need to wash my car",
        uzbek: "Menga mashinamni yuvish kerak",
      },
    ],
  },
  {
    id: "4",
    english: "computer",
    uzbek: "kompyuter",
    englishDefinition: "An electronic device for storing and processing data",
    uzbekDefinition:
      "Ma'lumotlarni saqlash va qayta ishlash uchun elektron qurilma",
    examples: [
      {
        english: "I work on my computer every day",
        uzbek: "Men har kuni kompyuterimda ishlayman",
      },
      {
        english: "She bought a new laptop",
        uzbek: "U yangi noutbuk sotib oldi",
      },
    ],
  },
  {
    id: "5",
    english: "phone",
    uzbek: "telefon",
    englishDefinition: "A device used for voice communication",
    uzbekDefinition: "Ovozli aloqa uchun ishlatiladigan qurilma",
    examples: [
      {
        english: "I lost my phone yesterday",
        uzbek: "Men telefonimni kecha yo'qotib qo'ydim",
      },
      {
        english: "Can I borrow your phone?",
        uzbek: "Telefoningizni olishim mumkinmi?",
      },
    ],
  },
  {
    id: "6",
    english: "school",
    uzbek: "maktab",
    englishDefinition: "An institution for educating children",
    uzbekDefinition: "Bolalarni ta'lim olish uchun muassasa",
    examples: [
      {
        english: "My children go to school",
        uzbek: "Mening bolalarim maktabga boradi",
      },
      {
        english: "The school is closed today",
        uzbek: "Maktab bugun yopiq",
      },
    ],
  },
  {
    id: "7",
    english: "food",
    uzbek: "ovqat",
    englishDefinition:
      "Any nutritious substance that people or animals eat or drink",
    uzbekDefinition:
      "Odamlar yoki hayvonlar yeydigan yoki ichadigan har qanday ozuqa modda",
    examples: [
      {
        english: "I love Italian food",
        uzbek: "Men italyan ovqatini yaxshi ko'raman",
      },
      {
        english: "The food was delicious",
        uzbek: "Ovqat juda mazali edi",
      },
    ],
  },
  {
    id: "8",
    english: "water",
    uzbek: "suv",
    englishDefinition: "A colorless, transparent liquid, essential for life",
    uzbekDefinition: "Hayot uchun zarur bo'lgan rangsiz, shaffof suyuqlik",
    examples: [
      {
        english: "I need to drink more water",
        uzbek: "Menga ko'proq suv ichish kerak",
      },
      {
        english: "The water is cold",
        uzbek: "Suv sovuq",
      },
    ],
  },
  {
    id: "9",
    english: "time",
    uzbek: "vaqt",
    englishDefinition:
      "The indefinite continued progress of existence and events",
    uzbekDefinition:
      "Mavjudlik va hodisalarning cheksiz davom etuvchi jarayoni",
    examples: [
      {
        english: "What time is it?",
        uzbek: "Soat nechada?",
      },
      {
        english: "I don't have time for this",
        uzbek: "Menda buning uchun vaqt yo'q",
      },
    ],
  },
  {
    id: "10",
    english: "friend",
    uzbek: "do'st",
    englishDefinition: "A person with whom one has a bond of mutual affection",
    uzbekDefinition: "O'zaro mehr-muhabbat bog'lanishi bo'lgan shaxs",
    examples: [
      {
        english: "She is my best friend",
        uzbek: "U mening eng yaxshi do'stim",
      },
      {
        english: "We've been friends for years",
        uzbek: "Biz yillar davomida do'st bo'lganmiz",
      },
    ],
  },
];

// Search functions
export const searchWords = (
  query: string,
  language: "english" | "uzbek" = "english"
): Word[] => {
  if (!query.trim()) return [];

  const lowercaseQuery = query.toLowerCase();

  return words.filter((word) => {
    if (language === "english") {
      return word.english.toLowerCase().includes(lowercaseQuery);
    } else {
      return word.uzbek.toLowerCase().includes(lowercaseQuery);
    }
  });
};

// Get word by ID
export const getWordById = (id: string): Word | undefined => {
  return words.find((word) => word.id === id);
};
