import Reward from './Reward';

export default class AchievementReward extends Reward {
    exec() {
        console.log(`Achievement: ${this.id} ${this.type} ${this.amount}`);
    }
}
