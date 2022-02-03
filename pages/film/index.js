import React from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import PremiereCarousel from '../../components/carousels/film/PremiereCarousel';
import Carousel from '../../components/carousels/film/Carousel';
import { useTranslation } from 'next-i18next';
import GenreCarousel from '../../components/carousels/GenreCarousel';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FilmIndex(props) {
    const { t, i18n } = useTranslation();

    const { data: { models: films } } = useSWR('film/index?limit=10', get, { initialData: props.films });
    const { data: banners } = useSWR('banner/film', get, { initialData: props.banners });
    const { data: { person: studio, models: studio_models } } = useSWR('film/studio', get, { initialData: props.studio });
    const { data: genres } = useSWR('film/genres', get, { initialData: props.genres });
    const { data: children } = useSWR('film/genre', get, { initialData: props.children });
    const { data: forU } = useSWR('film/for-u', get, { initialData: props.forU });
    const { data: watchingNow } = useSWR('film/watching-now', get, { initialData: props.watchingNow });
    const { data: rizanovaRecommend } = useSWR('film/rizanova-recommend', get, { initialData: props.rizanovaRecommend });

    // const title = t("Фильмы смотреть онлайн в хорошем качестве");
    const title = t("Фильмы");
    const description = t("Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских фильм фильмов актеры актрисы режиссеры узбеккино онлайн");

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

            <PremiereCarousel models={banners} />

            <div className="container pb-5 inner-page">
                {films.length > 0 && <div className="pt-70">
                    <Carousel models={films} title={t("Все фильмы")} link={"/film/all"} />
                </div>}

                {studio_models.length > 0 && <div className="pt-70">
                    <Carousel models={studio_models} title={studio.name} link={"/person/film/" + studio.id} />
                </div>}

                {forU.models.length > 0 && <div className="pt-70">
                    <Carousel models={forU.models} title={t("Фильмы для вас")} link={"/film/for-you"} />
                </div>}

                {genres.length > 0 && <div className="pt-70">
                    <GenreCarousel models={genres} />
                </div>}

                {children.models.length > 0 && <div className="pt-70">
                    <Carousel models={children.models} title={children.genre['name_' + i18n.language]} link={"/film/genre/" + children.genre.id} />
                </div>}

                {watchingNow.models.length > 0 && <div className="pt-70">
                    <Carousel models={watchingNow.models} title={t("Сейчас смотрят")} link={"/film/watching-now"} />
                </div>}

                {rizanovaRecommend.models.length > 0 && <div className="pt-70">
                    <Carousel models={rizanovaRecommend.models} title={t("RizaNova рекомендует")} link={"/film/rizanova-recommend"} />
                </div>}

            </div>
        </div>
    );
}

export const getServerSideProps = withSession(async function ({ req, res, locale }) {
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
        let [films, banners, studio, forU, genres, children, watchingNow, rizanovaRecommend] = await Promise.all([
            get(`film/index?limit=10`, params),
            get(`banner/film`, params),
            get(`film/studio`, params),
            get(`film/for-u`, params),
            get(`film/genres`, params),
            get(`film/genre`, params),
            get(`film/watching-now`, params),
            get(`film/rizanova-recommend`, params),
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                films,
                banners,
                studio,
                forU,
                genres,
                children,
                watchingNow,
                rizanovaRecommend,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                films: [],
                banners: [],
                studio: {
                    models: [],
                    person: null
                },
                forU: {
                    models: [],
                    pagination: null
                },
                genres: [],
                children: {
                    models: [],
                    genre: null,
                    pagination: null
                },
                watchingNow: {
                    models: [],
                    pagination: null
                },
                rizanovaRecommend: {
                    models: [],
                    pagination: null
                },
                user
            }
        };
    }
});