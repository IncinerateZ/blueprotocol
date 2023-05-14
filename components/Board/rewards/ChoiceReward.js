import Reward from './Reward';

export default class ChoiceReward extends Reward {
    exec() {
        console.log(`Choice: ${this.id} ${this.type} ${this.amount}`);
    }
}
