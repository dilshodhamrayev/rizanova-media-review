import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function RizanovaTv() {
    const {t, i18n} = useTranslation();

    return (
        <section className="rizanova-tv py-70">
            <div className="container">
                <div className="tv py-70 px-100 position-relative">
                    <h3 className="title-1 mt-3 mt-md-4 mt-lg-5 mb-3 mb-md-3 mb-lg-4">RizaNova TV</h3>
                    <p className="sub-title-2 max-width-" dangerouslySetInnerHTML={{
                        __html: t("Круглосуточное<br>прямое эфир от RizaNova")
                    }}></p>
                    <Link href="/tv">
                        <a className="btn-gradient-purple mt-3 mt-md-4 mt-lg-5">{t("Смотреть онлайн")}</a>
                    </Link>
                </div>
            </div>
        </section>
    );
}