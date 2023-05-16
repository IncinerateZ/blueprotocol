import styles from '@/styles/Board.module.css';
import BoardReward from './rewards/BoardReward';

export default function QuestDetails({
    DB,
    loc,
    panel,
    selectedQuest,
    setSelectedQuest,
}) {
    const quest = DB.quests[selectedQuest];

    panel = panel.panel;

    let rewards = panel.reward_ids;

    function rewardToItem(id, type, amount) {
        const reward = new BoardReward(id, type, amount, loc);
        return reward.reward;
    }

    function getRewards(rewards) {
        let res = [];
        for (let reward of rewards) {
            reward = DB.Rewards[reward.reward_id];
            res.push(
                rewardToItem(reward.item_id, reward.reward_type, reward.amount),
            );
        }

        return res;
    }

    return (
        <div
            className={styles.questDetailsContainer}
            onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedQuest(null);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            id='qdc'
        >
            <div
                className={styles.questDetails}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <h1>
                    {
                        DB.Loc[loc].master_adventure_board_quests_text.texts[
                            quest.quest_name
                        ].text
                    }
                </h1>
                <p>0 / {quest.quest_achievement_condition.complete_value}</p>
                <h2 style={{ marginTop: '0.5rem' }}>Rewards</h2>
                <div style={{ fontSize: '0.75rem' }}>
                    {getRewards(rewards).map((e) => e.build())}
                </div>
                <span>ID {quest.id}</span>
            </div>
        </div>
    );
}
