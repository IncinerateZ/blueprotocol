import Reward from './Reward';

export default class WarehouseAbilityRecipeReward extends Reward {
    exec() {
        console.log(
            `Warehouse Ability Recipe: ${this.id} ${this.type} ${this.amount}`,
        );
    }
}
