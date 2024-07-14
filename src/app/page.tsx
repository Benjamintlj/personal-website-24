'use client'

import { useState, useEffect, lazy } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'

export default function Home() {
    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main>
            <Dots>
                <section className="h-screen w-screen flex flex-col items-center mt-[10vh]">
                    <h1 className="header1">Ben Lewis-Jones</h1>
                    <Memoji className="w-52 sm:w-64 md:w-72 lg:w-96" />
                </section>
            </Dots>
        </main>
    )
}
