import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useRef } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Carousel from '../../components/carousels/others/Carousel';
import DetailPersons from '../../components/DetailPersons';
import ListItems from '../../components/lists/ListItems';
import withSession from '../../utils/session';
import SeeLaterBtn from '../../components/buttons/SeeLaterBtn';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import BigFavoriteBtn from '../../components/buttons/BigFavoriteBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ConcertView(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { concert_id, page = 1 } = router.query;

    const { data: { model, others } } = useSWR(`concert/get?id=${concert_id}`, get, { initialData: props.data });
    const { data: { models: concerts, pagination } } = useSWR(`concert?page=${page}&exclude=${concert_id}`, get, { initialData: props.concerts });

    const authors = model?.persons.authors.map((singer, index) => singer.name + (model.persons.authors.length - 1 != index ? ', ' : ''));
    const title = authors + " — " + model.name /* + ". " + t("Смотреть онлайн на сайте RizaNova")*/;
    const description = t("Смотреть онлайн узбекских концертов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских концерт концерты исполнители певец певицы");

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
                    <li><Link href="/concert"><a>{t("Концерт")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{model.name}</p></li>
                </ul>

                <Link href='/concert'>
                    <a>
                        <h2 className="big-header">{t("Концерты")}</h2>
                    </a>
                </Link>

                <div className="row">
                    <div className="col-lg-12">
                        <VideoPlayer model={model} />
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

                <h1 className="header-1 detail-page-header">{model.persons.authors.map((singer, index) => <Link href={`/person/${singer.id}`} key={index}><a>{singer.name + (model.persons.authors.length - 1 != index ? ', ' : '')}</a></Link>)} — {model.name}</h1>

                <DetailPersons model={model} />

                <Carousel models={others} person_id={model.persons.authors[0].id} link="concert" title={t("Другие концерты исполнителя")} />
                <ListItems models={concerts} page={page} pagination={pagination} link="concert" title={t("Другие концерты")} pathname={"/concert/" + concert_id} />

            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { concert_id, page = 1 }, locale }) {
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
        let [data, concerts] = await Promise.all([
            get(`concert/get?id=${concert_id}`, params),
            get(`concert?page=${page}&exclude=${concert_id}`, params),
        ]);

        if (data.status == 'not-found') {
            return {
                notFound: true
            };
        }

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data,
                concerts,
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
                    concerts: [],
                    user
                },
            }
        };
    }
});