import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from '@/styles/Board.module.css';

export default function AQuest({
    DB,
    lang,
    boardId,
    handleToggleBoard,
    selected,
    status,
    filter1,
    filter2,
    statusToColor,
    activeBoards,
    colors,
    progress,
}) {
    const [errored, setErrored] = useState(false);

    const board = DB.boards[boardId];

    function toLocale(s, lang) {
        if (lang === 'en_US') return s;
        return (
            {
                'Not Started': '受注可能',
                Inactive: '遊休',
                'In Progress': '進行中',
                Completed: '完了',
            }[s] || s
        );
    }
    useEffect(() => {
        let title =
            DB.Loc['ja_JP']['master_adventure_boards_text'].texts[board.name]
                ?.text;
        let miscFilter = [
            '冒険者ランクアップ',
            '武器',
            'E-',
            'ー用闘士の護符',
        ].reduce(
            (p, c) => (title.includes(c) ? 1 : 0) + p,

            0,
        );

        if (
            (filter1 !== 'Misc' &&
                !title.includes(
                    {
                        'Adventure Rankup': '冒険者ランクアップ',
                        Weapon: '武器',
                        Echo: 'E-',
                        Class: 'ー用闘士の護符',
                    }[filter1] || filter1,
                )) ||
            (filter1 === 'Misc' && miscFilter >= 1) ||
            (filter2.length > 0 && status !== filter2)
        ) {
            setErrored(true);
        } else {
            setErrored(false);
        }
    }, [filter1, filter2]);

    return (
        <label
            className={styles.AQuest}
            style={{
                display: errored ? `none` : `flex`,
                backgroundColor: selected ? colors[activeBoards[boardId]] : '',
            }}
        >
            <Image
                src={`/board/quests/UI_Adventureboard_${board.icon_id}.webp`}
                width={100}
                height={63}
                alt={`Board ${boardId}`}
                onError={() => {
                    setErrored(true);
                }}
            ></Image>
            <h2>
                {
                    DB.Loc[lang]['master_adventure_boards_text'].texts[
                        board.name
                    ]?.text
                }
            </h2>
            <span className={styles.AProgressLabel}>
                {progress.completed} / {progress.total}
            </span>
            <span
                style={{
                    color: statusToColor(status),
                }}
            >
                {status}
            </span>
            <input
                type='checkbox'
                checked={selected}
                onChange={() => {
                    handleToggleBoard(boardId);
                }}
                name='board'
                className='visually-hidden'
            ></input>
        </label>
    );
}
