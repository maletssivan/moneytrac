-- Создание таблицы transactions
CREATE TABLE IF NOT EXISTS transactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  description text,
  date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Включение Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Политики: открытый доступ для учебного проекта
CREATE POLICY "Allow select for all" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for all" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all" ON transactions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for all" ON transactions
  FOR DELETE USING (true);
