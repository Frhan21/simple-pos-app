import { cn } from "@/lib/utils";

type SimplePosMarkProps = {
  className?: string;
  title?: string;
};

export function SimplePosMark({
  className,
  title = "Simple POS",
}: SimplePosMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={cn("size-9", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="13" fill="currentColor" />
      <path
        d="M14.5 18.5h19v15.25c0 1.52-1.23 2.75-2.75 2.75h-13.5a2.75 2.75 0 0 1-2.75-2.75V18.5Z"
        fill="var(--mark-paper, white)"
      />
      <path
        d="M19 19v-1.4a5 5 0 0 1 10 0V19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="m18.5 27 3.1 3.1 7.9-8.1"
        fill="none"
        stroke="var(--mark-accent, #76df82)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m18 36.5 2.2-2.2 2.2 2.2 2.2-2.2 2.2 2.2 2.2-2.2 2.2 2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".15"
      />
    </svg>
  );
}
