import styles from '@/styles/Board.module.css';
import AQuest from './AQuest';
import { useState } from 'react';

export default function AQuestList({
    DB,
    lang,
    setLang,
    activeBoards,
    handleToggleBoard,
    boardStatuses,
    setBoardStatuses,
    colors,
}) {
    const [selectedFilter1, setFilter1] = useState('');
    const [selectedFilter2, setFilter2] = useState('');

    function statusToColor(_status) {
        return {
            'In Progress': 'lightgreen',
            'Not Started': 'lightgray',
            Inactive: '#A7A2A9',
            Completed: '#FFE14E',
        }[_status];
    }

    function toLocale(s, lang) {
        if (lang === 'en_US') return s;
        return (
            {
                'Adventure Rankup': '冒険者ランクアップ',
                Weapon: '武器',
                Echo: 'イマジン',
                Class: 'クラス',
                Misc: 'その他',
                'Not Started': '受注可能',
                Inactive: '遊休',
                'In Progress': '進行中',
                Completed: '完了',
            }[s] || s
        );
    }

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
        <div>
            <div className={styles.AFilters}>
                {['Adventure Rankup', 'Weapon', 'Echo', 'Class', 'Misc'].map(
                    (filter1) => (
                        <label
                            key={filter1}
                            style={{
                                marginRight: '0.3rem',
                                backgroundColor:
                                    selectedFilter1 === filter1
                                        ? 'rgba(200,200,200,0.5)'
                                        : '',
                            }}
                            className={styles.AFilter}
                        >
                            {toLocale(filter1, lang)}
                            <input
                                type='checkbox'
                                className='visually-hidden'
                                onChange={() => {
                                    if (filter1 === selectedFilter1)
                                        return setFilter1('');
                                    setFilter1(filter1);
                                }}
                            ></input>
                        </label>
                    ),
                )}
                {['Not Started', 'Inactive', 'In Progress', 'Completed'].map(
                    (filter2) => (
                        <label
                            key={filter2}
                            style={{
                                marginRight: '0.3rem',
                                backgroundColor:
                                    selectedFilter2 === filter2
                                        ? 'rgba(200,200,200,0.5)'
                                        : '',
                                color: statusToColor(filter2),
                            }}
                            className={styles.AFilter}
                        >
                            {filter2}
                            <input
                                type='checkbox'
                                className='visually-hidden'
                                onChange={() => {
                                    if (filter2 === selectedFilter2)
                                        return setFilter2('');
                                    setFilter2(filter2);
                                }}
                            ></input>
                        </label>
                    ),
                )}
            </div>
            <ul className={styles.BoardList}>
                {Object.keys(DB.boards).map((boardId) => (
                    <li key={`BL_${boardId}`}>
                        <AQuest
                            DB={DB}
                            lang={lang}
                            boardId={boardId}
                            handleToggleBoard={handleToggleBoard}
                            selected={activeBoards[boardId] || false}
                            status={getStatus(boardId)}
                            filter1={selectedFilter1}
                            filter2={selectedFilter2}
                            statusToColor={statusToColor}
                            activeBoards={activeBoards}
                            colors={colors}
                            progress={getProgress(boardId)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
