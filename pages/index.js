import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from '../styles/Home.module.css';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push('map');
    }, []);

    return (
        <div className={styles.bg}>
            <Head>
                <title>Blue Protocol Resource</title>
                <meta name='description' content='Blue Protocol Resource' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className={styles.comingSoon}>Loading</div>
        </div>
    );
}
