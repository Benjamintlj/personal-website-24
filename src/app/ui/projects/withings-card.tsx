import Image from 'next/image'
import styles from './featured-projects.module.css'

export default function WithingsCard() {
    return (
        <div className={styles.withings}>
            <div className={styles.withingsHeading}>
                <h3>Withings Scales</h3>
            </div>
            <div className={styles.scale}>
                <Image src="/images/withings/body-smart-black.jpg" alt="Withings Body Smart scale in black" width={1024} height={1024} unoptimized />
            </div>
        </div>
    )
}
