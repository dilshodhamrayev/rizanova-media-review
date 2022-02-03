import moment from "moment";
import { toSeconds } from "../utils/functions";
import { removeData, storeData } from "../utils/store";

export const initialVideoPlayerState = {
    isLoading: true,
    playing: false,
    playlistToggle: false,
    currentTime: 0,
    playedTime: 0,
    duration: 0,
    volume: 100,
    muted: false,
    controls: true,
    levels: [],
    currentLevelIndex: null,
    video: null,
    playlist: [],
    fullscreen: false
};

export const TYPE_VP_SET_VIDEO = "VP_SET_VIDEO";
export const TYPE_VP_SET_PLAYLIST = "VP_SET_PLAYLIST";
export const TYPE_VP_ADD_TO_PLAYLIST = "VP_ADD_TO_PLAYLIST";
export const TYPE_VP_REMOVE_FROM_PLAYLIST = "VP_REMOVE_FROM_PLAYLIST";
export const TYPE_VP_CLEAR_VIDEO = "VP_CLEAR_VIDEO";
export const TYPE_VP_SET_PLAYING = "VP_SET_PLAYING";
export const TYPE_VP_SET_PLAYLIST_TOGGLE = "VP_SET_PLAYLIST_TOGGLE";
export const TYPE_VP_END_VIDEO = "VP_END_VIDEO";
export const TYPE_VP_SET_VOLUME = "VP_SET_VOLUME";
export const TYPE_VP_SET_DURATION = "VP_SET_DURATION";
export const TYPE_VP_SET_CURRENT_TIME = "VP_SET_CURRENT_TIME";
export const TYPE_VP_SET_PLAYED_TIME = "VP_SET_PLAYED_TIME";
export const TYPE_VP_SET_CONTROLS = "VP_SET_CONTROLS";
export const TYPE_VP_SET_MUTED = "VP_SET_MUTED";
export const TYPE_VP_SET_LEVELS = "VP_SET_LEVELS";
export const TYPE_VP_SET_CURRENT_LEVEL_INDEX = "VP_SET_CURRENT_LEVEL_INDEX";
export const TYPE_VP_SET_FULLSCREEN = "VP_SET_FULLSCREEN";

export const videoPlayerReducer = (prevState = initialVideoPlayerState, action) => {
    switch (action.type) {
        case TYPE_VP_SET_VIDEO:
            return {
                ...prevState,
                video: action.payload,
                duration: toSeconds(action.payload.duration),
                currentTime: 0,
                playedTime: 0,
                isLoading: false,
                playing: false,
            };
        case TYPE_VP_CLEAR_VIDEO:
            return {
                ...prevState,
                video: null,
                isLoading: false,
                duration: 0,
                playedTime: 0,
                currentTime: 0,
                playing: false
            };
        case TYPE_VP_SET_PLAYLIST:

            if (action.payload.length > 0) {
                storeData('video-player-playlist', action.payload);
                storeData('video-player-playlist-dt', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
            }

            return {
                ...prevState,
                playlist: [...action.payload]
            };
        case TYPE_VP_ADD_TO_PLAYLIST:
            let addedPlaylist = [...prevState.playlist, action.payload];

            storeData('video-player-playlist', addedPlaylist);
            storeData('video-player-playlist-dt', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

            return {
                ...prevState,
                playlist: addedPlaylist
            };
        case TYPE_VP_REMOVE_FROM_PLAYLIST:
            let newPlaylist = prevState.playlist.filter(video => video.id != action.payload);

            if (newPlaylist.length === 0) {
                removeData('video-player-playlist');
                removeData('video-player-playlist-dt');
            } else {
                storeData('video-player-playlist', newPlaylist);
                storeData('video-player-playlist-dt', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
            }

            return {
                ...prevState,
                playlist: newPlaylist
            };
        case TYPE_VP_SET_PLAYING:
            return {
                ...prevState,
                playing: action.payload,
                playlistToggle: false
            };
        case TYPE_VP_SET_PLAYLIST_TOGGLE:
            return {
                ...prevState,
                playlistToggle: !prevState.playlistToggle
            };
        case TYPE_VP_SET_VOLUME:
            return {
                ...prevState,
                volume: action.payload,
                muted: false
            };
        case TYPE_VP_SET_DURATION:
            return {
                ...prevState,
                duration: action.payload
            };
        case TYPE_VP_SET_CURRENT_TIME:
            return {
                ...prevState,
                currentTime: action.payload
            };
        case TYPE_VP_SET_PLAYED_TIME:
            return {
                ...prevState,
                playedTime: action.payload
            };
        case TYPE_VP_SET_CONTROLS:
            return {
                ...prevState,
                controls: action.payload
            };
        case TYPE_VP_END_VIDEO:
            return {
                ...prevState,
                playlist: [...prevState.playlist.filter(v => v.id != prevState.video?.id)],
                currentTime: 0,
                playedTime: 0,
                playing: false,
                playlistToggle: true
            };
        case TYPE_VP_SET_MUTED:
            return {
                ...prevState,
                muted: action.payload
            };
        case TYPE_VP_SET_CURRENT_LEVEL_INDEX:
            return {
                ...prevState,
                currentLevelIndex: action.payload
            };
        case TYPE_VP_SET_FULLSCREEN:
            return {
                ...prevState,
                fullscreen: action.payload
            };
        case TYPE_VP_SET_LEVELS:
            return {
                ...prevState,
                levels: [...action.payload]
            };
        default:
            return prevState;
    }
};
