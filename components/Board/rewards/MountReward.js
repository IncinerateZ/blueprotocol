import Reward from './Reward';

export default class MountReward extends Reward {
    exec() {
        const item = this.DB.Mounts[this.id];
        this.name =
            this.DB.Loc[this.loc].master_mount_imagine_text.texts[
                item.mount_name_text_id
            ].text;
    }
}
