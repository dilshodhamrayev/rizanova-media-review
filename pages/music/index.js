import Head from 'next/head';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useTranslation } from 'next-i18next';
import MusicSidebar from '../../components/sidebars/MusicSidebar';
import MusicCarousel from '../../components/carousels/music/MusicCarousel';
import AlbumCarousel from '../../components/carousels/music/AlbumCarousel';
import MiniChart from '../../components/parts/MiniChart';
import SingerCarousel from '../../components/carousels/SingerCarousel';
import MusicCategories from '../../components/parts/MusicCategories';
import withSession from '../../utils/session';
import LastMusicCarousel from '../../components/carousels/music/LastMusicCarousel';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function MusicIndex(props) {
    const {t, i18n} = useTranslation();

    const { data: musics } = useSWR('music/home', get, { initialData: props.musics });
    const { data: lasts } = useSWR('music/index', get, { initialData: props.lasts });
    const { data: albums } = useSWR('album/home', get, { initialData: props.albums });
    const { data: singers } = useSWR('person/home', get, { initialData: props.singers });
    const { data: categories } = useSWR('category', get, { initialData: props.categories });
    const { data: charts, mutate } = useSWR('music/chart?limit=10', get, { initialData: props.charts });

    const title = t("Новые треки, альбомы, сборники, исполнители и RizaNova чарт");
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

            <div className="container">
                <h1 className="big-header">{t("Музыка")}</h1>

                <div className="row">
                    <div className="col-md-3">
                        <MusicSidebar />
                    </div>
                    <div className="col-md-9 pb-5">
                        <MusicCarousel models={lasts.models} />
                        {/* <div className="my-0 my-md-0 py-0">
                            <LastMusicCarousel models={lasts.models} />
                        </div> */}
                        <div className="my-3 my-md-5 py-3">
                            <AlbumCarousel models={albums} />
                        </div>
                        <div className="my-3 my-md-5 py-3">
                            <MiniChart mutate={mutate} models={charts} />
                        </div>
                        <div className="my-3 my-md-5 py-3">
                            <SingerCarousel models={singers} />
                        </div>
                        <div className="my-3 my-md-5 py-3">
                            <MusicCategories models={categories} />
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
        let [musics, lasts, albums, singers, categories, charts] = await Promise.all([
            get(`music/home`, params),
            get(`music/index`, params),
            get(`album/home`, params),
            get(`person/home`, params),
            get(`category`, params),
            get(`music/chart?limit=10`, params),
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                musics,
                albums,
                singers,
                categories,
                charts,
                user,
                lasts
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                musics: [],
                albums: [],
                singers: [],
                categories: [],
                charts: [],
                user
            }
        };
    }
});