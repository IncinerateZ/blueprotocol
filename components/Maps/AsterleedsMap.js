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
    const [markers, setMarkers] = useState(
        require('./Markers').default.asterleeds,
    );
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
                    setMarkers([
                        ...markers,
                        {
                            lat: e.latlng.lat,
                            lng: e.latlng.lng,
                            title: '',
                            description: '',
                            type: '',
                        },
                    ]);
            },
        });
        return null;
    };

    useEffect(() => {
        console.log(JSON.stringify(markers));
    }, [markers]);

    return (
        <div>
            <div
                className={`${styles.MapControlLayer} ${
                    chevron ? '' : styles.MCL_in
                }`}
            >
                <div className={styles.MCL_content}>Content</div>
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
                }}
            >
                <TileLayer
                    attribution='&copy; Bandai Namco Online Inc., &copy; Bandai Namco Studios Inc.'
                    url='./asterleeds/{z}/{x}/{y}.png'
                    maxNativeZoom={3}
                    maxZoom={7}
                    minZoom={3}
                    noWrap={true}
                    bounds={L.latLngBounds(
                        L.latLng(-22, -180),
                        L.latLng(85, 179),
                    )}
                />

                {markers.map((e) => (
                    <Marker
                        position={[e.lat, e.lng]}
                        key={Math.random()}
                        icon={iconChest}
                    >
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                ))}
                <ClickHandler />
                <ZoomControl position='topright' />
            </MapContainer>
        </div>
    );
}
