"use server";

import {
  fetchUserContributions,
  getGithubToken,
} from "@/module/github/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";
// import prisma from "@/lib/db";

export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorised");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    //Get user's github username
    const { data: user } = await octokit.rest.users.getAuthenticated();
    // console.log("Data in dashboard stats in index.ts", user);

    //* FETCH TOTAL CONNECTED REPOS FROM DB
    const totalRepos = 30;

    const calendar = await fetchUserContributions(token, user.login);

    // console.log("user value in dashboard stats", calendar);

    if (!calendar) {
      console.log("No calendar data available");
      return {
        totalCommits: 0,
        totalPRs,
        totalReviews,
        totalRepos,
      };
    }

    const totalCommits = calendar.totalContributions || 0;

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPRs = prs.total_count;

    //* COUNT AI REVIEWS FROM DATABASE
    const totalReviews = 44;

    return {
      totalCommits,
      totalPRs,
      totalReviews,
      totalRepos,
    };
  } catch (error) {
    console.log("Error fetching dashboard stats: ", error);
    return {
      totalCommits: 0,
      totalPRs: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
  }
}

export const getMonthlyActivity = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorised");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = await fetchUserContributions(token, user.login);

    // console.log("Calendar vale in index.ts", calendar);

    if (!calendar || !calendar.weeks) {
      console.log("No calendar data available");
      return [];
    }

    const monthlyData: {
      [key: string]: { commits: number; prs: number; reviews: number };
    } = {};

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[date.getMonth()];
      monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    calendar?.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const date = new Date(day.date);
        const monthKey = monthNames[date.getMonth()];
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    //* REVIEW'S REAL DATA

    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180);
        const reviewDate = new Date(now);

        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();
    reviews.forEach((review) => {
      const monthKey = monthNames[review.createdAt.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

    // console.log("Reviews in index.ts", reviews);

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${sixMonthsAgo.toISOString().split("T")[0]}`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()];

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    // console.log("PRS in index.ts", prs);

    return Object.keys(monthlyData).map((name) => ({
      name,
      ...monthlyData[name],
    }));
  } catch (error) {
    console.log("Error in fetching monthly activity", error);
    return [];
  }
};

export const getContributionStats = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorised");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;

    const calendar = await fetchUserContributions(token, username);

    if (!calendar) {
      return null;
    }

    const contributions = calendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      })),
    );

    // console.log("Contributions in index.ts", contributions);

    return { contributions, totalContributions: calendar.totalContributions };
  } catch (error) {
    console.log("Error in fetching contribution stats", error);
    return {};
  }
};
