// Lesson data. Each lesson = theory slides + quiz + one applied task.
// Add new chapters by pushing more objects into LESSONS, following this shape.
//
// theory slide types: 'text' | 'table'
// quiz item types:    'single' | 'fillblank'
// task: real SQL graded against an in-memory sqlite db built from `datasets`

export const SECTIONS = [
  { id: 1, title: 'Основы SQL', chapters: [1, 2, 3, 4, 5, 6] },
];

export const LESSONS = [
  {
    id: 's1c1',
    section: 1,
    chapter: 1,
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

  // --- Placeholder chapters (locked until content is added) ---
  {
    id: 's1c3',
    section: 1,
    chapter: 3,
    title: 'Оператор WHERE',
    kind: 'lesson',
    placeholder: true,
  },
  {
    id: 's1c4',
    section: 1,
    chapter: 4,
    title: 'Сортировка ORDER BY',
    kind: 'lesson',
    placeholder: true,
  },
  {
    id: 's1c5',
    section: 1,
    chapter: 5,
    title: 'Ограничение LIMIT',
    kind: 'lesson',
    placeholder: true,
  },
  {
    id: 's1c6',
    section: 1,
    chapter: 6,
    title: 'Итоги раздела',
    kind: 'checkpoint',
    placeholder: true,
  },
];

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id);
}
