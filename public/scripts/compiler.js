//2023-04-14

const fs = require('fs');

const MapTypeMapping = { field: 'fld', dungeon: 'dng' };

const DB = {
    EnemySets: { field: {}, dungeon: {} },
    EnemyHabitats: {},
    Enemies: {},
    Items: {},
    Loc: { ja_JP: {}, en_US: {} },
    LocationNames: { en_US: {}, ja_JP: {} },
    POI: { cty: {}, fld: {}, dng: {} },
};

const CQST = {};

let readStart = false;
let readCount = 0;

//startup
for (let mapType in DB.EnemySets) {
    let t = require(`./Blueprints/Manager/EnemySet/EnemySet_${mapType}.json`)[0]
        .Properties.EnemySets;
    for (let set of t) DB.EnemySets[mapType][set.EnemySetId] = set;

    t = require(`./apiext/masterchallengequest.json`);
    for (let quest of t) CQST[quest.quest_id] = quest;

    let baseMapDir = `./Maps/${MapTypeMapping[mapType]}`;
    for (let map of fs.readdirSync(baseMapDir)) {
        for (let cardinal of ['C_', 'N_', 'E_', 'S_', 'W_', '']) {
            readCount++;
            fs.readFile(
                `${baseMapDir}/${map}/sublevel/${map.replace(
                    'dng',
                    'pub',
                )}_${cardinal}EN.json`,
                'utf8',
                (err, data) => {
                    if (err) return readCount--;
                    data = JSON.parse(data);
                    for (let entry of data)
                        if (entry.Type === 'SBEnemyHabitat') {
                            if (!DB.EnemyHabitats[map])
                                DB.EnemyHabitats[map] = {};
                            DB.EnemyHabitats[map][entry.Name] = {
                                ...DB.EnemyHabitats[map][entry.Name],
                                Enemies: [...entry.Properties.Enemies],
                                ...entry.Properties.Density,
                                ...entry.Properties.RespawnTime,
                                type: 'enemy',
                            };
                        } else if (entry.Type === 'BrushComponent') {
                            if (!DB.EnemyHabitats[map])
                                DB.EnemyHabitats[map] = {};
                            DB.EnemyHabitats[map][entry.Outer] = {
                                ...DB.EnemyHabitats[map][entry.Outer],
                                ...entry.Properties.RelativeLocation,
                            };
                        } else if (entry.Type === 'SceneComponent') {
                            if (!DB.EnemyHabitats[map])
                                DB.EnemyHabitats[map] = {};
                            if (!CQST[entry.Outer])
                                delete DB.EnemyHabitats[map][entry.Outer];
                            else
                                DB.EnemyHabitats[map][entry.Outer] = {
                                    ...DB.EnemyHabitats[map][entry.Outer],
                                    ...entry.Properties.RelativeLocation,
                                    Enemies: [
                                        {
                                            EnemySetId:
                                                CQST[entry.Outer]
                                                    ?.event_param_1_1,
                                        },
                                    ],
                                    type: 'elite',
                                };
                        }
                    setTimeout(() => {
                        readCount--;
                    }, 0);
                },
            );
        }
    }
}

