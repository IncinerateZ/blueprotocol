const BoardReward = require('../board/rewards/BoardReward');

function coordTranslate(x, y, cfg) {
    return {
        x: (x - cfg.CapturePosition.X) / (cfg.CaptureSize.X / 1920),
        y: (y - cfg.CapturePosition.Y) / (cfg.CaptureSize.Y / 1080),
    };
}

function buildSummary(summaries, entity) {
    if (Object.keys(summaries).length === 0) return '';
    let id = typeof summaries[0] === 'string' ? summaries.shift() : null;

    let doc = `${entity.type} ${id || ''}`;

    for (let summary of summaries) {
        doc += ` ${summary.name || ''} ${summary.id || ''}`;

        if (!summary.desc) continue;
        for (let desc of summary.desc) doc += ` ${desc}`;
    }

    let res = {
        loc: {
            lng: entity.metadata.lng,
            lat: entity.metadata.lat,
            type: entity.type,
            section: entity.metadata.section,
            display_name: entity.metadata.selectors[0],
        },
        doc,
    };

    if (entity.type === 'enemy') res.loc.Enemy = { ...entity.Enemy };

    return res;
}

function entitySummary(DB, entity, lang, showLeak) {
    let res = [];
    if (['enemy', 'elite'].includes(entity.type)) {
        let enemies = DB.EnemySets.field[entity.idf];
        res.push(entity.idf);
        for (let enemy of enemies?.Members || []) {
            let page = { ...entity.metadata };
            let enemy_ = DB.Enemies[enemy.EnemyId] || {};
            if (Object.keys(enemy_).length === 0) continue;
            page.name =
                DB.Loc[lang].enemyparam_text.texts[enemy_?.name_id || 0]
                    ?.text || 'No Data';
            if (!entity.Enemy) {
                entity.Enemy = {};
                entity.Enemy.name_id = enemy_.name_id;
            }

            page.desc = [];
            page.desc.push(`Levels ${enemy.MinLv} - ${enemy.MaxLv}`);
            page.desc.push('Drops');

            let drops = [...enemy_.drop_items];

            for (let drop of drops) {
                if (drop.type === 2) {
                    let treasures = DB.Treasures[drop.item_index];
                    for (let treasure of treasures.lot_rate) {
                        drops.push({
                            content_id: '',
                            item_index: treasure.reward_master_id,
                            drop_rate: treasure.rate,
                        });
                    }
                }
            }

            drops.sort((a, b) => {
                return b.drop_rate - a.drop_rate;
            });

            for (let drop of drops) {
                if (!entity.idf.includes(drop.content_id)) continue;

                let item = DB.Items[drop.item_index];
                if (!item) continue;

                page.desc.push(
                    `${DB.Loc[lang].item_text.texts[item.name].text} ${
                        showLeak ? `${drop.drop_rate / 100}%` : ''
                    }`,
                );
            }
            res.push(page);
        }
    } else if (
        ['plant', 'aquatic', 'mineral', 'treasure'].includes(entity.type)
    ) {
        let treasures = DB.Treasures[entity.metadata.title];
        if (treasures) {
            let i = 1;

            let lot_rates = treasures.lot_rate;

            lot_rates.sort((a, b) => {
                return b.rate - a.rate;
            });

            for (let treasure of lot_rates) {
                let page = { ...entity.metadata };
                let treasure_ = DB.Items[treasure.reward_master_id];

                page.desc = [];

                if (i++ === 1) {
                    page.id = entity.metadata.title;
                    page.name = `Gathering: ${
                        entity.type.charAt(0).toUpperCase() +
                        entity.type.substring(1)
                    }`;
                }

                if (treasure_ || 'reward_type' in treasure) {
                    let item = null;
                    if (treasure_)
                        item =
                            DB.Loc[lang].item_text.texts[treasure_.name].text;
                    else {
                        item = new BoardReward(
                            treasure.reward_master_id,
                            treasure.reward_type,
                            `${treasure.reward_amount_min}-${treasure.reward_amount_max}`,
                            lang,
                        ).reward;
                        item = item.name + ' ' + item.id;
                    }
                    page.desc.push(
                        `${item} ${
                            showLeak
                                ? `x${treasure.reward_amount_min}-${
                                      treasure.reward_amount_max
                                  } ${treasure.rate / 100}%`
                                : ''
                        }`,
                    );
                } else {
                    // console.log(entity.metadata.title);
                    // console.log(treasure);
                }

                res.push(page);
            }
            res.noMargin = true;
        }
    } else if (entity.type.includes('quest')) {
        let quests = entity.metadata.quests;

        let pages = [];
        for (let quest of quests) {
            let chapter = quest.charAt(4);
            quest = quest.substring(0, 9);
            let cat = {
                M: `quest_main_chapter${chapter.padStart(2, '0')}_text`,
                E: `quest_main_chapter${chapter.padStart(2, '0')}_text`,
                S: `quest_sub_chapter${chapter.padStart(2, '0')}_text`,
                C: `quest_class_text`,
            }[quest.charAt(0)];

            let page = `${quest} `;
            for (let reward of DB.QuestRewards[quest] || []) {
                reward = new BoardReward(
                    reward.item_id,
                    reward.reward_type,
                    reward.amount,
                    lang,
                ).reward;
                page += `${reward.id} ${reward.name} x${reward.amount} `;
            }

            quest =
                DB.Loc[lang][cat]?.texts[DB.Quests.id_name[quest]]?.text ||
                quest;

            page += `${quest}`;

            pages.push(page);
        }

        res = [
            entity.idf,
            {
                name: entity.metadata.selectors[0] + 's',
                desc: pages,
            },
        ];
    } else if (entity.idf) {
        res = [
            {
                name: DB.LocationNames[lang][entity.idf] || entity.idf,
                pages: [],
            },
        ];
    }
    return buildSummary(res, entity);
}

