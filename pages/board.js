import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import Quest from '@/components/Board/Quest';
import QuestViewer from '@/components/Board/QuestViewer';
import LangPicker from '@/components/Maps/MapControlLayer/LangPicker';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [lang, setLang] = useState('ja_JP');

    const [panels, setPanels] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedQuest, setSelectedQuest] = useState(null);

    function displayOverlay(board) {
        setSelectedBoard(board);
        let panels = {};
        for (let panel in board.panels) {
            panels[panel] = {
                panel: board.panels[panel],
                element: (
                    <div
                        key={panel}
                        id={panel}
                        className={styles.panelNode}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setTimeout(() => {
                                setSelectedQuest(
                                    board.panels[panel].mission_id,
                                );
                            }, 10);
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
                <title>Adventure Board | Blue Protocol Resource</title>
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
