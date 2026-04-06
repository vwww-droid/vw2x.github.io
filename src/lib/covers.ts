import generatedCovers from "@/content/covers/generated-covers.json";

export type BlogCoverSource = "explicit" | "generated" | "none";

export type BlogCover = {
  src: string;
  alt: string;
  source: BlogCoverSource;
};

export type BlogCoverInput = {
  title: string;
  translationKey: string;
  cover?: string | null;
  coverAlt?: string | null;
};

type GeneratedCoverEntry = {
  src?: string | null;
  alt?: string | null;
};

type GeneratedCoverMap = Record<string, GeneratedCoverEntry>;

const generatedCoverMap = generatedCovers as GeneratedCoverMap;

function getNonEmptyText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function resolveBlogCover(input: BlogCoverInput): BlogCover {
  const explicitCover = getNonEmptyText(input.cover);
  const explicitAlt = getNonEmptyText(input.coverAlt);

  if (explicitCover) {
    return {
      src: explicitCover,
      alt: explicitAlt ?? input.title,
      source: "explicit",
    };
  }

  const generated = generatedCoverMap[input.translationKey];
  const generatedCover = getNonEmptyText(generated?.src);

  if (generatedCover) {
    return {
      src: generatedCover,
      alt: explicitAlt ?? getNonEmptyText(generated?.alt) ?? input.title,
      source: "generated",
    };
  }

  return {
    src: "",
    alt: explicitAlt ?? input.title,
    source: "none",
  };
}
