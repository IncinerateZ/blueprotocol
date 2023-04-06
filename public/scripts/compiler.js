//2023-04-06

const fs = require('fs');

const MapTypeMapping = { field: 'fld', dungeon: 'dng' };

const DB = {
    EnemySets: { field: {} },
    EnemyHabitats: {},
    Enemies: {},
    Items: {},
    Loc: { ja_JP: {}, en_US: {} },
    LocationNames: {},
    POI: { cty: {}, fld: {} },
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
        for (let cardinal of ['C', 'N', 'E', 'S', 'W']) {
            readCount++;
            fs.readFile(
                `${baseMapDir}/${map}/sublevel/${map}_${cardinal}_EN.json`,
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
        readCount++;
        if (!DB.POI[map]) DB.POI[map] = {};
        fs.readFile(
            `${baseMapDir}/${map}/sublevel/${map}_SC.json`,
            'utf8',
            (err, data) => {
                if (err) return readCount--;
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
                        DB.POI[map][dat.Outer] = {
                            ...DB.POI[map][dat.Outer],
                            ...dat.Properties.RelativeLocation,
                            type: poiToType(dat.Outer),
                            selector: poiToSelector(dat.Outer),
                        };
                    }
                    if (dat.Type === 'BP_UtillityAreaActor_C') {
                        DB.POI[map][dat.Name] = {
                            ...DB.POI[map][dat.Name],
                            title: dat.Properties.LocationId.RowName,
                        };
                    }
                }
                readCount--;
            },
        );
        for (let cardinal of ['C', 'N', 'E', 'S', 'W']) {
            readCount += 2;
            fs.readFile(
                `${baseMapDir}/${map}/sublevel/${map}_${cardinal}_PU.json`,
                'utf8',
                (err, data) => {
                    if (err) return readCount--;
                    data = JSON.parse(data);
                    for (let o of data) {
                        if (o.Outer && o.Properties?.RelativeLocation)
                            DB.POI[map][o.Outer] = {
                                ...DB.POI[map][o.Outer],
                                title: poiToSelector(o.Outer),
                                selector: poiToSelector(o.Outer),
                                type: poiToType(o.Outer),
                                ...o.Properties.RelativeLocation,
                            };
                    }
                    readCount--;
                },
            );
            fs.readFile(
                `${baseMapDir}/${map}/sublevel/${map}_${cardinal}_Nappo.json`,
                'utf8',
                (err, data) => {
                    if (err) return readCount--;
                    data = JSON.parse(data);
                    for (let o of data) {
                        if (o.Outer && o.Properties?.RelativeLocation)
                            DB.POI[map][o.Outer] = {
                                ...DB.POI[map][o.Outer],
                                title: 'Nappo',
                                selector: 'Nappo',
                                type: 'nappo',
                                ...o.Properties.RelativeLocation,
                            };
                    }
                    readCount--;
                },
            );
        }
    }
}

for (let loc in DB.Loc) {
    readCount++;
    text = require(`./apiext/texts/${loc}.json`);
    console.log(loc);
    if (loc !== 'ja_JP') {
        DB.Loc[loc] = { ...DB.Loc.ja_JP };
        console.log('793' in DB.Loc[loc].item_text.texts);
    }
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
    DB.LocationNames[location.Id.IdString] = location.Text;

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
    };
    for (let m in mapping) if (name.includes(m)) return mapping[m] || m;

    return '';
}

let interval = setInterval(() => {
    if (readStart && readCount === 0) {
        clearInterval(interval);
        save(`.`);
        save(`E:/Main Data/Project Files/next/bp/components/Maps`, true);
    }
}, 0);
