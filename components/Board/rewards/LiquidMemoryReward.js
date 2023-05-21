import Reward from './Reward';

export default class LiquidMemoryReward extends Reward {
    exec() {
        const lm = this.DB.LiquidMemories[this.id];
        this.name = `Liquid Memory: ${
            this.DB.Loc[this.loc]['master_liquid_memory_text'].texts[lm].text
        }`;
    }
}
