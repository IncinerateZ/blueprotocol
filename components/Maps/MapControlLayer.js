/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

import ChevronLeft from '../../public/map/chevron-left.svg';
import ChevronLightWhite from '../../public/map/chevron-left-light-white.svg';

import { useRef, useState } from 'react';

import styles from '../../styles/Map.module.css';
import LangPicker from './LangPicker';
import MapPicker from './MapPicker';

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
    const [collapsedSelectors, setCollapsedSelectors] = useState({});

    return (
        <div
            className={`${styles.MapControlLayer} ${
                chevron ? '' : styles.MCL_in
            }`}
        >
            <div className={styles.MCL_content}>
                <LangPicker DB={DB} lang={lang} setLang={setLang} />
                <MapPicker
                    DB={DB}
                    data={data}
                    doSearch={doSearch}
                    mapSearch={mapSearch}
                    setMapSearch={setMapSearch}
                    ssHighlight={ssHighlight}
                    setSSHighlight={setSSHighlight}
                    searchSuggestions={searchSuggestions}
                    setSearchSuggestions={setSearchSuggestions}
                    chosenMap={chosenMap}
                    setChosenMap={setChosenMap}
                    resetSearch={resetSearch}
                    lang={lang}
                    maps={maps}
                    setDoSearch={setDoSearch}
                />
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
                                                let _selectorsSource = {
                                                    ...selectorsSource,
                                                };
                                                for (let type in temp)
                                                    _selectorsSource[type] = {
                                                        ...selectorsSource[
                                                            type
                                                        ],
                                                        ...temp[type],
                                                    };

                                                setSelectorsSource(
                                                    _selectorsSource,
                                                );
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
                                                let _selectorsSource = {
                                                    ...selectorsSource,
                                                };
                                                for (let type in temp)
                                                    _selectorsSource[type] = {
                                                        ...selectorsSource[
                                                            type
                                                        ],
                                                        ...temp[type],
                                                    };

                                                setSelectorsSource(
                                                    _selectorsSource,
                                                );
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
