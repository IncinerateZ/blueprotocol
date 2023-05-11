import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import Quest from '@/components/Board/Quest';
import QuestViewer from '@/components/Board/QuestViewer';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [loc, setLoc] = useState('ja_JP');

    const [panels, setPanels] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);

    function displayOverlay(board) {
        setSelectedBoard(board);
        console.log(board);
        let panels = {};
        for (let panel in board.panels) {
            panels[panel] = {
                panel: board.panels[panel],
                element: (
                    <div
                        key={panel}
                        id={panel}
                        className={styles.panelNode}
                        onMouseDown={(e) => e.stopPropagation()}
                    ></div>
                ),
            };
        }
        setPanels(panels);
    }

    useEffect(() => {
        if (!DB) return;
        console.log(DB);
    }, [DB]);

    return (
        <>
            <Head>
                <title>Adventure Board | Blue Protocol Resource</title>
            </Head>
            <div className={styles.pageBg}>
                <Nav></Nav>
                <div className={styles.content}>
                    <h1>
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
                    <div className={styles.quests}>
                        {DB &&
                            Object.keys(DB.boards).map((e) => (
                                <Quest
                                    key={e}
                                    e={DB.boards[e]}
                                    DB={DB}
                                    loc={loc}
                                    displayOverlay={displayOverlay}
                                />
                            ))}
                    </div>
                </div>
                {selectedBoard && (
                    <QuestViewer
                        DB={DB}
                        loc={loc}
                        panels={panels}
                        selectedBoard={selectedBoard}
                        setSelectedBoard={setSelectedBoard}
                    />
                )}
            </div>
        </>
    );
}
