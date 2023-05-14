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

    return (
        <div
            style={{
                fontSize: '0.9rem',
                filter: selectors[e][s].selected ? '' : 'brightness(50%)',
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
                    [['enemy', 'elite'].includes(selectors[e][s].type)
                        ? DB.Loc.ja_JP.enemyparam_text.texts[
                              selectors[e][s].display_name
                          ].text
                        : selectors[e][s].display_name]: !temp[e][s].selected,
                });
            }}
            onKeyDown={(ev) => {
                if (ev.code !== 'Enter' && ev.code !== 'Space') return;
                let temp = { ...selectors };
                temp[e][s].selected = !temp[e][s].selected;
                setSelectors({ ...temp });
                setSelectorsSource({
                    ...selectorsSource,
                    ...temp,
                });
                setExcludedSelectors({
                    ...excludedSelectors,
                    [['enemy', 'elite'].includes(selectors[e][s].type)
                        ? DB.Loc.ja_JP.enemyparam_text.texts[
                              selectors[e][s].display_name
                          ].text
                        : selectors[e][s].display_name]: !temp[e][s].selected,
                });
            }}
            tabIndex={0}
        >
            {mapIcons && (
                <img
                    src={mapIcons[selectors[e][s].type || s]?.options?.iconUrl}
                    alt={
                        capitalizeFirstLetter(selectors[e][s].type || s) +
                        ' Selector'
                    }
                    width={32}
                    height={32}
                />
            )}
            <div>
                {selectors[e][s].type
                    ? DB.Loc[lang].enemyparam_text.texts[s].text
                    : selectors[e][s].display_name}
            </div>
        </div>
    );
}
