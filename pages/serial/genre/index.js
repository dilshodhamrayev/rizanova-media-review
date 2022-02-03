import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import { useTranslation } from 'next-i18next';
import Empty from '../../../components/Empty';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ConcertIndex(props) {
    const { t, i18n } = useTranslation();

    const { data: models } = useSWR(`serial/genres`, get, { initialData: props.models });

    const title = t("Жанры сериалов");
    const description = t("Посмотреть сериалы по жанрам, которые вам нравятся, можно на сайте RizaNova. Онлайн-кинотеатр узбекских сериалов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских сериал сериалов актеры актрисы режиссеры узбеккино онлайн жанры");

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
                <ul className="breadcrumbs">
                    <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><Link href="/serial"><a>{t("Сериалы")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{t("Жанры")}</p></li>
                </ul>

                <div className="d-flex justify-content-between">
                    <h1 className="big-header">{t("Жанры")}</h1>
                </div>

                {models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}

                <div className="row categories ">
                    {models.map((model, index) => {
                        return (
                            <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                                <Link href={"/serial/genre/" + model.id}>
                                    <a className="music-item d-block px-0">
                                        <div className="category border-radius-10 music-category">
                                            <img src={model.image_path} className="w-100" />
                                            <div
                                                className="title mt-0 cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                                <p className="w-100 text-center my-0">{model['name_' + i18n.language]}</p>
                                            </div>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    )
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
        let models = await get(`serial/genres`, params);


        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                models,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                models: [],
                user
            }
        };
    }
});