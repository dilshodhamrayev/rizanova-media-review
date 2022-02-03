import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Carousel from '../../components/carousels/others/Carousel';
import ListItems from '../../components/lists/ListItems';
import withSession from '../../utils/session';
import SeeLaterBtn from '../../components/buttons/SeeLaterBtn';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import BigFavoriteBtn from '../../components/buttons/BigFavoriteBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdvancedDetailPersons from '../../components/AdvancedDetailPersons';
import ActorsAndCreators from '../../components/ActorsAndCreators';

export default function HumorView(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { humor_id, page = 1 } = router.query;

    const { data: { model, others } } = useSWR(`humor/get?id=${humor_id}`, get, { initialData: props.data });
    const { data: { models: humors, pagination } } = useSWR(`humor?page=${page}&exclude=${[...others.map(m => m.id), model.id]}`, get, { initialData: props.humors });

    const authors = model?.persons.authors.map((singer, index) => singer.name + (model.persons.authors.length - 1 != index ? ', ' : ''));
    const title = authors + " — " + model.name /*+ ". " + t("Смотреть онлайн на сайте RizaNova")*/;
    const description = t("Смотреть онлайн узбекских юморов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских юмор юморы исполнители певец певицы");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>

            <div className="container min-view pb-lg-5 mb-lg-5 inner-page">
                <ul className="breadcrumbs">
                    <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><Link href="/humor"><a>{t("Юмор")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{model.name}</p></li>
                </ul>

                <Link href='/serial'>
                    <a>
                        <h2 className="big-header">{t("Юмор")}</h2>
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

                {/* <h1 className="header-1 detail-page-header">{model?.persons.authors.map((singer, index) => <Link href={`/person/${singer.id}`} key={index}><a>{singer.name + (model.persons.authors.length - 1 != index ? ', ' : '')}</a></Link>)} — {model.name}</h1> */}

                <AdvancedDetailPersons model={model} />
                <ActorsAndCreators model={model} />

                <Carousel models={others} person_id={model.persons.authors[0].id} link="humor" title={t("Другие юморы исполнителя")} />

                <ListItems models={humors} page={page} pagination={pagination} link="humor" title={t("Другие юморы")} pathname={"/humor/" + humor_id} />
            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { humor_id, page = 1 }, locale }) {
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
        let [data, humors] = await Promise.all([
            get(`humor/get?id=${humor_id}`, params),
            get(`humor?page=${page}`, params),
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
                humors,
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
                    humors: {
                        models: [],
                        pagination: {}
                    }
                },
                user
            }
        };
    }
});