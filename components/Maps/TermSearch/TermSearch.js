import { termSearch } from '@/components/utils';
import { useEffect, useRef, useState } from 'react';

import styles from '@/styles/Map.module.css';
import Image from 'next/image';
import SearchResults from './SearchResults';
import { useRouter } from 'next/router';

export default function TermSearch({
    mapIcons,
    LocationNames,
    data,
    lang,
    chosenMap,
    setChosenMap,
    toggleSelector,
}) {
    const router = useRouter();
    const Index = require('../data/MapIndex.json');
    const headRef = useRef(null);

    const [query, setQuery] = useState(router.query.query || '');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.length <= 1) return;

        let searchResults = termSearch(Index, query, chosenMap);
        setResults(searchResults);
        headRef.current.focus();
        if (router.query.auto) {
            findOne: for (let map in searchResults) {
                for (let r of searchResults[map]) {
                    handleSelectResult(map, r);
                    break findOne;
                }
            }
        }
    }, [query]);

    function handleSelectResult(map, r) {
        toggleSelector(
            r.loc.section,
            r.loc.type,
            true,
            r.loc.display_name,
            r.loc.Enemy?.name || '-',
        );
        router.push(
            {
                pathname: '/map',
                query: {
                    lng: r.loc.lng,
                    lat: r.loc.lat,
                    z: r.loc.z,
                    query: query,
                },
                hash: map,
            },
            undefined,
            { shallow: true },
        );
        setChosenMap(map);
    }

    return (
        <div className={styles.TermSearch} tabIndex={0}>
            <div className={styles.TermSearch_head}>
                <Image
                    src='/map/search.svg'
                    width={20}
                    height={20}
                    alt='search icon'
                ></Image>
                <input
                    type='text'
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search IDs, Items, etc..'
                    value={query}
                    ref={headRef}
                ></input>
            </div>
            <div className={styles.TermSearch_results}>
                <SearchResults
                    results={results}
                    mapIcons={mapIcons}
                    data={data}
                    LocationNames={LocationNames}
                    lang={lang}
                    setChosenMap={setChosenMap}
                    query={query}
                    toggleSelector={toggleSelector}
                    handleSelectResult={handleSelectResult}
                />
            </div>
        </div>
    );
}
