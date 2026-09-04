// Lesson data. Each lesson = theory slides + quiz + one applied task.
// Add new chapters by pushing more objects into LESSONS, following this shape.
//
// theory slide types: 'text' | 'table'
// quiz item types:    'single' | 'fillblank' | 'truefalse' | 'findline'
// task: real SQL graded against an in-memory sqlite db built from `datasets`
// `module` groups chapters under a shared divider label on the Path screen.

export const SECTIONS = [
  { id: 1, title: 'Основы SQL', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
  { id: 2, title: 'Агрегатные функции', chapters: [1, 2, 3, 4] },
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
          ['Renna', 'Voskov', 29],
          ['Dimir', 'Ferro', 32],
          ['Alwin', 'Brecht', 21],
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — здесь то же самое, что в обычном уроке, но подробнее, с бо́льшим числом примеров и более каверзными вопросами. Никаких сложных научных терминов — просто больше практики.`,
        },
        {
          type: 'table',
          caption: 'Возьмём таблицу побольше — <span class="inline-code">library_books</span>:',
          columns: ['title', 'author', 'year'],
          rows: [
            ['Дюна', 'Херберт', 1965],
            ['1984', 'Оруэлл', 1949],
            ['Мастер и Маргарита', 'Булгаков', 1967],
            ['Солярис', 'Лем', 1961],
          ],
        },
        {
          type: 'text',
          html: `Если вы напишете <span class="inline-code">SELECT title author FROM library_books</span> — <b>без запятой</b> между title и author — SQL решит, что author — это просто новое имя (псевдоним) для столбца title, а не второй столбец! Результат будет неожиданным: вы получите только один столбец title, но подписанный как "author".`,
          code: `-- Неправильно (нет запятой):\nSELECT title author FROM library_books\n\n-- Правильно:\nSELECT title, author FROM library_books`,
        },
        {
          type: 'text',
          html: `Ещё пример: порядок столбцов в SELECT определяет порядок столбцов в результате — он <b>не обязан</b> совпадать с порядком столбцов в самой таблице.`,
          code: `SELECT author, title FROM library_books\n-- author будет первым столбцом в результате,\n-- хотя в таблице первым идёт title`,
        },
        {
          type: 'text',
          html: `И важная деталь про <span class="inline-code">DISTINCT</span>: если вы выбираете несколько столбцов, DISTINCT убирает повторы по <b>комбинации</b> всех выбранных столбцов, а не по каждому столбцу отдельно.`,
          code: `SELECT DISTINCT author, year FROM library_books\n-- уберёт только полностью одинаковые пары (author, year)`,
        },
      ],
      quiz: [
        {
          type: 'findline',
          question: 'Найдите строку с ошибкой (после неё будет не тот результат, что ожидалось).',
          lines: ['SELECT title author FROM library_books'],
          errorLine: 0,
          explanation: 'Без запятой между title и author SQL воспринимает author как псевдоним для title, а не как второй столбец.',
        },
        {
          type: 'single',
          question: 'В таблице library_books (title, author, year) есть 4 книги, у каждой свой уникальный author. Сколько строк вернёт SELECT DISTINCT author FROM library_books?',
          options: ['1', '4', '0', 'Зависит от year'],
          correctIndex: 1,
          explanation: 'Раз все 4 значения author разные, DISTINCT никого не уберёт — останутся все 4.',
        },
        {
          type: 'truefalse',
          question: 'SELECT title, author FROM library_books и SELECT author, title FROM library_books вернут данные в одинаковом порядке столбцов.',
          correct: false,
          explanation: 'Порядок столбцов в результате всегда соответствует порядку, в котором вы перечислили их после SELECT.',
        },
        {
          type: 'single',
          question: 'Что вернёт SELECT DISTINCT author, year FROM library_books, если два автора написали книги в один и тот же год, но это разные авторы?',
          options: [
            'Одну строку — потому что year совпадает',
            'Две строки — потому что пары (author, year) разные',
            'Ошибку',
            'Ноль строк',
          ],
          correctIndex: 1,
          explanation: 'DISTINCT с несколькими столбцами убирает повторы только по полностью совпадающей комбинации значений.',
        },
        {
          type: 'fillblank',
          question: 'Допишите запрос: выбрать уникальные пары author и year из library_books.',
          template: ['SELECT ', ' author, year ', 'library_books'],
          blanks: [
            { options: ['DISTINCT', 'UNIQUE', 'ALL'], correct: 'DISTINCT' },
            { options: ['FROM', 'IN', 'OF'], correct: 'FROM' },
          ],
          explanation: 'SELECT DISTINCT author, year FROM library_books.',
        },
      ],
      task: {
        title: 'Сложный режим: библиотека',
        description: 'В таблице **library_books** выберите уникальные комбинации **author** и **year** — только столбцы author и year, без повторяющихся пар.',
        availableTables: [{ name: 'library_books', columns: ['title', 'author', 'year'] }],
        datasets: {
          library_books: [
            { title: 'Дюна', author: 'Херберт', year: 1965 },
            { title: '1984', author: 'Оруэлл', year: 1949 },
            { title: 'Скотный двор', author: 'Оруэлл', year: 1945 },
            { title: 'Мастер и Маргарита', author: 'Булгаков', year: 1967 },
            { title: 'Солярис', author: 'Лем', year: 1961 },
            { title: 'Дюна. Мессия Дюны', author: 'Херберт', year: 1969 },
            { title: 'Дети Дюны', author: 'Херберт', year: 1976 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT DISTINCT author, year FROM library_books',
        hint: 'SELECT DISTINCT author, year FROM library_books — Херберт встретится 3 раза, но с разными year, поэтому все останутся.',
      },
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — когда стоит писать SELECT *, а когда лучше перечислить столбцы по именам.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">inventory</span> с 5 столбцами:',
          columns: ['sku', 'name', 'price', 'stock', 'warehouse_notes'],
          rows: [
            ['A1', 'Кабель USB', 5, 120, 'на складе А, полка 3'],
            ['A2', 'Адаптер', 12, 40, 'требует проверки'],
          ],
        },
        {
          type: 'text',
          html: `<span class="inline-code">SELECT *</span> удобен для быстрого просмотра, но в реальных проектах его часто избегают: если в таблицу позже добавят новый столбец, ваш запрос молча начнёт возвращать больше данных, чем ожидалось. Перечисление конкретных столбцов — <span class="inline-code">SELECT sku, name, price FROM inventory</span> — предсказуемее.`,
        },
        {
          type: 'text',
          html: `Ещё нюанс: порядок столбцов в результате всегда соответствует порядку в SELECT, а не порядку в самой таблице. Если хотите view с столбцами в другом порядке — просто перечислите их в нужной последовательности.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Почему в реальных проектах иногда избегают SELECT * вместо явного перечисления столбцов?',
          options: [
            'SELECT * работает медленнее в любом случае',
            'Если в таблицу добавят новый столбец, запрос начнёт неожиданно возвращать больше данных',
            'SELECT * — устаревший синтаксис',
            'SELECT * нельзя использовать с WHERE',
          ],
          correctIndex: 1,
          explanation: 'SELECT * "молча" подхватывает любые новые столбцы таблицы, что может сломать код, ожидающий фиксированный набор данных.',
        },
        {
          type: 'truefalse',
          question: 'SELECT name, sku FROM inventory вернёт столбцы в том же порядке, что и в самой таблице.',
          correct: false,
          explanation: 'Порядок столбцов в результате определяется порядком в SELECT, а не порядком в исходной таблице.',
        },
      ],
      task: {
        title: 'Сложный режим: явные столбцы',
        description: 'В таблице **inventory** выберите только name и price (именно в таком порядке), без остальных столбцов.',
        availableTables: [{ name: 'inventory', columns: ['sku', 'name', 'price', 'stock'] }],
        datasets: {
          inventory: [
            { sku: 'A1', name: 'Кабель USB', price: 5, stock: 120 },
            { sku: 'A2', name: 'Адаптер', price: 12, stock: 40 },
            { sku: 'A3', name: 'Наушники', price: 25, stock: 15 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT name, price FROM inventory',
        hint: 'Перечислите столбцы явно в нужном порядке через запятую.',
      },
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
          { coin: 'XRT', amount: 1.6 },
          { coin: 'ZKD', amount: 7.2 },
          { coin: 'XRT', amount: 3.4 },
          { coin: 'PLN', amount: 12.1 },
          { coin: 'ZKD', amount: 0.9 },
          { coin: 'USD', amount: 5.5 },
          { coin: 'XRT', amount: 2.2 },
          { coin: 'PLN', amount: 8.8 },
          { coin: 'USD', amount: 4.1 },
          { coin: 'EUR', amount: 6.3 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT DISTINCT coin FROM sales',
      hint: 'SELECT DISTINCT column_name FROM table — DISTINCT сразу после SELECT.',
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — DISTINCT с несколькими столбцами и его влияние на счётчики.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">visits</span>:',
          columns: ['user_id', 'page'],
          rows: [
            [1, 'home'], [1, 'home'], [1, 'about'], [2, 'home'], [2, 'contact'],
          ],
        },
        {
          type: 'text',
          html: `Если применить DISTINCT к одному столбцу — <span class="inline-code">SELECT DISTINCT user_id FROM visits</span> — получим уникальных пользователей (1, 2). Но <span class="inline-code">SELECT DISTINCT user_id, page FROM visits</span> уберёт повторы только по ПАРЕ значений — получим (1,home), (1,about), (2,home), (2,contact): дубликат (1,home) схлопнется в одну строку, а остальные останутся, потому что как пара они уникальны.`,
        },
        {
          type: 'text',
          html: `Частая ошибка: думать, что DISTINCT считает что-то (как COUNT). На самом деле DISTINCT просто убирает повторяющиеся строки из результата — если нужно посчитать количество уникальных значений, комбинируют <span class="inline-code">COUNT(DISTINCT column)</span>.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'В таблице visits (1,home)(1,home)(1,about)(2,home)(2,contact), сколько строк вернёт SELECT DISTINCT user_id, page FROM visits?',
          options: ['2', '4', '5', '1'],
          correctIndex: 1,
          explanation: 'Уникальные пары: (1,home), (1,about), (2,home), (2,contact) — четыре, повторная (1,home) схлопывается в одну.',
        },
        {
          type: 'truefalse',
          question: 'DISTINCT сам по себе умеет считать количество уникальных значений, без дополнительных функций.',
          correct: false,
          explanation: 'DISTINCT только убирает дубликаты из результата. Чтобы посчитать количество, нужен COUNT(DISTINCT column).',
        },
      ],
      task: {
        title: 'Сложный режим: визиты',
        description: 'В таблице **visits** выберите уникальные пары user_id и page (без повторов по обоим столбцам вместе).',
        availableTables: [{ name: 'visits', columns: ['user_id', 'page'] }],
        datasets: {
          visits: [
            { user_id: 1, page: 'home' },
            { user_id: 1, page: 'home' },
            { user_id: 1, page: 'about' },
            { user_id: 2, page: 'home' },
            { user_id: 2, page: 'contact' },
            { user_id: 3, page: 'home' },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT DISTINCT user_id, page FROM visits',
        hint: 'SELECT DISTINCT column1, column2 FROM table — убирает повторы по комбинации.',
      },
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
      description: 'В таблице **visitors** выберите уникальные значения столбца **city** — используйте SELECT, DISTINCT и FROM.',
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
      requiredKeywords: ['SELECT', 'DISTINCT', 'FROM'],
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
          ['XRT', 13],
          ['VNQ', 15],
          ['XRT', 18],
          ['MYF', 21],
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
        lines: ['SELECT * FROM sales', "WHERE coin = XRT"],
        errorLine: 1,
        explanation: "Строковые значения нужно заключать в одинарные кавычки, например 'XRT', иначе SQL интерпретирует их как имя столбца.",
      },
      {
        type: 'single',
        question: 'Что вернёт SELECT * FROM sales WHERE amount <= 20 для таблицы выше?',
        options: [
          'Только запись с amount 21',
          'Нет записей',
          'Записи с coin XRT (13), VNQ (15) и XRT (18): MYF (21) исключается',
          'Все четыре записи из таблицы',
        ],
        correctIndex: 2,
        explanation: 'Условие amount <= 20 исключает только MYF с amount 21 — остальные три записи проходят.',
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — операторы сравнения по подробнее, плюс частые ошибки новичков.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">flights</span>:',
          columns: ['flight_no', 'delay_min', 'status'],
          rows: [
            ['SU101', 0, 'on_time'],
            ['SU205', 45, 'delayed'],
            ['SU330', -5, 'early'],
            ['SU418', 120, 'delayed'],
          ],
        },
        {
          type: 'text',
          html: `Обратите внимание на строку с <span class="inline-code">delay_min = -5</span> — отрицательное число означает, что рейс вылетел РАНЬШЕ расписания. Условие <span class="inline-code">WHERE delay_min > 0</span> отберёт только реально задержанные рейсы, а <span class="inline-code">WHERE delay_min >= 0</span> добавит ещё и точные по расписанию.`,
        },
        {
          type: 'text',
          html: `Частая ошибка: путать <span class="inline-code">=</span> (равно) с <span class="inline-code">==</span> (такого оператора в SQL нет!) или забывать, что сравнение текста регистрозависимо в большинстве баз данных: <span class="inline-code">'Delayed'</span> и <span class="inline-code">'delayed'</span> — разные строки.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'В таблице flights (delay_min: 0, 45, -5, 120) сколько строк вернёт WHERE delay_min > 0?',
          options: ['4', '3', '2', '1'],
          correctIndex: 2,
          explanation: 'Строго больше нуля: 45 и 120 — итого 2 строки. 0 не проходит (не больше), -5 тем более.',
        },
        {
          type: 'single',
          question: 'Чем WHERE delay_min >= 0 отличается от WHERE delay_min > 0 для этой таблицы?',
          options: [
            'Ничем — результат одинаковый',
            'Первый включит ещё и рейс с delay_min = 0',
            'Второй включит больше строк',
            'Первый вызовет ошибку',
          ],
          correctIndex: 1,
          explanation: '>= включает и равенство нулю, поэтому рейс SU101 (delay_min=0) тоже попадёт в результат.',
        },
        {
          type: 'findline',
          question: 'Найдите строку с ошибкой.',
          lines: ['SELECT * FROM flights', "WHERE status == 'delayed'"],
          errorLine: 1,
          explanation: "В SQL для сравнения используется один знак равенства: status = 'delayed', а не ==.",
        },
        {
          type: 'truefalse',
          question: "WHERE status = 'Delayed' и WHERE status = 'delayed' в большинстве баз данных вернут одинаковый результат.",
          correct: false,
          explanation: 'Сравнение строк обычно регистрозависимо — "Delayed" и "delayed" считаются разными значениями.',
        },
      ],
      task: {
        title: 'Сложный режим: рейсы',
        description: 'В таблице **flights** выберите flight_no тех рейсов, у которых delay_min строго больше 0 (реально задержанные, без учёта точных по расписанию и вылетевших раньше).',
        availableTables: [{ name: 'flights', columns: ['flight_no', 'delay_min', 'status'] }],
        datasets: {
          flights: [
            { flight_no: 'SU101', delay_min: 0, status: 'on_time' },
            { flight_no: 'SU205', delay_min: 45, status: 'delayed' },
            { flight_no: 'SU330', delay_min: -5, status: 'early' },
            { flight_no: 'SU418', delay_min: 120, status: 'delayed' },
            { flight_no: 'SU512', delay_min: 3, status: 'delayed' },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT flight_no FROM flights WHERE delay_min > 0',
        hint: 'Строго больше нуля — используйте >, а не >=.',
      },
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
          ['Denar', 13, 'male'],
          ['Marek', 17, 'male'],
          ['Ilana', 24, 'female'],
          ['Tomek', 23, 'male'],
          ['Petra', 18, 'female'],
        ],
      },
      {
        type: 'text',
        html: `<span class="inline-code">AND</span> требует, чтобы выполнялись <b>все</b> условия сразу:`,
        code: `SELECT * FROM people\nWHERE gender = 'female' AND age < 20`,
      },
      {
        type: 'text',
        html: `Для таблицы выше этот запрос вернёт только Petra (18, female) — Ilana не подходит, потому что её возраст 24, не меньше 20.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: "Сколько строк вернёт WHERE gender = 'male' AND age < 15 для таблицы people?",
        options: ['2', '3', '0', '1'],
        correctIndex: 3,
        explanation: 'Только Denar (13, male) удовлетворяет обоим условиям сразу.',
      },
      {
        type: 'truefalse',
        question: "Запрос WHERE gender = 'male' AND age > 20 вернул бы Tomek.",
        correct: true,
        explanation: 'Tomek — male и ему 23 (больше 20), оба условия выполнены.',
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
          { name: 'Denar', age: 13, gender: 'male' },
          { name: 'Marek', age: 17, gender: 'male' },
          { name: 'Ilana', age: 24, gender: 'female' },
          { name: 'Tomek', age: 23, gender: 'male' },
          { name: 'Petra', age: 18, gender: 'female' },
          { name: 'Sasha', age: 31, gender: 'female' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM people WHERE gender = 'female' AND age >= 20",
      hint: "WHERE условие1 AND условие2 — оба должны быть истинны.",
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — что бывает, когда AND соединяет три и больше условий, и почему порядок условий не важен для результата.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">candidates</span>:',
          columns: ['name', 'age', 'experience', 'remote'],
          rows: [
            ['Anna', 28, 5, 1],
            ['Boris', 22, 1, 1],
            ['Chen', 35, 8, 0],
            ['Dara', 29, 4, 1],
            ['Eli', 26, 3, 0],
          ],
        },
        {
          type: 'text',
          html: `AND можно соединить сколько угодно раз: <span class="inline-code">условие1 AND условие2 AND условие3</span> — строка пройдёт, только если ВСЕ условия истинны одновременно.`,
          code: `SELECT * FROM candidates\nWHERE age >= 25 AND experience >= 3 AND remote = 1`,
        },
        {
          type: 'text',
          html: `Порядок условий в AND не влияет на результат: <span class="inline-code">A AND B AND C</span> вернёт то же самое, что <span class="inline-code">C AND A AND B</span>. Но для читаемости обычно ставят самое "отсекающее" условие первым.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Сколько кандидатов из таблицы (Anna 28/5/1, Boris 22/1/1, Chen 35/8/0, Dara 29/4/1, Eli 26/3/0) удовлетворяют age >= 25 AND experience >= 3 AND remote = 1?',
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation: 'Подходят Anna (28,5,1) и Dara (29,4,1). Chen не годится (remote=0), Boris — experience=1, Eli — remote=0.',
        },
        {
          type: 'truefalse',
          question: 'WHERE a AND b AND c всегда возвращает те же строки, что WHERE c AND a AND b.',
          correct: true,
          explanation: 'Порядок условий в AND не влияет на итоговый результат — важно лишь, что все они истинны.',
        },
        {
          type: 'single',
          question: 'Если добавить четвёртое условие через AND к уже строгому запросу, что произойдёт с количеством результатов?',
          options: [
            'Может остаться прежним или уменьшиться, но не увеличится',
            'Всегда увеличится',
            'Всегда уменьшится вдвое',
            'Не изменится никогда',
          ],
          correctIndex: 0,
          explanation: 'Каждое дополнительное условие через AND может только сузить (или не изменить) набор результатов, но никогда не расширить.',
        },
      ],
      task: {
        title: 'Сложный режим: кандидаты',
        description: 'В таблице **candidates** выберите тех, у кого age больше или равен 25, experience больше или равен 3, И remote равен 1 — используйте три условия через AND.',
        availableTables: [{ name: 'candidates', columns: ['name', 'age', 'experience', 'remote'] }],
        datasets: {
          candidates: [
            { name: 'Anna', age: 28, experience: 5, remote: 1 },
            { name: 'Boris', age: 22, experience: 1, remote: 1 },
            { name: 'Chen', age: 35, experience: 8, remote: 0 },
            { name: 'Dara', age: 29, experience: 4, remote: 1 },
            { name: 'Eli', age: 26, experience: 3, remote: 0 },
            { name: 'Farah', age: 31, experience: 6, remote: 1 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT * FROM candidates WHERE age >= 25 AND experience >= 3 AND remote = 1',
        hint: 'Три условия через AND подряд: age >= 25 AND experience >= 3 AND remote = 1.',
      },
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
        html: `Для таблицы people (Denar 13 male, Marek 17 male, Ilana 24 female, Tomek 23 male, Petra 18 female) этот запрос исключает только Tomek — он не female и ему не меньше 20 лет.`,
      },
    ],
    quiz: [
      {
        type: 'truefalse',
        question: "Запрос WHERE gender = 'male' AND age > 20 вернул бы Tomek (age 23, male).",
        correct: true,
        explanation: 'Tomek удовлетворяет обоим условиям: male и старше 20.',
      },
      {
        type: 'single',
        question: "Сколько строк вернёт WHERE gender = 'female' OR age < 20 для таблицы people?",
        options: ['3 строки', '4 строки', '2 строки', '5 строк'],
        correctIndex: 1,
        explanation: 'Подходят Denar, Marek (age<20), Ilana (female) и Petra (оба условия) — итого 4.',
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — что происходит, когда AND и OR встречаются в одном запросе, и почему тут важны скобки.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">tickets</span>:',
          columns: ['id', 'priority', 'status'],
          rows: [
            [1, 'high', 'open'],
            [2, 'low', 'open'],
            [3, 'high', 'closed'],
            [4, 'medium', 'open'],
          ],
        },
        {
          type: 'text',
          html: `Без скобок SQL сначала обрабатывает <span class="inline-code">AND</span>, и только потом <span class="inline-code">OR</span> — как умножение и сложение в математике. Это может привести к неожиданному результату:`,
          code: `-- Означает: (priority='high') OR (priority='medium' AND status='open')\nSELECT * FROM tickets\nWHERE priority = 'high' OR priority = 'medium' AND status = 'open'`,
        },
        {
          type: 'text',
          html: `Если вы хотели «(high ИЛИ medium) И открыт», нужны явные скобки:`,
          code: `SELECT * FROM tickets\nWHERE (priority = 'high' OR priority = 'medium') AND status = 'open'`,
        },
        {
          type: 'text',
          html: `Совет: если в запросе есть и AND, и OR — всегда используйте скобки, даже если технически они не обязательны. Это спасает от ошибок и делает запрос понятнее.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Что выполнится первым, если в WHERE нет скобок: AND или OR?',
          options: ['OR', 'AND', 'Слева направо, без приоритета', 'Зависит от базы данных'],
          correctIndex: 1,
          explanation: 'AND имеет более высокий приоритет и вычисляется первым, как умножение перед сложением.',
        },
        {
          type: 'single',
          question: "В таблице tickets (1:high/open, 2:low/open, 3:high/closed, 4:medium/open), что вернёт WHERE priority = 'high' OR priority = 'medium' AND status = 'open' (без скобок)?",
          options: [
            'Только строку 1',
            'Строки 1 и 4',
            'Строки 1, 3 и 4',
            'Ничего',
          ],
          correctIndex: 2,
          explanation: "AND выполняется первым: (priority='medium' AND status='open') даёт строку 4. Затем OR добавляет вообще все строки с priority='high' — это строки 1 и 3, независимо от их статуса. Итог: 1, 3, 4.",
        },
        {
          type: 'truefalse',
          question: 'Скобки в WHERE могут изменить результат запроса, даже если условия те же самые.',
          correct: true,
          explanation: 'Скобки меняют порядок вычисления AND/OR, что может дать другой набор строк для одних и тех же условий.',
        },
      ],
      task: {
        title: 'Сложный режим: тикеты',
        description: 'В таблице **tickets** выберите тикеты, у которых (priority равен \'high\' ИЛИ priority равен \'medium\') И status равен \'open\'. Обязательно используйте скобки, чтобы сгруппировать OR внутри AND.',
        availableTables: [{ name: 'tickets', columns: ['id', 'priority', 'status'] }],
        datasets: {
          tickets: [
            { id: 1, priority: 'high', status: 'open' },
            { id: 2, priority: 'low', status: 'open' },
            { id: 3, priority: 'high', status: 'closed' },
            { id: 4, priority: 'medium', status: 'open' },
            { id: 5, priority: 'medium', status: 'closed' },
          ],
        },
        starter: '',
        solutionQuery: "SELECT * FROM tickets WHERE (priority = 'high' OR priority = 'medium') AND status = 'open'",
        hint: 'Скобки вокруг OR обязательны: (условие OR условие) AND условие.',
      },
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
          ['Denar', 13, 'male'],
          ['Marek', 17, 'male'],
          ['Ilana', 24, 'female'],
          ['Tomek', 23, 'male'],
          ['Petra', 18, 'female'],
        ],
      },
      {
        type: 'text',
        html: `Запрос:`,
        code: `SELECT * FROM people\nWHERE NOT gender = 'male'`,
      },
      {
        type: 'text',
        html: `Вернёт всех, кто НЕ male — то есть Ilana и Petra.`,
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — как NOT работает вместе с AND/OR, и распространённая ловушка с двойным отрицанием.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">tasks</span>:',
          columns: ['id', 'done', 'priority'],
          rows: [
            [1, 1, 'high'],
            [2, 0, 'high'],
            [3, 0, 'low'],
            [4, 1, 'low'],
          ],
        },
        {
          type: 'text',
          html: `<span class="inline-code">NOT</span> можно применить не только к простому условию, но и к целой группе в скобках: <span class="inline-code">NOT (done = 1 AND priority = 'low')</span> означает «НЕ (выполнено И низкий приоритет)» — то есть найдутся все строки, кроме тех, что одновременно выполнены и низкоприоритетны.`,
          code: `SELECT * FROM tasks\nWHERE NOT (done = 1 AND priority = 'low')`,
        },
        {
          type: 'text',
          html: `Осторожно с двойным отрицанием: <span class="inline-code">WHERE NOT done != 1</span> читается как «НЕ (done не равно 1)», что на самом деле означает «done равно 1» — то же самое, что просто <span class="inline-code">WHERE done = 1</span>, но гораздо запутаннее. Такого лучше избегать.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: "В таблице tasks (1: done=1/high, 2: done=0/high, 3: done=0/low, 4: done=1/low), что вернёт WHERE NOT (done = 1 AND priority = 'low')?",
          options: ['Только строку 4', 'Строки 1, 2, 3', 'Все 4 строки', 'Ничего'],
          correctIndex: 1,
          explanation: 'Строка 4 — единственная, где done=1 И priority=low одновременно, поэтому NOT исключает именно её. Остаются 1, 2, 3.',
        },
        {
          type: 'truefalse',
          question: "WHERE NOT done != 1 означает то же самое, что WHERE done = 1.",
          correct: true,
          explanation: 'Двойное отрицание «не (не равно)» логически равносильно простому «равно» — но так писать не стоит, это сбивает с толку.',
        },
        {
          type: 'single',
          question: 'Что делает NOT, если поставить его перед условием в скобках, например NOT (A AND B)?',
          options: [
            'Инвертирует только A',
            'Инвертирует весь результат вычисления (A AND B) целиком',
            'Вызывает синтаксическую ошибку',
            'Инвертирует только B',
          ],
          correctIndex: 1,
          explanation: 'NOT перед скобками инвертирует результат всего выражения внутри них, а не отдельной его части.',
        },
      ],
      task: {
        title: 'Сложный режим: задачи',
        description: 'В таблице **tasks** выберите все задачи, КРОМЕ тех, что одновременно done равен 1 И priority равен \'low\'. Используйте NOT с условием в скобках.',
        availableTables: [{ name: 'tasks', columns: ['id', 'done', 'priority'] }],
        datasets: {
          tasks: [
            { id: 1, done: 1, priority: 'high' },
            { id: 2, done: 0, priority: 'high' },
            { id: 3, done: 0, priority: 'low' },
            { id: 4, done: 1, priority: 'low' },
            { id: 5, done: 1, priority: 'medium' },
          ],
        },
        starter: '',
        solutionQuery: "SELECT * FROM tasks WHERE NOT (done = 1 AND priority = 'low')",
        hint: "WHERE NOT (условие1 AND условие2).",
      },
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
      description: 'В таблице **products** выберите товары, у которых category НЕ равен \'archived\', И при этом (price больше 100 ИЛИ in_stock равен 0). Используйте WHERE, NOT, AND и OR в одном запросе.',
      availableTables: [{ name: 'products', columns: ['name', 'price', 'in_stock', 'category'] }],
      datasets: {
        products: [
          { name: 'Клавиатура', price: 45, in_stock: 1, category: 'active' },
          { name: 'Монитор', price: 210, in_stock: 1, category: 'active' },
          { name: 'Мышь', price: 18, in_stock: 0, category: 'active' },
          { name: 'Наушники', price: 120, in_stock: 0, category: 'archived' },
          { name: 'Кресло', price: 340, in_stock: 1, category: 'active' },
          { name: 'Коврик', price: 15, in_stock: 1, category: 'archived' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM products WHERE NOT category = 'archived' AND (price > 100 OR in_stock = 0)",
      requiredKeywords: ['WHERE', 'NOT', 'AND', 'OR'],
      hint: "WHERE NOT условие1 AND (условие2 OR условие3) — скобки помогают группировать OR внутри AND.",
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — почему NULL не равен даже самому себе, и как это ломает наивные ожидания.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">profiles</span>:',
          columns: ['id', 'phone'],
          rows: [
            [1, '+375291112233'],
            [2, null],
            [3, null],
          ],
        },
        {
          type: 'text',
          html: `Каверзный момент: <span class="inline-code">NULL = NULL</span> в SQL возвращает NULL (не true, не false — "неизвестно"), а не то, что вы могли бы ожидать. Поэтому <span class="inline-code">WHERE phone = NULL</span> НИКОГДА не найдёт строки с пустым phone, даже если они есть — нужен именно <span class="inline-code">IS NULL</span>.`,
          code: `-- Никогда не сработает, даже если пустых значений много:\nSELECT * FROM profiles WHERE phone = NULL\n\n-- Правильно:\nSELECT * FROM profiles WHERE phone IS NULL`,
        },
        {
          type: 'text',
          html: `Та же логика для <span class="inline-code">!=</span>: <span class="inline-code">WHERE phone != NULL</span> тоже не сработает. Единственный способ проверить отсутствие/наличие значения — <span class="inline-code">IS NULL</span> и <span class="inline-code">IS NOT NULL</span>.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Что вернёт WHERE phone = NULL для таблицы, где реально есть строки с пустым phone?',
          options: ['Все строки с пустым phone', 'Ни одной строки — так проверка не работает', 'Ошибку выполнения', 'Все строки таблицы'],
          correctIndex: 1,
          explanation: 'Сравнение через = с NULL всегда даёт "неизвестно", а не true, поэтому такие строки никогда не пройдут условие.',
        },
        {
          type: 'truefalse',
          question: 'WHERE phone != NULL — рабочий способ найти строки, где phone заполнен.',
          correct: false,
          explanation: 'Как и =, оператор != не работает с NULL. Нужно IS NOT NULL.',
        },
      ],
      task: {
        title: 'Сложный режим: профили',
        description: 'В таблице **profiles** посчитайте (используя LIMIT после сортировки не нужен) — выберите id тех, у кого phone НЕ заполнен, используя IS NULL.',
        availableTables: [{ name: 'profiles', columns: ['id', 'phone'] }],
        datasets: {
          profiles: [
            { id: 1, phone: '+375291112233' },
            { id: 2, phone: null },
            { id: 3, phone: null },
            { id: 4, phone: '+375447778899' },
            { id: 5, phone: null },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT id FROM profiles WHERE phone IS NULL',
        hint: 'WHERE phone IS NULL — единственный правильный способ проверить пустоту.',
      },
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — сортировка по вычисляемому столбцу и по столбцу, которого нет в SELECT.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">products</span>:',
          columns: ['name', 'price', 'discount'],
          rows: [
            ['Стол', 100, 20],
            ['Стул', 40, 5],
            ['Полка', 60, 30],
          ],
        },
        {
          type: 'text',
          html: `ORDER BY может сортировать по вычислению, которого нет как готового столбца в таблице — например, по итоговой цене после скидки:`,
          code: `SELECT name, price - discount AS final_price\nFROM products\nORDER BY price - discount`,
        },
        {
          type: 'text',
          html: `Ещё нюанс: можно сортировать по столбцу, который вообще не выбран в SELECT. Например, отсортировать по discount, но не показывать его в результате:`,
          code: `SELECT name, price FROM products\nORDER BY discount DESC`,
        },
      ],
      quiz: [
        {
          type: 'truefalse',
          question: 'ORDER BY может использовать столбец, которого нет в списке SELECT.',
          correct: true,
          explanation: 'Да, сортировать можно по любому доступному столбцу таблицы, даже если он не попадает в результат.',
        },
        {
          type: 'single',
          question: 'Товары (Стол 100-20=80, Стул 40-5=35, Полка 60-30=30), отсортированные по (price - discount) по возрастанию — какой будет первым?',
          options: ['Стол', 'Стул', 'Полка', 'Порядок не определён'],
          correctIndex: 2,
          explanation: 'Итоговые цены: Стол=80, Стул=35, Полка=30. По возрастанию первой идёт Полка (30).',
        },
      ],
      task: {
        title: 'Сложный режим: цены со скидкой',
        description: 'В таблице **products** выберите name и вычисляемый столбец final_price (price минус discount), отсортировав по final_price по возрастанию.',
        availableTables: [{ name: 'products', columns: ['name', 'price', 'discount'] }],
        datasets: {
          products: [
            { name: 'Стол', price: 100, discount: 20 },
            { name: 'Стул', price: 40, discount: 5 },
            { name: 'Полка', price: 60, discount: 30 },
            { name: 'Лампа', price: 25, discount: 0 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT name, price - discount AS final_price FROM products ORDER BY final_price',
        hint: 'ORDER BY может ссылаться на выражение price - discount напрямую.',
      },
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — сортировка сразу по трём столбцам и как менять направление у каждого отдельно.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">students</span>:',
          columns: ['name', 'grade', 'class', 'age'],
          rows: [
            ['Anna', 90, 'A', 16],
            ['Boris', 90, 'B', 15],
            ['Chen', 90, 'A', 15],
            ['Dara', 85, 'A', 17],
          ],
        },
        {
          type: 'text',
          html: `У каждого столбца в ORDER BY может быть своё направление: <span class="inline-code">ORDER BY grade DESC, class ASC, age DESC</span> — сначала сортирует по grade по убыванию, при равенстве — по class по возрастанию, а если и class совпадает — по age по убыванию.`,
          code: `SELECT * FROM students\nORDER BY grade DESC, class ASC, age DESC`,
        },
        {
          type: 'text',
          html: `Для нашей таблицы: Anna, Boris, Chen все с grade=90 (первыми). Внутри них — по class по возрастанию: A(Anna,Chen), затем B(Boris). Внутри class=A, у Anna и Chen — по age по убыванию: Anna(16) раньше Chen(15).`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Для ORDER BY grade DESC, class ASC, age DESC — что определяет итоговый порядок первым делом?',
          options: ['age', 'class', 'grade', 'Все три одновременно, поровну'],
          correctIndex: 2,
          explanation: 'Первый столбец в ORDER BY имеет наивысший приоритет — остальные применяются только при равенстве предыдущих.',
        },
        {
          type: 'truefalse',
          question: 'В ORDER BY a DESC, b ASC направление b (ASC) применяется независимо от направления a.',
          correct: true,
          explanation: 'Каждый столбец в ORDER BY имеет собственное направление сортировки, они не связаны друг с другом.',
        },
      ],
      task: {
        title: 'Сложный режим: студенты',
        description: 'В таблице **students** отсортируйте по grade по убыванию, при равенстве — по class по возрастанию, при дальнейшем равенстве — по age по убыванию.',
        availableTables: [{ name: 'students', columns: ['name', 'grade', 'class', 'age'] }],
        datasets: {
          students: [
            { name: 'Anna', grade: 90, class: 'A', age: 16 },
            { name: 'Boris', grade: 90, class: 'B', age: 15 },
            { name: 'Chen', grade: 90, class: 'A', age: 15 },
            { name: 'Dara', grade: 85, class: 'A', age: 17 },
            { name: 'Eli', grade: 90, class: 'A', age: 18 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT * FROM students ORDER BY grade DESC, class ASC, age DESC',
        hint: 'ORDER BY grade DESC, class ASC, age DESC — три столбца, три направления.',
      },
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — LIMIT с OFFSET для постраничного вывода (пагинации).`,
        },
        {
          type: 'text',
          html: `Если у LIMIT есть "младший брат" — <span class="inline-code">OFFSET</span> — он пропускает указанное количество строк перед тем, как начать отдавать результат. Это основа постраничной навигации (страница 1, страница 2...).`,
          code: `SELECT * FROM products\nORDER BY id\nLIMIT 5 OFFSET 10\n-- пропустить первые 10, взять следующие 5\n-- (то есть строки с 11-й по 15-ю)`,
        },
        {
          type: 'text',
          html: `Формула для "страницы N" при размере страницы 5: <span class="inline-code">OFFSET = (N - 1) * 5</span>. Например, страница 3 — это <span class="inline-code">LIMIT 5 OFFSET 10</span>.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Что делает OFFSET 10 в паре с LIMIT 5?',
          options: [
            'Возвращает первые 10 строк',
            'Пропускает первые 10 строк, затем возвращает следующие 5',
            'Возвращает 10 случайных строк',
            'Умножает LIMIT на 10',
          ],
          correctIndex: 1,
          explanation: 'OFFSET указывает, сколько строк пропустить перед тем, как LIMIT начнёт отсчитывать нужное количество.',
        },
        {
          type: 'single',
          question: 'При размере страницы 10, какой OFFSET нужен для 4-й страницы?',
          options: ['10', '20', '30', '40'],
          correctIndex: 2,
          explanation: 'OFFSET = (4-1) * 10 = 30 — пропускаем первые 3 страницы по 10 строк.',
        },
      ],
      task: {
        title: 'Сложный режим: пагинация',
        description: 'В таблице **products** отсортируйте по id по возрастанию, пропустите первые 3 строки и выберите следующие 3 (используйте LIMIT и OFFSET).',
        availableTables: [{ name: 'products', columns: ['id', 'name'] }],
        datasets: {
          products: [
            { id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' },
            { id: 4, name: 'D' }, { id: 5, name: 'E' }, { id: 6, name: 'F' },
            { id: 7, name: 'G' }, { id: 8, name: 'H' },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT * FROM products ORDER BY id LIMIT 3 OFFSET 3',
        hint: 'ORDER BY id LIMIT 3 OFFSET 3 — пропустить первые 3, взять следующие 3.',
      },
    },
  },
  {
    id: 's1c14',
    section: 1,
    chapter: 14,
    module: 'NULL и сортировка',
    title: 'Трофей главы',
    kind: 'checkpoint',
    theory: [
      {
        type: 'text',
        html: `Отлично! Вы прошли главу «NULL и сортировка»: проверка пропущенных значений через <span class="inline-code">IS NULL</span>/<span class="inline-code">IS NOT NULL</span>, сортировка через <span class="inline-code">ORDER BY</span> (в том числе по нескольким столбцам) и ограничение через <span class="inline-code">LIMIT</span>.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какой оператор проверяет, что значение отсутствует?',
        options: ['= NULL', 'IS NULL', '== NULL', 'NOT VALUE'],
        correctIndex: 1,
        explanation: 'Отсутствие значения проверяется только через IS NULL (или IS NOT NULL), не через оператор равенства.',
      },
      {
        type: 'single',
        question: 'В каком порядке SQL применяет ORDER BY и LIMIT?',
        options: ['Сначала LIMIT, потом ORDER BY', 'Сначала ORDER BY, потом LIMIT', 'Одновременно', 'Порядок не важен'],
        correctIndex: 1,
        explanation: 'Сначала строки сортируются через ORDER BY, и только потом LIMIT оставляет нужное количество первых строк.',
      },
    ],
    task: {
      title: 'Итоговая задача главы',
      description: 'В таблице **events** выберите name тех событий, где attendees указано (IS NOT NULL), отсортировав по attendees по убыванию, и оставьте топ-3. Используйте IS NOT NULL, ORDER BY и LIMIT.',
      availableTables: [{ name: 'events', columns: ['name', 'attendees'] }],
      datasets: {
        events: [
          { name: 'Concert', attendees: 500 },
          { name: 'Workshop', attendees: null },
          { name: 'Meetup', attendees: 80 },
          { name: 'Webinar', attendees: null },
          { name: 'Festival', attendees: 1200 },
          { name: 'Seminar', attendees: 45 },
          { name: 'Expo', attendees: 300 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT name FROM events WHERE attendees IS NOT NULL ORDER BY attendees DESC LIMIT 3',
      requiredKeywords: ['IS NOT NULL', 'ORDER BY', 'LIMIT'],
      hint: 'WHERE attendees IS NOT NULL ORDER BY attendees DESC LIMIT 3.',
    },
  },

  // --- Глава 4: больше ключевых слов ---
  {
    id: 's1c15',
    section: 1,
    chapter: 15,
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
      description: 'В таблице **countries** верните все записи из следующих стран: Laos, Fiji, Malta, Ghana, Peru.',
      availableTables: [{ name: 'countries', columns: ['location_x', 'location_y', 'country'] }],
      datasets: {
        countries: [
          { location_x: 12, location_y: 5, country: 'Laos' },
          { location_x: 8, location_y: 19, country: 'France' },
          { location_x: 33, location_y: 2, country: 'Fiji' },
          { location_x: 41, location_y: 7, country: 'Malta' },
          { location_x: 3, location_y: 28, country: 'Ghana' },
          { location_x: 17, location_y: 11, country: 'Germany' },
          { location_x: 29, location_y: 14, country: 'Peru' },
          { location_x: 22, location_y: 9, country: 'Japan' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM countries WHERE country IN ('Laos', 'Fiji', 'Malta', 'Ghana', 'Peru')",
      hint: 'WHERE column IN (значение1, значение2, ...).',
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — NOT IN и его ловушка с NULL.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">blacklist</span> — забаненные пользователи:',
          columns: ['user_id'],
          rows: [[5], [8], [null]],
        },
        {
          type: 'text',
          html: `<span class="inline-code">NOT IN</span> исключает перечисленные значения — но если в списке (или подзапросе) окажется хотя бы одно <span class="inline-code">NULL</span>, весь <span class="inline-code">NOT IN</span> перестаёт работать и не вернёт вообще ничего! Это одна из самых коварных ловушек SQL.`,
          code: `-- Если в списке есть NULL — вернёт 0 строк, даже для очевидных совпадений:\nSELECT * FROM users\nWHERE id NOT IN (5, 8, NULL)`,
        },
        {
          type: 'text',
          html: `Безопаснее использовать <span class="inline-code">NOT IN</span> только когда точно уверены, что в списке нет NULL, либо явно отфильтровать их через <span class="inline-code">WHERE column IS NOT NULL</span> перед составлением списка.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Что вернёт WHERE id NOT IN (5, 8, NULL) для любой таблицы users?',
          options: [
            'Все строки, кроме id=5 и id=8',
            'Ноль строк — NULL в списке ломает NOT IN',
            'Только строки с id=5 и id=8',
            'Ошибку выполнения запроса',
          ],
          correctIndex: 1,
          explanation: 'Присутствие NULL в списке NOT IN превращает результат сравнения в "неизвестно" для каждой строки, поэтому ни одна строка не проходит.',
        },
        {
          type: 'truefalse',
          question: 'IN (в отличие от NOT IN) корректно работает, даже если в списке есть NULL — просто игнорирует его.',
          correct: true,
          explanation: 'Проблема специфична именно для NOT IN. Обычный IN с NULL в списке работает нормально для остальных значений.',
        },
      ],
      task: {
        title: 'Сложный режим: активные страны',
        description: 'В таблице **countries** выберите страны, которых НЕТ в списке (\'Laos\', \'Fiji\', \'Malta\') — используйте NOT IN.',
        availableTables: [{ name: 'countries', columns: ['country'] }],
        datasets: {
          countries: [
            { country: 'Laos' },
            { country: 'Fiji' },
            { country: 'Malta' },
            { country: 'Ghana' },
            { country: 'Peru' },
            { country: 'Japan' },
          ],
        },
        starter: '',
        solutionQuery: "SELECT * FROM countries WHERE country NOT IN ('Laos', 'Fiji', 'Malta')",
        hint: "WHERE country NOT IN ('a', 'b', 'c') — исключает перечисленные значения.",
      },
    },
  },
  {
    id: 's1c16',
    section: 1,
    chapter: 16,
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — BETWEEN с датами и NOT BETWEEN.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">orders</span> с датами:',
          columns: ['id', 'order_date'],
          rows: [
            [1, '2026-01-05'], [2, '2026-02-14'], [3, '2026-03-01'], [4, '2026-01-20'],
          ],
        },
        {
          type: 'text',
          html: `BETWEEN работает не только с числами, но и с датами (и даже с текстом — по алфавиту). Даты в SQL обычно сравниваются как строки в формате ГГГГ-ММ-ДД, поэтому такое сравнение работает корректно:`,
          code: `SELECT * FROM orders\nWHERE order_date BETWEEN '2026-01-01' AND '2026-01-31'`,
        },
        {
          type: 'text',
          html: `Как и у NOT IN, у <span class="inline-code">NOT BETWEEN</span> есть обратный смысл: находит значения ВНЕ диапазона (меньше нижней границы ИЛИ больше верхней).`,
          code: `SELECT * FROM data\nWHERE value NOT BETWEEN 7 AND 13\n-- то же самое, что value < 7 OR value > 13`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: "Заказы с order_date 2026-01-05, 2026-02-14, 2026-03-01, 2026-01-20 — сколько попадёт в WHERE order_date BETWEEN '2026-01-01' AND '2026-01-31'?",
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation: 'В январь попадают 2026-01-05 и 2026-01-20 — две даты.',
        },
        {
          type: 'truefalse',
          question: 'WHERE value NOT BETWEEN 7 AND 13 равносильно WHERE value < 7 OR value > 13.',
          correct: true,
          explanation: 'NOT BETWEEN находит значения строго вне диапазона — то есть меньше нижней границы или больше верхней.',
        },
      ],
      task: {
        title: 'Сложный режим: заказы за период',
        description: 'В таблице **orders** выберите заказы, у которых order_date НЕ входит в диапазон между \'2026-01-01\' и \'2026-01-31\' включительно (используйте NOT BETWEEN).',
        availableTables: [{ name: 'orders', columns: ['id', 'order_date'] }],
        datasets: {
          orders: [
            { id: 1, order_date: '2026-01-05' },
            { id: 2, order_date: '2026-02-14' },
            { id: 3, order_date: '2026-03-01' },
            { id: 4, order_date: '2026-01-20' },
            { id: 5, order_date: '2026-01-31' },
          ],
        },
        starter: '',
        solutionQuery: "SELECT * FROM orders WHERE order_date NOT BETWEEN '2026-01-01' AND '2026-01-31'",
        hint: 'NOT BETWEEN находит значения вне диапазона.',
      },
    },
  },
  {
    id: 's1c17',
    section: 1,
    chapter: 17,
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
          { id: 14, name: 'Kelan' },
          { id: 15, name: 'Kiona' },
          { id: 16, name: 'Marta' },
          { id: 17, name: 'Keena' },
          { id: 18, name: 'Kobe' },
          { id: 19, name: 'Lior' },
          { id: 20, name: 'Kendra' },
          { id: 21, name: 'Kylo' },
          { id: 22, name: 'Denis' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM people WHERE name LIKE 'K%' ORDER BY name DESC",
      hint: "WHERE name LIKE 'K%' ORDER BY name DESC.",
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — комбинирование % и _ в одном шаблоне, и как искать сам символ %.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">emails</span>:',
          columns: ['address'],
          rows: [
            ['anna@gmail.com'], ['bob@yahoo.com'], ['carl@gmail.co.uk'], ['diana@outlook.com'],
          ],
        },
        {
          type: 'text',
          html: `Шаблоны можно комбинировать: <span class="inline-code">LIKE '_a%'</span> означает «любой символ, затем "a", затем что угодно» — найдёт имена, где вторая буква "a" (Carl не подойдёт, а вот "Dana" подошёл бы).`,
        },
        {
          type: 'text',
          html: `Каверзный случай: если нужно найти сам символ <span class="inline-code">%</span> или <span class="inline-code">_</span> как обычный текст (например, в email нет % как правило, но в описаниях товаров может быть "Скидка 50%"), используют экранирование через <span class="inline-code">ESCAPE</span>: <span class="inline-code">LIKE '%50\\%%' ESCAPE '\\'</span>. Это редкая, но важная деталь.`,
        },
        {
          type: 'text',
          html: `Ещё пример комбинации: <span class="inline-code">LIKE '%gmail.%'</span> найдёт и gmail.com, и gmail.co.uk — потому что % после точки допускает любое продолжение домена.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: "Email'ы: anna@gmail.com, bob@yahoo.com, carl@gmail.co.uk, diana@outlook.com. Сколько совпадёт с LIKE '%gmail.%'?",
          options: ['1', '2', '3', '0'],
          correctIndex: 1,
          explanation: 'anna@gmail.com и carl@gmail.co.uk — оба содержат "gmail." с любым продолжением после точки.',
        },
        {
          type: 'truefalse',
          question: "Шаблон '_a%' означает: ровно один любой символ, затем буква a, затем что угодно (в том числе ничего).",
          correct: true,
          explanation: '_ — ровно один символ, затем буква "a" как есть, затем % — любое количество любых символов (включая ноль).',
        },
      ],
      task: {
        title: 'Сложный режим: домены почты',
        description: 'В таблице **emails** выберите адреса, которые содержат "gmail." в любом месте строки (используйте % с обеих сторон).',
        availableTables: [{ name: 'emails', columns: ['address'] }],
        datasets: {
          emails: [
            { address: 'anna@gmail.com' },
            { address: 'bob@yahoo.com' },
            { address: 'carl@gmail.co.uk' },
            { address: 'diana@outlook.com' },
            { address: 'greg@mygmail.net' },
          ],
        },
        starter: '',
        solutionQuery: "SELECT * FROM emails WHERE address LIKE '%gmail.%'",
        hint: "LIKE '%gmail.%' — % с обеих сторон означает «что угодно до и что угодно после».",
      },
    },
  },
  {
    id: 's1c18',
    section: 1,
    chapter: 18,
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
      description: 'В таблице **orders** выберите заказы, у которых статус в списке (\'new\', \'processing\'), сумма total между 50 и 200 включительно, И имя customer начинается на "A". Используйте IN, BETWEEN и LIKE в одном запросе.',
      availableTables: [{ name: 'orders', columns: ['id', 'customer', 'status', 'total'] }],
      datasets: {
        orders: [
          { id: 1, customer: 'Anna', status: 'new', total: 80 },
          { id: 2, customer: 'Boris', status: 'shipped', total: 120 },
          { id: 3, customer: 'Alex', status: 'processing', total: 200 },
          { id: 4, customer: 'Anwar', status: 'new', total: 30 },
          { id: 5, customer: 'Chen', status: 'processing', total: 500 },
          { id: 6, customer: 'Dara', status: 'cancelled', total: 90 },
          { id: 7, customer: 'Ali', status: 'new', total: 150 },
        ],
      },
      starter: '',
      solutionQuery: "SELECT * FROM orders WHERE status IN ('new', 'processing') AND total BETWEEN 50 AND 200 AND customer LIKE 'A%'",
      requiredKeywords: ['IN', 'BETWEEN', 'LIKE'],
      hint: 'Совместите IN, BETWEEN и LIKE через AND в одном запросе.',
    },
  },

  // --- Глава 5: Арифметические операции ---
  {
    id: 's1c19',
    section: 1,
    chapter: 19,
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — псевдонимы с пробелами и почему AS иногда можно пропустить (но лучше не стоит).`,
        },
        {
          type: 'text',
          html: `Если хотите, чтобы псевдоним содержал пробел — например "Final Price" вместо final_price — заключите его в кавычки: <span class="inline-code">AS "Final Price"</span>. Без кавычек SQL решит, что после AS идёт одно слово, и выдаст ошибку на пробеле.`,
          code: `SELECT price - discount AS "Final Price"\nFROM orders`,
        },
        {
          type: 'text',
          html: `Технически слово <span class="inline-code">AS</span> необязательно — <span class="inline-code">SELECT price cost FROM products</span> тоже сработает и даст тот же результат, что <span class="inline-code">SELECT price AS cost</span>. Но это как раз тот случай из первого сложного режима — без явного AS легко перепутать псевдоним со вторым столбцом, если забыть запятую. Поэтому AS всегда стоит писать явно.`,
        },
        {
          type: 'text',
          html: `Псевдонимы можно давать и самим таблицам — это пригодится позже при работе с несколькими таблицами одновременно: <span class="inline-code">FROM products AS p</span>.`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Как правильно назвать вычисляемый столбец псевдонимом с пробелом, например "Final Price"?',
          options: [
            'AS Final Price (без кавычек)',
            'AS "Final Price" (в кавычках)',
            'AS Final_Price (всегда с подчёркиванием)',
            'Пробелы в псевдонимах вообще недопустимы',
          ],
          correctIndex: 1,
          explanation: 'Псевдонимы с пробелами нужно заключать в кавычки, иначе SQL не поймёт, где заканчивается имя.',
        },
        {
          type: 'truefalse',
          question: 'Слово AS обязательно технически, без него запрос вызовет ошибку.',
          correct: false,
          explanation: 'AS необязательно (SELECT price cost тоже сработает), но его явное указание делает запрос понятнее и безопаснее.',
        },
      ],
      task: {
        title: 'Сложный режим: псевдоним с пробелом',
        description: 'В таблице **orders** выберите вычисляемый столбец price минус discount, назвав его псевдонимом "Final Price" (с пробелом, в кавычках).',
        availableTables: [{ name: 'orders', columns: ['id', 'price', 'discount'] }],
        datasets: {
          orders: [
            { id: 1, price: 100, discount: 15 },
            { id: 2, price: 250, discount: 50 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT price - discount AS "Final Price" FROM orders',
        hint: 'AS "Final Price" — псевдоним с пробелом обязательно в кавычках.',
      },
    },
  },
  {
    id: 's1c20',
    section: 1,
    chapter: 20,
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
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — порядок операций в арифметике и деление с округлением.`,
        },
        {
          type: 'text',
          html: `В SQL действуют обычные математические правила порядка операций: умножение и деление выполняются раньше сложения и вычитания. Как и в математике, скобки меняют порядок:`,
          code: `SELECT price + tax * price AS wrong_total,\n       (price + tax) * price AS also_different,\n       price * (1 + tax) AS correct_total\nFROM products`,
        },
        {
          type: 'text',
          html: `Ловушка с делением: если price и quantity — целые числа (INTEGER), то <span class="inline-code">price / quantity</span> может округлиться вниз! Например, <span class="inline-code">7 / 2</span> в целочисленной арифметике даст 3, а не 3.5. Чтобы получить точный результат, хотя бы одно число нужно сделать дробным, например умножив на 1.0.`,
          code: `SELECT 7 / 2 AS rounded        -- может быть 3\nSELECT 7 * 1.0 / 2 AS precise  -- будет 3.5`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Что вычислит price + tax * price, если price=100 и tax=0.2?',
          options: ['24 (сложение сначала)', '120 (умножение сначала: 100 + 0.2*100)', 'Ошибку', '100.2'],
          correctIndex: 1,
          explanation: 'Умножение выполняется раньше сложения: 0.2*100=20, затем 100+20=120.',
        },
        {
          type: 'truefalse',
          question: 'В целочисленной арифметике 7 / 2 может дать 3 вместо 3.5.',
          correct: true,
          explanation: 'Если оба числа целые, результат деления может округлиться вниз до целого — нужно явно привести к дробному типу.',
        },
      ],
      task: {
        title: 'Сложный режим: итог со скидкой и налогом',
        description: 'В таблице **cart** выберите name и вычисляемый столбец total, равный (price умножить на quantity), умноженному на (1 + tax) — используйте скобки для правильного порядка.',
        availableTables: [{ name: 'cart', columns: ['name', 'price', 'quantity', 'tax'] }],
        datasets: {
          cart: [
            { name: 'Клавиатура', price: 40, quantity: 2, tax: 0.1 },
            { name: 'Монитор', price: 200, quantity: 1, tax: 0.2 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT name, (price * quantity) * (1 + tax) AS total FROM cart',
        hint: 'Скобки вокруг price*quantity и вокруг (1+tax) обязательны для правильного порядка.',
      },
    },
  },
  {
    id: 's1c21',
    section: 1,
    chapter: 21,
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
      requiredKeywords: ['AS', 'ORDER BY'],
      hint: 'SELECT name, price - discount AS final_price FROM orders ORDER BY final_price.',
    },
  },

  // --- Финальный проект раздела: комбинирует все пройденные темы ---
  {
    id: 's1c22',
    section: 1,
    chapter: 22,
    module: 'Итоговый проект',
    title: 'Финальный проект',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `Вы прошли весь раздел «Основы SQL»! Финальный проект — одна большая задача на «реальных» данных интернет-магазина, где нужно скомбинировать всё пройденное: <span class="inline-code">WHERE</span>, <span class="inline-code">AND</span>/<span class="inline-code">OR</span>, <span class="inline-code">LIKE</span>, <span class="inline-code">ORDER BY</span>, <span class="inline-code">LIMIT</span> и арифметику в одном запросе.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'В каком порядке SQL обрабатывает условия запроса?',
        options: [
          'Сначала ORDER BY, потом WHERE',
          'Сначала WHERE (фильтрация), потом ORDER BY (сортировка), потом LIMIT',
          'Сначала LIMIT, потом WHERE',
          'Порядок не имеет значения',
        ],
        correctIndex: 1,
        explanation: 'Строки сначала фильтруются через WHERE, затем сортируются через ORDER BY, и только потом обрезаются через LIMIT.',
      },
      {
        type: 'truefalse',
        question: 'В одном запросе можно одновременно использовать LIKE, AND и вычисляемый столбец с AS.',
        correct: true,
        explanation: 'Да — WHERE, логические операторы, LIKE, вычисления и псевдонимы прекрасно комбинируются в одном запросе.',
      },
    ],
    task: {
      title: 'Финальный проект: интернет-магазин',
      description: 'В таблице **orders** найдите заказы, у которых **category** начинается на "Elec" И **status** равен \'completed\', выведите customer, вычисляемый столбец **total** (price умножить на quantity), отсортировав по total по убыванию, ограничив 5 строками.',
      availableTables: [{ name: 'orders', columns: ['customer', 'category', 'status', 'price', 'quantity'] }],
      datasets: {
        orders: [
          { customer: 'Ann', category: 'Electronics', status: 'completed', price: 120, quantity: 2 },
          { customer: 'Boris', category: 'Furniture', status: 'completed', price: 300, quantity: 1 },
          { customer: 'Chen', category: 'Electronics', status: 'cancelled', price: 450, quantity: 1 },
          { customer: 'Dara', category: 'Electronics', status: 'completed', price: 80, quantity: 5 },
          { customer: 'Eli', category: 'Electrical', status: 'completed', price: 60, quantity: 3 },
          { customer: 'Faye', category: 'Books', status: 'completed', price: 20, quantity: 4 },
          { customer: 'Gus', category: 'Electronics', status: 'completed', price: 200, quantity: 2 },
          { customer: 'Hana', category: 'Electronics', status: 'completed', price: 999, quantity: 1 },
        ],
      },
      starter: '',
      solutionQuery: "SELECT customer, price * quantity AS total FROM orders WHERE category LIKE 'Elec%' AND status = 'completed' ORDER BY total DESC LIMIT 5",
      requiredKeywords: ['WHERE', 'LIKE', 'AND', 'AS', 'ORDER BY', 'LIMIT'],
      hint: "Совместите WHERE category LIKE 'Elec%' AND status = 'completed', вычисляемый total и ORDER BY ... DESC LIMIT 5.",
    },
  },

  // =========================================================================
  // РАЗДЕЛ 2: Агрегатные функции
  // =========================================================================
  {
    id: 's2c1',
    section: 2,
    chapter: 1,
    module: 'Агрегатные функции',
    title: 'COUNT',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">COUNT</span> считает количество строк в результате. <span class="inline-code">COUNT(*)</span> считает все строки, <span class="inline-code">COUNT(column)</span> — только строки, где значение столбца не NULL.`,
        code: `SELECT COUNT(*) AS total\nFROM orders`,
      },
      {
        type: 'text',
        html: `Разница важна: если в столбце есть пропущенные значения, <span class="inline-code">COUNT(column)</span> и <span class="inline-code">COUNT(*)</span> дадут разные числа.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Чем COUNT(*) отличается от COUNT(column)?',
        options: [
          'Ничем, работают одинаково',
          'COUNT(*) считает все строки, COUNT(column) — только строки без NULL в этом столбце',
          'COUNT(column) быстрее в любом случае',
          'COUNT(*) считает только уникальные строки',
        ],
        correctIndex: 1,
        explanation: 'COUNT(column) пропускает строки, где значение этого столбца равно NULL.',
      },
      {
        type: 'truefalse',
        question: 'COUNT(*) можно использовать вместе с WHERE, чтобы посчитать только отфильтрованные строки.',
        correct: true,
        explanation: 'WHERE применяется до подсчёта, так что COUNT(*) посчитает только строки, прошедшие фильтр.',
      },
    ],
    task: {
      title: 'COUNT',
      description: 'В таблице **orders** посчитайте общее количество заказов со статусом \'completed\' (столбец total).',
      availableTables: [{ name: 'orders', columns: ['id', 'status'] }],
      datasets: {
        orders: [
          { id: 1, status: 'completed' },
          { id: 2, status: 'cancelled' },
          { id: 3, status: 'completed' },
          { id: 4, status: 'completed' },
          { id: 5, status: 'pending' },
        ],
      },
      starter: '',
      solutionQuery: "SELECT COUNT(*) AS total FROM orders WHERE status = 'completed'",
      hint: "SELECT COUNT(*) AS total FROM orders WHERE status = 'completed'.",
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — COUNT(DISTINCT column) и разница между COUNT(column) и COUNT(*) на практике.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">orders</span>:',
          columns: ['id', 'customer', 'coupon'],
          rows: [
            [1, 'Anna', 'SALE10'],
            [2, 'Boris', null],
            [3, 'Anna', 'SALE10'],
            [4, 'Chen', 'WELCOME'],
          ],
        },
        {
          type: 'text',
          html: `<span class="inline-code">COUNT(DISTINCT column)</span> считает количество РАЗНЫХ значений, а не строк. Например, посчитать сколько уникальных покупателей сделали заказы:`,
          code: `SELECT COUNT(DISTINCT customer) AS unique_customers\nFROM orders`,
        },
        {
          type: 'text',
          html: `Для нашей таблицы: <span class="inline-code">COUNT(*)</span> = 4 (все строки), <span class="inline-code">COUNT(coupon)</span> = 3 (Boris пропускается, у него NULL), <span class="inline-code">COUNT(DISTINCT customer)</span> = 3 (Anna, Boris, Chen — Anna считается один раз, хотя у неё 2 заказа).`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Для таблицы orders (Anna/SALE10, Boris/NULL, Anna/SALE10, Chen/WELCOME), что вернёт COUNT(DISTINCT customer)?',
          options: ['4', '3', '2', '1'],
          correctIndex: 1,
          explanation: 'Уникальных покупателей трое: Anna, Boris, Chen — несмотря на то, что у Anna два заказа.',
        },
        {
          type: 'truefalse',
          question: 'COUNT(DISTINCT coupon) для этой таблицы даст такое же число, как COUNT(coupon).',
          correct: false,
          explanation: 'COUNT(coupon) = 3 (без NULL от Boris), но уникальных купонов только 2: SALE10 и WELCOME (SALE10 встречается дважды).',
        },
      ],
      task: {
        title: 'Сложный режим: уникальные покупатели',
        description: 'В таблице **orders** посчитайте количество уникальных значений customer (столбец unique_customers).',
        availableTables: [{ name: 'orders', columns: ['id', 'customer'] }],
        datasets: {
          orders: [
            { id: 1, customer: 'Anna' },
            { id: 2, customer: 'Boris' },
            { id: 3, customer: 'Anna' },
            { id: 4, customer: 'Chen' },
            { id: 5, customer: 'Boris' },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT COUNT(DISTINCT customer) AS unique_customers FROM orders',
        hint: 'COUNT(DISTINCT column) считает количество разных значений.',
      },
    },
  },
  {
    id: 's2c2',
    section: 2,
    chapter: 2,
    module: 'Агрегатные функции',
    title: 'SUM и AVG',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">SUM</span> складывает все значения столбца, <span class="inline-code">AVG</span> вычисляет среднее. Оба игнорируют NULL-значения.`,
        code: `SELECT SUM(price) AS total_revenue, AVG(price) AS avg_price\nFROM products`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Что вычисляет AVG(price)?',
        options: ['Сумму всех цен', 'Среднее значение цены', 'Количество товаров', 'Максимальную цену'],
        correctIndex: 1,
        explanation: 'AVG вычисляет среднее арифметическое значений столбца.',
      },
      {
        type: 'findline',
        question: 'Найдите строку с синтаксической ошибкой.',
        lines: ['SELECT SUM price AS total', 'FROM orders'],
        errorLine: 0,
        explanation: 'Аргумент агрегатной функции нужно заключать в скобки: SUM(price).',
      },
    ],
    task: {
      title: 'SUM и AVG',
      description: 'В таблице **orders** посчитайте общую сумму (total_sum) и среднюю сумму заказа (avg_sum) по столбцу amount.',
      availableTables: [{ name: 'orders', columns: ['id', 'amount'] }],
      datasets: {
        orders: [
          { id: 1, amount: 100 },
          { id: 2, amount: 250 },
          { id: 3, amount: 150 },
          { id: 4, amount: 300 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT SUM(amount) AS total_sum, AVG(amount) AS avg_sum FROM orders',
      hint: 'SELECT SUM(amount) AS total_sum, AVG(amount) AS avg_sum FROM orders.',
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — SUM/AVG вместе с WHERE, и почему AVG может обмануть, если не знать про NULL.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">reviews</span> — оценки товара:',
          columns: ['product', 'rating'],
          rows: [
            ['Наушники', 5], ['Наушники', null], ['Наушники', 3], ['Наушники', 4],
          ],
        },
        {
          type: 'text',
          html: `Как и COUNT, функции <span class="inline-code">SUM</span> и <span class="inline-code">AVG</span> игнорируют строки с NULL — они просто не участвуют в вычислении. Для таблицы выше <span class="inline-code">AVG(rating)</span> посчитает (5+3+4)/3 = 4, а НЕ (5+0+3+4)/4 = 3, как могло бы показаться, если по ошибке считать NULL нулём.`,
          code: `SELECT AVG(rating) AS avg_rating FROM reviews\n-- результат: 4.0, а не 3.0 — NULL не считается за 0`,
        },
        {
          type: 'text',
          html: `SUM и AVG прекрасно комбинируются с WHERE — фильтрация происходит ДО агрегации: сначала SQL отбирает нужные строки, а уже затем считает по ним сумму или среднее.`,
          code: `SELECT AVG(rating) AS avg_high\nFROM reviews\nWHERE rating >= 4`,
        },
      ],
      quiz: [
        {
          type: 'single',
          question: 'Таблица reviews имеет оценки 5, NULL, 3, 4 для одного товара. Чему равен AVG(rating)?',
          options: ['3.0 (NULL считается как 0)', '4.0 (NULL игнорируется)', '3.5', 'Ошибка из-за NULL'],
          correctIndex: 1,
          explanation: 'AVG игнорирует NULL при вычислении: (5+3+4)/3 = 4.0, а не делится на 4 строки.',
        },
        {
          type: 'truefalse',
          question: 'WHERE в запросе с AVG применяется до вычисления среднего, то есть AVG считает только по отфильтрованным строкам.',
          correct: true,
          explanation: 'SQL сначала фильтрует строки через WHERE, и только затем агрегатная функция считает результат по оставшимся.',
        },
      ],
      task: {
        title: 'Сложный режим: средний рейтинг',
        description: 'В таблице **reviews** посчитайте средний rating (avg_rating) только для отзывов, где rating не пустой и больше или равен 3.',
        availableTables: [{ name: 'reviews', columns: ['product', 'rating'] }],
        datasets: {
          reviews: [
            { product: 'Наушники', rating: 5 },
            { product: 'Наушники', rating: null },
            { product: 'Наушники', rating: 3 },
            { product: 'Наушники', rating: 2 },
            { product: 'Наушники', rating: 4 },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT AVG(rating) AS avg_rating FROM reviews WHERE rating >= 3',
        hint: 'WHERE rating >= 3 уже исключает и NULL, и низкие оценки — AVG посчитает только оставшиеся.',
      },
    },
  },
  {
    id: 's2c3',
    section: 2,
    chapter: 3,
    module: 'Агрегатные функции',
    title: 'MIN и MAX',
    kind: 'lesson',
    theory: [
      {
        type: 'text',
        html: `<span class="inline-code">MIN</span> и <span class="inline-code">MAX</span> находят наименьшее и наибольшее значение столбца — работают с числами, датами и даже текстом (по алфавиту).`,
        code: `SELECT MIN(price) AS cheapest, MAX(price) AS priciest\nFROM products`,
      },
    ],
    quiz: [
      {
        type: 'truefalse',
        question: 'MIN и MAX можно применять не только к числам, но и к текстовым столбцам.',
        correct: true,
        explanation: 'Для текста MIN/MAX работают по алфавитному порядку.',
      },
      {
        type: 'single',
        question: 'Какая функция вернёт самую высокую цену товара?',
        options: ['MIN(price)', 'MAX(price)', 'AVG(price)', 'COUNT(price)'],
        correctIndex: 1,
        explanation: 'MAX возвращает наибольшее значение столбца.',
      },
    ],
    task: {
      title: 'MIN и MAX',
      description: 'В таблице **products** найдите минимальную (cheapest) и максимальную (priciest) цену.',
      availableTables: [{ name: 'products', columns: ['name', 'price'] }],
      datasets: {
        products: [
          { name: 'Клавиатура', price: 45 },
          { name: 'Монитор', price: 210 },
          { name: 'Мышь', price: 18 },
          { name: 'Кресло', price: 340 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products',
      hint: 'SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products.',
    },
    hard: {
      theory: [
        {
          type: 'text',
          html: `<b>Сложный режим 🔥</b> — MIN/MAX с текстом и датами, и разница между MIN(column) и просто сортировкой с LIMIT.`,
        },
        {
          type: 'table',
          caption: 'Таблица <span class="inline-code">events</span>:',
          columns: ['name', 'event_date'],
          rows: [
            ['Конференция', '2026-03-15'],
            ['Вебинар', '2026-01-10'],
            ['Митап', '2026-02-20'],
          ],
        },
        {
          type: 'text',
          html: `MIN и MAX для дат находят самую раннюю и самую позднюю: <span class="inline-code">MIN(event_date)</span> = '2026-01-10'. Но обратите внимание: MIN/MAX возвращают только САМО значение даты — если нужно узнать ещё и название события с этой датой, MIN/MAX для этого не годятся напрямую (это тема подзапросов, которая будет позже).`,
          code: `SELECT MIN(event_date) AS earliest FROM events\n-- вернёт только дату, без названия события`,
        },
        {
          type: 'text',
          html: `Чтобы получить всю строку с минимальным/максимальным значением, часто удобнее использовать <span class="inline-code">ORDER BY ... LIMIT 1</span> — это вернёт полную строку, а не только одно значение:`,
          code: `SELECT * FROM events\nORDER BY event_date\nLIMIT 1\n-- вернёт всю строку с самой ранней датой`,
        },
      ],
      quiz: [
        {
          type: 'truefalse',
          question: 'SELECT MIN(event_date) FROM events вернёт всю строку (включая название события) с самой ранней датой.',
          correct: false,
          explanation: 'MIN возвращает только само значение даты, а не всю строку. Для полной строки нужен ORDER BY ... LIMIT 1.',
        },
        {
          type: 'single',
          question: 'Как получить ПОЛНУЮ строку события с самой ранней датой?',
          options: [
            'SELECT MIN(*) FROM events',
            'SELECT * FROM events ORDER BY event_date LIMIT 1',
            'SELECT * FROM events WHERE event_date = MIN',
            'MIN(*) FROM events LIMIT 1',
          ],
          correctIndex: 1,
          explanation: 'ORDER BY по дате плюс LIMIT 1 возвращает первую строку целиком, в отличие от MIN, который даёт только значение.',
        },
      ],
      task: {
        title: 'Сложный режим: самое раннее событие целиком',
        description: 'В таблице **events** выберите ВСЮ строку (name и event_date) события с самой ранней датой — используйте ORDER BY и LIMIT, а не MIN.',
        availableTables: [{ name: 'events', columns: ['name', 'event_date'] }],
        datasets: {
          events: [
            { name: 'Конференция', event_date: '2026-03-15' },
            { name: 'Вебинар', event_date: '2026-01-10' },
            { name: 'Митап', event_date: '2026-02-20' },
            { name: 'Хакатон', event_date: '2026-01-05' },
          ],
        },
        starter: '',
        solutionQuery: 'SELECT * FROM events ORDER BY event_date LIMIT 1',
        hint: 'ORDER BY event_date (по возрастанию) LIMIT 1 — вернёт самое раннее событие целиком.',
      },
    },
  },
  {
    id: 's2c4',
    section: 2,
    chapter: 4,
    module: 'Агрегатные функции',
    title: 'Трофей главы',
    kind: 'checkpoint',
    theory: [
      {
        type: 'text',
        html: `Отлично! Вы прошли главу «Агрегатные функции»: <span class="inline-code">COUNT</span>, <span class="inline-code">SUM</span>, <span class="inline-code">AVG</span>, <span class="inline-code">MIN</span> и <span class="inline-code">MAX</span>. Эти функции часто используют вместе в одном отчётном запросе.`,
      },
    ],
    quiz: [
      {
        type: 'single',
        question: 'Какие из этих функций игнорируют NULL-значения при вычислении?',
        options: ['Только COUNT(*)', 'SUM, AVG, MIN, MAX и COUNT(column)', 'Ни одна', 'Только MAX'],
        correctIndex: 1,
        explanation: 'Все агрегатные функции, кроме COUNT(*), пропускают строки с NULL в соответствующем столбце.',
      },
    ],
    task: {
      title: 'Итоговая задача главы',
      description: 'В таблице **sales** одним запросом посчитайте: количество строк (total_count), сумму amount (total_sum), среднее amount (avg_amount), минимум (min_amount) и максимум (max_amount).',
      availableTables: [{ name: 'sales', columns: ['id', 'amount'] }],
      datasets: {
        sales: [
          { id: 1, amount: 40 },
          { id: 2, amount: 120 },
          { id: 3, amount: 75 },
          { id: 4, amount: 200 },
          { id: 5, amount: 15 },
        ],
      },
      starter: '',
      solutionQuery: 'SELECT COUNT(*) AS total_count, SUM(amount) AS total_sum, AVG(amount) AS avg_amount, MIN(amount) AS min_amount, MAX(amount) AS max_amount FROM sales',
      requiredKeywords: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
      hint: 'Перечислите все пять функций через запятую в одном SELECT.',
    },
  },
];

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id);
}
