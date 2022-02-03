import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useTranslation } from 'next-i18next';
import ClipCarousel from '../../components/carousels/premiere/ClipCarousel';
import MusicCarousel from '../../components/carousels/premiere/MusicCarousel';
import FilmCarousel from '../../components/carousels/premiere/FilmCarousel';
import SerialCarousel from '../../components/carousels/premiere/SerialCarousel';
import HumorCarousel from '../../components/carousels/premiere/HumorCarousel';
import PremiereSidebar from '../../components/sidebars/PremiereSidebar';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Index(props) {
    const {t, i18n} = useTranslation();

    const { data: clips } = useSWR('clip/home', get, { initialData: props.clips });
    const { data: musics } = useSWR('music/home', get, { initialData: props.musics });
    const { data: films } = useSWR('film/home', get, { initialData: props.films });
    const { data: serials } = useSWR('serial/home', get, { initialData: props.serials });
    const { data: humors } = useSWR('humor/home', get, { initialData: props.humors });

    const title = t("Премьеры узбекских клипов, треков, фильмов, сериалов и юмор в хорошем качестве на сайте RizaNova");
    const description = t("Премьера узбекских музыкальных видеоклипов, треков, фильмов, сериалов и юмор на сайте RizaNova. Здесь вы сможете смотреть и слушать самые последние премьеры в хорошем качестве.");
    const keywords = t("премьера последние новые узбекских фильмов сериалов клипов треков музыки концертов певец певицы RizaNova");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>

            <div className="container inner-page">
                <h1 className="big-header">{t("Премьера")}</h1>

                <div className="row">
                    <div className="col-md-3">
                        <PremiereSidebar />
                    </div>
                    <div className="col-md-9">
                        <ClipCarousel models={clips} />

                        <div className="mt-3 mt-lg-5">
                            <MusicCarousel models={musics} />
                        </div>

                        <div className="mt-3 mt-lg-5">
                            <FilmCarousel models={films} />
                        </div>

                        <div className="mt-3 mt-lg-5">
                            <SerialCarousel models={serials} />
                        </div>

                        <div className="mt-3 mb-5 mt-lg-5">
                            <HumorCarousel models={humors} />
                        </div>
                    </div>
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
        let [clips, musics, films, serials, humors] = await Promise.all([
            get(`clip/home`, params),
            get(`music/home`, params),
            get(`film/home`, params),
            get(`serial/home`, params),
            get(`humor/home`, params)
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                clips,
                musics,
                films,
                serials,
                humors,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                clips: [],
                musics: [],
                films: [],
                serials: [],
                humors: [],
                user
            }
        };
    }
});