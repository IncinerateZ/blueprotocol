import Head from 'next/head';

import styles from '@/styles/Home.module.css';
import Map from './map';

export default function Home() {
    return (
        <div className={styles.bg}>
            <Head>
                <title>Blue Protocol Resource</title>
                <meta name='description' content='Blue Protocol Resource' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Map></Map>
        </div>
    );
}
