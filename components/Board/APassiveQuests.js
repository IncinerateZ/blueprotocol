import styles from '@/styles/Board.module.css';
import APanel from './APanel';

export default function APassiveQuests({
    DB,
    lang,
    boardStatuses,
    setBoardStatuses,
    upcomingQuests,
    completedQuests,
    allPanels,
    activeBoards,
    colors,
}) {
    function handleUncomplete(panel) {
        const board = DB.boards[panel.board_id];

        const temp = { ...boardStatuses };
        delete temp[board.id].completed[panel.id];
        setBoardStatuses(temp);
    }
    return (
        <div className={styles.PassiveQuests}>
            <div>
                <h2 style={{ textAlign: 'center' }}>Upcoming Quests</h2>
                <ul className={styles.UpcomingQuests}>
                    {Object.keys(upcomingQuests).length > 0 ? (
                        Object.keys(upcomingQuests).map((panelId) => (
                            <li key={panelId}>
                                <APanel
                                    DB={DB}
                                    lang={lang}
                                    panel={
                                        allPanels[
                                            panelId.substring(
                                                0,
                                                panelId.length - 1,
                                            )
                                        ]
                                    }
                                    checked={false}
                                    disabled={true}
                                    activeBoards={activeBoards}
                                    colors={colors}
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
            <div>
                <h2 style={{ textAlign: 'center' }}>Completed Quests</h2>
                <ul className={styles.CompletedQuests}>
                    {Object.keys(completedQuests).length > 0 ? (
                        Object.keys(completedQuests).map((panelId) => (
                            <li key={panelId}>
                                <APanel
                                    DB={DB}
                                    lang={lang}
                                    panel={allPanels[panelId]}
                                    checked={true}
                                    onChange={handleUncomplete}
                                    activeBoards={activeBoards}
                                    colors={colors}
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
        </div>
    );
}
