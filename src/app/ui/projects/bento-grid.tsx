import { cn } from '@/lib/utils'
import React from 'react'
import { useState, useRef, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'

const gridColsClass = (numOfGridCols: number) => {
    switch (numOfGridCols) {
        case 1:
            return 'grid-cols-1'
        case 2:
            return 'grid-cols-2'
        case 3:
            return 'grid-cols-3'
        default:
            return 'grid-cols-1'
    }
}

export const BentoGrid = ({
    className,
    children,
    numOfGridCols = 1,
    rowHeight = 'auto',
}: {
    className?: string
    children?: React.ReactNode
    numOfGridCols?: number
    rowHeight?: string
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 max-w-7xl mx-auto',
                gridColsClass(numOfGridCols),
                className
            )}
            style={{ gridAutoRows: rowHeight }}
        >
            {children}
        </div>
    )
}

export const BentoGridItem = ({
    title,
    description,
    width,
    cardImage,
    descriptionImages,
    className,
    children,
}: {
    title: string
    description: string
    width: number
    cardImage?: string
    descriptionImages: string
    className?: string
    children: React.ReactNode
}) => {
    const [active, setActive] = useState<boolean | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const id = useId()

    useOutsideClick(ref, () => setActive(null))

    if (width > 2)
        throw new Error('Invalid input: width should not be greater than 2.')

    return (
        <>
            <motion.div
                layoutId={`card-${id}`}
                key={`card-${id}`}
                onClick={() => setActive(true)}
                className={cn(
                    `col-span-${width.toString()} rounded-xl bg-[rgba(40,40,40,0.70)] h-full cursor-pointer`,
                    className
                )}
            >
                <div
                    className={`w-full h-full bg-cover rounded-xl ${cardImage ? '' : 'bg-transparent'}`}
                    style={{
                        backgroundImage: cardImage
                            ? `url(${cardImage})`
                            : 'none',
                    }}
                >
                    {children}
                </div>
            </motion.div>
            <AnimatePresence>
                {active && (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 backdrop-blur-sm h-full w-full z-10"
                        />
                        <motion.div
                            layoutId={`card-${id}`}
                            ref={ref}
                            className="w-full max-w-[700px] h-full md:max-h-[50%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden z-[101]"
                        >
                            <h3 className={'header3 m-5'}>hello world</h3>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
