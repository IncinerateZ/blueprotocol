import styles from '@/styles/Nav.module.css';
import Link from 'next/link';

import CommandMap from '@/public/CommandMap.webp';
import Logo from '@/public/android-chrome-512x512.png';
import Image from 'next/image';

export default function Nav() {
    return (
        <nav className={styles.Nav}>
            <div>
                <Image src={Logo} width={45} height={45}></Image>
            </div>
            <ul>
                <li className={styles.NavItem}>
                    <Link
                        href='/map'
                        style={{
                            display: 'flex',
                            alignitems: 'center',
                        }}
                    >
                        <Image src={CommandMap} width={35} height={35}></Image>
                        <p>World Map</p>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
