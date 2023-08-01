import styles from '@/styles/Board.module.css';
import Image from 'next/image';

import AdvancedViewIcon from '@/public/board/advancedview.svg';
import InteractiveViewIcon from '@/public/board/interactiveview.svg';

export default function ViewToggle({ view, toggleView }) {
    return (
        <div className={styles.ViewToggleContainer}>
            <div className={styles.ViewToggle} onClick={toggleView}>
                <div className={styles.state}>
                    <Image
                        src={InteractiveViewIcon}
                        width={10}
                        alt='interactive view'
                    />
                </div>
                <div className={styles.state}>
                    <Image
                        src={AdvancedViewIcon}
                        width={13}
                        alt='advanced view'
                    />
                </div>
            </div>
            <button
                className={styles.stateFrame}
                style={{
                    transform: `translate(${view ? '0' : '85'}%, -115%)`,
                }}
                onClick={toggleView}
            ></button>
        </div>
    );
}
