import Link from "next/link";
import { config } from "@/lib/config";

function Separator() {
  return <span className="text-muted-foreground/50" aria-hidden>·</span>;
}

export function SiteFooter() {
  const github = config.social.github;

  return (
    <footer className="shrink-0">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-6 text-sm text-muted-foreground">
        <Link href="/about" className="transition-colors hover:text-foreground">
          关于我
        </Link>
        <Separator />
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Github
        </a>
      </div>
    </footer>
  );
}
