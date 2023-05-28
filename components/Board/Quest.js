import styles from '@/styles/Board.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Quest({ e, DB, loc, displayOverlay }) {
    const [fallbackImage, setFallbackImage] = useState(false);

    const router = useRouter();

    return (
        <button
            style={{
                display: fallbackImage ? 'none' : 'flex',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                padding: '0',
            }}
            className={styles.quest}
            onClick={() => {
                router.push(`/board/${e.id}`, undefined, { shallow: true });
                displayOverlay(e);
            }}
            id={`Quest_${e.id}`}
        >
            <Image
                src={
                    fallbackImage
                        ? '/board/quests/UI_Adventureboard_NoData.webp'
                        : `/board/quests/UI_Adventureboard_${e.icon_id}.webp`
                }
                width={190}
                height={123}
                alt={e.icon_id}
                onError={() => {
                    setFallbackImage(true);
                }}
                className={styles.questThumbnail}
            ></Image>
            <div className={styles.questTitleContainer}>
                <label className={styles.questTitle} htmlFor={`Quest_${e.id}`}>
                    {
                        DB.Loc[loc]['master_adventure_boards_text'].texts[
                            e.name
                        ]?.text
                    }
                </label>
            </div>
            <h1>Unlocked From</h1>
            <p>
                {DB.Sources[e.id] ? (
                    DB.Sources[e.id].charAt(0) === 'Q' ? (
                        <Link
                            href={`/map?query=${e.id}`}
                            style={{ color: '#3366CC' }}
                            target='_blank'
                        >
                            Completing{' '}
                            {DB.Loc[loc][
                                `quest_${
                                    {
                                        M: 'main',
                                        S: 'sub',
                                        E: 'main',
                                    }[DB.Sources[e.id].charAt(1)]
                                }_chapter${DB.Sources[e.id].substring(
                                    4,
                                    6,
                                )}_text`
                            ]?.texts[
                                DB.srcQuests[DB.Sources[e.id]?.substring(1)]
                                    ?.name
                            ]?.text || DB.Sources[e.id]?.substring(1)}
                        </Link>
                    ) : DB.Sources[e.id].charAt(0) === 'A' ? (
                        <Link
                            href={
                                DB.Sources[e.id].substring(
                                    4,
                                    DB.Sources[e.id].length - 3,
                                ) +
                                '000/' +
                                DB.Sources[e.id].substring(4)
                            }
                            style={{ color: '#3366CC' }}
                            target='_blank'
                        >
                            Adventure Board {DB.Sources[e.id].substring(4)}
                        </Link>
                    ) : DB.Sources[e.id].charAt(0) === 'D' ? (
                        `Clearing 
                            ${
                                DB.LocationNames[loc][
                                    DB.Sources[e.id].substring(1)
                                ] || DB.Sources[e.id].substring(1)
                            }`
                    ) : (
                        <Link
                            href={`/map?query=${DB.Sources[e.id]?.substring(
                                1,
                            )}`}
                            style={{ color: '#3366CC' }}
                            target='_blank'
                        >
                            Treasure Box {DB.Sources[e.id]?.substring(1)}
                        </Link>
                    )
                ) : (
                    'Adventure Rankup'
                )}
            </p>
            <div className={styles.questId}>
                <span>ID {e.id}</span>
            </div>
        </button>
    );
}
