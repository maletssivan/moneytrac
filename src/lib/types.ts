import { z } from "zod";

export const transactionTypes = ["income", "expense"] as const;
export type TransactionType = (typeof transactionTypes)[number];

export const categories = [
  "Зарплата",
  "Фриланс",
  "Еда",
  "Транспорт",
  "Развлечения",
  "Прочее",
] as const;
export type Category = (typeof categories)[number];

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string | null;
  date: string;
  created_at: string;
}

export const transactionSchema = z.object({
  type: z.enum(transactionTypes, {
    message: "Выберите тип транзакции",
  }),
  amount: z
    .number({ message: "Введите сумму" })
    .min(1, "Сумма должна быть не менее 1"),
  category: z.enum(categories, {
    message: "Выберите категорию",
  }),
  description: z
    .string()
    .max(280, "Описание не более 280 символов")
    .nullable()
    .optional(),
  date: z.string({ message: "Укажите дату" }),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
