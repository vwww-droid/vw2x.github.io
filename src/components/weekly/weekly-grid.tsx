import { WeeklyCard, type WeeklyTeaser } from "@/components/weekly/weekly-card";

type WeeklyGridProps = {
  issues: WeeklyTeaser[];
};

export function WeeklyGrid({ issues }: WeeklyGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 [&>*]:min-w-0 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
      {issues.map((issue, index) => (
        <WeeklyCard key={issue.href} issue={issue} priority={index < 4} />
      ))}
    </div>
  );
}
