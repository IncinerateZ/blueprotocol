import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    Popup,
    useMapEvents,
    ZoomControl,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import styles from '../../styles/Map.module.css';
import MapControlLayer from './MapControlLayer';
import Head from 'next/head';

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

    const ClickHandler = () => {
        useMapEvents({
            click(e) {
                if (makeMakerMode)
                    setMarkers({
                        ...markers,
                        new: {
                            ...markers['new'],
                            arr: [
                                ...markers['new'].arr,
                                {
                                    lat: e.latlng.lat,
                                    lng: e.latlng.lng,
                                    title: '',
                                    description: '',
                                    type: '',
                                },
                            ],
                        },
                    });
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
    }, [chosenMap, data]);

    useEffect(() => {
        markers?.new?.arr.length > 0 &&
            console.log(JSON.stringify(markers.new));
    }, [markers]);

    useEffect(() => {
        let d = {};

        for (let k in data) d[data[k].display_name] = k;

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
                center={[51.505, -0.09]}
                zoom={2}
                maxBounds={L.latLngBounds(
                    L.latLng(-52, -250),
                    L.latLng(195, 199),
                )}
                maxBoundsViscosity={0.7}
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
                className={styles.Map}
                scrollWheelZoom={true}
                zoomControl={false}
                whenReady={() => {
                    console.log('Map Loaded');
                    setMapLoaded(true);
                }}
            >
                {mapLoaded && (
                    <>
                        <TileLayer
                            attribution='&copy; Bandai Namco Online Inc., &copy; Bandai Namco Studios Inc.'
                            url={data[chosenMap].map_url}
                            maxNativeZoom={3}
                            maxZoom={7}
                            minZoom={3}
                            noWrap={true}
                            bounds={L.latLngBounds(
                                L.latLng(-22, -180),
                                L.latLng(85, 179),
                            )}
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
