import styles from '@/styles/Map.module.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function FloorPicker({ floors, chosenFloor, setChosenFloor }) {
    const router = useRouter();

    if (!floors || floors.length === 0) return <></>;

    const z = router.query.z;
    if (z) {
        for (let f = 1; f <= floors.length + 1; f++) {
            let floorLowBound = floors?.[f - 2] || -Infinity;
            let floorHighBound = floors?.[f - 1] || Infinity;

            if (z >= floorLowBound && z <= floorHighBound) {
                if (f !== chosenFloor) setChosenFloor(f);
                break;
            }
        }
    }

    return (
        <ul className={styles.FloorPicker_container}>
            {[...floors, 0].map((floor, idx) => {
                return (
                    <li key={idx}>
                        <button
                            className={`${styles.FloorPicker_option} ${
                                idx + 1 === chosenFloor
                                    ? styles.chosenFloor
                                    : ''
                            }`}
                            onClick={() => {
                                router.push(
                                    {
                                        pathname: '/map',
                                        query: {
                                            z:
                                                (floors[idx - 1] || -Infinity) +
                                                1,
                                        },
                                        hash: router.asPath.split('#')[1],
                                    },
                                    undefined,
                                    {
                                        shallow: true,
                                    },
                                );
                            }}
                        >
                            {idx + 1}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
