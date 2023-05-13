import Reward from './Reward';

export default class AdventureBoardReward extends Reward {
    exec() {
        this.name =
            this.DB.Loc[this.loc]['master_adventure_boards_text'].texts[
                this.DB.boards[this.id].name
            ].text;
    }
}
