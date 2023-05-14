import Reward from './Reward';

export default class CraftingRecipeSetReward extends Reward {
    exec() {
        this.name =
            this.DB.Loc[this.loc]['master_craft_recipe_set_text'].texts[
                this.DB.CraftRecipes[this.id].name
            ].text;
    }
}
