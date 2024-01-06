import Image from 'next/image';

import CommandQuest from '@/public/CommandQuest.png';

import { useEffect, useState } from 'react';

import styles from '@/styles/Map.module.css';
import LangPicker from './LangPicker';
import MapPicker from './MapPicker';
import SelectorsSection from './Selectors/SelectorsSection';
import Link from 'next/link';
import TermSearch from '../TermSearch/TermSearch';
import FloorPicker from './FloorPicker';
import { useAppDispatch, useAppSelector } from 'lib/store';
import Footer from './Footer';
import Chevron from './Chevron';

export default function MapControlLayer({
    data,
    maps,
    chosenMap,
    setChosenMap,
    lang,
    setLang,
    DB,
    mapIcons,
    selectors,
    setSelectors,
    excludedSelectors,
    setExcludedSelectors,
    selectorsSource,
    setSelectorsSource,
    showLeak,
    setShowLeak,
    toggleSelector,
    floors,
    chosenFloor,
    setChosenFloor,
}) {
    const [drawn, setDrawn] = useState(true);

    useEffect(() => {
        loadAds();
    }, []);

    function loadAds() {
        if (!window.nitroAds)
            return setTimeout(() => {
                loadAds();
            }, 3000);

        window['nitroAds'].createAd('map-control-layer', {
            refreshLimit: 20,
            refreshTime: 60,
            renderVisibleOnly: false,
            refreshVisibleOnly: true,
            sizes: [['320', '100']],
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right',
            },
        });
    }

    return (
        <div className={styles.MCL_container}>
            <div
                className={styles.MapControlLayer}
                style={{ transform: drawn ? '' : 'translateX(-95%)' }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <LangPicker DB={DB} lang={lang} setLang={setLang} />
                    <Link href='/board' className={styles.tooltipParent}>
                        <Image
                            onClick={() => {
                                window.location = '/board';
                            }}
                            src={CommandQuest}
                            width={35}
                            height={35}
                            style={{ cursor: 'pointer' }}
                            alt='CommandQuest'
                        ></Image>
                        <div className={styles.tooltip}>Adventure Board</div>
                    </Link>
                </div>

                <MapPicker
                    DB={DB}
                    data={data}
                    chosenMap={chosenMap}
                    setChosenMap={setChosenMap}
                    lang={lang}
                    maps={maps}
                />
                <SelectorsSection
                    lang={lang}
                    DB={DB}
                    mapIcons={mapIcons}
                    selectors={selectors}
                    setSelectors={setSelectors}
                    excludedSelectors={excludedSelectors}
                    setExcludedSelectors={setExcludedSelectors}
                    selectorsSource={selectorsSource}
                    setSelectorsSource={setSelectorsSource}
                    toggleSelector={toggleSelector}
                />
                <div
                    style={{
                        zIndex: '998',
                        position: 'relative',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: '0.2rem',
                    }}
                >
                    <div id='map-control-layer'></div>
                </div>
                <Footer showLeak={showLeak} setShowLeak={setShowLeak} />
            </div>
            <Chevron drawn={drawn} setDrawn={setDrawn} />
            <div
                className={styles.MCL_utilities}
                style={{ transform: drawn ? '' : 'translateX(-330px)' }}
            >
                <TermSearch
                    mapIcons={mapIcons}
                    LocationNames={DB?.LocationNames}
                    lang={lang}
                    data={data}
                    chosenMap={chosenMap}
                    setChosenMap={setChosenMap}
                    toggleSelector={toggleSelector}
                />
                <FloorPicker
                    floors={floors}
                    chosenFloor={chosenFloor}
                    setChosenFloor={setChosenFloor}
                />
            </div>
        </div>
    );
}
