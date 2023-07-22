/* eslint-disable @next/next/no-img-element */
import styles from '@/styles/Map.module.css';

export default function Selector({
    e,
    s,
    lang,
    DB,
    mapIcons,
    selectors,
    toggleSelector,
}) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
            'Gathering - Aquatic': '採集 - 水棲',
            'Treasure Box': '宝箱',
            Buff: '放浪の美食屋',
            Nappo: 'ハッピーナッポ',
            Dungeon: '自由探索',
            Raid: 'レイド',
        };
        return string in mapping ? mapping[string] : string;
    }

    const currentSelector = selectors[e][s];

    return (
        <label
            className={styles.MCL_selector}
            style={{
                fontSize: '0.9rem',
                filter: currentSelector.selected ? '' : 'brightness(50%)',
                color: 'var(--text-color)',
                padding: '0',
                textAlign: 'left',
                lineHeight: '0.9rem',
                height: 'fit-content',
            }}
            onChange={() => {
                toggleSelector(e, s);
            }}
        >
            {mapIcons && (
                <img
                    src={mapIcons[currentSelector.type || s]?.options?.iconUrl}
                    alt={
                        capitalizeFirstLetter(currentSelector.type || s) +
                        ' Selector'
                    }
                    width={32}
                    height={32}
                />
            )}
            {toLocale(
                currentSelector.type
                    ? DB.Loc[lang].enemyparam_text.texts[s]?.text || 'No Data'
                    : currentSelector.display_name,
            )}

            <input
                type='checkbox'
                id={currentSelector.type || s}
                className='visually-hidden'
                checked={currentSelector.selected}
                onChange={() => {}}
            ></input>
        </label>
    );
}
