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

import ChevronLeft from '../../public/map/chevron-left.svg';

import styles from '../../styles/Map.module.css';
import Image from 'next/image';

export default function Map() {
    const [chosenMap, setChosenMap] = useState('asterleeds');
    const [data, setData] = useState(require('./Markers').default);
    const [markers, setMarkers] = useState({});
    const [mapLoaded, setMapLoaded] = useState(false);

    const [mapSearch, setMapSearch] = useState('');

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

    const [chevron, setChevron] = useState(true);

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

    useEffect(() => {
        setMarkers(data[chosenMap].markers);
        setMapSearch(data[chosenMap].display_name);
    }, [chosenMap, data]);

    useEffect(() => {
        console.log(JSON.stringify(markers.new));
    }, [markers]);

    return (
        <div>
            <div
                className={`${styles.MapControlLayer} ${
                    chevron ? '' : styles.MCL_in
                }`}
            >
                <div className={styles.MCL_content}>
                    <span>Selected Map</span>
                    <div className={styles.MCL_mapsearch}>
                        <input
                            type={'text'}
                            value={mapSearch}
                            onChange={(e) => setMapSearch(e.value)}
                        ></input>
                        <div className={styles.mapsearch_input}></div>
                    </div>
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
