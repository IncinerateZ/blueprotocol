import styles from '@/styles/Board.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { statusToColor } from '../utils';

export default function Quest({
    e,
    DB,
    loc,
    displayOverlay,
    colors,
    activeBoards,
    boardStatuses,
}) {
    const [fallbackImage, setFallbackImage] = useState(false);

    const router = useRouter();

    const jpName =
        DB.Loc['ja_JP']['master_adventure_boards_text'].texts[e.name]?.text;

    const progress = getProgress(e.id);

    function getStatus(boardId) {
        let board = boardStatuses[boardId];
        if (
            activeBoards[boardId] &&
            (!board ||
                (board &&
                    Object.keys(board.completed).length <
                        Object.keys(DB.boards[boardId].panels).length))
        )
            return 'In Progress';
        if (!board || Object.keys(board.completed).length === 0)
            return 'Not Started';
        if (
            Object.keys(board.completed).length <
            Object.keys(DB.boards[boardId].panels).length
        )
            return 'Inactive';
        return 'Completed';
    }

    function getProgress(boardId) {
        let board = boardStatuses[boardId];
        return {
            completed: Object.keys(board?.completed || {}).length,
            total: Object.keys(DB.boards[boardId].panels || {}).length,
        };
    }

    return (
        <button
            style={{
                display: fallbackImage ? 'none' : 'flex',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                padding: '0',
                borderColor: colors[activeBoards[e.id] || -1] || 'var(--light)',
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
            <div
                className={styles.questTitleContainer}
                style={{
                    borderColor:
                        colors[activeBoards[e.id] || -1] || 'var(--light)',
                }}
            >
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
                            href={`/map?query=${e.id}&auto=true`}
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
                            )}&auto=true`}
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
                {jpName.includes('E-') ? (
                    <Link
                        href={`https://bapharia.com/db?search=${jpName.substring(
                            0,
                            jpName.indexOf('ボード'),
                        )}`}
                        style={{ color: '#3366CC' }}
                        target='_blank'
                    >
                        ID {e.id}
                    </Link>
                ) : jpName.includes('武器') ? (
                    <Link
                        href={`https://bapharia.com/db?search=${jpName.substring(
                            0,
                            jpName.indexOf('武器'),
                        )}`}
                        style={{
                            color: '#3366CC',
                        }}
                        target='_blank'
                    >
                        ID {e.id}
                    </Link>
                ) : (
                    <span>ID {e.id}</span>
                )}
                <span
                    style={{
                        right: 0,
                        color: statusToColor(getStatus(e.id)),
                        position: 'relative',
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            width: '100%',
                            transform: 'translate(0%, -90%)',
                            display: 'inline-block',
                        }}
                    >
                        {progress.completed} / {progress.total}
                    </span>
                    {getStatus(e.id)}
                </span>
            </div>
        </button>
    );
}
