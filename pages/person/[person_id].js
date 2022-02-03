import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import Image from 'next/image';
import { get } from '../../utils/request';
import { GlobalContext } from '../../components/context';
import 'moment/locale/uz-latn';
import 'moment/locale/ru';
import { TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../reducers/audioPlayerReducer';
import Link from 'next/link';
import ChartItem from '../../components/items/ChartItem';
import ClipItem from '../../components/items/ClipItem';
import FilmItem from '../../components/items/FilmItem';
import withSession from '../../utils/session';
import FavoriteBtn from '../../components/buttons/FavoriteBtn';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function View(props) {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const { person_id } = router.query;

    const { data: { model, last_track, popular_tracks, last_albums, last_clips, last_films, last_telenovellas, last_serials, last_humors, last_concerts } } = useSWR(`person/get?id=${person_id}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const [show, setShow] = useState(false);

    const playLastTrack = () => {
        if (audioPlayer.currentTrackId === last_track.id)
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            dispatch({ type: TYPE_AP_SET_TRACKS, payload: [last_track], currentTrackId: last_track.id });
        }
    }

    const playAlbum = (album) => {
        if (audioPlayer.currentPlaylist_id === "album_" + album.id)
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            if (album.musics.length > 0)
                dispatch({ type: TYPE_AP_SET_TRACKS, payload: album.musics, currentTrackId: album.musics[0].id, currentPlaylist_id: "album_" + album.id, currentPlaylist: model.name });
        }
    }

    const [isOpenShare, setIsOpenShare] = useState(false);

    const title = model.name;
    const description = t("Смотрите только самые свежие узбекские фильмы, клипы, сериалы, концерты и юмор в хорошем качестве. А также, слушайте самые свежие узбекские музыки в хорошем качестве на сайте RizaNova.");
    const keywords = t("узбекские фильм фильмы сериал сериалы клип клипы музыка музыки трек треки альбом альбомы концерт концерты исполнители актер актеры актриса режиссер сценарист фото фотография постер");

    const isStudio = model.profas.indexOf(12) > -1;

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content={model.image_path} />
            </Head>

            <div className="container min-view pb-5 inner-page">
                <h2 className="big-header pb-4"></h2>

                <div className="person">
                    <div className="d-flex">
                        <div className="image">
                            <a href={model.image} target="_blank" rel="noreferrer" title={model.name}>
                                <Image src={model.image_path} width={256} height={256} layout="responsive" alt={model.name} className="w-100" unoptimized loading='lazy' />
                            </a>
                        </div>
                        <div className="info">
                            <h1 className="title-1 mt-0 mb-2 pb-1">{model.name}</h1>
                            {model.full_name && <p className="full-name mt-0 mb-2 pb-1">{(isStudio ? t("Руководитель") + " " : "") + model.full_name}</p>}
                            {model.birthday && <p className="birthday mt-0 mb-0 pb-1"> {isStudio ? t("Дата создания") : t("Дата рождения")}: <span>{moment(model.birthday, "YYYY-MM-DD").locale(i18n.language === 'uz' ? "uz-latn" : 'ru').format("DD MMMM YYYY") + " " + t("г.")}</span></p>}
                            {model.birthday && !isStudio && <p className="birthday mt-0 mb-0"> {t("Возраст")}: <span>{moment().diff(moment(model.birthday, "YYYY-MM-DD"), 'years') + " " + t("лет")}</span></p>}
                            {show && model['description_' + i18n.language] && model['description_' + i18n.language] != "null" && <p className="description mb-0">{model['description_' + i18n.language]}</p>}
                            {model['description_' + i18n.language] && model['description_' + i18n.language] != "null" && <a role="button" className="show-description" onClick={() => setShow(!show)}>{!show ? isStudio ? t("+ Показать описанию") : t("+ Показать биографию") : isStudio ? t("- Скрыть описанию") : t("- Скрыть биографию")}</a>}
                        </div>
                    </div>
                </div>

                {last_track && <>
                    <h3 className="title-2 mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">{t("Последний релиз")}</h3>
                    <div className="last-track">
                        <div className="d-flex w-100 align-items-center">
                            <div className="image">
                                <div className="music-item w-100 px-0">
                                    <div className="image w-100">
                                        <Image src={last_track.image_path} className="w-100" width={256} height={256} layout="responsive" />
                                        <div className={"controls justify-content-center " + (audioPlayer.currentTrackId === last_track.id ? 'active' : '')} onClick={(e) => {
                                            if (e.target === e.currentTarget) playLastTrack();
                                        }}>
                                            <a role="button" className='play-btn' onClick={playLastTrack}>
                                                {audioPlayer.currentTrackId === last_track.id && audioPlayer.playing ? (
                                                    <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M23.3333 0C10.4533 0 0 10.4533 0 23.3333C0 36.2133 10.4533 46.6667 23.3333 46.6667C36.2133 46.6667 46.6667 36.2133 46.6667 23.3333C46.6667 10.4533 36.2133 0 23.3333 0ZM23.3333 42C13.0433 42 4.66667 33.6233 4.66667 23.3333C4.66667 13.0433 13.0433 4.66667 23.3333 4.66667C33.6233 4.66667 42 13.0433 42 23.3333C42 33.6233 33.6233 42 23.3333 42Z" fill="white" />
                                                        <path d="M20.7291 14H16.7708C16.1161 14 15.5833 14.5328 15.5833 15.1875V31.8125C15.5833 32.4672 16.1161 33 16.7708 33H20.7292C21.3839 33 21.9167 32.4672 21.9167 31.8125V15.1875C21.9166 14.5328 21.3838 14 20.7291 14Z" fill="white" />
                                                        <path d="M30.2291 14H26.2708C25.6161 14 25.0833 14.5328 25.0833 15.1875V31.8125C25.0833 32.4672 25.6161 33 26.2708 33H30.2292C30.8839 33 31.4167 32.4672 31.4167 31.8125V15.1875C31.4166 14.5328 30.8838 14 30.2291 14Z" fill="white" />
                                                    </svg>

                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                                        viewBox="0 0 48 48" fill="none">
                                                        <path
                                                            d="M21.2001 33.1013L32.0968 24.9346C32.7267 24.468 32.7267 23.5346 32.0968 23.068L21.2001 14.9013C20.4301 14.318 19.3334 14.878 19.3334 15.8346V32.168C19.3334 33.1246 20.4301 33.6846 21.2001 33.1013ZM24.0001 0.667969C11.1201 0.667969 0.666748 11.1213 0.666748 24.0013C0.666748 36.8813 11.1201 47.3346 24.0001 47.3346C36.8801 47.3346 47.3334 36.8813 47.3334 24.0013C47.3334 11.1213 36.8801 0.667969 24.0001 0.667969ZM24.0001 42.668C13.7101 42.668 5.33342 34.2913 5.33342 24.0013C5.33342 13.7113 13.7101 5.33464 24.0001 5.33464C34.2901 5.33464 42.6668 13.7113 42.6668 24.0013C42.6668 34.2913 34.2901 42.668 24.0001 42.668Z"
                                                            fill="white" />
                                                    </svg>
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="info ms-3 ps-2">
                                <Link href={last_track.albums?.length > 0 ? `/music/album/${last_track.albums[0].id}/track/${last_track.id}` : `/music/${last_track.id}`}>
                                    <a>
                                        <h3 className="title-2 mb-0">{last_track.name}</h3>
                                    </a>
                                </Link>
                                <p className="release_date mt-3">{moment(last_track.release_date, "YYYY-MM-DD").locale(i18n.language === 'uz' ? "uz-latn" : 'ru').format("DD MMM YYYY") + " " + t("г.")}</p>
                            </div>
                        </div>
                    </div>
                </>}

                {popular_tracks.length > 0 && <>
                    <Link href={"/person/music/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Все песни")}</h3>
                            </a>

                            <a className="show-all">
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
                    <div className="row">
                        <div className="col-md-6">
                            <ul className="chart-list">
                                {popular_tracks.filter((model, index) => index < popular_tracks.length / 2).map((model, index) => {
                                    return (
                                        <ChartItem hideStatus model={model} key={index} order={index + 1} models={popular_tracks} />
                                    );
                                })}

                            </ul>
                        </div>
                        <div className="col-md-6">
                            <ul className="chart-list">
                                {popular_tracks.filter((model, index) => index >= popular_tracks.length / 2).map((model, index) => {
                                    return (
                                        <ChartItem hideStatus model={model} key={index} order={Math.ceil(popular_tracks.length / 2) + index + 1} models={popular_tracks} />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </>}

                {last_albums.length > 0 && <>
                    <Link href={"/person/album/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Альбомы")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row mt-0">
                        {last_albums.map((album, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <div className="album music-item">
                                        <div className="image position-relative">
                                            <Link href={`/music/album/${album.id}`}>
                                                <a>
                                                    <Image src={album.image_path} className="w-100 cursor-pointer" width={256} height={256} alt={album.name} unoptimized loading='lazy' layout="responsive" />
                                                </a>
                                            </Link>
                                            <div className={"controls " + (audioPlayer.currentPlaylist_id === "album_" + album.id ? 'active' : '')} onClick={(e) => {
                                                if (e.target === e.currentTarget) {
                                                    router.push(`/music/album/${album.id}`);
                                                }
                                            }}>
                                                <a role="button" onClick={() => {
                                                    playAlbum(album);
                                                }}>
                                                    {audioPlayer.currentPlaylist_id === "album_" + album.id && audioPlayer.playing ? (
                                                        <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.3333 0C10.4533 0 0 10.4533 0 23.3333C0 36.2133 10.4533 46.6667 23.3333 46.6667C36.2133 46.6667 46.6667 36.2133 46.6667 23.3333C46.6667 10.4533 36.2133 0 23.3333 0ZM23.3333 42C13.0433 42 4.66667 33.6233 4.66667 23.3333C4.66667 13.0433 13.0433 4.66667 23.3333 4.66667C33.6233 4.66667 42 13.0433 42 23.3333C42 33.6233 33.6233 42 23.3333 42Z" fill="white" />
                                                            <path d="M20.7291 14H16.7708C16.1161 14 15.5833 14.5328 15.5833 15.1875V31.8125C15.5833 32.4672 16.1161 33 16.7708 33H20.7292C21.3839 33 21.9167 32.4672 21.9167 31.8125V15.1875C21.9166 14.5328 21.3838 14 20.7291 14Z" fill="white" />
                                                            <path d="M30.2291 14H26.2708C25.6161 14 25.0833 14.5328 25.0833 15.1875V31.8125C25.0833 32.4672 25.6161 33 26.2708 33H30.2292C30.8839 33 31.4167 32.4672 31.4167 31.8125V15.1875C31.4166 14.5328 30.8838 14 30.2291 14Z" fill="white" />
                                                        </svg>

                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                                            viewBox="0 0 48 48" fill="none">
                                                            <path
                                                                d="M21.2001 33.1013L32.0968 24.9346C32.7267 24.468 32.7267 23.5346 32.0968 23.068L21.2001 14.9013C20.4301 14.318 19.3334 14.878 19.3334 15.8346V32.168C19.3334 33.1246 20.4301 33.6846 21.2001 33.1013ZM24.0001 0.667969C11.1201 0.667969 0.666748 11.1213 0.666748 24.0013C0.666748 36.8813 11.1201 47.3346 24.0001 47.3346C36.8801 47.3346 47.3334 36.8813 47.3334 24.0013C47.3334 11.1213 36.8801 0.667969 24.0001 0.667969ZM24.0001 42.668C13.7101 42.668 5.33342 34.2913 5.33342 24.0013C5.33342 13.7113 13.7101 5.33464 24.0001 5.33464C34.2901 5.33464 42.6668 13.7113 42.6668 24.0013C42.6668 34.2913 34.2901 42.668 24.0001 42.668Z"
                                                                fill="white" />
                                                        </svg>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                        <Link href={`/music/album/${album.id}`}>
                                            <div className="info">
                                                <p className="name">{album.name}</p>
                                                <p className="year position-relative right-0">{moment(album.release_date, "YYYY-MM-DD").format("YYYY")} {t("Альбом")}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {last_clips.length > 0 && <>
                    <Link href={"/person/clip/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Клипы")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row">
                        {last_clips.map((clip, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <ClipItem model={clip} hidePremiere hideSinger className="px-0" />
                                </div>
                            );
                        })}
                    </div>
                </>}

                {last_films.length > 0 && <>
                    <Link href={"/person/film/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Фильмы")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row">
                        {last_films.map((film, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <FilmItem model={film} hidePremiere className="px-0" />
                                </div>
                            );
                        })}
                    </div>
                </>}
                {last_telenovellas.length > 0 && <>
                    <Link href={"/person/telenovella/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Теленовеллы")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row">
                        {last_telenovellas.map((film, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <FilmItem model={film} hidePremiere className="px-0" link="telenovella" />
                                </div>
                            );
                        })}
                    </div>
                </>}

                {last_serials.length > 0 && <>
                    <Link href={"/person/serial/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Сериалы")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row">
                        {last_serials.map((serial, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <FilmItem model={serial} link="serial" hidePremiere className="px-0" />
                                </div>
                            );
                        })}
                    </div>
                </>}

                {last_concerts.length > 0 && <>
                    <Link href={"/person/concert/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Концерты")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row">
                        {last_concerts.map((humor, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <FilmItem model={humor} link="concert" hidePremiere className="px-0" />
                                </div>
                            );
                        })}
                    </div>
                </>}

                {last_humors.length > 0 && <>
                    <Link href={"/person/humor/" + model.id}>
                        <nav className="title-nav cursor-pointer mt-lg-5 pt-lg-4 mt-3 pt-3 mb-3 pb-2">
                            <a>
                                <h3 className="title-2 my-0">{t("Юмор")}</h3>
                            </a>

                            <a className="show-all">
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

                    <div className="row">
                        {last_humors.map((humor, index) => {
                            return (
                                <div className="col-6 col-md-4 col-lg-3 mb-3 mb-lg-4" key={index}>
                                    <FilmItem model={humor} link="humor" hidePremiere className="px-0" />
                                </div>
                            );
                        })}
                    </div>
                </>}
            </div>
        </div>
    );
}

export const getServerSideProps = withSession(async function ({ req, res, query: { person_id }, locale }) {
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
        let data = await get(`person/get?id=${person_id}`, params);

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
                    model: null,
                    last_track: null,
                    popular_tracks: [],
                    last_albums: [],
                    last_clips: [],
                    last_films: [],
                    last_serials: [],
                    last_humors: [],
                    last_telenovellas: []
                },
                user
            }
        };
    }
});