import styles from '@/styles/Map.module.css';
import { useRouter } from 'next/router';

export default function SearchResults({
    query,
    results,
    mapIcons,
    data,
    LocationNames,
    lang,
    setChosenMap,
    toggleSelector,
    handleSelectResult,
}) {
    const router = useRouter();

    return (
        <div>
            {Object.keys(results).map((map) => {
                if (results[map].length <= 0)
                    return <div key={Math.random()}></div>;
                return (
                    <div
                        className={styles.TermSearchResults}
                        key={data[map].map_id}
                    >
                        <label>
                            {
                                LocationNames[lang][
                                    data[map].map_id
                                        .replace('dng', 'pub')
                                        .replace('pat', 'pub')
                                ]
                            }
                            <input
                                type='checkbox'
                                className='visually-hidden'
                            ></input>
                        </label>
                        <div className={styles.TermSearchResultsList}>
                            {results[map].map((r) => (
                                <button
                                    key={r.loc.lng + ' ' + r.loc.lat}
                                    onClick={() => {
                                        handleSelectResult(map, r);
                                    }}
                                >
                                    <img
                                        src={
                                            mapIcons[r.loc.type]?.options
                                                ?.iconUrl
                                        }
                                        alt={r.loc.type}
                                        width={32}
                                        height={32}
                                    />
                                    <span>
                                        Location:
                                        {Math.round(r.loc.lng)},{' '}
                                        {Math.round(r.loc.lat)}
                                    </span>
                                    <img
                                        src={'/map/rightarrow.svg'}
                                        alt={r.loc.type}
                                        width={10}
                                        height={10}
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: '1rem',
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
