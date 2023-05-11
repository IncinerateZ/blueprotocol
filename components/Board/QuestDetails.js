import styles from '@/styles/Board.module.css';
import { useEffect } from 'react';

export default function QuestDetails({
    DB,
    loc,
    selectedQuest,
    setSelectedQuest,
}) {
    const quest = DB.quests[selectedQuest];

    return (
        <div
            className={styles.questDetailsContainer}
            onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedQuest(null);
            }}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div
                className={styles.questDetails}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <h5>
                    {
                        DB.Loc[loc].master_adventure_board_quests_text.texts[
                            quest.quest_name
                        ].text
                    }
                </h5>
                <p>0 / {quest.quest_achievement_condition.complete_value}</p>
            </div>
        </div>
    );
}
