import Reward from './Reward';

export default class ItemReward extends Reward {
    exec() {
        const item = this.DB.Items[this.id];
        if (!item) return (this.name = `[Unknown ${this.id}]`);

        this.name = this.DB.Loc[this.loc].item_text.texts[item.name].text;
    }
}
