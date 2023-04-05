//2023-04-04

const fs = require('fs');

const MapTypeMapping = { field: 'fld', dungeon: 'dng' };

const DB = {
    EnemySets: { field: {} },
    EnemyHabitats: {},
    Enemies: {},
    Loc: { ja_JP: {} },
    Items: {},
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
            readStart = true;
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

for (let loc in DB.Loc) {
    readCount++;
    text = require(`./apiext/texts/${loc}.json`);
    for (let cat of text) {
        console.log(cat.name);
        DB.Loc[loc][cat.name] = { name: cat.name, texts: {} };

        for (let o of cat.texts) {
            DB.Loc[loc][cat.name].texts[o.id] = { ...o };
        }
    }
    readCount--;
}

for (let enemy of require('./apiext/enemyparams.json'))
    DB.Enemies[enemy.enemy_id] = enemy;

for (let item of require('./apiext/items.json'))
    DB.Items[item.id] = { ...item };

function save(dir, condense = false) {
    if (condese)
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

let interval = setInterval(() => {
    if (readStart && readCount === 0) {
        clearInterval(interval);
        save(`.`);
        save(`E:/Main Data/Project Files/next/bp/components/Maps`, true);
    }
}, 0);
