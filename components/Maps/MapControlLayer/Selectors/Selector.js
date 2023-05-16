/* eslint-disable @next/next/no-img-element */
import styles from '@/styles/Map.module.css';

export default function Selector({
    e,
    s,
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
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const currentSelector = selectors[e][s];

    return (
        <button
            style={{
                fontSize: '0.9rem',
                filter: currentSelector.selected ? '' : 'brightness(50%)',
                color: 'var(--text-color)',
                padding: '0',
            }}
            className={styles.MCL_selector}
            onClick={() => {
                let temp = { ...selectors };
                temp[e][s].selected = !temp[e][s].selected;

                setSelectors({ ...temp });
                setSelectorsSource({
                    ...selectorsSource,
                    ...temp,
                });
                setExcludedSelectors({
                    ...excludedSelectors,
                    [['enemy', 'elite'].includes(currentSelector.type)
                        ? DB.Loc.ja_JP.enemyparam_text.texts[
                              currentSelector.display_name
                          ].text
                        : currentSelector.display_name]: !temp[e][s].selected,
                });
            }}
            id={currentSelector.type || s}
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
            <label
                for={currentSelector.type || s}
                style={{ textAlign: 'left' }}
            >
                {currentSelector.type
                    ? DB.Loc[lang].enemyparam_text.texts[s].text
                    : currentSelector.display_name}
            </label>
        </button>
    );
}
