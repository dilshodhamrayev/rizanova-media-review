import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../../../components/context';
import FilmItem from '../../../components/items/FilmItem';
import Empty from '../../../components/Empty';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function View(props) {
    const router = useRouter();

    const {t, i18n} = useTranslation();

    const { genre_id, page = 1 } = router.query;

    const { data: { pagination, models, genre } } = useSWR(`telenovella/genre?genre_id=${genre_id}&page=${page}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const title = t("Фильмы по жанру") + " — " + genre['name_' + i18n.language];
    const description = t("Посмотреть фильмы по жанрам, которые вам нравятся, можно на сайте RizaNova. Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
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
            <h1 className="big-header">
                {t("Теленовеллы по жанру")} «<Link href="/telenovella/genre"><a>{genre['name_' + i18n.language]}</a></Link>»
            </h1>

            {models.length == 0 && <Empty text={t("Здесь пока пусто")} />}

            <div className="row">
                {models.map((film, index) => {
                    return (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                            <FilmItem model={film} hidePremiere className="px-0" link="telenovella"/>
                        </div>
                    );
                })}
            </div>
        </div>
    </div >;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { genre_id, page = 1 }, locale }) {
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
        let data = await get(`telenovella/genre?genre_id=${genre_id}&page=${page}`, params);

        if (data.status == 'not-found') {
            return {
                notFound: true
            };
        }

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
                    genre: null,
                    pagination: null
                },
                user
            }
        };
    }
});