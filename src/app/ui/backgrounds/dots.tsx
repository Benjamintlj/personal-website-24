import '@/app/styles/masks.css'
import { ReactDOM, ReactElement, ReactNode, Suspense } from 'react'
import LoadingSkeleton from '@/app/ui/loading/loading-skeleton'

export default function Dots({
    className,
    children,
}: {
    children: ReactNode | ReactElement | ReactElement[]
    className?: string
}) {
    return (
        <Suspense
            fallback={
                <main className="bg-black h-screen w-screen fixed top-0 left-0 flex items-center justify-center">
                    <LoadingSkeleton />
                </main>
            }
        >
            <div className="bg-black bg-dot-white/[0.2] relative flex flex-col items-center justify-start ">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black dots-mask"></div>
                <div className={`relative z-20 ${className}`}>{children}</div>
            </div>
        </Suspense>
    )
}
