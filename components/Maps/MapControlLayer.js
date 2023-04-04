import Image from 'next/image';

import ChevronLeft from '../../public/map/chevron-left.svg';
import ChevronLight from '../../public/map/chevron-left-light.svg';

import { levenshtein } from '../utils';
import { useRef, useState } from 'react';

import styles from '../../styles/Map.module.css';

export default function MapControlLayer({
    data,
    maps,
    mapSearch,
    ssHighlight,
    setSSHighlight,
    searchSuggestions,
    setSearchSuggestions,
    chosenMap,
    setChosenMap,
    setMapSearch,
    resetSearch,
    doSearch,
    setDoSearch,
}) {
    const [chevron, setChevron] = useState(true);
    const searchRef = useRef();

    function handleMapSearch(e) {
        let q = e?.target?.value;
        if (q?.length >= 0) setMapSearch(q);
        q = q?.toLowerCase() || '';

        let res = {};

        for (let k of Object.keys(maps)) {
            let ks = k.toLowerCase().indexOf(q);
            if (ks != -1) {
                for (let t of maps[k]) {
                    res[data[t].display_name] = ks;
                }
            } else {
                let d = levenshtein(k.toLowerCase(), q);
                if (d <= 5)
                    for (let t of maps[k]) {
                        if (res[data[t].display_name] >= 0) continue;
                        res[data[t].display_name] = 100 + d;
                    }
            }
        }

        let res_ = Object.keys(res);
        res_.sort((a, b) => {
            return res[a] - res[b];
        });

        setSSHighlight(0);
        setSearchSuggestions(res_);
    }

    function handleSuggestionsSelect(code) {
        if (searchSuggestions.length === 0) return;
        if (code === 'ArrowUp') setSSHighlight((e) => Math.max(0, e - 1));

        if (code === 'ArrowDown')
            setSSHighlight((e) =>
                Math.min(searchSuggestions.length - 1, e + 1),
            );
        if (code === 'Enter') {
            searchRef.current.blur();
            let c = searchSuggestions[ssHighlight];
            setChosenMap(maps[c][0]);
            resetSearch();
        }
    }
    return (
        <div
            className={`${styles.MapControlLayer} ${
                chevron ? '' : styles.MCL_in
            }`}
        >
            <div className={styles.MCL_content}>
                <span>Map</span>
                <div className={styles.MCL_mapsearch}>
                    <input
                        type={'text'}
                        value={mapSearch}
                        onChange={(e) => {
                            handleMapSearch(e);
                            setDoSearch(true);
                        }}
                        onKeyDown={(e) => handleSuggestionsSelect(e.code)}
                        onClick={() => {
                            if (!doSearch) {
                                handleMapSearch();
                                setDoSearch(true);
                            } else resetSearch();
                        }}
                        ref={searchRef}
                    ></input>
                    <Image
                        src={ChevronLight.src}
                        width={25}
                        height={25}
                        alt={'Change Maps'}
                        style={{
                            position: 'absolute',
                            transform: 'translate(295px, 40%) rotate(-90deg)',
                            pointerEvents: 'none',
                        }}
                    ></Image>
                    <div className={styles.mapsearch_suggestions}>
                        {doSearch &&
                            searchSuggestions.map((e, i) => (
                                <div
                                    key={Math.random()}
                                    className={
                                        ssHighlight === i
                                            ? styles.highlight
                                            : ''
                                    }
                                    onClick={() => {
                                        searchRef.current.blur();
                                        setChosenMap(maps[e][0]);
                                        resetSearch();
                                    }}
                                >
                                    {e}
                                </div>
                            ))}
                    </div>
                </div>
                <div style={{ marginTop: '16px' }}>Selectors</div>
            </div>
            <div className={styles.MCL_chevron}>
                <div
                    className={styles.MCL_chevron_container}
                    onClick={() => {
                        setChevron((s) => !s);
                    }}
                >
                    <Image
                        src={ChevronLeft.src}
                        width={25}
                        height={25}
                        alt={'Toggle Drawer'}
                        style={{
                            transform: chevron ? '' : 'rotate(180deg)',
                        }}
                    ></Image>
                </div>
            </div>
        </div>
    );
}
