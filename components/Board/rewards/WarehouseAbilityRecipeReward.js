import Reward from './Reward';

export default class WarehouseAbilityRecipeReward extends Reward {
    exec() {
        //dragon weapon day 1 4:57:23
        //E-geboku day 1 8:06:42

        console.log(
            `Warehouse Ability Recipe: ${this.id} ${this.type} ${this.amount}`,
        );
    }
}
