import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Index(props) {
    const {t, i18n} = useTranslation();

    const router = useRouter();

    const title = t("Регистрация на сайте RizaNova");
    const description = t("Смотрите только самые свежие узбекские фильмы, музыкальные видеоклипы, сериалы, концерты и юмор в хорошем качестве. А также, слушайте самые свежие узбекские музыки в хорошем качестве на нашем сайте.");
    const keywords = t("узбекские фильм фильмы сериал сериалы клип клипы музыка музыки концерт концерты поиск кино певец певицы актер актеры актриса режиссер сценарист фото фотография постер");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content="https://rizanova.uz/image/logo.png" />

            </Head>

            <div className="container py-5">
                <div className="d-flex justify-content-center signup-page">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common']))
        }
    };
}