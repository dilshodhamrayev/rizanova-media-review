import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Pagination from '../../../components/Pagination';
import Empty from '../../../components/Empty';
import ClipItem from '../../../components/items/ClipItem';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ConcertIndex(props) {
    const {t, i18n} = useTranslation();

    const { data: models } = useSWR(`telenovella/genres`, get, { initialData: props.models });

    const title = t("Жанры фильмов");
    const description = t("Посмотреть фильмы по жанрам, которые вам нравятся, можно на сайте RizaNova. Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских фильм фильмов актеры актрисы режиссеры узбеккино онлайн жанры");

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
                <div className="d-flex justify-content-between">
                    <h1 className="big-header">{t("Жанры")}</h1>
                </div>

                {models.length === 0 && <Empty text={t("Здесь пока пусто, контент скоро появится.")} />}

                <div className="row categories ">
                    {models.map((model, index) => {
                        return (
                            <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                                <Link href={"/telenovella/genre/" + model.id}>
                                    <a className="music-item d-block px-0">
                                        <div className="category border-radius-10 music-category">
                                            <Image src={model.image_path} className="w-100" alt={model['name_' + i18n.language]} width={256} height={256} layout="responsive" unoptimized loading='lazy' />
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
        let models = await get(`telenovella/genres`, params);

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