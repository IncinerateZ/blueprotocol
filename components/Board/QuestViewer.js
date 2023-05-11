import styles from '@/styles/Board.module.css';
import { useEffect, useRef, useState } from 'react';
import { connectingPts } from '../utils';

export default function QuestViewer({ DB, loc, panels, setSelectedBoard }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        var offSets = { x: 0, y: 0 };
        var dragOffsets = { x: 0, y: 0 };
        var baseOffsets = { x: 0, y: 0 };

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

        baseOffsets = { ...offSets };

        canvas.onmousedown = (e) => {
            isDragging = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
        };

        canvas.onmouseup = () => {
            isDragging = false;

            if (
                Math.floor(offSets.x) !== Math.floor(baseOffsets.x) ||
                Math.floor(offSets.y) !== Math.floor(baseOffsets.y)
            ) {
                let dX = offSets.x > baseOffsets.x ? -3 : 3;
                let dY = offSets.y > baseOffsets.y ? -3 : 3;

                let intvl = setInterval(() => {
                    if (
                        Math.abs(
                            Math.floor(offSets.x) - Math.floor(baseOffsets.x),
                        ) <= 10
                    )
                        dX = 0;
                    if (
                        Math.abs(
                            Math.floor(offSets.y) - Math.floor(baseOffsets.y),
                        ) <= 10
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
            const first = document.getElementById(firstLast[0].id);
            const last = document.getElementById(firstLast[1].id);

            first.style.border = '5px solid #B4E4FF';
            first.style.backgroundColor = '#DFFFD8';

            last.style.border = '5px solid #95BDFF';
            last.style.backgroundColor = '#F7C8E0';
        }
    }, []);

    return (
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
                {Object.keys(panels).map((pid) => panels[pid].element)}
            </div>
        </div>
    );
}
