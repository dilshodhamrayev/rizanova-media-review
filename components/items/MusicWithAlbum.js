import React, { useContext } from 'react';
import { TYPE_AP_REMOVE_TRACK, TYPE_AP_SET_CURRENT_TRACK_ID, TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../reducers/audioPlayerReducer';
import { GlobalContext } from '../context';
import Link from 'next/link';
import FavoriteBtn from '../buttons/FavoriteBtn';
import { useRouter } from 'next/router';

export default function MusicWithAlbum({ model, order, models, showTrash = false, hideTire = false }) {
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

    return <li className="advanced improved" onClick={(e) => {
        if (e.target === e.currentTarget) {
            play();
        }
    }}>
        <div className="d-flex justify-content-between">
            {!!order && <div className={"number " + (audioPlayer.currentTrackId === model.id ? 'd-none' : 'd-flex') + " flex-wrap align-items-center align-content-center"}>
                <div>{order}</div>
                {!hideTire && <div className="chart-status w-100">
                    {order == 1 ? (
                        <img src="/image/chart-leader.svg" alt="" />
                    ) : (!model.last_place || model.place == model.last_place ? (
                        <div className="tire" />
                    ) : (model.place < model.last_place ? (
                        <img src="/image/chart-down.svg" alt="" />
                    ) : (
                        <img src="/image/chart-up.svg" alt="" />
                    )))}
                </div>}
            </div>}
            <a role="button" onClick={play}>
                <div className={"control-play " + (hideTire ? 'status-hidden ' : '') + (audioPlayer.currentTrackId === model.id ? (!audioPlayer.playing ? 'active paused' : "active") : "")}>
                    {audioPlayer.currentTrackId === model.id && audioPlayer.playing ? (
                        <div className="equilizer">
                            <i className="equilizer-bar"></i>
                            <i className="equilizer-bar"></i>
                            <i className="equilizer-bar"></i>
                        </div>
                    ) : (
                        <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1.82001V12.18C0 12.97 0.87 13.45 1.54 13.02L9.68 7.84001C10.3 7.45001 10.3 6.55001 9.68 6.15001L1.54 0.980008C0.87 0.550008 0 1.03001 0 1.82001Z" fill="white" />
                        </svg>
                    )}
                </div>
            </a>
            <div className="d-flex flex-grow-1 align-items-center details">
                <div className="chart-play position-relative me-2 d-flex align-items-center">
                    <img className="border-radius-2" src={model.image_path} alt={model.name} onClick={play} />
                </div>
                <div className="info align-items-center">
                    <div className="artist-name d-block">
                        <a role="button" className={"link" + (audioPlayer.currentTrackId === model.id ? 'active' : '')} onClick={() => {
                            router.push(model.albums?.length > 0 ? `/music/album/${model.albums[0].id}/track/${model.id}` : `/music/${model.id}`)
                        }} title={model.name}>
                            {model.name} {model.version && <span className="version">{model.version}</span>}
                        </a>
                    </div>
                    <div className="artists">
                        {model.albums?.map((album, index) => <Link key={index} href={`/music/album/${album.id}`}><a className='composition-name'>{album.name}</a></Link>)}
                    </div>

                </div>

            </div>
            <div className="d-flex align-items-center tools opacity-100 ">
                {/* favorite */}
                <FavoriteBtn className='me-4' model={model} type="music" />

            </div>
            <div className="d-flex align-items-center time-box">
                <span className="time">
                    {model.duration}
                </span>
            </div>

        </div>
    </li>
}