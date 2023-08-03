import styles from '@/styles/Board.module.css';
import { useEffect, useState } from 'react';
import APanel from './APanel';

export default function AActiveQuests({
    DB,
    lang,
    boardStatuses,
    setBoardStatuses,
    activeQuests,
    allPanels,
    activeBoards,
    colors,
    pathQuests,
}) {
    function handleComplete(panel) {
        const board = DB.boards[panel.board_id];

        const temp = { ...boardStatuses };
        if (!temp[board.id]) temp[board.id] = { completed: {} };
        temp[board.id].completed[panel.id] = true;
        setBoardStatuses(temp);
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Active Quests</h2>
            <ul className={styles.ActiveQuests}>
                {Object.keys(activeQuests).length > 0 ? (
                    Object.keys(activeQuests).map((panelId) => (
                        <li key={`AA_${panelId}`}>
                            <APanel
                                DB={DB}
                                lang={lang}
                                panel={
                                    allPanels[
                                        panelId.substring(0, panelId.length - 1)
                                    ]
                                }
                                checked={false}
                                onChange={handleComplete}
                                activeBoards={activeBoards}
                                colors={colors}
                                isPath={
                                    pathQuests[
                                        panelId.substring(0, panelId.length - 1)
                                    ]
                                }
                            />
                        </li>
                    ))
                ) : (
                    <h3
                        style={{
                            textAlign: 'center',
                            color: 'var(--text-color)',
                        }}
                    >
                        Empty
                    </h3>
                )}
            </ul>
        </div>
    );
}
