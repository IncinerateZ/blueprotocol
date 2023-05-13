//2023-05-13

const fs = require('fs');

const MapTypeMapping = { field: 'fld', dungeon: 'dng', pat: 'pat' };

const DB = {
    EnemySets: { field: {}, dungeon: {}, pat: {} },
    EnemyHabitats: {},
    Enemies: {},
    Items: {},
    Loc: { ja_JP: {}, en_US: {} },
    LocationNames: { en_US: {}, ja_JP: {} },
    POI: { cty: {}, fld: {}, dng: {}, pat: {} },
    Treasures: { fld: {}, dng: {}, pat: {} },
    Boards: {},
};

for (let board of require('./apiext/master_adventure_board.json'))
    DB.Boards[board.id] = board.name;

const CQST = {};
let t = require(`./apiext/masterchallengequest.json`);
for (let quest of t) CQST[quest.quest_id] = quest;

const raidNames = {};
for (let raid of require('./apiext/master_raid_settings.json'))
    for (let gate of raid.entry_gate) raidNames[gate.name_text] = raid.map_id;

for (let loc in DB.Loc) {
    text = require(`./apiext/texts/${loc}.json`);
    if (loc !== 'ja_JP') DB.Loc[loc] = { ...DB.Loc.ja_JP };

    for (let cat of text) {
        if (
            ![
                'enemyparam_text',
                'item_text',
                'master_adventure_boards_text',
            ].includes(cat.name)
        )
            continue;
        DB.Loc[loc][cat.name] = {
            ...DB.Loc[loc][cat.name],
            name: cat.name,
            texts: DB.Loc[loc][cat.name]?.texts
                ? { ...DB.Loc[loc][cat.name].texts }
                : {},
        };

        for (let o of cat.texts) DB.Loc[loc][cat.name].texts[o.id] = { ...o };
    }
}

for (let enemy of require('./apiext/enemyparams.json'))
    DB.Enemies[enemy.enemy_id] = enemy;

for (let item of require('./apiext/items.json'))
    DB.Items[item.id] = { ...item };

for (let treasure of require('./apiext/treasures.json'))
    DB.Treasures[treasure.id] = { ...treasure };

for (let location of require('./Text/LocationName.json')[0].Properties
    .TextTable)
    DB.LocationNames.ja_JP[location.Id.IdString] = location.Text;

DB.LocationNames.en_US = { ...require('./LocationNames_EN.json') };

for (let mapType in DB.EnemySets) {
    let t = require(`./Blueprints/Manager/EnemySet/EnemySet_${
        mapType === 'pat' ? 'field' : mapType
    }.json`)[0].Properties.EnemySets;
    for (let set of t) DB.EnemySets[mapType][set.EnemySetId] = set;

    let baseMapDir = `./Maps/${MapTypeMapping[mapType]}`;
    for (let map of fs.readdirSync(baseMapDir)) {
        for (let cardinal of ['C_', 'N_', 'E_', 'S_', 'W_', '']) {
            try {
                const data = JSON.parse(
                    fs.readFileSync(
                        `${baseMapDir}/${map}/sublevel/${map
                            .replace('dng', 'pub')
                            .replace('pat', 'pub')}_${cardinal}EN.json`,
                        'utf8',
                    ),
                );

                if (!DB.EnemyHabitats[map]) DB.EnemyHabitats[map] = {};

                for (let entry of data) {
                    if (
                        (entry.Type === 'SceneComponent' &&
                            CQST[entry.Outer]) ||
                        entry.Type === 'BrushComponent'
                    ) {
                        DB.EnemyHabitats[map][entry.Outer] = {
                            ...DB.EnemyHabitats[map][entry.Outer],
                            ...entry.Properties.RelativeLocation,
                        };

                        if (CQST[entry.Outer]) {
                            DB.EnemyHabitats[map][entry.Outer].Enemies = [
                                {
                                    EnemySetId:
                                        CQST[entry.Outer]?.event_param_1_1,
                                },
                            ];
                            DB.EnemyHabitats[map][entry.Outer].type = 'elite';
                        }
                    }
                    if (entry.Type === 'SBEnemyHabitat')
                        DB.EnemyHabitats[map][entry.Name] = {
                            ...DB.EnemyHabitats[map][entry.Name],
                            Enemies: [...entry.Properties.Enemies],
                            ...entry.Properties.Density,
                            ...entry.Properties.RespawnTime,
                            type: 'enemy',
                        };
                }
            } catch (exception) {
                exception.errno !== -4058 && console.log(exception);
            }
        }
    }
}

