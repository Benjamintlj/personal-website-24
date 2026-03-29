import type { Metadata } from 'next'
import '@/app/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ben Lewis-Jones | Software Engineer',
    description:
        'Ben Lewis-Jones is a mid-level software engineer specialising in high-throughput payment systems at AccessPay and previously embedded and cloud development at Dyson.',
    metadataBase: new URL('https://benlewisjones.com'),
    keywords: [
        'Ben Lewis-Jones',
        'Ben Lewis Jones',
        'Software Engineer',
        'Software Developer',
        'Full Stack Developer',
        'AccessPay',
        'Dyson',
        '.NET',
        'TypeScript',
        'React',
        'Personal Website',
        'Portfolio',
        'Programming',
        'Computer Science',
    ],
    alternates: {
        canonical: 'https://benlewisjones.com',
    },
    openGraph: {
        title: 'Ben Lewis-Jones | Software Engineer',
        description:
            'Mid-level software engineer with experience in high-throughput payment systems and embedded to cloud development.',
        url: 'https://benlewisjones.com',
        siteName: 'Ben Lewis-Jones',
        images: [
            {
                url: '/images/meta/selfie.png',
                width: 1200,
                height: 630,
                alt: 'Ben Lewis-Jones',
            },
        ],
        type: 'website',
        locale: 'en_GB',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ben Lewis-Jones | Software Engineer',
        description:
            'Mid-level software engineer with experience in high-throughput payment systems and embedded to cloud development.',
        images: ['/images/meta/selfie.png'],
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ben Lewis-Jones',
    url: 'https://benlewisjones.com',
    email: 'ben@benlewisjones.com',
    jobTitle: 'Software Engineer',
    worksFor: {
        '@type': 'Organization',
        name: 'AccessPay',
    },
    sameAs: [
        'https://github.com/Benjamintlj',
        'https://www.linkedin.com/in/benjamin-lewis-jones/',
    ],
    knowsAbout: [
        'TypeScript',
        '.NET',
        'React',
        'PostgreSQL',
        'Docker',
        'AWS',
        'Azure DevOps',
    ],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`bg-black ${inter.className}`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
            </body>
        </html>
    )
}
