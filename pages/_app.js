import Script from 'next/script';
import '@/styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(async () => {
        let version = null;
        const res = await fetch('./api/version');
        const _version = (await res.json()).version;

        if (!version) version = _version;
        let versionCheck = setInterval(async () => {
            const res = await fetch('./api/version');
            const _version = (await res.json()).version;

            if (!version) version = _version;
            console.log(`LTS: ${_version}. Current: ${version}`);

            if (version !== _version) {
                clearInterval(versionCheck);
                window.location.reload();
                return console.log(`Version Mismatch.`);
            }
        }, 1000 * 60 * 10);
    }, []);

    return (
        <>
            <Script
                strategy='lazyOnload'
                async
                src={'https://www.googletagmanager.com/gtag/js?id=G-Y0TV09WSZE'}
            ></Script>
            <Script strategy='lazyOnload' id='ga'>
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-Y0TV09WSZE');
                `}
            </Script>
            <Script
                strategy='lazyOnload'
                id='np-1'
            >{`window.nitroAds=window.nitroAds||{createAd:function(){return new Promise(e=>{window.nitroAds.queue.push(["createAd",arguments,e])})},addUserToken:function(){window.nitroAds.queue.push(["addUserToken",arguments])},queue:[]};`}</Script>
            <Script
                strategy='lazyOnload'
                data-cfasync='false'
                async
                src='https://s.nitropay.com/ads-1253.js'
            ></Script>
            <Head>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                ></meta>
                {/* OpenGraph */}
                <meta
                    property='og:url'
                    content={'https://bp.incin.net/'}
                    key='ogurl'
                />
                <meta
                    property='og:image'
                    content={'https://bp.incin.net/favicon-32x32.png'}
                    key='ogimage'
                />
                <meta
                    property='og:site_name'
                    content='Blue Protocol Resource, Interactive Map, Locations'
                    key='ogsitename'
                />
                <meta
                    property='og:title'
                    content={
                        'Blue Protocol Resource, Interactive Map, Locations'
                    }
                    key='ogtitle'
                />
                <meta
                    property='og:description'
                    content={
                        'Blue Protocol Resource, Interactive Map, Locations'
                    }
                    key='ogdesc'
                />

                {/* Twitter */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:site' content='@The_IncinerateZ' />
                <meta
                    name='twitter:title'
                    content={
                        'Blue Protocol Resource, Interactive Map, Locations'
                    }
                />
                <meta
                    name='twitter:description'
                    content={
                        'Blue Protocol Resource, Interactive Map, Locations'
                    }
                />
                <meta name='twitter:creator' content='@The_IncinerateZ' />
                <meta property='og:url' content={'https://bp.incin.net/'} />
                <meta
                    name='twitter:image'
                    content={'https://bp.incin.net/favicon-32x32.png'}
                />
                <meta
                    name='google-site-verification'
                    content='oWZPfYe9ZddW-ezHq4cMci74HM2jYMipKS-c0sUw4U4'
                />
                <title>Blue Protocol Interactive Map & Resource</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
