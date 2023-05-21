//2023-05-16

const fs = require('fs');

const MapTypeMapping = { field: 'fld', dungeon: 'dng', pat: 'pat' };

console.log('Defining DB...');
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
    Quests: {},
};

console.log('Importing defaults...');
let _mapnames = require('./maps_extended.json');
let markers = {};

let mapnames = {};

for (let mapname of _mapnames) {
    if (mapname.id)
        mapnames[mapname.map_id.toLowerCase()] = {
            name: mapname.name_en || mapname.name_translated,
            map_id: mapname.map_id,
        };
}

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
                'quest_class_text',
                'quest_main_chapter01_text',
                'quest_main_chapter02_text',
                'quest_main_chapter03_text',
                'quest_main_chapter04_text',
                'quest_main_chapter05_text',
                'quest_main_chapter06_text',
                'quest_sub_chapter01_text',
                'quest_sub_chapter02_text',
                'quest_sub_chapter03_text',
                'quest_sub_chapter04_text',
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

console.log('Compiling...');
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

            if (map.includes('cty')) {
                let mn = map.replace('y', 'y0');

                if (!markers[mn])
                    markers[mn] = {
                        display_name: mapnames[mn].name,
                        map_url: `./UI_Map${mapnames[mn].map_id}.webp`,
                        tags: ['city'],
                        map_id: map.toLowerCase(),
                        markers: {
                            new: { display_name: 'New Marker', arr: [] },
                        },
                    };

                markers[mn].tags = [
                    ...markers[mn].tags,
                    mapnames[mn.toLowerCase()].name || mn.toLowerCase(),
                ];
            }

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
        } catch (err) {
            err.errno !== -4058 && console.log(err);
        }
        for (let cardinal of ['C_', 'N_', 'E_', 'S_', 'W_', '']) {
            try {
                data = fs.readFileSync(
                    `${baseMapDir}/${map}/sublevel/${map
                        .replace('dng', 'pub')
                        .replace('pat', 'pub')}_${cardinal}PU.json`,
                    'utf8',
                    (err) => {},
                );

                let smn = `${map}_${cardinal.substring(0, 1)}`;
                smn = smn.substring(
                    0,
                    smn.charAt(smn.length - 1) === '_'
                        ? smn.length - 1
                        : smn.length,
                );
                let mn = smn.split('_')[0];

                if (!markers[mn])
                    markers[mn] = {
                        display_name: mapnames[mn].name,
                        map_url: `./UI_Map${mapnames[mn].map_id}.webp`,
                        tags: [
                            { fld: 'field', dng: 'dungeon', pat: 'dungeon' }[
                                mn.substring(0, 3)
                            ],
                        ],
                        map_id: mn.toLowerCase(),
                        markers: {
                            new: { display_name: 'New Marker', arr: [] },
                        },
                    };

                markers[mn].tags = [
                    ...markers[mn].tags,
                    mapnames[smn.toLowerCase()].name || mn.toLowerCase(),
                ];

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

let Quests = { cty: {}, fld: {} };

for (let mapType in Quests) {
    let baseMapDir = `./Maps/${mapType}`;
    for (let map of fs.readdirSync(baseMapDir)) {
        let dir = `${baseMapDir}/${map}/sublevel/`;
        if (dir.includes('json')) continue;

        Quests[map] = {};

        for (let file of fs.readdirSync(dir)) {
            if (!file.includes('QST') || file.includes('TQ')) continue;

            let temp = {};
            for (let row of require(dir + file)) {
                if (file.includes('MQ') || file.includes('SQ')) {
                    if (
                        row.Type === 'SBNpcSpawnPoint' &&
                        row?.Properties?.ScriptInfo?.MainTriggers
                    ) {
                        let _quests = {};
                        for (let quest of row.Properties.ScriptInfo
                            .MainTriggers) {
                            if (
                                (!quest.includes('start') &&
                                    !quest.includes('EX')) ||
                                quest.includes('end') ||
                                quest.includes('step') ||
                                quest.includes('done')
                            )
                                continue;
                            let q = quest.substring(0, 9);
                            _quests[q] = true;
                        }
                        if (Object.keys(_quests).length > 0) {
                            let t = file.includes('MQ') ? 'Main' : 'Sub';
                            Quests[map][row.Name] = {
                                ...Quests[map][row.Name],
                                quests: Object.keys(_quests),
                                type: `${
                                    file.charAt(file.length - 6) === '2'
                                        ? 'plus_'
                                        : ''
                                }${t.toLowerCase()}_quest`,
                                selector: `${
                                    file.charAt(file.length - 6) === '2'
                                        ? 'Plus '
                                        : ''
                                }${t} Quest`,
                            };
                        }
                    }
                    if (
                        row.Type === 'SceneComponent' &&
                        row.Properties?.RelativeLocation
                    )
                        Quests[map][row.Outer] = {
                            ...Quests[map][row.Outer],
                            ...row.Properties.RelativeLocation,
                        };
                } else {
                    if (
                        row.Type === 'SceneComponent' &&
                        row.Properties?.RelativeLocation
                    ) {
                        let quest = row.Outer;
                        if (
                            (!quest.includes('start') &&
                                !quest.includes('EX')) ||
                            quest.includes('end') ||
                            quest.includes('step') ||
                            quest.includes('done')
                        )
                            continue;

                        temp[row.Outer] = {
                            ...row.Properties.RelativeLocation,
                        };
                    }
                }
            }
            if (Object.keys(temp).length !== 0) {
                for (let q in temp) {
                    let li = file.lastIndexOf('_');
                    let type = { E: 'Exploration', C: 'Class', T: 'Tutorial' }[
                        file.substring(li + 1, li + 2)
                    ];
                    Quests[map][q] = {
                        ...temp[q],
                        quests: [q],
                        type: `${type.toLowerCase()}_quest`,
                        selector: `${type} Quest`,
                    };
                }
            }
        }
        for (let q in Quests[map])
            if (!('quests' in Quests[map][q]) || !('X' in Quests[map][q]))
                delete Quests[map][q];
    }
}

for (let map in Quests)
    if (Object.keys(Quests[map]).length === 0) delete Quests[map];

Quests.id_name = {};

for (let row of require('./apiext/quests.json'))
    Quests.id_name[row.long_id] = row.name;

DB.Quests = { ...Quests };

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

console.log('FOUND MAPS: \n');
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
console.log();
// console.log(JSON.stringify(markers, null, 4));
console.log('Compiled. \nBuilding Boards...');
//boards
const boards = {
    boards: require('./apiext/master_adventure_board.json'),
    panels: require('./apiext/master_adventure_board_panel.json'),
    quests: require('./apiext/master_adventure_board_quest.json'),
    Loc: { ja_JP: {}, en_US: {} },
    Sources: {},
    srcQuests: {},
    Rewards: {},
    LocationNames: { ...DB.LocationNames },
    Items: { ...DB.Items },
    Mounts: {},
    Imagines: {},
    WarehouseAbilities: {},
    CraftRecipes: {},
    Tokens: {},
    LiquidMemories: {},
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

for (let lm of require('./apiext/liquid_memory.json'))
    boards.LiquidMemories[lm.id] = lm.efficacy_name;

let srcQ = {};
for (let q of require('./apiext/quests.json'))
    srcQ[q.long_id] = { name: q.name, desc: q.desc };

for (let reward of require('./apiext/rewards.json'))
    boards.Rewards[reward.id] = reward;

for (let mount of require('./apiext/mount.json'))
    boards.Mounts[mount.id] = mount;

for (let imagine of require('./apiext/imagine.json'))
    boards.Imagines[imagine.id] = imagine;

for (let ability of require('./apiext/master_warehouse_ability_recipes.json'))
    boards.WarehouseAbilities[ability.id] = ability;

for (let craft of require('./apiext/craft.json'))
    boards.CraftRecipes[craft.id] = craft;

for (let craft of require('./apiext/master_craft_recipe_sets.json'))
    boards.CraftRecipes[craft.id] = craft;

const tokens = require('./apiext/token.json');

const { exec } = require('child_process');
for (let token of tokens) boards.Tokens[token.id] = token;

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
                'item_text',
                'master_mount_imagine_text',
                'master_imagine_text',
                'master_warehouse_ability_recipes_text',
                'master_token_text',
                'master_craft_recipe_set_text',
                'master_liquid_memory_text',
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

console.log('Boards Built... \nWriting Files...');

exec('node rewardtype.js', (err, out, err2) => console.log(out));

save(`./_out`);
save(`E:/Main Files/Projects/next/bp/components/Maps/data`, true);

console.log('Finished.');

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

        fs.writeFileSync(
            'E:/Main Files/Projects/next/bp/components/Maps/data/Markers.json',
            `${JSON.stringify(markers, null, 4)}`,
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
