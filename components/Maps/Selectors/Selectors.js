import styles from '../../../styles/Map.module.css';
import ChevronLightWhite from '../../../public/map/chevron-left-light-white.svg';

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
                            toggleVisibiltyAll(false);
                        }}
                    >
                        Show
                    </span>{' '}
                    <span>/</span>{' '}
                    <span
                        className={styles.selectors_toggle}
                        onClick={() => {
                            toggleVisibiltyAll(true);
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
                                    collapsedSelectors[e] ? '-270' : '-90'
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
