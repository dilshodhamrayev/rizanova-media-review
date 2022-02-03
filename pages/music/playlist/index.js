import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import MusicSidebar from '../../../components/sidebars/MusicSidebar';
import Pagination from '../../../components/Pagination';
import Empty from '../../../components/Empty';
import PlaylistItem from '../../../components/items/PlaylistItem';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Playlist(props) {
    const {t, i18n} = useTranslation();

    const router = useRouter();

    const { page = 1 } = router.query;

    const { data } = useSWR(`playlist/index?page=${page}`, get, { initialData: props.data });

    const title = t("Плейлисты треков");
    const description = t("Слушайте онлайн узбекских треков и альбомов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских треки музыки альбомы плейлисты исполнители певец певицы");

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

            <div className="container min-view">
                <h2 className="big-header">{t("Музыка")}</h2>

                <div className="row">
                    <div className="col-md-3">
                        <MusicSidebar />
                    </div>
                    <div className="col-md-9">
                        <h1 className="title-2 mt-0 mb-2 mb-md-4 pb-2">{t("Плейлисты")}</h1>
                        {data.models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}
                        <div className="row border-radius-4 padding-0 inner-page">

                            {data.models.map((model, index) => {
                                return (
                                    <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                                        <PlaylistItem model={model} />
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination pageCount={data.pagination.pageCount || 0} totalCount={data.pagination.totalCount || 0} initialPage={page - 1} />
                    </div>
                </div>
            </div>
        </div>
    )
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
        let data = await get(`playlist/index?page=${page}`, params);

        if (page > data.pagination.pageCount) {
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
                    pagination: {}
                },
                user
            }
        };
    }
});