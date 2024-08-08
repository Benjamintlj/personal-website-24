import type { Metadata } from 'next'
import '@/app/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ben Lewis-Jones',
    metadataBase: new URL('https://benlewisjones.com'),
    keywords: [
        'Programming',
        'Computer Science',
        'Ben Lewis-Jones',
        'Ben Lewis Jones',
        'Personal website',
        'portfolio',
        'Software engineer',
        'Software developer',
    ],
    openGraph: {
        description:
            "Personal website, showing off Ben's professional and personal life.",
        images: ['/images/meta/selfie.png'],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`bg-black ${inter.className}`}>{children}</body>
        </html>
    )
}
