import FakeLoader from '@/components/Maps/FakeLoader';
import Head from 'next/head';

export default function contact() {
    return (
        <>
            <Head>
                <link rel='canonical' href='https://bp.incin.net/contact' />
            </Head>
            <div style={{ margin: '2rem' }}>
                <h1>Not all messages may be responded to</h1>
                <p>Discord: incineratez</p>
                <p>Email: admin@incin.net</p>
                <div
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => {
                        window.location = './';
                    }}
                >
                    Back to Homepage
                </div>
            </div>
        </>
    );
}
