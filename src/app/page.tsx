import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-gray-900 dark:to-purple-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Des outils en ligne</span>
                  <span className="block text-blue-600 dark:text-blue-400">pour vous simplifier la vie</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Découvrez notre collection d'outils gratuits pour améliorer votre productivité quotidienne.
                  Du correcteur de texte à l'extracteur de miniatures YouTube, nous avons ce qu'il vous faut.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
          Nos Outils
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/tools/text-correction"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Correcteur de texte</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Corrigez l&apos;orthographe et la grammaire de vos textes en temps réel.
            </p>
          </Link>

          <Link
            href="/tools/youtube-thumbnail"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Miniatures YouTube</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Téléchargez les miniatures de vos vidéos YouTube préférées en haute qualité.
            </p>
          </Link>

          <Link
            href="/tools/unit-converter"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Convertisseur d&apos;unités</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Convertissez facilement entre différentes unités : longueur, poids, température, volume et surface.
            </p>
          </Link>

          <Link
            href="/tools/timer"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gestion du temps</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Chronomètre, compte à rebours et alarmes en ligne. Parfait pour le sport, la cuisine ou le travail.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
