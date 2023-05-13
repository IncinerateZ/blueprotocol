import Reward from './Reward';

export default class EmoticonReward extends Reward {
    exec() {
        console.log('EMOTICON' + this.id + ' ' + this.type + ' ' + this.amount);
    }
}
