import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export const revalidate = 3600; // Cache for 1 hour to avoid GitHub API rate limits

export async function GET() {
  try {
    const response = await fetch(siteConfig.githubApiStarsUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add a GitHub token here in your environment variables if you want to increase the rate limit further
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub stars");
    }

    const data = await response.json();

    return NextResponse.json({
      stars: data.stargazers_count,
    });
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    // Return a fallback or 0 if it fails so the UI doesn't break
    return NextResponse.json({ stars: null }, { status: 500 });
  }
}
