import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Board() {
    const [board, setBoard] = useState(null);
    useEffect(() => {
        let _board = {};
        for (let t of ['board', 'panels', 'quests'])
            _board[t] = require('@/components/Board/data/' + t + '.json');
        setBoard(_board);
    }, []);

    useEffect(() => {
        if (board) console.log(board);
    }, [board]);

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
                        <div className={styles.quest}></div>
                    </div>
                </div>
            </div>
        </>
    );
}
