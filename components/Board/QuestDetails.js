import styles from '@/styles/Board.module.css';

export default function QuestDetails({
    DB,
    loc,
    panel,
    selectedQuest,
    setSelectedQuest,
}) {
    // 0-3, 11, 17-19,: item / money
    // 7: mount
    // 9: emotion
    // 10: clothing
    // 14: achievement
    // 15: memory
    // 20: craft
    // 27: craft set
    // 28: board
    // 30: warehouse ability recipe
    // 33: pick reward

    const quest = DB.quests[selectedQuest];

    panel = panel.panel;

    let rewards = panel.reward_ids;
    console.log(rewards);

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
                <span>ID {quest.id}</span>
            </div>
        </div>
    );
}
