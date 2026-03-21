export function postDateKey(iso: string): string | null {
  const m = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return null;
  const y = t.getFullYear();
  const mo = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

export function formatPostDateLabelZh(dateKey: string): string {
  const [ys, ms, ds] = dateKey.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!y || !m || !d) return dateKey;
  return `${y}年${m}月${d}日`;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

function sundayOnOrBefore(d: Date): Date {
  const x = startOfLocalDay(d);
  const dow = x.getDay();
  x.setDate(x.getDate() - dow);
  return x;
}

export const BLOG_ACTIVITY_WEEKS = 53;

export type BuildActivityGridOptions = {
  weeks?: number;
};

export function buildPostDateSet(dates: string[]): Set<string> {
  const set = new Set<string>();
  for (const raw of dates) {
    const k = postDateKey(raw);
    if (k) set.add(k);
  }
  return set;
}

export type BlogActivityCell = {
  dateKey: string;
  hasPost: boolean;
  isFuture: boolean;
};

export function buildActivityGrid(
  postDates: Set<string>,
  options?: BuildActivityGridOptions,
): BlogActivityCell[][] {
  const requested = options?.weeks ?? BLOG_ACTIVITY_WEEKS;
  const weekCount = Math.min(BLOG_ACTIVITY_WEEKS, Math.max(1, requested));

  const today = startOfLocalDay(new Date());
  const endSunday = sundayOnOrBefore(today);
  const gridStart = new Date(endSunday);
  gridStart.setDate(gridStart.getDate() - (weekCount - 1) * 7);

  const weeks: BlogActivityCell[][] = [];

  for (let w = 0; w < weekCount; w++) {
    const column: BlogActivityCell[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const cell = new Date(gridStart);
      cell.setDate(cell.getDate() + w * 7 + dow);
      const dateKey = localDateKey(cell);
      const isFuture = cell.getTime() > today.getTime();
      column.push({
        dateKey,
        hasPost: !isFuture && postDates.has(dateKey),
        isFuture,
      });
    }
    weeks.push(column);
  }

  return weeks;
}
