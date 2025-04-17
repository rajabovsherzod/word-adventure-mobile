import { GrammarCourse } from "./CourseTypes";

// Grammatika kurslari uchun mock data
export const GRAMMAR_COURSES: GrammarCourse[] = [
  // 1. Beginner Grammatika Kursi
  {
    id: "grammar-beginner",
    title: "Beginner Grammatika Kursi",
    description:
      "Ingliz tili grammatikasini boshlang'ich darajada o'rganish kursi. Oddiy zamonlar, to be fe'li, artikller va olmoshlarni o'z ichiga oladi.",
    level: "Beginner",
    price: 60,
    imageUrl:
      "https://img.freepik.com/free-vector/english-teacher-concept-illustration_114360-7477.jpg",
    duration: 10,
    rating: 4.8,
    purchased: false,
    progress: 0,
    authorName: "John Smith",
    authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    tags: ["Grammar", "Beginner", "Essential"],
    modules: [
      {
        id: "beginner-mod-1",
        title: "Oddiy zamonlar",
        description:
          "Present Simple, Past Simple va Future Simple zamonlarni o'rganish",
        completed: false,
        lessons: [
          {
            id: "beginner-mod-1-les-1",
            title: "Present Simple",
            description: "Hozirgi oddiy zamon haqida",
            duration: 20,
            completed: false,
          },
          {
            id: "beginner-mod-1-les-2",
            title: "Past Simple",
            description: "O'tgan oddiy zamon haqida",
            duration: 25,
            completed: false,
          },
          {
            id: "beginner-mod-1-les-3",
            title: "Future Simple",
            description: "Kelasi oddiy zamon haqida",
            duration: 20,
            completed: false,
          },
        ],
      },
      {
        id: "beginner-mod-2",
        title: "To be fe'li",
        description: "Am/Is/Are va Was/Were fe'llarini ishlatish",
        completed: false,
        lessons: [
          {
            id: "beginner-mod-2-les-1",
            title: "Am/Is/Are",
            description: "Hozirgi zamonda to be fe'lini qo'llash",
            duration: 15,
            completed: false,
          },
          {
            id: "beginner-mod-2-les-2",
            title: "Was/Were",
            description: "O'tgan zamonda to be fe'lini qo'llash",
            duration: 15,
            completed: false,
          },
        ],
      },
      {
        id: "beginner-mod-3",
        title: "Artikller va olmoshlar",
        description: "A/An/The artikllari va shaxsiy olmoshlar",
        completed: false,
        lessons: [
          {
            id: "beginner-mod-3-les-1",
            title: "A/An/The",
            description: "Artiklarni to'g'ri ishlatish",
            duration: 20,
            completed: false,
          },
          {
            id: "beginner-mod-3-les-2",
            title: "Shaxsiy olmoshlar",
            description: "I, you, he, she kabi olmoshlar",
            duration: 15,
            completed: false,
          },
          {
            id: "beginner-mod-3-les-3",
            title: "Egalik olmoshlari",
            description: "My, your, his, her kabi egalik olmoshlari",
            duration: 15,
            completed: false,
          },
        ],
      },
    ],
  },

  // 2. Elementary Grammatika Kursi
  {
    id: "grammar-elementary",
    title: "Elementary Grammatika Kursi",
    description:
      "Present Continuous, Past Continuous, modal fe'llar, sifat va ravishlar haqida ma'lumot beriladi.",
    level: "Elementary",
    price: 75,
    imageUrl:
      "https://img.freepik.com/free-vector/student-with-laptop-studying-online-course_74855-5293.jpg",
    duration: 12,
    rating: 4.7,
    purchased: false,
    progress: 0,
    authorName: "Sarah Johnson",
    authorAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    tags: ["Grammar", "Elementary", "Modal verbs"],
    modules: [
      {
        id: "elementary-mod-1",
        title: "Davomiy zamonlar",
        description: "Present Continuous va Past Continuous",
        completed: false,
        lessons: [
          {
            id: "elementary-mod-1-les-1",
            title: "Present Continuous",
            description: "Hozirgi davomiy zamon",
            duration: 20,
            completed: false,
          },
          {
            id: "elementary-mod-1-les-2",
            title: "Past Continuous",
            description: "O'tgan davomiy zamon",
            duration: 20,
            completed: false,
          },
          {
            id: "elementary-mod-1-les-3",
            title: "Be going to",
            description: "Rejalashtirish uchun struktura",
            duration: 15,
            completed: false,
          },
        ],
      },
      {
        id: "elementary-mod-2",
        title: "Modal fe'llar",
        description: "Can/Can't va Must/Mustn't",
        completed: false,
        lessons: [
          {
            id: "elementary-mod-2-les-1",
            title: "Can/Can't",
            description: "Qobiliyat va imkoniyat bildirish",
            duration: 20,
            completed: false,
          },
          {
            id: "elementary-mod-2-les-2",
            title: "Must/Mustn't",
            description: "Majburiyat va taqiq bildirish",
            duration: 20,
            completed: false,
          },
        ],
      },
    ],
  },

  // 3. Pre-Intermediate Grammatika Kursi
  {
    id: "grammar-preintermediate",
    title: "Pre-Intermediate Grammatika Kursi",
    description:
      "Present Perfect, shartli gaplar, nisbiy olmoshlar, passiv ovoz va boshqa grammatik mavzularni o'rganish.",
    level: "Pre-Intermediate",
    price: 90,
    imageUrl:
      "https://img.freepik.com/free-vector/english-teacher-concept-illustration_114360-7477.jpg",
    duration: 15,
    rating: 4.6,
    purchased: false,
    progress: 0,
    authorName: "Michael Brown",
    authorAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    tags: ["Grammar", "Pre-Intermediate", "Conditionals"],
    modules: [
      {
        id: "preint-mod-1",
        title: "Present Perfect",
        description: "Hozirgi tugallangan zamon va uning qo'llanilishi",
        completed: false,
        lessons: [
          {
            id: "preint-mod-1-les-1",
            title: "Present Perfect",
            description: "Present Perfect zamonini o'rganish",
            duration: 25,
            completed: false,
          },
          {
            id: "preint-mod-1-les-2",
            title: "Present Perfect vs Past Simple",
            description: "Ikki zamonni solishitirish",
            duration: 20,
            completed: false,
          },
        ],
      },
      {
        id: "preint-mod-2",
        title: "Shartli gaplar (0 va 1)",
        description: "Real holatlar uchun shartli gaplar",
        completed: false,
        lessons: [
          {
            id: "preint-mod-2-les-1",
            title: "0-tur shartli gaplar",
            description: "Umumiy haqiqatlar uchun",
            duration: 20,
            completed: false,
          },
          {
            id: "preint-mod-2-les-2",
            title: "1-tur shartli gaplar",
            description: "Ehtimoliy kelasi zamon uchun",
            duration: 20,
            completed: false,
          },
        ],
      },
    ],
  },

  // 4. Intermediate Grammatika Kursi
  {
    id: "grammar-intermediate",
    title: "Intermediate Grammatika Kursi",
    description:
      "Murakkab zamonlar, 2-tur shartli gaplar, bilvosita nutq, gerund va infinitiv kabi murakkab mavzular.",
    level: "Intermediate",
    price: 110,
    imageUrl:
      "https://img.freepik.com/free-vector/teacher-concept-illustration_114360-2505.jpg",
    duration: 18,
    rating: 4.9,
    purchased: false,
    progress: 0,
    authorName: "Emma Wilson",
    authorAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
    tags: ["Grammar", "Intermediate", "Reported Speech"],
    modules: [
      {
        id: "int-mod-1",
        title: "Murakkab zamonlar",
        description: "Past Perfect, Past Perfect Continuous, Future Continuous",
        completed: false,
        lessons: [
          {
            id: "int-mod-1-les-1",
            title: "Past Perfect",
            description: "O'tgan tugallangan zamon",
            duration: 25,
            completed: false,
          },
          {
            id: "int-mod-1-les-2",
            title: "Past Perfect Continuous",
            description: "O'tgan tugallangan davomiy zamon",
            duration: 25,
            completed: false,
          },
        ],
      },
      {
        id: "int-mod-2",
        title: "Bilvosita nutq",
        description: "Reported Speech va indiret questions",
        completed: false,
        lessons: [
          {
            id: "int-mod-2-les-1",
            title: "Statements in Reported Speech",
            description: "Darak gaplarni bilvosita gaplarga aylantirish",
            duration: 20,
            completed: false,
          },
          {
            id: "int-mod-2-les-2",
            title: "Questions in Reported Speech",
            description: "Savollarni bilvosita gaplarga aylantirish",
            duration: 20,
            completed: false,
          },
        ],
      },
    ],
  },

  // 5. Upper-Intermediate Grammatika Kursi
  {
    id: "grammar-upperintermediate",
    title: "Upper-Intermediate Grammatika Kursi",
    description:
      "Yuqori darajadagi zamonlar, 3-tur shartli gaplar, murakkab passiv konstruktsiyalar va boshqalar.",
    level: "Upper-Intermediate",
    price: 130,
    imageUrl:
      "https://img.freepik.com/free-vector/language-learning-concept-illustration_114360-6613.jpg",
    duration: 20,
    rating: 4.8,
    purchased: false,
    progress: 0,
    authorName: "David Thompson",
    authorAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
    tags: ["Grammar", "Upper-Intermediate", "Complex Structures"],
    modules: [
      {
        id: "upint-mod-1",
        title: "Future Perfect va Future Perfect Continuous",
        description: "Murakkab kelasi zamonlar",
        completed: false,
        lessons: [
          {
            id: "upint-mod-1-les-1",
            title: "Future Perfect",
            description: "Kelasi tugallangan zamon",
            duration: 25,
            completed: false,
          },
          {
            id: "upint-mod-1-les-2",
            title: "Future Perfect Continuous",
            description: "Kelasi tugallangan davomiy zamon",
            duration: 25,
            completed: false,
          },
        ],
      },
      {
        id: "upint-mod-2",
        title: "Murakkab shartli gaplar",
        description: "3-tur va aralash shartli gaplar",
        completed: false,
        lessons: [
          {
            id: "upint-mod-2-les-1",
            title: "3-tur shartli gaplar",
            description: "O'tgan zamonda real bo'lmagan holatlar",
            duration: 25,
            completed: false,
          },
          {
            id: "upint-mod-2-les-2",
            title: "Aralash turlar",
            description: "Kombinatsiyalangan shartli konstruktsiyalar",
            duration: 25,
            completed: false,
          },
        ],
      },
    ],
  },

  // 6. Advanced Grammatika Kursi
  {
    id: "grammar-advanced",
    title: "Advanced Grammatika Kursi",
    description:
      "Eng murakkab grammatik konstruktsiyalar, stilistik variantlar, idiomatik grammatika kabi ilg'or mavzularni o'rgatadigan kurs.",
    level: "Advanced",
    price: 150,
    imageUrl:
      "https://img.freepik.com/free-vector/teacher-concept-illustration_114360-2505.jpg",
    duration: 25,
    rating: 4.9,
    purchased: false,
    progress: 0,
    authorName: "Jessica Parker",
    authorAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
    tags: ["Grammar", "Advanced", "Stylistic grammar"],
    modules: [
      {
        id: "adv-mod-1",
        title: "Murakkab zamonlar kombinatsiyalari",
        description: "Barcha zamonlarning murakkab ishlatilishi",
        completed: false,
        lessons: [
          {
            id: "adv-mod-1-les-1",
            title: "Narrative tenses",
            description: "Hikoya qilishda zamonlarni tanlash",
            duration: 30,
            completed: false,
          },
          {
            id: "adv-mod-1-les-2",
            title: "Zamon to'g'riligi",
            description: "Zamonlar o'rtasidagi nozik farqlar",
            duration: 25,
            completed: false,
          },
        ],
      },
      {
        id: "adv-mod-2",
        title: "Stilistik grammatik variantlar",
        description: "Turli uslubiy yo'nalishlardagi grammatika",
        completed: false,
        lessons: [
          {
            id: "adv-mod-2-les-1",
            title: "Formal vs Informal",
            description: "Rasmiy va norasmiy grammatik strukturalar",
            duration: 25,
            completed: false,
          },
          {
            id: "adv-mod-2-les-2",
            title: "Literary vs Conversational",
            description: "Adabiy va so'zlashuv uslubidagi grammatika",
            duration: 25,
            completed: false,
          },
        ],
      },
    ],
  },
];

export default GRAMMAR_COURSES;
