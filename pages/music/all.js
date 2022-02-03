import { useRouter } from "next/router";
import { useContext } from "react";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import { GlobalContext } from "../../components/context";
import { get } from "../../utils/request";
import withSession from "../../utils/session";
import Head from 'next/head';
import Link from 'next/link';
import { TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from "../../reducers/audioPlayerReducer";
import Pagination from "../../components/Pagination";
import MusicTableFavoriteBtn from "../../components/buttons/MusicTableFavoriteBtn";
import AdvancedChartItem from "../../components/items/AdvancedChartItem";
import MusicSidebar from "../../components/sidebars/MusicSidebar";
import MusicItem from "../../components/items/MusicItem";
import Empty from "../../components/Empty";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function AllMusic(props) {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const { page = 1 } = router.query;

    const { data: { models, pagination } } = useSWR(`music/index?page=${page}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const play = (music_id) => {
        if (music_id === audioPlayer.currentTrackId)
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            if (models.length > 0)
                dispatch({ type: TYPE_AP_SET_TRACKS, payload: models, currentTrackId: music_id ? music_id : models[0].id });
        }
    }

    // const title = t("Все треки на сайте RizaNova");
    const title = t("Все треки");
    const description = t("Слушайте онлайн узбекских треков и альбомов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских треки музыки альбомы плейлисты исполнители певец певицы");

    return <div>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content="https://rizanova.uz/image/logo.png" />
        </Head>

        <div className="container min-view">
            <h2 className="big-header">{t("Музыка")}</h2>

            <div className="row">
                <div className="col-md-3">
                    <MusicSidebar />
                </div>
                <div className="col-md-9">
                    <h1 className="title-2 mt-0 mb-2 mb-md-4 pb-2">{t("Все песни")}</h1>
                    {models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}
                    <div className="row border-radius-4 padding-0 inner-page">

                        {models.map((model, index) => {
                            return (
                                <div className="col-lg-3 col-md-4 col-4 mb-4" key={index}>
                                    <MusicItem model={model} />
                                </div>
                            );
                        })}
                    </div>

                    <Pagination pageCount={pagination.pageCount || 0} totalCount={pagination.totalCount || 0} initialPage={page - 1} />
                </div>
            </div>
        </div>
    </div>;
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
        let data = await get(`music/index?page=${page}`, params);

        if (data.status == 'not-found') {
            return {
                props: {
                    data,
                    user
                },
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
                    model: null
                },
                user
            }
        };
    }
});