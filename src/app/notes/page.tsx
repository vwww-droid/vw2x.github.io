import type { Metadata } from "next";

import { NotesGrid } from "@/components/notes/notes-grid";
import { config } from "@/lib/config";
import { getNotesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x 笔记 | ${config.site.title}`,
  description: "vw2x 的双语笔记归档",
  keywords: `${config.site.title}, 笔记, Notes`,
};

export default function NotesPage() {
  const notes = getNotesByLocale("zh-CN");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:px-0 md:py-8">
      <NotesGrid notes={notes} locale="zh-CN" />
    </div>
  );
}
