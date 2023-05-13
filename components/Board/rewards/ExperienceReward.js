import Reward from './Reward';

export default class ExperienceReward extends Reward {
    exec() {
        this.name = { en_US: 'Experience Points', ja_JP: '経験値' }[this.loc];
    }
}
