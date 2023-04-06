import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    Marker,
    Popup,
    useMapEvents,
    ZoomControl,
    ImageOverlay,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import styles from '../../styles/Map.module.css';
import MapControlLayer from './MapControlLayer';
import Head from 'next/head';
import { coordTranslate, entitySummary } from '../utils';
import { useRouter } from 'next/router';

export default function Map() {
    const { asPath, push } = useRouter();
    const data = require('./Markers').default;
    const mapRef = useRef();
    const imgOvRef = useRef();

    const [chosenMap, setChosenMap] = useState(
        asPath.split('#')[1] in data ? asPath.split('#')[1] : 'asterliese',
    );
    const [markers, setMarkers] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);

    const [maps, setMaps] = useState({});
    const [mapSearch, setMapSearch] = useState('');
    const [ssHighlight, setSSHighlight] = useState(0);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [doSearch, setDoSearch] = useState(false);

    const [loadFlag, setLoadFlag] = useState(false);

    const [mapConfig, setMapConfig] = useState(null);
    const [mapIcons, setMapIcons] = useState(null);

    const [mapChanged, setMapChanged] = useState(true);
    const [mapLoading, setMapLoading] = useState(false);

    const [DB, setDB] = useState(null);
    const [lang, setLang] = useState('ja_JP');

    const [selectors, setSelectors] = useState({});
    const [excludedSelectors, setExcludedSelectors] = useState(
        JSON.parse(localStorage.getItem('Map_excludedSelectors')) || {},
    );

    const [selectorsSource, setSelectorsSource] = useState(
        JSON.parse(localStorage.getItem('Map_selectorsSource')) || {},
    );

    const makeMakerMode = true;

    function newMarker(
        lat,
        lng,
        options = { title: `x:${lng} y:${lat}`, description: '', type: '' },
    ) {
        return {
            lng: lng,
            lat: lat,
            ...options,
        };
    }

    function addMarker(
        lat,
        lng,
        options = {
            group: 'new',
            title: `x:${lng} y:${lat}`,
            type: '',
            description: '',
        },
    ) {
        if (Object.keys(markers).length > 0) {
            setMarkers({
                ...markers,
                new: {
                    ...markers[options.group],
                    arr: [
                        ...markers[options.group]?.arr,
                        newMarker(lat, lng, options),
                    ],
                },
            });
        }
    }

    const ClickHandler = () => {
        useMapEvents({
            click(e) {
                if (makeMakerMode) addMarker(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    function resetSearch() {
        if (chosenMap === '') return;
        setMapSearch(
            lang === 'ja_JP' && DB
                ? DB.LocationNames[data[chosenMap].map_id]
                : data[chosenMap].display_name,
        );
        setSSHighlight(0);
        setSearchSuggestions([]);
        setDoSearch(false);
    }

    useEffect(() => {
        if (chosenMap === '') return;

        resetSearch();
        setDoSearch(false);
        setLoadFlag(false);
        setMapLoading(true);
        setMarkers(data[chosenMap]?.markers);
        imgOvRef?.current?.once('load', () => {
            setMapChanged(true);
        });
    }, [chosenMap]);

    useEffect(() => {
        if (chosenMap === '') return;
        if (mapChanged && DB && Object.keys(markers).length > 0) {
            window.history.pushState('', '', `#${chosenMap}`);
            setMapChanged(false);
            setMapLoading(false);

            //first marker render
            if (Object.keys(markers).length === 0 || loadFlag) return;
            setLoadFlag(true);

            let pts = require('./warppoints.json');
            let a = [];

            let _selectors = {};

            //adventure
            pts = DB.POI[data[chosenMap].map_id] || {};
            for (let p in pts) {
                if (!_selectors.Adventure) _selectors.Adventure = {};
                let pt = pts[p];

                let c = coordTranslate(
                    pt.X,
                    -pt.Y,
                    mapConfig[data[chosenMap].map_id],
                );
                let x_ = c.x;
                let y_ = c.y + data[chosenMap].mapOffset;

                let title = DB.LocationNames[pt.title] || pt.selector;

                a.push(
                    newMarker(y_, x_, {
                        type: pt.type,
                        selectors: [pt.selector],
                        title: title,
                    }),
                );

                _selectors.Adventure[pt.type] = {
                    selected:
                        pt.type in (selectorsSource.Adventure || {})
                            ? selectorsSource.Adventure[pt.type].selected
                            : true,
                    display_name: pt.type === 'utility' ? 'Utility' : title,
                };
            }

            //enemies
            pts = DB.EnemyHabitats[data[chosenMap].map_id] || {};

            for (let p in pts) {
                let pt = pts[p];

                let c = coordTranslate(
                    pt.X,
                    pt.Y,
                    mapConfig[data[chosenMap].map_id],
                );
                let x_ = c.x;
                let y_ = -c.y + 1080;

                let selectors_ = [];

                let enemies = (
                    DB.EnemySets.field[pt.Enemies[0].EnemySetId] || {
                        Members: [],
                    }
                ).Members;

                for (let enemy of enemies) {
                    let enemyNameId = DB.Enemies[enemy.EnemyId].name_id;
                    selectors_.push(
                        DB.Loc.ja_JP.enemyparam_text.texts[enemyNameId].text,
                    );

                    _selectors = {
                        ..._selectors,
                        Enemies: {
                            ..._selectors.Enemies,
                            [enemyNameId]: {
                                selected:
                                    enemyNameId in
                                    (selectorsSource.Enemies || {})
                                        ? selectorsSource.Enemies[enemyNameId]
                                              .selected
                                        : true,
                                display_name: enemyNameId,
                                type: pt.type,
                            },
                        },
                    };
                }

                a.push(
                    newMarker(y_, x_, {
                        type: pt.type,
                        title: pt.Enemies[0].EnemySetId,
                        selectors: selectors_,
                    }),
                );
            }

            setSelectors(_selectors);

            //render
            setMarkers({
                ...markers,
                gamedat: {
                    ...(markers['enemies'] || {}),
                    arr: [...a],
                },
            });
        }
    }, [mapChanged, markers]);

    useEffect(() => {
        markers?.new?.arr.length > 0 &&
            console.log(JSON.stringify(markers.new));
    }, [markers]);

    useEffect(() => {
        let d = {};

        let DB_ = require('./DB.json');

        //load map names and tags
        for (let k in data) {
            d[data[k].display_name] = [k];
            d[DB_.LocationNames[data[k].map_id]] = [
                ...(d[DB_.LocationNames[data[k].map_id]] || []),
                k,
            ];
            for (let _k of data[k].tags) d[_k] = [...(d[_k] || []), k];
        }

        //load map icons
        let mi = {
            '': { img: './map/icons/UI_Map_02.png', iconSize: 32 },
            warp: { img: './map/icons/UI_Map_12.png', iconSize: 40 },
            enemy: { img: './map/icons/UI_Map_16.png', iconSize: 40 },
            elite: { img: './map/icons/UI_Map_04.png', iconSize: 32 },
            utility: { img: './map/icons/UI_Map_67.png', iconSize: 32 },
            campfire: { img: './map/icons/UI_Map_107.png', iconSize: 32 },
            fishing: { img: './map/icons/UI_Map_110.png', iconSize: 32 },
            aquatic: {
                img: './map/icons/UI_Icon_Aquatic.png',
                iconSize: 25,
            },
            mineral: {
                img: './map/icons/UI_Icon_Mineral.png',
                iconSize: 25,
            },
            plant: { img: './map/icons/UI_Icon_Plant.png', iconSize: 25 },
            treasure: { img: './map/icons/UI_ItemBox.png', iconSize: 32 },
            buff: { img: './map/icons/UI_Map_95.png', iconSize: 32 },
            nappo: { img: './map/icons/UI_Icon_Nappo.png', iconSize: 32 },
        };

        for (let label in mi)
            mi[label] = new L.Icon({
                iconUrl: mi[label].img,
                iconSize: [mi[label].iconSize, mi[label].iconSize],
                iconAnchor: [mi[label].iconSize / 2, mi[label].iconSize / 2],
                popupAnchor: [0, 0],
                shadowUrl: null,
                shadowSize: null,
                shadowAnchor: null,
            });

        //load map config
        let _cfg = require('./DT_MapBGConfig.json')[0].Rows;
        let cfg = {};

        for (let mapId in _cfg) {
            let o = _cfg[mapId];
            mapId = mapId.split('_')[0];
            if (mapId === 'default') continue;
            if (cfg[mapId]) continue;
            cfg[mapId] = {
                map: mapId,
                CapturePosition: o.CapturePosition,
                CaptureSize: o.CaptureSize,
                ResolutionMultiplier: o.ResolutionMultiplier,
            };
        }

        setMapConfig(cfg);
        setMaps(d);
        setMapIcons(mi);
        setDB(DB_);
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'Map_selectorsSource',
            JSON.stringify(selectorsSource),
        );
        localStorage.setItem(
            'Map_excludedSelectors',
            JSON.stringify(excludedSelectors),
        );
    }, [selectorsSource]);

    return (
        <div>
            <Head>
                <title>
                    {!DB || lang !== 'ja_JP'
                        ? data[chosenMap]?.display_name
                        : DB.LocationNames[data[chosenMap].map_id] ||
                          'Loading'}{' '}
                    Map | Blue Protocol Resource
                </title>
            </Head>
            {mapLoading && (
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        position: 'absolute',
                        backgroundColor: 'black',
                        zIndex: '99999',
                        opacity: '0.6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                    }}
                >
                    <span>Loading...</span>
                </div>
            )}
            <MapControlLayer
                data={data}
                maps={maps}
                mapSearch={mapSearch}
                searchSuggestions={searchSuggestions}
                setSearchSuggestions={setSearchSuggestions}
                ssHighlight={ssHighlight}
                setSSHighlight={setSSHighlight}
                chosenMap={chosenMap}
                setChosenMap={setChosenMap}
                setMapSearch={setMapSearch}
                resetSearch={resetSearch}
                doSearch={doSearch}
                setDoSearch={setDoSearch}
                lang={lang}
                setLang={setLang}
                DB={DB}
                mapIcons={mapIcons}
                selectors={selectors}
                setSelectors={setSelectors}
                excludedSelectors={excludedSelectors}
                setExcludedSelectors={setExcludedSelectors}
                selectorsSource={selectorsSource}
                setSelectorsSource={setSelectorsSource}
            />
            <MapContainer
                center={[540, 960]}
                zoom={0}
                maxBounds={[
                    [1080 * (mapConfig?.ResolutionMultiplier || 1), 0],
                    [0, 1920 * (mapConfig?.ResolutionMultiplier || 1)],
                ]}
                maxBoundsViscosity={0.7}
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
                className={styles.Map}
                scrollWheelZoom={true}
                zoomControl={false}
                minZoom={-1}
                maxZoom={5}
                whenReady={() => {
                    console.log('Map Loaded');
                    setMapLoaded(true);
                }}
                ref={mapRef}
                crs={L.CRS.Simple}
            >
                {mapLoaded && (
                    <>
                        <ImageOverlay
                            url={data[chosenMap]?.map_url || ''}
                            whenReady={() => {}}
                            bounds={[
                                [
                                    1080 *
                                        (mapConfig?.ResolutionMultiplier || 1),
                                    0,
                                ],
                                [
                                    0,
                                    1920 *
                                        (mapConfig?.ResolutionMultiplier || 1),
                                ],
                            ]}
                            ref={imgOvRef}
                            attribution='&copy; Bandai Namco Online Inc., &copy; Bandai Namco Studios Inc.'
                        />
                        {mapIcons &&
                            Object.keys(markers).map((e) =>
                                markers[e].arr.map((v, i) => (
                                    <>
                                        {(v.selectors || []).reduce(
                                            (s, c) =>
                                                s + (excludedSelectors[c] || 0),
                                            0,
                                        ) !== (v.selectors || []).length && (
                                            <Marker
                                                position={[v.lat, v.lng]}
                                                key={i}
                                                icon={mapIcons[v.type]}
                                            >
                                                <Popup>
                                                    {entitySummary(
                                                        DB,
                                                        {
                                                            type: v.type,
                                                            idf: v.title,
                                                            metadata: { ...v },
                                                        },
                                                        lang,
                                                    )}
                                                </Popup>
                                            </Marker>
                                        )}
                                    </>
                                )),
                            )}
                        <ClickHandler />
                        <ZoomControl position='topright' />
                    </>
                )}
            </MapContainer>
        </div>
    );
}