for (let mapType in DB.POI) {
    let baseMapDir = `./Maps/${mapType}`;
    for (let map of fs.readdirSync(baseMapDir)) {
        if (!DB.POI[map]) DB.POI[map] = { temp: {}, dat: [] };
        try {
            let data = fs.readFileSync(
                `${baseMapDir}/${map}/sublevel/${map
                    .replace('dng', 'pub')
                    .replace('pat', 'pub')}_SC.json`,
                'utf8',
                (err) => {},
            );
            data = JSON.parse(data);
            for (let dat of data) {
                if (
                    dat.Type === 'SceneComponent' &&
                    dat.Name.includes('Root') &&
                    !dat.Outer.includes('Sit') &&
                    !dat.Outer.includes('Return') &&
                    !dat.Outer.includes('Replicated') &&
                    !dat.Outer.includes('Coin') &&
                    !dat.Outer.includes('FieldTravel') &&
                    !dat.Outer.includes('Temple') &&
                    !dat.Outer.includes('Dungeon') &&
                    !dat.Outer.includes('Water') &&
                    !dat.Outer.includes('Spline') &&
                    dat.Properties?.RelativeLocation
                ) {
                    DB.POI[map].temp[dat.Outer] = {
                        ...DB.POI[map].temp[dat.Outer],
                        ...dat.Properties.RelativeLocation,
                        type: poiToType(dat.Outer),
                        selector: poiToSelector(dat.Outer),
                    };
                }
                if (dat.Type === 'BP_UtillityAreaActor_C') {
                    DB.POI[map].temp[dat.Name] = {
                        ...DB.POI[map].temp[dat.Name],
                        title: dat.Properties.LocationId.RowName,
                    };
                }
                if (
                    (dat.Type === 'BP_DungeonActivator_C' ||
                        dat.Type === 'BP_DungeonEntrance_C' ||
                        dat.Type === 'SBFieldTravelTrigger' ||
                        dat.Type.includes('FieldTravelInteraction_')) &&
                    (dat.Properties.TravelFieldMapName ||
                        dat.Properties.TravelFieldGameContentId)
                ) {
                    DB.POI[map].temp[dat.Name] = {
                        ...DB.POI[map].temp[dat.Name],
                        title: (
                            dat.Properties.TravelFieldMapName ||
                            dat.Properties.TravelFieldGameContentId
                        ).split('_')[0],
                    };
                }
                if (
                    (dat.Name === 'CollisionComp' ||
                        dat.Name === 'SceneComponent') &&
                    dat.Properties?.RelativeLocation &&
                    !dat.Outer.includes('Utillity') &&
                    !dat.Outer.includes('Blocking') &&
                    !dat.Outer.includes('Landscape') &&
                    !dat.Outer.includes('PlayerStart') &&
                    !dat.Outer.includes('Spline') &&
                    !dat.Outer.includes('Fld') &&
                    !dat.Outer.includes('exq003') &&
                    !dat.Outer.includes('Tutorial') &&
                    !dat.Outer.includes('Sit') &&
                    !dat.Outer.includes('Return') &&
                    !dat.Outer.includes('Replicated') &&
                    !dat.Outer.includes('Coin') &&
                    !dat.Outer.includes('Temple') &&
                    !dat.Outer.includes('Water') &&
                    !dat.Outer.includes('FallDead') &&
                    !dat.Outer.includes('Spline')
                ) {
                    DB.POI[map].temp[dat.Outer] = {
                        ...DB.POI[map].temp[dat.Outer],
                        ...dat.Properties.RelativeLocation,
                        type: poiToType(dat.Outer),
                        selector: poiToSelector(dat.Outer),
                    };
                }
            }
        } catch (err) {}
        for (let cardinal of ['C_', 'N_', 'E_', 'S_', 'W_', '']) {
            try {
                data = fs.readFileSync(
                    `${baseMapDir}/${map}/sublevel/${map
                        .replace('dng', 'pub')
                        .replace('pat', 'pub')}_${cardinal}PU.json`,
                    'utf8',
                    (err) => {},
                );
                data = JSON.parse(data);
                for (let o of data) {
                    if (o.Outer && o.Properties?.RelativeLocation) {
                        DB.POI[map].temp[o.Outer] = {
                            ...DB.POI[map].temp[o.Outer],
                            title: poiToSelector(o.Outer),
                            selector: poiToSelector(o.Outer),
                            type: poiToType(o.Outer),
                            ...o.Properties.RelativeLocation,
                        };
                    }
                    if (
                        o.Properties &&
                        (o.Properties.GatherPointId ||
                            o.Properties.TreasureBoxId)
                    ) {
                        DB.POI[map].temp[o.Name] = {
                            ...DB.POI[map].temp[o.Name],
                            treasureId:
                                o.Properties.GatherPointId ||
                                o.Properties.TreasureBoxId,
                        };
                    }
                }
            } catch (err) {}
            try {
                data = fs.readFileSync(
                    `${baseMapDir}/${map}/sublevel/${map
                        .replace('dng', 'pub')
                        .replace('pat', 'pub')}_${cardinal}Nappo.json`,
                    'utf8',
                    (err) => {},
                );
                data = JSON.parse(data);
                for (let o of data)
                    if (o.Outer && o.Properties?.RelativeLocation)
                        DB.POI[map].temp[o.Outer] = {
                            ...DB.POI[map].temp[o.Outer],
                            title: 'Nappo',
                            selector: 'Nappo',
                            type: 'nappo',
                            ...o.Properties.RelativeLocation,
                        };
            } catch (err) {}
            try {
                data = fs.readFileSync(
                    `${baseMapDir}/${map}/sublevel/${map
                        .replace('dng', 'pub')
                        .replace('pat', 'pub')}_${cardinal}SC.json`,
                    'utf8',
                    (err) => {},
                );
                data = JSON.parse(data);
                for (let o of data) {
                    if (
                        (o.Type.includes('Dungeon') ||
                            o.Type.includes('_RaidGate') ||
                            o.Type.includes('FieldTravel')) &&
                        (o.Properties.TravelFieldMapName ||
                            o.Properties.DungeonID ||
                            o.Properties.TravelFieldGameContentId)
                    ) {
                        DB.POI[map].temp[o.Name] = {
                            ...DB.POI[map].temp[o.Name],
                            title:
                                (DB.LocationNames.ja_JP[
                                    o.Properties.TravelFieldGameContentId
                                ] &&
                                    o.Properties.TravelFieldGameContentId) ||
                                o.Properties.DungeonID,
                        };
                    }
                    if (
                        (o.Name === 'CollisionComp' ||
                            o.Type === 'SceneComponent') &&
                        o.Properties?.RelativeLocation &&
                        !o.Outer.includes('Utillity') &&
                        !o.Outer.includes('Blocking') &&
                        !o.Outer.includes('Landscape') &&
                        !o.Outer.includes('PlayerStart') &&
                        !o.Outer.includes('Spline') &&
                        !o.Outer.includes('Fld') &&
                        !o.Outer.includes('exq') &&
                        !o.Outer.includes('Tutorial') &&
                        !o.Outer.includes('Sit') &&
                        !o.Outer.includes('Return') &&
                        !o.Outer.includes('Replicated') &&
                        !o.Outer.includes('Coin') &&
                        !o.Outer.includes('Temple') &&
                        !o.Outer.includes('Water') &&
                        !o.Outer.includes('FallDead') &&
                        !o.Outer.includes('Train') &&
                        !o.Outer.includes('MQ') &&
                        !o.Outer.includes('Spline')
                    ) {
                        DB.POI[map].temp[o.Outer] = {
                            ...DB.POI[map].temp[o.Outer],
                            ...o.Properties.RelativeLocation,
                            type: poiToType(o.Outer),
                            selector: poiToSelector(o.Outer),
                        };
                        if (o.Outer.includes('Raid'))
                            DB.POI[map].temp[o.Outer].title =
                                raidNames[o.Outer] || 'Raid Gate';

                        if (!DB.POI[map].temp[o.Outer].selector)
                            delete DB.POI[map].temp[o.Outer];
                    }
                    if (
                        (o.Type === 'BP_DungeonActivator_C' ||
                            o.Type === 'BP_DungeonEntrance_C' ||
                            o.Type === 'SBFieldTravelTrigger') &&
                        o.Properties.TravelFieldMapName
                    ) {
                        DB.POI[map].temp[o.Name] = {
                            ...DB.POI[map].temp[o.Name],
                            title: o.Properties.TravelFieldMapName.split(
                                '_',
                            )[0],
                        };
                    }
                }
            } catch (err) {
                err.errno !== -4058 && console.log(err);
            }
            for (let row in DB.POI[map].temp)
                DB.POI[map].dat.push({ ...DB.POI[map].temp[row] });

            DB.POI[map].temp = {};
        }
        delete DB.POI[map].temp;
    }
}

