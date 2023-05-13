import Reward from './Reward';

export default class CraftingRecipeSetReward extends Reward {
    exec() {
        console.log(
            `Crafting Recipe Set: ${this.id} ${this.type} ${this.amount}`,
        );
    }
}
