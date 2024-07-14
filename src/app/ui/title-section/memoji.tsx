export default function Memoji({ className }) {
    return (
        <video
            className={`object-cover ${className}`}
            autoPlay
            loop
            muted
            playsInline
        >
            <source
                src="/videos/memoji-hevc.mov"
                type='video/mp4; codecs="hvc1"'
            />
            <source src="/videos/memoji.webm" type="video/webm" />
        </video>
    )
}
