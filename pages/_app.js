import Script from 'next/script';
import '../styles/globals.css';
import Head from 'next/head';

import icon from '../public/favicon-32x32.png';

function MyApp({ Component, pageProps }) {
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
            <Head>
                {/* OpenGraph */}
                <meta
                    property='og:url'
                    content={'https://bp.incin.net/'}
                    key='ogurl'
                />
                <meta property='og:image' content={icon} key='ogimage' />
                <meta
                    property='og:site_name'
                    content='Blue Protocol Resource, Interactive Map'
                    key='ogsitename'
                />
                <meta
                    property='og:title'
                    content={'Blue Protocol Resource, Interactive Map'}
                    key='ogtitle'
                />
                <meta
                    property='og:description'
                    content={'Blue Protocol Resource, Interactive Map'}
                    key='ogdesc'
                />

                {/* Twitter */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:site' content='@The_IncinerateZ' />
                <meta
                    name='twitter:title'
                    content={'Blue Protocol Resource, Interactive Map'}
                />
                <meta
                    name='twitter:description'
                    content={'Blue Protocol Resource, Interactive Map'}
                />
                <meta name='twitter:creator' content='@The_IncinerateZ' />
                <meta property='og:url' content={'https://bp.incin.net/'} />
                <meta name='twitter:image' content={icon} />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
