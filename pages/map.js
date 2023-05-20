import FakeLoader from '@/components/Maps/FakeLoader';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Map() {
    const Map = dynamic(() => import('@/components/Maps/AsterleedsMap'), {
        loading: () => (
            <>
                <Head>
                    <link rel='canonical' href='https://bp.incin.net/map' />
                </Head>
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        position: 'absolute',
                        backgroundColor: 'black',
                        zIndex: '99999',
                        opacity: '0.8',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                    }}
                >
                    <FakeLoader />
                </div>
            </>
        ),
        ssr: false,
    });
    return (
        <div>
            <Head>
                <title>
                    Blue Protocol Interactive Map | Blue Protocol Resource
                </title>
            </Head>
            <Map></Map>
        </div>
    );
}
