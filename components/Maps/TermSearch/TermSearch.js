import { termSearch } from '@/components/utils';
import { useEffect, useState } from 'react';

import styles from '@/styles/Map.module.css';
import Image from 'next/image';
import SearchResults from './SearchResults';
import { useRouter } from 'next/router';

export default function TermSearch({
    mapIcons,
    LocationNames,
    data,
    lang,
    setChosenMap,
    toggleSelector,
}) {
    const router = useRouter();
    const Index = require('../data/MapIndex.json');

    const [query, setQuery] = useState(router.query.query || '');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.length <= 1) return;
        setResults(termSearch(Index, query));
    }, [query]);

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
                />
            </div>
        </div>
    );
}
