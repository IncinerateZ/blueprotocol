import styles from '@/styles/Board.module.css';

import Quest from '@/components/Board/Quest';
import QuestViewer from '@/components/Board/QuestViewer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function InteractiveView({ DB, lang, setLang }) {
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
                    <button
                        key={panel}
                        id={panel}
                        className={styles.panelNode}
                        onClick={(e) => {
                            e.stopPropagation();

                            handleSelect(board, panel);
                        }}
                        onMouseDown={(ev) => ev.stopPropagation()}
                        onMouseEnter={() => {
                            if (
                                document
                                    .getElementById('QuestViewer')
                                    .getAttribute('isDragging') === 'true'
                            )
                                return;

                            let mission = board.panels[panel].mission_id;

                            setSelectedQuest(mission);
                            setTimeout(() => {
                                let qdc = document.getElementById('qdc') || {
                                    style: {},
                                    setAttribute: () => {},
                                    getAttribute: () => {},
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
                    ></button>
                ),
            };
        }
        setPanels(panels);
    }
    return (
        <>
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
            {selectedBoard && (
                <QuestViewer
                    DB={DB}
                    loc={lang}
                    setLang={setLang}
                    panels={panels}
                    selectedBoard={selectedBoard}
                    setSelectedBoard={setSelectedBoard}
                    selectedQuest={selectedQuest}
                    setSelectedQuest={setSelectedQuest}
                />
            )}
        </>
    );
}

export default InteractiveView;