function poiToType(name) {
    name = name.toLowerCase();
    let mapping = {
        warp: null,
        fishing: null,
        utillity: 'utility',
        campfire: null,
        aquatic: null,
        mineral: null,
        plant: null,
        treasure: null,
        buff: null,
        travel: null,
        dungeon: null,
        raid: null,
        nappo: null,
    };
    for (let m in mapping) if (name.includes(m)) return mapping[m] || m;

    return 'default';
}

function poiToSelector(name) {
    name = name.toLowerCase();
    let mapping = {
        warp: 'Warp Gate',
        fishing: 'Fishing',
        utillity: 'Utility',
        campfire: 'Camp Fire',
        aquatic: 'Gathering - Aquatic',
        mineral: 'Gathering - Minerals',
        plant: 'Gathering - Plants',
        treasure: 'Treasure Box',
        buff: 'Buff',
        dungeon: 'Dungeon',
        raid: 'Raid',
        travel: 'Travel Point',
        nappo: 'Nappo',
    };
    for (let m in mapping) if (name.includes(m)) return mapping[m] || m;

    return '';
}

for (let map in DB.POI) {
    if (!DB.POI[map].dat || DB.POI[map].dat.length === 0) {
        delete DB.POI[map];
        continue;
    }
    for (let row = 0; row < DB.POI[map].dat.length; row++)
        if (
            !DB.POI[map].dat[row].X ||
            (!['warp', 'campfire', 'fishing'].includes(
                DB.POI[map].dat[row].type,
            ) &&
                !DB.POI[map].dat[row].title)
        )
            DB.POI[map].dat[row] = {};
    let i = 0;
    let last = DB.POI[map].dat.length;
    while (i < last) {
        if (Object.keys(DB.POI[map].dat[i]).length !== 0) i++;
        else {
            DB.POI[map].dat.splice(i, 1);
            last--;
        }
    }
    console.log(map);
}

