'use client'

import { useState, useEffect, Suspense } from 'react'
import Loading from '@/app/loading'
import Dots from '@/app/ui/backgrounds/dots'

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
                    <div>
                        <video
                            className="w-60 h-60 object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source
                                src="https://rotato.netlify.app/alpha-demo/movie-hevc.mov"
                                type='video/mp4; codecs="hvc1"'
                            />
                            <source
                                src="https://rotato.netlify.app/alpha-demo/movie-webm.webm"
                                type="video/webm"
                            />
                        </video>
                    </div>
                </Suspense>
            </Dots>
        </main>
    )
}