class Tokenizer {
    constructor(doc) {
        doc = doc.replace('・', ' ').replace('_', ' ').replace('　', ' ');
        this.doc = doc.toLowerCase();
        this.tokens = {};

        this.tokenize();
    }

    tokenize() {
        let window = '';

        function isAlphaNumeric(c) {
            return (
                {
                    0: true,
                    1: true,
                    2: true,
                    3: true,
                    4: true,
                    5: true,
                    6: true,
                    7: true,
                    8: true,
                    9: true,
                }[c] || c.toUpperCase() !== c.toLowerCase()
            );
        }

        function isSymbol(c) {
            return {
                '`': true,
                '~': true,
                '!': true,
                '@': true,
                '#': true,
                $: true,
                '%': true,
                '^': true,
                '&': true,
                '*': true,
                '(': true,
                ')': true,
                '-': true,
                _: true,
                '=': true,
                '+': true,
                '{': true,
                '}': true,
                '[': true,
                ']': true,
                '|': true,
                ';': true,
                ':': true,
                '': true,
                '"': true,
                '<': true,
                ',': true,
                '>': true,
                '.': true,
                '?': true,
                '/': true,
            }[c];
        }

        for (let c of this.doc) {
            if (c === ' ') {
                if (window.length > 0) this.tokens[window] = true;
                window = '';
                continue;
            }

            if (isSymbol(c)) {
                if (window.length > 0) this.tokens[window] = true;
                window = '';
            } else {
                window += c;
            }
        }
        if (window.length > 0) this.tokens[window] = true;
    }
}

function process(doc) {
    let tf = {};
    let total = 0;
    let tokenizer = new Tokenizer(doc);
    for (let word in tokenizer.tokens) {
        tf[word] = (tf[word] || 0) + 1;
        total++;
    }
    for (let token in tf) tf[token] = tf[token] / total;

    tf.__TOTAL__ = total;
    return tf;
}

function search(index, query) {
    let res = {};

    query = query.replace('・', ' ');
    for (let map in index) {
        if (!res[map]) res[map] = [];
        let locs = {};
        for (let word of query.split(' ')) {
            if (word.length <= 1) continue;
            word = word.toLowerCase();

            let results = index[map][word]?.tfs || [];
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let lnglat = result.loc.lng + ' ' + result.loc.lat;
                if (locs[lnglat]) {
                    for (let r of res[map])
                        if (r.loc.lng + ' ' + r.loc.lat === lnglat) {
                            r.tfidf += result.tfidf;
                            break;
                        }
                    results.splice(i--, 1);
                } else {
                    locs[lnglat] = true;
                }
            }

            res[map] = [...res[map], ...results];
        }
        res[map].sort((a, b) => b.tfidf - a.tfidf);
    }

    return res;
}

module.exports = { coordTranslate, entitySummary, process, search };
