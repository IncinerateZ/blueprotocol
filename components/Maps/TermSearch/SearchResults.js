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
}) {
    const router = useRouter();

    return (
        <div>
            {Object.keys(results).map((map) => {
                if (results[map].length <= 0) return <></>;
                return (
                    <div className={styles.TermSearchResults}>
                        <span>
                            {
                                LocationNames[lang][
                                    data[map].map_id
                                        .replace('dng', 'pub')
                                        .replace('pat', 'pub')
                                ]
                            }
                        </span>
                        <div className={styles.TermSearchResultsList}>
                            {results[map].map((r) => (
                                <button
                                    onClick={() => {
                                        router.push(
                                            {
                                                pathname: '/map',
                                                query: {
                                                    lng: r.loc.lng,
                                                    lat: r.loc.lat,
                                                    query: query,
                                                },
                                                hash: map,
                                            },
                                            undefined,
                                            { shallow: true },
                                        );
                                        setChosenMap(map);
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
