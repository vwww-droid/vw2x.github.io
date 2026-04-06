"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import type { SearchDocument } from "@/lib/content";

type SearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_LABELS = {
  "zh-CN": {
    placeholder: "搜索文章...",
    empty: "输入关键词开始搜索",
    loading: "正在加载搜索索引...",
    noResults: "没有找到相关文章",
    error: "搜索索引加载失败",
    tips: "/ 搜索  ESC 关闭  ↑↓ 选择  Enter 打开",
  },
  "en-US": {
    placeholder: "Search articles...",
    empty: "Type to search articles",
    loading: "Loading search index...",
    noResults: "No results found",
    error: "Failed to load search index",
    tips: "/ Search  ESC Close  ↑↓ Select  Enter Open",
  },
} as const;

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/")
    ? "en-US"
    : "zh-CN";
  const labels = EMPTY_LABELS[locale];

  const [query, setQuery] = React.useState("");
  const [documents, setDocuments] = React.useState<SearchDocument[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredResults = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const currentLocaleDocuments = documents.filter((document) => document.lang === locale);

    if (!normalized) {
      return [] as SearchDocument[];
    }

    return currentLocaleDocuments
      .filter((document) => {
        return [
          document.title,
          document.summary,
          document.content,
          document.translationKey,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      })
      .slice(0, 10);
  }, [documents, locale, query]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(-1);
      return;
    }

    inputRef.current?.focus();

    if (status === "idle") {
      setStatus("loading");
      fetch("/search.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch search.json: ${response.status}`);
          }
          return response.json() as Promise<SearchDocument[]>;
        })
        .then((data) => {
          setDocuments(data);
          setStatus("ready");
        })
        .catch(() => {
          setStatus("error");
        });
    }
  }, [open, status]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) =>
          filteredResults.length === 0 ? -1 : (current + 1 + filteredResults.length) % filteredResults.length
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) =>
          filteredResults.length === 0 ? -1 : (current - 1 + filteredResults.length) % filteredResults.length
        );
      }

      if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selected) {
          window.location.href = selected.url;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filteredResults, onOpenChange, open, selectedIndex]);

  React.useEffect(() => {
    setSelectedIndex(filteredResults.length > 0 ? 0 : -1);
  }, [filteredResults.length, query]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/55 px-4 py-6 backdrop-blur-[2px] md:px-6 md:py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[680px] flex-col overflow-hidden rounded-[10px] border border-black/8 bg-white shadow-[0_16px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-3 border-b border-[#ececec] px-5 py-4">
          <SearchIcon className="h-[18px] w-[18px] text-[rgba(85,85,85,0.72)]" />
          <input
            ref={inputRef}
            id="search-modal-title"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
            className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.5] text-[#24292f] outline-none placeholder:text-[rgba(85,85,85,0.55)]"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[rgba(85,85,85,0.72)] transition-colors hover:text-[#24292f]"
          >
            <XIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {status === "loading" ? (
            <SearchState>{labels.loading}</SearchState>
          ) : status === "error" ? (
            <SearchState>{labels.error}</SearchState>
          ) : query.trim() === "" ? (
            <SearchState>{labels.empty}</SearchState>
          ) : filteredResults.length === 0 ? (
            <SearchState>{labels.noResults}</SearchState>
          ) : (
            <div className="space-y-1" role="listbox" aria-label={labels.placeholder}>
              {filteredResults.map((result, index) => (
                <Link
                  key={`${result.lang}-${result.translationKey}`}
                  href={result.url}
                  className={`block rounded-[8px] px-4 py-3 transition-colors ${
                    selectedIndex === index ? "bg-[#f4f4f1]" : "hover:bg-[#f7f7f4]"
                  }`}
                  onClick={() => onOpenChange(false)}
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[17px] font-semibold leading-[1.45] text-[#24292f]"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.title, query),
                        }}
                      />
                      <p
                        className="mt-1 text-[15px] leading-[1.7] text-[rgba(85,85,85,0.82)]"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.summary || result.content, query),
                        }}
                      />
                    </div>
                    <p className="shrink-0 pt-0.5 text-[14px] leading-[1.4] text-[rgba(85,85,85,0.7)]">
                      {result.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#ececec] px-5 py-3 text-[12px] leading-[1.5] text-[rgba(85,85,85,0.72)]">
          {labels.tips}
        </div>
      </div>
    </div>
  );
}

function SearchState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center px-6 text-center text-[15px] leading-[1.7] text-[rgba(85,85,85,0.75)]">
      {children}
    </div>
  );
}

function highlightText(text: string, query: string) {
  if (!query.trim()) {
    return escapeHtml(text);
  }

  const safeText = escapeHtml(text);
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safeText.replace(new RegExp(`(${escaped})`, "gi"), "<mark class=\"bg-[#f1ebc7] px-[2px] text-[#24292f]\">$1</mark>");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
