"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/types";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function addTransaction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    type: formData.get("type") as string,
    amount: Number(formData.get("amount")),
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || null,
    date: formData.get("date") as string,
  };

  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").insert(parsed.data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateTransaction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    type: formData.get("type") as string,
    amount: Number(formData.get("amount")),
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || null,
    date: formData.get("date") as string,
  };

  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteTransaction(id: number): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
