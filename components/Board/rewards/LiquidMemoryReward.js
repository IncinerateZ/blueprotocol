import Reward from './Reward';

export default class LiquidMemoryReward extends Reward {
    exec() {
        console.log(`Liquid Memory: ${this.id} ${this.type} ${this.amount}`);
    }
}
