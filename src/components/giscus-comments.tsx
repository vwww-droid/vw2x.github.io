"use client";

import Giscus from "@giscus/react";
import { config } from "@/lib/config";

export default function GiscusComments({
  lang = "zh-CN",
}: {
  lang?: "zh-CN" | "en-US";
}) {
  const { repo, repoId, category, categoryId } = config.giscus;
  if (!categoryId) {
    return null;
  }

  return (
    <div className="mt-0">
      <Giscus
        id="comments"
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang={lang === "en-US" ? "en" : "zh-CN"}
        loading="lazy"
      />
    </div>
  );
}
