import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import MusicCarousel from "../../components/carousels/search/MusicCarousel";
import FilmCarousel from "../../components/carousels/search/FilmCarousel";
import ClipCarousel from "../../components/carousels/search/ClipCarousel";
import { get } from "../../utils/request";
import withSession from "../../utils/session";
import SingerCarousel from "../../components/carousels/search/SingerCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Search(props) {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const query = router.query.query;

    const [value, setValue] = useState(query);

    const { data: clips } = useSWR(`clip/index?q=${encodeURIComponent(query)}`, get, { initialData: props.clips });
    const { data: musics } = useSWR(`music/index?q=${encodeURIComponent(query)}`, get, { initialData: props.musics });
    const { data: films } = useSWR(`film/index?q=${encodeURIComponent(query)}`, get, { initialData: props.films });
    const { data: telenovellas } = useSWR(`telenovella/index?q=${encodeURIComponent(query)}`, get, { initialData: props.telenovellas });
    const { data: serials } = useSWR(`serial/index?q=${encodeURIComponent(query)}`, get, { initialData: props.serials });
    const { data: concerts } = useSWR(`concert/index?q=${encodeURIComponent(query)}`, get, { initialData: props.concerts });
    const { data: humors } = useSWR(`humor/index?q=${encodeURIComponent(query)}`, get, { initialData: props.humors });
    const { data: singers } = useSWR(`person/index?q=${encodeURIComponent(query)}`, get, { initialData: props.singers });

    const title = t("Поиск по сайту RizaNova");
    const description = t("Поиск узбекских треков, альбомов, фильмов, клипов, сериалов, концертов и юморов на сайте RizaNova.");
    const keywords = t("узбекские фильм фильмы сериал сериалы клип клипы музыка музыки трек треки альбом альбомы концерт концерты исполнители актер актеры актриса режиссер сценарист фото фотография постер");

    return (
        <div className="search-page">
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content="https://rizanova.uz/image/logo.png" />

            </Head>
            <div className="container min-view inner-page">
                <ul className="breadcrumbs">
                    <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{t("Поиск по сайту")}</p></li>
                </ul>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className={'search-form w-100'}>
                            <form onSubmit={(e) => {
                                e.preventDefault();

                                if (value.length > 1) {
                                    if (value != query)
                                        router.push(`/search/${encodeURIComponent(value)}`);
                                } else {
                                    toast.info(t("Пожалуйста, введите не менее 2 букв для поиска"), { toastId: 1 });
                                }
                            }} className='h-100 d-flex'>
                                <input type="text" placeholder={t("Поиск")} value={value} onChange={(e) => {
                                    setValue(e.target.value);
                                }} />
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.5 13.9999H14.71L14.43 13.7299C15.63 12.3299 16.25 10.4199 15.91 8.38989C15.44 5.60989 13.12 3.38989 10.32 3.04989C6.09001 2.52989 2.53002 6.08989 3.05002 10.3199C3.39002 13.1199 5.61002 15.4399 8.39002 15.9099C10.42 16.2499 12.33 15.6299 13.73 14.4299L14 14.7099V15.4999L18.25 19.7499C18.66 20.1599 19.33 20.1599 19.74 19.7499C20.15 19.3399 20.15 18.6699 19.74 18.2599L15.5 13.9999ZM9.50002 13.9999C7.01002 13.9999 5.00002 11.9899 5.00002 9.49989C5.00002 7.00989 7.01002 4.99989 9.50002 4.99989C11.99 4.99989 14 7.00989 14 9.49989C14 11.9899 11.99 13.9999 9.50002 13.9999Z" fill="#828282" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {films.models.length == 0 && telenovellas.models.length == 0 && serials.models.length == 0
                    && musics.models.length == 0 && clips.models.length == 0 && concerts.models.length == 0
                    && humors.models.length == 0 && singers.models.length == 0 &&
                    <h1 className="title-1 text-center">{t("Ничего не найдено")}</h1>}

                <FilmCarousel title={t("Фильмы")} link={`/search/film/${encodeURIComponent(query)}`} models={films.models} className="mb-3 mb-lg-5" />
                <FilmCarousel title={t("Теленовеллы")} link={`/search/telenovella/${encodeURIComponent(query)}`} models={telenovellas.models} className="mb-3 mb-lg-5" />
                <FilmCarousel title={t("Сериалы")} link={`/search/serial/${encodeURIComponent(query)}`} type="serial" models={serials.models} className="mb-3 mb-lg-5" />
                <MusicCarousel title={t("Музыки")} link={`/search/music/${encodeURIComponent(query)}`} models={musics.models} className="mb-3 mb-lg-5" />
                <ClipCarousel title={t("Клипы")} link={`/search/clip/${encodeURIComponent(query)}`} models={clips.models} className="mb-3 mb-lg-5" />
                <ClipCarousel title={t("Концерты")} link={`/search/concert/${encodeURIComponent(query)}`} models={concerts.models} className="mb-3 mb-lg-5" />
                <ClipCarousel title={t("Юмор")} link={`/search/humor/${encodeURIComponent(query)}`} models={humors.models} className="mb-3 mb-lg-5" />
                <SingerCarousel title={t("Персоны")} link={`/search/person/${encodeURIComponent(query)}`} models={singers.models} className="mb-3 mb-lg-5" />
            </div>
        </div>
    );
}

export const getServerSideProps = withSession(async function ({ req, res, query: { query }, locale }) {
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
        let [clips, musics, films, telenovellas, serials, concerts, humors, singers] = await Promise.all([
            get(`clip/index?q=${encodeURIComponent(query)}`, params),
            get(`music/index?q=${encodeURIComponent(query)}`, params),
            get(`film/index?q=${encodeURIComponent(query)}`, params),
            get(`telenovella/index?q=${encodeURIComponent(query)}`, params),
            get(`serial/index?q=${encodeURIComponent(query)}`, params),
            get(`concert/index?q=${encodeURIComponent(query)}`, params),
            get(`humor/index?q=${encodeURIComponent(query)}`, params),
            get(`person/index?q=${encodeURIComponent(query)}`, params)
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                clips,
                musics,
                films,
                telenovellas,
                serials,
                singers,
                concerts,
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
                telenovellas: [],
                serials: [],
                singers: [],
                concerts: [],
                humors: [],
                user
            }
        };
    }
});