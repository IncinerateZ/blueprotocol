import Head from 'next/head';

import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div className={styles.bg}>
            <Head>
                <title>Blue Protocol Resource</title>
                <meta name='description' content='Blue Protocol Resource' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className={styles.comingSoon}>Coming Soon?</div>
        </div>
    );
}
