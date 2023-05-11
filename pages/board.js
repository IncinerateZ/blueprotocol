import Nav from '@/components/Nav/Nav';
import styles from '@/styles/Board.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import CommandQuest from '@/public/CommandQuest.png';
import Quest from '@/components/Board/Quest';
import { connectingPts } from '@/components/utils';

export default function Board() {
    const [DB, setDB] = useState(require('@/components/Board/data/DB.json'));
    const [loc, setLoc] = useState('ja_JP');

    const [selectedBoard, setSelectedBoard] = useState(null);
    const [panels, setPanels] = useState(null);

    const canvasRef = useRef(null);

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
        if (!selectedBoard) return;
        var offSets = { x: 0, y: 0 };
        var dragOffsets = { x: 0, y: 0 };

        var lastMousePos = { x: 0, y: 0 };
        var isDragging = false;

        const canvas = canvasRef.current;
        canvas.width = 600;
        canvas.height = 600;

        const ctx = canvas.getContext('2d');

        let minX = 0,
            minY = 0,
            maxX = 0,
            maxY = 0;

        for (let panel in panels) {
            panel = panels[panel].panel;

            let cX = panel.ui_pos_x;
            let cY = panel.ui_pos_y;

            minX = Math.min(minX, cX);
            minY = Math.min(minY, cY);

            maxX = Math.max(maxX, cX);
            maxY = Math.max(maxY, cY);
        }

        if (minX < 0) {
            let abs = Math.abs(minX);

            maxX += abs;

            minX = 0;
        } else {
            maxX -= minX;

            minX = 0;
        }

        if (minY < 0) {
            let abs = Math.abs(minY);

            maxY += abs;

            minY = 0;
        } else {
            maxY -= minY;

            minY = 0;
        }

        offSets.x += (600 - maxX) / 2;
        offSets.y += (600 - maxY) / 2;

        canvas.onmousedown = (e) => {
            isDragging = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
        };

        canvas.onmouseup = () => {
            isDragging = false;

            const OFFSET_LIMIT = 180;

            if (
                Math.abs(offSets.x) >
                    OFFSET_LIMIT -
                        (offSets.x < 0 ? canvas.width : -(canvas.width / 2)) ||
                Math.abs(offSets.y) >
                    OFFSET_LIMIT -
                        (offSets.y < 0 ? canvas.height : -(canvas.height / 2))
            ) {
                let dX =
                    Math.abs(offSets.x) > OFFSET_LIMIT
                        ? -5 * ((offSets.x + 1) / (Math.abs(offSets.x) + 1))
                        : 0;
                let dY =
                    Math.abs(offSets.y) > OFFSET_LIMIT
                        ? -5 * ((offSets.y + 1) / (Math.abs(offSets.y) + 1))
                        : 0;

                let intvl = setInterval(() => {
                    if (
                        Math.abs(offSets.x) <
                        OFFSET_LIMIT - (offSets.x < 0 ? canvas.width / 2 : -100)
                    )
                        dX = 0;
                    if (
                        Math.abs(offSets.y) <
                        OFFSET_LIMIT -
                            (offSets.y < 0 ? canvas.height / 2 : -100)
                    )
                        dY = 0;
                    if (dX === 0 && dY === 0) clearInterval(intvl);

                    offSets.x += dX;
                    offSets.y += dY;

                    dragOffsets.x += dX;
                    dragOffsets.y += dY;

                    draw();
                }, 1);
            }
        };

        canvas.onmousemove = (e) => {
            if (isDragging) {
                let oX = e.clientX - lastMousePos.x;
                let oY = e.clientY - lastMousePos.y;

                oX *= 1 / (Math.abs(oX / 5) + 1);
                oY *= 1 / (Math.abs(oY / 5) + 1);

                dragOffsets.x += oX;
                dragOffsets.y += oY;

                offSets.x += oX;
                offSets.y += oY;

                lastMousePos = { x: e.clientX, y: e.clientY };

                draw();
            }
        };

        draw();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let firstLast = [];

            for (let panel in panels) {
                let pane = panels[panel].panel;

                if (firstLast.length === 0) firstLast.push(pane);
                else firstLast.pop();
                firstLast.push(pane);

                document.getElementById(panel).style.transform = `translate(${
                    offSets.x + pane.ui_pos_x - 20
                }px, ${offSets.y + pane.ui_pos_y - 20}px)`;

                for (let next of pane.next_panel_ids) {
                    let nextId = next.panel_id;
                    next = panels[nextId].panel;

                    let nX = next.ui_pos_x;
                    let nY = next.ui_pos_y;

                    let c = connectingPts(
                        {
                            x: offSets.x + pane.ui_pos_x,
                            y: offSets.y + pane.ui_pos_y,
                            r: 20,
                        },
                        { x: offSets.x + nX, y: offSets.y + nY, r: 20 },
                    );

                    ctx.strokeStyle = '#A7A2A9';

                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(c[0].x, c[0].y);
                    ctx.lineTo(c[1].x, c[1].y);
                    ctx.stroke();
                }
            }
            document.getElementById(firstLast[0].id).style.border =
                '5px solid #CEEDC7';
            document.getElementById(firstLast[1].id).style.border =
                '5px solid #86C8BC';
            console.log(firstLast);
        }
    }, [selectedBoard]);

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
                    <div
                        className={styles.questOverlayContainer}
                        onMouseDown={() => setSelectedBoard(null)}
                    >
                        <div className={styles.questOverlay}>
                            <canvas
                                className={styles.questCanvas}
                                ref={canvasRef}
                                onMouseDown={(e) => e.stopPropagation()}
                            ></canvas>
                            {Object.keys(panels).map(
                                (pid) => panels[pid].element,
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
