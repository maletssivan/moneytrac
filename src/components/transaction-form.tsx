"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addTransaction,
  updateTransaction,
  type ActionState,
} from "@/app/actions";
import { categories, type Transaction } from "@/lib/types";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
}: TransactionFormProps) {
  const isEditing = !!transaction;

  const initialState: ActionState = { success: false };

  const boundAction = isEditing
    ? updateTransaction.bind(null, transaction!.id)
    : addTransaction;

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state, onOpenChange]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Редактировать транзакцию" : "Добавить транзакцию"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Тип */}
          <div className="space-y-2">
            <Label>Тип</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  defaultChecked={
                    transaction?.type === "income" || !transaction
                  }
                  className="accent-green-600"
                />
                <span>Доход</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  defaultChecked={transaction?.type === "expense"}
                  className="accent-red-600"
                />
                <span>Расход</span>
              </label>
            </div>
          </div>

          {/* Сумма */}
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={1}
              step="0.01"
              required
              defaultValue={transaction?.amount ?? ""}
              placeholder="Введите сумму"
            />
          </div>

          {/* Категория */}
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select
              name="category"
              defaultValue={transaction?.category ?? categories[0]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              name="description"
              type="text"
              maxLength={280}
              defaultValue={transaction?.description ?? ""}
              placeholder="Необязательно"
            />
          </div>

          {/* Дата */}
          <div className="space-y-2">
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={transaction?.date ?? today}
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
