import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tweetUrl = request.nextUrl.searchParams.get("url");
  if (!tweetUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=1`;
    const res = await fetch(oembedUrl, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`oEmbed failed: ${res.status}`);
    }

    const data = (await res.json()) as {
      author_name: string;
      author_url: string;
      html: string;
    };

    const handle = (data.author_url ?? "").split("/").filter(Boolean).pop() ?? "";

    const textMatch = data.html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const rawText = textMatch ? textMatch[1] : "";
    const text = rawText
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();

    const avatarUrl = `https://unavatar.io/twitter/${handle}`;

    return NextResponse.json({
      author_name: data.author_name,
      handle,
      text,
      avatarUrl,
      tweetUrl,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tweet" }, { status: 500 });
  }
}
