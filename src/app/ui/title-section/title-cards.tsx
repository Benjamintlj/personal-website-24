import { CardItem, ThreeDCard } from '@/app/ui/title-section/three-d-card'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React from 'react'

export const TitleCards = ({
    title,
    description,
    imageSrc,
    className,
}: {
    title: string
    description: string
    imageSrc: string
    className?: string
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                ease: 'easeInOut',
                duration: 1,
                damping: 10,
                delay: Math.random() * 3,
            }}
            className={`${className} z-10 hover:z-20 hidden xl:block`}
        >
            <ThreeDCard className="inter-var w-72 flex flex-col group">
                <CardItem translateZ="50" className="w-full mb-4">
                    <Image
                        src={imageSrc}
                        height="1000"
                        width="1000"
                        className="h-60 classicImage brightness-50 group-hover:brightness-100 transition-all duration-300"
                        alt="thumbnail"
                    />
                </CardItem>
                <CardItem
                    translateZ="20"
                    className="header3 ml-3 mr-3 mb-4 text-left opacity-25 group-hover:opacity-100 transition-opacity duration-300"
                >
                    {title}
                </CardItem>
                <CardItem
                    as="p"
                    translateZ="25"
                    className="paragraph ml-3 mr-3 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    {description}
                </CardItem>
            </ThreeDCard>
        </motion.div>
    )
}
