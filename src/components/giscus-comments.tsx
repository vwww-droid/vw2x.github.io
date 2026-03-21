"use client";

import Giscus from "@giscus/react";
import { config } from "@/lib/config";

export default function GiscusComments() {
  const { repo, repoId, category, categoryId } = config.giscus;
  if (!categoryId) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
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
        theme="dark"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
