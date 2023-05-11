import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import Quest from '@/components/Board/Quest';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [loc, setLoc] = useState('ja_JP');

    const [showOverlay, setShowOverlay] = useState('false');

    const canvasRef = useRef(null);
    const dRef = useRef(null);

    useEffect(() => {
        var offSets = { x: 0, y: 0 };

        var lastMousePos = { x: 0, y: 0 };
        var isDragging = false;

        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;

        const ctx = canvas.getContext('2d');

        canvas.onmousedown = (e) => {
            isDragging = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
        };

        canvas.onmouseup = () => {
            isDragging = false;
        };

        canvas.onmousemove = (e) => {
            if (isDragging) {
                let oX = e.clientX - lastMousePos.x;
                let oY = e.clientY - lastMousePos.y;

                offSets.x += oX;
                offSets.y += oY;

                lastMousePos = { x: e.clientX, y: e.clientY };

                dRef.current.style.transform = `translate(${offSets.x}px, ${offSets.y}px)`;
                draw();
            }
        };

        draw();

        // setInterval(() => {}, 100);
        function draw() {
            ctx.clearRect(0, 0, 500, 500);

            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(250 + offSets.x, 250 + offSets.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }
    }, []);

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
                <div className={styles.questOverlayContainer}>
                    <div className={styles.questOverlay}>
                        <canvas
                            className={styles.questCanvas}
                            ref={canvasRef}
                        ></canvas>
                        <div
                            style={{
                                position: 'fixed',
                                width: '5px',
                                height: '5px',
                                backgroundColor: 'black',
                            }}
                            ref={dRef}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
}
