import Reward from './Reward';

export default class TokenReward extends Reward {
    exec() {
        this.name =
            this.DB.Loc[this.loc].master_token_text.texts[
                this.DB.Tokens[this.id].name
            ].text;
    }
}
