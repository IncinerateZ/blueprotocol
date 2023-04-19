import ChevronLeftDark from '../../public/map/chevron-left-black.svg';

import { useState } from 'react';

import styles from '../../styles/Map.module.css';
import Image from 'next/image';

export default function LangPicker({ DB, lang, setLang }) {
    const [doLangDrop, setDoLangDrop] = useState(false);
    const ReadableString = { en_US: 'EN', ja_JP: 'JP' };

    return (
        <div className={`${styles.langPicker} ${styles.noSelect}`}>
            <div
                className={styles.langPicker_display}
                style={{
                    borderBottomLeftRadius: doLangDrop ? '0' : '5px',
                }}
                onClick={() => {
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
                                    setDoLangDrop(false);
                                    setLang(lang_);
                                }}
                            >
                                {ReadableString[lang_]}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
