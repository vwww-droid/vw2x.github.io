import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "highlight.js/styles/github-dark.min.css";
import "katex/dist/katex.min.css";

import { NotePage } from "@/components/notes/note-page";
import { config } from "@/lib/config";
import {
  getLanguageSwitchTarget,
  getNoteBySlug,
  getNotesByLocale,
  getTranslatedNote,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug("en-US", slug);

  if (!note) {
    return {};
  }

  const translated = getTranslatedNote("en-US", note.translationKey);

  return {
    title: note.title,
    description: note.summary ?? config.site.description["en-US"],
    alternates: {
      canonical: `/en/notes/${note.slug}`,
      languages: translated
        ? {
            "zh-CN": translated.href,
            "en-US": `/en/notes/${note.slug}`,
          }
        : undefined,
    },
    openGraph: {
      title: note.title,
      description: note.summary ?? config.site.description["en-US"],
      type: config.seo.openGraph.type,
      url: absoluteUrl(`/en/notes/${note.slug}`),
      images: [
        {
          url: config.site.image,
        },
      ],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: note.title,
      description: note.summary ?? config.site.description["en-US"],
      images: [
        {
          url: config.site.image,
        },
      ],
      creator: config.seo.twitter.creator,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getNotesByLocale("en-US").map((note) => ({
    slug: note.slug,
  }));
}

export default async function NoteRoute({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug("en-US", slug);

  if (!note) {
    notFound();
  }

  const languageSwitchTarget = getLanguageSwitchTarget(`/en/notes/${note.slug}`);

  return (
    <NotePage
      locale="en-US"
      languageSwitchHref={languageSwitchTarget.href}
      note={{
        title: note.title,
        date: note.date,
        summary: note.summary,
        content: note.content,
      }}
    />
  );
}
