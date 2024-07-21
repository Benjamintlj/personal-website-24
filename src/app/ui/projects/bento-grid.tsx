import { cn } from '@/app/lib/utils'
import React from 'react'

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
    if (width > 2)
        throw new Error('Invalid input: width should not be greater than 2.')

    return (
        <div
            className={cn(
                `col-span-${width.toString()} rounded-xl bg-[rgba(40,40,40,0.70)] h-full`,
                className
            )}
        >
            <div
                className={`w-full h-full bg-cover rounded-xl ${cardImage ? '' : 'bg-transparent'}`}
                style={{
                    backgroundImage: cardImage ? `url(${cardImage})` : 'none',
                }}
            >
                {children}
            </div>
        </div>
    )
}
