import styles from '@/styles/Map.module.css';

import { useEffect, useState } from 'react';
import Selectors from './Selectors';
import { useRouter } from 'next/router';

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
    toggleSelector,
}) {
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
                        toggleSelector={toggleSelector}
                    />
                ))}
        </div>
    );
}
