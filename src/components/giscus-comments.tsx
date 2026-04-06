"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";

import {
  getDocumentModeFromClassName,
  getGiscusLang,
  getGiscusThemeMessage,
  getGiscusThemeUrl,
  type GiscusDocumentMode,
} from "@/components/giscus-comments-theme";
import { config } from "@/lib/config";

export default function GiscusComments({
  lang = "zh-CN",
}: {
  lang?: "zh-CN" | "en-US";
}) {
  const { repo, repoId, category, categoryId } = config.giscus;
  const [mode, setMode] = useState<GiscusDocumentMode>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return getDocumentModeFromClassName(document.documentElement.className);
  });

  const origin =
    typeof window === "undefined" ? config.site.url : window.location.origin;
  const theme = getGiscusThemeUrl(origin, mode);

  useEffect(() => {
    const root = document.documentElement;

    const syncMode = () => {
      setMode(getDocumentModeFromClassName(root.className));
    };

    syncMode();

    const observer = new MutationObserver(syncMode);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      getGiscusThemeMessage(theme),
      "https://giscus.app",
    );
  }, [theme]);

  if (!categoryId) {
    return null;
  }

  return (
    <div className="weekly-giscus-shell mt-0">
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
        inputPosition="bottom"
        theme={theme}
        lang={getGiscusLang(lang)}
        loading="lazy"
      />
    </div>
  );
}
