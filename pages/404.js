import { useTranslation } from "next-i18next";
import Head from 'next/head';

export default function Custom404() {
    const { t, i18n } = useTranslation();

    return (
        <div className="error-page-container">
            <Head>
                <title> 404 — {t("Страница не найдена")} </title>
            </Head>
            <div>
                <h1 className="error-page-title">404</h1>
                <div className="error-page-box">
                    <h2 className="error-page-text">{t("Страница не найдена")}.</h2>
                </div>
            </div>
        </div>
    );
}