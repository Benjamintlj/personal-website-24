import type { Metadata } from 'next'
import '@/app/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ben Lewis-Jones',
    description:
        'Personal website, showing off who Ben is and what he is all about.',
    metadataBase: new URL('https://www.benlewisjones.com'),
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
