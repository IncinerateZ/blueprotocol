import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import Quest from '@/components/Board/Quest';
import QuestViewer from '@/components/Board/QuestViewer';
import LangPicker from '@/components/Maps/MapControlLayer/LangPicker';
import { useRouter } from 'next/router';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [lang, setLang] = useState('ja_JP');

    const [panels, setPanels] = useState(null);

    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [prevSelectedQuest, setPrevSelectedQuest] = useState(null);

    const [firstLoad, setFirstLoad] = useState(true);

    const router = useRouter();

    useEffect(() => {
        let slugs = router.query.boardId || [];

        let bid = slugs.shift();
        let qid = slugs.shift();

        let board = DB.boards[bid] || null;
        let mission = board?.panels[qid]?.mission_id || null;

        if (!board) return;
        displayOverlay(board);
        setSelectedQuest(mission);

        setFirstLoad(false);
    }, [router]);

    useEffect(() => {
        if (firstLoad) return;
        if (!selectedBoard)
            router.push(`/board`, undefined, {
                shallow: true,
            });
        else if (!selectedQuest)
            router.push(`/board/${selectedBoard.id}`, undefined, {
                shallow: true,
            });
    }, [selectedBoard, selectedQuest]);

    function handleSelect(board, panel) {
        setTimeout(() => {
            let mission = board.panels[panel].mission_id;

            setSelectedQuest(mission);
            setPrevSelectedQuest(mission);

            setTimeout(() => {
                document.getElementById('qdc').setAttribute('loading', 'auto');
                document.getElementById('qdc').style.pointerEvents = 'auto';
            }, 1);

            router.push(`/board/${board.id}/${mission}`, undefined, {
                shallow: true,
            });

            if (prevSelectedQuest) {
                let prev = document.getElementById(prevSelectedQuest) || {
                    style: {},
                };

                prev = prev.style;

                prev.filter = '';
                prev.borderWidth = '3px';
            }

            let curr = document.getElementById(mission).style;
            curr.filter = 'brightness(120%)';
            curr.borderWidth = '4px';
        }, 1);
    }

    function displayOverlay(board) {
        setSelectedBoard(board);
        if (!board) return;
        let panels = {};
        for (let panel in board.panels) {
            panels[panel] = {
                panel: board.panels[panel],
                element: (
                    <div
                        tabIndex={1}
                        key={panel}
                        id={panel}
                        className={styles.panelNode}
                        onMouseDown={(e) => {
                            e.stopPropagation();

                            handleSelect(board, panel);
                        }}
                        onMouseEnter={() => {
                            let mission = board.panels[panel].mission_id;

                            setSelectedQuest(mission);
                            setTimeout(() => {
                                let qdc = document.getElementById('qdc') || {
                                    style: {},
                                    setAttribute: () => {},
                                };
                                if (qdc.getAttribute('loading') === 'auto')
                                    return;
                                qdc.style.pointerEvents = 'none';
                                qdc.setAttribute('loading', true);
                            }, 0);
                        }}
                        onMouseLeave={() => {
                            setTimeout(() => {
                                let qdc = document.getElementById('qdc');
                                if (!qdc) return setSelectedQuest(null);
                                if (qdc.getAttribute('loading') === 'false') {
                                    qdc.style.pointerEvents = 'auto';
                                    setSelectedQuest(null);
                                }
                            }, 2);
                            let qdc = document.getElementById('qdc');
                            if (qdc && qdc.getAttribute('loading') !== 'auto')
                                qdc.setAttribute('loading', false);
                        }}
                        onKeyDown={(ev) => {
                            if (ev.code !== 'Enter' && ev.code !== 'Space')
                                return;
                            handleSelect(board, panel);
                        }}
                    ></div>
                ),
            };
        }
        setPanels(panels);
    }

    useEffect(() => {
        if (!DB) return;
    }, [DB]);

    return (
        <>
            <Head>
                <title>Adventure Boards | Blue Protocol Resource</title>
                <link rel='canonical' href='https://bp.incin.net/board' />
            </Head>
            <div className={styles.pageBg}>
                <Nav></Nav>
                <div className={styles.content}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h1 style={{ marginRight: '1rem' }}>
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
                        <div style={{ transform: 'translateY(-20%)' }}>
                            <LangPicker DB={DB} lang={lang} setLang={setLang} />
                        </div>
                    </div>
                    <div className={styles.quests}>
                        {DB &&
                            Object.keys(DB.boards).map((e) => (
                                <Quest
                                    key={e}
                                    e={DB.boards[e]}
                                    DB={DB}
                                    loc={lang}
                                    displayOverlay={displayOverlay}
                                />
                            ))}
                    </div>
                </div>
                {selectedBoard && (
                    <QuestViewer
                        DB={DB}
                        loc={lang}
                        panels={panels}
                        selectedBoard={selectedBoard}
                        setSelectedBoard={setSelectedBoard}
                        selectedQuest={selectedQuest}
                        setSelectedQuest={setSelectedQuest}
                    />
                )}
            </div>
        </>
    );
}
