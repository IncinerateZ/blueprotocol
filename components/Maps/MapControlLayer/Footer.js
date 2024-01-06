import styles from '@/styles/Map.module.css';

import SettingIcon from '@/public/Setting.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer({ showLeak, setShowLeak }) {
    return (
        <div
            style={{
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <span
                onClick={() => {
                    window.location = './contact';
                }}
                style={{ cursor: 'pointer' }}
            >
                Contact
            </span>
            <Link href={'https://incin.net/privacypolicy'}>Privacy Policy</Link>
            <span data-ccpa-link='1'></span>
            <div style={{ cursor: 'pointer' }}>
                <label className={styles.settingsToggle}>
                    <Image
                        src={SettingIcon}
                        width={20}
                        height={20}
                        alt={'settings'}
                        style={{ cursor: 'pointer' }}
                    ></Image>
                    <span className='visually-hidden'>
                        Show / Hide Settings
                    </span>
                    <input
                        type='checkbox'
                        className={'visually-hidden'}
                    ></input>
                </label>
                <div className={styles.settings}>
                    <h1>Settings</h1>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor='Map_showLeak'>
                            Display detailed info?
                        </label>
                        <input
                            type='checkbox'
                            checked={showLeak}
                            onChange={() => {
                                setShowLeak(!showLeak);
                                localStorage.setItem('Map_showLeak', !showLeak);
                            }}
                            id='Map_showLeak'
                        ></input>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('Map_selectorsSource');
                            localStorage.removeItem('Map_excludedSelectors');
                            window.location.reload();
                        }}
                    >
                        Reset All Selectors
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('Map_hiddenMarkers');
                            window.location.reload();
                        }}
                    >
                        Reset All Markers
                    </button>
                </div>
            </div>
        </div>
    );
}
