import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";
import type { BlogCover } from "@/lib/covers";

type BlogCoverImageProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  cover: BlogCover;
  sizes?: string;
  priority?: boolean;
  imageClassName?: string;
};

function CoverPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="weekly-cover-placeholder absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.28)_24%,transparent_58%),radial-gradient(circle_at_82%_24%,rgba(36,41,47,0.05)_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.56),rgba(255,255,255,0)),linear-gradient(145deg,rgba(199,186,164,0.12),rgba(199,186,164,0.03))]" />
      <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-6">
        <div className="relative h-full w-full max-w-[13rem] rounded-[1.25rem] border border-[rgba(36,41,47,0.07)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(246,241,232,0.95))] shadow-[0_8px_18px_rgba(36,41,47,0.04)]">
          <div className="absolute inset-x-[14%] top-[16%] h-[15%] rounded-full bg-[rgba(36,41,47,0.06)]" />
          <div className="absolute inset-x-[14%] top-[42%] h-[2px] rounded-full bg-[rgba(36,41,47,0.06)]" />
          <div className="absolute inset-x-[14%] top-[50%] h-[2px] rounded-full bg-[rgba(36,41,47,0.045)]" />
          <div className="absolute bottom-[15%] left-[14%] h-[16%] w-[24%] rounded-[999px] bg-[rgba(36,41,47,0.05)]" />
          <div className="absolute bottom-[15%] right-[14%] h-[16%] w-[34%] rounded-[0.9rem] bg-[linear-gradient(135deg,rgba(214,204,185,0.26),rgba(255,255,255,0.38))]" />
        </div>
      </div>
    </div>
  );
}

export function BlogCoverImage({
  cover,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  ...props
}: BlogCoverImageProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {cover.source === "none" ? (
        <CoverPlaceholder />
      ) : (
        <Image
          alt={cover.alt}
          src={cover.src}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      )}
    </div>
  );
}
