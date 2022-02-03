import { shuffle, toSeconds } from "../utils/functions";
import { removeData } from "../utils/store";

export const repeatTypes = {
    none: 1,
    loop: 2,
    one: 3
}

export const initialAudioPlayerState = {
    tracks: [],
    originalTracks: [],
    isLoading: true,
    ref: null,
    currentTrackId: null,
    currentPlaylist: null,
    currentPlaylist_id: null,
    playing: false,
    currentTime: 0,
    playedTime: 0,
    duration: 0,
    loaded: 0,
    volume: 100,
    controls: true,
    random: false,
    repeat: repeatTypes.none,
    hq: false,
    muted: false
};

export const TYPE_AP_ADD_TRACK = "AP_ADD_TRACK";
export const TYPE_AP_REMOVE_TRACK = "AP_REMOVE_TRACK";
export const TYPE_AP_SET_TRACKS = "AP_SET_TRACKS";
export const TYPE_AP_CLEAR_TRACKS = "AP_CLEAR_TRACKS";
export const TYPE_AP_SET_PLAYING = "AP_SET_PLAYING";
export const TYPE_AP_NEXT_TRACK = "AP_NEXT_TRACK";
export const TYPE_AP_PREV_TRACK = "AP_PREV_TRACK";
export const TYPE_AP_END_TRACK = "AP_END_TRACK";
export const TYPE_AP_SET_VOLUME = "AP_SET_VOLUME";
export const TYPE_AP_SET_DURATION = "AP_SET_DURATION";
export const TYPE_AP_SET_CURRENT_TIME = "AP_SET_CURRENT_TIME";
export const TYPE_AP_SET_PLAYED_TIME = "AP_SET_PLAYED_TIME";
export const TYPE_AP_SET_CONTROLS = "AP_SET_CONTROLS";
export const TYPE_AP_SET_REPEAT = "AP_SET_REPEAT";
export const TYPE_AP_SET_HQ = "AP_SET_HQ";
export const TYPE_AP_SET_RANDOM = "AP_SET_RANDOM";
export const TYPE_AP_SET_MUTED = "AP_SET_MUTED";
export const TYPE_AP_SET_CURRENT_TRACK_ID = "AP_SET_CURRENT_TRACK_ID";
export const TYPE_AP_SET_REF = "AP_SET_REF";
export const TYPE_AP_RESTORE_STATE = "AP_RESTORE_STATE";

