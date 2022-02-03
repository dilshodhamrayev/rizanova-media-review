import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useRef } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Carousel from '../../components/carousels/film/Carousel';
import AdvancedDetailPersons from '../../components/AdvancedDetailPersons';
import ActorsAndCreators from '../../components/ActorsAndCreators';
import withSession from '../../utils/session';
import SeeLaterBtn from '../../components/buttons/SeeLaterBtn';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import BigFavoriteBtn from '../../components/buttons/BigFavoriteBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FilmView(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { film_id, page = 1 } = router.query;

    const ref = useRef(null);

    const { data: { model, others } } = useSWR(`film/get?id=${film_id}`, get, { initialData: props.data });

    const title = t("Фильм") + " " + model.name/* + " — " + t("смотреть онлайн")*/;
    const description = t("Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских фильм фильмов актеры актрисы режиссеры узбеккино онлайн жанры");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content={model.image_path} />
            </Head>

            <div className="container min-view pb-lg-5 mb-lg-5 inner-page">
                <ul className="breadcrumbs">
                    <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><Link href="/film"><a>{t("Фильмы")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{model.name}</p></li>
                </ul>

                <Link href='/film'>
                    <a>
                        <h2 className="big-header">{t("Фильмы")}</h2>
                    </a>
                </Link>

                <div className="row">
                    <div className="col-lg-12">
                        <VideoPlayer model={model} showReview />
                    </div>
                    {/* <div className="col-lg-3 order-md-minus">
                        <div className="ads h-100 bg-different">

                        </div>
                    </div> */}
                </div>

                <div className="row mt-2 pt-1">
                    <div className="col-lg-9 d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap">
                        <BigFavoriteBtn model={model} />
                        <SeeLaterBtn model={model} />

                        <LongShareBtn />
                    </div>
                </div>

                {/* <h1 className="header-1 detail-page-header">{model.name}</h1> */}

                <AdvancedDetailPersons model={model} />
                <ActorsAndCreators model={model} />

                <Carousel models={others} link={`/film/genre/${model.genres.length > 0 ? model.genres[0].id : ''}`} title={t("Похожие фильмы")} />
            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { film_id, page = 1 }, locale }) {
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
        let data = await get(`film/get?id=${film_id}`, params);

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
                    model: null,
                    others: [],
                },
                user
            }
        };
    }
});