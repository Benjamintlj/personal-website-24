import LoadingSkeleton from '@/app/ui/loading/loading-skeleton'

export default function Loading() {
    console.log('loading')

    return (
        <main className="bg-black h-screen w-screen fixed top-0 left-0 flex items-center justify-center">
            <LoadingSkeleton />
        </main>
    )
}
