import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));

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
                    <h1>Adventure Board</h1>
                    <div className={styles.quests}>
                        {DB &&
                            DB.boards.map((e, i) => (
                                <div className={styles.quest} key={i}>
                                    {console.log(e)}
                                    <Image
                                        src={`/board/quests/UI_Adventureboard_${e.icon_id}.webp`}
                                        width={190}
                                        height={123}
                                        alt={e.icon_id}
                                        onError={() => {
                                            let temp = DB;
                                            temp.boards[i].icon_id = 'NoData';
                                            setDB({ ...temp });
                                        }}
                                        className={styles.questThumbnail}
                                    ></Image>
                                    <div className={styles.questTitleContainer}>
                                        <span className={styles.questTitle}>
                                            {
                                                DB.Loc['ja_JP'][
                                                    'master_adventure_boards_text'
                                                ].texts[e.name]?.text
                                            }
                                        </span>
                                    </div>
                                    <h5>Unlocked From</h5>
                                    <ul></ul>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
