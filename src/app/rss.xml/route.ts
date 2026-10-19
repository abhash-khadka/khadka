import { getData, BlogPost } from "@/lib/data";
import { escapeXml } from "@/lib/utils";

const SITE_URL = "https://abhashkhadka.com.np";

export async function GET(): Promise<Response> {
  const data = await getData();
  const posts = data.blogs.filter((p: BlogPost) => p.published);

  const items = posts
    .map((post: BlogPost) => {
      const url = `${SITE_URL}/blogs/${post.slug || post.id}`;
      const title = escapeXml(post.title_en || "Blog Post");
      const description = escapeXml(post.excerpt_en || "");

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${(() => { const d = new Date(post.date); return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString(); })()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Abhash Khadka — Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Latest blog posts from Abhash Khadka's portfolio.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
