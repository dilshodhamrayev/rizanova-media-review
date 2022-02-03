import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Pagination from '../../components/Pagination';
import Empty from '../../components/Empty';
import ClipItem from '../../components/items/ClipItem';
import ClipSideBar from '../../components/sidebars/ClipSideBar';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ClipIndex(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { page = 1, sort = "newest" } = router.query;

    const { data } = useSWR(`clip?page=${page}&sort=${sort}`, get, { initialData: props.data });

    const title = t("Клипы");
    const description = t("Смотреть онлайн узбекских музыкальных видеоклипов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских клип клипы исполнители певец певицы");

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

            <div className="container min-view inner-page">
                <div className="d-flex justify-content-between">
                    <h1 className="big-header">{t("Клипы")}</h1>

                    <div className="sort d-inline-block">
                        <div className="sort-panel">
                            <a role="button" className={"me-2 " + (sort === "newest" ? "active" : "")} onClick={() => {
                                router.push({
                                    pathname: router.pathname,
                                    query: {
                                        sort: 'newest'
                                    }
                                })
                            }}>{t("Новые")}</a>
                            <a role="button" className={sort === "popular" ? "active" : ""} onClick={() => {
                                router.push({
                                    pathname: router.pathname,
                                    query: {
                                        sort: 'popular'
                                    }
                                })
                            }}>{t("Популярные")}</a>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* <div className="col-md-3">
                        <ClipSideBar />
                    </div> */}
                    <div className="col-md-12">
                        {/* <h2 className="title-2 mt-0 mb-2 mb-md-4 pb-2">{t("Все")}</h2> */}
                        {data.models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}
                        <div className="row border-radius-4 padding-0 ">

                            {data.models.map((model, index) => {
                                return (
                                    <div className="col-lg-3 col-md-6 col-6 mb-4" key={index}>
                                        <ClipItem model={model} hidePremiere className="px-0" />
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination pageCount={data.pagination.pageCount || 0} totalCount={data.pagination.totalCount || 0} query={{
                            sort
                        }} initialPage={page - 1} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { page = 1, sort = "newest" }, locale }) {
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
        let data = await get(`clip?page=${page}&sort=${sort}`, params);

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
                    singers: [],
                    pagination: {}
                },
            }
        };
    }
});