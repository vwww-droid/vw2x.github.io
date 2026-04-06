import { WeeklyCard, type WeeklyTeaser } from "@/components/weekly/weekly-card";

type WeeklyGridProps = {
  issues: WeeklyTeaser[];
};

export function WeeklyGrid({ issues }: WeeklyGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {issues.map((issue, index) => (
        <WeeklyCard key={issue.href} issue={issue} priority={index < 6} />
      ))}
    </div>
  );
}
