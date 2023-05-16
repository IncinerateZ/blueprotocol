import styles from '@/styles/Nav.module.css';
import Link from 'next/link';

import CommandMap from '@/public/CommandMap.webp';
import Logo from '@/public/android-chrome-512x512.png';
import Image from 'next/image';

export default function Nav() {
    return (
        <nav className={styles.Nav}>
            <div className={styles.Logo}>
                <Image src={Logo} width={45} height={45} alt='Logo'></Image>
                <div
                    style={{
                        marginTop: '0.25rem',
                        marginLeft: '0.5rem',
                        overflow: 'hidden',
                        fontSize: '1.5rem',
                        height: '4rem',
                        fontWeight: 'bold',
                        lineHeight: '1.2rem',
                    }}
                >
                    Blue Protocol Resource
                </div>
            </div>
            <ul style={{ marginLeft: '0.1crem' }}>
                <li className={styles.NavItem}>
                    <Link
                        href='/map'
                        style={{
                            display: 'flex',
                        }}
                        onClick={() => {
                            window.location = '/map';
                        }}
                        tabIndex={0}
                    >
                        <Image
                            src={CommandMap}
                            width={35}
                            height={35}
                            alt='CommandMap'
                        ></Image>
                        <p title='World Map'>World Map</p>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
