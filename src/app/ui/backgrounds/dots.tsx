import '@/app/styles/masks.css'
import { ReactDOM, ReactElement, ReactNode } from 'react'

export default function Dots({
    children,
}: {
    children: ReactNode | ReactElement | ReactElement[]
}) {
    return (
        <div className="dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex flex-col items-center justify-start ">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white dots-mask"></div>
            <div className="relative z-20">{children}</div>
        </div>
    )
}
