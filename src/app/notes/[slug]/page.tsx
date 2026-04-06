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
  const note = getNoteBySlug("zh-CN", slug);

  if (!note) {
    return {};
  }

  const translated = getTranslatedNote("zh-CN", note.translationKey);

  return {
    title: note.title,
    description: note.summary ?? config.site.description["zh-CN"],
    alternates: {
      canonical: `/notes/${note.slug}`,
      languages: translated
        ? {
            "zh-CN": `/notes/${note.slug}`,
            "en-US": translated.href,
          }
        : undefined,
    },
    openGraph: {
      title: note.title,
      description: note.summary ?? config.site.description["zh-CN"],
      type: config.seo.openGraph.type,
      url: absoluteUrl(`/notes/${note.slug}`),
      images: [
        {
          url: config.site.image,
        },
      ],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: note.title,
      description: note.summary ?? config.site.description["zh-CN"],
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
  return getNotesByLocale("zh-CN").map((note) => ({
    slug: note.slug,
  }));
}

export default async function NoteRoute({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug("zh-CN", slug);

  if (!note) {
    notFound();
  }

  const languageSwitchTarget = getLanguageSwitchTarget(`/notes/${note.slug}`);

  return (
    <NotePage
      locale="zh-CN"
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
