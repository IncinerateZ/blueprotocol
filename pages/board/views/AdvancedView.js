import { useEffect, useState } from 'react';

import styles from '@/styles/Board.module.css';
import AQuestList from '@/components/Board/AQuestList';
import AActiveQuests from '@/components/Board/AActiveQuests';
import APassiveQuests from '@/components/Board/APassiveQuests';

export default function AdvancedView({ DB, lang, setLang }) {
    const [activeBoards, setActiveBoards] = useState({});
    const [boardStatuses, setBoardStatuses] = useState({});
    const [activeQuests, setActiveQuests] = useState({});
    const [upcomingQuests, setUpcomingQuests] = useState({});
    const [completedQuests, setCompletedQuests] = useState({});
    const [allPanels, setAllPanels] = useState({});

    const colors = {
        1: '#d81b60AA',
        2: '#f88c87aa',
        3: '#F9D1B7AA',
        4: '#F0B8D9AA',
        5: '#B6E1E8AA',
        6: '#a2fd80aa',
        7: '#a099fbaa',
        8: '#f8a3faaa',
    };

    function groupQuests(quests) {
        let groups = {};
        let res = {};

        for (let _quest in quests) {
            let quest = DB.quests[quests[_quest].mission_id];
            let questTitle =
                DB.Loc['ja_JP'].master_adventure_board_quests_text.texts[
                    quest.quest_name
                ].text;

            let grouped = false;
            for (let mapName of DB.MapSections) {
                if (questTitle.includes(mapName)) {
                    grouped = true;
                    if (!groups[mapName])
                        groups[mapName] = { [_quest]: quests[_quest] };
                    else groups[mapName][_quest] = quests[_quest];
                }
            }

            if (!grouped)
                groups['misc'] = {
                    ...groups['misc'],
                    [_quest]: quests[_quest],
                };
        }

        for (let mapName in groups)
            for (let quest in groups[mapName])
                res[quest.toString() + '.'] = groups[mapName][quest];

        return res;
    }

    function handleToggleBoard(boardId) {
        function delegateColor(boards) {
            let availableColors = { ...colors };
            for (let board in boards)
                if (boards[board] in availableColors)
                    delete availableColors[boards[board]];
            return Object.keys(availableColors)[0];
        }

        let temp = { ...activeBoards };
        if (boardId in activeBoards) {
            delete temp[boardId];
        } else {
            if (Object.keys(activeBoards).length >= 8) return false;
            temp[boardId] = delegateColor(activeBoards);
        }
        setActiveBoards(temp);
        localStorage.setItem('Board_activeBoards', JSON.stringify(temp));
        return true;
    }

    useEffect(() => {
        setActiveBoards(
            JSON.parse(localStorage.getItem('Board_activeBoards')) || {},
        );
        setBoardStatuses(
            JSON.parse(localStorage.getItem('Board_boardStatuses')) || {},
        );
    }, []);

    useEffect(() => {
        const _activeQuests = {};
        const _upcomingQuests = {};
        let _completedQuests = {};
        let panels = {};

        for (let boardId in activeBoards) {
            const board = DB.boards[boardId];
            const tempDelete = [];
            _completedQuests = {
                ..._completedQuests,
                ...boardStatuses[boardId]?.completed,
            };

            panels = { ...panels, ...board.panels };

            for (let panelId in board.panels) {
                const panel = board.panels[panelId];
                if (
                    !(panel.id in _activeQuests) &&
                    !(panel.id in _completedQuests)
                )
                    _activeQuests[panel.id] = panel;
                for (let upcomingPanel of panel.next_panel_ids) {
                    let upcomingId = upcomingPanel.panel_id;

                    _activeQuests[upcomingId] = false;
                    tempDelete.push(upcomingId);
                    if (
                        panel.id in _completedQuests &&
                        !(upcomingId in _completedQuests)
                    ) {
                        _activeQuests[upcomingId] = {
                            ...board.panels[upcomingId],
                        };
                        tempDelete.pop();
                    } else if (!(upcomingId in _completedQuests))
                        _upcomingQuests[upcomingId] = {
                            ...board.panels[upcomingId],
                        };
                }
            }

            for (let id of tempDelete) delete _activeQuests[id];
        }

        setActiveQuests(groupQuests(_activeQuests));
        setUpcomingQuests(groupQuests(_upcomingQuests));
        setCompletedQuests(_completedQuests);
        setAllPanels(panels);
    }, [activeBoards, boardStatuses]);

    useEffect(() => {
        localStorage.setItem(
            'Board_boardStatuses',
            JSON.stringify(boardStatuses),
        );
    }, [boardStatuses]);

    return (
        <div className={styles.AdvancedView}>
            <AQuestList
                DB={DB}
                lang={lang}
                setLang={setLang}
                activeBoards={activeBoards}
                handleToggleBoard={handleToggleBoard}
                boardStatuses={boardStatuses}
                setBoardStatuses={setBoardStatuses}
                colors={colors}
            />
            <AActiveQuests
                DB={DB}
                lang={lang}
                boardStatuses={boardStatuses}
                setBoardStatuses={setBoardStatuses}
                activeQuests={activeQuests}
                allPanels={allPanels}
                activeBoards={activeBoards}
                colors={colors}
            />
            <APassiveQuests
                DB={DB}
                lang={lang}
                boardStatuses={boardStatuses}
                setBoardStatuses={setBoardStatuses}
                upcomingQuests={upcomingQuests}
                completedQuests={completedQuests}
                allPanels={allPanels}
                setCompletedQuests={setCompletedQuests}
                activeBoards={activeBoards}
                colors={colors}
            />
        </div>
    );
}
