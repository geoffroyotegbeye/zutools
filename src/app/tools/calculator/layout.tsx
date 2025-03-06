import { metadata as pageMetadata } from './metadata'
import { Metadata } from 'next'

export const metadata: Metadata = pageMetadata

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
