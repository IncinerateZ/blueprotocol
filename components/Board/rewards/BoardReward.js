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
    constructor(id, type, amount, loc) {
        this.reward =
            {
                0: new LunoReward('currency'),
                2: new ExperienceReward('experience'),
                7: new MountReward('mount'),
                // 9: new EmoticonReward('emoticon'),
                10: new StampReward('stamp'),
                11: new ImagineRecipeReward('imagine_recipe'),
                // 14: new AchievementReward('achievement'),
                // 15: new LiquidMemoryReward('liquid_memory'),
                19: new TokenReward('token'),
                20: new CraftingRecipeReward('crafting_recipe'),
                27: new CraftingRecipeSetReward('crafting_recipe_set'),
                28: new AdventureBoardReward('board'),
                30: new WarehouseAbilityReward('warehouse_ability'),
                // 33: new ChoiceReward('choice'),
            }[type] || new ItemReward('item');

        this.reward.create(id, type, amount, loc);
    }
}
