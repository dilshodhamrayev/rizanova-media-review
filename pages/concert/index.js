import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Pagination from '../../components/Pagination';
import Empty from '../../components/Empty';
import ClipItem from '../../components/items/ClipItem';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ConcertIndex(props) {
    const {t, i18n} = useTranslation();

    const router = useRouter();

    const { page = 1, sort = "newest" } = router.query;

    const { data } = useSWR(`concert?page=${page}&sort=${sort}`, get, { initialData: props.data });

    // const title = t("Концерты смотреть онлайн в хорошем качестве");
    const title = t("Концерты");
    const description = t("Смотреть онлайн узбекских концертов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских концерт концертов певец певица исполнители онлайн");

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

                    <h1 className="big-header">{t("Концерты")}</h1>
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

                {data.models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}
                <div className="row">

                    {data.models.map((model, index) => {
                        return (
                            <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                                <ClipItem model={model} hidePremiere className="px-0" link="concert" />
                            </div>
                        );
                    })}
                </div>

                <Pagination pageCount={data.pagination.pageCount || 0} totalCount={data.pagination.totalCount || 0} initialPage={page - 1} />
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
        let data = await get(`concert?page=${page}&sort=${sort}`, params);

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