import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import TariffButton from "../../components/buttons/TariffButton";
import { get } from "../../utils/request";
import Head from 'next/head';
import Link from 'next/link';
import withSession from "../../utils/session";
import TariffMusicCarousel from "../../components/carousels/tariff/TariffMusicCarousel";
import TariffClipCarousel from "../../components/carousels/tariff/TariffClipCarousel";
import TariffFilmCarousel from "../../components/carousels/tariff/TariffFilmCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function SubscriptionView(props) {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const { tariff_id } = router.query;

    let { data: { model }, mutate } = useSWR(`subscription/get?id=${tariff_id}`, get, { initialData: props.data });

    const { data: clips } = useSWR('clip/home', get, { initialData: props.clips });
    const { data: musics } = useSWR('music/home', get, { initialData: props.musics });
    const { data: films } = useSWR('film/home', get, { initialData: props.films });


    const title = t("Подписка") + ' ' + model.name;
    const description = t("Смотрите только самые свежие узбекские фильмы, клипы, сериалы, концерты и юмор в хорошем качестве. А также, слушайте самые свежие узбекские музыки и альбомы в хорошем качестве на сайте RizaNova.");
    const keywords = t("узбекские фильм фильмы сериал сериалы клип клипы музыка музыки трек треки альбом альбомы концерт концерты исполнители актер актеры актриса режиссер сценарист фото фотография постер");

    return (
        <div className="subscription-page inner-page">
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content="https://rizanova.uz/image/logo.png" />

            </Head>
            <div className="subscription inner-page" style={{ backgroundImage: `url(${model.image_path})` }}>
                <div className="container">
                    <div className="position-relative">
                        <h1 className="title-1 m-0">{t("Подписка")} {model.name}</h1>

                        <ul className="ul-type-1">
                            {model['description_' + i18n.language]?.split("\n").map((feature, i) => {
                                return (
                                    <li key={i}>{feature}</li>
                                );
                            })}
                        </ul>

                        {/* <div className="mt-md-5 mt-3">
                            <TariffButton model={model} mutate={mutate} />

                            <Link href={`/subscription/${model.id}`}>
                                <a className="btn-outline border-radius-4 mb-3">{t("Подробнее")}</a>
                            </Link>
                        </div> */}
                    </div>
                </div>

            </div>

            <div className="bg-different subscription-info">
                <div className="container">
                    <h2 className="title-1 text-center mb-3">{t("Максимальные возможности сайта")}</h2>

                    <p className='text-1'>{t("Оформив подписку, вы можете снять все ограничения функциональности сайта RizaNova.")}</p>

                    <div className="text-center mt-lg-5 mt-3">
                        <TariffButton model={model} mutate={mutate} />
                    </div>

                    <p className='text-2 pb-5'>{model['subtitle_' + i18n.language]}</p>

                    <div className="my-lg-5 my-3">
                        <TariffFilmCarousel models={films} />
                    </div>

                    <div className="my-lg-5 my-3">
                        <TariffClipCarousel models={clips} />
                    </div>

                    <div className="my-lg-5 my-3">
                        <TariffMusicCarousel models={musics} />
                    </div>
                </div>
            </div>
            <div className="subscribe-footer">
                <div className="container">
                    <p className="text-1">{t("Для вашего удобства продление подписки включено автоматически. По истечению промо-периода происходит автоматическое списание денежных средств с вашего баланса. Подписку можно отключить в любой момент.")}</p>
                    <div className="mt-md-5 mt-3 text-center">
                        <Link href={`/account/subscription`}>
                            <a className="btn-outline border-radius-4 mb-3 me-3">{t("Другие подписки")}</a>
                        </Link>
                        <TariffButton model={model} mutate={mutate} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = withSession(async function ({ req, res, query: { tariff_id }, locale }) {
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
        let [clips, musics, films, data] = await Promise.all([
            get(`clip/home`, params),
            get(`music/home`, params),
            get(`film/home`, params),
            get(`subscription/get?id=${tariff_id}`, params)
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
                user,
                clips,
                musics,
                films
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data: { model: null },
                user,
                clips,
                musics,
                films
            },
        };
    };
});