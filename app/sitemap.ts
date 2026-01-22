import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mongarage-auto.com'
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/pieces`, lastModified: new Date() },
    { url: `${baseUrl}/vehicules`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/garage`, lastModified: new Date() },
  ]
}