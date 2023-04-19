import styles from '../../../styles/Map.module.css';

import { useState } from 'react';
import Selectors from './Selectors';

export default function SelectorsSection({
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
                    <Selectors
                        key={i}
                        e={e}
                        lang={lang}
                        DB={DB}
                        mapIcons={mapIcons}
                        selectors={selectors}
                        setSelectors={setSelectors}
                        excludedSelectors={excludedSelectors}
                        setExcludedSelectors={setExcludedSelectors}
                        selectorsSource={selectorsSource}
                        setSelectorsSource={setSelectorsSource}
                        collapsedSelectors={collapsedSelectors}
                        setCollapsedSelectors={setCollapsedSelectors}
                    />
                ))}
        </div>
    );
}
