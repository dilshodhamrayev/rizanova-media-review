import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PremiereSidebar from '../../components/sidebars/PremiereSidebar';
import ClipItem from '../../components/items/ClipItem';
import Pagination from '../../components/Pagination';
import Empty from '../../components/Empty';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Clip(props) {
    const {t, i18n} = useTranslation();

    const router = useRouter();

    const { page = 1 } = router.query;

    const { data } = useSWR(`clip/premiere?page=${page}`, get, { initialData: props.data });

    const title = t("Премьеры узбекских клипов");
    const description = t("Премьера узбекских музыкальных видеоклипов на сайте RizaNova. Здесь вы можете смотреть последние премьеры клипов.");
    const keywords = t("премьеры последние новые узбекских клипы певец певицы");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>

            <div className="container min-view inner-page">
                <h2 className="big-header">{t("Премьера")}</h2>

                <div className="row">
                    <div className="col-md-3">
                        <PremiereSidebar />
                    </div>
                    <div className="col-md-9">
                        <h1 className="title-2 mt-0 mb-4 pb-2">{t("Клипы")}</h1>

                        {data.models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}

                        <div className="row border-radius-4 padding-0">

                            {data.models.map((model, index) => {
                                return (
                                    <div className="col-lg-4 col-md-4 col-6 mb-4" key={index}>
                                        <ClipItem model={model} hidePremiere />
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
        let data = await get(`clip/premiere?page=${page}`, params);

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
            },
            user
        };
    }
});