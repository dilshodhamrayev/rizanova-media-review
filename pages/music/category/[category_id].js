import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import MusicSidebar from '../../../components/sidebars/MusicSidebar';
import { useTranslation } from 'next-i18next';
import { toSeconds } from '../../../utils/functions';
import moment from 'moment';
import { GlobalContext } from '../../../components/context';
import { TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../../reducers/audioPlayerReducer';
import Image from 'next/image';
import withSession from '../../../utils/session';
import SingleFavoriteBtn from '../../../components/buttons/SingleFavoriteBtn';
import SingleMusicItem from '../../../components/items/SingleMusicItem';
import LongShareBtn from '../../../components/buttons/LongShareBtn';
import Empty from '../../../components/Empty';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChartItem from '../../../components/items/ChartItem';
import AdvancedChartItem from '../../../components/items/AdvancedChartItem';

export default function CategoryView(props) {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const { category_id } = router.query;

    const { data: { model, models } } = useSWR(`category/get?id=${category_id}`, get, { initialData: props.data });

    let seconds = model.musics.length > 0 ? model.musics.map(music => toSeconds(music.duration)).reduce((a, b) => a + b) : 0;

    let time = moment.utc(seconds * 1000).format('HH:mm');

    let hours = time.split(":")[0];
    let minutes = time.split(":")[1];

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const play = (music_id) => {
        if (audioPlayer.currentPlaylist_id === "category_" + model.id && (music_id === audioPlayer.currentTrackId || !music_id))
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            if (model.musics.length > 0)
                dispatch({ type: TYPE_AP_SET_TRACKS, payload: model.musics, currentTrackId: music_id ? music_id : model.musics[0].id, currentPlaylist_id: "category_" + model.id, currentPlaylist: model.name });
        }
    }

    const title = t("Музыкальая категория") + " " + "«" + model['name_' + i18n.language] + "»";
    const description = t("Список музыкальных категорий на сайте RizaNova. Слушайте онлайн узбекских треков и альбомов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских треки музыки альбомы чарт плейлисты исполнители певец певицы");

    return <div>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content={model.image_path} />
        </Head>

        <div className="container min-view">
            <h2 className="big-header">{t("Музыка")}</h2>

            <div className="row">
                <div className="col-md-3">
                    <MusicSidebar />
                </div>
                <div className="col-md-9 pb-5">
                    <div className="album-page">
                        <div className="details">
                            <div className="d-flex">
                                <div className="image">
                                    <Image src={model.image_path} className="w-100" width={256} height={256} layout="responsive" alt={model['name_' + i18n.language]} unoptimized loading='lazy' />
                                </div>
                                <div className="info">
                                    <h2 className="mt-0">{t("Категория")}</h2>
                                    <h1>{model['name_' + i18n.language]}</h1>
                                    <p className="tracks-info">{model.musics.length} {t("треков")} • {t("Длительность")} {hours > 0 ? hours + ' ' + t('ч.') : ''} {minutes} {t("мин.")}</p>
                                    <div className="d-flex">
                                        {model.musics.length > 0 && <a role="button" className="btn-spec me-3" onClick={() => {
                                            play();
                                        }}>
                                            {(audioPlayer.currentPlaylist_id === "category_" + model.id) && audioPlayer.playing ? (
                                                <svg className="me-2" height="10" viewBox="-45 0 327 327" width="8" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m158 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                                    <path d="m8 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                                </svg>
                                            ) : (
                                                <svg className="me-2" width="8" height="10" viewBox="0 0 8 10" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.332031 1.547V8.45366C0.332031 8.98033 0.912031 9.30033 1.3587 9.01366L6.78536 5.56033C7.1987 5.30033 7.1987 4.70033 6.78536 4.43366L1.3587 0.986998C0.912031 0.700331 0.332031 1.02033 0.332031 1.547Z" />
                                                </svg>
                                            )}

                                            {t("Слушать")}
                                        </a>}
                                        <LongShareBtn className="album-tool">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <circle cx="16" cy="16" r="15.75" stroke="#BDBDBD" strokeWidth="0.5" />
                                                <path d="M18.379 12.2898V10.8863C18.379 10.1006 19.2998 9.70341 19.837 10.2595L23.7506 14.3113C24.0831 14.6556 24.0831 15.2117 23.7506 15.556L19.837 19.6078C19.2998 20.1639 18.379 19.7755 18.379 18.9899V17.498C14.1158 17.498 11.1316 18.9104 9 22C9.85264 17.5863 12.4105 13.1726 18.379 12.2898Z" fill="white" />
                                            </svg>
                                        </LongShareBtn>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="album-musics mt-5">
                            {model.musics.length > 0 ? <>
                                <ul className="chart-list">
                                    <li className="advanced hide-on-991 chart-header">
                                        <div className="d-flex justify-content-between">
                                            <div className={"number flex-wrap align-items-center align-content-center"}>

                                            </div>
                                            <div className="d-flex flex-grow-1 align-items-center details">
                                                <div className="simulate-img me-2"></div>
                                                <div className="info align-items-center">
                                                    <div className="artist-name d-block">
                                                        <a className="composition-name">{t("Название")}</a>
                                                    </div>
                                                    <div className="artists">
                                                        <a className="composition-name">{t("Исполнитель")}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center tools ">

                                            </div>
                                            <div className="d-flex align-items-center justify-content-center time-box">
                                                <span className="time">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path d="M8.94609 0C4.18637 0 0.332031 3.864 0.332031 8.625C0.332031 13.386 4.18637 17.25 8.94609 17.25C13.7144 17.25 17.5774 13.386 17.5774 8.625C17.5774 3.864 13.7144 0 8.94609 0ZM8.95472 15.525C5.14349 15.525 2.05657 12.4373 2.05657 8.625C2.05657 4.81275 5.14349 1.725 8.95472 1.725C12.7659 1.725 15.8529 4.81275 15.8529 8.625C15.8529 12.4373 12.7659 15.525 8.95472 15.525ZM8.76502 4.3125H8.71328C8.36837 4.3125 8.09245 4.5885 8.09245 4.9335V9.0045C8.09245 9.30637 8.24766 9.591 8.51496 9.74625L12.0934 11.8939C12.3865 12.0664 12.7659 11.9801 12.9384 11.6869C13.1195 11.3936 13.0246 11.0055 12.7228 10.833L9.38585 8.84925V4.9335C9.38585 4.5885 9.10993 4.3125 8.76502 4.3125Z" fill="#4F4F4F" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                    {model.musics.map((music, index) => {
                                        return (
                                            <AdvancedChartItem hideTire model={music} order={index + 1} key={index} models={model.musics} />
                                        );
                                    })}
                                </ul>
                            </> : (
                                <Empty text={t("Здесь пока пусто, контент скоро появится.")} />
                            )}

                            {models.length > 0 && <>

                                <Link href={"/music/category"}>
                                    <nav className="title-nav cursor-pointer mt-5">
                                        <a>
                                            <h3 className={"title-2 mb-0 mt-0"}>{t("Другие категории")}</h3>
                                        </a>

                                        <a className="show-all mb-0">
                                            <span>
                                                {t("Показать все")}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                                                <path
                                                    d="M0.38 19.01C0.87 19.5 1.66 19.5 2.15 19.01L10.46 10.7C10.85 10.31 10.85 9.68005 10.46 9.29005L2.15 0.980049C1.66 0.490049 0.87 0.490049 0.38 0.980049C-0.11 1.47005 -0.11 2.26005 0.38 2.75005L7.62 10L0.37 17.25C-0.11 17.73 -0.11 18.5301 0.38 19.01Z" />
                                            </svg>
                                        </a>
                                    </nav>
                                </Link>

                                <div className="row mt-4 categories">

                                    {models.map((model, index) => {
                                        let name = i18n.language === "ru" ? model.name_ru : model.name_uz;

                                        return (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4" key={index}>
                                                <Link href={"/music/category/" + model.id}>
                                                    <a className="category music-category" >
                                                        <img src={model.image_path} />
                                                        <div
                                                            className="title cover d-flex align-items-end align-content-end justify-content-center flex-wrap">
                                                            <span className="w-100 text-center mb-4">{name}</span>
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { category_id }, locale }) {
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
        let data = await get(`category/get?id=${category_id}`, params);

        if (data.status == 'not-found') {
            return {
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
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data: {
                    model: null
                },
                user
            }
        };
    }
});