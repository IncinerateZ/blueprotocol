const fs = require('fs');

let files = fs.readdirSync('./out');

let chunks = {};

for (let file of files) {
    let cat = file.substring(0, file.indexOf('-'));
    if (!chunks[cat]) chunks[cat] = {};

    let res = require(`./out/${file}`);
    chunks[cat][file] = [];

    for (let r of res) chunks[cat][file].push(r.text);
}

const cats = [
    'Common',
    'DungeonName',
    'EngineerReloadAlert',
    'GunslingerReloadAlert',
    'NoticeBoard',
    'SplashReloadAlert',
    'Test',
    'YesNoPopup',
    'achievements_text',
    'category_text',
    'costume_text',
    'enemyparam_RaceId_text',
    'enemyparam_text',
    'item_text',
    'master_adventure_board_quests_text',
    'master_adventure_boards_text',
    'master_aesthe_course_text',
    'master_attackbase_text',
    'master_challenge_quest_text',
    'master_coin_shop_text',
    'master_craft_recipe_set_text',
    'master_currency_shop_text',
    'master_emote_text',
    'master_gasha_text',
    'master_guild_rank_reward_text',
    'master_imagine_text',
    'master_liquid_memory_text',
    'master_log_text',
    'master_login_bonus_text',
    'master_mail_format_text',
    'master_mail_text',
    'master_material_auto_delivery_text',
    'master_merchandise_commodity_text',
    'master_mission_quest_contents_text',
    'master_mission_quest_text',
    'master_mount_expedition_text',
    'master_mount_imagine_text',
    'master_network_cafe_reward_mail_text',
    'master_perk_effect_text',
    'master_perk_trigger_text',
    'master_quest_auto_order_bonus_text',
    'master_quest_auto_order_daily_text',
    'master_quest_auto_order_guide_text',
    'master_quest_auto_order_season_text',
    'master_quest_auto_order_weekly_text',
    'master_raid_settings_text',
    'master_ranking_setting_text',
    'master_season_pass_shop_text',
    'master_season_pass_text',
    'master_season_text',
    'master_serial_code_campaign_text',
    'master_shop_realmoney_item_text',
    'master_shop_text',
    'master_skill_data_text',
    'master_skilltype_text',
    'master_stamp_categories_text',
    'master_storage_expansion_tickets_text',
    'master_terms_of_use_text',
    'master_theater_demo_text',
    'master_token_text',
    'master_warehouse_ability_recipes_text',
    'perk_text',
    'quest_challenge_text',
    'quest_class_text',
    'quest_main_chapter01_text',
    'quest_main_chapter02_text',
    'quest_main_chapter03_text',
    'quest_main_chapter04_text',
    'quest_main_chapter05_text',
    'quest_main_chapter06_text',
    'quest_main_text',
    'quest_sub_chapter01_text',
    'quest_sub_chapter02_text',
    'quest_sub_chapter03_text',
    'quest_sub_chapter04_text',
    'quest_sub_text',
    'quest_test_text',
    'rarity_text',
    'season_pass_quest_text',
    'stamp_text',
    'weapon_perk_text',
    'weapon_text',
];

let res = require('../apiext/texts/en_US.json');

for (let cat of res) {
    let texts = cat.texts;
    cat = cat.name;

    console.log(cat);

    let idx = 0;

    for (let i = 0; i < Object.keys(chunks[cat]).length; i++) {
        console.log(i);
        for (let e of chunks[cat][`${cat}-${i}.json`]) {
            texts[idx++].text = e;
            // console.log(texts[idx++].text + ' -> ' + e);
        }
    }
}

console.log('Done. Saving...');
fs.writeFile('./final/en_US.json', JSON.stringify(res), (err) => {
    err && console.log(err);
});
