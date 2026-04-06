"use client";

import { SearchIcon } from "lucide-react";

import { useSearch } from "./search-provider";

export function SearchTrigger({ className = "" }: { className?: string }) {
  const { setOpen } = useSearch();

  return (
    <button
      type="button"
      aria-label="Search"
      title="Search (Press /)"
      onClick={() => setOpen(true)}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[rgba(85,85,85,0.72)] transition-colors hover:text-[#24292f] ${className}`}
    >
      <SearchIcon className="h-[18px] w-[18px]" strokeWidth={2} />
    </button>
  );
}
