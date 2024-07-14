'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import Loading from '@/app/loading'
import Dots from '@/app/ui/backgrounds/dots'

const DelayedComponent = () => {
    return <h1 className="header1">Hello world</h1>
}

const LazyComponent = lazy(
    () =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve({ default: DelayedComponent })
            }, 5000)
        })
)

export default function Home() {
    const [key, setKey] = useState(Date.now())

    useEffect(() => {
        setKey(Date.now())
    }, [])

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main className="h-screen w-screen">
            <Dots>
                <Suspense
                    fallback={
                        <div className="fixed bottom-20 left-20">
                            <Loading />
                        </div>
                    }
                >
                    <LazyComponent key={key} />
                </Suspense>
            </Dots>
        </main>
    )
}
