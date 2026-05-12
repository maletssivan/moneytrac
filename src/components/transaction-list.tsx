"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/components/transaction-form";
import { deleteTransaction } from "@/app/actions";
import { Transaction } from "@/lib/types";

function formatCurrency(amount: number): string {
  return (
    Number(amount).toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " ₽"
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  function handleAdd() {
    setEditingTransaction(null);
    setFormOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Точно удалить?")) return;
    await deleteTransaction(id);
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Транзакций пока нет</p>
        <Button onClick={handleAdd}>Добавить первую</Button>
        <TransactionForm
          open={formOpen}
          onOpenChange={setFormOpen}
          transaction={editingTransaction}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>+ Добавить</Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium">Дата</th>
              <th className="p-3 text-left font-medium">Тип</th>
              <th className="p-3 text-left font-medium">Категория</th>
              <th className="p-3 text-left font-medium">Описание</th>
              <th className="p-3 text-right font-medium">Сумма</th>
              <th className="p-3 text-center font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b hover:bg-muted/30 cursor-pointer"
                onClick={() => handleEdit(t)}
              >
                <td className="p-3">{formatDate(t.date)}</td>
                <td className="p-3">
                  <span
                    className={
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {t.type === "income" ? "Доход" : "Расход"}
                  </span>
                </td>
                <td className="p-3">{t.category}</td>
                <td className="p-3 text-muted-foreground">
                  {t.description || "—"}
                </td>
                <td
                  className={`p-3 text-right font-medium ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount)}
                </td>
                <td className="p-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(t.id);
                    }}
                    aria-label="Удалить транзакцию"
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTransaction}
      />
    </div>
  );
}
