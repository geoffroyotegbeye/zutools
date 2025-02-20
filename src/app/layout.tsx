import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { generateSEOMetadata } from '@/app/components/SEOMetadata'
import './globals.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ThemeProvider } from './providers/ThemeProvider'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateSEOMetadata({
  title: 'ZuTools - Collection d\'Outils en Ligne Gratuits',
  description: 'ZuTools propose une collection d\'outils en ligne gratuits : correcteur orthographique, extracteur de miniatures YouTube et plus encore. Des outils simples et efficaces pour tous vos besoins.',
  keywords: [
    'outils en ligne',
    'outils gratuits',
    'outils web',
    'correcteur orthographique',
    'miniature youtube',
    'outils utiles',
    'outils internet',
    'outils productivité',
    'outils texte',
    'outils vidéo'
  ],
  url: 'https://zutools.geoffreyotegbeye.com',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <Navigation />
            <main className="flex-grow bg-gray-50 dark:bg-gray-800 pt-[1rem] text-sm sm:text-base text-gray-900 dark:text-gray-100">
              {children}
            </main>
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 sm:hidden">
              {/* Espace pub mobile */}
              <div className="text-center text-gray-500 dark:text-gray-400">
                Espace publicitaire
              </div>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
