/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

import ChevronLeft from '../../public/map/chevron-left.svg';

import { useState } from 'react';

import styles from '../../styles/Map.module.css';
import LangPicker from './LangPicker';
import MapPicker from './MapPicker';
import Selectors from './Selectors';

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
}) {
    const [chevron, setChevron] = useState(true);

    return (
        <div
            className={`${styles.MapControlLayer} ${
                chevron ? '' : styles.MCL_in
            }`}
        >
            <div className={styles.MCL_content}>
                <LangPicker DB={DB} lang={lang} setLang={setLang} />
                <MapPicker
                    DB={DB}
                    data={data}
                    chosenMap={chosenMap}
                    setChosenMap={setChosenMap}
                    lang={lang}
                    maps={maps}
                />
                <Selectors
                    lang={lang}
                    DB={DB}
                    mapIcons={mapIcons}
                    selectors={selectors}
                    setSelectors={setSelectors}
                    excludedSelectors={excludedSelectors}
                    setExcludedSelectors={setExcludedSelectors}
                    selectorsSource={selectorsSource}
                    setSelectorsSource={setSelectorsSource}
                />
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
    );
}
