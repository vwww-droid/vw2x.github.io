import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const mono =
  'ui-monospace, Monaco, "Cascadia Code", "Courier New", Courier, monospace'

function isHighlightedCode(className?: string) {
  return (
    !!className &&
    (className.includes("hljs") || /\blanguage-[\w-]+\b/.test(className))
  )
}

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "font-heading mt-6 mb-4 scroll-m-20 text-[3.2rem] leading-[3.6rem] font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "font-heading mt-7 mb-3 scroll-m-20 text-[1.6rem] leading-snug font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "font-heading mt-6 mb-2 scroll-m-20 text-[1.4rem] leading-snug font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "font-heading mt-5 mb-2 scroll-m-20 text-[1.2rem] leading-snug font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "font-heading mt-5 mb-2 scroll-m-20 text-[1rem] leading-snug font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "font-heading mt-4 mb-2 scroll-m-20 text-[0.8rem] leading-snug font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        "font-medium text-blue-600 underline decoration-blue-600/50 underline-offset-[0.2em] transition-colors hover:text-blue-500 hover:decoration-blue-500 dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:text-blue-300 dark:hover:decoration-blue-300/50",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "my-3 text-[1rem] leading-[1.7] text-foreground/95",
        className
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-bold", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-4 ml-6 list-disc space-y-1.5 text-[1rem] leading-[1.7] text-foreground/95",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-4 ml-6 list-decimal space-y-1.5 text-[1rem] leading-[1.7] text-foreground/95",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("pl-1 marker:text-muted-foreground", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "my-4 border-l-[3px] border-border pl-4 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("max-w-full rounded-md", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table
        className={cn(
          "mx-auto mb-12 w-full border-collapse border-spacing-0 text-left",
          "text-[1rem]",
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-b border-solid border-border p-4 text-left font-semibold text-foreground",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border-b border-dashed border-border p-4 text-left leading-[1.65] text-foreground/95",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "my-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-[0.8125rem] leading-relaxed",
        className
      )}
      style={{ fontFamily: mono }}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if (isHighlightedCode(className)) {
      return (
        <code
          className={cn(className)}
          style={{ fontFamily: mono }}
          {...props}
        />
      )
    }
    return (
      <code
        className={cn(
          "rounded border border-border/70 bg-muted/90 px-1.5 py-0.5 text-[0.875em] font-normal text-foreground",
          className
        )}
        style={{ fontFamily: mono }}
        {...props}
      />
    )
  },
  small: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <small
      className={cn("text-[70%]", className)}
      {...props}
    />
  ),
  Image,
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "font-medium text-blue-600 no-underline decoration-blue-600/50 transition-colors hover:text-blue-500 hover:underline dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:text-blue-300",
        className
      )}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
        className
      )}
      {...props}
    />
  ),
  MdxBlank: () => (
    <div className="h-[1.25em] min-h-[1.25em] shrink-0" aria-hidden />
  ),
}

export { components }
