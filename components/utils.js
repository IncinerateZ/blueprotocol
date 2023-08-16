import styles from '@/styles/Map.module.css';
import BoardReward from './Board/rewards/BoardReward';
import Link from 'next/link';

function coordTranslate(x, y, cfg) {
    return {
        x: (x - cfg.CapturePosition.X) / (cfg.CaptureSize.X / 1920),
        y: (y - cfg.CapturePosition.Y) / (cfg.CaptureSize.Y / 1080),
    };
}

function buildSummary(summaries, hiddenMarkers, setHiddenMarkers) {
    function isMarkable(name) {
        return (
            name.includes('Treasure') ||
            name.includes('Nappo') ||
            name.includes('宝箱') ||
            name.includes('ハッピーナッポ')
        );
    }
    if (Object.keys(summaries).length === 0)
        return <div style={{ textAlign: 'center' }}>No Data</div>;
    let id = typeof summaries[0] === 'string' ? summaries.shift() : null;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    width: summaries[0].desc ? '200px' : 'fit-content',
                    height: 'fit-content',
                    maxHeight: '150px',
                    overflowY: 'auto',
                }}
                className={styles.Popup}
            >
                {id && (
                    <span style={{ color: '#5e5e5e', fontSize: '0.75rem' }}>
                        ID: {id}
                    </span>
                )}
                {summaries.map((summary, idx) => (
                    <div
                        style={{
                            flexDirection: 'column',
                            position: 'relative',
                            display: 'flex',
                            marginBottom:
                                !summaries.noMargin &&
                                summaries[0].desc &&
                                idx !== summaries.length - 1
                                    ? '1rem'
                                    : '0',
                        }}
                        key={Math.random()}
                    >
                        <h1
                            style={{
                                fontSize: '1rem',
                                textAlign: summary.desc ? 'left' : 'center',
                                display: summary.name ? 'block' : 'none',
                                padding: 0,
                                margin: 0,
                            }}
                        >
                            {summary.name?.includes('{') ? (
                                <Link
                                    href={`${summary.name.substring(
                                        summary.name.indexOf('{') + 1,
                                        summary.name.indexOf('}'),
                                    )}`}
                                    target='_blank'
                                >
                                    <b>
                                        {summary.name.substring(
                                            0,
                                            summary.name.indexOf('{'),
                                        ) +
                                            summary.name.substring(
                                                summary.name.indexOf('}') + 1,
                                            )}
                                    </b>
                                </Link>
                            ) : (
                                <b>{summary.name}</b>
                            )}
                        </h1>
                        {summary.id && !(summary.id + '').includes('Nappo') && (
                            <span
                                style={{
                                    color: '#5e5e5e',
                                    fontSize: '0.75rem',
                                }}
                            >
                                ID: {summary.id}
                            </span>
                        )}
                        {summary.desc && (
                            <ul style={{ padding: 0, margin: 0 }}>
                                {summary.desc.map((r) => (
                                    <li
                                        key={Math.random()}
                                        style={{
                                            fontSize:
                                                r.includes(' x') ||
                                                r.includes('%') ||
                                                r.includes('Level') ||
                                                r.includes('レベル') ||
                                                r.includes('Spawning') ||
                                                r.includes('[sc]')
                                                    ? '0.8rem'
                                                    : '0.9rem',
                                            color:
                                                r.includes('Level') ||
                                                r.includes('レベル')
                                                    ? 'darkslategray'
                                                    : 'black',
                                            listStyleType: 'none',
                                            fontWeight: r.includes('Spawning')
                                                ? 'bold'
                                                : '',
                                        }}
                                    >
                                        {r.includes('{') ? (
                                            <Link
                                                href={`${r.substring(
                                                    r.indexOf('{') + 1,
                                                    r.indexOf('}'),
                                                )}`}
                                                target='_blank'
                                            >
                                                {r.substring(
                                                    0,
                                                    r.indexOf('{'),
                                                ) +
                                                    r.substring(
                                                        r.indexOf('}') + 1,
                                                    )}
                                            </Link>
                                        ) : (
                                            r.replace('[sc]', ' - ')
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
                {isMarkable(summaries[0].name) && (
                    <button
                        onClick={() => {
                            let _hiddenMarkers = {
                                ...hiddenMarkers,
                                [summaries[0].id]: !(
                                    summaries[0].id in hiddenMarkers
                                )
                                    ? true
                                    : !hiddenMarkers[summaries[0].id],
                            };
                            setHiddenMarkers(_hiddenMarkers);

                            localStorage.setItem(
                                'Map_hiddenMarkers',
                                JSON.stringify(_hiddenMarkers),
                            );
                        }}
                    >
                        [{hiddenMarkers[summaries[0].id] ? 'Unmark' : 'Mark'}]
                    </button>
                )}
            </div>
        </div>
    );
}

function entitySummary(
    DB,
    entity,
    lang,
    showLeak,
    hiddenMarkers,
    setHiddenMarkers,
    chosenMap,
) {
    function capitalizeFirstLetterOfEveryWord(string) {
        let res = '';
        for (let word of string.split(' ')) {
            res += `${word.charAt(0).toUpperCase()}${word
                .substring(1)
                .toLowerCase()} `;
        }
        return res;
    }

    function toLocale(string) {
        if (lang === 'en_US') return string;
        let mapping = {
            'Travel Point': 'マップ移動',
            Utility: '武器改造師',
            Fishing: '釣りスポット',
            'Warp Gate': '転移ポータル',

            'Class Quest': 'クラスクエスト',
            'Key Character Quest': 'キーキャラクタークエスト',
            'Main Quest': 'メインクエスト',
            'Sub Quest': 'サブクエスト',
            'Tutorial Quest': 'チュートリアルクエスト',

            'Camp Fire': 'キャンプ',
            'Gathering - Minerals': '採集 - 鉱物',
            'Gathering - Plants': '採集 - 植物',
            'Gathering - Aquatics': '採集 - 水棲',
            'Gathering - Treasures': '宝箱',
            'Treasure Box': '宝箱',
            Buff: '放浪の美食屋',
            Nappo: 'ハッピーナッポ',
            Dungeon: '自由探索',
            Raid: 'レイド',
        };
        string = string.replace('Quests', 'Quest');
        return string in mapping
            ? mapping[string]
            : string.replace('Quest', 'クエスト').replace('Levels', 'レベル');
    }
    let res = [];
    if (['enemy', 'elite'].includes(entity.type)) {
        function eliteSpawnCondition(spawnConditions) {
            let desc = [
                'Spawning Info',
                `[sc]Spawns ${
                    {
                        1: 'at any time of the day',
                        2: 'only during the day',
                        3: 'only during the night',
                    }[spawnConditions.timing]
                }${
                    spawnConditions.cooldown > 0
                        ? ` at most once every ${spawnConditions.cooldown} minutes`
                        : ''
                }`,
            ];

            for (let condition of spawnConditions.conditions) {
                desc.push(
                    {
                        1: `[sc]Kill ${
                            condition.params[1]
                        } ${capitalizeFirstLetterOfEveryWord(
                            DB.Loc[lang].enemyparam_text.texts[
                                DB.Enemies[condition.params[0]]?.name_id
                            ]?.text || '[UNKNOWN]',
                        )} nearby.`,
                        2: `[sc]Be nearby for ${condition.params[0]} minute(s).`,
                        3: `[sc]Get close to a False Chest.`,
                        8: `[sc]Be mounted nearby.`,
                        9: `[sc]Have ${condition.params[0]} players nearby.`,
                        11: `[sc]Be inflicted with a debuff nearby.`,
                    }[condition.type] || 'Unknown',
                );
            }

            desc.push(`[sc]Defeat within ${spawnConditions.timer} minutes.`);

            return desc;
        }

        let enemies = DB.EnemySets.field[entity.idf];
        res.push(entity.idf);
        for (let enemy of enemies?.Members || []) {
            let page = { ...entity.metadata };
            let enemy_ = DB.Enemies[enemy.EnemyId] || {};
            if (Object.keys(enemy_).length === 0) continue;
            page.name =
                capitalizeFirstLetterOfEveryWord(
                    DB.Loc[lang].enemyparam_text.texts[enemy_.name_id].text,
                ) + `{https://bapharia.com/db?result=Enemy${enemy_.enemy_id}}`;

            page.desc = [];
            page.desc.push(toLocale(`Levels ${enemy.MinLv} - ${enemy.MaxLv}`));

            let drops = [...enemy_.drop_items];

            for (let drop of drops) {
                if (drop.type === 2) {
                    if (!drop.content_id.includes(chosenMap + enemy.cardinal))
                        continue;
                    let treasures = DB.Treasures[drop.item_index];
                    if (!treasures) continue;
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
                    `${
                        DB.Loc[lang].item_text.texts[item.name].text
                    }{https://bapharia.com/db?result=Item${item.id}} ${
                        showLeak ? `${drop.drop_rate / 100}%` : ''
                    }`,
                );
            }

            if (entity.type === 'elite')
                page.desc.push(
                    ...eliteSpawnCondition(entity.metadata.spawnConditions),
                );

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
                    page.name = toLocale(
                        `Gathering - ${
                            entity.type.charAt(0).toUpperCase() +
                            entity.type.substring(1)
                        }s`,
                    );
                }

                if (treasure_ || 'reward_type' in treasure) {
                    let item = null;
                    if (treasure_) {
                        item =
                            DB.Loc[lang].item_text.texts[treasure_.name].text +
                            `{https://bapharia.com/db?result=Item${treasure_.id}}`;
                    } else {
                        item = new BoardReward(
                            treasure.reward_master_id,
                            treasure.reward_type,
                            `${treasure.reward_amount_min}-${treasure.reward_amount_max}`,
                            lang,
                        ).reward;
                        item =
                            item.name +
                            `${
                                item.type_string === 'board'
                                    ? `{/board/${item.id}}`
                                    : item.type_string === 'item'
                                    ? `{https://bapharia.com/db?result=Item${item.id}}`
                                    : item.type_string === 'liquid_memory'
                                    ? `{https://bapharia.com/db?result=LiquidMemory${item.id}}`
                                    : item.type_string === 'token'
                                    ? `{https://bapharia.com/db?result=Token${item.id}}`
                                    : ''
                            }`;
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
                    //  .log(entity.metadata.title);
                    // console.log(treasure);
                }

                res.push(page);
            }
            res.noMargin = true;
        } else {
            // if (entity.type === 'treasure') console.log(entity.metadata.title);
        }
    } else if (entity.type.includes('quest')) {
        let quests = entity.metadata.quests;

        let pages = [];
        for (let quest of quests) {
            let chapter = quest.charAt(4);
            quest = quest.substring(0, 9);

            let page = { name: ``, desc: [] };

            let cat = {
                M: `quest_main_chapter${chapter.padStart(2, '0')}_text`,
                E: `quest_main_chapter${chapter.padStart(2, '0')}_text`,
                S: `quest_sub_chapter${chapter.padStart(2, '0')}_text`,
                C: `quest_class_text`,
            }[quest.charAt(0)];

            for (let reward of DB.QuestRewards[quest] || []) {
                reward = new BoardReward(
                    reward.item_id,
                    reward.reward_type,
                    reward.amount,
                    lang,
                ).reward;
                page.desc.push(
                    `${reward.name}${
                        reward.type_string === 'board'
                            ? `{/board/${reward.id}}`
                            : reward.type_string === 'item'
                            ? `{https://bapharia.com/db?result=Item${reward.id}}`
                            : reward.type_string === 'liquid_memory'
                            ? `{https://bapharia.com/db?result=LiquidMemory${reward.id}}`
                            : reward.type_string === 'token'
                            ? `{https://bapharia.com/db?result=Token${reward.id}}`
                            : ''
                    } x${reward.amount}`,
                );
            }

            quest =
                DB.Loc[lang][cat]?.texts[DB.Quests.id_name[quest]]?.text ||
                quest;

            page.name = toLocale(`Quest "${quest}"`);

            pages.push(page);
        }

        res = [
            entity.idf,
            { name: toLocale(entity.metadata.selectors[0] + 's') },
            ...pages,
        ];
    } else if (entity.type === 'nappo') {
        let lat = Math.floor(entity.metadata.lat);
        let lng = Math.floor(entity.metadata.lng);
        res = [
            {
                name: toLocale(
                    DB.LocationNames[lang][entity.idf] || entity.idf,
                ),
                pages: [],
                id: `Nappo_${chosenMap}_${lat}_${lng}`,
            },
        ];
    } else if (entity.idf) {
        res = [
            {
                name: toLocale(
                    DB.LocationNames[lang][entity.idf] ||
                        DB.LocationNames[lang][
                            entity.idf.replace('pub', 'pat')
                        ] ||
                        DB.LocationNames[lang][
                            entity.idf.replace('pat', 'pub')
                        ] ||
                        DB.LocationNames[lang][
                            entity.idf.replace('pat', 'name')
                        ] ||
                        DB.LocationNames[lang][
                            entity.idf.replace('pub', 'name')
                        ] ||
                        entity.idf,
                ),
                pages: [],
            },
        ];
    }
    return buildSummary(res, hiddenMarkers, setHiddenMarkers);
}

function levenshtein(s, t) {
    if (s === t) {
        return 0;
    }
    var n = s.length,
        m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    var x = 0,
        y,
        a,
        b,
        c,
        d,
        g,
        h,
        k;
    var p = new Array(n);
    for (y = 0; y < n; ) {
        p[y] = ++y;
    }

    for (; x + 3 < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            k = s.charCodeAt(y);
            a = p[y];
            if (a < c || b < c) {
                c = a > b ? b + 1 : a + 1;
            } else {
                if (e1 !== k) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = c > d ? d + 1 : c + 1;
            } else {
                if (e2 !== k) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = b > g ? g + 1 : b + 1;
            } else {
                if (e3 !== k) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = d > h ? h + 1 : d + 1;
            } else {
                if (e4 !== k) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m; ) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = a > d ? d + 1 : a + 1;
            } else {
                if (e !== s.charCodeAt(y)) {
                    d = c + 1;
                } else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}

function connectingPts(t1, t2) {
    let p1, p2;

    if (t1.x < t2.x) {
        p1 = { ...t1 };
        p2 = { ...t2 };
    } else {
        p1 = { ...t2 };
        p2 = { ...t1 };
    }

    let dx = Math.abs(p1.x - p2.x);
    let dy = Math.abs(p1.y - p2.y);

    let alpha = radToDeg(Math.atan(dy / dx));
    let beta = 90 - alpha;

    return [
        rotatePt(
            { ...p1, x: p1.x + p1.r },
            p1,
            (p2.y < p1.y ? 360 : alpha * 2) - alpha,
        ),
        rotatePt(
            { ...p2, x: p2.x + p2.r },
            p2,
            (p2.y > p1.y ? 270 - 2 * beta : 90) + beta,
        ),
    ];
}

function rotatePt(p, o, deg) {
    let res = { ...p };

    let _x = res.x - o.x;
    let _y = res.y - o.y;

    res.x = _x * Math.cos(degToRad(deg)) - _y * Math.sin(degToRad(deg));
    res.y = _x * Math.sin(degToRad(deg)) + _y * Math.cos(degToRad(deg));

    res.x += o.x;
    res.y += o.y;

    return res;
}

function degToRad(deg) {
    return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
    return (rad * 180) / Math.PI;
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

function termSearch(index, query, chosenMap) {
    let res = {};

    let tokenizer = new Tokenizer(query);
    for (let map in index) {
        if (!res[map]) res[map] = [];
        let locs = {};
        for (let word in tokenizer.tokens) {
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

    let cmr = [...res[chosenMap]];
    delete res[chosenMap];

    return { [chosenMap]: cmr, ...res };
}

export {
    levenshtein,
    coordTranslate,
    entitySummary,
    connectingPts,
    rotatePt,
    degToRad,
    radToDeg,
    termSearch,
};
