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
                let temp = { ...selectors };
                temp[e][s].selected = !temp[e][s].selected;

                setSelectors({ ...temp });
                setSelectorsSource({
                    ...selectorsSource,
                    ...temp,
                });

                let _excludedSelectors = { ...excludedSelectors };
                let excludedTarget = ['enemy', 'elite'].includes(
                    currentSelector.type,
                )
                    ? DB.Loc.ja_JP.enemyparam_text.texts[
                          currentSelector.display_name
                      ].text
                    : currentSelector.display_name;

                if (temp[e][s].selected)
                    delete _excludedSelectors[excludedTarget];
                else _excludedSelectors[excludedTarget] = !temp[e][s].selected;

                setExcludedSelectors(_excludedSelectors);
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
            {currentSelector.type
                ? DB.Loc[lang].enemyparam_text.texts[s].text
                : currentSelector.display_name}

            <input
                type='checkbox'
                id={currentSelector.type || s}
                className='visually-hidden'
            ></input>
        </label>
    );
}
