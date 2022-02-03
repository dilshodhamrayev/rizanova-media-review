import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import { useTranslation } from 'next-i18next';
import MusicSidebar from '../../../components/sidebars/MusicSidebar';
import Empty from '../../../components/Empty';
import MusicCategories from '../../../components/parts/MusicCategories';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Category(props) {
    const {t, i18n} = useTranslation();

    let { data: models } = useSWR(`category`, get, { initialData: props.data });

    const title = t("Музыкальные категории");
    const description = t("Список музыкальных категорий на сайте RizaNova. Слушайте онлайн узбекских треков и альбомов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских треки музыки альбомы чарт плейлисты исполнители певец певицы");

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
                <h1 className="big-header">{t("Музыка")}</h1>

                <div className="row">
                    <div className="col-md-3">
                        <MusicSidebar />
                    </div>
                    <div className="col-md-9">
                        <MusicCategories models={models} hideShowAll />
                        {models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}
                    </div>
                </div>
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
        let data = await get(`category`, params);

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