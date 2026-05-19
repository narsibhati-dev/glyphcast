import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

// --- Configuration -----------------------------------------------------------

/** How long (in seconds) Next.js may serve a cached response before revalidating. */
const REVALIDATE_SECONDS = 3600; // 1 hour

/** Browser / CDN cache lifetime (seconds). */
const MAX_AGE = 60;

/** CDN stale-while-revalidate window (seconds). */
const SWR_SECONDS = REVALIDATE_SECONDS;

// --- Types -------------------------------------------------------------------

interface GitHubRepoResponse {
  stargazers_count: number;
  [key: string]: unknown;
}

interface StarsSuccessPayload {
  stars: number;
}

interface StarsErrorPayload {
  stars: null;
  error: string;
}

// --- Route handler -----------------------------------------------------------

export const revalidate = REVALIDATE_SECONDS;

export async function GET(): Promise<
  NextResponse<StarsSuccessPayload | StarsErrorPayload>
> {
  const cacheHeaders = {
    "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, max-age=${MAX_AGE}, stale-while-revalidate=${SWR_SECONDS}`,
  };

  try {
    const response = await fetch(siteConfig.githubApiStarsUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`,
        body,
      );

      return NextResponse.json(
        { stars: null, error: "GitHub API request failed" },
        { status: response.status, headers: cacheHeaders },
      );
    }

    const data: GitHubRepoResponse = await response.json();

    if (typeof data?.stargazers_count !== "number") {
      console.error("Unexpected GitHub API response shape:", data);

      return NextResponse.json(
        { stars: null, error: "Malformed GitHub API response" },
        { status: 502, headers: cacheHeaders },
      );
    }

    return NextResponse.json(
      { stars: data.stargazers_count },
      { headers: cacheHeaders },
    );
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);

    return NextResponse.json(
      { stars: null, error: "Internal error fetching star count" },
      { status: 500, headers: cacheHeaders },
    );
  }
}
