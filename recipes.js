const categories = [
  {
    id: "veg",
    en: "Veg",
    zh: "蔬菜",
    icon: "🥬"
  },
  {
    id: "pork",
    en: "Pork",
    zh: "豬肉",
    icon: "🐷"
  },
  {
    id: "chicken",
    en: "Chicken",
    zh: "雞肉",
    icon: "🐔"
  },
  {
    id: "lamb",
    en: "Lamb",
    zh: "羊肉",
    icon: "🐑"
  },
  {
    id: "beef",
    en: "Beef",
    zh: "牛肉",
    icon: "🐮"
  },
  {
    id: "drinks",
    en: "Drinks",
    zh: "飲品",
    icon: "🥤"
  },
  {
    id: "dessert",
    en: "Dessert",
    zh: "甜點",
    icon: "🍰"
  }
];

const recipes = [
  {
    id: "basil-minced-pork",

    name: {
      en: "Basil Minced Pork",
      zh: "九層塔豬碎肉"
    },

category: {
  id: "pork",
  en: "Pork",
  zh: "豬肉",
  icon: "🐷"
},

    favourite: true,

    ingredients: [
      {
        en: "Minced pork",
        zh: "豬碎肉",
        amount: null,
        unit: ""
      },
      {
        en: "Basil",
        zh: "九層塔",
        amount: null,
        unit: ""
      },
      {
        en: "Garlic",
        zh: "蒜",
        amount: null,
        unit: ""
      },
      {
        en: "Shallots",
        zh: "紅蔥頭",
        amount: null,
        unit: ""
      },
      {
        en: "Thai red chilli",
        zh: "紅辣椒",
        amount: null,
        unit: ""
      },
      {
        en: "Crushed chilli flakes",
        zh: "辣椒片",
        amount: null,
        unit: ""
      },
      {
        en: "Soy sauce",
        zh: "醬油",
        amount: null,
        unit: ""
      },
      {
        en: "Mirin",
        zh: "味醂",
        amount: null,
        unit: ""
      },
      {
        en: "Bonito soy sauce",
        zh: "鰹魚露",
        amount: null,
        unit: ""
      },
      {
        en: "Green beans",
        zh: "綠豆",
        amount: null,
        unit: ""
      }
    ],

    method: [
      {
        en: "Mince garlic, dice shallots and red chilli.",
        zh: "把蒜切碎，紅蔥頭和紅辣椒切丁。"
      },
      {
        en: "Cut green beans.",
        zh: "切綠豆。"
      },
      {
        en: "Add oil, garlic, shallots and red chilli to the pan.",
        zh: "把油、蒜末和紅蔥頭加入鍋子。"
      },
      {
        en: "Add minced pork and mirin.",
        zh: "加入豬碎肉和味醂。"
      },
      {
        en: "Stir until mostly cooked, then add green beans and salt.",
        zh: "炒到八分熟，加入綠豆和鹽。"
      },
      {
        en: "Add soy sauce, bonito soy sauce and salt.",
        zh: "加入醬油、鰹魚露和鹽。"
      },
      {
        en: "Add red chilli or chilli flakes.",
        zh: "加入紅辣椒或辣椒片。"
      },
      {
        en: "Add basil.",
        zh: "加入九層塔。"
      }
    ],

    originalImage: null
  }
];