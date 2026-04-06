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
  const issue = getWeeklyIssueBySlug("zh-CN", slug);

  if (!issue) {
    return {};
  }

  const translated = getTranslatedWeeklyIssue("zh-CN", issue.translationKey);

  return {
    title: issue.title,
    description: issue.summary,
    keywords: issue.keywords,
    alternates: {
      canonical: `/weekly/${issue.slug}`,
      languages: translated
        ? {
            "zh-CN": `/weekly/${issue.slug}`,
            "en-US": translated.href,
          }
        : undefined,
    },
    openGraph: {
      title: issue.title,
      description: issue.summary,
      type: config.seo.openGraph.type,
      url: absoluteUrl(`/weekly/${issue.slug}`),
      images: [
        {
          url: config.site.image,
        },
      ],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: issue.title,
      description: issue.summary,
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
  return getWeeklyIssuesByLocale("zh-CN").map((issue) => ({
    slug: issue.slug,
  }));
}

export default async function WeeklyPage({ params }: WeeklyPageProps) {
  const { slug } = await params;
  const issue = getWeeklyIssueBySlug("zh-CN", slug);

  if (!issue) {
    notFound();
  }

  const languageSwitchTarget = getLanguageSwitchTarget(`/weekly/${issue.slug}`);
  const issues = getWeeklyIssuesByLocale("zh-CN");

  return (
    <WeeklyIssuePage
      locale="zh-CN"
      languageSwitchHref={languageSwitchTarget.href}
      issue={issue}
      issues={issues}
    />
  );
}
