import { createClient } from "@/lib/supabase/server";
import { BalanceSummary } from "@/components/balance-summary";
import { TransactionList } from "@/components/transaction-list";
import { TransactionFilter } from "@/components/transaction-filter";
import { Transaction } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (type === "income" || type === "expense") {
    query = query.eq("type", type);
  }

  const { data: transactions } = await query;

  const allTransactions = (transactions ?? []) as Transaction[];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Money Tracker</h1>

      <BalanceSummary transactions={allTransactions} />

      <TransactionFilter currentType={type} />

      <TransactionList transactions={allTransactions} />
    </main>
  );
}
