import { MetadataRoute } from 'next';
import { getData } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abhashkhadka.com.np';
  const data = await getData();

  // Static routes
  const staticRoutes = ['', '/about', '/portfolio', '/blogs', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  // Dynamic Blog routes
  const blogRoutes = data.blogs
    .filter((post) => post.published)
    .map((post) => ({
      url: `${baseUrl}/blogs/${post.slug || post.id}`,
      lastModified: new Date(post.date), // Fallback, could parse if it was ISO
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Dynamic Portfolio routes
  const portfolioRoutes = data.portfolio.map((item) => ({
    url: `${baseUrl}/portfolio/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...portfolioRoutes];
}
