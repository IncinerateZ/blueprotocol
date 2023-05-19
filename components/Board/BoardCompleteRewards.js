import Image from 'next/image';
import React, { useState } from 'react';

import styles from '@/styles/Board.module.css';
import BoardReward from './rewards/BoardReward';

export default function BoardCompleteRewards({ DB, loc, selectedBoard }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className={styles.BoardCompleteRewards}
            onClick={(ev) => ev.stopPropagation()}
            onMouseDown={(ev) => ev.stopPropagation()}
        >
            <button
                onClick={() => {
                    setShowTooltip(!showTooltip);
                }}
            >
                <Image
                    src={
                        '/board/UI_AdventureBoardCompleteRewardBtnHovered.webp'
                    }
                    alt='Board Complete Rewards'
                    width={70}
                    height={70}
                />
                {showTooltip && (
                    <>
                        <div className={styles.CompleteRewards_tooltip}>
                            <h1>Board Completion Reward</h1>
                            {selectedBoard.complete_reward_id_list.map((r) => {
                                let reward = DB.Rewards[r.reward_id];
                                return new BoardReward(
                                    reward.item_id,
                                    reward.reward_type,
                                    reward.amount,
                                    loc,
                                ).reward.build();
                            })}
                        </div>
                        <figure className={styles.tooltip_arrow}></figure>
                    </>
                )}
            </button>
        </div>
    );
}