//boards
const boards = {
    boards: require('./apiext/master_adventure_board.json'),
    panels: require('./apiext/master_adventure_board_panel.json'),
    quests: require('./apiext/master_adventure_board_quest.json'),
    Loc: { ja_JP: {}, en_US: {} },
    Sources: {},
    srcQuests: {},
    LocationNames: { ...DB.LocationNames },
};

let _boards = {};
let _quests = {};
for (let board of boards.boards) _boards[board.id] = board;
for (let panel of boards.panels) {
    if (!_boards[panel.board_id].panels) _boards[panel.board_id].panels = {};
    _boards[panel.board_id].panels[panel.id] = { ...panel };
}
for (let quest of boards.quests) _quests[quest.id] = quest;

boards.boards = _boards;
boards.quests = _quests;

delete boards.panels;

const srcQuests = require('./apiext/quests.json');
let srcQ = {};

for (let q of srcQuests) srcQ[q.long_id] = { name: q.name, desc: q.desc };

for (let source of require('./apiext/rewards.json'))
    if (source.reward_type === 28) {
        let id = ('' + source.id).substring(0, '' + source.id.lastIndexOf('_'));
        boards.Sources[source.item_id] =
            (id.charAt(0) === id.charAt(0).toLowerCase()
                ? 'D'
                : id.charAt(0) === 'A'
                ? 'A'
                : 'Q') + id;
        boards.srcQuests[id] = srcQ[id];
    }

for (let source of require('./apiext/treasures.json'))
    for (let treasure of source.lot_rate)
        if (treasure.reward_type === 28)
            boards.Sources[treasure.reward_master_id] = 'T' + source.id;

for (let loc in boards.Loc) {
    text = require(`./apiext/texts/${loc}.json`);
    if (loc !== 'ja_JP') boards.Loc[loc] = { ...boards.Loc.ja_JP };

    for (let cat of text) {
        if (
            ![
                'master_adventure_boards_text',
                'master_adventure_board_quests_text',
                'quest_main_chapter01_text',
                'quest_main_chapter02_text',
                'quest_main_chapter03_text',
                'quest_sub_chapter01_text',
                'quest_sub_chapter02_text',
                'quest_sub_chapter03_text',
            ].includes(cat.name)
        )
            continue;
        boards.Loc[loc][cat.name] = {
            ...boards.Loc[loc][cat.name],
            name: cat.name,
            texts: boards.Loc[loc][cat.name]?.texts
                ? { ...boards.Loc[loc][cat.name].texts }
                : {},
        };

        for (let o of cat.texts)
            boards.Loc[loc][cat.name].texts[o.id] = { ...o };
    }
}

save(`./_out`);
save(`E:/Main Files/Projects/next/bp/components/Maps/data`, true);

function save(dir, condense = false) {
    if (condense) {
        fs.writeFileSync(
            dir + `/DB.json`,
            JSON.stringify(DB),
            'utf8',
            () => {},
        );

        fs.writeFileSync(
            dir + '/../../Board/data/DB.json',
            JSON.stringify(boards),
            'utf8',
            () => {},
        );
    } else {
        for (let d in DB)
            fs.writeFileSync(
                dir + `/${d}.json`,
                JSON.stringify(DB[d]),
                'utf8',
                () => {},
            );
    }
}
