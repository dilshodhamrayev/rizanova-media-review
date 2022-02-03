import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { TYPE_VP_END_VIDEO, TYPE_VP_SET_CURRENT_LEVEL_INDEX, TYPE_VP_SET_CURRENT_TIME, TYPE_VP_SET_FULLSCREEN, TYPE_VP_SET_LEVELS, TYPE_VP_SET_MUTED, TYPE_VP_SET_PLAYED_TIME, TYPE_VP_SET_PLAYING, TYPE_VP_SET_VIDEO, TYPE_VP_SET_VOLUME } from '../reducers/videoPlayerReducer';
import { GlobalContext } from './context';
import Slider, { Handle } from 'rc-slider';
import { arrayToFormData, toHHMMSS } from '../utils/functions';
import screenfull from 'screenfull';
import { useTranslation } from 'next-i18next';
import { TYPE_AP_CLEAR_TRACKS } from '../reducers/audioPlayerReducer';
import { post } from '../utils/request';
import VideoPlayerReview from './VideoPlayerReview';
import { toast } from 'react-toastify';
import Watermark from './Watermark';

export default function VideoPlayer({ model, showReview = false }) {
    const { t, i18n } = useTranslation();
    const [player, setPlayer] = useState(null);
    const { store, dispatch } = useContext(GlobalContext);
    const { videoPlayer, audioPlayer } = store;

    const [firstPlay, setFirstPlay] = useState(true);

    const [progress, setProgress] = useState(null);

    const playerRef = createRef();
    const wrapper = createRef();

    const timer = useRef(null);
    const [inactive, setInactive] = useState(false);
    const [settings, setSettings] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    const [historySent, setHistorySent] = useState(false);

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isReviewClosed, setIsReviewClosed] = useState(false);

    const [watermark, setWatermark] = useState([]);

    useEffect(() => {
        if (player) {
            dispatch({ type: TYPE_VP_SET_LEVELS, payload: player.levels });
            dispatch({ type: TYPE_VP_SET_VIDEO, payload: model });
        }
    }, [player]);

    useEffect(() => {
        setFirstPlay(true);
        dispatch({type: TYPE_VP_SET_PLAYING, payload: false});
    }, [model.id]);

    useEffect(() => {
        if (player) {
            if (player.currentLevel >= 2) {
                if (!store.auth.isAuth || store.auth.user?.tariffs.length === 0) {
                    player.currentLevel = 1;
                }
            }
        }
    }, [player, player?.currentLevel]);

    useEffect(() => {
        if (screenfull.isEnabled) {
            screenfull.on('change', () => {
                dispatch({ type: TYPE_VP_SET_FULLSCREEN, payload: screenfull.isFullscreen });
            });
        }
    }, []);

    useEffect(() => {
        if (audioPlayer.playing) {
            dispatch({ type: TYPE_VP_SET_PLAYING, payload: false });
        }
    }, [audioPlayer.playing]);

    useEffect(() => {
        if (videoPlayer.playing) {
            dispatch({ type: TYPE_AP_CLEAR_TRACKS, payload: false });
        }
    }, [videoPlayer.playing]);

    useEffect(() => {
        const sendHistory = async (seconds) => {
            let res = await post("account/video-history", arrayToFormData({
                video_id: model.id,
                seconds: Number.parseInt(seconds)
            }));
        }

        const playedTime = Number.parseFloat(Number.parseFloat(videoPlayer.playedTime + 0.2).toFixed(1));

        if (store.auth.isAuth)
            if (playedTime / videoPlayer.duration * 100 > 15 && Number.parseFloat(Number.parseFloat(playedTime + 0.2).toFixed(1)) % 10 === 0) {
                sendHistory(playedTime);
            }

    }, [videoPlayer.playedTime]);

    useEffect(() => {
        if (videoPlayer.currentTime > 25) {
            if (!document.querySelector("#watermark")) {
                setWatermark([...watermark, <Watermark key={videoPlayer.currentTime} />]);
            }
        }
    }, [videoPlayer.currentTime]);

    useEffect(() => {
        window.onkeydown = function (e) {
            return e.target.tagName == "INPUT" ? true : e.keyCode !== 32;
        };
    }, []);

    const handleControl = (n) => {
        let s = videoPlayer.currentTime + n;

        if (s < 0) s = 0;

        if (s > videoPlayer.duration) s = videoPlayer.duration;

        player.media.currentTime = s;
        dispatch({ type: TYPE_VP_SET_CURRENT_TIME, payload: s });

    };

    useEffect(() => {
        document.body.onkeydown = function (e) {
            if (e.target.tagName != "INPUT") {
                if (e.keyCode === 32) {
                    if (!firstPlay)
                        dispatch({ type: TYPE_VP_SET_PLAYING, payload: !videoPlayer.playing });
                }

                if (e.keyCode === 37) { // left
                    if (!firstPlay)
                        handleControl(-10);
                }

                if (e.keyCode === 39) { // right
                    if (!firstPlay)
                        handleControl(10);
                }

                if (e.keyCode === 38) { // up

                }

                if (e.keyCode === 40) { // down

                }
            }
        }

        return () => {
            document.body.onkeydown = function () {

            };
        }
    }, [videoPlayer.playing, videoPlayer.duration, videoPlayer.currentTime, firstPlay]);

    if (!model) return <></>;

    const handleReview = () => {
        if (isReviewClosed || !showReview || !store.auth.isAuth || model.voted) return;

        const playedTime = Number.parseFloat(Number.parseFloat(videoPlayer.playedTime + 0.2).toFixed(1));

        if (playedTime / videoPlayer.duration * 100 > 50) {
            setIsReviewOpen(true);
        }
    }

    let height = videoPlayer.levels[videoPlayer.levels.length - 1 - player?.currentLevel]?.height;

    const isSafari = typeof window != "undefined" && /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

    return (
        <div ref={wrapper} className={"rizanova-video-player" + (videoPlayer.playing ? ' playing' : " paused") + (inactive ? ' user-inactive' : '') + (firstPlay ? ' not-interactivated' : '')} onClick={(e) => {
            const tagName = e.target.tagName.toLowerCase();
            if (tagName === "video" || tagName === "main") {
                dispatch({ type: TYPE_VP_SET_PLAYING, payload: !videoPlayer.playing });
                setSettings(0);
            }
        }} onContextMenu={(e) => {
            e.preventDefault();
        }} onMouseLeave={() => {
            if (timer.current) {
                clearTimeout(timer.current);
                setInactive(false);
                setSettings(0);
            }
        }} onMouseMove={() => {
            if (timer.current) {
                clearTimeout(timer.current);
                setInactive(false);
            }

            if (settings === 0)
                timer.current = setTimeout(() => {
                    setInactive(true);
                    setSettings(0);
                }, 3000);
        }}>
            <ReactPlayer
                playbackRate={playbackRate}
                className="video-wrapper"
                playsinline
                onPlay={() => {
                    if (!videoPlayer.playing) {
                        dispatch({ type: TYPE_VP_SET_PLAYING, payload: true });
                    }

                    setIsReviewOpen(false);
                }}
                onPause={() => {
                    if (videoPlayer.playing) {
                        dispatch({ type: TYPE_VP_SET_PLAYING, payload: false });
                    }

                    handleReview();
                }} onProgress={(p) => {
                    dispatch({ type: TYPE_VP_SET_CURRENT_TIME, payload: p.played != 1 ? p.playedSeconds : 0 });

                    if (videoPlayer.playing)
                        dispatch({ type: TYPE_VP_SET_PLAYED_TIME, payload: videoPlayer.playedTime + 0.2 });

                    setProgress(p);
                }}
                ref={playerRef}
                width={"100%"}
                height={"100%"}
                onReady={p => {
                    setPlayer(p.getInternalPlayer("hls"));
                }} config={{
                    file: {
                        forceHLS: !isSafari,
                        attributes: {
                            poster: model.image_path
                        }
                    }
                }}
                key={model.filenames}
                url={model.filenames}
                playing={videoPlayer.playing && !firstPlay}
                controls={false}
                muted={videoPlayer.muted}
                volume={videoPlayer.volume / 100}
                onEnded={() => {
                    dispatch({ type: TYPE_VP_END_VIDEO });
                }}
                progressInterval={200} />

            <VideoPlayerReview setIsReviewClosed={setIsReviewClosed} isReviewClosed={isReviewClosed} setIsReviewOpen={setIsReviewOpen} isReviewOpen={isReviewOpen} video_id={model.id} />

            {firstPlay && (
                <div className="first-play">
                    <a role="button" className='big-play-btn btn-big-spec' onClick={() => {
                        dispatch({ type: TYPE_VP_SET_PLAYING, payload: true });
                        setSettings(0);
                        setFirstPlay(false);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 35 40" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" fill="#EF255D" d="M1.47895 0.0629736C0.955107 0.226083 0.552699 0.570356 0.285242 1.08415C0.147466 1.34886 0.142883 1.96034 0.142883 19.9977V38.6377L0.307696 38.9503C0.741569 39.7731 1.71647 40.1979 2.51044 39.91C2.97692 39.741 33.5579 21.6543 33.8491 21.3752C34.2598 20.9816 34.4286 20.5804 34.4286 19.9977C34.4286 19.415 34.2599 19.014 33.8491 18.62C33.558 18.3408 2.99311 0.26774 2.52823 0.0998628C2.20105 -0.0183077 1.78673 -0.0328446 1.47895 0.0629736Z" />
                        </svg>
                        <span className='ms-2'>{t("Смотреть")}</span>
                    </a>
                </div>
            )}

            <main className="overlay">
                <div className="controls">
                    <div className="progress position-relative">
                        <div className="loaded" style={{ width: videoPlayer.playing && progress ? `${progress.loaded * 100}%` : '0%' }}></div>
                        <Slider className="progress-bar" onChange={e => {
                            playerRef?.current.seekTo(parseFloat(e));
                            dispatch({ type: TYPE_VP_SET_CURRENT_TIME, payload: e });
                        }} handle={({ dragging, ...restProps }) => {
                            return (
                                <Handle dragging={dragging.toString()} {...restProps}></Handle>
                            );
                        }} min={0} included step={0.1} max={videoPlayer.duration} value={videoPlayer.currentTime} />
                    </div>
                    <div className="tools">
                        <a role="button" className="tool" onClick={() => {
                            dispatch({ type: TYPE_VP_SET_PLAYING, payload: !videoPlayer.playing });
                            setSettings(0);
                        }}>
                            {videoPlayer.playing ? (
                                <svg height="17" viewBox="-45 0 327 327" width="14" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="white" d="m158 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                    <path fill="white" d="m8 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 11 14" fill="none">
                                    <path d="M0 0V14L11 7L0 0Z" fill="white" />
                                </svg>
                            )}
                        </a>
                        <div className="volume tool d-flex align-items-center">
                            <a role="button" className="tool" onClick={() => {
                                dispatch({ type: TYPE_VP_SET_MUTED, payload: !videoPlayer.muted })
                            }}>
                                {videoPlayer.muted || videoPlayer.volume === 0 ? (
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#fff" d="M17.831 10.9848L16.316 12.5L17.831 14.015C18.0563 14.2405 18.0563 14.6056 17.831 14.8311C17.7184 14.9437 17.5708 15 17.4232 15C17.2754 15 17.1278 14.9437 17.0153 14.8311L15.5 13.3158L13.9848 14.8311C13.8722 14.9436 13.7246 15 13.5769 15C13.4293 15 13.2818 14.9437 13.1691 14.8311C12.9438 14.6057 12.9438 14.2405 13.1691 14.015L14.684 12.5L13.169 10.9848C12.9437 10.7595 12.9437 10.3942 13.169 10.1689C13.3943 9.94371 13.7593 9.94371 13.9847 10.1689L15.5 11.684L17.0151 10.1689C17.2406 9.94371 17.6056 9.94371 17.8309 10.1689C18.0563 10.3942 18.0563 10.7595 17.831 10.9848Z" />
                                        <path fill="#fff" d="M3 10.4999V14.4999C3 15.0499 3.45 15.4999 4 15.4999H7L10.29 18.7899C10.92 19.4199 12 18.9699 12 18.0799V6.9099C12 6.0199 10.92 5.5699 10.29 6.1999L7 9.4999H4C3.45 9.4999 3 9.9499 3 10.4999Z" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#fff" d="M3 10.5001V14.5001C3 15.0501 3.45 15.5001 4 15.5001H7L10.29 18.7901C10.92 19.4201 12 18.9701 12 18.0801V6.91008C12 6.02008 10.92 5.57008 10.29 6.20008L7 9.50008H4C3.45 9.50008 3 9.95008 3 10.5001ZM16.5 12.5001C16.5 10.7301 15.48 9.21008 14 8.47008V16.5201C15.48 15.7901 16.5 14.2701 16.5 12.5001ZM14 4.95008V5.15009C14 5.53009 14.25 5.86009 14.6 6.00009C17.18 7.03009 19 9.56008 19 12.5001C19 15.4401 17.18 17.9701 14.6 19.0001C14.24 19.1401 14 19.4701 14 19.8501V20.0501C14 20.6801 14.63 21.1201 15.21 20.9001C18.6 19.6101 21 16.3401 21 12.5001C21 8.66008 18.6 5.39008 15.21 4.10009C14.63 3.87009 14 4.32008 14 4.95008Z" />
                                    </svg>
                                )}
                            </a>
                            <Slider className="volume-bar" onChange={e => {
                                dispatch({ type: TYPE_VP_SET_VOLUME, payload: e });
                            }} handle={({ dragging, ...restProps }) => {
                                return (
                                    <Handle dragging={dragging.toString()} {...restProps}></Handle>
                                );
                            }} min={0} step={1} max={100} value={videoPlayer.muted ? 0 : videoPlayer.volume} />
                        </div>
                        <div className="duration tool">
                            <span> {toHHMMSS(videoPlayer.currentTime)} </span> <span> / </span> <span> {toHHMMSS(videoPlayer.duration)} </span>
                        </div>
                        <div className="ms-auto d-flex align-items-center">
                            <a role="button" className="tool" onClick={() => {
                                setSettings(settings === 0 ? 1 : 0);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M17.1401 10.94C17.1801 10.64 17.2001 10.33 17.2001 10C17.2001 9.68003 17.1801 9.36002 17.1301 9.06002L19.1601 7.48002C19.3401 7.34002 19.3901 7.07002 19.2801 6.87002L17.3601 3.55002C17.2401 3.33002 16.9901 3.26002 16.7701 3.33002L14.3801 4.29002C13.8801 3.91002 13.3501 3.59002 12.7601 3.35002L12.4001 0.810024C12.3601 0.570024 12.1601 0.400024 11.9201 0.400024H8.08011C7.84011 0.400024 7.65011 0.570024 7.61011 0.810024L7.25011 3.35002C6.66011 3.59002 6.12011 3.92002 5.63011 4.29002L3.24011 3.33002C3.02011 3.25002 2.77011 3.33002 2.65011 3.55002L0.74011 6.87002C0.62011 7.08002 0.66011 7.34002 0.86011 7.48002L2.89011 9.06002C2.84011 9.36002 2.80011 9.69002 2.80011 10C2.80011 10.31 2.82011 10.64 2.87011 10.94L0.84011 12.52C0.66011 12.66 0.61011 12.93 0.72011 13.13L2.64011 16.45C2.76011 16.67 3.01011 16.74 3.23011 16.67L5.62011 15.71C6.12011 16.09 6.65011 16.41 7.24011 16.65L7.60011 19.19C7.65011 19.43 7.84011 19.6 8.08011 19.6H11.9201C12.1601 19.6 12.3601 19.43 12.3901 19.19L12.7501 16.65C13.3401 16.41 13.8801 16.09 14.3701 15.71L16.7601 16.67C16.9801 16.75 17.2301 16.67 17.3501 16.45L19.2701 13.13C19.3901 12.91 19.3401 12.66 19.1501 12.52L17.1401 10.94ZM10.0001 13.6C8.02011 13.6 6.40011 11.98 6.40011 10C6.40011 8.02002 8.02011 6.40002 10.0001 6.40002C11.9801 6.40002 13.6001 8.02002 13.6001 10C13.6001 11.98 11.9801 13.6 10.0001 13.6Z" fill="white" />
                                </svg>
                            </a>
                            <a role="button" className='tool picture-in-picture' onClick={() => {
                                if (document.pictureInPictureElement !== null) {
                                    document.exitPictureInPicture();
                                } else {
                                    if (player.media)
                                        player.media.requestPictureInPicture();
                                }

                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 25 19" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.02536 0.0920417C1.08253 0.337143 0.343019 1.06231 0.0943008 1.98555C-0.0328192 2.45731 -0.0307555 16.5465 0.0964761 17.0187C0.34709 17.9489 1.09051 18.6653 2.05777 18.9089C2.54015 19.0304 22.4709 19.0304 22.9533 18.9089C23.9206 18.6653 24.664 17.9489 24.9146 17.0187C24.9892 16.7417 25 15.7926 25 9.49806C25 3.20356 24.9892 2.25438 24.9146 1.97741C24.664 1.04726 23.9206 0.330833 22.9533 0.0872419C22.4794 -0.0321002 2.48521 -0.02757 2.02536 0.0920417ZM22.8031 1.87063C22.8879 1.93179 23.0089 2.04881 23.0722 2.13072C23.187 2.2794 23.1872 2.29165 23.1872 9.49806C23.1872 16.7045 23.187 16.7167 23.0722 16.8654C23.0089 16.9473 22.8879 17.0643 22.8031 17.1255L22.6491 17.2367H12.5055H2.36199L2.20793 17.1255C2.1232 17.0643 2.00216 16.9473 1.93891 16.8654C1.82428 16.717 1.82384 16.691 1.80788 9.64242C1.79907 5.7517 1.80632 2.49021 1.82406 2.39465C1.86411 2.1785 2.09849 1.90299 2.32311 1.80808C2.46312 1.74897 4.27777 1.73829 12.5712 1.74784L22.6491 1.75943L22.8031 1.87063ZM12.9797 8.6844C12.4761 8.80509 12.0175 9.16743 11.7791 9.63288L11.641 9.90252V12.0866C11.641 14.2455 11.6424 14.2735 11.7669 14.515C11.9649 14.8992 12.19 15.1263 12.5711 15.3261L12.9239 15.511H16.5216H20.1194L20.4708 15.3267C20.8612 15.1221 21.0293 14.9541 21.2519 14.5461L21.4023 14.2707V12.0866V9.90252L21.211 9.56142C21.0043 9.19299 20.7695 8.97534 20.3721 8.78389L20.1194 8.66218L16.6332 8.65323C14.7158 8.64832 13.0717 8.66234 12.9797 8.6844ZM19.6452 12.0866V13.8123H16.5216H13.398V12.0866V10.3609H16.5216H19.6452V12.0866Z" fill="white" />
                                </svg>
                            </a>
                            <a role="button" className='tool me-0' onClick={() => {
                                if (screenfull.isEnabled) {
                                    screenfull.toggle(wrapper.current, { navigationUI: 'hide' });
                                }
                            }}>
                                {videoPlayer.fullscreen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M0 11V9H5V14H3V11H0ZM0 5V3H3V0H5V5H0ZM11 11V14H9V9H14V11H11ZM9 0H11V3H14V5H9V0Z" fill="white" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2 9H0V14H5V12H2V9ZM0 5H2V2H5V0H0V5ZM12 12H9V14H14V9H12V12ZM9 0V2H12V5H14V0H9Z" fill="white" />
                                    </svg>
                                )}
                            </a>
                        </div>
                    </div>
                </div>
                <div className={"settings " + (settings >= 1 ? 'show' : '')}>
                    {settings === 1 ? <>
                        <a role="button" className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                            setSettings(2);
                        }}>
                            <div className="label">{t("Качество")}</div>
                            <div className="value d-flex align-items-center">
                                <span className="me-1 pe-1 d-flex align-items-center">{videoPlayer.currentLevelIndex === null ? (t("Автонастройка") + " (" + ((!store.auth.isAuth || store.auth.isAuth && store.auth.user?.tariffs.length === 0 ? (height < 720 ? height : "540") : height) + "p)")) : videoPlayer.levels[videoPlayer.currentLevelIndex]?.height + "p"}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="6.3" height="9.8" viewBox="0 0 9 14" fill="none">
                                    <path fill="#EF225D" d="M0.837344 11.5279L5.36401 7.0012L0.837344 2.47453C0.382344 2.01953 0.382344 1.28453 0.837344 0.829531C1.29234 0.374531 2.02734 0.374531 2.48234 0.829531L7.83735 6.18453C8.29235 6.63953 8.29235 7.37453 7.83735 7.82953L2.48234 13.1845C2.02734 13.6395 1.29234 13.6395 0.837344 13.1845C0.39401 12.7295 0.382344 11.9829 0.837344 11.5279Z" />
                                </svg>
                            </div>
                        </a>
                        <a role="button" className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                            setSettings(3);
                        }}>
                            <div className="label">{t("Скорость")}</div>
                            <div className="value d-flex align-items-center">
                                <span className="me-1 pe-1 d-flex align-items-center">{playbackRate === 1 ? t("Обычная") : playbackRate + 'x'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="6.3" height="9.8" viewBox="0 0 9 14" fill="none">
                                    <path fill="#EF225D" d="M0.837344 11.5279L5.36401 7.0012L0.837344 2.47453C0.382344 2.01953 0.382344 1.28453 0.837344 0.829531C1.29234 0.374531 2.02734 0.374531 2.48234 0.829531L7.83735 6.18453C8.29235 6.63953 8.29235 7.37453 7.83735 7.82953L2.48234 13.1845C2.02734 13.6395 1.29234 13.6395 0.837344 13.1845C0.39401 12.7295 0.382344 11.9829 0.837344 11.5279Z" />
                                </svg>
                            </div>
                        </a>
                    </> : settings === 2 ? (
                        <>
                            <a role="button" className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                                setSettings(1);
                            }}>
                                <div className="label font-weight-bold d-flex align-items-center">
                                    <svg className="rotate-180 me-2" xmlns="http://www.w3.org/2000/svg" width="6.3" height="9.8" viewBox="0 0 9 14" fill="none">
                                        <path fill="#fff" d="M0.837344 11.5279L5.36401 7.0012L0.837344 2.47453C0.382344 2.01953 0.382344 1.28453 0.837344 0.829531C1.29234 0.374531 2.02734 0.374531 2.48234 0.829531L7.83735 6.18453C8.29235 6.63953 8.29235 7.37453 7.83735 7.82953L2.48234 13.1845C2.02734 13.6395 1.29234 13.6395 0.837344 13.1845C0.39401 12.7295 0.382344 11.9829 0.837344 11.5279Z" />
                                    </svg>
                                    <span>{t("Качество")}</span>
                                </div>
                            </a>
                            <hr />
                            {[...videoPlayer.levels].reverse().map((level, index) => {
                                return (
                                    <a role="button" key={index} className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                                        if (level.height >= 720) {
                                            if (!store.auth.isAuth) {
                                                toast.info(t("Войдите чтобы установить это качество"), { toastId: "video-player-quality", updateId: "video-player-quality", hideProgressBar: true, position: "top-center" });
                                                return;
                                            } else if (store.auth.user?.tariffs.length === 0) {
                                                toast.info(t("Оформите подписку чтобы установить это качество"), { toastId: "video-player-quality", updateId: "video-player-quality", hideProgressBar: true, position: "top-center"});
                                                return;
                                            }
                                        }

                                        player.currentLevel = (videoPlayer.levels.length - 1 - index);
                                        dispatch({ type: TYPE_VP_SET_CURRENT_LEVEL_INDEX, payload: videoPlayer.levels.length - 1 - index });
                                    }}>
                                        <div className="label font-weight-bold d-flex align-items-center">
                                            <svg className={"me-2 " + ((videoPlayer.currentLevelIndex === videoPlayer.levels.length - 1 - index) ? '' : 'visibility-hidden')} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 515.556 515.556" height="15" viewBox="0 0 515.556 515.556" width="15">
                                                <path fill="#fff" d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z" />
                                            </svg>
                                            <span>
                                                {level.height + "p"}
                                            </span>
                                            {level.height >= 720 && (!store.auth.isAuth || store.auth.isAuth && store.auth.user?.tariffs.length === 0) && <span className="ms-2 fs-12 spec-color"> [{t("Подписка")}] </span>}
                                        </div>
                                    </a>
                                );
                            })}
                            <a role="button" className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                                player.currentLevel = -1;
                                dispatch({ type: TYPE_VP_SET_CURRENT_LEVEL_INDEX, payload: null });
                            }}>
                                <div className="label font-weight-bold d-flex align-items-center">
                                    <svg className={"me-2 " + (videoPlayer.currentLevelIndex === null ? '' : 'visibility-hidden')} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 515.556 515.556" height="15" viewBox="0 0 515.556 515.556" width="15">
                                        <path fill="#fff" d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z" />
                                    </svg>
                                    <span>
                                        {t("Автонастройка")}
                                    </span>
                                </div>
                            </a>
                        </>
                    ) : settings === 3 ? (
                        <>
                            <a role="button" className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                                setSettings(1);
                            }}>
                                <div className="label font-weight-bold d-flex align-items-center">
                                    <svg className="rotate-180 me-2" xmlns="http://www.w3.org/2000/svg" width="6.3" height="9.8" viewBox="0 0 9 14" fill="none">
                                        <path fill="#fff" d="M0.837344 11.5279L5.36401 7.0012L0.837344 2.47453C0.382344 2.01953 0.382344 1.28453 0.837344 0.829531C1.29234 0.374531 2.02734 0.374531 2.48234 0.829531L7.83735 6.18453C8.29235 6.63953 8.29235 7.37453 7.83735 7.82953L2.48234 13.1845C2.02734 13.6395 1.29234 13.6395 0.837344 13.1845C0.39401 12.7295 0.382344 11.9829 0.837344 11.5279Z" />
                                    </svg>
                                    <span>{t("Скорость")}</span>
                                </div>
                            </a>
                            <hr />
                            {[/*0.25,*/ 0.5,/* 0.75,*/ 1, /*1.25,*/ 1.5, /*1.75,*/ 2].map(speed => {
                                return (
                                    <a role="button" key={speed} className="d-flex justify-content-between align-items-center setting-item" onClick={() => {
                                        setPlaybackRate(speed);
                                    }}>
                                        <div className="label font-weight-bold d-flex align-items-center">
                                            <svg className={"me-2 " + (playbackRate === speed ? '' : 'visibility-hidden')} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 515.556 515.556" height="15" viewBox="0 0 515.556 515.556" width="15">
                                                <path fill="#fff" d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z" />
                                            </svg>
                                            <span>
                                                {speed === 1 ? t("Обычная") : speed + 'x'}
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}

                        </>
                    ) : (<></>)}

                </div>
            </main>
            {videoPlayer.currentTime > 20 && <Watermark />}
            {watermark}
        </div>
    )
}