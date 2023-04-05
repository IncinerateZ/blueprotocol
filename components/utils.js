import styles from '../styles/Map.module.css';

function coordTranslate(x, y, cfg) {
    return {
        x: (x - cfg.CapturePosition.X) / (cfg.CaptureSize.X / 1920),
        y: (y - cfg.CapturePosition.Y) / (cfg.CaptureSize.Y / 1080),
    };
}

function buildSummary(summaries) {
    if (Object.keys(summaries).length === 0)
        return <div style={{ textAlign: 'center' }}>No Data</div>;
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
                    width: '200px',
                    height: 'fit-content',
                    maxHeight: '150px',
                    overflowY: 'auto',
                }}
                className={styles.Popup}
            >
                {summaries.map((summary) => (
                    <div
                        style={{
                            flexDirection: 'column',
                            position: 'relative',
                            display: 'flex',
                            marginBottom: '1rem',
                        }}
                        key={Math.random()}
                    >
                        <span style={{ fontSize: '1rem' }}>
                            <b>{summary.name}</b>
                        </span>
                        {summary.desc.map((r) => (
                            <span
                                key={Math.random()}
                                style={{
                                    fontSize:
                                        r.includes('%') || r.includes('Level')
                                            ? '0.8rem'
                                            : '0.9rem',
                                    color: r.includes('Level')
                                        ? 'darkslategray'
                                        : 'black',
                                }}
                            >
                                {r}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function entitySummary(DB, entity, lang) {
    let res = [];
    if (['enemy', 'elite'].includes(entity.type)) {
        let enemies = DB.EnemySets.field[entity.idf];
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
                        drop.drop_rate / 100
                    }%`,
                );
            }
            res.push(page);
        }
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

export { levenshtein, coordTranslate, entitySummary };
