import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Map() {
    const Map = dynamic(() => import('../components/Maps/AsterleedsMap'), {
        loading: () => <p>loading...</p>,
        ssr: false,
    });
    return (
        <div>
            <Head>
                <title>Map | Blue Protocol Resource</title>
            </Head>
            <Map></Map>
        </div>
    );
}