export const audioPlayerReducer = (prevState = initialAudioPlayerState, action) => {
    switch (action.type) {
        case TYPE_AP_RESTORE_STATE:
            return {
                ...action.payload,
                playing: false,
                currentTime: 0,
                playedTime: 0
            };
        case TYPE_AP_ADD_TRACK:
            return {
                ...prevState,
                tracks: [...prevState.tracks, action.payload],
                originalTracks: [...prevState.tracks, action.payload]
            };
        case TYPE_AP_REMOVE_TRACK:
            var currentIndex = prevState.tracks.findIndex(track => track.id == prevState.currentTrackId);

            let newTracksList = prevState.tracks.filter(track => track.id != action.payload);
            let isEmpty = newTracksList.length === 0;

            if (isEmpty) {
                removeData('audio-player-state');
                removeData('audio-player-state-dt');
            }

            let others = {};

            return {
                ...prevState,
                currentTrackId: isEmpty ? null : (currentIndex + 1 <= prevState.tracks.length - 1 ? prevState.tracks[currentIndex + 1].id : prevState.tracks[0].id),
                duration: isEmpty ? 0 : (currentIndex + 1 <= prevState.tracks.length - 1 ? toSeconds(prevState.tracks[currentIndex + 1].duration) : toSeconds(prevState.tracks[0].duration)),
                tracks: newTracksList,
                originalTracks: newTracksList,
                currentPlaylist_id: isEmpty ? null : prevState.currentPlaylist_id,
                currentPlaylist: isEmpty ? null : prevState.currentPlaylist
            };
        case TYPE_AP_SET_TRACKS:
            let cur = [...action.payload].find(m => m.id == action.currentTrackId);

            return {
                ...prevState,
                playedTime: 0,
                currentTime: 0,
                tracks: [...action.payload],
                originalTracks: [...action.payload],
                currentTrackId: action.currentTrackId ? action.currentTrackId : (action.payload?.length > 0 ? action.payload[0].id : null),
                currentPlaylist: action.currentPlaylist ? action.currentPlaylist : null,
                currentPlaylist_id: action.currentPlaylist_id ? action.currentPlaylist_id : null,
                duration: action.payload?.length > 0 ? (action.currentTrackId ? toSeconds(cur.duration) : toSeconds(action.payload[0].duration)) : null,
                isLoading: false,
                playing: true
            };
        case TYPE_AP_SET_CURRENT_TRACK_ID:
            let c = prevState.originalTracks.find(m => m.id == action.payload);

            return {
                ...prevState,
                currentTrackId: action.payload,
                playedTime: 0,
                currentTime: 0,
                duration: prevState.originalTracks?.length > 0 ? toSeconds(c.duration) : null,
                playing: true
            };
        case TYPE_AP_CLEAR_TRACKS:
            return {
                ...prevState,
                tracks: [],
                originalTracks: [],
                isLoading: false,
                duration: 0,
                playedTime: 0,
                currentTime: 0,
                currentTrackId: null,
                currentPlaylist: null,
                currentPlaylist_id: null,
                playing: false
            };
        case TYPE_AP_SET_PLAYING:
            return {
                ...prevState,
                playing: action.payload
            };
        case TYPE_AP_SET_VOLUME:
            return {
                ...prevState,
                volume: action.payload,
                muted: false
            };
        case TYPE_AP_SET_DURATION:
            return {
                ...prevState,
                duration: action.payload
            };
        case TYPE_AP_SET_CURRENT_TIME:
            return {
                ...prevState,
                currentTime: action.payload,
                loaded: action.loaded
            };
        case TYPE_AP_SET_PLAYED_TIME:
            return {
                ...prevState,
                playedTime: action.payload,
            };
        case TYPE_AP_SET_CONTROLS:
            return {
                ...prevState,
                controls: action.payload
            };
        case TYPE_AP_NEXT_TRACK:
            var currentIndex = prevState.tracks.findIndex(track => track.id == prevState.currentTrackId);

            return {
                ...prevState,
                currentTrackId: currentIndex + 1 <= prevState.tracks.length - 1 ? prevState.tracks[currentIndex + 1].id : prevState.tracks[0].id,
                duration: currentIndex + 1 <= prevState.tracks.length - 1 ? toSeconds(prevState.tracks[currentIndex + 1].duration) : toSeconds(prevState.tracks[0].duration),
                playing: true,
                playedTime: 0,
                currentTime: 0
            };
        case TYPE_AP_PREV_TRACK:
            var currentIndex = prevState.tracks.findIndex(track => track.id == prevState.currentTrackId);

            return {
                ...prevState,
                currentTrackId: currentIndex - 1 >= 0 ? prevState.tracks[currentIndex - 1].id : prevState.tracks[prevState.tracks.length - 1].id,
                duration: currentIndex - 1 >= 0 ? toSeconds(prevState.tracks[currentIndex - 1].duration) : toSeconds(prevState.tracks[prevState.tracks.length - 1].duration),
                playing: true,
                playedTime: 0,
                currentTime: 0
            };
        case TYPE_AP_END_TRACK:
            var currentIndex = prevState.tracks.findIndex(track => track.id == prevState.currentTrackId);

            if (prevState.repeat === repeatTypes.one)
                return {
                    ...prevState,
                    currentTrackId: prevState.tracks[currentIndex].id,
                    duration: toSeconds(prevState.tracks[currentIndex].duration),
                    playedTime: 0,
                    currentTime: 0
                };
            else if (prevState.repeat === repeatTypes.loop)
                return {
                    ...prevState,
                    currentTrackId: currentIndex + 1 <= prevState.tracks.length - 1 ? prevState.tracks[currentIndex + 1].id : prevState.tracks[0].id,
                    duration: currentIndex + 1 <= prevState.tracks.length - 1 ? toSeconds(prevState.tracks[currentIndex + 1].duration) : toSeconds(prevState.tracks[0].duration),
                    playedTime: 0,
                    playing: true,
                    currentTime: 0
                };
            else // repeatTypes.none
                return {
                    ...prevState,
                    currentTrackId: currentIndex + 1 <= prevState.tracks.length - 1 ? prevState.tracks[currentIndex + 1].id : prevState.tracks[currentIndex].id,
                    playing: currentIndex + 1 <= prevState.tracks.length - 1 ? true : false,
                    duration: currentIndex + 1 <= prevState.tracks.length - 1 ? toSeconds(prevState.tracks[currentIndex + 1].duration) : toSeconds(prevState.tracks[currentIndex].duration),
                    playedTime: 0,
                    currentTime: 0
                };
        case TYPE_AP_SET_REPEAT:
            return {
                ...prevState,
                repeat: action.payload
            };
        case TYPE_AP_SET_HQ:
            return {
                ...prevState,
                hq: action.payload
            };
        case TYPE_AP_SET_RANDOM:
            return {
                ...prevState,
                tracks: action.payload === true ? shuffle(prevState.originalTracks) : [...prevState.originalTracks],
                random: action.payload
            };
        case TYPE_AP_SET_MUTED:
            return {
                ...prevState,
                muted: action.payload
            };
        case TYPE_AP_SET_REF:
            return {
                ...prevState,
                ref: action.payload
            };

        default:
            return prevState;
    }
};
