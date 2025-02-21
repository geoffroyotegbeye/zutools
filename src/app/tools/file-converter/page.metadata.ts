import type { Metadata } from 'next'
import { metadata as toolMetadata } from './metadata'

export const metadata: Metadata = {
  title: `${toolMetadata.name} - ZuTools`,
  description: toolMetadata.description,
}
