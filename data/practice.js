// Practice task bank — independent of the Path, grouped by topic.
// Add new tasks by pushing objects into PRACTICE_TASKS, following this shape.
// difficulty: 'easy' | 'mid' | 'hard'

export const TOPICS = [
  { id: 'select', label: 'SELECT / FROM' },
  { id: 'where', label: 'WHERE' },
  { id: 'order', label: 'ORDER BY / LIMIT' },
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
];

export function getPracticeTask(id) {
  return PRACTICE_TASKS.find((t) => t.id === id);
}
