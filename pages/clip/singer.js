import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Pagination from '../../components/Pagination';
import Empty from '../../components/Empty';
import Image from 'next/image';
import { letters } from '../../utils/functions';
import ClipSideBar from '../../components/sidebars/ClipSideBar';
import withSession from '../../utils/session';
import Singers from '../../components/parts/Singers';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Singer(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { page = 1, letter = "" } = router.query;

    const { data } = useSWR(`person?page=${page}${letter ? `&letter=${letter}` : ``}`, get, { initialData: props.data });

    const title = t("Исполнители");
    const description = t("Список узбекских исполнителей на сайте RizaNova.");
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

            <div className="container min-view">
                <h2 className="big-header">{t("Клипы")}</h2>

                <div className="row">
                    <div className="col-md-3">
                        <ClipSideBar />
                    </div>
                    <div className="col-md-9">
                        <h1 className="title-2 mt-0 mb-2 mb-md-4 pb-2">{t("Исполнители")}</h1>

                        <Singers letter={letter} data={data} page={page} link="clip" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { page = 1, letter = "" }, locale }) {
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
        let data = await get(`person?page=${page}${letter ? `&letter=${letter}` : ``}`, params);

        if (letter && letters.indexOf(letter.toUpperCase()) === -1) {
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
        console.log(ex);
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