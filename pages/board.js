import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import Quest from '@/components/Board/Quest';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [loc, setLoc] = useState('ja_JP');

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
                            }}
                        ></Image>
                        Adventure Board
                    </h1>
                    <div className={styles.quests}>
                        {DB &&
                            DB.boards.map((e, i) => (
                                <Quest
                                    key={i}
                                    e={e}
                                    i={i}
                                    DB={DB}
                                    setDB={setDB}
                                    loc={loc}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
