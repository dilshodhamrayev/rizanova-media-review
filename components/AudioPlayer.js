import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import FilePlayer from 'react-player/file';
import { repeatTypes, TYPE_AP_CLEAR_TRACKS, TYPE_AP_END_TRACK, TYPE_AP_NEXT_TRACK, TYPE_AP_PREV_TRACK, TYPE_AP_SET_CURRENT_TIME, TYPE_AP_SET_HQ, TYPE_AP_SET_MUTED, TYPE_AP_SET_PLAYED_TIME, TYPE_AP_SET_PLAYING, TYPE_AP_SET_RANDOM, TYPE_AP_SET_REF, TYPE_AP_SET_REPEAT, TYPE_AP_SET_TRACKS, TYPE_AP_SET_VOLUME } from '../reducers/audioPlayerReducer';
import { GlobalContext } from './context';
import Link from 'next/link';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import AudioPlayerList from './AudioPlayerList';
import ReactTooltip from "react-tooltip";
import { useTranslation } from 'next-i18next';
import { removeData, storeData } from '../utils/store';
import { post } from '../utils/request';
import { arrayToFormData } from '../utils/functions';
import moment from 'moment';
import { SUBSCRIBE } from '../config';

export default function AudioPlayer() {
    const { store, dispatch, changeHQ } = useContext(GlobalContext);
    const { audioPlayer, auth } = store;
    const [progress, setProgress] = useState(null);
    const playerRef = useRef();
    const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [url, setUrl] = useState(null);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (!audioPlayer.currentTrackId) return setCurrentTrack(null);

        let currentTrack = audioPlayer.tracks.find(track => track.id === audioPlayer.currentTrackId);

        setCurrentTrack(currentTrack);
    }, [audioPlayer.currentTrackId, audioPlayer.currentPlaylist_id]);

    useEffect(() => {
        const saveState = async () => {
            await storeData("audio-player-state", audioPlayer);
            await storeData("audio-player-state-dt", moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
        };

        if (audioPlayer.originalTracks.length > 0) {
            saveState();
        }

    }, [audioPlayer.originalTracks, audioPlayer.currentTrackId, audioPlayer.hq]);

    useEffect(() => {
        if (currentTrack) {
            const url = audioPlayer.hq ? [
                { src: currentTrack.filename_mp3, type: 'audio/mpeg' },
                { src: currentTrack.filename_ogg, type: 'audio/ogg' },
            ] : [
                { src: currentTrack.filename_mp3_64, type: 'audio/mpeg' },
                { src: currentTrack.filename_ogg_64, type: 'audio/ogg' },
            ];

            setUrl(url);
        }

    }, [currentTrack, audioPlayer.hq]);

    useEffect(() => {
        window.onkeydown = function (e) {
            return e.target.tagName == "INPUT" ? true : e.keyCode !== 32;
        };
    }, []);

    useEffect(() => {
        document.body.onkeydown = function (e) {
            if (e.target.tagName != "INPUT")
                if (e.keyCode === 32) {
                    dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
                }
        }
    }, [audioPlayer.playing]);

    useEffect(() => {
        if (playerRef.current) {
            dispatch({ type: TYPE_AP_SET_REF, payload: playerRef.current })
        }
    }, [playerRef.current, currentTrack, url]);

    useEffect(() => {
        const sendHistory = async (seconds) => {
            let res = await post("account/music-history", arrayToFormData({
                music_id: audioPlayer.currentTrackId,
                uuid: store.uuid
            }));
        }

        const playedTime = Number.parseFloat(Number.parseFloat(audioPlayer.playedTime + 0.2).toFixed(1));

        if (store.auth.isAuth)
            if (playedTime == 10) {
                sendHistory();
            }
    }, [audioPlayer.playedTime]);

    const handleControl = (n) => {
        let d = !store.auth.isAuth || store.auth.isAuth && store.auth.user?.tariffs.length === 0 ? (audioPlayer.duration > 30 ? 30 : audioPlayer.duration) : audioPlayer.duration;

        let s = audioPlayer.currentTime + n;

        if (s < 0) s = 0;

        if (s > d) s = d;

        audioPlayer.ref?.seekTo(s);
        dispatch({ type: TYPE_AP_SET_CURRENT_TIME, payload: s });
    };

    useEffect(() => {
        document.body.onkeydown = function (e) {
            if (e.target.tagName != "INPUT") {
                if (e.keyCode === 32) {
                    dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
                }

                if (e.keyCode === 37) { // left
                    handleControl(-10);
                }

                if (e.keyCode === 39) { // right
                    handleControl(10);
                }
            }
        }

        return () => {
            document.body.onkeydown = function () {

            };
        }
    }, [audioPlayer.playing, audioPlayer.duration, audioPlayer.currentTime]);

    if (!currentTrack) return <></>;

    let duration = !store.auth.isAuth || SUBSCRIBE && store.auth.isAuth && store.auth.user?.tariffs.length === 0 ? (audioPlayer.duration > 30 ? 30 : audioPlayer.duration) : audioPlayer.duration;

    return (
        <>
            <AudioPlayerList isOpen={isOpenPlaylist} setIsOpen={setIsOpenPlaylist} />
            <section className="rizanova-audio-player">
                <div className="seek">
                    <div className="seek-progress" style={{ width: `${audioPlayer.currentTime / duration * 100}%` }}></div>
                    <div className="seek-load" style={{ width: `${audioPlayer.loaded * 100}%` }}></div>
                    <input type="range" className="w-100" min={0} max={duration} step="any" value={audioPlayer.currentTime} onChange={(e) => {
                        audioPlayer.ref?.seekTo(parseFloat(e.target.value));
                    }} />
                    {currentTrack && progress && <div className="seek-time">
                        <div className="d-flex justify-content-between">
                            <span>{new Date(audioPlayer.currentTime * 1000).toISOString().substr(14, 5)}</span>
                            <span>{duration == 30 ? "00:30" : currentTrack.duration}</span>
                        </div>
                    </div>}
                </div>
                <div className="container">
                    <div className="main">
                        <div className="controls">
                            {/* prev */}
                            <a role="button" onClick={() => {
                                dispatch({ type: TYPE_AP_PREV_TRACK })
                            }}>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1 0.499878C1.55 0.499878 2 0.949878 2 1.49988V11.4999C2 12.0499 1.55 12.4999 1 12.4999C0.45 12.4999 0 12.0499 0 11.4999V1.49988C0 0.949878 0.45 0.499878 1 0.499878ZM4.66 7.31988L10.43 11.3899C11.09 11.8599 12.01 11.3799 12.01 10.5699V2.42988C12.01 1.61988 11.1 1.14988 10.43 1.60988L4.66 5.67988C4.09 6.07988 4.09 6.91988 4.66 7.31988Z" />
                                </svg>
                            </a>

                            {/* play/pause */}
                            <a role="button" onClick={() => {
                                dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
                            }}>
                                {!audioPlayer.playing ? (
                                    <svg width="21" height="21" viewBox="0 0 18 21" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.666016 1.86652V19.1332C0.666016 20.4498 2.11602 21.2498 3.23268 20.5332L16.7994 11.8998C17.8327 11.2498 17.8327 9.74985 16.7994 9.08318L3.23268 0.466517C2.11602 -0.250149 0.666016 0.549851 0.666016 1.86652Z"
                                            fill="#EF225D" />
                                    </svg>
                                ) : (
                                    <svg height="21" viewBox="-45 0 327 327" width="21" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m158 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                        <path d="m8 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                    </svg>
                                )}
                            </a>

                            {/* next */}
                            <a role="button" onClick={() => {
                                dispatch({ type: TYPE_AP_NEXT_TRACK })
                            }}>
                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.58 11.3899L7.35 7.31988C7.91 6.91988 7.91 6.07988 7.35 5.68988L1.58 1.60988C0.91 1.14988 0 1.61988 0 2.42988V10.5699C0 11.3799 0.91 11.8499 1.58 11.3899ZM10 1.49988V11.4999C10 12.0499 10.45 12.4999 11 12.4999C11.55 12.4999 12 12.0499 12 11.4999V1.49988C12 0.949878 11.55 0.499878 11 0.499878C10.45 0.499878 10 0.949878 10 1.49988Z" />
                                </svg>
                            </a>

                            {/* playlist */}
                            <a role="button" className={isOpenPlaylist ? 'active' : ''} onClick={() => {
                                setIsOpenPlaylist(!isOpenPlaylist);
                            }}>
                                <svg width="24" height="15" viewBox="0 0 24 15" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.33333 8.83325C2.06667 8.83325 2.66667 8.23325 2.66667 7.49992C2.66667 6.76658 2.06667 6.16658 1.33333 6.16658C0.6 6.16658 0 6.76658 0 7.49992C0 8.23325 0.6 8.83325 1.33333 8.83325ZM1.33333 14.1666C2.06667 14.1666 2.66667 13.5666 2.66667 12.8333C2.66667 12.0999 2.06667 11.4999 1.33333 11.4999C0.6 11.4999 0 12.0999 0 12.8333C0 13.5666 0.6 14.1666 1.33333 14.1666ZM1.33333 3.49992C2.06667 3.49992 2.66667 2.89992 2.66667 2.16659C2.66667 1.43325 2.06667 0.833252 1.33333 0.833252C0.6 0.833252 0 1.43325 0 2.16659C0 2.89992 0.6 3.49992 1.33333 3.49992ZM6.66667 8.83325H22.6667C23.4 8.83325 24 8.23325 24 7.49992C24 6.76658 23.4 6.16658 22.6667 6.16658H6.66667C5.93333 6.16658 5.33333 6.76658 5.33333 7.49992C5.33333 8.23325 5.93333 8.83325 6.66667 8.83325ZM6.66667 14.1666H22.6667C23.4 14.1666 24 13.5666 24 12.8333C24 12.0999 23.4 11.4999 22.6667 11.4999H6.66667C5.93333 11.4999 5.33333 12.0999 5.33333 12.8333C5.33333 13.5666 5.93333 14.1666 6.66667 14.1666ZM5.33333 2.16659C5.33333 2.89992 5.93333 3.49992 6.66667 3.49992H22.6667C23.4 3.49992 24 2.89992 24 2.16659C24 1.43325 23.4 0.833252 22.6667 0.833252H6.66667C5.93333 0.833252 5.33333 1.43325 5.33333 2.16659ZM1.33333 8.83325C2.06667 8.83325 2.66667 8.23325 2.66667 7.49992C2.66667 6.76658 2.06667 6.16658 1.33333 6.16658C0.6 6.16658 0 6.76658 0 7.49992C0 8.23325 0.6 8.83325 1.33333 8.83325ZM1.33333 14.1666C2.06667 14.1666 2.66667 13.5666 2.66667 12.8333C2.66667 12.0999 2.06667 11.4999 1.33333 11.4999C0.6 11.4999 0 12.0999 0 12.8333C0 13.5666 0.6 14.1666 1.33333 14.1666ZM1.33333 3.49992C2.06667 3.49992 2.66667 2.89992 2.66667 2.16659C2.66667 1.43325 2.06667 0.833252 1.33333 0.833252C0.6 0.833252 0 1.43325 0 2.16659C0 2.89992 0.6 3.49992 1.33333 3.49992ZM6.66667 8.83325H22.6667C23.4 8.83325 24 8.23325 24 7.49992C24 6.76658 23.4 6.16658 22.6667 6.16658H6.66667C5.93333 6.16658 5.33333 6.76658 5.33333 7.49992C5.33333 8.23325 5.93333 8.83325 6.66667 8.83325ZM6.66667 14.1666H22.6667C23.4 14.1666 24 13.5666 24 12.8333C24 12.0999 23.4 11.4999 22.6667 11.4999H6.66667C5.93333 11.4999 5.33333 12.0999 5.33333 12.8333C5.33333 13.5666 5.93333 14.1666 6.66667 14.1666ZM5.33333 2.16659C5.33333 2.89992 5.93333 3.49992 6.66667 3.49992H22.6667C23.4 3.49992 24 2.89992 24 2.16659C24 1.43325 23.4 0.833252 22.6667 0.833252H6.66667C5.93333 0.833252 5.33333 1.43325 5.33333 2.16659Z" />
                                </svg>
                            </a>
                        </div>
                        <div className="media">
                            <div className="image">
                                <img src={currentTrack.image_path} alt="" />
                            </div>
                            <div className="single">
                                <Link href={currentTrack.albums?.length > 0 ? `/music/album/${currentTrack.albums[0].id}/track/${currentTrack.id}` : `/music/${currentTrack.id}`}>
                                    <a>
                                        <div className="single-name">{currentTrack.name} {currentTrack.version && <span>{currentTrack.version}</span>}</div>
                                    </a>
                                </Link>
                                <div className="d-flex overflow-hidden">
                                    <Link href={`/person/${currentTrack.author?.id}`}>
                                        <a>
                                            <div className={"artist-name " + (currentTrack.authors.length > 0 ? "me-1" : "")}>{currentTrack.author?.name + (currentTrack.authors.length > 0 ? ", " : "")}</div>
                                        </a>
                                    </Link>
                                    {currentTrack.authors.map((author, index) => {
                                        return (
                                            <Link key={index} href={`/person/${author.id}`}>
                                                <a> <div className="artist-name">{author.name + (index !== currentTrack.authors.length - 1 ? ", " : "")}</div> </a>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="tools">
                            {/* HQ */}
                            {(!auth.isAuth || SUBSCRIBE && auth.user?.tariffs.length === 0) ? (
                                <>
                                    <a role="button" data-event="click" data-tip data-for="registerTip">
                                        <svg width="28" height="15" viewBox="0 0 28 15" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.99" fillRule="evenodd" clipRule="evenodd"
                                                d="M26.24 12.2219L27 14.4999H25L24.333 12.4999H18C16.343 12.4999 15 11.1609 15 9.49988V3.49988C15 1.84088 16.348 0.499878 18 0.499878H25C26.657 0.499878 28 1.83888 28 3.49988V9.49988C28 10.8899 27.179 11.7979 26.24 12.2219ZM2 0.499878H0V12.4999H2V7.49988H11V12.4999H13V0.499878H11V5.49988H2V0.499878ZM17 9.49988C17 10.0559 17.447 10.4999 18 10.4999H25C25.5 10.4999 26 10.0519 26 9.49988V3.49988C26 2.94388 25.553 2.49988 25 2.49988H18C17.45 2.49988 17 2.94788 17 3.49988V9.49988Z" />
                                        </svg>
                                    </a>
                                    <ReactTooltip multiline clickable globalEventOff="click" id="registerTip" place="top" effect="solid">
                                        {!auth.isAuth ? (
                                            <>
                                                <div>{t("Войтиде чтобы послушать трек в высоком качестве")}</div>

                                                <Link href="/login">
                                                    <a className="btn btn-spec btn-spec-smaller mt-2">{t("Войти")}</a>
                                                </Link>
                                            </>
                                        ) : (SUBSCRIBE && auth.user?.tariffs.length === 0 ? <>
                                            <div>{t("Оформите подписку чтобы послушать трек в высоком качестве")}</div>

                                            <Link href="/account/subscription">
                                                <a className="btn btn-spec btn-spec-smaller mt-2">{t("Оформить")}</a>
                                            </Link>
                                        </> : "")}
                                    </ReactTooltip>
                                </>
                            )
                                : (
                                    <a role="button" className={audioPlayer.hq ? "active" : ''} onClick={() => {
                                        changeHQ(!audioPlayer.hq);
                                    }}>
                                        <svg width="28" height="15" viewBox="0 0 28 15" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.99" fillRule="evenodd" clipRule="evenodd"
                                                d="M26.24 12.2219L27 14.4999H25L24.333 12.4999H18C16.343 12.4999 15 11.1609 15 9.49988V3.49988C15 1.84088 16.348 0.499878 18 0.499878H25C26.657 0.499878 28 1.83888 28 3.49988V9.49988C28 10.8899 27.179 11.7979 26.24 12.2219ZM2 0.499878H0V12.4999H2V7.49988H11V12.4999H13V0.499878H11V5.49988H2V0.499878ZM17 9.49988C17 10.0559 17.447 10.4999 18 10.4999H25C25.5 10.4999 26 10.0519 26 9.49988V3.49988C26 2.94388 25.553 2.49988 25 2.49988H18C17.45 2.49988 17 2.94788 17 3.49988V9.49988Z" />
                                        </svg>
                                    </a>
                                )}


                            {/* repeat */}
                            <a role="button" className={audioPlayer.repeat !== repeatTypes.none ? 'active' : ''} onClick={() => {
                                if (audioPlayer.repeat === repeatTypes.none) {
                                    dispatch({ type: TYPE_AP_SET_REPEAT, payload: repeatTypes.loop });
                                } else if (audioPlayer.repeat === repeatTypes.loop) {
                                    dispatch({ type: TYPE_AP_SET_REPEAT, payload: repeatTypes.one });
                                } else {
                                    dispatch({ type: TYPE_AP_SET_REPEAT, payload: repeatTypes.none });
                                }
                            }}>
                                {audioPlayer.repeat === repeatTypes.one ? (
                                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.00094 4.49982H14.0009V6.28982C14.0009 6.73982 14.5409 6.95982 14.8509 6.63982L17.6409 3.84982C17.8409 3.64982 17.8409 3.33982 17.6409 3.13982L14.8509 0.349819C14.5409 0.0398186 14.0009 0.259819 14.0009 0.709819V2.49982H3.00094C2.45094 2.49982 2.00094 2.94982 2.00094 3.49982V7.49982C2.00094 8.04982 2.45094 8.49982 3.00094 8.49982C3.55094 8.49982 4.00094 8.04982 4.00094 7.49982V4.49982ZM14.0009 14.4998H4.00094V12.7098C4.00094 12.2598 3.46094 12.0398 3.15094 12.3598L0.360938 15.1498C0.160938 15.3498 0.160938 15.6598 0.360938 15.8598L3.15094 18.6498C3.46094 18.9598 4.00094 18.7398 4.00094 18.2898V16.4998H15.0009C15.5509 16.4998 16.0009 16.0498 16.0009 15.4998V11.4998C16.0009 10.9498 15.5509 10.4998 15.0009 10.4998C14.4509 10.4998 14.0009 10.9498 14.0009 11.4998V14.4998Z" fill="#8E8E8E" />
                                        <path d="M9.20361 13H8.38623V7.58154L6.74707 8.18359V7.44531L9.07617 6.5708H9.20361V13Z" />
                                    </svg>

                                ) : (
                                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.00094 4.49982H14.0009V6.28982C14.0009 6.73982 14.5409 6.95982 14.8509 6.63982L17.6409 3.84982C17.8409 3.64982 17.8409 3.33982 17.6409 3.13982L14.8509 0.349819C14.5409 0.0398186 14.0009 0.259819 14.0009 0.709819V2.49982H3.00094C2.45094 2.49982 2.00094 2.94982 2.00094 3.49982V7.49982C2.00094 8.04982 2.45094 8.49982 3.00094 8.49982C3.55094 8.49982 4.00094 8.04982 4.00094 7.49982V4.49982ZM14.0009 14.4998H4.00094V12.7098C4.00094 12.2598 3.46094 12.0398 3.15094 12.3598L0.360938 15.1498C0.160938 15.3498 0.160938 15.6598 0.360938 15.8598L3.15094 18.6498C3.46094 18.9598 4.00094 18.7398 4.00094 18.2898V16.4998H15.0009C15.5509 16.4998 16.0009 16.0498 16.0009 15.4998V11.4998C16.0009 10.9498 15.5509 10.4998 15.0009 10.4998C14.4509 10.4998 14.0009 10.9498 14.0009 11.4998V14.4998Z" />
                                    </svg>
                                )}
                            </a>

                            {/* random */}
                            <a role="button" className={audioPlayer.random ? 'active' : ''} onClick={() => {
                                dispatch({ type: TYPE_AP_SET_RANDOM, payload: !audioPlayer.random })
                            }}>
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.5907 5.66988L2.1207 1.19988C1.7307 0.809878 1.1007 0.809878 0.710703 1.19988C0.320703 1.58988 0.320703 2.21988 0.710703 2.60988L5.1707 7.06988L6.5907 5.66988ZM11.3507 1.34988L12.5407 2.53988L0.700703 14.3799C0.310703 14.7699 0.310703 15.3999 0.700703 15.7899C1.0907 16.1799 1.7207 16.1799 2.1107 15.7899L13.9607 3.95988L15.1507 5.14988C15.4607 5.45988 16.0007 5.23988 16.0007 4.78988V0.999878C16.0007 0.719878 15.7807 0.499878 15.5007 0.499878H11.7107C11.2607 0.499878 11.0407 1.03988 11.3507 1.34988ZM10.8307 9.90988L9.4207 11.3199L12.5507 14.4499L11.3507 15.6499C11.0407 15.9599 11.2607 16.4999 11.7107 16.4999H15.5007C15.7807 16.4999 16.0007 16.2799 16.0007 15.9999V12.2099C16.0007 11.7599 15.4607 11.5399 15.1507 11.8599L13.9607 13.0499L10.8307 9.90988Z" />
                                </svg>
                            </a>

                            <div className="volume d-flex align-items-center">
                                {/* volume */}
                                <a role="button" onClick={() => {
                                    if (audioPlayer.volume === 0 && audioPlayer.muted === false) {
                                        dispatch({ type: TYPE_AP_SET_VOLUME, payload: 100 });
                                    } else if (audioPlayer.volume !== 0 && audioPlayer.muted === true) {
                                        dispatch({ type: TYPE_AP_SET_MUTED, payload: false });
                                    } else {
                                        dispatch({ type: TYPE_AP_SET_MUTED, payload: true });
                                    }
                                }}>
                                    {audioPlayer.volume === 0 || audioPlayer.muted === true ? (
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.831 10.9848L16.316 12.5L17.831 14.015C18.0563 14.2405 18.0563 14.6056 17.831 14.8311C17.7184 14.9437 17.5708 15 17.4232 15C17.2754 15 17.1278 14.9437 17.0153 14.8311L15.5 13.3158L13.9848 14.8311C13.8722 14.9436 13.7246 15 13.5769 15C13.4293 15 13.2818 14.9437 13.1691 14.8311C12.9438 14.6057 12.9438 14.2405 13.1691 14.015L14.684 12.5L13.169 10.9848C12.9437 10.7595 12.9437 10.3942 13.169 10.1689C13.3943 9.94371 13.7593 9.94371 13.9847 10.1689L15.5 11.684L17.0151 10.1689C17.2406 9.94371 17.6056 9.94371 17.8309 10.1689C18.0563 10.3942 18.0563 10.7595 17.831 10.9848Z" />
                                            <path d="M3 10.4999V14.4999C3 15.0499 3.45 15.4999 4 15.4999H7L10.29 18.7899C10.92 19.4199 12 18.9699 12 18.0799V6.9099C12 6.0199 10.92 5.5699 10.29 6.1999L7 9.4999H4C3.45 9.4999 3 9.9499 3 10.4999Z" />
                                        </svg>
                                    ) : (
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 10.5001V14.5001C3 15.0501 3.45 15.5001 4 15.5001H7L10.29 18.7901C10.92 19.4201 12 18.9701 12 18.0801V6.91008C12 6.02008 10.92 5.57008 10.29 6.20008L7 9.50008H4C3.45 9.50008 3 9.95008 3 10.5001ZM16.5 12.5001C16.5 10.7301 15.48 9.21008 14 8.47008V16.5201C15.48 15.7901 16.5 14.2701 16.5 12.5001ZM14 4.95008V5.15009C14 5.53009 14.25 5.86009 14.6 6.00009C17.18 7.03009 19 9.56008 19 12.5001C19 15.4401 17.18 17.9701 14.6 19.0001C14.24 19.1401 14 19.4701 14 19.8501V20.0501C14 20.6801 14.63 21.1201 15.21 20.9001C18.6 19.6101 21 16.3401 21 12.5001C21 8.66008 18.6 5.39008 15.21 4.10009C14.63 3.87009 14 4.32008 14 4.95008Z" fill="#8E8E8E" />
                                        </svg>
                                    )}
                                </a>
                                <Slider min={0} max={100} value={audioPlayer.muted ? 0 : audioPlayer.volume} onChange={(val) => {
                                    dispatch({ type: TYPE_AP_SET_VOLUME, payload: val });
                                }} step={1} />
                            </div>

                            {/* hide/show */}
                            <a role="button" className={"ms-4 close-audio-player" + (audioPlayer.random ? ' active' : '')} title={t("Закрыть плеер")} onClick={async () => {
                                await removeData("audio-player-state");
                                await removeData("audio-player-state-dt");
                                dispatch({ type: TYPE_AP_CLEAR_TRACKS });
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 22 22" fill="none">
                                    <path d="M21.5 0.516862C20.85 -0.133138 19.8 -0.133138 19.15 0.516862L11 8.6502L2.84998 0.500195C2.19998 -0.149805 1.14998 -0.149805 0.499982 0.500195C-0.150018 1.1502 -0.150018 2.2002 0.499982 2.8502L8.64998 11.0002L0.499982 19.1502C-0.150018 19.8002 -0.150018 20.8502 0.499982 21.5002C1.14998 22.1502 2.19998 22.1502 2.84998 21.5002L11 13.3502L19.15 21.5002C19.8 22.1502 20.85 22.1502 21.5 21.5002C22.15 20.8502 22.15 19.8002 21.5 19.1502L13.35 11.0002L21.5 2.8502C22.1333 2.21686 22.1333 1.1502 21.5 0.516862Z" fill="white" />
                                </svg>
                            </a>

                        </div>
                    </div>
                </div>
                {currentTrack && <FilePlayer
                    url={url}
                    ref={playerRef}
                    width="0"
                    config={{
                        forceAudio: true
                    }}
                    height="0"
                    playing={audioPlayer.playing}
                    onProgress={(p) => {
                        if ((!store.auth.isAuth || store.auth.isAuth && store.auth.user?.tariffs.length === 0) && p.playedSeconds >= duration) {
                            audioPlayer.ref?.seekTo(0);

                            dispatch({ type: TYPE_AP_END_TRACK });
                        } else {
                            setProgress(p);
                            dispatch({ type: TYPE_AP_SET_CURRENT_TIME, payload: p.played != 1 ? p.playedSeconds : 0, loaded: p.loaded });

                            if (audioPlayer.playing)
                                dispatch({ type: TYPE_AP_SET_PLAYED_TIME, payload: audioPlayer.playedTime + 0.2 });
                        }
                    }}
                    loop={audioPlayer.repeat === repeatTypes.one || audioPlayer.repeat === repeatTypes.loop && audioPlayer.tracks.length === 1}
                    onPause={(e) => {
                        if (audioPlayer.playing) {
                            dispatch({ type: TYPE_AP_SET_PLAYING, payload: false });
                        }
                    }}
                    onPlay={(e) => {
                        if (!audioPlayer.playing) {
                            dispatch({ type: TYPE_AP_SET_PLAYING, payload: true });
                        }
                    }}
                    onEnded={() => {
                        if (audioPlayer.repeat === repeatTypes.one)
                            audioPlayer.ref?.seekTo(0);
                        else
                            dispatch({ type: TYPE_AP_END_TRACK });
                    }}
                    progressInterval={200}
                    volume={audioPlayer.muted ? 0 : audioPlayer.volume / 100}
                />}
            </section>
        </>

    );
}