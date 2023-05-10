import Image from 'next/image';

import ChevronLeft from '@/public/map/chevron-left.svg';
import SettingIcon from '@/public/Setting.svg';
import CommandQuest from '@/public/CommandQuest.png';

import { useState } from 'react';

import styles from '@/styles/Map.module.css';
import LangPicker from './LangPicker';
import MapPicker from './MapPicker';
import SelectorsSection from './Selectors/SelectorsSection';
import Link from 'next/link';

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
}) {
    const [chevron, setChevron] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div
            className={`${styles.MapControlLayer} ${
                chevron ? '' : styles.MCL_in
            }`}
        >
            <div className={styles.MCL_content}>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <LangPicker DB={DB} lang={lang} setLang={setLang} />
                    <Link href='/board' className={styles.tooltipParent}>
                        <Image
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
                />
                <div
                    style={{
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span
                        onClick={() => {
                            window.location = './contact';
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Contact
                    </span>
                    <div style={{ cursor: 'pointer' }}>
                        <Image
                            src={SettingIcon}
                            width={20}
                            height={20}
                            onClick={() => setShowSettings(!showSettings)}
                            alt={'settings'}
                        ></Image>
                        {showSettings && (
                            <div className={styles.settings}>
                                <h1>Settings</h1>
                                <div>
                                    <span>Display detailed info?</span>
                                    <input
                                        type='checkbox'
                                        checked={showLeak}
                                        onChange={() => {
                                            setShowLeak(!showLeak);
                                            localStorage.setItem(
                                                'Map_showLeak',
                                                !showLeak,
                                            );
                                        }}
                                    ></input>
                                </div>
                            </div>
                        )}
                    </div>
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
    );
}
