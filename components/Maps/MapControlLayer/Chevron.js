import styles from '@/styles/Map.module.css';

import Image from 'next/image';
import React from 'react';
import ChevronLeft from '@/public/map/chevron-left.svg';
export default function Chevron({ drawn, setDrawn }) {
    return (
        <div
            className={styles.MCL_chevron}
            style={{ transform: drawn ? '' : 'translateX(-330px)' }}
        >
            <label className={styles.MCL_chevron_container}>
                <Image
                    src={ChevronLeft.src}
                    width={25}
                    height={25}
                    alt={'Toggle Drawer'}
                    style={{
                        userSelect: 'none',
                        transform: `rotate(${180 * !drawn}deg)`,
                    }}
                ></Image>
                <span className={'visually-hidden'}>Show / Hide Drawer</span>
                <input
                    type='checkbox'
                    className={'visually-hidden'}
                    onClick={() => {
                        setDrawn(!drawn);
                    }}
                ></input>
            </label>
        </div>
    );
}
