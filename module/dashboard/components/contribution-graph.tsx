"use client";

import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { getContributionStats } from "@/module/dashboard/actions/index";
import { useQuery } from "@tanstack/react-query";

const ContributionGraph = () => {
  const { theme } = useTheme();

  const { data: contribution, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => await getContributionStats(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center p-8">
        <div className="text-muted-foreground animate-pulse">
          Loading contribution data...
        </div>
      </div>
    );
  }

  if (!contribution || !contribution.contributions?.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center p-8">
        <div className="text-muted-foreground">
          No contribution data available
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="text-muted-foreground text-sm">
        <span className="text-foreground font-semibold">
          {contribution.totalContributions}
          <span> contributions in the last year</span>
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max justify-center px-4">
          <ActivityCalendar
            data={contribution.contributions}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockMargin={4}
            blockSize={11}
            fontSize={14}
            showMonthLabels
            showWeekdayLabels
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
