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
    return (
        <div className={styles.MCL_container}>
            <div className={styles.MapControlLayer}>
                <div className={styles.MCL_content}>
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
                            <div className={styles.tooltip}>
                                Adventure Board
                            </div>
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
                            <label className={styles.settingsToggle}>
                                <Image
                                    src={SettingIcon}
                                    width={20}
                                    height={20}
                                    alt={'settings'}
                                    style={{ cursor: 'pointer' }}
                                ></Image>
                                <span className='visually-hidden'>
                                    Show / Hide Settings
                                </span>
                                <input
                                    type='checkbox'
                                    className={'visually-hidden'}
                                ></input>
                            </label>
                            <div className={styles.settings}>
                                <h1>Settings</h1>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label htmlFor='Map_showLeak'>
                                        Display detailed info?
                                    </label>
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
                                        id='Map_showLeak'
                                    ></input>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem(
                                            'Map_selectorsSource',
                                        );
                                        localStorage.removeItem(
                                            'Map_excludedSelectors',
                                        );
                                        window.location.reload();
                                    }}
                                >
                                    Reset All Selectors
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem(
                                            'Map_hiddenMarkers',
                                        );
                                        window.location.reload();
                                    }}
                                >
                                    Reset All Markers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.MCL_chevron}>
                <label className={styles.MCL_chevron_container}>
                    <Image
                        src={ChevronLeft.src}
                        width={25}
                        height={25}
                        alt={'Toggle Drawer'}
                        className={styles.chevronIcon}
                    ></Image>
                    <span className={'visually-hidden'}>
                        Show / Hide Drawer
                    </span>
                    <input
                        type='checkbox'
                        className={'visually-hidden'}
                    ></input>
                </label>
            </div>
        </div>
    );
}
