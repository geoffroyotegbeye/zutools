import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords: string[]
  url: string
  imageUrl?: string
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  url,
  imageUrl = '/og-image.jpg', // Image par défaut
}: SEOProps): Metadata {
  const fullTitle = `${title} | ZuTools`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    metadataBase: new URL('https://zutools.geoffreyotegbeye.com'),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'ZuTools',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
