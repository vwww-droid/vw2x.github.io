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

function blogCoverImageLoader({ src }: { src: string }) {
  return src;
}

function CoverPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="weekly-cover-placeholder absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.42)_24%,transparent_58%),radial-gradient(circle_at_82%_22%,rgba(36,41,47,0.07)_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.64),rgba(255,255,255,0)),linear-gradient(145deg,rgba(201,187,163,0.12),rgba(201,187,163,0.03))]" />
      <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-6">
        <div className="relative h-full w-full max-w-[15rem] rounded-[1.4rem] border border-[rgba(36,41,47,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,241,233,0.94))] shadow-[0_12px_24px_rgba(36,41,47,0.06)]">
          <div className="absolute inset-x-[14%] top-[16%] h-[16%] rounded-full bg-[rgba(36,41,47,0.08)]" />
          <div className="absolute inset-x-[14%] top-[40%] h-[2px] rounded-full bg-[rgba(36,41,47,0.08)]" />
          <div className="absolute inset-x-[14%] top-[49%] h-[2px] rounded-full bg-[rgba(36,41,47,0.06)]" />
          <div className="absolute inset-x-[14%] top-[58%] h-[2px] rounded-full bg-[rgba(36,41,47,0.05)]" />
          <div className="absolute bottom-[14%] left-[14%] h-[18%] w-[22%] rounded-[999px] bg-[rgba(36,41,47,0.07)]" />
          <div className="absolute bottom-[14%] right-[14%] h-[18%] w-[36%] rounded-[1rem] bg-[linear-gradient(135deg,rgba(215,205,186,0.34),rgba(255,255,255,0.42))]" />
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
      className={cn(
        "weekly-cover-frame weekly-surface relative isolate overflow-hidden rounded-[1.05rem] aspect-[4/3]",
        className
      )}
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
          unoptimized
          loader={blogCoverImageLoader}
          className={cn("object-cover", imageClassName)}
        />
      )}
    </div>
  );
}
