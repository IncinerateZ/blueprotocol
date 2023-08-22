import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import LangPicker from '@/components/Maps/MapControlLayer/LangPicker';
import InteractiveView from './views/InteractiveView';
import AdvancedView from './views/AdvancedView';
import ViewToggle from './ViewToggle';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [lang, setLang] = useState('ja_JP');

    const [interactiveView, setInteractiveView] = useState(true);

    const colors = {
        1: '#d81b60AA',
        2: '#F2A51Aaa',
        3: '#FF6363aa',
        4: '#f88c87aa',
        5: '#F9D1B7AA',
        6: '#F0B8D9AA',
        7: '#B6E1E8AA',
        8: '#a2fd80aa',
        9: '#a099fbaa',
        10: '#7900FFaa',
    };

    useEffect(() => {
        if (!DB) return () => {};
    }, [DB]);

    useEffect(() => {
        setInteractiveView(localStorage.getItem('Board_view') === 'true');
        loadAds();
    }, []);

    function toggleView() {
        localStorage.setItem('Board_view', !interactiveView);
        setInteractiveView((s) => !s);
    }

    function loadAds() {
        if (!window.nitroAds)
            return setTimeout(() => {
                loadAds();
            }, 3000);

        window['nitroAds'].createAd('board-left-widescreen', {
            refreshLimit: 20,
            refreshTime: 60,
            renderVisibleOnly: false,
            refreshVisibleOnly: true,
            sizes: [['160', '600']],
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right',
            },
            mediaQuery: '(min-width: 1024px)',
        });

        window['nitroAds'].createAd('board-right-widescreen', {
            refreshLimit: 20,
            refreshTime: 60,
            renderVisibleOnly: false,
            refreshVisibleOnly: true,
            sizes: [['160', '600']],
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right',
            },
            mediaQuery: '(min-width: 980px)',
        });

        window['nitroAds'].createAd('board-bottom-mobile', {
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
            mediaQuery: '(max-width: 979px)',
        });
    }

    return (
        <>
            <Head>
                <title>Adventure Boards | Blue Protocol Resource</title>
                <link rel='canonical' href='https://bp.incin.net/board' />
                <meta
                    name='description'
                    content='Blue Protocol Adventure Board. Adventure Board Details & Rewards. How to obtain adventure boards in Blue Protocol.'
                ></meta>
            </Head>
            <div className={styles.pageBg}>
                <Nav></Nav>
                <div
                    style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                    }}
                    className='left-right-ad'
                >
                    <div
                        id='board-left-widescreen'
                        style={{
                            marginLeft: '3.5rem',
                        }}
                    ></div>
                </div>
                <main className={styles.content}>
                    <div
                        style={{ display: 'flex', alignItems: 'center' }}
                        className={styles.contentHeader}
                    >
                        <h1
                            style={{ marginRight: '1rem', textAlign: 'center' }}
                        >
                            <Image
                                src={CommandQuest}
                                alt='CommandQuest'
                                width={40}
                                height={40}
                                style={{
                                    marginRight: '0.5rem',
                                    transform: 'translateY(20%)',
                                    zIndex: '0',
                                }}
                            ></Image>
                            Adventure Board
                        </h1>
                        <div
                            style={{
                                transform: 'translateY(-20%)',
                                marginRight: '1rem',
                            }}
                        >
                            <LangPicker DB={DB} lang={lang} setLang={setLang} />
                        </div>
                        <ViewToggle
                            view={interactiveView}
                            toggleView={toggleView}
                        />
                    </div>
                    {interactiveView ? (
                        <InteractiveView
                            DB={DB}
                            lang={lang}
                            setLang={setLang} colors={colors}
                        />
                    ) : (
                        <AdvancedView DB={DB} lang={lang} setLang={setLang} colors={colors} />
                    )}
                </main>
                <div
                    style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                    }}
                    className='left-right-ad'
                >
                    <div
                        id='board-right-widescreen'
                        style={{
                            marginRight: '0.5rem',
                        }}
                    ></div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '3.5rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <div id='board-bottom-mobile'></div>
                </div>
            </div>
        </>
    );
}
