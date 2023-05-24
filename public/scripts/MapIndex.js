//2023-05-24

const {
    coordTranslate,
    entitySummary,
    process,
    search,
} = require('./utils/utils');
const fs = require('fs');

let index = {};

init();

function init() {
    console.log('Building Map Search Index...');
    const DB = require('./data/DB.json');
    const data = require('./data/Markers.json');

    let _cfg = require('./data/DT_MapBGConfig.json')[0].Rows;
    let cfg = {};

    for (let mapId in _cfg) {
        let o = _cfg[mapId];
        mapId = mapId.split('_')[0];
        if (mapId === 'default') continue;
        if (cfg[mapId]) continue;
        cfg[mapId] = {
            map: mapId,
            CapturePosition: o.CapturePosition,
            CaptureSize: o.CaptureSize,
            ResolutionMultiplier: o.ResolutionMultiplier,
        };
    }

    const mapConfig = cfg;

    let documents = {};

    let a = [];

    for (let chosenMap in data) {
        //adventure
        let pts = (DB.POI[data[chosenMap].map_id] || { dat: [] }).dat;

        for (let p of pts) {
            let pt = p;
            if (!pt.X || !pt.Y) continue;

            let c = coordTranslate(
                pt.X,
                pt.Y,
                mapConfig[data[chosenMap].map_id],
            );
            let x_ = c.x;
            let y_ = c.y;

            let title = pt.title || pt.selector;

            a.push(
                newMarker(y_, x_, {
                    type: pt.type,
                    selectors: [pt.selector],
                    title: pt.treasureId || title,
                    section: 'Adventure',
                }),
            );
        }

        //quests
        pts = DB.Quests[data[chosenMap].map_id] || {};
        for (let p in pts) {
            let pt = pts[p];

            let c = coordTranslate(
                pt.X,
                pt.Y,
                mapConfig[data[chosenMap].map_id],
            );

            a.push(
                newMarker(c.y, c.x, {
                    type: pt.type,
                    selectors: [pt.selector],
                    title: p,
                    quests: pt.quests,
                    section: 'Quests',
                }),
            );
        }

        //enemies
        pts = DB.EnemyHabitats[data[chosenMap].map_id] || {};

        for (let p in pts) {
            let pt = pts[p];

            let c = coordTranslate(
                pt.X,
                pt.Y,
                mapConfig[data[chosenMap].map_id],
            );
            let x_ = c.x;
            let y_ = c.y;

            let selectors_ = [];

            let enemies = (
                DB.EnemySets.field[pt.Enemies[0].EnemySetId] || {
                    Members: [],
                }
            ).Members;

            for (let enemy of enemies) {
                let enemyNameId = DB.Enemies[enemy.EnemyId].name_id;
                selectors_.push(
                    DB.Loc.ja_JP.enemyparam_text.texts[enemyNameId].text,
                );
            }

            a.push(
                newMarker(y_, x_, {
                    type: pt.type,
                    title: pt.Enemies[0].EnemySetId,
                    selectors: selectors_,
                    section: 'Enemies',
                }),
            );
        }

        let map_ivt = {};
        for (let pt of a) {
            let doc_en = entitySummary(
                DB,
                {
                    type: pt.type,
                    idf: pt.title,
                    metadata: {
                        ...pt,
                    },
                },
                'en_US',
                false,
            );
            let doc_jp = entitySummary(
                DB,
                {
                    type: pt.type,
                    idf: pt.title,
                    metadata: {
                        ...pt,
                    },
                },
                'ja_JP',
                false,
            );

            if (!doc_en || !doc_jp) continue;
            let tf = process(doc_en.doc + doc_jp.doc);

            for (let token in tf) {
                if (token === '__TOTAL__') continue;
                if (!map_ivt[token]) map_ivt[token] = { tfs: [] };
                map_ivt[token].tfs.push({ tf: tf[token], loc: doc_en.loc });
            }
        }

        for (let token in map_ivt) {
            if (token === '__TOTAL__') continue;
            if (!map_ivt[token]) map_ivt[token] = { tfs: [] };
            let idf = Math.log(a.length / (1 + map_ivt[token].tfs.length));
            for (let doc of map_ivt[token].tfs) {
                doc.tfidf = doc.tf * idf;
                delete doc.tf;
            }
        }

        documents[chosenMap] = map_ivt;
        a = [];
    }
    console.log(Object.keys(documents));

    console.log('Writing to file...');
    fs.writeFileSync(
        './_out/MapIndex.json',
        JSON.stringify(documents),
        () => {},
    );
    fs.writeFileSync(
        'E:/Main Files/Projects/next/bp/components/Maps/data/MapIndex.json',
        JSON.stringify(documents),
        () => {},
    );
    console.log('Done.');
}

function newMarker(
    lat,
    lng,
    options = { title: `x:${lng} y:${lat}`, description: '', type: '' },
) {
    return {
        lng: lng,
        lat: lat,
        ...options,
    };
}
