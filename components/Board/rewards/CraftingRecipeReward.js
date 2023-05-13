import Reward from './Reward';

export default class CraftingRecipeReward extends Reward {
    exec() {
        console.log(`Crafting Recipe: ${this.id} ${this.type} ${this.amount}`);
    }
}
