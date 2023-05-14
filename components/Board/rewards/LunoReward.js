import Reward from './Reward';

export default class LunoReward extends Reward {
    exec() {
        this.name = { en_US: 'Luno', ja_JP: 'ルーノ' }[this.loc];
    }
}
