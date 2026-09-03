// Practice task bank — independent of the Path, grouped by topic.
// Add new tasks by pushing objects into PRACTICE_TASKS, following this shape.
// difficulty: 'easy' | 'mid' | 'hard'

export const TOPICS = [
  { id: 'select', label: 'SELECT / FROM' },
  { id: 'distinct', label: 'DISTINCT' },
  { id: 'where', label: 'WHERE' },
  { id: 'and', label: 'AND' },
  { id: 'or', label: 'OR' },
  { id: 'not', label: 'NOT' },
  { id: 'null', label: 'NULL' },
  { id: 'order', label: 'ORDER BY' },
  { id: 'limit', label: 'LIMIT' },
  { id: 'in', label: 'IN' },
  { id: 'between', label: 'BETWEEN' },
  { id: 'like', label: 'LIKE' },
  { id: 'agg', label: 'Агрегатные функции' },
];

export const PRACTICE_TASKS = [
  {
    id: 'p-select-1',
    topic: 'select',
    difficulty: 'easy',
    title: 'Все столбцы',
    description: 'Выберите **все столбцы** из таблицы **products**.',
    availableTables: [{ name: 'products', columns: ['product_id', 'name', 'price'] }],
    datasets: {
      products: [
        { product_id: 1, name: 'Клавиатура', price: 45 },
        { product_id: 2, name: 'Монитор', price: 210 },
        { product_id: 3, name: 'Мышь', price: 18 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM products',
    hint: 'Звёздочка * означает «все столбцы».',
  },
  {
    id: 'p-select-2',
    topic: 'select',
    difficulty: 'easy',
    title: 'Два столбца',
    description: 'Выберите столбцы **name** и **price** из таблицы **products**.',
    availableTables: [{ name: 'products', columns: ['product_id', 'name', 'price'] }],
    datasets: {
      products: [
        { product_id: 1, name: 'Клавиатура', price: 45 },
        { product_id: 2, name: 'Монитор', price: 210 },
        { product_id: 3, name: 'Мышь', price: 18 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT name, price FROM products',
    hint: 'Перечислите нужные столбцы через запятую после SELECT.',
  },
  {
    id: 'p-where-1',
    topic: 'where',
    difficulty: 'easy',
    title: 'Фильтр по цене',
    description: 'Выберите товары (**все столбцы**) из **products**, у которых цена больше 50.',
    availableTables: [{ name: 'products', columns: ['product_id', 'name', 'price'] }],
    datasets: {
      products: [
        { product_id: 1, name: 'Клавиатура', price: 45 },
        { product_id: 2, name: 'Монитор', price: 210 },
        { product_id: 3, name: 'Мышь', price: 18 },
        { product_id: 4, name: 'Наушники', price: 89 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM products WHERE price > 50',
    hint: 'WHERE ставится после FROM и задаёт условие отбора строк.',
  },
  {
    id: 'p-where-2',
    topic: 'where',
    difficulty: 'mid',
    title: 'Точное совпадение',
    description: 'Выберите пользователей (**все столбцы**) из **users**, у которых seniority равен \'senior\'.',
    availableTables: [{ name: 'users', columns: ['user_id', 'seniority'] }],
    datasets: {
      users: [
        { user_id: 652, seniority: 'senior' },
        { user_id: 9731, seniority: 'junior' },
        { user_id: 1462, seniority: 'middle' },
        { user_id: 7823, seniority: 'senior' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM users WHERE seniority = 'senior'",
    hint: "Строковые значения в SQL пишутся в одинарных кавычках: 'senior'.",
  },
  {
    id: 'p-order-1',
    topic: 'order',
    difficulty: 'easy',
    title: 'Сортировка по цене',
    description: 'Выберите все товары из **products**, отсортировав по цене по возрастанию.',
    availableTables: [{ name: 'products', columns: ['product_id', 'name', 'price'] }],
    datasets: {
      products: [
        { product_id: 1, name: 'Клавиатура', price: 45 },
        { product_id: 2, name: 'Монитор', price: 210 },
        { product_id: 3, name: 'Мышь', price: 18 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM products ORDER BY price',
    hint: 'ORDER BY column сортирует по возрастанию по умолчанию.',
  },
  {
    id: 'p-order-2',
    topic: 'order',
    difficulty: 'mid',
    title: '5 самых холодных',
    description:
      'Из таблицы **temperature** получите 5 самых холодных мест: отсортируйте по возрастанию avg_temp и ограничьте результат 5 строками.',
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
    hint: 'LIMIT n ограничивает количество возвращаемых строк.',
  },
  {
    id: 'p-agg-1',
    topic: 'agg',
    difficulty: 'mid',
    title: 'Средняя цена',
    description: 'Посчитайте среднюю цену (столбец avg_price) всех товаров в **products**.',
    availableTables: [{ name: 'products', columns: ['product_id', 'name', 'price'] }],
    datasets: {
      products: [
        { product_id: 1, name: 'Клавиатура', price: 40 },
        { product_id: 2, name: 'Монитор', price: 200 },
        { product_id: 3, name: 'Мышь', price: 20 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT AVG(price) AS avg_price FROM products',
    hint: 'AVG(column) считает среднее. Не забудьте дать столбцу имя avg_price через AS.',
  },
  {
    id: 'p-agg-2',
    topic: 'agg',
    difficulty: 'hard',
    title: 'Товаров в наличии',
    description: 'Посчитайте общее количество строк в таблице **products** (столбец total).',
    availableTables: [{ name: 'products', columns: ['product_id', 'name', 'price'] }],
    datasets: {
      products: [
        { product_id: 1, name: 'Клавиатура', price: 40 },
        { product_id: 2, name: 'Монитор', price: 200 },
        { product_id: 3, name: 'Мышь', price: 20 },
        { product_id: 4, name: 'Наушники', price: 89 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT COUNT(*) AS total FROM products',
    hint: 'COUNT(*) считает количество строк.',
  },

  // --- DISTINCT ---
  {
    id: 'p-distinct-1',
    topic: 'distinct',
    difficulty: 'easy',
    title: 'Уникальные города',
    description: 'В таблице **orders** выберите уникальные значения столбца **city**.',
    availableTables: [{ name: 'orders', columns: ['order_id', 'city'] }],
    datasets: {
      orders: [
        { order_id: 1, city: 'Минск' },
        { order_id: 2, city: 'Гомель' },
        { order_id: 3, city: 'Минск' },
        { order_id: 4, city: 'Брест' },
        { order_id: 5, city: 'Гомель' },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT DISTINCT city FROM orders',
    hint: 'SELECT DISTINCT column FROM table.',
  },
  {
    id: 'p-distinct-2',
    topic: 'distinct',
    difficulty: 'mid',
    title: 'DISTINCT + WHERE',
    description: 'В таблице **orders** выберите уникальные города, где сумма total больше 100.',
    availableTables: [{ name: 'orders', columns: ['city', 'total'] }],
    datasets: {
      orders: [
        { city: 'Минск', total: 150 },
        { city: 'Гомель', total: 80 },
        { city: 'Минск', total: 40 },
        { city: 'Брест', total: 220 },
        { city: 'Гомель', total: 300 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT DISTINCT city FROM orders WHERE total > 100',
    hint: 'Совместите DISTINCT и WHERE в одном запросе: сначала фильтрация, потом уникальные значения.',
  },

  // --- WHERE (ещё) ---
  {
    id: 'p-where-3',
    topic: 'where',
    difficulty: 'easy',
    title: 'Отрицательные значения',
    description: 'В таблице **transactions** выберите все записи, где amount меньше 0.',
    availableTables: [{ name: 'transactions', columns: ['id', 'amount'] }],
    datasets: {
      transactions: [
        { id: 1, amount: 50 },
        { id: 2, amount: -20 },
        { id: 3, amount: 100 },
        { id: 4, amount: -5 },
        { id: 5, amount: 0 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM transactions WHERE amount < 0',
    hint: 'WHERE column < 0.',
  },

  // --- AND ---
  {
    id: 'p-and-1',
    topic: 'and',
    difficulty: 'easy',
    title: 'Два условия',
    description: 'В таблице **employees** выберите всех, у кого department = \'IT\' И salary больше 2000.',
    availableTables: [{ name: 'employees', columns: ['name', 'department', 'salary'] }],
    datasets: {
      employees: [
        { name: 'Anna', department: 'IT', salary: 2500 },
        { name: 'Boris', department: 'IT', salary: 1800 },
        { name: 'Chen', department: 'Sales', salary: 3000 },
        { name: 'Dara', department: 'IT', salary: 2200 },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM employees WHERE department = 'IT' AND salary > 2000",
    hint: 'WHERE условие1 AND условие2.',
  },
  {
    id: 'p-and-2',
    topic: 'and',
    difficulty: 'mid',
    title: 'AND + ORDER BY',
    description: 'В таблице **employees** выберите сотрудников IT с зарплатой больше 2000, отсортировав по salary по убыванию.',
    availableTables: [{ name: 'employees', columns: ['name', 'department', 'salary'] }],
    datasets: {
      employees: [
        { name: 'Anna', department: 'IT', salary: 2500 },
        { name: 'Boris', department: 'IT', salary: 1800 },
        { name: 'Chen', department: 'Sales', salary: 3000 },
        { name: 'Dara', department: 'IT', salary: 2200 },
        { name: 'Eli', department: 'IT', salary: 4100 },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM employees WHERE department = 'IT' AND salary > 2000 ORDER BY salary DESC",
    hint: 'Сначала WHERE с AND, потом ORDER BY ... DESC.',
  },

  // --- OR ---
  {
    id: 'p-or-1',
    topic: 'or',
    difficulty: 'easy',
    title: 'Один из двух отделов',
    description: 'В таблице **employees** выберите всех, кто работает в отделе \'IT\' ИЛИ \'Sales\'.',
    availableTables: [{ name: 'employees', columns: ['name', 'department'] }],
    datasets: {
      employees: [
        { name: 'Anna', department: 'IT' },
        { name: 'Boris', department: 'HR' },
        { name: 'Chen', department: 'Sales' },
        { name: 'Dara', department: 'Legal' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM employees WHERE department = 'IT' OR department = 'Sales'",
    hint: 'WHERE условие1 OR условие2.',
  },
  {
    id: 'p-or-2',
    topic: 'or',
    difficulty: 'mid',
    title: 'OR по числовому условию',
    description: 'В таблице **products** выберите товары с price меньше 20 ИЛИ больше 200.',
    availableTables: [{ name: 'products', columns: ['name', 'price'] }],
    datasets: {
      products: [
        { name: 'Клавиатура', price: 45 },
        { name: 'Монитор', price: 210 },
        { name: 'Мышь', price: 18 },
        { name: 'Кабель', price: 5 },
        { name: 'Кресло', price: 340 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM products WHERE price < 20 OR price > 200',
    hint: 'WHERE условие1 OR условие2 — достаточно одного истинного.',
  },

  // --- NOT ---
  {
    id: 'p-not-1',
    topic: 'not',
    difficulty: 'easy',
    title: 'Исключить категорию',
    description: 'В таблице **products** выберите все товары, у которых category НЕ равен \'furniture\'.',
    availableTables: [{ name: 'products', columns: ['name', 'category'] }],
    datasets: {
      products: [
        { name: 'Клавиатура', category: 'electronics' },
        { name: 'Стол', category: 'furniture' },
        { name: 'Монитор', category: 'electronics' },
        { name: 'Стул', category: 'furniture' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM products WHERE NOT category = 'furniture'",
    hint: 'WHERE NOT условие.',
  },
  {
    id: 'p-not-2',
    topic: 'not',
    difficulty: 'mid',
    title: 'NOT с числами',
    description: 'В таблице **orders** выберите заказы, где total НЕ больше 100 (то есть <= 100).',
    availableTables: [{ name: 'orders', columns: ['id', 'total'] }],
    datasets: {
      orders: [
        { id: 1, total: 50 },
        { id: 2, total: 150 },
        { id: 3, total: 100 },
        { id: 4, total: 220 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM orders WHERE NOT total > 100',
    hint: 'WHERE NOT total > 100 равносильно WHERE total <= 100.',
  },

  // --- NULL ---
  {
    id: 'p-null-1',
    topic: 'null',
    difficulty: 'easy',
    title: 'Пропущенные значения',
    description: 'В таблице **users** выберите всех, у кого email не указан (IS NULL).',
    availableTables: [{ name: 'users', columns: ['name', 'email'] }],
    datasets: {
      users: [
        { name: 'Anna', email: 'anna@mail.com' },
        { name: 'Boris', email: null },
        { name: 'Chen', email: 'chen@mail.com' },
        { name: 'Dara', email: null },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM users WHERE email IS NULL',
    hint: 'WHERE column IS NULL.',
  },
  {
    id: 'p-null-2',
    topic: 'null',
    difficulty: 'mid',
    title: 'IS NOT NULL + DISTINCT',
    description: 'В таблице **users** выберите уникальные значения email, исключив пустые (NULL).',
    availableTables: [{ name: 'users', columns: ['name', 'email'] }],
    datasets: {
      users: [
        { name: 'Anna', email: 'anna@mail.com' },
        { name: 'Boris', email: null },
        { name: 'Chen', email: 'anna@mail.com' },
        { name: 'Dara', email: null },
        { name: 'Eli', email: 'eli@mail.com' },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT DISTINCT email FROM users WHERE email IS NOT NULL',
    hint: 'Совместите DISTINCT и WHERE column IS NOT NULL.',
  },

  // --- ORDER BY ---
  {
    id: 'p-order-3',
    topic: 'order',
    difficulty: 'mid',
    title: 'Сортировка по нескольким столбцам',
    description: 'В таблице **students** отсортируйте по grade по убыванию, а при равенстве — по name по возрастанию.',
    availableTables: [{ name: 'students', columns: ['name', 'grade'] }],
    datasets: {
      students: [
        { name: 'Anna', grade: 90 },
        { name: 'Boris', grade: 85 },
        { name: 'Chen', grade: 90 },
        { name: 'Dara', grade: 70 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM students ORDER BY grade DESC, name',
    hint: 'ORDER BY column1 DESC, column2 — второй столбец сортирует по возрастанию по умолчанию.',
  },

  // --- LIMIT ---
  {
    id: 'p-limit-1',
    topic: 'limit',
    difficulty: 'easy',
    title: 'Топ-3 по цене',
    description: 'В таблице **products** выберите 3 самых дорогих товара (все столбцы).',
    availableTables: [{ name: 'products', columns: ['name', 'price'] }],
    datasets: {
      products: [
        { name: 'Клавиатура', price: 45 },
        { name: 'Монитор', price: 210 },
        { name: 'Мышь', price: 18 },
        { name: 'Кресло', price: 340 },
        { name: 'Наушники', price: 120 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM products ORDER BY price DESC LIMIT 3',
    hint: 'ORDER BY price DESC LIMIT 3.',
  },
  {
    id: 'p-limit-2',
    topic: 'limit',
    difficulty: 'mid',
    title: 'LIMIT + WHERE',
    description: 'В таблице **products** выберите 2 самых дешёвых товара, у которых category = \'electronics\'.',
    availableTables: [{ name: 'products', columns: ['name', 'category', 'price'] }],
    datasets: {
      products: [
        { name: 'Клавиатура', category: 'electronics', price: 45 },
        { name: 'Стол', category: 'furniture', price: 300 },
        { name: 'Мышь', category: 'electronics', price: 18 },
        { name: 'Наушники', category: 'electronics', price: 120 },
        { name: 'Стул', category: 'furniture', price: 90 },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM products WHERE category = 'electronics' ORDER BY price LIMIT 2",
    hint: 'WHERE ... ORDER BY price LIMIT 2.',
  },

  // --- IN ---
  {
    id: 'p-in-1',
    topic: 'in',
    difficulty: 'easy',
    title: 'Список городов',
    description: 'В таблице **customers** выберите всех, кто живёт в \'Minsk\', \'Brest\' или \'Grodno\'.',
    availableTables: [{ name: 'customers', columns: ['name', 'city'] }],
    datasets: {
      customers: [
        { name: 'Anna', city: 'Minsk' },
        { name: 'Boris', city: 'Gomel' },
        { name: 'Chen', city: 'Brest' },
        { name: 'Dara', city: 'Vitebsk' },
        { name: 'Eli', city: 'Grodno' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM customers WHERE city IN ('Minsk', 'Brest', 'Grodno')",
    hint: "WHERE column IN ('a', 'b', 'c').",
  },
  {
    id: 'p-in-2',
    topic: 'in',
    difficulty: 'mid',
    title: 'IN + NOT',
    description: 'В таблице **customers** выберите всех, кто НЕ живёт в \'Minsk\' или \'Gomel\'.',
    availableTables: [{ name: 'customers', columns: ['name', 'city'] }],
    datasets: {
      customers: [
        { name: 'Anna', city: 'Minsk' },
        { name: 'Boris', city: 'Gomel' },
        { name: 'Chen', city: 'Brest' },
        { name: 'Dara', city: 'Vitebsk' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM customers WHERE city NOT IN ('Minsk', 'Gomel')",
    hint: 'NOT IN исключает все перечисленные значения.',
  },

  // --- BETWEEN ---
  {
    id: 'p-between-1',
    topic: 'between',
    difficulty: 'easy',
    title: 'Диапазон возраста',
    description: 'В таблице **users** выберите всех, чей age между 18 и 30 включительно.',
    availableTables: [{ name: 'users', columns: ['name', 'age'] }],
    datasets: {
      users: [
        { name: 'Anna', age: 25 },
        { name: 'Boris', age: 17 },
        { name: 'Chen', age: 30 },
        { name: 'Dara', age: 45 },
        { name: 'Eli', age: 18 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM users WHERE age BETWEEN 18 AND 30',
    hint: 'BETWEEN включает обе границы.',
  },
  {
    id: 'p-between-2',
    topic: 'between',
    difficulty: 'mid',
    title: 'BETWEEN + ORDER BY',
    description: 'В таблице **products** выберите товары с price от 50 до 150 включительно, отсортировав по price по возрастанию.',
    availableTables: [{ name: 'products', columns: ['name', 'price'] }],
    datasets: {
      products: [
        { name: 'Клавиатура', price: 45 },
        { name: 'Монитор', price: 210 },
        { name: 'Мышь', price: 18 },
        { name: 'Наушники', price: 120 },
        { name: 'Веб-камера', price: 80 },
      ],
    },
    starter: '',
    solutionQuery: 'SELECT * FROM products WHERE price BETWEEN 50 AND 150 ORDER BY price',
    hint: 'WHERE price BETWEEN 50 AND 150 ORDER BY price.',
  },

  // --- LIKE ---
  {
    id: 'p-like-1',
    topic: 'like',
    difficulty: 'easy',
    title: 'Имена на "A"',
    description: 'В таблице **users** выберите всех, чьё имя начинается на "A".',
    availableTables: [{ name: 'users', columns: ['name'] }],
    datasets: {
      users: [
        { name: 'Anna' }, { name: 'Boris' }, { name: 'Alex' },
        { name: 'Chen' }, { name: 'Amir' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM users WHERE name LIKE 'A%'",
    hint: "LIKE 'A%' — начинается с A, дальше что угодно.",
  },
  {
    id: 'p-like-2',
    topic: 'like',
    difficulty: 'mid',
    title: 'Домен почты',
    description: 'В таблице **users** выберите всех, чей email заканчивается на "@gmail.com".',
    availableTables: [{ name: 'users', columns: ['name', 'email'] }],
    datasets: {
      users: [
        { name: 'Anna', email: 'anna@gmail.com' },
        { name: 'Boris', email: 'boris@yahoo.com' },
        { name: 'Chen', email: 'chen@gmail.com' },
        { name: 'Dara', email: 'dara@mail.com' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM users WHERE email LIKE '%@gmail.com'",
    hint: "% перед @gmail.com означает «что угодно перед этим текстом».",
  },
  {
    id: 'p-like-3',
    topic: 'like',
    difficulty: 'hard',
    title: 'LIKE + IN + ORDER BY',
    description: 'В таблице **products** выберите товары, название которых начинается на "P", у которых category IN (\'electronics\', \'office\'), отсортировав по name.',
    availableTables: [{ name: 'products', columns: ['name', 'category'] }],
    datasets: {
      products: [
        { name: 'Printer', category: 'office' },
        { name: 'Phone', category: 'electronics' },
        { name: 'Pillow', category: 'home' },
        { name: 'Pen', category: 'office' },
        { name: 'Plate', category: 'kitchen' },
      ],
    },
    starter: '',
    solutionQuery: "SELECT * FROM products WHERE name LIKE 'P%' AND category IN ('electronics', 'office') ORDER BY name",
    hint: 'Совместите LIKE, IN и ORDER BY в одном запросе.',
  },
];

export function getPracticeTask(id) {
  return PRACTICE_TASKS.find((t) => t.id === id);
}
