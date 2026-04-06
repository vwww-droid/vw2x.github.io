import type { ReactNode } from "react";

import { SearchProvider } from "@/components/search/search-provider";

type WeeklyShellProps = {
  children: ReactNode;
};

export function WeeklyShell({ children }: WeeklyShellProps) {
  return <SearchProvider>{children}</SearchProvider>;
}
