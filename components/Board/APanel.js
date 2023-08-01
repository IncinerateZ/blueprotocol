import styles from '@/styles/Board.module.css';
import BoardReward from './rewards/BoardReward';

export default function APanel({
    DB,
    lang,
    panel,
    checked,
    disabled,
    onChange,
    activeBoards,
    colors,
}) {
    const quest = DB.quests[panel.mission_id];
    const rewards = panel.reward_ids;

    function rewardToItem(id, type, amount) {
        const reward = new BoardReward(id, type, amount, lang);
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
        <div className={styles.APanel}>
            <div>
                <h1 className={styles.questTitle}>
                    {
                        DB.Loc[lang].master_adventure_board_quests_text.texts[
                            quest.quest_name
                        ].text
                    }
                </h1>
                {getRewards(rewards).map((e, idx) => (
                    <span key={idx}>{e.build()}</span>
                ))}
            </div>
            <label
                className={styles.APanelCheckbox}
                id={`APanel_${panel.id}`}
                style={{
                    backgroundColor:
                        (activeBoards &&
                            colors[activeBoards[panel.board_id]]) ||
                        '',
                }}
            >
                <input
                    type='checkbox'
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onChange(panel)}
                />
            </label>
        </div>
    );
}
