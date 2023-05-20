import { useEffect, useState } from 'react';

export default function FakeLoader() {
    function getRandomMessage(messages) {
        if (loadingState === 0) return 'Fetching assets...';
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        return messages[getRandomInt(messages.length)];
    }

    const [loadingState, setLoadingState] = useState(0);

    const messages = require('./data/loading_messages.json');
    const states = [
        { delay: 300, progress: 0 },
        { delay: 150, progress: 3 },
        { delay: 150, progress: 6 },
        { delay: 150, progress: 9 },
        { delay: 150, progress: 12 },
        { delay: 150, progress: 15 },
        { delay: 300, progress: 18 },
        { delay: 2000, progress: 20 },
        { delay: 100, progress: 25 },
        { delay: 100, progress: 30 },
        { delay: 1500, progress: 33 },
        { delay: 150, progress: 35 },
        { delay: 150, progress: 37 },
        { delay: 150, progress: 39 },
        { delay: 150, progress: 41 },
        { delay: 150, progress: 42 },
        { delay: 100, progress: 44 },
        { delay: 100, progress: 46 },
        { delay: 100, progress: 48 },
        { delay: 5000, progress: 50 },
        { delay: 3000, progress: 75 },
        { delay: 10000, progress: 90 },
        { delay: 10000, progress: 100 },
    ];

    useEffect(() => {
        if (loadingState >= states.length - 1) return;
        setTimeout(() => {
            setLoadingState(loadingState + 1);
        }, states[loadingState].delay);
    }, [loadingState]);

    return (
        <div>
            <div
                style={{
                    width: '320px',
                    height: '1rem',
                    backgroundColor: 'var(--dark1)',
                }}
            >
                <div
                    style={{
                        width: `${states[loadingState].progress}%`,
                        height: '100%',
                        backgroundColor: '#f6981e',
                        transition: '0.2s',
                    }}
                ></div>
            </div>
            <p
                style={{
                    padding: 0,
                    margin: 0,
                    width: '320px',
                    textAlign: 'center',
                    color: 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                }}
            >
                {getRandomMessage(messages)}
            </p>
        </div>
    );
}
