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
import { coordTranslate } from '../utils';

export default function Map() {
    const [chosenMap, setChosenMap] = useState('asterleeds');
    const [data, setData] = useState(require('./Markers').default);
    const [markers, setMarkers] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);

    const [maps, setMaps] = useState({});
    const [mapSearch, setMapSearch] = useState('');
    const [ssHighlight, setSSHighlight] = useState(0);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [doSearch, setDoSearch] = useState(false);

    const [loadFlag, setLoadFlag] = useState(false);

    const [mapRef, setMapRef] = useState(useRef());

    const [mapConfig, setMapConfig] = useState(null);

    const makeMakerMode = true;
    const iconChest = new L.Icon({
        iconUrl: './map/icons/UI_Map_02.png',
        iconSize: [64, 64],
        iconAnchor: [32, 32],
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
    });

    function newMarker(lat, lng, options = { title: `x:${lng} y:${lat}` }) {
        return {
            lng: lng,
            lat: lat,
            title: options.title,
            description: '',
            type: '',
        };
    }

    function addMarker(
        lat,
        lng,
        options = { group: 'new', title: `x:${lng} y:${lat}` },
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
        setMapSearch(data[chosenMap].display_name);
        setSSHighlight(0);
        setSearchSuggestions([]);
        setDoSearch(false);
    }

    useEffect(() => {
        setMarkers(data[chosenMap].markers);
        resetSearch();
        setDoSearch(false);
        setLoadFlag(false);
    }, [chosenMap, data]);

    useEffect(() => {
        markers?.new?.arr.length > 0 &&
            console.log(JSON.stringify(markers.new));

        if (Object.keys(markers).length === 0 || loadFlag) return;
        setLoadFlag(true);
        let pts = require('./warppoints.json');
        let a = [];

        for (let pt of pts) {
            if (
                pt.game_content_id.includes(data[chosenMap].map_id) &&
                !pt.dest_game_content_id.includes('pub')
            ) {
                let c = coordTranslate(
                    pt.location_x,
                    -pt.location_y,
                    mapConfig[data[chosenMap].map_id],
                );
                let x_ = c.x;
                let y_ = c.y + data[chosenMap].mapOffset;
                a.push(newMarker(y_, x_));
            }
        }

        setMarkers({
            ...markers,
            new: {
                ...markers['new'],
                arr: [...markers['new'].arr, ...a],
            },
        });
    }, [markers]);

    useEffect(() => {
        let d = {};

        for (let k in data) {
            d[data[k].display_name] = k;
            for (let _k of data[k].tags) d[_k] = k;
        }

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
    }, []);

    return (
        <div>
            <Head>
                <title>
                    {data[chosenMap].display_name} Map | Blue Protocol Resource
                </title>
            </Head>
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
                            url={data[chosenMap].map_url}
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
                        />
                        {Object.keys(markers).map((e) =>
                            markers[e].arr.map((v) => (
                                <Marker
                                    position={[v.lat, v.lng]}
                                    key={Math.random()}
                                    icon={iconChest}
                                >
                                    <Popup>{v.title}</Popup>
                                </Marker>
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
