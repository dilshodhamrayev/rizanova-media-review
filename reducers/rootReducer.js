import combineReducers from 'react-combine-reducers';

import { authReducer, initialAuthState } from '../reducers/authReducer';
import { initialThemeState, themeReducer } from '../reducers/themeReducer';
import { audioPlayerReducer, initialAudioPlayerState } from './audioPlayerReducer';
import { initialUuidState, uuidReducer } from './uuidReducer';
import { initialRouteStatusdState, routeStatusReducer } from './routeStatusReducer.js';
import { initialVideoPlayerState, videoPlayerReducer } from './videoPlayerReducer';

const [reducerCombined, initialStateCombined] = combineReducers({
    auth:                   [authReducer,  initialAuthState],
    theme:                  [themeReducer, initialThemeState],
    uuid:                   [uuidReducer,  initialUuidState],
    audioPlayer:            [audioPlayerReducer, initialAudioPlayerState],
    videoPlayer:            [videoPlayerReducer, initialVideoPlayerState],
    routeStatus:            [routeStatusReducer, initialRouteStatusdState]
});

export default {
    reducerCombined,
    initialStateCombined
}