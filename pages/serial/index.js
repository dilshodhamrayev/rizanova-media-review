import React from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import PremiereCarousel from '../../components/carousels/serial/PremiereCarousel';
import Carousel from '../../components/carousels/serial/Carousel';
import { useTranslation } from 'next-i18next';
import GenreCarousel from '../../components/carousels/GenreCarousel';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FilmIndex(props) {
    const { t, i18n } = useTranslation();

    const { data: { models: serials } } = useSWR('serial/index?limit=10', get, { initialData: props.serials });
    const { data: banners } = useSWR('banner/serial', get, { initialData: props.banners });
    const { data: { person: studio, models: studio_models } } = useSWR('serial/studio', get, { initialData: props.studio });
    const { data: genres } = useSWR('serial/genres', get, { initialData: props.genres });
    const { data: children } = useSWR('serial/genre', get, { initialData: props.children });
    const { data: forU } = useSWR('serial/for-u', get, { initialData: props.forU });
    const { data: watchingNow } = useSWR('serial/watching-now', get, { initialData: props.watchingNow });
    const { data: rizanovaRecommend } = useSWR('serial/rizanova-recommend', get, { initialData: props.rizanovaRecommend });

    // const title = t("Сериалы смотреть онлайн в хорошем качестве");
    const title = t("Сериалы");
    const description = t("Онлайн-кинотеатр узбекских сериалов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских сериал сериалов актеры актрисы режиссеры узбеккино онлайн");

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
                {serials.length > 0 && <div className="pt-70">
                    <Carousel models={serials} title={t("Все сериалы")} link={"/serial/all"} />
                </div>}

                {studio_models.length > 0 && <div className="pt-70">
                    <Carousel models={studio_models} title={studio.name} link={"/person/serial/" + studio.id} />
                </div>}

                {forU.models.length > 0 && <div className="pt-70">
                    <Carousel models={forU.models} title={t("Фильмы для вас")} link={"/serial/for-you"} />
                </div>}

                {genres.length > 0 && <div className="pt-70">
                    <GenreCarousel link="serial" models={genres} />
                </div>}

                {children.models.length > 0 && <div className="pt-70">
                    <Carousel models={children.models} title={children.genre['name_' + i18n.language]} link={"/serial/genre/" + children.genre.id} />
                </div>}

                {watchingNow.models.length > 0 && <div className="pt-70">
                    <Carousel models={watchingNow.models} title={t("Сейчас смотрят")} link={"/serial/watching-now"} />
                </div>}

                {rizanovaRecommend.models.length > 0 && <div className="pt-70">
                    <Carousel models={rizanovaRecommend.models} title={t("Rizanova рекомендует")} link={"/serial/rizanova-recommend"} />
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
        let [serials, banners, studio, forU, genres, children, watchingNow, rizanovaRecommend] = await Promise.all([
            get(`serial/index`, params),
            get(`banner/serial`, params),
            get(`serial/studio`, params),
            get(`serial/for-u`, params),
            get(`serial/genres`, params),
            get(`serial/genre`, params),
            get(`serial/watching-now`, params),
            get(`serial/rizanova-recommend`, params),
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                serials,
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
                serials: [],
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