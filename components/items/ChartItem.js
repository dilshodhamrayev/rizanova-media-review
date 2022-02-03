import React, { useContext } from 'react';
import { TYPE_AP_REMOVE_TRACK, TYPE_AP_SET_CURRENT_TRACK_ID, TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../reducers/audioPlayerReducer';
import { GlobalContext } from '../context';
import Link from 'next/link';
import FavoriteBtn from '../buttons/FavoriteBtn';
import { useRouter } from 'next/router';
import ChartMenu from '../buttons/ChartMenu';

export default function ChartItem({ model, order, models, showTrash = false, hideStatus = false, mutate, showMenyu = false }) {
    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const router = useRouter();

    const play = () => {
        if (audioPlayer.currentTrackId === model.id) {
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        } else {
            if (!!models) {
                dispatch({ type: TYPE_AP_SET_TRACKS, payload: models, currentTrackId: model.id });
            } else {
                dispatch({ type: TYPE_AP_SET_CURRENT_TRACK_ID, payload: model.id })
            }
        }
    }

    return <li className="" onClick={(e) => {

        if (e.target === e.currentTarget || e.target.classList.contains("artists") || e.target.classList.contains("artist-name") || e.target.classList.contains("time") || e.target.classList.contains("details") || e.target.classList.contains("order") || e.target.classList.contains("chart-status")) {
            play();
        }
    }}>
        <div className="d-flex justify-content-between">
            {!!order && <div className="number d-flex flex-wrap align-items-center">
                <div className="order">{order}</div>
                {!hideStatus && <div className="chart-status">
                    {order == 1 ? (
                        <img src="/image/chart-leader.svg" alt="" />
                    ) : (!model.last_place || model.place == model.last_place ? (
                        <div className="tire" />
                    ) : (model.place > model.last_place ? (
                        <img src="/image/chart-down.svg" alt="" />
                    ) : (
                        <img src="/image/chart-up.svg" alt="" />
                    )))}
                </div>}
            </div>}
            <div className="d-flex flex-grow-1 align-items-center details">
                <div className="chart-play position-relative me-2 d-flex align-items-center">
                    <img className="border-radius-2" src={model.image_path} alt={model.name} onClick={play} />

                    <a role="button" onClick={play}>
                        <div className={"control " + (audioPlayer.currentTrackId === model.id ? (!audioPlayer.playing ? 'active paused' : "active") : "")}>
                            {audioPlayer.currentTrackId === model.id && audioPlayer.playing && <div className="ringring"></div>}
                            {audioPlayer.currentTrackId === model.id && audioPlayer.playing ? (
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle opacity="0.9" cx="16" cy="16" r="16" fill="#EF225D" />
                                    <path d="M14.25 10H11.75C11.3365 10 11 10.3365 11 10.75V21.25C11 21.6635 11.3365 22 11.75 22H14.25C14.6635 22 15 21.6635 15 21.25V10.75C15 10.3365 14.6635 10 14.25 10Z" fill="white" />
                                    <path d="M20.25 10H17.75C17.3365 10 17 10.3365 17 10.75V21.25C17 21.6635 17.3365 22 17.75 22H20.25C20.6635 22 21 21.6635 21 21.25V10.75C21 10.3365 20.6635 10 20.25 10Z" fill="white" />
                                </svg>
                            ) : (
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle opacity="0.9" cx="16" cy="16" r="16" fill="#EF225D" />
                                    <path d="M12.2351 11.1258V20.8764C12.2351 21.62 13.0539 22.0717 13.6845 21.667L21.3457 16.7917C21.9292 16.4247 21.9292 15.5776 21.3457 15.2011L13.6845 10.3353C13.0539 9.93055 12.2351 10.3823 12.2351 11.1258Z" fill="white" />
                                </svg>
                            )}
                        </div>
                    </a>
                </div>
                <div className="info">
                    <div className="artist-name d-block">
                        <a role="button" className="" onClick={() => {
                            router.push(model.albums?.length > 0 ? `/music/album/${model.albums[0].id}/track/${model.id}` : `/music/${model.id}`)
                        }} title={model.name}>{model.name} {model.version && <span className="version">{model.version}</span>}</a>
                    </div>
                    <div className="artists">
                        <Link href={"/person/" + model.author_id}><a className="composition-name">{model.author?.name}</a></Link>{model.authors.length > 0 && <span>, </span>}
                        {model.authors.map((author, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Link href={`/person/${author.id}`}>
                                        <a className="composition-name">{author.name}</a>
                                    </Link>
                                    {index !== model.authors.length - 1 && <span>, </span>}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center tools ">
                {/* favorite */}
                <FavoriteBtn className='me-3' model={model} type="music" />

                {/* trash */}
                {showTrash && <a className="me-3" onClick={() => {
                    dispatch({ type: TYPE_AP_REMOVE_TRACK, payload: model.id });
                }}>
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V6C13 4.9 12.1 4 11 4H3C1.9 4 1 4.9 1 6V16ZM13 1H10.5L9.79 0.29C9.61 0.11 9.35 0 9.09 0H4.91C4.65 0 4.39 0.11 4.21 0.29L3.5 1H1C0.45 1 0 1.45 0 2C0 2.55 0.45 3 1 3H13C13.55 3 14 2.55 14 2C14 1.45 13.55 1 13 1Z" />
                    </svg>
                </a>}
            </div>
            <div className="d-flex align-items-center time-box">
                <span className="time">
                    {model.duration}
                </span>
            </div>
            {showMenyu && <ChartMenu model={model} mutate={mutate} />}
        </div>
    </li>
}