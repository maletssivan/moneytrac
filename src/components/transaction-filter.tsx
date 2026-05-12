"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TransactionFilterProps {
  currentType?: string;
}

export function TransactionFilter({ currentType }: TransactionFilterProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors";
  const activeClasses = "bg-primary text-primary-foreground";
  const inactiveClasses =
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex gap-2 mb-4">
      <Link
        href="/"
        className={cn(
          baseClasses,
          !currentType ? activeClasses : inactiveClasses
        )}
      >
        Все
      </Link>
      <Link
        href="/?type=income"
        className={cn(
          baseClasses,
          currentType === "income" ? activeClasses : inactiveClasses
        )}
      >
        Только доходы
      </Link>
      <Link
        href="/?type=expense"
        className={cn(
          baseClasses,
          currentType === "expense" ? activeClasses : inactiveClasses
        )}
      >
        Только расходы
      </Link>
    </div>
  );
}
