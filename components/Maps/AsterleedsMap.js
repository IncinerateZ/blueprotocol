import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    Marker,
    Popup,
    useMapEvents,
    ZoomControl,
    ImageOverlay,
    Tooltip,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import styles from '@/styles/Map.module.css';
import MapControlLayer from './MapControlLayer/MapControlLayer';
import Head from 'next/head';
import { coordTranslate, entitySummary } from '../utils';
import { useRouter } from 'next/router';

export default function Map() {
    const { asPath, push } = useRouter();
    const router = useRouter();

    const data = require('./data/Markers.json');
    const mapRef = useRef();
    const imgOvRef = useRef();

    const [chosenMap, setChosenMap] = useState(
        asPath.split('#')[1] in data ? asPath.split('#')[1] : 'cty001',
    );
    const [chosenFloor, setChosenFloor] = useState(1);
    const [markers, setMarkers] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapNameLocs, setMapNameLocs] = useState({});

    const [maps, setMaps] = useState({});

    const [loadFlag, setLoadFlag] = useState(false);

    const [mapConfig, setMapConfig] = useState(null);
    const [mapIcons, setMapIcons] = useState(null);

    const [mapChanged, setMapChanged] = useState(true);
    const [mapLoading, setMapLoading] = useState(false);

    const [DB, setDB] = useState(null);
    const [lang, setLang] = useState('ja_JP');

    const [showLeak, setShowLeak] = useState(
        (localStorage.getItem('Map_showLeak') || 'true') === 'true',
    );

    const [selectors, setSelectors] = useState({});
    const [excludedSelectors, setExcludedSelectors] = useState(
        JSON.parse(localStorage.getItem('Map_excludedSelectors')) || {},
    );

    const [selectorsSource, setSelectorsSource] = useState(
        JSON.parse(localStorage.getItem('Map_selectorsSource')) || {},
    );
    const [hiddenMarkers, setHiddenMarkers] = useState(
        JSON.parse(localStorage.getItem('Map_hiddenMarkers')) || {},
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

    function toggleSelector(
        e,
        s,
        forceState = null,
        display_name = '',
        name = '-',
    ) {
        let currentSelector = selectors[e]?.[s];
        let temp = { ...selectors };

        if (forceState !== null && !currentSelector) {
            currentSelector = {
                selected: forceState,
                display_name: display_name,
            };
            if (name !== '-') currentSelector.type === s;
            if (!temp[e]) temp[e] = {};
            temp[e][s] = currentSelector;
        }

        temp[e][s].selected =
            forceState !== null ? forceState : !temp[e][s].selected;

        setSelectors({ ...temp });
        setSelectorsSource({
            ...selectorsSource,
            ...temp,
        });

        let _excludedSelectors = { ...excludedSelectors };
        let excludedTarget = ['enemy', 'elite'].includes(currentSelector.type)
            ? DB.Loc.ja_JP.enemyparam_text.texts[currentSelector.display_name]
                  ?.text || 'No Data'
            : currentSelector.display_name;

        if (temp[e][s].selected) delete _excludedSelectors[excludedTarget];
        else _excludedSelectors[excludedTarget] = !temp[e][s].selected;

        setExcludedSelectors(_excludedSelectors);
    }

    const ClickHandler = () => {
        useMapEvents({
            click(e) {
                if (makeMakerMode) addMarker(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    useEffect(() => {
        if (chosenMap === '') return;

        setLoadFlag(false);
        setMapLoading(true);
        setMarkers(data[chosenMap]?.markers);
        imgOvRef?.current?.once('load', () => {
            setMapChanged(true);
        });
    }, [chosenMap, chosenFloor]);

    useEffect(() => {
        setChosenFloor(1);
    }, [chosenMap]);

    useEffect(() => {
        if (chosenMap === '') return;

        if (mapConfig && mapChanged && DB && Object.keys(markers).length > 0) {
            window.history.pushState('', '', `#${chosenMap}`);
            setMapChanged(false);
            setMapLoading(false);

            //first marker render
            if (Object.keys(markers).length === 0 || loadFlag) return;
            setLoadFlag(true);

            let a = [];

            let _selectors = {};

            let floorLowBound =
                data[chosenMap]?.floors?.[chosenFloor - 2] || -Infinity;
            let floorHighBound =
                data[chosenMap]?.floors?.[chosenFloor - 1] || Infinity;

            let config =
                mapConfig[
                    data[chosenMap].map_id +
                        (data[chosenMap]?.floors?.length > 0
                            ? `_F${chosenFloor}`
                            : '')
                ];

            //adventure
            let pts = (DB.POI[data[chosenMap].map_id] || { dat: [] }).dat;

            for (let p of pts) {
                if (!_selectors.Adventure) _selectors.Adventure = {};
                let pt = p;
                if (!pt.X || !pt.Y) continue;

                if (pt.Z && (pt.Z < floorLowBound || pt.Z > floorHighBound))
                    continue;

                let c = coordTranslate(pt.X, pt.Y, config);
                let x_ = c.x;
                let y_ = c.y;

                let title = pt.title || pt.selector;

                a.push(
                    newMarker(y_, x_, {
                        type: pt.type,
                        selectors: [pt.selector],
                        title: pt.treasureId || title,
                    }),
                );

                _selectors.Adventure[pt.type] = {
                    selected:
                        pt.type in (selectorsSource.Adventure || {}) &&
                        'selected' in selectorsSource.Adventure[pt.type]
                            ? selectorsSource.Adventure[pt.type].selected &&
                              !excludedSelectors[pt.selector]
                            : true,
                    display_name:
                        {
                            utility: 'Utility',
                            travel: 'Travel Point',
                            dungeon: 'Dungeon',
                            raid: 'Raid',
                        }[pt.type] || title,
                };
            }

            //quests
            pts = DB.Quests[data[chosenMap].map_id] || {};
            for (let p in pts) {
                if (!_selectors.Quests) _selectors.Quests = {};

                let pt = pts[p];
                if (pt.Z && (pt.Z < floorLowBound || pt.Z > floorHighBound))
                    continue;

                _selectors.Quests[pt.type] = {
                    selected:
                        pt.type in (selectorsSource.Quests || {}) &&
                        'selected' in selectorsSource.Quests[pt.type]
                            ? selectorsSource.Quests[pt.type]?.selected &&
                              !excludedSelectors[pt.selector]
                            : true,
                    display_name: pt.selector,
                };

                let c = coordTranslate(pt.X, pt.Y, config);

                a.push(
                    newMarker(c.y, c.x, {
                        type: pt.type,
                        selectors: [pt.selector],
                        title: p,
                        quests: pt.quests,
                    }),
                );
            }

            //enemies
            pts = DB.EnemyHabitats[data[chosenMap].map_id] || {};

            for (let p in pts) {
                let pt = pts[p];
                if (pt.Z && (pt.Z < floorLowBound || pt.Z > floorHighBound))
                    continue;

                let c = coordTranslate(pt.X, pt.Y, config);
                let x_ = c.x;
                let y_ = c.y;

                let selectors_ = [];

                let enemies = (
                    DB.EnemySets.field[pt.Enemies[0].EnemySetId] || {
                        Members: [],
                    }
                ).Members;

                for (let enemy of enemies) {
                    let enemyNameId = DB.Enemies[enemy.EnemyId]?.name_id || 0;
                    selectors_.push(
                        DB.Loc.ja_JP.enemyparam_text.texts[enemyNameId]?.text ||
                            'No Data',
                    );

                    _selectors = {
                        ..._selectors,
                        Enemies: {
                            ..._selectors.Enemies,
                            [enemyNameId]: {
                                selected:
                                    enemyNameId in
                                        (selectorsSource.Enemies || {}) &&
                                    'selected' in
                                        selectorsSource.Enemies[enemyNameId]
                                        ? selectorsSource.Enemies[enemyNameId]
                                              .selected &&
                                          !excludedSelectors[
                                              DB.Loc.ja_JP.enemyparam_text
                                                  .texts[enemyNameId]?.text ||
                                                  'No Data'
                                          ]
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
                        cardinal: pt.cardinal,
                        spawnConditions:
                            pt.type === 'elite' ? pt.SpawnConditions : null,
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
    }, [mapChanged, markers, chosenMap]);

    useEffect(() => {
        markers?.new?.arr.length > 0 &&
            console.log(JSON.stringify(markers.new));
        if (router.query.lat && window.innerWidth > 500) {
            setTimeout(() => {
                document
                    .elementFromPoint(
                        window.innerWidth / 2,
                        window.innerHeight / 2,
                    )
                    .click();
            }, 0);
        }
    }, [markers]);

    useEffect(() => {
        let d = {};

        let DB_ = require('./data/DB.json');

        //load map names and tags
        for (let k in data) {
            if (!data[k].display_name) {
                console.log('Missing map name ' + k);
                continue;
            }
            d[data[k].display_name] = [k];
            let dblocname =
                DB_.LocationNames[lang][
                    data[k].map_id.replace('dng', 'pub').replace('pat', 'pub')
                ];
            d[dblocname] = [...(d[dblocname] || []), k];
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
            travel: { img: './map/icons/UI_Map_99.png', iconSize: 32 },
            dungeon: { img: './map/icons/UI_Map_14.png', iconSize: 32 },
            raid: { img: './map/icons/UI_Map_73.png', iconSize: 32 },
            main_quest: { img: './map/icons/UI_Map_05.png', iconSize: 32 },
            sub_quest: { img: './map/icons/UI_Map_06.png', iconSize: 32 },
            plus_sub_quest: { img: './map/icons/UI_Map_74.png', iconSize: 32 },
            key_character_quest: {
                img: './map/icons/UI_Map_57.png',
                iconSize: 32,
            },
            tutorial_quest: {
                img: './map/icons/UI_Map_06.png',
                iconSize: 32,
            },
            class_quest: {
                img: './map/icons/UI_Map_74.png',
                iconSize: 32,
            },
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
        let _cfg = require('./data/DT_MapBGConfig.json')[0].Rows;
        let cfg = {};

        for (let mapId in _cfg) {
            let o = _cfg[mapId];
            mapId = mapId.split('_')[0];
            if (data[mapId]?.floors?.length > 0) mapId += '_F' + o.Floor;

            if (mapId === 'default') continue;
            if (cfg[mapId]) continue;
            cfg[mapId] = {
                map: mapId,
                CapturePosition: o.CapturePosition,
                CaptureSize: o.CaptureSize,
                ResolutionMultiplier: o.ResolutionMultiplier,
            };
        }

        setMapNameLocs({ ...DB_.MapNameLoc[chosenMap] } || {});
        setMapConfig(cfg);
        setMaps(d);
        setMapIcons(mi);
        setDB(DB_);

        //ads
        loadAds();
    }, []);

    function loadAds() {
        if (!window.nitroAds)
            return setTimeout(() => {
                loadAds();
            }, 3000);

        window['nitroAds'].createAd('map-bottom-right', {
            refreshLimit: 20,
            refreshTime: 60,
            renderVisibleOnly: false,
            refreshVisibleOnly: true,
            sizes: [['300', '250']],
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right',
            },
            mediaQuery: '(min-width: 500px)',
        });

        window['nitroAds'].createAd('map-bottom-mobile', {
            refreshLimit: 20,
            refreshTime: 60,
            renderVisibleOnly: false,
            refreshVisibleOnly: true,
            sizes: [['320', '50']],
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right',
            },
            mediaQuery: '(max-width: 499px)',
        });
    }

    useEffect(() => {
        localStorage.setItem(
            'Map_selectorsSource',
            JSON.stringify(selectorsSource),
        );
    }, [selectorsSource]);

    useEffect(() => {
        localStorage.setItem(
            'Map_excludedSelectors',
            JSON.stringify(excludedSelectors),
        );
    }, [excludedSelectors]);

    return (
        <div style={{ overflow: 'hidden' }}>
            <Head>
                <title>
                    {!DB || lang !== 'ja_JP'
                        ? data[chosenMap]?.display_name
                        : DB.LocationNames[lang][
                              data[chosenMap].map_id
                                  .replace('dng', 'pub')
                                  .replace('pat', 'pub')
                          ] || 'Loading'}{' '}
                    Interactive Map | Blue Protocol Resource
                </title>
                <link rel='canonical' href='https://bp.incin.net/map' />
                <meta
                    name='description'
                    content='Blue Protocol Interactive Map. Quest, Enemy, Gathering Locations.'
                ></meta>
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
                chosenMap={chosenMap}
                setChosenMap={setChosenMap}
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
                showLeak={showLeak}
                setShowLeak={setShowLeak}
                mapRef={mapRef}
                toggleSelector={toggleSelector}
                floors={data[chosenMap].floors}
                chosenFloor={chosenFloor}
                setChosenFloor={setChosenFloor}
            />

            <div
                style={{
                    width: 'fit-content',
                    height: 'fit-content',
                    position: 'absolute',
                    right: '0',
                    bottom: '1.1rem',
                }}
            >
                <div
                    id='map-bottom-right'
                    style={{
                        zIndex: '999',
                        position: 'relative',
                    }}
                ></div>
                <div
                    id='map-bottom-mobile'
                    style={{
                        position: 'relative',
                        zIndex: '998',
                    }}
                ></div>
            </div>

            <MapContainer
                center={[router.query.lat || 540, router.query.lng || 960]}
                zoom={router.query.lat ? 3.5 : 0}
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
                crs={L.extend({}, L.CRS.Simple, {
                    transformation: L.transformation(1, 0, 1, 0),
                })}
            >
                {mapLoaded && (
                    <>
                        <ImageOverlay
                            url={
                                data[chosenMap]?.map_url.replace(
                                    '.webp',
                                    `${
                                        data[chosenMap]?.floors?.length > 0
                                            ? `_${chosenFloor}F`
                                            : ''
                                    }.webp`,
                                ) || ''
                            }
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
                        {Object.keys(mapNameLocs).map((cardinal) => {
                            let _loc = coordTranslate(
                                mapNameLocs[cardinal].x,
                                mapNameLocs[cardinal].y,
                                mapConfig[
                                    data[chosenMap].map_id +
                                        (data[chosenMap]?.floors?.length > 0
                                            ? `_F${chosenFloor}`
                                            : '')
                                ],
                            );
                            return (
                                <div key={Math.random() * 19231}>
                                    <Marker
                                        position={[_loc.y, _loc.x]}
                                        opacity={0}
                                    >
                                        <Tooltip
                                            permanent={true}
                                            direction='center'
                                            className={styles.mapNameLoc}
                                        >
                                            {
                                                DB.LocationNames[lang][
                                                    `${chosenMap}_${mapNameLocs[cardinal].c}`
                                                ]
                                            }
                                        </Tooltip>
                                    </Marker>
                                </div>
                            );
                        })}
                        {mapIcons &&
                            Object.keys(markers).map((e) =>
                                markers[e].arr.map((v, i) => {
                                    let showMarker =
                                        (v.selectors || []).reduce(
                                            (s, c) =>
                                                s + (excludedSelectors[c] || 0),
                                            0,
                                        ) !== (v.selectors || []).length;
                                    if (showMarker)
                                        return (
                                            <div key={i}>
                                                {mapIcons[v.type] && (
                                                    <Marker
                                                        position={[
                                                            v.lat,
                                                            v.lng,
                                                        ]}
                                                        icon={mapIcons[v.type]}
                                                        opacity={
                                                            hiddenMarkers[
                                                                v
                                                                    .selectors[0] ===
                                                                'Treasure Box'
                                                                    ? v.title
                                                                    : v
                                                                          .selectors[0] ===
                                                                      'Nappo'
                                                                    ? `Nappo_${chosenMap}_${Math.floor(
                                                                          v.lat,
                                                                      )}_${Math.floor(
                                                                          v.lng,
                                                                      )}`
                                                                    : 'jsadonhjasodaj'
                                                            ]
                                                                ? '0.5'
                                                                : '1'
                                                        }
                                                    >
                                                        <Popup>
                                                            {entitySummary(
                                                                DB,
                                                                {
                                                                    type: v.type,
                                                                    idf: v.title,
                                                                    metadata: {
                                                                        ...v,
                                                                    },
                                                                },
                                                                lang,
                                                                showLeak,
                                                                hiddenMarkers,
                                                                setHiddenMarkers,
                                                                chosenMap,
                                                            )}
                                                        </Popup>
                                                    </Marker>
                                                )}
                                            </div>
                                        );
                                }),
                            )}
                        {/* <ClickHandler /> */}
                        <ZoomControl position='topright' />
                    </>
                )}
            </MapContainer>
        </div>
    );
}