for (let mapType in DB.POI) {
    let baseMapDir = `./Maps/${mapType}`;
    for (let map of fs.readdirSync(baseMapDir)) {
        if (!DB.POI[map]) DB.POI[map] = { temp: {}, dat: [] };
        try {
            let data = fs.readFileSync(
                `${baseMapDir}/${map}/sublevel/${map.replace(
                    'dng',
                    'pub',
                )}_SC.json`,
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
                        dat.Type === 'SBFieldTravelTrigger') &&
                    dat.Properties.TravelFieldMapName
                ) {
                    DB.POI[map].temp[dat.Name] = {
                        ...DB.POI[map].temp[dat.Name],
                        title: dat.Properties.TravelFieldMapName.split('_')[0],
                    };
                }
                if (
                    dat.Name === 'CollisionComp' &&
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
                    `${baseMapDir}/${map}/sublevel/${map.replace(
                        'dng',
                        'pub',
                    )}_${cardinal}PU.json`,
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
                }
            } catch (err) {}
            try {
                data = fs.readFileSync(
                    `${baseMapDir}/${map}/sublevel/${map.replace(
                        'dng',
                        'pub',
                    )}_${cardinal}Nappo.json`,
                    'utf8',
                    (err) => {},
                );
                data = JSON.parse(data);
                for (let o of data) {
                    if (o.Outer && o.Properties?.RelativeLocation) {
                        DB.POI[map].temp[o.Outer] = {
                            ...DB.POI[map].temp[o.Outer],
                            title: 'Nappo',
                            selector: 'Nappo',
                            type: 'nappo',
                            ...o.Properties.RelativeLocation,
                        };
                    }
                }
            } catch (err) {}
            try {
                data = fs.readFileSync(
                    `${baseMapDir}/${map}/sublevel/${map.replace(
                        'dng',
                        'pub',
                    )}_${cardinal}SC.json`,
                    'utf8',
                    (err) => {},
                );
                data = JSON.parse(data);
                for (let o of data) {
                    if (
                        (o.Type.includes('_DungeonActivator_') ||
                            o.Type.includes('_DungeonEntrance_') ||
                            o.Type.includes('FieldTravel')) &&
                        o.Properties.TravelFieldMapName
                    ) {
                        DB.POI[map].temp[o.Name] = {
                            ...DB.POI[map].temp[o.Name],
                            title: o.Properties.TravelFieldMapName.split(
                                '_',
                            )[0],
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
                        !o.Outer.includes('exq003') &&
                        !o.Outer.includes('Tutorial') &&
                        !o.Outer.includes('Sit') &&
                        !o.Outer.includes('Return') &&
                        !o.Outer.includes('Replicated') &&
                        !o.Outer.includes('Coin') &&
                        !o.Outer.includes('Temple') &&
                        !o.Outer.includes('Water') &&
                        !o.Outer.includes('FallDead') &&
                        !o.Outer.includes('Train') &&
                        !o.Outer.includes('Raid') &&
                        !o.Outer.includes('MQ') &&
                        !o.Outer.includes('Spline')
                    ) {
                        DB.POI[map].temp[o.Outer] = {
                            ...DB.POI[map].temp[o.Outer],
                            ...o.Properties.RelativeLocation,
                            type: poiToType(o.Outer),
                            selector: poiToSelector(o.Outer),
                        };
                    }
                }
            } catch (err) {}
            for (let row in DB.POI[map].temp) {
                DB.POI[map].dat.push({ ...DB.POI[map].temp[row] });
            }
            DB.POI[map].temp = {};
        }
        delete DB.POI[map].temp;
    }
}

for (let loc in DB.Loc) {
    readCount++;
    text = require(`./apiext/texts/${loc}.json`);
    if (loc !== 'ja_JP') DB.Loc[loc] = { ...DB.Loc.ja_JP };

    for (let cat of text) {
        if (!['enemyparam_text', 'item_text'].includes(cat.name)) continue;
        DB.Loc[loc][cat.name] = {
            ...DB.Loc[loc][cat.name],
            name: cat.name,
            texts: DB.Loc[loc][cat.name]?.texts
                ? { ...DB.Loc[loc][cat.name].texts }
                : {},
        };

        for (let o of cat.texts) {
            if (loc === 'en_US' && o.id === 793) console.log('hi');
            DB.Loc[loc][cat.name].texts[o.id] = { ...o };
        }
    }
    readCount--;
}

for (let enemy of require('./apiext/enemyparams.json'))
    DB.Enemies[enemy.enemy_id] = enemy;

for (let item of require('./apiext/items.json'))
    DB.Items[item.id] = { ...item };

for (let location of require('./Text/LocationName.json')[0].Properties
    .TextTable)
    DB.LocationNames.ja_JP[location.Id.IdString] = location.Text;

DB.LocationNames.en_US = { ...require('./LocationNames_EN.json') };

readStart = true;

function save(dir, condense = false) {
    if (condense)
        fs.writeFile(
            dir + `/DB.json`,
            JSON.stringify(DB, null, 4),
            'utf8',
            () => {},
        );
    else
        for (let d in DB)
            fs.writeFile(
                dir + `/${d}.json`,
                JSON.stringify(DB[d], null, 4),
                'utf8',
                () => {},
            );
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
        travel: 'Travel Point',
        nappo: 'Nappo',
    };
    for (let m in mapping) if (name.includes(m)) return mapping[m] || m;

    return '';
}

let interval = setInterval(() => {
    if (readStart && readCount === 0) {
        clearInterval(interval);
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
        save(`.`);
        save(`E:/Main Data/Project Files/next/bp/components/Maps`, true);
    }
}, 0);
