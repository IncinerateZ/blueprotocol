import ChevronLightWhite from '../../public/map/chevron-left-light-white.svg';
import Image from 'next/image';

import styles from '../../styles/Map.module.css';

import { useState } from 'react';

export default function Selectors({
    lang,
    DB,
    mapIcons,
    selectors,
    setSelectors,
    excludedSelectors,
    setExcludedSelectors,
    selectorsSource,
    setSelectorsSource,
}) {
    const [collapsedSelectors, setCollapsedSelectors] = useState({});

    return (
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
                                                [['enemy', 'elite'].includes(
                                                    selectors[e][s].type,
                                                )
                                                    ? DB.Loc.ja_JP
                                                          .enemyparam_text
                                                          .texts[
                                                          selectors[e][s]
                                                              .display_name
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
                                                ...selectorsSource[type],
                                                ...temp[type],
                                            };

                                        setSelectorsSource(_selectorsSource);
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
                                                [['enemy', 'elite'].includes(
                                                    selectors[e][s].type,
                                                )
                                                    ? DB.Loc.ja_JP
                                                          .enemyparam_text
                                                          .texts[
                                                          selectors[e][s]
                                                              .display_name
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
                                                ...selectorsSource[type],
                                                ...temp[type],
                                            };

                                        setSelectorsSource(_selectorsSource);
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
                                            [['enemy', 'elite'].includes(
                                                selectors[e][s].type,
                                            )
                                                ? DB.Loc.ja_JP.enemyparam_text
                                                      .texts[
                                                      selectors[e][s]
                                                          .display_name
                                                  ].text
                                                : selectors[e][s].display_name]:
                                                !temp[e][s].selected,
                                        });
                                    }}
                                >
                                    {mapIcons && (
                                        <img
                                            src={
                                                mapIcons[
                                                    selectors[e][s].type || s
                                                ]?.options?.iconUrl
                                            }
                                            alt={
                                                mapIcons[
                                                    selectors[e][s].type || s
                                                ]?.options?.iconUrl
                                            }
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                    <div>
                                        {selectors[e][s].type
                                            ? DB.Loc[lang].enemyparam_text
                                                  .texts[s].text
                                            : selectors[e][s].display_name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
}
