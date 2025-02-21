import Link from 'next/link'
import { FaFont, FaYoutube, FaExchangeAlt, FaClock, FaFileAlt } from 'react-icons/fa'

const tools = [
  {
    name: 'Correction de texte',
    description: 'Corrigez vos textes en temps réel avec notre outil de correction intelligent',
    icon: FaFont,
    path: '/tools/text-correction',
    color: 'blue'
  },
  {
    name: 'Extracteur de miniatures YouTube',
    description: 'Téléchargez facilement les miniatures de vos vidéos YouTube préférées',
    icon: FaYoutube,
    path: '/tools/youtube-thumbnail',
    color: 'red'
  },
  {
    name: 'Convertisseur d\'unités',
    description: 'Convertissez facilement différentes unités de mesure',
    icon: FaExchangeAlt,
    path: '/tools/unit-converter',
    color: 'green'
  },
  {
    name: 'Outils de temps',
    description: 'Chronomètre, minuteur et alarmes pour gérer votre temps',
    icon: FaClock,
    path: '/tools/timer',
    color: 'purple'
  },
  {
    name: 'Convertisseur de fichiers',
    description: 'Convertissez vos fichiers dans différents formats (images, audio, vidéo, PDF)',
    icon: FaFileAlt,
    path: '/tools/file-converter',
    color: 'orange'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Outils en ligne gratuits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une collection d&apos;outils pratiques pour améliorer votre productivité quotidienne
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-${tool.color}-100 dark:bg-${tool.color}-900/20 text-${tool.color}-600 dark:text-${tool.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-${tool.color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Tous nos outils sont gratuits et faciles à utiliser.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Choisissez un outil ci-dessus pour commencer !
          </p>
        </div>
      </div>
    </div>
  )
}
