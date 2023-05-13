import styles from '@/styles/Board.module.css';
import ItemReward from './rewards/ItemReward';
import MountReward from './rewards/MountReward';
import EmoticonReward from './rewards/EmoticonReward';
import AchievementReward from './rewards/AchievementReward';
import LiquidMemoryReward from './rewards/LiquidMemoryReward';
import CraftingRecipeReward from './rewards/CraftingRecipeReward';
import CraftingRecipeSetReward from './rewards/CraftingRecipeSetReward';
import AdventureBoardReward from './rewards/AdventureBoardReward';
import WarehouseAbilityRecipeReward from './rewards/WarehouseAbilityRecipeReward';
import ChoiceReward from './rewards/ChoiceReward';
import StampReward from './rewards/StampReward';
import ImagineRecipeReward from './rewards/ImagineRecipeReward';
import LunoReward from './rewards/LunoReward';
import ExperienceReward from './rewards/ExperienceReward';

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
    getRewards(rewards);

    function rewardToItem(id, type, amount) {
        let res = {};
        const reward =
            {
                0: new LunoReward('currency'),
                2: new ExperienceReward('experience'),
                7: new MountReward('mount'),
                9: new EmoticonReward('emoticon'),
                10: new StampReward('stamp'),
                11: new ImagineRecipeReward('imagine_recipe'),
                14: new AchievementReward('achievement'),
                15: new LiquidMemoryReward('liquid_memory'),
                20: new CraftingRecipeReward('crafting_recipe'),
                27: new CraftingRecipeSetReward('crafting_recipe_set'),
                28: new AdventureBoardReward('board'),
                30: new WarehouseAbilityRecipeReward(
                    'warehouse_ability_recipe',
                ),
                33: new ChoiceReward('choice'),
            }[type] || new ItemReward('item');

        reward.create(id, type, amount, loc);
        console.log(reward);
        return res;
    }

    function getRewards(rewards) {
        let res = {};
        for (let reward of rewards) {
            reward = DB.Rewards[reward.reward_id];
            rewardToItem(reward.item_id, reward.reward_type, reward.amount);
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
