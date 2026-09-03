// Lesson data. Each lesson = theory slides + quiz + one applied task.
// Add new chapters by pushing more objects into LESSONS, following this shape.
//
// theory slide types: 'text' | 'table'
// quiz item types:    'single' | 'fillblank' | 'truefalse' | 'findline'
// task: real SQL graded against an in-memory sqlite db built from `datasets`
// `module` groups chapters under a shared divider label on the Path screen.

export const SECTIONS = [
  { id: 1, title: 'Основы SQL', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
];

export const LESSONS = [
  {
    id: 's1c1',
    section: 1,
    chapter: 1,
    module: 'Введение',
    title: 'Введение',
    kind: 'lesson', // lesson | checkpoint
    theory: [
      {
        type: 'text',
        html: `SQL (Structured Query Language, «язык структурированных запросов») — это язык, на котором мы разговариваем с базами данных: просим их отдать, отфильтровать или посчитать данные.`,
      },
      {
        type: 'text',
        html: `База данных — это просто организованное хранилище. Внутри неё лежат <b>таблицы</b>, у каждой таблицы есть имя, набор столбцов и строки с данными.`,
      },
      {
        type: 'table',
        caption: 'Например, таблица <span class="inline-code">workers</span>:',
        columns: ['firstname', 'lastname', 'age'],
        rows: [
          ['Ghully', 'Thuas', 29],
          ['Bostal', 'Shkolky', 32],
          ['Qaostu', 'Malop', 21],
        ],
      },
      {
        type: 'text',
        html: `Три строки — значит три работника. Средний возраст легко посчитать в уме: (29 + 32 + 21) / 3. А если строк не три, а три миллиона? Вручную уже не получится — и тут на помощь приходит SQL.`,
      },
      {
        type: 'text',
        html: `Чтобы достать данные из таблицы, нужно указать, <b>какие столбцы</b> взять — через <span class="inline-code">SELECT</span>, и <b>из какой таблицы</b> — через <span class="inline-code">FROM</span>.`,
      },
      {
        type: 'text',
        html: `Общий вид запроса:`,
        code: `SELECT column1, column2\nFROM table_name`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Что означает аббревиатура SQL?',
        options: [
          'Стандартная логика запросов',
          'Системный язык запросов',
          'Structured Query Language',
          'Простой язык запросов',
        ],
        correctIndex: 2,
        explanation: 'SQL расшифровывается как Structured Query Language — «язык структурированных запросов».',
      },
      {
        type: 'single',
        question: 'Какой запрос правильно выбирает столбцы firstname и lastname из таблицы workers?',
        options: [
          'FROM workers SELECT firstname, lastname',
          'GET firstname, lastname FROM workers',
          'SELECT firstname, lastname FROM workers',
          'SELECT workers FROM firstname, lastname',
        ],
        correctIndex: 2,
        explanation: 'Порядок всегда такой: сначала SELECT со списком столбцов, потом FROM с именем таблицы.',
      },
      {
        type: 'fillblank',
        question: 'Дополните SQL-запрос, чтобы получить столбцы firstname и age из таблицы workers.',
        template: ['', ' firstname, age ', ' workers'],
        blanks: [
          { options: ['EXTRACT', 'SELECT', 'GET'], correct: 'SELECT' },
          { options: ['FROM', 'IN', 'TABLE'], correct: 'FROM' },
        ],
        explanation: 'SELECT указывает нужные столбцы, FROM — таблицу, откуда их брать.',
      },
    ],
    task: {
      title: 'Первый запрос',
      description: 'Выберите столбец **user_id** из таблицы **users**.',
      availableTables: [{ name: 'users', columns: ['user_id', 'seniority'] }],
      datasets: {
        users: [
          { user_id: 652, seniority: 'senior' },
          { user_id: 9731, seniority: 'junior' },
          { user_id: 1462, seniority: 'middle' },
          { user_id: 7823, seniority: 'senior' },
          { user_id: 15243, seniority: 'junior' },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT user_id FROM users',
      hint: 'Начните с SELECT и укажите имя столбца, затем FROM и имя таблицы.',
    },
  },

  {
    id: 's1c2',
    section: 1,
    chapter: 2,
    module: 'Введение',
    title: 'Концепции баз данных',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `В базах данных строки называются <b>записями</b>, а столбцы — <b>полями</b>.`,
      },
      {
        type: 'text',
        html: `Таблицы имеют фиксированное количество полей, но могут содержать сколько угодно записей. Каждое поле имеет уникальное имя, обычно в нижнем регистре и в единственном числе. Часто у таблицы есть поле <span class="inline-code">id</span> — уникальный идентификатор каждой записи.`,
      },
      {
        type: 'text',
        html: `В SQL можно использовать звёздочку <span class="inline-code">*</span> как сокращение «все столбцы», вместо того чтобы перечислять каждый по имени:`,
        code: `SELECT * FROM table_name`,
      },
      {
        type: 'text',
        html: `Такой запрос извлекает все поля из указанной таблицы — удобно, когда нужно быстро посмотреть содержимое целиком.`,
      },
    ],
    quiz: [
      {
        type: 'fillblank',
        question: 'Дополните SQL-запрос, чтобы выбрать все столбцы из таблицы users.',
        template: ['SELECT ', ' FROM ', ''],
        blanks: [
          { options: ['columns', '*', 'all'], correct: '*' },
          { options: ['users', 'table', '*'], correct: 'users' },
        ],
        explanation: 'Звёздочка * означает «все столбцы», а после FROM указывается имя таблицы.',
      },
      {
        type: 'single',
        question: 'Какой термин баз данных используется для обозначения строки?',
        options: ['поле', 'индекс', 'запись', 'таблица'],
        correctIndex: 2,
        explanation: 'Строка таблицы называется записью (row/record).',
      },
      {
        type: 'truefalse',
        question: 'Использование SELECT * требует, чтобы вы знали все названия столбцов заранее.',
        correct: false,
        explanation: 'Наоборот — звёздочка как раз освобождает от необходимости перечислять имена столбцов.',
      },
      {
        type: 'single',
        question: 'Какое соглашение об именовании типично для имён полей?',
        options: [
          'В нижнем регистре и в единственном числе',
          'В верхнем регистре и во множественном числе',
          'Любой формат работает одинаково',
          'CamelCase',
        ],
        correctIndex: 0,
        explanation: 'Поля обычно называют в нижнем регистре, в единственном числе (например, name, а не Names).',
      },
    ],
    task: {
      title: 'Концепции баз данных',
      description: 'Напишите SQL-запрос для получения всех данных из таблицы **objects**.',
      availableTables: [{ name: 'objects', columns: ['id', 'pieces', 'shape'] }],
      datasets: {
        objects: [
          { id: 251, pieces: 3, shape: 'round' },
          { id: 35, pieces: 1, shape: 'cube' },
          { id: 39, pieces: 23, shape: 'oval' },
          { id: 21, pieces: 5, shape: 'long' },
          { id: 1, pieces: 5, shape: 'long' },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT * FROM objects',
      hint: 'Звёздочка * после SELECT означает «все столбцы».',
    },
  },

  // --- Глава 1 «Введение» продолжается: DISTINCT, затем чекпоинт главы ---
  {
    id: 's1c3',
    section: 1,
    chapter: 3,
    module: 'Введение',
    title: 'Уникальные значения',
    kind: 'lesson',
    theory: [
      {
        type: 'table',
        caption: 'Представим таблицу <span class="inline-code">sales</span> с продажами по странам:',
        columns: ['country', 'city'],
        rows: [
          ['Poland', 'Warsaw'],
          ['Germany', 'Berlin'],
          ['Poland', 'Katowice'],
        ],
      },
      {
        type: 'text',
        html: `Мы хотим узнать все страны, где продавался товар. Обычный запрос <span class="inline-code">SELECT country FROM sales</span> вернёт Poland, Germany, Poland — country повторяется, а нам нужны только уникальные значения.`,
      },
      {
        type: 'text',
        html: `Чтобы решить эту задачу, используется ключевое слово <span class="inline-code">DISTINCT</span>:`,
        code: `SELECT DISTINCT column_name FROM table`,
      },
      {
        type: 'text',
        html: `Без <span class="inline-code">DISTINCT</span> возвращаются повторяющиеся значения. С <span class="inline-code">DISTINCT</span> каждое уникальное значение появляется в результате только один раз.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Зачем использовать DISTINCT при запросе к базе данных?',
        options: [
          'Чтобы отсортировать результаты в алфавитном порядке',
          'Чтобы выбрать все столбцы из таблицы',
          'Чтобы исключить повторяющиеся значения из набора результатов',
          'Чтобы объединить две таблицы',
        ],
        correctIndex: 2,
        explanation: 'Ключевое слово DISTINCT отфильтровывает повторяющиеся значения, возвращая только уникальные записи из указанного столбца.',
      },
      {
        type: 'single',
        question: 'Что вернёт запрос SELECT DISTINCT country FROM sales для таблицы выше?',
        options: ['Poland, Germany, Poland', 'Germany', 'Poland', 'Poland, Germany'],
        correctIndex: 3,
        explanation: 'DISTINCT оставляет каждое значение только один раз: Poland и Germany.',
      },
      {
        type: 'truefalse',
        question: 'Запрос SELECT country FROM sales автоматически удалит повторяющиеся значения country из результатов.',
        correct: false,
        explanation: 'Базовый запрос SELECT возвращает все строки, включая дубликаты. Ключевое слово DISTINCT требуется, чтобы отфильтровать повторяющиеся значения.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой в этом запросе.',
        lines: ['SELECT city DISTINCT', 'FROM sales', 'WHERE amount > 10', 'ORDER BY city'],
        errorLine: 0,
        explanation: 'DISTINCT должен стоять сразу после SELECT, перед именем столбца: SELECT DISTINCT city.',
      },
    ],
    task: {
      title: 'Уникальные значения',
      description: 'В таблице **sales** найдите уникальные монеты — выберите столбец **coin** без повторов.',
      availableTables: [{ name: 'sales', columns: ['coin', 'amount'] }],
      datasets: {
        sales: [
          { coin: 'AGK', amount: 1.6 },
          { coin: 'GBL', amount: 7.2 },
          { coin: 'AGK', amount: 3.4 },
          { coin: 'PLN', amount: 12.1 },
          { coin: 'GBL', amount: 0.9 },
          { coin: 'USD', amount: 5.5 },
          { coin: 'AGK', amount: 2.2 },
          { coin: 'PLN', amount: 8.8 },
          { coin: 'USD', amount: 4.1 },
          { coin: 'EUR', amount: 6.3 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT DISTINCT coin FROM sales',
      hint: 'SELECT DISTINCT column_name FROM table — DISTINCT сразу после SELECT.',
    },
  },
  {
    id: 's1c4',
    section: 1,
    chapter: 4,
    module: 'Введение',
    title: 'Итоги главы',
    kind: 'checkpoint',
    theory: [
      {
        type: 'text',
        html: `Отличная работа! Вы прошли главу «Введение»: узнали, что такое база данных, как выбирать столбцы через <span class="inline-code">SELECT ... FROM</span>, все столбцы через <span class="inline-code">*</span>, и как убирать дубликаты через <span class="inline-code">DISTINCT</span>. Дальше — обзорный тест по главе.`,
      },
    ],
    quiz: [
      {
        type: 'fillblank',
        question: 'Дополните запрос: выбрать все столбцы из таблицы orders.',
        template: ['SELECT ', ' FROM ', ''],
        blanks: [
          { options: ['*', 'ALL', 'columns'], correct: '*' },
          { options: ['orders', 'table', '*'], correct: 'orders' },
        ],
        explanation: 'SELECT * FROM orders — звёздочка означает «все столбцы».',
      },
      {
        type: 'single',
        question: 'Какой запрос вернёт список стран без повторов из таблицы sales?',
        options: [
          'SELECT country FROM sales',
          'SELECT DISTINCT country FROM sales',
          'SELECT UNIQUE country FROM sales',
          'SELECT country UNIQUE FROM sales',
        ],
        correctIndex: 1,
        explanation: 'DISTINCT ставится сразу после SELECT, перед именем столбца.',
      },
      {
        type: 'truefalse',
        question: 'Строки в таблице называются записями, а столбцы — полями.',
        correct: true,
        explanation: 'Верно — это стандартная терминология баз данных.',
      },
      {
        type: 'single',
        question: 'Что из перечисленного НЕ является частью базового запроса SELECT?',
        options: ['SELECT', 'FROM', 'DISTINCT', 'RETURN'],
        correctIndex: 3,
        explanation: 'RETURN не существует в SQL — это не ключевое слово запросов SELECT.',
      },
    ],
    task: {
      title: 'Итоговая задача главы',
      description: 'В таблице **visitors** выберите уникальные значения столбца **city**.',
      availableTables: [{ name: 'visitors', columns: ['city', 'age'] }],
      datasets: {
        visitors: [
          { city: 'Minsk', age: 21 },
          { city: 'Gomel', age: 34 },
          { city: 'Minsk', age: 19 },
          { city: 'Brest', age: 27 },
          { city: 'Gomel', age: 41 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT DISTINCT city FROM visitors',
      hint: 'SELECT DISTINCT column FROM table.',
    },
  },

  // --- Глава 2 «Условия» ---
  {
    id: 's1c5',
    section: 1,
    chapter: 5,
    module: 'Условия',
    title: 'Основы условий',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `Используйте ключевое слово <span class="inline-code">WHERE</span>, чтобы добавлять условия в свои SQL-запросы:`,
        code: `SELECT * FROM table_name\nWHERE column_name = 'value'`,
      },
      {
        type: 'text',
        html: `Для числовых сравнений кавычки не нужны:`,
        code: `SELECT * FROM table_name\nWHERE column_name <= 20`,
      },
      {
        type: 'text',
        html: `Распространённые операторы сравнения: <span class="inline-code">=</span>, <span class="inline-code">&lt;</span>, <span class="inline-code">&gt;</span>, <span class="inline-code">&lt;=</span>, <span class="inline-code">&gt;=</span>.`,
      },
      {
        type: 'table',
        caption: 'Рассмотрим таблицу <span class="inline-code">sales</span>:',
        columns: ['coin', 'amount'],
        rows: [
          ['AGK', 13],
          ['KLA', 15],
          ['AGK', 18],
          ['GOL', 21],
        ],
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Каково назначение ключевого слова WHERE?',
        options: ['Сортировать результаты', 'Фильтровать записи на основе условия', 'Выбрать все столбцы из таблицы', 'Объединить две таблицы'],
        correctIndex: 1,
        explanation: 'Сортировка выполняется с помощью ORDER BY, а не WHERE. WHERE фильтрует записи по условию.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой.',
        lines: ['SELECT * FROM sales', "WHERE coin = AGK"],
        errorLine: 1,
        explanation: "Строковые значения нужно заключать в одинарные кавычки, например 'AGK', иначе SQL интерпретирует их как имя столбца.",
      },
      {
        type: 'single',
        question: 'Что вернёт SELECT * FROM sales WHERE amount <= 20 для таблицы выше?',
        options: [
          'Только запись с amount 21',
          'Нет записей',
          'Записи с coin AGK (13), KLA (15) и AGK (18): GOL (21) исключается',
          'Все четыре записи из таблицы',
        ],
        correctIndex: 2,
        explanation: 'Условие amount <= 20 исключает только GOL с amount 21 — остальные три записи проходят.',
      },
      {
        type: 'truefalse',
        question: 'Запись, у которой amount равно 20, удовлетворяет условию WHERE amount <= 20.',
        correct: true,
        explanation: '<= включает равенство, поэтому amount = 20 тоже проходит условие.',
      },
    ],
    task: {
      title: 'Основы условий',
      description: 'В таблице **events** выберите **event_id** тех событий, где people меньше 14.',
      availableTables: [{ name: 'events', columns: ['event_id', 'people'] }],
      datasets: {
        events: [
          { event_id: 1, people: 9 },
          { event_id: 6, people: 23 },
          { event_id: 9, people: 5 },
          { event_id: 13, people: 7 },
          { event_id: 2, people: 28 },
          { event_id: 4, people: 11 },
          { event_id: 99, people: 22 },
          { event_id: 83, people: 7 },
          { event_id: 462, people: 13 },
          { event_id: 3, people: 2 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT event_id FROM events WHERE people < 14',
      hint: 'SELECT column FROM table WHERE column < значение.',
    },
  },
  {
    id: 's1c6',
    section: 1,
    chapter: 6,
    module: 'Условия',
    title: 'Ключевое слово AND',
    kind: 'lesson',
    theory: [
      {
        type: 'table',
        caption: 'Таблица <span class="inline-code">people</span>:',
        columns: ['name', 'age', 'gender'],
        rows: [
          ['Joas', 13, 'male'],
          ['Holwa', 17, 'male'],
          ['Nohlas', 24, 'female'],
          ['Polar', 23, 'male'],
          ['Loopa', 18, 'female'],
        ],
      },
      {
        type: 'text',
        html: `<span class="inline-code">AND</span> требует, чтобы выполнялись <b>все</b> условия сразу:`,
        code: `SELECT * FROM people\nWHERE gender = 'female' AND age < 20`,
      },
      {
        type: 'text',
        html: `Для таблицы выше этот запрос вернёт только Loopa (18, female) — Nohlas не подходит, потому что её возраст 24, не меньше 20.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: "Сколько строк вернёт WHERE gender = 'male' AND age < 15 для таблицы people?",
        options: ['2', '3', '0', '1'],
        correctIndex: 3,
        explanation: 'Только Joas (13, male) удовлетворяет обоим условиям сразу.',
      },
      {
        type: 'truefalse',
        question: "Запрос WHERE gender = 'male' AND age > 20 вернул бы Polar.",
        correct: true,
        explanation: 'Polar — male и ему 23 (больше 20), оба условия выполнены.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с неправильным синтаксисом для объединения условий.',
        lines: [
          "SELECT * FROM people WHERE gender = 'male' AND age > 20",
          "SELECT * FROM people WHERE gender = 'female' age < 18",
          "SELECT * FROM people WHERE age > 20 AND gender = 'male'",
        ],
        errorLine: 1,
        explanation: 'Между двумя условиями пропущен оператор AND — без него это синтаксическая ошибка.',
      },
      {
        type: 'single',
        question: 'Что делает оператор AND в условии WHERE?',
        options: [
          'Требует, чтобы хотя бы одно условие было истинным',
          'Требует, чтобы были истинными все условия',
          'Сортирует результаты по возрастанию',
          'Ограничивает количество строк в результате',
        ],
        correctIndex: 1,
        explanation: 'AND — это логическое «И»: истинны должны быть все условия сразу.',
      },
    ],
    task: {
      title: 'Ключевое слово AND',
      description: 'В таблице **people** выберите всех, у кого **gender** равен \'female\' И **age** больше или равен 20.',
      availableTables: [{ name: 'people', columns: ['name', 'age', 'gender'] }],
      datasets: {
        people: [
          { name: 'Joas', age: 13, gender: 'male' },
          { name: 'Holwa', age: 17, gender: 'male' },
          { name: 'Nohlas', age: 24, gender: 'female' },
          { name: 'Polar', age: 23, gender: 'male' },
          { name: 'Loopa', age: 18, gender: 'female' },
          { name: 'Sasha', age: 31, gender: 'female' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM people WHERE gender = 'female' AND age >= 20",
      hint: "WHERE условие1 AND условие2 — оба должны быть истинны.",
    },
  },
  {
    id: 's1c7',
    section: 1,
    chapter: 7,
    module: 'Условия',
    title: 'Ключевое слово OR',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">OR</span> требует, чтобы выполнялось <b>хотя бы одно</b> из условий:`,
        code: `SELECT * FROM people\nWHERE gender = 'female' OR age < 20`,
      },
      {
        type: 'text',
        html: `Для таблицы people (Joas 13 male, Holwa 17 male, Nohlas 24 female, Polar 23 male, Loopa 18 female) этот запрос исключает только Polar — он не female и ему не меньше 20 лет.`,
      },
    ],
    quiz: [
      {
        type: 'truefalse',
        question: "Запрос WHERE gender = 'male' AND age > 20 вернул бы Polar (age 23, male).",
        correct: true,
        explanation: 'Polar удовлетворяет обоим условиям: male и старше 20.',
      },
      {
        type: 'single',
        question: "Сколько строк вернёт WHERE gender = 'female' OR age < 20 для таблицы people?",
        options: ['3 строки', '4 строки', '2 строки', '5 строк'],
        correctIndex: 1,
        explanation: 'Подходят Joas, Holwa (age<20), Nohlas (female) и Loopa (оба условия) — итого 4.',
      },
      {
        type: 'single',
        question: 'Что делает оператор OR в условии WHERE?',
        options: [
          'Требует, чтобы были истинными все условия',
          'Достаточно, чтобы хотя бы одно условие было истинным',
          'Убирает повторяющиеся значения',
          'Ограничивает результат одной строкой',
        ],
        correctIndex: 1,
        explanation: 'OR — логическое «ИЛИ»: строка проходит, если истинно хотя бы одно из условий.',
      },
    ],
    task: {
      title: 'Ключевое слово OR',
      description: 'В таблице **people** выберите всех, чей **age** меньше 20 ИЛИ больше 28 (не включая 20 и не включая 28).',
      availableTables: [{ name: 'people', columns: ['age', 'status'] }],
      datasets: {
        people: [
          { age: 17, status: 'student' },
          { age: 22, status: 'employed' },
          { age: 35, status: 'employed' },
          { age: 19, status: 'student' },
          { age: 30, status: 'retired' },
          { age: 25, status: 'employed' },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT * FROM people WHERE age < 20 OR age > 28',
      hint: 'WHERE условие1 OR условие2 — достаточно одного истинного.',
    },
  },
  {
    id: 's1c8',
    section: 1,
    chapter: 8,
    module: 'Условия',
    title: 'Ключевое слово NOT',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">NOT</span> инвертирует условие — оставляет строки, для которых условие <b>ложно</b>. Рассмотрим таблицу <span class="inline-code">people</span>:`,
      },
      {
        type: 'table',
        columns: ['name', 'age', 'gender'],
        rows: [
          ['Joas', 13, 'male'],
          ['Holwa', 17, 'male'],
          ['Nohlas', 24, 'female'],
          ['Polar', 23, 'male'],
          ['Loopa', 18, 'female'],
        ],
      },
      {
        type: 'text',
        html: `Запрос:`,
        code: `SELECT * FROM people\nWHERE NOT gender = 'male'`,
      },
      {
        type: 'text',
        html: `Вернёт всех, кто НЕ male — то есть Nohlas и Loopa.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какой запрос эквивалентен WHERE NOT age < 25?',
        options: ['WHERE age > 25', 'WHERE age = 25', 'WHERE age >= 25', 'WHERE age <= 25'],
        correctIndex: 2,
        explanation: 'Отрицание "меньше 25" — это "больше или равно 25".',
      },
      {
        type: 'truefalse',
        question: "WHERE NOT gender = 'male' и WHERE gender = 'female' всегда возвращают одинаковый результат.",
        correct: false,
        explanation: 'Если в таблице есть другие значения gender (например, NULL или другое значение), результаты могут отличаться — NOT просто исключает male, а не обязательно означает female.',
      },
    ],
    task: {
      title: 'Ключевое слово NOT',
      description: 'В таблице **people** получите всех, у кого **status** НЕ равен \'retired\'.',
      availableTables: [{ name: 'people', columns: ['name', 'age', 'status'] }],
      datasets: {
        people: [
          { name: 'Charles', age: 28, status: 'employed' },
          { name: 'Fatima', age: 38, status: 'employed' },
          { name: 'Eric', age: 11, status: 'student' },
          { name: 'Diya', age: 44, status: 'retired' },
          { name: 'Hanna', age: 22, status: 'student' },
          { name: 'Ali', age: 20, status: 'employed' },
          { name: 'Gabriel', age: 37, status: 'employed' },
          { name: 'Beatriz', age: 17, status: 'student' },
          { name: 'Troy', age: 29, status: 'employed' },
          { name: 'Nadia', age: 61, status: 'retired' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM people WHERE NOT status = 'retired'",
      hint: "WHERE NOT условие — оставляет строки, где условие ложно.",
    },
  },
  {
    id: 's1c9',
    section: 1,
    chapter: 9,
    module: 'Условия',
    title: 'Трофей главы',
    kind: 'checkpoint',
    theory: [
      {
        type: 'text',
        html: `Отличная работа! Вы прошли главу «Условия»: фильтрация через <span class="inline-code">WHERE</span>, объединение условий через <span class="inline-code">AND</span> и <span class="inline-code">OR</span>, инверсия через <span class="inline-code">NOT</span>. Дальше — обзорный тест по главе.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какой оператор требует выполнения ОБОИХ условий?',
        options: ['OR', 'NOT', 'AND', 'WHERE'],
        correctIndex: 2,
        explanation: 'AND — логическое «И»: истинны должны быть оба условия.',
      },
      {
        type: 'single',
        question: 'Какой оператор требует выполнения ХОТЯ БЫ ОДНОГО условия?',
        options: ['AND', 'OR', 'NOT', 'DISTINCT'],
        correctIndex: 1,
        explanation: 'OR — логическое «ИЛИ»: достаточно одного истинного условия.',
      },
      {
        type: 'truefalse',
        question: 'WHERE NOT age > 18 равносильно WHERE age <= 18.',
        correct: true,
        explanation: 'Отрицание "больше 18" — это "меньше или равно 18".',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой.',
        lines: ["SELECT * FROM users", "WHERE age > 18 status = 'active'"],
        errorLine: 1,
        explanation: "Между двумя условиями пропущен AND или OR.",
      },
    ],
    task: {
      title: 'Итоговая задача главы',
      description: 'В таблице **products** выберите товары, у которых **price** больше 100 И **in_stock** равен 1.',
      availableTables: [{ name: 'products', columns: ['name', 'price', 'in_stock'] }],
      datasets: {
        products: [
          { name: 'Клавиатура', price: 45, in_stock: 1 },
          { name: 'Монитор', price: 210, in_stock: 1 },
          { name: 'Мышь', price: 18, in_stock: 0 },
          { name: 'Наушники', price: 120, in_stock: 0 },
          { name: 'Кресло', price: 340, in_stock: 1 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT * FROM products WHERE price > 100 AND in_stock = 1',
      hint: 'WHERE условие1 AND условие2.',
    },
  },

  // --- Глава 3: значения NULL и сортировка ---
  {
    id: 's1c10',
    section: 1,
    chapter: 10,
    module: 'NULL и сортировка',
    title: 'Значения NULL',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `В реальном мире у нас могут быть поля без значений. Поле без значения называется <b>null</b>.`,
      },
      {
        type: 'text',
        html: `Мы можем использовать <span class="inline-code">IS NULL</span> или <span class="inline-code">IS NOT NULL</span>, чтобы получать нужные данные. Например, следующий запрос вернёт все записи, где col1 не имеет значения:`,
        code: `SELECT *\nFROM table1\nWHERE col1 IS NULL`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какой запрос возвращает строки, в которых email не имеет значения?',
        options: [
          'SELECT * FROM users WHERE email == NULL',
          'SELECT * FROM users WHERE email IS NULL',
          'SELECT * FROM users WHERE email = NULL',
        ],
        correctIndex: 1,
        explanation: 'Для проверки отсутствия значения используется IS NULL, а не = или ==.',
      },
      {
        type: 'single',
        question: 'Что фильтрует IS NOT NULL?',
        options: [
          'Строки, где поле содержит текст "NULL"',
          'Строки, где поле пустое',
          'Строки, где поле содержит значение',
        ],
        correctIndex: 2,
        explanation: 'IS NOT NULL возвращает строки, где поле содержит значение (не пустое).',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой.',
        lines: ['SELECT * FROM users', 'WHERE phone_number = NULL'],
        errorLine: 1,
        explanation: 'Правильный синтаксис для проверки отсутствующих значений — IS NULL, а не = NULL.',
      },
    ],
    task: {
      title: 'Значения NULL',
      description: 'В таблице **people** получите все уникальные **name** без пропущенных значений.',
      availableTables: [{ name: 'people', columns: ['name'] }],
      datasets: {
        people: [
          { name: 'Ann' },
          { name: null },
          { name: 'Kira' },
          { name: 'Ann' },
          { name: null },
          { name: 'Leo' },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT DISTINCT name FROM people WHERE name IS NOT NULL',
      hint: 'Совместите DISTINCT и WHERE column IS NOT NULL.',
    },
  },
  {
    id: 's1c11',
    section: 1,
    chapter: 11,
    module: 'NULL и сортировка',
    title: 'Сортировка результатов, часть 1',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">ORDER BY</span> сортирует результат запроса. По умолчанию сортировка выполняется в порядке возрастания. Рассмотрим таблицу <span class="inline-code">competition</span>:`,
      },
      {
        type: 'table',
        columns: ['runner_id', 'age', 'avg_speed'],
        rows: [
          [1, 47, 3.65],
          [2, 62, 3.07],
          [3, 57, 6.82],
          [4, 56, 4.34],
        ],
      },
      {
        type: 'text',
        html: `Запрос:`,
        code: `SELECT * FROM competition\nWHERE age > 50\nORDER BY avg_speed`,
      },
      {
        type: 'text',
        html: `Чтобы указать направление сортировки явно, добавьте <span class="inline-code">ASC</span> (по возрастанию, по умолчанию) или <span class="inline-code">DESC</span> (по убыванию) после имени столбца.`,
      },
    ],
    quiz: [
      {
        type: 'truefalse',
        question: 'Добавление ASC после имени столбца в ORDER BY изменяет поведение по умолчанию.',
        correct: false,
        explanation: 'ASC — это поведение по умолчанию, поэтому явное указание ничего не меняет.',
      },
      {
        type: 'single',
        question: 'В таблице competition avg_speed — это средняя скорость бегуна (больше = быстрее). Что вернёт WHERE age > 50 ORDER BY avg_speed DESC?',
        options: [
          'Бегуны старше 50 лет, сначала самые возрастные',
          'Бегуны старше 50 лет, сначала самые быстрые',
          'Все бегуны, сначала самые быстрые',
          'Бегуны старше 50 лет, сначала самые медленные',
        ],
        correctIndex: 1,
        explanation: 'DESC сортирует по убыванию — самое большое значение avg_speed (самый быстрый бегун) идёт первым.',
      },
      {
        type: 'single',
        question: 'Что делает WHERE по отношению к ORDER BY?',
        options: [
          'Сортирует строки до выполнения фильтрации',
          'Фильтрация и сортировка происходят одновременно',
          'Влияет только на первый отсортированный столбец',
          'Фильтрует строки до выполнения сортировки',
        ],
        correctIndex: 3,
        explanation: 'SQL сначала отфильтровывает строки через WHERE, а затем сортирует оставшиеся через ORDER BY.',
      },
    ],
    task: {
      title: 'Сортировка результатов',
      description: 'В таблице **competition** выберите всех бегунов старше 50 лет, отсортированных по avg_speed по убыванию.',
      availableTables: [{ name: 'competition', columns: ['runner_id', 'age', 'avg_speed'] }],
      datasets: {
        competition: [
          { runner_id: 1, age: 47, avg_speed: 3.65 },
          { runner_id: 2, age: 62, avg_speed: 3.07 },
          { runner_id: 3, age: 57, avg_speed: 6.82 },
          { runner_id: 4, age: 56, avg_speed: 4.34 },
          { runner_id: 5, age: 25, avg_speed: 4.93 },
          { runner_id: 6, age: 40, avg_speed: 3.94 },
          { runner_id: 7, age: 23, avg_speed: 6.58 },
          { runner_id: 8, age: 40, avg_speed: 3.43 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT * FROM competition WHERE age > 50 ORDER BY avg_speed DESC',
      hint: 'WHERE ... ORDER BY column DESC.',
    },
  },
  {
    id: 's1c12',
    section: 1,
    chapter: 12,
    module: 'NULL и сортировка',
    title: 'Сортировка результатов, часть 2',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `Вы можете указать разные направления сортировки для каждого столбца в <span class="inline-code">ORDER BY</span> с несколькими столбцами:`,
        code: `SELECT * FROM competition\nWHERE age < 50\nORDER BY age DESC, avg_speed DESC`,
      },
      {
        type: 'text',
        html: `Этот запрос сначала отсортирует все записи по age по убыванию. Если у двух записей одинаковый age, он отсортирует их по avg_speed по убыванию — это работает как «тай-брейк» только для равных значений.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Для бегунов с одинаковым age = 40 и avg_speed 3.43 и 3.94, кто появится первым при ORDER BY age DESC, avg_speed DESC?',
        options: ['3.43', '3.94', 'Порядок не определён', 'Они отображаются в исходном порядке таблицы'],
        correctIndex: 1,
        explanation: 'Оба бегуна одного возраста, поэтому вторичная сортировка по avg_speed DESC ставит более высокую скорость (3.94) перед более низкой (3.43).',
      },
      {
        type: 'truefalse',
        question: 'В запросе ORDER BY age DESC, avg_speed DESC сортировка по avg_speed применяется ко всем строкам независимо от их значений age.',
        correct: false,
        explanation: 'Вторичный столбец сортировки влияет только на строки с одинаковыми значениями в первичном столбце. Строки с разными age уже упорядочены только по age.',
      },
    ],
    task: {
      title: 'Сортировка по нескольким столбцам',
      description: 'В таблице **feathers** выберите **id**, отсортировав сначала по area по убыванию, затем по weight по возрастанию.',
      availableTables: [{ name: 'feathers', columns: ['id', 'weight', 'area'] }],
      datasets: {
        feathers: [
          { id: 1, weight: 0.01, area: 30 },
          { id: 2, weight: 0.13, area: 20 },
          { id: 3, weight: 0.05, area: 30 },
          { id: 4, weight: 0.09, area: 25 },
          { id: 5, weight: 0.02, area: 18 },
          { id: 6, weight: 0.15, area: 18 },
          { id: 7, weight: 0.04, area: 27 },
          { id: 8, weight: 0.03, area: 30 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT id FROM feathers ORDER BY area DESC, weight',
      hint: 'ORDER BY column1 DESC, column2 — второй столбец сортируется по возрастанию, если направление не указано.',
    },
  },
  {
    id: 's1c13',
    section: 1,
    chapter: 13,
    module: 'NULL и сортировка',
    title: 'Ограничение количества записей',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">LIMIT</span> ограничивает количество строк, которые вернёт запрос. Он ставится в самом конце запроса, после ORDER BY (если он есть):`,
        code: `SELECT * FROM table_name\nORDER BY column_name\nLIMIT 5`,
      },
      {
        type: 'text',
        html: `Если указать <span class="inline-code">LIMIT 0</span>, запрос вернёт ноль записей — пустой результат.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Где должен стоять LIMIT в запросе?',
        options: ['Перед SELECT', 'Внутри клаузы FROM', 'После клаузы FROM (обычно в самом конце)', 'Между SELECT и именами столбцов'],
        correctIndex: 2,
        explanation: 'LIMIT ставится в конце запроса, после WHERE и ORDER BY.',
      },
      {
        type: 'truefalse',
        question: 'Запрос SELECT * FROM orders LIMIT 0 возвращает ноль записей.',
        correct: true,
        explanation: 'Установка LIMIT равным 0 ограничивает результирующий набор нулём строк, возвращая пустой результат.',
      },
    ],
    task: {
      title: 'Ограничение количества записей',
      description: 'Получите 5 самых холодных мест из таблицы temperature. Следуйте этим шагам: отсортируйте результат по возрастанию, ограничьте результат 5 строками.',
      availableTables: [{ name: 'temperature', columns: ['place_id', 'avg_temp'] }],
      datasets: {
        temperature: [
          { place_id: 1, avg_temp: -21 },
          { place_id: 2, avg_temp: -13 },
          { place_id: 3, avg_temp: -9 },
          { place_id: 4, avg_temp: 4 },
          { place_id: 5, avg_temp: -1 },
          { place_id: 6, avg_temp: 12 },
          { place_id: 7, avg_temp: 7 },
          { place_id: 8, avg_temp: 22 },
          { place_id: 9, avg_temp: -3 },
          { place_id: 10, avg_temp: -12 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT * FROM temperature ORDER BY avg_temp LIMIT 5',
      hint: 'ORDER BY avg_temp даёт сортировку по возрастанию, LIMIT 5 оставляет первые 5 строк.',
    },
  },

  // --- Глава 4: больше ключевых слов ---
  {
    id: 's1c14',
    section: 1,
    chapter: 14,
    module: 'Больше ключевых слов',
    title: 'Ключевое слово IN',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `Когда нужно проверить, соответствует ли столбец одному из нескольких возможных значений, можно написать это через несколько условий OR. Например, следующий запрос очень длинный:`,
        code: `SELECT * FROM table1\nWHERE col1 = 'b' OR col1 = 'c' OR col1 = 'd'`,
      },
      {
        type: 'text',
        html: `Мы можем упростить это, используя ключевое слово <span class="inline-code">IN</span>:`,
        code: `SELECT *\nFROM table1\nWHERE col1 IN ('a', 'b', 'c', 'd')`,
      },
      {
        type: 'text',
        html: `Эта более короткая версия делает точно то же самое: возвращает строки, где col1 равен любому из значений, перечисленных в скобках.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: "Какой запрос эквивалентен WHERE city IN ('Paris', 'London')?",
        options: [
          "WHERE city BETWEEN 'Paris' AND 'London'",
          "WHERE city LIKE 'Paris' OR city LIKE 'London'",
          "WHERE city = 'Paris' AND city = 'London'",
          "WHERE city = 'Paris' OR city = 'London'",
        ],
        correctIndex: 3,
        explanation: 'IN — это сокращение для цепочки условий через OR с одним и тем же столбцом.',
      },
      {
        type: 'single',
        question: 'Какое основное преимущество использования IN по сравнению с несколькими условиями OR?',
        options: ['Позволяет сопоставлять частичные строки', 'Более короткий и читаемый синтаксис', 'Работает быстрее в любой базе данных', 'Позволяет сравнивать разные столбцы'],
        correctIndex: 1,
        explanation: 'Оператор IN объединяет несколько условий OR в одно более чистое выражение, которое легче читать и поддерживать.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой.',
        lines: ['SELECT * FROM users', "WHERE role IN 'admin', 'editor')"],
        errorLine: 1,
        explanation: "После IN список значений нужно заключить в скобки целиком: IN ('admin', 'editor').",
      },
    ],
    task: {
      title: 'Ключевое слово IN',
      description: 'В таблице **countries** верните все записи из следующих стран: Oman, Nicaragua, Bhutan, Senegal, Belarus.',
      availableTables: [{ name: 'countries', columns: ['location_x', 'location_y', 'country'] }],
      datasets: {
        countries: [
          { location_x: 12, location_y: 5, country: 'Oman' },
          { location_x: 8, location_y: 19, country: 'France' },
          { location_x: 33, location_y: 2, country: 'Nicaragua' },
          { location_x: 41, location_y: 7, country: 'Bhutan' },
          { location_x: 3, location_y: 28, country: 'Senegal' },
          { location_x: 17, location_y: 11, country: 'Germany' },
          { location_x: 29, location_y: 14, country: 'Belarus' },
          { location_x: 22, location_y: 9, country: 'Japan' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM countries WHERE country IN ('Oman', 'Nicaragua', 'Bhutan', 'Senegal', 'Belarus')",
      hint: 'WHERE column IN (значение1, значение2, ...).',
    },
  },
  {
    id: 's1c15',
    section: 1,
    chapter: 15,
    module: 'Больше ключевых слов',
    title: 'Ключевое слово BETWEEN',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">BETWEEN</span> проверяет, попадает ли значение в диапазон (включая обе границы):`,
        code: `SELECT * FROM table1\nWHERE col1 BETWEEN 10 AND 20`,
      },
      {
        type: 'text',
        html: `Это эквивалентно <span class="inline-code">col1 >= 10 AND col1 <= 20</span> — обе границы включены в результат.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какой запрос эквивалентен WHERE price BETWEEN 20 AND 50?',
        options: [
          'WHERE price > 20 AND price <= 50',
          'WHERE price >= 20 AND price <= 50',
          'WHERE price > 20 AND price < 50',
          'WHERE price >= 20 AND price < 50',
        ],
        correctIndex: 1,
        explanation: 'BETWEEN включает обе границы диапазона.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с некорректным синтаксисом BETWEEN.',
        lines: ['SELECT * FROM products', 'WHERE price BETWEEN 100 OR 500'],
        errorLine: 1,
        explanation: 'BETWEEN использует AND для указания верхней границы, а не OR. Правильный синтаксис: BETWEEN 100 AND 500.',
      },
    ],
    task: {
      title: 'Ключевое слово BETWEEN',
      description: 'В таблице **data** выберите все записи, у которых value находится между 7 и 13 включительно.',
      availableTables: [{ name: 'data', columns: ['value'] }],
      datasets: {
        data: [
          { value: 13 }, { value: 3 }, { value: 9 }, { value: 7 },
          { value: 10 }, { value: 20 }, { value: 1 }, { value: 15 },
          { value: 8 }, { value: 5 }, { value: 13 }, { value: 22 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT * FROM data WHERE value BETWEEN 7 AND 13',
      hint: 'WHERE column BETWEEN нижняя_граница AND верхняя_граница.',
    },
  },
  {
    id: 's1c16',
    section: 1,
    chapter: 16,
    module: 'Больше ключевых слов',
    title: 'Ключевое слово LIKE',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">LIKE</span> используется для сопоставления строк с шаблоном. Два специальных символа: <span class="inline-code">%</span> — любое количество любых символов, <span class="inline-code">_</span> — ровно один любой символ.`,
        code: `SELECT * FROM products\nWHERE name LIKE 'Pro%'`,
      },
      {
        type: 'text',
        html: `Этот запрос найдёт все товары, название которых начинается с "Pro" (Product, Pro Max, Professional и т.д.).`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: "Какие строки найдёт WHERE name LIKE 'J_n'?",
        options: ['"Jn", "Jan", "Jason"', '"John", "Jean", "Joan"', '"Jan", "Jon", "Jun"'],
        correctIndex: 2,
        explanation: 'Шаблон требует ровно три символа: "J", затем любой один символ, затем "n".',
      },
      {
        type: 'fillblank',
        question: 'Завершите запрос, чтобы найти все продукты, где название начинается с "Pro".',
        template: ['SELECT * FROM products\nWHERE name ', ' ', ''],
        blanks: [
          { options: ['LIKE', '=', 'IN'], correct: 'LIKE' },
          { options: ["'Pro%'", "'%Pro'", "'Pro'"], correct: "'Pro%'" },
        ],
        explanation: 'LIKE требуется для сопоставления шаблонов с подстановочными знаками в SQL, а % после Pro означает «и что угодно дальше».',
      },
    ],
    task: {
      title: 'Ключевое слово LIKE',
      description: 'В таблице **people** выберите всех, чьё имя начинается на "K", отсортировав по name по убыванию.',
      availableTables: [{ name: 'people', columns: ['id', 'name'] }],
      datasets: {
        people: [
          { id: 13, name: 'Jhon' },
          { id: 14, name: 'Kayle' },
          { id: 15, name: 'Kyla' },
          { id: 16, name: 'Marta' },
          { id: 17, name: 'Katarina' },
          { id: 18, name: 'Koa' },
          { id: 19, name: 'Lior' },
          { id: 20, name: 'Kassandra' },
          { id: 21, name: 'Kirra' },
          { id: 22, name: 'Denis' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM people WHERE name LIKE 'K%' ORDER BY name DESC",
      hint: "WHERE name LIKE 'K%' ORDER BY name DESC.",
    },
  },
  {
    id: 's1c17',
    section: 1,
    chapter: 17,
    module: 'Больше ключевых слов',
    title: 'Трофей главы',
    kind: 'checkpoint',
    theory: [
      {
        type: 'text',
        html: `Отлично! Вы прошли главу «Больше ключевых слов»: <span class="inline-code">IN</span> для списка значений, <span class="inline-code">BETWEEN</span> для диапазона, <span class="inline-code">LIKE</span> для сопоставления по шаблону с <span class="inline-code">%</span> и <span class="inline-code">_</span>.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: "Какой оператор используют для проверки диапазона значений включительно?",
        options: ['IN', 'LIKE', 'BETWEEN', 'AS'],
        correctIndex: 2,
        explanation: 'BETWEEN проверяет диапазон, включая обе границы.',
      },
      {
        type: 'single',
        question: 'Какой символ в LIKE означает «ровно один любой символ»?',
        options: ['%', '_', '*', '?'],
        correctIndex: 1,
        explanation: 'Подчёркивание _ соответствует ровно одному произвольному символу, % — любому количеству символов.',
      },
      {
        type: 'truefalse',
        question: "WHERE status IN ('active', 'pending') эквивалентно WHERE status = 'active' OR status = 'pending'.",
        correct: true,
        explanation: 'IN — это сокращённая запись цепочки условий OR по одному столбцу.',
      },
    ],
    task: {
      title: 'Итоговая задача главы',
      description: 'В таблице **orders** выберите заказы, у которых статус в списке (\'new\', \'processing\') И сумма total между 50 и 200 включительно.',
      availableTables: [{ name: 'orders', columns: ['id', 'status', 'total'] }],
      datasets: {
        orders: [
          { id: 1, status: 'new', total: 80 },
          { id: 2, status: 'shipped', total: 120 },
          { id: 3, status: 'processing', total: 200 },
          { id: 4, status: 'new', total: 30 },
          { id: 5, status: 'processing', total: 500 },
          { id: 6, status: 'cancelled', total: 90 },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM orders WHERE status IN ('new', 'processing') AND total BETWEEN 50 AND 200",
      hint: 'Совместите IN, AND и BETWEEN в одном запросе.',
    },
  },

  // --- Глава 5: Арифметические операции ---
  {
    id: 's1c18',
    section: 1,
    chapter: 18,
    module: 'Арифметические операции',
    title: 'Псевдонимы AS',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `Ключевое слово <span class="inline-code">AS</span> даёт столбцу (или результату вычисления) временное имя — <b>псевдоним</b> — в результатах запроса:`,
        code: `SELECT price AS cost\nFROM products`,
      },
      {
        type: 'text',
        html: `Этот запрос отображает столбец price под именем cost. Псевдонимы влияют только на то, как данные отображаются в результатах запроса — фактическая структура таблицы остаётся неизменной.`,
      },
      {
        type: 'text',
        html: `Псевдонимы особенно полезны для вычисляемых столбцов и агрегатных функций, чтобы результат было понятно читать:`,
        code: `SELECT COUNT(*) AS total\nFROM orders`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Что отображает запрос SELECT price AS cost FROM products?',
        options: [
          'Столбец price обозначен как cost',
          'Ошибка, поскольку cost не существует',
          'Оба столбца, price и cost',
        ],
        correctIndex: 0,
        explanation: 'Псевдонимы столбцов влияют только на то, как данные отображаются в результатах запроса; фактическая структура таблицы остаётся неизменной.',
      },
      {
        type: 'single',
        question: 'Почему стоит использовать описательные псевдонимы столбцов?',
        options: [
          'Чтобы навсегда исправить плохо названные столбцы',
          'Чтобы улучшить скорость выполнения запроса',
          'Чтобы сделать результаты запроса более понятными',
          'Чтобы создать новые столбцы в таблице',
        ],
        correctIndex: 2,
        explanation: 'Чёткие имена столбцов помогают аудитории быстро понять, какие данные представлены.',
      },
    ],
    task: {
      title: 'Псевдонимы AS',
      description: 'В таблице **products** выберите столбец **price**, назвав его **cost**.',
      availableTables: [{ name: 'products', columns: ['name', 'price'] }],
      datasets: {
        products: [
          { name: 'Клавиатура', price: 45 },
          { name: 'Монитор', price: 210 },
          { name: 'Мышь', price: 18 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT price AS cost FROM products',
      hint: 'SELECT column AS alias FROM table.',
    },
  },
  {
    id: 's1c19',
    section: 1,
    chapter: 19,
    module: 'Арифметические операции',
    title: 'Арифметика в SELECT',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `В SQL можно выполнять арифметические вычисления прямо в SELECT, используя операторы <span class="inline-code">+</span>, <span class="inline-code">-</span>, <span class="inline-code">*</span>, <span class="inline-code">/</span>:`,
        code: `SELECT price, price * 1.2 AS price_with_tax\nFROM products`,
      },
      {
        type: 'text',
        html: `Этот запрос вычисляет цену с налогом для каждой строки, не изменяя саму таблицу — вычисление происходит только в результате запроса.`,
      },
      {
        type: 'text',
        html: `Арифметику можно использовать и в условии WHERE:`,
        code: `SELECT * FROM products\nWHERE price * quantity > 500`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Что вычисляет столбец price * 1.2 в запросе SELECT price, price * 1.2 AS price_with_tax FROM products?',
        options: [
          'Изменяет цену в таблице products на 20% навсегда',
          'Показывает цену, увеличенную на 20%, только в результате запроса',
          'Вызывает ошибку, так как нельзя умножать столбцы',
        ],
        correctIndex: 1,
        explanation: 'Вычисления в SELECT не изменяют исходную таблицу — они видны только в результате запроса.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой.',
        lines: ['SELECT name, price', 'quantity * price AS total FROM cart'],
        errorLine: 1,
        explanation: 'Пропущена запятая после price перед началом вычисляемого столбца.',
      },
      {
        type: 'truefalse',
        question: 'Арифметические операторы (+, -, *, /) можно использовать не только в SELECT, но и в WHERE.',
        correct: true,
        explanation: 'Например, WHERE price * quantity > 500 — вполне рабочее условие.',
      },
    ],
    task: {
      title: 'Арифметика в SELECT',
      description: 'В таблице **cart** выберите name и вычисляемый столбец total, равный price умноженному на quantity.',
      availableTables: [{ name: 'cart', columns: ['name', 'price', 'quantity'] }],
      datasets: {
        cart: [
          { name: 'Клавиатура', price: 45, quantity: 2 },
          { name: 'Монитор', price: 210, quantity: 1 },
          { name: 'Мышь', price: 18, quantity: 3 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT name, price * quantity AS total FROM cart',
      hint: 'SELECT name, price * quantity AS total FROM cart.',
    },
  },
  {
    id: 's1c20',
    section: 1,
    chapter: 20,
    module: 'Арифметические операции',
    title: 'Трофей главы',
    kind: 'checkpoint',
    theory: [
      {
        type: 'text',
        html: `Отлично! Вы прошли главу «Арифметические операции»: псевдонимы через <span class="inline-code">AS</span> и вычисления прямо в запросе через <span class="inline-code">+ - * /</span>.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какое ключевое слово задаёт временное имя столбцу в результате запроса?',
        options: ['LIKE', 'AS', 'IN', 'DISTINCT'],
        correctIndex: 1,
        explanation: 'AS создаёт псевдоним столбца или вычисляемого значения.',
      },
      {
        type: 'truefalse',
        question: 'SELECT price * 2 AS double_price FROM products изменяет значения price в самой таблице.',
        correct: false,
        explanation: 'Вычисления в SELECT влияют только на результат запроса, а не на хранимые данные.',
      },
    ],
    task: {
      title: 'Итоговая задача главы',
      description: 'В таблице **orders** выберите name и вычисляемый столбец final_price, равный price минус discount, отсортировав по final_price по возрастанию.',
      availableTables: [{ name: 'orders', columns: ['name', 'price', 'discount'] }],
      datasets: {
        orders: [
          { name: 'Заказ A', price: 100, discount: 10 },
          { name: 'Заказ B', price: 250, discount: 50 },
          { name: 'Заказ C', price: 80, discount: 0 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT name, price - discount AS final_price FROM orders ORDER BY final_price',
      hint: 'SELECT name, price - discount AS final_price FROM orders ORDER BY final_price.',
    },
  },
];

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id);
}
