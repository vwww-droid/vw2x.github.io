import type { Metadata } from "next";

import { NotesGrid } from "@/components/notes/notes-grid";
import { config } from "@/lib/config";
import { getNotesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x Notes | ${config.site.title}`,
  description: "The bilingual notes archive for vw2x",
  keywords: `${config.site.title}, Notes, quick notes`,
};

export default function NotesPage() {
  const notes = getNotesByLocale("en-US");

  return (
    <div className="mx-auto w-full max-w-[1680px] px-4 py-4 sm:px-4 md:px-6 md:py-8 2xl:px-8">
      <NotesGrid notes={notes} locale="en-US" />
    </div>
  );
}
