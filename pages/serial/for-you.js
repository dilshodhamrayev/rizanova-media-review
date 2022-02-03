import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { get } from '../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../../components/context';
import FilmItem from '../../components/items/FilmItem';
import Pagination from '../../components/Pagination';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ForYou(props) {
    const router = useRouter();

    const {t, i18n} = useTranslation();

    const { page = 1 } = router.query;

    const { data: { pagination, models } } = useSWR(`serial/for-u?page=${page}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const title = t("Сериалы для вас");
    const description = t("Сайт RizaNova рекомендует вам сериалы на основе ваших историй о просмотре фильмов. Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских фильм фильмов актеры актрисы режиссеры узбеккино онлайн жанры");

    return <div>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content="https://rizanova.uz/image/logo.png" />

        </Head>

        <div className="container min-view inner-page">
            <ul className="breadcrumbs">
                <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                <li><span>/</span></li>
                <li><Link href="/film"><a>{t("Сериалы")}</a></Link></li>
                <li><span>/</span></li>
                <li><p>{t("Сериалы для вас")}</p></li>
            </ul>

            <h1 className="big-header">
                {t("Сериалы для вас")}
            </h1>

            <div className="row">
                {models.map((film, index) => {
                    return (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                            <FilmItem model={film} link='serial' hidePremiere className="px-0" />
                        </div>
                    );
                })}
            </div>

            <Pagination pageCount={pagination.pageCount || 0} totalCount={pagination.totalCount || 0} initialPage={page - 1} />

        </div>
    </div >;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { page = 1 }, locale }) {
    const user = req.session.get('user') || null;

    let params = {};

    if (user) {
        params = {
            "headers": {
                "Authorization": "Bearer " + user.token
            }
        };
    }

    try {
        let data = await get(`serial/for-u?page${page}`, params);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data: {
                    models: [],
                    pagination
                },
                user
            }
        };
    }
});