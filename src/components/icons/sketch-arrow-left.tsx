import { cn } from "@/lib/utils";

/** Hand-drawn style left arrow in a circle, matches GoToTop sketch aesthetic */
export function SketchArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5 shrink-0", className)}
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 20.35a8.35 8.35 0 1 0 0-16.7 8.35 8.35 0 0 0 0 16.7z"
          className="opacity-[0.22]"
          transform="translate(0.42 0.48)"
        />
        <path d="M12 3.55c2.35-.2 4.85 1.05 6.55 2.9 1.95 2.1 2.15 5.15 1.75 7.75-.45 2.85-2.35 5.35-5.05 6.55-2.55 1.15-5.65.95-8.05-.55-2.6-1.6-4.2-4.45-4.35-7.35-.15-3 1.35-5.9 3.75-7.55 1.85-1.25 4.15-1.85 6.4-1.75z" />
        <path d="M14.75 12H9M9 12l2.35-2.2M9 12l2.35 2.2" />
      </g>
    </svg>
  );
}
