import styles from '@/styles/Map.module.css';

function coordTranslate(x, y, cfg) {
    return {
        x: (x - cfg.CapturePosition.X) / (cfg.CaptureSize.X / 1920),
        y: (y - cfg.CapturePosition.Y) / (cfg.CaptureSize.Y / 1080),
    };
}

function buildSummary(summaries) {
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
                            <b>{summary.name}</b>
                        </h1>
                        {summary.id && (
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
                                                r.includes('%') ||
                                                r.includes('Level')
                                                    ? '0.8rem'
                                                    : '0.9rem',
                                            color: r.includes('Level')
                                                ? 'darkslategray'
                                                : 'black',
                                            listStyleType: 'none',
                                        }}
                                    >
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function entitySummary(DB, entity, lang, showLeak) {
    let res = [];
    if (['enemy', 'elite'].includes(entity.type)) {
        let enemies = DB.EnemySets.field[entity.idf];
        res.push(entity.idf);
        for (let enemy of enemies?.Members || []) {
            let page = { ...entity.metadata };
            let enemy_ = DB.Enemies[enemy.EnemyId];
            page.name = DB.Loc[lang].enemyparam_text.texts[enemy_.name_id].text;

            page.desc = [];
            page.desc.push(`Levels ${enemy.MinLv} - ${enemy.MaxLv}`);
            page.desc.push('Drops');

            let drops = enemy_.drop_items;
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

                if (treasure_ || treasure.reward_type === 28)
                    page.desc.push(
                        `${
                            treasure_
                                ? DB.Loc[lang].item_text.texts[treasure_.name]
                                      .text
                                : DB.Loc[lang].master_adventure_boards_text
                                      .texts[
                                      DB.Boards[treasure.reward_master_id]
                                  ].text
                        } ${
                            showLeak
                                ? `x${treasure.reward_amount_min}-${
                                      treasure.reward_amount_max
                                  } ${treasure.rate / 100}%`
                                : ''
                        }`,
                    );
                else {
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

            quest =
                DB.Loc[lang][cat]?.texts[DB.Quests.id_name[quest]]?.text ||
                quest;
            pages.push(`Quest "${quest}"`);
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
    return buildSummary(res);
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

export {
    levenshtein,
    coordTranslate,
    entitySummary,
    connectingPts,
    rotatePt,
    degToRad,
    radToDeg,
};
