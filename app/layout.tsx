import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { TravelShell } from '@/components/travel-shell'
import { Manrope } from 'next/font/google'
const manrope = Manrope({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'SAMO Travel — Go somewhere that feels like you',
  description: 'Discover stays with soul, flights, memorable experiences and your next great escape. Travel. Anywhere. Simply. Explore the Samotravel demo.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c8f7e7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <TravelShell>{children}</TravelShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
