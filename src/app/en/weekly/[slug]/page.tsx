import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "highlight.js/styles/github-dark.min.css";
import "katex/dist/katex.min.css";

import { WeeklyIssuePage } from "@/components/weekly/weekly-issue-page";
import { config } from "@/lib/config";
import {
  getLanguageSwitchTarget,
  getTranslatedWeeklyIssue,
  getWeeklyIssueBySlug,
  getWeeklyIssuesByLocale,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

type WeeklyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: WeeklyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getWeeklyIssueBySlug("en-US", slug);

  if (!issue) {
    return {};
  }

  const translated = getTranslatedWeeklyIssue("en-US", issue.translationKey);
  const imageUrl =
    issue.cover.source === "none"
      ? config.site.image
      : issue.cover.src.startsWith("http")
        ? issue.cover.src
        : absoluteUrl(issue.cover.src);

  return {
    title: issue.title,
    description: issue.summary,
    keywords: issue.keywords,
    alternates: {
      canonical: `/en/weekly/${issue.slug}`,
      languages: translated
        ? {
            "zh-CN": translated.href,
            "en-US": `/en/weekly/${issue.slug}`,
          }
        : undefined,
    },
    openGraph: {
      title: issue.title,
      description: issue.summary,
      type: config.seo.openGraph.type,
      url: absoluteUrl(`/en/weekly/${issue.slug}`),
      images: [
        {
          url: imageUrl,
        },
      ],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: issue.title,
      description: issue.summary,
      images: [
        {
          url: imageUrl,
        },
      ],
      creator: config.seo.twitter.creator,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getWeeklyIssuesByLocale("en-US").map((issue) => ({
    slug: issue.slug,
  }));
}

export default async function WeeklyPage({ params }: WeeklyPageProps) {
  const { slug } = await params;
  const issue = getWeeklyIssueBySlug("en-US", slug);

  if (!issue) {
    notFound();
  }

  const languageSwitchTarget = getLanguageSwitchTarget(`/en/weekly/${issue.slug}`);
  const issues = getWeeklyIssuesByLocale("en-US");

  return (
    <WeeklyIssuePage
      locale="en-US"
      languageSwitchHref={languageSwitchTarget.href}
      issue={issue}
      issues={issues}
    />
  );
}
