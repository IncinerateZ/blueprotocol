import styles from '@/styles/Map.module.css';
import ChevronLightWhite from '@/public/map/chevron-left-light-white.svg';

import Image from 'next/image';

import Selector from './Selector';

export default function Selectors({
    key_,
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
    toggleSelector,
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
            if (!state)
                delete _excludedSelectors[
                    ['enemy', 'elite'].includes(selectors[e][s].type)
                        ? DB.Loc.ja_JP.enemyparam_text.texts[
                              selectors[e][s].display_name
                          ].text
                        : selectors[e][s].display_name
                ];
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
    function toLocale(string) {
        if (lang === 'en_US') return string;
        let mapping = {
            Quests: 'クエスト',
            Adventure: 'アドベンチャー',
            Enemies: 'エネミー',
        };
        return string in mapping ? mapping[string] : string;
    }
    return (
        <div style={{ marginBottom: '4px' }}>
            <span
                style={{ display: 'flex' }}
                className={styles.selectorsHeader}
            >
                <div>
                    <b>{toLocale(e)}</b>
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
                <label
                    style={{
                        cursor: 'pointer',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        marginLeft: 'auto',
                        marginRight: '0.5rem',
                    }}
                >
                    <Image
                        src={ChevronLightWhite.src}
                        width={25}
                        height={25}
                        alt={'Collapse Selectors'}
                    ></Image>
                    <span className='visually-hidden'>
                        Collapse / Expand Selectors
                    </span>
                    <input type='checkbox' className='visually-hidden'></input>
                </label>
            </span>
            <div className={styles.MCL_selectors}>
                {Object.keys(selectors[e]).map((s, si) => (
                    <Selector
                        key={si}
                        e={e}
                        s={s}
                        DB={DB}
                        lang={lang}
                        mapIcons={mapIcons}
                        selectors={selectors}
                        toggleSelector={toggleSelector}
                    />
                ))}
            </div>
        </div>
    );
}
