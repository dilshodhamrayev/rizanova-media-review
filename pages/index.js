import Head from 'next/head';
import HomeClipCarousel from '../components/carousels/home/HomeClipCarousel';
import HomeMusicCarousel from '../components/carousels/home/HomeMusicCarousel';
import HomePremiereCarousel from '../components/carousels/home/HomePremiereCarousel';
import useSWR from 'swr';
import { get } from '../utils/request';
import HomeFilmCarousel from '../components/carousels/home/HomeFilmCarousel';
import HomeTariffCarousel from '../components/carousels/home/HomeTariffCarousel';
import Categories from '../components/parts/Categories';
import RizanovaTv from '../components/parts/RizanovaTv';
import MiniChart from '../components/parts/MiniChart';
import SingerCarousel from '../components/carousels/SingerCarousel';
import withSession from '../utils/session';
import { useContext } from 'react';
import { GlobalContext } from '../components/context';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HomeHumorCarousel from '../components/carousels/home/HomeHumorCarousel';
import { SUBSCRIBE } from '../config';

function Home(props) {

    const { t, i18n } = useTranslation();

    const { data: clips } = useSWR('clip/home', get, { initialData: props.clips });
    const { data: musics } = useSWR('music/home', get, { initialData: props.musics });
    const { data: charts, mutate: mutateChart } = useSWR('music/chart?limit=10', get, { initialData: props.charts });
    const { data: banners } = useSWR('banner/home', get, { initialData: props.banners });
    const { data: films } = useSWR('film/home', get, { initialData: props.films });
    const { data: humors } = useSWR('humor/home', get, { initialData: props.humors });
    const { data: singers } = useSWR('person/home', get, { initialData: props.singers });
    const { data: tariffs, mutate } = useSWR('subscription/index', get, { initialData: props.tariffs });

    const globalContext = useContext(GlobalContext);

    const title = t("RizaNova - Узбекский национальный медиа-портал");
    const description = t("Смотрите только самые свежие узбекские фильмы, клипы, сериалы, концерты и юмор в хорошем качестве. А также, слушайте самые свежие узбекские музыки и альбомы в хорошем качестве на сайте RizaNova.");
    const keywords = t("узбекские фильм фильмы сериал сериалы клип клипы музыка музыки трек треки альбом альбомы концерт концерты исполнители актер актеры актриса режиссер сценарист фото фотография постер");

    const router = useRouter();

    return (
        <div className='inner-page'>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content="https://rizanova.uz/image/logo.png" />

                <link rel="canonical" href={`https://rizanova.uz`} />
            </Head>

            <HomePremiereCarousel models={banners} />
            <HomeMusicCarousel models={musics} />
            <HomeClipCarousel models={clips} />
            <HomeFilmCarousel models={films} />
            <HomeHumorCarousel models={humors} />
            <MiniChart mutate={mutateChart} models={charts} isHome />
            <SingerCarousel models={singers} isHome />
            {SUBSCRIBE && (!globalContext.store.auth.isAuth || globalContext.store.auth.user?.tariffs.length === 0) && (
                <HomeTariffCarousel models={tariffs} mutate={mutate} />
            )}
            <Categories />
            {/* <RizanovaTv /> */}
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
        let [clips, musics, banners, films, humors, singers, charts, tariffs] = await Promise.all([
            get(`clip/home`, params),
            get(`music/home`, params),
            get(`banner/home`, params),
            get(`film/home`, params),
            get(`humor/home`, params),
            get(`person/home`, params),
            get(`music/chart?limit=10`, params),
            get(`subscription/index`, params)
        ]);

        return {
            props: { 
                clips,
                musics,
                banners,
                films,
                humors,
                singers,
                charts,
                tariffs,
                user,
                ...(await serverSideTranslations(locale, ['common']))
            }
        };
    } catch (ex) {
        return {
            props: { 
                clips: [],
                musics: [],
                banners: [],
                films: [],
                humors: [],
                singers: [],
                charts: [],
                tariffs: [],
                user,
                ...(await serverSideTranslations(locale, ['common']))
            }
        };
    }
});


export default Home;