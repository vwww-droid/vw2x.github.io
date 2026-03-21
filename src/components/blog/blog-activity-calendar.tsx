"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  type BlogActivityCell,
  buildActivityGrid,
  buildPostDateSet,
  formatPostDateLabelZh,
  postDateKey,
} from "@/lib/blog-activity-calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type BlogActivityEntry = {
  date: string;
  slug: string;
  title: string;
};

type BlogActivityCalendarProps = {
  entries: BlogActivityEntry[];
};

const cellMotion = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.28, y: -1 },
  tap: { scale: 1.12 },
};

function buildPostsByDate(entries: BlogActivityEntry[]): Map<string, BlogActivityEntry[]> {
  const m = new Map<string, BlogActivityEntry[]>();
  for (const e of entries) {
    const k = postDateKey(e.date);
    if (!k) continue;
    const arr = m.get(k) ?? [];
    arr.push(e);
    m.set(k, arr);
  }
  return m;
}

export function BlogActivityCalendar({ entries }: BlogActivityCalendarProps) {
  const reduceMotion = useReducedMotion();
  const postDates = buildPostDateSet(entries.map((e) => e.date));
  const weeks = buildActivityGrid(postDates);
  const postsByDate = buildPostsByDate(entries);

  return (
    <TooltipProvider>
      <div
        className="flex justify-center overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Blog posts by day, last 53 weeks"
      >
        <div
          className="inline-flex gap-[3px]"
          role="img"
          aria-label="Daily blog activity heatmap"
        >
          {weeks.map((column, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {column.map((cell) => (
                <ActivityCell
                  key={cell.dateKey}
                  cell={cell}
                  posts={postsByDate.get(cell.dateKey) ?? []}
                  reduceMotion={!!reduceMotion}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

function ActivityCell({
  cell,
  posts,
  reduceMotion,
}: {
  cell: BlogActivityCell;
  posts: BlogActivityEntry[];
  reduceMotion: boolean;
}) {
  const base =
    "size-[10px] shrink-0 rounded-[2px] block origin-center will-change-transform";
  const palette = cell.isFuture
    ? "bg-gray-100 dark:bg-gray-800/80"
    : cell.hasPost
      ? "bg-emerald-500 dark:bg-emerald-600 shadow-sm shadow-emerald-600/25 dark:shadow-emerald-900/40"
      : "bg-gray-200/90 dark:bg-gray-700/70";

  const canNavigate = !cell.isFuture && posts.length > 0;
  const interactiveMotion = canNavigate && !reduceMotion;

  const dot = (
    <motion.span
      className={`${base} ${palette} ${canNavigate ? "cursor-pointer" : "cursor-default"}`}
      initial="rest"
      whileHover={interactiveMotion ? "hover" : undefined}
      whileTap={interactiveMotion ? "tap" : undefined}
      variants={cellMotion}
      transition={{ type: "spring", stiffness: 520, damping: 28, mass: 0.35 }}
    />
  );

  const tooltipBody = (
    <div className="space-y-1.5 text-left">
      <p className="font-medium leading-snug">{formatPostDateLabelZh(cell.dateKey)}</p>
      {cell.isFuture ? (
        <p className="text-xs text-muted-foreground">未来日期</p>
      ) : posts.length === 0 ? (
        <p className="text-xs text-muted-foreground">当天暂无文章</p>
      ) : (
        <ul className="max-h-40 space-y-1 overflow-y-auto text-xs leading-snug">
          {posts.map((p) => (
            <li key={p.slug} className="[text-wrap:pretty]">
              {p.title}
            </li>
          ))}
        </ul>
      )}
      {canNavigate ? (
        <p className="border-t border-border pt-1.5 text-[0.65rem] text-muted-foreground">
          点击查看该日文章列表
        </p>
      ) : null}
    </div>
  );

  const trigger = canNavigate ? (
    <TooltipTrigger asChild>
      <Link
        href={`/blog?date=${cell.dateKey}`}
        className="inline-flex rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        scroll
      >
        {dot}
      </Link>
    </TooltipTrigger>
  ) : (
    <TooltipTrigger asChild>
      <span className="inline-flex">{dot}</span>
    </TooltipTrigger>
  );

  return (
    <Tooltip>
      {trigger}
      <TooltipContent side="top">{tooltipBody}</TooltipContent>
    </Tooltip>
  );
}
