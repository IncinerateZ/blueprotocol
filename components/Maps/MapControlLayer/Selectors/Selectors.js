import styles from '@/styles/Map.module.css';
import ChevronLightWhite from '@/public/map/chevron-left-light-white.svg';

import Image from 'next/image';

import Selector from './Selector';

export default function Selectors({
    e,
    lang,
    DB,
    mapIcons,
    selectors,
    setSelectors,
    excludedSelectors,
    setExcludedSelectors,
    selectorsSource,
    setSelectorsSource,
    collapsedSelectors,
    setCollapsedSelectors,
}) {
    function toggleVisibiltyAll(state) {
        let temp = { ...selectors };
        let _excludedSelectors = {
            ...excludedSelectors,
        };
        for (let s in selectors[e]) {
            temp[e][s].selected = !state;
            _excludedSelectors = {
                ..._excludedSelectors,
                [['enemy', 'elite'].includes(selectors[e][s].type)
                    ? DB.Loc.ja_JP.enemyparam_text.texts[
                          selectors[e][s].display_name
                      ].text
                    : selectors[e][s].display_name]: state,
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
        setExcludedSelectors(_excludedSelectors);
    }
    return (
        <div style={{ marginBottom: '4px' }}>
            <span style={{ display: 'flex' }}>
                <div>
                    <b>{e}</b>
                    <div
                        style={{
                            fontSize: '0.7rem',
                            color: 'lightblue',
                        }}
                    >
                        <button
                            className={styles.selectors_toggle}
                            onClick={() => {
                                toggleVisibiltyAll(false);
                            }}
                        >
                            Show
                        </button>{' '}
                        <span>/</span>{' '}
                        <button
                            className={styles.selectors_toggle}
                            onClick={() => {
                                toggleVisibiltyAll(true);
                            }}
                        >
                            Hide
                        </button>{' '}
                        <span>All</span>
                    </div>
                </div>
                <button
                    style={{
                        position: 'relative',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: 'auto',
                        marginRight: '0.5rem',
                        marginTop: 'auto',
                    }}
                    onClick={() => {
                        setCollapsedSelectors({
                            ...collapsedSelectors,
                            [e]: !collapsedSelectors[e],
                        });
                    }}
                >
                    <Image
                        src={ChevronLightWhite.src}
                        width={25}
                        height={25}
                        alt={'Collapse Selectors'}
                        style={{
                            // position: 'absolute',
                            transform: `rotate(${
                                collapsedSelectors[e] ? '-270' : '-90'
                            }deg)`,
                            transition: '0.1s',
                        }}
                    ></Image>
                </button>
            </span>
            <div
                className={styles.MCL_selectors}
                style={{
                    maxHeight: collapsedSelectors[e] ? '0' : '200vw',
                    overflowY: 'hidden',
                }}
            >
                {Object.keys(selectors[e]).map((s, si) => (
                    <Selector
                        key={si}
                        e={e}
                        s={s}
                        DB={DB}
                        lang={lang}
                        mapIcons={mapIcons}
                        selectors={selectors}
                        setSelectors={setSelectors}
                        excludedSelectors={excludedSelectors}
                        setExcludedSelectors={setExcludedSelectors}
                        selectorsSource={selectorsSource}
                        setSelectorsSource={setSelectorsSource}
                    />
                ))}
            </div>
        </div>
    );
}
