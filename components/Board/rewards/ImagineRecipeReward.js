import Reward from './Reward';

export default class ImagineRecipeReward extends Reward {
    exec() {
        this.name =
            this.DB.Loc[this.loc]['master_imagine_text'].texts[
                this.DB.Imagines[this.id].imagine_name
            ].text;
    }
}
