import ChevronLight from '@/public/map/chevron-left-light.svg';

import { levenshtein } from '@/components/utils';
import { useEffect, useRef, useState } from 'react';

import styles from '@/styles/Map.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function MapPicker({
    DB,
    data,
    maps,
    chosenMap,
    setChosenMap,
    lang,
}) {
    const [mapSearch, setMapSearch] = useState(
        DB
            ? DB.LocationNames[lang][
                  data[chosenMap].map_id
                      .replace('dng', 'pub')
                      .replace('pat', 'pub')
              ]
            : data[chosenMap].display_name,
    );
    const [ssHighlight, setSSHighlight] = useState(0);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [doSearch, setDoSearch] = useState(false);

    const searchRef = useRef();

    const router = useRouter();

    useEffect(() => {
        resetSearch();
    }, [chosenMap, lang]);

    function resetSearch() {
        if (chosenMap === '') return;
        setMapSearch(
            lang === 'ja_JP' && DB
                ? DB.LocationNames[lang][
                      data[chosenMap].map_id
                          .replace('dng', 'pub')
                          .replace('pat', 'pub')
                  ]
                : data[chosenMap].display_name,
        );
        setSSHighlight(0);
        setSearchSuggestions([]);
        setDoSearch(false);
    }

    function handleMapSearch(e) {
        let q = e?.target?.value;
        if (q?.length >= 0) setMapSearch(q);
        q = q?.toLowerCase() || '';

        let res = {};

        for (let k of Object.keys(maps)) {
            let ks = k.toLowerCase().indexOf(q);
            if (ks != -1) {
                for (let t of maps[k]) {
                    let name =
                        lang === 'ja_JP'
                            ? DB.LocationNames[lang][
                                  data[t].map_id
                                      .replace('dng', 'pub')
                                      .replace('pat', 'pub')
                              ]
                            : data[t].display_name;

                    res[name] = ks;
                }
            } else {
                let d = levenshtein(k.toLowerCase(), q);
                if (d <= k.length - 3)
                    for (let t of maps[k]) {
                        let name =
                            lang === 'ja_JP'
                                ? DB.LocationNames[lang][
                                      data[t].map_id
                                          .replace('dng', 'pub')
                                          .replace('pat', 'pub')
                                  ]
                                : data[t].display_name;

                        if (res[name] >= 0) continue;
                        res[name] = 100 + d;
                    }
            }
        }

        let res_ = Object.keys(res);
        res_.sort((a, b) => {
            return res[a] - res[b];
        });

        setSSHighlight(0);
        setSearchSuggestions(res_);
    }

    function handleSuggestionsSelect(code) {
        if (searchSuggestions.length === 0) return;
        if (code === 'ArrowUp') setSSHighlight((e) => Math.max(0, e - 1));

        if (code === 'ArrowDown')
            setSSHighlight((e) =>
                Math.min(searchSuggestions.length - 1, e + 1),
            );
        if (code === 'Enter') {
            router.push(router.pathname, undefined, { shallow: true });
            searchRef.current.blur();
            let c = searchSuggestions[ssHighlight];
            setChosenMap(maps[c][0]);
            resetSearch();
        }
    }

    return (
        <>
            <span style={{ marginTop: '4px' }}>
                <b>Map</b>
            </span>
            <div className={styles.MCL_mapsearch}>
                <input
                    type={'text'}
                    value={
                        doSearch || !DB || lang !== 'ja_JP'
                            ? mapSearch
                            : DB?.LocationNames[lang]?.[
                                  data[chosenMap].map_id
                                      .replace('dng', 'pub')
                                      .replace('pat', 'pub')
                              ]
                    }
                    onChange={(e) => {
                        handleMapSearch(e);
                        setDoSearch(true);
                    }}
                    onKeyDown={(e) => handleSuggestionsSelect(e.code)}
                    onClick={() => {
                        if (!doSearch) {
                            handleMapSearch();
                            setDoSearch(true);
                        } else resetSearch();
                    }}
                    ref={searchRef}
                ></input>
                <div style={{ position: 'relative' }}>
                    <Image
                        src={ChevronLight.src}
                        width={25}
                        height={25}
                        alt={'Change Maps'}
                        style={{
                            position: 'absolute',
                            transform:
                                'translate(285px, -120%) ' +
                                `rotate(${doSearch ? '-270' : '-90'}deg)`,
                            pointerEvents: 'none',
                            transition: '0.1s',
                        }}
                    ></Image>
                </div>
                <div className={styles.mapsearch_suggestions}>
                    {doSearch &&
                        searchSuggestions.map((e, i) => (
                            <button
                                key={Math.random()}
                                className={
                                    ssHighlight === i ? styles.highlight : ''
                                }
                                style={{
                                    backgroundColor:
                                        ssHighlight === i
                                            ? 'var(--dark2)'
                                            : 'var(--background)',
                                }}
                                onClick={() => {
                                    router.push(
                                        {
                                            pathname: '/map',
                                            query: {},
                                            hash: maps[e][0],
                                        },
                                        undefined,
                                        {
                                            shallow: true,
                                        },
                                    );
                                    searchRef.current.blur();
                                    setChosenMap(maps[e][0]);
                                    resetSearch();
                                }}
                            >
                                {e}
                            </button>
                        ))}
                </div>
            </div>
        </>
    );
}
