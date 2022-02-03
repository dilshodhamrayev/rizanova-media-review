import Link from 'next/link';
import React, { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../context';
import { TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../reducers/audioPlayerReducer';
import { useRouter } from 'next/router';
import MusicTableFavoriteBtn from '../buttons/MusicTableFavoriteBtn';
import ChartBadge from '../parts/ChartBadge';

export default function SingleMusicItem(props) {
    const { model, order, models, track } = props;

    const {t, i18n} = useTranslation();

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const ref = useRef(null);

    const playList = (music_id) => {
        if (audioPlayer.currentTrackId === music_id)
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            dispatch({ type: TYPE_AP_SET_TRACKS, payload: models, currentTrackId: music_id });
        }
    }

    useEffect(() => {
        if (track && ref.current) {
            setTimeout(() => {
                ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }, [track]);

    return (
        <div ref={ref} className={"d-flex album-music-item align-items-center justify-content-between " + (track ? 'tracked ' : '') + (audioPlayer.currentTrackId === model.id ? 'active' : '')} onClick={(e) => {
            if (e.target.className !== "favorite-element" && e.target.className !== "composition-link") {
                playList(model.id);
            }
        }}>
            <div className="number">
                {order}
            </div>
            <div className="control">
                {audioPlayer.currentTrackId === model.id && audioPlayer.playing ? (
                    <svg height="14" viewBox="-45 0 327 327" width="11" xmlns="http://www.w3.org/2000/svg">
                        <path d="m158 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                        <path d="m8 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                    </svg>
                ) : (
                    <svg width="11" height="14" viewBox="0 0 11 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1.82001V12.18C0 12.97 0.87 13.45 1.54 13.02L9.68 7.84001C10.3 7.45001 10.3 6.55001 9.68 6.15001L1.54 0.980008C0.87 0.550008 0 1.03001 0 1.82001Z" />
                    </svg>
                )}

            </div>
            <div className="composition-name">
                <Link href={model.albums?.length > 0 ? `/music/album/${model.albums[0].id}/track/${model.id}` : `/music/${model.id}`}>
                    <a className="composition-link d-inline-flex align-items-center">
                        {model.name} {model.version && <span className="version">{model.version}</span>} {model.chart_place && <ChartBadge place={model.chart_place} className='ms-2'/>}
                    </a>
                </Link>
            </div>
            <div className="favorite favorite-element">
                <MusicTableFavoriteBtn model={model} />
            </div>
            <div className="time">
                {model.duration}
            </div>
        </div>
    );
}