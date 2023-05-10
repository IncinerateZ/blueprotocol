import styles from '@/styles/Board.module.css';
import Image from 'next/image';

export default function Quest({ e, i, DB, setDB, loc }) {
    return (
        <div className={styles.quest}>
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
                        DB.Loc[loc]['master_adventure_boards_text'].texts[
                            e.name
                        ]?.text
                    }
                </span>
            </div>
            <h5>Unlocked From</h5>
            <p>
                {DB.Sources[e.id]
                    ? DB.Sources[e.id].charAt(0) === 'Q'
                        ? `Completing ${
                              DB.Loc[loc][
                                  `quest_${
                                      {
                                          M: 'main',
                                          S: 'sub',
                                          E: 'main',
                                      }[DB.Sources[e.id].charAt(1)]
                                  }_chapter${DB.Sources[e.id].substring(
                                      4,
                                      6,
                                  )}_text`
                              ]?.texts[
                                  DB.srcQuests[DB.Sources[e.id]?.substring(1)]
                                      ?.name
                              ]?.text || DB.Sources[e.id]?.substring(1)
                          }`
                        : DB.Sources[e.id].charAt(0) === 'A'
                        ? `Adventure Board ${DB.Sources[e.id].substring(4)}`
                        : DB.Sources[e.id].charAt(0) === 'D'
                        ? `Clearing ${
                              DB.LocationNames[loc][
                                  DB.Sources[e.id].substring(1)
                              ] || DB.Sources[e.id].substring(1)
                          }`
                        : `Treasure Box ${DB.Sources[e.id]?.substring(1)}`
                    : 'Adventure Rankup'}
            </p>
            <div className={styles.questId}>
                <span>ID {e.id}</span>
            </div>
        </div>
    );
}
