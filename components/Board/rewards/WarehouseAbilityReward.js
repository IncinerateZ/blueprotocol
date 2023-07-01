import Reward from './Reward';

export default class WarehouseAbilityReward extends Reward {
    exec() {
        this.name =
            this.DB.Loc[this.loc][
                'master_warehouse_ability_recipes_text'
            ].texts[this.DB.WarehouseAbilities[this.id].name].text;
    }
}
