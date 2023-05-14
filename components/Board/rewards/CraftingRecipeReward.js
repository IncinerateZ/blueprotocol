import ItemReward from './ItemReward';
import Reward from './Reward';

export default class CraftingRecipeReward extends Reward {
    exec() {
        let recipe = this.DB.CraftRecipes[this.id];

        let item = new ItemReward('crafting_recipe');
        item.create(recipe.out_item_id, 1, this.amount, this.loc);

        this.name = item.name + ' Recipe';
    }
}
