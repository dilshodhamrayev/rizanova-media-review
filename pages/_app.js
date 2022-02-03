import axios from 'axios';
import React from 'react';
import Layout from "../components/Layout";
import Preloader from '../components/Preloader';
import { getData, storeData } from '../utils/store';
import { GlobalContext } from '../components/context';
import rootReducer from '../reducers/rootReducer';
import Router, { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';

import { uuidv4 } from '../utils/functions';
import { CHANGE_UUID } from '../reducers/uuidReducer';
import { DARK_THEME } from '../reducers/themeReducer';
import { CHANGE_ROUTE_STATUS } from '../reducers/routeStatusReducer.js';
import useUser from '../utils/useUser';
import { useEffect } from 'react';
import { get } from '../utils/request';
import moment from 'moment';
import { appWithTranslation, useTranslation } from 'next-i18next'

function RizaNovaMediaApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = React.useState(true);

    const router = useRouter();

    const { t, i18n } = useTranslation();

    const [store, dispatch] = React.useReducer(
        rootReducer.reducerCombined,
        rootReducer.initialStateCombined,
    );

    Router.events.on('routeChangeStart', () => dispatch({ type: CHANGE_ROUTE_STATUS, payload: true })); Router.events.on('routeChangeComplete', () => dispatch({ type: CHANGE_ROUTE_STATUS, payload: false })); Router.events.on('routeChangeError', () => dispatch({ type: CHANGE_ROUTE_STATUS, payload: false }));

    let { user, mutateUser } = useUser();

    if (typeof window === "undefined") {
        user = pageProps.user;
    }

    const globalContext = React.useMemo(
        () => ({
            login: async user => {
                if (user) {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
                    dispatch({ type: 'LOGIN', payload: user });
                }
            },
            logout: async () => {
                await axios.get("/api/logout");
                dispatch({ type: 'LOGOUT' });
                Router.reload();
            },
            changeTheme: async (type) => {
                const currentTheme = await getData('theme');

                if (currentTheme != type) {
                    await get(`account/change-theme?theme=${type}`);
                    await storeData('theme', type);
                }

                dispatch({ type });
            },
            changeLang: async (lang) => {
                if (router.locale != lang) {
                    await storeData('lang', lang);

                    router.replace(router.asPath, router.asPath, { locale: lang });
                }
            },
            changeUuid: async (uuid) => {
                await storeData('uuid', uuid);
                dispatch({ type: CHANGE_UUID, payload: uuid })
            },
            changeHQ: async (payload) => {
                await storeData('HQ', payload);
                dispatch({ type: TYPE_AP_SET_HQ, payload });
            },
            store,
            dispatch
        }),
        [store],
    );

    React.useEffect(() => {
        const fetchInits = async () => {
            axios.interceptors.response.use(
                (response) => {
                    return response;
                },
                async (error) => {
                    if (error.response)
                        if (error.response.status === 401) {
                            await axios.get("/api/logout");
                            dispatch({ type: 'LOGOUT' });

                            await storeData('HQ', false);
                            dispatch({ type: TYPE_AP_SET_HQ, payload: false });

                            Router.reload();
                        } else {
                            return Promise.reject(error);
                        }
                }
            );

            let uuid = await getData("uuid");

            if (!uuid) uuid = uuidv4();

            await globalContext.changeUuid(uuid);

            let audioPlayerState = await getData("audio-player-state");

            let audioPlayerStateDt = await getData("audio-player-state-dt");

            if (audioPlayerStateDt) {
                let duration = moment.duration(moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).diff(audioPlayerStateDt));

                if (audioPlayerState && duration.asMinutes() < 10)
                    dispatch({ type: TYPE_AP_RESTORE_STATE, payload: audioPlayerState });
            }

            let videoPlayerPlaylist = await getData("video-player-playlist");

            let videoPlayerPlaylistDt = await getData("video-player-playlist-dt");

            if (videoPlayerPlaylistDt) {
                let duration = moment.duration(moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).diff(videoPlayerPlaylistDt));

                if (videoPlayerPlaylist && duration.asMinutes() < 200)
                    dispatch({ type: TYPE_VP_SET_PLAYLIST, payload: videoPlayerPlaylist });
            }

            let HQ = await getData("HQ");

            await globalContext.changeHQ(HQ === null || HQ === "false" ? false : true);

            setIsLoading(false);
        }

        fetchInits();
    }, []);

    useEffect(() => {

        const asyncF = async () => {
            if (user) {
                await globalContext.changeTheme(user.theme);
            } else {
                let theme = await getData('theme');
                await globalContext.changeTheme(theme || DARK_THEME);
            }

            let lang = await getData('lang');

            if (lang)
                await globalContext.changeLang(lang);
        }

        if (user) {
            globalContext.login(user);
        }

        asyncF();
    }, [user]);

    return (
        <GlobalContext.Provider value={globalContext}>
            <ToastContainer position='bottom-center' />
            <Layout>
                {isLoading && <Preloader />}
                <Component {...pageProps} />
            </Layout>
        </GlobalContext.Provider>
    );
}

export default appWithTranslation(RizaNovaMediaApp);