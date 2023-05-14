import Script from 'next/script';
import '@/styles/globals.css';
import Head from 'next/head';

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
                <meta name='twitter:image' content={icon} />
                <link rel='canonical' href='https://bp.incin.net/' />
                <meta
                    name='google-site-verification'
                    content='oWZPfYe9ZddW-ezHq4cMci74HM2jYMipKS-c0sUw4U4'
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
