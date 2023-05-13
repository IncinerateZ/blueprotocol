import Reward from './Reward';

export default class StampReward extends Reward {
    exec() {
        this.name = `Chat Stamp #${this.id}`;
    }
}
