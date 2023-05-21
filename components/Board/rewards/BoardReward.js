import ItemReward from './ItemReward';
import MountReward from './MountReward';
import EmoticonReward from './EmoticonReward';
import AchievementReward from './AchievementReward';
import LiquidMemoryReward from './LiquidMemoryReward';
import CraftingRecipeReward from './CraftingRecipeReward';
import CraftingRecipeSetReward from './CraftingRecipeSetReward';
import AdventureBoardReward from './AdventureBoardReward';
import WarehouseAbilityReward from './WarehouseAbilityReward';
import ChoiceReward from './ChoiceReward';
import StampReward from './StampReward';
import ImagineRecipeReward from './ImagineRecipeReward';
import LunoReward from './LunoReward';
import ExperienceReward from './ExperienceReward';
import TokenReward from './TokenReward';

export default class BoardReward {
    constructor(id, type, amount, loc, db_path = '../data/DB.json') {
        this.reward =
            {
                0: new LunoReward('currency', db_path),
                2: new ExperienceReward('experience', db_path),
                7: new MountReward('mount', db_path),
                // 9: new EmoticonReward('emoticon', db_path),
                10: new StampReward('stamp', db_path),
                11: new ImagineRecipeReward('imagine_recipe', db_path),
                // 14: new AchievementReward('achievement', db_path),
                15: new LiquidMemoryReward('liquid_memory', db_path),
                19: new TokenReward('token', db_path),
                20: new CraftingRecipeReward('crafting_recipe', db_path),
                27: new CraftingRecipeSetReward('crafting_recipe_set', db_path),
                28: new AdventureBoardReward('board', db_path),
                30: new WarehouseAbilityReward('warehouse_ability', db_path),
                // 33: new ChoiceReward('choice', db_path),
            }[type] || new ItemReward('item', db_path);

        this.reward.create(id, type, amount, loc);
    }
}
