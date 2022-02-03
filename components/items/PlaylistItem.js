import Link from 'next/link';
import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { GlobalContext } from '../context';
import { TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../reducers/audioPlayerReducer';
import { useRouter } from 'next/router';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uz-latn';

export default function PlaylistItem(props) {
    const { model } = props;
    const {t, i18n} = useTranslation();
    const router = useRouter();

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const play = () => {
        if (audioPlayer.currentPlaylist_id === "playlist_" + model.id)
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            if (model.musics.length > 0)
                dispatch({ type: TYPE_AP_SET_TRACKS, payload: model.musics, currentTrackId: model.musics[0].id, currentPlaylist_id: "playlist_" + model.id, currentPlaylist: model['name_' + i18n.language] });
        }
    }

    return (
        <div className="music-item">
            <div className="image mb-2">

                <Image src={model.image_path} className="w-100" width={256} height={256} layout="responsive" unoptimized loading='lazy' />

                <div className={"controls " + ((audioPlayer.currentPlaylist_id === "playlist_" + model.id) ? 'active' : '')} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        router.push(`/music/playlist/${model.id}`);
                    }
                }}>
                    {/* <a role="button" className='visibility-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18"
                            viewBox="0 0 22 18" fill="none">
                            <path
                                d="M18.66 0.990044C16.02 -0.809956 12.76 0.0300438 11 2.09004C9.23997 0.0300438 5.97997 -0.819956 3.33997 0.990044C1.93997 1.95004 1.05997 3.57004 0.999969 5.28004C0.859969 9.16004 4.29997 12.27 9.54997 17.04L9.64997 17.13C10.41 17.82 11.58 17.82 12.34 17.12L12.45 17.02C17.7 12.26 21.13 9.15004 21 5.27004C20.94 3.57004 20.06 1.95004 18.66 0.990044ZM11.1 15.55L11 15.65L10.9 15.55C6.13997 11.24 2.99997 8.39004 2.99997 5.50004C2.99997 3.50004 4.49997 2.00004 6.49997 2.00004C8.03997 2.00004 9.53997 2.99004 10.07 4.36004H11.94C12.46 2.99004 13.96 2.00004 15.5 2.00004C17.5 2.00004 19 3.50004 19 5.50004C19 8.39004 15.86 11.24 11.1 15.55Z"
                                fill="white" />
                        </svg>
                    </a> */}
                    <a role="button" className="user-select-none" onClick={play}>
                        {(audioPlayer.currentPlaylist_id === "playlist_" + model.id) && audioPlayer.playing ? (
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
                    {/* <a role="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20"
                            viewBox="0 0 18 20" fill="none">
                            <path
                                d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z"
                                fill="white" />
                        </svg>
                    </a> */}
                </div>
            </div>
            <div className="title">
                <Link href={`/music/playlist/${model.id}`}>
                    <a title={model['name_' + i18n.language]}>{model['name_' + i18n.language]}</a>
                </Link>
            </div>
            <div className="singer">
                <p>{t("Обновлён")} {moment(model.updated_at, "YYYY-MM-DD").locale(i18n.language === 'uz' ? "uz-latn" : 'ru').format(moment().year() == moment(model.updated_at, "YYYY-MM-DD").format("YYYY") ? "DD MMMM" : "DD.MM.YYYY")}</p>
            </div>
        </div >
    );
}