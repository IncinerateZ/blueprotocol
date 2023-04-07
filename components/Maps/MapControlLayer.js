/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

import ChevronLeft from '../../public/map/chevron-left.svg';
import ChevronLeftDark from '../../public/map/chevron-left-black.svg';
import ChevronLight from '../../public/map/chevron-left-light.svg';
import ChevronLightWhite from '../../public/map/chevron-left-light-white.svg';

import { levenshtein } from '../utils';
import { useRef, useState } from 'react';

import styles from '../../styles/Map.module.css';

export default function MapControlLayer({
    data,
    maps,
    mapSearch,
    ssHighlight,
    setSSHighlight,
    searchSuggestions,
    setSearchSuggestions,
    chosenMap,
    setChosenMap,
    setMapSearch,
    resetSearch,
    doSearch,
    setDoSearch,
    lang,
    setLang,
    DB,
    mapIcons,
    selectors,
    setSelectors,
    excludedSelectors,
    setExcludedSelectors,
    selectorsSource,
    setSelectorsSource,
}) {
    const [chevron, setChevron] = useState(true);
    const [doLangDrop, setDoLangDrop] = useState(false);
    const [collapsedSelectors, setCollapsedSelectors] = useState({});

    const searchRef = useRef();

    const ReadableString = { en_US: 'EN', ja_JP: 'JP' };

    function handleMapSearch(e) {
        let q = e?.target?.value;
        if (q?.length >= 0) setMapSearch(q);
        q = q?.toLowerCase() || '';

        let res = {};

        for (let k of Object.keys(maps)) {
            let ks = k.toLowerCase().indexOf(q);
            if (ks != -1) {
                for (let t of maps[k]) {
                    res[
                        lang === 'ja_JP'
                            ? DB.LocationNames[lang][data[t].map_id]
                            : data[t].display_name
                    ] = ks;
                }
            } else {
                let d = levenshtein(k.toLowerCase(), q);
                if (d <= 5)
                    for (let t of maps[k]) {
                        if (
                            res[
                                lang === 'ja_JP'
                                    ? DB.LocationNames[lang][data[t].map_id]
                                    : data[t].display_name
                            ] >= 0
                        )
                            continue;
                        res[
                            lang === 'ja_JP'
                                ? DB.LocationNames[lang][data[t].map_id]
                                : data[t].display_name
                        ] = 100 + d;
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
            searchRef.current.blur();
            let c = searchSuggestions[ssHighlight];
            setChosenMap(maps[c][0]);
            resetSearch();
        }
    }

    return (
        <div
            className={`${styles.MapControlLayer} ${
                chevron ? '' : styles.MCL_in
            }`}
        >
            <div className={styles.MCL_content}>
                <div className={`${styles.langPicker} ${styles.noSelect}`}>
                    <div
                        className={styles.langPicker_display}
                        style={{
                            borderBottomLeftRadius: doLangDrop ? '0' : '5px',
                        }}
                        onClick={() => {
                            setDoLangDrop((p) => !p);
                        }}
                    >
                        {ReadableString[lang]}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Image
                            src={ChevronLeftDark.src}
                            width={25}
                            height={25}
                            alt={'Change Maps'}
                            style={{
                                position: 'absolute',
                                transform:
                                    'translate(140%, -110%) ' +
                                    `rotate(${doLangDrop ? '-270' : '-90'}deg)`,
                                pointerEvents: 'none',
                                transition: '0.1s',
                            }}
                        ></Image>
                    </div>
                    {doLangDrop && (
                        <div className={styles.langPicker_dropdown}>
                            {Object.keys(DB.Loc)
                                .filter((lang_) => lang !== lang_)
                                .map((lang_) => (
                                    <div
                                        key={Math.random()}
                                        onClick={() => {
                                            setDoLangDrop(false);
                                            setLang(lang_);
                                        }}
                                    >
                                        {ReadableString[lang_]}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
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
                                <div
                                    key={Math.random()}
                                    className={
                                        ssHighlight === i
                                            ? styles.highlight
                                            : ''
                                    }
                                    onClick={() => {
                                        searchRef.current.blur();
                                        setChosenMap(maps[e][0]);
                                        resetSearch();
                                    }}
                                >
                                    {e}
                                </div>
                            ))}
                    </div>
                </div>
                <div
                    style={{ marginTop: '16px', height: '100%' }}
                    className={styles.MCL_selectorsContainer}
                >
                    {selectors &&
                        Object.keys(selectors).map((e, i) => (
                            <div key={i} style={{ marginBottom: '4px' }}>
                                <span>
                                    <b>{e}</b>
                                    <div
                                        style={{
                                            fontSize: '0.7rem',
                                            color: 'lightblue',
                                        }}
                                    >
                                        <span
                                            className={styles.selectors_toggle}
                                            onClick={() => {
                                                let temp = { ...selectors };
                                                let _excludedSelectors = {
                                                    ...excludedSelectors,
                                                };
                                                for (let s in selectors[e]) {
                                                    temp[e][s].selected = true;
                                                    _excludedSelectors = {
                                                        ..._excludedSelectors,
                                                        [[
                                                            'enemy',
                                                            'elite',
                                                        ].includes(
                                                            selectors[e][s]
                                                                .type,
                                                        )
                                                            ? DB.Loc.ja_JP
                                                                  .enemyparam_text
                                                                  .texts[
                                                                  selectors[e][
                                                                      s
                                                                  ].display_name
                                                              ].text
                                                            : selectors[e][s]
                                                                  .display_name]: false,
                                                    };
                                                }
                                                setSelectors({ ...temp });
                                                setSelectorsSource({
                                                    ...selectorsSource,
                                                    ...temp,
                                                });
                                                setExcludedSelectors(
                                                    _excludedSelectors,
                                                );
                                            }}
                                        >
                                            Show
                                        </span>{' '}
                                        <span>/</span>{' '}
                                        <span
                                            className={styles.selectors_toggle}
                                            onClick={() => {
                                                let temp = { ...selectors };
                                                let _excludedSelectors = {
                                                    ...excludedSelectors,
                                                };
                                                for (let s in selectors[e]) {
                                                    temp[e][s].selected = false;
                                                    _excludedSelectors = {
                                                        ..._excludedSelectors,
                                                        [[
                                                            'enemy',
                                                            'elite',
                                                        ].includes(
                                                            selectors[e][s]
                                                                .type,
                                                        )
                                                            ? DB.Loc.ja_JP
                                                                  .enemyparam_text
                                                                  .texts[
                                                                  selectors[e][
                                                                      s
                                                                  ].display_name
                                                              ].text
                                                            : selectors[e][s]
                                                                  .display_name]: true,
                                                    };
                                                }
                                                setSelectors({ ...temp });
                                                setSelectorsSource({
                                                    ...selectorsSource,
                                                    ...temp,
                                                });
                                                setExcludedSelectors(
                                                    _excludedSelectors,
                                                );
                                            }}
                                        >
                                            Hide
                                        </span>{' '}
                                        <span>All</span>
                                    </div>
                                    <div
                                        style={{
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src={ChevronLightWhite.src}
                                            width={25}
                                            height={25}
                                            alt={'Change Maps'}
                                            style={{
                                                position: 'absolute',
                                                transform:
                                                    'translate(285px, -100%) ' +
                                                    `rotate(${
                                                        collapsedSelectors[e]
                                                            ? '-270'
                                                            : '-90'
                                                    }deg)`,
                                                cursor: 'pointer',
                                                transition: '0.1s',
                                            }}
                                            onClick={() => {
                                                setCollapsedSelectors({
                                                    ...collapsedSelectors,
                                                    [e]: !collapsedSelectors[e],
                                                });
                                            }}
                                        ></Image>
                                    </div>
                                </span>
                                <div
                                    className={styles.MCL_selectors}
                                    style={{
                                        maxHeight: collapsedSelectors[e]
                                            ? '0'
                                            : '200vw',
                                        overflowY: 'hidden',
                                    }}
                                >
                                    {Object.keys(selectors[e]).map((s, si) => (
                                        <div
                                            key={si}
                                            style={{
                                                fontSize: '0.9rem',
                                                filter: selectors[e][s].selected
                                                    ? ''
                                                    : 'brightness(50%)',
                                            }}
                                            className={styles.MCL_selector}
                                            onClick={() => {
                                                let temp = { ...selectors };
                                                temp[e][s].selected =
                                                    !temp[e][s].selected;
                                                setSelectors({ ...temp });
                                                setSelectorsSource({
                                                    ...selectorsSource,
                                                    ...temp,
                                                });
                                                setExcludedSelectors({
                                                    ...excludedSelectors,
                                                    [[
                                                        'enemy',
                                                        'elite',
                                                    ].includes(
                                                        selectors[e][s].type,
                                                    )
                                                        ? DB.Loc.ja_JP
                                                              .enemyparam_text
                                                              .texts[
                                                              selectors[e][s]
                                                                  .display_name
                                                          ].text
                                                        : selectors[e][s]
                                                              .display_name]:
                                                        !temp[e][s].selected,
                                                });
                                            }}
                                        >
                                            {mapIcons && (
                                                <img
                                                    src={
                                                        mapIcons[
                                                            selectors[e][s]
                                                                .type || s
                                                        ]?.options?.iconUrl
                                                    }
                                                    alt={
                                                        mapIcons[
                                                            selectors[e][s]
                                                                .type || s
                                                        ]?.options?.iconUrl
                                                    }
                                                    width={32}
                                                    height={32}
                                                />
                                            )}
                                            <div>
                                                {selectors[e][s].type
                                                    ? DB.Loc[lang]
                                                          .enemyparam_text
                                                          .texts[s].text
                                                    : selectors[e][s]
                                                          .display_name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className={styles.MCL_chevron}>
                <div
                    className={styles.MCL_chevron_container}
                    onClick={() => {
                        setChevron((s) => !s);
                    }}
                >
                    <Image
                        src={ChevronLeft.src}
                        width={25}
                        height={25}
                        alt={'Toggle Drawer'}
                        style={{
                            transform: chevron ? '' : 'rotate(180deg)',
                        }}
                    ></Image>
                </div>
            </div>
        </div>
    );
}
