import ChevronLeftDark from '@/public/map/chevron-left-black.svg';

import { useEffect, useState } from 'react';

import styles from '@/styles/Map.module.css';
import Image from 'next/image';

export default function LangPicker({ DB, lang, setLang }) {
    const [doLangDrop, setDoLangDrop] = useState(false);
    const ReadableString = { en_US: 'EN', ja_JP: 'JP' };

    useEffect(() => {
        pickLang(localStorage.getItem('langPicker_lang') || 'ja_JP');
    }, []);

    function pickLang(lang_) {
        setDoLangDrop(false);
        setLang(lang_);
        storeOption(lang_);
    }

    function storeOption(lang) {
        localStorage.setItem('langPicker_lang', lang);
    }

    return (
        <div className={`${styles.langPicker} ${styles.noSelect}`}>
            <div
                tabIndex={0}
                className={styles.langPicker_display}
                style={{
                    borderBottomLeftRadius: doLangDrop ? '0' : '5px',
                }}
                onClick={() => {
                    setDoLangDrop((p) => !p);
                }}
                onKeyDown={(ev) => {
                    if (ev.code !== 'Enter' && ev.code !== 'Space') return;
                    setDoLangDrop((p) => !p);
                }}
            >
                {ReadableString[lang]}
            </div>
            <div style={{ position: 'relative' }}>
                <Image
                    src={ChevronLeftDark.src}
                    width={25}
                    height={25}
                    alt={'Change Maps'}
                    style={{
                        position: 'absolute',
                        transform:
                            'translate(140%, -110%) ' +
                            `rotate(${doLangDrop ? '-270' : '-90'}deg)`,
                        pointerEvents: 'none',
                        transition: '0.1s',
                    }}
                ></Image>
            </div>
            {doLangDrop && (
                <div className={styles.langPicker_dropdown}>
                    {Object.keys(DB.Loc)
                        .filter((lang_) => lang !== lang_)
                        .map((lang_) => (
                            <div
                                key={Math.random()}
                                onClick={() => {
                                    pickLang(lang_);
                                }}
                                onKeyDown={(ev) => {
                                    if (
                                        ev.code !== 'Enter' &&
                                        ev.code !== 'Space'
                                    )
                                        return;
                                    pickLang(lang_);
                                }}
                                tabIndex={0}
                            >
                                {ReadableString[lang_]}
                            </div>
                        ))}
                </div>
            )}
            {lang === 'en_US' && (
                <div
                    style={{
                        display: 'inline-flex',
                        position: 'absolute',
                        flexDirection: 'row',
                        fontSize: '0.8rem',
                        transform: 'translate(60%, -150%)',
                        width: 'fit-content',
                    }}
                >
                    <div
                        style={{
                            width: '5px',
                            height: '5px',
                            backgroundColor: '#9B1C31',
                            borderRadius: '100%',
                            transform: 'translateY(150%)',
                            marginLeft: '0.2rem',
                            marginRight: '0.2rem',
                        }}
                    ></div>
                    <div style={{ width: '110px' }}>Machine Translated</div>
                </div>
            )}
        </div>
    );
}
