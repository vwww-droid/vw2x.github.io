"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import type { SearchDocument } from "@/lib/content";
import { formatDateCompact } from "@/lib/utils";

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
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`block rounded-[18px] p-2.5 transition-colors ${
                    selectedIndex === index
                      ? "bg-[rgba(244,241,234,0.96)]"
                      : "hover:bg-[rgba(247,245,239,0.9)]"
                  }`}
                  onClick={() => onOpenChange(false)}
                >
                  <div className="flex items-start gap-3 rounded-[16px] bg-[rgba(255,255,255,0.88)] p-2.5">
                    <BlogCoverImage
                      cover={result.cover}
                      sizes="112px"
                      className="h-[88px] w-[88px] shrink-0 rounded-[14px] bg-[rgba(246,241,232,0.9)] sm:h-[96px] sm:w-[112px]"
                      imageClassName="transition-none"
                    />
                    <div className="min-w-0 flex-1 px-0.5 py-0.5">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[rgba(85,85,85,0.72)]">
                        {formatDateCompact(result.date, result.lang)}
                      </p>
                      <p
                        className="mt-2 text-[18px] font-semibold leading-[1.3] tracking-[-0.02em] text-[rgba(36,41,47,0.94)]"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.title, query),
                        }}
                      />
                      <p
                        className="mt-2 text-[14px] leading-[1.65] text-[rgba(85,85,85,0.82)]"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(getPreviewText(result), query),
                        }}
                      />
                    </div>
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

function getPreviewText(document: SearchDocument) {
  const preview = document.summary || document.content;

  if (preview.length <= 120) {
    return preview;
  }

  return `${preview.slice(0, 117).trimEnd()}...`;
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
