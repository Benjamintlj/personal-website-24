import { motion } from 'framer-motion'

export const Circle = ({
    className,
    strokeWidth = 3,
    radius = 40,
    size = 100,
}: {
    className?: string
    strokeWidth?: number
    radius?: number
    size?: number
}) => {
    return (
        <svg className={className} height={size} width={size}>
            <defs>
                <linearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                        offset="0%"
                        style={{ stopColor: '#60A5FA', stopOpacity: 0 }}
                    />
                    <stop
                        offset="50%"
                        style={{ stopColor: '#60A5FA', stopOpacity: 1 }}
                    />
                    <stop
                        offset="100%"
                        style={{ stopColor: '#60A5FA', stopOpacity: 0 }}
                    />
                </linearGradient>
            </defs>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={`${radius}`}
                stroke="url(#fade)"
                strokeWidth={`${strokeWidth}`}
                fill="none"
            />
        </svg>
    )
}

export const WifiCircles = () => {
    return (
        <div>
            <div
                style={{
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                    top: '-65%',
                    left: '55%',
                }}
            >
                <Circle
                    className={`absolute transform group-hover:-translate-x-5 duration-500`}
                    size={363}
                    radius={60}
                />
                <Circle
                    className={`absolute transform group-hover:-translate-x-5 duration-500 delay-150`}
                    size={363}
                    radius={120}
                />
                <Circle
                    className={`absolute transform group-hover:-translate-x-5 duration-500 delay-300`}
                    size={363}
                    radius={180}
                />
            </div>
        </div>
    )
}
