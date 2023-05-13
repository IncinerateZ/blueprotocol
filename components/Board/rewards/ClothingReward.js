import Reward from './Reward';

export default class StReward extends Reward {
    exec() {
        console.log(`CLOTHING: ${this.id} ${this.type} ${this.amount}`);
    }
}
